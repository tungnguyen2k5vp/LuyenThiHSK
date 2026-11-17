import {previewFingerprint} from './preview-content.mjs';
import {RESOLUTION_STATES,REVIEW_CHECKLIST} from './v8-review-contract.mjs';
export {RESOLUTION_STATES,REVIEW_CHECKLIST};
const policies={
 GUIDED_NOT_INDEPENDENT:['INFO','Câu có hướng dẫn; không phải lỗi tự động.','Giữ trong guided practice; không chuyển sang exam.','HSK_LEVEL_REVIEW'],
 TEACHING_EXAMPLE_REUSED:['MEDIUM','Nội dung trùng ví dụ dạy học.','Giữ guided; nếu cần independent, biên soạn câu mới với ID mới.','LANGUAGE_REVIEW'],
 NEAR_DUPLICATE_CANDIDATE:['MEDIUM','Gần nhau theo heuristic; chưa chứng minh trùng ngữ nghĩa.','Đối chiếu ngữ cảnh và mục tiêu; không xóa tự động.','LANGUAGE_REVIEW'],
 LEVEL_TOKEN_REVIEW:['MEDIUM','Token cần đối chiếu cấp độ và ngữ cảnh.','Kiểm syllabus và phạm vi tích lũy; ghi rõ từ nào vượt cấp.','HSK_LEVEL_REVIEW'],
 OPTION_LENGTH_CUE:['LOW','Độ dài đáp án có thể gợi ý.','Đọc toàn bộ distractors và đánh giá độ mơ hồ.','LANGUAGE_REVIEW'],
 POSSIBLE_ANSWER_LEAK:['HIGH','Có dấu hiệu lộ đáp án; cần đối chiếu màn học viên.','Kiểm instruction và candidate prompt trước submit.','LANGUAGE_REVIEW'],
 TRANSCRIPT_VISIBLE_BEFORE_CHECK:['HIGH','Transcript có thể hiện sớm.','Kiểm renderer và policy nghe; không sửa transcript hàng loạt.','LANGUAGE_REVIEW']
};
export function resolutionRows(audit,work=[]){return audit.rows.filter(r=>r.flags.length).map(r=>{const w=work.find(w=>w.entity_id===r.id&&w.revision===r.revision);return {...r,flagTypes:r.flags,severity:r.flags.some(f=>policies[f]?.[0]==='HIGH')?'HIGH':r.flags.every(f=>policies[f]?.[0]==='INFO')?'INFO':'MEDIUM',explanation:'Automated heuristic triage; semantic validity remains unconfirmed',suggestedResolution:'Review the per-flag evidence and record a revision-linked decision',requiredReviewer:'LANGUAGE_REVIEW / HSK_LEVEL_REVIEW',findings:r.flags.map(flag=>{const [severity,explanation,suggestedResolution,requiredReviewer]=policies[flag]??['MEDIUM','Cờ heuristic cần đọc câu đầy đủ.','Kiểm tra thủ công, ghi căn cứ trước khi sửa.','LANGUAGE_REVIEW'];return{flag,severity,explanation,suggestedResolution,requiredReviewer};}),decision:'NO_SEMANTIC_DECISION',contentOwner:w?.assignee||'UNASSIGNED',status:RESOLUTION_STATES.includes(w?.disposition)?w.disposition:'PENDING',notes:w?.notes??'',humanReviewed:false};});}
export function candidateBatches(bundle,audit){const candidates=bundle.questions.filter(q=>q.assessmentSuitability==='EXAM_CANDIDATE').sort((a,b)=>a.id.localeCompare(b.id));return Array.from({length:Math.ceil(candidates.length/20)},(_,i)=>({id:String.fromCharCode(65+i),items:candidates.slice(i*20,i*20+20).map(q=>({id:q.id,revision:q.revision,sourceFingerprint:previewFingerprint(q),content:q,flags:audit.rows.find(r=>r.id===q.id)?.flags??[],checklist:REVIEW_CHECKLIST.map(item=>({item,status:'NOT_REVIEWED',comment:''})),languageQA:'BLOCKED_FOR_HUMAN_REVIEW',levelQA:'BLOCKED_FOR_HUMAN_REVIEW',rightsQA:q.licenseStatus??'UNKNOWN'}))}));}
export function filterReviewRows(rows,params){const get=k=>params.get(k)??'';const batch=get('batch'),batchIds=batch?new Set(rows.filter(r=>r.payload.assessmentSuitability==='EXAM_CANDIDATE').sort((a,b)=>a.id.localeCompare(b.id)).slice(('ABCD'.indexOf(batch))*20,('ABCD'.indexOf(batch)+1)*20).map(r=>r.id)):null;return rows.filter(r=>{if(batchIds&&!batchIds.has(r.id))return false;
 const p=r.payload,w=r.work??{},tab=get('tab');
 if(tab==='pending'&&['APPROVED','PUBLISHED'].includes(r.status))return false;
 if(tab==='high'&&(p.reviewRisk?.score??0)<40)return false;
 if(tab==='correction'&&w.disposition!=='NEEDS_CORRECTION')return false;
 if(tab==='noted'&&!w.notes)return false;
 if(tab==='rereview'&&!['DRAFT_FIXED','READY_FOR_HUMAN_REVIEW'].includes(w.disposition))return false;
 if(tab==='approved'&&!['APPROVED','PUBLISHED'].includes(r.status))return false;
 return (!get('level')||String(p.level)===get('level'))&&(!get('reviewer')||(w.assignee??'').includes(get('reviewer')))&&(!get('license')||p.licenseStatus===get('license'))&&(!get('media')||(get('media')==='missing'?!p.audioAssetId&&p.skill==='listening':Boolean(p.audioAssetId)))&&(!get('revisionState')||w.disposition===get('revisionState'));
});}
