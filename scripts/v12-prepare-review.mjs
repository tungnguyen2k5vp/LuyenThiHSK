import {readFile,writeFile} from 'node:fs/promises';
let s=(await readFile('scripts/v11-review-package.mjs','utf8')).replaceAll('v11','v12').replaceAll('V11','V12').replace("'v10-hsk2','v12-hsk2'","'v10-hsk2','v11-hsk2','v12-hsk2'");
s=s.replace("const candidate=new Set", "for(const r of JSON.parse(await readFile('data/staging/v11/content.json','utf8')).records)batches.set(r.payload.id,'V11-'+r.batch);\nconst candidate=new Set");
s=s.replace("quality=audit.resolutions.find(q=>q.id===r.id)??null", "quality=audit.resolutions.find(q=>q.id===r.id)??(r.content.metadataEvidence?{status:'ACADEMIC_MAPPING_PENDING',evidence:r.content.metadataEvidence}:null)");
s=s.replace("<option>V12-GRAMMAR</option>","<option>V11-GRAMMAR</option><option>V11-VOCABULARY</option><option>V12-GRAMMAR</option>");
s=s.replace("'V12-GRAMMAR','V12-VOCABULARY'","'V11-GRAMMAR','V11-VOCABULARY','V12-GRAMMAR','V12-VOCABULARY'").replaceAll('Gói duyệt V10','Gói duyệt V12').replaceAll('HSK_V10_REVIEW_NOTES','HSK_V12_REVIEW_NOTES');
s=s.replace("block('Liên kết ngữ pháp'", "if(c.metadataEvidence)block('Ánh xạ đề xuất · chưa duyệt chuyên môn',c.metadataEvidence,p);if(c.dictionaryReference)block('Nghĩa nguồn trước biên tập',c.dictionaryReference,p);block('Liên kết ngữ pháp'");
await writeFile('scripts/v12-review-package.mjs',s);
let flow=(await readFile('scripts/v11-review-html-flow.mjs','utf8')).replaceAll('v11','v12').replaceAll('1175','1339').replaceAll('176','246').replaceAll('211','238');await writeFile('scripts/v12-review-html-flow.mjs',flow);
