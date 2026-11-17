import type {ExamQuestion} from '../types';

export const skillNames:Record<string,string>={listening:'Nghe',reading:'Đọc',writing:'Viết'};
export const editionNames:Record<string,string>={'hsk2-2015':'HSK 2.0 · 2015','hsk3-2021':'HSK 3.0 · GF2021','hsk3-2025':'HSK 3.0 · 2025'};
export const difficultyNames:Record<string,string>={easy:'Cơ bản',medium:'Trung bình',hard:'Nâng cao'};
export interface ExamMeta {
 id:string;revision:number;title:string;standardId:string;level:string;durationMinutes:number;description:string;totalQuestions:number;
 sample:boolean;reviewStatus:string;skills:string[];difficulty:string[];sections:{skill:string;count:number}[];notice:string;
 attemptCount?:number;activeAttemptId?:string;lastScore?:number|null;
}
export interface ServerAttempt {
 id:string;exam:ExamMeta;status:'ACTIVE'|'SUBMITTED';revision:number;currentIndex:number;startedAt:number;deadline:number;serverNow:number;
 questions:ExamQuestion[];answers:Record<string,string>;flags:string[];ownerKind:'account'|'guest';
}
export interface HistoryItem {id:string;status:'ACTIVE'|'SUBMITTED';exam:ExamMeta;startedAt:number;submittedAt:number|null;score:number|null;maxScore:number|null}
export interface ExamResult {
 attemptId:string;exam:ExamMeta;score:number;maxScore:number;correct:number;incorrect:number;unanswered:number;pending:number;
 durationSeconds:number;reason:string;submittedAt:string;
 bySkill:{skill:string;correct:number;total:number;maxPoints:number;pending:number}[];
 items:{questionId:string;skill:string;type:string;answer:string;status:'correct'|'incorrect'|'unanswered'|'pending';points:number;question:ExamQuestion}[];
}
const errors:Record<string,string>={
 ATTEMPT_REVISION_CONFLICT:'Bài làm đã thay đổi ở tab khác. Bản nháp trong tab này vẫn được giữ.',
 ATTEMPT_EXPIRED:'Đã hết giờ. Máy chủ đã chốt những câu trả lời được lưu trước hạn.',
 ATTEMPT_ALREADY_SUBMITTED:'Bài này đã được nộp. Bạn có thể mở kết quả.',
 ATTEMPT_NOT_FOUND:'Không tìm thấy bài trong phiên của bạn. Hãy dùng trình duyệt đã bắt đầu bài hoặc đăng nhập đúng tài khoản.',
 EXAM_NOT_AVAILABLE:'Bộ bài chưa sẵn sàng. Quay lại danh sách để chọn bài khác.',
 ADMIN_TOKEN_REQUIRED:'Mã quản trị chưa đúng hoặc đã hết hiệu lực sau khi máy chủ khởi động lại.',
 ALL_CURRENT_QUESTIONS_MUST_BE_REVIEWED_AND_PUBLISHED:'Cần duyệt và xuất bản đúng phiên bản hiện tại của mọi câu trước khi xuất bản bộ bài.',
 ACCOUNT_SESSION_UNAVAILABLE:'Phiên tài khoản chưa xác minh được. Kiểm tra dịch vụ tài khoản rồi thử lại.',
 CONFIRM_LANGUAGE_LEVEL_KEY_AND_MEDIA:'Xác nhận đã kiểm tra ngôn ngữ, cấp độ, đáp án và media trước khi duyệt.',
};
export class HskApiError extends Error {constructor(public status:number,public code:string){super(errors[code]??code);}}
export async function hskApi<T>(route:string,options:{method?:string;data?:unknown;token?:string;signal?:AbortSignal;timeout?:number}={}):Promise<T>{
 const controller=new AbortController(),timer=window.setTimeout(()=>controller.abort(),options.timeout??15000);
 try{
  const response=await fetch('/api/hsk/'+route,{method:options.method??'GET',credentials:'same-origin',headers:{...(options.data!==undefined?{'Content-Type':'application/json'}:{}),...(options.token?{Authorization:'Bearer '+options.token}:{})},body:options.data!==undefined?JSON.stringify(options.data):undefined,signal:options.signal?AbortSignal.any([options.signal,controller.signal]):controller.signal});
  const text=await response.text();let value;try{value=JSON.parse(text);}catch{throw Error('Máy chủ chưa phản hồi đúng. Kiểm tra Content API và thử lại.');}
  if(!response.ok)throw new HskApiError(response.status,value.error??'Không thực hiện được yêu cầu.');return value as T;
 }catch(error){if(controller.signal.aborted)throw Error('Kết nối quá thời gian. Bản đã lưu trên máy chủ vẫn còn; hãy thử lại.');if(error instanceof TypeError)throw Error('Mất kết nối với máy chủ. Giữ tab này mở và thử lưu lại khi có mạng.');throw error;}finally{clearTimeout(timer);}
}
export function downloadJson(value:unknown,name:string){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)+'\n'],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
