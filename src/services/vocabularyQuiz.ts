import type { CourseWord } from '../types/curriculum';
import type { ExamItem, ExamQuestion, ContentProvenance } from '../types';
import {shortMeaning} from './lexicalPresentation';
export function createVocabularyQuiz(words:CourseWord[],level:string,limit=10):ExamItem {
  const usable=words.filter(w=>shortMeaning(w)&&!w.lexicalQuality?.flags.some(f=>['encoding','placeholder','machine_annotation'].includes(f))).map(w=>({...w,meaningVi:shortMeaning(w)}));
  const questions:ExamQuestion[]=[];
  const provenance:ContentProvenance={source_name:'CVDICT / CC-CEDICT — ôn từ tự động',source_url:'https://github.com/ph0ngp/CVDICT',source_version:'curriculum-2025.11-r1',retrieved_at:'2026-10-15',license:'CC BY-SA 4.0',rights_status:'open_license_verified',is_original:false,attribution:'Phong Phan; CC-CEDICT contributors. Derived dictionary matching exercises, not CTI exam questions.'};
  for(const word of usable){
    const questionSource:ContentProvenance=word.meaningSupplement?{source_name:word.meaningSupplement.sourceName,source_url:word.meaningSupplement.sourceUrl,source_version:'learning-supplement-2026-10-25-r1',retrieved_at:'2026-10-25',license:word.meaningSupplement.license,rights_status:'original',is_original:true,attribution:'HSK Journey · original AI-assisted Vietnamese gloss; not independently reviewed.'}:provenance;
    const same=usable.filter(w=>w.id!==word.id&&w.meaningVi!==word.meaningVi&&!w.simplified.includes(word.simplified)&&!word.simplified.includes(w.simplified)&&w.pos.some(p=>word.pos.includes(p)));
    const others=[...same,...usable].filter(w=>w.id!==word.id&&w.meaningVi!==word.meaningVi);
    const meanings=[word.meaningVi,...new Set(others.map(w=>w.meaningVi))].slice(0,4);if(meanings.length<4)continue;
    const offset=Number(word.id.match(/\d+$/)?.[0]??0)%4;
    const shuffled=[...meanings.slice(offset),...meanings.slice(0,offset)];
    questions.push({id:'dictquiz:'+word.id,number:questions.length+1,skill:'reading',part:1,type:'multiple-choice',topic:'Từ vựng',instruction:'Chọn nghĩa tương ứng với từ. Bài ôn từ tham khảo, không phải câu hỏi đề thi CTI.',promptZh:word.simplified,promptPinyin:word.pinyin,promptVi:word.meaningVi,options:shuffled.map((text,i)=>({id:'ABCD'[i],text})),correctOptionId:'ABCD'[shuffled.indexOf(word.meaningVi)],explanation:`${word.simplified} (${word.pinyin}): ${word.meaningVi}. ${word.meaningSupplement?'Nghĩa bổ sung có AI hỗ trợ, chưa duyệt độc lập.':'Nghĩa tham khảo từ CVDICT, chưa được CTI chứng nhận.'}`,scoring:'choice',answerVerified:!word.meaningSupplement,...(word.meaningSupplement?{answerValidation:'AI_SELF_CHECKED_NOT_HUMAN' as const}:{}),provenance:questionSource});
    if(questions.length>=limit)break;
  }
  if(!questions.length)throw Error('Bộ từ chưa có đủ bốn nghĩa khác nhau để tạo bài luyện.');
  const quizProvenance=questions.every(q=>q.provenance.is_original)?questions[0].provenance:questions.some(q=>q.provenance.is_original)?{...provenance,source_name:'CVDICT / CC-CEDICT + HSK Journey',source_url:'/data/learning/ATTRIBUTION.md',attribution:provenance.attribution+' HSK Journey: additional AI-assisted glosses, not independently reviewed.'}:provenance;
  return{id:'vocabulary-quiz:'+level+':'+questions[0].id,title:'Ôn từ theo nghĩa · HSK '+level,version:'hsk3',levelCode:'HSK '+level,skill:'reading',skillLabel:'Từ vựng',topic:'Từ vựng',mode:'quick',modeLabel:'Ôn từ',totalQuestions:questions.length,durationMinutes:Math.max(3,questions.length),durationKind:'custom',difficulty:'Dễ',description:'Bài ghép từ và nghĩa tạo theo lựa chọn người học.',contentLabel:'Từ syllabus 2025 · nghĩa cộng đồng · bài luyện tự động',provenance:quizProvenance,isDemo:true,questions};
}
