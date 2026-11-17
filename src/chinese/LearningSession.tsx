import { useEffect, useRef, useState } from 'react';
import { answerOptions, finishLearningWord, gradeReview, initialProgress, type LearningData, type StudyWord } from './learning';
import { getReviewMode, formatDueInterval } from './reused/scheduler';
import type { ReviewMode } from './reused/models';
import type { LearningCommit } from './ChineseApp';
import { speakChinese } from '../services/curriculum';
import { Icon, Empty } from './ui';

type Props = { words: StudyWord[]; data: LearningData; commit: LearningCommit; onPause: () => void; onFinish: () => void };
export function LearningSessionView(props: Props) {
  const session = props.data.session;
  if (!session) return <><Empty title="Chưa có phiên học đang mở" copy="Chọn từ mới hoặc từ đến hạn để bắt đầu."/><button className="fc-button" onClick={props.onPause}>Chọn phiên học</button></>;
  if (session.index >= session.ids.length) return <section className="fc-session-complete fc-panel"><span className="fc-complete-symbol"><Icon name="check" size={42}/></span><span className="fc-eyebrow">TỪNG BƯỚC ĐỀU ĐÁNG GIÁ</span><h1>Thêm một bước tiến hôm nay.</h1><p>{session.kind === 'learn' ? `Bạn đã hoàn tất ba lượt học cho ${session.completed} từ mới.` : `Đã hoàn thành ${session.graded.length} từ và các lượt gặp lại trong phiên.`}</p><p className="fc-muted">{session.kind === 'learn' ? 'Từ mới được hẹn ôn lại sau 30 phút.' : session.kind === 'practice' ? 'Đây là tự luyện, lịch ôn được giữ nguyên.' : 'Lịch ôn đã được cập nhật theo câu trả lời thực tế.'}</p><button className="fc-button" onClick={props.onFinish}>Xem tiến độ của tôi<Icon name="arrow" size={18}/></button></section>;
  const word = props.words.find(item => item.id === session.ids[session.index]);
  if (!word) return <><Empty title="Chưa tìm thấy từ trong phiên đã lưu" copy="Kho từ có thể đã thay đổi. Phiên và tiến độ vẫn được giữ để bạn sao lưu."/><button className="fc-button secondary" onClick={props.onPause}>Tạm dừng</button></>;
  return <SessionTurn key={`${session.id}-${session.index}-${session.pass}`} {...props} word={word}/>;
}
function SessionTurn({ words, word, data, commit, onPause }: Props & { word: StudyWord }) {
  const session = data.session!, learning = session.kind === 'learn';
  const supported: ReviewMode[] = ['hanzi-meaning', 'meaning-hanzi', 'hanzi-pinyin', 'pinyin-hanzi', 'audio-meaning', 'audio-hanzi', 'hanzi-recall-pinyin-compose'];
  const suggested = getReviewMode(data.progress[word.id] ?? initialProgress('LEARNING'), word.id);
  const automatic = supported.includes(suggested) ? suggested : 'meaning-hanzi';
  const [mode, setMode] = useState<ReviewMode>(session.mode === 'auto' ? automatic : supported.includes(session.mode as ReviewMode) ? session.mode as ReviewMode : 'meaning-hanzi');
  const [hint, setHint] = useState(false), [composition, setComposition] = useState(''), [message, setMessage] = useState('');
  const started = useRef(performance.now()), locked = useRef(false), heading = useRef<HTMLHeadingElement>(null);
  const feedback = session.feedback;
  const compose = learning ? session.pass !== 2 : mode === 'hanzi-recall-pinyin-compose';
  const field = learning ? 'simplified' : mode === 'hanzi-meaning' || mode === 'audio-meaning' ? 'primaryMeaningVi' : mode === 'hanzi-pinyin' ? 'pinyin' : 'simplified';
  const pool = words.filter(item => item.hskBand === word.hskBand);
  const options = answerOptions(word, pool, field);
  const glyphs = [...new Set([...word.simplified, ...pool.slice(0, 4).flatMap(item => [...item.simplified])])].slice(0, Math.max(8, new Set(word.simplified).size)).sort((a, b) => a.localeCompare(b));
  const audio = !learning && (mode === 'audio-meaning' || mode === 'audio-hanzi');
  const showWord = learning && session.pass === 1 || !learning && (mode === 'hanzi-meaning' || mode === 'hanzi-pinyin');
  useEffect(() => { heading.current?.focus({ preventScroll: true }); return () => window.speechSynthesis?.cancel(); }, []);
  const act = (action: () => void) => {
    if (locked.current || feedback) return;
    locked.current = true;
    try { action(); } catch (cause) { setMessage((cause as Error).message); }
    finally { locked.current = false; }
  };
  const submit = (answer: string) => act(() => {
    const correct = answer.normalize('NFC') === word[field].normalize('NFC') || field === 'simplified' && answer === word.traditional;
    if (learning) {
      if (!correct) { setMessage('Chưa đúng. Hãy nhìn lại gợi ý và thử thêm một lần.'); return; }
      commit(previous => {
        const current = previous.session;
        if (!current || current.id !== session.id || current.index !== session.index || current.pass !== session.pass) throw Error('Phiên đã thay đổi. Hãy tải lại trang.');
        if (session.pass < 3) return { ...previous, session: { ...current, pass: (session.pass + 1) as 2 | 3 } };
        const next = finishLearningWord(previous, word.id);
        return { ...next, session: { ...current, index: current.index + 1, pass: 1, completed: current.completed + 1 } };
      });
    } else {
      commit(previous => gradeReview(previous, word.id, correct, mode, Math.round(performance.now() - started.current), hint));
    }
  });
  const skip = (status: 'KNOWN' | 'SKIPPED') => act(() => commit(previous => {
    const current = previous.session;
    if (!current || current.id !== session.id || current.index !== session.index) throw Error('Phiên đã thay đổi.');
    if (previous.progress[word.id]) throw Error('Từ đã có tiến độ, chưa thay đổi lịch ôn.');
    return { ...previous, progress: { ...previous.progress, [word.id]: initialProgress(status) }, session: { ...current, index: current.index + 1, pass: 1 } };
  }));
  const next = () => { try { commit(previous => {
    const current = previous.session;
    if (!current?.feedback || current.index !== session.index) return previous;
    return { ...previous, session: { ...current, index: current.index + 1, feedback: null } };
  }); } catch (cause) { setMessage((cause as Error).message); } };
  return <section className="fc-session"><div className="fc-session-top"><button className="fc-text-button" onClick={onPause}>← Tạm dừng & lưu</button><span>{learning ? `Từ ${session.index + 1}/${session.ids.length} · Lượt ${session.pass}/3` : `${session.index + 1}/${session.ids.length} lượt${session.kind === 'practice' ? ' · Tự luyện' : ''}`}</span></div><progress value={session.index * (learning ? 3 : 1) + (learning ? session.pass - 1 : 0)} max={session.ids.length * (learning ? 3 : 1)} aria-label="Tiến độ phiên học"/>
    <div className="fc-session-card fc-panel"><span className="fc-eyebrow">{learning ? ['NHÌN VÀ LÀM QUEN', 'NHẬN DIỆN TỪ', 'TỰ NHỚ VÀ GHÉP TỪ'][session.pass - 1] : audio ? 'NGHE VÀ CHỌN ĐÁP ÁN' : compose ? 'NHỚ VÀ GHÉP HÁN TỰ' : mode === 'hanzi-pinyin' ? 'CHỌN PINYIN ĐÚNG' : 'NHỚ TỪ ĐÃ HỌC'}</span>
      <h1 ref={heading} tabIndex={-1} className={showWord || !learning && mode === 'pinyin-hanzi' ? 'fc-session-prompt chinese' : 'fc-session-prompt'}>{audio ? 'Từ nào đang được đọc?' : showWord ? word.simplified : !learning && mode === 'pinyin-hanzi' ? word.pinyin : word.primaryMeaningVi}</h1>
      {learning && session.pass === 1 && <><p className="fc-pinyin">{word.pinyin}</p><h2>{word.primaryMeaningVi}</h2></>}
      {(audio || learning && session.pass === 1) && <button className="fc-audio-button" aria-label="Nghe từ tiếng Trung" disabled={Boolean(feedback)} onClick={() => { void speakChinese(word.simplified).catch(cause => setMessage(cause.message)); }}><Icon name="sound" size={25}/><span>{audio ? 'Bấm để nghe từ' : 'Nghe cách đọc'}</span></button>}
      {audio && <button className="fc-text-button" disabled={Boolean(feedback)} onClick={() => { setMode('meaning-hanzi'); setHint(true); }}>Thiết bị không có giọng đọc · chuyển sang chữ</button>}
      {(hint || feedback) && <p className="fc-session-hint" role="status"><span lang="zh">{word.simplified}</span> · {word.pinyin} · {word.primaryMeaningVi}</p>}
      {!feedback && <>
        {compose ? <><p className="fc-muted">{learning && session.pass === 1 ? 'Ghép lại Hán tự theo mẫu phía trên.' : 'Chọn các chữ theo đúng thứ tự.'}</p><div className="fc-compose-answer" aria-live="polite" aria-label="Hán tự đã ghép"><span lang="zh">{composition || '…'}</span><button className="fc-text-button" disabled={!composition} onClick={() => setComposition(value => [...value].slice(0, -1).join(''))}>Xóa chữ cuối</button></div><div className="fc-glyphs" role="group" aria-label="Chọn chữ để ghép">{glyphs.map(glyph => <button key={glyph} aria-label={`Ghép chữ ${glyph}`} onClick={() => setComposition(value => [...value].length < [...word.simplified].length + 2 ? value + glyph : value)} lang="zh">{glyph}</button>)}</div><button className="fc-button fc-check-answer" disabled={!composition} onClick={() => submit(composition)}>Kiểm tra<Icon name="check" size={18}/></button></> : <div className="fc-answer-options">{options.map((option, index) => <button key={option} onClick={() => submit(option)}><span>{index + 1}</span><strong lang={field === 'simplified' ? 'zh' : undefined}>{option}</strong></button>)}</div>}
        {!(learning && session.pass === 1) && <button className="fc-text-button" onClick={() => setHint(true)}>Xem gợi ý{!learning ? ' · không tăng cấp nhớ' : ''}</button>}
      </>}
      {feedback && <div className={'fc-answer-feedback ' + (feedback.correct ? 'correct' : 'incorrect')} role="status"><strong>{feedback.correct ? 'Đúng rồi, thêm một lần nhớ.' : 'Chưa đúng. Từ này sẽ được gặp lại một lần.'}</strong><p>{feedback.nextReviewAt ? `Lần ôn tiếp: ${formatDueInterval(feedback.nextReviewAt)}` : 'Lượt tự luyện này giữ nguyên lịch ôn.'}</p><button className="fc-button" onClick={next}>Tiếp tục<Icon name="arrow" size={18}/></button></div>}
      {message && <div className="fc-error" role="alert">{message}</div>}
    </div>{learning && <div className="fc-session-bottom"><button className="fc-text-button" onClick={() => skip('KNOWN')}>Tôi đã biết từ này</button><button className="fc-text-button" onClick={() => skip('SKIPPED')}>Bỏ qua từ này</button></div>}
  </section>;
}
