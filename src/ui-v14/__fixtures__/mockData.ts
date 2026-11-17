import {
  ExamCatalogVM,
  ExamIntroVM,
  ListeningInstructionModalVM,
  ExamNavigatorVM,
  ExamTimerVM,
  ListeningDialogueVM,
  ListeningTrueFalseVM,
  ListeningImageChoiceVM,
  ListeningMatchingVM,
  ResultPageViewVM,
} from '../types/viewmodels';

export const mockCatalogVM: ExamCatalogVM = {
  activeLevel: '1',
  activeTab: 'mock',
  searchQuery: '',
  statusFilter: 'all',
  tabCounts: {
    mock: { completed: 3, total: 10 },
    skill: 24,
    short: 12,
  },
  exams: [
    {
      id: 'hsk1-mock-1',
      title: 'Đề thi mô phỏng HSK 1 - Đề số 1',
      level: '1',
      durationMinutes: 35,
      totalQuestions: 40,
      listeningCount: 20,
      readingCount: 20,
      status: 'completed',
      lastScore: 185,
      passingScore: 120,
    },
    {
      id: 'hsk1-mock-2',
      title: 'Đề thi mô phỏng HSK 1 - Đề số 2',
      level: '1',
      durationMinutes: 35,
      totalQuestions: 40,
      listeningCount: 20,
      readingCount: 20,
      status: 'in_progress',
      passingScore: 120,
    },
    {
      id: 'hsk1-mock-3',
      title: 'Đề thi mô phỏng HSK 1 - Đề số 3',
      level: '1',
      durationMinutes: 35,
      totalQuestions: 40,
      listeningCount: 20,
      readingCount: 20,
      status: 'not_started',
      passingScore: 120,
    },
    {
      id: 'hsk1-mock-4',
      title: 'Đề thi mô phỏng HSK 1 - Đề số 4',
      level: '1',
      durationMinutes: 35,
      totalQuestions: 40,
      listeningCount: 20,
      readingCount: 20,
      status: 'locked',
      passingScore: 120,
      isLocked: true,
      lockReason: 'Yêu cầu hoàn thành đề 3',
    },
  ],
};

export const mockExamIntroVM: ExamIntroVM = {
  examId: 'hsk1-mock-1',
  title: 'Đề thi mô phỏng HSK 1 - Đề 1',
  level: '1',
  durationMinutes: 35,
  passingScore: 120,
  totalQuestions: 40,
  skills: [
    { skill: 'listening', label: 'Phần thi Nghe', questionCount: 20 },
    { skill: 'reading', label: 'Phần thi Đọc', questionCount: 20 },
  ],
  examMode: 'practice',
  noticePractice:
    'Chế độ Luyện tập: Cho phép tạm dừng audio, xem ngay đáp án và giải thích chi tiết trong khi làm bài.',
  noticeMock:
    'Chế độ Thi thử: Thời gian đếm ngược liên tục mô phỏng phòng thi thật, không thể tạm dừng audio. Đáp án và phân tích sẽ hiển thị sau khi nộp bài.',
};

export const mockListeningInstructionModalVM: ListeningInstructionModalVM = {
  isOpen: true,
  canTestAudio: true,
  parts: [
    { partNumber: 1, title: 'Đúng hay Sai', questionCount: 5 },
    { partNumber: 2, title: 'Chọn ảnh phù hợp', questionCount: 5 },
    { partNumber: 3, title: 'Ghép ảnh với Audio', questionCount: 5 },
    { partNumber: 4, title: 'Hội thoại ngắn', questionCount: 5 },
  ],
};

export const mockExamNavigatorVM: ExamNavigatorVM = {
  activeSkill: 'listening',
  skills: [
    {
      skill: 'listening',
      label: 'Nghe',
      parts: [
        {
          partId: 'p1',
          partNumber: 1,
          title: 'Phần 1: Đúng hay Sai',
          completedCount: 1,
          totalCount: 5,
          questions: [
            { id: 'q1', index: 0, number: 1, status: 'answered', isAllowed: true },
            { id: 'q2', index: 1, number: 2, status: 'unanswered', isAllowed: true },
            { id: 'q3', index: 2, number: 3, status: 'unanswered', isAllowed: true },
            { id: 'q4', index: 3, number: 4, status: 'unanswered', isAllowed: true },
            { id: 'q5', index: 4, number: 5, status: 'unanswered', isAllowed: true },
          ],
        },
        {
          partId: 'p2',
          partNumber: 2,
          title: 'Phần 2: Chọn ảnh phù hợp',
          completedCount: 1,
          totalCount: 5,
          questions: [
            { id: 'q6', index: 5, number: 1, status: 'answered', isAllowed: true },
            { id: 'q7', index: 6, number: 2, status: 'unanswered', isAllowed: true },
            { id: 'q8', index: 7, number: 3, status: 'unanswered', isAllowed: true },
            { id: 'q9', index: 8, number: 4, status: 'unanswered', isAllowed: true },
            { id: 'q10', index: 9, number: 5, status: 'unanswered', isAllowed: true },
          ],
        },
        {
          partId: 'p3',
          partNumber: 3,
          title: 'Phần 3: Ghép ảnh với Audio',
          completedCount: 5,
          totalCount: 5,
          questions: [
            { id: 'q11', index: 10, number: 1, status: 'correct', isAllowed: true },
            { id: 'q12', index: 11, number: 2, status: 'incorrect', isAllowed: true },
            { id: 'q13', index: 12, number: 3, status: 'incorrect', isAllowed: true },
            { id: 'q14', index: 13, number: 4, status: 'incorrect', isAllowed: true },
            { id: 'q15', index: 14, number: 5, status: 'incorrect', isAllowed: true },
          ],
        },
        {
          partId: 'p4',
          partNumber: 4,
          title: 'Phần 4: Hội thoại ngắn',
          completedCount: 1,
          totalCount: 5,
          questions: [
            { id: 'q16', index: 15, number: 1, status: 'current', isAllowed: true },
            { id: 'q17', index: 16, number: 2, status: 'unanswered', isAllowed: true },
            { id: 'q18', index: 17, number: 3, status: 'unanswered', isAllowed: true },
            { id: 'q19', index: 18, number: 4, status: 'unanswered', isAllowed: true },
            { id: 'q20', index: 19, number: 5, status: 'unanswered', isAllowed: true },
          ],
        },
      ],
    },
    {
      skill: 'reading',
      label: 'Đọc',
      parts: [
        {
          partId: 'p5',
          partNumber: 1,
          title: 'Phần 1: Khớp câu với tranh',
          completedCount: 0,
          totalCount: 5,
          questions: [
            { id: 'q21', index: 20, number: 1, status: 'unanswered', isAllowed: true },
            { id: 'q22', index: 21, number: 2, status: 'unanswered', isAllowed: true },
            { id: 'q23', index: 22, number: 3, status: 'unanswered', isAllowed: true },
            { id: 'q24', index: 23, number: 4, status: 'unanswered', isAllowed: true },
            { id: 'q25', index: 24, number: 5, status: 'unanswered', isAllowed: true },
          ],
        },
      ],
    },
  ],
};

export const mockTimerVM: ExamTimerVM = {
  remainingSeconds: 1898, // 31:38
  totalDurationSeconds: 2100, // 35:00
  isPaused: false,
  mode: 'practice',
};

/**
 * Exact replica of the Migii HSK Listening Part 4 screenshot (question 16 / sub 1)
 */
export const mockDialogueQuestionVM: ListeningDialogueVM = {
  id: 'q16-dialogue',
  questionNumber: 1,
  partTitle: 'Phần thi: Hội thoại ngắn',
  instruction: 'Chọn đáp án đúng',
  audio: {
    id: 'audio-q16',
    state: 'paused',
    currentSeconds: 29,
    durationSeconds: 29,
    volume: 0.8,
    canPause: true,
  },
  options: [
    { id: 'A', label: 'A', pinyin: 'xiǎo māo', hanzi: '小猫', isSelected: false },
    { id: 'B', label: 'B', pinyin: 'Xiǎo Wáng', hanzi: '小王', isSelected: false },
    { id: 'C', label: 'C', pinyin: 'xiǎo gǒu', hanzi: '小狗', isSelected: true },
  ],
  selectedOptionId: 'C',
  explanation: {
    correctOptionId: 'C',
    correctSolutionText: 'xiǎo gǒu (小狗 - Chó con)',
    explanationText:
      'Trong đoạn hội thoại, câu hỏi là "谁在桌子下面睡觉？" (Ai đang ngủ dưới bàn?). Câu trả lời khẳng định: "小狗现在在桌子下面睡觉" (Chó con đang ngủ dưới bàn). Do đó đáp án C là đáp án chính xác.',
    transcriptZh: '小狗现在在桌子下面睡觉。谁在桌子下面睡觉？',
    transcriptPinyin: 'Xiǎo gǒu xiànzài zài zhuōzi xiàmiàn shuìjiào. Shéi zài zhuōzi xiàmiàn shuìjiào?',
    transcriptVi: 'Chó con hiện tại đang ngủ ở dưới bàn. Ai đang ngủ ở dưới bàn?',
    keywords: [
      { word: '小狗', pinyin: 'xiǎogǒu', meaning: 'Chó con' },
      { word: '现在', pinyin: 'xiànzài', meaning: 'Hiện tại / Bây giờ' },
      { word: '桌子', pinyin: 'zhuōzi', meaning: 'Cái bàn' },
      { word: '下面', pinyin: 'xiàmiàn', meaning: 'Phía dưới / Ở dưới' },
      { word: '睡觉', pinyin: 'shuìjiào', meaning: 'Ngủ' },
    ],
  },
};

export const mockTrueFalseQuestionVM: ListeningTrueFalseVM = {
  id: 'q1-tf',
  questionNumber: 1,
  partTitle: 'Phần thi: Đúng hay Sai',
  instruction: 'Phán đoán đúng sai',
  imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
  imageAlt: 'Người đang nghe điện thoại',
  audio: {
    id: 'audio-q1',
    state: 'paused',
    currentSeconds: 0,
    durationSeconds: 15,
    volume: 0.8,
    canPause: true,
  },
  selectedAnswer: true,
  explanation: {
    correctOptionId: 'Đúng',
    correctSolutionText: '✓ Đúng',
    explanationText: 'Hình ảnh và lời thoại đều mô tả hành động nghe điện thoại (打电话).',
    transcriptZh: '他在打电话。',
    transcriptPinyin: 'Tā zài dǎ diànhuà.',
    transcriptVi: 'Anh ấy đang gọi điện thoại.',
  },
};

export const mockImageChoiceQuestionVM: ListeningImageChoiceVM = {
  id: 'q6-img',
  questionNumber: 1,
  partTitle: 'Phần thi: Chọn ảnh phù hợp',
  instruction: 'Chọn đáp án đúng',
  audio: {
    id: 'audio-q6',
    state: 'paused',
    currentSeconds: 0,
    durationSeconds: 18,
    volume: 0.8,
    canPause: true,
  },
  options: [
    {
      id: 'A',
      label: 'A',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
      alt: 'Con mèo',
      isSelected: false,
    },
    {
      id: 'B',
      label: 'B',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop&q=80',
      alt: 'Con chó',
      isSelected: true,
    },
    {
      id: 'C',
      label: 'C',
      imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&auto=format&fit=crop&q=80',
      alt: 'Con chim',
      isSelected: false,
    },
  ],
  selectedOptionId: 'B',
};

export const mockMatchingQuestionVM: ListeningMatchingVM = {
  id: 'q11-matching',
  questionRange: 'Câu 1 - 5',
  partTitle: 'Phần thi: Ghép ảnh với Audio',
  instruction: 'Nối ảnh và đáp án đúng',
  sharedImages: [
    {
      id: 'A',
      label: 'A',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
      alt: 'Uống trà',
    },
    {
      id: 'B',
      label: 'B',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=80',
      alt: 'Xem phim',
    },
    {
      id: 'C',
      label: 'C',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&auto=format&fit=crop&q=80',
      alt: 'Đọc sách',
    },
    {
      id: 'D',
      label: 'D',
      imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&auto=format&fit=crop&q=80',
      alt: 'Đi siêu thị',
    },
    {
      id: 'E',
      label: 'E',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=80',
      alt: 'Ăn cơm',
    },
  ],
  subQuestions: [
    {
      id: 'sub-1',
      subNumber: 1,
      audio: { id: 'aud-sub-1', state: 'paused', currentSeconds: 0, durationSeconds: 10, volume: 0.8, canPause: true },
      selectedOptionId: 'A',
      correctOptionId: 'A',
      isCorrect: true,
    },
    {
      id: 'sub-2',
      subNumber: 2,
      audio: { id: 'aud-sub-2', state: 'paused', currentSeconds: 0, durationSeconds: 10, volume: 0.8, canPause: true },
      selectedOptionId: 'C',
      correctOptionId: 'B',
      isCorrect: false,
    },
    {
      id: 'sub-3',
      subNumber: 3,
      audio: { id: 'aud-sub-3', state: 'paused', currentSeconds: 0, durationSeconds: 10, volume: 0.8, canPause: true },
      selectedOptionId: 'D',
      correctOptionId: 'C',
      isCorrect: false,
    },
    {
      id: 'sub-4',
      subNumber: 4,
      audio: { id: 'aud-sub-4', state: 'paused', currentSeconds: 0, durationSeconds: 10, volume: 0.8, canPause: true },
      selectedOptionId: 'B',
      correctOptionId: 'D',
      isCorrect: false,
    },
    {
      id: 'sub-5',
      subNumber: 5,
      audio: { id: 'aud-sub-5', state: 'paused', currentSeconds: 0, durationSeconds: 10, volume: 0.8, canPause: true },
      selectedOptionId: 'E',
      correctOptionId: 'E',
      isCorrect: true,
    },
  ],
};

export const mockResultPageViewVM: ResultPageViewVM = {
  examId: 'hsk1-mock-1',
  title: 'Kết quả Đề thi mô phỏng HSK 1 - Đề số 1',
  durationSeconds: 1680, // 28 minutes
  accuracyPercent: 85,
  passingScore: 120,
  userScore: 170,
  isPassed: true,
  counts: {
    correct: 34,
    incorrect: 6,
    unanswered: 0,
    ungraded: 0,
  },
  sections: [
    {
      skill: 'listening',
      label: 'Phần thi Nghe (听力)',
      correctCount: 18,
      totalCount: 20,
      accuracyPercent: 90,
    },
    {
      skill: 'reading',
      label: 'Phần thi Đọc (阅读)',
      correctCount: 16,
      totalCount: 20,
      accuracyPercent: 80,
    },
  ],
  questions: [
    {
      id: 'res-q1',
      number: 1,
      skill: 'listening',
      status: 'correct',
      timeSpentSeconds: 25,
      explanation: mockTrueFalseQuestionVM.explanation,
    },
    {
      id: 'res-q2',
      number: 2,
      skill: 'listening',
      status: 'incorrect',
      timeSpentSeconds: 32,
      explanation: {
        correctOptionId: 'Sai',
        correctSolutionText: '✕ Sai',
        explanationText: 'Câu thoại mô tả hành động "ngồi xe buýt", trong khi bức tranh là "đi xe đạp".',
        transcriptZh: '她们在坐公共汽车。',
        transcriptPinyin: 'Tāmen zài zuò gōnggòng qìchē.',
        transcriptVi: 'Họ đang ngồi xe buýt.',
      },
    },
    {
      id: 'res-q16',
      number: 16,
      skill: 'listening',
      status: 'correct',
      timeSpentSeconds: 28,
      explanation: mockDialogueQuestionVM.explanation,
    },
  ],
};
