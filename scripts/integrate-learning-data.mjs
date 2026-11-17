import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {reading,writing} from '../data/editorial/reading-writing.mjs';

// Additive release: source curriculum, source app, SQLite, attempts and SRS are never written.
const root='data/external-hsk-research',out='public/data/learning',levels=['1','2','3','4','5','6','7-9'];
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const changed=[];
function save(file,value){
 const bytes=Buffer.from(typeof value==='string'?value:JSON.stringify(value)+'\n');
 if(fs.existsSync(file)&&fs.readFileSync(file).equals(bytes))return;
 assert(path.resolve(file).startsWith(path.resolve(out)+path.sep),'Write outside additive release');
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);changed.push(file);
}
const rows=file=>fs.readFileSync(file,'utf8').trim().split(/\r?\n/).filter(s=>s&&!s.startsWith('#')).map(s=>s.split('|'));
const glosses=new Map(rows('data/editorial/learning-glosses.tsv').map(([id,hanzi,vi])=>['cti25-v-'+id,{hanzi,vi}]));
assert.equal(glosses.size,rows('data/editorial/learning-glosses.tsv').length,'Duplicate gloss IDs');
const grammarRows=rows('data/editorial/learning-grammar.tsv');
const manifest=json(root+'/registry/normalized_manifest.json');
function records(prefix){return manifest.files.filter(f=>f.path.startsWith(prefix)).flatMap(f=>{
 const bytes=fs.readFileSync(root+'/'+f.path);assert.equal(sha(bytes),f.sha256,'Research shard changed: '+f.path);
 return bytes.toString('utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
});}
const glyphs=new Map(records('normalized/hanzi/').filter(r=>r.strokes?.length).map(r=>[r.character,r]));
const pinyin=records('normalized/pinyin/');
const radicals=records('normalized/hanzi/').filter(r=>r.kind==='RADICAL_COMPONENT');
const norm=s=>s.toLowerCase().normalize('NFC').replace(/[\s\-’'·]/g,'');
const sentences=json('public/data/open-hsk/sentences.json'),exampleIndex=new Map();
for(const s of sentences)for(const token of s.tokens){
 const key=token.word+'|'+norm(token.pinyin);const list=exampleIndex.get(key)??[];
 if(!list.some(e=>e.id===s.id))list.push(s);exampleIndex.set(key,list);
}
const original={sourceName:'HSK Journey · biên soạn có AI hỗ trợ',sourceUrl:'/data/learning/ATTRIBUTION.md',license:'CC BY-SA 4.0',reviewStatus:'NEEDS_REVIEW',linguisticReview:'AI_SELF_CHECKED_NOT_HUMAN'};
const stats={words:0,glossesAdded:0,missingVietnameseFilled:0,wordsWithExamples:0,linkedExamples:0,strokesAdded:0,grammarLessons:0,pinyinPairs:pinyin.length,radicals:radicals.length,readingPassages:reading.length,readingQuestions:0,writingPrompts:writing.length,levels:{}};
for(const level of levels){
 const words=json(`public/data/hsk3-2025-${level}-words.json`),hanzi=json(`public/data/hsk3-2025-${level}-hanzi.json`),grammar=json(`public/data/hsk3-2025-${level}-grammar.json`);
 const wordExtra={},hanziExtra={},grammarExtra={};
 for(const w of words){
  const extra={},gloss=glosses.get(w.id);
  if(gloss)assert.equal(gloss.hanzi,w.simplified,'Wrong gloss ID '+w.id);
  if(!(w.primaryMeaningVi??(w.meaningVi.length<=110?w.meaningVi.split(';')[0]:''))){
   assert(gloss?.vi,'Unresolved missing Vietnamese meaning '+w.id+' '+w.simplified);
   extra.meaning={...original,vi:gloss.vi};stats.glossesAdded++;if(!w.meaningVi.trim())stats.missingVietnameseFilled++;
  }
  // A lexical link is not a claim that the sentence belongs to the word's 2025 syllabus band.
  const candidates=(exampleIndex.get(w.simplified+'|'+norm(w.pinyin))??[]).filter(s=>s.tokens.some(t=>t.word===w.simplified&&norm(t.pinyin)===norm(w.pinyin)));
  if(candidates.length){
   extra.examples=candidates.sort((a,b)=>a.chinese.length-b.chinese.length||a.id.localeCompare(b.id)).slice(0,2).map(s=>({id:s.id,zh:s.chinese,pinyin:s.pinyin,en:s.translation.en,audioUrl:s.audio.normal.url,slowAudioUrl:s.audio.slow?.url,sourceUrl:s.provenance.source_url,sourceName:s.provenance.source_name,license:s.provenance.license,sourceRevision:s.provenance.source_version,sourceEdition:s.syllabusVersion,reviewStatus:'SOURCE_NOT_INDEPENDENTLY_REVIEWED'}));
   stats.wordsWithExamples++;stats.linkedExamples+=extra.examples.length;
  }
  if(Object.keys(extra).length)wordExtra[w.id]=extra;
 }
 for(const h of hanzi.filter(h=>!h.strokeUrl)){
  const glyph=glyphs.get(h.character);assert(glyph,'No exact glyph '+h.character);assert.equal(glyph.character,h.character);
  assert(Array.isArray(glyph.strokes)&&glyph.strokes.every(p=>typeof p==='string'&&p.startsWith('M ')));
  const url='/data/learning/strokes/'+h.character.codePointAt(0).toString(16)+'.json';
  save('public'+url,{character:h.character,strokes:glyph.strokes,...(glyph.medians?{medians:glyph.medians}:{}),provenance:{sourceUrl:glyph.sourceUrl,sourceRevision:glyph.sourceRevision,license:glyph.sourceLicense,researchId:glyph.id}});
  hanziExtra[h.id]={strokeUrl:url,strokeCount:glyph.strokes.length};stats.strokesAdded++;
 }
 for(const [band,n,title,explanationVi,zh,pinyin,vi] of grammarRows.filter(r=>r[0]===level)){
  const id=`HSK30-2025-GRA-HSK${band.replace('-','')}-${n.padStart(5,'0')}`;
  assert(grammar.some(g=>g.id===id),'Unknown grammar ID '+id);
  assert(!grammarExtra[id],'Duplicate grammar ID '+id);
  grammarExtra[id]={title,shortMeaningVi:title,explanationVi,usage:'Đọc mẫu, nhận diện thành phần của cấu trúc rồi tự đặt một câu trong tình huống tương tự.',examples:[{zh,pinyin,vi}],commonMistakes:[],supplementSource:original};stats.grammarLessons++;
 }
 stats.words+=words.length;stats.levels[level]={glosses:Object.values(wordExtra).filter(w=>w.meaning).length,wordsWithExamples:Object.values(wordExtra).filter(w=>w.examples).length,strokes:Object.keys(hanziExtra).length,grammar:Object.keys(grammarExtra).length};
 save(`${out}/level-${level}.json`,{words:wordExtra,hanzi:hanziExtra,grammar:grammarExtra});
}
save(out+'/foundation.json',{pinyin,radicals});
const provenance={source_name:original.sourceName,source_url:original.sourceUrl,source_version:'learning-supplement-2026-10-25-r1',retrieved_at:'2026-10-25',license:original.license,rights_status:'original',is_original:true,attribution:'HSK Journey; original AI-assisted supplementary texts, questions and rubrics. CC BY-SA 4.0. Not independently reviewed; not an official HSK exam.'};
const sources=[{...provenance},...json('public/data/open-hsk/manifest.json').sources];
const sets=[];
for(const level of levels){
 const passages=reading.filter(p=>p.level===level);assert.equal(passages.length,2);
 const questions=passages.flatMap((p,pi)=>p.questions.map(([promptZh,choices,index,explanation],qi)=>{
  assert(Number.isInteger(index)&&choices[index]&&new Set(choices).size===choices.length);stats.readingQuestions++;
  return {id:`journey-reading-${level}-${pi+1}-${qi+1}`,number:pi*3+qi+1,skill:'reading',part:pi+1,type:'short-passage',hskLevel:level,syllabusVersion:'unverified',difficulty:'unverified',topic:p.title,instruction:'Đọc đoạn văn và chọn đáp án. Cấp là ước lượng nội bộ; bài tham khảo có AI hỗ trợ, chưa duyệt độc lập. Dùng đáp án tham khảo để tự đối chiếu; chưa tính điểm tự động.',contextZh:p.zh,promptZh,promptVi:p.vi,options:choices.map((text,i)=>({id:'ABCD'[i],text})),correctOptionId:'ABCD'[index],explanation,scoring:'choice',answerVerified:false,answerValidation:'AI_SELF_CHECKED_NOT_HUMAN',reviewStatus:'NEEDS_REVIEW',sourceType:'AI_GENERATED',passageId:`journey-passage-${level}-${pi+1}`,provenance};
 }));
 const bank={id:'journey-reading-'+level,title:`HSK ${level} · Đọc theo đoạn · tình huống và suy luận`,version:'hsk3',levelCode:'HSK '+level,skill:'reading',skillLabel:'Đọc hiểu',topic:'Đọc theo đoạn',mode:'mini',modeLabel:'Luyện bổ trợ',totalQuestions:questions.length,durationMinutes:Math.max(8,Number(level[0])*3),durationKind:'custom',difficulty:level==='1'?'Dễ':'Trung bình',description:'Hai bài đọc nhiều câu, có giải thích căn cứ và bản dịch khi xem lời giải. Cấp ước lượng nội bộ, chưa đối chiếu chuẩn kỳ thi.',contentLabel:'Tự biên soạn có AI · chưa duyệt độc lập',provenance,isDemo:true,questions};
 const url='/data/learning/'+bank.id+'.json',bytes=JSON.stringify(bank)+'\n';save('public'+url,bytes);
 sets.push({id:bank.id,title:bank.title,version:bank.version,levelCode:bank.levelCode,totalQuestions:questions.length,durationMinutes:bank.durationMinutes,contentLabel:bank.contentLabel,sourceName:provenance.source_name,sourceUrl:provenance.source_url,license:provenance.license,syllabusVersion:'unverified',contentType:'generated_practice',description:bank.description,searchText:[bank.title,...questions.map(q=>q.topic+' '+q.contextZh+' '+q.promptZh)].join(' '),skills:{reading:questions.length},types:{'short-passage':questions.length},facets:{'reading|short-passage':questions.length},audioCount:0,answerCount:questions.length,explanationCount:questions.length,url,sha256:sha(bytes)});
}
const responses=writing.map(([level,topic,promptZh,instruction,sampleAnswer,rubric],i)=>({id:`journey-writing-${level}-${i%2+1}`,number:i+1,skill:'writing',part:1,type:'short-answer',hskLevel:level,syllabusVersion:'unverified',topic,promptZh,instruction,responseHint:'Các độ dài là mục tiêu luyện nội bộ. Có thể lưu bản nháp rồi quay lại; tự đánh giá không tạo điểm HSK.',sampleAnswer,rubric,options:[],scoring:'manual',reviewStatus:'NEEDS_REVIEW',sourceType:'AI_GENERATED',provenance}));
save(out+'/responses.json',responses);
save(out+'/manifest.json',{version:1,sets,totals:stats,sources});
save(out+'/ATTRIBUTION.md',`# Học liệu bổ sung HSK Journey\n\nBản phát hành 2026-10-25-r1.\n\n- Nghĩa Việt bổ sung, các bài ngữ pháp, 14 đoạn đọc, 42 câu đọc và 14 đề viết/rubric: HSK Journey, biên soạn có AI hỗ trợ, CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/). Chưa được duyệt ngôn ngữ độc lập. Cấp đọc/viết là ước lượng nội bộ, không gán cho syllabus 2025 hoặc mô phỏng đề chính thức. Nghĩa nguồn và ID/cấp hiện có được giữ nguyên; nghĩa bổ sung chỉ dùng khi nghĩa ngắn gốc trống (552 mục thiếu nghĩa Việt và 187 mục chỉ có chú thích từ điển hoặc nghĩa dài).\n- Ví dụ và audio: no7z/Jayoung, CC BY-SA 4.0; nguồn https://github.com/no7z/hsk-sentences-audio tại 857dfbab91027ebd97df01260e91b817cb6b4854. Ví dụ theo GF0025-2021, chỉ liên kết từ theo chữ và pinyin, không chuyển cấp sang 2025. Audio tổng hợp CosyVoice2. Xem /data/open-hsk/NO7Z_ATTRIBUTION.md và /data/open-hsk/LICENSES.md. Các câu và MP3 giữ ở bản phát hành cũ, không sao chép lại audio.\n- 99 mẫu nét chính xác: hanzi-writer-data / Make Me a Hanzi, Arphic Public License, bản nguồn 68d10a4b21150cae5e1ebbd223eed289cf32d90c. Giấy phép đầy đủ: /ARPHICPL.TXT. Không thay mẫu giản thể bằng mẫu phồn thể.\n- 10 cặp pinyin và 50 bài bộ thủ/thành phần: tái sử dụng cục bộ có sự cho phép của người dùng từ HocTiengTrungApp; giữ nguồn, hash và trạng thái EDITORIAL_DRAFT trong foundation.json. Không suy ra giấy phép phát hành công khai cho nội dung cục bộ.\n\nDữ liệu JSON dẫn xuất trong bản phát hành này được cung cấp tại /data/learning/. Nguồn ban đầu trong data/external-hsk-research giữ nguyên. Không nhập hay sửa SQLite và không tự đánh dấu Human Review.\n`);
console.log(JSON.stringify({changed:changed.length,...stats},null,2));
