import {CloudSyncBridge} from './components/preparation/AccountSettings';
import {ownerStorageKey} from './services/cloudSync';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ExamItem, ExamQuestion, HSKVersion, SkillType } from './types';
import { FULL_EXAMS, QUESTION_BANKS, findQuestion, makePartExam, resolveExam, reviewExam, rememberExam } from './data/examCatalog';
import { CompletedAttempt, SavedStudySession, StudyData, StudyMode, makeStudyId, readStudyData, writeStudyData, STUDY_STORAGE_KEY } from './services/studyStorage';
import { ExamPage, ExamRoute, readExamRoute, routeUrl } from './services/examRoute';
import { SKILL_LABELS, resolveAnswer, summarizeAttempt } from './services/examScoring';
import { getExamConfig } from './services/examRules';
import { deduplicateReviews, updateReview } from './services/reviewQueue';
import { ExamRoom } from './components/exam/ExamRoom';
import { AttemptResult } from './components/exam/AttemptResult';
import {useDialogFocus} from './services/useDialogFocus';
import { ExamAudio } from './components/exam/ExamAudio';
import { QuestionSolution } from './components/exam/QuestionSolution';
import { VocabularyWorkspace } from './components/library/VocabularyWorkspace';
import { StudyDashboard } from './components/dashboard/StudyDashboard';
import { scheduleSm2 } from './services/sm2';
import { contentApiUrl } from './services/localApi';
import { validateContent } from './data/contentValidation';
import { usePreparation, learningEvent } from './services/preparationStorage';
import { TodayDashboard } from './components/preparation/TodayDashboard';
import { LearnHub, PracticeHub } from './components/preparation/LearningHubs';
const PracticeCatalog = lazy(() => import('./components/preparation/PracticeCatalog').then(m=>({default:m.PracticeCatalog})));
import { WeaknessWorkspace } from './components/preparation/WeaknessWorkspace';
import { ProfileSettings } from './components/preparation/ProfileSettings';
import { HskHome } from './components/dashboard/HskHome';
import { HskSidebar, HskTopbar, PortalIcon, portalActivePage } from './components/layout/HskNavigation';
const CourseWorkspace = lazy(() => import('./components/learning/CourseWorkspace').then(m=>({default:m.CourseWorkspace})));
const Diagnostic = lazy(() => import('./components/preparation/Diagnostic').then(m=>({default:m.Diagnostic})));
const ResponseCenter = lazy(() => import('./components/preparation/ResponseCenter').then(m=>({default:m.ResponseCenter})));
const AdminWorkspace = lazy(() => import('./components/admin/AdminWorkspaceV3').then(m=>({default:m.AdminWorkspaceV3})));
const ContentReviewV5 = lazy(() => import('./components/admin/ContentReviewV5').then(m=>({default:m.ContentReviewV5})));
const PreviewWorkspace = lazy(() => import('./components/preparation/PreviewWorkspace').then(m=>({default:m.PreviewWorkspace})));
import './styles/vocabulary.css';
import './styles/dashboard.css';
import './styles/hsk-portal.css';
import sourceDocument from '../docs/DATA_SOURCES.md?raw';
import referenceDocument from '../docs/REFERENCE_REPOSITORIES.md?raw';
import licenseDocument from '../docs/CONTENT_LICENSES.md?raw';
import policyDocument from '../docs/CONTENT_POLICY.md?raw';

const MOBILE_NAV: [ExamPage,string][] = [['dashboard','Hôm nay'],['practice','Luyện'],['exams','Thi thử'],['review','Ôn tập'],['settings','Tôi']];
const VERSION_LABEL = { hsk2: 'HSK 2.0', hsk3: 'HSK 3.0' };
const TYPE_LABEL: Record<string, string> = { 'multiple-choice': 'Chọn đáp án', 'true-false': 'Đúng / Sai', 'sentence-order': 'Sắp xếp câu', 'fill-blank': 'Điền từ', 'short-answer': 'Viết / Dịch', speaking: 'Nói' };
const LEVELS = ['Chưa xác minh', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'];

export function App() {
  const [data, setData] = useState<StudyData>(() => { const saved = readStudyData(); [...saved.attempts,...saved.sessions].forEach(item=>{if(item.examSnapshot)rememberExam(item.examSnapshot);});return { ...saved, reviewItems: deduplicateReviews(saved.reviewItems) }; });
  const preparation = usePreparation();
  const dataRef = useRef(data);
  const [route, setRoute] = useState<ExamRoute>(readExamRoute);
  const routeRef = useRef(route); routeRef.current = route;
  const [storageError, setStorageError] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [preflight, setPreflight] = useState<{ exam: ExamItem; mode: StudyMode } | null>(null);
  const [soundPassed, setSoundPassed] = useState(false);
  const [heardSound, setHeardSound] = useState(false);
  useDialogFocus(Boolean(preflight),'[data-exam-intro]',()=>setPreflight(null));
  const [solutionId, setSolutionId] = useState<string | null>(null);
  const completedSessions = useRef(new Set<string>());
  const commit = useCallback((update: (previous: StudyData) => StudyData) => {
    const next = update(dataRef.current); dataRef.current = next; setData(next); setStorageError(!writeStudyData(next));
  }, []);
  useEffect(() => { setStorageError(!writeStudyData(dataRef.current)); }, []);
  useEffect(()=>{const sync=(event:StorageEvent)=>{if(event.key!==ownerStorageKey(STUDY_STORAGE_KEY))return;const incoming=readStudyData();dataRef.current=incoming;setData(incoming);};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
  useEffect(()=>{let live=true;fetch(contentApiUrl('public/content')).then(r=>r.ok?r.json():null).then(payload=>{if(!live||!payload?.records)return;for(const row of payload.records){if(row.kind!=='exams')continue;const exam=row.payload as ExamItem;if(validateContent([exam],[]).length)continue;rememberExam(exam);const collection=exam.mode==='full'?FULL_EXAMS:QUESTION_BANKS;if(!collection.some(e=>e.id===exam.id))collection.push(exam);}
      const approved=payload.records.filter((r:{kind:string;payload:ExamQuestion})=>r.kind==='questions'&&r.payload.reviewStatus==='PUBLISHED');
      const groups=new Map<string,ExamQuestion[]>();for(const row of approved){const q=row.payload as ExamQuestion;const key=q.syllabusVersion+':'+q.level;groups.set(key,[...(groups.get(key)??[]),q]);}
      for(const [key,questions]of groups){const id='published-bank:'+key;if(QUESTION_BANKS.some(b=>b.id===id))continue;const first=questions[0];const bank:ExamItem={id,title:'Ngân hàng đã duyệt · HSK '+first.level,version:first.syllabusVersion==='hsk2-2015'?'hsk2':'hsk3',levelCode:'HSK '+first.level,skill:'all',skillLabel:'Nhiều kỹ năng',topic:'Nội dung đã duyệt',mode:'quick',modeLabel:'Bài luyện',totalQuestions:questions.length,durationMinutes:Math.max(5,questions.length),durationKind:'custom',difficulty:'Trung bình',description:'Câu Published theo quy trình V3.',contentLabel:'Câu tự biên soạn đã duyệt · '+first.syllabusVersion,isDemo:true,questions:questions.map((q,i)=>({...q,number:i+1})),provenance:first.provenance};rememberExam(bank);QUESTION_BANKS.push(bank);}
      setData(previous=>({...previous}));}).catch(()=>{});return()=>{live=false;};},[]);
  useEffect(() => { const pop = () => setRoute(readExamRoute()); const online = () => setOffline(!navigator.onLine);
    window.addEventListener('popstate', pop); window.addEventListener('online', online); window.addEventListener('offline', online);
    return () => { window.removeEventListener('popstate', pop); window.removeEventListener('online', online); window.removeEventListener('offline', online); }; }, []);
  const go = useCallback((update: Partial<ExamRoute>, replace = false) => {
    const next = { ...routeRef.current, ...update }; routeRef.current = next;
    window.history[replace ? 'replaceState' : 'pushState']({}, '', routeUrl(next)); setRoute(next);
    setSolutionId(null); window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => document.getElementById('learning-content')?.focus({ preventScroll: true }));
  }, []);
  const goPage = (page: ExamPage) => go({ page, session: undefined, attempt: undefined, type: 'all' });
  const goLearning = (page: string, skill?: string) => go({page:page as ExamPage,session:undefined,attempt:undefined,section:skill&&['listening','reading','writing','speaking'].includes(skill)?skill as SkillType:'all',level:'all',type:'all'});
  const begin = (exam: ExamItem, mode: StudyMode) => {
    const config = getExamConfig(exam); const now = new Date();
    const session: SavedStudySession = { id: makeStudyId('session'), examId: exam.id, examSnapshot: exam, mode,
      answers: {}, currentIndex: 0, flaggedQuestionIds: [], checkedQuestionIds: [], startedAt: now.toISOString(), updatedAt: now.toISOString(),
      deadlineAt: mode === 'timed' ? new Date(now.getTime() + exam.durationMinutes * 60000).toISOString() : undefined,
      activeSectionIndex: config.timing === 'section' ? 0 : undefined,
      sectionDeadlineAt: mode === 'timed' && config.timing === 'section' ? new Date(now.getTime() + config.sections[0].durationMinutes * 60000).toISOString() : undefined };
    commit((previous) => ({ ...previous, sessions: [session, ...previous.sessions.filter((item) => !(item.examId === exam.id && item.mode === mode))].slice(0, 12) }));
    setPreflight(null); go({ session: session.id, attempt: undefined, version: exam.version });
  };
  const start = (exam: ExamItem, mode: StudyMode, restart = false) => {
    const saved = !restart && dataRef.current.sessions.find((item) => item.examId === exam.id && item.mode === mode);
    if (saved) { go({ session: saved.id, attempt: undefined, version: exam.version }); return; }
    if (exam.id.includes(':practice:') || mode === 'timed' && exam.questions.some((question) => question.skill === 'listening')) {
      setSoundPassed(false); setHeardSound(false); setPreflight({ exam, mode });
    } else begin(exam, mode);
  };
  const saveSession = useCallback((session: SavedStudySession) => commit((previous) => ({ ...previous,
    sessions: [session, ...previous.sessions.filter((item) => item.id !== session.id)].slice(0, 12) })), [commit]);
  const session = data.sessions.find((item) => item.id === route.session);
  const activeExam = session && resolveExam(session);
  const attempt = data.attempts.find((item) => item.id === route.attempt);
  const resultExam = attempt && resolveExam(attempt);
  const complete = (draft: Omit<CompletedAttempt, 'id'>) => {
    if (!session || completedSessions.current.has(session.id)) return;
    completedSessions.current.add(session.id);
    const completed: CompletedAttempt = { ...draft, id: makeStudyId('attempt') };
    if(draft.examSnapshot)rememberExam(draft.examSnapshot);
    const completedQuestions=draft.examSnapshot?.questions??[];
    const answeredCount=Object.values(draft.answers).filter(a=>a.trim()).length;
    const practiceEvents=completed.examId.startsWith('review:')?[learningEvent('mistakes',completed.examId,answeredCount,draft.durationSeconds/60)]:[...new Set(completedQuestions.map(q=>q.skill))].map(skill=>{const count=completedQuestions.filter((q,i)=>q.skill===skill&&draft.answers[i]?.trim()).length;return{...learningEvent('practice',completed.examId,count,answeredCount?draft.durationSeconds/60*count/answeredCount:0),skill,contentEnvironment:draft.examSnapshot?.contentEnvironment??'PRODUCTION'};});
    preparation.commit(p=>({...p,events:[...p.events,...practiceEvents]}));
    commit((previous) => { let reviews = previous.reviewItems; const exam = draft.examSnapshot!;
      exam.questions.forEach((question, index) => { reviews = updateReview(reviews, exam, index, draft.answers[index], draft.flaggedQuestionIds.includes(question.id)); });
      return { ...previous, sessions: previous.sessions.filter((item) => item.id !== session.id), attempts: [completed, ...previous.attempts].slice(0, 100), reviewItems: reviews }; });
    go({ session: undefined, attempt: completed.id });
  };
  const normalizeSession = (saved: SavedStudySession, exam: ExamItem): SavedStudySession => ({ ...saved,
    currentIndex: Math.max(0, Math.min(saved.currentIndex, exam.questions.length - 1)),
    answers: Object.fromEntries(Object.entries(saved.answers).map(([index, answer]) => [index, exam.questions[Number(index)]?.legacyOptionAnswers ? resolveAnswer(exam.questions[Number(index)], answer) : answer])) });
  const matches = (exam: ExamItem) => exam.version === route.version && (route.level === 'all' || exam.levelCode === route.level);
  const bankList = QUESTION_BANKS.filter(matches).map((bank) => makePartExam(bank, route.section)).filter((exam) => exam.questions.length);
  const partList = bankList.map((exam) => { if (route.type === 'all') return exam; const questions = exam.questions.filter((question) => question.type === route.type);
    const filtered = { ...exam, id: `${exam.id}:type:${route.type}`, questions, totalQuestions: questions.length, config: undefined };
    return { ...filtered, config: getExamConfig(filtered) }; }).filter((exam) => exam.questions.length);
  const availableSkills = Array.from(new Set(QUESTION_BANKS.filter(matches).flatMap((exam) => exam.questions.map((question) => question.skill))));
  const resumes = data.sessions.flatMap((saved) => { const exam = resolveExam(saved); return exam && matches(exam) ? [{ saved, exam }] : []; });
  const reviewReason = route.type === 'unanswered' ? 'unanswered' : route.type === 'flagged' ? 'flagged' : 'incorrect';
  const reviews = deduplicateReviews(data.reviewItems).flatMap((item) => { const found = findQuestion(item.questionId); return found && matches(found.exam) && (route.section === 'all' || found.question.skill === route.section) && item.reason === reviewReason ? [{ item, ...found }] : []; });
  const title = route.page === 'dashboard' ? 'Tổng quan học tập' : route.page === 'exams' || route.page === 'parts' ? 'Luyện thi HSK' : route.page === 'vocab' ? 'Từ vựng cá nhân' : route.page === 'mistakes' ? 'Ôn câu sai' : route.page === 'history' ? 'Lịch sử làm bài' : 'Thông tin đề và nguồn';
  const filteredAttempts = data.attempts.flatMap((item) => { const exam = resolveExam(item); return exam && matches(exam) && (route.section === 'all' || exam.questions.some((question) => question.skill === route.section)) ? [{ item, exam }] : []; });
  const preflightConfig = preflight && getExamConfig(preflight.exam);
  const preflightSource = preflightConfig?.audio.kind === 'file' ? (preflightConfig.audio.delivery === 'section' ? preflightConfig.sections.find((part) => part.skill === 'listening')?.audioSrc : preflight?.exam.questions.find((question) => question.skill === 'listening')?.audio?.src) : undefined;
  const filters = <div className="exam-filters card"><fieldset className="version-control"><legend>Phiên bản</legend>{(['hsk2', 'hsk3'] as HSKVersion[]).map((version) => <button key={version} className={'btn ' + (route.version === version ? 'btn-primary' : 'btn-secondary')} aria-pressed={route.version === version} onClick={() => go({ version, level: 'all', section: 'all', type: 'all', session: undefined, attempt: undefined })}>{VERSION_LABEL[version]}</button>)}</fieldset>
    <label>Cấp độ<select aria-label="Cấp độ" value={route.level} onChange={(event) => go({ level: event.target.value, section: 'all', type: 'all' })}><option value="all">Tất cả cấp độ</option>{LEVELS.filter((level) => route.version === 'hsk3' || level !== 'HSK 7-9').map((level) => <option key={level}>{level}</option>)}</select></label>
    <label>Phần thi<select aria-label="Phần thi" value={route.section} onChange={(event) => go({ section: event.target.value as SkillType, type: 'all' })}><option value="all">Tất cả phần</option>{availableSkills.map((skill) => <option key={skill} value={skill}>{SKILL_LABELS[skill]}</option>)}</select></label>
  </div>;
  const card = (exam: ExamItem) => {
    const config = getExamConfig(exam);
    const examAttempts=data.attempts.filter(item=>item.examId===exam.id);const hasAttempt=examAttempts.length>0;const best=Math.max(...examAttempts.map(a=>summarizeAttempt(exam,a).accuracyPercent??0));const last=examAttempts[0];
    return <article className="card focused-exam-card" key={exam.id}><div className="card-kicker"><span>{VERSION_LABEL[exam.version]} · {exam.levelCode}</span><span>{hasAttempt ? 'Đã làm' : 'Chưa làm'}</span></div><h2>{exam.title}</h2><p>{exam.mode === 'full' ? 'Đề đầy đủ' : 'Bài luyện ngắn'} · {config.sections.map((section) => section.label).join(' · ')}</p><div className="exam-card-meta"><strong>{exam.questions.length} câu</strong><span>{exam.durationMinutes} phút{exam.durationKind === 'custom' ? ' · tùy chỉnh' : ''}</span></div><p className="content-status">{exam.mockType??(exam.mode==='full'?'Full mock':'Mini / bài luyện')} · {exam.difficulty}</p><p>{exam.contentLabel}</p>{hasAttempt&&<small>Tốt nhất: {best}% câu đúng · Gần nhất: {new Date(last.finishedAt).toLocaleDateString('vi-VN')}</small>}<div className="exam-card-actions">{exam.mode !== 'full' && <button className="btn btn-secondary" onClick={() => start(exam, 'practice')}>Luyện từng câu</button>}<button className="btn btn-primary" onClick={() => start(exam, 'timed')}>{exam.mode === 'full' ? 'Bắt đầu thi' : 'Luyện có giờ'}</button></div></article>;
  };
  const activeNav = portalActivePage(route.page);
  const practiceExam = (exam:ExamItem) => {rememberExam(exam);start(exam,'practice',true);};
  return <div className={'focused-app hsk-portal '+(session?'exam-mode':'')}><CloudSyncBridge/>
    <a href="#learning-content" className="portal-skip-link">Chuyển đến nội dung học</a>
    {!session && <><HskSidebar route={route} onNavigate={goPage}/><HskTopbar route={route} targetLevel={preparation.state.profile.targetLevel} onNavigate={goPage}/></>}
    <main id="learning-content" tabIndex={-1} className="focused-container focused-main">{offline && <p className="app-status-banner" role="status">Đang offline · tiếp tục dùng bài đã tải và lưu bài trên thiết bị.</p>}{storageError && <p className="app-status-banner storage-error" role="alert">Không lưu được bài trên thiết bị. Hãy cho phép lưu trữ trước khi tải lại trang.</p>}
      {session && activeExam ? <ExamRoom key={session.id} exam={activeExam} session={normalizeSession(session, activeExam)} onSave={saveSession} onExit={() => go({ session: undefined })} onComplete={complete}
        onChecked={(index, answer) => commit((previous) => ({ ...previous, reviewItems: updateReview(previous.reviewItems, activeExam, index, answer) }))} />
        : attempt && resultExam ? <AttemptResult key={attempt.id} exam={resultExam} attempt={attempt} onBack={() => go({ attempt: undefined })} onRetake={() => start(resultExam, attempt.mode, true)} onReview={(ids) => start(reviewExam(resultExam, ids), 'practice', true)}
          onRate={(questionId, value) => commit((previous) => ({ ...previous, attempts: previous.attempts.map((item) => item.id === attempt.id ? { ...item, selfRatings: { ...item.selfRatings, [questionId]: value } } : item) }))} />
        : route.page === 'dashboard' ? <HskHome preparation={preparation.state} study={data} route={route} onNavigate={go}/>
        : route.page === 'plan' ? <TodayDashboard data={preparation.state} study={data} commit={preparation.commit} onNavigate={(page,skill)=>go({page:page as ExamPage,section:(skill as SkillType)??'all',level:'HSK '+preparation.state.profile.targetLevel,version:'hsk3',type:'all',session:undefined,attempt:undefined})}/>
        : route.page === 'progress' ? <><StudyDashboard attempts={data.attempts} words={data.wordEntries} onNavigate={goPage} onOpenAttempt={(attemptId) => go({ attempt: attemptId, session: undefined })}/><section className="card readiness-explanation"><h2>Cơ sở mức sẵn sàng thi</h2><p>Cần 2 đề đầy đủ đã duyệt và tối thiểu 30 câu khách quan. Trọng số: đề 40%, kỹ năng 20%, độ phủ 15%, khắc phục lỗi 10%, thời gian 10%, đều đặn 5%. Lượt luyện minh họa không chứng minh khả năng đỗ kỳ thi.</p><button className="btn btn-primary" onClick={()=>goPage('history')}>Mở lịch sử bài làm</button></section></>
        : route.page === 'learn' ? <LearnHub level={preparation.state.profile.targetLevel} onNavigate={goLearning}/>
        : route.page === 'practice' ? <PracticeHub study={data} route={route} targetLevel={preparation.state.profile.targetLevel} onNavigate={go}/>
        : ['parts','exams'].includes(route.page) ? <Suspense fallback={<p role="status">Đang mở kho bài luyện…</p>}><PracticeCatalog key={route.page} route={route} study={data} onStart={start} onResume={id=>{const saved=data.sessions.find(s=>s.id===id);go({session:id,attempt:undefined,version:saved?resolveExam(saved)?.version??route.version:route.version});}} onNavigate={go}/></Suspense>
        : route.page === 'review' ? <WeaknessWorkspace attempts={data.attempts} data={preparation.state} commit={preparation.commit} onPractice={practiceExam} onNavigate={goLearning}/>
        : route.page === 'settings' ? <ProfileSettings data={preparation.state} commit={preparation.commit} onNavigate={goLearning}/>
        : route.page === 'diagnostic' ? <Suspense fallback={<p role="status">Đang mở bài khởi động…</p>}><Diagnostic data={preparation.state} commit={preparation.commit} onNavigate={goLearning}/></Suspense>
        : route.page === 'writing'||route.page === 'speaking' ? <Suspense fallback={<p role="status">Đang mở bài luyện…</p>}><ResponseCenter mode={route.page} data={preparation.state} commit={preparation.commit}/></Suspense>
        : route.page === 'preview' ? <Suspense fallback={<p role="status">Đang mở HSK 1 Preview…</p>}><PreviewWorkspace/></Suspense>
        : route.page === 'content-review' ? <Suspense fallback={<p>Đang mở hàng đợi…</p>}><ContentReviewV5/></Suspense>
        : route.page === 'admin' ? <Suspense fallback={<p role="status">Đang mở quản trị…</p>}><AdminWorkspace/></Suspense>
        : ['vocab','grammar','hanzi'].includes(route.page) ? <Suspense fallback={<p role="status">Đang mở bộ học…</p>}><CourseWorkspace key={route.page + route.level} mode={route.page as 'vocab'|'grammar'|'hanzi'} initialLevel={route.level.replace('HSK ', '')} data={preparation.state} commit={preparation.commit} onPractice={practiceExam} onPersonal={()=>goPage('personal')}/></Suspense>
        : route.page === 'personal' ? <VocabularyWorkspace entries={data.wordEntries}
            onAdd={(entries) => commit((previous) => ({ ...previous, wordEntries: [...entries, ...previous.wordEntries].slice(0, 20000) }))}
            onGrade={(entry, quality) => commit((previous) => ({ ...previous, wordEntries: previous.wordEntries.map((item) => item.id === entry.id ? scheduleSm2(item, quality) : item) }))}
            onDelete={(id) => commit((previous) => ({ ...previous, wordEntries: previous.wordEntries.filter((entry) => entry.id !== id) }))}
            onUpdate={(entry) => commit((previous) => ({ ...previous, wordEntries: previous.wordEntries.map((item) => item.id === entry.id ? entry : item) }))} />
        : <><header className={route.page === 'exams' || route.page === 'parts' ? 'portal-catalog-heading' : 'page-heading'}>{(route.page === 'exams' || route.page === 'parts') && <span className="portal-icon-tile mint"><PortalIcon name="exam"/></span>}<div><h1>{title}</h1>{route.page === 'exams' && <p>Chọn phiên bản, cấp độ và nhịp luyện của bạn. Bài làm được tự động lưu trên thiết bị.</p>}{route.page === 'parts' && <p>Chọn một phần từ ngân hàng câu hỏi minh họa. Các bài tổng hợp và từng phần dùng chung câu hỏi.</p>}</div></header>
          {route.page !== 'info' && filters}
          {(route.page === 'exams' || route.page === 'parts') && <><div className="filter-tabs catalog-tabs"><button className={'btn ' + (route.page === 'exams' ? 'btn-primary' : 'btn-secondary')} onClick={() => goPage('exams')}>Đề đầy đủ</button><button className={'btn ' + (route.page === 'parts' ? 'btn-primary' : 'btn-secondary')} onClick={() => goPage('parts')}>Luyện từng phần</button></div>
            {resumes.length > 0 && <section className="resume-section card"><h2>Tiếp tục bài đang làm</h2>{resumes.map(({ saved, exam }) => <div className="resume-row" key={saved.id}><div><strong>{exam.title}</strong><small>{VERSION_LABEL[exam.version]} · {exam.levelCode} · Câu {saved.currentIndex + 1}/{exam.questions.length}{saved.mode === 'timed' ? ' · có giờ' : ''}</small></div><button className="btn btn-primary" onClick={() => go({ session: saved.id, attempt: undefined })}>Làm tiếp</button></div>)}</section>}
            {route.page === 'exams' ? FULL_EXAMS.filter(matches).length ? <div className="focused-card-grid">{FULL_EXAMS.filter(matches).map(card)}</div> : <section className="card catalog-empty"><h2>Chưa có đề đầy đủ cho lựa chọn này</h2><p>Bạn có thể luyện các câu minh họa theo từng phần.</p><button className="btn btn-primary" onClick={() => goPage('parts')}>Chuyển sang luyện từng phần</button></section>
              : <><details className="advanced-filters"><summary>Bộ lọc nâng cao</summary><label>Dạng câu hỏi<select aria-label="Dạng câu hỏi" value={route.type} onChange={(event) => go({ type: event.target.value })}><option value="all">Tất cả dạng câu</option>{Object.entries(TYPE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></details>{partList.length ? <div className="focused-card-grid">{partList.map(card)}</div> : <section className="card catalog-empty"><h2>Chưa có bài luyện phù hợp</h2><p>Các câu chưa được xác minh cấp độ được giữ trong mục “Chưa xác minh”.</p><button className="btn btn-secondary" onClick={() => go({ level: 'all', section: 'all', type: 'all' })}>Đặt lại bộ lọc</button></section>}</>}
          </>}
          {route.page==='exams'&&<section className="mini-exam-catalog"><header className="page-heading"><h2>Mini test minh họa</h2><p>Có giờ tùy chỉnh, dùng lại câu trong ngân hàng hiện có; không phải đề đầy đủ hoặc cấu trúc HSK 2025 đã kiểm định.</p></header><div className="focused-card-grid">{QUESTION_BANKS.filter(matches).map(bank=>card({...bank,id:'mini:'+bank.id,title:'Mini test · '+bank.levelCode,mode:'mini',modeLabel:'Mini test',durationKind:'custom',config:undefined}))}</div></section>}
          {route.page === 'history' && <section className="history-list">{!filteredAttempts.length && <p className="card catalog-empty">Chưa có lượt làm phù hợp.</p>}{filteredAttempts.map(({ item, exam }) => { const summary = summarizeAttempt(exam, item); return <article className="card history-row" key={item.id}><div><h2>{exam.title}</h2><p>{VERSION_LABEL[exam.version]} · {exam.levelCode} · {new Date(item.finishedAt).toLocaleString('vi-VN')}</p><small>{Math.floor(item.durationSeconds / 60)} phút {item.durationSeconds % 60} giây · {summary.correctCount}/{summary.objectiveQuestionCount} câu chấm được đúng{summary.ungradedCount ? ` · ${summary.ungradedCount} câu chưa chấm` : ''}</small></div><div className="history-actions"><button className="btn btn-primary" onClick={() => go({ attempt: item.id })}>Xem kết quả</button><button className="btn btn-secondary" onClick={() => start(exam, item.mode, true)}>Làm lại</button><button className="btn btn-ghost" onClick={() => { if (window.confirm('Xóa lượt làm này khỏi lịch sử?')) commit((previous) => ({ ...previous, attempts: previous.attempts.filter((attempt) => attempt.id !== item.id) })); }}>Xóa lượt</button></div></article>; })}</section>}
          {route.page === 'mistakes' && <><div className="filter-tabs">{[['incorrect', 'Câu sai'], ['unanswered', 'Câu bỏ trống'], ['flagged', 'Đánh dấu']].map(([value, label]) => <button key={value} className={'btn ' + (reviewReason === value ? 'btn-primary' : 'btn-secondary')} onClick={() => go({ type: value })}>{label}</button>)}</div><p className="saved-hint">Mỗi câu chỉ lưu một lần trong phiên bản đang chọn.</p>{!reviews.length && <section className="card catalog-empty">Chưa có câu {reviewReason === 'incorrect' ? 'sai' : reviewReason === 'unanswered' ? 'bỏ trống' : 'đánh dấu'} phù hợp.</section>}
            {Array.from(new Map(reviews.map(entry=>[entry.exam.id,entry.exam])).values()).map((bank) => { const items = reviews.filter((entry) => entry.exam.id === bank.id); if (!items.length) return null;
              return <section className="card review-bank" key={bank.id}><div className="review-bank-heading"><h2>{VERSION_LABEL[bank.version]} · {bank.levelCode}</h2><button className="btn btn-primary" onClick={() => start(reviewExam(bank, items.map((entry) => entry.question.id)), 'practice', true)}>Luyện {items.length} câu</button></div>{items.map(({ item, question }) => <article className="review-queue-row" key={item.id}><div><strong>{SKILL_LABELS[question.skill]} · Câu {question.number}</strong><p>{question.skill === 'listening' ? 'Câu nghe minh họa' : question.promptZh}</p></div><div className="dialog-actions"><button className="btn btn-secondary" onClick={() => start(reviewExam(bank, [question.id]), 'practice', true)}>Luyện câu</button><button className="btn btn-ghost" aria-expanded={solutionId === question.id} onClick={() => setSolutionId(solutionId === question.id ? null : question.id)}>Xem lời giải</button></div>{solutionId === question.id && <QuestionSolution question={question} />}</article>)}</section>;
            })}</>}
          {route.page === 'info' && <div className="exam-information"><section className="card"><h2>Nội dung hiện có</h2><p>Catalog syllabus 2025: 11.000 mục từ, 576 cấu trúc và 3.088 Hán tự. Từ/cấp đối chiếu CTI; nghĩa Việt tham khảo từ từ điển cộng đồng. Đã bổ sung 132 bài ngữ pháp có giải thích và ví dụ; 576 cấu trúc vẫn được giữ trong mục lục, chưa phải giáo trình Việt đầy đủ.</p><p>Thư viện học có thêm 739 nghĩa Việt ngắn, ví dụ kèm audio cho 4.608 mục từ, 10 cặp pinyin, 50 bài bộ thủ và 99 mẫu nét bổ sung. Luyện kỹ năng có 14 đoạn đọc với 42 câu để tự đối chiếu và 14 đề viết lưu bản nháp. Nội dung bổ sung có AI hỗ trợ, chưa duyệt độc lập; cấp đọc/viết là ước lượng luyện nội bộ.</p><a href="/data/learning/ATTRIBUTION.md" target="_blank" rel="noreferrer">Nguồn học liệu bổ sung ↗</a><a href="/THIRD_PARTY_NOTICES.md" target="_blank" rel="noreferrer">Attribution và giấy phép dữ liệu ↗</a><p>Giữ các câu minh họa và kho HSK 1–2 cũ, bổ sung bài tập nghe/đọc HSK 1–6 từ no7z (CC BY-SA 4.0), ôn từ 7–9 từ HearMandarin (CC BY 4.0) và kho Mandarin Zone HSK 4 (CC BY-NC-SA 4.0). Số lượng thực tế, phiên bản và nguồn được hiển thị tại kho bài. Bài theo GF0025-2021 được tách nhãn với syllabus 2025; không phải đề chính thức.</p><p>Audio no7z đã lưu cục bộ, có tệp bình thường/chậm, là giọng tổng hợp CosyVoice2; audio kho AI cũ dùng giọng máy. Audio Mandarin Zone được lưu đệm trên máy sau lần tải đầu. Thời gian bài luyện do website đặt. Đáp án từ nguồn chưa được thẩm định độc lập, lời giải có thể bằng tiếng Anh. Chưa có đề đầy đủ đủ điều kiện phát hành.</p><a href="https://www.chinesetest.cn/syllabus" target="_blank" rel="noreferrer">Đề cương và mẫu chính thức HSK ↗</a></section>{[['Nguồn CTI', sourceDocument], ['Khảo sát 15 repository', referenceDocument], ['Giấy phép nội dung', licenseDocument], ['Quy tắc biên soạn', policyDocument]].map(([name, document]) => <details className="card" key={name}><summary>{name}</summary><pre>{document}</pre></details>)}</div>}
        </>}
    </main>
    {preparation.error&&<p className="app-status-banner storage-error" role="alert">Không lưu được kế hoạch. Hãy xuất bản sao dữ liệu và kiểm tra dung lượng trình duyệt.</p>}
    {!session && <><footer className="focused-footer focused-container"><span>Luyện thi HSK · lưu bài trên thiết bị</span><a href={routeUrl({ ...route, page: 'info', session: undefined, attempt: undefined })} onClick={(event) => { event.preventDefault(); goPage('info'); }}>Thông tin đề và nguồn</a><button className="btn btn-ghost" onClick={()=>goPage('settings')}>Mục tiêu và thiết lập</button></footer><nav className="mobile-bottom-nav" aria-label="Điều hướng điện thoại">{MOBILE_NAV.map(([page,label],i)=><a key={page} href={routeUrl({...route,page,session:undefined,attempt:undefined})} aria-current={activeNav===page?'page':undefined} onClick={e=>{e.preventDefault();goPage(page);}}><span aria-hidden="true">{['⌂','✓','▤','↻','人'][i]}</span>{label}</a>)}</nav></>}
    {preflight && <div className="exam-dialog-overlay"><section data-exam-intro className="exam-dialog card" role="dialog" aria-modal="true" aria-labelledby="exam-intro-title"><p className="eyebrow">{VERSION_LABEL[preflight.exam.version]} · {preflight.exam.levelCode}</p><h2 id="exam-intro-title">{preflight.exam.title}</h2><p>{preflight.exam.questions.length} câu · {[...new Set(preflight.exam.questions.map(q=>SKILL_LABELS[q.skill]))].join(' · ')} · {preflight.mode==='timed'?preflight.exam.durationMinutes+' phút tùy chỉnh':'Không giới hạn thời gian'}</p><p>Đáp án tự lưu khi chuyển câu. {preflight.mode==='timed'?'Đồng hồ bắt đầu sau khi xác nhận. Hết giờ bài sẽ tự nộp.':'Kiểm tra lời giải sau mỗi câu hoặc nộp bài để xem kết quả.'}</p><small>{preflight.exam.contentLabel}</small>
      {preflight.mode==='timed'&&preflight.exam.questions.some(q=>q.skill==='listening')&&<><h3>Kiểm tra âm thanh</h3><ExamAudio text="你好，欢迎参加汉语练习。" src={preflightSource} rules={{ ...getExamConfig(preflight.exam).audio, maxPlays: null }} onSuccess={() => setSoundPassed(true)} onError={() => { setSoundPassed(false); setHeardSound(false); }} /><label className="sound-confirm"><input type="checkbox" checked={heardSound} disabled={!soundPassed} onChange={(event) => setHeardSound(event.target.checked)} /> Tôi đã nghe rõ âm thanh kiểm tra</label></>}
      <div className="dialog-actions"><button className="btn btn-secondary" onClick={() => setPreflight(null)}>Quay lại</button><button className="btn btn-primary" disabled={preflight.mode==='timed'&&preflight.exam.questions.some(q=>q.skill==='listening')&&!heardSound} onClick={() => begin(preflight.exam, preflight.mode)}>{preflight.mode==='timed'?'Bắt đầu tính giờ':'Bắt đầu luyện'}</button></div>{preflight.mode==='timed'&&<button className="btn btn-ghost" onClick={() => begin(preflight.exam, 'practice')}>Chuyển sang luyện không giờ</button>}</section></div>}

  </div>;
}
