import { useEffect, useRef } from 'react';
import { routeUrl, type ExamPage, type ExamRoute } from '../../services/examRoute';

const icons: Record<string, React.ReactNode> = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" /></>,
  exam: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V2h6v2M9 9h6m-6 4h6m-6 4h3" /></>,
  book: <><path d="M12 5C9 3 5 3 2 4v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 1Zm0 0v15" /></>,
  headphones: <><path d="M3 14v-3a9 9 0 0 1 18 0v3M4 12h3v8H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm13 0h3a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-3Z" /></>,
  pen: <><path d="m14 5 5 5M4 20l5-1L21 7a2 2 0 0 0-5-5L4 14l-1 7Z" /></>,
  mic: <><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8" /></>,
  path: <><circle cx="5" cy="5" r="2" /><circle cx="19" cy="19" r="2" /><path d="M9 5h7a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h7" /></>,
  review: <><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-4v5l3 2" /></>,
  chart: <><path d="M4 3v18h17M8 16v-4m5 4V8m5 8V5" /></>,
  settings: <><circle cx="12" cy="8" r="4" /><path d="M4 22v-3a8 8 0 0 1 16 0v3" /></>,
  arrow: <><path d="M4 12h16m-6-6 6 6-6 6" /></>,
  play: <path d="m9 5 11 7-11 7Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
};

export function PortalIcon({ name }: { name: string }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name] ?? icons.book}</svg>;
}

export const PORTAL_NAV: { page: ExamPage; label: string; icon: string; group: string }[] = [
  { page: 'dashboard', label: 'Tổng quan', icon: 'home', group: 'KHÔNG GIAN HỌC TẬP' },
  { page: 'exams', label: 'Luyện đề HSK', icon: 'exam', group: 'KHÔNG GIAN HỌC TẬP' },
  { page: 'practice', label: 'Luyện từng kỹ năng', icon: 'headphones', group: 'KHÔNG GIAN HỌC TẬP' },
  { page: 'plan', label: 'Lộ trình của tôi', icon: 'path', group: 'KHÔNG GIAN HỌC TẬP' },
  { page: 'learn', label: 'Thư viện kiến thức', icon: 'book', group: 'CÙNG BẠN TIẾN BỘ' },
  { page: 'review', label: 'Ôn tập & câu sai', icon: 'review', group: 'CÙNG BẠN TIẾN BỘ' },
  { page: 'progress', label: 'Tiến độ học tập', icon: 'chart', group: 'CÙNG BẠN TIẾN BỘ' },
];

export function portalActivePage(page: ExamPage): ExamPage {
  if (['vocab', 'grammar', 'hanzi', 'personal'].includes(page)) return 'learn';
  if (page === 'parts') return 'practice';
  if (['writing', 'speaking', 'diagnostic'].includes(page)) return 'practice';
  if (page === 'mistakes') return 'review';
  if (page === 'history') return 'progress';
  return page;
}

export function HskSidebar({ route, onNavigate }: { route: ExamRoute; onNavigate: (page: ExamPage) => void }) {
  const drawer = useRef<HTMLDetailsElement>(null);
  const active = portalActivePage(route.page);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 761px)');
    const resize = () => { if (drawer.current) drawer.current.open = desktop.matches; };
    resize(); desktop.addEventListener('change', resize);
    const close = (e: KeyboardEvent) => { if (!desktop.matches && e.key === 'Escape' && drawer.current?.open) { drawer.current.open = false; drawer.current.querySelector('summary')?.focus(); } };
    const outside = (e: PointerEvent) => { if (!desktop.matches && drawer.current?.open && !drawer.current.contains(e.target as Node)) drawer.current.open = false; };
    document.addEventListener('keydown', close); document.addEventListener('pointerdown', outside);
    return () => { desktop.removeEventListener('change', resize); document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, []);
  const link = (page: ExamPage) => ({ href: routeUrl({ ...route, page, session: undefined, attempt: undefined, type: 'all' }), onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); if (drawer.current && window.matchMedia('(max-width: 760px)').matches) drawer.current.open = false; onNavigate(page);
  } });
  return <details className="portal-sidebar" ref={drawer} open>
    <summary className="portal-menu-toggle" aria-label="Mở hoặc đóng menu điều hướng"><PortalIcon name="menu" /><span>Menu học tập</span></summary>
    <div className="portal-sidebar-content"><a className="portal-brand" {...link('dashboard')}><span className="portal-brand-mark" lang="zh-CN">汉</span><span>HSK<span className="portal-brand-accent"> journey</span><small>MỖI NGÀY MỘT BƯỚC TIẾN</small></span></a>
      <nav aria-label="Điều hướng chính">{PORTAL_NAV.map((item, i) => <div key={item.page}>{(i === 0 || PORTAL_NAV[i - 1].group !== item.group) && <p className="portal-nav-label">{item.group}</p>}<a {...link(item.page)} aria-current={active === item.page ? 'page' : undefined}><PortalIcon name={item.icon} /><span>{item.label}</span>{active === item.page && <span className="portal-nav-dot" />}</a></div>)}</nav>
      <div className="portal-sidebar-tip"><span aria-hidden="true">✦</span><h2>Mục tiêu lớn,<br />bắt đầu từ bước nhỏ.</h2><p>Dành một chút thời gian cho tiếng Trung hôm nay nhé.</p><a {...link('plan')}>Khám phá lộ trình <span>→</span></a></div>
      <a className="portal-sidebar-account" {...link('settings')} aria-current={active === 'settings' ? 'page' : undefined}><PortalIcon name="settings" />Tài khoản & thiết lập</a>
      <a className="portal-source-link" {...link('info')}>Thông tin học liệu & nguồn ↗</a>
    </div>
  </details>;
}

export function HskTopbar({ route, targetLevel, onNavigate }: { route: ExamRoute; targetLevel: string; onNavigate: (page: ExamPage) => void }) {
  const active = portalActivePage(route.page);
  const title = PORTAL_NAV.find(item => item.page === active)?.label ?? (route.page === 'settings' ? 'Tài khoản & thiết lập' : 'Không gian học tập');
  return <header className="portal-topbar"><span className="portal-breadcrumb">Không gian của bạn <span>/</span> <strong>{title}</strong></span><div className="portal-topbar-actions"><span className="portal-language">Tiếng Việt <span aria-hidden="true">🇻🇳</span></span><span className="portal-topbar-divider" /><button className="portal-profile-button" onClick={() => onNavigate('settings')} aria-label="Mở tài khoản và thiết lập"><span className="portal-avatar" aria-hidden="true">学</span><span>Người học HSK<small>Mục tiêu HSK {targetLevel}</small></span><span aria-hidden="true">⌄</span></button></div></header>;
}
