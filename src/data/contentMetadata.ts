import { ContentProvenance } from '../types';

const CONTENT_REVIEW_DATE = '2026-10-07';

export const STROKE_DATASET_PROVENANCE: ContentProvenance = {
  source_url: 'local:src/components/vocab/StrokeLookup.tsx',
  source_name: 'Sơ đồ nét chữ tự vẽ cho LuyenThiHSK',
  source_version: '6 ký tự mẫu 1.0', retrieved_at: CONTENT_REVIEW_DATE,
  license: 'SVG sơ đồ gốc được tạo cho dự án; không lấy nét từ font hoặc dataset ngoài.',
  rights_status: 'original', is_original: true, attribution: 'LuyenThiHSK — SVG sơ đồ tự vẽ.',
};

export const ORIGINAL_QUESTION_PROVENANCE: ContentProvenance = {
  source_url: 'local:src/data/mockQuestions',
  source_name: 'Câu hỏi tự biên soạn cho LuyenThiHSK',
  source_version: 'bản demo 1.0',
  retrieved_at: CONTENT_REVIEW_DATE,
  license: 'Nội dung gốc của dự án; không sao chép đề thi hoặc audio bên ngoài.',
  rights_status: 'original',
  is_original: true,
  attribution: 'LuyenThiHSK — câu hỏi minh họa tự biên soạn.',
};

export const ORIGINAL_VOCAB_PROVENANCE: ContentProvenance = {
  source_url: 'local:src/data/mockVocab',
  source_name: 'Từ vựng minh họa tự biên soạn cho LuyenThiHSK',
  source_version: 'bản demo 1.0',
  retrieved_at: CONTENT_REVIEW_DATE,
  license: 'Nghĩa tiếng Việt và câu ví dụ được biên soạn cho bản demo; chưa gắn danh sách cấp độ HSK chính thức.',
  rights_status: 'original',
  is_original: true,
  attribution: 'LuyenThiHSK — dữ liệu minh họa tự biên soạn.',
};
