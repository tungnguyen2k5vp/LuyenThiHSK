import {readFile,writeFile,readdir} from 'node:fs/promises';
import {digest} from '../shared/v5-quality.mjs';
const target='data/reports/v13/final/source-evidence.json',files={};
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const f=dir+'/'+e.name;if(e.isDirectory())await walk(f);else files[f]=digest(await readFile(f));}}
for(const d of ['src','shared','server','scripts','schemas','data/editorial/v13'])await walk(d);
for(const f of ['package.json','package-lock.json','tsconfig.json','vite.config.ts','index.html'])files[f]=digest(await readFile(f));
const sorted=Object.fromEntries(Object.entries(files).sort(([a],[b])=>a.localeCompare(b))),hash=digest(sorted);
if(process.argv.includes('--verify')){const previous=JSON.parse(await readFile(target,'utf8')),changed=[...new Set([...Object.keys(previous.files),...Object.keys(sorted)])].filter(f=>previous.files[f]!==sorted[f]);await writeFile('data/reports/v13/final/source-verification.json',JSON.stringify({at:new Date().toISOString(),status:changed.length?'FAIL':'PASS',before:previous.sha256,after:hash,changed},null,2));console.log(JSON.stringify({status:changed.length?'FAIL':'PASS',files:Object.keys(sorted).length,changed}));if(changed.length)process.exitCode=1;}
else{await writeFile(target,JSON.stringify({at:new Date().toISOString(),sha256:hash,files:sorted,scope:'Code/config/schema/test scripts/editorial V13; runtime, credentials, build outputs and generated reports excluded'},null,2));console.log(JSON.stringify({sha256:hash,files:Object.keys(sorted).length}));}
