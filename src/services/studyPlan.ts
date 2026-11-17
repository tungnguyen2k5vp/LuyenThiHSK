import type { DailyPlan, PreparationData, StudyTask } from './preparationStorage';
import { localDay } from './preparationStorage';
import type {CompletedAttempt} from './studyStorage';
import {resolveExam} from '../data/examCatalog';
import {questionStatus} from './examScoring';
export function recentSkillEvidence(attempts:CompletedAttempt[],now=new Date()){
 const stats={listening:{answered:0,correct:0},reading:{answered:0,correct:0}};
 for(const a of attempts){if(now.getTime()-Date.parse(a.finishedAt)>7*86400000)continue;const exam=resolveExam(a);exam?.questions.forEach((q,i)=>{if(!['listening','reading'].includes(q.skill)||q.scoring==='manual'||!a.answers[i]?.trim())return;const row=stats[q.skill as keyof typeof stats];row.answered++;if(questionStatus(q,a.answers[i])==='correct')row.correct++;});}
 return stats;
}
export function buildStudyPlan(data:PreparationData,available:{words:number;grammar:number;listening:number;reading:number;mistakes:number},now=new Date(),evidence?:ReturnType<typeof recentSkillEvidence>):DailyPlan{
  const budget=data.profile.minutesPerDay;const days=data.profile.examDate?Math.ceil((Date.parse(data.profile.examDate+'T23:59:59')-now.getTime())/86400000):null;
  const near=days!==null&&days>=0&&days<=14;const due=Object.values(data.cards).filter(c=>Date.parse(c.dueAt)<=now.getTime()).length;
  const tasks:StudyTask[]=[];let left=budget;
  const add=(task:StudyTask)=>{if(left<3)return;const minutes=Math.min(left,task.minutes);tasks.push({...task,minutes,count:Math.max(1,Math.min(task.count,Math.ceil(minutes*2)))});left-=minutes;};
  if(due)add({id:'due',title:'Ôn từ đến hạn',kind:'word-review',count:Math.min(15,due),minutes:Math.min(8,Math.ceil(due/2)),page:'vocab'});
  if(available.mistakes)add({id:'mistakes',title:'Ôn lỗi cần chú ý',kind:'mistakes',count:Math.min(5,available.mistakes),minutes:Math.min(6,Math.max(3,Math.round(budget*.2))),page:'review',reason:'Ưu tiên khắc phục câu sai đã có trong lịch sử.'});
  if(!near&&available.words)add({id:'learn',title:'Học từ mới theo mục tiêu',kind:'word-learn',count:Math.min(10,available.words),minutes:Math.min(8,Math.ceil(budget*.25)),page:'vocab'});
  if(available.grammar)add({id:'grammar',title:'Ôn cấu trúc ngữ pháp',kind:'grammar',count:1,minutes:5,page:'grammar'});
  let skill:'listening'|'reading'=available.listening?'listening':'reading';let reason='Dựa trên bài luyện hiện có; chưa đủ mẫu để so sánh kỹ năng.';
  if(evidence&&evidence.listening.answered>=5&&evidence.reading.answered>=5){const listen=evidence.listening.correct/evidence.listening.answered,read=evidence.reading.correct/evidence.reading.answered;const preferred=listen<read?'listening':'reading';if(available[preferred])skill=preferred;reason=`7 ngày gần đây: nghe ${Math.round(listen*100)}% (${evidence.listening.answered} câu), đọc ${Math.round(read*100)}% (${evidence.reading.answered} câu). Ưu tiên kỹ năng có tỷ lệ thấp hơn.`;}
  const count=available[skill];
  if(count)add({id:'practice',title:near?'Luyện có giờ trước kỳ thi':'Luyện '+(skill==='listening'?'nghe':'đọc'),kind:'practice',count:Math.min(10,count),minutes:Math.min(12,Math.max(4,left)),page:'parts',skill,reason});
  if(!tasks.length&&available.words)add({id:'learn',title:'Học từ mới',kind:'word-learn',count:5,minutes:Math.min(10,budget),page:'vocab'});
  return{day:localDay(now),createdAt:now.toISOString(),tasks,skipped:[]};
}
export function taskProgress(plan:DailyPlan,task:StudyTask,data:PreparationData):number{
  if(plan.skipped.includes(task.id))return task.count;
  return Math.min(task.count,data.events.filter(e=>{if(e.at<plan.createdAt||e.kind!==task.kind)return false;if(!task.skill)return true;if(e.skill)return e.skill===task.skill;const legacy=resolveExam({examId:e.entityId});return Boolean(legacy?.questions.length&&legacy.questions.every(q=>q.skill===task.skill));}).reduce((sum,e)=>sum+e.count,0));
}
