import {readFile,open,writeFile} from 'node:fs/promises';import {spawn} from 'node:child_process';import {digest} from '../shared/v5-quality.mjs';
const access='.runtime/admin-access.txt',before=await readFile(access,'utf8'),token=before.trim().split(/\r?\n/).at(-1);
if(!/^[a-f0-9]{64}$/.test(token))throw Error('Invalid stored admin credential; refusing change');
try{const r=await fetch('http://127.0.0.1:8787/api/health');if(r.ok)throw Error('PORT_ALREADY_IN_USE')}catch(e){if(e.message==='PORT_ALREADY_IN_USE')throw e;}
const log=await open('.runtime/v15-api.log','a'),child=spawn(process.execPath,['server/admin-server.mjs'],{cwd:process.cwd(),env:{...process.env,HSK_ADMIN_TOKEN:token,HSK_API_PORT:'8787'},detached:true,windowsHide:true,stdio:['ignore',log.fd,log.fd]});child.unref();await log.close();
const deadline=Date.now()+20000;let metadata;
while(Date.now()<deadline){try{const r=await fetch('http://127.0.0.1:8787/api/admin/v15/catalog',{headers:{Authorization:'Bearer '+token}});if(r.ok){metadata=await r.json();break}}catch{}await new Promise(r=>setTimeout(r,100));}
if(!metadata)throw Error('Current API did not become ready; inspect private runtime log');
const current=(await readFile(access,'utf8')).trim().split(/\r?\n/).at(-1);if(current!==token)throw Error('Credential unexpectedly changed');
await writeFile('data/reports/v15/live-api.json',JSON.stringify({at:new Date().toISOString(),status:'PASS',pid:child.pid,port:8787,loopbackOnly:true,tokenPreserved:true,catalog:{total:metadata.total,available:metadata.available},tokenWrittenToReport:false,contentSnapshotHash:digest(metadata.cards.map(c=>c.questionRevisions))},null,2));console.log(JSON.stringify({status:'PASS',pid:child.pid,port:8787,tokenPreserved:true,catalogTotal:metadata.total}));
