import { z } from 'zod';
import type { Vocabulary, ReviewMode } from './reused/models';
import { applyReview, initialLearningSchedule, isDifficult, isReviewDue, type SrsProgress } from './reused/scheduler.ts';
import { toLocalDateKey, calculateStreak } from './reused/calendar.ts';
import { buildStudyHeatmap } from './reused/heatmap.ts';
import { normalizePinyinInput } from './reused/pinyin.ts';
import type { VocabularyTopicId } from './reused/vocabulary-topics';

export interface StudyWord extends Vocabulary {
  syllabusLevels: string[]; topicId: VocabularyTopicId; legacyIds: string[];
  audioExamples: { id: string; zh: string; pinyin: string; en: string; audioUrl: string; slowAudioUrl?: string; sourceName: string; license: string }[];
}
const integer = z.number().int().nonnegative();
const date = z.iso.datetime();
const progressSchema = z.object({
  status: z.enum(['LEARNING', 'KNOWN', 'SKIPPED']), studied: z.boolean(),
  memoryLevel: integer.max(6), deepMemoryStage: integer.max(4), nextReviewAt: date,
  learnedAt: date.nullable(), reviewCount: integer, correctCount: integer, wrongCount: integer,
  lapseCount: integer, consecutiveCorrect: integer, consecutiveWrong: integer, hintUsedCount: integer,
  averageResponseTimeMs: z.number().nonnegative(), lastResponseTimeMs: z.number().nonnegative(), isKnown: z.boolean(),
}).refine(value => value.isKnown === (value.status === 'KNOWN') && (value.status === 'LEARNING'
  ? value.studied && value.memoryLevel >= 1 && value.learnedAt !== null
  : !value.studied && value.memoryLevel === 0 && value.learnedAt === null), 'Trạng thái học và cấp nhớ không nhất quán.');
export type WordProgress = z.infer<typeof progressSchema>;
const sessionSchema = z.object({
  id: z.string(), kind: z.enum(['learn', 'review', 'practice']), ids: z.array(z.string()).max(200),
  index: integer, pass: z.number().int().min(1).max(3), mode: z.string(),
  graded: z.array(z.string()).max(200), retried: z.array(z.string()).max(200), completed: integer,
  feedback: z.object({ correct: z.boolean(), mode: z.string(), nextReviewAt: date.nullable() }).nullable().default(null),
}).refine(value => value.index <= value.ids.length);
export type LearningSession = z.infer<typeof sessionSchema>;
const eventSchema = z.object({ id: z.string(), at: date, wordId: z.string(), kind: z.enum(['learn', 'review', 'practice']), correct: z.boolean(), mode: z.string(), responseTimeMs: z.number().nonnegative() });
export type StudyEvent = z.infer<typeof eventSchema>;
const dataSchema = z.object({
  version: z.literal(1), updatedAt: date,
  settings: z.object({ dailyGoal: z.number().int().min(1).max(100), minutes: z.number().int().min(5).max(180), size: z.number().int().min(1).max(50), pinyin: z.boolean() }),
  progress: z.record(z.string(), progressSchema), favorites: z.array(z.string()),
  decks: z.array(z.object({ id: z.string(), name: z.string().trim().min(1).max(80), wordIds: z.array(z.string()).max(20000) })).max(200),
  events: z.array(eventSchema).max(50000), seconds: z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.number().nonnegative()),
  session: sessionSchema.nullable(),
});
export type LearningData = z.infer<typeof dataSchema>;
export const LEARNING_KEY = '4chinese-web-learning-v1';
export function emptyLearning(): LearningData {
  return { version: 1, updatedAt: new Date().toISOString(), settings: { dailyGoal: 10, minutes: 20, size: 10, pinyin: true }, progress: {}, favorites: [], decks: [], events: [], seconds: {}, session: null };
}
export function parseLearning(value: unknown): LearningData { return dataSchema.parse(value); }
export function readLearning(): LearningData {
  const stored = localStorage.getItem(LEARNING_KEY);
  return stored ? parseLearning(JSON.parse(stored)) : emptyLearning();
}
export function initialProgress(status: WordProgress['status'], now = new Date()): WordProgress {
  const schedule = initialLearningSchedule(now);
  return { ...schedule, status, studied: status === 'LEARNING', memoryLevel: status === 'LEARNING' ? 1 : 0,
    learnedAt: status === 'LEARNING' ? now.toISOString() : null, isKnown: status === 'KNOWN',
    reviewCount: 0, correctCount: 0, wrongCount: 0, lapseCount: 0, consecutiveCorrect: 0, consecutiveWrong: 0,
    hintUsedCount: 0, averageResponseTimeMs: 0, lastResponseTimeMs: 0 };
}
export function reviewQueue(words: StudyWord[], data: LearningData, now = new Date()): StudyWord[] {
  return words.filter(word => { const p = data.progress[word.id]; return p && isReviewDue({ ...p, isSuspended: false }, now); })
    .sort((a, b) => Number(isDifficult(data.progress[b.id])) - Number(isDifficult(data.progress[a.id])) || data.progress[a.id].nextReviewAt.localeCompare(data.progress[b.id].nextReviewAt));
}
export function createSession(kind: LearningSession['kind'], ids: string[], mode = 'auto'): LearningSession {
  if (!ids.length || ids.length > 100 || new Set(ids).size !== ids.length) throw Error('Chọn từ 1 đến 100 từ khác nhau để bắt đầu.');
  return { id: crypto.randomUUID(), kind, ids, index: 0, pass: 1, mode, graded: [], retried: [], completed: 0, feedback: null };
}
export function finishLearningWord(data: LearningData, wordId: string, now = new Date()): LearningData {
  if (data.progress[wordId]) throw Error('Từ này đã đổi trạng thái. Hãy tải lại phiên học.');
  const event: StudyEvent = { id: crypto.randomUUID(), at: now.toISOString(), wordId, kind: 'learn', correct: true, mode: 'meaning-hanzi', responseTimeMs: 0 };
  return { ...data, progress: { ...data.progress, [wordId]: initialProgress('LEARNING', now) }, events: [...data.events, event].slice(-50000) };
}
export function gradeReview(data: LearningData, wordId: string, correct: boolean, mode: ReviewMode, responseTimeMs: number, hinted: boolean, now = new Date()): LearningData {
  const session = data.session, before = data.progress[wordId];
  if (!session || !before) throw Error('Phiên ôn không còn khả dụng.');
  if (session.ids[session.index] !== wordId) throw Error('Từ này không thuộc lượt ôn hiện tại.');
  if (session.feedback) throw Error('Câu trả lời đã được lưu. Chọn tiếp tục.');
  const scheduled = session.kind === 'review' && !session.graded.includes(wordId);
  if (scheduled && !isReviewDue({ ...before, isSuspended: false }, now)) throw Error('Lịch ôn đã được cập nhật. Hãy quay lại danh sách ôn.');
  const next = scheduled ? applyReview(before as SrsProgress, { correct, responseTimeMs, hintUsed: hinted }, now) : null;
  const event: StudyEvent = { id: crypto.randomUUID(), at: now.toISOString(), wordId, kind: scheduled ? 'review' : 'practice', correct, mode, responseTimeMs };
  let ids = session.ids, retried = session.retried;
  if (!correct && !retried.includes(wordId) && ids.length < 200) { ids = [...ids, wordId]; retried = [...retried, wordId]; }
  return { ...data,
    progress: next ? { ...data.progress, [wordId]: { ...before, ...next } } : data.progress,
    events: [...data.events, event].slice(-50000),
    session: { ...session, ids, retried, graded: [...new Set([...session.graded, wordId])], feedback: { correct, mode, nextReviewAt: next?.nextReviewAt ?? null } },
  };
}
export function learningStats(data: LearningData, now = new Date()) {
  const today = toLocalDateKey(now), values = Object.values(data.progress);
  const activity = new Map<string, { date: string; newWords: number; reviewed: number }>();
  for (const event of data.events) {
    const day = toLocalDateKey(new Date(event.at)), row = activity.get(day) ?? { date: day, newWords: 0, reviewed: 0 };
    if (event.kind === 'learn') row.newWords++; else row.reviewed++;
    activity.set(day, row);
  }
  const reviews = data.events.filter(event => event.kind === 'review'), todayReviews = reviews.filter(event => toLocalDateKey(new Date(event.at)) === today);
  return { learned: values.filter(p => p.studied).length, known: values.filter(p => p.status === 'KNOWN').length,
    skipped: values.filter(p => p.status === 'SKIPPED').length, deep: values.filter(p => p.studied && p.memoryLevel === 6).length,
    newToday: activity.get(today)?.newWords ?? 0, reviewedToday: todayReviews.length,
    correctToday: todayReviews.filter(event => event.correct).length,
    accuracy: reviews.length ? Math.round(reviews.filter(event => event.correct).length / reviews.length * 100) : null,
    streak: calculateStreak([...activity.keys()], now), todaySeconds: data.seconds[today] ?? 0,
    heatmap: buildStudyHeatmap([...activity.values()], now, 28),
    levels: [1, 2, 3, 4, 5, 6].map(level => values.filter(p => p.studied && p.memoryLevel === level).length),
  };
}
export function searchText(value: string) { return normalizePinyinInput(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().replace(/\s+/g, ''); }
export function wordSearch(word: StudyWord) { return searchText([word.simplified, word.traditional, word.pinyin, word.pinyinNumeric, word.primaryMeaningVi, ...word.meaningsVi, ...word.meaningsEn].join(' ')); }
export function answerOptions(word: StudyWord, pool: StudyWord[], field: 'simplified' | 'pinyin' | 'primaryMeaningVi') {
  const correct = word[field];
  const choices = [...new Set([correct, ...pool.filter(item => item.id !== word.id).map(item => item[field])])].filter(Boolean).slice(0, 4);
  // Stable during a turn; changing selection must not move the answer buttons.
  const offset = [...word.id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % choices.length;
  return [...choices.slice(offset), ...choices.slice(0, offset)];
}
