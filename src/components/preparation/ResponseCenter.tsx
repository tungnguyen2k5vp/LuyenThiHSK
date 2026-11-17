import {useEffect,useRef,useState} from 'react';
import {QUESTION_BANKS} from '../../data/examCatalog';
import type {ExamQuestion} from '../../types';
import type {PreparationData} from '../../services/preparationStorage';
import {learningEvent} from '../../services/preparationStorage';
import {browserSpeechProvider,readRecording,saveRecording} from '../../services/speechProvider';
import type {SpeechRecording} from '../../services/speechProvider';
import {fetchData} from '../../services/curriculum';
import '../../styles/learning-supplement.css';

export function ResponseCenter({mode,data,commit}:{mode:'writing'|'speaking';data:PreparationData;commit:(update:(p:PreparationData)=>PreparationData)=>void}){
 const [extra,setExtra]=useState<ExamQuestion[]>([]),[error,setError]=useState(''),[retry,setRetry]=useState(0),[level,setLevel]=useState(data.profile.targetLevel),[id,setId]=useState(''),[url,setUrl]=useState(''),[recording,setRecording]=useState(false),[notice,setNotice]=useState('');
 const recordingRef=useRef<SpeechRecording|null>(null);
 useEffect(()=>{let live=true;setError('');fetchData<ExamQuestion[]>('/data/learning/responses.json').then(d=>{if(live)setExtra(d);}).catch(e=>{if(live)setError(e.message);});return()=>{live=false;};},[retry]);
 const prompts=[...QUESTION_BANKS.flatMap(b=>b.questions),...extra].filter(q=>mode==='writing'?q.skill==='writing'||q.skill==='translation':q.skill==='speaking');
 const filtered=prompts.filter(q=>level==='all'||q.hskLevel===level);
 const selected=filtered.find(q=>q.id===id);
 const first=filtered[0]?.id??'';
 useEffect(()=>{if(!filtered.some(q=>q.id===id))setId(first);},[mode,level,first,id]);
 const draft=data.writing[id]??{text:'',updatedAt:'',ratings:[]};
 const rubric=selected?.rubric??['Nội dung đầy đủ','Dùng từ phù hợp','Cấu trúc câu rõ ràng'];
 const hanziCount=Array.from(draft.text).filter(c=>/\p{Script=Han}/u.test(c)).length;
 useEffect(()=>{let live=true;setUrl('');if(mode==='speaking')readRecording(id).then(blob=>{if(live)setUrl(blob?URL.createObjectURL(blob):'');}).catch(()=>{});return()=>{live=false;recordingRef.current?.cancel();};},[mode,id]);
 useEffect(()=>()=>{if(url)URL.revokeObjectURL(url);},[url]);
 const start=async()=>{setNotice('');try{const handle=await browserSpeechProvider.start();recordingRef.current=handle;setRecording(true);const blob=await handle.result;setRecording(false);setUrl(URL.createObjectURL(blob));try{await saveRecording(id,blob);setNotice('Đã lưu bản ghi trên thiết bị.');}catch{setNotice('Có thể nghe lại bản ghi hiện tại; chưa lưu được vào thiết bị.');}}catch(e){setRecording(false);setNotice((e as Error).message);}};
 const update=(text:string,ratings=draft.ratings)=>commit(p=>({...p,writing:{...p.writing,[id]:{text,ratings,updatedAt:new Date().toISOString()}}}));
 return <section className="response-workspace"><header className="page-heading"><p className="eyebrow">LUYỆN DIỄN ĐẠT</p><h1>Trung tâm luyện {mode==='writing'?'viết':'nói'}</h1><p>{mode==='writing'?'Chọn tình huống, viết bản nháp rồi tự đối chiếu từng tiêu chí. Bản nháp được giữ trên thiết bị để bạn quay lại sửa.':'Ghi âm tối đa 2 phút, nghe lại và tự nhận xét. Ghi âm không phụ thuộc dịch vụ AI.'}</p></header>
  {error&&<p role="alert">{error} Các bài có sẵn vẫn được giữ. <button className="btn btn-secondary" onClick={()=>setRetry(n=>n+1)}>Thử tải lại</button></p>}
  <section className="card"><div className="response-prompt-heading"><label>Cấp luyện<select aria-label="Cấp luyện diễn đạt" value={level} disabled={recording} onChange={e=>{setLevel(e.target.value);setNotice('');}}><option value="all">Tất cả cấp và bài cũ</option>{['1','2','3','4','5','6','7-9'].map(l=><option key={l} value={l}>HSK {l}</option>)}</select></label><label>Chọn bài luyện<select aria-label="Chọn bài phản hồi" value={selected?.id??''} disabled={recording||!filtered.length} onChange={e=>{setId(e.target.value);setNotice('');}}>{!filtered.length&&<option value="">Chưa có bài ở cấp này</option>}{filtered.map(p=><option value={p.id} key={p.id}>{p.hskLevel?'HSK '+p.hskLevel+' · ':''}{p.topic??p.type}</option>)}</select></label></div>
   {!filtered.length&&<p>Chưa có bài phù hợp. <button className="btn btn-secondary" onClick={()=>setLevel('all')}>Xem tất cả bài đã có</button></p>}
   {selected&&<><p className="eyebrow">BÀI THAM KHẢO · {selected.hskLevel?'CẤP ƯỚC LƯỢNG NỘI BỘ':'CẤP CHƯA KIỂM ĐỊNH'}</p><h2 lang="zh-CN">{selected.promptZh}</h2><p>{selected.instruction}</p>{selected.responseHint&&<p>{selected.responseHint}</p>}
    {mode==='speaking'&&<div className="speech-controls"><button className="btn btn-primary" disabled={recording} onClick={()=>void start()}>Bắt đầu ghi âm</button><button className="btn btn-secondary" disabled={!recording} onClick={()=>recordingRef.current?.stop()}>Dừng ghi</button>{recording&&<p role="status">Đang ghi âm…</p>}{url&&<audio controls src={url}/>}<small>Chưa cấu hình nhận dạng giọng nói; bạn có thể nhập lại nội dung bên dưới.</small></div>}
    <label>{mode==='writing'?'Bản nháp tiếng Trung':'Bản chép lời / ghi chú'}<textarea aria-label="Bản nháp câu trả lời" lang="zh-CN" value={draft.text} maxLength={4000} spellCheck={false} onChange={e=>update(e.target.value)}/></label><p className="writing-save-status" role="status">{hanziCount} chữ Hán · {Array.from(draft.text).length}/4000 ký tự · {draft.updatedAt?'Đã lưu lúc '+new Date(draft.updatedAt).toLocaleTimeString('vi-VN'):'Tự lưu khi nhập'}</p>
    <section className="response-rubric"><h3>Tự đối chiếu</h3><p>Đánh dấu tiêu chí bạn đã đáp ứng, sửa bản nháp rồi đối chiếu lại. Đây là tự nhận xét, không phải chấm điểm tự động.</p>{rubric.map((text,i)=><label key={text}><input type="checkbox" checked={draft.ratings.includes(i)} onChange={()=>update(draft.text,draft.ratings.includes(i)?draft.ratings.filter(n=>n!==i):[...draft.ratings,i])}/>{text}</label>)}<p>{rubric.filter((_,i)=>draft.ratings.includes(i)).length}/{rubric.length} tiêu chí đã tự đối chiếu</p></section>
    <button className="btn btn-primary" disabled={!draft.text.trim()&&!url} onClick={()=>{commit(p=>({...p,events:[...p.events,learningEvent(mode,id)]}));setNotice('Đã lưu lượt luyện và tự đánh giá vào tiến độ. Đây không phải điểm HSK chính thức.');}}>Lưu lượt luyện và tự đánh giá</button>
    {selected.sampleAnswer&&<details><summary>Tham khảo câu trả lời tự biên soạn</summary><p lang="zh-CN">{selected.sampleAnswer}</p><p>Mẫu gợi ý cách triển khai, không phải đáp án duy nhất. Độ dài mẫu có thể ngắn hơn mục tiêu để minh họa cấu trúc.</p></details>}
    <details className="data-note"><summary>Nguồn và tình trạng duyệt</summary><p>{selected.provenance.source_name} · {selected.provenance.license}</p><p>Nội dung tham khảo có AI hỗ trợ, chưa duyệt ngôn ngữ độc lập. Không dùng làm rubric chấm thi chính thức.</p><a href={selected.provenance.source_url} target="_blank" rel="noreferrer">Xem nguồn</a></details>
   </>}
  </section>{notice&&<p role="status" className="vocab-notice">{notice}</p>}
 </section>;
}
