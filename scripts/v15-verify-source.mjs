import {readFile,writeFile} from 'node:fs/promises';import {digest} from '../shared/v5-quality.mjs';
const e=JSON.parse(await readFile('data/reports/v15/source-evidence.json','utf8')),changed=[];
for(const [f,hash]of Object.entries(e.files))if(digest(await readFile(f))!==hash)changed.push(f);
const report={at:new Date().toISOString(),status:changed.length?'FAIL':'PASS',sourceSha256:e.sha256,files:Object.keys(e.files).length,changed};await writeFile('data/reports/v15/source-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,files:report.files,changed}));if(changed.length)process.exitCode=1;
