import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {digest} from '../shared/v5-quality.mjs';
import {v11Validation,v11Signature,validateV11Record,stampV11} from '../shared/v11-content.mjs';
import {mediaRightsMatrix,vocabularyQualityQueue,v11MockReadiness,partQuality} from '../shared/v11-quality.mjs';
import {buildHsk2PlatformMock} from '../shared/v10-mock.mjs';
const fail=(message,status=422)=>Object.assign(Error(message),{status});
export function createV11Service({db,root,runtime,addRecord,v10,reviewers=[]}){
 const staged=async()=>JSON.parse(await readFile(path.join(root,'data/staging/v11/content.json'),'utf8'));
 const rows=()=>db.prepare("SELECT c.* FROM content c WHERE c.revision=(SELECT MAX(x.revision) FROM content x WHERE x.id=c.id) AND c.status!='ARCHIVED'").all().map(r=>({...r,payload:JSON.parse(r.payload)}));
 const latest=id=>{const r=db.prepare('SELECT * FROM content WHERE id=? ORDER BY revision DESC LIMIT 1').get(id);return r?{...r,payload:JSON.parse(r.payload)}:null;};
 async function practice(){const [p,s]=await Promise.all([v10.practice(),staged()]),live=new Map(rows().map(r=>[r.id,r]));
  const active=items=>items.flatMap(item=>{const r=live.get(item.id);if(!r)return[];const q={...r.payload,reviewStatus:r.status};if(!v11Validation(q))q.internalValidation={...q.internalValidation,status:'INVALIDATED'};return[q];});
  const reviews=db.prepare('SELECT * FROM content_reviews').all(),trusted=(q,stage)=>reviews.some(r=>r.entity_id===q.id&&r.revision===q.revision&&r.stage===stage&&reviewers.some(p=>p.id===r.reviewer&&p.stages?.includes(stage)&&/^[a-f0-9]{64}$/.test(p.credentialHash??'')));
  const questions=p.questions.map(q=>({...q,languageHumanReviewed:trusted(q,'LANGUAGE_REVIEW'),levelHumanReviewed:trusted(q,'HSK_LEVEL_REVIEW')})),wordDrafts=[...p.wordDrafts,...active(s.wordDrafts)],enriched=new Map(wordDrafts.map(w=>[w.vocabularyPointId,w]));
  return{...p,version:s.version,questions,grammarQuestions:[...p.grammarQuestions,...active(s.grammarQuestions)],lessonDrafts:[...p.lessonDrafts,...active(s.lessons)],wordDrafts,referenceWords:p.referenceWords.map(w=>{const d=enriched.get(w.id);return d?{...w,...d,id:w.id,editorialId:d.id}:w;}),audioJobs:p.audioJobs.map(j=>({...j,audioPurpose:j.asset?.audioPurpose??'PRACTICE',transcriptRevision:j.asset?.transcriptRevision??{questionId:j.questionId,revision:j.questionRevision,sha256:digest(j.transcript)},generationParameters:j.asset?.generationParameters??null,publicationEligible:false}))};
 }
 return{practice,async handle({url,req,send,body}){
  if(!url.pathname.startsWith('/api/admin/v11/'))return false;const route=url.pathname.slice('/api/admin/v11/'.length);
  if(route==='practice'&&req.method==='GET'){send(200,await practice());return true;}
  if(route==='stage'&&req.method==='POST'){const i=await body(req);if(!['GRAMMAR','VOCABULARY'].includes(i.batch)||i.dryRun!==undefined&&typeof i.dryRun!=='boolean')throw fail('EXPLICIT_BATCH_AND_DRY_RUN_REQUIRED');const s=await staged(),all=new Set(rows().map(r=>r.id)),planned=s.records.filter(r=>r.batch===i.batch&&!all.has(r.payload.id)),existingIds=new Set(db.prepare('SELECT DISTINCT id FROM content').all().map(r=>r.id));if(planned.some(r=>existingIds.has(r.payload.id)))throw fail('ARCHIVED_OR_EXISTING_ID_REQUIRES_EDITOR_REVISION',409);const errors=planned.flatMap(r=>validateV11Record(r.kind,r.payload,s.refs).map(e=>r.payload.id+': '+e)),planHash=digest(planned.map(r=>[r.kind,r.payload.id,v11Signature(r.payload)]));if(errors.length){send(422,{errors,changed:0});return true;}if(i.dryRun!==false){send(200,{planned:planned.length,planHash,changed:0});return true;}if(i.planHash!==planHash)throw fail('STAGING_PLAN_CHANGED',409);
   if(planned.length){await mkdir(path.join(runtime,'backups'),{recursive:true});db.prepare('VACUUM INTO ?').run(path.join(runtime,'backups','v11-'+i.batch+'-'+Date.now()+'.sqlite'));}
   db.exec('BEGIN IMMEDIATE');try{for(const r of planned){const created=addRecord(r.kind,r.payload),postErrors=validateV11Record(r.kind,created,s.refs);if(postErrors.length)throw fail('DECORATED_RECORD_INVALID: '+postErrors.join(';'));const p=stampV11(created);db.prepare('UPDATE content SET payload=? WHERE id=? AND revision=?').run(JSON.stringify(p),p.id,p.revision);}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}send(200,{added:planned.length,humanReviewed:0,published:0});return true;
  }
  if(route==='validation-state'&&req.method==='GET'){const r=latest(url.searchParams.get('id'));if(!r||r.payload.editorialRelease!=='v11-hsk2')throw fail('UNKNOWN_V11_CONTENT',404);send(200,{id:r.id,revision:r.revision,contentSignature:v11Signature(r.payload),supported:true});return true;}
  if(route==='revalidate'&&req.method==='POST'){const i=await body(req),r=latest(i.id);if(!r||r.payload.editorialRelease!=='v11-hsk2'||r.status==='ARCHIVED'||r.revision!==i.revision||v11Signature(r.payload)!==i.contentSignature)throw fail('STALE_CONTENT_SIGNATURE',409);const errors=validateV11Record(r.kind,r.payload,(await staged()).refs);if(errors.length){send(422,{errors});return true;}const p=stampV11(r.payload);db.prepare('UPDATE content SET payload=? WHERE id=? AND revision=?').run(JSON.stringify(p),p.id,p.revision);send(200,{automatedValid:true,humanReviewed:false});return true;}
  if(route==='media-rights'&&req.method==='GET'){const p=await practice(),all=rows(),questions=all.filter(r=>r.kind==='questions').map(r=>r.payload);send(200,{assets:mediaRightsMatrix(p.assets,questions),scope:'Live current assets; rights private-use review is separate from production publication'});return true;}
  if(route==='quality'&&req.method==='GET'){const p=await practice();send(200,{vocabulary:vocabularyQualityQueue(p.referenceWords,[...p.questions,...p.grammarQuestions]),parts:partQuality(p.questions)});return true;}
  if(route==='mock-readiness'&&req.method==='GET'){const p=await practice();send(200,v11MockReadiness(p.questions,{assets:p.assets}));return true;}
  if(route==='build'&&req.method==='POST'){const i=await body(req);if(i.kind!=='full'||i.mode!=='PREVIEW'||typeof i.seed!=='string'||!i.seed.trim()||i.seed.length>160)throw fail('PRIVATE_FULL_MOCK_SEED_REQUIRED');const p=await practice(),readiness=v11MockReadiness(p.questions,{assets:p.assets,seed:i.seed});if(!readiness.capabilities.canLaunchPrivatePractice){send(409,{error:'HSK2_FULL_MOCK_NOT_READY',readiness});return true;}send(200,{payload:buildHsk2PlatformMock(p.questions,{assets:p.assets,seed:i.seed})});return true;}
  send(404,{error:'NOT_FOUND'});return true;
 }};
}
