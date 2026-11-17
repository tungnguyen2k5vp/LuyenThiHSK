import { HSKVersion, SkillType } from '../types';
export type ExamPage = 'dashboard' | 'plan' | 'learn' | 'practice' | 'review' | 'progress' | 'settings' | 'grammar' | 'hanzi' | 'personal' | 'diagnostic' | 'writing' | 'speaking' | 'admin' | 'content-review' | 'preview' | 'exams' | 'parts' | 'vocab' | 'mistakes' | 'history' | 'info';
export interface ExamRoute { page: ExamPage; version: HSKVersion; level: string; section: SkillType; type: string; session?: string; attempt?: string }
export function readExamRoute(search = window.location.search): ExamRoute {
  const query = new URLSearchParams(search);
  const page = query.get('view') ?? (typeof window!=='undefined'&&window.location?.pathname?.startsWith('/admin')?'admin':'dashboard');
  const section = query.get('section') ?? 'all';
  return { page: ['dashboard', 'plan', 'learn', 'practice', 'review', 'progress', 'settings', 'grammar', 'hanzi', 'personal', 'diagnostic', 'writing', 'speaking', 'admin', 'content-review', 'preview', 'exams', 'parts', 'vocab', 'mistakes', 'history', 'info'].includes(page) ? page as ExamPage : 'dashboard',
    version: query.get('version') === 'hsk2' ? 'hsk2' : 'hsk3',
    level: query.get('level') ?? 'all',
    section: ['all', 'listening', 'reading', 'writing', 'translation', 'speaking'].includes(section) ? section as SkillType : 'all',
    type: query.get('type') ?? 'all', session: query.get('session') ?? undefined, attempt: query.get('attempt') ?? undefined };
}
export function routeUrl(route: ExamRoute): string {
  const query = new URLSearchParams({ view: route.page, version: route.version, level: route.level, section: route.section });
  if (route.type !== 'all') query.set('type', route.type);
  if (route.session) query.set('session', route.session);
  if (route.attempt) query.set('attempt', route.attempt);
  return '?' + query.toString();
}
