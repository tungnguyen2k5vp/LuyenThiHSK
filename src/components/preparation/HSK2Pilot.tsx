import {useState,useCallback,lazy,Suspense} from 'react';
import {uiV13Feature} from '../../services/uiV13Feature';
import {levelHub,mockReadinessView,practiceHub} from '../../adapters/ui-v13/dashboard';
import {screenMeta} from '../../adapters/ui-v13/exam';
import {mergeGrammar} from '../../adapters/ui-v13/curriculum';
import type {ExamItem,ExamQuestion} from '../../types';
import type {CourseWord,GrammarPoint} from '../../types/curriculum';
import type {CompletedAttempt,SavedStudySession} from '../../services/studyStorage';
import {HSK2_BLUEPRINT} from '../../../shared/level-blueprints.mjs';
import {makePartPractice,partPracticeProgress} from '../../services/partPractice';
import {makeMixedPractice} from '../../services/partPractice';
import {HSK2MockStatus,type Readiness} from './HSK2MockStatus';
import {GuidedListening} from './GuidedListening';
export type HSK2PracticeData={version:string;questions:ExamQuestion[];grammarSupplement:ExamQuestion[];referenceWords:CourseWord[];referenceGrammar:GrammarPoint[];officialMockAvailable:boolean;grammarQuestions?:ExamQuestion[];lessonDrafts?:GrammarPoint[];wordDrafts?:(CourseWord&{vocabularyPointId:string})[]};
const skillNames={listening:'Nghe',reading:'Đọc',writing:'Viết'};
const partNames:Record<string,string>={L1:'Nghe và chọn hình',L2:'Nghe và ghép hình',L3:'Nghe hội thoại',R1:'Đọc và ghép hình',R2:'Điền từ trong ngữ cảnh',R3:'Chọn lời đáp',R4:'Đọc đoạn ngắn',W1:'Thành phần chữ Hán',W2:'Viết chữ Hán'};
const PracticePresentation=lazy(()=>import('../uiV13/PracticePresentation'));
const LevelHubPresentation=lazy(()=>import('../uiV13/LevelHubPresentation'));
export function HSK2Pilot({pilot,attempts,sessions,onPractice,onNavigate,onMock,showMock=true}:{pilot:HSK2PracticeData|null;attempts:CompletedAttempt[];sessions:SavedStudySession[];onPractice:(exam:ExamItem)=>void;onNavigate?:(tab:string)=>void;onMock?:(exam:ExamItem)=>void;showMock?:boolean}){
 const [skill,changeSkill]=useState(()=>{const saved=sessionStorage.getItem('hsk-v8-pilot-skill');return saved&&['reading','writing','listening'].includes(saved)?saved:'reading';}),[notice,setNotice]=useState('');
 const setSkill=(value:string)=>{sessionStorage.setItem('hsk-v8-pilot-skill',value);changeSkill(value);};
 const start=(partId:string)=>{if(!pilot)return;const built=makePartPractice(pilot.questions,'2',partId,attempts,sessions);if(!built)return;setNotice(built.repeatedIds.length?'Ngân hàng phần này đang dùng lại '+built.repeatedIds.length+' câu đã gặp.':'');onPractice(built.exam);};
 const modern=uiV13Feature(location.search).enabled;
 const [readiness,setReadiness]=useState<Readiness|null>(null),receiveReadiness=useCallback((data:Readiness)=>setReadiness(data),[]);
 const mock=mockReadinessView({status:readiness?.status??'NOT_LOADED',capabilities:readiness?.capabilities,counts:readiness?.counts,sourceVerification:readiness?.sourceVerification?.status??'Điều kiện Mock được kiểm tra riêng bên dưới; chưa xác nhận khả dụng.'});
 return <section className="card hsk2-pilot">{pilot&&uiV13Feature(location.search).enabled&&<Suspense fallback={<p role="status">Đang tải trung tâm HSK 2…</p>}><LevelHubPresentation state={{status:'ready',data:levelHub({meta:screenMeta('2','level-hub'),words:pilot.referenceWords,lessons:mergeGrammar(pilot.referenceGrammar,pilot.lessonDrafts??[]),questions:pilot.questions},mock)}} onNavigate={()=>document.querySelector('.hsk2-pilot .hsk-practice-workspace,.hsk2-pilot .part-catalogue')?.scrollIntoView({block:'start',behavior:'smooth'})} onRetry={()=>{}}/></Suspense>}<p className="eyebrow">PRIVATE PRACTICE BETA</p><h2>HSK 2 · Đang thử nghiệm</h2><details className="hsk2-limitations"><summary>Xem giới hạn nội dung</summary><p>{pilot?.questions.length??0} câu nội bộ · AI_GENERATED / NEEDS_REVIEW. Nội dung chưa được duyệt chuyên môn. Không phải đề HSK chính thức và chưa mở Full Mock HSK2.</p><p>9 phần theo bản mẫu giấy đã đối chiếu: 25 nghe / 25 đọc / 10 viết. Quy tắc IBT và xung đột đánh số Writing chưa xác minh. Human Reviewed: 0 · Published: 0.</p></details>
 {!pilot&&<p role="status">Đang tải nội dung riêng…</p>}
 {pilot&&modern?<Suspense fallback={<p role="status">Đang tải khu luyện tập…</p>}><PracticePresentation state={{status:'ready',data:practiceHub({meta:screenMeta('2','practice'),questions:pilot.questions,attempts},mock)}} onRetry={()=>{}} onNavigate={command=>{if(command.kind!=='practice'||command.level!=='2')return;if(command.partId){start(command.partId);return;}const built=makeMixedPractice(pilot.questions,'2',attempts,sessions);if(built){setNotice(built.repeatedIds.length?'Có '+built.repeatedIds.length+' câu ôn lại; đã ưu tiên câu ít gặp và gặp lâu nhất.':'');onPractice(built.exam);}}}/></Suspense>:<>
 {pilot&&<div className="dialog-actions"><button className="btn btn-primary" onClick={()=>{const built=makeMixedPractice(pilot.questions,'2',attempts,sessions);if(built){setNotice(built.repeatedIds.length?'Có '+built.repeatedIds.length+' câu ôn lại; đã ưu tiên câu ít gặp và gặp lâu nhất.':'');onPractice(built.exam)}}}>Mini hỗn hợp · 6 câu</button><span>Chọn câu khả dụng, ưu tiên chưa gặp. Không đưa câu nghe thiếu audio vào bài.</span></div>}
 <div className="hsk2-skill-cards" aria-label="Kỹ năng HSK 2">{Object.entries(skillNames).map(([id,label])=>{const questions=pilot?.questions.filter(q=>q.skill===id)??[],stats=partPracticeProgress(questions,attempts),parts=HSK2_BLUEPRINT.parts.filter(p=>p.skill===id);return <button key={id} aria-pressed={skill===id} onClick={()=>setSkill(id)}><strong>Luyện {label.toLowerCase()}</strong><span>{parts.length} phần · {stats.available} câu khả dụng</span><span>{stats.done} đã làm · {stats.incorrect} sai</span><span>{stats.accuracy===null?'Chưa có tỷ lệ chấm tự động':stats.accuracy+'% đúng trên câu chấm được'}</span><span>{id==='listening'&&!stats.available?'Phần nghe đang chuẩn bị âm thanh.':'Chọn phần để luyện →'}</span></button>;})}</div>
 <div className="admin-tabs" aria-label="Chọn nhóm câu HSK 2">{Object.entries(skillNames).map(([id,label])=><button key={id} aria-pressed={skill===id} className={'btn '+(skill===id?'btn-primary':'btn-secondary')} onClick={()=>setSkill(id)}>{label}</button>)}</div>
 {notice&&<p role="status">{notice}</p>}
 <div className="part-catalogue">{pilot&&HSK2_BLUEPRINT.parts.filter(p=>p.skill===skill).map(p=>{const questions=pilot.questions.filter(q=>q.partId===p.partId),stats=partPracticeProgress(questions,attempts),missing=questions.length>0&&stats.available===0;return <article className="card" key={p.partId}><p className="eyebrow">{p.partId} · Nội dung chờ duyệt</p><h3>{partNames[p.partId]}</h3><p>{stats.available}/{questions.length} câu khả dụng · mỗi lượt tối đa 3 câu · khoảng {p.partId==='W2'?5:3} phút</p><div className="hsk2-part-stats"><span>{stats.done} đã làm</span><span>{stats.incorrect} sai</span><span>{stats.unanswered} bỏ trống</span>{stats.ungraded>0&&<span>{stats.ungraded} chưa chấm</span>}</div><p>{stats.accuracy===null?'Chưa có dữ liệu chấm tự động.':'Tỷ lệ đúng gần nhất: '+stats.accuracy+'% trên câu chấm được.'}</p>{missing&&<p role="status">Phần nghe đang chuẩn bị âm thanh.</p>}{p.partId==='W2'&&<p>Bài viết chưa chấm · Lưu câu trả lời, tự đối chiếu và chờ người chấm.</p>}<button className="btn btn-primary" disabled={!stats.available} onClick={()=>start(p.partId)}>Luyện thử HSK 2 · {p.partId}</button></article>;})}</div>
 </>}
 {modern&&notice&&<p role="status">{notice}</p>}
 {onNavigate&&<div className="dialog-actions"><button className="btn btn-secondary" onClick={()=>onNavigate('review')}>Ôn câu cần xem lại</button><button className="btn btn-secondary" onClick={()=>onNavigate('history')}>Lịch sử HSK 2</button><button className="btn btn-secondary" onClick={()=>onNavigate('today')}>Kế hoạch hôm nay</button></div>}
 {showMock&&<HSK2MockStatus onStart={onMock??onPractice} onReadiness={modern?receiveReadiness:undefined}/>}
 {pilot&&<GuidedListening questions={pilot.questions}/>}
 </section>;
}
