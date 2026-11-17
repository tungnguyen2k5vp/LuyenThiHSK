import type {ExamItem} from '../../types';
import type {CompletedAttempt, SavedStudySession} from '../../services/studyStorage';
import type {AttemptMode, CatalogFilters, CatalogScope, ContentEvidenceVM, ExamCardVM, ExamCatalogVM, ExamIntroVM, ExamModeVM} from '../../contracts/ui-v14';
import {baseVM, availability, examEdition, examLevel} from './exam';
import {getExamConfig} from '../../services/examRules';
import {isPublicExam} from '../../data/contentValidation';
import {completeRegisteredAnswer} from '../../../shared/question-types.mjs';
import type {PublicationEvidence} from '../ui-v13/exam';
/** Populated by application services after authorization and current readiness checks, never by UI. */
export interface CatalogEntry {
 readonly exam:ExamItem;readonly scope:CatalogScope;readonly evidence:ContentEvidenceVM;
 readonly publication?:PublicationEvidence;
 readonly readiness:Readonly<{practice:boolean;timed:boolean;mediaReady:boolean;reasons:readonly string[]}>;
}
export interface CatalogSnapshot {
 readonly entries:readonly CatalogEntry[];readonly sessions:readonly SavedStudySession[];
 readonly attempts:readonly CompletedAttempt[];readonly scope:CatalogScope;readonly previewAuthorized:boolean;
 readonly filters:CatalogFilters;
}
export const defaultCatalogFilters:CatalogFilters={query:'',level:'all',type:'all',status:'all',syllabusVersion:'all'};
function visible(entry:CatalogEntry,s:Pick<CatalogSnapshot,'scope'|'previewAuthorized'>):boolean {
 if(entry.scope==='privatePreview')return s.scope==='privatePreview'&&s.previewAuthorized;
 return entry.evidence.publication.status==='verified'&&entry.evidence.language.status==='verified'&&entry.evidence.rights.status==='verified'&&entry.publication?.productionGatePassed===true&&entry.publication.humanReviewed&&entry.publication.publicRightsVerified&&isPublicExam(entry.exam);
}
export function examCardView(entry:CatalogEntry,s:CatalogSnapshot):ExamCardVM|null {
 if(!visible(entry,s))return null;
 const {exam}=entry,config=getExamConfig(exam),reason=entry.readiness.reasons.join(' · ')||'Đề chưa qua gate của chế độ này.';
 // Resume uses its immutable exam snapshot. A new revision must not replace a historical attempt.
 const session=s.sessions.filter(x=>x.examId===exam.id&&(x.examSnapshot?.version??exam.version)===exam.version).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))[0];
 const snapshot=session?.examSnapshot??exam;
 const modes:ExamModeVM[]=(['practice','timed'] as const).map(mode=>({...baseVM('mode-'+exam.id+'-'+mode,entry.publication),id:mode,label:mode==='practice'?'Luyện tập':'Thi thử theo quy tắc nền tảng',description:mode==='practice'?'Giải thích chỉ mở sau khi kiểm tra câu.':'Timer và giới hạn lấy từ engine; không phải Secure Exam trên server.',selected:false,availability:availability(entry.readiness[mode]&&entry.readiness.mediaReady&&exam.questions.length>0,reason),feedbackPolicy:mode==='practice'?'afterCheck':'afterSubmit',timingPolicy:mode==='practice'?'untimed':'engine',authority:config.rulesVerified?'verifiedRules':'platformPolicy'}));
 const canStart=modes.some(m=>m.availability.available);
 return {...baseVM('exam-'+exam.id,entry.publication,canStart,reason),id:exam.id,title:exam.title,version:exam.version,level:examLevel(exam),syllabusVersion:examEdition(exam),type:exam.mode,scope:entry.scope,questionCount:exam.questions.length,durationMinutes:Number.isFinite(exam.durationMinutes)&&exam.durationMinutes>0?exam.durationMinutes:null,skillLabels:config.sections.map(x=>x.label),formatLabel:config.structureVerified&&entry.evidence.format.status==='verified'?'Cấu trúc có nguồn đối chiếu · nội dung luyện nền tảng':'Platform Practice Format',evidence:entry.evidence,resume:session?{sessionId:session.id,mode:session.mode,answered:snapshot.questions.filter((q,i)=>completeRegisteredAnswer(q,session.answers[i])).length,total:snapshot.questions.length}:null,completedAttemptCount:s.attempts.filter(a=>a.examId===exam.id).length,modes,canOpen:true,canStart,canResume:Boolean(session),unavailableReasons:canStart?[]:[...entry.readiness.reasons.length?entry.readiness.reasons:[reason]]};
}
export function examCatalogView(s:CatalogSnapshot):ExamCatalogVM {
 const all=s.entries.map(e=>examCardView(e,s)).filter((c):c is ExamCardVM=>c!==null),f=s.filters,query=f.query.trim().toLocaleLowerCase();
 const cards=all.filter(c=>(f.level==='all'||c.level===f.level)&&(f.type==='all'||c.type===f.type)&&(f.syllabusVersion==='all'||c.syllabusVersion===f.syllabusVersion)&&(!query||(c.title+' '+c.level+' '+c.formatLabel).toLocaleLowerCase().includes(query))&&(f.status==='all'||f.status==='available'&&c.canStart||f.status==='blocked'&&!c.canStart||f.status==='inProgress'&&c.resume!==null));
 return {...baseVM('catalog'),title:'Danh mục bài luyện thi',scope:s.scope,filters:{...f},cards,total:all.length,filteredTotal:cards.length,availableCount:all.filter(c=>c.canStart).length,inProgressCount:all.filter(c=>c.resume!==null).length};
}
export function examIntroView(entry:CatalogEntry,s:CatalogSnapshot,mode:AttemptMode,acknowledged:boolean,busy=false,error:string|null=null):ExamIntroVM|null {
 const card=examCardView(entry,s);if(!card)return null;const config=getExamConfig(entry.exam),selected=card.modes.find(m=>m.id===mode);
 return {...baseVM('intro-'+card.id,entry.publication),exam:{...card,modes:card.modes.map(m=>({...m,selected:m.id===mode}))},selectedMode:mode,rules:['Bài luyện do nền tảng cung cấp; không phải đề thi Official.',mode==='practice'?'Xem giải thích sau khi kiểm tra câu.':'Không mở đáp án, bản dịch hoặc transcript trước khi nộp.','Chế độ được chốt khi bắt đầu; không đổi trong phiên.','Bài viết tự luận chưa được chấm sẽ tách khỏi câu sai.'],playbackPolicy:{kind:config.audio.kind,delivery:config.audio.delivery,maxPlays:config.audio.maxPlays,canSeek:config.audio.allowSeek,canChangeRate:config.audio.allowRateChange,authority:config.rulesVerified?'verifiedRules':'platformPolicy'},sections:config.sections.map((sec,i)=>({id:String(i),skill:sec.skill,label:sec.label,questionCount:sec.questionIds.length,durationMinutes:mode==='timed'?sec.durationMinutes:null})),start:availability(Boolean(selected?.availability.available&&acknowledged&&!busy&&!card.resume),card.resume?'Có phiên đang làm; hãy tiếp tục phiên đó.':!acknowledged?'Hãy đọc và xác nhận quy tắc.':busy?'Đang bắt đầu phiên.':selected?.availability.reason??null),resumeSessionId:card.resume?.sessionId??null,ruleAcknowledged:acknowledged,startBusy:busy,error};
}
