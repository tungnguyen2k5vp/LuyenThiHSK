import {useEffect,useRef,useState} from 'react';
import type {ExamItem} from '../../types';
import type {CompletedAttempt,SavedStudySession,StudyMode} from '../../services/studyStorage';
import {ExamCatalogView} from '../../ui-v14/components/catalog/ExamCatalogView';
import {ExamIntroCard} from '../../ui-v14/components/intro/ExamIntroCard';
import {ListeningInstructionModal} from '../../ui-v14/components/intro/ListeningInstructionModal';
import type {ExamCatalogVM,ExamIntroVM,LevelId,ListeningInstructionModalVM} from '../../ui-v14/types/viewmodels';
import {useDialogFocus} from '../../services/useDialogFocus';
import {uiV15Feature} from '../../services/uiV14Feature';
import '../../ui-v14/styles/index.css';
import '../../styles/ui-v14-integration.css';
import '../../styles/ui-v15-polish.css';
interface Card {
 id:string;title:string;level:LevelId;questionCount:number;durationMinutes:number;canStart:boolean;category?:'mock'|'skill'|'short';
 reasons:string[];sections:{id:string;skill:'listening'|'reading'|'writing';label:string;questionCount:number;durationMinutes:number}[];
 launch:{route:string;body:{seed:string;kind:string;mode:string}}|null;
}
interface Catalog {cards:Card[];total:number;scope:'privatePreview'}
interface Props {api:(route:string,body?:unknown)=>Promise<unknown>;level:LevelId;sessions:SavedStudySession[];attempts:CompletedAttempt[];onLevelChange:(level:string)=>void;onStart:(exam:ExamItem,mode:StudyMode,acknowledgedSections?:number[])=>void;onResume:(id:string)=>void}
export default function CatalogPresentation(props:Props){
 const refined=uiV15Feature(location.search),catalogRoute=refined?'v15/catalog':'v14/catalog';
 const [catalog,setCatalog]=useState<Catalog|null>(null),[error,setError]=useState(''),[selected,setSelected]=useState<Card|null>(null),[mode,setMode]=useState<StudyMode>('practice'),[query,setQuery]=useState(''),[filter,setFilter]=useState<ExamCatalogVM['statusFilter']>('all'),[tab,setTab]=useState<ExamCatalogVM['activeTab']>('mock'),[ack,setAck]=useState(false),[busy,setBusy]=useState(false),[pending,setPending]=useState<{exam:ExamItem;mode:StudyMode}|null>(null);
 const requestBusy=useRef(false),latest=useRef(props);latest.current=props;
 const closeModal=()=>{setPending(null);requestBusy.current=false;setBusy(false)};useDialogFocus(Boolean(pending),'.v14-modal-container',closeModal);
 const load=()=>{setError('');void props.api(catalogRoute).then(d=>setCatalog(d as Catalog)).catch(e=>setError((e as Error).message))};
 useEffect(()=>{let live=true;void props.api(catalogRoute).then(d=>{if(live)setCatalog(d as Catalog)}).catch(e=>{if(live)setError((e as Error).message)});return()=>{live=false}},[props.api,catalogRoute]);
 const sessionFor=(card:Card)=>card.launch?props.sessions.find(s=>s.examSnapshot?.seed===card.launch?.body.seed&&s.examSnapshot?.levelCode==='HSK '+card.level):undefined;
 const attemptsFor=(card:Card)=>card.launch?props.attempts.filter(a=>a.examSnapshot?.seed===card.launch?.body.seed&&a.examSnapshot?.levelCode==='HSK '+card.level):[];
 if(error)return <section className="card v14-catalog-error" role="alert"><p>{error}</p><button className="btn btn-secondary" onClick={load}>Thử lại danh mục đề</button></section>;
 if(!catalog)return <section className={'hsk-ui-v14 '+(refined?'hsk-ui-v15':'')} aria-busy="true"><p role="status">Đang tải danh mục bài luyện…</p>{refined&&<div className="v15-loading-grid" aria-hidden="true"><div className="v15-skeleton"/><div className="v15-skeleton"/></div>}</section>;
 const requestStart=async(id:string,requested:'practice'|'mock')=>{
  const card=catalog.cards.find(c=>c.id===id),requestedMode=requested==='mock'?'timed':'practice';
  if(requestBusy.current||busy||!ack||!card?.canStart||!card.launch||card.id!==selected?.id||requestedMode!==mode)return;
  const existing=latest.current.sessions.find(s=>s.examSnapshot?.seed===card.launch?.body.seed);if(existing){props.onResume(existing.id);return;}
  requestBusy.current=true;setBusy(true);
  try{const data=await props.api(card.launch.route.replace(/^admin\//,''),card.launch.body) as {payload:ExamItem};const exam=data.payload;if(!exam?.questions?.length)throw Error('Builder chưa trả snapshot hợp lệ.');setPending({exam,mode:requestedMode});}
  catch(e){setError((e as Error).message);requestBusy.current=false;setBusy(false)}
 };
 const existing=selected?sessionFor(selected):undefined;
 const intro:ExamIntroVM|null=selected?{examId:selected.id,title:selected.title,level:selected.level,durationMinutes:selected.durationMinutes,passingScore:null,totalQuestions:selected.questionCount,skills:selected.sections.map(s=>({skill:s.skill,label:s.label,questionCount:s.questionCount})),examMode:mode==='timed'?'mock':'practice',noticePractice:'PLATFORM PRACTICE / BETA · Xem giải thích sau khi kiểm tra câu; audio dùng quy tắc luyện tập của engine.',noticeMock:'PLATFORM POLICY · Không mở giải thích/transcript trước nộp. Timer, audio và chuyển phần theo engine; chưa phải Secure Exam hoặc đề Official.',canStart:selected.canStart&&ack&&!existing,startBusy:busy}:null;
 const activeCards=catalog.cards.filter(c=>c.level===props.level),allItems=activeCards.map(card=>({id:card.id,title:card.title,level:card.level,durationMinutes:card.durationMinutes,totalQuestions:card.questionCount,listeningCount:card.sections.filter(s=>s.skill==='listening').reduce((n,s)=>n+s.questionCount,0),readingCount:card.sections.filter(s=>s.skill==='reading').reduce((n,s)=>n+s.questionCount,0),writingCount:card.sections.filter(s=>s.skill==='writing').reduce((n,s)=>n+s.questionCount,0),status:!card.canStart?'locked' as const:sessionFor(card)?'in_progress' as const:attemptsFor(card).length?'completed' as const:'not_started' as const,lastScore:null,passingScore:null,isLocked:!card.canStart,lockReason:card.canStart?null:'Chưa đủ audio/quyền/duyệt chuyên môn'}));
 const category=(id:string)=>catalog.cards.find(c=>c.id===id)?.category??'mock';
 const vm:ExamCatalogVM={activeLevel:props.level,activeTab:tab,searchQuery:query,statusFilter:filter,tabCounts:{mock:{completed:allItems.filter(c=>category(c.id)==='mock'&&c.status==='completed').length,total:allItems.filter(c=>category(c.id)==='mock').length},skill:allItems.filter(c=>category(c.id)==='skill').length,short:allItems.filter(c=>category(c.id)==='short').length},exams:allItems.filter(c=>category(c.id)===tab&&(filter==='all'||c.status===filter)&&(!query.trim()||c.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())))};
 const instructionQuestions=pending?.exam.questions.filter(q=>pending.exam.questions.some(x=>x.skill==='listening')?q.skill==='listening':true)??[];
 const modal:ListeningInstructionModalVM={title:refined&&pending&&!pending.exam.questions.some(q=>q.skill==='listening')?'Hướng dẫn bài luyện Đọc':undefined,isOpen:Boolean(pending),canTestAudio:false,parts:[...new Set(instructionQuestions.map(q=>q.partId??q.type))].map((id,i)=>({partNumber:i+1,title:id,questionCount:instructionQuestions.filter(q=>(q.partId??q.type)===id).length}))};
 return <section className={'hsk-ui-v14 v14-catalog-host '+(refined?'hsk-ui-v15':'')} data-v14-batch="catalog-intro">
  {refined&&!intro&&<header className="v15-catalog-hero"><div><p className="v15-kicker">Không gian luyện thi · HSK {props.level}</p><h1>Mỗi bài luyện, một bước tiến.</h1><p>Chọn bài phù hợp, làm theo nhịp của bạn và xem lại từng câu. Tiến độ được lưu ngay trên thiết bị.</p></div><dl className="v15-catalog-stats"><div><dt>Bài có thể luyện</dt><dd>{activeCards.filter(c=>c.canStart).length}</dd></div><div><dt>Đã hoàn thành</dt><dd>{allItems.filter(c=>c.status==='completed').length}</dd></div></dl></header>}
  {intro?<><ExamIntroCard refined={refined} intro={intro} callbacks={{onBack:()=>{if(!busy){setSelected(null);setAck(false)}},onToggleMode:m=>{if(!busy){setMode(m==='mock'?'timed':'practice');setAck(false)}},onStartExam:(id,m)=>{void requestStart(id,m)}}}/><label className="checkbox-label v14-rules-ack"><input type="checkbox" checked={ack} disabled={busy} onChange={e=>setAck(e.target.checked)}/>Tôi đã đọc quy tắc nền tảng và hiểu nội dung đang chờ duyệt.</label>{existing&&<button className="btn btn-primary" onClick={()=>props.onResume(existing.id)}>Tiếp tục bài đang làm</button>}</>:<ExamCatalogView refined={refined} catalog={vm} callbacks={{onSelectExam:id=>{const card=catalog.cards.find(c=>c.id===id);if(card){setSelected(card);setAck(false)}},onSelectLevel:level=>{setSelected(null);props.onLevelChange(level)},onSelectTab:setTab,onSearchChange:setQuery,onFilterChange:setFilter}}/>}
  <p className="v14-scope-notice">Private Preview · Nội dung AI / NEEDS_REVIEW · Không phải đề Official. Chưa có bài được phát hành công khai.</p>
  <ListeningInstructionModal modal={modal} callbacks={{onClose:closeModal,onConfirm:()=>{const value=pending;if(!value||!requestBusy.current)return;setPending(null);requestBusy.current=false;setBusy(false);props.onStart(value.exam,value.mode,[0])}}}/>
 </section>;
}
