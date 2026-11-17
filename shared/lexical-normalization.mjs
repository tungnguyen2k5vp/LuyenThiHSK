// Conservative presentation cleanup; it never invents or approves a translation.
export function cleanDefinition(text) {
  return String(text ?? '').normalize('NFC').replace(/<[^>]*>/g, ' ').replace(/\s*\((?:LT|CL):[^)]*\)/g, '')
    .replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
    .replace(/\[([a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ0-5 :'’-]+)\]/gi, '')
    .replace(/\s+/g, ' ').replace(/^[;,.\s]+|[;,.\s]+$/g, '').trim();
}
export function lexicalFields(word) {
  const raw = String(word.meaningVi ?? '');
  const flags = [];
  if (/<[^>]+>|&(?:\w+|#\d+);/.test(raw)) flags.push('html');
  if (/\[[^\]]*\]|\{[^}]*\}|CL:|variant of|also pr\.|surname|M:|\bfig\./i.test(raw)) flags.push('dictionary_markup');
  if (/�|Ã.|á»|áº|\u0000/.test(raw)) flags.push('encoding');
  if (/TODO|TBD|undefined|null|chưa dịch|待翻译/i.test(raw)) flags.push('placeholder');
  if (/machine|google translate|dịch máy|máy dịch|generated/i.test(raw)) flags.push('machine_annotation');
  if (raw.length > 220) flags.push('long_meaning');
  const fragments = raw.split(/[;；\n]+/).map(cleanDefinition).filter(Boolean);
  const meanings = [...new Map(fragments.map(s => [s.toLocaleLowerCase('vi'), s])).values()];
  if (fragments.length !== meanings.length) flags.push('duplicate_meanings');
  // Hints and unresolved dictionary references are kept in notes, not on the card.
  const notes = meanings.filter(s => /^(LT:|CL:|xem |biến thể|cách viết|họ(?:\s|$)|variant|also |surname)|\[[^\]]+\]|[{}]|�/i.test(s));
  const usable = meanings.filter(s => !notes.includes(s) && !/TODO|TBD|undefined|null|待翻译/i.test(s));
  const primary = usable.find(s => s.length <= 110) ?? '';
  if (!raw.trim()) flags.push('missing_vietnamese');
  else if (!/[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i.test(raw)) flags.push('language_check');
  if (raw && !primary) flags.push('no_short_meaning');
  const secondary = usable.filter(s => s !== primary);
  return {
    primaryMeaningVi: primary,
    secondaryMeaningsVi: secondary,
    meaningEn: [...new Set((word.meaningsEn ?? []).map(cleanDefinition).filter(Boolean))],
    partOfSpeech: word.pos ?? [], classifier: (raw.match(/(?:LT|CL):([^;；)]+)/)?.[1]??'').trim(), notes,
    examples: word.examples ?? [],
    levelMappings: [{syllabusVersion:word.syllabusVersion,level:word.level,sourcePage:word.sourcePage ?? null}],
    lexicalQuality: {status:flags.length?'NEEDS_REVIEW':'NORMALIZED',flags,score:Math.max(0,100-flags.length*15),linguisticReview:word.translationStatus==='reviewed'?'reviewed':'unreviewed'},
  };
}
