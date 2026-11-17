import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const phase=process.argv.includes('--baseline')?'baseline':'final',dir='data/reports/v8/'+phase;await mkdir(dir,{recursive:true});
if(phase==='baseline')await cp('data/reports/v7','data/reports/v8/v7-evidence',{recursive:true});
const manifest=JSON.parse(await readFile('package.json','utf8')),scripts=['typecheck','lint','test','test:v2','test:v3','test:v3-api','test:v4','test:v5','test:v5-api','test:v6','test:v6-api','test:account','test:admin','check:content','build',...['test:v7','test:v7-api','test:v7-account','test:v7-sync'],...(phase==='final'?['test:v8','test:v8-api','test:v8-grading','test:v8-grammar']:[])],results=[];
for(const name of scripts){if(!manifest.scripts[name])throw Error('Missing script '+name);const start=Date.now(),r=spawnSync(process.execPath,[path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),'run',name],{encoding:'utf8',windowsHide:true,maxBuffer:6e6});await writeFile(dir+'/'+name.replaceAll(':','-')+'.log',(r.stdout??'')+(r.stderr??''));results.push({script:name,status:r.status===0?'PASS':'FAIL',exitCode:r.status,durationMs:Date.now()-start});console.log(name+': '+r.status);}
await writeFile(dir+'/regression.json',JSON.stringify({at:new Date().toISOString(),phase,results},null,2));if(results.some(r=>r.status!=='PASS'))process.exitCode=1;

