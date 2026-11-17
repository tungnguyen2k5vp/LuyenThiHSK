import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {writeFile} from 'node:fs/promises';
const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const m=await server.ssrLoadModule('/src/services/mediaFairness.ts');const at=Date.parse('2026-10-16T00:00:00Z'),iso=n=>new Date(n).toISOString();
const session={mode:'timed',deadlineAt:iso(at+60000),sectionDeadlineAt:iso(at+30000),answers:{0:'B'},pausedDurationMs:0};
const paused=m.beginMediaPause(session,'image',at);assert.equal(paused.audioPausedAt,iso(at));assert.deepEqual(paused.answers,session.answers);
assert.equal(m.beginMediaPause(paused,'audio',at+9000).audioPausedAt,paused.audioPausedAt);
const resumed=m.resumeMediaPause(paused,at+20000);assert.equal(resumed.audioPausedAt,undefined);assert.equal(Date.parse(resumed.sectionDeadlineAt),at+50000);assert.equal(resumed.pausedDurationMs,20000);
assert.deepEqual(m.resumeMediaPause(resumed,at+30000),resumed);
const reloaded=JSON.parse(JSON.stringify(paused));assert.equal(m.mediaPauseBudget(reloaded,at+20000).allowed,true);assert.equal(m.mediaPauseBudget(reloaded,at+301000).allowed,false);assert.equal(m.resumeMediaPause(reloaded,at+301000).audioPausedAt,paused.audioPausedAt);
const previous={...session,pausedDurationMs:290000};assert.equal(m.mediaPauseBudget(m.beginMediaPause(previous,'audio',at),at+11000).allowed,false);
assert.equal(m.beginMediaPause({...session,mode:'practice'},'image',at).audioPausedAt,undefined);
const legacy={...session,audioPausedAt:iso(at)};assert.equal(m.resumeMediaPause(legacy,at+2000).pausedDurationMs,2000);
assert.equal(m.mediaPauseBudget(paused,at-1000).elapsedMs,0);
await writeFile('data/reports/v7/media-policy-tests.json',JSON.stringify({at:new Date().toISOString(),status:'PASS',cases:12,policy:'Persisted cumulative 300s automatic compensation. Beyond budget: suspend, preserve answers, exit or switch to untimed practice; never silently consume time.'},null,2));console.log('PASS media fairness 12 cases');
}finally{await server.close();}
