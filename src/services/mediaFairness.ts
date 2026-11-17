import type {SavedStudySession} from './studyStorage';
export const MEDIA_COMPENSATION_LIMIT_MS=300000;
export function mediaPauseBudget(s:SavedStudySession,now=Date.now()){
 const elapsedMs=s.audioPausedAt?Math.max(0,now-Date.parse(s.audioPausedAt)):0;
 return {elapsedMs,allowed:elapsedMs+(s.pausedDurationMs??0)<=MEDIA_COMPENSATION_LIMIT_MS};
}
export function beginMediaPause<T extends SavedStudySession>(s:T,reason:'audio'|'image',now=Date.now()):T{
 return s.mode!=='timed'||s.audioPausedAt?s:{...s,audioPausedAt:new Date(now).toISOString(),mediaPauseReason:reason};
}
export function resumeMediaPause<T extends SavedStudySession>(s:T,now=Date.now()):T{
 if(!s.audioPausedAt)return s;const {elapsedMs,allowed}=mediaPauseBudget(s,now);if(!allowed)return s;
 const extend=(v:string|undefined)=>v?new Date(Date.parse(v)+elapsedMs).toISOString():undefined;
 return {...s,audioPausedAt:undefined,mediaPauseReason:undefined,mediaRecoveryRequired:undefined,pausedDurationMs:(s.pausedDurationMs??0)+elapsedMs,deadlineAt:extend(s.deadlineAt),sectionDeadlineAt:extend(s.sectionDeadlineAt)};
}
