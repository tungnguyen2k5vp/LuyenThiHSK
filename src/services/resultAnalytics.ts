import type {ExamItem} from '../types';
import type {CompletedAttempt} from './studyStorage';
import {questionStatus} from './examScoring';
export function analyzeTiming(exam:ExamItem,attempt:CompletedAttempt){
 const rows=exam.questions.flatMap((q,i)=>{const timing=attempt.questionTimings?.[q.id];return timing?[{id:q.id,number:i+1,skill:q.skill,seconds:Math.round(timing.timeSpentMs/1000),changes:timing.answerChangeCount,flags:timing.flagCount,status:questionStatus(q,attempt.answers[i])}]:[];});
 const sufficient=rows.length>=3;const sections=[...new Set(rows.map(r=>r.skill))].map(skill=>{const samples=rows.filter(r=>r.skill===skill);return{skill,count:samples.length,averageSeconds:samples.length>=3?Math.round(samples.reduce((n,r)=>n+r.seconds,0)/samples.length):null};});
 return{sufficient,measured:rows.length,slowest:sufficient?[...rows].sort((a,b)=>b.seconds-a.seconds).slice(0,3):[],sections,timeoutUnanswered:attempt.endedBy==='timeout'?exam.questions.filter((_,i)=>!attempt.answers[i]?.trim()).length:null,activeSeconds:rows.reduce((n,r)=>n+r.seconds,0)};
}
