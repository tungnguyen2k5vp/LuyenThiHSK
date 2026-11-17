import {readFile} from 'node:fs/promises';import path from 'node:path';
import {validateV9Record} from '../shared/v9-authoring.mjs';
import {previewFingerprint} from '../shared/preview-content.mjs';
import {digest} from '../shared/v5-quality.mjs';
import {practiceAudioReadiness} from '../shared/practice-audio.mjs';
export function createV9Service({db,root,addRecord}){
 const json=async f=>JSON.parse(await readFile(path.join(root,f),'utf8'));
 const latest=()=>db.prepare('SELECT c.* FROM content c WHERE c.revision=(SELECT MAX(revision) FROM content x WHERE x.id=c.id)').all().map(r=>({...r,payload:JSON.parse(r.payload)}));
 async function staging(){return json('data/staging/v9/practice.json');}
 async function references(){const p=await staging(),levels=await Promise.all(['1','2'].map(async l=>({words:await json('public/data/hsk3-2025-'+l+'-words.json'),grammar:await json('public/data/hsk3-2025-'+l+'-grammar.json'),hanzi:await json('public/data/hsk3-2025-'+l+'-hanzi.json')})));return{words:levels.flatMap(r=>r.words),grammar:levels.flatMap(r=>r.grammar),hanzi:levels.flatMap(r=>r.hanzi),...p.refs};}
 async function practice(){const [p,v8,refs]=await Promise.all([staging(),json('data/staging/v8/hsk2-pilot.json'),references()]),live=new Map(latest().map(r=>[r.id,r]));const active=items=>items.flatMap(p=>{const r=live.get(p.id);if(!r||r.status==='ARCHIVED')return[];const q={...r.payload,reviewStatus:r.status};if(q.internalValidation?.status==='PASSED'&&q.internalValidation.fingerprint!==previewFingerprint(q))q.internalValidation={...q.internalValidation,status:'INVALIDATED'};return[q];});const questions=active([...v8.questions,...p.questions]).map(q=>{if(q.skill!=='listening')return q;const asset=live.get(q.audioAssetId),ready=practiceAudioReadiness(asset?.status==='ARCHIVED'?null:asset?.payload,q.promptZh);return{...q,practiceAudioReady:ready.available,audioReadiness:ready};});return{version:p.version,status:'PRIVATE_PRACTICE_BETA_CONTENT_PENDING_REVIEW',questions,grammarSupplement:active(p.grammarSupplement),referenceWords:refs.words,referenceGrammar:refs.grammar,topics:refs.topics,tasks:refs.tasks,officialMockAvailable:false,humanReviewed:0,published:0,audioJobs:await json('data/editorial/v9/audio-review-jobs.json')};}
 return{practice,async handle({url,req,send,body}){
  if(!url.pathname.startsWith('/api/admin/v9/'))return false;const route=url.pathname.slice('/api/admin/v9/'.length);
  if(route==='practice'&&req.method==='GET'){send(200,await practice());return true;}
  if(route==='assign'&&req.method==='POST'){
   const {items,assignee}=await body(req);if(!Array.isArray(items)||!items.length||items.length>100||new Set(items.map(i=>i?.id)).size!==items.length||items.some(i=>!i||typeof i.id!=='string'||!Number.isInteger(i.revision)||typeof i.sourceFingerprint!=='string'||typeof i.workVersion!=='string')||typeof assignee!=='string'||!assignee.trim()||assignee.length>160){send(422,{error:'1–100 exact revision/fingerprint/workVersion entries required'});return true;}
   db.exec('BEGIN IMMEDIATE');try{for(const i of items){const r=db.prepare('SELECT * FROM content WHERE id=? ORDER BY revision DESC LIMIT 1').get(i.id),work=r&&db.prepare('SELECT * FROM v5_review_work WHERE entity_id=? AND revision=?').get(i.id,r.revision);if(!r||r.status==='ARCHIVED'||r.revision!==i.revision||previewFingerprint(JSON.parse(r.payload))!==i.sourceFingerprint||digest(work??null)!==i.workVersion)throw Object.assign(Error('STALE_REVISION_OR_REVIEW_NOTES'),{status:409});}
    for(const i of items)db.prepare("INSERT INTO v5_review_work VALUES(?,?,?,?,?,?) ON CONFLICT(entity_id,revision) DO UPDATE SET assignee=excluded.assignee,updated_at=excluded.updated_at").run(i.id,i.revision,assignee.trim(),'PENDING','',new Date().toISOString());db.exec('COMMIT');
   }catch(e){db.exec('ROLLBACK');throw e;}send(200,{assigned:items.length,humanApproved:0,published:0});return true;
  }
  if(route==='quality'&&req.method==='GET'){const audit=await json('data/reports/v9/content-audit.json'),current=new Map(latest().map(r=>[r.id,r]));send(200,{...audit,resolutions:audit.resolutions.map(r=>({...r,stale:!current.has(r.id)||current.get(r.id).revision!==r.revision||previewFingerprint(current.get(r.id).payload)!==r.sourceFingerprint}))});return true;}
  if(route==='stage'&&req.method==='POST'){
   const input=await body(req);if(input.dryRun!==undefined&&typeof input.dryRun!=='boolean'){send(422,{error:'dryRun must be boolean'});return true;}
   const [p,refs]=await Promise.all([staging(),references()]),live=new Map(latest().map(r=>[r.id,r])),planned=[...p.optionBanks.map(payload=>({kind:'optionBanks',payload})),...[...p.questions,...p.grammarSupplement].map(payload=>({kind:'questions',payload}))].filter(r=>!live.has(r.payload.id));
   const errors=planned.flatMap(r=>validateV9Record(r.kind,r.payload,refs).errors.map(e=>r.payload.id+': '+e));if(errors.length){send(422,{errors,changed:0});return true;}
   const planHash=digest(planned.map(r=>[r.kind,r.payload.id,previewFingerprint(r.payload)]));if(input.dryRun!==false){send(200,{dryRun:true,planned:planned.length,planHash,changed:0,published:0});return true;}
   if(input.planHash!==planHash){send(409,{error:'STAGING_PLAN_CHANGED',changed:0});return true;}
   db.exec('BEGIN IMMEDIATE');try{for(const r of planned){const record=addRecord(r.kind,r.payload);const checked={...record,internalValidation:{status:'PASSED',fingerprint:previewFingerprint(record),checkedAt:new Date().toISOString(),method:'V9 schema/registry/reference checks and AI internal screening; no human approval'},internalReview:{status:'AI_SELF_CHECKED',method:'Original context, key and level screening; final human review pending'}};db.prepare('UPDATE content SET payload=? WHERE id=? AND revision=?').run(JSON.stringify(checked),record.id,record.revision);}db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}
   send(200,{added:planned.length,dryRun:false,humanReviewed:0,published:0});return true;
  }
  if(route==='revalidate'&&req.method==='POST'){
   const input=await body(req),row=latest().find(r=>r.id===input.id);if(!row||row.revision!==input.revision||previewFingerprint(row.payload)!==input.sourceFingerprint){send(409,{error:'STALE_REVISION_OR_CONTENT',changed:0});return true;}
   if(!['v9-hsk2-practice','v9-hsk1-supplement'].includes(row.payload.editorialRelease)||['PUBLISHED','ARCHIVED'].includes(row.status)){send(422,{error:'Private active V9 records only'});return true;}
   const errors=validateV9Record(row.kind,row.payload,await references()).errors;if(errors.length){send(422,{errors});return true;}
   const p={...row.payload,internalValidation:{status:'PASSED',fingerprint:previewFingerprint(row.payload),checkedAt:new Date().toISOString(),method:'Automated structural check only'}};db.prepare('UPDATE content SET payload=? WHERE id=? AND revision=?').run(JSON.stringify(p),row.id,row.revision);send(200,{automatedValid:true,humanReviewed:false,published:false});return true;
  }
  send(404,{error:'NOT_FOUND'});return true;
 }};
}
