// Prefer a common reading over a surname entry when the official headword is not capitalized.
// Candidate tone ambiguity stays visible to a reviewer; this function never approves a definition.
export const comparablePinyin=value=>String(value).normalize('NFKD').replace(/[\u0300-\u036f\s·∥'’0-9]/g,'').replace(/u:|v/g,'u').toLowerCase();
export function selectDictionaryEntry(candidates,pinyin){
 const readings=pinyin.split('/').map(comparablePinyin);const compatible=candidates.filter(c=>readings.includes(comparablePinyin(c.pinyin)));
 const common=compatible.filter(c=>!c.properName&&!c.definitions.every(d=>/^(?:họ(?:\s|$)|biến thể|xem |cách viết)/i.test(d)));
 return common[0]??compatible[0];
}
