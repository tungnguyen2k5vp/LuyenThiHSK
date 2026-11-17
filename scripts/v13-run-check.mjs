import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const name=process.argv[2],jobs={browser:{args:['scripts/exam-browser-check.mjs','--v13']},edge:{args:['scripts/exam-browser-check.mjs','--v13'],env:{HSK_BROWSER_PATH:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}},performance:{args:['scripts/exam-browser-check.mjs','--v13','--v13-perf']},contract:{args:['scripts/test-v13-contract.mjs']},content:{args:['scripts/test-v13-content.mjs']},api:{args:['scripts/test-v13-api.mjs']}};
if(!Object.hasOwn(jobs,name))throw Error('Unknown explicit V13 check');
const start=Date.now(),dir='data/reports/v13/runs';await mkdir(dir,{recursive:true});const id=name+'-'+start,job=jobs[name],child=spawn(process.execPath,job.args,{env:{...process.env,...job.env},windowsHide:true,stdio:['ignore','pipe','pipe']});let log='';child.stdout.on('data',b=>{log+=b;process.stdout.write(b);});child.stderr.on('data',b=>{log+=b;process.stderr.write(b);});
const exitCode=await new Promise((resolve,reject)=>{child.on('exit',resolve);child.on('error',reject);});
await writeFile(dir+'/'+id+'.log',log);await writeFile(dir+'/'+id+'.json',JSON.stringify({at:new Date().toISOString(),name,status:exitCode===0?'PASS':'FAIL',exitCode,durationMs:Date.now()-start,log:id+'.log',retries:0},null,2));process.exitCode=exitCode??1;
