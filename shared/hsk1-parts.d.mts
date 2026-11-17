import type {ExamQuestion} from '../src/types';
export type HskPart={partId:string;sectionId:string;order:number;questionCount:number;questionType:string;instructions:string;verificationStatus:string;mediaPolicy:Record<string,unknown>;answerPolicy:{kind:string;options:number;bankSize:number};timePolicy:Record<string,unknown>;sourceEvidence:Record<string,string>};
export const HSK1_PARTS:HskPart[];
export function partCoverage(bundle:{questions:ExamQuestion[]}):Array<HskPart&{available:number;completeGroups:number|null;independentVariants:number;blockers:string[];questionIds:string[]}>;
