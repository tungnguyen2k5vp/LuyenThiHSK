import {createHash} from 'node:crypto';
import {z} from 'zod';

export const MODULE='HSK_SERVER_V1';
export const standards=['hsk2-2015','hsk3-2021','hsk3-2025'];
export const levels=['1','2','3','4','5','6','7-9'];
export const sha256=value=>createHash('sha256').update(value).digest('hex');
export const normalize=value=>String(value??'').normalize('NFKC').replace(/[\s\p{P}]/gu,'').toLowerCase();
export const idSchema=z.string().regex(/^[a-zA-Z0-9:_-]{1,160}$/);
const text=z.string().trim().min(1).max(12000);
const mediaPath=z.string().regex(/^\/data\/open-hsk\/audio\/[a-f0-9]{64}\.mp3$/);
const image=z.object({assetId:idSchema,src:z.string().regex(/^\/api\/(?:admin|learner)\/v6\/image\/[a-z0-9-]+$/),altText:text,width:z.number().int().positive(),height:z.number().int().positive()});
export const sourceSchema=z.object({
 id:idSchema,name:text,url:z.string().regex(/^(https:\/\/|local:)/),owner:text,
 license:z.enum(['CC0-1.0','CC BY 4.0','CC BY-SA 4.0','LicenseRef-Project-Original']),
 rightsStatus:z.enum(['VERIFIED_OPEN','ORIGINAL']),commercialAllowed:z.literal(true),
 attribution:text,evidenceUrl:z.string().regex(/^(https:\/\/|local:)/),scope:text,
}).strict();
export const questionSchema=z.object({
 id:idSchema,syllabusVersion:z.enum(standards),level:z.enum(levels),
 skill:z.enum(['listening','reading','writing']),
 type:z.enum(['multiple-choice','true-false','picture-choice','picture-true-false','short-passage','dialogue','fill-blank','sentence-order','short-answer','grammar-practice']),
 promptZh:text,instruction:text,contextZh:z.string().max(16000).optional(),
 options:z.array(z.object({id:z.string().regex(/^[A-H]$/),text:z.string().max(2000),image:image.optional()}).strict()).max(8),
 correctOptionId:z.string().regex(/^[A-H]$/).optional(),acceptedAnswers:z.array(text).max(12).optional(),
 explanation:text,difficulty:z.enum(['easy','medium','hard']),scoring:z.enum(['choice','exact-text','manual']).default('choice'),
 audio:z.object({kind:z.literal('file'),src:mediaPath,slowSrc:mediaPath.optional(),sha256:z.string().regex(/^[a-f0-9]{64}$/),voiceKind:z.enum(['synthetic','recorded']),transcript:text}).strict().optional(),
 image:image.optional(),vocabularyIds:z.array(idSchema).max(50).default([]),rubric:z.array(text).max(12).optional(),
}).strict().superRefine((q,ctx)=>{
 const issue=message=>ctx.addIssue({code:'custom',message});
 if(!/\p{Script=Han}/u.test(q.promptZh))issue('Câu hỏi cần nội dung tiếng Trung.');
 if(q.syllabusVersion==='hsk2-2015'&&q.level==='7-9')issue('HSK 2.0 không có cấp 7–9.');
 if(q.skill==='listening'&&!q.audio)issue('Bài nghe cần audio có tệp và transcript.');
 if(q.audio&&!q.audio.src.endsWith('/'+q.audio.sha256+'.mp3'))issue('Tên tệp audio phải khớp SHA-256 của asset.');
 if(new Set(q.options.map(o=>o.id)).size!==q.options.length||new Set(q.options.map(o=>normalize(o.text)||o.image?.assetId)).size!==q.options.length)issue('Lựa chọn trùng ID hoặc nội dung.');
 if(q.scoring==='choice'&&(q.options.length<2||!q.options.some(o=>o.id===q.correctOptionId)))issue('Cần duy nhất một đáp án thuộc các lựa chọn.');
 if(q.scoring==='exact-text'&&(!q.acceptedAnswers?.length||q.options.length))issue('Chấm văn bản cần đáp án và không dùng lựa chọn.');
 if(q.scoring==='manual'&&(!q.rubric?.length||q.skill!=='writing'))issue('Bài viết tự do cần rubric và người chấm.');
 if(q.type.startsWith('picture')&&!q.image&&!q.options.some(o=>o.image))issue('Câu hình ảnh chưa có hình.');
});
export const fingerprint=q=>sha256(JSON.stringify([q.syllabusVersion,q.level,q.skill,normalize(q.promptZh),normalize(q.contextZh),q.options.map(o=>normalize(o.text)||o.image?.assetId).sort(),q.audio?.sha256??'',...(q.image?[q.image.assetId]:[])]));
export const answerKey=q=>q.scoring==='choice'?normalize(q.options.find(o=>o.id===q.correctOptionId)?.text)||q.options.find(o=>o.id===q.correctOptionId)?.image?.assetId:JSON.stringify((q.acceptedAnswers??[]).map(normalize).sort());
export function similarity(a,b){
 const grams=value=>{const s=normalize(value);return new Set([...s].slice(1).map((_,i)=>s.slice(i,i+2)));};
 const x=grams(a),y=grams(b);if(!x.size||!y.size)return 0;
 return [...x].filter(v=>y.has(v)).length/new Set([...x,...y]).size;
}
export function parseCsv(input){
 if(typeof input!=='string'||input.length>3_500_000)throw Error('CSV vượt giới hạn.');
 const rows=[];let row=[],cell='',quoted=false;
 for(let i=0;i<input.length;i++){
  const c=input[i];
  if(c==='"'){if(quoted&&input[i+1]==='"'){cell+='"';i++;}else if(quoted||!cell)quoted=!quoted;else throw Error('CSV có dấu nháy không hợp lệ.');}
  else if(!quoted&&(c===','||c==='\n'||c==='\r')){row.push(cell);cell='';if(c!==','){if(row.some(v=>v.trim()))rows.push(row);row=[];if(c==='\r'&&input[i+1]==='\n')i++;}}
  else cell+=c;
 }
 if(quoted)throw Error('CSV chưa đóng dấu nháy.');
 row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
 const headers=rows.shift()?.map(h=>h.replace(/^\uFEFF/,'').trim())??[];
 if(!headers.length||new Set(headers).size!==headers.length||headers.some(h=>!h||['__proto__','constructor','prototype'].includes(h)))throw Error('CSV cần tiêu đề duy nhất.');
 return rows.map((values,i)=>{if(values.length!==headers.length)throw Error('CSV dòng '+(i+2)+' sai số cột.');const record=Object.fromEntries(headers.map((h,j)=>[h,values[j]]));for(const key of ['options','acceptedAnswers','audio','image','vocabularyIds','rubric'])if(record[key]){try{record[key]=JSON.parse(record[key]);}catch{throw Error('CSV dòng '+(i+2)+': '+key+' cần JSON hợp lệ.');}}else delete record[key];return record;});
}
// Whitelist: no keys, accepted answers, explanations, translations or transcripts before submission.
export function candidateQuestion(q){
 return {id:q.id,number:q.number,part:q.part,skill:q.skill,type:q.type,promptZh:q.promptZh,instruction:q.instruction,
  contextZh:q.contextZh,options:q.options.map(o=>({id:o.id,text:o.text,image:o.image})),scoring:q.scoring,
  image:q.image,provenance:q.provenance,audio:q.audio?{kind:'file',src:q.audio.src,slowSrc:q.audio.slowSrc,voiceKind:q.audio.voiceKind}:undefined};
}
export function gradeQuestions(questions,answers){
 const items=questions.map(q=>{const answer=answers[q.id]??'',answered=Boolean(answer.trim()),status=!answered?'unanswered':q.scoring==='manual'?'pending':q.scoring==='exact-text'?(q.acceptedAnswers.some(a=>normalize(a)===normalize(answer))?'correct':'incorrect'):answer===q.correctOptionId?'correct':'incorrect';return {questionId:q.id,skill:q.skill,type:q.type,answer,status,points:status==='correct'?1:0,maxPoints:q.scoring==='manual'?0:1,question:q};});
 const bySkill=['listening','reading','writing'].flatMap(skill=>{const rows=items.filter(q=>q.skill===skill);return rows.length?[{skill,correct:rows.filter(q=>q.status==='correct').length,total:rows.length,maxPoints:rows.reduce((s,q)=>s+q.maxPoints,0),pending:rows.filter(q=>q.status==='pending').length}]:[];});
 return {items,bySkill,score:items.reduce((sum,q)=>sum+q.points,0),maxScore:items.reduce((sum,q)=>sum+q.maxPoints,0),correct:items.filter(q=>q.status==='correct').length,incorrect:items.filter(q=>q.status==='incorrect').length,unanswered:items.filter(q=>q.status==='unanswered').length,pending:items.filter(q=>q.status==='pending').length,gradingPolicy:'PRACTICE_RAW_POINTS',officialScore:null,passThreshold:null};
}
