import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {sha256} from '../shared/hsk-data.mjs';
const config=JSON.parse(await readFile('data/sources/open-hsk.json','utf8')),offline=process.argv.includes('--offline'),log=[];
async function download(url,file,hash,max){
 try{const bytes=await readFile(file);if(sha256(bytes)===hash){log.push({url,file,result:'CACHED',sha256:hash});return;}throw Error('Existing source checksum differs; kept existing file.');}catch(e){if(e.code!=='ENOENT')throw e;}
 if(offline)throw Error('Offline source missing: '+file);
 for(let attempt=1;attempt<=3;attempt++){try{const r=await fetch(url,{signal:AbortSignal.timeout(180000)});if(!r.ok)throw Error('HTTP '+r.status);const chunks=[];let size=0;for await(const chunk of r.body){size+=chunk.length;if(size>max)throw Error('SOURCE_TOO_LARGE');chunks.push(chunk);}const bytes=Buffer.concat(chunks);if(sha256(bytes)!==hash)throw Error('Upstream changed; review and pin new version before importing.');await mkdir(path.dirname(file),{recursive:true});await writeFile(file+'.tmp',bytes);await rename(file+'.tmp',file);log.push({url,file,status:r.status,mime:r.headers.get('content-type'),bytes:size,sha256:hash,attempt});return;}catch(error){if(attempt===3)throw error;await new Promise(r=>setTimeout(r,attempt*1000));}}
}
await download(config.no7z.archiveUrl,config.no7z.folder+'/source.zip',config.no7z.archiveSha256,250*1024*1024);
try{const bytes=await readFile(config.no7z.folder+'/dist/sentences.json');if(sha256(bytes)!==config.no7z.jsonSha256)throw Error('Extracted source changed; not overwriting.');}catch(e){if(e.code!=='ENOENT')throw e;execFileSync('tar',['-xf',path.resolve(config.no7z.folder,'source.zip'),'-C',path.resolve(config.no7z.folder),'--strip-components','1']);}
await new Promise(r=>setTimeout(r,300));
await download(config.hearmandarin.downloadUrl,config.hearmandarin.file,config.hearmandarin.sha256,10*1024*1024);
await mkdir('.runtime',{recursive:true});await writeFile('.runtime/open-hsk-fetch.json',JSON.stringify({at:new Date().toISOString(),offline,files:log},null,2));console.log(JSON.stringify(log,null,2));
