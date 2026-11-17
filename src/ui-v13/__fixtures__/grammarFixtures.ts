import { GrammarLessonViewModel, GrammarCatalogViewModel } from '../types/viewmodels';

export const mockGrammarLessonsHSK1: GrammarLessonViewModel[] = [
  {
    id: 'hsk1-g-001',
    code: 'HSK1-G01',
    title: 'Câu khẳng định với chữ 是 (shì)',
    level: 'HSK 1',
    structure: 'Chủ ngữ + 是 + Tân ngữ',
    explanation: 'Chữ "是" tương đương với từ "là" trong tiếng Việt, dùng để phán đoán hoặc khẳng định một sự vật, hiện tượng là gì hoặc ai.',
    masteryLevel: 'mastered',
    practiceQuestionCount: 5,
    contentStatus: 'NEEDS_REVIEW',
    sourceNotice: 'Ngữ pháp HSK 1 Tiêu Chuẩn',
    examples: [
      {
        chinese: '我是中国人。',
        pinyin: 'Wǒ shì Zhōngguó rén.',
        vietnamese: 'Tôi là người Trung Quốc.',
      },
      {
        chinese: '他是我的老师。',
        pinyin: 'Tā shì wǒ de lǎoshī.',
        vietnamese: 'Thầy ấy là giáo viên của tôi.',
      },
    ],
    comparison: {
      title: 'Phân biệt phủ định: 不是 (bù shì) vs 没 (méi)',
      itemA: {
        label: '不是 (bù shì)',
        structure: 'Chủ ngữ + 不是 + Tân ngữ',
        usage: 'Dùng để phủ định phán đoán ("không phải là")',
        example: '我不是学生。(Tôi không phải là học sinh.)',
      },
      itemB: {
        label: '没有 (méiyǒu)',
        structure: 'Chủ ngữ + 没有 + Tân ngữ / Động từ',
        usage: 'Dùng để biểu thị không sở hữu ("không có") hoặc hành động chưa xảy ra ("chưa")',
        example: '我没有苹果。(Tôi không có táo.)',
      },
      summary: 'Tuyệt đối không dùng "没是" trong tiếng Hán. Phủ định của "是" luôn luôn là "不是".',
    },
  },
  {
    id: 'hsk1-g-002',
    code: 'HSK1-G02',
    title: 'Câu nghi vấn với trợ từ 吗 (ma)',
    level: 'HSK 1',
    structure: 'Mệnh đề khẳng định + 吗？',
    explanation: 'Trợ từ nghi vấn "吗" đặt ở cuối câu trần thuật để biến câu đó thành câu hỏi Có/Không (Yes/No question).',
    masteryLevel: 'learning',
    practiceQuestionCount: 6,
    contentStatus: 'NEEDS_REVIEW',
    sourceNotice: 'Ngữ pháp HSK 1 Tiêu Chuẩn',
    examples: [
      {
        chinese: '你好吗？',
        pinyin: 'Nǐ hǎo ma?',
        vietnamese: 'Bạn có khỏe không?',
      },
      {
        chinese: '你喜欢喝茶吗？',
        pinyin: 'Nǐ xǐhuan hē chá ma?',
        vietnamese: 'Bạn có thích uống trà không?',
      },
    ],
  },
];

export const mockGrammarCatalogHSK1: GrammarCatalogViewModel = {
  level: 'HSK 1',
  lessons: mockGrammarLessonsHSK1,
  masteredCount: 1,
  totalCount: 68,
  searchQuery: '',
  contentStatus: 'NEEDS_REVIEW',
};
