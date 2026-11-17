export type HskBand = 1 | 2 | 3 | 4 | 5 | 6 | "7-9";
export type TranslationStatus = "verified" | "machine" | "missing";
export type VisualType = "image" | "illustration" | "icon" | "none";

/** Explicit lifecycle state for a vocabulary item owned by the user. */
export type WordStatus = "NEW" | "LEARNING" | "KNOWN" | "SKIPPED";
/** Backwards-compatible alias used by integrations that call this a vocabulary status. */
export type VocabularyStatus = WordStatus;

export interface ExampleSentence {
  id: string;
  vocabularyId: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  english?: string;
  difficulty: number;
}

export interface Vocabulary {
  id: string;
  simplified: string;
  traditional: string;
  pinyin: string;
  pinyinNumeric: string;
  primaryMeaningVi: string;
  meaningsVi: string[];
  meaningsEn: string[];
  pos: string[];
  hskBand: HskBand;
  frequencyRank: number | null;
  classifiers: string[];
  radical: string | null;
  strokeCount: number | null;
  visualType: VisualType;
  imageUri: string | null;
  imageSource: string | null;
  imageLicense: string | null;
  imageAttribution: string | null;
  audioUri: string | null;
  source: string;
  sourceVersion: string;
  sourceUrl: string;
  translationStatus: TranslationStatus;
  examples: ExampleSentence[];
  masteryLevel?: number;
  status?: WordStatus;
  studied?: boolean;
  nextReviewAt?: string | null;
  reviewCount?: number;
  isFavorite?: boolean;
  due?: string | null;
  isCustom?: boolean;
  deckId?: string | null;
}

export interface PersonalDeck {
  id: string;
  name: string;
  color: string;
  wordCount: number;
  dueCount: number;
  createdAt: string;
  updatedAt: string;
  /** ISO timestamp when the deck was moved to the trash; null while active. */
  deletedAt: string | null;
}

export interface EditableVocabulary {
  id?: string;
  deckId: string;
  simplified: string;
  traditional?: string;
  pinyin: string;
  pinyinNumeric?: string;
  meaningsVi: string[];
  /** English meanings in the same semantic order as meaningsVi. */
  meaningsEn: string[];
  pos: string[];
  hskBand: HskBand;
  imageUri?: string | null;
  examples: Pick<ExampleSentence, "chinese" | "pinyin" | "vietnamese">[];
}

export interface ProgressRow {
  vocabularyId: string;
  status: WordStatus;
  studied: boolean;
  due: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: string | null;
  /** Alias for the persisted last_review timestamp. */
  lastReviewAt?: string | null;
  masteryLevel: number;
  isKnown: boolean;
  isFavorite: boolean;
  isSuspended: boolean;
  memoryLevel: number;
  deepMemoryStage: number;
  learnedAt: string | null;
  nextReviewAt: string;
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  lapseCount: number;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  hintUsedCount: number;
  averageResponseTimeMs: number;
  lastResponseTimeMs: number;
}

export type ReviewMode =
  | "hanzi-meaning"
  | "meaning-hanzi"
  | "pinyin-hanzi"
  | "hanzi-pinyin"
  | "hanzi-recall-pinyin-compose"
  | "audio-meaning"
  | "audio-hanzi"
  | "writing"
  | "cloze";

/** Stable learning-skill names stored with review history. */
export type ReviewExerciseType =
  | "meaning_to_hanzi"
  | "hanzi_to_meaning"
  | "hanzi_to_pinyin"
  | "pinyin_to_hanzi"
  | "audio_to_hanzi"
  | "audio_to_meaning"
  | "writing"
  | "cloze";

export type LearningSkill = "meaning" | "hanziRecall" | "pinyin" | "listening" | "writing" | "tone";

export interface ReviewSkillAttempt {
  reviewedAt: string;
  correct: boolean;
  exerciseType: ReviewExerciseType | null;
  mode: ReviewMode;
}

export interface SkillMasteryMetric {
  skill: LearningSkill;
  attempts: number;
  accuracy: number | null;
  status: "no-data" | "weak" | "building" | "strong";
}
export type ReviewRating = "again" | "hard" | "good" | "easy";

export interface DashboardStats {
  learned: number;
  known: number;
  skipped: number;
  mastered: number;
  due: number;
  reviewedToday: number;
  correctToday: number;
  newToday: number;
  streak: number;
  /** Most recent local study day, or null before the first study session. */
  lastStudyDate: string | null;
  studySeconds: number;
  mastery: number[];
}

export interface UserSettings {
  dailyNewWordGoal: number;
  /** Maximum new cards in one learning session; the daily goal remains separate. */
  learnSessionSize: 5 | 10 | 15 | 20 | 30 | 50 | 75 | 100;
  dailyStudyMinutes: number;
  dailyReviewGoal: number;
  desiredRetention: number;
  selectedHskBands: HskBand[];
  simplifiedOrTraditional: "simplified" | "traditional";
  pinyinVisibility: boolean;
  toneColorEnabled: boolean;
  soundEnabled: boolean;
  autoPlayAudio: boolean;
  speechRate: number;
  hapticEnabled: boolean;
  /** Visual theme preference; system is resolved without an app restart. */
  themeMode: "system" | "light" | "dark";
  /** Honors system accessibility first; users may further reduce or disable decorative motion. */
  motionMode: "full" | "reduced" | "off";
  /** Local on-device reminder; disabled until the learner explicitly opts in. */
  dailyReminderEnabled: boolean;
  dailyReminderHour: number;
  dailyReminderMinute: number;
  onboardingCompleted: boolean;
  reviewStyle: "automatic" | "self-rating";
  reviewSessionSize: 5 | 10 | 15 | 20;
  practiceWritingEarly: boolean;
}
