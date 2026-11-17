import { useEffect, useState } from 'react';
import { fetchData, useManifest } from '../../services/curriculum';
import { QUESTION_BANKS, resolveExam } from '../../data/examCatalog';
import type { StudyData } from '../../services/studyStorage';
import type { ExamRoute } from '../../services/examRoute';
import type { PracticeEntry } from '../../services/practiceCatalog';
import { entryFor, matchingQuestionCount, fetchPracticeManifest } from '../../services/practiceCatalog';
import {FoundationPractice} from '../learning/FoundationPractice';
import { recentSkillEvidence } from '../../services/studyPlan';
import { PortalIcon } from '../layout/HskNavigation';
import { PracticeScene } from '../learning/PracticeScene';
import { contentApiUrl, requestContentJson } from '../../services/localApi';
import type { ExamItem } from '../../types';
import { summarizeBySkill } from '../../services/examScoring';
const modules=[['vocab','字','Từ vựng','Học theo cấp, nghe cách đọc và ôn từ đến hạn.'],['grammar','文','Ngữ pháp','Tra cấu trúc theo syllabus và lưu tiến độ ôn.'],['hanzi','永','Hán tự','Xem nét chữ và luyện viết trên bảng.']];
export function LearnHub({level,onNavigate}:{level:string;onNavigate:(page:string,skill?:string)=>void}){
  const {manifest}=useManifest();const [topics,setTopics]=useState<{title:string;level:string}[]>([]);const [tasks,setTasks]=useState<{title:string;level:string}[]>([]);
  useEffect(()=>{let live=true;fetchData<{topics:typeof topics;tasks:typeof tasks}>('/data/syllabus-topics-tasks.json').then(d=>{if(live){setTopics(d.topics);setTasks(d.tasks);}}).catch(()=>{});return()=>{live=false;};},[]);
  return <section><header className="page-heading"><p className="eyebrow">HSK {level} · SYLLABUS 2025</p><h1>Học cho kỳ thi của bạn</h1><p>Bắt đầu từ từ vựng, cấu trúc và chữ Hán trong cùng một phiên bản syllabus.</p></header><div className="learning-module-grid">{modules.map(([page,icon,title,text])=><button className="card learning-module" key={page} onClick={()=>onNavigate(page)}><span className="skill-symbol">{icon}</span><h2>{title}</h2><p>{text}</p><strong>Mở bộ học →</strong></button>)}</div><FoundationPractice/><section className="card syllabus-overview"><h2>Chủ đề và nhiệm vụ · HSK {level}</h2><p>Các tên mục đối chiếu syllabus CTI. Đọc mô tả đầy đủ tại nguồn chính thức.</p><div className="syllabus-columns"><div><h3>Chủ đề</h3><ul>{topics.filter(t=>t.level===level||level==='7-9'&&t.level==='7').map(t=><li key={t.title}>{t.title}</li>)}</ul></div><div><h3>Nhiệm vụ giao tiếp</h3><ul>{tasks.filter(t=>t.level===level||level==='7-9'&&t.level==='7').map(t=><li key={t.title}>{t.title}</li>)}</ul></div></div><a href={manifest?.sources[0]?.url??'https://www.chinesetest.cn/syllabus'} target="_blank" rel="noreferrer">Đọc syllabus CTI ↗</a></section></section>;
}
﻿export function PracticeHub({study,route,targetLevel,onNavigate}:{study:StudyData;route:ExamRoute;targetLevel:string;onNavigate:(route:Partial<ExamRoute>)=>void}){
  const [entries,setEntries]=useState<PracticeEntry[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[retry,setRetry]=useState(0);
  useEffect(()=>{let live=true;setLoading(true);setError('');void Promise.allSettled([fetchPracticeManifest(),requestContentJson(contentApiUrl('learner/catalog'))]).then(([open,personal])=>{
    if(!live)return;
    if(open.status==='fulfilled'){
      const banks:ExamItem[]=personal.status==='fulfilled'&&Array.isArray(personal.value.banks)?personal.value.banks:[];
      setEntries(open.value.sets.flatMap(e=>{if(!e.local&&e.url)return[e];const bank=(e.local?banks:QUESTION_BANKS).find(b=>b.id===e.id);if(!bank)return[];const excluded=new Set(e.excludedQuestionIds),questions=bank.questions.filter(q=>!excluded.has(q.id));return questions.length?[{...e,...entryFor({...bank,questions,totalQuestions:questions.length})}]:[];}));
      if(personal.status==='rejected')setError('Kho cá nhân chưa kết nối. Các bộ dữ liệu mở vẫn dùng được.');
    }else{setEntries(QUESTION_BANKS.map(entryFor));setError('Chưa tải được danh mục mở rộng; đang hiển thị kho sẵn có.');}
    setLoading(false);
  });return()=>{live=false;};},[retry]);
  const level=route.level==='all'?'HSK '+targetLevel:route.level;
  const matching=entries.filter(e=>e.levelCode===level&&e.version===route.version);
  const stats=study.attempts.flatMap(a=>{const exam=resolveExam(a);return exam&&exam.levelCode===level&&exam.version===route.version?summarizeBySkill(exam,a):[];});
  const evidence=recentSkillEvidence(study.attempts.filter(a=>{const exam=resolveExam(a);return exam?.levelCode===level&&exam.version===route.version;}));
  const weak=evidence.listening.answered>=5&&evidence.reading.answered>=5?(evidence.listening.correct/evidence.listening.answered<evidence.reading.correct/evidence.reading.answered?'listening':'reading'):null;
  const cards=[
    {title:'Nghe hiểu',skill:'listening',type:'multiple-choice',icon:'headphones',color:'mint',text:'Nghe câu, chọn nghĩa phù hợp. Có audio thường và chậm ở các bộ hỗ trợ.'},
    {title:'Đọc hiểu',skill:'reading',type:'multiple-choice',icon:'book',color:'sky',text:'Đọc câu và chọn đáp án. Kiểm tra để xem đáp án cùng thông tin nguồn.'},
    {title:'Đọc theo đoạn',skill:'reading',type:'short-passage',icon:'book',color:'sky',text:'Đọc tình huống nhiều câu, tìm thông tin và suy luận. Bài mới có giải thích để tự đối chiếu, chưa tính điểm tự động.'},
    {title:'Chép chính tả',skill:'listening',type:'fill-blank',icon:'pen',color:'amber',text:'Nghe audio rồi gõ lại câu tiếng Trung. So sánh với transcript sau khi làm.'},
    {title:'Sắp xếp câu',skill:'reading',type:'sentence-order',icon:'path',color:'violet',text:'Nhìn các thành phần gợi ý, gõ lại câu hoàn chỉnh theo đúng trật tự.'},
  ] as const;
  const navigate=(update:Partial<ExamRoute>)=>onNavigate({level,section:'all',type:'all',session:undefined,attempt:undefined,...update});
  return <section className="journey-practice-hub"><header className="portal-page-heading"><div><p className="portal-eyebrow">LUYỆN TỪNG KỸ NĂNG</p><h1>Hôm nay, giỏi hơn một chút.</h1><p>Chọn cấp độ và dạng bài. Luyện từng câu hoặc thử sức với thời gian.</p></div><button className="portal-outline" onClick={()=>navigate({page:'exams'})}><PortalIcon name="exam"/> Luyện cả bộ →</button></header>
    <div className="journey-hub-filters"><div className="journey-version-tabs" role="group" aria-label="Phiên bản bài luyện">{(['hsk3','hsk2'] as const).map(version=><button key={version} aria-pressed={route.version===version} onClick={()=>navigate({version,level:version==='hsk2'&&level==='HSK 7-9'?'HSK 6':level})}>HSK {version==='hsk3'?'3.0':'2.0'}</button>)}</div><div className="journey-level-tabs" role="group" aria-label="Cấp độ luyện tập">{['1','2','3','4','5','6',...(route.version==='hsk3'?['7-9']:[])].map(l=><button key={l} aria-pressed={level==='HSK '+l} onClick={()=>navigate({level:'HSK '+l})}>HSK {l}</button>)}</div></div>
    {loading&&<p role="status">Đang tải các dạng luyện…</p>}{error&&<p role="alert">{error} <button className="btn btn-ghost" onClick={()=>setRetry(n=>n+1)}>Thử lại</button></p>}
    <div className="journey-hub-intro"><span className="portal-icon-tile mint"><PortalIcon name="sun"/></span><div><strong>{level} · Bắt đầu từ một bài 10 câu</strong><p>{weak?'7 ngày gần đây, '+(weak==='listening'?'nghe':'đọc')+' có tỷ lệ đúng thấp hơn. Bạn có thể ưu tiên kỹ năng này hôm nay.':'Chưa đủ bài làm để so sánh kỹ năng. Cứ chọn phần bạn muốn luyện trước.'}</p></div></div>
    <div className="journey-training-grid">{cards.map(card=>{const count=matching.reduce((n,e)=>n+matchingQuestionCount(e,card.skill,card.type),0),skillStats=stats.filter(s=>s.skill===card.skill),answered=skillStats.reduce((n,s)=>n+s.objectiveCount,0),correct=skillStats.reduce((n,s)=>n+s.correct,0);return <article className="journey-training-card" data-color={card.color} key={card.title}><div className="journey-training-top"><span className={'portal-icon-tile '+card.color}><PortalIcon name={card.icon}/></span><span>{loading?'Đang tải…':count.toLocaleString('vi-VN')+' câu có sẵn'}</span></div><PracticeScene kind={card.type==="short-passage"?"passage":card.icon}/><h2>{card.title}</h2><p>{card.text}</p><small>{answered?`${Math.round(correct/answered*100)}% đúng · ${answered} câu ${card.skill==='listening'?'nghe':'đọc'} chấm được trong lịch sử`:'Chưa có kết quả kỹ năng này'}</small><button className="portal-primary" disabled={loading||!count} onClick={()=>navigate({page:'parts',section:card.skill,type:card.type})}>{count?'Chọn bài luyện':'Chưa có dạng này ở cấp đã chọn'} <PortalIcon name="arrow"/></button></article>;})}</div>
    <div className="journey-response-grid">{[{page:'writing',icon:'pen',title:'Góc luyện viết',text:'Viết theo gợi ý, lưu bản nháp và tự đánh giá bằng rubric.'},{page:'speaking',icon:'mic',title:'Góc luyện nói',text:'Thu âm bài nói, nghe lại và ghi chú để lần sau tốt hơn.'}].map(c=><button className="journey-response-card" key={c.page} onClick={()=>navigate({page:c.page as ExamRoute['page']})}><span className="portal-icon-tile violet"><PortalIcon name={c.icon}/></span><div><h2>{c.title}</h2><p>{c.text}</p></div><span aria-hidden="true">→</span></button>)}</div>
    <section className="journey-foundation"><div><h2>Củng cố nền tảng trước khi luyện</h2><p>Học từ và cấu trúc rồi quay lại bài tập.</p></div><button className="portal-outline" onClick={()=>navigate({page:'vocab'})}>Từ vựng {level} →</button><button className="portal-outline" onClick={()=>navigate({page:'grammar'})}>Ngữ pháp →</button></section>
    <p className="journey-content-note">Bài bổ trợ dùng dữ liệu mở; đáp án chưa được duyệt độc lập từng câu. Kết quả thể hiện mức đúng trong bài, không quy đổi thành điểm thi HSK.</p>
  </section>;
}
