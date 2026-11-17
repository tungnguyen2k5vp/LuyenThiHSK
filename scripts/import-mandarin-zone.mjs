import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';

// ponytail: imports the twelve community sets; official-paper rights and full-exam timing require a separate source review.
const source=new URL('../../HSK4-MandarinZone-Data/',import.meta.url);
const out=new URL('../public/data/mandarin-zone/',import.meta.url);
const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
const at=new Date().toISOString().slice(0,10);
const provenance={source_name:'Mandarin Zone',source_url:'https://github.com/Make-dream-clear/hsk4-mock-exam',source_version:commit,retrieved_at:at,license:'CC BY-NC-SA 4.0',rights_status:'open_license_verified',is_original:false,attribution:'Mandarin Zone (https://mandarinzone.com). Adapted to LuyenThiHSK question format. Non-commercial use; adaptations CC BY-NC-SA 4.0. Answer keys are from the source.'};
await mkdir(out,{recursive:true});
await copyFile(new URL('LICENSE',source),new URL('LICENSE.txt',out));
const manifest={version:1,source:provenance,licenseUrl:'https://creativecommons.org/licenses/by-nc-sa/4.0/',sets:[],omitted:[],inputHashes:{},audioSources:{}};
const ids=new Set();
for(let n=1;n<=12;n++){
 const file=`test-${String(n).padStart(2,'0')}.json`,raw=await readFile(new URL('data/'+file,source));
 manifest.inputHashes[file]=createHash('sha256').update(raw).digest('hex');
 const pack=JSON.parse(raw);assert.equal(pack.source,'Mandarin Zone (mandarinzone.com)');assert.notEqual(pack.official,true);
 const questions=[];
 for(const q of pack.questions){
  const omit=reason=>manifest.omitted.push({file,number:q.number,reason});
  const listening=q.type.startsWith('listening_');
  if(!Array.isArray(q.options)||q.options.length<2||q.options.length>6||q.options.some(o=>typeof o!=='string'||!o.trim())||!Number.isInteger(q.correct_answer_index)||q.correct_answer_index<0||q.correct_answer_index>=q.options.length){omit('INVALID_OPTIONS_OR_KEY');continue;}
  if(q.image||/<[a-z][\s\S]*>/i.test(q.text??'')||q.options.some(o=>/<[a-z][\s\S]*>/i.test(o))){omit('IMAGE_OR_HTML_REQUIRES_SEPARATE_ADAPTER');continue;}
  if(listening&&(!q.audio||!/^https:\/\/media\.mandarinzone\.com\/wp-content\/uploads\/[\w./-]+\.(?:wav|mp3)$/i.test(q.audio))){omit('MISSING_INDIVIDUAL_AUDIO');continue;}
  if((!listening||q.type==='listening_true_false')&&!q.text?.trim()){omit('MISSING_REQUIRED_PROMPT');continue;}
  const type={listening_true_false:'true-false',listening_choice:'multiple-choice',fill_in_blank:'fill-blank',reading_ordering:'sentence-order',reading_comprehension:'multiple-choice',writing_construction:'multiple-choice',choice:'multiple-choice'}[q.type];
  if(!type){omit('UNSUPPORTED_TYPE');continue;}
  const skill=listening?'listening':['writing_construction','choice'].includes(q.type)?'writing':'reading';
  const options=q.options.map((text,i)=>({id:'ABCDEF'[i],text:text.replace(/^[A-F][.、．\s]+/u,'').trim()}));
  const key=options[q.correct_answer_index];
  const id=`mz-hsk4-${String(n).padStart(2,'0')}-${q.number}`;assert(!ids.has(id));ids.add(id);
  const audioId=listening?createHash('sha256').update(q.audio).digest('hex'):null;if(audioId)manifest.audioSources[audioId]=q.audio;
  questions.push({id,number:questions.length+1,level:'4',hskLevel:'4',syllabusVersion:'hsk2-2015',skill,part:skill==='listening'?1:skill==='reading'?2:3,type,
   instruction:listening?'Nghe audio và chọn đáp án.':q.type==='reading_ordering'?'Chọn thứ tự đúng của các câu.':q.type==='fill_in_blank'?'Chọn từ thích hợp điền vào chỗ trống.':'Đọc nội dung và chọn đáp án phù hợp.',
   promptZh:q.text?.trim()||'请听录音，选择正确答案。',candidatePromptZh:q.text?.trim()||'请听录音，选择正确答案。',
   ...(listening?{audio:{kind:'file',src:'/api/learner/community-audio/'+audioId+'.wav'}}:{}),options,correctOptionId:key.id,scoring:'choice',answerVerified:false,answerValidation:'SOURCE_KEY_NOT_INDEPENDENTLY_REVIEWED',
   explanation:q.explanation?.trim()||`Đáp án theo Mandarin Zone: ${key.id} · ${key.text}. Nguồn chưa cung cấp giải thích cho câu này.`,
   sourceType:'COMMUNITY',reviewStatus:'SOURCE_IMPORTED',provenance});
 }
 assert(questions.length>20,'Too few usable questions in '+file);
 const exam={id:`mz-hsk4-${String(n).padStart(2,'0')}`,title:`HSK 4 · Mandarin Zone · Bộ ${String(n).padStart(2,'0')}`,version:'hsk2',levelCode:'HSK 4',skill:'all',skillLabel:'Nghe · Đọc · Viết',topic:'Luyện HSK 4',mode:'mini',modeLabel:'Bài luyện cộng đồng',totalQuestions:questions.length,durationMinutes:Math.ceil(questions.length*1.2),durationKind:'custom',difficulty:'Trung bình',description:'Các câu khả dụng từ bộ luyện cộng đồng HSK 2.0. Không phải đề thi chính thức; câu viết được nguồn chuyển sang trắc nghiệm.',contentLabel:'Mandarin Zone · CC BY-NC-SA 4.0 · đáp án từ nguồn; lời giải có thể bằng tiếng Anh',isDemo:true,formatAuthority:'PLATFORM_PRACTICE',provenance,questions};
 const data=JSON.stringify(exam);await writeFile(new URL(file,out),data+'\n');
 manifest.sets.push({id:exam.id,title:exam.title,version:exam.version,levelCode:exam.levelCode,contentLabel:exam.contentLabel,durationMinutes:exam.durationMinutes,totalQuestions:questions.length,skills:Object.fromEntries(Object.entries(Object.groupBy(questions,q=>q.skill)).map(([s,rows])=>[s,rows.length])),types:Object.fromEntries(Object.entries(Object.groupBy(questions,q=>q.type)).map(([type,rows])=>[type,rows.length])),url:'/data/mandarin-zone/'+file,sha256:createHash('sha256').update(data+'\n').digest('hex')});
}
manifest.totalQuestions=ids.size;
await writeFile(new URL('manifest.json',out),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({sets:manifest.sets.length,questions:ids.size,omitted:manifest.omitted.length,reasons:Object.fromEntries(Object.entries(Object.groupBy(manifest.omitted,q=>q.reason)).map(([r,v])=>[r,v.length])),commit},null,2));
