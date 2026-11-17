import {readFile,writeFile} from 'node:fs/promises';
const file='scripts/build-v5-content.mjs';let s=await readFile(file,'utf8');s=s.replace("import {readFile,writeFile,mkdir}","import {readFile,writeFile,mkdir,access}").replace('createTokenizer,questionDiagnostics,riskFor,pcmMetrics','createTokenizer,questionDiagnostics,riskFor,pcmMetrics,digest');
s=s.replace("const newId=a.id.replace('v4-audio-','v5-audio-');", "const newId=a.id.replace('v4-audio-','v5-audio-')+'-'+digest([a.transcript,a.provider,a.voice,'length_scale=1.1']).slice(0,12);");
s=s.replace("const run=spawnSync(path.resolve('.runtime/tts/engine/piper/piper.exe')", "let exists=false;try{await access(output);exists=true;}catch{}const run=exists?{status:0}:spawnSync(path.resolve('.runtime/tts/engine/piper/piper.exe')");await writeFile(file,s);
const service='server/v5-content-service.mjs';let v=await readFile(service,'utf8');v=v.replace('/^v5-audio-\\d{3}$/','/^v5-audio-\\d{3}(?:-[a-f0-9]{12})?$/');await writeFile(service,v);
const server='server/admin-server.mjs';let a=await readFile(server,'utf8');a=a.replace("if(failure&&failure.until>Date.now()&&failure.count>=30)","if(!authorized(req)&&failure&&failure.until>Date.now()&&failure.count>=30)");await writeFile(server,a);
console.log('Audio keyed by transcript/provider settings and reused without overwriting; valid credentials not locked by failed attempts.');
