import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validatePreviewRelease,buildPreviewExam,previewFingerprint} from '../shared/preview-content.mjs';
const fields={words:'vocabulary',lessons:'grammar',questions:'questions',audio:'audio',templates:'templates'};
export function createV4Service({db,root,runtime,addRecord}){
 const latest=()=>db.prepare('SELECT c.* FROM content c WHERE c.revision=(SELECT MAX(x.revision) FROM content x WHERE x.id=c.id)').all().map(r=>({...r,payload:JSON.parse(r.payload)}));
 async function release(){
  const base=JSON.parse(await readFile(path.join(root,'data/staging/v4/hsk1-release.json'),'utf8'));const live=latest().filter(r=>r.payload.editorialRelease==='v4-hsk1');
  for(const field of Object.keys(fields))base[field]=base[field].flatMap(p=>{const row=live.find(r=>r.id===p.id);if(row?.status==='ARCHIVED')return[];if(!row)return[p];const reviews=db.prepare('SELECT stage,reviewer,comment,created_at FROM content_reviews WHERE entity_id=? AND revision=?').all(row.id,row.revision);const human=reviews.some(r=>r.stage==='LANGUAGE_REVIEW')&&reviews.some(r=>r.stage==='HSK_LEVEL_REVIEW');return[{...row.payload,reviewStatus:row.status,humanReview:{status:human?'APPROVED':'BLOCKED_FOR_HUMAN_REVIEW',reviewerId:human?reviews.at(-1).reviewer:null,reviewerName:human?reviews.at(-1).reviewer:null,reviewedAt:human?reviews.at(-1).created_at:null}}];});
  return base;
 }
 async function validate(bundle){const r=validatePreviewRelease(bundle);for(const a of bundle.audio){try{const bytes=await readFile(path.join(runtime,'v4-audio',a.id+'.wav'));if(createHash('sha256').update(bytes).digest('hex')!==a.contentHash)r.errors.push('Audio checksum mismatch '+a.id);}catch{r.errors.push('Audio missing '+a.id);}}r.summary.errors=r.errors.length;return r;}
 async function handle({url,req,send,body,res}){
  if(!url.pathname.startsWith('/api/admin/v4/'))return false;const route=url.pathname.slice('/api/admin/v4/'.length);
  if(route==='stage'&&req.method==='POST'){
   const bundle=await release();const report=await validate(bundle);if(report.errors.length){send(422,{errors:report.errors});return true;}
   let added=0;db.exec('BEGIN IMMEDIATE');try{const existing=latest();for(const [field,kind]of Object.entries(fields))for(const p of bundle[field])if(!existing.some(r=>r.id===p.id&&['v4-hsk1','v5-hsk1','v6-hsk1'].includes(r.payload.editorialRelease))){addRecord(kind,{...p,editorialRelease:'v4-hsk1'});added++;}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}send(200,{added,published:0});return true;
  }
  if(route==='release'&&req.method==='GET'){
   const bundle=await release();const report=await validate(bundle);const mode=url.searchParams.get('mode')??'PREVIEW';if(!['PREVIEW','BETA'].includes(mode)){send(422,{error:'Chỉ PREVIEW hoặc BETA trên API riêng'});return true;}
   const unvalidated=Object.keys(fields).flatMap(f=>bundle[f]).some(r=>r.internalValidation?.status!=='PASSED'||r.internalReview?.status!=='AI_SELF_CHECKED');
   if(mode==='BETA'&&(report.errors.length||report.warnings.length||unvalidated)){send(422,{error:'BETA gate chưa đạt kiểm tra nội bộ',errors:report.errors,warnings:report.warnings});return true;}
   send(200,{bundle,report,mode,status:'CONTENT_PENDING_FINAL_HUMAN_REVIEW',levels:[{level:'1',technical:report.errors.length||unvalidated?'INCOMPLETE':'PREVIEW_AVAILABLE',content:'BLOCKED_FOR_HUMAN_REVIEW'},{level:'2',technical:'DATA_ONLY',content:'NOT_IN_V4_WAVE_A'},{level:'3',technical:'DATA_ONLY',content:'NOT_IN_V4_WAVE_A'}]});return true;
  }
  if(route==='level-screening'&&req.method==='GET'){send(200,JSON.parse(await readFile(path.join(root,'data/reports/v4-level-screening.json'),'utf8')));return true;}
  if(route==='build'&&req.method==='POST'){
   const input=await body(req);if(!['full','mini','drill'].includes(input.kind)||input.skill&&!['reading','listening'].includes(input.skill)||typeof input.seed!=='string'||input.seed.length>160){send(422,{error:'kind/skill/seed không hợp lệ'});return true;}
   const bundle=await release();const report=await validate(bundle);if(report.errors.length||report.warnings.length){send(422,{errors:report.errors,warnings:report.warnings});return true;}const payload=buildPreviewExam(bundle,input);send(200,{payload});return true;
  }
  if(route==='revalidate'&&req.method==='POST'){
   const {id,revision}=await body(req);const row=latest().find(r=>r.id===id&&r.payload.editorialRelease==='v4-hsk1');if(!row||row.revision!==revision||row.status==='PUBLISHED'){send(409,{error:'Revision đã thay đổi hoặc đã Published; tạo revision nháp để sửa.'});return true;}
   const bundle=await release();for(const f of Object.keys(fields))bundle[f]=bundle[f].map(p=>p.id===id?{...p,internalValidation:null}:p);const report=await validate(bundle);if(report.errors.length||report.warnings.length){send(422,{errors:report.errors,warnings:report.warnings});return true;}
   const payload={...row.payload,internalValidation:{status:'PASSED',fingerprint:previewFingerprint(row.payload),checkedAt:new Date().toISOString(),method:'Automated V4 schema/reference/answer/asset validation; no human review'}};
   db.prepare('UPDATE content SET payload=? WHERE id=? AND revision=?').run(JSON.stringify(payload),id,revision);db.prepare('INSERT INTO audit_details(actor,action,entity_id,revision,before_json,after_json,created_at) VALUES(?,?,?,?,?,?,?)').run('automated-validator','V4_INTERNAL_VALIDATION',id,revision,JSON.stringify(row.payload.internalValidation??null),JSON.stringify(payload.internalValidation),new Date().toISOString());send(200,{ok:true});return true;
  }
  if(route.startsWith('audio/')&&req.method==='GET'){
   const id=route.slice(6);if(!/^v4-audio-\d{3}$/.test(id)){send(404,{error:'Unknown preview asset'});return true;}const bundle=await release();const asset=bundle.audio.find(a=>a.id===id);if(!asset){send(404,{error:'Unknown preview asset'});return true;}
   const bytes=await readFile(path.join(runtime,'v4-audio',id+'.wav'));if(createHash('sha256').update(bytes).digest('hex')!==asset.contentHash){send(409,{error:'Audio checksum mismatch'});return true;}
   res.writeHead(200,{'Content-Type':'audio/wav','Content-Length':bytes.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(bytes);return true;
  }
  if(route==='audio-validation'&&req.method==='POST'){
   const {id,revision,durationMs}=await body(req);const row=latest().find(r=>r.id===id&&r.kind==='audio'&&r.payload.editorialRelease==='v4-hsk1');if(!row||row.revision!==revision){send(409,{error:'Revision đã đổi; tải lại'});return true;}if(!Number.isFinite(durationMs)||durationMs<1||Math.abs(durationMs-row.payload.durationMs)>100){send(422,{error:'Browser duration không khớp WAV'});return true;}
   const payload={...row.payload,mediaValidation:{...row.payload.mediaValidation,status:'BROWSER_DECODED',checkedAt:new Date().toISOString(),durationMs,method:'Web Audio decodeAudioData',humanListened:false}};db.prepare('UPDATE content SET payload=? WHERE id=? AND revision=?').run(JSON.stringify(payload),id,revision);send(200,{ok:true});return true;
  }
  send(404,{error:'NOT_FOUND'});return true;
 }
 return{handle};
}
