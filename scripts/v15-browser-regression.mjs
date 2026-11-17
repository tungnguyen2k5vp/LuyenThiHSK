import {cp,mkdir,readFile,writeFile,readdir,symlink} from 'node:fs/promises';
import {preview} from 'vite';import {spawn} from 'node:child_process';import path from 'node:path';
import {withV15Api} from './v15-isolated-api.mjs';import {digest} from '../shared/v5-quality.mjs';
const root=process.cwd(),workspace=path.resolve('.tmp/v15-browser-'+Date.now()),out='data/reports/v15/browser-'+Date.now();await mkdir(workspace,{recursive:true});await mkdir(out,{recursive:true});
const before=process.argv.includes('--before'),fallbackV14=process.argv.includes('--v14-fallback');
const baseline=JSON.parse(await readFile('data/reports/v15/baseline.json','utf8'));
const integrated=!process.argv.includes('--compatibility'),performance=process.argv.includes('--performance');
for(const item of ['scripts','dist','shared','server','src','package.json'])await cp(before&&item==='dist'?path.join(baseline.backup,'dist'):item,path.join(workspace,item),{recursive:true});await symlink(path.resolve('node_modules'),path.join(workspace,'node_modules'),'junction');
await mkdir(path.join(workspace,'.runtime'),{recursive:true});const transformations=[];
await withV15Api(async({runtime,url})=>{
 await cp(path.join(runtime,'admin-access.txt'),path.join(workspace,'.runtime/admin-access.txt'));
 const apiOrigin=new URL(url).origin;
 async function rewrite(dir){for(const e of await readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())await rewrite(f);else if(/\.(mjs|js)$/.test(f)){const before=await readFile(f,'utf8'),after=before.replaceAll('http://127.0.0.1:8787',apiOrigin);if(before!==after){await writeFile(f,after);transformations.push({file:path.relative(workspace,f).replaceAll('\\','/'),before:digest(before),after:digest(after),reason:'QA-only API port isolation; product files unchanged'});}}}}
 await rewrite(path.join(workspace,'scripts'));await rewrite(path.join(workspace,'dist'));
 // Use the same Vite preview server as the running app, including its asset/MIME/cache behavior.
 const previewServer=await preview({root:workspace,configFile:false,logLevel:'silent',preview:{host:'127.0.0.1',port:0,proxy:{'/api':{target:apiOrigin,changeOrigin:true}}}}),server=previewServer.httpServer;
 const testUrl='http://127.0.0.1:'+server.address().port,results=[];
 try{for(const browser of (process.argv.includes('--edge-only')?['edge']:['chrome','edge'])){
  const env={...process.env,HSK_TEST_URL:testUrl};delete env.HSK_BROWSER_PATH;if(browser==='edge')env.HSK_BROWSER_PATH='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
  const child=spawn(process.execPath,['scripts/exam-browser-check.mjs',before||fallbackV14?'--v14':integrated?'--v15':'--v13',...(performance?['--v15-perf']:[])],{cwd:workspace,env,windowsHide:true,stdio:['ignore','pipe','pipe']});let log='';child.stdout.on('data',b=>{log+=b;process.stdout.write(b)});child.stderr.on('data',b=>{log+=b;process.stderr.write(b)});const exitCode=await new Promise((r,j)=>{child.on('exit',r);child.on('error',j)});await writeFile(out+'/'+browser+'.log',log);try{await cp(path.join(workspace,'data/reports/v15/performance-progress.json'),out+'/'+browser+'-last-probe.json')}catch{}
  const result={browser,exitCode,status:exitCode===0?'PASS':'FAIL'};try{result.details=JSON.parse(await readFile(path.join(workspace,before||fallbackV14?'data/reports/v14/ui-browser-'+browser+'.json':integrated?'data/reports/v15/ui-browser-'+browser+'.json':'data/reports/v13/browser-'+browser+'.json'),'utf8'))}catch{}results.push(result);if(performance){try{await cp(path.join(workspace,'data/reports/v15/performance-'+browser+'.json'),'data/reports/v15/performance-'+browser+'.json')}catch{}}
  if(exitCode){try{await cp(path.join(workspace,'data/reports/v15/failures'),out+'/failures',{recursive:true})}catch{}}
  if(exitCode){try{const response=await fetch(url+'health',{signal:AbortSignal.timeout(3000)});result.apiHealthAfterFailure={status:response.status,body:await response.json()}}catch(error){result.apiHealthAfterFailure={error:String(error)}}}
  try{await cp(path.join(workspace,before||fallbackV14?'docs/screenshots/v14/after-'+browser:integrated?'docs/screenshots/v15/after-'+browser:'docs/screenshots/v13/'+browser),'docs/screenshots/v15/'+(before?'before-':fallbackV14?'fallback-v14-':integrated?'after-':'compatibility-')+browser,{recursive:true})}catch{}
  await writeFile('data/reports/v15/'+(before?'before-browser':fallbackV14?'fallback-v14-browser':integrated?'integrated-browser':'browser-regression')+'.json',JSON.stringify({at:new Date().toISOString(),status:results.some(r=>r.exitCode)?'FAIL':results.length===(process.argv.includes('--edge-only')?1:2)?'PASS':'RUNNING',scope:before?'Frozen pre-V15 dist; current read-only API against V15 baseline DB clone':integrated?'V15 reusing V14 Catalog/Intro/Room with existing owners; isolated API/profile':'V13 compatibility after V14 logic/backend additions; isolated API, browser profiles and dist copy. Not V14 visual acceptance.',workspace,logs:out,transformations,results},null,2));if(exitCode){process.exitCode=1;break}
 }}finally{await new Promise(r=>server.close(r));}
});
console.log('V14 compatibility browser run finished; source root '+root);
