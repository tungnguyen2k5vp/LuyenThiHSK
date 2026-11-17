import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

// Uses the existing REA installation and an isolated browser profile per case.
const output='.runtime/motion-20261026',base='http://127.0.0.1:4173/';
fs.mkdirSync(output,{recursive:true});
const css=selector=>({kind:'css',selector});
const wait=(step_id,selector)=>({step_id,action:'wait_for',locator:css(selector),state:'visible',timeout_ms:15000});
const click=(step_id,selector)=>({step_id,action:'click',locator:css(selector),timeout_ms:10000});
const settle={step_id:'animation_complete',action:'wait_for_timeout',duration_ms:1700};
const toneSteps=[wait('loaded','.tone-explorer'),click('rising','.tone-options button >> nth=1'),wait('rising_hint','.tone-caption h4:has-text("Thanh 2")'),{step_id:'keyboard_falling',action:'press',locator:css('.tone-options button >> nth=3'),key:'Enter',timeout_ms:10000},wait('falling_hint','.tone-caption h4:has-text("Thanh 4")'),click('dipping','.tone-options button >> nth=2'),wait('dipping_hint','.tone-caption h4:has-text("Thanh 3")'),click('replay','.tone-actions button:has-text("Xem lại đường nét")'),settle];
const cases=[
 {name:'home-desktop',width:1440,height:1000,query:'',actions:[wait('loaded','.journey-visual svg'),settle]},
 {name:'home-mobile',width:390,height:844,query:'',actions:[wait('loaded','.journey-tone-link'),settle]},
 {name:'tones-desktop',width:1440,height:1000,query:'',actions:[wait('entry','.journey-tone-link'),click('open_lesson','.journey-tone-link'),...toneSteps]},
 {name:'tones-mobile',width:390,height:844,query:'?view=learn',actions:[...toneSteps,wait('pairs','.foundation-card >> nth=9'),click('radicals','button:has-text("Bộ thủ · 50")'),wait('radicals_kept','.foundation-card >> nth=49'),click('back_to_pinyin','button:has-text("Pinyin · 10")'),wait('tone_still_available','.tone-explorer'),click('dipping_again','.tone-options button >> nth=2'),{...settle,step_id:'animation_complete_again'}]},
 {name:'tones-reduced-motion',width:320,height:740,query:'?view=learn',motion:'reduce',actions:toneSteps},
];
const rows=[];
for(const c of cases){
 const path=output+'/'+c.name,scenario={browser:{mode:'launch',executable_path:'C:/Program Files/Google/Chrome/Application/chrome.exe'},environment:{locale:'vi-VN',timezone:'Asia/Bangkok',viewport:{width:c.width,height:c.height},reduced_motion:c.motion??'no-preference'},start_url:{url:base+c.query},actions:c.actions,capture:{after_each_step:['url','accessibility'],at_end:['url','accessibility','screenshot'],events:['console']}};
 fs.writeFileSync(path+'-scenario.json',JSON.stringify(scenario,null,2));
 const run=spawnSync(process.execPath,['../Rea-HSK-Reference/scripts/rea.mjs','capture-browser-scenario',path+'-scenario.json','--format','json','--full-output'],{encoding:'utf8',timeout:90000,maxBuffer:16*1024*1024});
 fs.writeFileSync(path+'-evidence.json',run.stdout??'');
 assert.equal(run.status,0,c.name+' CLI: '+run.stderr);
 const envelope=JSON.parse(run.stdout);assert.equal(envelope.ok,true,c.name+' failed');
 const result=envelope.data.normalized_result;
 for(const s of result.steps)assert.equal(s.status,'completed',c.name+' '+s.step_id+' '+JSON.stringify(s.error));
 assert.equal(result.events.items.filter(e=>e.kind==='console'&&e.level==='error').length,0,c.name+' console errors');
 const last=result.steps.at(-1),text=last.artifacts.accessibility.value.text;
 if(c.name.startsWith('tones-')){assert(text.includes('Thanh 3 · Xuống rồi lên'));assert(text.includes('马'));assert(text.includes('không đo hay chấm giọng nói'));}
 else assert(text.includes('Khám phá 4 thanh điệu'));
 assert(last.artifacts.screenshot.value.data_base64);fs.writeFileSync(path+'.png',Buffer.from(last.artifacts.screenshot.value.data_base64,'base64'));
 rows.push({name:c.name,result:'PASS',viewport:[c.width,c.height],reducedMotion:scenario.environment.reduced_motion,steps:result.steps.length,evidence:path+'-evidence.json',screenshot:path+'.png'});
 console.log(c.name+' PASS');
}
const report={result:'PASS',date:'2026-10-26',scope:'Decorative home motion and interactive tone illustration; no grading/data changes',speech:'Existing device TTS reused; Mandarin voice availability not guaranteed or asserted by this check',rows};
fs.writeFileSync(output+'/check.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({result:'PASS',scenarios:rows.length,steps:rows.reduce((n,r)=>n+r.steps,0),report:output+'/check.json'}));
