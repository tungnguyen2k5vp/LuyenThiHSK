import { normalizeLexicalReading } from "./lexical-reading.ts";

export const HSK30_VERSION = "HSK3.0_2025-11";
export const HSK30_LEVELS = ["1", "2", "3", "4", "5", "6", "7-9"] as const;
export const HSK30_KINDS = [
  "vocabulary",
  "grammar",
  "topic",
  "task",
  "hanzi",
] as const;
export type Hsk30Kind = (typeof HSK30_KINDS)[number];
export type SourceRow = Record<string, string>;
export type Hsk30Bundle = {
  version: string;
  zipSha256: string;
  files: Record<string, string>;
  rows: Record<Hsk30Kind, SourceRow[]>;
  examples: SourceRow[];
};
export const HSK30_COUNTS: Record<Hsk30Kind, readonly number[]> = {
  vocabulary: [300, 200, 500, 1000, 1600, 1800, 5600],
  grammar: [70, 78, 96, 95, 70, 50, 134],
  topic: [30, 34, 54, 77, 72, 68, 92],
  task: [59, 76, 109, 139, 109, 97, 89],
  hanzi: [246, 225, 434, 591, 581, 563, 1648],
};

/** Strict RFC4180 reader: preserves field contents, including embedded newlines. */
export function parseHsk30Csv(input: string): SourceRow[] {
  const text = input.replace(/^\uFEFF/u, "");
  const matrix: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false,
    closed = false;
  const pushRow = () => {
    row.push(cell);
    if (row.some((value) => value !== "")) matrix.push(row);
    row = [];
    cell = "";
    closed = false;
  };
  for (let i = 0; i < text.length; i++) {
    const char = text[i]!;
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else cell += char;
    } else if (char === '"') {
      if (cell || closed) throw new Error("CSV_INVALID_QUOTE");
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
      closed = false;
    } else if (char === "\r" || char === "\n") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      pushRow();
    } else {
      if (closed) throw new Error("CSV_TRAILING_QUOTED_CONTENT");
      cell += char;
    }
  }
  if (quoted) throw new Error("CSV_UNTERMINATED_QUOTE");
  if (cell || row.length || closed) pushRow();
  const [headers, ...records] = matrix;
  if (
    !headers?.length ||
    headers.some((h) => !h) ||
    new Set(headers).size !== headers.length
  )
    throw new Error("CSV_INVALID_HEADERS");
  return records.map((values, index) => {
    if (values.length !== headers.length)
      throw new Error(`CSV_COLUMN_COUNT:${index + 2}`);
    return Object.fromEntries(
      headers.map((header, column) => [header, values[column]!]),
    );
  });
}

export function sourceLevel(row: SourceRow): string {
  const level = row.hsk_level?.replace(/^HSK/u, "");
  if (!level || !HSK30_LEVELS.includes(level as never))
    throw new Error(`INVALID_SOURCE_LEVEL:${row.hsk_level}`);
  return level;
}

export function validateHsk30Bundle(bundle: Hsk30Bundle): void {
  if (
    bundle.version !== HSK30_VERSION ||
    !/^[a-f0-9]{64}$/u.test(bundle.zipSha256)
  )
    throw new Error("INVALID_SOURCE_VERSION_OR_CHECKSUM");
  const allIds = new Set<string>();
  const grammarIds = new Map<string, SourceRow>();
  for (const kind of HSK30_KINDS) {
    const counts = HSK30_LEVELS.map(() => 0);
    for (const row of bundle.rows[kind]) {
      if (!row.id || allIds.has(row.id))
        throw new Error(`DUPLICATE_SOURCE_ID:${row.id}`);
      allIds.add(row.id);
      if (
        row.syllabus_version !== bundle.version ||
        !/^[a-f0-9]{64}$/u.test(row.source_sha256 ?? "")
      )
        throw new Error(`INVALID_SOURCE_ROW:${row.id}`);
      const level = sourceLevel(row);
      if (
        row.hsk_min !== (level === "7-9" ? "7" : level) ||
        row.hsk_max !== (level === "7-9" ? "9" : level)
      )
        throw new Error(`INVALID_SOURCE_RANGE:${row.id}`);
      counts[HSK30_LEVELS.indexOf(level as never)]!++;
      if (kind === "vocabulary" && (!row.word || !row.pinyin))
        throw new Error(`EMPTY_VOCABULARY:${row.id}`);
      if (kind === "grammar") grammarIds.set(row.id, row);
    }
    if (JSON.stringify(counts) !== JSON.stringify(HSK30_COUNTS[kind]))
      throw new Error(`SOURCE_COUNTS_MISMATCH:${kind}`);
  }
  if (bundle.examples.length !== 2059)
    throw new Error("SOURCE_EXAMPLE_COUNT_MISMATCH");
  const exampleIds = new Set<string>();
  const examplesByGrammar = new Map<string, SourceRow[]>();
  for (const row of bundle.examples) {
    const parent = grammarIds.get(row.grammar_id ?? "");
    const key = `${row.grammar_id}:${row.example_index}`;
    if (
      !parent ||
      parent.hsk_level !== row.hsk_level ||
      !row.example_zh ||
      !/^[1-9]\d*$/u.test(row.example_index ?? "") ||
      exampleIds.has(key)
    )
      throw new Error(`INVALID_GRAMMAR_EXAMPLE:${key}`);
    exampleIds.add(key);
    examplesByGrammar.set(parent.id!, [
      ...(examplesByGrammar.get(parent.id!) ?? []),
      row,
    ]);
  }
  for (const parent of grammarIds.values()) {
    const examples = (examplesByGrammar.get(parent.id!) ?? []).sort(
      (a, b) => Number(a.example_index) - Number(b.example_index),
    );
    if (
      examples.some((row, i) => Number(row.example_index) !== i + 1) ||
      examples.map((row) => row.example_zh!.trim()).join("\n") !==
        (parent.examples_zh ?? "")
          .replace(/\\n/gu, "\n")
          .split(/\r?\n/u)
          .map((line) => line.trim())
          .filter(Boolean)
          .join("\n")
    )
      throw new Error(`GRAMMAR_EXAMPLES_NOT_PRESERVED:${parent.id}`);
  }
}

export type Hsk30VocabularyCandidate = {
  id: string;
  simplified: string;
  pinyin: string;
  pinyin_numeric: string;
  pos: string;
  hsk_band: string;
};
export type Hsk30Match = {
  sourceId: string;
  vocabularyId: string | null;
  status: "MATCHED" | "MISSING" | "CONFLICT";
  candidates: string[];
  reason:
    | "EXACT_READING"
    | "NO_HEADWORD"
    | "READING_REVIEW"
    | "POS_CONFLICT"
    | "MULTIPLE_CANDIDATES";
};
const posAliases: Record<string, string> = {
  名: "n",
  名词: "n",
  "danh từ": "n",
  动: "v",
  动词: "v",
  "động từ": "v",
  形: "a",
  形容词: "a",
  "tính từ": "a",
  副: "d",
  副词: "d",
  "phó từ": "d",
  代: "r",
  代词: "r",
  "đại từ": "r",
  数: "m",
  数词: "m",
  "số từ": "m",
  量: "q",
  量词: "q",
  "lượng từ": "q",
  介: "p",
  介词: "p",
  "giới từ": "p",
  连: "c",
  连词: "c",
  "liên từ": "c",
  助: "u",
  助词: "u",
  "trợ từ": "u",
  叹: "e",
  叹词: "e",
  "thán từ": "e",
  拟声: "o",
  "từ tượng thanh": "o",
};
function posKeys(text: string): Set<string> {
  let values: string[];
  try {
    const parsed: unknown = JSON.parse(text);
    values = Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [text];
  } catch {
    values = [text];
  }
  return new Set(
    values.flatMap((value) =>
      value.split(/[、,，;；/\s]+/u).length === 1 || /[a-zà-ỹ]/iu.test(value)
        ? [posAliases[value.trim()]].filter((x): x is string => Boolean(x))
        : value
            .split(/[、,，;；/]+/u)
            .map((x) => posAliases[x.trim()])
            .filter((x): x is string => Boolean(x)),
    ),
  );
}
export function matchHsk30Vocabulary(
  rows: SourceRow[],
  words: Hsk30VocabularyCandidate[],
): Hsk30Match[] {
  const byWord = new Map<string, Hsk30VocabularyCandidate[]>();
  for (const word of words)
    byWord.set(word.simplified.normalize("NFC"), [
      ...(byWord.get(word.simplified.normalize("NFC")) ?? []),
      word,
    ]);
  return rows.map((row) => {
    const candidates = byWord.get(row.word!.normalize("NFC")) ?? [];
    const reading = normalizeLexicalReading(row.pinyin);
    const exact = reading
      ? candidates.filter((word) => {
          const appReading =
            normalizeLexicalReading(word.pinyin_numeric) ??
            normalizeLexicalReading(word.pinyin);
          return appReading === reading;
        })
      : [];
    const sourcePos = posKeys(row.pos_zh ?? "");
    const compatible = exact.filter((word) => {
      const appPos = posKeys(word.pos);
      return (
        !sourcePos.size ||
        !appPos.size ||
        [...sourcePos].some((pos) => appPos.has(pos))
      );
    });
    const match = compatible.length === 1 ? compatible[0]! : null;
    return {
      sourceId: row.id!,
      vocabularyId: match?.id ?? null,
      status: match ? "MATCHED" : candidates.length ? "CONFLICT" : "MISSING",
      candidates: candidates.map((word) => word.id),
      reason: match
        ? "EXACT_READING"
        : !candidates.length
          ? "NO_HEADWORD"
          : !exact.length
            ? "READING_REVIEW"
            : !compatible.length
              ? "POS_CONFLICT"
              : "MULTIPLE_CANDIDATES",
    };
  });
}
