import {mkdir,cp,symlink,readFile,writeFile,readdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
const root=process.cwd(),baseline=JSON.parse(await readFile('data/reports/v15/baseline.json','utf8'));
const phase=process.argv.includes('--current')?'current':'baseline';
const uiHandedOff=true;
const reuse=process.argv.find(a=>a.startsWith('--workspace='))?.slice(12),workspace=reuse?path.resolve(reuse):path.resolve('.tmp/v15-regression-'+Date.now());
if(!workspace.startsWith(path.resolve('.tmp')+path.sep))throw Error('Workspace must stay inside project .tmp');
await mkdir(workspace,{recursive:true});
if(!reuse){for(const item of ['src','shared','server','scripts','schemas','public','data','docs','package.json','package-lock.json','tsconfig.json','tsconfig.v13-logic.json','vite.config.ts','index.html'])await cp(item,path.join(workspace,item),{recursive:true,filter:source=>{const p=source.replaceAll('\\','/');return uiHandedOff||!/(^|\/)src\/ui-v14(\/|$)|(^|\/)docs\/collab\/v14\/gemini(\/|$)/.test(p)}});await symlink(path.resolve('node_modules'),path.join(workspace,'node_modules'),'junction');}
for(const item of ['v4-audio','v5-audio','v6-audio','v6-images','media']){try{await cp(path.join(baseline.backup,'.runtime',item),path.join(workspace,'.runtime',item),{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}}
// Historical suites copy these immutable backups to their own disposable DBs.
// Point each baseline at its source backup; never launch the main API in this runner.
async function patchBaselines(dir){for(const e of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())await patchBaselines(f);else if(e.name==='baseline.json'){const p=JSON.parse(await readFile(f,'utf8'));if(p.backup&&!path.isAbsolute(p.backup)){p.backup=path.resolve(root,p.backup);await writeFile(f,JSON.stringify(p));}}}}
await patchBaselines(path.join(workspace,'data/reports'));
const jobs=['typecheck','lint','test','test:v2','test:v3','test:v3-api','test:v4','test:v5','test:v5-api','test:v6','test:v6-api','test:account','test:admin','check:content','test:v7','test:v7-api','test:v7-account','test:v7-sync','test:v8','test:v8-api','test:v8-grading','test:v8-grammar','build','test:v9','test:v9-api','test:v10','test:v10-api','test:v11','test:v11-api','test:v12','test:v12-api','test:v12-journey','test:v13-contract','test:v13-content','test:v13-api'];
if(phase==='current')jobs.push('test:v14-contract','test:v14-api','test:v14-import','test:v15');
const results=[],out='data/reports/v15/'+phase+'-regression-'+Date.now();await mkdir(out,{recursive:true});
for(const name of jobs){const start=Date.now(),child=spawn(process.execPath,[path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),'run',name],{cwd:workspace,windowsHide:true,env:{...process.env,HSK_RUNTIME_DIR:path.join(workspace,'.runtime/qa')},stdio:['ignore','pipe','pipe']});let log='';child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b);const exitCode=await new Promise((r,j)=>{child.on('exit',r);child.on('error',j)});await writeFile(out+'/'+name.replaceAll(':','-')+'.log',log);results.push({name,exitCode,durationMs:Date.now()-start});await writeFile('data/reports/v15/'+phase+'-regression.json',JSON.stringify({at:new Date().toISOString(),phase,uiHandedOff,authoringExclusions:uiHandedOff?[]:['src/ui-v14','docs/collab/v14/gemini'],baseline:baseline.at,workspace,status:exitCode?'FAIL':results.length===jobs.length?'PASS':'RUNNING',results,logs:out,scope:'Isolated source/data copy; API suites use disposable DBs. No V13 evidence overwritten.'},null,2));console.log(name+': '+exitCode);if(exitCode){process.exitCode=1;break}}
