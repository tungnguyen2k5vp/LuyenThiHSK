import {validateRegisteredQuestion} from './question-types.mjs';
import {digest} from './v5-quality.mjs';
export function contentReviewPlan(questions,grammar){
 const rows=questions.map(q=>{
  const findings=validateRegisteredQuestion(q);
  for(const field of ['level','skill','questionType','difficulty','vocabularyIds','grammarIds','topicIds','correctAnswer','explanation','sourceType','reviewStatus'])if(q[field]===undefined||q[field]===null||q[field]==='')findings.push('MISSING_'+field);
  if(!q.humanReview||q.humanReview.status!=='APPROVED')findings.push('HUMAN_REVIEW_REQUIRED');
  if(q.options?.length&&new Set(q.options.map(o=>o.text.trim())).size!==q.options.length)findings.push('DUPLICATE_OPTION_TEXT');
  return {id:q.id,revision:q.revision??1,level:String(q.level??q.hskLevel),skill:q.skill,partId:q.partId??null,grammarIds:q.grammarIds??[],contentHash:digest(q),findings:[...new Set(findings)],status:'NEEDS_REVIEW'};
 });
 return {questions:rows,lessonGaps:grammar.filter(g=>g.level==='2').map(g=>{const linked=questions.filter(q=>q.grammarIds?.includes(g.id));return{id:g.id,pattern:g.pattern,detail:g.detail,existingQuestions:linked.length,missingToFive:Math.max(0,5-linked.length),questionIds:linked.map(q=>q.id),reviewStatus:'NEEDS_REVIEW'}}).filter(g=>g.missingToFive>0),publicationAllowed:false};
}
/** Original supplementary drafts. Membership references are not expert approval. */
export function originalHsk2Drafts(referenceWords){
 const vocabularyIds=(texts)=>referenceWords.filter(w=>texts.includes(w.simplified)).map(w=>w.id);
 const specs=[
  {id:'cause',grammarId:'HSK30-2025-GRA-HSK2-00027',title:'因为: nêu nguyên nhân',pattern:'因为 + nguyên nhân，(所以 + kết quả)',explanationVi:'因为 đứng trước nguyên nhân. 所以 có thể đứng trước kết quả. Bài tập này tập trung vào quan hệ nguyên nhân, không dùng 因为 như động từ.',examples:[{zh:'因为今天下雨，所以我们在家吃饭。',pinyin:'Yīnwèi jīntiān xià yǔ, suǒyǐ wǒmen zài jiā chī fàn.',vi:'Vì hôm nay trời mưa nên chúng tôi ăn cơm ở nhà.'}],vocab:['因为','今天','下雨','在','家'],items:[
   ['____今天下雨，所以我们不去公园。',['因为','比','从'],'A','因为 mở đầu nguyên nhân “hôm nay trời mưa”; 所以 mở đầu kết quả.'],
   ['因为他今天很忙，____不能来。',['还是','所以','比'],'B','所以 dẫn kết quả “không thể đến” của nguyên nhân “hôm nay rất bận”.'],
   ['____我喜欢汉语，所以每天都学习。',['跟','从','因为'],'C','因为 dẫn nguyên nhân “tôi thích tiếng Trung”.'],
   ['因为明天有考试，所以我今晚____。',['要学习','比昨天','从学校'],'A','Kết quả phù hợp là “tối nay cần học”. Hai lựa chọn còn lại không tạo được vị ngữ hoàn chỉnh trong câu này.'],
   ['因为今天很冷，所以我____。',['还是昨天','穿了很多衣服','比学校'],'B','“Mặc nhiều quần áo” là kết quả phù hợp với thời tiết lạnh; các cụm còn lại không hoàn thành câu.']
  ]},
  {id:'choice',grammarId:'HSK30-2025-GRA-HSK2-00056',title:'还是: câu hỏi lựa chọn',pattern:'Lựa chọn A + 还是 + lựa chọn B？',explanationVi:'Trong câu hỏi lựa chọn, 还是 nối các khả năng để người nghe chọn. Thường trả lời bằng khả năng được chọn. Không thêm 吗 vào cuối mẫu câu hỏi lựa chọn này.',examples:[{zh:'你想喝茶还是喝水？',pinyin:'Nǐ xiǎng hē chá háishi hē shuǐ?',vi:'Bạn muốn uống trà hay uống nước?'}],vocab:['还是','喝','茶','水','今天','明天'],items:[
   ['你想喝茶____喝水？',['还是','所以','因为'],'A','还是 nối hai lựa chọn “uống trà” và “uống nước” trong câu hỏi.'],
   ['你今天去____明天去？',['比','还是','从'],'B','还是 nối hai thời điểm để người nghe chọn.'],
   ['你喜欢苹果____香蕉？',['所以','因为','还是'],'C','还是 nối hai loại quả trong câu hỏi lựa chọn.'],
   ['“你想吃米饭还是面条？”最直接的回答是：',['我想吃面条。','是的，还是。','因为米饭。'],'A','Trả lời trực tiếp bằng món được chọn: “Tôi muốn ăn mì”.'],
   ['请选择一个不需要再加“吗”的问句。',['你喜欢汉语','你想喝茶还是喝水','你今天很忙'],'B','“你想喝茶还是喝水？” đã là câu hỏi lựa chọn; không cần thêm 吗.']
  ]}
 ];
 const lessons=specs.map(s=>({id:'v15-hsk2-lesson-'+s.id,level:'2',grammarPointId:s.grammarId,title:s.title,pattern:s.pattern,explanationVi:s.explanationVi,examples:s.examples,sourceType:'AI_GENERATED',reviewStatus:'NEEDS_REVIEW',humanReview:{status:'BLOCKED_FOR_HUMAN_REVIEW'},syllabusMapping:'REFERENCE_MEMBERSHIP_PENDING_EXPERT_REVIEW',licenseStatus:'ORIGINAL_DRAFT_PENDING_REVIEW'}));
 const questions=specs.flatMap(s=>s.items.map(([prompt,choices,answer,explanation],i)=>({id:'v15-hsk2-'+s.id+'-'+(i+1),revision:1,number:i+1,level:'2',hskLevel:'2',skill:'reading',type:'fill-blank',questionType:'fill-blank',difficulty:'easy',instruction:'Chọn đáp án phù hợp với cấu trúc đang học.',promptZh:prompt,options:choices.map((text,n)=>({id:String.fromCharCode(65+n),text})),correctAnswer:answer,explanation,vocabularyIds:vocabularyIds(s.vocab),grammarIds:[s.grammarId],topicIds:['daily-life'],sourceType:'AI_GENERATED',reviewStatus:'NEEDS_REVIEW',humanReview:{status:'BLOCKED_FOR_HUMAN_REVIEW'},source:'LuyenThiHSK original V15 supplementary draft',sourceUrl:'local:editorial/v15/original',license:'Original AI-assisted draft; language and level review pending',syllabusVersion:'hsk3-2025',contentEnvironment:'PREVIEW',assessmentSuitability:'SUPPLEMENTARY_PRACTICE',scoring:'objective'})));
 return {lessons,questions,publicationAllowed:false,stagedOnly:true,notes:'No database import, expert approval, official question reproduction or audio rights grant.'};
}
