import {readFile,writeFile,mkdir,cp,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import path from 'node:path';
const base=JSON.parse(await readFile('data/reports/v13/baseline.json','utf8')),dir='data/reports/v13/baseline',snapshot=path.resolve(base.backup),run=Date.now(),buildRoot=path.resolve('.tmp/v13-baseline-source-'+run),output=path.resolve('.tmp/v13-baseline-dist-'+run);
if(path.dirname(output)!==path.resolve('.tmp'))throw Error('Build output escaped task directory');
await mkdir(dir,{recursive:true});await cp('docs/screenshots/v12',dir+'/screenshots-v12',{recursive:true});
// Preserve every failed run. Never alter the immutable original backup.
try{await stat(dir+'/regression.json');const archive=dir+'/previous-'+run;await mkdir(archive);for(const name of ['regression.json','build.log'])await cp(dir+'/'+name,archive+'/'+name);}catch(e){if(e.code!=='ENOENT')throw e;}
await mkdir(buildRoot,{recursive:true});
for(const item of ['src','shared','public','docs','index.html','package.json','vite.config.ts','tsconfig.json'])await cp(path.join(snapshot,item),path.join(buildRoot,item),{recursive:true});
const supplement=[];
for(const name of ['DATA_SOURCES.md','REFERENCE_REPOSITORIES.md','CONTENT_LICENSES.md','CONTENT_POLICY.md']){
 const bytes=await readFile('docs/'+name),hash=createHash('sha256').update(bytes).digest('hex');
 await writeFile(path.join(buildRoot,'docs',name),bytes);supplement.push({path:'docs/'+name,sha256:hash,provenance:'Captured after baseline: omitted raw-import documentation dependency, not frozen V12 source'});
}
await writeFile(dir+'/build-supplement.json',JSON.stringify({at:new Date().toISOString(),buildRoot,snapshot,supplement,originalBackupModified:false},null,2));
const names=['typecheck','lint','test','test:v2','test:v3','test:v3-api','test:v4','test:v5','test:v5-api','test:v6','test:v6-api','test:account','test:admin','check:content','test:v7','test:v7-api','test:v7-account','test:v7-sync','test:v8','test:v8-api','test:v8-grading','test:v8-grammar','build','test:v9','test:v9-api','test:v10','test:v10-api','test:v11','test:v11-api','test:v12','test:v12-api','test:v12-journey'],npm=path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),results=[];
for(const name of names){const args=name==='typecheck'||name==='lint'?['node_modules/typescript/bin/tsc','--project',snapshot+'/tsconfig.json','--noEmit',...(name==='lint'?['--noUnusedLocals','--noUnusedParameters']:[])]:name==='build'?['node_modules/vite/bin/vite.js','build',buildRoot,'--config',buildRoot+'/vite.config.ts','--outDir',output]:[npm,'run',name],start=Date.now(),p=spawn(process.execPath,args,{windowsHide:true,stdio:['ignore','pipe','pipe']});let log='';p.stdout.on('data',b=>log+=b);p.stderr.on('data',b=>log+=b);const exitCode=await new Promise((r,j)=>{p.on('exit',r);p.on('error',j)});await writeFile(dir+'/'+name.replaceAll(':','-')+'.log',log);results.push({name,status:exitCode===0?'PASS':'FAIL',exitCode,durationMs:Date.now()-start,scope:['typecheck','lint','build'].includes(name)?'Frozen V12 code; build includes four separately hashed documentation dependencies; no Gemini authoring files':'Existing regression on current logic with isolated QA fixtures as implemented by existing tests'});await writeFile(dir+'/regression.json',JSON.stringify({at:new Date().toISOString(),results,snapshot,output,geminiFilesEdited:false,ci:'NOT_RUN_NO_GIT_OR_CI'},null,2));console.log(name+': '+exitCode);if(exitCode){process.exitCode=1;break;}}

