import { useState } from 'react';
import { CompletedAttempt, PersonalVocabularyEntry } from '../../services/studyStorage';
import { ExamPage } from '../../services/examRoute';
import { resolveExam } from '../../data/examCatalog';
import { summarizeBySkill, summarizeAttempt } from '../../services/examScoring';

interface Props {
  attempts: CompletedAttempt[];
  words: PersonalVocabularyEntry[];
  onNavigate: (page: ExamPage) => void;
  onOpenAttempt: (attemptId: string) => void;
}

function localDayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function roundedMinutes(seconds: number): number {
  return Math.round(seconds / 6) / 10;
}

export function StudyDashboard({ attempts, words, onNavigate, onOpenAttempt }: Props) {
  const [range,setRange]=useState<7|14>(7),[metric,setMetric]=useState<'minutes'|'count'>('minutes');
  const [selectedDay,setSelectedDay]=useState(()=>localDayKey(new Date()));
  const resolved = attempts.flatMap((attempt) => {
    const exam = resolveExam(attempt);
    return exam ? [{ attempt, exam, summary: summarizeAttempt(exam, attempt) }] : [];
  });
  const objectiveCount = resolved.reduce((sum, row) => sum + row.summary.objectiveQuestionCount, 0);
  const correctCount = resolved.reduce((sum, row) => sum + row.summary.correctCount, 0);
  const accuracy = objectiveCount ? Math.round((correctCount / objectiveCount) * 100) : null;
  const minutes = roundedMinutes(resolved.reduce((sum, row) => sum + row.attempt.durationSeconds, 0));
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: range }, (_, index) => {
    const date = new Date(today); date.setDate(today.getDate() - (range - 1 - index));
    const dayAttempts = resolved.filter((row) => localDayKey(new Date(row.attempt.finishedAt)) === localDayKey(date));
    return { date, count: dayAttempts.length, minutes: roundedMinutes(dayAttempts.reduce((sum, row) => sum + row.attempt.durationSeconds, 0)) };
  });
  const peak = Math.max(1, ...days.map(day=>day[metric]));
  const activeDay=days.find(day=>localDayKey(day.date)===selectedDay)??days[days.length-1];
  const skillMap = new Map<string, { label: string; correct: number; total: number }>();
  resolved.forEach(({ exam, attempt }) => summarizeBySkill(exam, attempt).forEach((skill) => {
    const existing = skillMap.get(skill.skill) ?? { label: skill.label, correct: 0, total: 0 };
    existing.correct += skill.correct; existing.total += skill.objectiveCount; skillMap.set(skill.skill, existing);
  }));
  const skills = Array.from(skillMap.values()).filter((item) => item.total).sort((a, b) => a.correct / a.total - b.correct / b.total);
  const latest = resolved.slice(0, 5);
  const dueCount = words.filter((word) => Date.parse(word.dueAt) <= Date.now()).length;

  return <section className="dashboard-workspace" aria-labelledby="dashboard-title">
    <header className="page-heading"><h1 id="dashboard-title">Tổng quan học tập</h1><p>Số liệu được tính từ bài đã nộp và bộ từ đang lưu trên thiết bị này.</p></header>
    <div className="dashboard-summary-grid">
      <article className="card"><span>Lượt làm bài</span><strong>{resolved.length}</strong><small>lịch sử còn trên thiết bị</small></article>
      <article className="card"><span>Độ chính xác</span><strong>{accuracy === null ? '—' : `${accuracy}%`}</strong><small>{correctCount}/{objectiveCount} câu khách quan · không quy đổi điểm HSK</small></article>
      <article className="card"><span>Thời gian luyện</span><strong>{minutes}</strong><small>phút cộng dồn từ lượt đã nộp</small></article>
      <article className="card"><span>Từ đến hạn</span><strong>{dueCount}</strong><small>{words.length} từ cá nhân</small></article>
    </div>
    <div className="dashboard-panels">
      <section className="card dashboard-activity"><div className="dashboard-section-heading"><div><h2>{range} ngày gần đây</h2><p>Chọn một ngày để xem bài đã nộp. Thời gian lấy từ lượt làm đã lưu.</p></div></div>
        <div className="dashboard-chart-controls"><div role="group" aria-label="Khoảng thời gian">{([7,14] as const).map(n=><button key={n} aria-pressed={range===n} onClick={()=>setRange(n)}>{n} ngày</button>)}</div><div role="group" aria-label="Đơn vị biểu đồ"><button aria-pressed={metric==='minutes'} onClick={()=>setMetric('minutes')}>Phút học</button><button aria-pressed={metric==='count'} onClick={()=>setMetric('count')}>Lượt làm</button></div></div>
        <div className="dashboard-chart-scroll"><div className="dashboard-bars interactive-bars" data-range={range} style={{gridTemplateColumns:`repeat(${range},minmax(0,1fr))`}} role="group" aria-label={(metric==='minutes'?'Phút học':'Lượt làm')+' mỗi ngày'}>{days.map(day=><button className="dashboard-bar-column" key={localDayKey(day.date)} aria-pressed={localDayKey(activeDay.date)===localDayKey(day.date)} aria-label={`${day.date.toLocaleDateString('vi-VN')}: ${day.minutes} phút, ${day.count} lượt`} onClick={()=>setSelectedDay(localDayKey(day.date))}><span>{day[metric]||'·'}</span><span className="dashboard-bar-track"><i key={metric} style={{height:`${day[metric]?Math.max(5,day[metric]/peak*100):0}%`}}/></span><small>{day.date.toLocaleDateString('vi-VN',{day:'numeric',month:'numeric'})}</small></button>)}</div></div>
        <div key={localDayKey(activeDay.date)} className="dashboard-day-detail" role="status"><strong>{activeDay.date.toLocaleDateString('vi-VN',{weekday:'long',day:'numeric',month:'long'})}</strong><span>{activeDay.count} lượt làm · {activeDay.minutes} phút đã lưu</span></div>
        {days.every(day=>!day.count)&&<p className="dashboard-empty-hint">Chưa có bài đã nộp trong {range} ngày này. Hoàn thành một bài luyện để biểu đồ bắt đầu ghi nhận.</p>}
      </section>
      <section className="card dashboard-skills"><div className="dashboard-section-heading"><div><h2>Theo kỹ năng</h2><p>Gộp câu khách quan từ các lượt đã nộp.</p></div></div>
        {skills.length ? <div className="dashboard-skill-list">{skills.map((skill) => { const percent = Math.round(skill.correct / skill.total * 100); return <div className="dashboard-skill-row" key={skill.label}><div><strong>{skill.label}</strong><span>{percent}% · {skill.correct}/{skill.total}</span></div><div className="dashboard-skill-track"><i style={{ width: `${percent}%` }} /></div></div>; })}</div> : <p className="dashboard-empty-hint">Cần có lượt làm bài được chấm khách quan để hiện thống kê.</p>}
      </section>
    </div>
    <section className="card dashboard-recent"><div className="dashboard-section-heading"><div><h2>Bài đã nộp gần đây</h2><p>Kết quả mở lại từ bản ghi hiện có trên thiết bị.</p></div></div>
      {latest.length ? <div className="dashboard-recent-list">{latest.map(({ attempt, exam, summary }) => <article className="dashboard-recent-row" key={attempt.id}><div><strong>{exam.title}</strong><small>{exam.version === 'hsk2' ? 'HSK 2.0' : 'HSK 3.0 demo'} · {exam.levelCode} · {new Date(attempt.finishedAt).toLocaleDateString('vi-VN')}</small></div><div className="dashboard-recent-score">{summary.accuracyPercent === null ? 'Tự đánh giá' : `${summary.accuracyPercent}%`}</div><button className="btn btn-secondary" onClick={() => onOpenAttempt(attempt.id)}>Xem kết quả</button></article>)}</div> : <div className="dashboard-empty"><p>Chưa có lượt làm bài nào trong lịch sử hiện tại.</p><button className="btn btn-primary" onClick={() => onNavigate('parts')}>Bắt đầu luyện tập</button></div>}
    </section>
    <div className="dashboard-actions"><button className="btn btn-secondary" onClick={() => onNavigate('vocab')}>Mở bộ từ cá nhân</button><button className="btn btn-secondary" onClick={() => onNavigate('exams')}>Xem đề thi</button></div>
  </section>;
}
