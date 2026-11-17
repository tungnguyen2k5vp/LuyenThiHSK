import {useDialogFocus} from '../../services/useDialogFocus';
import { useCallback, useEffect, useRef, useState,lazy,Suspense } from 'react';
import {uiV14Feature} from '../../services/uiV14Feature';
const V14Room=lazy(()=>import('../uiV14/RoomPresentation'));
const V14Feedback=lazy(()=>import('../uiV14/FeedbackPresentation'));
const V14Section=lazy(()=>import('../uiV14/SectionInstructionPresentation'));
import { ExamItem } from '../../types';
import { SavedStudySession, CompletedAttempt,readStudyData } from '../../services/studyStorage';
import { attemptDurationSeconds, remainingSessionSeconds } from '../../services/sessionClock';
import { canNavigate, getExamConfig, sectionOfQuestion } from '../../services/examRules';
import { questionStatus } from '../../services/examScoring';
import { ExamAudio } from './ExamAudio';
import { QuestionSolution } from './QuestionSolution';
import { PracticeDictionary } from '../learning/PracticeDictionary';
import { useSessionLease } from '../../services/sessionLease';
import {openQuestionTiming,accrueQuestionTime,recordQuestionAnswer} from '../../services/questionTiming';
import {QuestionTypeRenderer} from './QuestionTypeRenderer';
import {completeRegisteredAnswer} from '../../../shared/question-types.mjs';
import {beginMediaPause,resumeMediaPause,mediaPauseBudget} from '../../services/mediaFairness';
import {RequiredMediaContext} from './RequiredMediaContext';
import {usePreviewContent} from '../../services/previewContent';
interface Props { exam: ExamItem; session: SavedStudySession; onSave: (session: SavedStudySession) => void; onExit: () => void; onComplete: (attempt: Omit<CompletedAttempt, 'id'>) => void; onChecked: (index: number, answer: string) => void }
export function ExamRoom({ exam, session, onSave, onExit, onComplete, onChecked }: Props) {
  const previewStorage=Boolean(usePreviewContent());
  const v14=uiV14Feature(location.search).enabled;
  const lease=useSessionLease(session.id);
  const [state, setState] = useState(session);
  const [now, setNow] = useState(Date.now());
  const [showPalette, setShowPalette] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [pendingSection,setPendingSection]=useState<number|null>(null);
  const pendingSectionRef=useRef<number|null>(null);
  const closeSection=useCallback(()=>{onExit()},[onExit]);useDialogFocus(pendingSection!==null,'.v14-modal-container',closeSection);
  const closeConfirm=useCallback(()=>setConfirm(false),[]);useDialogFocus(confirm,'.exam-dialog',closeConfirm);
  const [recovered, setRecovered] = useState(false);
  const [writingSave,setWritingSave]=useState('Bản nháp tự lưu trên thiết bị khi bạn nhập.');
  const submitted = useRef(false);
  const latest = useRef(state); latest.current = state;
  const saveCallback=useRef(onSave);saveCallback.current=onSave;
  const config = getExamConfig(exam);
  const question = exam.questions[state.currentIndex];
  const timingRows=useRef(session.questionTimings??{});const timingLast=useRef(Date.now());const timingId=useRef(question?.id??'');const timingVisible=useRef(document.visibilityState==='visible');
  const sectionIndex = sectionOfQuestion(exam, state.currentIndex);
  const section = config.sections[sectionIndex];
  const patch = useCallback((update: Partial<SavedStudySession>) => {
    if(!lease.owned)return;
    const at=Date.now();const id=timingId.current;const saved=latest.current;
    let timings=openQuestionTiming(timingRows.current,id,at);timings=accrueQuestionTime(timings,id,at-timingLast.current,timingVisible.current&&!saved.audioPausedAt);timingLast.current=at;
    if(update.answers)timings=recordQuestionAnswer(timings,id,saved.answers[saved.currentIndex]??'',update.answers[saved.currentIndex]??'',at);
    if(update.flaggedQuestionIds?.includes(id)&&!saved.flaggedQuestionIds.includes(id))timings={...timings,[id]:{...timings[id],flagCount:timings[id].flagCount+1}};
    if(update.currentIndex!==undefined){timingId.current=exam.questions[update.currentIndex]?.id??id;timings=openQuestionTiming(timings,timingId.current,at);}
    timingRows.current=timings;
    const next = { ...saved, ...update, questionTimings:timings, updatedAt: new Date(at).toISOString() };
    latest.current = next; setState(next); saveCallback.current(next);
    if(update.answers&&exam.questions[next.currentIndex]?.scoring==='manual'){
      const stored=readStudyData(previewStorage?'hsk-v4-preview-study-v1':undefined,previewStorage).sessions.find(s=>s.id===next.id);
      setWritingSave(stored?.answers[next.currentIndex]===next.answers[next.currentIndex]?'Đã lưu trên thiết bị · '+new Date(next.updatedAt).toLocaleTimeString('vi-VN'):'Chưa lưu được trên thiết bị. Giữ trang này mở và xuất bản sao tiến độ.');
    }
  }, [lease.owned,exam.questions,previewStorage]);
  const mediaStates=useRef(new Map<string,string>()),mediaQuestion=useRef(question?.id);
  if(mediaQuestion.current!==question?.id){mediaStates.current.clear();mediaQuestion.current=question?.id;}
  const allMediaReady=[...mediaStates.current.values()].every(status=>status==='ready');
  const requiredMedia=useCallback((id:string,status:'loading'|'ready'|'error')=>{
    if(!lease.owned||submitted.current)return;mediaStates.current.set(id,status);
    const saved=latest.current;if(saved.mode!=='timed')return;
    const blocked=[...mediaStates.current.values()].some(s=>s!=='ready');
    if(blocked){if(!saved.audioPausedAt)patch(beginMediaPause(saved,id.startsWith('audio:')?'audio':'image'));}
    else if(saved.audioPausedAt&&!saved.mediaRecoveryRequired){const resumed=resumeMediaPause(saved);if(!resumed.audioPausedAt)patch(resumed);}
  },[lease.owned,patch]);
  useEffect(()=>{if(!lease.owned)return;patch({});const timer=window.setInterval(()=>{if(!submitted.current)patch({});},5000);const visibility=()=>{if(!submitted.current)patch({});timingVisible.current=document.visibilityState==='visible';timingLast.current=Date.now();};const pagehide=()=>{if(submitted.current)return;const persisted=readStudyData(previewStorage?'hsk-v4-preview-study-v1':undefined,previewStorage).sessions.find(s=>s.id===latest.current.id);if(persisted)patch(persisted);};document.addEventListener('visibilitychange',visibility);window.addEventListener('pagehide',pagehide);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',pagehide);};},[lease.owned,patch,previewStorage]);
  const submit = useCallback(() => {
    if (submitted.current||!lease.owned) return;
    patch({});
    submitted.current = true;
    const saved = latest.current;
    const finishedAt = new Date().toISOString();
    onComplete({ examId: exam.id, examSnapshot: exam, mode: saved.mode, answers: saved.answers, flaggedQuestionIds: saved.flaggedQuestionIds,
      selfRatings: {}, startedAt: saved.startedAt, finishedAt,questionTimings:saved.questionTimings,endedBy:saved.mode==='timed'&&Date.now()>=Date.parse(saved.sectionDeadlineAt??saved.deadlineAt??'')?'timeout':'submitted',
      durationSeconds: attemptDurationSeconds(new Date(Date.parse(saved.startedAt) + (saved.pausedDurationMs ?? 0) + (saved.audioPausedAt ? Date.now() - Date.parse(saved.audioPausedAt) : 0)).toISOString(), finishedAt, saved.mode === 'timed' ? exam.durationMinutes * 60 : undefined) });
  }, [exam, onComplete,lease.owned,patch]);
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 250); return () => clearInterval(timer); }, []);
  const deadline = config.timing === 'section' ? state.sectionDeadlineAt ?? state.deadlineAt : state.deadlineAt;
  const remaining = state.mode === 'timed' && deadline ? remainingSessionSeconds(deadline, state.audioPausedAt ? Date.parse(state.audioPausedAt) : now) : null;
  const nextSection = useCallback(() => {
    const index = (latest.current.activeSectionIndex ?? sectionOfQuestion(exam, latest.current.currentIndex)) + 1;
    const next = config.sections[index];
    if (!next) { submit(); return; }
    if(v14&&!latest.current.acknowledgedSectionIndexes?.includes(index)){
      if(pendingSectionRef.current===null){pendingSectionRef.current=index;setPendingSection(index)}
      return;
    }
    patch({ activeSectionIndex: index, currentIndex: exam.questions.findIndex((item) => item.id === next.questionIds[0]),
      sectionDeadlineAt: new Date(Date.now() + next.durationMinutes * 60000).toISOString() });
  }, [config.sections, exam, patch, submit,v14]);
  useEffect(() => {
    if (remaining !== 0 || state.audioPausedAt || submitted.current) return;
    if (config.timing === 'section') nextSection(); else submit();
  }, [remaining, state.audioPausedAt, config.timing, nextSection, submit]);
  const navigate = useCallback((index: number) => {
    if(v14&&pendingSectionRef.current!==null)return;
    if(latest.current.audioPausedAt)return;
    if (!canNavigate(exam, latest.current.currentIndex, index, latest.current.mode, latest.current.activeSectionIndex)) return;
    patch({ currentIndex: index }); setShowPalette(false); window.scrollTo({ top: 0, behavior: 'instant' });
  }, [exam, patch,v14]);
  const setAnswer = useCallback((value: string) => {if(!latest.current.audioPausedAt&&(!v14||pendingSectionRef.current===null))patch({ answers: { ...latest.current.answers, [latest.current.currentIndex]: value } });}, [patch,v14]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (latest.current.audioPausedAt || event.isComposing || event.keyCode === 229 || confirm || target?.closest('input, textarea, select, [contenteditable=true], [role=dialog]')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); navigate(latest.current.currentIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
      const option = question?.options[Number(event.key) - 1];
      if (/^[1-9]$/.test(event.key) && option&&!question.matching?.items) setAnswer(option.id);
      if(event.key.toLowerCase()==='f'&&question){event.preventDefault();const flags=latest.current.flaggedQuestionIds;patch({flaggedQuestionIds:flags.includes(question.id)?flags.filter(id=>id!==question.id):[...flags,question.id]});}
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [confirm, navigate, question, setAnswer, patch]);
  if(!lease.owned)return <section className="card session-lease-warning" role="alert"><h1>Phiên này đang mở ở tab khác</h1><p>Để các tab không ghi đè câu trả lời, chỉ một tab được chỉnh sửa phiên thi.</p><button className="btn btn-primary" onClick={lease.takeOver}>Tiếp quản phiên trên tab này</button><button className="btn btn-secondary" onClick={onExit}>Về danh sách</button></section>;
  if (!question) return <p role="alert">Không tìm thấy câu hỏi. <button onClick={onExit}>Về danh sách</button></p>;
  const answer = state.answers[state.currentIndex] ?? '';
  const checked = state.mode === 'practice' && state.checkedQuestionIds.includes(question.id);
  const answeredCount = exam.questions.filter((q,i)=>completeRegisteredAnswer(q,state.answers[i])).length;
  const toggleFlag = () => patch({ flaggedQuestionIds: state.flaggedQuestionIds.includes(question.id) ? state.flaggedQuestionIds.filter((id) => id !== question.id) : [...state.flaggedQuestionIds, question.id] });
  const handleAudioError = () => {
    if (latest.current.mode === 'timed') { setRecovered(false); patch({...beginMediaPause(latest.current,'audio'),mediaRecoveryRequired:true}); }
  };
  const recoverAudio = () => {
    if([...mediaStates.current.values()].some(s=>s!=='ready'))return;
    patch(resumeMediaPause(latest.current));
  };
  const palette = <aside className={'room-palette ' + (showPalette ? 'is-open' : '')} aria-label="Danh sách câu hỏi">
    <div className="palette-heading"><strong>Danh sách câu</strong><button className="mobile-palette-close btn btn-ghost" onClick={() => setShowPalette(false)}>Đóng</button></div>
    {config.sections.map((group) => <section key={group.skill}><h3>{group.label}</h3><div className="palette-grid">{group.questionIds.map((id) => {
      const index = exam.questions.findIndex((item) => item.id === id);
      const hasAnswer = completeRegisteredAnswer(exam.questions[index],state.answers[index]); const flag = state.flaggedQuestionIds.includes(id);
      return <button key={id} className={'palette-btn ' + (index === state.currentIndex ? 'active ' : '') + (hasAnswer ? 'answered ' : 'unanswered ') + (flag ? 'flagged' : '')}
        aria-current={index === state.currentIndex ? 'step' : undefined} disabled={Boolean(state.audioPausedAt)||!canNavigate(exam, state.currentIndex, index, state.mode, state.activeSectionIndex)}
        aria-label={`Câu ${index + 1}: ${hasAnswer ? 'đã trả lời' : 'bỏ trống'}${flag ? ', đánh dấu' : ''}`} onClick={() => navigate(index)}>{index + 1}{flag ? ' ⚑' : ''}</button>;
    })}</div></section>)}<small>{answeredCount}/{exam.questions.length} đã trả lời · ⚑ đánh dấu</small>
  </aside>;
  const questionContent=<main className="room-question" aria-labelledby="question-title">
      <div className="question-header"><h1 id="question-title">Câu {state.currentIndex + 1}</h1><button className="btn btn-ghost" aria-pressed={state.flaggedQuestionIds.includes(question.id)} onClick={toggleFlag}>{state.flaggedQuestionIds.includes(question.id) ? '⚑ Đã đánh dấu' : 'Đánh dấu'}</button></div>
      <p className="question-instruction">{question.instruction}</p>
      {question.skill === 'listening' && <ExamAudio key={config.audio.delivery === 'section' ? sectionIndex : question.id}
        text={config.audio.delivery === 'section' ? exam.questions.filter((item) => section?.questionIds.includes(item.id)).map((item) => item.promptZh).join('\n') : question.promptZh}
          src={config.audio.delivery === 'section' ? section?.audioSrc : question.audio?.src} slowSrc={state.mode==='practice'?question.audio?.slowSrc:undefined} voiceKind={question.audio?.voiceKind} rules={state.mode === 'practice' ? { ...config.audio, maxPlays: null, allowRateChange: true, allowSeek: true } : config.audio}
        usedPlays={state.audioPlayCounts?.[config.audio.delivery === 'section' ? String(sectionIndex) : question.id] ?? 0} onError={handleAudioError} onAvailability={exam.contentEnvironment==='PREVIEW'?(ready)=>requiredMedia('audio:'+question.id,ready?'ready':'loading'):undefined}
        onPlayed={() => { const key = config.audio.delivery === 'section' ? String(sectionIndex) : question.id; patch({ audioPlayCounts: { ...latest.current.audioPlayCounts, [key]: (latest.current.audioPlayCounts?.[key] ?? 0) + 1 } }); }} />}
      {question.skill === 'listening' ? question.candidatePromptZh && <p className="candidate-prompt" lang="zh-CN">{question.candidatePromptZh}</p> : <div className="prompt-card"><p className="prompt-chinese-large" lang="zh-CN">{question.promptZh}</p>{question.contextZh && <p lang="zh-CN">{question.contextZh}</p>}{question.pinyinIsExamContent && <p>{question.promptPinyin}</p>}</div>}
      {question.partId||question.matching||question.image||question.type==='picture-choice'||question.type==='picture-true-false'?<QuestionTypeRenderer question={question} answer={answer} onAnswer={value=>{if(!v14||exam.questions[latest.current.currentIndex]?.id===question.id)setAnswer(value)}} saveStatus={writingSave} readOnly={Boolean(state.audioPausedAt)||pendingSection!==null}/>:question.options.length ? <div className="options-grid" role="radiogroup" aria-label="Lựa chọn câu trả lời">{question.options.map((option, index) => <button key={option.id} className={'exam-choice ' + (answer === option.id ? 'selected' : '')} role="radio" disabled={Boolean(state.audioPausedAt)} aria-checked={answer === option.id} onClick={() => setAnswer(option.id)}><span className="option-letter">{option.id}</span><span lang="zh-CN">{option.text}{question.pinyinIsExamContent && option.pinyin && <small>{option.pinyin}</small>}</span><kbd>{index + 1}</kbd></button>)}</div>
        : <label className="response-field">{question.type === 'speaking' ? 'Ghi chú câu trả lời nói · tự đánh giá' : 'Câu trả lời bằng tiếng Trung'}<textarea disabled={Boolean(state.audioPausedAt)} value={answer} maxLength={4000} rows={5} aria-label="Câu trả lời tự luận" onChange={(event) => setAnswer(event.target.value)} /><small>{answer.length}/4000 ký tự</small></label>}
      {checked && <section className={'answer-feedback ' + questionStatus(question, answer)}><strong>{questionStatus(question, answer) === 'correct' ? 'Đúng' : questionStatus(question, answer) === 'self-review' ? 'Đáp án đã được lưu. Bài này chưa được chấm tự động.' : 'Chưa đúng'}</strong>{v14?<Suspense fallback={<p role="status">Loading feedback...</p>}><V14Feedback snapshot={{exam,session:state,now,readOnly:!lease.owned||pendingSection!==null,saving:false,submitBusy:submitted.current,images:{},audio:null}}/></Suspense>:<QuestionSolution question={question} answer={answer} />}</section>}
      <div className="room-controls"><button className="btn btn-secondary" disabled={!canNavigate(exam, state.currentIndex, state.currentIndex - 1, state.mode, state.activeSectionIndex)} onClick={() => navigate(state.currentIndex - 1)}>Câu trước</button>
        {state.mode === 'practice' && <button className="btn btn-primary" disabled={!answer.trim()} onClick={() => { patch({ checkedQuestionIds: [...new Set([...state.checkedQuestionIds, question.id])] }); onChecked(state.currentIndex, answer); }}>{question.scoring==='manual'||question.type==='short-answer'||question.type==='speaking'?'Lưu câu trả lời':'Kiểm tra câu'}</button>}
        <button className="btn btn-secondary" disabled={!canNavigate(exam, state.currentIndex, state.currentIndex + 1, state.mode, state.activeSectionIndex)} onClick={() => navigate(state.currentIndex + 1)}>Câu sau</button></div>
      {state.mode === 'timed' && !config.navigation.futureSections && sectionIndex + 1 < config.sections.length && <button className="btn btn-secondary" onClick={() => { if (!latest.current.audioPausedAt&&(v14||window.confirm('Chuyển sang phần tiếp theo? Quy tắc của bài có thể không cho quay lại.'))) nextSection(); }}>Chuyển phần</button>}
      {state.mode==='practice'&&<PracticeDictionary/>}
      <p className="saved-hint">Tự lưu trên thiết bị · {state.mode === 'timed' ? 'Bài luyện có giờ tùy chỉnh' : 'Luyện từng câu'}</p>
    </main>;
  const roomContent=v14?<Suspense fallback={<p role="status">Loading room...</p>}><V14Room snapshot={{exam,session:state,now,readOnly:!lease.owned||pendingSection!==null,saving:false,submitBusy:submitted.current,images:{},audio:null}} onNavigate={navigate} onSubmitRequested={()=>setConfirm(true)} onExit={()=>{patch({});onExit();}}>{questionContent}</V14Room></Suspense>:<div className="room-stage">{questionContent}{palette}</div>;
  return <div className="exam-room">
    {!v14&&<header className="room-topbar"><button className="btn btn-ghost" onClick={()=>{patch({});onExit();}}>Thoát</button><div className="room-title"><strong>{exam.title}</strong><small>{exam.version === 'hsk2' ? 'HSK 2.0' : 'HSK 3.0'} · {section?.label} · Câu {state.currentIndex + 1}/{exam.questions.length}</small></div>
      {remaining !== null && <span className={"exam-timer-pill "+(remaining < 300 ? "timer-critical" : remaining < 600 ? "timer-warning" : "")} aria-label="Thời gian còn lại">{state.audioPausedAt ? 'Tạm dừng · ' : ''}{String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}</span>}
      <button className="btn btn-primary" disabled={Boolean(state.audioPausedAt)} onClick={() => setConfirm(true)}>Nộp bài</button></header>}
    {state.audioPausedAt && <div className="audio-recovery card" role="alert" data-media-states={JSON.stringify(Object.fromEntries(mediaStates.current))}><strong>{state.mediaPauseReason==='image'?'Hình ảnh chưa sẵn sàng':'Âm thanh chưa sẵn sàng'} — đồng hồ đã tạm dừng, bài làm được giữ nguyên.</strong><p>Tự tiếp tục khi media bắt buộc tải xong. Nếu phát âm thanh lỗi, cần nghe kiểm tra và xác nhận. Ngân sách bù giờ tối đa 5 phút cho cả lượt; quá giới hạn sẽ giữ bài để thoát hoặc chuyển sang luyện không giờ.</p>
      {state.mediaRecoveryRequired&&<>
      <ExamAudio text="你好，欢迎参加汉语练习。" src={config.audio.kind === 'file' ? (config.audio.delivery === 'section' ? section?.audioSrc : question.audio?.src) : undefined} rules={{ ...config.audio, maxPlays: null }} onPlayed={() => {mediaStates.current.set('audio:'+question.id,'ready');setRecovered(true);}} onError={()=>{mediaStates.current.set('audio:'+question.id,'error');setRecovered(false);}} onSuccess={() => {mediaStates.current.set('audio:'+question.id,'ready');setRecovered(true);}} />
      <p>Khi đã nghe được âm thanh, hãy xác nhận để tiếp tục. Bài vẫn tạm dừng cho đến khi bạn xác nhận và mọi media bắt buộc sẵn sàng.</p>
      <button className="btn btn-primary" disabled={!recovered||!allMediaReady||!mediaPauseBudget(state,now).allowed} onClick={recoverAudio}>Đã nghe được · Tiếp tục tính giờ</button></>}
      {!mediaPauseBudget(state,now).allowed&&<p>Đã hết ngân sách bù giờ. Không thể tiếp tục lượt có giờ này. Câu trả lời vẫn được lưu.</p>}
      {!v14&&<button className="btn btn-secondary" onClick={()=>patch({mode:'practice',audioPausedAt:undefined,mediaPauseReason:undefined,mediaRecoveryRequired:undefined})}>Chuyển sang luyện không giờ</button>}<button className="btn btn-ghost" onClick={()=>{patch({});onExit();}}>Lưu và thoát</button></div>}
    <span className="sr-only" role="status" aria-live="polite">{remaining!==null&&remaining<=300?remaining<=60?'Còn dưới một phút làm bài':'Còn dưới năm phút làm bài':''}</span>{!v14&&<button className="room-toggle btn btn-secondary" onClick={() => setShowPalette(!showPalette)} aria-expanded={showPalette}>Danh sách câu ({answeredCount}/{exam.questions.length})</button>}
    {!v14&&question.partId&&<aside className="part-progress"><strong>{section?.label} · {question.partId}</strong><span>{exam.questions.filter(q=>q.partId===question.partId&&completeRegisteredAnswer(q,state.answers[exam.questions.indexOf(q)])).length}/{exam.questions.filter(q=>q.partId===question.partId).length} câu hoàn tất</span><label>Chuyển nhóm câu <select disabled={Boolean(state.audioPausedAt)} className="part-jump" value={question.partId} onChange={e=>navigate(exam.questions.findIndex(q=>q.partId===e.target.value))}>{[...new Set(exam.questions.filter(q=>q.skill===question.skill).map(q=>q.partId))].filter(Boolean).map(id=><option key={id}>{id}</option>)}</select></label></aside>}
    <RequiredMediaContext.Provider value={requiredMedia}>{roomContent}</RequiredMediaContext.Provider>
    {v14&&pendingSection!==null&&<Suspense fallback={<p role="status">Loading section...</p>}><V14Section exam={exam} index={pendingSection} onExit={onExit} onConfirm={()=>{const index=pendingSectionRef.current;if(index===null||index!==pendingSection||submitted.current)return;pendingSectionRef.current=null;setPendingSection(null);patch({acknowledgedSectionIndexes:[...new Set([...(latest.current.acknowledgedSectionIndexes??[]),index])]});nextSection();}}/></Suspense>}
    {confirm && <div className="exam-dialog-overlay"><section className="exam-dialog card" role="dialog" aria-modal="true" aria-labelledby="submit-title"><h2 id="submit-title">Nộp bài?</h2><p>Đã trả lời {answeredCount}/{exam.questions.length} câu · Bỏ trống {exam.questions.length - answeredCount} · Đánh dấu {state.flaggedQuestionIds.length}</p>{exam.questions.some((q,i)=>q.matching?.items&&state.answers[i]&&!completeRegisteredAnswer(q,state.answers[i]))&&<p role="alert">Có câu ghép chưa hoàn tất. Kiểm tra trước khi nộp; các phần chưa ghép sẽ không được chấm đúng.</p>}<div className="dialog-actions"><button autoFocus className="btn btn-secondary" onClick={() => setConfirm(false)}>Tiếp tục làm bài</button><button className="btn btn-primary" onClick={submit}>Nộp bài và xem kết quả</button></div></section></div>}
  </div>;
}
