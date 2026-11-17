import {buildV6Exam} from '../shared/v6-quality.mjs';
import {partCoverage} from '../shared/hsk1-parts.mjs';
import {v11MockReadiness} from '../shared/v11-quality.mjs';
import {HSK2_PLATFORM_TEMPLATE} from '../shared/v10-mock.mjs';
/** Authenticated local preview metadata only. No attempt writer, grading or new publication route. */
export function createV14CatalogService({v6,v13}){
 async function catalog({includePractice=false}={}){
  const [bundle,p]=await Promise.all([v6.release(),v13.practice()]),validation=await v6.validate(bundle),coverage=partCoverage(bundle),variants=coverage.length?Math.min(...coverage.map(p=>p.independentVariants)):0;
  const cards=[];
  for(let i=0;i<Math.min(2,variants);i++){
   const seed='v14-hsk1-platform-'+(i+1);let exam=null,errors=[...validation.errors];
   try{exam=buildV6Exam(bundle,{kind:'full',seed});}catch(e){errors.push(e.message)}
   if(!exam)continue;
   cards.push({id:seed,title:'HSK 1 · Platform Practice '+(i+1),level:'1',syllabusVersion:exam.questions[0]?.syllabusVersion??'unverified',version:exam.version,type:'full',scope:'privatePreview',questionCount:exam.questions.length,durationMinutes:exam.durationMinutes,sections:exam.config.sections.map((s,index)=>({id:String(index),skill:s.skill,label:s.label,questionCount:s.questionIds.length,durationMinutes:s.durationMinutes})),canStart:errors.length===0,modes:{practice:errors.length===0,timed:errors.length===0},reasons:errors,formatAuthority:'PLATFORM_PRACTICE',humanReviewed:false,published:false,launch:{route:'admin/v6/build',body:{kind:'full',mode:'PREVIEW',seed}},audioPolicy:{...exam.config.audio,authority:'PLATFORM_POLICY'},questionRevisions:exam.questions.map(q=>({id:q.id,revision:q.revision}))});
  }
  if(includePractice)for(const spec of [{kind:'drill',skill:'listening',title:'Nghe · Luyện 5 câu',category:'skill'},{kind:'drill',skill:'reading',title:'Đọc · Luyện 5 câu',category:'skill'},{kind:'mini',title:'Mini Test · Nghe và Đọc',category:'short'}]){
   const seed='v15-hsk1-'+spec.kind+'-'+(spec.skill??'mixed');
   const exam=buildV6Exam(bundle,{kind:spec.kind,skill:spec.skill,seed});
   cards.push({id:seed,title:spec.title,level:'1',type:spec.kind,category:spec.category,scope:'privatePreview',questionCount:exam.questions.length,durationMinutes:exam.durationMinutes,sections:(exam.config?.sections??[...new Set(exam.questions.map(q=>q.skill))].map(skill=>({skill,label:skill==='listening'?'Nghe':'Đọc',questionIds:exam.questions.filter(q=>q.skill===skill).map(q=>q.id),durationMinutes:exam.durationMinutes}))).map((s,i)=>({id:String(i),skill:s.skill,label:s.label,questionCount:s.questionIds.length,durationMinutes:s.durationMinutes})),canStart:validation.errors.length===0,reasons:validation.errors,formatAuthority:'PLATFORM_PRACTICE',humanReviewed:false,published:false,launch:validation.errors.length?null:{route:'admin/v6/build',body:{kind:spec.kind,...(spec.skill?{skill:spec.skill}:{}),mode:'PREVIEW',seed}},questionRevisions:exam.questions.map(q=>({id:q.id,revision:q.revision}))});
  }
  const ready=v11MockReadiness(p.questions,{assets:p.assets});
  cards.push({id:'v14-hsk2-platform',title:'HSK 2 · Platform Practice / BETA',level:'2',syllabusVersion:HSK2_PLATFORM_TEMPLATE.syllabusVersion,version:'hsk3',type:'full',scope:'privatePreview',questionCount:HSK2_PLATFORM_TEMPLATE.totalQuestions,durationMinutes:Object.values(HSK2_PLATFORM_TEMPLATE.timing).reduce((a,b)=>a+b,0),sections:Object.entries(HSK2_PLATFORM_TEMPLATE.timing).map(([skill,durationMinutes],index)=>({id:String(index),skill,label:skill,questionCount:HSK2_PLATFORM_TEMPLATE.parts.filter(p=>p.skill===skill).reduce((n,p)=>n+p.count,0),durationMinutes})),canStart:ready.capabilities.canLaunchPrivatePractice,modes:{practice:ready.capabilities.canLaunchPrivatePractice,timed:ready.capabilities.canLaunchPrivatePractice},reasons:ready.errors,formatAuthority:'PLATFORM_PRACTICE',humanReviewed:false,published:false,launch:ready.capabilities.canLaunchPrivatePractice?{route:'admin/v12/build',body:{kind:'full',mode:'PREVIEW',seed:'v14-hsk2-platform'}}:null,audioPolicy:{...HSK2_PLATFORM_TEMPLATE.audio,authority:'PLATFORM_POLICY'},questionRevisions:ready.questionRevisions.map(([id,revision])=>({id,revision}))});
  return{scope:'privatePreview',authority:'PLATFORM_PRACTICE',cards,total:cards.length,available:cards.filter(c=>c.canStart).length,publiclyReleasable:0,secureExam:false};
 }
 return{catalog,async handle({url,req,send}){
  if(!/^\/api\/admin\/v1[45]\//.test(url.pathname))return false;
  const v15=url.pathname.startsWith('/api/admin/v15/'),route=url.pathname.replace('/v15/','/v14/');
  if(req.method!=='GET'){send(405,{error:'READ_ONLY_CATALOG'});return true;}
  if(route==='/api/admin/v14/catalog'){
   const data=await catalog({includePractice:v15}),level=url.searchParams.get('level'),query=(url.searchParams.get('q')??'').trim().toLocaleLowerCase(),status=url.searchParams.get('status')??'all';
   if(level&&!['1','2'].includes(level)||!['all','available','blocked'].includes(status)||query.length>200){send(422,{error:'INVALID_FILTER'});return true;}
   const cards=data.cards.filter(c=>(!level||c.level===level)&&(!query||c.title.toLocaleLowerCase().includes(query))&&(status==='all'||status==='available'&&c.canStart||status==='blocked'&&!c.canStart));send(200,{...data,cards,filteredTotal:cards.length});return true;
  }
  if(route==='/api/admin/v14/intro'){
   const data=await catalog({includePractice:v15}),card=data.cards.find(c=>c.id===url.searchParams.get('id'));if(!card){send(404,{error:'EXAM_NOT_FOUND'});return true;}
   send(200,{exam:card,rules:['PLATFORM PRACTICE MOCK / BETA','Mode is fixed by the existing attempt owner at start.','No feedback before check in practice or submit in timed mode.','Unscored writing is not counted as incorrect.'],secureExam:false});return true;
  }
  send(404,{error:'NOT_FOUND'});return true;
 }};
}
