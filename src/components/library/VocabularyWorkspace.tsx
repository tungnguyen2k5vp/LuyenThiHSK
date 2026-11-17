import { FormEvent, useMemo, useState } from 'react';
import type { HSKDataEdition, RightsStatus } from '../../types';
import { makeStudyId, PersonalVocabularyEntry } from '../../services/studyStorage';
import { dueVocabulary } from '../../services/sm2';
import { parseVocabularyCsv, VOCABULARY_CSV_TEMPLATE, VocabularyImportMetadata, VocabularyImportResult } from '../../services/vocabularyImport';

type WorkspaceTab = 'study' | 'library' | 'import';
type ReviewRun = { ids: string[]; index: number; completed: number };

interface Props {
  entries: PersonalVocabularyEntry[];
  onAdd: (entries: PersonalVocabularyEntry[]) => void;
  onGrade: (entry: PersonalVocabularyEntry, quality: number) => void;
  onDelete: (id: string) => void;
  onUpdate: (entry: PersonalVocabularyEntry) => void;
}

const EDITION_LABEL: Record<HSKDataEdition, string> = {
  'hsk2-2015': 'HSK 2.0 · 2015',
  'hsk3-2021': 'HSK 3.0 · 2021',
  'hsk3-2025': 'HSK 3.0 · 2025',
  unverified: 'Chưa xác minh',
};

const RIGHTS_OPTIONS: [RightsStatus, string][] = [
  ['user_supplied', 'Nội dung do tôi nhập'],
  ['unverified', 'Chưa xác minh quyền'],
];

function newPersonalEntry(values: { hanzi: string; pinyin: string; meaningVi: string; levelCode: string; edition: HSKDataEdition; exampleZh: string; exampleVi: string }): PersonalVocabularyEntry {
  const now = new Date().toISOString();
  return {
    id: makeStudyId('word'), hanzi: values.hanzi.trim(), pinyin: values.pinyin.trim(), meaningVi: values.meaningVi.trim(),
    levelCode: values.levelCode || null, edition: values.edition, exampleZh: values.exampleZh.trim() || undefined,
    exampleVi: values.exampleVi.trim() || undefined, createdAt: now, dueAt: now, intervalDays: 0,
    easeFactor: 2.5, repetitions: 0, reviewCount: 0,
    provenance: { source_name: 'Người học nhập', source_url: 'local:personal-entry', source_version: 'user-entry', retrieved_at: now,
      license: 'Nội dung cá nhân trên thiết bị', rights_status: 'user_supplied', is_original: false, attribution: 'Nội dung riêng của người học; không gửi lên máy chủ.' },
  };
}

function downloadCsv() {
  const url = URL.createObjectURL(new Blob([`\uFEFF${VOCABULARY_CSV_TEMPLATE}`], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'hsk-tu-vung-template.csv'; anchor.click();
  URL.revokeObjectURL(url);
}

function exportCsv(entries: PersonalVocabularyEntry[]) {
  const columns = ['hanzi', 'pinyin', 'meaning_vi', 'level', 'edition', 'traditional', 'part_of_speech', 'example_zh', 'example_pinyin', 'example_vi'];
  const quote = (value: string | undefined) => `"${(value ?? '').replace(/"/g, '""')}"`;
  const rows = entries.map((entry) => [entry.hanzi, entry.pinyin, entry.meaningVi, entry.levelCode ?? '', entry.edition, entry.traditional, entry.partOfSpeech, entry.exampleZh, entry.examplePinyin, entry.exampleVi].map(quote).join(','));
  const url = URL.createObjectURL(new Blob([`\uFEFF${[columns.join(','), ...rows].join('\r\n')}`], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'hsk-tu-vung-ca-nhan.csv'; anchor.click();
  URL.revokeObjectURL(url);
}

function exportJson(entries: PersonalVocabularyEntry[]) {
  const payload = { format: 'luyenthihsk-personal-vocabulary-v1', exportedAt: new Date().toISOString(), entries };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'hsk-tu-vung-ca-nhan.json'; anchor.click();
  URL.revokeObjectURL(url);
}

export function VocabularyWorkspace({ entries, onAdd, onGrade, onDelete, onUpdate }: Props) {
  const [tab, setTab] = useState<WorkspaceTab>('study');
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [revealed, setRevealed] = useState(false);
  const [run, setRun] = useState<ReviewRun | null>(null);
  const [csv, setCsv] = useState('');
  const [importResult, setImportResult] = useState<VocabularyImportResult | null>(null);
  const [fileError, setFileError] = useState('');
  const [notice, setNotice] = useState('');
  const [metadata, setMetadata] = useState<VocabularyImportMetadata>({
    edition: 'unverified', sourceName: 'Nguồn nhập chưa xác minh', sourceUrl: '', sourceVersion: 'bản nhập cá nhân',
    license: 'Chưa xác minh quyền tái sử dụng', rightsStatus: 'unverified',
  });
  const [quickWord, setQuickWord] = useState({ hanzi: '', pinyin: '', meaningVi: '', levelCode: '', edition: 'unverified' as HSKDataEdition, exampleZh: '', exampleVi: '' });
  const [editing, setEditing] = useState<PersonalVocabularyEntry | null>(null);

  const due = useMemo(() => dueVocabulary(entries), [entries]);
  const uniqueLevels = Array.from(new Set(entries.map((entry) => entry.levelCode).filter((value): value is string => Boolean(value)))).sort();
  const visibleEntries = entries.filter((entry) => {
    const term = `${entry.hanzi} ${entry.traditional ?? ''} ${entry.pinyin} ${entry.meaningVi}`.toLocaleLowerCase();
    return term.includes(query.toLocaleLowerCase()) && (levelFilter === 'all' || entry.levelCode === levelFilter);
  }).sort((a, b) => a.hanzi.localeCompare(b.hanzi, 'zh-CN'));
  const currentId = run?.ids[run.index];
  const currentEntry = entries.find((entry) => entry.id === currentId);

  const setMeta = <K extends keyof VocabularyImportMetadata>(key: K, value: VocabularyImportMetadata[K]) => {
    setMetadata((previous) => ({ ...previous, [key]: value }));
    setImportResult(null);
  };
  const validateCsv = () => {
    const result = parseVocabularyCsv(csv, metadata, entries);
    setImportResult(result);
    setNotice('');
  };
  const acceptImport = () => {
    if (!importResult?.entries.length) return;
    onAdd(importResult.entries);
    setNotice(`Đã thêm ${importResult.entries.length} từ vào bộ từ cá nhân trên thiết bị.`);
    setCsv(''); setImportResult(null);
  };
  const addQuickWord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const word = newPersonalEntry(quickWord);
    if (!word.hanzi || !word.pinyin || !word.meaningVi) return;
    if (entries.some((entry) => entry.hanzi.normalize('NFKC').replace(/\s+/g, '') === word.hanzi.normalize('NFKC').replace(/\s+/g, '') && entry.pinyin.normalize('NFKC').trim().toLocaleLowerCase() === word.pinyin.normalize('NFKC').trim().toLocaleLowerCase())) {
      setNotice('Từ Hanzi và pinyin này đã có trong danh sách.'); return;
    }
    onAdd([word]);
    setQuickWord({ hanzi: '', pinyin: '', meaningVi: '', levelCode: '', edition: 'unverified', exampleZh: '', exampleVi: '' });
    setNotice('Đã lưu từ cá nhân. Từ này không được xác nhận thuộc danh sách HSK.');
  };
  const startReview = (source: PersonalVocabularyEntry[]) => {
    if (!source.length) return;
    setRun({ ids: source.map((entry) => entry.id), index: 0, completed: 0 });
    setRevealed(false); setTab('study');
  };
  const grade = (quality: number) => {
    if (!run || !currentEntry) return;
    onGrade(currentEntry, quality);
    const next = run.index + 1;
    setRevealed(false);
    if (next >= run.ids.length) setRun({ ...run, index: next, completed: run.completed + 1 });
    else setRun({ ...run, index: next, completed: run.completed + 1 });
  };
  const openFile = async (file?: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') { setFileError('Hãy chọn tệp .csv.'); return; }
    if (file.size > 2 * 1024 * 1024) { setFileError('Tệp vượt quá giới hạn 2 MB.'); return; }
    setFileError(''); setCsv(await file.text()); setImportResult(null);
  };
  const saveEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing?.hanzi.trim() || !editing.pinyin.trim() || !editing.meaningVi.trim()) return;
    onUpdate({ ...editing, hanzi: editing.hanzi.trim(), pinyin: editing.pinyin.trim(), meaningVi: editing.meaningVi.trim() });
    setEditing(null); setNotice('Đã cập nhật từ cá nhân.');
  };

  return <section className="vocab-workspace" aria-labelledby="vocab-title">
    <header className="page-heading"><h1 id="vocab-title">Từ vựng cá nhân</h1><p>Ôn từ do bạn nhập bằng lịch cách quãng SM-2. Dữ liệu chỉ lưu trong trình duyệt hiện tại.</p></header>
    <div className="vocab-summary-grid" aria-label="Tổng quan từ vựng">
      <article className="card"><span>Tổng số từ</span><strong>{entries.length}</strong><small>trên thiết bị này</small></article>
      <article className="card"><span>Đến hạn ôn</span><strong>{due.length}</strong><small>{due.length ? 'có thể bắt đầu ngay' : 'chưa có từ đến hạn'}</small></article>
      <article className="card"><span>Đã có lịch sử</span><strong>{entries.filter((entry) => entry.reviewCount > 0).length}</strong><small>từ đã được ôn ít nhất một lần</small></article>
    </div>
    <nav className="vocab-tabs" aria-label="Khu vực từ vựng">
      {([['study', 'Ôn tập'], ['library', 'Danh sách'], ['import', 'Nhập dữ liệu']] as [WorkspaceTab, string][]).map(([key, label]) => <button key={key} className={`btn ${tab === key ? 'btn-primary' : 'btn-secondary'}`} aria-current={tab === key ? 'page' : undefined} onClick={() => { setTab(key); setRun(null); setRevealed(false); }}>{label}</button>)}
    </nav>
    {notice && <p className="vocab-notice" role="status">{notice}</p>}

    {tab === 'study' && <div className="vocab-study-layout">
      {!run && <section className="card vocab-study-start"><div><p className="vocab-eyebrow">LẶP LẠI THEO LỊCH</p><h2>{due.length ? `${due.length} từ đang đến hạn` : 'Chưa có từ đến hạn'}</h2><p>{entries.length ? 'Mỗi lần đánh giá sẽ cập nhật khoảng cách ôn cho từng từ.' : 'Thêm từ riêng hoặc nhập CSV để tạo bộ học đầu tiên.'}</p></div><div className="dialog-actions"><button className="btn btn-primary" disabled={!due.length} onClick={() => startReview(due)}>Bắt đầu ôn đến hạn</button>{!due.length && <button className="btn btn-secondary" onClick={() => setTab('import')}>Thêm từ</button>}</div></section>}
      {run && run.index < run.ids.length && currentEntry && <article className="card vocab-review-card" aria-live="polite">
        <div className="vocab-review-progress"><span>Từ {run.index + 1}/{run.ids.length}</span><button className="btn btn-ghost" onClick={() => { setRun(null); setRevealed(false); }}>Kết thúc phiên ôn</button></div>
        <p className="vocab-eyebrow">{currentEntry.levelCode ?? 'Chưa xác minh cấp'} · {EDITION_LABEL[currentEntry.edition]}</p>
        <div className="vocab-front"><strong lang="zh-Hans">{currentEntry.hanzi}</strong>{currentEntry.traditional && <span lang="zh-Hant">{currentEntry.traditional}</span>}</div>
        {revealed ? <div className="vocab-back"><p className="vocab-pinyin">{currentEntry.pinyin}</p><p>{currentEntry.meaningVi}</p>{currentEntry.exampleZh && <blockquote><span lang="zh-Hans">{currentEntry.exampleZh}</span>{currentEntry.examplePinyin && <small>{currentEntry.examplePinyin}</small>}{currentEntry.exampleVi && <small>{currentEntry.exampleVi}</small>}</blockquote>}<p className="vocab-provenance">Nguồn: {currentEntry.provenance.source_name} · {currentEntry.provenance.rights_status === 'unverified' ? 'chưa xác minh quyền' : 'nội dung cá nhân/đã khai báo'}</p>
          <h3>Bạn nhớ từ này thế nào?</h3><div className="vocab-grades"><button className="btn btn-secondary" onClick={() => grade(1)}>Quên · 1 ngày</button><button className="btn btn-secondary" onClick={() => grade(3)}>Khó · theo lịch</button><button className="btn btn-primary" onClick={() => grade(4)}>Nhớ · theo lịch</button><button className="btn btn-primary" onClick={() => grade(5)}>Dễ · theo lịch</button></div>
        </div> : <button className="btn btn-primary vocab-reveal" onClick={() => setRevealed(true)}>Hiện pinyin và nghĩa</button>}
      </article>}
      {run && run.index >= run.ids.length && <section className="card vocab-study-start" role="status"><div><p className="vocab-eyebrow">PHIÊN ÔN HOÀN TẤT</p><h2>Đã đánh giá {run.completed} từ</h2><p>Lịch ôn tiếp theo đã được lưu trên thiết bị này.</p></div><button className="btn btn-primary" onClick={() => setRun(null)}>Quay lại tổng quan</button></section>}
      {!entries.length && !run && <section className="card vocab-empty"><h2>Bộ từ cá nhân đang trống</h2><p>Không có bộ từ HSK chính thức được đóng gói vì chưa hoàn tất kiểm chứng quyền và đối chiếu dữ liệu. Bạn có thể nhập bộ từ mà bạn có quyền sử dụng.</p><button className="btn btn-secondary" onClick={() => setTab('import')}>Nhập từ của bạn</button></section>}
    </div>}

    {tab === 'library' && <section className="card vocab-library">
      <div className="vocab-library-heading"><div><h2>Danh sách từ</h2><p>{visibleEntries.length} / {entries.length} từ · JSON giữ đủ metadata nguồn</p></div><div className="dialog-actions"><button className="btn btn-secondary" disabled={!entries.length} onClick={() => exportCsv(entries)}>Xuất CSV</button><button className="btn btn-secondary" disabled={!entries.length} onClick={() => exportJson(entries)}>Xuất JSON đầy đủ</button><button className="btn btn-primary" onClick={() => setTab('import')}>Thêm từ</button></div></div>
      <div className="vocab-filters"><label>Tìm từ<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hanzi, pinyin hoặc nghĩa" /></label><label>Cấp đã khai báo<select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)}><option value="all">Tất cả cấp</option>{uniqueLevels.map((level) => <option key={level}>{level}</option>)}</select></label></div>
      {!visibleEntries.length ? <p className="vocab-empty-inline">Không tìm thấy từ phù hợp.</p> : <div className="vocab-table-wrap"><table className="vocab-table"><thead><tr><th>Hanzi / pinyin</th><th>Nghĩa</th><th>Phiên bản / cấp</th><th>Ôn tiếp</th><th>Nguồn</th><th>Thao tác</th></tr></thead><tbody>{visibleEntries.map((entry) => <tr key={entry.id}><td><strong lang="zh-Hans">{entry.hanzi}</strong>{entry.traditional && <small>{entry.traditional}</small>}<small>{entry.pinyin}</small></td><td>{entry.meaningVi}{entry.exampleZh && <small lang="zh-Hans">{entry.exampleZh}</small>}</td><td>{EDITION_LABEL[entry.edition]}<small>{entry.levelCode ?? 'Chưa gắn cấp'}</small></td><td>{entry.reviewCount ? new Date(entry.dueAt).toLocaleDateString('vi-VN') : 'Mới'}</td><td>{entry.provenance.source_name}<small>{entry.provenance.rights_status === 'unverified' ? 'Quyền chưa xác minh' : entry.provenance.license}</small></td><td><div className="vocab-row-actions"><button className="btn btn-ghost" onClick={() => setEditing({ ...entry })}>Sửa</button><button className="btn btn-ghost" onClick={() => { if (window.confirm(`Xóa từ “${entry.hanzi}” khỏi bộ từ trên thiết bị này?`)) onDelete(entry.id); }}>Xóa</button></div></td></tr>)}</tbody></table></div>}
    </section>}

    {tab === 'import' && <div className="vocab-import-layout">
      <section className="card vocab-import-card"><div className="vocab-library-heading"><div><h2>Nhập tệp CSV</h2><p>Kiểm tra dữ liệu trước khi thêm. Tệp không được tải lên máy chủ.</p></div><button className="btn btn-secondary" onClick={downloadCsv}>Tải mẫu CSV rỗng</button></div>
        <div className="vocab-source-fields"><label>Tên nguồn<input value={metadata.sourceName} onChange={(event) => setMeta('sourceName', event.target.value)} /></label><label>URL nguồn<input type="url" placeholder="https://… hoặc để trống cho nội dung cá nhân" value={metadata.sourceUrl} onChange={(event) => setMeta('sourceUrl', event.target.value)} /></label><label>Phiên bản nguồn<input value={metadata.sourceVersion} onChange={(event) => setMeta('sourceVersion', event.target.value)} /></label><label>Giấy phép / quyền sử dụng<input value={metadata.license} onChange={(event) => setMeta('license', event.target.value)} /></label><label>Phiên bản HSK khai báo<select value={metadata.edition} onChange={(event) => setMeta('edition', event.target.value as HSKDataEdition)}><option value="unverified">Chưa xác minh</option><option value="hsk2-2015">HSK 2.0 · 2015</option><option value="hsk3-2021">HSK 3.0 · 2021</option><option value="hsk3-2025">HSK 3.0 · 2025</option></select></label><label>Tình trạng quyền tại bộ nhập<select value={metadata.rightsStatus} onChange={(event) => setMeta('rightsStatus', event.target.value as RightsStatus)}>{RIGHTS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
        <label className="vocab-file-label">Chọn tệp<input type="file" accept=".csv,text/csv" onChange={(event) => { void openFile(event.target.files?.[0]); }} /></label>{fileError && <p className="vocab-error" role="alert">{fileError}</p>}
        <label className="vocab-csv-label">Hoặc dán nội dung CSV<textarea rows={8} value={csv} onChange={(event) => { setCsv(event.target.value); setImportResult(null); }} placeholder="hanzi,pinyin,meaning_vi,level,traditional,part_of_speech,example_zh,example_pinyin,example_vi" /></label>
        <p className="vocab-hint">Cột bắt buộc: <code>hanzi</code>, <code>pinyin</code>, <code>meaning_vi</code>. Cấp trống được giữ là “chưa gắn cấp”; không tự suy ra cấp HSK. Tối đa 2 MB và 2.000 dòng mỗi lần.</p>
        <div className="dialog-actions"><button className="btn btn-primary" onClick={validateCsv} disabled={!csv.trim()}>Kiểm tra và xem trước</button>{importResult?.entries.length ? <button className="btn btn-secondary" onClick={acceptImport}>Thêm {importResult.entries.length} từ hợp lệ</button> : null}</div>
        {importResult && <div className="vocab-preview" aria-live="polite"><h3>Kết quả kiểm tra · {importResult.rowsRead} dòng</h3><p>{importResult.entries.length} dòng hợp lệ · {importResult.duplicates} từ trùng đã bỏ qua · {importResult.errors.length} dòng lỗi</p>{importResult.errors.length > 0 && <ul className="vocab-error-list">{importResult.errors.map((error) => <li key={error}>{error}</li>)}</ul>}{importResult.entries.length > 0 && <div className="vocab-table-wrap"><table className="vocab-table"><thead><tr><th>Hanzi</th><th>Pinyin</th><th>Nghĩa</th><th>Cấp ghi trong CSV</th></tr></thead><tbody>{importResult.entries.slice(0, 8).map((entry) => <tr key={entry.id}><td>{entry.hanzi}</td><td>{entry.pinyin}</td><td>{entry.meaningVi}</td><td>{entry.levelCode ?? 'Chưa gắn cấp'}</td></tr>)}</tbody></table>{importResult.entries.length > 8 && <small>Đang hiển thị 8 dòng đầu tiên.</small>}</div>}</div>}
      </section>
      <details className="card vocab-quick-add"><summary>Thêm một từ riêng</summary><form onSubmit={addQuickWord} className="vocab-quick-form"><label>Hanzi<input required maxLength={100} value={quickWord.hanzi} onChange={(event) => setQuickWord({ ...quickWord, hanzi: event.target.value })} /></label><label>Pinyin<input required maxLength={240} value={quickWord.pinyin} onChange={(event) => setQuickWord({ ...quickWord, pinyin: event.target.value })} /></label><label>Nghĩa tiếng Việt<input required maxLength={1200} value={quickWord.meaningVi} onChange={(event) => setQuickWord({ ...quickWord, meaningVi: event.target.value })} /></label><label>Cấp tham khảo<select value={quickWord.levelCode} onChange={(event) => setQuickWord({ ...quickWord, levelCode: event.target.value })}><option value="">Chưa gắn cấp</option>{['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'].map((level) => <option key={level}>{level}</option>)}</select></label><label>Phiên bản<select value={quickWord.edition} onChange={(event) => setQuickWord({ ...quickWord, edition: event.target.value as HSKDataEdition })}><option value="unverified">Chưa xác minh</option><option value="hsk2-2015">HSK 2.0 · 2015</option><option value="hsk3-2021">HSK 3.0 · 2021</option><option value="hsk3-2025">HSK 3.0 · 2025</option></select></label><label>Câu ví dụ tiếng Trung<input maxLength={1000} value={quickWord.exampleZh} onChange={(event) => setQuickWord({ ...quickWord, exampleZh: event.target.value })} /></label><label>Nghĩa câu ví dụ<input maxLength={1200} value={quickWord.exampleVi} onChange={(event) => setQuickWord({ ...quickWord, exampleVi: event.target.value })} /></label><button className="btn btn-primary" type="submit">Lưu từ cá nhân</button></form><p className="vocab-hint">Từ nhập nhanh được gắn “chưa xác minh” về phiên bản và cấp; bạn có thể chỉnh lại trong danh sách.</p></details>
    </div>}

    {editing && <div className="exam-dialog-overlay"><form className="exam-dialog card vocab-edit-form" onSubmit={saveEdit} aria-labelledby="vocab-edit-title"><h2 id="vocab-edit-title">Sửa từ cá nhân</h2><label>Hanzi<input required value={editing.hanzi} onChange={(event) => setEditing({ ...editing, hanzi: event.target.value })} /></label><label>Pinyin<input required value={editing.pinyin} onChange={(event) => setEditing({ ...editing, pinyin: event.target.value })} /></label><label>Nghĩa tiếng Việt<input required value={editing.meaningVi} onChange={(event) => setEditing({ ...editing, meaningVi: event.target.value })} /></label><label>Cấp ghi nhận<select value={editing.levelCode ?? ''} onChange={(event) => setEditing({ ...editing, levelCode: event.target.value || null })}><option value="">Chưa gắn cấp</option>{['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'].map((level) => <option key={level}>{level}</option>)}</select></label><label>Phiên bản<select value={editing.edition} onChange={(event) => setEditing({ ...editing, edition: event.target.value as HSKDataEdition })}>{Object.entries(EDITION_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><div className="dialog-actions"><button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Hủy</button><button type="submit" className="btn btn-primary">Lưu thay đổi</button></div></form></div>}
  </section>;
}
