import assert from 'node:assert/strict';import {readFile,writeFile} from 'node:fs/promises';import {DatabaseSync} from 'node:sqlite';import {createHash} from 'node:crypto';
import {latestContentRows,publicContentRows} from '../server/content-reads.mjs';
import {requestContentJson,contentApiUrl} from '../src/services/localApi.ts';
import {previewImageBlob} from '../src/services/previewImages.ts';
import {uiV14Feature,uiV15Feature} from '../src/services/uiV14Feature.ts';
import {contentReviewPlan,originalHsk2Drafts} from '../shared/v15-content-quality.mjs';
import {validateRegisteredQuestion} from '../shared/question-types.mjs';
import {withV15Api} from './v15-isolated-api.mjs';
const checks=[],check=(label,fn)=>{fn();checks.push(label)},sort=rows=>rows.map(r=>JSON.stringify(r)).sort();
const db=new DatabaseSync(':memory:');db.exec('CREATE TABLE content(id TEXT,revision INTEGER,status TEXT,payload TEXT,kind TEXT)');
for(const [id,statuses]of [['a',['PUBLISHED','DRAFT']],['b',['PUBLISHED','ARCHIVED']],['c',['DRAFT']],['d',['PUBLISHED','PUBLISHED']]])for(const [index,status]of statuses.entries())db.prepare('INSERT INTO content VALUES(?,?,?,?,?)').run(id,index+1,status,'{}','questions');
check('Grouped latest query returns one current revision per ID',()=>assert.deepEqual(latestContentRows(db).map(r=>[r.id,r.revision]).sort(),[['a',2],['b',2],['c',1],['d',2]]));
check('Publication projection preserves older Published / latest Archived semantics',()=>assert.deepEqual(publicContentRows(db).map(r=>[r.id,r.revision]).sort(),[['a',1],['d',2]]));db.close();
const baseline=JSON.parse(await readFile('data/reports/v15/baseline.json','utf8')),snapshot=new DatabaseSync(baseline.backup+'/hsk-content.sqlite',{readOnly:true});
const legacyLatest="SELECT c.* FROM content c WHERE c.revision=(SELECT MAX(x.revision) FROM content x WHERE x.id=c.id)",legacyPublic="SELECT c.* FROM content c WHERE c.status='PUBLISHED' AND c.revision=(SELECT MAX(x.revision) FROM content x WHERE x.id=c.id AND x.status='PUBLISHED') AND (SELECT status FROM content x WHERE x.id=c.id ORDER BY revision DESC LIMIT 1)!='ARCHIVED'";
const timings={};for(const [label,old,current]of [['latest',legacyLatest,latestContentRows],['public',legacyPublic,publicContentRows]]){
 const start=performance.now(),before=snapshot.prepare(old).all(),beforeMs=performance.now()-start,next=performance.now(),after=current(snapshot),afterMs=performance.now()-next;
 check('Real snapshot '+label+' rows exactly equivalent',()=>assert.deepEqual(sort(before),sort(after)));timings[label]={beforeMs,afterMs,rows:after.length,scope:'Read-only identical snapshot, single query measurement; not browser cold-load'};
}snapshot.close();
globalThis.location={hostname:'127.0.0.1',search:'?ui=v15'};
check('Private Preview defaults to V15 and preserves explicit V14 fallback',()=>{assert.ok(uiV14Feature('?ui=v15').enabled);assert.ok(uiV15Feature('?ui=v15'));assert.ok(uiV14Feature('?view=preview').enabled);assert.ok(uiV15Feature('?view=preview'));assert.ok(uiV14Feature('?view=preview&ui=v14').enabled);assert.equal(uiV15Feature('?view=preview&ui=v14'),false);assert.equal(uiV14Feature('').enabled,false);assert.equal(contentApiUrl('admin/v15/catalog'),'/api/admin/v15/catalog')});
globalThis.location.search='?ui=v14';check('V14 explicit fallback retains its API URL',()=>assert.equal(contentApiUrl('health'),'http://127.0.0.1:8787/api/health'));
const refs=JSON.parse(await readFile('data/reports/v14/practice-snapshot.json','utf8')),drafts=originalHsk2Drafts(refs.referenceWords);
check('Original HSK2 staged drafts keep real grammar/word references and strict review gates',()=>{assert.equal(drafts.lessons.length,2);assert.equal(drafts.questions.length,10);for(const q of drafts.questions){assert.equal(validateRegisteredQuestion(q).length,0);assert.equal(q.reviewStatus,'NEEDS_REVIEW');assert.equal(q.sourceType,'AI_GENERATED');assert.ok(q.vocabularyIds.length);assert.ok(q.grammarIds.every(id=>refs.referenceGrammar.some(g=>g.id===id)));assert.ok(q.vocabularyIds.every(id=>refs.referenceWords.some(w=>w.id===id)));assert.equal(q.humanReview.status,'BLOCKED_FOR_HUMAN_REVIEW')}assert.equal(drafts.publicationAllowed,false)});
check('Review gap calculation is revision aware and never grants approval',()=>{const plan=contentReviewPlan(drafts.questions,refs.referenceGrammar);assert.ok(plan.questions.every(q=>q.findings.includes('HUMAN_REVIEW_REQUIRED')));assert.equal(plan.publicationAllowed,false)});
const originalFetch=globalThis.fetch;let calls=0;
try{
 globalThis.fetch=async()=>new Response(JSON.stringify({error:'PRIVATE_CONTENT_REQUIRED'}),{status:401});
 await assert.rejects(()=>requestContentJson('unit:401'),/PRIVATE_CONTENT_REQUIRED/);checks.push('HTTP auth failure is surfaced without retrying a write');
 globalThis.fetch=async(_url,{signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')),{once:true}));
 await assert.rejects(()=>requestContentJson('unit:timeout',{},15),/Kết nối quá thời gian/);checks.push('Hung request aborts with a recoverable timeout message');
 const blob=new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'],{type:'image/svg+xml'}),hash=createHash('sha256').update(await blob.text()).digest('hex');
 globalThis.fetch=async()=>{calls++;return new Response(blob)};
 const signal=new AbortController().signal;await previewImageBlob('unit:image','fixture-a',hash,signal);await previewImageBlob('unit:image','fixture-a',hash,signal);
 check('Repeated immutable image uses bounded private memory cache',()=>assert.equal(calls,1));await previewImageBlob('unit:image','fixture-b',hash,signal);check('Credential scope change cannot reuse previous private cache',()=>assert.equal(calls,2));await previewImageBlob('unit:image','fixture-b',hash,signal,true);check('Explicit retry bypasses image cache',()=>assert.equal(calls,3));
 await assert.rejects(()=>previewImageBlob('unit:bad','fixture-b','0'.repeat(64),signal),/checksum/);checks.push('Corrupted bytes rejected before cache or display');
}finally{globalThis.fetch=originalFetch}
await withV15Api(async({request})=>{
 for(const route of ['admin/v15/catalog','admin/v15/intro?id=v15-hsk1-mini-mixed'])check('Anonymous '+route+' denied',()=>{}),assert.equal((await request(route,null,false)).status,401);
 assert.equal((await request('admin/v15/catalog',{})).status,405);checks.push('V15 catalog is read only');
 const catalog=await request('admin/v15/catalog');assert.equal(catalog.status,200);const cards=catalog.data.cards;
 check('Existing full candidates plus actual skill/mini candidates',()=>{assert.equal(cards.filter(c=>c.level==='1').length,5);assert.equal(cards.filter(c=>c.category==='skill').length,2);assert.equal(cards.filter(c=>c.category==='short').length,1);assert.equal(cards.find(c=>c.level==='2').launch,null)});
 for(const card of cards.filter(c=>c.launch)){
  const built=await request(card.launch.route,card.launch.body);assert.equal(built.status,200);assert.equal(built.data.payload.questions.length,card.questionCount);assert.deepEqual(built.data.payload.questions.map(q=>({id:q.id,revision:q.revision})),card.questionRevisions);checks.push(card.id+' metadata matches real immutable builder');
 }
 check('Catalog metadata excludes private answer keys',()=>assert.equal(/correctAnswer|promptZh|transcriptZh/.test(JSON.stringify(cards)),false));
 assert.equal((await request('admin/v15/catalog?level=9')).status,422);checks.push('Invalid level filter rejected');
});
await writeFile('data/reports/v15/logic-tests.json',JSON.stringify({at:new Date().toISOString(),status:'PASS',checks,timings,scope:'Disposable API/database; no main learner records modified'},null,2));console.log('PASS V15 '+checks.length+' checks '+JSON.stringify(timings));
