import {readFile,mkdir,writeFile,rename,unlink} from 'node:fs/promises';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';

export function createCommunityAudio({root,runtime}){
 const pending=new Map(),folder=path.join(runtime,'community-audio');
 async function load(id){
  const manifest=JSON.parse(await readFile(path.join(root,'public/data/mandarin-zone/manifest.json'),'utf8'));
  const source=manifest.audioSources[id];
  if(typeof source!=='string'||!/^https:\/\/media\.mandarinzone\.com\/wp-content\/uploads\/[\w./-]+\.wav$/.test(source)||createHash('sha256').update(source).digest('hex')!==id)throw Object.assign(Error('UNKNOWN_AUDIO'),{status:404});
  const file=path.join(folder,id+'.wav');
  try{return await readFile(file);}catch(error){if(error.code!=='ENOENT')throw error;}
  const response=await fetch(source,{signal:AbortSignal.timeout(30000)});
  if(!response.ok||response.status===206)throw Object.assign(Error('Không tải được audio từ nguồn. Hãy thử lại.'),{status:502});
  const chunks=[];let size=0;
  for await(const chunk of response.body){size+=chunk.length;if(size>32*1024*1024)throw Object.assign(Error('Audio vượt giới hạn tải.'),{status:502});chunks.push(chunk);}
  const bytes=Buffer.concat(chunks);
  if(bytes.length<44||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WAVE')throw Object.assign(Error('Audio nguồn không đúng định dạng WAV.'),{status:502});
  await mkdir(folder,{recursive:true});const temp=file+'.'+randomUUID()+'.tmp';
  try{await writeFile(temp,bytes);await rename(temp,file);}finally{await unlink(temp).catch(error=>{if(error.code!=='ENOENT')throw error;});}
  return bytes;
 }
 return async({url,req,res,send})=>{
  if(!url.pathname.startsWith('/api/learner/community-audio/'))return false;
  const match=url.pathname.match(/^\/api\/learner\/community-audio\/([a-f0-9]{64})\.wav$/);
  if(req.method!=='GET'&&req.method!=='HEAD'){send(405,{error:'READ_ONLY_AUDIO'});return true;}
  if(!match){send(404,{error:'UNKNOWN_AUDIO'});return true;}
  const id=match[1];
  if(!pending.has(id))pending.set(id,load(id).finally(()=>pending.delete(id)));
  const bytes=await pending.get(id),range=req.headers.range;
  let start=0,end=bytes.length-1,status=200;
  if(range){const parts=range.match(/^bytes=(\d*)-(\d*)$/);if(!parts||!parts[1]&&!parts[2]){res.writeHead(416,{'Content-Range':`bytes */${bytes.length}`});res.end();return true;}
   if(parts[1]){start=Number(parts[1]);end=parts[2]?Math.min(Number(parts[2]),end):end;}else start=Math.max(0,bytes.length-Number(parts[2]));
   if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=bytes.length){res.writeHead(416,{'Content-Range':`bytes */${bytes.length}`});res.end();return true;}status=206;
  }
  res.writeHead(status,{'Content-Type':'audio/wav','Content-Length':end-start+1,'Accept-Ranges':'bytes','Cache-Control':'private,max-age=86400','X-Content-Type-Options':'nosniff',...(status===206?{'Content-Range':`bytes ${start}-${end}/${bytes.length}`}:{})});
  res.end(req.method==='HEAD'?undefined:bytes.subarray(start,end+1));return true;
 };
}
