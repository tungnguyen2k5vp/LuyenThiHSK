import { lazy, Suspense } from 'react';
const ChineseApp = lazy(() => import('./chinese/ChineseApp'));
const ExamApp = lazy(() => import('./ExamApp').then(module => ({ default: module.App })));
const HskWorkspace = lazy(() => import('./hsk/HskWorkspace'));
export function App() {
  const query = new URLSearchParams(location.search);
  const exam = query.has('view') || query.has('session') || query.has('attempt') || location.pathname.startsWith('/admin');
  return <Suspense fallback={<p role="status" style={{ padding: '2rem' }}>Đang mở không gian học…</p>}>{location.pathname.startsWith('/hsk') ? <HskWorkspace /> : exam ? <ExamApp /> : <ChineseApp />}</Suspense>;
}
export default App;
