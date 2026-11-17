import {readFile,writeFile} from 'node:fs/promises';
async function edit(file,changes){let text=await readFile(file,'utf8');for(const [before,after]of changes){if(!text.includes(before))throw Error('Missing anchor '+file+' '+before);text=text.replaceAll(before,after);}await writeFile(file,text);}
await edit('server/admin-server.mjs',[
 ["import { createV4Service } from './v4-content-service.mjs';","import { createV4Service } from './v4-content-service.mjs';\nimport {createV5Service} from './v5-content-service.mjs';"],
 ["const root=path.resolve", "if(process.env.NODE_ENV==='production')throw Error('LOCAL_ADMIN_ONLY: production requires authenticated server RBAC, HTTPS and isolated content services.');\nconst root=path.resolve"],
 ['const v4=createV4Service({db,root,runtime,addRecord});','const v4=createV4Service({db,root,runtime,addRecord});\nconst v5=createV5Service({db,root,runtime,addRecord});\nconst authFailures=new Map();'],
 ["  const requestOrigin=req.headers.origin;","  const requestOrigin=req.headers.origin;\n  if(!/^(localhost|127\\.0\\.0\\.1)(:\\d+)?$/.test(req.headers.host??'')){res.writeHead(403);res.end();return;}\n  if(requestOrigin&&!/^http:\\/\\/(127\\.0\\.0\\.1|localhost):\\d+$/.test(requestOrigin)){res.writeHead(403);res.end();return;}\n  res.setHeader('Referrer-Policy','no-referrer');"],
 ["    if(!authorized(req))return send(401,{error:","    const address=req.socket.remoteAddress??'loopback';const failure=authFailures.get(address);if(failure&&failure.until>Date.now()&&failure.count>=30)return send(429,{error:'Too many failed credentials; retry in one minute'});\n    if(!authorized(req)){const old=failure?.until>Date.now()?failure:{count:0,until:Date.now()+60000};authFailures.set(address,{...old,count:old.count+1});return send(401,{error:"],
 ["local server.'});\n    const origin", "local server.'});}\n    const origin"],
 ["    if(await v4.handle({url,req,send,body,res}))return;","    if(await v4.handle({url,req,send,body,res}))return;\n    if(await v5.handle({url,req,send,body,res}))return;"],
 ]);
await edit('server/v4-content-service.mjs',[["r.payload.editorialRelease==='v4-hsk1')){addRecord","['v4-hsk1','v5-hsk1'].includes(r.payload.editorialRelease))){addRecord"]]);
await edit('server/v3-content-service.mjs',[["p.editorialRelease==='v4-hsk1'","['v4-hsk1','v5-hsk1'].includes(p.editorialRelease)"],["if(['questions','grammar','audio','templates','exams'].includes(record.kind)&&to", "if((['questions','grammar','audio','templates','exams'].includes(record.kind)||JSON.parse(record.payload).editorialRelease)&&to"]]);
console.log('Wired V5 private routes, revision safeguards, local host/origin checks and fail-closed production.');
