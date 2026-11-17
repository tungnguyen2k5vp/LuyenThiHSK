import type {ExamQuestion} from '../src/types';import type {GrammarPoint} from '../src/types/curriculum';
export function grammarExampleOverlap(q:Pick<ExamQuestion,'promptZh'|'options'|'correctAnswer'|'type'>,lesson:GrammarPoint):boolean;
export function independentQuestionKey(q:ExamQuestion):string;
