import {questionTypeRegistry,validateRegisteredQuestion} from '../shared/question-types.mjs';
export const KINDS=['vocabulary','grammar','hanzi','questions','exams','audio','templates','images','optionBanks'];
export const STATUSES=['DRAFT','NEEDS_REVIEW','LANGUAGE_REVIEW','HSK_LEVEL_REVIEW','APPROVED','PUBLISHED','ARCHIVED'];
export function validateRecord(kind,p){
  const errors=[];
  if(!KINDS.includes(kind))errors.push('Loại nội dung không hợp lệ');
  if(!p||typeof p!=='object'||Array.isArray(p))return['Payload phải là object'];
  for(const key of ['options','questions','rubric','meaningsEn','pos','topicIds','grammarIds','vocabularyIds','hanziIds','sections','examples','commonMistakes','relatedQuestionIds'])if(p[key]!==undefined&&!Array.isArray(p[key]))errors.push(key+' phải là mảng');
  if(p.options?.some?.(o=>!o||typeof o.id!=='string'||typeof o.text!=='string'))errors.push('Option cần id và text dạng chuỗi');
  if(p.questions?.some?.(q=>!q||typeof q!=='object'||typeof q.id!=='string'))errors.push('Question item không hợp lệ');
  if(errors.length)return errors;
  for(const key of ['id','syllabusVersion','source','sourceType','sourceUrl','license'])if(typeof p[key]!=='string'||!p[key].trim())errors.push('Thiếu '+key);
  if(typeof p.id==='string'&&!/^[\w:.-]{1,160}$/.test(p.id)&&!p.id.startsWith('cti25-h-'))errors.push('ID chỉ nhận chữ Latin, số, _, :, ., -');
  if(!['hsk2-2015','hsk3-2021','hsk3-2025','unverified'].includes(p.syllabusVersion))errors.push('Syllabus không nhận diện');
  if(!['1','2','3','4','5','6','7-9'].includes(p.level)&&!(kind==='questions'&&p.level==='unverified'))errors.push('Cấp HSK không hợp lệ');
  if(p.syllabusVersion==='hsk2-2015'&&p.level==='7-9')errors.push('HSK 2.0 không có nhóm 7–9');
  if(!['OFFICIAL','COMMUNITY','ORIGINAL','GENERATED','AI_GENERATED','OFFICIAL_SAMPLE','LICENSED','INTERNAL',...(kind==='audio'?['SYNTHETIC','TTS','HUMAN_RECORDED']:[])].includes(p.sourceType))errors.push('sourceType không hợp lệ');
  if(typeof p.sourceUrl!=='string'||!/^https?:\/\/|^local:/.test(p.sourceUrl))errors.push('URL nguồn không hợp lệ');
  if(p.sourceType==='OFFICIAL'&&!/^https:\/\/([^/]+\.)?(chinesetest\.cn|ufileos\.com)\//.test(p.sourceUrl??''))errors.push('OFFICIAL cần nguồn CTI');
  if(kind==='vocabulary'){
    if(!/\p{Script=Han}/u.test(p.simplified??''))errors.push('Thiếu Hanzi');
    if(typeof p.pinyin!=='string'||!/[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(p.pinyin))errors.push('Thiếu hoặc sai pinyin');
    if(!p.meaningVi&&!p.meaningsEn?.length)errors.push('Thiếu nghĩa');
  }
  if(kind==='grammar'&&(typeof p.pattern!=='string'||!p.pattern.trim()))errors.push('Thiếu cấu trúc');
  if(kind==='hanzi'&&!/^\p{Script=Han}$/u.test(p.character??''))errors.push('Hanzi cần một ký tự');
  if(kind==='audio'){
    if(!/^https:\/\/|^\/audio\/|^\/api\/media\/|^\/api\/admin\/v(?:[456]|10)\/(audio|recording)\//.test(p.storageUrl??p.url??''))errors.push('Audio cần URL HTTPS hoặc asset nội bộ');
    if(!((p.durationMs??p.duration)>0))errors.push('Thiếu thời lượng audio');
    if(!p.transcript)errors.push('Thiếu transcript');
  }
  if(kind==='questions'){
    if(!questionTypeRegistry[p.type])errors.push('Dạng câu không hợp lệ');
    if(!Number.isInteger(p.number)||p.number<1||!Number.isInteger(p.part)||p.part<1)errors.push('Question number/part phải là số nguyên dương');
    if(!p.promptZh||!p.instruction||!p.explanation)errors.push('Thiếu prompt/hướng dẫn/giải thích');
    if(!['listening','reading','writing','translation','speaking'].includes(p.skill))errors.push('Kỹ năng không hợp lệ');
    const open=['short-answer','speaking'].includes(p.type);
    if(open&&!p.rubric?.length)errors.push('Câu mở thiếu rubric');
    if(p.partId||p.matching||p.image)errors.push(...validateRegisteredQuestion(p));
    if(!open&&!p.matching?.items&&!(p.scoring==='exact-text'&&p.acceptedAnswers?.length)&&(!p.options?.length||!p.options.some(o=>o.id===p.correctOptionId)))errors.push('Thiếu đáp án hoặc đáp án không thuộc options');
    if(p.options&&new Set(p.options.map(o=>o.text.trim().normalize('NFC').toLowerCase())).size!==p.options.length)errors.push('Đáp án lựa chọn bị trùng');
    if(p.options&&new Set(p.options.map(o=>o.id)).size!==p.options.length)errors.push('ID lựa chọn bị trùng');
  }
  if(kind==='images')for(const f of ['assetId','altText','contentHash','storageUrl'])if(!p[f])errors.push('Image thiếu '+f);
  if(kind==='images'&&(!Number.isInteger(p.width)||!Number.isInteger(p.height)||p.width<1||p.height<1))errors.push('Kích thước ảnh không hợp lệ');
  if(kind==='optionBanks'&&(!p.options?.length||!p.partId||p.orderPolicy!=='FIXED_PER_REVISION'))errors.push('Nhóm lựa chọn thiếu options/part/chính sách thứ tự');
  if(kind==='exams'){
    if(!p.title||!Array.isArray(p.questions)||!p.questions.length||p.totalQuestions!==p.questions.length||!(p.durationMinutes>0))errors.push('Đề thiếu title/câu/thời lượng hoặc tổng câu sai');
    if(p.questions&&new Set(p.questions.map(q=>q.id)).size!==p.questions.length)errors.push('Đề có ID câu trùng');
    if(p.mode==='full'){
      if(!p.config?.structureVerified||!p.config?.rulesVerified||!p.config?.verification)errors.push('Full mock cần blueprint/quy tắc và nguồn đã kiểm định');
      if(p.questions?.some(q=>q.skill==='listening'&&(q.audio?.kind!=='file'||!q.audio?.src)))errors.push('Full mock thiếu AudioAsset thật; không dùng TTS');
      if(p.questions?.some(q=>q.scoring!=='manual'&&!q.answerVerified))errors.push('Full mock có đáp án chưa duyệt');
    }
  }
  return errors;
}
export function allowedTransition(from,to,reviewed=false,kind='vocabulary'){
  const rigorous=['questions','grammar','audio','templates','exams'].includes(kind);
  return (from==='DRAFT'&&to==='NEEDS_REVIEW')||(from==='NEEDS_REVIEW'&&to===(rigorous?'LANGUAGE_REVIEW':'APPROVED')&&reviewed===true)||(rigorous&&from==='LANGUAGE_REVIEW'&&to==='HSK_LEVEL_REVIEW'&&reviewed===true)||(rigorous&&from==='HSK_LEVEL_REVIEW'&&to==='APPROVED'&&reviewed===true)||(from==='APPROVED'&&to==='PUBLISHED')||(from!=='ARCHIVED'&&to==='ARCHIVED');
}
