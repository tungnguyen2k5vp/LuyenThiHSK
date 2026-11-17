import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {questionSchema} from '../shared/hsk-bank.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const read=async file=>JSON.parse(await readFile(path.join(root,file),'utf8'));
const words=await read('public/data/fourchinese/words.json');
const original={id:'hsk-project-original',name:'HSK Journey · bài tập tự biên soạn',url:'local:hsk-mvp-original',owner:'Dự án HSK Journey',license:'LicenseRef-Project-Original',rightsStatus:'ORIGINAL',commercialAllowed:true,attribution:'Biên soạn mới với trợ giúp AI cho HSK Journey. Cần duyệt ngôn ngữ, cấp độ và đáp án trước khi xuất bản.',evidenceUrl:'local:data/editorial/hsk-mvp-sample.json',scope:'Bài mẫu kỹ thuật, không phải đề HSK chính thức.'};
const rows1=[
 ['你叫什么名字？',['我叫小明。','我很好。','我十岁。'],0,'叫什么名字 hỏi tên; 我叫小明 nghĩa là tôi tên Tiểu Minh.',['名字','叫']],
 ['现在是三点。现在几点？',['两点','三点','四点'],1,'三点 là ba giờ; thông tin xuất hiện trực tiếp trong câu.',['现在','点']],
 ['妈妈在家喝茶。谁在喝茶？',['老师','爸爸','妈妈'],2,'Chủ ngữ 妈妈 là mẹ, người đang uống trà.',['妈妈','茶']],
 ['小明有两本书。小明有几本书？',['两本','三本','一本'],0,'两本书 là hai quyển sách; 本 là lượng từ của sách.',['两','书']],
 ['今天很热，我想喝冷水。我想喝什么？',['热水','冷水','米饭'],1,'Người nói nêu rõ muốn uống 冷水 (nước lạnh).',['今天','水']],
 ['这是我的老师。他教我们汉语。他做什么工作？',['医生','学生','老师'],2,'Người dạy tiếng Trung trong đoạn là giáo viên (老师).',['老师','汉语']],
 ['小王：你去哪里？小李：我去学校。小李去哪儿？',['学校','商店','医院'],0,'小李 nói 我去学校: tôi đến trường.',['学校','去']],
 ['桌子上有一个苹果。苹果在哪里？',['桌子下','桌子上','椅子上'],1,'桌子上 nghĩa là trên bàn. Không nhầm với 下 là dưới.',['苹果','桌子']],
 ['我每天早上七点起床。我什么时候起床？',['晚上','中午','早上'],2,'Thông tin 早上七点 cho biết buổi sáng lúc bảy giờ.',['早上','起床']],
 ['小白今天不去学校，因为今天是星期日。今天星期几？',['星期日','星期一','星期五'],0,'星期日 là chủ nhật, đã được nêu trong câu.',['星期','今天']],
];
const rows2=[
 ['他昨天没来学校，因为他生病了。他为什么没来？',['他生病了。','他去旅游了。','他不喜欢学校。'],0,'因为 dẫn nguyên nhân: anh ấy bị bệnh.',['因为','生病']],
 ['这件衣服比那件便宜。哪件衣服更贵？',['这件','那件','一样贵'],1,'这件比那件便宜 nghĩa là chiếc này rẻ hơn chiếc kia, nên chiếc kia đắt hơn.',['便宜','衣服']],
 ['离考试还有三天，我每天都复习。什么时候考试？',['昨天','今天','三天后'],2,'还有三天 chỉ khoảng thời gian còn ba ngày, tức ba ngày nữa.',['考试','每天']],
 ['我已经吃过饭了，现在不饿。这个人现在怎么样？',['不饿','很饿','想吃饭'],0,'已经……了 biểu thị việc đã hoàn thành; người nói hiện không đói.',['已经','吃饭']],
];
const orders=[
 ['我 / 每天 / 学习 / 汉语',['我每天学习汉语。'],'Trật tự chủ ngữ + thời gian + động từ + tân ngữ: 我每天学习汉语。',['学习','汉语']],
 ['他 / 正在 / 看 / 书',['他正在看书。'],'正在 đứng trước động từ để diễn tả hành động đang xảy ra.',['正在','书']],
 ['你 / 为什么 / 没有 / 来',['你为什么没有来？'],'为什么 đứng sau chủ ngữ; 没有 phủ định hành động đã xảy ra.',['为什么','来']],
 ['我 / 想 / 喝 / 一杯 / 茶',['我想喝一杯茶。'],'想 + động từ diễn tả mong muốn; 一杯茶 là một tách trà.',['喝','茶']],
 ['这本书 / 是 / 我 / 的',['这本书是我的。'],'Cấu trúc 是……的 ở đây xác nhận sở hữu: quyển sách này là của tôi.',['书','我']],
 ['因为 / 下雨 / 所以 / 我们 / 不 / 出去',['因为下雨，所以我们不出去。'],'因为……所以…… nối nguyên nhân trời mưa và kết quả không ra ngoài.',['因为','下雨']],
];
const vocabularyIds=terms=>words.filter(w=>terms.includes(w.simplified)).map(w=>w.id).slice(0,12);
const mc=(row,index,level)=>questionSchema.parse({id:`hskbank-original-${level}-${String(index+1).padStart(2,'0')}`,syllabusVersion:'hsk3-2025',level,skill:'reading',type:index>4?'short-passage':'multiple-choice',promptZh:row[0],instruction:'Đọc nội dung tiếng Trung và chọn một đáp án đúng.',options:row[1].map((text,i)=>({id:'ABC'[i],text})),correctOptionId:'ABC'[row[2]],explanation:row[3],difficulty:'easy',scoring:'choice',vocabularyIds:vocabularyIds(row[4])});
const originals=[...rows1.map((r,i)=>mc(r,i,'1')),...rows2.map((r,i)=>mc(r,i,'2')),...orders.map((r,i)=>questionSchema.parse({id:`hskbank-original-2-order-${i+1}`,syllabusVersion:'hsk3-2025',level:'2',skill:'writing',type:'sentence-order',promptZh:r[0],instruction:'Sắp xếp các từ thành câu rồi nhập câu hoàn chỉnh. Bỏ qua khác biệt dấu câu và khoảng trắng khi chấm.',options:[],acceptedAnswers:r[1],explanation:r[2],difficulty:'medium',scoring:'exact-text',vocabularyIds:vocabularyIds(r[3])}))];
const config=await read('data/sources/open-hsk.json'),manifest=await read('public/data/open-hsk/manifest.json');
const no7z={id:'hsk-no7z-cc-by-sa',name:'no7z / Jayoung · HSK sentences audio',url:config.no7z.repository,owner:'no7z / Jayoung và những người đóng góp',license:'CC BY-SA 4.0',rightsStatus:'VERIFIED_OPEN',commercialAllowed:true,attribution:'no7z/Jayoung; CC-CEDICT contributors; audio tổng hợp CosyVoice2-0.5B (Apache-2.0). Bài phái sinh CC BY-SA 4.0. '+config.no7z.commit,evidenceUrl:config.no7z.repository+'/blob/'+config.no7z.commit+'/ATTRIBUTION.md',scope:'Chỉ dist sentence/audio dataset tại commit đã khóa; không coi MIT của code là giấy phép câu/audio.'};
const licensed=[];
for(const skill of ['listening','reading']){
 const entry=manifest.sets.find(e=>e.sourceName?.includes('no7z')&&e.levelCode==='HSK 1'&&e.skills[skill]&&e.types['multiple-choice']);
 if(!entry)throw Error('Existing licensed no7z bank not found: '+skill);
 const bank=await read('public'+entry.url);
 for(const q of bank.questions.filter(q=>q.skill===skill&&q.options.length&&q.correctOptionId).slice(0,6))licensed.push(questionSchema.parse({id:'hskbank-no7z-'+q.id,syllabusVersion:'hsk3-2021',level:'1',skill,type:'multiple-choice',promptZh:skill==='listening'?'请听录音，选择对应的句子。':q.promptZh,instruction:skill==='listening'?'Nghe audio và chọn câu tương ứng. Audio tổng hợp, được nghe lại trong chế độ luyện tập.':q.instruction,options:q.options.map(o=>({id:o.id,text:o.text})),correctOptionId:q.correctOptionId,explanation:q.explanation,difficulty:'easy',scoring:'choice',...(skill==='listening'?{audio:{kind:'file',src:q.audio.src,slowSrc:q.audio.slowSrc,sha256:q.audio.sha256,voiceKind:'synthetic',transcript:q.audio.transcript}}:{}),vocabularyIds:[]}));
}
const sample={batches:[{source:original,questions:originals},{source:no7z,questions:licensed}],exams:[
 {id:'hskbank-sample-2025-1',title:'HSK 1 · Đọc hiểu mỗi ngày',standardId:'hsk3-2025',level:'1',durationMinutes:12,description:'10 câu đọc hiểu tự biên soạn để làm quen luồng thi, xem giải thích và tìm từ liên quan. Nội dung cần duyệt chuyên môn.',questionIds:originals.filter(q=>q.level==='1').map(q=>q.id)},
 {id:'hskbank-sample-2025-2',title:'HSK 2 · Đọc và sắp xếp câu',standardId:'hsk3-2025',level:'2',durationMinutes:15,description:'Bài luyện 4 câu đọc và 6 câu sắp xếp thành câu. Chấm văn bản theo đáp án mẫu, không chấm viết tự do.',questionIds:originals.filter(q=>q.level==='2').map(q=>q.id)},
 {id:'hskbank-sample-2021-1',title:'HSK 1 · Nghe và đọc cùng no7z',standardId:'hsk3-2021',level:'1',durationMinutes:15,description:'12 bài tập từ nguồn no7z có CC BY-SA 4.0. Audio tổng hợp, cấp theo GF0025-2021; không trộn với đề cương 2025.',questionIds:licensed.map(q=>q.id)},
]};
await mkdir(path.join(root,'data/editorial'),{recursive:true});await writeFile(path.join(root,'data/editorial/hsk-mvp-sample.json'),JSON.stringify(sample,null,2)+'\n');console.log(JSON.stringify({originalQuestions:originals.length,licensedQuestions:licensed.length,sampleExams:sample.exams.length,publication:'NONE; human review pending'}));
