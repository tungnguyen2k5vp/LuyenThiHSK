import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp,readFile,rm } from 'node:fs/promises';
import os from 'node:os';import path from 'node:path';import { createServer } from 'node:net';
const runtime=await mkdtemp(path.join(os.tmpdir(),'hsk-admin-test-'));const socket=createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
const child=spawn(process.execPath,['server/admin-server.mjs'],{env:{...process.env,HSK_API_PORT:String(port),HSK_RUNTIME_DIR:runtime},windowsHide:true,stdio:'ignore'});const base='http://127.0.0.1:'+port+'/api/';
try{
  for(let i=0;i<50;i++){try{if((await fetch(base+'health')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  const token=(await readFile(path.join(runtime,'admin-access.txt'),'utf8')).trim().split('\n').at(-1);
  const api=async(endpoint,body)=>{const r=await fetch(base+'admin/'+endpoint,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return{status:r.status,data:await r.json()};};
  assert.equal((await fetch(base+'admin/content')).status,401);
  const p={id:'test-word',syllabusVersion:'hsk3-2025',level:'1',source:'Test fixture',sourceType:'GENERATED',sourceUrl:'local:test',license:'Original test only',licenseStatus:'VERIFIED',licenseEvidenceUrl:'local:permission/test-fixture',simplified:'猫',pinyin:'māo',meaningVi:'con mèo'};
  assert.equal((await api('content',{kind:'vocabulary',payload:p,expectedRevision:0})).status,201);
  assert.equal((await fetch(base+'public/content').then(r=>r.json())).records.length,0);
  assert.equal((await api('status',{id:p.id,revision:1,status:'PUBLISHED'})).status,422);
  await api('status',{id:p.id,revision:1,status:'NEEDS_REVIEW'});assert.equal((await api('status',{id:p.id,revision:1,status:'APPROVED',reviewed:false})).status,422);
  assert.equal((await api('status',{id:p.id,revision:1,status:'APPROVED',reviewed:true})).status,200);await api('status',{id:p.id,revision:1,status:'PUBLISHED'});
  assert.equal((await fetch(base+'public/content').then(r=>r.json())).records.length,1);
  await api('content',{kind:'vocabulary',payload:{...p,meaningVi:'mèo'},expectedRevision:1});assert.equal((await api('content',{kind:'vocabulary',payload:p,expectedRevision:1})).status,409);
  assert.equal((await fetch(base+'public/content').then(r=>r.json())).records[0].payload.meaningVi,'con mèo');await api('status',{id:p.id,revision:2,status:'ARCHIVED'});assert.equal((await fetch(base+'public/content').then(r=>r.json())).records.length,0);
  const rows=[{...p,id:'batch-word'}, {...p,id:'duplicate-word'}, {...p,id:'bad-word',pinyin:''}];const preview=await api('imports',{kind:'vocabulary',rows,dryRun:true});assert.equal(preview.data.accepted,1);assert.equal(preview.data.duplicates,1);assert.equal(preview.data.errors.length,1);const apply=await api('imports',{kind:'vocabulary',rows,dryRun:false});assert.equal(apply.status,200);const replay=await api('imports',{kind:'vocabulary',rows,dryRun:false});assert.equal(replay.data.replayed,true);assert.ok((await api('quality')).data.audit.length>=7);
  console.log('PASS admin API: token auth, validation, dry-run/import/dedup/idempotency, generated draft gate, explicit review/publish, immutable revisions/conflict checks, published snapshot retention, archive and audit.');
}finally{child.kill();await new Promise(r=>child.once('exit',r));const checked=path.resolve(runtime);assert.ok(checked.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(checked).startsWith('hsk-admin-test-'));await rm(checked,{recursive:true,force:true});}
