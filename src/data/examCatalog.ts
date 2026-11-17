import { ExamItem, ExamQuestion, SkillType } from '../types';
import { MOCK_EXAMS } from './mockExams';
import { getExamConfig } from '../services/examRules';
import { SKILL_LABELS } from '../services/examScoring';
import { isPublicExam } from './contentValidation';

export const QUESTION_BANKS = MOCK_EXAMS.filter((exam) => ['exam-hsk2-general-demo', 'exam-hsk3-general-demo', 'exam-hsk79-practice-demo'].includes(exam.id));
export const FULL_EXAMS = MOCK_EXAMS.filter((exam) => exam.mode === 'full' && isPublicExam(exam));
const PART_MINUTES: Record<string, number> = { listening: 5, reading: 8, writing: 8, translation: 4, speaking: 4 };
const remembered = new Map<string, ExamItem>();
export function rememberExam(exam: ExamItem) { remembered.set(exam.id, exam); }
export function makePartExam(bank: ExamItem, skill: SkillType): ExamItem {
  const questions = bank.questions.filter((question) => skill === 'all' || question.skill === skill);
  const exam: ExamItem = { ...bank, id: skill === 'all' ? bank.id : `part:${bank.id}:${skill}`,
    title: skill === 'all' ? `Bài luyện tổng hợp · ${bank.levelCode}` : `Luyện ${SKILL_LABELS[skill].toLowerCase()} · ${bank.levelCode}`,
    questions, totalQuestions: questions.length, skill, skillLabel: skill === 'all' ? getExamConfig(bank).sections.map((section) => section.label).join(' · ') : SKILL_LABELS[skill],
    durationMinutes: skill === 'all' ? bank.durationMinutes : PART_MINUTES[skill],
    mode: 'quick', modeLabel: 'Bài luyện ngắn', config: undefined,
    contentLabel: questions.some((question) => question.skill === 'listening') ? 'Minh họa · luyện nghe bằng giọng máy' : 'Minh họa · tự biên soạn',
  };
  return { ...exam, config: getExamConfig(exam) };
}
export const PART_EXAMS = QUESTION_BANKS.flatMap((bank) => ['all', ...Array.from(new Set(bank.questions.map((question) => question.skill)))].map((skill) => makePartExam(bank, skill as SkillType)));
export function resolveExam(item: { examId: string; examSnapshot?: ExamItem }): ExamItem | undefined {
  return item.examSnapshot ?? remembered.get(item.examId) ?? [...MOCK_EXAMS, ...PART_EXAMS].find((exam) => exam.id === item.examId);
}
export function reviewExam(base: ExamItem, questionIds: string[]): ExamItem {
  const questions = base.questions.filter((question) => questionIds.includes(question.id));
  const exam = { ...base, id: 'review:' + base.version + ':' + base.id, title: 'Ôn câu sai · ' + base.levelCode,
    mode: 'quick' as const, durationKind: 'custom' as const, isDemo: true, questions, totalQuestions: questions.length, config: undefined };
  return { ...exam, config: getExamConfig(exam) };
}
export function findQuestion(questionId: string): { exam: ExamItem; question: ExamQuestion; index: number } | undefined {
  for (const exam of [...QUESTION_BANKS, ...remembered.values()]) {
    const index = exam.questions.findIndex((question) => question.id === questionId);
    if (index >= 0) return { exam, question: exam.questions[index], index };
  }
}
