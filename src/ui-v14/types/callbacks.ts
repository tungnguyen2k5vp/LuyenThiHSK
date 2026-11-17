import { LevelId, SkillId } from './viewmodels';

export interface ExamCatalogCallbacks {
  onSelectExam: (examId: string) => void;
  onSelectLevel: (level: LevelId) => void;
  onSelectTab: (tab: 'mock' | 'skill' | 'short') => void;
  onSearchChange: (query: string) => void;
  onFilterChange: (status: 'all' | 'not_started' | 'in_progress' | 'completed') => void;
}

export interface ExamIntroCallbacks {
  onToggleMode: (mode: 'practice' | 'mock') => void;
  onStartExam: (examId: string, mode: 'practice' | 'mock') => void;
  onBack: () => void;
}

export interface ListeningInstructionCallbacks {
  onClose: () => void;
  onConfirm: () => void;
  onTestAudio?: () => void;
}

export interface AudioPlayerCallbacks {
  onPlay: (audioId: string) => void;
  onPause: (audioId: string) => void;
  onSeek: (audioId: string, seconds: number) => void;
  onVolumeChange: (audioId: string, volume: number) => void;
}

export interface ExamRoomCallbacks {
  onSelectSkill: (skill: SkillId) => void;
  onSelectQuestion: (index: number) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSubmitExam: () => void;
  onFlagQuestion?: (questionId: string) => void;
  onBack: () => void;
  // Answering callbacks
  onAnswerTrueFalse?: (questionId: string, answer: boolean) => void;
  onAnswerChoice?: (questionId: string, optionId: string) => void;
  onAnswerMatching?: (subQuestionId: string, optionId: string) => void;
  onAnswerText?: (questionId: string, text: string) => void;
  // Audio playback
  audioCallbacks?: AudioPlayerCallbacks;
}

export interface ResultPageCallbacks {
  onRetryExam: (examId: string) => void;
  onReviewQuestion?: (questionId: string) => void;
  onBackToCatalog: () => void;
}
