import {useCallback,useEffect,useRef,useState} from 'react';
import {hskApi,HskApiError,type ServerAttempt} from './api';

interface Draft {baseRevision:number;answers:Record<string,string>;flags:string[];currentIndex:number}
export function useServerAttempt(id:string){
 const [attempt,setAttempt]=useState<ServerAttempt|null>(null),[error,setError]=useState(''),[saving,setSaving]=useState(false),[dirty,setDirty]=useState(false),[conflict,setConflict]=useState(false),[remaining,setRemaining]=useState(0);
 const current=useRef<ServerAttempt|null>(null),serverRevision=useRef(0),generation=useRef(0),savedGeneration=useRef(0),inflight=useRef<Promise<void>|null>(null),clock=useRef({received:0,remaining:0}),alive=useRef(true),blocked=useRef(false),restored=useRef(false);
 const key='hsk-exam-outbox:'+id;
 const loadSerial=useRef(0);
 const persist=useCallback(()=>{const a=current.current;if(!a)return;try{if(generation.current===savedGeneration.current)sessionStorage.removeItem(key);else sessionStorage.setItem(key,JSON.stringify({baseRevision:serverRevision.current,answers:a.answers,flags:a.flags,currentIndex:a.currentIndex} satisfies Draft));}catch{setError('Không lưu được bản nháp tạm trên trình duyệt. Giữ tab này mở và thử lưu máy chủ.');}},[key]);
 const load=useCallback(async(discard=false)=>{
  const serial=++loadSerial.current;setError('');const {attempt:a}=await hskApi<{attempt:ServerAttempt}>('attempts/'+id);if(!alive.current||serial!==loadSerial.current)return;
  serverRevision.current=a.revision;clock.current={received:performance.now(),remaining:a.deadline-a.serverNow};current.current=a;blocked.current=false;setConflict(false);
  if(discard){sessionStorage.removeItem(key);savedGeneration.current=generation.current;setDirty(false);}
  else if(!restored.current&&a.status==='ACTIVE'){
   restored.current=true;const raw=sessionStorage.getItem(key);
   if(raw){try{const d=JSON.parse(raw) as Draft,ids=new Set(a.questions.map(q=>q.id));if(!d||!Number.isInteger(d.baseRevision)||!d.answers||!Array.isArray(d.flags)||!Object.entries(d.answers).every(([id,v])=>ids.has(id)&&typeof v==='string'&&v.length<=12000)||!d.flags.every(id=>ids.has(id))||!Number.isInteger(d.currentIndex)||d.currentIndex<0||d.currentIndex>=a.questions.length)throw Error('invalid');if(d.baseRevision!==a.revision){blocked.current=true;setConflict(true);setError('Có bản nháp chưa lưu từ phiên khác. Tải bản nháp về trước khi chọn dữ liệu máy chủ.');}else{current.current={...a,...d};generation.current++;setDirty(true);}}catch{blocked.current=true;setConflict(true);setError('Bản nháp tạm không đọc được. Bản gốc vẫn được giữ để tải xuống.');}}
  }
  setAttempt(current.current);setRemaining(Math.max(0,Math.ceil(clock.current.remaining/1000)));
 },[id,key]);
 useEffect(()=>{alive.current=true;void load().catch(e=>{if(alive.current)setError(e.message);});return()=>{alive.current=false;};},[load]);
 const save=useCallback(async()=>{
  if(inflight.current)await inflight.current;
  if(blocked.current)throw Error('Cần xử lý xung đột trước khi lưu hoặc nộp.');
  const job=(async()=>{
   while(current.current?.status==='ACTIVE'&&generation.current!==savedGeneration.current){
    const snapshot=current.current,turn=generation.current;setSaving(true);setError('');
    try{const response=await hskApi<{attempt:ServerAttempt}>('attempts/'+id+'/answers',{method:'PATCH',data:{expectedRevision:serverRevision.current,currentIndex:snapshot.currentIndex,answers:snapshot.questions.map(q=>({questionId:q.id,answer:snapshot.answers[q.id]??'',flagged:snapshot.flags.includes(q.id)}))}});
     serverRevision.current=response.attempt.revision;savedGeneration.current=turn;current.current={...current.current!,revision:response.attempt.revision};persist();if(alive.current){setAttempt(current.current);setDirty(generation.current!==savedGeneration.current);}
    }catch(error){
     if(error instanceof HskApiError&&error.status===409&&error.code==='ATTEMPT_REVISION_CONFLICT'){blocked.current=true;if(alive.current)setConflict(true);}
     if(alive.current)setError((error as Error).message);
     if(error instanceof HskApiError&&['ATTEMPT_EXPIRED','ATTEMPT_ALREADY_SUBMITTED'].includes(error.code))await load();
     throw error;
    }finally{if(alive.current)setSaving(false);}
   }
  })();inflight.current=job;try{await job;}finally{if(inflight.current===job)inflight.current=null;}
 },[id,load,persist]);
 const change=useCallback((patch:Partial<Pick<ServerAttempt,'answers'|'flags'|'currentIndex'>>)=>{if(!current.current||blocked.current)return;current.current={...current.current,...patch};generation.current++;setAttempt(current.current);setDirty(true);setError('');persist();},[persist]);
 useEffect(()=>{if(!dirty||saving||conflict||error)return;const timeout=setTimeout(()=>{void save().catch(()=>{});},450);return()=>clearTimeout(timeout);},[attempt,dirty,saving,conflict,error,save]);
 useEffect(()=>{const guard=(event:BeforeUnloadEvent)=>{if(generation.current!==savedGeneration.current){event.preventDefault();event.returnValue='';}};window.addEventListener('beforeunload',guard);return()=>window.removeEventListener('beforeunload',guard);},[]);
 useEffect(()=>{if(attempt?.status!=='ACTIVE')return;let checked=false;const tick=()=>{const seconds=Math.max(0,Math.ceil((clock.current.remaining-(performance.now()-clock.current.received))/1000));setRemaining(seconds);if(!seconds&&!checked){checked=true;void load().catch(e=>{checked=false;setError(e.message);});}};const interval=setInterval(tick,1000);tick();return()=>clearInterval(interval);},[attempt?.id,attempt?.status,load]);
 const submit=useCallback(async()=>{await save();const a=current.current;if(!a)return;if(a.status==='SUBMITTED')return a;const response=await hskApi<{attempt:ServerAttempt}>('attempts/'+id+'/submit',{method:'POST',data:{expectedRevision:serverRevision.current}});current.current=response.attempt;savedGeneration.current=generation.current;persist();setAttempt(response.attempt);setDirty(false);return response.attempt;},[id,save,persist]);
 return {attempt,error,saving,dirty,conflict,remaining,change,save,submit,reload:load,downloadDraft:()=>{const value=sessionStorage.getItem(key);return value??JSON.stringify(current.current?.answers??{});}};
}
