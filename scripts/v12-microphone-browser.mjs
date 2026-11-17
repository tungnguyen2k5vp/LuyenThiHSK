import assert from 'node:assert/strict';
export async function microphoneFlow({rpc,evaluate,waitFor,click,choose,shot},job){
 const playback=async()=>{
  await rpc('Page.bringToFront');
  await waitFor('document.querySelector(".microphone-recorder audio")?.getAttribute("src")?.startsWith("blob:")');
  await evaluate('(()=>{const a=document.querySelector(".microphone-recorder audio");a.scrollIntoView({block:"center",behavior:"instant"});a.muted=true;window.__micPlaybackEvents=[];for(const event of ["loadedmetadata","canplay","playing","timeupdate","error","stalled","waiting"])a.addEventListener(event,()=>window.__micPlaybackEvents.push({event,time:a.currentTime,ready:a.readyState,error:a.error?.code}));})()');
  await waitFor('(()=>{const a=document.querySelector(".microphone-recorder audio"),r=a.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight})()');
  const point=await evaluate('(()=>{const r=document.querySelector(".microphone-recorder audio").getBoundingClientRect();return{x:r.x+25,y:r.y+r.height/2}})()');
  // Native control activation owns the user gesture; muted headless output is not a pronunciation test.
  await rpc('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
  await rpc('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...point});
  try{await waitFor('document.querySelector(".microphone-recorder audio")?.currentTime>0');}
  catch(error){throw Error('MIC_DRAFT_NATIVE_PLAYBACK '+JSON.stringify(await evaluate('({events:window.__micPlaybackEvents,src:document.querySelector(".microphone-recorder audio")?.currentSrc,ready:document.querySelector(".microphone-recorder audio")?.readyState,paused:document.querySelector(".microphone-recorder audio")?.paused})'))+' '+error.message);}
  await evaluate('document.querySelector(".microphone-recorder audio").pause()');
 };
 await evaluate(`(()=>{window.__micCalls=0;window.__micChunks=0;window.__micStreams=[];const original=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);window.__micOriginal=original;navigator.mediaDevices.getUserMedia=async constraints=>{window.__micCalls++;const stream=await original(constraints);window.__micStreams.push(stream);return stream};const Recorder=window.MediaRecorder;window.MediaRecorder=class extends Recorder{constructor(...args){super(...args);this.addEventListener('dataavailable',e=>{if(e.data.size)window.__micChunks++})}}})()`);
 assert.equal(await evaluate('window.__micCalls'),0,'Opening workbench must not request microphone');
 await evaluate(`(()=>{const e=document.querySelector('input[aria-label="Tên người thu"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,'QA FAKE CAPTURE · NOT HUMAN SPEECH');e.dispatchEvent(new Event('input',{bubbles:true}))})()`);
 await click('Bắt đầu thu âm');await waitFor('document.querySelector(".microphone-recorder")?.innerText.includes("Đang thu")');await waitFor('window.__micChunks>=6');await click('Dừng thu âm');await playback();
 const duration=await evaluate('document.querySelector(".microphone-recorder audio").duration');assert.ok(duration>=1&&duration<=90);assert.ok(await evaluate('window.__micStreams.every(s=>s.getTracks().every(t=>t.readyState==="ended"))'));
 assert.equal(await evaluate('[...document.querySelectorAll(".microphone-recorder button")].find(b=>b.textContent==="Dùng bản thu cho bước upload").disabled'),true);
 await click('Lưu bản thu nháp trên thiết bị');await waitFor('document.querySelector(".microphone-recorder")?.innerText.includes("Đã lưu bản nháp")');await shot('v12-microphone-draft');
 // Unmount/reopen uses the same local IndexedDB draft and exact question revision.
 await choose('select[aria-label="Câu nghe trong bàn audio"]','');await waitFor('!document.querySelector(".microphone-recorder")');await choose('select[aria-label="Câu nghe trong bàn audio"]',job.questionId);await waitFor('document.querySelector(".microphone-recorder")');await click('Mở bản thu nháp');await playback();assert.equal(await evaluate('window.__micCalls'),1);assert.ok((await evaluate('document.querySelector(".microphone-recorder").innerText')).includes('revision '+job.questionRevision));
 await evaluate('document.querySelector(".microphone-recorder input[type=checkbox]").click()');await click('Dùng bản thu cho bước upload');await waitFor('document.querySelector(".audio-workbench-v10")?.innerText.includes("File đã chọn: hsk2-recording-")');assert.equal(await evaluate('[...document.querySelectorAll(".audio-workbench-v10 button")].find(b=>b.textContent.startsWith("Upload,")).disabled'),true,'Rights evidence still required; no upload is performed');
 await evaluate('navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException("QA denied","NotAllowedError")}');await click('Bắt đầu thu âm');await waitFor('document.querySelector(".microphone-recorder")?.innerText.includes("Bạn chưa cho phép")');assert.ok(await evaluate('window.__micStreams.every(s=>s.getTracks().every(t=>t.readyState==="ended"))'));
 await evaluate('navigator.mediaDevices.getUserMedia=async c=>{window.__micCalls++;const s=await window.__micOriginal(c);window.__micStreams.push(s);return s};window.__micChunks=0;[...document.querySelectorAll(".microphone-recorder input[type=checkbox]")].filter(e=>!e.checked).forEach(e=>e.click())');
 await click('Bắt đầu thu âm');await waitFor('window.__micChunks>=6');await click('Dừng thu âm');await waitFor('document.querySelectorAll(".microphone-recorder input[type=checkbox]").length===3');
 assert.equal(await evaluate('[...document.querySelectorAll(".microphone-recorder input[type=checkbox]")].every(e=>!e.checked)'),true,'A new recording must not inherit any previous scope declaration');
 await click('Bắt đầu thu âm');await waitFor('document.querySelector(".microphone-recorder")?.innerText.includes("Đang thu")');await choose('select[aria-label="Câu nghe trong bàn audio"]','');await waitFor('window.__micStreams.every(s=>s.getTracks().every(t=>t.readyState==="ended"))');assert.equal(await evaluate('Boolean(document.querySelector(".microphone-recorder"))'),false);
 return{status:'PASS',duration,format:'PCM16 WAV mono 24kHz',capture:'Chrome/Edge fake device; never actual user microphone or human speech',playback:'Native control click; currentTime advances; muted headless output, not human listening',explicitClick:true,permissionDenied:true,draftRestore:true,newRecordingScopesReset:true,tracksStopped:true,uploadedToMain:false,humanApproval:false};
}

