import { ExamItem, ExamRuntimeConfig } from '../types';
import { SKILL_LABELS } from './examScoring';
export function getExamConfig(exam: ExamItem): ExamRuntimeConfig {
  if (exam.config) return exam.config;
  return { structureVerified: false, rulesVerified: false, timing: 'total',
    sections: Array.from(new Set(exam.questions.map((question) => question.skill))).map((skill) => ({
      skill, label: SKILL_LABELS[skill], questionIds: exam.questions.filter((question) => question.skill === skill).map((question) => question.id),
      questionTypes: Array.from(new Set(exam.questions.filter((question) => question.skill === skill).map((question) => question.type))),
      durationMinutes: exam.durationMinutes })),
    audio: { kind: exam.questions.some((question) => question.skill === 'listening'&&question.audio?.kind==='file') ? 'file' : exam.questions.some((question) => question.skill === 'listening') ? 'tts' : 'none',
      delivery: 'question', maxPlays: null, allowSeek: true, allowRateChange: true, rate: 1 },
    navigation: { previousSections: true, futureSections: true, withinSection: true } };
}
export function sectionOfQuestion(exam: ExamItem, index: number): number {
  return getExamConfig(exam).sections.findIndex((section) => section.questionIds.includes(exam.questions[index]?.id));
}
export function canNavigate(exam: ExamItem, current: number, target: number, mode: 'practice' | 'timed', activeSection?: number): boolean {
  if (target < 0 || target >= exam.questions.length) return false;
  if (mode === 'practice') return true;
  const config = getExamConfig(exam);
  const from = activeSection ?? sectionOfQuestion(exam, current);
  const to = sectionOfQuestion(exam, target);
  return to === from ? config.navigation.withinSection || target >= current
    : to < from ? config.navigation.previousSections : config.navigation.futureSections;
}
