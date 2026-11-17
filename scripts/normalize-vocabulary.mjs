import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { lexicalFields } from '../shared/lexical-normalization.mjs';
export async function normalizeVocabulary() {
  const levels=['1','2','3','4','5','6','7-9'];const counts=[];const issues=[];
  for(const level of levels){
    const file='public/data/hsk3-2025-'+level+'-words.json';const words=JSON.parse(await readFile(file,'utf8'));
    const cleaned=words.map(w=>({...w,...lexicalFields(w)}));
    await writeFile(file,JSON.stringify(cleaned));
    const missing=cleaned.filter(w=>!w.meaningVi.trim()).length;
    const dirty=cleaned.filter(w=>w.lexicalQuality.flags.length).length;
    counts.push({level,total:words.length,normalized:words.length-dirty,needsReview:dirty,missingVietnamese:missing,noShortMeaning:cleaned.filter(w=>!w.primaryMeaningVi).length});
    issues.push(...cleaned.filter(w=>w.lexicalQuality.flags.length).map(w=>({id:w.id,level,hanzi:w.simplified,pinyin:w.pinyin,flags:w.lexicalQuality.flags,meaningVi:w.meaningVi,primaryMeaningVi:w.primaryMeaningVi,source:w.source,sourceUrl:w.sourceUrl,license:w.license})));
  }
  const total=key=>counts.reduce((n,l)=>n+l[key],0);const summary={total:total('total'),normalized:total('normalized'),needsReview:total('needsReview'),missingVietnamese:total('missingVietnamese'),noShortMeaning:total('noShortMeaning')};
  await mkdir('data/reports',{recursive:true});await writeFile('data/reports/vocabulary-cleanup-v3.json',JSON.stringify({version:1,summary,levels:counts,issues},null,2));
  await writeFile('public/data/vocabulary-quality-v3.json',JSON.stringify({summary,levels:counts}));
  await writeFile('VOCABULARY_CLEANUP_REPORT.md','# Vocabulary cleanup V3\n\nNormalization trình bày không phải kiểm duyệt nghĩa. Giữ raw trong meaningVi và báo cáo nội bộ; learner dùng primaryMeaningVi và mở thêm nghĩa. Không tự dịch/publish 557 mục thiếu.\n\n| HSK | Total | Normalized | Needs review | Missing VI | No short meaning |\n|---|---:|---:|---:|---:|---:|\n'+counts.map(l=>`|${l.level}|${l.total}|${l.normalized}|${l.needsReview}|${l.missingVietnamese}|${l.noShortMeaning}|`).join('\n')+'\n\n'+JSON.stringify(summary)+'\n\nCờ: HTML/markup, encoding, placeholder, machine annotation, quá dài, lặp nghĩa, thiếu VI và nghi vấn ngôn ngữ. NORMALIZED chỉ đạt quy tắc kỹ thuật; toàn bộ nghĩa cộng đồng vẫn cần review học thuật. Queue nằm ở data/reports/vocabulary-cleanup-v3.json; admin sửa thành revision, review rồi publish.\n');
  console.log('Vocabulary V3:',JSON.stringify(summary));return{summary,levels:counts,issues};
}
if(process.argv[1]?.replace(/\\/g,'/').endsWith('/normalize-vocabulary.mjs'))await normalizeVocabulary();
