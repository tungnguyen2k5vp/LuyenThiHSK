/**
 * HSK UI V14 - VIEWMODELS CONTRACT
 * Pure presentation contracts decoupling UI components completely from logic, database, and backend.
 * Components receive these typed models as props.
 */

export type LevelId = '1' | '2' | '3' | '4' | '5' | '6' | '7-9';
export type SkillId = 'listening' | 'reading' | 'writing' | 'speaking' | 'translation' | 'all';
export type QuestionStatus = 'current' | 'answered' | 'unanswered' | 'flagged' | 'correct' | 'incorrect';

// ==========================================
// 1. EXAM CATALOG VIEWMODELS
// ==========================================

export interface ExamCatalogItemVM {
  id: string;
  title: string;
  level: LevelId;
  durationMinutes: number;
  totalQuestions: number;
  listeningCount: number;
  readingCount: number;
  writingCount?: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'locked';
  statusLabel?: string;
  lastScore?: number | null;
  passingScore: number | null;
  isLocked?: boolean;
  lockReason?: string | null;
  thumbnailUrl?: string;
}

export interface ExamCatalogVM {
  activeLevel: LevelId;
  activeTab: 'mock' | 'skill' | 'short';
  searchQuery: string;
  statusFilter: 'all' | 'not_started' | 'in_progress' | 'completed';
  tabCounts: {
    mock: { completed: number; total: number };
    skill: number;
    short: number;
  };
  exams: ExamCatalogItemVM[];
}

// ==========================================
// 2. EXAM INTRO VIEWMODELS
// ==========================================

export interface ExamIntroSkillBreakdownVM {
  skill: SkillId;
  label: string;
  questionCount: number;
}

export interface ExamIntroVM {
  examId: string;
  title: string;
  level: LevelId;
  durationMinutes: number;
  passingScore: number | null;
  canStart?: boolean;
  startBusy?: boolean;
  totalQuestions: number;
  skills: ExamIntroSkillBreakdownVM[];
  examMode: 'practice' | 'mock'; // Practice: allow pause, see solution during test; Mock: strict exam rules
  noticePractice: string;
  noticeMock: string;
}

// ==========================================
// 3. LISTENING INSTRUCTIONS MODAL VIEWMODELS
// ==========================================

export interface ListeningInstructionPartVM {
  partNumber: number;
  title: string;
  questionCount: number;
}

export interface ListeningInstructionModalVM {
  title?: string;
  policyLabel?: string;
  isOpen: boolean;
  parts: ListeningInstructionPartVM[];
  canTestAudio: boolean;
}

// ==========================================
// 4. 3-COLUMN EXAM ROOM VIEWMODELS
// ==========================================

export interface NavigatorBubbleVM {
  id: string;
  index: number; // 0-based
  number: number; // 1-based display (e.g. 1, 2, 3)
  status: QuestionStatus;
  isAllowed: boolean;
}

export interface NavigatorPartVM {
  partId: string;
  partNumber: number;
  title: string; // e.g. "Phần 1: Đúng hay Sai"
  completedCount: number;
  totalCount: number;
  questions: NavigatorBubbleVM[];
}

export interface ExamNavigatorVM {
  activeSkill: SkillId;
  skills: {
    skill: SkillId;
    label: string; // e.g. "Nghe" | "Đọc" | "Viết"
    parts: NavigatorPartVM[];
  }[];
}

export interface ExamTimerVM {
  remainingSeconds: number | null;
  totalDurationSeconds: number | null;
  isPaused: boolean;
  mode: 'practice' | 'mock';
  canSubmit?: boolean;
}

// ==========================================
// 5. SPECIALIZED QUESTION VIEWMODELS
// ==========================================

export interface AudioPlayerVM {
  id: string;
  src?: string;
  state: 'idle' | 'loading' | 'playing' | 'paused' | 'unavailable' | 'error';
  currentSeconds: number;
  durationSeconds: number;
  volume: number; // 0 to 1
  canPause: boolean;
  reason?: string | null;
}

export interface EnhancedExplanationVM {
  answerLabel?: string;
  correctOptionId: string;
  correctSolutionText: string;
  explanationText: string;
  keywords?: {
    word: string;
    pinyin?: string;
    meaning: string;
    grammarNote?: string;
  }[];
  transcriptZh?: string | null;
  transcriptPinyin?: string | null;
  transcriptVi?: string | null;
}

export interface ListeningTrueFalseVM {
  id: string;
  questionNumber: number;
  partTitle: string; // "Phần thi: Đúng hay Sai"
  instruction: string; // "Phán đoán đúng sai"
  imageUrl?: string;
  imageAlt?: string;
  audio: AudioPlayerVM;
  selectedAnswer: boolean | null; // true = Đúng, false = Sai
  isReadOnly?: boolean;
  explanation?: EnhancedExplanationVM | null;
}

export interface ImageOptionVM {
  id: string; // 'A', 'B', 'C'
  label: string; // 'A', 'B', 'C'
  imageUrl: string;
  alt?: string;
  isSelected: boolean;
}

export interface ListeningImageChoiceVM {
  id: string;
  questionNumber: number;
  partTitle: string; // "Phần thi: Chọn ảnh phù hợp"
  instruction: string; // "Chọn đáp án đúng"
  audio: AudioPlayerVM;
  options: ImageOptionVM[];
  selectedOptionId: string | null;
  isReadOnly?: boolean;
  explanation?: EnhancedExplanationVM | null;
}

export interface AudioMatchingSubQuestionVM {
  id: string;
  subNumber: number; // 1, 2, 3, 4, 5
  audio: AudioPlayerVM;
  selectedOptionId: string | null; // 'A', 'B', 'C', 'D', 'E'
  correctOptionId?: string | null; // in review mode: green / red
  isCorrect?: boolean | null;
}

export interface ListeningMatchingVM {
  id: string;
  questionRange: string; // "Câu 1 - 5"
  partTitle: string; // "Phần thi: Ghép ảnh với Audio"
  instruction: string; // "Nối ảnh và đáp án đúng"
  sharedImages: {
    id: string; // 'A', 'B', 'C', 'D', 'E'
    label: string;
    imageUrl: string;
    alt?: string;
  }[];
  subQuestions: AudioMatchingSubQuestionVM[];
  isReadOnly?: boolean;
  explanation?: EnhancedExplanationVM | null;
}

export interface DialogueOptionVM {
  id: string; // 'A', 'B', 'C'
  label: string;
  pinyin?: string;
  hanzi: string;
  isSelected: boolean;
}

export interface ListeningDialogueVM {
  id: string;
  questionNumber: number;
  partTitle: string; // "Phần thi: Hội thoại ngắn"
  instruction: string; // "Chọn đáp án đúng"
  audio: AudioPlayerVM;
  options: DialogueOptionVM[];
  selectedOptionId: string | null;
  isReadOnly?: boolean;
  explanation?: EnhancedExplanationVM | null;
}

// ==========================================
// 6. RESULT PAGE VIEWMODELS
// ==========================================

export interface ResultSkillSectionVM {
  skill: SkillId;
  label: string;
  correctCount: number;
  totalCount: number;
  accuracyPercent: number | null;
}

export interface ResultQuestionItemVM {
  id: string;
  number: number;
  skill: SkillId;
  status: 'correct' | 'incorrect' | 'unanswered' | 'ungraded';
  timeSpentSeconds?: number | null;
  explanation?: EnhancedExplanationVM | null;
}

export interface ResultPageViewVM {
  examId: string;
  title: string;
  durationSeconds: number;
  accuracyPercent: number | null;
  passingScore: number | null;
  userScore?: number | null;
  isPassed?: boolean | null;
  counts: {
    correct: number;
    incorrect: number;
    unanswered: number;
    ungraded: number;
  };
  sections: ResultSkillSectionVM[];
  questions: ResultQuestionItemVM[];
  weaknessNotice?: string;
}
