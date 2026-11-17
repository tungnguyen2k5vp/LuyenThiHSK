import type {ExamItem, ExamQuestion} from '../../types';
import type {CompletedAttempt, SavedStudySession} from '../../services/studyStorage';
import type {VMBase, ExamQuestionVM, ExamRoomVM, ExamNavigatorVM, ExamTimerVM, ExplanationTabsVM, ExamResultVM, SubmitDialogVM, SyllabusEdition, LevelId, AvailabilityVM, QuestionImageVM, AudioPlayerVM, SectionInstructionVM, QuestionGroupVM} from '../../contracts/ui-v14';
import {questionView, screenMeta, resultView, writingView, contentStatus, type PublicationEvidence} from '../ui-v13/exam';
import type {AudioVM} from '../../contracts/ui-v13';
import {canNavigate, getExamConfig, sectionOfQuestion} from '../../services/examRules';
import {remainingSessionSeconds} from '../../services/sessionClock';
import {completeRegisteredAnswer} from '../../../shared/question-types.mjs';
export const availability=(available:boolean,reason:string|null=null):AvailabilityVM=>({available,reason:available?null:reason??'Chưa khả dụng.',count:null});
export function baseVM(label:string,e?:PublicationEvidence,available=true,reason:string|null=null):VMBase {
 return {contractVersion:'14.0',a11y:{headingId:'v14-'+label.replace(/[^a-z0-9-]/gi,'-'),label,live:'polite'},availability:availability(available,reason),content:contentStatus(e)};
}
export function examLevel(exam:ExamItem):LevelId {const m=exam.levelCode.match(/^HSK (1|2|3|4|5|6|7-9)$/);if(!m)throw Error('Unmapped HSK level');return m[1] as LevelId;}
export function examEdition(exam:ExamItem):SyllabusEdition {
 const editions=new Set(exam.questions.map(q=>q.syllabusVersion??'unverified'));
 return editions.size===1?[...editions][0]:'unverified';
}
export interface RoomSnapshot {
 readonly exam:ExamItem;readonly session:SavedStudySession;readonly now:number;
 readonly readOnly:boolean;readonly saving:boolean;readonly submitBusy:boolean;
 readonly images:Readonly<Record<string,QuestionImageVM>>;readonly audio:AudioVM|null;
 readonly evidence?:PublicationEvidence;readonly completed?:boolean;readonly composing?:boolean;
 readonly saveState?:'saved'|'saving'|'dirty'|'error';readonly saveLabel?:string;
}
const blocked=(s:RoomSnapshot)=>s.readOnly||s.submitBusy||Boolean(s.session.audioPausedAt||s.session.mediaRecoveryRequired)||s.completed===true;
export function navigationAllowed(s:RoomSnapshot,index:number):boolean {
 return Number.isInteger(index)&&!blocked(s)&&canNavigate(s.exam,s.session.currentIndex,index,s.session.mode,s.session.activeSectionIndex);
}
function safeImage(image:QuestionImageVM|undefined):QuestionImageVM|null {
 if(!image)return null;
 // Owner provides an authenticated Blob URL or an allowlisted same-origin public path.
 const url=image.displayUrl,allowed=Boolean(url&&(/^blob:https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(url)||/^\/api\/media\/[a-zA-Z0-9/_?=.-]+$/.test(url)||/^\/assets\/[a-zA-Z0-9/_.-]+$/.test(url)));
 return {id:image.id,alt:image.alt,width:image.width,height:image.height,state:allowed?image.state:image.state==='available'?'unavailable':image.state,displayUrl:allowed?url:null,retryable:image.retryable};
}
export function explanationTabs(s:RoomSnapshot,q:ExamQuestion):ExplanationTabsVM {
 const permitted=s.completed===true||(s.session.mode==='practice'&&s.session.checkedQuestionIds.includes(q.id));
 const meta=baseVM('feedback-'+q.id,s.evidence,permitted,'Giải thích mở sau khi kiểm tra trong Luyện tập hoặc sau khi nộp bài.');
 if(!permitted)return {...meta,questionId:q.id,permitted:false,feedback:null,tabs:[]};
 const projected=questionView({meta:screenMeta(examLevel(s.exam),'feedback'),question:q,answer:s.session.answers[s.exam.questions.findIndex(x=>x.id===q.id)]??'',mode:s.session.mode,checked:true,completed:s.completed===true,readOnly:true,flagged:false,audio:null,images:{}});
 const tabs:ExplanationTabsVM['tabs'][number][]=[];
 if(q.explanation?.trim())tabs.push({id:'explanation',label:'Giải thích',text:q.explanation,wordIds:[]});
 if(q.skill==='listening'&&q.promptZh?.trim())tabs.push({id:'transcript',label:'Phụ đề',text:q.promptZh,wordIds:[]});
 if(q.promptVi?.trim())tabs.push({id:'translation',label:'Bản dịch',text:q.promptVi,wordIds:[]});
 if(q.vocabularyIds?.length)tabs.push({id:'vocabulary',label:'Từ vựng',text:null,wordIds:[...q.vocabularyIds]});
 return {...meta,questionId:q.id,permitted:true,feedback:projected.feedback,tabs};
}
export function examQuestionView(s:RoomSnapshot,index=s.session.currentIndex):ExamQuestionVM|null {
 const q=s.exam.questions[index];if(!q)return null;
 const readonly=blocked(s),answer=s.session.answers[index]??'',meta=baseVM('question-'+q.id,s.evidence);
 const images=Object.fromEntries(Object.entries(s.images).map(([k,v])=>[k,safeImage(v)]).filter((entry):entry is [string,QuestionImageVM]=>entry[1]!==null));
 const vm=questionView({meta:screenMeta(examLevel(s.exam),'question',s.evidence),question:q,answer,mode:s.session.mode,checked:s.session.checkedQuestionIds.includes(q.id),completed:s.completed===true,readOnly:readonly,flagged:s.session.flaggedQuestionIds.includes(q.id),audio:null,images});
 const choices=vm.options.map(o=>({...meta,id:o.id,text:o.text,image:o.image,selected:o.selected,disabled:readonly}));
 const feedback=explanationTabs(s,q);
 const audio:AudioPlayerVM|null=s.audio?{...meta,visual:{...s.audio},questionId:q.id,assetRevision:null,policyLabel:getExamConfig(s.exam).rulesVerified?'Quy tắc có nguồn đối chiếu':'Platform Policy'}:null;
 return {...meta,id:q.id,revision:q.revision??null,number:q.number,partId:q.partId??null,groupId:q.groupId??null,type:q.type,skill:q.skill,instruction:q.instruction,promptZh:vm.promptZh,pinyin:vm.pinyin,image:vm.image,choices,
 matching:q.matching?{...meta,id:q.groupId??q.id,revision:q.revision??null,questionIds:s.exam.questions.filter(x=>(q.groupId?x.groupId===q.groupId:x.id===q.id)).map(x=>x.id),optionBankId:q.optionBankId??null,optionBankRevision:q.optionBank?.revision??null,options:choices,items:vm.matchingItems,uniqueOptions:q.matching.uniqueOptions}:null,
 reading:q.skill==='reading'?{...meta,passageId:q.passageId??null,passageZh:vm.contextZh,promptZh:vm.promptZh,pinyin:vm.pinyin,sentenceTokens:[]}:null,
 writing:q.skill==='writing'&&q.options.length===0?{...meta,editor:writingView(q,answer,{composing:s.composing??false,saveState:s.saveState??'saved',saveLabel:s.saveLabel??'Dùng trạng thái lưu của phiên hiện tại.',readOnly:readonly,error:null})}:null,
 answer:{raw:answer,complete:completeRegisteredAnswer(q,answer),readOnly:readonly,flagged:vm.flagged},actions:{canAnswer:!readonly,canCheck:!readonly&&s.session.mode==='practice'&&completeRegisteredAnswer(q,answer),canFlag:!readonly},feedback,audio};
}
export function navigatorView(s:RoomSnapshot):ExamNavigatorVM {
 const config=getExamConfig(s.exam),items=s.exam.questions.map((q,index)=>({questionId:q.id,revision:q.revision??null,index,number:q.number,partId:q.partId??null,sectionIndex:sectionOfQuestion(s.exam,index),answered:completeRegisteredAnswer(q,s.session.answers[index]),flagged:s.session.flaggedQuestionIds.includes(q.id),current:index===s.session.currentIndex,availability:availability(navigationAllowed(s,index),'Quy tắc phiên hoặc trạng thái media không cho phép chuyển câu.'),accessibleLabel:'Câu '+q.number}));
 const partKeys=[...new Set(items.map(i=>i.sectionIndex+':'+(i.partId??'default')))];
 return {...baseVM('navigator',s.evidence),sessionId:s.session.id,items,parts:partKeys.map(key=>{const rows=items.filter(i=>i.sectionIndex+':'+(i.partId??'default')===key),first=rows[0],answered=rows.filter(r=>r.answered).length;return {...baseVM('part-'+key,s.evidence),id:key,label:first.partId??config.sections[first.sectionIndex]?.label??'Phần luyện tập',skill:config.sections[first.sectionIndex]?.skill??'all',sectionIndex:first.sectionIndex,questionIds:rows.map(r=>r.questionId),answered,unanswered:rows.length-answered,current:rows.some(r=>r.current)};}),answered:items.filter(i=>i.answered).length,unanswered:items.filter(i=>!i.answered).length,flagged:items.filter(i=>i.flagged).length,currentIndex:s.session.currentIndex,previous:availability(navigationAllowed(s,s.session.currentIndex-1)),next:availability(navigationAllowed(s,s.session.currentIndex+1))};
}
export function timerView(s:RoomSnapshot):ExamTimerVM {
 const config=getExamConfig(s.exam),untimed=s.session.mode==='practice',paused=Boolean(s.session.audioPausedAt||s.session.mediaRecoveryRequired),deadline=config.timing==='section'?s.session.sectionDeadlineAt??s.session.deadlineAt:s.session.deadlineAt;
 const valid=Boolean(deadline&&Number.isFinite(Date.parse(deadline))),pauseAt=s.session.audioPausedAt?Date.parse(s.session.audioPausedAt):s.now;
 const seconds=untimed||!valid?null:remainingSessionSeconds(deadline!,Number.isFinite(pauseAt)&&paused?pauseAt:s.now);
 return {...baseVM('timer',s.evidence),label:untimed?'Không giới hạn giờ':'Thời gian còn lại',display:seconds===null?'--:--':Math.floor(seconds/60).toString().padStart(2,'0')+':'+(seconds%60).toString().padStart(2,'0'),remainingSeconds:seconds,state:untimed?'untimed':!valid?'unavailable':paused?'paused':seconds===0?'expired':'running',reason:!untimed&&!valid?'Deadline của engine chưa hợp lệ.':paused?'Chờ khôi phục media.':null,authority:config.rulesVerified?'verifiedRules':'platformPolicy'};
}
export function examRoomView(s:RoomSnapshot):ExamRoomVM {
 const nav=navigatorView(s),question=examQuestionView(s),config=getExamConfig(s.exam),timer=timerView(s);
 return {...baseVM('exam-room',s.evidence),examId:s.exam.id,examVersion:s.exam.version,sessionId:s.session.id,level:examLevel(s.exam),syllabusVersion:examEdition(s.exam),mode:s.session.mode,currentSkill:question?.skill??'all',currentPartId:question?.partId??null,currentQuestionId:question?.id??null,totalQuestions:s.exam.questions.length,answered:nav.answered,unanswered:nav.unanswered,flagged:nav.flagged,sectionProgress:config.sections.map((sec,index)=>{const rows=nav.items.filter(i=>i.sectionIndex===index);return{id:String(index),skill:sec.skill,total:rows.length,answered:rows.filter(i=>i.answered).length,active:index===(s.session.activeSectionIndex??sectionOfQuestion(s.exam,s.session.currentIndex))}}),timer,navigator:nav,question,contentAvailability:availability(Boolean(question),'Không tìm thấy câu hỏi trong snapshot.'),mediaAvailability:availability(!s.session.audioPausedAt&&!s.session.mediaRecoveryRequired,'Chờ media owner khôi phục.'),canNavigate:nav.items.some(i=>!i.current&&i.availability.available),canSubmit:!blocked(s)&&Boolean(question),saving:s.saving,recoveryReason:timer.state==='paused'?timer.reason:null};
}
export function questionGroupView(s:RoomSnapshot):QuestionGroupVM|null {
 const q=s.exam.questions[s.session.currentIndex];if(!q?.groupId&&!q?.optionBankId)return null;const vm=examQuestionView(s)!;
 const group=s.exam.questions.filter(x=>q.groupId?x.groupId===q.groupId:x.optionBankId===q.optionBankId&&x.optionBank?.revision===q.optionBank?.revision);
 return {...baseVM('group-'+(q.groupId??q.optionBankId),s.evidence),id:q.groupId??q.optionBankId!,revision:q.revision??null,questionIds:group.map(x=>x.id),sharedOptions:vm.choices,currentQuestionId:q.id,optionBankId:q.optionBankId??null,optionBankRevision:q.optionBank?.revision??null};
}
export function sectionInstructionView(s:RoomSnapshot,index:number,acknowledged:boolean,started:boolean):SectionInstructionVM|null {
 const section=getExamConfig(s.exam).sections[index];if(!section)return null;
 return {...baseVM('section-'+index,s.evidence),id:s.session.id+':'+index,sessionId:s.session.id,sectionIndex:index,skill:section.skill,title:section.label,instructions:[...new Set(s.exam.questions.filter(q=>section.questionIds.includes(q.id)).map(q=>q.instruction))],questionCount:section.questionIds.length,durationMinutes:s.session.mode==='timed'?section.durationMinutes:null,acknowledged,started,begin:availability(!blocked(s)&&!started,'Phần đã bắt đầu hoặc phiên đang bị khóa.'),error:null};
}
export function submitView(s:RoomSnapshot,open:boolean,error:string|null):SubmitDialogVM {
 const room=examRoomView(s);return {...baseVM('submit',s.evidence),sessionId:s.session.id,open,answered:room.answered,unanswered:room.unanswered,ungraded:s.exam.questions.filter((q,i)=>q.scoring==='manual'&&Boolean(s.session.answers[i]?.trim())).length,busy:s.submitBusy,confirm:availability(open&&room.canSubmit,'Chưa thể nộp bài.'),error};
}
export function examResultView(exam:ExamItem,attempt:CompletedAttempt,evidence?:PublicationEvidence):ExamResultVM {
 return {...baseVM('result',evidence),result:resultView(exam,attempt,screenMeta(examLevel(exam),'result',evidence)),examId:exam.id,examVersion:exam.version,syllabusVersion:examEdition(exam),officialPassProbability:null};
}
