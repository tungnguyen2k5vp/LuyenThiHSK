import {readFile,writeFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {performance} from 'node:perf_hooks';
import {digest} from '../shared/v5-quality.mjs';
const b=JSON.parse(await readFile('data/reports/v13/baseline.json','utf8')),trials=Number(process.env.HSK_V13_PROFILE_TRIALS??20),samples={A:[],B:[]},sql={A:[],B:[]},payloads={};
const database=new DatabaseSync(path.join(b.backup,'hsk-content.sqlite'),{readOnly:true});
async function services(source){const imports=await Promise.all([9,10,11,12].map(n=>import(pathToFileURL(path.resolve(source,'server/v'+n+'-content-service.mjs')).href))),stats={count:0,ms:0,rows:0},db={prepare(query){const statement=database.prepare(query);return new Proxy(statement,{get(target,key){if(key==='all')return (...args)=>{const t=performance.now(),rows=target.all(...args);stats.count++;stats.ms+=performance.now()-t;stats.rows+=rows.length;return rows;};const value=target[key];return typeof value==='function'?value.bind(target):value;}});}},deny=()=>{throw Error('Read-only profiling cannot mutate records');},common={db,root:path.resolve(b.backup),runtime:path.resolve(b.backup,'.runtime'),addRecord:deny,reviewers:[],v7:{guard:()=>false},v3:{recordAudit:deny}},v9=imports[0].createV9Service(common),v10=imports[1].createV10Service({...common,v9}),v11=imports[2].createV11Service({...common,v10}),v12=imports[3].createV12Service({...common,v11});return {v12,stats};}
const variants={A:await services(b.backup),B:await services('.')};
try{
 for(const key of ['A','B'])await variants[key].v12.practice();
 // Alternate order in every pair to reduce warm-up/order bias. No browser/QA concurrently.
 for(let i=0;i<trials;i++)for(const key of i%2?['B','A']:['A','B']){const {v12,stats}=variants[key];stats.count=stats.ms=stats.rows=0;const t=performance.now(),p=await v12.practice();samples[key].push(performance.now()-t);sql[key].push({...stats});const hash=digest(p);if(payloads[key]&&payloads[key]!==hash)throw Error('Non-deterministic practice output in '+key);payloads[key]=hash;}
 const q=(v,p)=>[...v].sort((a,b)=>a-b)[Math.ceil(v.length*p)-1],summary=Object.fromEntries(Object.entries(samples).map(([key,v])=>[key,{n:v.length,p50:q(v,.5),p95:q(v,.95),sqlCalls:sql[key][0].count,rowsDecoded:sql[key][0].rows,sqlP95:q(sql[key].map(s=>s.ms),.95)}])),samePayload=payloads.A===payloads.B;
 const report={at:new Date().toISOString(),status:samePayload?'PASS':'FAIL',variants:{A:'Frozen V12 services',B:'Current services'},summary,samples,sql,samePayload,payloads,scope:'In-process read-only practice service A/B on same frozen DB/source data/media, alternating pairs; no HTTP, browser, download or render measurement',inference:'SQL fetch cost measured separately; total also includes JSON parsing, reference IO and validation. This does not prove the cause of historical browser timing variance.'};
 await writeFile('data/reports/v13/service-performance.json',JSON.stringify(report,null,2));console.log(JSON.stringify({samePayload,summary}));if(!samePayload)process.exitCode=1;
}finally{database.close();}
