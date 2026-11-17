import {validateV10Record,technicalStamp} from './v10-content.mjs';
import {digest} from './v5-quality.mjs';
import {previewFingerprint} from './preview-content.mjs';
export const v11Signature=p=>digest([previewFingerprint(p),p.vocabularyPointId,p.grammarPointId,p.partOfSpeech,p.learningNotes,p.questionRevision,p.transcriptRevision,p.audioPurpose,p.generationParameters,p.promptPinyin,p.scoring,p.sampleAnswer,p.rubric,p.audioBinding]);
export function validateV11Record(kind,p,refs){const errors=validateV10Record(kind,{...p,editorialRelease:'v10-hsk2'},refs);if(p.editorialRelease!=='v11-hsk2')errors.push('V11_RELEASE_REQUIRED');if(kind==='questions'&&p.internal_question_id!==p.id)errors.push('CANONICAL_INTERNAL_ID_REQUIRED');if(kind==='vocabulary'){if(!p.exampleZh||!p.examplePinyin||!p.exampleVi||!p.partOfSpeech?.length)errors.push('COMPLETE_LEARNER_WORD_REQUIRED');}return [...new Set(errors)];}
export function stampV11(p){const stamped=technicalStamp(p);return{...stamped,internalValidation:{...stamped.internalValidation,contentSignature:v11Signature(p),method:'V11 automated structure/reference checks; not human review'}};}
export function v11Validation(p){return p.internalValidation?.status==='PASSED'&&p.internalValidation.fingerprint===previewFingerprint(p)&&p.internalValidation.contentSignature===v11Signature(p);}
