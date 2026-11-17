import type {ExamQuestion} from '../../types';
import type {CourseWord,GrammarPoint} from '../../types/curriculum';
import type {PreparationData,DailyPlan,StudyTask} from '../../services/preparationStorage';
import type {CompletedAttempt,SavedStudySession,ReviewItem} from '../../services/studyStorage';
import type {ScreenMetaVM,TodayVM,ActionVM,NavigationCommand,TaskVM,PracticeHubVM,MockReadinessVM,LevelHubVM,MistakeReviewVM,SkillId} from '../../contracts/ui-v13';
import {taskProgress,recentSkillEvidence} from '../../services/studyPlan';
import {partPracticeProgress} from '../../services/partPractice';
import {similarAvailableQuestions} from '../../services/weaknessEngine';
import {isOpenQuestion} from '../../services/examScoring';
import {availableForPractice} from '../../../shared/practice-selection.mjs';
import {independentQuestionKey} from '../../../shared/grammar-quality.mjs';

export interface LearningSnapshot {meta:ScreenMetaVM;words:readonly CourseWord[];lessons:readonly GrammarPoint[];questions:readonly ExamQuestion[];data:PreparationData;attempts:CompletedAttempt[];sessions:SavedStudySession[];now:Date}
function scoped(s:LearningSnapshot){
 const words=s.words.filter(w=>w.level===s.meta.level),lessons=s.lessons.filter(g=>g.level===s.meta.level),questions=[...new Map(s.questions.filter(q=>String(q.level??q.hskLevel)===s.meta.level).map(q=>[q.id,q])).values()],ready=questions.filter(availableForPractice),attempts=s.attempts.filter(a=>a.examSnapshot?.levelCode==='HSK '+s.meta.level),ids=new Set([...words.map(w=>w.id),...lessons.map(g=>g.grammarPointId??g.id),...attempts.map(a=>a.examId)]);
 return {words,lessons,questions,ready,attempts,data:{...s.data,cards:Object.fromEntries(Object.entries(s.data.cards).filter(([id])=>ids.has(id))),events:s.data.events.filter(e=>ids.has(e.entityId))}};
}
const action=(id:string,label:string,command:NavigationCommand,count:number):ActionVM=>({id,label,command,availability:{available:count>0,reason:count>0?null:'Chưa có nội dung khả dụng.',count}});
export interface MockGateSnapshot {status:string;capabilities?:{canPublish?:boolean;canGenerateCandidatePlan?:boolean;canLaunchPrivatePractice?:boolean};counts?:Record<string,number>;nextActions?:string[];internalFixtureReady?:boolean;sourceVerification:string}
export function mockReadinessView(gate:MockGateSnapshot):MockReadinessVM {
 const checks:Record<string,[string,string]>={missingAudio:['Thiếu audio','Bổ sung audio có quyền sử dụng.'],imageRightsPending:['Quyền ảnh chờ duyệt','Kiểm tra bằng chứng quyền ảnh.'],pronunciationPending:['Phát âm chờ duyệt','Đưa audio vào hàng đợi nghe duyệt.'],languagePending:['Ngôn ngữ chờ duyệt','Duyệt nội dung và giải thích.'],levelPending:['Cấp độ chờ duyệt','Đối chiếu syllabus và duyệt cấp độ.'],sourceVerificationPending:['Quy tắc nguồn chưa xác minh','Đối chiếu nguồn CTI; giữ nhãn chính sách nền tảng.']};
 return {candidatePlanReady:gate.capabilities?.canGenerateCandidatePlan===true,internalFixtureReady:gate.internalFixtureReady??null,privatePracticeReady:gate.status==='READY_PRIVATE_PLATFORM_PRACTICE'&&gate.capabilities?.canLaunchPrivatePractice===true,publicReleaseReady:gate.status==='READY_PUBLIC_RELEASE'&&gate.capabilities?.canPublish===true,label:'PLATFORM PRACTICE MOCK / BETA',blockers:Object.entries(gate.counts??{}).filter(([id,n])=>id!=='manualWriting'&&Number.isFinite(n)&&n>0).map(([id,count])=>({id,label:checks[id]?.[0]??id,count,nextAction:checks[id]?.[1]??'Mở review queue để kiểm tra bằng chứng tương ứng.'})),writingScoring:'ungraded',sourceVerification:gate.sourceVerification};
}
function taskCommand(task:StudyTask,s:LearningSnapshot):NavigationCommand {
 if(task.kind==='practice')return {kind:'practice',level:s.meta.level,skill:(['listening','reading','writing'].includes(task.skill??'')?task.skill:'all') as SkillId};
 const page=task.kind==='grammar'?'grammar':task.kind==='mistakes'?'mistakes':'vocabulary';return {kind:'page',page,level:s.meta.level};
}
/** The plan is supplied by the existing plan owner. No planner or persistence is created here. */
export function todayView(s:LearningSnapshot,plan:DailyPlan|null):TodayVM {
 const p=scoped(s),evidence=recentSkillEvidence(p.attempts,s.now),stats=partPracticeProgress(p.questions,p.attempts),tasks:TaskVM[]=(plan?.tasks??[]).map(t=>{
  const pool=t.kind==='practice'?p.ready.filter(q=>!t.skill||q.skill===t.skill).length:t.kind==='grammar'?p.lessons.length:t.kind==='mistakes'?stats.incorrect:p.words.length;
  return {id:t.id,title:t.title,completed:plan?taskProgress({...plan,skipped:[]},t,p.data):0,count:t.count,minutes:t.minutes,skipped:plan?.skipped.includes(t.id)??false,reason:t.reason??null,action:action(t.id,t.title,taskCommand(t,s),pool)};
 });
 const session=s.sessions.find(t=>t.examSnapshot?.levelCode==='HSK '+s.meta.level),next=tasks.find(t=>t.action.availability.available&&!t.skipped&&t.completed<t.count),primary=session?action('resume','Tiếp tục bài đang làm',{kind:'resume',sessionId:session.id},1):next?.action??null;
 const weak=Object.entries(evidence).filter(([,r])=>r.answered>=5).sort((a,b)=>a[1].correct/a[1].answered-b[1].correct/b[1].answered)[0],weakReady=weak?p.ready.filter(q=>q.skill===weak[0]).length:0;
 const days=s.data.profile.examDate?Math.ceil((Date.parse(s.data.profile.examDate+'T23:59:59')-s.now.getTime())/86400000):null;
 return {meta:s.meta,title:'Hôm nay học HSK '+s.meta.level,dailyMinutes:s.data.profile.minutesPerDay,goal:'Nội dung luyện nội bộ; tiến độ Preview không suy ra khả năng đỗ HSK.',dateLabel:s.now.toLocaleDateString('vi-VN',{weekday:'long',year:'numeric',month:'2-digit',day:'2-digit'}),daysRemaining:days!==null&&Number.isFinite(days)?days:null,syllabusLabel:s.data.profile.edition,
 counters:[{id:'wordTotal',label:'Từ mới riêng ở cấp',value:p.words.length,unit:'từ',unavailableReason:null},{id:'due',label:'Từ đến hạn',value:Object.values(p.data.cards).filter(c=>Date.parse(c.dueAt)<=s.now.getTime()).length,unit:'từ',unavailableReason:null},{id:'learned',label:'Từ đã học',value:p.words.filter(w=>s.data.cards[w.id]?.learned).length,unit:'từ',unavailableReason:null},{id:'accuracy',label:'Độ chính xác bài đã luyện',value:stats.accuracy,unit:'%',unavailableReason:stats.accuracy===null?'Chưa có câu khách quan đã chấm.':null}],tasks,primary,
 weakness:weak?{label:weak[0]==='reading'?'Đọc hiểu':'Nghe hiểu',sampleSize:weak[1].answered,accuracyPercent:Math.round(weak[1].correct/weak[1].answered*100),action:weakReady?action('weak','Luyện kỹ năng cần chú ý',{kind:'practice',level:s.meta.level,skill:weak[0] as SkillId},weakReady):null}:null,
 unavailable:!p.ready.some(q=>q.skill==='listening')?[{skill:'listening',reason:'Phần nghe chưa có audio khả dụng cho bài luyện.'}]:[]};
}
/** Readiness is already decided by the backend gate; no ready flag is inferred from candidate counts. */
export function practiceHub(s:Pick<LearningSnapshot,'meta'|'questions'|'attempts'>,mock:MockReadinessVM):PracticeHubVM {
 const questions=[...new Map(s.questions.filter(q=>String(q.level??q.hskLevel)===s.meta.level).map(q=>[q.id,q])).values()],p={questions,ready:questions.filter(availableForPractice),attempts:s.attempts.filter(a=>a.examSnapshot?.levelCode==='HSK '+s.meta.level)},parts=[...new Set(p.questions.map(q=>q.partId).filter((v):v is string=>Boolean(v)))].map(id=>{
 const questions=p.questions.filter(q=>q.partId===id),ready=questions.filter(availableForPractice),stats=partPracticeProgress(questions,p.attempts),skill=questions[0].skill;
 return {id,skill,title:id,total:questions.length,available:ready.length,objective:ready.filter(q=>!isOpenQuestion(q)).length,ungraded:ready.filter(isOpenQuestion).length,completed:stats.done,action:action('part-'+id,'Luyện '+id,{kind:'practice',level:s.meta.level,skill,partId:id},ready.length)};
 });
 return {meta:s.meta,parts,mixed:p.ready.length?action('mixed','Mini hỗn hợp',{kind:'practice',level:s.meta.level,skill:'all'},p.ready.length):null,guidedListening:null,mock,notice:'PLATFORM PRACTICE / PREVIEW · Bài viết chưa chấm tách riêng; Full Mock chịu publication/media gate hiện có.'};
}
export function levelHub(s:Pick<LearningSnapshot,'meta'|'words'|'lessons'|'questions'>,mock:MockReadinessVM):LevelHubVM {
 const p={words:s.words.filter(w=>w.level===s.meta.level),lessons:s.lessons.filter(g=>g.level===s.meta.level),ready:s.questions.filter(q=>String(q.level??q.hskLevel)===s.meta.level&&availableForPractice(q))};return {meta:s.meta,title:'HSK '+s.meta.level,counters:[{id:'words',label:'Từ tham khảo',value:p.words.length,unit:'từ',unavailableReason:null},{id:'taxonomy',label:'Mục ngữ pháp của cấp',value:p.lessons.length,unit:'mục',unavailableReason:null},{id:'lessons',label:'Bài ngữ pháp có bản nháp',value:p.lessons.filter(g=>g.explanationVi&&g.examples?.length).length,unit:'bài',unavailableReason:null},{id:'listening',label:'Câu nghe khả dụng',value:p.ready.filter(q=>q.skill==='listening').length,unit:'câu',unavailableReason:null}],actions:[action('vocab','Từ vựng',{kind:'page',page:'vocabulary',level:s.meta.level},p.words.length),action('grammar','Ngữ pháp',{kind:'page',page:'grammar',level:s.meta.level},p.lessons.length),action('practice','Luyện tập',{kind:'page',page:'practice',level:s.meta.level},p.ready.length)],mock};
}
export function mistakeReview(s:Pick<LearningSnapshot,'meta'|'questions'|'attempts'|'now'>,reviews:readonly ReviewItem[]):MistakeReviewVM {
 const p={questions:s.questions.filter(q=>String(q.level??q.hskLevel)===s.meta.level),attempts:s.attempts.filter(a=>a.examSnapshot?.levelCode==='HSK '+s.meta.level)},map=new Map(p.questions.map(q=>[q.id,q]));
 for(const a of p.attempts)for(const q of a.examSnapshot?.questions??[])if(!map.has(q.id))map.set(q.id,q);
 const items=reviews.flatMap(r=>{const q=map.get(r.questionId);if(!q)return[];const similar=similarAvailableQuestions(p.questions,q,'HSK '+s.meta.level,Number.MAX_SAFE_INTEGER).filter(q=>q.partId!=='W1'&&q.assessmentSuitability!=='GUIDED_PRACTICE'),count=new Set(similar.map(independentQuestionKey)).size;
 return [{reviewId:r.id,questionId:q.id,title:q.skill==='listening'?'Câu nghe · '+(q.partId??r.questionNumber):q.promptZh,skill:q.skill,reason:r.reason,dueAt:r.dueAt,relatedWordIds:[...(q.vocabularyIds??[])],relatedGrammarIds:[...(q.grammarIds??[])],availableIndependent:count,reviewAvailability:{available:availableForPractice(q),reason:availableForPractice(q)?null:'Nội dung hoặc media chưa khả dụng.',count:1},action:count?action('mistake-'+r.id,'Luyện kỹ năng liên quan',{kind:'practice',level:s.meta.level,skill:q.skill},count):null}];});
 return {meta:s.meta,items,total:items.length,dueCount:items.filter(r=>Date.parse(r.dueAt)<=s.now.getTime()).length,unavailableCount:items.filter(r=>!r.reviewAvailability.available).length,notice:'Số câu độc lập dựa trên pool khả dụng; không tự tạo câu thay thế hoặc gán mastery từ việc đọc lại.'};
}
