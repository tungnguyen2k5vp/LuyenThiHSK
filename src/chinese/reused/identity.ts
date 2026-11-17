import { normalizePinyinInput } from "./pinyin.ts";

type VocabularyIdentity = {
  simplified: string;
  pinyin: string;
  pinyinNumeric: string;
};

export function normalizeHanziIdentity(value: string): string {
  return value.normalize("NFC").trim();
}

export function normalizePinyinIdentity(pinyin: string, pinyinNumeric: string): string {
  const tones: Record<string, string> = {
    "\u0304": "1", "\u0301": "2", "\u030c": "3", "\u0300": "4",
  };
  const numericTones = pinyinNumeric.match(/[1-5]/gu);
  const markedTones = Array.from(pinyin.normalize("NFD"))
    .map((character) => tones[character] ?? "")
    .filter(Boolean);
  const toneSequence = numericTones?.length ? numericTones.join("") : markedTones.join("");
  // Compare the tone-insensitive syllable stream and the ordered tone sequence.
  // This also equates concatenated marked pinyin (xuéxí) with spaced numeric
  // pinyin (xue2 xi2), without losing neutral tone 5.
  const syllableStream = normalizePinyinInput(pinyinNumeric || pinyin);
  return `${syllableStream}|${toneSequence}`;
}

export function vocabularyIdentityKey(word: VocabularyIdentity): string {
  return `${normalizeHanziIdentity(word.simplified)}|${normalizePinyinIdentity(word.pinyin, word.pinyinNumeric)}`;
}
