import { ExamQuestion } from '../types';
const SENTENCES: Record<string, string[]> = {
  'q-hsk3-06': ['他常常去图书馆借中文书。'],
  'q-hsk3-07': ['请你把这本词典放在桌子上。'],
  'hsk2-demo-writing-04': ['我昨天看了一部电影。', '昨天我看了一部电影。'],
};
export function prepareQuestion(question: ExamQuestion): ExamQuestion {
  const legacyOptionAnswers = Object.fromEntries(question.options.map((option) => [option.id,
    option.text.includes('(') ? option.text.split('(')[1].replace(/\)$/, '')
      : option.text.includes('—') ? option.text.split('—')[1].trim() : option.text,
  ]));
  if (question.type === 'sentence-order') return {
    ...question, scoring: 'exact-text', answerVerified: true, options: [], correctOptionId: undefined,
    acceptedAnswers: SENTENCES[question.id], sampleAnswer: SENTENCES[question.id]?.[0], legacyOptionAnswers,
    instruction: 'Sắp xếp các cụm từ và nhập câu tiếng Trung hoàn chỉnh.',
    ...(question.id === 'q-hsk3-07' ? { promptZh: '① 请  ② 你  ③ 把这本词典  ④ 放在桌子上', promptPinyin: undefined } : {}),
    explanation: question.id === 'q-hsk3-07'
      ? 'Câu tham khảo: 请你把这本词典放在桌子上。 Trật tự: 请 + người nghe + 把 + đối tượng + hành động.'
      : question.id === 'q-hsk3-06' ? 'Câu tham khảo: 他常常去图书馆借中文书。 Chủ ngữ + phó từ + hai cụm động từ.'
        : 'Chấp nhận 我昨天看了一部电影。 hoặc 昨天我看了一部电影。 Thời gian có thể đứng trước hoặc sau chủ ngữ.',
  };
  if (question.id === 'q-hsk3-09') return {
    ...question, type: 'short-answer', scoring: 'manual', options: [], correctOptionId: undefined,
    sampleAnswer: legacyOptionAnswers.B, legacyOptionAnswers, promptPinyin: undefined,
    instruction: 'Dịch câu tiếng Việt sang tiếng Trung. Nhập câu trả lời của bạn.',
    rubric: ['Giữ đúng ý điều kiện không mưa.', 'Diễn đạt đúng kế hoạch đi leo núi cùng nhau.', 'Dùng trật tự từ tự nhiên.'],
    explanation: 'Bản dịch tham khảo: 明天如果不下雨，我们就一起去爬山。 Có thể có cách diễn đạt tương đương; cần tự đánh giá.',
  };
  return { ...question,
    scoring: question.type === 'short-answer' || question.type === 'speaking' ? 'manual' : 'choice',
    answerVerified: Boolean(question.correctOptionId),
    ...(question.skill === 'listening' ? { audio: { kind: 'tts' as const }, candidatePromptZh: question.contextZh } : {}),
  };
}
