import {writeFile,mkdir} from 'node:fs/promises';
export async function pairedPaintProbe(evaluate,kind,rpc){
 await mkdir('data/reports/v14',{recursive:true});
 const samples={v13:[],v14:[]};
 for(let i=-1;i<20;i++)for(const variant of i%2===0?['v13','v14']:['v14','v13']){
  await rpc('Page.bringToFront');
  await writeFile('data/reports/v14/performance-progress.json',JSON.stringify({at:new Date().toISOString(),kind,variant,index:i,status:'STARTED'}));
  const value=await evaluate(`(async()=>{
   const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   const ready=async()=>{const end=performance.now()+10000;while(document.querySelector('.question-image-placeholder')||[...document.querySelectorAll('.room-question img')].some(i=>!i.complete||!i.naturalWidth)){if(performance.now()>end)throw Error('Media did not settle in performance probe');await frame()}await frame()};
   const button=(scope,text)=>[...document.querySelectorAll(scope)].find(b=>b.getClientRects().length&&!b.disabled&&b.textContent.trim()===text);
   const u=new URL(location.href);u.searchParams.set('ui',${JSON.stringify(variant)});history.replaceState(null,'',u);
   if(${JSON.stringify(kind)}==='result'){
    button('.filter-tabs button','Sai').click();await frame();button('.filter-tabs button','Tất cả').click();await frame();
   }else{
    document.querySelector('.question-header button').click();await frame();document.querySelector('.question-header button').click();await ready();
   }
   const start=performance.now();
   if(${JSON.stringify(kind)}==='navigation'){
    button('.room-controls button','Câu sau').click();await ready();button('.room-controls button','Câu trước').click();await ready();
   }else if(${JSON.stringify(kind)}==='choices'){
    const choices=()=>[...document.querySelectorAll('.room-question .v14-matching-option-btn,.room-question .exam-choice')].filter(b=>!b.disabled&&b.getAttribute('aria-disabled')!=='true');
    if(choices().length<2)throw Error('Two real choices required');choices()[1].click();await frame();choices()[0].click();await frame();
   }else{
    button('.filter-tabs button','Chưa chấm').click();await frame();button('.filter-tabs button','Tất cả').click();await frame();
   }
   return performance.now()-start;
  })()`);
  if(i>=0)samples[variant].push(value);
  await writeFile('data/reports/v14/performance-progress.json',JSON.stringify({at:new Date().toISOString(),kind,variant,index:i,status:'COMPLETE',durationMs:value}));
 }
 await evaluate(`(async()=>{const u=new URL(location.href);u.searchParams.set('ui','v14');history.replaceState(null,'',u);const frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));if(${JSON.stringify(kind)}==='result'){const button=text=>[...document.querySelectorAll('.filter-tabs button')].find(b=>b.textContent.trim()===text);button('Sai').click();await frame();button('Tất cả').click();await frame()}else{document.querySelector('.question-header button').click();await frame();document.querySelector('.question-header button').click();await frame()}})()`);
 const percentile=(values,p)=>[...values].sort((a,b)=>a-b)[Math.ceil(values.length*p)-1],baselineP95=percentile(samples.v13,.95),currentP95=percentile(samples.v14,.95),budgetMs=baselineP95+Math.max(20,baselineP95*.15);
 return{samples,baselineP95,currentP95,budgetMs,status:currentP95<=budgetMs?'WITHIN':'ATTENTION',scope:'20 alternating same-profile pairs after one warmup; same attempt/data/API, two real actions and 2 RAF paint proxy; not production Web Vitals'};
}
export async function writeV14Performance(browser,probes,resourceMs){
 const report={at:new Date().toISOString(),browser,status:Object.values(probes).every(p=>p.status==='WITHIN')?'WITHIN':'ATTENTION',probes,catalogResourceMs:resourceMs,catalogBaseline:'No equivalent V13 Catalog/Intro workflow. Fetch resource duration is unpaired descriptive evidence.',scope:'Navigation includes real image loading; choices include matching/shared options; completed result filters; existing validation retained'};
 await writeFile('data/reports/v14/performance-'+browser+'.json',JSON.stringify(report,null,2));return report;
}
