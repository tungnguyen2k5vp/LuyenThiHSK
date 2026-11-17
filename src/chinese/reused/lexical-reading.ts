import { numericPinyinToMarks } from './pinyin.ts';

// Reject merged pseudo-syllables (haishi4) rather than assigning a tone to their first vowel.
const numericSyllable = /^(?:zh|ch|sh|[bpmfdtnlgkhjqxzcsryw])?(?:a|o|e|ai|ei|ao|ou|an|en|ang|eng|ong|i|ia|ie|iao|iu|ian|in|iang|ing|iong|u|ua|uo|uai|ui|uan|un|uang|ueng|ue|ü|üe|üan|ün|er)[0-5]$/u;

/** A whole reading, never a tone-free search key or a word-prefix match. */
export function normalizeLexicalReading(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const reading = value.normalize('NFC').toLowerCase().trim()
    .replace(/u:|v/gu, 'ü');
  if (!reading) return null;
  const compact = reading.replace(/[\s'’\-]/gu, '');
  if (/[0-9]/u.test(compact)) {
    // Tone digits delimit compact numeric syllables too (xue2xi2).
    const segments = reading.split(/[\s'’\-]+/u);
    const syllables = segments.flatMap(segment => segment.match(/[a-zü]+[0-5]/gu) ?? []);
    if (segments.some(segment => (segment.match(/[a-zü]+[0-5]/gu) ?? []).join('') !== segment)
      || !syllables.length || syllables.some(syllable => !numericSyllable.test(syllable))) return null;
    return numericPinyinToMarks(syllables.map(item => item.replace(/0$/u, '5')).join(' '))
      .replace(/\s/gu, '');
  }
  // Reject annotations, punctuation and malformed/mixed numeric readings.
  if (!/^[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+$/u.test(compact)) return null;
  return compact;
}

/** Explicit alternatives are full readings; spaces are syllable separators, not alternatives. */
export function lexicalReadingMatches(
  candidate: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  const target = normalizeLexicalReading(expected);
  if (!target || typeof candidate !== 'string') return false;
  return candidate.split(/[/／,，;；]/u).some(variant => normalizeLexicalReading(variant) === target);
}


/** Resolves a V5 sense when a neutral grammatical reading has no separate HSK row. */
const lexicalReadingAliases: Record<string, string> = {
  '\u5f97|de': 'de2',
  '\u4e50|yu\u00e8': 'le4',
};

export function lexicalReadingMatchesForWord(
  simplified: string,
  candidate: string | null | undefined,
  expected: string | null | undefined,
): boolean {
  if (lexicalReadingMatches(candidate, expected)) return true;
  const normalizedExpected = normalizeLexicalReading(expected);
  const alias = normalizedExpected ? lexicalReadingAliases[simplified + '|' + normalizedExpected] : undefined;
  return Boolean(alias && lexicalReadingMatches(candidate, alias));
}
