import { ExamQuestion } from '../types';
import { ORIGINAL_QUESTION_PROVENANCE } from './contentMetadata';
import { prepareQuestion } from './prepareQuestion';

const QUESTIONS: Omit<ExamQuestion, 'provenance'>[] = [
  {
    id: 'hsk79-demo-listening-01', number: 1, skill: 'listening', part: 1, type: 'multiple-choice',
    instruction: 'Nghe câu ví dụ rồi chọn ý chính.', audioTitle: 'Giọng máy đọc câu ví dụ tiếng Trung', audioDurationSeconds: 11,
    promptZh: '数字化服务提高了办事效率，但老年人仍需要清晰、可获得的线下帮助。',
    promptPinyin: 'Shùzìhuà fúwù tígāo le bànshì xiàolǜ, dàn lǎoniánrén réng xūyào qīngxī, kě huòdé de xiànxià bāngzhù。',
    promptVi: 'Dịch vụ số nâng cao hiệu quả, nhưng người cao tuổi vẫn cần hỗ trợ trực tiếp, rõ ràng và dễ tiếp cận.',
    options: [
      { id: 'A', text: '数字服务应完全取代线下帮助。' },
      { id: 'B', text: '提高效率的同时，也应保留可获得的线下帮助。' },
      { id: 'C', text: '老年人不需要数字化服务。' },
    ],
    correctOptionId: 'B', explanation: 'Câu nêu lợi ích của dịch vụ số và đồng thời nhấn mạnh nhu cầu hỗ trợ trực tiếp.',
  },
  {
    id: 'hsk79-demo-reading-02', number: 2, skill: 'reading', part: 1, type: 'multiple-choice',
    instruction: 'Đọc đoạn văn và chọn kết luận được hỗ trợ bởi nội dung.',
    promptZh: '城市更新不应只追求建筑外观的变化，还要考察居民的实际需求。只有让公共空间方便不同年龄的人使用，改造才会带来长期价值。',
    promptPinyin: 'Chéngshì gēngxīn bù yīng zhǐ zhuīqiú jiànzhù wàiguān de biànhuà, hái yào kǎochá jūmín de shíjì xūqiú。',
    promptVi: 'Đoạn văn cho rằng đổi mới đô thị cần tính đến nhu cầu thực tế của cư dân và khả năng sử dụng không gian công cộng của nhiều nhóm tuổi.',
    contextZh: '作者认为，城市更新的关键是什么？',
    options: [
      { id: 'A', text: '只改变建筑的外观。' },
      { id: 'B', text: '让公共空间适合不同年龄的居民使用。' },
      { id: 'C', text: '减少居民参与城市生活。' },
    ],
    correctOptionId: 'B', explanation: 'Câu cuối nhấn mạnh không gian công cộng cần thuận tiện cho nhiều độ tuổi.',
  },
  {
    id: 'hsk79-demo-writing-03', number: 3, skill: 'writing', part: 1, type: 'short-answer',
    instruction: 'Viết một đoạn ngắn nêu quan điểm và một lý do.',
    promptZh: '线上学习与课堂学习如何互相补充？请写出你的看法。',
    promptPinyin: 'Xiànshàng xuéxí yǔ kètáng xuéxí rúhé hùxiāng bǔchōng? Qǐng xiě chū nǐ de kànfǎ。',
    promptVi: 'Học trực tuyến và học trên lớp có thể bổ sung cho nhau như thế nào? Hãy viết quan điểm của bạn.',
    options: [],
    responseHint: 'Viết bằng tiếng Trung. Đây là câu trả lời mở, không được hệ thống tự chấm.',
    rubric: ['Nêu rõ quan điểm.', 'Đưa ra ít nhất một lý do hoặc ví dụ.', 'Câu văn dễ hiểu và có liên kết.'],
  },
  {
    id: 'hsk79-demo-translation-04', number: 4, skill: 'translation', part: 1, type: 'short-answer',
    instruction: 'Dịch câu sang tiếng Trung và tự đối chiếu rubric.',
    promptZh: 'Một chính sách tốt cần tính đến cả hiệu quả trước mắt và tác động lâu dài.',
    promptVi: 'Bản tiếng Việt cần dịch sang tiếng Trung.',
    options: [],
    responseHint: 'Nhập bản dịch tiếng Trung của bạn. Có thể dùng giản thể hoặc phồn thể.',
    rubric: ['Giữ đủ ý về hiệu quả trước mắt.', 'Giữ đủ ý về tác động lâu dài.', 'Câu tiếng Trung rõ nghĩa và tự nhiên.'],
  },
  {
    id: 'hsk79-demo-speaking-05', number: 5, skill: 'speaking', part: 1, type: 'speaking',
    instruction: 'Chuẩn bị câu trả lời nói; ghi lại ý chính hoặc bản chép lời để tự đánh giá.',
    promptZh: '请谈谈你认为公共图书馆在数字时代还发挥什么作用。',
    promptPinyin: 'Qǐng tán tan nǐ rènwéi gōnggòng túshūguǎn zài shùzì shídài hái fāhuī shénme zuòyòng。',
    promptVi: 'Theo bạn, thư viện công cộng còn có vai trò gì trong thời đại số?',
    options: [],
    responseHint: 'Không ghi âm hoặc gửi dữ liệu ra ngoài. Bạn có thể gõ dàn ý/bản chép lời để lưu trên thiết bị.',
    rubric: ['Trả lời đúng trọng tâm.', 'Nêu ít nhất một lý do hoặc ví dụ.', 'Diễn đạt mạch lạc, có mở rộng ý.'],
  },
];

export const SAMPLE_QUESTIONS_HSK79: ExamQuestion[] = QUESTIONS.map((question) => prepareQuestion({
  ...question,
  provenance: ORIGINAL_QUESTION_PROVENANCE,
}));
