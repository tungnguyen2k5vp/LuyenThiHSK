import {readFile,writeFile} from 'node:fs/promises';const f='server/cloud/account-service.mjs';let s=await readFile(f,'utf8');
s=s.replace("if(key&&key.length!==32)","if(encryptionKey&&!/^[a-f0-9]{64}$/i.test(encryptionKey)||key&&key.length!==32)");
s=s.replace('async function session(req){','async function loadSession(req){');
const anchor=' async function handle({req,res,url,send,body})';if(!s.includes(anchor))throw Error('Account service changed');
s=s.replace(anchor,` const sessionLoads=new Map();
 async function session(req){const cookie=req.headers.cookie??'';let pending=sessionLoads.get(cookie);if(!pending){pending=loadSession(req);sessionLoads.set(cookie,pending);}try{return await pending;}finally{if(sessionLoads.get(cookie)===pending)sessionLoads.delete(cookie);}}
`+anchor);await writeFile(f,s);
