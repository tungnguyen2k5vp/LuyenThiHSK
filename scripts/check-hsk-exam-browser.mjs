import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {randomBytes} from 'node:crypto';
import {mkdtemp,mkdir,readFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {chromium} from 'playwright-core';

// Real API + SQLite in a small isolated runtime. No live exam or community writes.
const root=fileURLToPath(new URL('..',import.meta.url));
const web=process.env.HSK_WEB_URL??'http://127.0.0.1:3000';
const runtime=await mkdtemp(path.join(root,'.runtime','hsk-exam-browser-'));
const screenshots=path.join(root,'.impeccable','review');await mkdir(screenshots,{recursive:true});
const socket=createServer();await new Promise(r=>socket.listen(0,'127.0.0.1',r));const port=socket.address().port;await new Promise(r=>socket.close(r));
const token=randomBytes(32).toString('hex'),api='http://127.0.0.1:'+port;
const server=spawn(process.execPath,['server/admin-server.mjs'],{cwd:root,env:{...process.env,HSK_RUNTIME_DIR:runtime,HSK_API_PORT:String(port),HSK_ADMIN_TOKEN:token},stdio:['ignore','pipe','pipe'],windowsHide:true});
let output='',browser,context,db,page,saveOffline=false,closing=false;
const errors=[];
server.stdout.on('data',chunk=>{output+=chunk;});server.stderr.on('data',chunk=>{output+=chunk;});
async function ready(){await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Isolated API startup timed out')),25000);const check=()=>{if(output.includes('HSK content API:')){clearTimeout(timeout);resolve();}};server.stdout.on('data',check);server.once('exit',code=>{clearTimeout(timeout);reject(Error('Isolated API exited: '+code));});check();});}
async function saved(p=page){await p.getByRole('status').filter({hasText:'Đã lưu trên máy chủ'}).waitFor();}
async function render(name,p=page){await p.screenshot({path:path.join(screenshots,name+'.png'),fullPage:true,timeout:45000});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+': no horizontal overflow');}
async function openExam(id){await page.goto(web+'/hsk?exam='+id,{waitUntil:'domcontentloaded'});await page.getByRole('heading',{name:'Sẵn sàng cho lượt luyện?'}).waitFor();}
async function start(){await page.getByRole('checkbox').check();const response=page.waitForResponse(r=>r.url().includes('/start')&&r.request().method()==='POST');await page.getByRole('button',{name:'Bắt đầu làm bài',exact:true}).click();const {attempt}=await (await response).json();await page.locator('.hx-question-panel').waitFor();return attempt;}
async function submit(){await page.getByRole('button',{name:'Nộp bài',exact:true}).click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Xác nhận nộp bài',exact:true}).click();await page.getByRole('heading',{name:'Kết quả bài luyện',exact:true}).waitFor();}
try{
 await ready();db=new DatabaseSync(path.join(runtime,'hsk-content.sqlite'));
 const samples=JSON.parse(await readFile(path.join(root,'data/editorial/hsk-mvp-sample.json'),'utf8'));
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'});
 context.on('page',p=>{p.on('pageerror',e=>errors.push(e.message));p.on('dialog',dialog=>dialog.accept());p.setDefaultTimeout(15000);});
 await context.route('**/api/hsk/**',async route=>{
  const req=route.request();if(saveOffline&&req.method()==='PATCH'&&req.url().endsWith('/answers')){await route.abort('internetdisconnected');return;}
  const headers={...req.headers(),origin:new URL(web).origin};delete headers.host;delete headers['content-length'];
  try{const response=await route.fetch({url:api+new URL(req.url()).pathname+new URL(req.url()).search,headers,maxRetries:2});await route.fulfill({response});}catch(error){if(!closing&&!req.failure())errors.push('Isolated API forwarding failed: '+error.message.split('\n')[0]);await route.abort().catch(()=>{});}
 });
 page=await context.newPage();await page.goto(web+'/hsk',{waitUntil:'domcontentloaded'});await page.locator('.hx-exam-row').first().waitFor();assert.equal(await page.locator('.hx-exam-row').count(),3);
 await render('desktop');
 await page.getByLabel('Chuẩn HSK',{exact:true}).selectOption('hsk3-2021');await page.waitForFunction(()=>document.querySelectorAll('.hx-exam-row').length===1);
 await page.getByLabel('Kỹ năng',{exact:true}).selectOption('writing');await page.getByRole('heading',{name:'Chưa có bộ bài phù hợp'}).waitFor();
 await page.getByRole('button',{name:'Xóa bộ lọc'}).click();await page.waitForFunction(()=>document.querySelectorAll('.hx-exam-row').length===3);
 await page.setViewportSize({width:390,height:844});await render('mobile');
 assert.equal(await page.locator('.hx-extra-filters').getAttribute('open'),null,'Mobile secondary filters are collapsed');
 assert((await page.locator('.hx-exam-row').first().boundingBox()).y<844,'First mobile exam is visible without passing a full screen of filters');
 await page.locator('.hx-extra-filters summary').click();await page.getByLabel('Độ khó',{exact:true}).selectOption('hard');await page.getByRole('heading',{name:'Chưa có bộ bài phù hợp'}).waitFor();
 await page.getByRole('button',{name:'Xóa bộ lọc'}).click();await page.locator('.hx-exam-row').first().waitFor();
 await page.setViewportSize({width:820,height:1080});await render('tablet');await page.setViewportSize({width:1440,height:1000});
 await openExam('hskbank-sample-2025-1');assert(await page.getByRole('button',{name:'Bắt đầu làm bài',exact:true}).isDisabled());await render('intro-desktop');
 const first=await start();for(const field of ['correctOptionId','acceptedAnswers','explanation','transcript','answerVerified'])assert(!JSON.stringify(first).includes('"'+field+'"'),'Active payload hides '+field);
 const answer=samples.batches[0].questions.find(q=>q.id===first.questions[0].id).correctOptionId;
 await page.locator('.hx-question-heading button').focus();await page.keyboard.press('Digit'+String(first.questions[0].options.findIndex(o=>o.id===answer)+1));await page.keyboard.press('f');await saved();
 await page.getByRole('button',{name:'Câu tiếp',exact:true}).click();await saved();await page.reload({waitUntil:'domcontentloaded'});await page.getByRole('region',{name:'Câu 2',exact:true}).waitFor();
 assert.equal(db.prepare('SELECT current_index FROM hsk_exam_attempts WHERE id=?').get(first.id).current_index,1);
 assert.equal(db.prepare('SELECT answer FROM hsk_attempt_answers WHERE attempt_id=? AND question_id=?').get(first.id,first.questions[0].id).answer,answer);
 assert(await page.getByRole('button',{name:'Câu 1, đã trả lời, đã đánh dấu',exact:true}).count());
 const clock=await page.locator('.hx-timer strong').innerText();await page.waitForFunction(previous=>document.querySelector('.hx-timer strong')?.textContent!==previous,clock);await render('room-desktop');
 await page.setViewportSize({width:390,height:844});await render('room-mobile');await page.setViewportSize({width:1440,height:1000});
 saveOffline=true;await page.locator('.hx-response .exam-choice').first().click();await page.getByRole('alert').filter({hasText:'Mất kết nối với máy chủ'}).waitFor();
 assert(await page.evaluate(id=>Boolean(sessionStorage.getItem('hsk-exam-outbox:'+id)),first.id),'Network failure preserves the outbox');
 saveOffline=false;await page.reload({waitUntil:'domcontentloaded'});await page.getByRole('region',{name:'Câu 2',exact:true}).waitFor();await saved();assert.equal(await page.locator('.hx-response .exam-choice[aria-checked=true]').count(),1,'Reload restores and sends the unsaved answer');
 const peer=await context.newPage();await peer.goto(page.url(),{waitUntil:'domcontentloaded'});await peer.getByRole('region',{name:'Câu 2',exact:true}).waitFor();
 await page.locator('.hx-response .exam-choice').nth(1).click();await saved();await peer.locator('.hx-response .exam-choice').nth(2).click();await peer.getByRole('alert').filter({hasText:'Bài làm đã thay đổi ở tab khác'}).waitFor();
 assert(await peer.getByRole('button',{name:'Nộp bài',exact:true}).isDisabled());
 const downloadEvent=peer.waitForEvent('download');await peer.getByRole('button',{name:'Tải bản nháp về',exact:true}).click();assert.equal((await downloadEvent).suggestedFilename(),'hsk-unsaved-draft.json');
 await peer.getByRole('button',{name:'Dùng bản đã lưu máy chủ',exact:true}).click();await saved(peer);assert.equal(await peer.locator('.hx-response .exam-choice').nth(1).getAttribute('aria-checked'),'true');await peer.close();
 await page.getByRole('button',{name:'Nộp bài',exact:true}).click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});await submit();
 const result=JSON.parse(db.prepare('SELECT result_json FROM hsk_exam_attempts WHERE id=?').get(first.id).result_json);assert(result.score>=1);assert.equal(result.items.length,10);await render('result-desktop');
 await page.setViewportSize({width:390,height:844});await render('result-mobile');await page.setViewportSize({width:1440,height:1000});
 const wordLink=page.locator('.hx-related-words a').first();await wordLink.waitFor();await wordLink.click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Đóng chi tiết từ'}).click();
 await page.goto(web+'/hsk?tab=history',{waitUntil:'domcontentloaded'});await page.locator('.hx-history-row').waitFor();assert(await page.getByRole('button',{name:'Xem kết quả',exact:true}).count());
 await openExam('hskbank-sample-2025-2');const writing=await start();await page.getByRole('button',{name:'Câu 5, chưa trả lời',exact:true}).click();await page.getByRole('textbox',{name:'Câu trả lời của bạn'}).fill('我 每天 学习 汉语！');await saved();await page.reload({waitUntil:'domcontentloaded'});await page.getByRole('textbox',{name:'Câu trả lời của bạn'}).waitFor();assert.equal(await page.getByRole('textbox',{name:'Câu trả lời của bạn'}).inputValue(),'我 每天 学习 汉语！');await submit();assert.equal(JSON.parse(db.prepare('SELECT result_json FROM hsk_exam_attempts WHERE id=?').get(writing.id).result_json).score,1,'Exact text grading ignores punctuation and spacing');
 await openExam('hskbank-sample-2021-1');const listening=await start();assert(!JSON.stringify(listening).includes('"transcript"'));await page.locator('.exam-audio[data-audio-state=ready]').waitFor();
 await page.getByRole('button',{name:'Phát âm thanh',exact:true}).click();await page.locator('.exam-audio[data-audio-state=playing]').waitFor();assert(await page.locator('audio').evaluate(a=>a.currentTime>=0&&a.duration>0&&!a.paused),'Real MP3 decoded and played');
 await page.getByRole('button',{name:'Tạm dừng âm thanh'}).click();await page.getByLabel('Tốc độ phát',{exact:true}).selectOption('0.75');assert.equal(await page.getByRole('heading',{name:'Transcript',exact:true}).count(),0);await submit();await page.getByRole('heading',{name:'Transcript',exact:true}).first().waitFor();
 // Exercise deadline behavior with the real server, shortening only an isolated row.
 await openExam('hskbank-sample-2025-1');const expiry=await start();db.prepare('UPDATE hsk_exam_attempts SET deadline=? WHERE id=?').run(Date.now()+2100,expiry.id);await page.reload({waitUntil:'domcontentloaded'});await page.getByRole('heading',{name:'Kết quả bài luyện',exact:true}).waitFor();await page.getByText('Đã hết giờ. Kết quả tính từ các câu được lưu trên máy chủ trước hạn.',{exact:true}).waitFor();
 console.log('PASS: catalog, keyboard, autosave/reload, offline outbox, two-tab conflict recovery, countdown/expiry, grading/results/history, vocabulary links and real MP3 playback.');
 await page.goto(web+'/hsk?tab=admin',{waitUntil:'domcontentloaded'});await page.getByLabel('Mã quản trị cục bộ',{exact:true}).fill('invalid-fixture');await page.getByRole('button',{name:'Mở quản trị',exact:true}).click();await page.getByRole('alert').waitFor();
 await page.getByLabel('Mã quản trị cục bộ',{exact:true}).fill(token);await page.getByRole('button',{name:'Mở quản trị',exact:true}).click();await page.getByRole('heading',{name:'Ngân hàng câu hỏi',exact:true}).waitFor();await page.locator('.hx-admin-question-list button').first().click();await page.getByLabel('Giải thích tiếng Việt',{exact:true}).waitFor();await render('admin-desktop');
 await page.setViewportSize({width:390,height:844});await render('admin-mobile');await page.setViewportSize({width:1440,height:1000});
 const fixture={...samples.batches[0].questions[0],id:'hskbank-browser-fixture',promptZh:'小林上午在公园散步。小林上午在哪里？',options:[{id:'A',text:'公园'},{id:'B',text:'图书馆'},{id:'C',text:'商店'}],correctOptionId:'A',explanation:'Dữ liệu kiểm thử trong database tạm; 公园 là công viên.'};
 await page.getByRole('button',{name:'Nhập dữ liệu',exact:true}).click();await page.getByLabel('Chọn tệp dữ liệu').setInputFiles({name:'browser-fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({source:samples.batches[0].source,questions:[fixture]}))});
 assert(await page.getByRole('button',{name:'Nhập 0 câu hợp lệ',exact:true}).isDisabled());await page.getByRole('button',{name:'Kiểm tra trước khi nhập',exact:true}).click();await page.getByRole('button',{name:'Nhập 1 câu hợp lệ',exact:true}).waitFor();await page.getByRole('button',{name:'Nhập 1 câu hợp lệ',exact:true}).click();await page.getByRole('status').filter({hasText:'Đã nhập 1 câu'}).waitFor();
 await page.getByRole('button',{name:'Câu hỏi',exact:true}).click();await page.getByLabel('Tìm câu hỏi',{exact:true}).fill(fixture.id);await page.locator('.hx-admin-question-list button').filter({hasText:fixture.id}).click();
 await page.getByLabel('Giải thích tiếng Việt',{exact:true}).fill(fixture.explanation+' Edited.');assert(await page.getByRole('button',{name:'Duyệt câu',exact:true}).isDisabled());await page.getByRole('button',{name:'Lưu revision mới',exact:true}).click();await page.getByRole('status').filter({hasText:'Đã lưu phiên bản mới'}).waitFor();
 await page.getByLabel('Người duyệt',{exact:true}).fill('Isolated browser fixture');await page.getByLabel('Nhận xét duyệt',{exact:true}).fill('Technical fixture only; no real editorial approval.');for(const label of ['Đã kiểm tra ngữ pháp và nội dung','Đã kiểm tra cấp và chuẩn HSK','Đã xác minh đáp án, loại câu mơ hồ','Đã kiểm tra quyền và chất lượng audio / hình'])await page.getByRole('checkbox',{name:label,exact:true}).check();
 await page.getByRole('button',{name:'Duyệt câu',exact:true}).click();await page.getByRole('status').filter({hasText:'Câu đã duyệt.'}).waitFor();await page.getByRole('button',{name:'Xuất bản câu',exact:true}).click();await page.getByRole('status').filter({hasText:'Đã xuất bản câu'}).waitFor();
 await page.getByRole('button',{name:'Tạo & xuất bản bộ bài',exact:true}).click();await page.locator('.hx-exam-picker input').first().check();await page.getByLabel('Tên bộ bài',{exact:true}).fill('Browser fixture practice');await page.getByLabel('Thời gian · phút',{exact:true}).fill('2');await page.getByRole('button',{name:'Tạo bộ bài · 1 câu',exact:true}).click();await page.getByRole('status').filter({hasText:'Đã tạo bộ bài nháp'}).waitFor();
 const managed=page.locator('.hx-managed-exams article').filter({hasText:'Browser fixture practice'});await managed.getByRole('button',{name:'Xuất bản bộ',exact:true}).click();await page.getByRole('status').filter({hasText:'Đã xuất bản bộ bài'}).waitFor();
 await page.getByRole('button',{name:'Tạo bản nháp',exact:true}).click();await page.locator('.hx-word-picker input').first().check();await page.getByRole('button',{name:'Tạo bản nháp từ 1 từ',exact:true}).click();await page.getByRole('status').filter({hasText:'Tạo được 1/1 câu'}).waitFor();
 const exportEvent=page.waitForEvent('download');await page.getByRole('button',{name:'Xuất JSON',exact:true}).click();assert.equal((await exportEvent).suggestedFilename(),'hsk-question-bank.json');
 await page.getByRole('button',{name:'Nguồn & nhật ký',exact:true}).click();await page.getByRole('heading',{name:'Nguồn và quyền sử dụng',exact:true}).waitFor();await render('admin-sources');
 await page.goto(web+'/',{waitUntil:'domcontentloaded'});await page.getByRole('heading',{name:/Mỗi ngày một chút/}).waitFor();await render('learning-desktop');await page.setViewportSize({width:390,height:844});await render('learning-mobile');
 await page.setViewportSize({width:320,height:740});await page.goto(web+'/hsk',{waitUntil:'domcontentloaded'});await page.locator('.hx-exam-row').first().waitFor();await render('narrow-mobile');
 assert.deepEqual(errors,[],'No browser JavaScript errors');assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
 console.log('PASS: real admin import preview/commit, revision editing, explicit review/publication, exam creation/publication, offline vocabulary generation/export, desktop/tablet/mobile layouts and learning deep links. No live data or community writes.');
}catch(error){if(page&&!page.isClosed())console.error('Visible page:',(await page.locator('body').innerText()).slice(-2200));throw error;}
finally{closing=true;await context?.unrouteAll({behavior:'wait'});await context?.close();await browser?.close();db?.close();server.kill();await new Promise(r=>{if(server.exitCode!==null)return r();server.once('exit',r);});assert.equal(path.dirname(runtime),path.join(root,'.runtime'));assert(path.basename(runtime).startsWith('hsk-exam-browser-'));await rm(runtime,{recursive:true,force:true});}
