// Source implementation patch. Dry run by default; not an application setup script.
import {readFile,writeFile} from 'node:fs/promises';
const edits={
 'src/components/preparation/PreviewWorkspace.tsx':[
  ['<p className="eyebrow">HSK 1 · HỌC THỬ</p><h1>Học HSK 1 mỗi ngày</h1>','<p className="eyebrow">HSK {targetLevel} · HỌC THỬ</p><h1>Học HSK {targetLevel} mỗi ngày</h1>'],
  ["void api(version+'/release?mode='+next).then(data=>{setRelease(data);setEnvironment(next);})","void load(next)"],
  [' {current&&exam?',` {release&&!current&&!attempt&&version==='v6'&&<label className="preview-level-picker">Cấp học <select aria-label="Cấp học Preview" value={targetLevel} onChange={e=>setTargetLevel(e.target.value)}><option value="1">HSK 1</option><option value="2">HSK 2 · Đang thử nghiệm</option></select></label>}
 {current&&exam?`],
  ["['vocab',all!.words.length+' từ'],['grammar',all!.lessons.length+' bài ngữ pháp']","['vocab',targetLevel==='2'?'200 từ':all!.words.length+' từ'],['grammar',targetLevel==='2'?'71 cấu trúc':all!.lessons.length+' bài ngữ pháp'],...(version==='v6'?[['hsk2','HSK 2 · Luyện tập']]:[])"],
  ["tab==='today'&&prep.state.profile.onboarding==='new'","tab==='today'&&targetLevel==='1'&&prep.state.profile.onboarding==='new'"],
  ["{tab==='today'&&<section",`{tab==='today'&&targetLevel==='2'&&hsk2&&<HSK2Today pilot={hsk2} data={prep.state} commit={prep.commit} attempts={study.attempts} sessions={study.sessions} onNavigate={setTab} onPractice={e=>begin(e,'practice')}/>}
 {tab==='today'&&targetLevel==='1'&&<section`],
  ["key={tab} mode={tab}","key={tab+targetLevel} mode={tab}"],
  ["{tab==='practice'&&<section","{tab==='practice'&&targetLevel==='1'&&<section"],
  ["{tab==='practice'&&version==='v6'&&<><HSK2Blueprint/><HSK2Pilot api={api} onPractice={e=>begin(e,'practice')}/></>}","{(tab==='practice'||tab==='hsk2')&&version==='v6'&&<HSK2Pilot pilot={hsk2} attempts={study.attempts} sessions={study.sessions} onPractice={e=>{prep.commit(p=>({...p,profile:{...p.profile,targetLevel:'2'}}));begin(e,'practice');}} onNavigate={page=>{prep.commit(p=>({...p,profile:{...p.profile,targetLevel:'2'}}));setTab(page);}}/>}"],
  ["disabled={!study.reviewItems.length} onClick={()=>practiceQuestions(all!.questions.filter(q=>study.reviewItems.some(r=>r.questionId===q.id)).slice(0,10))}","disabled={!readyReview.length} onClick={()=>practiceQuestions(readyReview.slice(0,10))}"],
  ['<p>{study.reviewItems.length} câu trong hàng ôn Preview.</p>','<p>{study.reviewItems.length} câu trong hàng ôn Preview · {readyReview.length} câu khả dụng. Bài chưa chấm được giữ để đối chiếu; câu nghe thiếu audio chưa thể mở.</p>'],
  ["{a.examSnapshot?summarizeAttempt(a.examSnapshot,a).accuracyPercent:'—'}%","{a.examSnapshot?(summarizeAttempt(a.examSnapshot,a).accuracyPercent===null?'Chưa chấm':summarizeAttempt(a.examSnapshot,a).accuracyPercent+'%'):'Chưa có snapshot'}"],
  ["if(!all||prep.state.profile.onboarding==='new'||plan)return","if(!all||targetLevel!=='1'||prep.state.profile.onboarding==='new'||plan)return"],
  ['recentSkillEvidence(study.attempts)','recentSkillEvidence(study.attempts.filter(a=>a.examSnapshot?.levelCode===\'HSK 1\'))'],
  ["[...p.events,...['listening','reading'].map","[...p.events,...['listening','reading','writing'].map"],
 ],
 'src/components/learning/CourseWorkspace.tsx':[
  ["filter(l=>!preview||l.level==='1')","filter(l=>!preview||['1','2'].includes(l.level))"],
  ["!preview.bundle.questions.some(q=>q.vocabularyIds?.includes(selected.id))","![...preview.bundle.questions,...(preview.bundle.referenceQuestions??[])].some(q=>q.vocabularyIds?.includes(selected.id)&&q.skill!=='listening')"],
  ["const questions=preview.bundle.questions.filter(q=>q.vocabularyIds?.includes(selected.id)).slice(0,5)","const questions=[...preview.bundle.questions,...(preview.bundle.referenceQuestions??[])].filter(q=>q.vocabularyIds?.includes(selected.id)&&q.skill!=='listening').slice(0,5)"],
  ["title:'Luyện từ trong ngữ cảnh',version:'hsk3',levelCode:'HSK 1'","title:'Luyện từ trong ngữ cảnh',version:'hsk3',levelCode:'HSK '+selected.level"],
 ],
 'src/components/exam/QuestionSolution.tsx':[
  ['preview?.bundle.words.filter','(preview?.bundle.referenceWords??preview?.bundle.words)?.filter'],
  ['preview?.bundle.lessons.filter','[...(preview?.bundle.lessons??[]),...(preview?.bundle.referenceGrammar??[])].filter'],
 ],
 'src/components/admin/ContentReviewV5.tsx':[
  ["(String(payload.editorialRelease).startsWith('v8-')?'v8':version)","(String(payload.editorialRelease).startsWith('v9-')?'v9':String(payload.editorialRelease).startsWith('v8-')?'v8':version)"],
  ["'/revalidate',{id:selected.id,revision:selected.revision}","'/revalidate',{id:selected.id,revision:selected.revision,sourceFingerprint}"],
 ],
 'src/services/cloudSync.ts':[
  ["CLOUD_ATOMIC_UNAVAILABLE: dữ liệu đang chờ được giữ trên thiết bị; cần trình duyệt hỗ trợ Web Locks.","CLOUD_ATOMIC_UNAVAILABLE: Trình duyệt này chưa hỗ trợ đồng bộ an toàn. Tiến độ vẫn được lưu trên thiết bị."],
 ],
};
const apply=process.argv.includes('--apply'),changed=[];
for(const [file,pairs]of Object.entries(edits)){let source=await readFile(file,'utf8');for(const [before,after]of pairs){if(!source.includes(before))throw Error('Expected source not found in '+file+': '+before.slice(0,90));source=source.replace(before,after);}changed.push({file,edits:pairs.length});if(apply)await writeFile(file,source);}
console.log(JSON.stringify({dryRun:!apply,changed}));
