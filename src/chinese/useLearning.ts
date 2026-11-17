import { useCallback, useEffect, useRef, useState } from 'react';
import { emptyLearning, LEARNING_KEY, parseLearning, readLearning, type LearningData } from './learning';
import { StudyTimeTracker } from './reused/study-time';

export function useLearning() {
  const [error, setError] = useState('');
  const [data, setData] = useState<LearningData>(() => { try { return readLearning(); } catch { return emptyLearning(); } });
  const ref = useRef(data), blocked = useRef(false);
  useEffect(() => {
    try { readLearning(); } catch { blocked.current = true; setError('Chưa đọc được dữ liệu học đã lưu. Bản gốc vẫn được giữ; hãy xuất bản gốc hoặc khôi phục bản sao lưu trong Cài đặt.'); }
    const listener = (event: StorageEvent) => {
      if (event.key !== LEARNING_KEY) return;
      try { const next = readLearning(); ref.current = next; setData(next); } catch { blocked.current = true; setError('Dữ liệu từ thẻ khác chưa hợp lệ. Chưa ghi đè dữ liệu hiện có.'); }
    };
    window.addEventListener('storage', listener); return () => window.removeEventListener('storage', listener);
  }, []);
  const commit = useCallback((update: (data: LearningData) => LearningData, restore = false) => {
    if (blocked.current && !restore) throw Error('Cần khôi phục dữ liệu trước khi tiếp tục học.');
    try {
      const stored = localStorage.getItem(LEARNING_KEY);
      if (!restore && stored && parseLearning(JSON.parse(stored)).updatedAt !== ref.current.updatedAt) throw Error('Tiến độ đã thay đổi ở thẻ khác. Tải lại trang trước khi tiếp tục.');
      const next = parseLearning({ ...update(ref.current), updatedAt: new Date(Math.max(Date.now(), Date.parse(ref.current.updatedAt) + 1)).toISOString() });
      if (restore && stored) localStorage.setItem(`${LEARNING_KEY}-before-restore-${Date.now()}`, stored);
      localStorage.setItem(LEARNING_KEY, JSON.stringify(next));
      ref.current = next; setData(next); blocked.current = false; setError('');
    } catch (cause) {
      const message = cause instanceof Error && !cause.message.includes('quota') ? cause.message : 'Bộ nhớ thiết bị đã đầy. Chưa ghi nhận thay đổi; hãy xuất bản sao lưu rồi thử lại.';
      setError(message); throw Error(message);
    }
  }, []);
  return { data, commit, error };
}
export function useStudyTime(active: boolean, commit: ReturnType<typeof useLearning>['commit']) {
  useEffect(() => {
    if (!active) return;
    const tracker = new StudyTimeTracker(Date.now, async (day, seconds) => { commit(data => ({ ...data, seconds: { ...data.seconds, [day]: (data.seconds[day] ?? 0) + seconds } })); });
    let idleAt = Date.now();
    const sync = () => tracker.setActive(document.visibilityState === 'visible' && Date.now() - idleAt < 90000);
    const input = () => { idleAt = Date.now(); sync(); };
    const flush = () => { sync(); void tracker.flush(); };
    sync();
    const timer = window.setInterval(flush, 5000);
    document.addEventListener('visibilitychange', flush);
    window.addEventListener('pointerdown', input); window.addEventListener('keydown', input); window.addEventListener('pagehide', flush);
    return () => { tracker.setActive(false); void tracker.flush(); clearInterval(timer); document.removeEventListener('visibilitychange', flush); window.removeEventListener('pointerdown', input); window.removeEventListener('keydown', input); window.removeEventListener('pagehide', flush); };
  }, [active, commit]);
}
