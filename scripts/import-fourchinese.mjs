import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { starterVocabulary } from '../src/chinese/reused/starter-vocabulary.ts';
import { supplementalVocabulary } from '../src/chinese/reused/supplemental-vocabulary.ts';
import { applyVocabularyQualityOverride } from '../src/chinese/reused/quality.ts';
import { normalizeHanziIdentity, vocabularyIdentityKey } from '../src/chinese/reused/identity.ts';
import { matchHsk30Vocabulary } from '../src/chinese/reused/hsk30-source.ts';
import { vocabularyTopicId } from '../src/chinese/reused/vocabulary-topics.ts';
import { normalizeLexicalReading } from '../src/chinese/reused/lexical-reading.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = path.resolve(root, '../HocTiengTrungApp/src/data');
const output = path.join(root, 'public/data/fourchinese');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sourceFile = path.join(source, 'hsk-vocabulary.json');
const curated = new Map(starterVocabulary.map(word => [normalizeHanziIdentity(word.simplified), word]));
// Same merge order as 4Chinese getOfflineVocabulary; the source app is read-only.
const merged = read(sourceFile).map(raw => {
  const word = applyVocabularyQualityOverride(raw);
  const correction = curated.get(normalizeHanziIdentity(word.simplified));
  if (!correction) return word;
  curated.delete(normalizeHanziIdentity(word.simplified));
  return { ...word, primaryMeaningVi: correction.primaryMeaningVi, meaningsVi: correction.meaningsVi,
    translationStatus: correction.translationStatus, strokeCount: correction.strokeCount,
    examples: correction.examples, source: `${word.source}; curated Vietnamese starter correction` };
});
const byId = new Map([...merged, ...curated.values()].map(applyVocabularyQualityOverride).concat(supplementalVocabulary).map(word => [word.id, word]));
const byIdentity = new Map();
for (const word of byId.values()) if (!byIdentity.has(vocabularyIdentityKey(word))) byIdentity.set(vocabularyIdentityKey(word), word);
const words = [...byIdentity.values()];
const syllabus = read(path.join(source, 'hsk30-2025-11.json'));
const matches = matchHsk30Vocabulary(syllabus.rows.vocabulary, words.map(word => ({ ...word, pinyin_numeric: word.pinyinNumeric, pos: JSON.stringify(word.pos), hsk_band: String(word.hskBand) })));
const levels = new Map(), examples = new Map(), legacyIds = new Map();
matches.forEach((match, index) => {
  if (!match.vocabularyId) return;
  const list = levels.get(match.vocabularyId) ?? [];
  const level = syllabus.rows.vocabulary[index].hsk_level.replace('HSK', '');
  levels.set(match.vocabularyId, [...new Set([...list, level])]);
});
for (const level of ['1', '2', '3', '4', '5', '6', '7-9']) {
  const base = read(path.join(root, `public/data/hsk3-2025-${level}-words.json`));
  const extra = read(path.join(root, `public/data/learning/level-${level}.json`));
  for (const word of base) {
    const key = word.simplified + '|' + normalizeLexicalReading(word.pinyin);
    legacyIds.set(key, [...(legacyIds.get(key) ?? []), word.id]);
    if (extra.words[word.id]?.examples) examples.set(key, extra.words[word.id].examples);
  }
}
const result = words.map(word => {
  const key = word.simplified + '|' + normalizeLexicalReading(word.pinyinNumeric || word.pinyin);
  return { ...word, syllabusLevels: levels.get(word.id) ?? [], topicId: vocabularyTopicId(word),
    legacyIds: legacyIds.get(key) ?? [], audioExamples: examples.get(key) ?? [] };
});
assert.equal(new Set(result.map(word => word.id)).size, result.length);
assert(result.every(word => word.simplified && word.pinyin && word.primaryMeaningVi));
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'words.json'), JSON.stringify(result) + '\n');
const manifest = {
  version: '4chinese-web-1', sourceAppVersion: '0.1.57',
  sourceSha256: createHash('sha256').update(fs.readFileSync(sourceFile)).digest('hex'),
  totalWords: result.length, withAudioExamples: result.filter(word => word.audioExamples.length).length,
  withVietnameseExamples: result.filter(word => word.examples.length).length,
  syllabus: 'HSK3.0_2025-11', syllabusMatched: matches.filter(match => match.status === 'MATCHED').length,
  syllabusNeedsReview: matches.filter(match => match.status !== 'MATCHED').length,
  levels: Object.fromEntries(['1', '2', '3', '4', '5', '6', '7-9'].map(level => [level, result.filter(word => word.syllabusLevels.includes(level)).length])),
  attribution: '/data/fourchinese/ATTRIBUTION.md',
};
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest, null, 2));
