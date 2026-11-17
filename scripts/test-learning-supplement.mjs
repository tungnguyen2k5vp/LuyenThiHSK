import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {applyLearningSupplement} from '../src/services/learningSupplement.ts';
import {validateImportedPractice,makePracticeSelection,filterPracticeEntries} from '../src/services/practiceCatalog.ts';
import {summarizeAttempt,questionStatus} from '../src/services/examScoring.ts';
import {shortMeaning} from '../src/services/lexicalPresentation.ts';
import {wordMatches} from '../src/services/curriculum.ts';
import {createVocabularyQuiz} from '../src/services/vocabularyQuiz.ts';

const json=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>createHash('sha256').update(b).digest('hex');
const root='public/data/learning',manifest=json(root+'/manifest.json'),old=json('public/data/open-hsk/manifest.json');
let words=0,glosses=0,examples=0,strokes=0,lessons=0;
for(const level of ['1','2','3','4','5','6','7-9']){
 const source={words:json(`public/data/hsk3-2025-${level}-words.json`),grammar:json(`public/data/hsk3-2025-${level}-grammar.json`),hanzi:json(`public/data/hsk3-2025-${level}-hanzi.json`)},before=structuredClone(source),extra=json(root+'/level-'+level+'.json');
 const merged=applyLearningSupplement(source.words,source.grammar,source.hanzi,extra);
 assert.deepEqual(source,before,'Do not mutate source');
 for(const kind of ['words','grammar','hanzi'])assert.deepEqual(merged[kind].map(x=>[x.id,x.level,x.reviewStatus,x.syllabusVersion]),source[kind].map(x=>[x.id,x.level,x.reviewStatus,x.syllabusVersion]),'Preserve IDs, levels, source review and edition');
 for(const w of merged.words){words++;assert(shortMeaning(w),'Missing visible meaning '+w.id);assert.equal(w.meaningVi,source.words.find(x=>x.id===w.id).meaningVi);if(w.meaningSupplement){glosses++;assert.equal(w.meaningSupplement.linguisticReview,'AI_SELF_CHECKED_NOT_HUMAN');assert(wordMatches(w,shortMeaning(w)));}else assert.equal(w.primaryMeaningVi,source.words.find(x=>x.id===w.id).primaryMeaningVi);
  for(const e of w.supplementalExamples??[]){examples++;assert.equal(e.license,'CC BY-SA 4.0');assert.equal(e.sourceEdition,'hsk3-2021');assert(fs.statSync('public'+e.audioUrl).size>100);assert(fs.statSync('public'+e.slowAudioUrl).size>100);}
 }
 for(const h of merged.hanzi){assert(h.strokeUrl,'Still missing stroke '+h.id);if(!source.hanzi.find(x=>x.id===h.id).strokeUrl){strokes++;const glyph=json('public'+h.strokeUrl);assert.equal(glyph.character,h.character);assert.equal(glyph.strokes.length,h.strokeCount);assert(glyph.medians?.length===glyph.strokes.length);}}
 for(const g of merged.grammar.filter(g=>g.supplementSource)){lessons++;assert(g.explanationVi&&g.shortMeaningVi&&g.examples?.length&&g.pattern);assert.equal(g.supplementSource.reviewStatus,'NEEDS_REVIEW');}
 const draftWords=merged.words.filter(w=>w.meaningSupplement);
 if(draftWords.length>=4){const quiz=createVocabularyQuiz(draftWords,level);for(const q of quiz.questions){assert.equal(q.answerVerified,false);assert.equal(q.answerValidation,'AI_SELF_CHECKED_NOT_HUMAN');assert(q.provenance.is_original);}}
 const custom=structuredClone(merged.words[0]);custom.meaningVi='User-edited meaning';custom.primaryMeaningVi='User-edited meaning';const preserved=applyLearningSupplement([custom],[],[],{...extra,words:{[custom.id]:{meaning:{vi:'Do not overwrite'}}}}).words[0];assert.equal(preserved.primaryMeaningVi,custom.primaryMeaningVi);
}
assert.deepEqual({words,glosses,examples,strokes,lessons},{words:11000,glosses:739,examples:6271,strokes:99,lessons:132});
for(const e of manifest.sets){const bytes=fs.readFileSync('public'+e.url);assert.equal(sha(bytes),e.sha256);const bank=validateImportedPractice(JSON.parse(bytes));assert.equal(bank.questions.length,6);assert(bank.isDemo);assert.equal(bank.durationKind,'custom');assert.equal(bank.questions[0].syllabusVersion,'unverified');const full=makePracticeSelection(bank,{skill:'reading',type:'short-passage',limit:20});assert.equal(full.questions.length,6);
 for(const q of bank.questions){assert(q.contextZh.length>35&&q.promptVi.length>35);assert(q.explanation.length>20);assert.equal(q.answerVerified,false);assert.equal(q.reviewStatus,'NEEDS_REVIEW');assert.equal(questionStatus(q,q.correctOptionId),'self-review');assert.equal(questionStatus(q,q.options.find(o=>o.id!==q.correctOptionId).id),'self-review');assert.equal(questionStatus(q,''),'unanswered');}
 const result=summarizeAttempt(full,{answers:{0:full.questions[0].correctOptionId,1:full.questions[1].options.find(o=>o.id!==full.questions[1].correctOptionId).id}});assert.equal(result.correctCount,0);assert.equal(result.incorrectCount,0);assert.equal(result.openAnsweredCount,2);assert.equal(result.objectiveQuestionCount,0);assert.equal(result.unansweredCount,4);assert.equal(result.accuracyPercent,null);
}
const filter={level:'HSK 7-9',skill:'reading',type:'short-passage',edition:'hsk3',category:'all',query:'',status:'all',duration:'all',limit:10,sort:'level'};
const all=[...old.sets,...manifest.sets];assert.equal(new Set(all.map(e=>e.id)).size,all.length);assert.equal(filterPracticeEntries(all,filter,{attempts:[],sessions:[]}).length,1);
const responses=json(root+'/responses.json');assert.equal(responses.length,14);assert.equal(new Set(responses.map(q=>q.id)).size,14);for(const q of responses){assert.equal(q.scoring,'manual');assert.equal(q.rubric.length,4);assert.equal(q.options.length,0);assert(!q.correctOptionId);assert(q.sampleAnswer&&q.hskLevel);}
const foundation=json(root+'/foundation.json');assert.equal(foundation.pinyin.length,10);assert.equal(foundation.radicals.length,50);for(const p of foundation.pinyin){assert.equal(p.examples.length,2);assert(p.examples.every(e=>e.hanzi&&e.pinyin&&e.meaningVi));}
const beforeFiles=fs.readdirSync(root,{recursive:true}).filter(f=>fs.statSync(path.join(root,f)).isFile()).map(f=>[f,sha(fs.readFileSync(path.join(root,f)))]);
const rerun=spawnSync(process.execPath,['scripts/integrate-learning-data.mjs'],{encoding:'utf8'});assert.equal(rerun.status,0,rerun.stderr);assert.equal(JSON.parse(rerun.stdout).changed,0,'Idempotent rerun');assert.deepEqual(beforeFiles,fs.readdirSync(root,{recursive:true}).filter(f=>fs.statSync(path.join(root,f)).isFile()).map(f=>[f,sha(fs.readFileSync(path.join(root,f)))]));
const folder=fs.readFileSync('.runtime/learning-integration-backup.txt','utf8'),baseline=json(folder+'/baseline.json');let preserved=0;
for(const [file,hash] of Object.entries(baseline.hashes)){if(file.endsWith('/.runtime/hsk-content.sqlite'))continue;const h=createHash('sha256');for await(const bytes of fs.createReadStream(path.resolve('..',file)))h.update(bytes);assert.equal(h.digest('hex'),hash,'Protected input changed: '+file);preserved++;}
const current=new DatabaseSync('.runtime/hsk-content.sqlite',{readOnly:true}),backup=new DatabaseSync(folder+'/hsk-content.sqlite',{readOnly:true});let tables=0;
for(const {name} of backup.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all()){assert(/^[a-z_0-9]+$/i.test(name));assert.deepEqual(current.prepare('SELECT * FROM "'+name+'"').all(),backup.prepare('SELECT * FROM "'+name+'"').all(),'Preserve SQLite table '+name);tables++;}current.close();backup.close();
const result={result:'PASS',words,glosses,examples,strokes,lessons,readingPassages:14,readingQuestions:42,writingPrompts:14,preservedInputFiles:preserved,preservedSQLiteTables:tables,idempotent:true};fs.writeFileSync('.runtime/learning-integration-check.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
