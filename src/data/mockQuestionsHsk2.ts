import { ExamQuestion } from '../types';
import { ORIGINAL_QUESTION_PROVENANCE } from './contentMetadata';
import { prepareQuestion } from './prepareQuestion';

const QUESTIONS: Omit<ExamQuestion, 'provenance'>[] = [
  {
    id: 'hsk2-demo-listen-01', number: 1, skill: 'listening', part: 1, type: 'multiple-choice',
    instruction: 'Nghe câu tiếng Trung và chọn địa điểm được nhắc đến.',
    audioTitle: 'Giọng máy đọc câu ví dụ tiếng Trung', audioDurationSeconds: 8,
    promptZh: '今天下午我们去商店买水果。', promptPinyin: 'Jīntiān xiàwǔ wǒmen qù shāngdiàn mǎi shuǐguǒ。',
    promptVi: 'Chiều nay chúng tôi đi cửa hàng mua trái cây.',
    options: [
      { id: 'A', text: '学校', pinyin: 'xuéxiào', translation: 'trường học' },
      { id: 'B', text: '商店', pinyin: 'shāngdiàn', translation: 'cửa hàng' },
      { id: 'C', text: '医院', pinyin: 'yīyuàn', translation: 'bệnh viện' },
    ],
    correctOptionId: 'B', explanation: 'Câu có cụm “去商店” — đi đến cửa hàng.',
  },
  {
    id: 'hsk2-demo-reading-02', number: 2, skill: 'reading', part: 1, type: 'true-false',
    instruction: 'Đọc câu và chọn nhận định đúng hoặc sai.',
    promptZh: '妹妹每天早上七点起床，然后坐公共汽车去学校。',
    promptPinyin: 'Mèimei měitiān zǎoshang qī diǎn qǐchuáng, ránhòu zuò gōnggòng qìchē qù xuéxiào。',
    promptVi: 'Em gái thức dậy lúc bảy giờ mỗi sáng, sau đó đi xe buýt đến trường.',
    contextZh: '妹妹每天坐公共汽车去学校。',
    options: [
      { id: 'A', text: '正确 (Đúng)' },
      { id: 'B', text: '错误 (Sai)' },
    ],
    correctOptionId: 'A', explanation: 'Thông tin trong nhận định trùng với câu đã cho.',
  },
  {
    id: 'hsk2-demo-reading-03', number: 3, skill: 'reading', part: 2, type: 'fill-blank',
    instruction: 'Chọn từ thích hợp để hoàn thành câu.',
    promptZh: '桌子上有三______苹果。', promptPinyin: 'Zhuōzi shàng yǒu sān ______ píngguǒ。',
    promptVi: 'Trên bàn có ba ___ táo.',
    options: [
      { id: 'A', text: '本', pinyin: 'běn', translation: 'lượng từ cho sách' },
      { id: 'B', text: '个', pinyin: 'gè', translation: 'lượng từ phổ biến' },
      { id: 'C', text: '张', pinyin: 'zhāng', translation: 'lượng từ cho vật phẳng' },
    ],
    correctOptionId: 'B', explanation: '“个” là lượng từ phổ biến dùng với “苹果” trong câu này.',
  },
  {
    id: 'hsk2-demo-writing-04', number: 4, skill: 'writing', part: 1, type: 'sentence-order',
    instruction: 'Chọn trật tự từ tạo thành câu tự nhiên.',
    promptZh: '① 昨天  ② 我  ③ 看了  ④ 一部电影',
    promptPinyin: '① zuótiān  ② wǒ  ③ kàn le  ④ yí bù diànyǐng',
    promptVi: 'Sắp xếp: hôm qua / tôi / đã xem / một bộ phim.',
    options: [
      { id: 'A', text: '② ① ③ ④ — 我昨天看了一部电影。' },
      { id: 'B', text: '① ③ ② ④ — 昨天看了我一部电影。' },
      { id: 'C', text: '④ ② ③ ① — 一部电影我看了昨天。' },
    ],
    correctOptionId: 'A', explanation: 'Trật tự phù hợp: chủ ngữ + thời gian + động từ + tân ngữ.',
  },
  {
    id: 'hsk2-demo-listen-05', number: 5, skill: 'listening', part: 2, type: 'multiple-choice',
    instruction: 'Nghe câu tiếng Trung và chọn thời điểm được nhắc đến.',
    audioTitle: 'Giọng máy đọc câu ví dụ tiếng Trung', audioDurationSeconds: 7,
    promptZh: '火车八点半开，我们七点五十分到车站。',
    promptPinyin: 'Huǒchē bā diǎn bàn kāi, wǒmen qī diǎn wǔshí fēn dào chēzhàn。',
    promptVi: 'Tàu khởi hành lúc tám giờ rưỡi, chúng tôi đến ga lúc bảy giờ năm mươi.',
    options: [
      { id: 'A', text: '七点半', pinyin: 'qī diǎn bàn' },
      { id: 'B', text: '七点五十分', pinyin: 'qī diǎn wǔshí fēn' },
      { id: 'C', text: '八点半', pinyin: 'bā diǎn bàn' },
    ],
    correctOptionId: 'B', explanation: 'Người nói cho biết họ đến ga lúc 7 giờ 50 phút.',
  },
];

export const SAMPLE_QUESTIONS_HSK2: ExamQuestion[] = QUESTIONS.map((question) => prepareQuestion({
  ...question,
  provenance: ORIGINAL_QUESTION_PROVENANCE,
}));
