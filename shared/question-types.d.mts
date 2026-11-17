import type {ExamQuestion} from '../src/types';
export const questionTypeRegistry:Record<string,{type:string;renderer:string;assessmentFamily:string;schemaVersion:number;answerSerializer:string;keyboard:string}>;
export function serializeMatching(value:Record<string,string>):string;
export function parseMatching(answer?:string):Record<string,string>;
export function completeRegisteredAnswer(question:ExamQuestion,answer?:string):boolean;
export function gradeRegisteredAnswer(question:ExamQuestion,answer?:string):boolean;
export function validateRegisteredQuestion(question:ExamQuestion):string[];
export const questionTypeSchemas:Record<string,unknown>;
export function serializeRegisteredAnswer(question:ExamQuestion,value:unknown):string;
