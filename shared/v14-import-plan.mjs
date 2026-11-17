import {planImportRows} from './import-plan.mjs';
import {digest} from './v5-quality.mjs';
export const V14_EVIDENCE_DIMENSIONS=['provenance','syllabus','format','technical','language','rights','publication'];
/** No writes. Existing import/CAS/revision workflow must apply a reviewed plan. */
export function planV14QuestionImport(rows,{latest,findExternal,validate,source}){
 const sourceErrors=[];
 if(!source?.id||!source.owner||!/^https:\/\//.test(source.url??'')||!source.version||!/^\d{4}-\d\d-\d\d/.test(source.checkedAt??''))sourceErrors.push('SOURCE_METADATA_REQUIRED');
 if(source?.eligibility!=='VERIFIED'||source?.rights?.redistribution!==true||source?.rights?.commercial!==true||!source?.licenseEvidenceUrl||!source?.license||!source?.attribution)sourceErrors.push('SOURCE_RIGHTS_NOT_CLEARED');
 if(source?.upstreamUnresolved)sourceErrors.push('UPSTREAM_RIGHTS_UNRESOLVED');
 if(typeof findExternal!=='function')sourceErrors.push('EXTERNAL_ID_LOOKUP_REQUIRED');
 if(sourceErrors.length)return{accepted:[],report:{rowsRead:rows.length,accepted:0,sourceErrors,changed:0},writeAllowed:false};
 const fingerprint=v14QuestionContentHash;
 const errorsFor=p=>{
  const errors=[...validate('questions',p)];
  for(const key of ['id','externalSourceId','sourceVersion','level','syllabusVersion','skill','partId','type','promptZh','correctAnswer','explanation','sourceType'])if(typeof p[key]!=='string'||!p[key].trim())errors.push('MISSING_'+key);
  for(const key of ['vocabularyIds','grammarIds','topicIds','taskIds','mediaReferences'])if(!Array.isArray(p[key]))errors.push('MISSING_'+key);
  if(p.sourceRegistryId!==source.id||p.sourceVersion!==source.version)errors.push('SOURCE_VERSION_MISMATCH');
  if(!Number.isInteger(p.revision)||p.revision<1)errors.push('QUESTION_REVISION_REQUIRED');
  if(!['hsk2-2015','hsk3-2021','hsk3-2025'].includes(p.syllabusVersion))errors.push('EDITION_REQUIRED');
  if(p.contentHash!==fingerprint(p))errors.push('CONTENT_HASH_MISMATCH');
  if(!['DRAFT','NEEDS_REVIEW'].includes(p.reviewStatus)||p.humanReview?.status==='APPROVED'||p.languageHumanReviewed||p.levelHumanReviewed)errors.push('DRAFT_IMPORT_ONLY_NO_HUMAN_PROMOTION');
  if(p.sourceType==='OFFICIAL'&&!source.officialOwnerPermission)errors.push('OFFICIAL_LABEL_NOT_AUTHORIZED');
  if(!p.licenseEvidence||p.licenseEvidence.url!==source.licenseEvidenceUrl||p.licenseEvidence.sourceVersion!==source.version)errors.push('REVISION_BOUND_LICENSE_EVIDENCE_REQUIRED');
  const old=latest(p.id);if(old&&old.status==='PUBLISHED')errors.push('PUBLISHED_ID_REQUIRES_EXPLICIT_EDITOR_REVISION');
  const external=findExternal(p.sourceRegistryId,p.sourceVersion,p.externalSourceId);
  if(external&&external.id!==p.id)errors.push('EXTERNAL_ID_ALREADY_BOUND');
  return [...new Set(errors)];
 };
 const externalSeen=new Set(),deduplicated=[],duplicates=[];
 for(const row of rows){const key=row.sourceRegistryId+'|'+row.sourceVersion+'|'+row.externalSourceId;if(externalSeen.has(key)){duplicates.push({id:row.id,externalSourceId:row.externalSourceId});continue;}externalSeen.add(key);deduplicated.push(row);}
 const plan=planImportRows('questions',deduplicated,latest,(_kind,p)=>errorsFor(p));
 return{...plan,report:{...plan.report,rowsRead:rows.length,duplicates:plan.report.duplicates+duplicates.length,externalDuplicates:duplicates,sourceId:source.id,sourceVersion:source.version,changed:0},writeAllowed:false,planHash:digest({sourceId:source.id,sourceVersion:source.version,rows:plan.accepted.map(p=>[p.id,p.contentHash,p.expectedRevision??null])})};
}
export function v14QuestionContentHash(p){return digest({externalSourceId:p.externalSourceId,sourceVersion:p.sourceVersion,level:p.level,syllabusVersion:p.syllabusVersion,skill:p.skill,partId:p.partId,type:p.type,promptZh:p.promptZh,options:p.options,correctAnswer:p.correctAnswer,explanation:p.explanation,vocabularyIds:p.vocabularyIds,grammarIds:p.grammarIds,topicIds:p.topicIds,taskIds:p.taskIds,mediaReferences:p.mediaReferences});}
