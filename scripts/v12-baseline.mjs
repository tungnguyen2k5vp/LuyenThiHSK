import {readFile,writeFile,cp,mkdir,readdir} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {digest} from '../shared/v5-quality.mjs';
let source=await readFile('scripts/v11-baseline.mjs','utf8');
source=source.slice(0,source.indexOf('// Separate runners'))
 .replaceAll('v11','v12').replaceAll('V11','V12')
 .replace("import {currentValidation} from '../shared/v10-content.mjs';","import {currentValidation} from '../shared/v10-content.mjs';\nimport {v11Validation} from '../shared/v11-content.mjs';")
 .replace("'v10-hsk2'];","'v10-hsk2','v11-hsk2'];")
 .replace('Number(currentValidation(p))',"Number(p.editorialRelease==='v11-hsk2'?v11Validation(p):currentValidation(p))")
 .replace("'docs/v10','data/reports/v10'","'docs/v11','data/reports/v11','docs/v10','data/reports/v10'");
// Imports in the generated module resolve beside this file; no application edits.
await writeFile('scripts/.v12-baseline-snapshot.mjs',source);
await import('./.v12-baseline-snapshot.mjs');
const baseline=JSON.parse(await readFile('data/reports/v12/baseline.json','utf8'));
const restored='.tmp/v12-account-restore.sqlite';await cp(baseline.backup+'/account-sessions.sqlite',restored);
const account=new DatabaseSync(restored,{readOnly:true});
const check=account.prepare('PRAGMA integrity_check').get();account.close();
if(Object.values(check)[0]!=='ok')throw Error('Account restore failed');
const hashes={};async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const f=dir+'/'+e.name;if(e.isDirectory())await walk(f);else hashes[f]=digest(await readFile(f));}}
for(const dir of ['src','shared','server','scripts','schemas'])await walk(dir);
baseline.sourceHashes=hashes;baseline.accountRestore={status:'PASS',integrity:check};
baseline.v11=JSON.parse(await readFile('data/reports/v11/content-audit.json','utf8'));
await writeFile('data/reports/v12/baseline.json',JSON.stringify(baseline,null,2));
let reg=(await readFile('scripts/v11-regression.mjs','utf8')).replace("dir='data/reports/v11/'","dir='data/reports/v12/'").replace("...(phase==='final'?['test:v11','test:v11-api']:[])","...['test:v11','test:v11-api']");
await writeFile('scripts/v12-regression.mjs',reg);
let matrix=(await readFile('scripts/v11-browser-matrix.mjs','utf8')).replace("dir='data/reports/v11/'","dir='data/reports/v12/'").replaceAll("(baseline?'v10':'v11')","'v11'").replaceAll("baseline?'--v10':'--v11'","'--v11'");
await writeFile('scripts/v12-browser-matrix.mjs',matrix);
await mkdir('docs/v12',{recursive:true});
console.log(JSON.stringify({total:baseline.total,counts:baseline.counts,backup:baseline.backup,restore:'PASS',accountRestore:'PASS',sourceFiles:Object.keys(hashes).length}));
