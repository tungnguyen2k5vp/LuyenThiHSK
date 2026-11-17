import {readFile,mkdir} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {z} from 'zod';
import {generateHskQuestions} from './hsk-question-generator.mjs';
import {MODULE,standards,levels,idSchema,sourceSchema,questionSchema,sha256,fingerprint,answerKey,similarity,parseCsv,candidateQuestion,gradeQuestions} from '../shared/hsk-bank.mjs';

const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const parse=(schema,input)=>{const result=schema.safeParse(input);if(!result.success)fail(422,result.error.issues.map(i=>i.path.join('.')+': '+i.message).join('; ').slice(0,2000));return result.data;};
const batchSchema=z.object({source:sourceSchema,questions:z.array(z.unknown()).min(1).max(500),dryRun:z.boolean().default(true)}).strict();
const examSchema=z.object({title:z.string().trim().min(5).max(180),standardId:z.enum(standards),level:z.enum(levels),durationMinutes:z.number().int().min(1).max(240),questionIds:z.array(idSchema).min(1).max(100),description:z.string().trim().min(10).max(1500)}).strict();
const paging=url=>parse(z.object({offset:z.coerce.number().int().min(0).max(100000),limit:z.coerce.number().int().min(1).max(100)}),{offset:url.searchParams.get('offset')??0,limit:url.searchParams.get('limit')??20});
const json=JSON.parse;

export async function createHskExamService({db,root,runtime,addRecord,authorized,now=()=>Date.now(),resolveAccount,seed=true}){
 const hasMigration=db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='hsk_exam_migrations'").get();
 if(!hasMigration){
  const file=db.prepare('PRAGMA database_list').get().file;
  if(file){const directory=path.join(runtime,'backups','hsk-exam-mvp-'+now());await mkdir(directory,{recursive:true});db.prepare('VACUUM INTO ?').run(path.join(directory,'hsk-content.sqlite'));}
  db.exec('BEGIN IMMEDIATE');
  try{db.exec(await readFile(new URL('./migrations/001_hsk_exam.sql',import.meta.url),'utf8'));db.exec('CREATE TABLE hsk_exam_migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)');db.prepare('INSERT INTO hsk_exam_migrations VALUES(1,?)').run(new Date(now()).toISOString());db.exec('COMMIT');}catch(error){db.exec('ROLLBACK');throw error;}
 }
 for(const [id,name] of [['hsk2-2015','HSK 2.0 · 2015'],['hsk3-2021','HSK 3.0 · GF0025-2021'],['hsk3-2025','HSK 3.0 · đề cương 2025']])db.prepare('INSERT OR IGNORE INTO hsk_exam_standards VALUES(?,?,?,?,?)').run(id,name,JSON.stringify(id==='hsk2-2015'?levels.slice(0,6):levels),JSON.stringify({practiceScoring:'RAW_POINTS',officialScale:null,passThreshold:null,fullMock:'REQUIRES_VERIFIED_BLUEPRINT_AND_REVIEWED_MEDIA'}),'https://www.chinesetest.cn/');
 const latest=id=>db.prepare('SELECT * FROM content WHERE id=? ORDER BY revision DESC LIMIT 1').get(id);
 const stamp=()=>new Date(now()).toISOString();
 const audit=(action,id,revision,after)=>db.prepare('INSERT INTO audit_details(actor,action,entity_id,revision,after_json,created_at) VALUES(?,?,?,?,?,?)').run('local-admin',action,id,revision,JSON.stringify(after),stamp());
 const questions=()=>db.prepare('SELECT c.* FROM hsk_question_registry r JOIN content c ON c.id=r.id AND c.revision=r.revision').all().map(r=>({...json(r.payload),reviewStatus:r.status,revision:r.revision}));
 const exams=()=>db.prepare("SELECT c.* FROM content c WHERE c.kind='exams' AND json_extract(c.payload,'$.examModule')=? AND c.revision=(SELECT MAX(x.revision) FROM content x WHERE x.id=c.id)").all(MODULE).map(r=>({...json(r.payload),reviewStatus:r.status,revision:r.revision}));
 const source=id=>{const row=db.prepare('SELECT payload FROM hsk_content_sources WHERE id=?').get(id);return row?json(row.payload):null;};
 const verifiedAudio=new Set();
 function mediaIssues(q,s){
  if(s.id==='hsk-no7z-cc-by-sa'&&q.syllabusVersion!=='hsk3-2021')return ['NO7Z_IS_GF2021_NOT_2025'];
  if(!q.audio||verifiedAudio.has(q.audio.sha256))return [];
  try{const bytes=readFileSync(path.join(root,'public',q.audio.src.slice(1)));if(sha256(bytes)!==q.audio.sha256)return ['AUDIO_CHECKSUM_MISMATCH'];verifiedAudio.add(q.audio.sha256);return [];}catch{return ['AUDIO_FILE_MISSING'];}
 }
 function putSource(value){const input=parse(sourceSchema,value),old=source(input.id);if(old&&JSON.stringify(old)!==JSON.stringify(input))fail(409,'SOURCE_METADATA_CONFLICT');if(!old)db.prepare('INSERT INTO hsk_content_sources VALUES(?,?,?)').run(input.id,JSON.stringify(input),stamp());return input;}
 function saveQuestion(q,s,expectedRevision){
  const invalidMedia=mediaIssues(q,s);if(invalidMedia.length)fail(422,invalidMedia.join('; '));
  const old=latest(q.id);if(old&&(json(old.payload).examModule!==MODULE||old.kind!=='questions'))fail(409,'ID_BELONGS_TO_EXISTING_CONTENT');
  if(old&&old.revision!==expectedRevision)fail(409,'QUESTION_REVISION_CONFLICT');
  const payload=addRecord('questions',{...q,number:1,part:1,examModule:MODULE,sourceId:s.id,source:s.name,sourceUrl:s.url,sourceType:s.rightsStatus==='ORIGINAL'?'AI_GENERATED':'LICENSED',license:s.license,technicalValidation:{schema:'PASSED',semantics:'HUMAN_REVIEW_REQUIRED'},humanReview:{status:'PENDING'},answerVerified:false,contentEnvironment:'PREVIEW',provenance:{source_name:s.name,source_url:s.url,source_version:q.syllabusVersion,retrieved_at:stamp().slice(0,10),license:s.license,rights_status:s.rightsStatus==='ORIGINAL'?'original':'open_license_verified',is_original:s.rightsStatus==='ORIGINAL',attribution:s.attribution}});
  payload.reviewStatus='NEEDS_REVIEW';db.prepare('UPDATE content SET status=?,payload=? WHERE id=? AND revision=?').run('NEEDS_REVIEW',JSON.stringify(payload),q.id,payload.revision);
  db.prepare('INSERT INTO hsk_question_registry VALUES(?,?,?,?,?,?,?,0) ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,source_id=excluded.source_id,standard_id=excluded.standard_id,level=excluded.level,skill=excluded.skill,fingerprint=excluded.fingerprint,quality_score=0').run(q.id,payload.revision,s.id,q.syllabusVersion,q.level,q.skill,fingerprint(q));
  return payload;
 }
 function importBatch(value){
  const input=parse(batchSchema,value),s=parse(sourceSchema,input.source),checksum=sha256(JSON.stringify({source:s,questions:input.questions})),prior=db.prepare('SELECT report_json FROM hsk_import_jobs WHERE checksum=?').get(checksum);
  if(prior&&!input.dryRun)return {...json(prior.report_json),replayed:true};
  const report={id:'import-'+randomBytes(12).toString('hex'),read:input.questions.length,accepted:0,duplicates:[],nearDuplicates:[],errors:[],dryRun:input.dryRun,checksum},accepted=[],seen=new Map(),existing=questions();
  for(let i=0;i<input.questions.length;i++){
   const result=questionSchema.safeParse(input.questions[i]);if(!result.success){report.errors.push({row:i+1,errors:result.error.issues.map(e=>e.message)});continue;}
   const invalidMedia=mediaIssues(result.data,s);if(invalidMedia.length){report.errors.push({row:i+1,errors:invalidMedia});continue;}
   const q=result.data,key=fingerprint(q),same=seen.get(key)??existing.find(e=>fingerprint(e)===key);
   if(same){if(answerKey(same)!==answerKey(q))report.errors.push({row:i+1,errors:['ANSWER_CONFLICT_WITH_DUPLICATE'],existingId:same.id});else report.duplicates.push({candidateId:q.id,existingId:same.id,similarity:1,resolution:'LINK_ONLY'});continue;}
   if(latest(q.id)||accepted.some(a=>a.id===q.id)){report.errors.push({row:i+1,errors:['ID_EXISTS_USE_EDIT_ENDPOINT']});continue;}
   for(const old of [...existing,...accepted].filter(e=>e.syllabusVersion===q.syllabusVersion&&e.level===q.level&&e.skill===q.skill)){const score=similarity(old.audio?.transcript??(old.contextZh??'')+old.promptZh,q.audio?.transcript??(q.contextZh??'')+q.promptZh);if(score>=.88)report.nearDuplicates.push({candidateId:q.id,existingId:old.id,similarity:score,resolution:'HUMAN_REVIEW_REQUIRED'});}
   seen.set(key,q);accepted.push(q);
  }
  report.accepted=accepted.length;
  if(!input.dryRun){db.exec('BEGIN IMMEDIATE');try{putSource(s);for(const q of accepted)saveQuestion(q,s);db.prepare('INSERT INTO hsk_import_jobs VALUES(?,?,?,?,?,?)').run(report.id,s.id,checksum,JSON.stringify(input.questions),JSON.stringify(report),stamp());for(const d of [...report.duplicates,...report.nearDuplicates])db.prepare('INSERT INTO hsk_duplicate_log(job_id,candidate_id,existing_id,similarity,resolution,created_at) VALUES(?,?,?,?,?,?)').run(report.id,d.candidateId,d.existingId,d.similarity,d.resolution,stamp());audit('HSK_IMPORT',report.id,0,{accepted:report.accepted,errors:report.errors.length});db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}}
  return report;
 }
 const canonical=q=>Object.fromEntries(Object.keys(questionSchema.shape??{}).map(k=>[k,q[k]]));
 // superRefine retains the object shape in Zod 4; exported rows exclude editorial/runtime fields.
 const exportQuestion=q=>parse(questionSchema,canonical(q));
 function createExam(value,{sample=false,id}={}){
  const input=parse(examSchema,value);if(new Set(input.questionIds).size!==input.questionIds.length)fail(422,'DUPLICATE_EXAM_QUESTION');
  const byId=new Map(questions().map(q=>[q.id,q])),rows=input.questionIds.map(qid=>byId.get(qid));
  if(rows.some(q=>!q||q.syllabusVersion!==input.standardId||q.level!==input.level))fail(422,'EXAM_STANDARD_LEVEL_MISMATCH');
  const exam=addRecord('exams',{id:id??'hskbank-exam-'+randomBytes(10).toString('hex'),examModule:MODULE,...input,syllabusVersion:input.standardId,level:input.level,source:sample?'Bài mẫu kỹ thuật HSK Journey':'Biên soạn HSK Journey',sourceType:'AI_GENERATED',sourceUrl:'local:hsk-exam',license:rows.some(q=>q.license==='CC BY-SA 4.0')?'CC BY-SA 4.0':'LicenseRef-Project-Original',sample,mode:'mini',mockType:'mini',formatAuthority:'PLATFORM_PRACTICE',durationKind:'custom',reviewStatus:'NEEDS_REVIEW',gradingPolicy:'PRACTICE_RAW_POINTS',questions:rows.map((q,i)=>({...q,number:i+1})),totalQuestions:rows.length,lockedQuestions:rows.map(q=>({id:q.id,revision:q.revision}))});
  audit('HSK_EXAM_CREATED',exam.id,exam.revision,{sample,questionCount:rows.length});return exam;
 }
 function reviewQuestion(id,input){
  const value=parse(z.object({revision:z.number().int().positive(),decision:z.enum(['approve','reject','publish']),reviewer:z.string().trim().min(2).max(100),comment:z.string().trim().min(10).max(2000),answerVerified:z.boolean().optional(),languageVerified:z.boolean().optional(),levelVerified:z.boolean().optional(),mediaVerified:z.boolean().optional()}).strict(),input),row=latest(id);
  if(!row||row.kind!=='questions'||json(row.payload).examModule!==MODULE)fail(404,'QUESTION_NOT_FOUND');if(row.revision!==value.revision)fail(409,'QUESTION_REVISION_CONFLICT');
  const q=json(row.payload),s=parse(sourceSchema,source(q.sourceId));
  if(value.decision==='approve'&&!(value.answerVerified&&value.languageVerified&&value.levelVerified&&(!q.audio&&!q.image&&!q.options.some(o=>o.image)||value.mediaVerified)))fail(422,'CONFIRM_LANGUAGE_LEVEL_KEY_AND_MEDIA');
  if(value.decision==='publish'&&(row.status!=='APPROVED'||!db.prepare("SELECT 1 FROM content_reviews WHERE entity_id=? AND revision=? AND stage='HSK_SERVER_APPROVED'").get(id,row.revision)))fail(422,'REVIEW_CURRENT_REVISION_FIRST');
  exportQuestion(q);const status=value.decision==='reject'?'ARCHIVED':value.decision==='approve'?'APPROVED':'PUBLISHED';
  q.reviewStatus=status;q.answerVerified=status!=='ARCHIVED';q.humanReview={status,reviewer:value.reviewer,comment:value.comment,at:stamp()};q.contentEnvironment=status==='PUBLISHED'?'PRODUCTION':'PREVIEW';q.qualityScore=status==='ARCHIVED'?0:100;
  db.exec('BEGIN IMMEDIATE');try{db.prepare('UPDATE content SET status=?,payload=?,updated_at=? WHERE id=? AND revision=?').run(status,JSON.stringify(q),stamp(),id,row.revision);db.prepare('UPDATE hsk_question_registry SET quality_score=? WHERE id=?').run(q.qualityScore,id);db.prepare('INSERT INTO content_reviews(entity_id,revision,stage,reviewer,comment,created_at) VALUES(?,?,?,?,?,?)').run(id,row.revision,'HSK_SERVER_'+status,value.reviewer,value.comment,stamp());audit('HSK_'+status,id,row.revision,{source:s.id,reviewer:value.reviewer,comment:value.comment});db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}return q;
 }
 function publishExam(id,input){
  const value=parse(z.object({revision:z.number().int().positive(),reviewer:z.string().trim().min(2).max(100),comment:z.string().trim().min(10).max(2000)}).strict(),input),row=latest(id);
  if(!row||row.kind!=='exams'||json(row.payload).examModule!==MODULE)fail(404,'EXAM_NOT_FOUND');if(row.revision!==value.revision)fail(409,'EXAM_REVISION_CONFLICT');const e=json(row.payload);
  for(const lock of e.lockedQuestions){const q=latest(lock.id);if(!q||q.revision!==lock.revision||q.status!=='PUBLISHED'||!db.prepare("SELECT 1 FROM content_reviews WHERE entity_id=? AND revision=? AND stage='HSK_SERVER_PUBLISHED'").get(lock.id,lock.revision))fail(422,'ALL_CURRENT_QUESTIONS_MUST_BE_REVIEWED_AND_PUBLISHED');parse(sourceSchema,source(json(q.payload).sourceId));}
  e.sample=false;e.reviewStatus='PUBLISHED';e.humanReview={reviewer:value.reviewer,comment:value.comment,at:stamp()};db.prepare('UPDATE content SET status=?,payload=?,updated_at=? WHERE id=? AND revision=?').run('PUBLISHED',JSON.stringify(e),stamp(),id,e.revision);audit('HSK_EXAM_PUBLISHED',id,e.revision,e.humanReview);return e;
 }
 const playable=e=>e&&(e.sample||e.reviewStatus==='PUBLISHED'&&e.lockedQuestions.every(lock=>{const q=latest(lock.id);return q?.revision===lock.revision&&q.status==='PUBLISHED';}));
 const examMeta=e=>({id:e.id,revision:e.revision,title:e.title,standardId:e.syllabusVersion,level:e.level,durationMinutes:e.durationMinutes,description:e.description,totalQuestions:e.totalQuestions,sample:Boolean(e.sample),reviewStatus:e.reviewStatus,skills:[...new Set(e.questions.map(q=>q.skill))],difficulty:[...new Set(e.questions.map(q=>q.difficulty))],sections:['listening','reading','writing'].flatMap(skill=>{const count=e.questions.filter(q=>q.skill===skill).length;return count?[{skill,count}]:[];}),gradingPolicy:e.gradingPolicy,officialScore:null,passThreshold:null,notice:e.sample?'Bài mẫu kỹ thuật · chưa duyệt chuyên môn; không phải đề HSK chính thức.':'Bài luyện được biên soạn · không quy đổi điểm thi chính thức.'});
 async function owner(req,res){
  if((req.headers.cookie??'').split(';').some(c=>c.trim().startsWith('hsk_session='))){
   const user=resolveAccount?await resolveAccount(req):await fetch('http://127.0.0.1:8788/api/account/me',{headers:{Cookie:req.headers.cookie},signal:AbortSignal.timeout(5000)}).then(async r=>{if(!r.ok)fail(r.status===503?503:401,'ACCOUNT_SESSION_UNAVAILABLE');return (await r.json()).user;});
   if(!user?.id)fail(401,'SIGN_IN_REQUIRED');return 'account:'+user.id;
  }
  const existing=(req.headers.cookie??'').split(';').map(c=>c.trim()).find(c=>c.startsWith('hsk_exam_guest='))?.slice(15);
  if(existing&&/^[a-f0-9]{64}$/.test(existing))return 'guest:'+sha256(existing);
  const token=randomBytes(32).toString('hex');res.setHeader('Set-Cookie','hsk_exam_guest='+token+'; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000');return 'guest:'+sha256(token);
 }
 const attemptRow=(id,ownerId)=>{const row=db.prepare('SELECT * FROM hsk_exam_attempts WHERE id=? AND owner_id=?').get(id,ownerId);if(!row)fail(404,'ATTEMPT_NOT_FOUND');return row;};
 const answerRows=id=>db.prepare('SELECT question_id,answer,flagged FROM hsk_attempt_answers WHERE attempt_id=?').all(id);
 function finish(row,reason='USER_SUBMITTED'){
  if(row.status==='SUBMITTED')return row;const snapshot=json(row.snapshot_json),answers=Object.fromEntries(answerRows(row.id).map(a=>[a.question_id,a.answer])),end=Math.min(now(),row.deadline),result={...gradeQuestions(snapshot.questions,answers),exam:examMeta(snapshot),attemptId:row.id,reason,durationSeconds:Math.max(0,Math.floor((end-row.started_at)/1000)),submittedAt:new Date(end).toISOString()};
  db.prepare("UPDATE hsk_exam_attempts SET status='SUBMITTED',submitted_at=?,result_json=?,revision=revision+1 WHERE id=? AND status='ACTIVE'").run(end,JSON.stringify(result),row.id);db.prepare('INSERT INTO hsk_attempt_events(attempt_id,action,payload,created_at) VALUES(?,?,?,?)').run(row.id,'SUBMITTED',JSON.stringify({reason,score:result.score}),now());return db.prepare('SELECT * FROM hsk_exam_attempts WHERE id=?').get(row.id);
 }
 function sweepExpired(){for(const row of db.prepare("SELECT * FROM hsk_exam_attempts WHERE status='ACTIVE' AND deadline<=? LIMIT 500").all(now()))finish(row,'TIME_EXPIRED');}
 function getAttempt(id,ownerId){let row=attemptRow(id,ownerId);if(row.status==='ACTIVE'&&row.deadline<=now())row=finish(row,'TIME_EXPIRED');const snapshot=json(row.snapshot_json),answers=answerRows(id);return {id:row.id,exam:examMeta(snapshot),status:row.status,revision:row.revision,currentIndex:row.current_index,startedAt:row.started_at,deadline:row.deadline,serverNow:now(),answers:Object.fromEntries(answers.map(a=>[a.question_id,a.answer])),flags:answers.filter(a=>a.flagged).map(a=>a.question_id),questions:row.status==='ACTIVE'?snapshot.questions.map(candidateQuestion):[],ownerKind:ownerId.startsWith('account:')?'account':'guest'};}
 function start(examId,ownerId,input){
  const {idempotencyKey}=parse(z.object({idempotencyKey:z.string().uuid()}).strict(),input),old=db.prepare('SELECT id,exam_id FROM hsk_exam_attempts WHERE owner_id=? AND start_key=?').get(ownerId,idempotencyKey);
  if(old){if(old.exam_id!==examId)fail(409,'IDEMPOTENCY_KEY_REUSED');return getAttempt(old.id,ownerId);}
  const e=exams().find(e=>e.id===examId);if(!playable(e))fail(404,'EXAM_NOT_AVAILABLE');
  const id='attempt-'+randomBytes(16).toString('hex'),started=now();db.prepare('INSERT INTO hsk_exam_attempts(id,owner_id,exam_id,exam_revision,snapshot_json,status,started_at,deadline,start_key) VALUES(?,?,?,?,?,?,?,?,?)').run(id,ownerId,e.id,e.revision,JSON.stringify(e),'ACTIVE',started,started+e.durationMinutes*60000,idempotencyKey);return getAttempt(id,ownerId);
 }
 function saveAnswers(id,ownerId,input){
  const value=parse(z.object({expectedRevision:z.number().int().min(0),currentIndex:z.number().int().min(0).optional(),answers:z.array(z.object({questionId:idSchema,answer:z.string().max(12000).optional(),flagged:z.boolean().optional()}).strict()).max(100)}).strict(),input);
  db.exec('BEGIN IMMEDIATE');try{
   const row=attemptRow(id,ownerId);if(row.status!=='ACTIVE')fail(409,'ATTEMPT_ALREADY_SUBMITTED');if(row.deadline<=now()){finish(row,'TIME_EXPIRED');db.exec('COMMIT');fail(410,'ATTEMPT_EXPIRED');}if(row.revision!==value.expectedRevision)fail(409,'ATTEMPT_REVISION_CONFLICT');
   const snapshot=json(row.snapshot_json),questionsById=new Map(snapshot.questions.map(q=>[q.id,q]));if(value.currentIndex!==undefined&&value.currentIndex>=snapshot.questions.length)fail(422,'INVALID_QUESTION_INDEX');
   for(const entry of value.answers){const q=questionsById.get(entry.questionId);if(!q)fail(422,'QUESTION_NOT_IN_ATTEMPT');if(entry.answer&&q.scoring==='choice'&&!q.options.some(o=>o.id===entry.answer))fail(422,'INVALID_ANSWER_OPTION');const previous=db.prepare('SELECT * FROM hsk_attempt_answers WHERE attempt_id=? AND question_id=?').get(id,q.id);db.prepare('INSERT INTO hsk_attempt_answers VALUES(?,?,?,?,?) ON CONFLICT(attempt_id,question_id) DO UPDATE SET answer=excluded.answer,flagged=excluded.flagged,updated_at=excluded.updated_at').run(id,q.id,entry.answer??previous?.answer??'',entry.flagged===undefined?previous?.flagged??0:Number(entry.flagged),now());}
   db.prepare('UPDATE hsk_exam_attempts SET revision=revision+1,current_index=? WHERE id=?').run(value.currentIndex??row.current_index,id);db.exec('COMMIT');return getAttempt(id,ownerId);
  }catch(error){if(db.isTransaction)db.exec('ROLLBACK');throw error;}
 }
 function submit(id,ownerId,input){const value=parse(z.object({expectedRevision:z.number().int().min(0)}).strict(),input);db.exec('BEGIN IMMEDIATE');try{const row=attemptRow(id,ownerId);if(row.status==='ACTIVE'&&row.deadline>now()&&row.revision!==value.expectedRevision)fail(409,'ATTEMPT_REVISION_CONFLICT');finish(row,row.deadline<=now()?'TIME_EXPIRED':'USER_SUBMITTED');db.exec('COMMIT');return getAttempt(id,ownerId);}catch(e){if(db.isTransaction)db.exec('ROLLBACK');throw e;}}

 async function handle({url,req,res,send,body}){
  if(!url.pathname.startsWith('/api/hsk/'))return false;
  const route=url.pathname.slice('/api/hsk/'.length),method=req.method;
  if(!['GET','POST','PATCH'].includes(method)){send(405,{error:'METHOD_NOT_ALLOWED'});return true;}
  if(method!=='GET'&&!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(req.headers.origin??''))fail(403,'ORIGIN_REQUIRED');
  if(route.startsWith('admin/')){
   if(!authorized(req))fail(401,'ADMIN_TOKEN_REQUIRED');
   if(route==='admin/vocabulary'&&method==='GET'){const {offset,limit}=paging(url),all=json(await readFile(path.join(root,'public/data/fourchinese/words.json'),'utf8')),level=url.searchParams.get('level')??'1',query=(url.searchParams.get('q')??'').toLowerCase(),rows=all.filter(w=>w.syllabusLevels.includes(level)&&(!query||[w.simplified,w.pinyin,w.primaryMeaningVi].join(' ').toLowerCase().includes(query)));send(200,{total:rows.length,items:rows.slice(offset,offset+limit).map(w=>({id:w.id,simplified:w.simplified,pinyin:w.pinyin,meaningVi:w.primaryMeaningVi,examples:w.examples.length}))});return true;}
   if(route==='admin/questions/generate'&&method==='POST'){let generation;try{generation=await generateHskQuestions({root,input:await body(req)});}catch(error){if(error instanceof z.ZodError)fail(422,'INVALID_GENERATION_INPUT_OR_OUTPUT');throw error;}const report=importBatch({source:source('hsk-project-original'),questions:generation.questions,dryRun:false});send(200,{generation,report});return true;}
   if(route==='admin/overview'&&method==='GET'){send(200,{questions:questions().length,exams:exams().map(examMeta),sources:db.prepare('SELECT payload,checked_at FROM hsk_content_sources').all().map(r=>({...json(r.payload),checkedAt:r.checked_at})),jobs:db.prepare('SELECT id,report_json,created_at FROM hsk_import_jobs ORDER BY created_at DESC LIMIT 20').all().map(r=>({id:r.id,report:json(r.report_json),createdAt:r.created_at})),duplicates:db.prepare('SELECT * FROM hsk_duplicate_log ORDER BY id DESC LIMIT 100').all()});return true;}
   if(route==='admin/questions/import'&&method==='POST'){const value=await body(req);if(value.csv!==undefined){const {csv,...rest}=value;send(200,importBatch({...rest,questions:parseCsv(csv)}));}else send(200,importBatch(value));return true;}
   if(route==='admin/questions'&&method==='GET'){const {offset,limit}=paging(url),rows=questions().filter(q=>(!url.searchParams.get('status')||q.reviewStatus===url.searchParams.get('status'))&&(!url.searchParams.get('standard')||q.syllabusVersion===url.searchParams.get('standard'))&&(!url.searchParams.get('level')||q.level===url.searchParams.get('level'))&&(!url.searchParams.get('q')||[q.promptZh,q.id,q.explanation].join(' ').toLowerCase().includes(url.searchParams.get('q').toLowerCase())));send(200,{total:rows.length,items:rows.slice(offset,offset+limit)});return true;}
   if(route==='admin/questions/export'&&method==='GET'){const sources=db.prepare('SELECT payload FROM hsk_content_sources').all().map(r=>json(r.payload)),rows=questions();send(200,{sources,batches:sources.map(source=>({source,questions:rows.filter(q=>q.sourceId===source.id).map(exportQuestion),dryRun:true})),questions:rows.map(q=>({...exportQuestion(q),sourceId:q.sourceId,reviewStatus:q.reviewStatus,revision:q.revision})),format:'HSK_SERVER_V1_EXPORT'});return true;}
   let match=route.match(/^admin\/questions\/([\w:-]+)(?:\/(review))?$/);
   if(match&&method==='POST'&&match[2]==='review'){send(200,{question:reviewQuestion(match[1],await body(req))});return true;}
   if(match&&method==='PATCH'&&!match[2]){const value=parse(z.object({expectedRevision:z.number().int().positive(),question:questionSchema}).strict(),await body(req)),old=latest(match[1]);if(!old||value.question.id!==match[1])fail(422,'QUESTION_ID_MISMATCH');const original=json(old.payload);if(original.examModule!==MODULE)fail(409,'ID_BELONGS_TO_EXISTING_CONTENT');const s=source(original.sourceId),key=fingerprint(value.question),duplicate=db.prepare('SELECT id FROM hsk_question_registry WHERE fingerprint=? AND id!=?').get(key,match[1]);if(duplicate)fail(409,'QUESTION_DUPLICATE_'+duplicate.id);db.exec('BEGIN IMMEDIATE');try{const question=saveQuestion(value.question,s,value.expectedRevision);audit('HSK_EDIT',question.id,question.revision,{reviewInvalidated:true});db.exec('COMMIT');send(200,{question});}catch(e){if(db.isTransaction)db.exec('ROLLBACK');throw e;}return true;}
   if(route==='admin/exams'&&method==='POST'){send(201,{exam:examMeta(createExam(await body(req)))});return true;}
   match=route.match(/^admin\/exams\/([\w:-]+)\/publish$/);if(match&&method==='POST'){send(200,{exam:examMeta(publishExam(match[1],await body(req)))});return true;}
   send(404,{error:'ADMIN_ROUTE_NOT_FOUND'});return true;
  }
  if(route==='standards'&&method==='GET'){send(200,{items:db.prepare('SELECT * FROM hsk_exam_standards').all().map(r=>({id:r.id,name:r.name,levels:json(r.levels_json),config:json(r.config_json)}))});return true;}
  if(route==='vocabulary'&&method==='GET'){const ids=parse(z.array(idSchema).max(30),(url.searchParams.get('ids')??'').split(',').filter(Boolean)),all=json(await readFile(path.join(root,'public/data/fourchinese/words.json'),'utf8'));send(200,{items:all.filter(w=>ids.includes(w.id)).map(w=>({id:w.id,simplified:w.simplified,pinyin:w.pinyin,meaningVi:w.primaryMeaningVi}))});return true;}
  const ownerId=await owner(req,res);sweepExpired();
  if(route==='exams'&&method==='GET'){
   const {offset,limit}=paging(url);let list=exams().filter(playable).map(examMeta);
   for(const [filter,key]of [['standard','standardId'],['level','level']]){const value=url.searchParams.get(filter);if(value&&value!=='all')list=list.filter(e=>e[key]===value);}
   for(const key of ['skill','difficulty']){const value=url.searchParams.get(key);if(value&&value!=='all')list=list.filter(e=>e[key==='skill'?'skills':key].includes(value));}
   const history=db.prepare('SELECT id,exam_id,status,result_json,started_at FROM hsk_exam_attempts WHERE owner_id=? ORDER BY started_at DESC').all(ownerId);list=list.map(e=>{const rows=history.filter(r=>r.exam_id===e.id);return {...e,attemptCount:rows.length,activeAttemptId:rows.find(r=>r.status==='ACTIVE')?.id,lastScore:rows.find(r=>r.result_json)?json(rows.find(r=>r.result_json).result_json).score:null};});
   const status=url.searchParams.get('status');if(status&&status!=='all')list=list.filter(e=>status==='new'?!e.attemptCount:status==='active'?e.activeAttemptId:status==='done'?e.lastScore!==null:false);const query=url.searchParams.get('q')?.toLowerCase();if(query)list=list.filter(e=>(e.title+' '+e.id).toLowerCase().includes(query));send(200,{total:list.length,items:list.slice(offset,offset+limit),ownerKind:ownerId.startsWith('account:')?'account':'guest'});return true;
  }
  if(route==='questions'&&method==='GET'){const {offset,limit}=paging(url),rows=questions().filter(q=>q.reviewStatus==='PUBLISHED');send(200,{total:rows.length,items:rows.slice(offset,offset+limit).map(candidateQuestion)});return true;}
  if(route==='attempts/history'&&method==='GET'){const {offset,limit}=paging(url),count=db.prepare('SELECT COUNT(*) total FROM hsk_exam_attempts WHERE owner_id=?').get(ownerId).total,rows=db.prepare('SELECT * FROM hsk_exam_attempts WHERE owner_id=? ORDER BY started_at DESC LIMIT ? OFFSET ?').all(ownerId,limit,offset);send(200,{total:count,items:rows.map(r=>({id:r.id,status:r.status,exam:examMeta(json(r.snapshot_json)),startedAt:r.started_at,submittedAt:r.submitted_at,score:r.result_json?json(r.result_json).score:null,maxScore:r.result_json?json(r.result_json).maxScore:null}))});return true;}
  let match=route.match(/^exams\/([\w:-]+)(?:\/(start))?$/);
  if(match&&method==='GET'&&!match[2]){const e=exams().find(e=>e.id===match[1]);if(!playable(e))fail(404,'EXAM_NOT_AVAILABLE');send(200,{exam:examMeta(e)});return true;}
  if(match&&method==='POST'&&match[2]==='start'){send(201,{attempt:start(match[1],ownerId,await body(req))});return true;}
  match=route.match(/^attempts\/([\w-]+)(?:\/(answers|submit|results))?$/);
  if(match){
   const [,id,action]=match;
   if(!action&&method==='GET'){send(200,{attempt:getAttempt(id,ownerId)});return true;}
   if(action==='answers'&&method==='PATCH'){send(200,{attempt:saveAnswers(id,ownerId,await body(req))});return true;}
   if(action==='submit'&&method==='POST'){send(200,{attempt:submit(id,ownerId,await body(req))});return true;}
   if(action==='results'&&method==='GET'){getAttempt(id,ownerId);const row=attemptRow(id,ownerId);if(row.status!=='SUBMITTED')fail(409,'SUBMIT_BEFORE_RESULTS');send(200,{result:json(row.result_json)});return true;}
  }
  send(404,{error:'NOT_FOUND'});return true;
 }
 if(seed){const sample=json(await readFile(path.join(root,'data/editorial/hsk-mvp-sample.json'),'utf8'));for(const batch of sample.batches)importBatch({...batch,dryRun:false});for(const exam of sample.exams)if(!latest(exam.id)){const {id,...value}=exam;createExam(value,{sample:true,id});}}
 return {handle,importBatch,questions,exams,createExam,reviewQuestion,publishExam,getAttempt,start,saveAnswers,submit,sweepExpired,exportQuestion};
}
