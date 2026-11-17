import {readFile,writeFile} from 'node:fs/promises';
const tests=JSON.parse(await readFile('data/reports/v13/api-tests.json','utf8'));if(tests.status!=='PASS')throw Error('Isolated API tests must pass before main staging');
const token=(await readFile('.runtime/admin-access.txt','utf8')).trim().split(/\r?\n/).at(-1),headers={Authorization:'Bearer '+token,'Content-Type':'application/json'},url='http://127.0.0.1:8787/api/admin/v13/stage';
const post=async input=>{const r=await fetch(url,{method:'POST',headers,body:JSON.stringify(input)}),data=await r.json();if(!r.ok)throw Error(JSON.stringify({status:r.status,data}));return data;};
const plan=await post({batch:'VOCABULARY'});if(![0,20].includes(plan.planned))throw Error('Unexpected stage plan count');
const applied=process.argv.includes('--apply')?await post({batch:'VOCABULARY',dryRun:false,planHash:plan.planHash}):null;
const report={at:new Date().toISOString(),plan,applied,scope:'Main local editorial database only; original AI drafts, no human approval or publishing',credentialsPrinted:false};await writeFile('data/reports/v13/live-stage.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
