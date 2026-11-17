import assert from 'node:assert/strict';
import {readFile,writeFile,mkdtemp,copyFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import os from 'node:os';import path from 'node:path';
import {validateV13Record,v13Validation,v13Signature} from '../shared/v13-content.mjs';
import {createV13Service} from '../server/v13-content-service.mjs';
const staging=JSON.parse(await readFile('data/staging/v13/content.json','utf8')),baseline=JSON.parse(await readFile('data/reports/v13/baseline.json','utf8'));let checks=0;const check=f=>{f();checks++;};
check(()=>assert.equal(staging.records.length,20));check(()=>assert.equal(new Set(staging.wordDrafts.map(w=>w.vocabularyPointId)).size,20));
for(const {kind,payload:p}of staging.records){
 check(()=>assert.deepEqual(validateV13Record(kind,p,staging.refs),[]));check(()=>assert.equal(v13Validation(p),true));
 for(const patch of [{primaryMeaningVi:'changed'},{secondaryMeaningsVi:['changed']},{exampleZh:'changed'},{examplePinyin:'changed'},{exampleVi:'changed'},{lexicalScope:'changed'},{referenceVerification:{status:'changed'}},{editorialRelease:'v12-hsk2'}])check(()=>assert.equal(v13Validation({...p,...patch}),false));
 for(const patch of [{sourceType:'OFFICIAL'},{humanReview:{status:'APPROVED'}},{reviewStatus:'PUBLISHED'},{licenseStatus:'VERIFIED'},{vocabularyPointId:'unknown'},{exampleZh:'不含目标词'},{dictionaryReference:{}},{referenceVerification:{status:'OFFICIAL'}}])check(()=>assert.ok(validateV13Record(kind,{...p,...patch},staging.refs).length));
 check(()=>assert.notEqual(v13Signature(p),v13Signature({...p,primaryMeaningVi:p.primaryMeaningVi+'x'})));
}
// Prove the transaction rolls back if post-decoration validation fails after an INSERT.
const runtime=await mkdtemp(path.join(os.tmpdir(),'hsk-v13-rollback-'));await copyFile(path.join(baseline.backup,'hsk-content.sqlite'),path.join(runtime,'hsk-content.sqlite'));
const db=new DatabaseSync(path.join(runtime,'hsk-content.sqlite')),before=db.prepare('SELECT COUNT(*) n FROM content').get().n;
try{const service=createV13Service({db,root:process.cwd(),runtime,v12:{practice:()=>{throw Error('Not used')}},addRecord(kind,p){const now=new Date().toISOString();db.prepare('INSERT INTO content VALUES(?,?,?,?,?,?,?)').run(p.id,1,kind,p.reviewStatus,JSON.stringify(p),now,now);return {...p,licenseStatus:'VERIFIED'};}});
 let dry;await service.handle({url:new URL('http://127.0.0.1/api/admin/v13/stage'),req:{method:'POST'},body:async()=>({batch:'VOCABULARY'}),send:(status,data)=>{assert.equal(status,200);dry=data;}});
 await assert.rejects(()=>service.handle({url:new URL('http://127.0.0.1/api/admin/v13/stage'),req:{method:'POST'},body:async()=>({batch:'VOCABULARY',dryRun:false,planHash:dry.planHash}),send:()=>{throw Error('Must not send success');}}),/DECORATED_RECORD_INVALID/);checks++;
 check(()=>assert.equal(db.prepare('SELECT COUNT(*) n FROM content').get().n,before));check(()=>assert.equal(db.prepare("SELECT COUNT(*) n FROM content WHERE json_extract(payload,'$.editorialRelease')='v13-hsk2'").get().n,0));check(()=>assert.equal(Object.values(db.prepare('PRAGMA integrity_check').get())[0],'ok'));
}finally{db.close();}
await writeFile('data/reports/v13/content-tests.json',JSON.stringify({at:new Date().toISOString(),status:'PASS',checks,rollback:'PASS',scope:'V13 staged originals; disposable SQLite transaction, no main writes'},null,2));console.log('PASS V13 content '+checks+' checks');
