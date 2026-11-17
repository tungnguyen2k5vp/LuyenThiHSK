import {readFile,writeFile} from 'node:fs/promises';
const file='scripts/v4-browser-flows.mjs';let s=await readFile(file,'utf8');
// V4 feature contracts retained. Only selectors/navigation change for the intentional V5 learner/admin split.
s='// V5 fixture migration: learner/admin are separate routes; original engine/storage/privacy assertions retained.\n'+s;
s=s.replace("includes('CONTENT PENDING FINAL HUMAN REVIEW')","includes('Nội dung đang được thử nghiệm')").replace("await click('Đã ôn cấu trúc')","await click('Đánh dấu đã đọc · ôn sau')").replace('b.innerText.includes("câu Preview")','b.innerText.startsWith("Luyện cấu trúc này")');
const begin=s.indexOf(" await click('Audio Review Queue');"),end=s.indexOf(" await click('Điểm yếu');",begin);if(begin<0||end<0)throw Error('Missing review fixture block');
const original=s.slice(begin,end);await writeFile('data/reports/v5/v4-review-fixture-before.txt',original);
// Keep actual 40-file decode/measurement assertion, now without requiring learner admin tabs.
const decodeStart=original.indexOf('const validation=await evaluate'),decodeEnd=original.indexOf("await screenshot('v4-desktop-audio-review')");const decode=original.slice(decodeStart,decodeEnd);
const admin=` await navigate('view=content-review');await waitFor('document.querySelector(".content-review")');await click('Mở hàng đợi duyệt');await waitFor('document.querySelector(".admin-record")');await click('Đưa V5 vào hàng đợi');await click('Mở bản duyệt');await waitFor('document.querySelector(".structured-editor")');assert.equal(await evaluate('[...document.querySelectorAll("button")].find(b=>b.textContent==="Xác nhận Language Review").disabled'),true);await screenshot('v4-desktop-review-editor');await click('Về hàng đợi');await click('Readiness');assert.ok((await evaluate('document.querySelector(".content-review").innerText')).includes('Human Reviewed')===false);await screenshot('v4-desktop-readiness');await navigate('view=preview');await waitFor('document.querySelector(".preview-banner")');\n`;
s=s.slice(0,begin)+' '+decode+'\n'+admin+s.slice(end);
s=s.replace(",\'Review Queue\',\'Audio Review Queue\',\'Readiness\'",'').replace("await click('Readiness');await screenshot('v4-mobile-readiness');","await click('Hôm nay');await screenshot('v4-mobile-readiness');");
await writeFile(file,s);console.log('Migrated V4 browser selectors/navigation; all V4 API/domain tests remain unchanged.');
