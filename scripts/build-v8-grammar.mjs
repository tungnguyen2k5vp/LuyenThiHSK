import {readFile,writeFile} from 'node:fs/promises';
import {grammarExampleOverlap} from '../shared/grammar-quality.mjs';
import {validateRecord} from '../server/content-contract.mjs';
import {previewFingerprint} from '../shared/preview-content.mjs';
const b=JSON.parse(await readFile('data/reports/v8/live-release.json','utf8')),p=JSON.parse(await readFile('data/staging/v8/hsk2-pilot.json','utf8'));
const rows=[
 [1,'我家有三个孩子，我是（　）个孩子。','B',['一第','第二','二第'],'第 đặt trước số để chỉ thứ tự: 第二 là thứ hai.'],
 [2,'小王和小李是学生，他（　）都在学校。','A',['们','的','吗'],'Thêm 们 sau 他 tạo 他们, chỉ nhiều người.'],
 [8,'A：你（　）时候去学校？ B：明天早上。','C',['谁','哪里','什么'],'什么时候 hỏi thời gian; câu trả lời 明天早上 là thời gian.'],
 [18,'A：今天不去看电影吗？ B：今天没有时间，明天（　）去吧。','B',['不','再','也不'],'再 trước động từ chỉ làm ở thời điểm sau, ở đây là ngày mai.'],
 [22,'A：你一个人去买书吗？ B：不是，我（　）妈妈一起去。','A',['和','在','对'],'和 + người + 一起 + động từ: cùng mẹ đi.'],
 [27,'打电话时，听到对方接了电话，可以先说什么？','C',['再见，我走了。','明天再来。','喂，你好！'],'喂 dùng để mở đầu lời nói khi gọi/nhận điện thoại; ngữ cảnh khác với lời tạm biệt.']
];
p.grammarSupplement=rows.map(([n,promptZh,key,texts,explanation],i)=>{const lesson=b.lessons.find(g=>g.id==='v4-lesson-'+String(n).padStart(5,'0')),q={...p.questions[0],id:'v8-hsk1-grammar-'+String(n).padStart(5,'0'),level:'1',hskLevel:'1',number:i+1,part:1,partId:undefined,type:'grammar-practice',questionType:'grammar-practice',skill:'reading',promptZh,candidatePromptZh:promptZh,instruction:'Chọn đáp án phù hợp với ngữ cảnh',options:texts.map((text,i)=>({id:String.fromCharCode(65+i),text})),correctAnswer:key,correctOptionId:key,explanation,grammarIds:[lesson.grammarPointId],vocabularyIds:b.words.filter(w=>(promptZh+texts.join('')).includes(w.simplified)).map(w=>w.id),editorialRelease:'v8-hsk1-supplement',topicIds:['v8-topic-hsk1-grammar'],mediaRequirement:{audio:false,status:'NOT_REQUIRED'},internalValidation:undefined};if(grammarExampleOverlap(q,lesson)||b.questions.some(old=>old.promptZh===q.promptZh))throw Error('Overlap '+q.id);const errors=validateRecord('questions',q);if(errors.length)throw Error(errors.join(','));q.internalValidation={status:'PASSED',fingerprint:previewFingerprint(q),method:'Schema, refs and exact teaching overlap; human review pending'};return q;});
await writeFile('data/staging/v8/hsk2-pilot.json',JSON.stringify(p,null,2));await writeFile('data/reports/v8/grammar-additions.json',JSON.stringify({count:p.grammarSupplement.length,changes:p.grammarSupplement.map(q=>({id:q.id,before:null,after:q,reason:'Selective addition to one of six topics with only three non-overlap independent questions',validation:'PASSED_STRUCTURE_AND_EXACT_OVERLAP',approvalStatus:'NEEDS_REVIEW'}))},null,2));console.log('6 original HSK1 grammar drafts; no existing question changed');
