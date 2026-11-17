const toneMarks: Record<string, [string, string, string, string]> = {
  a: ['ā', 'á', 'ǎ', 'à'], e: ['ē', 'é', 'ě', 'è'], i: ['ī', 'í', 'ǐ', 'ì'],
  o: ['ō', 'ó', 'ǒ', 'ò'], u: ['ū', 'ú', 'ǔ', 'ù'], ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
};

const markedToTone = new Map<string, number>();
Object.values(toneMarks).forEach((marks) => marks.forEach((char, index) => markedToTone.set(char, index + 1)));

export function getToneNumber(syllable: string): number {
  const numeric = syllable.match(/[1-5]$/)?.[0];
  if (numeric) return Number(numeric) === 5 ? 0 : Number(numeric);
  for (const char of syllable.normalize('NFC')) {
    const tone = markedToTone.get(char.toLowerCase());
    if (tone) return tone;
  }
  return 0;
}

export function toneColor(tone: number): string {
  return ['#697386', '#D05D39', '#218A67', '#2A67D4', '#9251A6'][tone] ?? '#697386';
}

export function stripPinyinTone(value: string): string {
  return value.replace(/[üǖǘǚǜ]/gi, (char) => char === char.toUpperCase() ? 'V' : 'v')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[1-5]/g, '').toLowerCase();
}

/**
 * Returns the compact, tone-insensitive representation used by the offline
 * pinyin candidate search.  Users may type marked pinyin, numeric tones,
 * spaces, apostrophes, or uppercase letters; all of those forms resolve to
 * the same lookup key (for example `xǐ huan`, `xi3huan1`, and `XIHUAN` all
 * become `xihuan`).
 */
export function normalizePinyinInput(value: string): string {
  return stripPinyinTone(value)
    .replace(/u:/gi, 'v')
    .replace(/[^a-zv]/gi, '')
    .toLowerCase();
}

export function numericPinyinToMarks(value: string): string {
  return value.split(/(\s+|[-'])/).map(convertSyllable).join('');
}

function convertSyllable(input: string): string {
  const match = input.toLowerCase().replace(/u:/g, 'ü').replace(/v/g, 'ü').match(/^([a-zü]+)([1-5])$/i);
  if (!match?.[1] || !match[2] || match[2] === '5') return match?.[1] ?? input;
  const syllable = match[1];
  const tone = Number(match[2]) - 1;
  let index = syllable.search(/a/i);
  if (index < 0) index = syllable.search(/e/i);
  if (index < 0) index = syllable.toLowerCase().indexOf('ou') >= 0 ? syllable.toLowerCase().indexOf('o') : -1;
  if (index < 0) {
    const vowels = [...syllable].map((char, i) => ('aeiouü'.includes(char.toLowerCase()) ? i : -1)).filter((i) => i >= 0);
    index = vowels[vowels.length - 1] ?? -1;
  }
  if (index < 0) return syllable;
  const vowel = syllable[index]?.toLowerCase();
  const marked = vowel ? toneMarks[vowel]?.[tone] : undefined;
  return marked ? syllable.slice(0, index) + marked + syllable.slice(index + 1) : syllable;
}
