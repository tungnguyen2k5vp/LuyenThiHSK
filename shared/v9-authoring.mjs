import {validateRecord} from '../server/content-contract.mjs';
import {validateRegisteredQuestion} from './question-types.mjs';
export function validateV9Record(kind,p,refs){
 const errors=validateRecord(kind,p);if(kind!=='questions')return{errors};
 errors.push(...validateRegisteredQuestion(p));
 const index=(rows)=>new Map(rows.map(r=>[r.id,r]));
 for(const [field,rows]of [['vocabularyIds',refs.words],['grammarIds',refs.grammar],['topicIds',refs.topics],['taskIds',refs.tasks],['hanziIds',refs.hanzi]]){
  const known=index(rows??[]);if(!Array.isArray(p[field])){errors.push('MISSING_REFERENCES:'+field);continue;}
  for(const id of p[field]){const r=known.get(id);if(!r)errors.push('UNKNOWN_REFERENCE:'+field+':'+id);else if(Number(r.level)>Number(p.level))errors.push('WRONG_LEVEL:'+id);}
 }
 if(!p.vocabularyIds?.length||!p.topicIds?.length||!p.taskIds?.length)errors.push('NONEMPTY_ACADEMIC_REFERENCES_REQUIRED');
 if(!p.grammarIds?.length&&!(p.partId==='W1'&&p.contentMeta?.grammarLinkStatus==='NOT_APPLICABLE_CHARACTER_COMPONENT'))errors.push('GRAMMAR_REFERENCE_OR_EXPLICIT_NOT_APPLICABLE_REQUIRED');
 if(p.scoring==='manual'&&(!p.sampleAnswer||!p.pinyinIsExamContent||!p.promptPinyin))errors.push('MANUAL_WRITING_REFERENCE_REQUIRED');
 if(p.sourceType!=='AI_GENERATED'||p.contentEnvironment!=='PREVIEW')errors.push('ORIGINAL_DRAFT_PREVIEW_REQUIRED');
 if(p.source_question_number!==null||p.sourceNumberingStatus!=='ORIGINAL_NOT_CTI_NUMBERED')errors.push('ORIGINAL_ID_NUMBERING_REQUIRED');
 if(p.mediaRequirement?.audio!== (p.skill==='listening'))errors.push('MEDIA_REQUIREMENT_MISMATCH');
 return{errors:[...new Set(errors)],semanticStatus:'BLOCKED_FOR_HUMAN_REVIEW'};
}
