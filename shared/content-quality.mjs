import {validateRegisteredQuestion} from './question-types.mjs';
export const SOURCE_TYPES=['OFFICIAL_SAMPLE','LICENSED','COMMUNITY','ORIGINAL','AI_GENERATED','INTERNAL'];
export const minimumQuestionCoverage={levels:['1','2','3','4','5','6','7-9'],perSkill:20,perTypeDifficulty:5,note:'Internal product target; not a CTI syllabus requirement'};
const present=v=>typeof v==='string'&&Boolean(v.trim());
const strings=v=>Array.isArray(v)&&v.every(x=>typeof x==='string');
// Verified facts, not redistributed questions. Closed gate for editions without an approved reference.
export const fullTemplateReferences={
 'hsk2-2015:4':{sourceUrl:'https://www.chinesetest.cn/HSK/4',checkedAt:'2026-10-15',administrationMinutes:10,sections:[
  {skill:'listening',count:45,durationMinutes:30,parts:[{part:1,type:'true-false',count:10},{part:2,type:'multiple-choice',count:15},{part:3,type:'multiple-choice',count:20}]},
  {skill:'reading',count:40,durationMinutes:40,parts:[{part:1,type:'fill-blank',count:10},{part:2,type:'sentence-order',count:10},{part:3,type:'multiple-choice',count:20}]},
  {skill:'writing',count:15,durationMinutes:25,parts:[{part:1,type:'sentence-order',count:10},{part:2,type:'short-answer',count:5}]},
 ]},
};
export function licenseIssues(p){
  const errors=[];
  if(!present(p.license)||/unknown|unverified|chưa xác|không rõ|LicenseUnknown|requires.*review/i.test(p.license))errors.push('LicenseUnknown: giấy phép chưa xác minh');
  if(p.licenseStatus!=='VERIFIED')errors.push('Cần xác minh quyền phân phối (licenseStatus VERIFIED)');
  if(!present(p.licenseEvidenceUrl)||!/^https:\/\/|^local:permission\//.test(p.licenseEvidenceUrl))errors.push('Thiếu bằng chứng quyền phân phối');
  if(/\bNC\b|non.?commercial/i.test(p.license))errors.push('License phi thương mại không dùng cho release này');
  return errors;
}
export function questionFingerprint(p){return String(p.promptZh??p.prompt??'').normalize('NFC').replace(/[\s，。！？,.!?_]/g,'').toLowerCase()+'|'+(p.contextZh??'').normalize('NFC').replace(/\s/g,'');}
export function questionIssues(p,context={}){
  if(!p||typeof p!=='object')return['Question payload cần object'];
  const errors=licenseIssues(p);
  for(const key of ['syllabusVersion','level','skill','section','questionType','sourceName','sourceUrl','explanation'])if(!present(p[key]))errors.push('Thiếu '+key);
  if(!SOURCE_TYPES.includes(p.sourceType))errors.push('Source type chưa chuẩn V3');
  if(p.sourceType==='OFFICIAL_SAMPLE'&&!/^https:\/\/([^/]+\.)?(chinesetest\.cn|ufileos\.com)\//.test(p.sourceUrl??''))errors.push('OFFICIAL_SAMPLE cần nguồn CTI được kiểm tra');
  if(!['hsk2-2015','hsk3-2021','hsk3-2025'].includes(p.syllabusVersion)||!['1','2','3','4','5','6','7-9'].includes(p.level))errors.push('Edition/cấp chưa xác minh');
  if(!['easy','medium','hard'].includes(p.difficulty))errors.push('Difficulty phải là easy/medium/hard');
  if(p.questionType!==p.type)errors.push('questionType khác engine type');
  for(const key of ['topicIds','grammarIds','vocabularyIds','hanziIds'])if(!strings(p[key]))errors.push(key+' cần mảng ID');
  if(!p.topicIds?.length||!p.vocabularyIds?.length)errors.push('Cần ít nhất topic và vocabulary tag');
  if(!(Number.isFinite(p.estimatedTimeSeconds)&&p.estimatedTimeSeconds>0&&p.estimatedTimeSeconds<=3600))errors.push('Estimated time không hợp lệ');
  for(const key of ['promptZh','explanation','promptPinyin'])if(p[key]&&p[key]!==p[key].normalize('NFC'))errors.push(key+' chưa Unicode NFC');
  if(p.promptPinyin&&/[0-5]/.test(p.promptPinyin))errors.push('Pinyin phải chuyển sang dấu thanh trước công bố');
  const options=Array.isArray(p.options)?p.options:[];
  if(new Set(options.map(o=>String(o.text).normalize('NFC').trim().toLowerCase())).size!==options.length)errors.push('Trùng nghĩa lựa chọn');
  if(p.scoring==='manual'){if(!p.rubric?.length||!present(p.sampleAnswer))errors.push('Câu mở cần rubric và sample answer đã duyệt');}
  else if(p.scoring==='exact-text'){if(!p.acceptedAnswers?.length||!p.answerVerified)errors.push('Thiếu accepted answers đã duyệt');}
  else if(p.matching?.items){errors.push(...validateRegisteredQuestion(p));if(!p.answerVerified)errors.push('Matching answer chưa duyệt');}else if(options.length<2||!options.some(o=>o.id===p.correctOptionId)||!p.answerVerified)errors.push('Đáp án chưa hợp lệ/duyệt');
  if(!present(p.promptZh)||!present(p.instruction))errors.push('Thiếu câu/hướng dẫn');
  if((context.questions??[]).some(q=>q.id!==p.id&&questionFingerprint(q)===questionFingerprint(p)))errors.push('Trùng nội dung câu khác');
  for(const key of ['vocabularyIds','grammarIds','topicIds','hanziIds'])if(context.references?.[key])for(const id of p[key]??[])if(!context.references[key].has(id))errors.push(key+': ID không tồn tại '+id);
  if(p.skill==='listening'){
    const audio=(context.audio??[]).find(a=>a.id===p.audioAssetId&&a.reviewStatus==='PUBLISHED');
    if(!audio)errors.push('Listening thiếu AudioAsset Published');
    else{errors.push(...audioIssues(audio));if(p.audio?.src!==audio.storageUrl)errors.push('Audio URL khác revision đã duyệt');}
  }
  return [...new Set(errors)];
}
export function grammarIssues(p){
  const errors=licenseIssues(p);
  for(const key of ['grammarPointId','title','shortMeaningVi','pattern','usage','explanationVi'])if(!present(p[key]))errors.push('Grammar lesson thiếu '+key);
  if(!p.examples?.length||p.examples.some(e=>!present(e.zh)||!present(e.pinyin)||!present(e.vi)))errors.push('Examples cần câu, pinyin và nghĩa Việt');
  if(!strings(p.commonMistakes)||!p.commonMistakes.length)errors.push('Thiếu lỗi thường gặp');
  for(const key of ['comparisons','prerequisites','relatedGrammarIds','relatedQuestionIds'])if(!strings(p[key]))errors.push('Thiếu mảng '+key);
  return errors;
}
export function audioIssues(p){
  const errors=licenseIssues(p);
  for(const key of ['title','sourceName','sourceUrl','storageUrl','transcript','accent','contentHash'])if(!present(p[key]))errors.push('Audio thiếu '+key);
  if(!/^\/api\/media\/[a-f0-9]{64}\.(wav|mp3|ogg|webm|m4a)$/.test(p.storageUrl??''))errors.push('Audio cần upload thành asset nội bộ đã kiểm tra');
  if(!/^[a-f0-9]{64}$/.test(p.contentHash??''))errors.push('Audio hash không hợp lệ');
  if(p.storageUrl?.split('/').pop()?.split('.')[0]!==p.contentHash)errors.push('Audio hash khác file được gắn');
  if(!(p.durationMs>0)||!(p.speakerCount>=1)||!Array.isArray(p.speakerMetadata))errors.push('Audio thiếu thời lượng/speaker');
  if(['AI_GENERATED','SYNTHETIC','TTS'].includes(p.sourceType)||p.isTts===true)errors.push('Audio thi không dùng TTS');
  if(p.mediaValidation?.playable!==true)errors.push('Audio chưa được kiểm tra playable bằng browser');
  if(p.mediaValidation?.durationMs&&Math.abs(p.mediaValidation.durationMs-p.durationMs)>1000)errors.push('Duration khác kết quả decoder');
  if(contextFileMissing(p))errors.push('File audio không còn tồn tại');
  return errors;
}
function contextFileMissing(p){return p.fileExists===false;}
export function coverageMatrix(questions,config=minimumQuestionCoverage){
  const rows=new Map();
  for(const q of questions){const key=[q.level??'unverified',q.skill,q.questionType??q.type,q.difficulty??'unverified'].join('|');const row=rows.get(key)??{level:q.level??'unverified',skill:q.skill,type:q.questionType??q.type,difficulty:q.difficulty??'unverified',published:0,needsReview:0,missingAudio:0,missingExplanation:0};if(q.reviewStatus==='PUBLISHED')row.published++;else row.needsReview++;if(q.skill==='listening'&&!q.audioAssetId)row.missingAudio++;if(!q.explanation)row.missingExplanation++;rows.set(key,row);}
  return{config,rows:[...rows.values()].sort((a,b)=>a.level.localeCompare(b.level)||a.skill.localeCompare(b.skill)),levels:config.levels.map(level=>({level,status:['listening','reading','writing'].every(skill=>questions.filter(q=>q.level===level&&q.skill===skill&&q.reviewStatus==='PUBLISHED').length>=config.perSkill)?'Ready':'Needs More Content'}))};
}
function random(seed){let state=2166136261;for(const c of String(seed))state=Math.imul(state^c.charCodeAt(0),16777619)>>>0;return()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};}
export function validateTemplate(t){
  const errors=[];if(!t.id||!['full','mini','skill','drill'].includes(t.mockType))errors.push('Template cần ID/type');
  if(!['hsk2-2015','hsk3-2021','hsk3-2025'].includes(t.syllabusVersion)||!['1','2','3','4','5','6','7-9'].includes(t.level))errors.push('Template cần edition/cấp xác định');
  if(!Array.isArray(t.sections)||!t.sections.length)return[...errors,'Template thiếu sections'];
  const sectionSkills=t.sections.map(s=>s.skill);if(new Set(sectionSkills).size!==sectionSkills.length)errors.push('Section skill bị trùng');
  for(const s of t.sections)if(!['listening','reading','writing','translation','speaking'].includes(s.skill)||!Number.isInteger(s.count)||s.count<1||!(s.durationMinutes>0)||!s.questionTypes?.length||!(s.scoreWeight>0))errors.push('Section count/time/type/scoring không hợp lệ');
  if(Math.abs(t.sections.reduce((n,s)=>n+s.scoreWeight,0)-1)>.0001)errors.push('Tổng scoreWeight phải bằng 1');
  if(t.mockType==='full'&&(!t.verifiedAgainstCti||!/^https:\/\/(www\.)?chinesetest\.cn\//.test(t.sourceUrl??'')||!t.verificationNote||!t.verifiedAt))errors.push('Full template chưa đối chiếu CTI');
  if(t.mockType==='full'){
    const reference=fullTemplateReferences[t.syllabusVersion+':'+t.level];
    if(!reference)errors.push('Chưa có reference full template đã duyệt cho edition/cấp này');
    else{if((t.administrationMinutes??0)!==reference.administrationMinutes||t.sections.length!==reference.sections.length)errors.push('Full template thời gian thủ tục/số section sai');for(const [i,expected] of reference.sections.entries()){const actual=t.sections[i];if(!actual||actual.skill!==expected.skill||actual.count!==expected.count||actual.durationMinutes!==expected.durationMinutes||JSON.stringify(actual.parts)!==JSON.stringify(expected.parts))errors.push('Full template section/part quota khác nguồn CTI: '+expected.skill);}}
  }
  return errors;
}
export function generateMock(template,pool,seed){
  const errors=validateTemplate(template);if(errors.length)return{errors};
  const rng=random(seed);const selected=[];const ids=new Set();const fingerprints=new Set();const passages=new Set();const patterns=new Map();
  for(const section of template.sections){
    const candidates=pool.filter(q=>q.reviewStatus==='PUBLISHED'&&q.level===template.level&&q.syllabusVersion===template.syllabusVersion&&q.skill===section.skill&&section.questionTypes.includes(q.type)&&(!section.difficulties?.length||section.difficulties.includes(q.difficulty))).sort((a,b)=>a.id.localeCompare(b.id)).map(q=>({q,rank:rng()})).sort((a,b)=>a.rank-b.rank).map(x=>x.q);
    let count=0;const partCounts=new Map();
    for(const q of candidates){const fingerprint=questionFingerprint(q);const pattern=(q.grammarIds??[]).join('|');const quota=section.parts?.find(p=>p.part===q.part&&p.type===q.type);const partKey=q.part+':'+q.type;if(section.parts&&(!quota||(partCounts.get(partKey)??0)>=quota.count))continue;if(ids.has(q.id)||fingerprints.has(fingerprint)||q.passageId&&passages.has(q.passageId)||pattern&&(patterns.get(pattern)??0)>=(template.maxSameGrammar??4))continue;
      ids.add(q.id);fingerprints.add(fingerprint);if(q.passageId)passages.add(q.passageId);if(pattern)patterns.set(pattern,(patterns.get(pattern)??0)+1);partCounts.set(partKey,(partCounts.get(partKey)??0)+1);selected.push(q);if(++count===section.count)break;
    }if(count<section.count)errors.push(section.skill+': chỉ chọn được '+count+'/'+section.count+' câu Published không trùng');
  }
  if(errors.length)return{errors};
  return{errors:[],questions:selected.map((q,i)=>({...q,number:i+1})),lockedQuestions:selected.map(q=>({id:q.id,revision:q.revision})),seed:String(seed)};
}
export function mockIssues(exam,template,pool,audio){
  const errors=validateTemplate(template);const questions=exam.questions??[];
  if(exam.templateRevision!==template.revision)errors.push('Template revision chưa được khóa đúng');
  if(exam.mode==='full'&&template.mockType!=='full')errors.push('Mini template không được gọi full');
  if(exam.syllabusVersion!==template.syllabusVersion||exam.level!==template.level)errors.push('Edition/cấp khác template');
  if(!exam.seed||!Array.isArray(exam.lockedQuestions)||exam.lockedQuestions.length!==questions.length)errors.push('Thiếu seed/revision lock');
  if(new Set(questions.map(q=>q.id)).size!==questions.length||new Set(questions.map(questionFingerprint)).size!==questions.length)errors.push('Đề có câu trùng');
  for(const q of questions){const lock=exam.lockedQuestions?.find(x=>x.id===q.id);const found=pool.find(x=>x.id===q.id&&x.revision===lock?.revision&&x.reviewStatus==='PUBLISHED');if(!found)errors.push(q.id+': revision không Published');else if(JSON.stringify({...q,number:0})!==JSON.stringify({...found,number:0}))errors.push(q.id+': snapshot khác revision đã khóa');errors.push(...questionIssues(q,{questions:pool,audio}));}
  if(questions.length!==template.sections.reduce((n,s)=>n+s.count,0))errors.push('Tổng câu không khớp template');
  for(const s of template.sections)if(questions.filter(q=>q.skill===s.skill&&s.questionTypes.includes(q.type)).length!==s.count)errors.push(s.skill+': số câu/dạng không khớp');
  for(const s of template.sections)for(const p of s.parts??[])if(questions.filter(q=>q.skill===s.skill&&q.part===p.part&&q.type===p.type).length!==p.count)errors.push(s.skill+': part quota sai');
  if(exam.durationMinutes!==template.sections.reduce((n,s)=>n+s.durationMinutes,0)+(template.administrationMinutes??0))errors.push('Thời gian không khớp template');
  if(exam.config?.sections?.length!==template.sections.length)errors.push('Runtime sections không khớp');
  if(questions.some(q=>q.skill==='listening')&&(exam.config?.audio?.kind!=='file'||exam.config.audio.delivery!=='question'))errors.push('Mock nghe cần audio file từng câu đã kiểm tra; section delivery chưa được hỗ trợ bởi builder này');
  else for(const [i,s]of template.sections.entries()){const actual=exam.config.sections[i];if(actual.skill!==s.skill||actual.durationMinutes!==s.durationMinutes||JSON.stringify(actual.questionIds)!==JSON.stringify(questions.filter(q=>q.skill===s.skill).map(q=>q.id)))errors.push('Runtime section/order/time sai');}
  if(template.audioRules&&JSON.stringify(exam.config?.audio)!==JSON.stringify(template.audioRules))errors.push('Runtime audio rules khác template');
  return[...new Set(errors)];
}
