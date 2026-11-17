import type {ExamQuestion} from '../src/types';
export function availableForPractice(q:ExamQuestion):boolean;
export function selectPartPractice(questions:ExamQuestion[],input:{level:string;partId:string;count?:number;recentQuestionIds?:string[]}):{questions:ExamQuestion[];repeatedIds:string[];available:number};
