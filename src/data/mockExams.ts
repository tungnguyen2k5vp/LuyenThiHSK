import { ExamItem } from '../types';
import { ORIGINAL_QUESTION_PROVENANCE } from './contentMetadata';
import { SAMPLE_QUESTIONS_HSK3 } from './mockQuestions';
import { SAMPLE_QUESTIONS_HSK2 } from './mockQuestionsHsk2';
import { SAMPLE_QUESTIONS_HSK79 } from './mockQuestionsAdvanced';
import { isPublicExam } from './contentValidation';

const originalPack = ORIGINAL_QUESTION_PROVENANCE;

/**
 * Small, original practice packs. Durations below are local practice settings,
 * not official HSK timings. No complete official-length question bank is shipped.
 */
export const CANDIDATE_EXAMS: ExamItem[] = [
  {
    id: 'exam-hsk3-general-demo',
    title: 'Bài luyện tổng hợp HSK 3.0 — nội dung tự biên soạn',
    version: 'hsk3', levelCode: 'Chưa xác minh', skill: 'all',
    skillLabel: 'Nghe · Đọc · Viết · Dịch', topic: 'Tổng hợp', mode: 'mini', modeLabel: 'Bài luyện ngắn',
    totalQuestions: SAMPLE_QUESTIONS_HSK3.length, durationMinutes: 25, durationKind: 'custom',
    difficulty: 'Trung bình',
    description: '10 câu gốc để thử luồng làm bài và xem giải thích. Cấp HSK và cấu trúc đề chưa được xác minh.',
    contentLabel: 'Câu hỏi tự biên soạn; không phải đề thi chính thức.',
    provenance: originalPack, isDemo: true, questions: SAMPLE_QUESTIONS_HSK3,
  },
  {
    id: 'exam-hsk3-listening-quick',
    title: 'Luyện nghe — câu ví dụ tự biên soạn',
    version: 'hsk3', levelCode: 'Chưa xác minh', skill: 'listening', skillLabel: 'Luyện Nghe', topic: 'Giao tiếp hằng ngày',
    mode: 'quick', modeLabel: 'Luyện nhanh', totalQuestions: 2, durationMinutes: 5, durationKind: 'custom',
    difficulty: 'Dễ', description: 'Hai câu nghe có thể phát bằng giọng máy trên thiết bị; không có tệp audio bên ngoài.',
    contentLabel: 'Câu hỏi tự biên soạn; cấp độ chưa xác minh.',
    provenance: originalPack, isDemo: true,
    questions: SAMPLE_QUESTIONS_HSK3.filter((question) => question.skill === 'listening'),
  },
  {
    id: 'exam-hsk3-reading-quick',
    title: 'Luyện đọc — câu ví dụ tự biên soạn',
    version: 'hsk3', levelCode: 'Chưa xác minh', skill: 'reading', skillLabel: 'Luyện Đọc', topic: 'Đọc hiểu',
    mode: 'quick', modeLabel: 'Luyện nhanh', totalQuestions: SAMPLE_QUESTIONS_HSK3.filter((question) => question.skill === 'reading').length, durationMinutes: 8, durationKind: 'custom',
    difficulty: 'Trung bình', description: 'Bài đọc ngắn, câu đúng/sai và điền từ. Chọn luyện từng câu để xem giải thích ngay.',
    contentLabel: 'Câu hỏi tự biên soạn; cấp độ chưa xác minh.',
    provenance: originalPack, isDemo: true,
    questions: SAMPLE_QUESTIONS_HSK3.filter((question) => question.skill === 'reading'),
  },
  {
    id: 'exam-hsk3-writing-quick',
    title: 'Luyện sắp xếp câu — nội dung tự biên soạn',
    version: 'hsk3', levelCode: 'Chưa xác minh', skill: 'writing', skillLabel: 'Luyện Viết', topic: 'Sắp xếp câu',
    mode: 'quick', modeLabel: 'Luyện nhanh', totalQuestions: SAMPLE_QUESTIONS_HSK3.filter((question) => question.skill === 'writing').length, durationMinutes: 8, durationKind: 'custom',
    difficulty: 'Trung bình', description: 'Câu trắc nghiệm về trật tự từ. Đây là bài luyện ngắn, không đại diện cấu trúc kỳ thi.',
    contentLabel: 'Câu hỏi tự biên soạn; cấp độ chưa xác minh.',
    provenance: originalPack, isDemo: true,
    questions: SAMPLE_QUESTIONS_HSK3.filter((question) => question.skill === 'writing'),
  },
  {
    id: 'exam-hsk3-translation-quick',
    title: 'Luyện dịch câu — nội dung tự biên soạn',
    version: 'hsk3', levelCode: 'Chưa xác minh', skill: 'translation', skillLabel: 'Luyện Dịch', topic: 'Dịch câu',
    mode: 'quick', modeLabel: 'Luyện nhanh', totalQuestions: 1, durationMinutes: 3, durationKind: 'custom',
    difficulty: 'Trung bình', description: 'Một câu trắc nghiệm dịch để thử chức năng ôn tập; không phải định dạng đề đã xác minh.',
    contentLabel: 'Câu hỏi tự biên soạn; cấp độ chưa xác minh.',
    provenance: originalPack, isDemo: true,
    questions: SAMPLE_QUESTIONS_HSK3.filter((question) => question.skill === 'translation'),
  },
  {
    id: 'exam-hsk2-general-demo',
    title: 'Bài luyện tổng hợp HSK 2.0 — nội dung tự biên soạn',
    version: 'hsk2', levelCode: 'Chưa xác minh', skill: 'all',
    skillLabel: 'Nghe · Đọc · Viết', topic: 'Tổng hợp', mode: 'mini', modeLabel: 'Bài luyện ngắn',
    totalQuestions: SAMPLE_QUESTIONS_HSK2.length, durationMinutes: 12, durationKind: 'custom',
    difficulty: 'Dễ', description: 'Năm câu gốc cho bài luyện ngắn. Cấp độ HSK cụ thể chưa được xác minh.',
    contentLabel: 'Câu hỏi tự biên soạn; không phải đề thi chính thức.',
    provenance: originalPack, isDemo: true, questions: SAMPLE_QUESTIONS_HSK2,
  },
  {
    id: 'exam-hsk2-reading-quick',
    title: 'Luyện đọc — câu ví dụ tự biên soạn',
    version: 'hsk2', levelCode: 'Chưa xác minh', skill: 'reading', skillLabel: 'Luyện Đọc', topic: 'Đọc hiểu',
    mode: 'quick', modeLabel: 'Luyện nhanh', totalQuestions: 2, durationMinutes: 5, durationKind: 'custom',
    difficulty: 'Dễ', description: 'Hai câu đọc ngắn bằng nội dung gốc; cấp độ cụ thể chưa xác minh.',
    contentLabel: 'Câu hỏi tự biên soạn; cấp độ chưa xác minh.',
    provenance: originalPack, isDemo: true,
    questions: SAMPLE_QUESTIONS_HSK2.filter((question) => question.skill === 'reading'),
  },
  {
    id: 'exam-hsk79-practice-demo',
    title: 'Bài luyện thử thách — nhóm HSK 7–9',
    version: 'hsk3', levelCode: 'HSK 7-9', skill: 'all',
    skillLabel: 'Nghe · Đọc · Viết · Dịch · Nói', topic: 'Thử thách học thuật', mode: 'mini', modeLabel: 'Bài luyện ngắn',
    totalQuestions: SAMPLE_QUESTIONS_HSK79.length, durationMinutes: 20, durationKind: 'custom',
    difficulty: 'Thử thách',
    description: 'Năm câu gốc gồm trắc nghiệm và câu trả lời mở. Phần viết, dịch, nói cần tự đánh giá; không được hệ thống tự chấm.',
    contentLabel: 'Tự biên soạn; độ khó chưa được thẩm định theo đề cương.',
    provenance: originalPack, isDemo: true, questions: SAMPLE_QUESTIONS_HSK79,
  },
];

export const MOCK_EXAMS: ExamItem[] = CANDIDATE_EXAMS.filter(isPublicExam);
