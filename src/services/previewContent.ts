import {createContext,useContext} from 'react';
import type {CourseWord,GrammarPoint} from '../types/curriculum';
import type {ExamQuestion} from '../types';
export type PreviewAudio={id:string;revision:number;transcript:string;provider:string;voice:string;durationMs:number;license:string;licenseStatus:string;reviewStatus:string;storageUrl:string;mediaValidation?:{status:string}};
export interface PreviewBundle {version:string;words:CourseWord[];lessons:GrammarPoint[];questions:ExamQuestion[];audio:PreviewAudio[];images?:Record<string,unknown>[];optionBanks?:Record<string,unknown>[];referenceWords?:CourseWord[];referenceGrammar?:GrammarPoint[];referenceQuestions?:ExamQuestion[];lessonDrafts?:GrammarPoint[];wordDrafts?:(CourseWord&{vocabularyPointId:string})[]}
export const PreviewContentContext=createContext<{bundle:PreviewBundle;token:string}|null>(null);
export function usePreviewContent(){return useContext(PreviewContentContext);}
