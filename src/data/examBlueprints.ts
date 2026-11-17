import { ContentProvenance, HSKVersion, SkillType } from '../types';

export interface ExamSectionBlueprint {
  skill: Exclude<SkillType, 'all'>;
  label: string;
  questionCount?: number;
  durationMinutes?: number;
}

export interface ExamBlueprint {
  provenance: ContentProvenance;
  version: HSKVersion;
  levelCode: string;
  totalQuestions: number;
  durationMinutes: number;
  durationNote: string;
  sourceUrl: string;
  retrievedAt: string;
  sections: ExamSectionBlueprint[];
}

export const EXAM_VERSIONS = [
  { id: 'hsk2' as const, label: 'HSK 2.0', status: 'Phiên bản truyền thống; giữ dữ liệu riêng' },
  { id: 'hsk3' as const, label: 'HSK 3.0', status: 'Cấu trúc riêng; cấu hình cấp 1–6 chưa xác minh hoàn tất' },
];

/**
 * Official structure references, separate from the small, original practice packs.
 * They are never used to label a short demo pack as a full official mock exam.
 */
const REFERENCE_BLUEPRINTS: Omit<ExamBlueprint, 'provenance'>[] = [
  {
    version: 'hsk2', levelCode: 'HSK 1', totalQuestions: 40, durationMinutes: 40,
    durationNote: 'Khoảng 40 phút, gồm 5 phút điền thông tin; phần thi khoảng 35 phút.',
    sourceUrl: 'https://www.chinesetest.cn/HSK/1', retrievedAt: '2026-10-07',
    sections: [
      { skill: 'listening', label: 'Nghe', questionCount: 20, durationMinutes: 15 },
      { skill: 'reading', label: 'Đọc', questionCount: 20, durationMinutes: 17 },
    ],
  },
  {
    version: 'hsk2', levelCode: 'HSK 2', totalQuestions: 60, durationMinutes: 55,
    durationNote: 'Khoảng 55 phút, gồm 5 phút điền thông tin; phần thi khoảng 50 phút.',
    sourceUrl: 'https://www.chinesetest.cn/HSK/2', retrievedAt: '2026-10-07',
    sections: [
      { skill: 'listening', label: 'Nghe', questionCount: 35, durationMinutes: 25 },
      { skill: 'reading', label: 'Đọc', questionCount: 25, durationMinutes: 22 },
    ],
  },
  {
    version: 'hsk2', levelCode: 'HSK 3', totalQuestions: 80, durationMinutes: 90,
    durationNote: 'Khoảng 90 phút, gồm 5 phút điền thông tin; phần thi khoảng 85 phút.',
    sourceUrl: 'https://www.chinesetest.cn/HSK/3', retrievedAt: '2026-10-07',
    sections: [
      { skill: 'listening', label: 'Nghe', questionCount: 40, durationMinutes: 35 },
      { skill: 'reading', label: 'Đọc', questionCount: 30, durationMinutes: 30 },
      { skill: 'writing', label: 'Viết', questionCount: 10, durationMinutes: 15 },
    ],
  },
  {
    version: 'hsk2', levelCode: 'HSK 4', totalQuestions: 100, durationMinutes: 105,
    durationNote: 'Khoảng 105 phút, gồm 5 phút điền thông tin; phần thi khoảng 100 phút.',
    sourceUrl: 'https://www.chinesetest.cn/HSK/4', retrievedAt: '2026-10-07',
    sections: [
      { skill: 'listening', label: 'Nghe', questionCount: 45, durationMinutes: 30 },
      { skill: 'reading', label: 'Đọc', questionCount: 40, durationMinutes: 40 },
      { skill: 'writing', label: 'Viết', questionCount: 15, durationMinutes: 25 },
    ],
  },
  {
    version: 'hsk2', levelCode: 'HSK 5', totalQuestions: 100, durationMinutes: 125,
    durationNote: 'Khoảng 125 phút, gồm 5 phút điền thông tin; phần thi khoảng 120 phút.',
    sourceUrl: 'https://www.chinesetest.cn/HSK/5', retrievedAt: '2026-10-07',
    sections: [
      { skill: 'listening', label: 'Nghe', questionCount: 45, durationMinutes: 30 },
      { skill: 'reading', label: 'Đọc', questionCount: 45, durationMinutes: 45 },
      { skill: 'writing', label: 'Viết', questionCount: 10, durationMinutes: 40 },
    ],
  },
  {
    version: 'hsk2', levelCode: 'HSK 6', totalQuestions: 101, durationMinutes: 140,
    durationNote: 'Khoảng 140 phút, gồm 5 phút điền thông tin; phần thi khoảng 135 phút.',
    sourceUrl: 'https://www.chinesetest.cn/HSK/6', retrievedAt: '2026-10-07',
    sections: [
      { skill: 'listening', label: 'Nghe', questionCount: 50, durationMinutes: 35 },
      { skill: 'reading', label: 'Đọc', questionCount: 50, durationMinutes: 50 },
      { skill: 'writing', label: 'Viết', questionCount: 1, durationMinutes: 45 },
    ],
  },
  {
    version: 'hsk3', levelCode: 'HSK 7-9', totalQuestions: 98, durationMinutes: 210,
    durationNote: 'Khoảng 210 phút; một bài thi tích hợp, kết quả phân loại dưới cấp 7, cấp 7, cấp 8 hoặc cấp 9.',
    sourceUrl: 'https://www.chinesetest.cn/HSK/7-9', retrievedAt: '2026-10-07',
    sections: [
      { skill: 'listening', label: 'Nghe', questionCount: 40, durationMinutes: 30 },
      { skill: 'reading', label: 'Đọc', questionCount: 47, durationMinutes: 60 },
      { skill: 'writing', label: 'Viết', questionCount: 2, durationMinutes: 55 },
      { skill: 'translation', label: 'Dịch', questionCount: 4, durationMinutes: 41 },
      { skill: 'speaking' as Exclude<SkillType, 'all'>, label: 'Nói', questionCount: 5, durationMinutes: 24 },
    ],
  },
];

export const EXAM_BLUEPRINTS: ExamBlueprint[] = REFERENCE_BLUEPRINTS.map((blueprint) => ({
  ...blueprint,
  provenance: {
    source_url: blueprint.sourceUrl, source_name: 'Chinese Testing International',
    source_version: 'Trang cấu trúc tham chiếu đọc ngày ' + blueprint.retrievedAt,
    retrieved_at: blueprint.retrievedAt, license: 'Chỉ tham khảo thông số; quyền nội dung đề chưa xác minh.',
    rights_status: 'unverified', is_original: false, attribution: 'Chinese Testing International — liên kết tới nguồn cấu trúc.',
  },
}));

export function getExamBlueprint(version: HSKVersion, levelCode: string): ExamBlueprint | undefined {
  return EXAM_BLUEPRINTS.find((item) => item.version === version && item.levelCode === levelCode);
}
