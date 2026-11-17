// Run with the local API and Vite preview running: node scripts/test-qkt-workspace.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {chromium} from 'playwright-core';

const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const origin=process.env.HSK_TEST_ORIGIN??'http://127.0.0.1:4173';
const artifacts='.runtime/qkt-account-review';
await fs.mkdir(artifacts,{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'vi-VN',serviceWorkers:'block'}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const noOverflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page overflows horizontally: '+page.url());
 await page.goto(origin+'/?view=dashboard');
 await page.getByRole('group',{name:'Chọn cấp học',exact:true}).getByRole('button',{name:'HSK 3',exact:true}).click();
 await page.getByRole('link',{name:'Luyện HSK 3',exact:true}).click();
 const reading=page.locator('.journey-training-card').filter({has:page.getByRole('heading',{name:'Đọc hiểu',exact:true})});
 await reading.locator('button:not([disabled])').waitFor();
 assert.equal(new URL(page.url()).searchParams.get('level'),'HSK 3');
 await noOverflow();
 await reading.getByRole('button',{name:'Chọn bài luyện'}).click();
 await page.locator('.catalog-practice-card').first().waitFor();
 assert.equal(new URL(page.url()).searchParams.get('section'),'reading');
 assert.equal(new URL(page.url()).searchParams.get('type'),'multiple-choice');
 assert.equal(await page.locator('.catalog-editions button[aria-pressed=true]').innerText(),'HSK 3.0');
 await page.getByRole('searchbox').fill('no7z-hsk3-reading-01');
 const bank=page.locator('[data-bank-id="no7z-hsk3-reading-01"]');
 await bank.locator('.catalog-skill-actions button').click();
 await page.getByRole('button',{name:'Bắt đầu luyện',exact:true}).click();
 await page.getByRole('radio').first().click();
 await page.getByRole('button',{name:'Câu sau',exact:true}).click();
 await page.reload();
 await page.getByRole('button',{name:'Câu trước',exact:true}).click();
 assert.equal(await page.getByRole('radio',{checked:true}).count(),1,'Reload must retain the answer');
 await page.getByRole('button',{name:'Nộp bài',exact:true}).click();
 await page.getByRole('button',{name:'Nộp bài và xem kết quả',exact:true}).click();
 await page.locator('.attempt-result').waitFor();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('hsk-study-data-v1')));
 assert.equal(saved.attempts.length,1);assert.equal(saved.attempts[0].examSnapshot.questions.length,10);assert.equal(saved.sessions.length,0);
 await page.goto(origin+'/?view=dashboard');
 await page.locator('.journey-history-row').first().waitFor();
 await page.locator('.journey-history-row').first().click();
 await page.locator('.attempt-result').waitFor();
 await page.goto(origin+'/?view=practice&version=hsk2&level=HSK%204');
 const oldReading=page.locator('.journey-training-card').filter({has:page.getByRole('heading',{name:'Đọc hiểu',exact:true})});
 await oldReading.locator('button:not([disabled])').waitFor();await oldReading.locator('button').click();
 await page.locator('.catalog-practice-card').first().waitFor();
 assert.equal(await page.locator('.catalog-editions button[aria-pressed=true]').innerText(),'HSK 2.0');
 assert((await page.locator('.catalog-practice-card .card-kicker').allTextContents()).every(t=>t.includes('HSK 2.0')));
 await page.goto(origin+'/?view=vocab&level=HSK%203');
 const groups=page.locator('.course-small-groups');await groups.waitFor();
 await groups.locator('button').click();
 assert.equal(await groups.locator('select').inputValue(),'0');
 assert.equal(await page.locator('.course-items>article,.course-items>button').count(),20);
 await groups.locator('select').selectOption('1');
 assert.equal(await page.locator('.course-items>article,.course-items>button').count(),20);
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('hsk-study-data-v1')));
 assert.deepEqual(after.attempts,saved.attempts,'Navigation and group selection must preserve attempts');
 await page.goto(origin+'/?view=plan&version=hsk2&level=HSK%204');
 await page.locator('.onboarding').getByRole('button',{name:'Bỏ qua',exact:true}).click();
 await page.locator('.today-task').first().locator('.btn-secondary').click();
 assert.equal(new URL(page.url()).searchParams.get('level'),'HSK 1','Daily plan must use the target level instead of the browsed level');
 assert.equal(new URL(page.url()).searchParams.get('version'),'hsk3','The syllabus plan must retain its edition');
 for(const width of [390,760,1024,1440]){
  await page.setViewportSize({width,height:width===390?844:1000});
  for(const view of ['dashboard','practice','exams','vocab']){
   await page.goto(origin+'/?view='+view+'&level=HSK%203');
   await page.locator(view==='dashboard'?'.journey-course-heading':view==='practice'?'.journey-training-card button:not([disabled])':view==='exams'?'.catalog-practice-card':'.course-small-groups').first().waitFor();
   await noOverflow();
   if(width===390)await page.screenshot({path:artifacts+'/check-'+view+'-mobile.png',fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);
 await context.close();
 console.log('PASS workspace: level/edition/type routing, practice → reload → submit → history, vocabulary groups, daily-plan target, preserved attempts, no JS errors or horizontal overflow at 390/760/1024/1440px.');
}finally{await browser.close();}
