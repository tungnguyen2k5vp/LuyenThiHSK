import {validateV12Record,v12Signature} from './v12-content.mjs';
import {technicalStamp} from './v10-content.mjs';
import {previewFingerprint} from './preview-content.mjs';
import {digest} from './v5-quality.mjs';
export const v13Signature=p=>digest([v12Signature(p),p.editorialRelease,p.primaryMeaningVi,p.secondaryMeaningsVi,p.exampleZh,p.examplePinyin,p.exampleVi,p.lexicalScope,p.referenceVerification]);
export function validateV13Record(kind,p,refs){
 const errors=validateV12Record(kind,{...p,editorialRelease:'v12-hsk2'},refs);
 if(kind!=='vocabulary')errors.push('V13_BATCH_IS_VOCABULARY_ONLY');
 if(p.editorialRelease!=='v13-hsk2')errors.push('V13_RELEASE_REQUIRED');
 if(p.reviewStatus!=='NEEDS_REVIEW'||p.humanReview?.status!=='BLOCKED_FOR_HUMAN_REVIEW')errors.push('V13_DRAFT_REVIEW_STATE_REQUIRED');
 if(p.licenseStatus!=='UNVERIFIED'||p.verifiedAt||p.publishedAt)errors.push('NO_UNVERIFIED_PUBLICATION');
 if(!p.exampleZh?.includes(p.simplified))errors.push('EXAMPLE_MUST_USE_HEADWORD');
 if(!p.examples?.some(e=>e.zh===p.exampleZh&&e.pinyin===p.examplePinyin&&e.vi===p.exampleVi&&e.sourceType==='AI_GENERATED'&&e.reviewStatus==='NEEDS_REVIEW'))errors.push('EXAMPLE_FIELDS_MUST_MATCH');
 if(!p.primaryMeaningVi||p.primaryMeaningVi!==p.meaningVi||!p.lexicalScope)errors.push('CONTEXTUAL_MEANING_SCOPE_REQUIRED');
 if(!p.dictionaryReference?.source||!p.dictionaryReference?.license||p.referenceVerification?.status!=='FACTS_CROSS_CHECKED_NOT_LANGUAGE_REVIEW')errors.push('REFERENCE_ATTRIBUTION_REQUIRED');
 return [...new Set(errors)];
}
export function stampV13(p){const s=technicalStamp(p);return {...s,internalValidation:{...s.internalValidation,contentSignature:v13Signature(p),method:'V13 automated structure/reference and scope checks; not human review'}};}
export const v13Validation=p=>p.internalValidation?.status==='PASSED'&&p.internalValidation.fingerprint===previewFingerprint(p)&&p.internalValidation.contentSignature===v13Signature(p);
