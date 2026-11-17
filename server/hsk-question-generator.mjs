import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {z} from 'zod';
import {questionSchema,sha256,normalize} from '../shared/hsk-bank.mjs';

export const questionPrompts={
 'multiple-choice':'Biên soạn câu đọc tiếng Trung từ từ mục tiêu. 3 lựa chọn, chỉ 1 đáp án đúng; không dùng đáp án đồng nghĩa. Giải thích bằng tiếng Việt.',
 'fill-blank':'Biên soạn câu ngữ cảnh tiếng Trung với đúng một chỗ trống. Chỉ một lựa chọn phù hợp ngữ pháp và nghĩa. Giải thích tiếng Việt.',
 'sentence-order':'Cung cấp các cụm từ tiếng Trung để sắp thành câu. options rỗng, scoring exact-text, acceptedAnswers chứa mọi thứ tự chấp nhận. Giải thích tiếng Việt.',
 'short-passage':'Biên soạn mới đoạn đọc ngắn và câu hỏi đọc hiểu với 3 phương án, một đáp án đúng và giải thích tiếng Việt. Không sao chép đề thi.',
};
export async function generateHskQuestions({root,input,provider={endpoint:process.env.HSK_AI_ENDPOINT,key:process.env.HSK_AI_KEY,model:process.env.HSK_AI_MODEL},request=fetch}){
 const value=z.object({wordIds:z.array(z.string()).min(1).max(12),level:z.enum(['1','2','3','4','5','6','7-9']),type:z.enum(Object.keys(questionPrompts)).default('multiple-choice'),provider:z.enum(['offline','configured']).default('offline')}).strict().parse(input);
 const all=JSON.parse(await readFile(path.join(root,'public/data/fourchinese/words.json'),'utf8')),byId=new Map(all.map(w=>[w.id,w])),selected=value.wordIds.map(id=>byId.get(id));
 if(selected.some(w=>!w||!w.syllabusLevels.includes(value.level)))throw Object.assign(Error('VOCABULARY_NOT_MATCHED_TO_2025_LEVEL'),{status:422});
 let rows,mode;
 if(value.provider==='configured'){
  if(!provider.endpoint||!provider.model)throw Object.assign(Error('AI_PROVIDER_NOT_CONFIGURED; chọn bộ tạo offline.'),{status:503});
  const url=new URL(provider.endpoint);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['127.0.0.1','localhost'].includes(url.hostname)))throw Object.assign(Error('AI_ENDPOINT_REQUIRES_HTTPS_OR_LOOPBACK'),{status:422});
  const response=await request(url,{method:'POST',headers:{'Content-Type':'application/json',...(provider.key?{Authorization:'Bearer '+provider.key}:{})},body:JSON.stringify({model:provider.model,messages:[{role:'system',content:'Bạn biên soạn bài tập bổ trợ HSK, không phải đề chính thức. '+questionPrompts[value.type]+' Trả JSON {"questions": [...]} theo schema. Mỗi câu có syllabusVersion=hsk3-2025, level='+value.level+'. '+JSON.stringify(z.toJSONSchema(questionSchema))},{role:'user',content:JSON.stringify(selected.map(w=>({id:w.id,hanzi:w.simplified,pinyin:w.pinyin,meaningVi:w.primaryMeaningVi,examples:w.examples})))}],response_format:{type:'json_object'}}),signal:AbortSignal.timeout(45000)});
  if(!response.ok)throw Object.assign(Error('AI_PROVIDER_REQUEST_FAILED_'+response.status),{status:502});
  const data=await response.json();try{rows=JSON.parse(data.choices[0].message.content).questions;}catch{throw Object.assign(Error('AI_PROVIDER_INVALID_JSON'),{status:502});}mode='CONFIGURED_AI';
 }else{
  if(!['multiple-choice','fill-blank'].includes(value.type))throw Object.assign(Error('OFFLINE_SUPPORTS_CHOICE_AND_CONTEXT_GAPS; chọn provider cho dạng khác.'),{status:422});
  const pool=all.filter(w=>w.syllabusLevels.includes(value.level)&&w.primaryMeaningVi?.trim()),used=new Set();rows=[];
  for(const word of selected){
   const example=value.type==='fill-blank'?word.examples.find(e=>e.chinese.split(word.simplified).length===2):null;
   if(value.type==='fill-blank'&&!example)continue;
   const distractors=pool.filter(w=>w.id!==word.id&&normalize(w.primaryMeaningVi)!==normalize(word.primaryMeaningVi)&&w.simplified!==word.simplified&&!normalize(w.primaryMeaningVi).includes(normalize(word.primaryMeaningVi))&&!normalize(word.primaryMeaningVi).includes(normalize(w.primaryMeaningVi))).slice(0,2);if(distractors.length!==2)continue;
   const choices=[word,...distractors].sort((a,b)=>sha256(word.id+a.id).localeCompare(sha256(word.id+b.id))),options=choices.map((w,i)=>({id:'ABC'[i],text:value.type==='fill-blank'?w.simplified:w.primaryMeaningVi}));
   if(new Set(options.map(o=>normalize(o.text))).size!==3||used.has(word.id))continue;used.add(word.id);
   rows.push({id:'hskbank-generated-'+sha256(word.id+value.type).slice(0,20),syllabusVersion:'hsk3-2025',level:value.level,skill:'reading',type:value.type,promptZh:example?example.chinese.replace(word.simplified,'____'):`“${word.simplified}”是什么意思？`,instruction:example?'Chọn từ điền vào chỗ trống.':'Chọn nghĩa tiếng Việt phù hợp. Bài từ vựng bổ trợ, không mô phỏng câu thi chính thức.',options,correctOptionId:options[choices.findIndex(w=>w.id===word.id)].id,explanation:`${word.simplified} (${word.pinyin}): ${word.primaryMeaningVi}. ${example?.vietnamese??''} Lựa chọn nhiễu do bộ tạo ghép, cần người duyệt để loại đáp án đồng nghĩa và câu mơ hồ.`,difficulty:'easy',scoring:'choice',vocabularyIds:[word.id]});
  }
  mode='OFFLINE_VOCABULARY_TEMPLATE';
 }
 const questions=z.array(questionSchema).min(1).max(12).parse(rows);
 if(questions.some(q=>q.syllabusVersion!=='hsk3-2025'||q.level!==value.level||q.type!==value.type))throw Object.assign(Error('AI_OUTPUT_STANDARD_LEVEL_TYPE_MISMATCH'),{status:422});
 return {questions,mode,checks:{schema:'PASSED',uniqueOptionText:'PASSED',answerKeyReference:'PASSED',grammar:'HUMAN_REVIEW_REQUIRED',semanticUniqueness:'HUMAN_REVIEW_REQUIRED',level:'MATCHED_VOCABULARY; QUESTION_REVIEW_REQUIRED'},requested:selected.length,generated:questions.length};
}
