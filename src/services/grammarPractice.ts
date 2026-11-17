import type {ExamQuestion} from '../types';
import type {GrammarPoint} from '../types/curriculum';
import {grammarExampleOverlap,independentQuestionKey} from '../../shared/grammar-quality.mjs';
export function grammarPracticePools(questions:ExamQuestion[],point:GrammarPoint){
 const guided=questions.filter(q=>q.assessmentSuitability==='GUIDED_PRACTICE'||grammarExampleOverlap(q,point));
 const guidedIds=new Set(guided.map(q=>q.id));
 return{guided,independent:[...new Map(questions.filter(q=>q.partId!=='W1'&&q.scoring!=='manual'&&!guidedIds.has(q.id)).map(q=>[independentQuestionKey(q),q])).values()]};
}
