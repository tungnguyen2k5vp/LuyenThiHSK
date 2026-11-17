import type {CompletedAttempt} from './studyStorage';
import {questionStatus} from './examScoring';
import type {GrammarPoint} from '../types/curriculum';
import {independentQuestionKey,grammarExampleOverlap} from '../../shared/grammar-quality.mjs';
export function previewGrammarEvidence(attempts:CompletedAttempt[],lessons:GrammarPoint[]=[]){
 const rows:Record<string,{answered:number;correct:number;questionIds:string[];lastPracticedAt:string}>={};
 const seen=new Set<string>(),seenContent=new Set<string>();for(const a of [...attempts].sort((a,b)=>b.finishedAt.localeCompare(a.finishedAt))){a.examSnapshot?.questions.forEach((q,i)=>{const contentKey=independentQuestionKey(q);if(!a.answers[i]?.trim()||q.partId==='W1'||q.scoring==='manual'||q.assessmentSuitability==='GUIDED_PRACTICE'||seen.has(q.id)||seenContent.has(contentKey)||lessons.some(g=>q.grammarIds?.includes(g.grammarPointId??g.id)&&grammarExampleOverlap(q,g)))return;seen.add(q.id);seenContent.add(contentKey);for(const id of q.grammarIds??[]){const r=rows[id]??{answered:0,correct:0,questionIds:[],lastPracticedAt:a.finishedAt};r.answered++;if(questionStatus(q,a.answers[i])==='correct')r.correct++;r.questionIds.push(q.id);rows[id]=r;}});}return rows;
}
