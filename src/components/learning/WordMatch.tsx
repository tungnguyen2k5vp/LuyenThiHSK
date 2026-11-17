import { useEffect, useRef, useState } from 'react';
import type { CourseWord } from '../../types/curriculum';
import { shortMeaning } from '../../services/lexicalPresentation';
import { CompletionMark } from './CompletionMark';

// ponytail: exact displayed glosses only; use sense IDs if matching later supports synonyms.
export function matchingWords(words: CourseWord[], offset = 0): CourseWord[] {
  const chosen: CourseWord[] = [], characters = new Set<string>(), meanings = new Set<string>(), ids = new Set<string>();
  const normalize = (value: string) => value.normalize('NFKC').trim().toLocaleLowerCase('vi').replace(/\s+/g, ' ');
  for (let i = 0; i < words.length && chosen.length < 4; i++) {
    const word = words[(offset + i) % words.length], character = normalize(word.simplified), meaning = normalize(shortMeaning(word));
    if (!character || !meaning || ids.has(word.id) || characters.has(character) || meanings.has(meaning)) continue;
    chosen.push(word); ids.add(word.id); characters.add(character); meanings.add(meaning);
  }
  return chosen;
}

function shuffled(words: CourseWord[]) {
  const result = words.map(w => w.id);
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}

export function WordMatch({ words, showPinyin, onClose, onLearn }: { words: CourseWord[]; showPinyin: boolean; onClose: () => void; onLearn: (words: CourseWord[]) => void }) {
  const offset = useRef(0);
  const [pairs, setPairs] = useState(() => matchingWords(words));
  const [order, setOrder] = useState(() => shuffled(pairs));
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [mistake, setMistake] = useState<string | null>(null);
  const [message, setMessage] = useState('Chọn một chữ Hán, rồi chọn nghĩa tương ứng.');
  const root = useRef<HTMLElement>(null);
  useEffect(() => { root.current?.querySelector<HTMLButtonElement>('.word-match-character:not(:disabled), .dialog-actions button')?.focus({preventScroll:true}); }, [pairs, matched]);
  const complete = pairs.length >= 2 && matched.length === pairs.length;
  const next = () => {
    offset.current += 4;
    const nextPairs = matchingWords(words, offset.current);
    setPairs(nextPairs); setOrder(shuffled(nextPairs)); setSelected(null); setMatched([]); setMistake(null);
    setMessage('Bộ ghép mới đã sẵn sàng. Chọn một chữ để bắt đầu.');
  };
  const chooseMeaning = (id: string) => {
    if (!selected) { setMessage('Chọn chữ Hán ở cột bên trái trước nhé.'); return; }
    if (selected !== id) { setMistake(id); setMessage('Chưa khớp với nghĩa tham khảo. Thử một nghĩa khác cho chữ đang chọn.'); return; }
    const word = pairs.find(w => w.id === id)!;
    setMatched(ids => [...ids, id]); setSelected(null); setMistake(null);
    setMessage('Đã ghép ' + word.simplified + ' · ' + shortMeaning(word) + '.');
  };
  return <section ref={root} className="card word-match" aria-labelledby="word-match-title">
    <header className="learning-session-heading"><div><p className="eyebrow">KHỞI ĐỘNG TRÍ NHỚ</p><h2 id="word-match-title">Ghép từ nhanh</h2></div><button className="btn btn-ghost" onClick={onClose}>Đóng trò ghép</button></header>
    <p className="learning-session-note">Ghép theo nghĩa tham khảo trong bộ từ đang chọn. Trò này không tính điểm HSK và không tự đánh dấu đã học.</p>
    {pairs.length < 2 ? <p role="status">Cần ít nhất hai từ có chữ và nghĩa khác nhau. Hãy mở rộng bộ lọc để chơi.</p> : <>
      <div className="match-progress"><span>{matched.length}/{pairs.length} cặp đã ghép</span><progress value={matched.length} max={pairs.length} aria-label="Số cặp đã ghép"/></div>
      <p className={'match-message' + (mistake ? ' is-retry' : '')} role="status">{message}</p>
      <div className="match-board"><div className="match-column" role="group" aria-label="Chọn chữ Hán">{pairs.map(word => <button className="word-match-character" key={word.id} data-match-id={word.id} data-state={matched.includes(word.id) ? 'matched' : 'ready'} aria-pressed={selected === word.id} disabled={matched.includes(word.id)} onClick={() => { setSelected(word.id); setMistake(null); setMessage('Đang chọn ' + word.simplified + '. Hãy chọn nghĩa tương ứng.'); }}><strong lang="zh">{word.simplified}</strong>{showPinyin && <small>{word.pinyin}</small>}{matched.includes(word.id) && <span className="match-tick" aria-label="Đã ghép">✓</span>}</button>)}</div>
        <div className="match-column" role="group" aria-label="Chọn nghĩa">{order.map(id => { const word = pairs.find(w => w.id === id)!; return <button className="word-match-meaning" key={id} data-match-id={id} data-state={matched.includes(id) ? 'matched' : mistake === id ? 'retry' : 'ready'} disabled={matched.includes(id)} onClick={() => chooseMeaning(id)}>{shortMeaning(word)}{matched.includes(id) && <span className="match-tick" aria-label="Đã ghép">✓</span>}</button>; })}</div></div>
      {complete && <div className="learning-completion match-completion" role="status"><CompletionMark/><div><h3>Đã ghép hết {pairs.length} cặp!</h3><p>Chuyển sang thẻ để tự đánh giá mức nhớ và lưu lịch ôn.</p></div></div>}
      <div className="dialog-actions"><button className="btn btn-secondary" onClick={next}>Đổi bộ ghép</button>{complete && <button className="btn btn-primary" onClick={() => onLearn(pairs)}>Ôn các từ này bằng thẻ →</button>}</div>
    </>}
  </section>;
}
