import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
const file='data/staging/v4/hsk1-release.json';const bundle=JSON.parse(await readFile(file,'utf8'));
await mkdir('.runtime/v4-audio',{recursive:true});
for(const audio of bundle.audio){
 const output=path.resolve('.runtime/v4-audio/'+audio.id+'.wav');
 const result=spawnSync(path.resolve('.runtime/tts/engine/piper/piper.exe'),['--model',path.resolve('.runtime/tts/zh_CN-huayan-medium.onnx'),'--output_file',output,'--length_scale','1.1'],{input:audio.transcript+'\n',encoding:'utf8',windowsHide:true,timeout:60000,maxBuffer:1024*1024});
 if(result.status!==0)throw Error(result.stderr||result.error?.message||'TTS failed');
 const bytes=await readFile(output);if(bytes.toString('ascii',0,4)!=='RIFF')throw Error('Expected WAV');
 let offset=12,dataLength=0,byteRate=0,sampleRate=0;while(offset+8<=bytes.length){const type=bytes.toString('ascii',offset,offset+4),size=bytes.readUInt32LE(offset+4);if(type==='fmt '){byteRate=bytes.readUInt32LE(offset+16);sampleRate=bytes.readUInt32LE(offset+12);}if(type==='data')dataLength=size;offset+=8+size+(size%2);}
 if(!dataLength||!byteRate)throw Error('Empty WAV '+audio.id);
 audio.durationMs=Math.round(dataLength/byteRate*1000);audio.storageUrl='/api/admin/v4/audio/'+audio.id;audio.assetStatus='RENDERED';audio.contentHash=createHash('sha256').update(bytes).digest('hex');audio.bytes=(await stat(output)).size;audio.sampleRate=sampleRate;audio.generatedAt=new Date().toISOString();audio.mediaValidation={method:'RIFF header and nonempty PCM; browser decode still required',status:'HEADER_VALIDATED',humanListened:false};
 const q=bundle.questions.find(q=>q.audioAssetId===audio.id);q.audio={kind:'file',src:audio.storageUrl};q.audioDurationSeconds=audio.durationMs/1000;
 console.log(audio.id+' '+audio.durationMs+'ms');
}
await writeFile(file,JSON.stringify(bundle,null,2));
