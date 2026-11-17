import {ownerStorageKey,captureCloudRecords} from './cloudSync';
import { ExamItem } from '../types';
import type { ContentProvenance, HSKDataEdition } from '../types';
import { validateContent,validateQuestion } from '../data/contentValidation';
import type {QuestionTiming} from './questionTiming';
export type StudyMode = 'practice' | 'timed';

export interface SavedStudySession {
  acknowledgedSectionIndexes?: number[];
  questionTimings?: Record<string,QuestionTiming>;
  examSnapshot?: ExamItem;
  audioPausedAt?: string;
  mediaPauseReason?: 'audio'|'image';
  mediaRecoveryRequired?: boolean;
  activeSectionIndex?: number;
  sectionDeadlineAt?: string;
  audioPlayCounts?: Record<string, number>;
  pausedDurationMs?: number;
  id: string;
  examId: string;
  mode: StudyMode;
  answers: Record<number, string>;
  currentIndex: number;
  flaggedQuestionIds: string[];
  checkedQuestionIds: string[];
  startedAt: string;
  deadlineAt?: string;
  updatedAt: string;
}

export interface CompletedAttempt {
  questionTimings?: Record<string,QuestionTiming>;
  endedBy?: 'submitted'|'timeout';
  examSnapshot?: ExamItem;
  id: string;
  examId: string;
  mode: StudyMode;
  answers: Record<number, string>;
  flaggedQuestionIds: string[];
  selfRatings: Record<string, number>;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
}

export interface ReviewItem {
  id: string;
  examId: string;
  questionId: string;
  questionNumber: number;
  reason: 'incorrect' | 'flagged' | 'self-review' | 'unanswered';
  createdAt: string;
  dueAt: string;
  lastReviewedAt?: string;
  reviewCount: number;
}

export interface VocabularyProgress {
  intervalDays?: number;
  status: 'new' | 'learning' | 'mastered';
  reviewCount: number;
  lastReviewedAt?: string;
  dueAt?: string;
}

/** Learner-owned/imported vocabulary stored only in this browser profile. */
export interface PersonalVocabularyEntry {
  id: string;
  hanzi: string;
  traditional?: string;
  pinyin: string;
  meaningVi: string;
  partOfSpeech?: string;
  levelCode: string | null;
  edition: HSKDataEdition;
  exampleZh?: string;
  examplePinyin?: string;
  exampleVi?: string;
  provenance: ContentProvenance;
  createdAt: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  reviewCount: number;
  lastGrade?: number;
  lastReviewedAt?: string;
  dueAt: string;
}

export interface StudyData {
  schemaVersion: 3;
  sessions: SavedStudySession[];
  attempts: CompletedAttempt[];
  reviewItems: ReviewItem[];
  vocabulary: Record<string, VocabularyProgress>;
  wordEntries: PersonalVocabularyEntry[];
}

export const STUDY_STORAGE_KEY = 'hsk-study-data-v1';

export function emptyStudyData(): StudyData {
  return { schemaVersion: 3, sessions: [], attempts: [], reviewItems: [], vocabulary: {}, wordEntries: [] };
}

const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const validDate = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));
const stringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string');
const answerRecord = (value: unknown): boolean => record(value) && Object.entries(value).every(([key, answer]) => /^\d+$/.test(key) && typeof answer === 'string' && answer.length <= 4000);
const validBase = (value: unknown): value is Record<string, unknown> => record(value) && typeof value.id === 'string' && typeof value.examId === 'string' && ['practice', 'timed'].includes(String(value.mode)) && answerRecord(value.answers) && validDate(value.startedAt) && stringArray(value.flaggedQuestionIds);
const validSession = (value: unknown): value is SavedStudySession => validBase(value) && Number.isInteger(value.currentIndex) && Number(value.currentIndex) >= 0 && stringArray(value.checkedQuestionIds) && validDate(value.updatedAt) && (value.mode !== 'timed' || validDate(value.deadlineAt));
const validAttempt = (value: unknown): value is CompletedAttempt => validBase(value) && validDate(value.finishedAt) && typeof value.durationSeconds === 'number' && Number.isFinite(value.durationSeconds) && value.durationSeconds >= 0 && record(value.selfRatings) && Object.values(value.selfRatings).every((rating) => [1, 2, 3].includes(Number(rating)));
const validReview = (value: unknown): value is ReviewItem => record(value) && typeof value.id === 'string' && typeof value.examId === 'string' && typeof value.questionId === 'string' && Number.isInteger(value.questionNumber) && ['incorrect', 'flagged', 'self-review', 'unanswered'].includes(String(value.reason)) && validDate(value.createdAt) && validDate(value.dueAt) && Number.isInteger(value.reviewCount) && Number(value.reviewCount) >= 0;
const validVocabProgress = (value: unknown): value is VocabularyProgress => record(value) && ['new', 'learning', 'mastered'].includes(String(value.status)) && Number.isInteger(value.reviewCount) && Number(value.reviewCount) >= 0 && (value.lastReviewedAt === undefined || validDate(value.lastReviewedAt)) && (value.dueAt === undefined || validDate(value.dueAt)) && (value.intervalDays === undefined || (typeof value.intervalDays === 'number' && Number.isInteger(value.intervalDays) && value.intervalDays >= 1 && value.intervalDays <= 30));
const validWordEntry = (value: unknown): value is PersonalVocabularyEntry => record(value)
  && typeof value.id === 'string' && value.id.length <= 160
  && typeof value.hanzi === 'string' && value.hanzi.length > 0 && value.hanzi.length <= 100
  && typeof value.pinyin === 'string' && value.pinyin.length > 0 && value.pinyin.length <= 240
  && typeof value.meaningVi === 'string' && value.meaningVi.length > 0 && value.meaningVi.length <= 1200
  && (value.traditional === undefined || (typeof value.traditional === 'string' && value.traditional.length <= 100))
  && (value.partOfSpeech === undefined || (typeof value.partOfSpeech === 'string' && value.partOfSpeech.length <= 120))
  && (value.levelCode === null || ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'].includes(String(value.levelCode)))
  && ['hsk2-2015', 'hsk3-2021', 'hsk3-2025', 'unverified'].includes(String(value.edition))
  && record(value.provenance) && ['original', 'user_supplied', 'open_license_verified', 'permission_confirmed', 'unverified'].includes(String(value.provenance.rights_status))
  && typeof value.provenance.source_name === 'string' && value.provenance.source_name.length <= 240
  && typeof value.provenance.source_url === 'string' && value.provenance.source_url.length <= 2048
  && typeof value.provenance.source_version === 'string' && value.provenance.source_version.length <= 120
  && typeof value.provenance.license === 'string' && value.provenance.license.length <= 240
  && validDate(value.provenance.retrieved_at)
  && typeof value.provenance.attribution === 'string' && value.provenance.attribution.length <= 1000
  && validDate(value.createdAt) && validDate(value.dueAt)
  && Number.isInteger(value.intervalDays) && Number(value.intervalDays) >= 0 && Number(value.intervalDays) <= 3650
  && typeof value.easeFactor === 'number' && Number.isFinite(value.easeFactor) && value.easeFactor >= 1.3
  && Number.isInteger(value.repetitions) && Number(value.repetitions) >= 0
  && Number.isInteger(value.reviewCount) && Number(value.reviewCount) >= 0
  && (value.lastGrade === undefined || (Number.isInteger(value.lastGrade) && Number(value.lastGrade) >= 0 && Number(value.lastGrade) <= 5))
  && (value.lastReviewedAt === undefined || validDate(value.lastReviewedAt))
  && (value.exampleZh === undefined || (typeof value.exampleZh === 'string' && value.exampleZh.length <= 1000))
  && (value.examplePinyin === undefined || (typeof value.examplePinyin === 'string' && value.examplePinyin.length <= 1200))
  && (value.exampleVi === undefined || (typeof value.exampleVi === 'string' && value.exampleVi.length <= 1200));

function cleanSnapshot<T extends { examSnapshot?: ExamItem; questionTimings?: Record<string,QuestionTiming> }>(value: T,allowPreview=false): T {
  if(value.questionTimings){const safe=record(value.questionTimings)?Object.fromEntries(Object.entries(value.questionTimings).filter(([,t])=>record(t)&&validDate(t.questionOpenedAt)&&typeof t.timeSpentMs==='number'&&Number.isFinite(t.timeSpentMs)&&t.timeSpentMs>=0&&Number.isInteger(t.answerChangeCount)&&Number(t.answerChangeCount)>=0&&Number.isInteger(t.flagCount)&&Number(t.flagCount)>=0&&(t.firstAnswerAt===undefined||validDate(t.firstAnswerAt))&&(t.finalAnswerAt===undefined||validDate(t.finalAnswerAt)))):{};value={...value,questionTimings:safe as Record<string,QuestionTiming>};}
  try { const e=value.examSnapshot;if (!e || (allowPreview||/^(?:review:[^:]+:)?local-practice:/.test(e.id))&&e.contentEnvironment==='PREVIEW'&&e.durationKind==='custom'&&e.questions.length>0&&e.questions.length<=500&&e.totalQuestions===e.questions.length&&Number.isFinite(e.durationMinutes)&&e.durationMinutes>0&&new Set(e.questions.map(q=>q.id)).size===e.questions.length&&e.questions.every(q=>!validateQuestion(q,e.id).length)&& (e.mode!=='full'||e.formatAuthority==='PLATFORM_PRACTICE'&&e.config?.structureVerified===false&&e.config?.rulesVerified===false)||!validateContent([e], []).length) return value; } catch { /* Preserve the historical record when its snapshot is malformed. */ }
  const copy = { ...value }; delete copy.examSnapshot; return copy;
}

function cleanSession(value: SavedStudySession,allowPreview=false): SavedStudySession {
  const next = cleanSnapshot({ ...value },allowPreview);
  if (!validDate(next.audioPausedAt)) delete next.audioPausedAt;
  if (!validDate(next.sectionDeadlineAt)) delete next.sectionDeadlineAt;
  if (!Number.isInteger(next.activeSectionIndex) || Number(next.activeSectionIndex) < 0) delete next.activeSectionIndex;
  if (!Number.isFinite(next.pausedDurationMs) || Number(next.pausedDurationMs) < 0) delete next.pausedDurationMs;
  if (next.audioPlayCounts) next.audioPlayCounts = record(next.audioPlayCounts) ? Object.fromEntries(Object.entries(next.audioPlayCounts).filter(([, count]) => Number.isInteger(count) && count >= 0)) : {};
  return next;
}

export function readStudyData(storageKey=STUDY_STORAGE_KEY,allowPreview=false): StudyData {
  if (typeof window === 'undefined') return emptyStudyData();
  storageKey=ownerStorageKey(storageKey);
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return emptyStudyData();
    const parsed = JSON.parse(raw) as Partial<StudyData>;
    const sourceVersion = Number(parsed.schemaVersion);
    if (![1, 2, 3].includes(sourceVersion)) return emptyStudyData();
    if (sourceVersion < 3) {
      const backupKey = storageKey + (sourceVersion === 1 ? '-backup' : '-backup-v2');
      try { if (!window.localStorage.getItem(backupKey)) window.localStorage.setItem(backupKey, raw); } catch { /* Migration can continue if backup storage is unavailable. */ }
    }
    return {
      schemaVersion: 3,
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions.filter(validSession).map(s=>cleanSession(s,allowPreview)).slice(0, 12) : [],
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts.filter(validAttempt).map(a=>cleanSnapshot(a,allowPreview)).slice(0, 100) : [],
      reviewItems: Array.isArray(parsed.reviewItems) ? parsed.reviewItems.filter(validReview) : [],
      vocabulary: record(parsed.vocabulary) ? Object.fromEntries(Object.entries(parsed.vocabulary).filter((entry) => validVocabProgress(entry[1]))) as Record<string, VocabularyProgress> : {},
      wordEntries: Array.isArray(parsed.wordEntries) ? parsed.wordEntries.filter(validWordEntry).slice(0, 20000) : [],
    };
  } catch {
    return emptyStudyData();
  }
}

export function writeStudyData(data: StudyData,storageKey=STUDY_STORAGE_KEY): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const cloud=storageKey===STUDY_STORAGE_KEY;window.localStorage.setItem(ownerStorageKey(storageKey), JSON.stringify(data));if(cloud)captureCloudRecords('study',data);
    return true;
  } catch {
    return false;
  }
}

export function makeStudyId(prefix: string): string {
  const randomPart = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${randomPart}`;
}

export function dueDateAfter(days: number, from = new Date()): string {
  const due = new Date(from);
  due.setDate(due.getDate() + days);
  return due.toISOString();
}
