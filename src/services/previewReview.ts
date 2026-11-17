import type {ExamItem} from '../types';
import type {ReviewItem} from './studyStorage';
import {questionStatus} from './examScoring';
/** Preview IDs intentionally do not enter the production catalog's review resolver. */
export function updatePreviewReview(items:ReviewItem[],exam:ExamItem,index:number,answer?:string,flagged=false):ReviewItem[]{
 const q=exam.questions[index];if(!q)return items;const key='preview:'+q.id;const previous=items.find(i=>i.id===key);const others=items.filter(i=>i.id!==key);const status=questionStatus(q,answer);if(status==='correct'&&!flagged)return others;const now=new Date().toISOString();return[...others,{id:key,examId:exam.id,questionId:q.id,questionNumber:index+1,reason:status==='incorrect'?'incorrect':status==='unanswered'?'unanswered':status==='self-review'?'self-review':'flagged',createdAt:previous?.createdAt??now,lastReviewedAt:now,dueAt:now,reviewCount:(previous?.reviewCount??0)+1}];
}
