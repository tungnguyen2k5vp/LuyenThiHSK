import { useEffect, useRef, useState } from 'react';
import { ExamRuntimeConfig } from '../../types';
import {contentApiUrl} from '../../services/localApi';
import {usePreviewContent} from '../../services/previewContent';
type AudioState = 'loading' | 'ready' | 'playing' | 'paused' | 'error';
interface Props { text: string; src?: string; slowSrc?:string; voiceKind?:'synthetic'|'recorded'|'unknown'; rules: ExamRuntimeConfig['audio']; usedPlays?: number; onPlayed?: () => void; onError?: () => void; onSuccess?: () => void; onAvailability?: (ready:boolean)=>void }
export function ExamAudio({ text, src:normalSrc, slowSrc, voiceKind, rules, usedPlays = 0, onPlayed, onError, onSuccess,onAvailability }: Props) {
  const [variant,setVariant]=useState('normal');const src=variant==='slow'&&slowSrc?slowSrc:normalSrc;
  const preview=usePreviewContent();const token=preview?.token;const privateAudio=Boolean(src?.match(/^\/api\/admin\/v(?:[456]|10)\/(audio|recording)\//));const [blobSrc,setBlobSrc]=useState<string|undefined>();
  const playableSrc=privateAudio?blobSrc:src?.startsWith('/api/media/')?contentApiUrl(src.slice(5)):src;
  const [status, setStatus] = useState<AudioState>('loading');
  const availability=useRef(onAvailability);availability.current=onAvailability;
  useEffect(()=>{availability.current?.(status==='ready'||status==='playing'||status==='paused');},[status]);
  const [rate, setRate] = useState(rules.rate);
  const [position,setPosition]=useState(0),[duration,setDuration]=useState(0);
  const [loadAttempt,setLoadAttempt]=useState(0);
  const audio = useRef<HTMLAudioElement>(null);
  const active = useRef(true);
  const timeout = useRef<number | undefined>(undefined);
  const started = useRef(false);
  const callbacks = useRef({ onError, onSuccess, onPlayed });
  callbacks.current = { onError, onSuccess, onPlayed };
  const fail = () => { if (!active.current) return; clearTimeout(timeout.current); setStatus('error'); callbacks.current.onError?.(); };
  useEffect(()=>{if(!privateAudio||!src)return;let live=true,blob='';const controller=new AbortController(),deadline=window.setTimeout(()=>controller.abort(),12000);setStatus('loading');clearTimeout(timeout.current);timeout.current=window.setTimeout(fail,12000);setBlobSrc(undefined);void fetch(contentApiUrl(src.slice(5)),{headers:{Authorization:'Bearer '+(token??'')},signal:controller.signal}).then(r=>{if(!r.ok)throw Error('Private audio unavailable');return r.blob();}).then(b=>{blob=URL.createObjectURL(b);if(live)setBlobSrc(blob);}).catch(()=>{if(live)fail();}).finally(()=>clearTimeout(deadline));return()=>{live=false;controller.abort();clearTimeout(deadline);clearTimeout(timeout.current);if(blob)URL.revokeObjectURL(blob);};},[privateAudio,src,token,loadAttempt]);
  useEffect(() => {
    active.current = true;
    started.current=false;setPosition(0);setDuration(0);
    if (!src) { if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') setStatus('ready'); else fail(); }
    else { setStatus('loading'); if(!privateAudio)timeout.current = window.setTimeout(fail, 12000); }
    return () => { active.current = false; clearTimeout(timeout.current); window.speechSynthesis?.cancel(); };
  }, [src,privateAudio]);
  useEffect(()=>{if(privateAudio&&playableSrc)audio.current?.load();},[privateAudio,playableSrc]);
  const stop = () => { clearTimeout(timeout.current); window.speechSynthesis?.cancel(); audio.current?.pause(); setStatus(src?'paused':'ready'); };
  const continuing=Boolean(src&&started.current&&position<duration);
  const play = () => {
    if (rules.maxPlays !== null && usedPlays >= rules.maxPlays&&!continuing) return;
    setStatus('loading');
    if (src) {
      if(privateAudio&&status==='error'){setBlobSrc(undefined);setLoadAttempt(n=>n+1);return;}
      if(privateAudio&&!blobSrc){setLoadAttempt(n=>n+1);return;}
      const player = audio.current;
      if (!player) return fail();
      if(status==='error')player.load();
      player.playbackRate = rate;
      timeout.current = window.setTimeout(fail, 12000);
      player.play().catch(fail);
    } else {
      if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return fail();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; utterance.rate = rate;
      utterance.onstart = () => { if (!active.current) return; clearTimeout(timeout.current); started.current = true; setStatus('playing'); callbacks.current.onPlayed?.(); };
      utterance.onend = () => { if (!active.current) return; setStatus('ready'); callbacks.current.onSuccess?.(); };
      utterance.onerror = (event) => { if (event.error !== 'canceled' && event.error !== 'interrupted') fail(); };
      timeout.current = window.setTimeout(() => { if (!started.current) fail(); }, 7000);
      window.speechSynthesis.speak(utterance);
    }
  };
  return <div className="exam-audio" data-audio-state={status}>
    {slowSrc&&rules.allowRateChange&&<label className="audio-variant">Bản audio <select aria-label="Bản audio" value={variant} onChange={e=>setVariant(e.target.value)}><option value="normal">Bình thường</option><option value="slow">Chậm · tệp riêng</option></select></label>}
    {src && <audio key={playableSrc??'pending'} ref={audio} src={playableSrc} preload="auto" onTimeUpdate={e=>setPosition(e.currentTarget.currentTime)} onLoadedMetadata={e=>setDuration(Number.isFinite(e.currentTarget.duration)?e.currentTarget.duration:0)} onCanPlay={() => { clearTimeout(timeout.current); setStatus(s=>s==='playing'||s==='paused'?s:'ready'); }} onError={fail}
      onPlaying={() => { clearTimeout(timeout.current); setStatus('playing'); if(!started.current){started.current=true;callbacks.current.onPlayed?.();} }}
      onEnded={() => { started.current=false;setStatus('ready'); callbacks.current.onSuccess?.(); }} />}
    <div className="audio-row"><button className="btn btn-secondary" type="button" onClick={status === 'playing' ? stop : play}
      disabled={rules.maxPlays !== null && usedPlays >= rules.maxPlays && status !== 'playing'&&!continuing}>{status === 'playing' ? 'Tạm dừng âm thanh' : status === 'paused'?'Tiếp tục âm thanh':status === 'error' ? 'Thử phát lại' : 'Phát âm thanh'}</button>
      <span role="status">{status === 'loading' ? 'Đang tải âm thanh…' : status === 'playing' ? 'Đang phát' : status==='paused'?'Đã tạm dừng':status === 'error' ? 'Không tải được âm thanh. Bài làm vẫn được giữ; hãy kiểm tra kết nối và thử lại.' : 'Sẵn sàng'}</span>
    </div>
    {src&&duration>0&&<div className="audio-progress"><progress value={position} max={duration} aria-label="Tiến độ âm thanh"/><output aria-label="Thời gian âm thanh">{Math.floor(position)} / {Math.ceil(duration)} giây</output></div>}
    <small>{src ? voiceKind==='synthetic'?'Audio tổng hợp · bài luyện tập':'Audio của bài' : 'Giọng máy trên thiết bị · bài luyện nghe'}{rules.maxPlays !== null ? ` · ${usedPlays}/${rules.maxPlays} lượt nghe` : ' · được nghe lại'}</small>
    {rules.allowRateChange && <label className="audio-rate">Tốc độ <select aria-label="Tốc độ phát" value={rate} onChange={(event) => setRate(Number(event.target.value))}><option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.25}>1.25×</option></select></label>}
    {src && rules.allowSeek && <label>Tua audio <input aria-label="Tua audio" type="range" min={0} max={duration || 1} step={0.1} value={Math.min(position,duration||1)} onChange={(event) => { if (audio.current){audio.current.currentTime = Number(event.target.value);setPosition(Number(event.target.value));} }} /></label>}
  </div>;
}
