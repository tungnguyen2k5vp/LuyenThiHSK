import {validateV6Release} from './v6-quality.mjs';
import {validateRegisteredQuestion,completeRegisteredAnswer} from './question-types.mjs';
import {previewFingerprint} from './preview-content.mjs';
import {questionDiagnostics,digest} from './v5-quality.mjs';
import {grammarExampleOverlap} from './grammar-quality.mjs';
export {grammarExampleOverlap} from './grammar-quality.mjs';
export const REVIEW_FIELDS={words:'vocabulary',lessons:'grammar',questions:'questions',audio:'audio',images:'images',optionBanks:'optionBanks',templates:'templates'};
export function auditV7(b,{levelScreen={items:[]}}={}){
 const validation=validateV6Release(b),diagnostics=questionDiagnostics(b.questions),ids=new Map();
 for(const field of Object.keys(REVIEW_FIELDS))for(const r of b[field]??[])ids.set(r.id,r);
 const rows=b.questions.map(q=>{const flags=[],errors=[...validateRegisteredQuestion(q)];
 for(const key of ['level','skill','type','difficulty','vocabularyIds','grammarIds','topicIds','correctAnswer','explanation','sourceType','reviewStatus'])if(q[key]===undefined||q[key]===null||q[key]==='')errors.push('MISSING_'+key);
 if(!Number.isInteger(q.revision)||q.revision<1)errors.push('REVISION_INVALID');
 if(!completeRegisteredAnswer(q,q.correctAnswer))errors.push('INCOMPLETE_KEY');
 const optionTexts=q.options.map(o=>String(o.text??'').normalize('NFC').trim());if(optionTexts.some(s=>!s))errors.push('EMPTY_OPTION');if(new Set(optionTexts).size!==optionTexts.length)errors.push('DUPLICATE_OPTION_TEXT');
 for(const ref of [...q.vocabularyIds,...q.grammarIds.map(id=>b.lessons.find(g=>g.grammarPointId===id)?.id??id),...(q.audioAssetId?[q.audioAssetId]:[]),...(q.optionBankId?[q.optionBankId]:[])])if(!ids.has(ref))errors.push('UNKNOWN_REFERENCE:'+ref);
 const texts=[q.promptZh,q.candidatePromptZh,q.instruction,q.explanation,...q.options.map(o=>o.text)];if(texts.some(t=>/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F\u202A-\u202E\u2066-\u2069]/.test(t??'')))errors.push('SUSPICIOUS_UNICODE');
 if(!q.sourceUrl||!q.syllabusVersion||!q.license)errors.push('MISSING_PROVENANCE');
 if(q.internalValidation?.status==='PASSED'&&q.internalValidation.fingerprint!==previewFingerprint(q))errors.push('STALE_FINGERPRINT');
 if(/(?:fixture|test-only|qa-only)/i.test(q.id))errors.push('FIXTURE_IN_RELEASE');
 if(q.skill==='listening'&&q.candidatePromptZh===q.promptZh)flags.push('TRANSCRIPT_VISIBLE_BEFORE_CHECK');
 if(/(?:đáp án\s*[:：]|correct\s*answer\s*[:：]|答案\s*[:：])/i.test([q.candidatePromptZh,q.instruction].join(' ')))flags.push('POSSIBLE_ANSWER_LEAK');
 if(q.assessmentSuitability==='GUIDED_PRACTICE')flags.push('GUIDED_NOT_INDEPENDENT');
 flags.push(...(diagnostics.issues.find(r=>r.id===q.id)?.flags??[]).filter(f=>f!=='INVALID_ANSWER'));
 if(diagnostics.nearDuplicates.some(p=>p.a===q.id||p.b===q.id))flags.push('NEAR_DUPLICATE_CANDIDATE');
 if(levelScreen.items.find(r=>r.id===q.id)?.flags?.length)flags.push('LEVEL_TOKEN_REVIEW');
 const overlap=b.lessons.filter(g=>q.grammarIds.includes(g.grammarPointId)&&grammarExampleOverlap(q,g)).map(g=>g.id);if(overlap.length)flags.push('TEACHING_EXAMPLE_REUSED');
 const priority=q.assessmentSuitability==='EXAM_CANDIDATE'?100:q.skill==='listening'?90:errors.length?95:flags.length?70:40;
 return {id:q.id,revision:q.revision,kind:'questions',partId:q.partId??null,type:q.type,assessmentSuitability:q.assessmentSuitability,errors:[...new Set(errors)],flags:[...new Set(flags)],teachingOverlap:overlap,priority,sourceFingerprint:previewFingerprint(q),reviewStatus:q.reviewStatus,linguisticStatus:'BLOCKED_FOR_HUMAN_REVIEW'};
 });
 const grammar=b.lessons.map(g=>{const questions=b.questions.filter(q=>q.grammarIds.includes(g.grammarPointId)),overlap=questions.filter(q=>grammarExampleOverlap(q,g));return{id:g.id,revision:g.revision,title:g.title,pattern:g.pattern,related:questions.length,independentWithoutExampleOverlap:questions.filter(q=>q.assessmentSuitability!=='GUIDED_PRACTICE'&&!overlap.includes(q)).length,exampleOverlap:overlap.map(q=>q.id),missing:['title','pattern','usage','explanationVi','examples','commonMistakes'].filter(k=>!g[k]||Array.isArray(g[k])&&!g[k].length),expertStatus:'BLOCKED_FOR_HUMAN_REVIEW'};});
 const structural=rows.filter(r=>r.errors.length),flagged=rows.filter(r=>r.flags.length);
 return {at:new Date().toISOString(),release:b.version,releaseFingerprint:digest(Object.entries(REVIEW_FIELDS).map(([f])=>[f,(b[f]??[]).map(r=>[r.id,r.revision,previewFingerprint(r)])])),questionCount:rows.length,structuralErrorQuestions:structural.length,flaggedQuestions:flagged.length,validation:{errors:validation.errors,warnings:validation.warnings,summary:validation.summary},rows:rows.sort((a,z)=>z.priority-a.priority||a.id.localeCompare(z.id)),nearDuplicates:diagnostics.nearDuplicates,grammar,method:'Full structural checks plus Unicode, character-bigram, stored level-token flags and exact teaching example overlap; flags are not expert conclusions.'};
}
export function exportReviewPackage(b,audit,work=[]){return {format:'LUYENTHIHSK_REVIEW_V7',exportedAt:new Date().toISOString(),releaseFingerprint:audit.releaseFingerprint,note:'Private editorial data only. No learner data. Export does not grant reviewer authority.',items:Object.entries(REVIEW_FIELDS).filter(([f])=>f!=='templates').flatMap(([field,kind])=>(b[field]??[]).map(r=>{const w=work.find(w=>w.entity_id===r.id&&w.revision===r.revision);return{id:r.id,revision:r.revision,kind,sourceFingerprint:previewFingerprint(r),workVersion:digest(w??null),content:r,pinyin:r.pinyin??r.promptPinyin??r.examples?.map(e=>e.pinyin)??'',meaningVi:r.meaningVi??r.explanationVi??'',expectedAnswer:r.correctAnswer??null,flags:audit.rows.find(q=>q.id===r.id)?.flags??[],reviewerNotes:w?.notes??'',decision:'PENDING',sourceReference:{type:r.sourceType,url:r.sourceUrl,license:r.license,licenseStatus:r.licenseStatus}};}))};}
