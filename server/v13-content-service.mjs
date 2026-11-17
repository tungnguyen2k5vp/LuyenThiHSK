import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {digest} from '../shared/v5-quality.mjs';
import {validateV13Record,v13Signature,stampV13,v13Validation} from '../shared/v13-content.mjs';
import {vocabularyQualityQueue} from '../shared/v11-quality.mjs';
const fail=(message,status=422)=>Object.assign(Error(message),{status});
export function createV13Service({db,root,runtime,addRecord,v12}){
 const staged=async()=>JSON.parse(await readFile(path.join(root,'data/staging/v13/content.json'),'utf8'));
 const latest=id=>{const r=db.prepare('SELECT * FROM content WHERE id=? ORDER BY revision DESC LIMIT 1').get(id);return r?{...r,payload:JSON.parse(r.payload)}:null;};
 async function practice(){const [p,s]=await Promise.all([v12.practice(),staged()]);const wordDrafts=[...p.wordDrafts,...s.wordDrafts.flatMap(item=>{const row=latest(item.id);if(!row||row.status==='ARCHIVED')return[];const w={...row.payload,reviewStatus:row.status};return v13Validation(w)?[w]:[];})],map=new Map(wordDrafts.map(w=>[w.vocabularyPointId,w]));
  return {...p,version:s.version,wordDrafts,referenceWords:p.referenceWords.map(w=>map.has(w.id)?{...w,...map.get(w.id),id:w.id,editorialId:map.get(w.id).id}:w)};
 }
 return {practice,async handle({url,req,send,body}){
  if(!url.pathname.startsWith('/api/admin/v13/'))return false;const route=url.pathname.slice('/api/admin/v13/'.length);
  if(route==='practice'&&req.method==='GET'){send(200,await practice());return true;}
  if(route==='quality'&&req.method==='GET'){const p=await practice();send(200,{vocabulary:vocabularyQualityQueue(p.referenceWords,[...p.questions,...p.grammarQuestions]),questionCount:p.questions.length+p.grammarQuestions.length});return true;}
  if(route==='stage'&&req.method==='POST'){
   const i=await body(req);if(i.batch!=='VOCABULARY'||i.dryRun!==undefined&&typeof i.dryRun!=='boolean')throw fail('EXPLICIT_VOCABULARY_BATCH_REQUIRED');
   const s=await staged();if(s.records.some(r=>latest(r.payload.id)?.status==='ARCHIVED'))throw fail('ARCHIVED_ID_REQUIRES_EDITOR_REVIEW',409);const planned=s.records.filter(r=>!latest(r.payload.id)),planHash=digest(planned.map(r=>[r.kind,r.payload.id,v13Signature(r.payload)])),errors=planned.flatMap(r=>validateV13Record(r.kind,r.payload,s.refs).map(e=>r.payload.id+':'+e));
   if(errors.length){send(422,{errors,changed:0});return true;}if(i.dryRun!==false){send(200,{planned:planned.length,planHash,changed:0});return true;}if(i.planHash!==planHash)throw fail('STAGING_PLAN_CHANGED',409);
   if(planned.length){await mkdir(path.join(runtime,'backups'),{recursive:true});db.prepare('VACUUM INTO ?').run(path.join(runtime,'backups','v13-vocabulary-'+Date.now()+'.sqlite'));}
   db.exec('BEGIN IMMEDIATE');try{for(const r of planned){if(latest(r.payload.id))throw fail('STAGING_PLAN_CHANGED',409);const p=addRecord(r.kind,r.payload),post=validateV13Record(r.kind,p,s.refs);if(post.length)throw fail('DECORATED_RECORD_INVALID:'+post.join(';'));db.prepare('UPDATE content SET payload=? WHERE id=? AND revision=?').run(JSON.stringify(stampV13(p)),p.id,p.revision);}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
   send(200,{added:planned.length,humanReviewed:0,published:0});return true;
  }
  if(route==='validation-state'&&req.method==='GET'){const r=latest(url.searchParams.get('id'));if(!r||r.payload.editorialRelease!=='v13-hsk2')throw fail('UNKNOWN_V13_CONTENT',404);send(200,{id:r.id,revision:r.revision,contentSignature:v13Signature(r.payload),supported:true});return true;}
  if(route==='revalidate'&&req.method==='POST'){const i=await body(req),r=latest(i.id);if(!r||r.status==='ARCHIVED'||r.payload.editorialRelease!=='v13-hsk2'||r.revision!==i.revision||v13Signature(r.payload)!==i.contentSignature)throw fail('STALE_CONTENT_SIGNATURE',409);const errors=validateV13Record(r.kind,r.payload,(await staged()).refs);if(errors.length){send(422,{errors});return true;}db.prepare('UPDATE content SET payload=? WHERE id=? AND revision=?').run(JSON.stringify(stampV13(r.payload)),r.id,r.revision);send(200,{automatedValid:true,humanReviewed:false,published:false});return true;}
  // Full Mock and media still pass the current strict V12 gates without new aliases.
  send(404,{error:'NOT_FOUND'});return true;
 }};
}
