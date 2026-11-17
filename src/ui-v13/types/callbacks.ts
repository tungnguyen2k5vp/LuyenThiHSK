/**
 * HSK UI V13 - INTERACTION CALLBACKS
 * All presentation components communicate state change or user intent strictly via callbacks.
 * No direct fetch, no database access, no storage access.
 */

export interface TodayCallbacks {
  onStartPrimaryAction: () => void;
  onStartTask: (taskId: string, targetRoute: string, skill?: string) => void;
  onSkipTask: (taskId: string) => void;
  onReviewTask: (taskId: string, targetRoute: string, skill?: string) => void;
  onOpenSettings: () => void;
  onOpenProgressDetails: () => void;
  onOpenWeaknessReview: () => void;
  onOpenVocabWorkspace: () => void;
}

export interface LevelHubCallbacks {
  onSelectLevel: (levelId: string, levelCode: string) => void;
  onSwitchEdition: (edition: 'hsk2' | 'hsk3') => void;
}

export interface VocabBrowserCallbacks {
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: 'all' | 'unlearned' | 'review' | 'favorite') => void;
  onSelectWord: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onToggleLearned: (id: string) => void;
  onPlayAudio: (id: string) => void;
  onStartPractice: (level?: string) => void;
  onOpenFlashcards: () => void;
}

export interface FlashcardCallbacks {
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPlayAudio: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onMarkLearned: (id: string) => void;
  onMarkNeedReview: (id: string) => void;
  onClose: () => void;
}

export interface GrammarCallbacks {
  onSelectLesson: (lessonId: string) => void;
  onSearchChange: (query: string) => void;
  onStartPractice: (lessonId: string) => void;
  onToggleBookmark?: (lessonId: string) => void;
  onCloseReader?: () => void;
}

