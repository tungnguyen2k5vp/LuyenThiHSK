import {questionTypeRegistry,validateRegisteredQuestion} from '../../shared/question-types.mjs';
import { ContentProvenance, ExamItem, ExamQuestion, VocabWord } from '../types';
import { getExamBlueprint } from './examBlueprints';

export const PUBLIC_RIGHTS = new Set(['original', 'open_license_verified', 'permission_confirmed']);
const types = new Set(Object.keys(questionTypeRegistry));
const skills = new Set(['listening', 'reading', 'writing', 'translation', 'speaking']);

export function validateProvenance(value: ContentProvenance, label: string): string[] {
  if (!value) return [label + ': thiếu provenance'];
  const errors: string[] = [];
  for (const key of ['source_url', 'source_name', 'source_version', 'retrieved_at', 'license', 'attribution'] as const) {
    if (typeof value[key] !== 'string' || !value[key].trim()) errors.push(label + ': thiếu ' + key);
  }
  if (!PUBLIC_RIGHTS.has(value.rights_status)) errors.push(label + ': quyền chưa đủ để public');
  if (typeof value.is_original !== 'boolean' || (value.rights_status === 'original') !== value.is_original) errors.push(label + ': is_original không nhất quán');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.retrieved_at) || !Number.isFinite(Date.parse(value.retrieved_at))) errors.push(label + ': ngày không hợp lệ');
  return errors;
}

export function validateQuestion(question: ExamQuestion, label: string): string[] {
  const errors = validateProvenance(question.provenance, label);
  if (!question.id || !question.promptZh?.trim() || !question.instruction?.trim()) errors.push(label + ': thiếu id/nội dung/hướng dẫn');
  if (!types.has(question.type) || !skills.has(question.skill)) errors.push(label + ': loại câu/kỹ năng không hợp lệ');
  if (!Number.isInteger(question.number) || question.number < 1) errors.push(label + ': số thứ tự không hợp lệ');
  const open = question.type === 'short-answer' || question.type === 'speaking';
  if (!Array.isArray(question.options)) return [...errors, label + ': options phải là mảng'];
  const ids = question.options.map((option) => option.id);
  if (new Set(ids).size !== ids.length || question.options.some((option) => !option.id || !option.text?.trim())) errors.push(label + ': lựa chọn trùng/rỗng');
  if(question.partId||question.matching||question.image)errors.push(...validateRegisteredQuestion(question).map(e=>label+': '+e));
  if(question.matching?.items)return errors;
  if (question.scoring === 'exact-text') {
    if (question.options.length || question.correctOptionId || !question.acceptedAnswers?.length || !(question.answerVerified || question.answerValidation==='SOURCE_KEY_NOT_INDEPENDENTLY_REVIEWED') || !question.explanation) errors.push(label + ': câu nhập thiếu đáp án văn bản đã kiểm tra');
  } else if (open) {
    if (question.correctOptionId || question.options.length) errors.push(label + ': câu mở không có đáp án trắc nghiệm');
    if (!question.rubric?.length) errors.push(label + ': câu mở thiếu rubric');
  } else {
    if (question.options.length < 2 || !question.correctOptionId || !ids.includes(question.correctOptionId)) errors.push(label + ': thiếu đáp án hoặc id đáp án sai');
    if (!question.explanation?.trim()) errors.push(label + ': thiếu giải thích');
    if (question.type === 'true-false' && question.options.length !== 2) errors.push(label + ': đúng/sai phải có 2 lựa chọn');
  }
  return errors;
}

export function validateContent(exams: ExamItem[], words: VocabWord[]): string[] {
  const errors: string[] = [];
  const examIds = new Set<string>();
  const questionVersions = new Map<string, string>();
  for (const exam of exams) {
    const label = exam.id;
    if(exam.contentEnvironment==='PREVIEW'||exam.contentEnvironment==='BETA')errors.push(label+': nội dung riêng chưa qua publication gate production');
    errors.push(...validateProvenance(exam.provenance, label));
    if (examIds.has(exam.id)) errors.push(label + ': id bộ đề trùng');
    examIds.add(exam.id);
    if (!['hsk2', 'hsk3'].includes(exam.version)) errors.push(label + ': phiên bản sai');
    const validLevels = exam.version === 'hsk2' ? ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'Chưa xác minh'] : ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9', 'Chưa xác minh'];
    if (!validLevels.includes(exam.levelCode)) errors.push(label + ': cấp độ sai');
    if (!exam.questions.length || exam.totalQuestions !== exam.questions.length) errors.push(label + ': tổng câu không khớp');
    if (!(exam.durationMinutes > 0) || !Number.isFinite(exam.durationMinutes)) errors.push(label + ': thời gian sai');
    const ids = new Set<string>();
    for (const question of exam.questions) {
      errors.push(...validateQuestion(question, label + '/' + question.id));
      if (ids.has(question.id)) errors.push(label + ': id câu trùng trong bộ đề');
      ids.add(question.id);
      const previous = questionVersions.get(question.id);
      if (previous && previous !== exam.version) errors.push(label + ': câu dùng chung giữa hai phiên bản');
      questionVersions.set(question.id, exam.version);
      if (exam.skill !== 'all' && question.skill !== exam.skill) errors.push(label + ': câu sai kỹ năng bộ đề');
    }
    if (exam.mode === 'full' || exam.durationKind === 'official') {
      errors.push(...fullExamErrors(exam));
      const blueprint = getExamBlueprint(exam.version, exam.levelCode);
      if (!blueprint || exam.totalQuestions !== blueprint.totalQuestions || exam.durationMinutes !== blueprint.durationMinutes) errors.push(label + ': đề đầy đủ không khớp blueprint');
      else for (const section of blueprint.sections) {
        if (section.questionCount !== exam.questions.filter((question) => question.skill === section.skill).length) errors.push(label + ': phân bố kỹ năng không khớp blueprint');
      }
    }
  }
  const wordIds = new Set<string>();
  for (const word of words) {
    errors.push(...validateProvenance(word.provenance, word.id));
    if (wordIds.has(word.id)) errors.push(word.id + ': id từ trùng');
    wordIds.add(word.id);
    if (!word.hanzi || !word.pinyin || !word.vietnamese) errors.push(word.id + ': thiếu từ/pinyin/nghĩa Việt');
    if (!['hsk2', 'hsk3', 'general'].includes(word.hskVersion)) errors.push(word.id + ': phiên bản từ sai');
    if (word.hskVersion === 'general' && word.levelCode !== 'Chưa xác minh') errors.push(word.id + ': từ chưa xác minh có nhãn cấp');
    if (word.hskVersion === 'hsk2' && !/^HSK [1-6]$/.test(word.levelCode)) errors.push(word.id + ': cấp HSK 2.0 sai');
    if (word.hskVersion === 'hsk3' && !/^HSK ([1-6]|7-9)$/.test(word.levelCode)) errors.push(word.id + ': cấp HSK 3.0 sai');
  }
  return errors;
}

export function isPublicExam(exam: ExamItem): boolean {
  return validateContent([exam], []).length === 0;
}

export function fullExamErrors(exam: ExamItem): string[] {
  const errors: string[] = [];
  const config = exam.config;
  const blueprint = getExamBlueprint(exam.version, exam.levelCode);
  if (!config?.structureVerified || !config.rulesVerified || !blueprint) return [exam.id + ': cấu trúc/quy tắc chưa xác minh'];
  if (!config.verification || !/^https:\/\/(www\.)?chinesetest\.cn\//.test(config.verification.sourceUrl) || !Number.isFinite(Date.parse(config.verification.checkedAt)) || !config.verification.note.trim()) errors.push(exam.id + ': thiếu biên bản đối chiếu mẫu/quy tắc chính thức');
  if (!['total', 'section'].includes(config.timing) || !['question', 'section'].includes(config.audio.delivery) || !(config.audio.rate > 0) || (config.audio.maxPlays !== null && (!Number.isInteger(config.audio.maxPlays) || config.audio.maxPlays < 1))) errors.push(exam.id + ': quy tắc thời gian/audio không hợp lệ');
  if (exam.mode !== 'full' || exam.durationKind !== 'official' || exam.isDemo) errors.push(exam.id + ': chưa phải đề đầy đủ được thẩm định');
  if (config.sections.length !== blueprint.sections.length) errors.push(exam.id + ': số phần sai');
  if (config.sections.flatMap((section) => section.questionIds).join('|') !== exam.questions.map((question) => question.id).join('|')) errors.push(exam.id + ': thứ tự câu/phần sai');
  config.sections.forEach((section, index) => {
    const expected = blueprint.sections[index];
    if (!expected || section.skill !== expected.skill || section.questionIds.length !== expected.questionCount || section.durationMinutes !== expected.durationMinutes) errors.push(exam.id + ': cấu hình phần không khớp tham chiếu');
    if (!section.questionTypes.length || exam.questions.some((question) => section.questionIds.includes(question.id) && !section.questionTypes.includes(question.type))) errors.push(exam.id + ': dạng câu không khớp cấu hình');
    if (section.skill === 'listening' && config.audio.delivery === 'section' && !section.audioSrc) errors.push(exam.id + ': thiếu audio toàn phần');
  });
  if (config.audio.kind !== 'file' && exam.questions.some((question) => question.skill === 'listening')) errors.push(exam.id + ': TTS không phải audio thi chuẩn');
  for (const question of exam.questions) {
    if (question.skill === 'listening' && config.audio.delivery === 'question' && (question.audio?.kind !== 'file' || !question.audio.src)) errors.push(exam.id + ': thiếu audio câu');
    if (question.scoring !== 'manual' && question.answerVerified !== true) errors.push(exam.id + ': đáp án chưa xác minh');
  }
  if (new Set(exam.questions.map((question) => question.promptZh)).size !== exam.questions.length) errors.push(exam.id + ': nội dung câu nhân bản');
  return errors;
}
