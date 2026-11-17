import {readFile,readdir,writeFile} from 'node:fs/promises';
import {digest} from '../shared/v5-quality.mjs';
const baseline=JSON.parse(await readFile('data/reports/v12/baseline.json','utf8')),current={};
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=dir+'/'+entry.name;if(entry.isDirectory())await walk(file);else current[file]=digest(await readFile(file));}}
for(const dir of ['src','shared','server','scripts','schemas'])await walk(dir);
const files=[...new Set([...Object.keys(baseline.sourceHashes),...Object.keys(current)])].sort().map(file=>({file,before:baseline.sourceHashes[file]??null,after:current[file]??null,status:!baseline.sourceHashes[file]?'ADDED':!current[file]?'REMOVED':baseline.sourceHashes[file]===current[file]?'UNCHANGED':'MODIFIED'}));
const report={at:new Date().toISOString(),baselineAt:baseline.at,baselineBackup:baseline.backup,git:'NOT_AVAILABLE_NO_GIT_REPOSITORY',scope:'Source directories only; no credentials, database rows or learner profiles; SHA-256 using existing project digest',counts:Object.fromEntries(['ADDED','REMOVED','MODIFIED','UNCHANGED'].map(status=>[status,files.filter(f=>f.status===status).length])),files};
await writeFile('data/reports/v12/source-change-manifest.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({files:files.length,...report.counts}));
