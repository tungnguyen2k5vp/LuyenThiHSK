export type HSKVersion = 'hsk2' | 'hsk3';
export type VocabVersion = HSKVersion | 'general';

export type RightsStatus = 'original' | 'user_supplied' | 'open_license_verified' | 'permission_confirmed' | 'unverified';

/** Explicit dataset editions; these must never be inferred from a level number alone. */
export type HSKDataEdition = 'hsk2-2015' | 'hsk3-2021' | 'hsk3-2025' | 'unverified';

export interface ContentProvenance {
  source_url: string;
  source_name: string;
  source_version: string;
  retrieved_at: string;
  license: string;
  rights_status: RightsStatus;
  is_original: boolean;
  attribution: string;
}

export type HSKLevelCategory = 'elementary' | 'intermediate' | 'advanced';

export interface HSKLevelInfo {
  id: string;
  version: HSKVersion;
  levelNumber: number | string; // e.g. 1..6 or '7-9'
  code: string; // e.g. 'HSK 1', 'HSK 7-9'
  title: string;
  category: HSKLevelCategory;
  categoryLabel: string; // 'Sơ cấp', 'Trung cấp', 'Nâng cao'
  officialQuestionCount?: number;
  description: string;
  badgeColor: string;
  examDurationMinutes?: number;
  structureVerified: boolean;
  sourceUrl?: string;
}

export type SkillType = 'all' | 'listening' | 'reading' | 'writing' | 'translation' | 'speaking';

export interface SkillInfo {
  id: SkillType;
  title: string;
  chineseTitle: string;
  description: string;
  iconName: string;
  applicableVersions: HSKVersion[];
}

export type ExamMode = 'quick' | 'mini' | 'full';

export interface ExamQuestionOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  pinyin?: string;
  translation?: string;
  image?: QuestionImage;
}
export interface QuestionImage {assetId:string;src:string;altText:string;width:number;height:number;contentHash?:string}

export interface ExamQuestion {
  mediaRequirement?:{audio:boolean;status:string};practiceAudioReady?:boolean;taskIds?:string[];
  partId?:string;groupId?:string;assessmentSuitability?:'GUIDED_PRACTICE'|'INDEPENDENT_PRACTICE'|'EXAM_CANDIDATE'|'APPROVED_EXAM_CONTENT';
  image?:QuestionImage;optionBankId?:string;optionBank?:{id:string;revision:number;options:ExamQuestionOption[]};
  matching?:{items:{id:string;text:string}[];correct:Record<string,string>;uniqueOptions:boolean};correctAnswer?:string;
  contentEnvironment?: 'PREVIEW'|'BETA'|'PRODUCTION'; answerValidation?: 'AI_SELF_CHECKED_NOT_HUMAN'|'SOURCE_KEY_NOT_INDEPENDENTLY_REVIEWED';
  revision?: number; syllabusVersion?: HSKDataEdition; hskLevel?: string; level?: string; section?: string;
  questionType?: string; difficulty?: 'easy'|'medium'|'hard'|'unverified'; topicIds?: string[]; grammarIds?: string[]; vocabularyIds?: string[]; hanziIds?: string[];
  passageId?: string|null; audioAssetId?: string|null; estimatedTimeSeconds?: number;
  sourceType?: string; reviewStatus?: string; qualityScore?: number;
  scoring?: 'choice' | 'exact-text' | 'manual';
  answerVerified?: boolean;
  acceptedAnswers?: string[];
  sampleAnswer?: string;
  legacyOptionAnswers?: Record<string, string>;
  candidatePromptZh?: string;
  pinyinIsExamContent?: boolean;
  audio?: { kind: 'tts' | 'file'; src?: string; slowSrc?: string; voiceKind?: 'synthetic'|'recorded'|'unknown'; sha256?: string; transcript?: string };
  sourceRecordId?: string; translationEn?: string;
  id: string;
  number: number;
  skill: SkillType;
  part: number; // e.g., Phần 1, Phần 2
  type: 'multiple-choice' | 'true-false' | 'sentence-order' | 'fill-blank' | 'short-answer' | 'speaking' | 'picture-choice' | 'picture-true-false' | 'matching' | 'shared-options' | 'short-passage' | 'dialogue' | 'grammar-practice';
  topic?: string;
  instruction: string; // Hướng dẫn làm bài
  audioTitle?: string;
  audioDurationSeconds?: number;
  promptZh: string; // Câu hỏi hoặc đoạn văn chữ Hán
  promptPinyin?: string;
  promptVi?: string; // Dịch nghĩa (chỉ mở khi xem giải thích)
  contextZh?: string; // Đoạn hội thoại hoặc ngữ cảnh nếu có
  options: ExamQuestionOption[];
  correctOptionId?: string;
  explanation?: string;
  rubric?: string[];
  responseHint?: string;
  provenance: ContentProvenance;
}

export interface ExamItem {
  partMapping?:{partId:string;sectionId:string;order:number;questionCount:number;questionType:string;instructions:string}[];
  simulationClass?:'PLATFORM_PRACTICE'|'GUIDED_MOCK'|'VERIFIED_STRUCTURE_SIMULATION';
  contentEnvironment?: 'PREVIEW'|'BETA'|'PRODUCTION'; formatAuthority?: 'PLATFORM_PRACTICE'|'CTI_VERIFIED';
  mockType?: 'full'|'mini'|'skill'|'drill'; seed?: string; lockedQuestions?: {id:string;revision:number}[]; templateId?: string; templateRevision?: number;
  config?: ExamRuntimeConfig;
  id: string;
  title: string;
  version: HSKVersion;
  levelCode: string; // 'HSK 1', 'HSK 3', 'HSK 7-9'
  skill: SkillType;
  skillLabel: string;
  topic: string;
  mode: ExamMode;
  modeLabel: string;
  totalQuestions: number;
  durationMinutes: number;
  durationKind: 'custom' | 'official';
  difficulty: 'Dễ' | 'Trung bình' | 'Khá' | 'Thử thách';
  description: string;
  contentLabel: string;
  provenance: ContentProvenance;
  isDemo: boolean;
  questions: ExamQuestion[];
}

export interface ExamRuntimeConfig {
  verification?: { sourceUrl: string; checkedAt: string; note: string };
  structureVerified: boolean;
  rulesVerified: boolean;
  timing: 'total' | 'section';
  sections: { skill: SkillType; label: string; questionIds: string[]; questionTypes: ExamQuestion['type'][]; durationMinutes: number; audioSrc?: string }[];
  audio: { kind: 'none' | 'tts' | 'file'; delivery: 'question' | 'section'; maxPlays: number | null; allowSeek: boolean; allowRateChange: boolean; rate: number };
  navigation: { previousSections: boolean; futureSections: boolean; withinSection: boolean };
}

export interface VocabWord {
  id: string;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  english?: string;
  wordClass: string; // 'Danh từ', 'Động từ', 'Tính từ', 'Phó từ'...
  hskVersion: VocabVersion;
  levelCode: string; // 'HSK 1'...'HSK 6', 'HSK 7-9'
  exampleZh: string;
  examplePinyin: string;
  exampleVi: string;
  status: 'new' | 'learning' | 'mastered';
  provenance: ContentProvenance;
  lastReviewedAt?: string;
  dueAt?: string;
}

export interface StudyDayRecord {
  date: string; // 'YYYY-MM-DD'
  minutes: number;
  questionsCount: number;
  level: number; // 0..4 for heatmap shading
}

export interface WeeklyStudyStat {
  dayName: string; // 'T2', 'T3', ...
  minutes: number;
  wordsCount: number;
}

export interface UserStatsSummary {
  streakDays: number;
  totalPracticeSessions: number;
  totalStudyHours: number;
  totalWordsLearned: number;
  averageAccuracyPercent: number | null;
  weeklyMinutes: number;
}

export interface RecentStudySession {
  currentQuestionNumber?: number;
  id: string;
  examId: string;
  title: string;
  levelCode: string;
  version: HSKVersion;
  skillLabel: string;
  completedQuestions: number;
  totalQuestions: number;
  percent: number;
  lastStudiedTime: string;
}
