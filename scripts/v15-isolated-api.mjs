import {mkdtemp,cp,copyFile,readFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import path from 'node:path';import os from 'node:os';
export async function withV15Api(work){
 const baseline=JSON.parse(await readFile('data/reports/v15/baseline.json','utf8')),runtime=await mkdtemp(path.join(os.tmpdir(),'hsk-v15-api-'));
 await copyFile(path.join(baseline.backup,'hsk-content.sqlite'),path.join(runtime,'hsk-content.sqlite'));
 for(const folder of ['v4-audio','v5-audio','v6-audio','v6-images','media']){try{await cp(path.join(baseline.backup,'.runtime',folder),path.join(runtime,folder),{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}}
 const socket=createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
 const env={...process.env,HSK_RUNTIME_DIR:runtime,HSK_API_PORT:String(port),HSK_REVIEWERS_JSON:'[]',HSK_ENABLE_LOCAL_QWEN:'false',HSK_ENABLE_PAID_TTS:'false'};delete env.HSK_ADMIN_TOKEN;
 const child=spawn(process.execPath,['server/admin-server.mjs'],{env,windowsHide:true,stdio:['ignore','ignore','pipe']});
 let errors='';child.stderr.on('data',b=>errors+=b);const url='http://127.0.0.1:'+port+'/api/';
 try{
  const deadline=Date.now()+20000;while(true){try{if((await fetch(url+'health')).ok)break;}catch{}if(Date.now()>deadline||child.exitCode!==null)throw Error('ISOLATED_START_FAILED');await new Promise(r=>setTimeout(r,50));}
  const token=(await readFile(path.join(runtime,'admin-access.txt'),'utf8')).trim().split(/\r?\n/).at(-1);
  const request=async(route,input,authenticated=true)=>{const r=await fetch(url+route,{method:input?'POST':'GET',headers:{...(authenticated?{Authorization:'Bearer '+token}:{}),'Content-Type':'application/json'},body:input?JSON.stringify(input):undefined});return{status:r.status,data:await r.json()};};
  return await work({request,runtime,url});
 }finally{if(errors.includes('request_error'))console.error(errors);child.kill();if(child.exitCode===null)await new Promise(r=>{child.once('exit',r);setTimeout(r,3000)});}
}
