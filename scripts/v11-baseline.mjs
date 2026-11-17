import {readFile,writeFile,mkdir,cp,readdir} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {digest} from '../shared/v5-quality.mjs';
import {currentValidation} from '../shared/v10-content.mjs';
const out='data/reports/v11';
try { await readFile(out+'/baseline.json'); throw Error('Baseline exists; refusing overwrite'); } catch(e) { if(e.code!=='ENOENT')throw e; }
const at=new Date().toISOString(),backup='.runtime/backups/before-v11-'+at.replace(/[:.]/g,'-');
await mkdir(backup,{recursive:true});await mkdir(out+'/baseline',{recursive:true});await mkdir('docs/v11',{recursive:true});await mkdir('.tmp',{recursive:true});
const db=new DatabaseSync('.runtime/hsk-content.sqlite',{readOnly:true});
const rows=db.prepare('SELECT * FROM content ORDER BY id,revision').all(),schema=db.prepare('SELECT name,sql FROM sqlite_master WHERE sql IS NOT NULL ORDER BY name').all(),work=db.prepare('SELECT * FROM v5_review_work ORDER BY entity_id,revision').all();
const releases=['v6-hsk1','v8-hsk1-supplement','v8-hsk2-pilot','v9-hsk1-supplement','v9-hsk2-practice','v10-hsk2'];
const live=db.prepare("SELECT c.* FROM content c WHERE c.revision=(SELECT MAX(x.revision) FROM content x WHERE x.id=c.id) AND c.status!='ARCHIVED'").all().filter(r=>releases.includes(JSON.parse(r.payload).editorialRelease));
const counts={};for(const r of live){const p=JSON.parse(r.payload),c=counts[r.kind]??={total:0,DRAFT:0,NEEDS_REVIEW:0,automatedValid:0,humanReviewed:0,published:0};c.total++;c[r.status]=(c[r.status]??0)+1;c.automatedValid+=Number(currentValidation(p));c.humanReviewed+=Number(p.humanReview?.status==='APPROVED');c.published+=Number(r.status==='PUBLISHED');}
db.prepare('VACUUM INTO ?').run(path.resolve(backup,'hsk-content.sqlite'));db.close();
const restore='.tmp/v11-isolated-restore-'+Date.now()+'.sqlite';await cp(backup+'/hsk-content.sqlite',restore);const test=new DatabaseSync(restore,{readOnly:true}),integrity=test.prepare('PRAGMA integrity_check').get(),restored=test.prepare('SELECT * FROM content ORDER BY id,revision').all();test.close();if(Object.values(integrity)[0]!=='ok'||digest(rows)!==digest(restored))throw Error('Restore verification failed');
const account=new DatabaseSync('.runtime/account/sessions.sqlite',{readOnly:true});account.prepare('VACUUM INTO ?').run(path.resolve(backup,'account-sessions.sqlite'));account.close();
for(const item of ['src','shared','server','scripts','schemas','public','data/editorial','data/staging','docs/v10','data/reports/v10','package.json','package-lock.json','vite.config.ts','tsconfig.json'])await cp(item,path.join(backup,item),{recursive:true});
for(const item of ['v4-audio','v5-audio','v6-audio','v6-images','media']){try{await cp('.runtime/'+item,path.join(backup,'.runtime',item),{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}}
const publicFiles={};async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const f=dir+'/'+e.name;if(e.isDirectory())await walk(f);else publicFiles[f]=digest(await readFile(f));}}await walk('public/data');
const git=spawnSync('git',['status','--short'],{encoding:'utf8',windowsHide:true});
const report={at,backup,total:live.length,counts,allRevisions:rows.length,schema,reviewWork:work,records:rows.map(r=>({id:r.id,revision:r.revision,status:r.status,payloadHash:digest(r.payload)})),publicFiles,restore:{status:'PASS',integrity,path:restore},git:{available:git.status===0,detail:(git.stdout||git.stderr).trim()},browserProgress:'Real browser profiles untouched; no SRS/history migration. Account DB backed up.',migrationState:'Existing SQLite schema frozen; no V11 migration applied'};
await writeFile(out+'/baseline.json',JSON.stringify(report,null,2));
await writeFile('docs/v11/V11_BASELINE.md',`# V11 · Baseline\n\n${at}\n\n${live.length} current editorial records; ${rows.length} historical revisions. Consistent content/account/source/media backup: ${backup}. Isolated restore PASS. No Git repository. No schema migration or real browser profile extraction.\n\nCounts:\n\n\`\`\`json\n${JSON.stringify(counts,null,2)}\n\`\`\`\n\nRegression/browser results will be recorded in data/reports/v11/baseline before implementation.\n`);
// Separate runners preserve V10 evidence. V11 baseline includes V10 unit/API.
const regression=(await readFile('scripts/v10-regression.mjs','utf8')).replace("const phase=process.argv.includes('--baseline')?'baseline':'final',dir='data/reports/v10/'+phase;","const phase=process.argv.includes('--baseline')?'baseline':'final',dir='data/reports/v11/'+phase;").replace("...(phase==='final'?['test:v10','test:v10-api']:[])","...['test:v10','test:v10-api']");
await writeFile('scripts/v11-regression.mjs',regression);
const matrix=(await readFile('scripts/v10-browser-matrix.mjs','utf8')).replace("dir='data/reports/v10/'","dir='data/reports/v11/'").replaceAll("(baseline?'v9':'v10')","'v10'").replaceAll("baseline?'--v9':'--v10'","'--v10'").replace(/if\(baseline&&results.every[\s\S]*$/,'');
await writeFile('scripts/v11-browser-matrix.mjs',matrix);
console.log(JSON.stringify({total:live.length,counts,restore:'PASS',backup}));
