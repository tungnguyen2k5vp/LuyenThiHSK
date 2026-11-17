import { ExamItem, ExamQuestion } from '../types';
import { CompletedAttempt } from './studyStorage';
import {gradeRegisteredAnswer} from '../../shared/question-types.mjs';
export type QuestionAnswerStatus = 'correct' | 'incorrect' | 'unanswered' | 'self-review';
export const SKILL_LABELS: Record<string, string> = { listening: 'Nghe', reading: 'Đọc', writing: 'Viết', translation: 'Dịch', speaking: 'Nói', all: 'Tất cả phần' };
export function resolveAnswer(question: ExamQuestion, answer = ''): string { return question.legacyOptionAnswers?.[answer] ?? answer; }
export function isOpenQuestion(question: ExamQuestion): boolean {
  return question.scoring === 'manual' || question.type === 'short-answer' || question.type === 'speaking'
    || (question.scoring !== 'exact-text' && !question.correctOptionId&&!question.matching?.items) || !(question.answerVerified===true||question.contentEnvironment==='PREVIEW'&&question.answerValidation==='AI_SELF_CHECKED_NOT_HUMAN'||question.answerValidation==='SOURCE_KEY_NOT_INDEPENDENTLY_REVIEWED');
}
const normalize = (text: string) => text.normalize('NFKC').replace(/[\s。！？，、.!?,]/g, '');
export function questionStatus(question: ExamQuestion, answer?: string): QuestionAnswerStatus {
  if (!answer?.trim()) return 'unanswered';
  if (isOpenQuestion(question)) return 'self-review';
  if (question.scoring === 'exact-text') return question.acceptedAnswers?.some((item) => normalize(item) === normalize(resolveAnswer(question, answer))) ? 'correct' : 'incorrect';
  return gradeRegisteredAnswer(question,answer) ? 'correct' : 'incorrect';
}
export function summarizeAttempt(exam: ExamItem, attempt: Pick<CompletedAttempt, 'answers'>) {
  const statuses = exam.questions.map((question, index) => questionStatus(question, attempt.answers[index]));
  const objectiveQuestionCount = exam.questions.filter((question) => !isOpenQuestion(question)).length;
  const correctCount = statuses.filter((status) => status === 'correct').length;
  const incorrectCount = statuses.filter((status) => status === 'incorrect').length;
  const unansweredCount = statuses.filter((status) => status === 'unanswered').length;
  const openAnsweredCount = statuses.filter((status) => status === 'self-review').length;
  return { correctCount, incorrectCount, unansweredCount, openAnsweredCount,
    ungradedCount: openAnsweredCount,
    objectiveQuestionCount, answeredCount: exam.questions.length - unansweredCount,
    accuracyPercent: objectiveQuestionCount ? Math.round(correctCount / objectiveQuestionCount * 100) : null };
}
export function summarizeBySkill(exam: ExamItem, attempt: CompletedAttempt) {
  return Array.from(new Set(exam.questions.map((question) => question.skill))).map((skill) => {
    const indices = exam.questions.flatMap((question, index) => question.skill === skill ? [index] : []);
    const summary = summarizeAttempt({ ...exam, questions: indices.map((index) => exam.questions[index]) },
      { answers: Object.fromEntries(indices.map((index, i) => [i, attempt.answers[index]])) });
    return { skill, label: SKILL_LABELS[skill], correct: summary.correctCount, objectiveCount: summary.objectiveQuestionCount,
      openAnswered: summary.openAnsweredCount, percent: summary.accuracyPercent, ...summary };
  });
}
