import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {buildV5Exam,createTokenizer,pcmMetrics,digest} from '../shared/v5-quality.mjs';
import {validatePreviewRelease} from '../shared/preview-content.mjs';
const b=JSON.parse(await readFile('data/staging/v5/hsk1-release.json','utf8'));let assertions=0;const check=(fn)=>{fn();assertions++;};
check(()=>assert.equal(validatePreviewRelease(b).errors.length,0));
const first=buildV5Exam(b,{seed:'batch-one',kind:'full'}),second=buildV5Exam(b,{seed:'batch-two',kind:'full',recentQuestionIds:first.questions.map(q=>q.id),recentPassageIds:first.questions.map(q=>q.passageId).filter(Boolean)});
check(()=>assert.equal(first.questions.length,40));check(()=>assert.deepEqual(first,buildV5Exam(b,{seed:'batch-one',kind:'full'})));check(()=>assert.equal(second.questions.filter(q=>first.questions.some(p=>p.id===q.id)).length,0));check(()=>assert.equal(second.selection.warnings.length,0));
for(const exam of [first,second]){check(()=>assert.equal(new Set(exam.questions.map(q=>q.id)).size,40));check(()=>assert.equal(exam.config.structureVerified,false));check(()=>assert.equal(exam.questions.filter(q=>q.skill==='listening').length,20));check(()=>assert.equal(exam.questions.filter(q=>q.skill==='reading').length,20));for(const q of exam.questions)check(()=>assert.equal(q.options.filter(o=>o.id===q.correctAnswer).length,1));}
const exhausted=buildV5Exam(b,{kind:'full',recentQuestionIds:b.questions.map(q=>q.id)});check(()=>assert.ok(exhausted.selection.warnings.length));
const g=buildV5Exam(b,{kind:'drill',grammarIds:['HSK30-2025-GRA-HSK1-00024']});check(()=>assert.ok(g.questions.every(q=>q.grammarIds.includes('HSK30-2025-GRA-HSK1-00024'))));
check(()=>assert.throws(()=>buildV5Exam(b,{grammarIds:['invalid']})));
const tiny=createTokenizer([{id:'1',simplified:'有',level:'1'},{id:'2',simplified:'时间',level:'1'},{id:'3',simplified:'有时',level:'2'}]);check(()=>assert.deepEqual(tiny('有时间').map(t=>t.text),['有','时间']));
for(const a of b.audio){const v=a.id.startsWith('v5-')?'v5':'v4',bytes=await readFile('.runtime/'+v+'-audio/'+a.id+'.wav');const m=pcmMetrics(bytes);check(()=>assert.equal(m.sha256,a.contentHash));check(()=>assert.equal(m.durationMs,a.durationMs));check(()=>assert.ok(Number.isFinite(m.rmsDbFS)));}
check(()=>assert.equal(digest(Buffer.from('abc')),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'));
const classified=JSON.parse(await readFile('data/reports/v5/v4-flags-classified.json','utf8'));check(()=>assert.equal(classified.items.length,64));check(()=>assert.ok([...b.words,...b.lessons,...b.questions,...b.audio].every(x=>x.reviewStatus==='NEEDS_REVIEW'&&x.humanReview.status==='BLOCKED_FOR_HUMAN_REVIEW')));
const report={at:new Date().toISOString(),bundle:b.version,assertions,status:'PASS',fullMockOverlap:0,first:first.lockedQuestions,second:second.lockedQuestions,note:'Automated technical checks only; no human language review'};await writeFile('data/reports/v5/'+b.version+'-tests.json',JSON.stringify(report,null,2));console.log('PASS V5 '+b.version+' '+assertions+' assertions; two mocks without overlap; PCM checks40; human0');
