import {availableForPractice} from '../shared/practice-selection.mjs';

// Local personal practice keeps editorial status and publication gates intact.
export function createLearnerPractice({db,v5,v6}){
 function questions(){return db.prepare("SELECT c.payload FROM content c WHERE c.kind='questions' AND c.revision=(SELECT MAX(x.revision) FROM content x WHERE x.id=c.id) AND c.status!='ARCHIVED'").all().map(r=>JSON.parse(r.payload)).filter(q=>q.sourceType==='AI_GENERATED'&&q.provenance?.rights_status==='original'&&q.provenance.is_original===true&&/^v(?:6|8|9|10|11|12|13)-hsk/.test(q.editorialRelease??'')&&availableForPractice(q)&&(!q.audio||/^\/api\/admin\/v[56]\/audio\/[a-z0-9-]+$/.test(q.audio.src??'')));}
 const learnerUrl=src=>src.replace('/api/admin/','/api/learner/');
 function catalog(){
  const groups=Object.groupBy(questions(),q=>[q.level,q.skill].join(':'));
  return {environment:'LOCAL_PERSONAL_PREVIEW',banks:Object.entries(groups).map(([key,rows])=>{
   const [level,skill]=key.split(':'),label={listening:'Nghe',reading:'Đọc',writing:'Viết'}[skill]??skill;
   const mapped=JSON.parse(JSON.stringify(rows).replace(/\/api\/admin\/v([56])\/(audio|image)\//g,'/api/learner/v$1/$2/'));
   return {id:'local-practice:'+key,title:`HSK ${level} · ${label} · Kho bài có sẵn`,version:'hsk3',levelCode:'HSK '+level,skill,skillLabel:label,topic:'Nội dung dự án',mode:'quick',modeLabel:'Luyện cá nhân',durationMinutes:10,durationKind:'custom',difficulty:'Trung bình',description:'Tận dụng nội dung AI có sẵn trong dự án để luyện cá nhân trên máy này.',contentLabel:'Bản luyện thử · nội dung AI chưa được duyệt chuyên môn',contentEnvironment:'PREVIEW',formatAuthority:'PLATFORM_PRACTICE',isDemo:true,provenance:rows[0].provenance,totalQuestions:mapped.length,questions:mapped.map((q,i)=>({...q,number:i+1}))};
  })};
 }
 async function handle(ctx){
  const {url,req,send}=ctx;
  if(!url.pathname.startsWith('/api/learner/'))return false;
  if(req.method!=='GET'){send(405,{error:'READ_ONLY_PRACTICE'});return true;}
  if(url.pathname==='/api/learner/catalog'){send(200,catalog());return true;}
  if(!/^\/api\/learner\/v[56]\/(?:audio|image)\/[a-z0-9-]+$/.test(url.pathname)){send(404,{error:'NOT_FOUND'});return true;}
  const referenced=new Set();
  for(const q of questions())for(const src of [q.audio?.src,q.image?.src,...q.options.map(o=>o.image?.src)])if(src)referenced.add(learnerUrl(src));
  if(!referenced.has(url.pathname)){send(404,{error:'MEDIA_NOT_IN_PRACTICE'});return true;}
  const original=new URL(url);original.pathname=url.pathname.replace('/api/learner/','/api/admin/');
  return (original.pathname.startsWith('/api/admin/v6/')?v6:v5).handle({...ctx,url:original});
 }
 return{catalog,handle};
}
