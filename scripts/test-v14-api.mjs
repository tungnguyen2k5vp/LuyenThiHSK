import assert from 'node:assert/strict';import {writeFile,readFile} from 'node:fs/promises';import {DatabaseSync} from 'node:sqlite';import {withV14Api} from './v14-isolated-api.mjs';import {digest} from '../shared/v5-quality.mjs';
let assertions=0;const check=f=>{f();assertions++};
await withV14Api(async({request,runtime})=>{
 const expectStatus=async(route,status,input,authenticated=true)=>{const r=await request(route,input,authenticated);check(()=>assert.equal(r.status,status));};
 const db=new DatabaseSync(runtime+'/hsk-content.sqlite',{readOnly:true}),tables=db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(x=>x.name),fingerprint=()=>digest(tables.map(t=>[t,db.prepare('SELECT * FROM "'+t+'" ORDER BY rowid').all()])),before=fingerprint();
 try{
  check(()=>assert.ok(!runtime.startsWith(process.cwd()+'/.runtime')));
  const denied=await request('admin/v14/catalog',null,false);check(()=>assert.equal(denied.status,401));
  const r=await request('admin/v14/catalog');check(()=>assert.equal(r.status,200,JSON.stringify(r.data)));const data=r.data;
  check(()=>assert.equal(data.scope,'privatePreview'));check(()=>assert.equal(data.secureExam,false));check(()=>assert.equal(data.total,data.cards.length));check(()=>assert.equal(data.cards.filter(c=>c.level==='1').length,2));check(()=>assert.equal(data.publiclyReleasable,0));
  for(const card of data.cards){check(()=>assert.equal(card.published,false));check(()=>assert.equal(card.humanReviewed,false));check(()=>assert.equal(card.questionCount,card.sections.reduce((n,s)=>n+s.questionCount,0)));check(()=>assert.equal(/"(correctAnswer|correctOptionId|acceptedAnswers|promptZh|transcript|storageUrl)"\s*:/.test(JSON.stringify(card)),false));}
  const h2=data.cards.find(c=>c.level==='2');check(()=>assert.equal(h2.canStart,false));check(()=>assert.equal(h2.launch,null));check(()=>assert.ok(h2.reasons.some(s=>s.startsWith('AUDIO_NOT_READY:'))));
  const filtered=await request('admin/v14/catalog?level=2&status=blocked');check(()=>assert.equal(filtered.data.cards.length,1));check(()=>assert.equal(filtered.data.filteredTotal,1));
  await expectStatus('admin/v14/catalog?level=999',422);
  const intro=await request('admin/v14/intro?id='+data.cards[0].id);check(()=>assert.equal(intro.status,200));check(()=>assert.equal(intro.data.exam.id,data.cards[0].id));check(()=>assert.equal(intro.data.secureExam,false));
  await expectStatus('admin/v14/intro?id=invalid',404);await expectStatus('admin/v14/catalog',405,{});
  await expectStatus('public/v14/catalog',404,null,false);
  for(const card of data.cards.filter(c=>c.canStart)){const built=await request(card.launch.route,card.launch.body);check(()=>assert.equal(built.status,200));const payload=built.data.exam??built.data.payload;check(()=>assert.ok(payload));check(()=>assert.equal(payload.questions.length,card.questionCount));check(()=>assert.deepEqual(payload.questions.map(q=>({id:q.id,revision:q.revision})),card.questionRevisions));}
  check(()=>assert.equal(fingerprint(),before));
  await writeFile('data/reports/v14/catalog-snapshot.json',JSON.stringify(data,null,2));
  await writeFile('data/reports/v14/api-tests.json',JSON.stringify({at:new Date().toISOString(),status:'PASS',assertions,scope:'Isolated full V14 baseline clone; authenticated read-only metadata, filters, no keys, blocked HSK2, existing HSK1 launch and exact revisions',isolatedRuntime:runtime,mutationInClone:false,mainDatabaseWrites:false,baseline:JSON.parse(await readFile('data/reports/v14/baseline.json','utf8')).at},null,2));
 }finally{db.close()}
});console.log(JSON.stringify({status:'PASS',assertions}));
