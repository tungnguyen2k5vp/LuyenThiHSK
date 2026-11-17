import {validateV11Record,v11Signature} from './v11-content.mjs';
import {technicalStamp} from './v10-content.mjs';
import {previewFingerprint} from './preview-content.mjs';
import {digest} from './v5-quality.mjs';
export const v12Signature=p=>digest([v11Signature(p),p.practiceForm,p.teachingScope,p.dictionaryReference,p.metadataEvidence]);
export function validateV12Record(kind,p,refs){const errors=validateV11Record(kind,{...p,editorialRelease:'v11-hsk2'},refs);if(p.editorialRelease!=='v12-hsk2')errors.push('V12_RELEASE_REQUIRED');if(kind==='grammar'&&!p.teachingScope)errors.push('TEACHING_SCOPE_REQUIRED');if(kind==='questions'&&!['recognition','cloze','order','structure','discrimination','context'].includes(p.practiceForm))errors.push('PRACTICE_FORM_REQUIRED');return [...new Set(errors)];}
export function stampV12(p){const s=technicalStamp(p);return{...s,internalValidation:{...s.internalValidation,contentSignature:v12Signature(p),method:'V12 automated structure/reference validation; no expert review'}};}
export const v12Validation=p=>p.internalValidation?.status==='PASSED'&&p.internalValidation.fingerprint===previewFingerprint(p)&&p.internalValidation.contentSignature===v12Signature(p);
