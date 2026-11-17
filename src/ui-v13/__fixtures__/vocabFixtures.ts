import { VocabItemViewModel, VocabBrowserViewModel } from '../types/viewmodels';

export const mockVocabItemsHSK1: VocabItemViewModel[] = [
  {
    id: 'hsk1-w-001',
    word: '爱',
    pinyin: 'ài',
    radical: '爫',
    strokeCount: 10,
    level: 'HSK 1',
    primaryMeaning: 'Yêu, thích',
    primaryPos: 'động từ',
    isFavorite: true,
    isLearned: true,
    srsStage: 'MASTERED',
    audioStatus: 'AVAILABLE',
    audioUrl: '/audio/hsk1/ai.mp3',
    contentStatus: 'NEEDS_REVIEW',
    sourceNotice: 'Giáo trình Chuẩn HSK 1',
    senses: [
      {
        pos: 'động từ',
        meaning: 'Yêu, có tình cảm sâu sắc với ai đó hoặc cái gì đó',
        examples: [
          {
            chinese: '我爱你。',
            pinyin: 'Wǒ ài nǐ.',
            vietnamese: 'Tôi yêu bạn.',
          },
          {
            chinese: '他很爱他的妈妈。',
            pinyin: 'Tā hěn ài tā de māma.',
            vietnamese: 'Anh ấy rất yêu mẹ của mình.',
          },
        ],
      },
      {
        pos: 'động từ',
        meaning: 'Thích làm điều gì đó (thói quen, sở thích)',
        examples: [
          {
            chinese: '我爱喝中国茶。',
            pinyin: 'Wǒ ài hē Zhōngguó chá.',
            vietnamese: 'Tôi thích uống trà Trung Quốc.',
          },
        ],
      },
    ],
  },
  {
    id: 'hsk1-w-002',
    word: '八',
    pinyin: 'bā',
    radical: '八',
    strokeCount: 2,
    level: 'HSK 1',
    primaryMeaning: 'Số tám (8)',
    primaryPos: 'số từ',
    isFavorite: false,
    isLearned: true,
    srsStage: 'MASTERED',
    audioStatus: 'AVAILABLE',
    audioUrl: '/audio/hsk1/ba.mp3',
    contentStatus: 'NEEDS_REVIEW',
    sourceNotice: 'Giáo trình Chuẩn HSK 1',
    senses: [
      {
        pos: 'số từ',
        meaning: 'Số 8 trong tiếng Hán',
        examples: [
          {
            chinese: '他有八个苹果。',
            pinyin: 'Tā yǒu bā gè píngguǒ.',
            vietnamese: 'Anh ấy có 8 quả táo.',
          },
        ],
      },
    ],
  },
  {
    id: 'hsk1-w-003',
    word: '爸爸',
    pinyin: 'bàba',
    radical: '父',
    strokeCount: 8,
    level: 'HSK 1',
    primaryMeaning: 'Bố, ba, cha',
    primaryPos: 'danh từ',
    isFavorite: false,
    isLearned: false,
    srsStage: 'LEARNING',
    audioStatus: 'AVAILABLE',
    audioUrl: '/audio/hsk1/baba.mp3',
    contentStatus: 'NEEDS_REVIEW',
    sourceNotice: 'Giáo trình Chuẩn HSK 1',
    senses: [
      {
        pos: 'danh từ',
        meaning: 'Người cha trong gia đình',
        examples: [
          {
            chinese: '我爸爸是医生。',
            pinyin: 'Wǒ bàba shì yīshēng.',
            vietnamese: 'Bố tôi là bác sĩ.',
          },
        ],
      },
    ],
  },
];

export const mockVocabItemsHSK2: VocabItemViewModel[] = [
  {
    id: 'hsk2-w-001',
    word: '帮助',
    pinyin: 'bāngzhù',
    radical: '巾',
    strokeCount: 12,
    level: 'HSK 2',
    primaryMeaning: 'Giúp đỡ, sự giúp đỡ',
    primaryPos: 'động từ / danh từ',
    isFavorite: true,
    isLearned: false,
    srsStage: 'NEW',
    audioStatus: 'UNAVAILABLE', // Truthful: HSK 2 has 0 audio files available
    contentStatus: 'PREVIEW',
    sourceNotice: 'Bổ sung nội dung HSK 2 (Chờ kiểm duyệt âm thanh)',
    senses: [
      {
        pos: 'động từ',
        meaning: 'Hỗ trợ, giúp đỡ ai đó vượt qua khó khăn',
        examples: [
          {
            chinese: '谢谢你帮助我。',
            pinyin: 'Xièxie nǐ bāngzhù wǒ.',
            vietnamese: 'Cảm ơn bạn đã giúp đỡ tôi.',
          },
        ],
      },
      {
        pos: 'danh từ',
        meaning: 'Sự hỗ trợ, sự giúp đỡ',
        examples: [
          {
            chinese: '有了你的帮助，我学得很快。',
            pinyin: 'Yǒu le nǐ de bāngzhù, wǒ xué de hěn kuài.',
            vietnamese: 'Nhờ có sự giúp đỡ của bạn, tôi học rất nhanh.',
          },
        ],
      },
    ],
  },
  {
    id: 'hsk2-w-002',
    word: '便宜',
    pinyin: 'piányi',
    radical: '亻',
    strokeCount: 9,
    level: 'HSK 2',
    primaryMeaning: 'Rẻ, giá cả phải chăng',
    primaryPos: 'tính từ',
    isFavorite: false,
    isLearned: true,
    srsStage: 'REVIEW',
    audioStatus: 'UNAVAILABLE',
    contentStatus: 'PREVIEW',
    sourceNotice: 'Bổ sung nội dung HSK 2',
    senses: [
      {
        pos: 'tính từ',
        meaning: 'Giá tiền thấp, không đắt',
        examples: [
          {
            chinese: '这件衣服很便宜。',
            pinyin: 'Zhè jiàn yīfu hěn piányi.',
            vietnamese: 'Chiếc áo này rất rẻ.',
          },
        ],
      },
    ],
  },
];

export const mockVocabBrowserHSK1: VocabBrowserViewModel = {
  level: 'HSK 1',
  totalCount: 150,
  learnedCount: 68,
  searchQuery: '',
  selectedFilter: 'all',
  items: mockVocabItemsHSK1,
  hasMore: false,
  contentStatus: 'NEEDS_REVIEW',
};

export const mockVocabBrowserHSK2: VocabBrowserViewModel = {
  level: 'HSK 2',
  totalCount: 200,
  learnedCount: 34,
  searchQuery: '',
  selectedFilter: 'all',
  items: mockVocabItemsHSK2,
  hasMore: false,
  contentStatus: 'PREVIEW',
};
