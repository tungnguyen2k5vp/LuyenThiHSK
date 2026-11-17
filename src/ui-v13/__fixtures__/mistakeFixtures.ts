import { MistakeReviewVM } from '../../contracts/ui-v13';

export const mockMistakeReviewData: MistakeReviewVM = {
  meta: {
    contractVersion: '13.0',
    level: '1',
    content: {
      environment: 'preview',
      label: 'AI_GENERATED',
      humanReviewed: false,
      published: false,
      rights: 'unknown',
    },
    a11y: {
      headingId: 'v13-mistakes-hsk1',
      label: 'Sổ tay câu sai HSK 1',
      live: 'polite',
    },
  },
  total: 4,
  dueCount: 2,
  unavailableCount: 0,
  notice: 'Hệ thống tự động lên lịch nhắc lại các câu sai theo chu kỳ 1 ngày, 3 ngày, 7 ngày.',
  items: [
    {
      reviewId: 'rev-001',
      questionId: 'q-hsk1-102',
      title: 'Phán đoán Đúng/Sai: 他正在喝茶。',
      skill: 'listening',
      reason: 'incorrect',
      dueAt: new Date().toISOString(), // due today
      relatedWordIds: ['hsk1-w-001'],
      relatedGrammarIds: ['hsk1-g-001'],
      availableIndependent: 3,
      action: {
        id: 'act-rev-1',
        label: 'Ôn tập ngay',
        availability: { available: true, reason: null, count: 1 },
        command: { kind: 'practice', level: '1', skill: 'listening' },
      },
    },
    {
      reviewId: 'rev-002',
      questionId: 'q-hsk1-105',
      title: 'Điền từ vào chỗ trống: 他是我的______。',
      skill: 'reading',
      reason: 'incorrect',
      dueAt: new Date().toISOString(), // due today
      relatedWordIds: ['hsk1-w-003'],
      relatedGrammarIds: ['hsk1-g-001'],
      availableIndependent: 5,
      action: {
        id: 'act-rev-2',
        label: 'Ôn tập ngay',
        availability: { available: true, reason: null, count: 1 },
        command: { kind: 'practice', level: '1', skill: 'reading' },
      },
    },
    {
      reviewId: 'rev-003',
      questionId: 'q-hsk1-109',
      title: 'Câu hỏi nghi vấn trợ từ 吗',
      skill: 'reading',
      reason: 'flagged',
      dueAt: new Date(Date.now() + 86400000).toISOString(), // due tomorrow
      relatedWordIds: [],
      relatedGrammarIds: ['hsk1-g-002'],
      availableIndependent: 2,
      action: {
        id: 'act-rev-3',
        label: 'Xem lại',
        availability: { available: true, reason: null, count: 1 },
        command: { kind: 'practice', level: '1', skill: 'reading' },
      },
    },
    {
      reviewId: 'rev-004',
      questionId: 'q-hsk1-112',
      title: 'Viết câu hoàn chỉnh với từ 踢足球',
      skill: 'writing',
      reason: 'self-review',
      dueAt: new Date(Date.now() + 172800000).toISOString(),
      relatedWordIds: [],
      relatedGrammarIds: [],
      availableIndependent: 1,
      action: null,
    },
  ],
};
