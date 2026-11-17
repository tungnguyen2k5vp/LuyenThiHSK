/**
 * HSK UI V13 - VIEWMODELS CONTRACT
 * Pure Presentation Contracts: ViewModels decouple UI components completely from logic, database, and backend.
 * Components receive these typed models as props.
 */

export type ContentStatus = 
  | 'PREVIEW' 
  | 'NEEDS_REVIEW' 
  | 'HUMAN_REVIEWED' 
  | 'PUBLISHED' 
  | 'DRAFT' 
  | 'UNPUBLISHED';

export type AudioAvailability = 
  | 'AVAILABLE' 
  | 'UNAVAILABLE' 
  | 'RIGHTS_PENDING' 
  | 'RECORDING_DRAFT' 
  | 'PREVIEW_ONLY';

export type TaskSkill = 'vocabulary' | 'grammar' | 'reading' | 'writing' | 'listening' | 'review';

export interface TaskViewModel {
  id: string;
  title: string;
  skill: TaskSkill;
  skillLabel: string;
  currentCount: number;
  targetCount: number;
  estimatedMinutes: number;
  reason?: string;
  isCompleted: boolean;
  isSkipped: boolean;
  isAvailable: boolean; // if false, cannot be started (e.g., audio not ready)
  unavailableReason?: string;
  targetRoute: string;
}

export interface ReadinessViewModel {
  score: number | null; // null if not enough data
  isSufficientData: boolean;
  reason: string;
  approvedMocksCount: number | null;
  coveragePercent: number | null;
  consistencyPercent: number | null;
}

export interface MetricItemViewModel {
  key: string;
  label: string;
  value: string | number;
  caption: string;
  isAccent?: boolean;
}

export interface WeaknessItemViewModel {
  id: string;
  skill: TaskSkill;
  skillLabel: string;
  wrongCount: number | null;
  reason: string;
  masteryPercent: number | null;
}

export interface TodayViewModel {
  targetLevel: string; // e.g. "HSK 1", "HSK 2", "HSK 3"
  currentDateFormatted: string; // e.g. "Thứ Hai, 19/10/2026"
  daysRemaining: number | null; // null if no exam date set
  targetSyllabus: string; // e.g. "Syllabus 2025" or "HSK 2.0 (Khung 6 cấp)"
  hasActiveTasks: boolean;
  tasks: TaskViewModel[];
  completedTasksCount: number;
  totalEstimatedMinutes: number;
  nextRecommendedTask: TaskViewModel | null;
  readiness: ReadinessViewModel;
  metrics: MetricItemViewModel[];
  weaknesses: WeaknessItemViewModel[];
  vocabularyProgress: {
    learnedCount: number;
    totalTargetCount: number;
    percent: number;
  };
  contentStatus: ContentStatus;
  statusNotice?: string;
}

export interface LevelItemViewModel {
  id: string;
  levelCode: string; // "HSK 1", "HSK 2", "HSK 7-9"
  title: string;
  categoryLabel: string; // "Sơ cấp", "Trung cấp", "Nâng cao"
  vocabCount: number;
  grammarPointsCount: number;
  estimatedExamMinutes?: number;
  audioStatus: AudioAvailability;
  audioNotice?: string; // e.g., "HSK 2: Đang hoàn thiện âm thanh"
  contentStatus: ContentStatus;
  isAvailableForPractice: boolean;
  isFullMockReady: boolean;
  progressPercent?: number;
  description: string;
}

export interface LevelHubViewModel {
  activeEdition: 'hsk2' | 'hsk3';
  levels: LevelItemViewModel[];
  noticeBanner?: string;
}

// ==========================================
// VOCABULARY VIEWMODELS (BATCH 3)
// ==========================================

export interface VocabExampleViewModel {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  audioStatus?: AudioAvailability;
}

export interface VocabSenseViewModel {
  pos?: string; // e.g. "danh từ", "động từ", "tính từ"
  meaning: string;
  examples: VocabExampleViewModel[];
}

export interface VocabItemViewModel {
  id: string;
  word: string; // Hanzi
  pinyin: string;
  radical?: string;
  strokeCount?: number;
  level: string; // "HSK 1", "HSK 2", v.v.
  primaryMeaning: string;
  primaryPos?: string;
  senses: VocabSenseViewModel[];
  isFavorite?: boolean;
  isLearned?: boolean;
  srsStage?: 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';
  audioStatus: AudioAvailability;
  audioUrl?: string;
  contentStatus: ContentStatus;
  sourceNotice?: string; // e.g. "Giáo trình Chuẩn HSK"
}

export interface VocabBrowserViewModel {
  level: string;
  totalCount: number;
  learnedCount: number | null;
  searchQuery: string;
  selectedFilter: 'all' | 'unlearned' | 'review' | 'favorite';
  items: VocabItemViewModel[];
  hasMore: boolean;
  contentStatus: ContentStatus;
}

export interface FlashcardViewModel {
  items: VocabItemViewModel[];
  currentIndex: number;
  isFlipped: boolean;
  audioPlaybackState?: 'idle' | 'loading' | 'playing' | 'paused' | 'failed' | 'unavailable';
}

// ==========================================
// GRAMMAR VIEWMODELS (BATCH 3)
// ==========================================

export interface GrammarExampleViewModel {
  chinese: string;
  pinyin: string;
  vietnamese: string;
  note?: string;
}

export interface GrammarComparisonViewModel {
  title: string;
  itemA: {
    label: string;
    structure: string;
    usage: string;
    example: string;
  };
  itemB: {
    label: string;
    structure: string;
    usage: string;
    example: string;
  };
  summary: string;
}

export interface GrammarLessonViewModel {
  id: string;
  code: string; // e.g. "HSK1-G01"
  title: string;
  level: string; // "HSK 1", "HSK 2"
  structure: string; // e.g. "S + 是 + O"
  explanation: string;
  examples: GrammarExampleViewModel[];
  comparison?: GrammarComparisonViewModel;
  masteryLevel: 'none' | 'learning' | 'mastered';
  practiceQuestionCount: number;
  contentStatus: ContentStatus;
  sourceNotice?: string;
}

export interface GrammarCatalogViewModel {
  level: string;
  lessons: GrammarLessonViewModel[];
  masteredCount: number | null;
  totalCount: number;
  searchQuery: string;
  activeLessonId?: string | null;
  contentStatus: ContentStatus;
}

