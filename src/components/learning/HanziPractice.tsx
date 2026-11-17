import { useEffect, useId, useRef, useState } from 'react';
import type { HanziEntry } from '../../types/curriculum';
import { fetchData } from '../../services/curriculum';
import { CompletionMark } from './CompletionMark';
type Point = { x: number; y: number };

export function HanziPractice({ entry, onDone }: { entry: HanziEntry; onDone: () => void }) {
  const [paths, setPaths] = useState<string[]>([]), [visible, setVisible] = useState(0), [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650), [ink, setInk] = useState<Point[][]>([]), [saved, setSaved] = useState(false), [error, setError] = useState('');
  const canvas = useRef<SVGSVGElement>(null), drawing = useRef(false), sliderId = useId();
  useEffect(() => {
    let live = true;
    setPaths([]); setInk([]); setVisible(0); setError(''); setPlaying(false); setSaved(false);
    if (entry.strokeUrl) fetchData<{ strokes: string[] }>(entry.strokeUrl).then(data => {
      if (!Array.isArray(data.strokes) || !data.strokes.length || !data.strokes.every(p => typeof p === 'string' && p.length)) throw Error('Dữ liệu nét chữ chưa hợp lệ.');
      if (live) { setPaths(data.strokes); setVisible(data.strokes.length); }
    }).catch(e => { if (live) setError(e.message); });
    return () => { live = false; };
  }, [entry]);
  useEffect(() => {
    if (!playing) return;
    if (visible >= paths.length) { setPlaying(false); return; }
    const timer = setTimeout(() => setVisible(n => n + 1), speed);
    return () => clearTimeout(timer);
  }, [playing, visible, paths.length, speed]);
  const seek = (n: number) => { setPlaying(false); setVisible(Math.max(0, Math.min(paths.length, n))); };
  const point = (e: React.PointerEvent) => {
    const rect = canvas.current!.getBoundingClientRect();
    return { x: Math.max(0, Math.min(300, (e.clientX - rect.left) / rect.width * 300)), y: Math.max(0, Math.min(300, (e.clientY - rect.top) / rect.height * 300)) };
  };
  return <div className="hanzi-practice rich-hanzi"><div className="hanzi-practice-panels"><div>
    <div className="stroke-heading"><h3>Khám phá từng nét</h3><output htmlFor={sliderId} aria-live="polite">Nét {visible}/{paths.length}</output></div>
    <svg viewBox="0 0 1024 1024" className="stroke-guide" role="img" aria-label={'Thứ tự nét của ' + entry.character + ', đang hiện ' + visible + '/' + paths.length + ' nét'}><path d="M0 512H1024M512 0V1024M0 0L1024 1024M1024 0L0 1024" stroke="#dce6eb" strokeDasharray="12 12"/><g transform="translate(0,900) scale(1,-1)">{paths.map((d, i) => <path key={i + '-' + (i === visible - 1)} className={i === visible - 1 ? 'stroke-is-active' : ''} d={d} fill={i === visible - 1 ? '#ba771f' : i < visible ? '#0b8d87' : '#e7edef'}/>)}</g></svg>
    <label className="stroke-scrubber" htmlFor={sliderId}>Kéo để xem thứ tự nét<input id={sliderId} type="range" min={0} max={paths.length} value={visible} disabled={!paths.length} onChange={e => seek(Number(e.target.value))}/></label>
    <div className="stroke-controls"><button className="btn btn-secondary" disabled={!visible} onClick={() => seek(visible - 1)}>← Nét trước</button><button className="btn btn-primary" disabled={!paths.length} aria-pressed={playing} onClick={() => { if (playing) setPlaying(false); else { if (visible >= paths.length) setVisible(0); setPlaying(true); } }}>{playing ? 'Tạm dừng' : visible === paths.length ? 'Phát lại từng nét' : 'Phát từng nét'}</button><button className="btn btn-secondary" disabled={visible >= paths.length} onClick={() => seek(visible + 1)}>Nét sau →</button></div>
    <label className="stroke-speed">Tốc độ xem<select value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value={1100}>Chậm</option><option value={650}>Vừa</option><option value={350}>Nhanh</option></select></label><p className="stroke-key"><span aria-hidden="true"/> Màu vàng: nét đang xem · xanh: nét trước đó.</p>
    {!paths.length && !error && <p role="status">{entry.strokeUrl ? 'Đang tải mẫu nét…' : 'Chữ này chưa có mẫu nét. Bạn vẫn có thể luyện theo mặt chữ.'}</p>}{error && <p role="alert">{error}</p>}
  </div><div><h3>Viết theo mẫu</h3><svg ref={canvas} viewBox="0 0 300 300" className="write-canvas" aria-label="Vùng luyện viết bằng chuột hoặc ngón tay" onPointerDown={e => { if (!e.isPrimary || e.button !== 0) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); drawing.current = true; setSaved(false); setInk(v => [...v, [point(e)]]); }} onPointerMove={e => { if (!drawing.current) return; const p = point(e); setInk(v => v.length ? [...v.slice(0, -1), [...v[v.length - 1], p]] : v); }} onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }}><path d="M0 150H300M150 0V300M0 0L300 300M300 0L0 300" stroke="#dce6eb" strokeDasharray="5 5"/><text x="150" y="222" textAnchor="middle" fill="#e4ebed" fontSize="240">{entry.character}</text>{ink.map((stroke, i) => <polyline key={i} points={stroke.map(p => p.x + ',' + p.y).join(' ')} fill="none" stroke="#16324f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>)}</svg><div className="dialog-actions"><button className="btn btn-secondary" disabled={!ink.length} onClick={() => { setInk(v => v.slice(0, -1)); setSaved(false); }}>Hoàn tác</button><button className="btn btn-secondary" disabled={!ink.length} onClick={() => { setInk([]); setSaved(false); }}>Xóa nét</button><button className="btn btn-primary" disabled={!ink.length || saved} onClick={() => { onDone(); setSaved(true); }}>Đã luyện chữ này</button></div>
    {saved && <div className="learning-completion hanzi-completion" role="status"><CompletionMark/><p>Đã ghi nhận lần luyện chữ {entry.character}. Bạn tự đối chiếu nét viết với mẫu.</p></div>}
  </div></div><small>Mẫu nét: hanzi-writer-data / Make Me a Hanzi · <a href="/ARPHICPL.TXT" target="_blank" rel="noreferrer">Arphic Public License</a>. Luyện viết tự đánh giá.</small></div>;
}
