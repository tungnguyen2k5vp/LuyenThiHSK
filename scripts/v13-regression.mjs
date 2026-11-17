import {mkdir,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
const dir='data/reports/v13/final/regression-'+Date.now();await mkdir(dir,{recursive:true});
const jobs=['typecheck','lint','test','test:v2','test:v3','test:v3-api','test:v4','test:v5','test:v5-api','test:v6','test:v6-api','test:account','test:admin','check:content','test:v7','test:v7-api','test:v7-account','test:v7-sync','test:v8','test:v8-api','test:v8-grading','test:v8-grammar','build','test:v9','test:v9-api','test:v10','test:v10-api','test:v11','test:v11-api','test:v12','test:v12-api','test:v12-journey','test:v13-contract','test:v13-content','test:v13-api'],results=[];
for(const name of jobs){
 const start=Date.now(),p=spawn(process.execPath,[path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js'),'run',name],{windowsHide:true,stdio:['ignore','pipe','pipe']});let log='';p.stdout.on('data',b=>log+=b);p.stderr.on('data',b=>log+=b);
 const exitCode=await new Promise((r,j)=>{p.on('exit',r);p.on('error',j);});await writeFile(dir+'/'+name.replaceAll(':','-')+'.log',log);results.push({name,exitCode,status:exitCode===0?'PASS':'FAIL',durationMs:Date.now()-start});
 await writeFile('data/reports/v13/final/regression.json',JSON.stringify({at:new Date().toISOString(),status:results.some(r=>r.exitCode)?'FAIL':results.length===jobs.length?'PASS':'RUNNING',scope:'Current full source, all handed-off UI included, legacy regressions and V13 isolated tests',results,logs:dir,retries:0,ci:'NOT_RUN_NO_GIT_OR_CI'},null,2));console.log(name+': '+exitCode);if(exitCode){process.exitCode=1;break;}
}
