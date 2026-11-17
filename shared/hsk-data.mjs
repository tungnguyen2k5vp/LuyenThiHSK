import {createHash} from 'node:crypto';
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export const normalizeText=text=>String(text??'').normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]/gu,'');
export function questionFingerprint(q){
 const option=o=>[normalizeText(o.text),o.image?.contentHash??o.image?.assetId??''];
 return sha256(JSON.stringify([q.skill,q.type,normalizeText(q.promptZh),normalizeText(q.contextZh),q.audio?.transcript?normalizeText(q.audio.transcript):q.audio?.sha256??q.audio?.src??'',q.image?.contentHash??q.image?.assetId??'',q.options.map(option).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),q.matching??option(q.options.find(o=>o.id===q.correctOptionId)??{text:q.correctAnswer??q.acceptedAnswers?.join('|')??q.sampleAnswer??''})]));
}
// ponytail: one-edit prompt candidates only; add semantic review when a curated duplicate set exists.
export function nearDuplicateQuestions(questions){
 const signatures=new Map(),pairs=new Set(),possible=[];
 const oneEdit=(a,b)=>{if(a.length===b.length){let differences=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])differences++;return differences===1;}const [short,long]=a.length<b.length?[a,b]:[b,a];let i=0;while(short[i]===long[i]&&i<short.length)i++;return long.length===short.length+1&&short.slice(i)===long.slice(i+1);};
 for(const q of questions){const prompt=normalizeText(q.promptZh);if(prompt.length<12)continue;
  const variants=new Set([prompt,...Array.from({length:prompt.length},(_,i)=>prompt.slice(0,i)+prompt.slice(i+1))]);
  for(const variant of variants){const key=q.skill+'|'+q.type+'|'+variant,earlier=signatures.get(key)??new Map();
   for(const [text,prior]of earlier){if(text===prompt||!oneEdit(text,prompt))continue;const pair=[prior,q.id].sort().join('|');if(!pairs.has(pair)){pairs.add(pair);possible.push({ids:[prior,q.id],reason:'ONE_EDIT_NORMALIZED_PROMPT_REVIEW_ONLY'});}}
   if(!earlier.has(prompt))earlier.set(prompt,q.id);signatures.set(key,earlier);
  }
 }
 return possible;
}
export function dedupeQuestions(banks){
 const seen=new Map(),aliases={},provenance={},possible=[],prompts=new Map();let read=0;
 for(const bank of banks){const keep=[];for(const q of bank.questions){read++;const key=questionFingerprint(q),prior=seen.get(key);if(prior&&prior.id!==q.id){aliases[q.id]=prior.id;(provenance[prior.id]??=[prior.provenance]).push(q.provenance);continue;}if(prior)continue;seen.set(key,q);keep.push(q);const prompt=[q.skill,q.type,normalizeText(q.promptZh)].join(':');if(normalizeText(q.promptZh).length>=8){const earlier=prompts.get(prompt);if(earlier&&earlier.id!==q.id)possible.push({ids:[earlier.id,q.id],reason:'SAME_NORMALIZED_PROMPT_DIFFERENT_CONTEXT_OPTIONS_KEY_OR_AUDIO'});else prompts.set(prompt,q);}}bank.questions=keep.map((q,i)=>({...q,number:i+1}));bank.totalQuestions=keep.length;}
 const near=nearDuplicateQuestions([...seen.values()]);
 return{read,unique:seen.size,exactOrFormattingDuplicates:Object.keys(aliases).length,aliases,provenance,nearDuplicateCandidates:near.length,possible_duplicates:[...possible,...near]};
}
export function inspectAudio(bytes){
 if(bytes.length>=44&&bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WAVE'){
  let rate=0,size=0;for(let p=12;p+8<=bytes.length;){const n=bytes.readUInt32LE(p+4),tag=bytes.toString('ascii',p,p+4);if(tag==='fmt '&&n>=16&&p+24<=bytes.length)rate=bytes.readUInt32LE(p+16);if(tag==='data')size=Math.min(n,bytes.length-p-8);p+=8+n+(n%2);}
  if(rate>0&&size>0)return{mime:'audio/wav',durationSeconds:size/rate,bytes:bytes.length,sha256:sha256(bytes)};
 }
 let start=0;if(bytes.toString('ascii',0,3)==='ID3'&&bytes.length>=10)start=10+((bytes[6]&127)*2097152+(bytes[7]&127)*16384+(bytes[8]&127)*128+(bytes[9]&127));
 let duration=0,frames=0;
 for(let p=start;p+4<=bytes.length;){const h=bytes.readUInt32BE(p),version=(h>>>19)&3,layer=(h>>>17)&3,bi=(h>>>12)&15,si=(h>>>10)&3;if((h>>>21)!==2047||version===1||layer!==1||bi===0||bi===15||si===3){p++;continue;}const rate=[44100,48000,32000][si]/(version===3?1:version===2?2:4),kbps=(version===3?[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320]:[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160])[bi],size=Math.floor((version===3?144:72)*kbps*1000/rate)+((h>>>9)&1);if(p+size>bytes.length)break;duration+=(version===3?1152:576)/rate;frames++;p+=size;}
 if(frames<2||duration<=0)throw Error('INVALID_OR_TRUNCATED_AUDIO');return{mime:'audio/mpeg',durationSeconds:duration,bytes:bytes.length,sha256:sha256(bytes)};
}
