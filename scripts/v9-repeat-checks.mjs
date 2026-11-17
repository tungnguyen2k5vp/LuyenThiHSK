import {spawn} from 'node:child_process';import {mkdir,writeFile,readFile} from 'node:fs/promises';
const browser=process.argv.includes('--browser'),resume=process.argv.includes('--resume'),dir='data/reports/v9/repeated';await mkdir(dir,{recursive:true});
const reportFile=dir+'/'+(browser?'browser':'unit-api')+'.json',results=resume?JSON.parse(await readFile(reportFile,'utf8')).results:[];
if(results.some(r=>r.status!=='PASS'))throw Error('Cannot resume a failed sequence; diagnose before a new full run');
const jobs=browser?[['Chrome',['scripts/exam-browser-check.mjs','--v9'],{}],['Edge',['scripts/exam-browser-check.mjs','--v9'],{HSK_BROWSER_PATH:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}]]:[['unit',['scripts/test-v9.mjs'],{}],['api',['scripts/test-v9-api.mjs'],{}]];
for(const [name,args,env]of jobs)for(let i=1;i<=10;i++){
 if(results.some(r=>r.name===name&&r.run===i))continue;
 const start=Date.now(),child=spawn(process.execPath,args,{env:{...process.env,...env},windowsHide:true,stdio:['ignore','pipe','pipe']});let log='';child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b);const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve)});await writeFile(dir+'/'+name.toLowerCase()+'-'+i+'.log',log);results.push({name,run:i,status:code===0?'PASS':'FAIL',durationMs:Date.now()-start});await writeFile(reportFile,JSON.stringify({at:new Date().toISOString(),results,retries:0,resumedAfterUserContinuation:resume,ci:'NOT_RUN_NO_CI_ENVIRONMENT'},null,2));console.log(name+' '+i+': '+code);if(code!==0){process.exitCode=1;throw Error(name+' run '+i+' failed; no retry');}
}
