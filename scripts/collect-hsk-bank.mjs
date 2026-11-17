import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {sha256,questionSchema} from '../shared/hsk-bank.mjs';

// A structured-data collector, not a site scraper. Every permitted URL is pinned below.
export async function fetchPinned(url,{allowed,hash,maxBytes=12_000_000,request=fetch,attempts=3}={}){
 if(!allowed.includes(url)||!url.startsWith('https://'))throw Error('SOURCE_URL_NOT_ALLOWLISTED');
 for(let attempt=1;attempt<=attempts;attempt++){
  try{const response=await request(url,{redirect:'error',signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('SOURCE_HTTP_'+response.status);const chunks=[];let size=0;for await(const chunk of response.body){size+=chunk.length;if(size>maxBytes)throw Error('SOURCE_TOO_LARGE');chunks.push(chunk);}const bytes=Buffer.concat(chunks);if(hash&&sha256(bytes)!==hash)throw Error('SOURCE_CHECKSUM_CHANGED');return {bytes,attempt,status:response.status};}
  catch(error){if(attempt===attempts||['SOURCE_CHECKSUM_CHANGED','SOURCE_TOO_LARGE'].includes(error.message))throw error;await new Promise(r=>setTimeout(r,attempt*1000));}
 }
}
export async function collect({root,offline=false,refresh=false,offset=0,limit=40,apply=false,request=fetch}={}){
 if(!Number.isInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1||limit>500)throw Error('INVALID_OFFSET_OR_LIMIT');
 const read=async file=>JSON.parse(await readFile(path.join(root,file),'utf8')),config=await read('data/sources/open-hsk.json'),sample=await read('data/editorial/hsk-mvp-sample.json'),source=sample.batches.find(b=>b.source.id==='hsk-no7z-cc-by-sa').source;
 if(!/^[a-f0-9]{40}$/.test(config.no7z.commit)||config.no7z.datasetLicense!=='CC BY-SA 4.0')throw Error('SOURCE_POLICY_CHANGED_REVIEW_REQUIRED');
 const prefix='https://raw.githubusercontent.com/no7z/hsk-sentences-audio/'+config.no7z.commit,sourceUrl=prefix+'/dist/sentences.json',evidenceUrl=prefix+'/ATTRIBUTION.md',allowed=[sourceUrl,evidenceUrl],directory=path.join(root,'.runtime/hsk-collector');await mkdir(path.join(directory,'raw'),{recursive:true});
 let bytes=await readFile(path.join(root,config.no7z.folder,'dist/sentences.json'));
 if(sha256(bytes)!==config.no7z.jsonSha256)throw Error('LOCAL_SOURCE_CHECKSUM_CHANGED');
 let evidence=await readFile(path.join(root,config.no7z.folder,'ATTRIBUTION.md')),network='OFFLINE_PINNED_CACHE';
 if(!offline){const checked=await fetchPinned(evidenceUrl,{allowed,maxBytes:100000,request});evidence=checked.bytes;network='LIVE_ATTRIBUTION_CHECKED';if(refresh){bytes=(await fetchPinned(sourceUrl,{allowed,hash:config.no7z.jsonSha256,request})).bytes;network='LIVE_DATA_AND_ATTRIBUTION_CHECKED';}}
 if(!evidence.toString('utf8').includes('整个 `dist/` 数据集以 **CC-BY-SA 4.0** 发布'))throw Error('DATA_LICENSE_EVIDENCE_CHANGED');
 const rawPath=path.join(directory,'raw',sha256(bytes)+'.json');try{const prior=await readFile(rawPath);if(!prior.equals(bytes))throw Error('IMMUTABLE_RAW_CONFLICT');}catch(error){if(error.code!=='ENOENT')throw error;await writeFile(rawPath+'.tmp',bytes);await rename(rawPath+'.tmp',rawPath);}
 const records=JSON.parse(bytes),audio=await read('public/data/open-hsk/audio-manifest.json'),bySource=new Map();
 for(const entry of Object.values(audio))for(const ref of entry.sources)if(ref.speed==='normal')bySource.set(ref.id,entry);
 const selected=records.slice(offset,offset+limit),questions=[],errors=[];
 for(const [i,record]of selected.entries()){
  const asset=bySource.get(record.id);if(!asset){errors.push({row:offset+i+1,id:record.id,error:'NO_EXISTING_LICENSED_AUDIO'});continue;}
  const result=questionSchema.safeParse({id:'hskbank-no7z-dictation-'+record.id,syllabusVersion:'hsk3-2021',level:String(record.hsk_level),skill:'listening',type:'fill-blank',promptZh:'请听录音，写出句子。',instruction:'Nghe audio và nhập câu tiếng Trung. Đây là bài chép chính tả bổ trợ, không phải dạng thi chính thức.',options:[],acceptedAnswers:[record.chinese],explanation:`Câu nguồn: ${record.chinese}\nPinyin: ${record.pinyin}\nNghĩa nguồn (Anh): ${record.translation.en}\nChấm đối chiếu câu nguồn, bỏ qua khoảng trắng và dấu câu. Nội dung và đáp án cần người duyệt.`,difficulty:'medium',scoring:'exact-text',audio:{kind:'file',src:asset.url,sha256:asset.sha256,voiceKind:'synthetic',transcript:record.chinese},vocabularyIds:[]});
  if(!result.success){errors.push({row:offset+i+1,id:record.id,error:result.error.issues.map(e=>e.message)});continue;}questions.push(result.data);
 }
 if(!questions.length)throw Error('NO_VALID_QUESTIONS_COLLECTED');
 const batch={source,questions,dryRun:!apply},report={checkedAt:new Date().toISOString(),sourceUrl,evidenceUrl,network,license:source.license,codeLicense:'MIT (not used as content license)',scope:source.scope,sourceRows:records.length,offset,requested:limit,accepted:questions.length,nextOffset:offset+selected.length<records.length?offset+selected.length:null,rawSha256:sha256(bytes),evidenceSha256:sha256(evidence),errors,robots:'Direct pinned JSON download; no HTML pages, pagination links or authenticated endpoints crawled.',terms:'Dataset permission verified from pinned ATTRIBUTION.md, not inferred from repository code license.'};
 await writeFile(path.join(directory,'batch.json'),JSON.stringify(batch,null,2)+'\n');
 if(apply){const access=await readFile(path.join(root,'.runtime/admin-access.txt'),'utf8'),token=access.trim().split(/\r?\n/).at(-1),response=await fetch('http://127.0.0.1:8787/api/hsk/admin/questions/import',{method:'POST',headers:{Origin:'http://127.0.0.1:3000',Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(batch),signal:AbortSignal.timeout(20000)}),result=await response.json();if(!response.ok)throw Error('IMPORT_FAILED: '+(result.error??response.status));report.import=result;}
 await writeFile(path.join(directory,'checkpoint.json'),JSON.stringify(report,null,2)+'\n');return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const root=path.resolve(fileURLToPath(new URL('..',import.meta.url))),value=name=>process.argv.find(a=>a.startsWith('--'+name+'='))?.split('=')[1],resume=process.argv.includes('--resume');let offset=Number(value('offset')??0);
 if(resume){const checkpoint=JSON.parse(await readFile(path.join(root,'.runtime/hsk-collector/checkpoint.json'),'utf8'));if(checkpoint.nextOffset===null)throw Error('COLLECTION_ALREADY_COMPLETE');offset=checkpoint.nextOffset;}
 const report=await collect({root,offline:process.argv.includes('--offline'),refresh:process.argv.includes('--refresh'),offset,limit:Number(value('limit')??40),apply:process.argv.includes('--apply')});
 console.log(JSON.stringify({...report,...(report.import?{import:{...report.import,duplicates:report.import.duplicates.length,nearDuplicates:report.import.nearDuplicates.length}}:{})},null,2));
}
