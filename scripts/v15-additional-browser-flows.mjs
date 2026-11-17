import assert from 'node:assert/strict';
export async function additionalV15Flows({rpc,evaluate,waitFor,navigate,click,store,shot,checks}){
 const open=async()=>{await navigate('view=preview&ui=v15');await waitFor('document.querySelectorAll(".v14-exam-card").length===2')};
 const start=async(reading)=>{await evaluate(`document.querySelectorAll(".v14-exam-card")[${reading?1:0}].click()`);await waitFor('document.querySelector(".v14-intro-container")');await evaluate('document.querySelector(".v14-rules-ack input").click()');await click('Bắt đầu làm bài');await waitFor('document.querySelector(".v14-modal-overlay")');if(reading)assert.ok(await evaluate('document.querySelector(".v14-modal-container h2").innerText.includes("Đọc")'));await click('Mình hiểu rồi');await waitFor('document.querySelector(".v14-room-host")')};
 for(const [tab,count,total]of [[1,2,5],[2,1,10]]){
  await open();await evaluate(`document.querySelectorAll('.v14-catalog-tab-btn')[${tab}].click()`);await waitFor(`document.querySelectorAll('.v14-exam-card').length===${count}`);await shot(tab===1?'v15-skill-catalog':'v15-mini-catalog');await start(tab===1);
  const data=await store();assert.equal(data.sessions[0].examSnapshot.questions.length,total);assert.ok(data.sessions[0].examSnapshot.seed.startsWith('v15-hsk1-'));
  await evaluate(`document.querySelector('button[aria-label="Nộp bài thi"]').click()`);await waitFor('document.querySelector(".exam-dialog")');await click('Nộp bài và xem kết quả');await waitFor('document.querySelector(".v14-result-host")');checks.push('V15 '+total+' question catalog candidate launches/submits through existing owner');
 }
 const before=await store();assert.equal(before.attempts.length,6);
 // Deterministic network fault: only an isolated QA profile; honor the real abort signal.
 await rpc('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{const original=window.fetch;window.fetch=(url,init)=>{if(String(url).includes('/v15/catalog')&&sessionStorage.getItem('qa-v15-hang-catalog'))return new Promise((_,reject)=>init.signal.addEventListener('abort',()=>reject(new DOMException('QA timed out','AbortError')),{once:true}));return original(url,init)}})()`});
 await evaluate(`sessionStorage.setItem('qa-v15-hang-catalog','1')`);await navigate('view=preview&ui=v15');await waitFor('document.querySelector(".v14-catalog-error")');assert.ok(await evaluate(`document.querySelector('.v14-catalog-error').innerText.includes('quá thời gian')`));await shot('v15-catalog-timeout-recovery');
 await evaluate(`sessionStorage.removeItem('qa-v15-hang-catalog')`);await click('Thử lại danh mục đề');await waitFor('document.querySelectorAll(".v14-exam-card").length===2');assert.deepEqual((await store()).attempts,before.attempts);checks.push('Catalog hung request times out visibly and explicit retry recovers without losing attempts');
 const reloads=[];
 for(let i=0;i<5;i++){const start=Date.now();await rpc('Page.reload');await waitFor('document.querySelectorAll(".v14-exam-card").length===2');reloads.push(Date.now()-start);assert.equal((await store()).attempts.length,6)}
 checks.push('Five real Catalog reloads preserve all six isolated attempts');
 const privateCacheEntries=await evaluate(`(async()=>{const names=await caches.keys(),entries=await Promise.all(names.map(async name=>(await (await caches.open(name)).keys()).map(r=>r.url)));return entries.flat().filter(url=>new URL(url).pathname.startsWith('/api/'))})()`);assert.deepEqual(privateCacheEntries,[]);checks.push('Service worker cache contains no private API responses');
 for(const width of [320,375,768,1024,1440]){await rpc('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<768});assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'Catalog overflow '+width);if([320,768,1440].includes(width))await shot('v15-catalog-width-'+width)}
 checks.push('Catalog fits 320/375/768/1024/1440 widths');
 await evaluate('document.querySelector(".v14-exam-card").click()');await waitFor('document.querySelector(".v14-intro-container")');await rpc('Emulation.setDeviceMetricsOverride',{width:320,height:900,deviceScaleFactor:1,mobile:true});assert.ok(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'Intro overflow320');await shot('v15-intro-width-320');checks.push('Intro acknowledgement and mode controls fit 320px');
 await rpc('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 return {catalogReloadMs:reloads,attemptCount:6};
}
