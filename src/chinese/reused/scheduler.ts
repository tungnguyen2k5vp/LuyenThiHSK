import type { ProgressRow, ReviewMode, ReviewRating, WordStatus } from "./models";

export const SRS_CONFIG = {
  initialReviewMinutes: 30,
  levelIntervalsDays: { 2: 1, 3: 2, 4: 3, 5: 5 } as Record<number, number>,
  deepIntervalsDays: [8, 16, 30, 60, 120] as const,
  wrongRetryMinutes: 30,
  difficultRetryMinutes: 5,
  maxRequeuePerSession: 1,
  quickAnswerMultiplier: 1.15,
  easyAnswerMultiplier: 1.2,
  hintMultiplier: 0.5,
  /** Weighted review modes.  The compose exercise is introduced gradually,
   * while the existing modes remain available at every appropriate level. */
  reviewModeWeights: {
    1: {
      "hanzi-meaning": 35,
      "meaning-hanzi": 20,
      "pinyin-hanzi": 20,
      "hanzi-pinyin": 15,
      "hanzi-recall-pinyin-compose": 10,
    },
    2: {
      "hanzi-recall-pinyin-compose": 40,
      "hanzi-meaning": 25,
      "pinyin-hanzi": 20,
      "meaning-hanzi": 10,
      "hanzi-pinyin": 5,
    },
    3: {
      "hanzi-recall-pinyin-compose": 35,
      "meaning-hanzi": 25,
      "audio-meaning": 20,
      "hanzi-meaning": 10,
      "pinyin-hanzi": 10,
    },
    4: {
      "hanzi-recall-pinyin-compose": 25,
      "audio-meaning": 25,
      "meaning-hanzi": 20,
      "hanzi-pinyin": 15,
      writing: 10,
      cloze: 5,
    },
    5: {
      writing: 30,
      "meaning-hanzi": 25,
      cloze: 20,
      "hanzi-recall-pinyin-compose": 15,
      "audio-meaning": 10,
    },
    6: {
      writing: 30,
      "meaning-hanzi": 25,
      "audio-meaning": 20,
      cloze: 25,
    },
  } as Record<number, Partial<Record<ReviewMode, number>>>,
} as const;

/** Public alias so product tuning can adjust mode weights without touching the scheduler. */
export const REVIEW_MODE_WEIGHTS = SRS_CONFIG.reviewModeWeights;

export type SrsProgress = Pick<
  ProgressRow,
  | "memoryLevel"
  | "deepMemoryStage"
  | "reviewCount"
  | "correctCount"
  | "wrongCount"
  | "lapseCount"
  | "consecutiveCorrect"
  | "consecutiveWrong"
  | "hintUsedCount"
  | "averageResponseTimeMs"
  | "lastResponseTimeMs"
  | "isKnown"
>;

export interface ReviewInput {
  correct: boolean;
  rating?: ReviewRating;
  hintUsed?: boolean;
  /** Alias used by the compose UI/specification. */
  usedHint?: boolean;
  responseTimeMs: number;
  /** Optional answer telemetry for the pinyin-to-Hanzi compose exercise. */
  typedPinyin?: string;
  selectedHanzi?: string;
  candidateRank?: number;
  /** Used after three failed attempts in one active practice session. */
  forceLevelOne?: boolean;
}

export interface ReviewTransition extends SrsProgress {
  levelBefore: number;
  deepStageBefore: number;
  nextReviewAt: string;
  difficult: boolean;
  direction: "up" | "same" | "down";
}

const minute = 60_000;
const day = 86_400_000;

export function initialLearningSchedule(now = new Date()) {
  return {
    memoryLevel: 1,
    deepMemoryStage: 0,
    nextReviewAt: addMs(now, SRS_CONFIG.initialReviewMinutes * minute),
  };
}

/** Schedule metadata for the separate KNOWN state. KNOWN is not deep memory. */
export function knownWordSchedule(now = new Date()) {
  const nextReviewAt = addMs(now, SRS_CONFIG.deepIntervalsDays[0] * day);
  return { memoryLevel: 0, deepMemoryStage: 0, nextReviewAt };
}

/** Backwards-compatible alias for callers that used the old helper name. */
export const knownStatusSchedule = knownWordSchedule;

export function isReviewDue(
  progress: {
    nextReviewAt: string;
    isSuspended: boolean;
    status?: WordStatus;
    studied?: boolean;
  },
  now = new Date(),
): boolean {
  const dueAt = new Date(progress.nextReviewAt).getTime();
  const eligibleStatus =
    progress.status === undefined ||
    (progress.status === "LEARNING" && progress.studied !== false);
  return (
    eligibleStatus &&
    !progress.isSuspended &&
    Number.isFinite(dueAt) &&
    dueAt <= now.getTime()
  );
}

export function applyReview(
  progress: SrsProgress,
  input: ReviewInput,
  now = new Date(),
): ReviewTransition {
  const levelBefore = clampLevel(progress.memoryLevel);
  const deepStageBefore = clampStage(progress.deepMemoryStage);
  const rating = input.rating;
  const correct = rating === "again" ? false : input.correct;
  const hinted = Boolean((input.hintUsed ?? input.usedHint) && correct);
  const hard = rating === "hard";
  let memoryLevel = levelBefore || 1;
  let deepMemoryStage = deepStageBefore;
  let intervalMs: number;

  if (!correct) {
    memoryLevel = input.forceLevelOne ? 1 : wrongLevel(levelBefore);
    deepMemoryStage = 0;
    const afterCounts = {
      ...progress,
      reviewCount: progress.reviewCount + 1,
      wrongCount: progress.wrongCount + 1,
      lapseCount: progress.lapseCount + 1,
      consecutiveWrong: progress.consecutiveWrong + 1,
    };
    const difficult = isDifficult(afterCounts);
    intervalMs =
      (difficult
        ? SRS_CONFIG.difficultRetryMinutes
        : SRS_CONFIG.wrongRetryMinutes) * minute;
  } else if (hinted || hard) {
    intervalMs =
      normalIntervalMs(memoryLevel, deepMemoryStage) *
      (hinted ? SRS_CONFIG.hintMultiplier : 1);
  } else if (memoryLevel < 5) {
    memoryLevel += 1;
    intervalMs = normalIntervalMs(memoryLevel, deepMemoryStage);
  } else if (memoryLevel === 5) {
    memoryLevel = 6;
    deepMemoryStage = 0;
    intervalMs = SRS_CONFIG.deepIntervalsDays[0] * day;
  } else {
    deepMemoryStage = Math.min(4, deepMemoryStage + 1);
    intervalMs = (SRS_CONFIG.deepIntervalsDays[deepMemoryStage] ?? 180) * day;
  }

  if (
    correct &&
    !hinted &&
    input.responseTimeMs > 0 &&
    input.responseTimeMs <= 5_000
  ) {
    intervalMs *= SRS_CONFIG.quickAnswerMultiplier;
  }
  if (correct && rating === "easy" && !hinted)
    intervalMs *= SRS_CONFIG.easyAnswerMultiplier;
  intervalMs = Math.max(SRS_CONFIG.initialReviewMinutes * minute, intervalMs);

  const reviewCount = progress.reviewCount + 1;
  const correctCount = progress.correctCount + (correct ? 1 : 0);
  const wrongCount = progress.wrongCount + (correct ? 0 : 1);
  const averageResponseTimeMs = Math.round(
    (progress.averageResponseTimeMs * progress.reviewCount +
      Math.max(0, input.responseTimeMs)) /
      reviewCount,
  );
  const next = {
    memoryLevel,
    deepMemoryStage,
    reviewCount,
    correctCount,
    wrongCount,
    lapseCount: progress.lapseCount + (correct ? 0 : 1),
    consecutiveCorrect: correct ? progress.consecutiveCorrect + 1 : 0,
    consecutiveWrong: correct ? 0 : progress.consecutiveWrong + 1,
    hintUsedCount: progress.hintUsedCount + (hinted ? 1 : 0),
    averageResponseTimeMs,
    lastResponseTimeMs: Math.max(0, input.responseTimeMs),
    isKnown: progress.isKnown,
  };
  return {
    ...next,
    levelBefore,
    deepStageBefore,
    nextReviewAt: addMs(now, intervalMs),
    difficult: isDifficult(next),
    direction:
      memoryLevel > levelBefore
        ? "up"
        : memoryLevel < levelBefore
          ? "down"
          : "same",
  };
}

export function normalIntervalMs(
  memoryLevel: number,
  deepStage: number,
): number {
  if (memoryLevel <= 1) return SRS_CONFIG.initialReviewMinutes * minute;
  if (memoryLevel < 6)
    return (SRS_CONFIG.levelIntervalsDays[memoryLevel] ?? 1) * day;
  return (SRS_CONFIG.deepIntervalsDays[clampStage(deepStage)] ?? 180) * day;
}

export function wrongLevel(level: number): number {
  if (level <= 2) return 1;
  if (level <= 4) return 2;
  if (level === 5) return 3;
  return 4;
}

export function isDifficult(
  progress: Pick<
    SrsProgress,
    "reviewCount" | "wrongCount" | "lapseCount" | "consecutiveWrong"
  >,
): boolean {
  return (
    progress.lapseCount >= 3 ||
    progress.consecutiveWrong >= 2 ||
    (progress.reviewCount > 0 &&
      progress.wrongCount / progress.reviewCount >= 0.4)
  );
}

export function getReviewMode(
  progress: Pick<SrsProgress, "memoryLevel" | "reviewCount">,
  vocabularyId: string,
  practiceWritingEarly = false,
): ReviewMode {
  const level = Math.max(1, Math.min(6, Math.trunc(progress.memoryLevel || 1)));
  const weights = { ...(SRS_CONFIG.reviewModeWeights[level] ?? SRS_CONFIG.reviewModeWeights[1]) };
  if (practiceWritingEarly) {
    weights.writing = (weights.writing ?? 0) + 15;
  }
  const entries = (Object.entries(weights) as [ReviewMode, number][])
    .filter(([, weight]) => weight > 0);
  const seed = [...vocabularyId].reduce(
    (sum, char) => sum + (char.codePointAt(0) ?? 0),
    progress.reviewCount * 17,
  );
  const totalWeight = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let bucket = totalWeight > 0 ? Math.abs(seed) % totalWeight : 0;
  for (const [mode, weight] of entries) {
    if (bucket < weight) return mode;
    bucket -= weight;
  }
  return entries[0]?.[0] ?? "hanzi-meaning";
}

export function formatDueInterval(
  nextReviewAt: string,
  now = new Date(),
): string {
  const difference = new Date(nextReviewAt).getTime() - now.getTime();
  if (!Number.isFinite(difference) || difference <= 0) return "Đến hạn ôn";
  const minutes = Math.max(1, Math.round(difference / minute));
  const preciseMinutes = `${minutes.toLocaleString("vi-VN")} phút`;
  if (minutes < 60) return preciseMinutes;
  if (minutes < 1_440) return `${preciseMinutes} (≈ ${Math.round(minutes / 60)} giờ)`;
  const days = Math.round(minutes / 1_440);
  return `${preciseMinutes} (≈ ${days < 30 ? `${days} ngày` : `${Math.round(days / 30)} tháng`})`;
}

function addMs(now: Date, ms: number): string {
  return new Date(now.getTime() + ms).toISOString();
}
function clampLevel(level: number): number {
  return Math.max(0, Math.min(6, Math.trunc(level || 0)));
}
function clampStage(stage: number): number {
  return Math.max(0, Math.min(4, Math.trunc(stage || 0)));
}
