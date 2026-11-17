import type { HSKDataEdition } from './index';

export type ReviewStatus = 'DRAFT' | 'NEEDS_REVIEW' | 'LANGUAGE_REVIEW' | 'HSK_LEVEL_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
export interface DataLineage {
  syllabusVersion: HSKDataEdition;
  source: string;
  sourceType: 'OFFICIAL' | 'COMMUNITY' | 'ORIGINAL' | 'GENERATED' | 'AI_GENERATED' | 'LICENSED' | 'INTERNAL' | 'OFFICIAL_SAMPLE';
  sourceUrl: string;
  license: string;
  importedAt: string;
  verifiedAt: string | null;
  reviewStatus: ReviewStatus;
  revision: number;
  sourcePage?: number;
}
export interface CourseWord extends DataLineage {
  meaningSupplement?: LearningSource & {vi:string};
  supplementalExamples?: {id:string;zh:string;pinyin:string;en:string;audioUrl:string;slowAudioUrl?:string;sourceUrl:string;sourceName:string;license:string;sourceRevision:string;sourceEdition:string;reviewStatus:string}[];
  licensedGloss?: {en:string;pos:string;sourceUrl:string;license:string;sourceId:string;hsk3Bands:number[];hsk2Levels:number[];levelConflict:boolean};
  id: string; level: string; simplified: string; traditional: string; pinyin: string;
  meaningVi: string; meaningsEn: string[]; pos: string[]; topic: string;
  translationStatus: 'community_machine' | 'missing' | 'reviewed';
  exampleZh?: string; examplePinyin?: string; exampleVi?: string;
  dictionaryReference?: {meaningVi?:string;meaningsEn?:string[];source?:string;sourceUrl?:string;status?:string};
  primaryMeaningVi?: string; secondaryMeaningsVi?: string[]; meaningEn?: string[]; partOfSpeech?: string[]; classifier?: string; notes?: string[];
  lexicalQuality?: {status:string;flags:string[];score:number;linguisticReview:string};
  examples?: {zh:string;pinyin:string;vi:string;sourceType?:string;reviewStatus?:string}[];
}
export interface GrammarPoint extends DataLineage {
  supplementSource?: LearningSource;
  id: string; level: string; pattern: string; category: string; detail: string;
  explanationVi?: string; formula?: string; examples?: { zh: string; pinyin: string; vi: string }[];
  commonMistakes?: string[]; relatedIds?: string[]; questionIds?: string[];
  grammarPointId?: string; title?: string; shortMeaningVi?: string; usage?: string;
  comparisons?: string[]; prerequisites?: string[]; relatedGrammarIds?: string[]; relatedQuestionIds?: string[];
}
export interface HanziEntry extends DataLineage {
  id: string; level: string; character: string; pinyin: string; meaningVi: string;
  strokeCount: number | null; strokeUrl: string | null; radical?: string; exampleWords: string[];
}
export interface LearningSource {sourceName:string;sourceUrl:string;license:string;reviewStatus:string;linguisticReview:string}
export interface LearningSupplement {
  words:Record<string,{meaning?:LearningSource & {vi:string};examples?:CourseWord['supplementalExamples']}>;
  grammar:Record<string,Partial<GrammarPoint>>;
  hanzi:Record<string,{strokeUrl:string;strokeCount:number}>;
}
export interface CurriculumManifest {
  version: string; builtAt: string; sourcePdfSha256: string;
  editions: { id: HSKDataEdition; label: string; levels: { level: string; vocabulary: number; grammar: number; hanzi: number; wordsUrl: string; grammarUrl: string; hanziUrl: string }[] }[];
  quality: { missingVietnamese: number; communityTranslations: number; missingStrokes: number; grammarPendingReview: number; conflicts: number };
  sources: { name: string; url: string; license: string; sha256?: string }[];
}
