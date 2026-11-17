import assert from 'node:assert/strict';import {writeFile,readFile} from 'node:fs/promises';import {withV14Api} from './v14-isolated-api.mjs';
import {request as httpRequest} from 'node:http';
import {createServer as createViteServer} from 'vite';
const checks=[];const check=(label,condition)=>{assert.ok(condition,label);checks.push(label)};
await withV14Api(async({request,url})=>{
 const host=new URL(url).origin;
 check('Unauthenticated private catalog denied',(await request('admin/v14/catalog',null,false)).status===401);
 check('Unauthenticated private intro denied',(await request('admin/v14/intro?id=x',null,false)).status===401);
 check('No public preview catalog route',(await request('public/v14/catalog',null,false)).status===404);
 check('Read-only metadata rejects POST',(await request('admin/v14/catalog',{})).status===405);
 check('Unknown private endpoint fails closed',(await request('admin/v14/unknown')).status===404);
 const hostile=await fetch(host+'/api/admin/v14/catalog',{headers:{Origin:'https://attacker.invalid'}});check('Foreign origin denied before processing',hostile.status===403);
 // Node fetch may replace Host. Use HTTP request to send the actual hostile header on the wire.
 const badHost=await new Promise((resolve,reject)=>{const r=httpRequest(host+'/api/admin/v14/catalog',{headers:{Host:'attacker.invalid'}},response=>{response.resume();resolve(response.statusCode)});r.on('error',reject);r.end()});check('Foreign Host denied',badHost===403);
 const data=await request('admin/v14/catalog'),json=JSON.stringify(data.data);check('Metadata has no raw questions or answer/transcript fields',!/(correctAnswer|correctOptionId|acceptedAnswers|sampleAnswer|promptZh|transcript|Bearer|admin-access)/.test(json));
 check('No secure-exam claim',data.data.secureExam===false);check('No public release claim',data.data.publiclyReleasable===0);
 const contract=await readFile('src/contracts/ui-v14.ts','utf8');check('No backend persistence/transport dependency in contract',!/^import .*from ['"].*(services|server|database|sqlite)/m.test(contract));
 const helper=await readFile('scripts/v14-isolated-api.mjs','utf8');check('QA helper uses independent runtime',helper.includes('mkdtemp')&&helper.includes('HSK_RUNTIME_DIR:runtime')&&helper.includes('delete env.HSK_ADMIN_TOKEN'));
});
const dev=await createViteServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false},logLevel:'silent'});
try{await dev.listen();const address=dev.httpServer.address(),origin='http://127.0.0.1:'+address.port;for(const resource of ['/data/reports/v14/practice-snapshot.json','/.runtime/admin-access.txt']){const r=await fetch(origin+resource);check('Vite dev blocks private file '+resource,r.status===403)}}finally{await dev.close()}
await writeFile('data/reports/v14/security.json',JSON.stringify({at:new Date().toISOString(),status:'PASS',checks,scope:'Static contract/fixture boundaries and isolated local HTTP; not a production penetration test or Auth/RLS verification',cloud:'NOT_DEPLOYED',secureExam:'NOT_IMPLEMENTED_SERVER_AUTHORITATIVE'},null,2));console.log(JSON.stringify({status:'PASS',checks:checks.length}));
