import type {ExamItem, ExamQuestion} from '../../types';
import type {SavedStudySession, CompletedAttempt} from '../../services/studyStorage';
import type {AudioVM, ContentStatusVM, ScreenMetaVM, LevelId, QuestionVM, FeedbackVM, QuestionAnswerStatus, QuestionImageVM, WritingVM, ExamProgressVM, SubmitDialogVM, ResultVM} from '../../contracts/ui-v13';
import {questionStatus, summarizeAttempt, summarizeBySkill} from '../../services/examScoring';
import {canNavigate, getExamConfig} from '../../services/examRules';
import {remainingSessionSeconds} from '../../services/sessionClock';
import {parseMatching} from '../../../shared/question-types.mjs';

export interface PublicationEvidence {humanReviewed:boolean; productionGatePassed:boolean; publicRightsVerified:boolean; privateRightsVerified:boolean; environment:'PREVIEW'|'BETA'|'PRODUCTION'|'REFERENCE'}
export function contentStatus(e?:PublicationEvidence):ContentStatusVM {
 const published=Boolean(e?.productionGatePassed&&e.humanReviewed&&e.publicRightsVerified&&e.environment==='PRODUCTION');
 return {environment:published?'published':e?.environment==='REFERENCE'?'reference':e?.environment==='BETA'?'beta':'preview',label:published?'Published':e?.environment==='REFERENCE'?'Nguồn tham khảo':e?.environment==='BETA'?'BETA · chờ duyệt chuyên môn':'AI_GENERATED / NEEDS_REVIEW',humanReviewed:e?.humanReviewed===true,published,rights:e?.publicRightsVerified?'publicAllowed':e?.privateRightsVerified?'privateAllowed':'unknown'};
}
export function screenMeta(level:LevelId,label:string,e?:PublicationEvidence):ScreenMetaVM {return {contractVersion:'13.0',level,content:contentStatus(e),a11y:{headingId:'v13-'+label.replace(/[^a-z0-9-]/gi,'-'),label,live:'polite'}};}
export interface AudioVisualSnapshot {
 id:string;purpose:AudioVM['purpose'];state:AudioVM['state'];label:string;reason:string|null;
 permitted:boolean;canPause:boolean;canRetry:boolean;durationSeconds:number|null;currentSeconds:number|null;
 playsRemaining:number|null;allowSeek:boolean;allowRateChange:boolean;rate:number;sourceLabel:string;
}
/** Permissions and measured time come from the existing player. This does not instantiate a player. */
export function audioView(s:AudioVisualSnapshot):AudioVM {
 const finite=(n:number|null)=>n!==null&&Number.isFinite(n)&&n>=0?n:null;
 const plays=finite(s.playsRemaining),ready=s.permitted&&s.state!=='unavailable'&&s.state!=='loading'&&s.state!=='error'&&plays!==0;
 return {id:s.id,purpose:s.purpose,state:s.permitted?s.state:'unavailable',label:s.label,reason:s.permitted?s.reason:s.reason??'Âm thanh chưa được phép sử dụng.',canPlay:ready,canPause:s.permitted&&s.canPause&&s.state==='playing',canRetry:s.permitted&&s.canRetry,durationSeconds:finite(s.durationSeconds),currentSeconds:finite(s.currentSeconds),playsRemaining:plays,canSeek:s.permitted&&s.allowSeek,canChangeRate:s.permitted&&s.allowRateChange,rate:Number.isFinite(s.rate)&&s.rate>0?s.rate:1,sourceLabel:s.sourceLabel};
}
const resultStatus=(status:ReturnType<typeof questionStatus>):QuestionAnswerStatus=>status==='self-review'?'ungraded':status;
function feedback(q:ExamQuestion,answer:string|undefined):FeedbackVM {
 return {status:resultStatus(questionStatus(q,answer)),explanation:q.explanation??'',solutionText:q.correctOptionId??q.correctAnswer??q.acceptedAnswers?.join(' / ')??q.sampleAnswer??null,relatedWordIds:[...(q.vocabularyIds??[])],relatedGrammarIds:[...(q.grammarIds??[])],rubric:[...(q.rubric??[])]};
}
export interface QuestionSnapshot {
 meta:ScreenMetaVM;question:ExamQuestion;answer:string;mode:'practice'|'timed';checked:boolean;completed:boolean;
 readOnly:boolean;flagged:boolean;audio:AudioVM|null;images:Readonly<Record<string,QuestionImageVM>>;
}
/** Whitelist projection: never spread a question or options (which include translations/keys). */
export function questionView(s:QuestionSnapshot):QuestionVM {
 const q=s.question,showFeedback=s.completed||(s.mode==='practice'&&s.checked),matching=parseMatching(s.answer);
 const image=(id:string|undefined)=>id&&s.images[id]?{...s.images[id]}:null;
 return {meta:s.meta,id:q.id,revision:q.revision??null,number:q.number,partId:q.partId??null,skill:q.skill,instruction:q.instruction,
 promptZh:q.skill==='listening'?q.candidatePromptZh??'':q.promptZh,contextZh:q.skill==='listening'?null:q.contextZh??null,
 pinyin:q.pinyinIsExamContent?q.promptPinyin??null:null,interaction:q.matching?'matching':q.options.length?'choice':q.skill==='writing'?'writing':'text',
 options:q.options.map(o=>({id:o.id,text:o.text,pinyin:q.pinyinIsExamContent?o.pinyin??null:null,image:image(o.image?.assetId),selected:s.answer===o.id,disabled:s.readOnly})),
 matchingItems:(q.matching?.items??[]).map(i=>({id:i.id,text:i.text,selectedOptionId:matching[i.id]??null})),image:image(q.image?.assetId),answerText:s.answer,readOnly:s.readOnly,flagged:s.flagged,audio:s.audio,feedback:showFeedback?feedback(q,s.answer):null};
}
export function writingView(q:ExamQuestion,value:string,state:Pick<WritingVM,'composing'|'saveState'|'saveLabel'|'readOnly'|'error'>):WritingVM {
 return {questionId:q.id,promptZh:q.candidatePromptZh??q.promptZh,pinyinHint:q.pinyinIsExamContent?q.promptPinyin??null:null,value,characterCount:Array.from(value).length,hanziCount:(value.match(/\p{Script=Han}/gu)??[]).length,maxLength:4000,...state,scoring:'ungraded',scoringLabel:'Chưa chấm · không tính là câu sai',help:'Nhập nguyên văn bằng bộ gõ của bạn. Bản nháp dùng cơ chế lưu hiện có.'};
}
export interface ProgressSnapshot {exam:ExamItem;session:SavedStudySession;now:number;saving:boolean;readOnly:boolean;submitBusy:boolean}
export function examProgressView(s:ProgressSnapshot):ExamProgressVM {
 const {exam,session}=s,config=getExamConfig(exam),paused=Boolean(session.audioPausedAt||session.mediaRecoveryRequired),deadline=config.timing==='section'?session.sectionDeadlineAt:session.deadlineAt;
 const availability=(target:number)=>{const allowed=Number.isInteger(target)&&!s.readOnly&&!paused&&canNavigate(exam,session.currentIndex,target,session.mode,session.activeSectionIndex);return {available:allowed,reason:allowed?null:paused?'Chờ khôi phục media.':'Không thể chuyển đến câu này theo quy tắc phiên hiện tại.',count:null};};
 const remaining=session.mode==='practice'?null:deadline?remainingSessionSeconds(deadline,s.now):null;
 return {sessionId:session.id,current:session.currentIndex,total:exam.questions.length,answered:exam.questions.filter((_,i)=>Boolean(session.answers[i]?.trim())).length,
 timer:{label:session.mode==='practice'?'Không giới hạn giờ':'Thời gian còn lại',remainingSeconds:remaining,state:session.mode==='practice'?'untimed':paused?'paused':remaining===0?'expired':'running',reason:session.mode==='timed'&&!deadline?'Chưa có deadline hợp lệ.':null,authority:config.rulesVerified&&config.structureVerified?'verifiedRules':'platformPolicy'},
 items:exam.questions.map((q,index)=>({questionId:q.id,index,number:q.number,section:config.sections.find(p=>p.questionIds.includes(q.id))?.label??'',answered:Boolean(session.answers[index]?.trim()),flagged:session.flaggedQuestionIds.includes(q.id),current:index===session.currentIndex,availability:availability(index)})),
 previous:availability(session.currentIndex-1),next:availability(session.currentIndex+1),submit:{available:!s.readOnly&&!paused&&!s.submitBusy,reason:s.submitBusy?'Đang nộp bài.':s.readOnly?'Phiên chỉ đọc.':paused?'Chờ khôi phục media.':null,count:null},saving:s.saving,recoveryReason:paused?'Phiên đang dừng để khôi phục media.':null};
}
export function submitDialogView(s:ProgressSnapshot,open:boolean,error:string|null):SubmitDialogVM {
 const summary=summarizeAttempt(s.exam,s.session),progress=examProgressView(s);
 return {open,title:'Nộp bài?',description:'Kiểm tra câu bỏ trống trước khi nộp. Bài viết chưa chấm được tách riêng.',answered:summary.answeredCount,unanswered:summary.unansweredCount,ungraded:summary.ungradedCount,busy:s.submitBusy,canConfirm:open&&progress.submit.available,error};
}
export function resultView(exam:ExamItem,attempt:CompletedAttempt,meta:ScreenMetaVM):ResultVM {
 const sum=summarizeAttempt(exam,attempt);
 return {meta,attemptId:attempt.id,title:exam.title,durationSeconds:attempt.durationSeconds,counts:{correct:sum.correctCount,incorrect:sum.incorrectCount,unanswered:sum.unansweredCount,ungraded:sum.ungradedCount},accuracyPercent:sum.accuracyPercent,gradedCount:sum.objectiveQuestionCount,accuracyLabel:'Độ chính xác trên tổng số câu khách quan, gồm câu bỏ trống',scoreAuthority:'platformPractice',
 items:exam.questions.map((q,i)=>({questionId:q.id,number:q.number,skill:q.skill,status:resultStatus(questionStatus(q,attempt.answers[i])),seconds:attempt.questionTimings?.[q.id]?Math.round(attempt.questionTimings[q.id].timeSpentMs/1000):null,feedback:feedback(q,attempt.answers[i])})),
 sections:summarizeBySkill(exam,attempt).map(r=>({skill:r.skill,correct:r.correctCount,incorrect:r.incorrectCount,unanswered:r.unansweredCount,ungraded:r.ungradedCount,gradedCount:r.objectiveQuestionCount,accuracyPercent:r.accuracyPercent})),actions:[],officialReadiness:{score:null,reason:'Kết quả luyện nội bộ không đủ để suy ra khả năng đỗ HSK chính thức.'}};
}
