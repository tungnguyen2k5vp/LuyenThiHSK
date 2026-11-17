import type {CallbackResult} from '../../contracts/ui-v14';
import type {RoomSnapshot} from './exam';
import {navigationAllowed, examRoomView} from './exam';
import {serializeMatching,parseMatching} from '../../../shared/question-types.mjs';
import type {AttemptMode} from '../../contracts/ui-v14';
import {examCardView,examIntroView,type CatalogSnapshot} from './catalog';
/** The caller is the existing room owner. Every invocation reads fresh state, never a render closure. */
export interface RoomCommandOwner {
 readonly current:()=>RoomSnapshot;
 readonly navigate:(index:number)=>CallbackResult;
 readonly answer:(raw:string)=>CallbackResult;
 readonly flag:()=>CallbackResult;
 readonly check:()=>CallbackResult;
 readonly requestSubmit:()=>CallbackResult;
 readonly composition:(active:boolean,raw?:string)=>CallbackResult;
}
const rejected=(message:string)=>({status:'rejected' as const,message});
export function createRoomCommands(owner:RoomCommandOwner){
 const live=(id:string)=>{const s=owner.current(),q=s.exam.questions[s.session.currentIndex];return q?.id===id&&!s.readOnly&&!s.submitBusy&&!s.completed&&!s.session.audioPausedAt&&!s.session.mediaRecoveryRequired?{s,q}:null;};
 return {
 onNavigateRequested(id:string):CallbackResult{const s=owner.current(),index=s.exam.questions.findIndex(q=>q.id===id);return navigationAllowed(s,index)?owner.navigate(index):rejected('NAVIGATION_DENIED');},
 onChoose(id:string,optionId:string):CallbackResult{const row=live(id);return row&&!row.q.matching&&row.q.options.some(o=>o.id===optionId)?owner.answer(optionId):rejected('STALE_OR_INVALID_CHOICE');},
 onMatchingChange(id:string,itemId:string,optionId:string):CallbackResult{const row=live(id);if(!row?.q.matching?.items.some(i=>i.id===itemId)||!row.q.options.some(o=>o.id===optionId))return rejected('STALE_OR_INVALID_MATCH');const map=parseMatching(row.s.session.answers[row.s.session.currentIndex]);if(row.q.matching.uniqueOptions&&Object.entries(map).some(([key,value])=>key!==itemId&&value===optionId))return rejected('DUPLICATE_MATCH_OPTION');return owner.answer(serializeMatching({...map,[itemId]:optionId}));},
 onInput(id:string,raw:string):CallbackResult{const row=live(id);return row&&typeof raw==='string'&&raw.length<=4000&&!row.q.options.length&&!row.q.matching?owner.answer(raw):rejected('STALE_OR_INVALID_INPUT');},
 onCheckRequested(id:string):CallbackResult{const row=live(id);return row&&row.s.session.mode==='practice'&&examRoomView(row.s).question?.actions.canCheck?owner.check():rejected('FEEDBACK_DENIED');},
 onFlagRequested(id:string):CallbackResult{return live(id)?owner.flag():rejected('STALE_QUESTION');},
 onSubmitRequested(id:string):CallbackResult{const s=owner.current();return s.session.id===id&&examRoomView(s).canSubmit?owner.requestSubmit():rejected('SUBMIT_DENIED');},
 onCompositionStart(id:string):CallbackResult{const row=live(id);return row&&!row.q.options.length?owner.composition(true):rejected('STALE_QUESTION');},
 onCompositionEnd(id:string,raw:string):CallbackResult{const row=live(id);return row&&!row.q.options.length&&typeof raw==='string'&&raw.length<=4000?owner.composition(false,raw):rejected('STALE_OR_INVALID_INPUT');},
 };
}
export interface CatalogCommandOwner {
 readonly current:()=>{catalog:CatalogSnapshot;selectedExamId:string|null;selectedMode:AttemptMode;acknowledged:boolean;busy:boolean};
 readonly open:(examId:string)=>CallbackResult;readonly resume:(sessionId:string)=>CallbackResult;
 readonly start:(examId:string,mode:AttemptMode)=>CallbackResult;
}
export function createCatalogCommands(owner:CatalogCommandOwner){
 let starting:Promise<unknown>|null=null;
 return {
 onOpenExam(id:string):CallbackResult{const s=owner.current(),entry=s.catalog.entries.find(e=>e.exam.id===id);return entry&&examCardView(entry,s.catalog)?.canOpen?owner.open(id):rejected('EXAM_NOT_VISIBLE');},
 onResumeAttempt(id:string):CallbackResult{const s=owner.current();const entry=s.catalog.entries.find(e=>examCardView(e,s.catalog)?.resume?.sessionId===id);return entry?owner.resume(id):rejected('RESUME_NOT_AUTHORIZED');},
 async onStartRequested(id:string,mode:AttemptMode):Promise<void|{status:'rejected';message:string}>{
  if(starting)return rejected('START_ALREADY_REQUESTED');
  const s=owner.current(),entry=s.catalog.entries.find(e=>e.exam.id===id);
  if(!entry||s.selectedExamId!==id||s.selectedMode!==mode||!examIntroView(entry,s.catalog,mode,s.acknowledged,s.busy)?.start.available)return rejected('START_NOT_AUTHORIZED');
  // Guard synchronous reentry as well as overlapping promises. Durable idempotency remains in the owner.
  let release!:()=>void;starting=new Promise<void>(resolve=>{release=resolve});
  try{await owner.start(id,mode);}finally{release();starting=null;}
 },
 };
}
