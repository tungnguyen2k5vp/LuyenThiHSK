import { findQuestion } from '../data/examCatalog';
import { ExamItem } from '../types';
import { questionStatus } from './examScoring';
import { ReviewItem } from './studyStorage';
export function deduplicateReviews(items: ReviewItem[]): ReviewItem[] {
  const map = new Map<string, ReviewItem>();
  for (const item of items) {
    const found = findQuestion(item.questionId);
    if (!found) continue;
    const key = (found.exam.contentEnvironment==='PREVIEW'?'preview:':'') + found.exam.version + ':' + item.questionId;
    const current = map.get(key);
    if (!current || Date.parse(item.lastReviewedAt ?? item.createdAt) >= Date.parse(current.lastReviewedAt ?? current.createdAt)) map.set(key, { ...item, examId: found.exam.id, id: key });
  }
  return [...map.values()];
}
export function updateReview(items: ReviewItem[], exam: ExamItem, questionIndex: number, answer: string | undefined, flagged = false): ReviewItem[] {
  const question = exam.questions[questionIndex];
  if (!question) return items;
  const key = (exam.contentEnvironment==='PREVIEW'?'preview:':'') + exam.version + ':' + question.id;
  const previous = deduplicateReviews(items).find((item) => item.id === key);
  const others = deduplicateReviews(items).filter((item) => item.id !== key);
  const status = questionStatus(question, answer);
  if (status === 'correct' && !flagged || status === 'self-review' && !flagged) return others;
  const base = findQuestion(question.id);
  const now = new Date().toISOString();
  return [...others, { id: key, examId: base?.exam.id ?? exam.id, questionId: question.id, questionNumber: question.number,
    reason: status === 'incorrect' ? 'incorrect' : status === 'unanswered' ? 'unanswered' : 'flagged',
    createdAt: previous?.createdAt ?? now, lastReviewedAt: now, dueAt: now, reviewCount: (previous?.reviewCount ?? 0) + 1 }];
}
