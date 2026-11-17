import type {ExamItem} from '../../types';
import type {CompletedAttempt} from '../../services/studyStorage';
import {analyzeTiming} from '../../services/resultAnalytics';
import {analyzeDimensions} from '../../services/weaknessDimensions';
export function ResultInsights({exam,attempt}:{exam:ExamItem;attempt:CompletedAttempt}){
 const timing=analyzeTiming(exam,attempt);const dimensions=analyzeDimensions([attempt]);
 return <section className="card timing-insights"><h2>Thời gian và nội dung cần củng cố</h2>{timing.sufficient?<><p>Đo thời gian hoạt động trên màn hình: {timing.measured} câu · {timing.activeSeconds} giây. Không tính lúc tab bị ẩn hoặc tạm dừng do lỗi audio.</p><h3>Câu dành nhiều thời gian nhất</h3><ul>{timing.slowest.map(r=><li key={r.id}>Câu {r.number}: {r.seconds} giây · đổi đáp án {r.changes} lần · đánh dấu {r.flags} lần</li>)}</ul>{timing.sections.map(s=><p key={s.skill}>{s.skill}: {s.averageSeconds===null?'Chưa đủ 3 mẫu':s.averageSeconds+' giây/câu'} ({s.count} câu đo được)</p>)}{timing.timeoutUnanswered!==null&&<p>{timing.timeoutUnanswered} câu còn trống khi đồng hồ hết giờ.</p>}</>:<p>Chưa đủ 3 câu có dữ liệu thời gian riêng để phân tích. Lượt làm cũ vẫn được giữ nguyên.</p>}<div className="result-dimensions">{['grammar','topic','vocabulary'].map(d=>{const rows=dimensions.filter(r=>r.dimension===d).slice(0,3);return <div key={d}><h3>{d==='grammar'?'Ngữ pháp':d==='topic'?'Chủ đề':'Từ vựng'}</h3>{rows.length?rows.map(r=><p key={r.id}>{r.label}: {r.wrong}/{r.total} câu cần ôn</p>):<p>Chưa đủ mẫu có nhãn để kết luận.</p>}</div>;})}</div></section>;
}
