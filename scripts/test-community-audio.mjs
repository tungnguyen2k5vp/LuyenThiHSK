import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createCommunityAudio} from '../server/community-audio.mjs';

const root=await mkdtemp(path.join(tmpdir(),'hsk-audio-check-')),runtime=path.join(root,'runtime'),originalFetch=globalThis.fetch;
const source='https://media.mandarinzone.com/wp-content/uploads/test.wav',id=createHash('sha256').update(source).digest('hex');
const bytes=Buffer.alloc(64);bytes.write('RIFF');bytes.write('WAVE',8);
let downloads=0;
try{
 await mkdir(path.join(root,'public/data/mandarin-zone'),{recursive:true});
 const manifest=path.join(root,'public/data/mandarin-zone/manifest.json');
 await writeFile(manifest,JSON.stringify({audioSources:{[id]:source}}));
 globalThis.fetch=async url=>{assert.equal(url,source);downloads++;return new Response(bytes);};
 const handler=createCommunityAudio({root,runtime});
 async function request({method='GET',range,pathname='/api/learner/community-audio/'+id+'.wav'}={}){
  const result={};
  result.handled=await handler({url:new URL('http://localhost'+pathname),req:{method,headers:{...(range?{range}:{})}},res:{writeHead(status,headers){Object.assign(result,{status,headers});},end(body){result.body=body;}},send(status,body){Object.assign(result,{status,body});}});
  return result;
 }
 const [first,second]=await Promise.all([request(),request()]);
 assert.equal(downloads,1);assert.equal(first.status,200);assert.deepEqual(first.body,bytes);assert.deepEqual(second.body,bytes);
 assert.deepEqual(await readFile(path.join(runtime,'community-audio',id+'.wav')),bytes);
 globalThis.fetch=()=>{throw Error('Cached request must not download');};
 for(const [range,start,end]of [['bytes=4-9',4,9],['bytes=60-',60,63],['bytes=-8',56,63],['bytes=60-100',60,63]]){
  const result=await request({range});assert.equal(result.status,206);assert.equal(result.headers['Content-Range'],`bytes ${start}-${end}/64`);assert.deepEqual(result.body,bytes.subarray(start,end+1));
 }
 const head=await request({method:'HEAD',range:'bytes=0-11'});assert.equal(head.status,206);assert.equal(head.headers['Content-Length'],12);assert.equal(head.body,undefined);
 for(const range of ['bytes=64-','bytes=9-2','bytes=-0','bytes=','bytes=0-1,4-5','bytes=99999999999999999-'])assert.equal((await request({range})).status,416,range);
 assert.equal((await request({method:'POST'})).status,405);
 await assert.rejects(()=>request({pathname:'/api/learner/community-audio/'+ '0'.repeat(64)+'.wav'}),error=>error.status===404);
 assert.equal((await request({pathname:'/api/learner/community-audio/../../admin-access.txt'})).handled,false);
 await writeFile(manifest,JSON.stringify({audioSources:{[id]:'https://example.com/test.wav'}}));
 await assert.rejects(()=>request(),error=>error.status===404);
 await writeFile(manifest,JSON.stringify({audioSources:{[id]:source}}));
 await rm(path.join(runtime,'community-audio',id+'.wav'));
 globalThis.fetch=async()=>new Response(bytes,{status:206});
 await assert.rejects(()=>request(),error=>error.status===502);
 globalThis.fetch=async()=>new Response('invalid WAV');
 await assert.rejects(()=>request(),error=>error.status===502);
 console.log('PASS: audio cache, concurrent download, range/seek, HEAD, invalid range, read-only route, allowlist and bad upstream');
}finally{
 globalThis.fetch=originalFetch;
 assert.equal(path.dirname(root),tmpdir());assert(path.basename(root).startsWith('hsk-audio-check-'));
 await rm(root,{recursive:true,force:true});
}
