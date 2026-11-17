import { PersonalVocabularyEntry } from './studyStorage';

/** SM-2 review scheduling; quality 0..5 follows the original grade scale. */
export interface Sm2Card { intervalDays: number; easeFactor: number; repetitions: number; reviewCount: number; dueAt: string; lastGrade?: number; lastReviewedAt?: string }
export function scheduleSm2<T extends Sm2Card>(entry: T, quality: number, reviewedAt = new Date()): T {
  if (!Number.isInteger(quality) || quality < 0 || quality > 5) throw new RangeError('SM-2 quality must be an integer from 0 to 5.');
  const failed = quality < 3;
  const easeFactor = Math.max(1.3, entry.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const repetitions = failed ? 0 : entry.repetitions + 1;
  const intervalDays = failed ? 1
    : repetitions === 1 ? 1
      : repetitions === 2 ? 6
        : Math.min(3650, Math.max(1, Math.round(entry.intervalDays * easeFactor)));
  const dueAt = new Date(reviewedAt);
  dueAt.setDate(dueAt.getDate() + intervalDays);
  return {
    ...entry,
    easeFactor,
    intervalDays,
    repetitions,
    reviewCount: entry.reviewCount + 1,
    lastGrade: quality,
    lastReviewedAt: reviewedAt.toISOString(),
    dueAt: dueAt.toISOString(),
  };
}

export function dueVocabulary(entries: PersonalVocabularyEntry[], now = new Date()): PersonalVocabularyEntry[] {
  const cutoff = now.getTime();
  return entries.filter((entry) => Date.parse(entry.dueAt) <= cutoff)
    .sort((left, right) => Date.parse(left.dueAt) - Date.parse(right.dueAt));
}
