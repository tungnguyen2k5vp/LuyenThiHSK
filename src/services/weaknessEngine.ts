import type { CompletedAttempt } from './studyStorage';
import { resolveExam } from '../data/examCatalog';
import { questionStatus } from './examScoring';
import type { ExamItem, ExamQuestion } from '../types';
import {availableForPractice} from '../../shared/practice-selection.mjs';
export interface Weakness { id:string; question:ExamQuestion; exam:ExamItem; wrongCount:number; lastWrongAt:string; lastAt:string; correctStreak:number; mastery:number; nextReviewAt:string; reason:string }
export function analyzeWeaknesses(attempts:CompletedAttempt[],reasons:Record<string,string>={}):Weakness[]{
  const map=new Map<string,Weakness>();
  for(const attempt of [...attempts].sort((a,b)=>Date.parse(a.finishedAt)-Date.parse(b.finishedAt))){const exam=resolveExam(attempt);if(!exam)continue;
    exam.questions.forEach((question,index)=>{const status=questionStatus(question,attempt.answers[index]);if(status==='self-review')return;
      const key=exam.version+':'+question.id;const old=map.get(key);if(!old&&status==='correct')return;
      const wrong=status!=='correct';const streak=wrong?0:(old?.correctStreak??0)+1;
      map.set(key,{id:key,question,exam,wrongCount:(old?.wrongCount??0)+(wrong?1:0),lastWrongAt:wrong?attempt.finishedAt:old!.lastWrongAt,lastAt:attempt.finishedAt,correctStreak:streak,mastery:Math.min(100,streak*50),nextReviewAt:new Date(Date.parse(attempt.finishedAt)+(wrong?0:streak>=2?7:1)*86400000).toISOString(),reason:reasons[key]??(status==='unanswered'?'Hết thời gian / bỏ trống':question.skill==='listening'?'Không nghe được':'Cần xem lại')});
    });
  }
  return [...map.values()].sort((a,b)=>a.mastery-b.mastery||b.wrongCount-a.wrongCount);
}
export function similarQuestionIds(base:ExamItem,question:ExamQuestion,limit=5):string[]{const overlap=(a:string[]=[],b:string[]=[])=>a.some(id=>b.includes(id));const rank=(q:ExamQuestion)=>Number(overlap(q.grammarIds,question.grammarIds))*10+Number(overlap(q.topicIds,question.topicIds))*4+Number(overlap(q.vocabularyIds,question.vocabularyIds))*3+Number(q.type===question.type)*2+Number(q.skill===question.skill);const pool=base.questions.filter(q=>q.id!==question.id&&q.skill===question.skill);const grammarMatched=question.grammarIds?.length?pool.filter(q=>overlap(q.grammarIds,question.grammarIds)):[];return (grammarMatched.length?grammarMatched:pool).sort((a,b)=>rank(b)-rank(a)).slice(0,limit).map(q=>q.id);}
export function similarAvailableQuestions(pool:ExamQuestion[],question:ExamQuestion,levelCode:string,limit=5){const overlap=(a:string[]=[],b:string[]=[])=>a.some(id=>b.includes(id));const score=(q:ExamQuestion)=>Number(overlap(q.grammarIds,question.grammarIds))*10+Number(overlap(q.vocabularyIds,question.vocabularyIds))*3+Number(overlap(q.topicIds,question.topicIds));return [...new Map(pool.filter(q=>q.id!==question.id&&'HSK '+(q.level??q.hskLevel)===levelCode&&q.skill===question.skill&&q.scoring!=='manual'&&availableForPractice(q)&&score(q)>0).map(q=>[q.id,q])).values()].sort((a,b)=>score(b)-score(a)||a.id.localeCompare(b.id)).slice(0,limit);}
