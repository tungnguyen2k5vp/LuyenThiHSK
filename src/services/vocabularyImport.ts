import type { HSKDataEdition, RightsStatus } from '../types';
import { makeStudyId, PersonalVocabularyEntry } from './studyStorage';

export interface VocabularyImportMetadata {
  edition: HSKDataEdition;
  sourceName: string;
  sourceUrl: string;
  sourceVersion: string;
  license: string;
  rightsStatus: RightsStatus;
}

export interface VocabularyImportResult {
  rowsRead: number;
  entries: PersonalVocabularyEntry[];
  errors: string[];
  duplicates: number;
}

const MAX_CSV_BYTES = 2 * 1024 * 1024;
const MAX_IMPORT_ROWS = 2000;
const REQUIRED_HEADERS = ['hanzi', 'pinyin', 'meaning_vi'];

export function parseCsvRows(text: string): { rows: string[][]; malformed?: string } {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  let quoteClosed = false;
  const input = text.replace(/^\uFEFF/, '');
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') { cell += '"'; index += 1; }
      else if (char === '"') { quoted = false; quoteClosed = true; }
      else cell += char;
      continue;
    }
    if (quoteClosed && char !== ',' && char !== '\n' && char !== '\r' && char !== ' ' && char !== '\t') {
      return { rows, malformed: `Dữ liệu thừa sau dấu ngoặc kép gần ký tự ${index + 1}.` };
    }
    if (char === '"') {
      if (cell.length) return { rows, malformed: `Dấu ngoặc kép không hợp lệ gần ký tự ${index + 1}.` };
      quoted = true;
    } else if (char === ',') {
      row.push(cell.trim()); cell = ''; quoteClosed = false;
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[index + 1] === '\n') index += 1;
      row.push(cell.trim()); cell = ''; quoteClosed = false;
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else cell += char;
  }
  if (quoted) return { rows, malformed: 'CSV kết thúc khi một ô vẫn còn mở dấu ngoặc kép.' };
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return { rows };
}

function normalizeLevel(value: string | undefined): string | null | undefined {
  if (!value?.trim()) return null;
  const normalized = value.trim().toUpperCase().replace(/\s+/g, ' ');
  const level = /^HSK\s*(\d)$/.exec(normalized);
  if (level) return `HSK ${level[1]}`;
  if (normalized === 'HSK 7-9' || normalized === 'HSK7-9' || normalized === '7-9') return 'HSK 7-9';
  return undefined;
}

function normalizedWordKey(hanzi: string, pinyin: string): string {
  return `${hanzi.normalize('NFKC').replace(/\s+/g, '')}|${pinyin.normalize('NFKC').trim().toLocaleLowerCase()}`;
}

function validSourceMetadata(metadata: VocabularyImportMetadata): string | undefined {
  if (!['user_supplied', 'unverified'].includes(metadata.rightsStatus)) {
    return 'Import trên trình duyệt không thể chứng nhận license hoặc quyền phát hành; hãy giữ trạng thái chưa xác minh.';
  }
  if (!metadata.sourceName.trim() || !metadata.sourceVersion.trim() || !metadata.license.trim()) {
    return 'Hãy ghi tên nguồn, phiên bản nguồn và giấy phép hoặc ghi rõ “nội dung cá nhân”.';
  }
  if (metadata.sourceName.length > 240 || metadata.sourceVersion.length > 120 || metadata.license.length > 240 || metadata.sourceUrl.length > 2048) {
    return 'Metadata nguồn vượt quá độ dài cho phép.';
  }
  if (metadata.rightsStatus === 'open_license_verified' || metadata.rightsStatus === 'permission_confirmed') {
    try {
      if (new URL(metadata.sourceUrl).protocol !== 'https:') throw new Error();
    } catch { return 'Nguồn có quyền đã xác minh cần URL HTTPS để lưu dấu vết.'; }
  }
  if (metadata.sourceUrl && !metadata.sourceUrl.startsWith('https://') && !metadata.sourceUrl.startsWith('local:')) {
    return 'URL nguồn cần bắt đầu bằng https:// hoặc local:.';
  }
  return undefined;
}

export function parseVocabularyCsv(
  text: string,
  metadata: VocabularyImportMetadata,
  existing: PersonalVocabularyEntry[] = [],
  now = new Date(),
): VocabularyImportResult {
  const errors: string[] = [];
  if (new TextEncoder().encode(text).length > MAX_CSV_BYTES) {
    return { rowsRead: 0, entries: [], errors: ['Tệp CSV vượt quá giới hạn 2 MB.'], duplicates: 0 };
  }
  const sourceError = validSourceMetadata(metadata);
  if (sourceError) return { rowsRead: 0, entries: [], errors: [sourceError], duplicates: 0 };
  const parsed = parseCsvRows(text);
  if (parsed.malformed) return { rowsRead: 0, entries: [], errors: [parsed.malformed], duplicates: 0 };
  if (parsed.rows.length < 2) return { rowsRead: 0, entries: [], errors: ['CSV cần có hàng tiêu đề và ít nhất một từ.'], duplicates: 0 };
  const headers = parsed.rows[0].map((header) => header.trim().toLowerCase().replace(/[ -]+/g, '_'));
  if (new Set(headers).size !== headers.length) return { rowsRead: 0, entries: [], errors: ['Tên cột CSV bị lặp.'], duplicates: 0 };
  const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));
  if (missingHeaders.length) return { rowsRead: 0, entries: [], errors: [`Thiếu cột bắt buộc: ${missingHeaders.join(', ')}.`], duplicates: 0 };
  const column = (name: string) => headers.indexOf(name);
  const get = (cells: string[], name: string) => { const index = column(name); return index < 0 ? '' : (cells[index] ?? '').trim(); };
  const dataRows = parsed.rows.slice(1);
  if (dataRows.length > MAX_IMPORT_ROWS) return { rowsRead: dataRows.length, entries: [], errors: [`Chỉ nhập tối đa ${MAX_IMPORT_ROWS} dòng mỗi lần.`], duplicates: 0 };

  const seen = new Set(existing.map((entry) => normalizedWordKey(entry.hanzi, entry.pinyin)));
  const entries: PersonalVocabularyEntry[] = [];
  let duplicates = 0;
  dataRows.forEach((cells, index) => {
    const line = index + 2;
    if (cells.length !== headers.length) {
      errors.push(`Dòng ${line}: có ${cells.length} ô nhưng tiêu đề có ${headers.length} cột.`);
      return;
    }
    const hanzi = get(cells, 'hanzi');
    const pinyin = get(cells, 'pinyin');
    const meaningVi = get(cells, 'meaning_vi');
    if (!hanzi || !pinyin || !meaningVi) {
      errors.push(`Dòng ${line}: cần đủ hanzi, pinyin và meaning_vi.`);
      return;
    }
    if (hanzi.length > 100 || pinyin.length > 240 || meaningVi.length > 1200) {
      errors.push(`Dòng ${line}: trường văn bản vượt giới hạn.`);
      return;
    }
    if (!/\p{Script=Han}/u.test(hanzi)) {
      errors.push(`Dòng ${line}: hanzi phải chứa ít nhất một chữ Hán.`);
      return;
    }
    const levelCode = normalizeLevel(get(cells, 'level'));
    if (levelCode === undefined || (levelCode === 'HSK 7-9' && metadata.edition === 'hsk2-2015')) {
      errors.push(`Dòng ${line}: cấp HSK không hợp lệ với phiên bản đã chọn.`);
      return;
    }
    const key = normalizedWordKey(hanzi, pinyin);
    if (seen.has(key)) { duplicates += 1; return; }
    seen.add(key);
    const retrievedAt = now.toISOString();
    entries.push({
      id: makeStudyId('word'), hanzi, pinyin, meaningVi,
      traditional: get(cells, 'traditional') || undefined,
      partOfSpeech: get(cells, 'part_of_speech') || undefined,
      levelCode: levelCode ?? null,
      edition: metadata.edition,
      exampleZh: get(cells, 'example_zh') || undefined,
      examplePinyin: get(cells, 'example_pinyin') || undefined,
      exampleVi: get(cells, 'example_vi') || undefined,
      provenance: {
        source_name: metadata.sourceName.trim(),
        source_url: metadata.sourceUrl.trim() || 'local:personal-import',
        source_version: metadata.sourceVersion.trim(),
        retrieved_at: retrievedAt,
        license: metadata.license.trim(),
        rights_status: metadata.rightsStatus,
        is_original: metadata.rightsStatus === 'original',
        attribution: metadata.rightsStatus === 'user_supplied' ? 'Người học nhập riêng trên thiết bị; chưa gửi lên máy chủ.' : metadata.sourceName.trim(),
      },
      createdAt: retrievedAt, intervalDays: 0, easeFactor: 2.5, repetitions: 0,
      reviewCount: 0, dueAt: retrievedAt,
    });
  });
  return { rowsRead: dataRows.length, entries, errors, duplicates };
}

export const VOCABULARY_CSV_TEMPLATE = 'hanzi,pinyin,meaning_vi,level,traditional,part_of_speech,example_zh,example_pinyin,example_vi\n';
