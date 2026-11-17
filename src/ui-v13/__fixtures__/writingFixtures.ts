import { WritingVM } from '../../contracts/ui-v13';

export const mockWritingItem: WritingVM = {
  questionId: 'q-w-201',
  promptZh: '看图，用词语写一个句子：[踢足球] (tī zúqiú)',
  pinyinHint: 'Kàn tú, yòng cíyǔ xiě yí gè jùzi: tī zúqiú',
  value: '下午我和朋友一起踢足球。',
  characterCount: 13,
  hanziCount: 12,
  maxLength: 100,
  readOnly: false,
  composing: false,
  saveState: 'saved',
  saveLabel: 'Đã lưu bản nháp',
  scoring: 'ungraded',
  scoringLabel: 'Chưa chấm · không tính là câu sai',
  help: 'Nhập câu hoàn chỉnh chứa từ khóa "踢足球". Bài viết được lưu tự động để xem lại sau.',
  error: null,
};
