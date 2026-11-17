import type {ExamItem,SkillType} from '../types';
import {validateContent} from '../data/contentValidation';
import {getExamConfig} from './examRules';
import {makeStudyId} from './studyStorage';
import type {StudyData} from './studyStorage';
import {fetchData} from './curriculum';

export async function fetchPracticeManifest(){
 const [base,extra]=await Promise.all([fetchData<{sets:PracticeEntry[];totals:{localAudioFiles:number}}>('/data/open-hsk/manifest.json'),fetchData<{sets:PracticeEntry[]}>('/data/learning/manifest.json').catch(()=>({sets:[]}))]);
 return {...base,sets:[...base.sets,...extra.sets]};
}

export interface PracticeEntry {
 id:string;title:string;version:ExamItem['version'];levelCode:string;totalQuestions:number;durationMinutes:number;contentLabel:string;
 skills:Partial<Record<SkillType,number>>;types:Record<string,number>;url?:string;bank?:ExamItem;
 sourceName?:string;sourceUrl?:string;license?:string;syllabusVersion?:string;contentType?:string;description?:string;searchText?:string;facets?:Record<string,number>;audioCount?:number;slowAudioCount?:number;answerCount?:number;explanationCount?:number;local?:boolean;excludedQuestionIds?:string[];sha256?:string;
}
export function entryFor(bank:ExamItem):PracticeEntry{return {...bank,bank,sourceName:bank.provenance.source_name,sourceUrl:bank.provenance.source_url,license:bank.provenance.license,syllabusVersion:bank.questions[0]?.syllabusVersion??'unverified',contentType:bank.id.startsWith('mz-')?'community_practice':'generated_practice',searchText:[bank.title,bank.provenance.source_name,...bank.questions.map(q=>q.promptZh+' '+q.promptPinyin+' '+q.translationEn)].join(' '),audioCount:bank.questions.filter(q=>q.audio?.src).length,slowAudioCount:bank.questions.filter(q=>q.audio?.slowSrc).length,answerCount:bank.questions.filter(q=>q.correctOptionId||q.acceptedAnswers?.length||q.matching).length,explanationCount:bank.questions.filter(q=>q.explanation).length,facets:bank.questions.reduce<Record<string,number>>((counts,q)=>{const key=q.skill+'|'+q.type;counts[key]=(counts[key]??0)+1;return counts;},{}),skills:Object.fromEntries([...new Set(bank.questions.map(q=>q.skill))].map(skill=>[skill,bank.questions.filter(q=>q.skill===skill).length])),types:Object.fromEntries([...new Set(bank.questions.map(q=>q.type))].map(type=>[type,bank.questions.filter(q=>q.type===type).length]))};}
export function matchingQuestionCount(entry:PracticeEntry,skill:SkillType,type:string){return entry.facets?Object.entries(entry.facets).filter(([key])=>{const [s,t]=key.split('|');return(skill==='all'||s===skill)&&(type==='all'||t===type);}).reduce((n,[,count])=>n+count,0):skill==='all'?(type==='all'?entry.totalQuestions:entry.types[type]??0):type==='all'?entry.skills[skill]??0:0;}
export function practiceMinutes(entry:PracticeEntry,skill:SkillType,type:string,limit:number){return Math.max(5,Math.ceil(Math.min(limit,matchingQuestionCount(entry,skill,type))*1.2));}
export function filterPracticeEntries(entries:PracticeEntry[],filter:{level:string;skill:SkillType;type:string;edition:string;category:string;query:string;status:string;duration:string;limit:number;sort:string},study:Pick<StudyData,'attempts'|'sessions'>){
 const belongs=(examId:string,id:string)=>examId===id||examId.startsWith(id+':practice:');
 const recent=(id:string)=>Math.max(0,...[...study.attempts,...study.sessions].filter(a=>belongs(a.examId,id)).map(a=>Date.parse('finishedAt' in a?a.finishedAt:a.updatedAt)));
 return entries.filter(e=>{const f=filter,minutes=practiceMinutes(e,f.skill,f.type,f.limit),done=study.attempts.some(a=>belongs(a.examId,e.id)),progress=study.sessions.some(a=>belongs(a.examId,e.id));return(f.level==='all'||e.levelCode===f.level)&&(f.edition==='all'||(f.edition==='hsk2'||f.edition==='hsk3'?e.version===f.edition:e.syllabusVersion===f.edition))&&(f.category==='all'||e.contentType===f.category)&&matchingQuestionCount(e,f.skill,f.type)>0&&[e.id,e.searchText,e.title,e.sourceName].join(' ').normalize('NFKC').toLocaleLowerCase('vi').includes(f.query.trim().normalize('NFKC').toLocaleLowerCase('vi'))&&(f.status==='all'||f.status==='done'&&done||f.status==='progress'&&progress||f.status==='new'&&!done&&!progress)&&(f.duration==='all'||f.duration==='short'&&minutes<=15||f.duration==='medium'&&minutes>15&&minutes<=30||f.duration==='long'&&minutes>30);}).sort((a,b)=>filter.sort==='recent'?recent(b.id)-recent(a.id)||a.title.localeCompare(b.title,'vi',{numeric:true}):filter.sort==='name'?a.title.localeCompare(b.title,'vi',{numeric:true}):Number(a.levelCode.replace(/\D/g,'').slice(0,1))-Number(b.levelCode.replace(/\D/g,'').slice(0,1))||a.title.localeCompare(b.title,'vi',{numeric:true}));
}
export function validateImportedPractice(value:unknown):ExamItem{
 if(!value||typeof value!=='object'||!Array.isArray((value as ExamItem).questions))throw Error('Bộ bài không đúng định dạng.');
 const exam=value as ExamItem;
 if(exam.questions.length>200||validateContent([exam],[]).length)throw Error('Bộ bài thiếu nội dung hoặc đáp án hợp lệ.');
 return exam;
}
export function makePracticeSelection(bank:ExamItem,{skill='all',type='all',limit=10,recentIds=[]}:{skill?:SkillType;type?:string;limit?:number;recentIds?:string[]}={}):ExamItem{
 const recent=new Set(recentIds);
 const pool=bank.questions.filter(q=>(skill==='all'||q.skill===skill)&&(type==='all'||q.type===type));
 const questions=[...pool].sort((a,b)=>Number(recent.has(a.id))-Number(recent.has(b.id))).slice(0,limit).map((q,i)=>({...q,number:i+1}));
 if(!questions.length)throw Error('Chưa có câu phù hợp với bộ lọc này.');
 const exam:ExamItem={...bank,id:bank.id+':practice:'+makeStudyId('set'),title:bank.title+(questions.length<pool.length?` · ${questions.length} câu`:''),questions,totalQuestions:questions.length,skill,mode:questions.length>10?'mini':'quick',modeLabel:'Luyện tập',durationMinutes:Math.max(5,Math.ceil(questions.length*1.2)),durationKind:'custom',config:undefined,isDemo:true};
 return {...exam,config:getExamConfig(exam)};
}
