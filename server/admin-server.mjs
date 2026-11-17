import {createHskExamService} from './hsk-exam-service.mjs';
import {createV14CatalogService} from './v14-exam-catalog-service.mjs';
import {createLearnerPractice} from './learner-practice.mjs';
import {createCommunityAudio} from './community-audio.mjs';
import {publicContentRows} from './content-reads.mjs';
import {createV13Service} from './v13-content-service.mjs';
import {createV12Service} from './v12-content-service.mjs';
import {createV11Service} from './v11-content-service.mjs';
import {createV10Service} from './v10-content-service.mjs';
import {createV9Service} from './v9-content-service.mjs';
import {createV8Service} from './v8-content-service.mjs';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { KINDS, validateRecord, allowedTransition } from './content-contract.mjs';
import { createV3Service } from './v3-content-service.mjs';
import { createV4Service } from './v4-content-service.mjs';
import {createV5Service} from './v5-content-service.mjs';
import {createV6Service} from './v6-content-service.mjs';
import {createV7ReviewService} from './v7-review-service.mjs';
import { readMedia } from './media-store.mjs';
import {planImportRows} from '../shared/import-plan.mjs';
if(process.env.NODE_ENV==='production')throw Error('LOCAL_ADMIN_ONLY: production requires authenticated server RBAC, HTTPS and isolated content services.');
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const runtime=process.env.HSK_RUNTIME_DIR?path.resolve(process.env.HSK_RUNTIME_DIR):path.join(root,'.runtime');await mkdir(runtime,{recursive:true});
const token=process.env.HSK_ADMIN_TOKEN??randomBytes(32).toString('hex');
const db=new DatabaseSync(path.join(runtime,'hsk-content.sqlite'));
db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS content(id TEXT NOT NULL,revision INTEGER NOT NULL,kind TEXT NOT NULL,status TEXT NOT NULL,payload TEXT NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,PRIMARY KEY(id,revision)); CREATE INDEX IF NOT EXISTS content_status_kind ON content(status,kind); CREATE TABLE IF NOT EXISTS imports(id TEXT PRIMARY KEY,checksum TEXT UNIQUE,report TEXT NOT NULL,created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,action TEXT NOT NULL,entity_id TEXT,revision INTEGER,created_at TEXT NOT NULL);');
const insert=db.prepare('INSERT INTO content VALUES(?,?,?,?,?,?,?)');const audit=db.prepare('INSERT INTO audit(action,entity_id,revision,created_at) VALUES(?,?,?,?)');
const v3=createV3Service({db,root,runtime,addRecord});
const v4=createV4Service({db,root,runtime,addRecord});
const v5=createV5Service({db,root,runtime,addRecord});
const v6=createV6Service({db,root,runtime,addRecord});
const v7=createV7ReviewService({db,root,v6,v3,reviewers:JSON.parse(process.env.HSK_REVIEWERS_JSON??'[]')});
const v8=createV8Service({db,root,v6,addRecord});
const v9=createV9Service({db,root,addRecord});
const v10=createV10Service({db,root,runtime,addRecord,v9,v7,v3,reviewers:JSON.parse(process.env.HSK_REVIEWERS_JSON??'[]')});
const v11=createV11Service({db,root,runtime,addRecord,v10,reviewers:JSON.parse(process.env.HSK_REVIEWERS_JSON??'[]')});
const authFailures=new Map();
function latest(id){return db.prepare('SELECT * FROM content WHERE id=? ORDER BY revision DESC LIMIT 1').get(id);}
const v12=createV12Service({db,root,runtime,addRecord,v11,v7,v3,reviewers:JSON.parse(process.env.HSK_REVIEWERS_JSON??'[]')});
const v13=createV13Service({db,root,runtime,addRecord,v12});
const v14=createV14CatalogService({v6,v13});
const learnerPractice=createLearnerPractice({db,v5,v6});
const communityAudio=createCommunityAudio({root,runtime});
const hskExams=await createHskExamService({db,root,runtime,addRecord,authorized});
const examDeadlineSweep=setInterval(()=>{try{hskExams.sweepExpired();}catch(error){console.error('HSK deadline sweep: '+error.message);}},5000);examDeadlineSweep.unref();
function addRecord(kind,payload){const existing=latest(payload.id);if(existing&&/^v(?:6|8|9|10|11|12|13)-/.test(JSON.parse(existing.payload).editorialRelease??'')){const previous=JSON.parse(existing.payload);if(payload.editorialRelease!==previous.editorialRelease||previous.sourceType==='AI_GENERATED'&&payload.sourceType!=='AI_GENERATED')throw Object.assign(Error('EDITORIAL_RELEASE_IS_IMMUTABLE'),{status:409});}if(existing&&existing.kind!==kind)throw Object.assign(Error('ID đã thuộc loại nội dung khác'),{status:409});const revision=(existing?.revision??0)+1;const now=new Date().toISOString();const defaults=kind==='vocabulary'?{traditional:payload.simplified,meaningsEn:[],pos:[],topic:'',translationStatus:'missing'}:kind==='grammar'?{category:'',detail:''}:kind==='hanzi'?{pinyin:'',meaningVi:'',strokeCount:null,strokeUrl:null,exampleWords:[]}:{};const original=['GENERATED','AI_GENERATED','ORIGINAL','INTERNAL'].includes(payload.sourceType);const provenance=['questions','exams'].includes(kind)?{source_name:payload.source,source_url:payload.sourceUrl,source_version:payload.syllabusVersion,retrieved_at:now.slice(0,10),license:payload.license,rights_status:original?'original':'open_license_verified',is_original:original,attribution:payload.source}:undefined;const p=v3.decorate(kind,{...defaults,...payload,...(provenance&&!payload.provenance?{provenance}:{}),importedAt:payload.importedAt??now,verifiedAt:null},now,revision);insert.run(p.id,revision,kind,p.reviewStatus,JSON.stringify(p),now,now);audit.run('CREATE_DRAFT',p.id,revision,now);v3.recordAudit('CREATE_REVISION',p.id,revision,existing?JSON.parse(existing.payload):null,p);return p;}
function authorized(request){const supplied=Buffer.from((request.headers.authorization??'').replace(/^Bearer /,''));const expected=Buffer.from(token);return supplied.length===expected.length&&timingSafeEqual(supplied,expected);}
async function body(req){let size=0;const chunks=[];for await(const c of req){size+=c.length;if(size>4*1024*1024)throw Object.assign(Error('Payload quá 4 MB'),{status:413});chunks.push(c);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw Object.assign(Error('JSON không hợp lệ'),{status:400});}}
const server=createServer(async(req,res)=>{
  const requestOrigin=req.headers.origin;
  if(!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host??'')){res.writeHead(403);res.end();return;}
  if(requestOrigin&&!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(requestOrigin)){res.writeHead(403);res.end();return;}
  res.setHeader('Referrer-Policy','no-referrer');
  if(requestOrigin&&/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(requestOrigin)){
    res.setHeader('Access-Control-Allow-Origin',requestOrigin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Credentials','true');res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, OPTIONS');
  }
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  const url=new URL(req.url,'http://127.0.0.1');
  try{
    if(url.pathname==='/api/health')return send(200,{ok:true,storage:'sqlite',adminConfigured:true});
    if(await hskExams.handle({url,req,res,send,body}))return;
    if(url.pathname.startsWith('/api/media/')&&req.method==='GET'){
      const audio=db.prepare("SELECT c.* FROM content c WHERE c.kind='audio' AND c.status='PUBLISHED' AND json_extract(c.payload,'$.storageUrl')=? AND (SELECT status FROM content x WHERE x.id=c.id ORDER BY revision DESC LIMIT 1)!='ARCHIVED'").get(url.pathname);
      if(!audio)return send(404,{error:'Audio chưa được công bố'});const media=await readMedia(runtime,url.pathname);res.writeHead(200,{'Content-Type':media.mime,'Content-Length':media.buffer.length,'Cache-Control':'public,max-age=86400','X-Content-Type-Options':'nosniff'});res.end(media.buffer);return;
    }
    if(url.pathname==='/api/public/content'&&req.method==='GET'){
      const rows=publicContentRows(db);return send(200,{records:rows.map(r=>({id:r.id,kind:r.kind,revision:r.revision,payload:JSON.parse(r.payload)}))});
    }
    if(await communityAudio({url,req,res,send}))return;
    if(await learnerPractice.handle({url,req,res,send}))return;
    if(!url.pathname.startsWith('/api/admin/'))return send(404,{error:'NOT_FOUND'});
    const address=req.socket.remoteAddress??'loopback';const failure=authFailures.get(address);if(!authorized(req)&&failure&&failure.until>Date.now()&&failure.count>=30)return send(429,{error:'Too many failed credentials; retry in one minute'});
    if(!authorized(req)){const old=failure?.until>Date.now()?failure:{count:0,until:Date.now()+60000};authFailures.set(address,{...old,count:old.count+1});return send(401,{error:'Cần mã quản trị của local server.'});}
    const origin=req.headers.origin;if(origin&&!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin))return send(403,{error:'Origin không được phép'});
    if(await v3.handle({url,req,send,body}))return;
    if(await v4.handle({url,req,send,body,res}))return;
    if(await v5.handle({url,req,send,body,res}))return;
    if(await v6.handle({url,req,send,body,res}))return;
    if(await v7.handle({url,req,send,body,res}))return;
    if(await v8.handle({url,req,send,body,res}))return;
    if(await v9.handle({url,req,send,body,res}))return;
    // Existing V10 clients must use the current HSK2 mock publication/practice gates.
    if(req.method==='POST'&&url.pathname==='/api/admin/v10/build'){
      const input=await body(req),gatedUrl=new URL(url);gatedUrl.pathname='/api/admin/v12/build';
      await v12.handle({url:gatedUrl,req,res,send,body:async()=>({...input,mode:input.mode??'PREVIEW'})});return;
    }
    if(await v10.handle({url,req,send,body,res}))return;
    if(await v14.handle({url,req,send,body,res}))return;
    if(await v13.handle({url,req,send,body,res}))return;
    if(await v12.handle({url,req,send,body,res}))return;
    if(await v11.handle({url,req,send,body,res}))return;
    if(url.pathname==='/api/admin/content'&&req.method==='GET'){
      const kind=url.searchParams.get('kind');const rows=db.prepare('SELECT c.* FROM content c WHERE c.revision=(SELECT MAX(x.revision) FROM content x WHERE x.id=c.id) ORDER BY c.updated_at DESC LIMIT 10000').all().filter(r=>!kind||r.kind===kind);return send(200,{records:rows.map(r=>({...r,payload:JSON.parse(r.payload)}))});
    }
    if(url.pathname==='/api/admin/content'&&req.method==='POST'){
      const {kind,payload,expectedRevision}=await body(req);const errors=validateRecord(kind,payload);if(errors.length)return send(422,{errors});const existing=latest(payload.id);if(existing&&/^v(?:6|8|9|10|11|12|13)-/.test(JSON.parse(existing.payload).editorialRelease??'')&&expectedRevision===undefined||expectedRevision!==undefined&&expectedRevision!==(existing?.revision??0))return send(409,{error:'Nội dung đã có revision mới. Tải lại trước khi sửa.'});return send(201,{record:addRecord(kind,payload)});
    }
    if(url.pathname==='/api/admin/status'&&req.method==='POST'){
      const {id,revision,status,reviewed,reviewer,comment,reviewerCredential}=await body(req);const record=latest(id);if(!record||record.revision!==revision)return send(409,{error:'Revision không còn mới nhất'});if(!allowedTransition(record.status,status,reviewed,JSON.parse(record.payload).editorialRelease ? 'questions' : record.kind))return send(422,{error:'Chuyển trạng thái chưa hợp lệ hoặc chưa xác nhận review'});const payload=JSON.parse(record.payload);if(['v6-hsk1','v8-hsk2-pilot','v8-hsk1-supplement','v9-hsk2-practice','v9-hsk1-supplement','v10-hsk2','v11-hsk2','v12-hsk2','v13-hsk2'].includes(payload.editorialRelease)&&reviewer?.trim()&&['LANGUAGE_REVIEW','HSK_LEVEL_REVIEW','APPROVED','PUBLISHED'].includes(status)&&!v7.guard(reviewer,reviewerCredential,status==='PUBLISHED'?'PUBLISHED':status))return send(403,{error:'AUTHORIZED_HUMAN_REVIEWER_REQUIRED'});const before={...payload};const errors=status==='ARCHIVED'?[]:[...validateRecord(record.kind,payload),...v3.review(record,status,reviewer,comment),...(status==='PUBLISHED'?await v3.publicationIssues(record.kind,payload):[])];if(errors.length)return send(422,{errors});payload.reviewStatus=status;if(status==='APPROVED')payload.verifiedAt=new Date().toISOString();const now=new Date().toISOString();payload.updatedAt=now;if(status==='PUBLISHED'){payload.publishedAt=now;if(record.kind==='questions')payload.qualityScore=100;}db.exec('BEGIN IMMEDIATE');try{db.prepare('UPDATE content SET status=?,payload=?,updated_at=? WHERE id=? AND revision=?').run(status,JSON.stringify(payload),now,id,revision);audit.run(status,id,revision,now);if(!(status==='NEEDS_REVIEW'&&payload.editorialRelease?.match(/^v(?:8|9|10|11|12|13)-/)))v3.saveReview(record,status,reviewer,comment);v3.recordAudit(status,id,revision,before,payload,reviewer||'local-admin');db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}return send(200,{ok:true});
    }
    if(url.pathname==='/api/admin/imports'&&req.method==='POST'){
      const {kind,rows,dryRun=true}=await body(req);if(!KINDS.includes(kind)||!Array.isArray(rows)||rows.length>2000)return send(422,{error:'Import cần loại dữ liệu và tối đa 2.000 records'});const planned=planImportRows(kind,rows,latest,validateRecord);const accepted=planned.accepted;
      const checksum=createHash('sha256').update(JSON.stringify({kind,rows})).digest('hex');const prior=db.prepare('SELECT report FROM imports WHERE checksum=?').get(checksum);if(prior&&!dryRun)return send(200,{...JSON.parse(prior.report),replayed:true});
      const report={...planned.report,checksum,dryRun,preview:accepted.slice(0,8)};
      if(!dryRun){db.exec('BEGIN IMMEDIATE');try{for(const p of accepted)addRecord(kind,p);db.prepare('INSERT INTO imports VALUES(?,?,?,?)').run(randomBytes(12).toString('hex'),checksum,JSON.stringify(report),new Date().toISOString());db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}}
      return send(200,report);
    }
    if(url.pathname==='/api/admin/quality'&&req.method==='GET'){
      const manifest=JSON.parse(await readFile(path.join(root,'public/data/manifest.json'),'utf8'));const rows=db.prepare('SELECT kind,status,COUNT(*) count FROM content GROUP BY kind,status').all();const imports=db.prepare('SELECT * FROM imports ORDER BY created_at DESC LIMIT 20').all();const logs=db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 30').all();return send(200,{manifest,counts:rows,imports:imports.map(i=>({...i,report:JSON.parse(i.report)})),audit:logs});
    }
    return send(404,{error:'NOT_FOUND'});
  }catch(e){console.error(JSON.stringify({event:'request_error',path:url.pathname,message:e.message}));send(e.status??500,{error:e.status?e.message:'Yêu cầu chưa thực hiện được. Xem log local server.'});}
});
const port=Number(process.env.HSK_API_PORT??8787);
server.on('error',error=>{console.error('HSK API startup: '+error.code);db.close();process.exitCode=1;});
server.listen(port,'127.0.0.1',async()=>{try{await writeFile(path.join(runtime,'admin-access.txt'),'Local HSK content administrator\nOpen /?view=admin and enter this token. Token changes when the server restarts.\n'+token+'\n',{mode:0o600});console.log('HSK content API: http://127.0.0.1:'+port+' · admin token stored in .runtime/admin-access.txt');}catch(error){console.error('Cannot store local access token: '+error.message);server.close(()=>{db.close();process.exitCode=1;});}});
process.on('SIGINT',()=>server.close(()=>{db.close();process.exit(0);}));
