import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {createLearnerPractice} from '../server/learner-practice.mjs';
import {validateQuestion} from '../src/data/contentValidation.ts';
import {validateImportedPractice,makePracticeSelection} from '../src/services/practiceCatalog.ts';
import {questionStatus,summarizeAttempt} from '../src/services/examScoring.ts';
import {emptyStudyData,writeStudyData,readStudyData} from '../src/services/studyStorage.ts';
import {reviewExam,rememberExam} from '../src/data/examCatalog.ts';
import {updateReview} from '../src/services/reviewQueue.ts';

const memory=new Map();globalThis.window={localStorage:{getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)}};
const manifest=JSON.parse(await readFile('public/data/mandarin-zone/manifest.json','utf8'));
assert.equal(manifest.sets.length,12);let count=0;
for(const entry of manifest.sets){
 const bytes=await readFile('public'+entry.url);assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);
 const bank=validateImportedPractice(JSON.parse(bytes));count+=bank.questions.length;
 for(const q of bank.questions){assert.equal(questionStatus(q,q.correctOptionId),'correct',q.id);assert.equal(questionStatus(q,q.options.find(o=>o.id!==q.correctOptionId).id),'incorrect',q.id);}
 const quiz=makePracticeSelection(bank,{skill:'reading',limit:10});assert.equal(quiz.questions.length,10);assert(quiz.questions.every(q=>q.skill==='reading'));assert.equal(summarizeAttempt(quiz,{answers:Object.fromEntries(quiz.questions.map((q,i)=>[i,q.correctOptionId]))}).correctCount,10);
 const next=makePracticeSelection(bank,{skill:'reading',recentIds:quiz.questions.map(q=>q.id),limit:10});assert(!next.questions.some(q=>quiz.questions.some(p=>p.id===q.id)));
}
assert.equal(count,manifest.totalQuestions);assert.equal(count,1033);
const db=new DatabaseSync('.runtime/hsk-content.sqlite',{readOnly:true});
const before=JSON.stringify(db.prepare('SELECT id,revision,status,payload FROM content ORDER BY id,revision').all());
const learner=createLearnerPractice({db,v5:{handle:()=>{throw Error('Unexpected media forwarding');}},v6:{handle:()=>{throw Error('Unexpected media forwarding');}}});
const local=learner.catalog();let originalCount=0;
for(const bank of local.banks){
 originalCount+=bank.questions.length;assert.equal(bank.contentEnvironment,'PREVIEW');
 for(const q of bank.questions)assert.deepEqual(validateQuestion(q,q.id),[],q.id);
 const quiz=makePracticeSelection(bank,{limit:bank.totalQuestions});rememberExam(quiz);
 const now=new Date().toISOString(),data=emptyStudyData();data.sessions=[{id:'test-session',examId:quiz.id,examSnapshot:quiz,mode:'practice',answers:{0:'A'},currentIndex:0,flaggedQuestionIds:[],checkedQuestionIds:[],startedAt:now,updatedAt:now}];
 assert(writeStudyData(data));assert.equal(readStudyData().sessions[0]?.examSnapshot?.id,quiz.id,'Local draft snapshot must survive reload');
 const review=reviewExam(quiz,[quiz.questions[0].id]);data.sessions[0].examId=review.id;data.sessions[0].examSnapshot=review;writeStudyData(data);assert.equal(readStudyData().sessions[0]?.examSnapshot?.id,review.id,'Review snapshot must survive reload');
 const q=quiz.questions.find(q=>q.scoring!=='manual'&&!q.matching?.items);if(q){const index=quiz.questions.indexOf(q),wrong=q.options.find(o=>o.id!==q.correctOptionId)?.id;if(wrong){const queue=updateReview([],quiz,index,wrong);assert(queue.some(r=>r.questionId===q.id&&r.reason==='incorrect'));}}
}
let status;
for(const pathname of ['/api/learner/v6/replace-audio','/api/learner/v6/audio/not-in-bank','/api/learner/v6/image/../../admin-access.txt']){status=0;await learner.handle({url:new URL('http://localhost'+pathname),req:{method:'GET'},send:s=>status=s});assert.equal(status,404);}
await learner.handle({url:new URL('http://localhost/api/learner/catalog'),req:{method:'POST'},send:s=>status=s});assert.equal(status,405);
assert.equal(JSON.stringify(db.prepare('SELECT id,revision,status,payload FROM content ORDER BY id,revision').all()),before,'Practice must not alter editorial data');db.close();
assert.throws(()=>validateImportedPractice({questions:[]}));
console.log(JSON.stringify({result:'PASS',communityQuestions:count,originalQuestions:originalCount,localBanks:local.banks.map(b=>({id:b.id,questions:b.questions.length})),checks:'all imported keys, filtering, fresh selection, scoring, local/review reload, readonly routes, editorial preservation'},null,2));
