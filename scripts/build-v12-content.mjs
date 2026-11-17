import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {LESSONS} from '../data/editorial/v12/grammar.mjs';
import {WORDS} from '../data/editorial/v12/vocabulary.mjs';
import {linkPlatformDrills} from '../data/editorial/v12/curriculum-links.mjs';
import {createTokenizer,questionDiagnostics} from '../shared/v5-quality.mjs';
import {validateV12Record,stampV12} from '../shared/v12-content.mjs';
const json=async p=>JSON.parse(await readFile(p,'utf8')),prior=await json('data/staging/v11/content.json'),refs=prior.refs;
const allWords=(await Promise.all(['1','2','3','4','5','6','7-9'].map(l=>json('public/data/hsk3-2025-'+l+'-words.json')))).flat(),tokenize=createTokenizer(allWords);
const point=n=>refs.grammar.find(g=>g.id==='HSK30-2025-GRA-HSK2-'+String(n).padStart(5,'0'));
const lex=s=>[...new Set(tokenize(s).filter(t=>t.id&&Number(t.level)<=2).map(t=>t.id))];
const common={editorialRelease:'v12-hsk2',source:'LuyenThiHSK original AI-assisted V12',sourceUrl:'local:editorial/v12',sourceType:'AI_GENERATED',reviewStatus:'NEEDS_REVIEW',revision:1,internalValidation:undefined,contentMeta:undefined,createdAt:undefined,updatedAt:undefined};
const grammarQuestions=[],lessons=LESSONS.map(([n,title,shortMeaningVi,usage,examples,commonMistakes,comparison,practice])=>{
 const g=point(n);if(!g)throw Error('Unknown taxonomy '+n);
 const questions=practice.map(([practiceForm,prompt,choices,key,explanation],i)=>{const id='v12-hsk2-grammar-'+String(n).padStart(5,'0')+'-'+(i+1);return{...prior.grammarQuestions[0],...common,id,internal_question_id:id,number:i+1,promptZh:prompt,candidatePromptZh:prompt,options:choices.map((text,j)=>({id:'ABC'[j],text})),correctAnswer:key,correctOptionId:key,explanation,practiceForm,grammarIds:[g.id],vocabularyIds:lex(prompt+choices.join('')),contentMeta:{batch:'GRAMMAR',grammarLinkStatus:'AUTHORED_MAPPING_NEEDS_EXPERT_REVIEW',context:id},provenance:{...prior.grammarQuestions[0].provenance,source_name:common.source,source_url:common.sourceUrl,rights_status:'original_pending_review'}};});
 grammarQuestions.push(...questions);
 return{...prior.lessons[0],...common,id:'v12-lesson-'+String(n).padStart(5,'0'),grammarPointId:g.id,title,pattern:g.pattern,category:g.category,detail:g.detail,shortMeaningVi,usage,explanationVi:shortMeaningVi,examples:examples.map(s=>{const[zh,pinyin,vi]=s.split('|');return{zh,pinyin,vi}}),commonMistakes,comparisons:[comparison],relatedQuestionIds:questions.map(q=>q.id),relatedVocabularyIds:lex(examples.join('')),prerequisites:[],teachingScope:usage,lessonScope:'Selected common uses only; taxonomy coverage is not exhaustive'};
});
const previous=await json('data/reports/v11/live-practice.json');
const wordDrafts=WORDS.map(([number,meaningVi,pos,exampleZh,examplePinyin,exampleVi])=>{const w=refs.words.find(w=>w.id==='cti25-v-'+number&&w.level==='2');if(!w)throw Error('Unknown word '+number);if(previous.wordDrafts.some(d=>d.vocabularyPointId===w.id))throw Error('Already enriched '+w.id);return{...prior.wordDrafts[0],...common,id:'v12-vocab-'+w.id,vocabularyPointId:w.id,simplified:w.simplified,traditional:w.traditional,pinyin:w.pinyin,pos:w.pos,partOfSpeech:[pos],meaningVi,primaryMeaningVi:meaningVi,secondaryMeaningsVi:[],dictionaryReference:{meaningVi:w.meaningVi,meaningsEn:w.meaningsEn,pinyin:w.pinyin,pos:w.pos,source:w.source,sourceUrl:w.sourceUrl,license:w.license,status:'COMMUNITY_REFERENCE_NOT_HUMAN_REVIEW'},exampleZh,examplePinyin,exampleVi,examples:[{zh:exampleZh,pinyin:examplePinyin,vi:exampleVi,sourceType:'AI_GENERATED',reviewStatus:'NEEDS_REVIEW'}],learningNotes:['Nghĩa chính gắn ví dụ; nghĩa khác giữ trong nguồn tham khảo.'],lexicalQuality:{status:'AI_DRAFT',flags:[],score:0,linguisticReview:'BLOCKED_FOR_HUMAN_REVIEW'}};});
linkPlatformDrills(lessons,grammarQuestions,refs);
const records=[...lessons.map(payload=>({kind:'grammar',batch:'GRAMMAR',payload})),...grammarQuestions.map(payload=>({kind:'questions',batch:'GRAMMAR',payload})),...wordDrafts.map(payload=>({kind:'vocabulary',batch:'VOCABULARY',payload}))];
for(const r of records){const errors=validateV12Record(r.kind,r.payload,refs);if(errors.length)throw Error(r.payload.id+': '+errors.join(';'));r.payload=stampV12(r.payload);}
const get=kind=>records.filter(r=>r.kind===kind).map(r=>r.payload),screen=records.map(r=>({id:r.payload.id,kind:r.kind,tokens:tokenize(r.kind==='questions'?r.payload.promptZh+r.payload.options.map(o=>o.text).join(''):r.kind==='grammar'?r.payload.examples.map(e=>e.zh).join(''):r.payload.exampleZh).filter(t=>t.level==='UNKNOWN'||Number(t.level)>2),semanticStatus:'BLOCKED_FOR_HUMAN_REVIEW'}));
await mkdir('data/staging/v12',{recursive:true});await mkdir('data/reports/v12',{recursive:true});
await writeFile('data/staging/v12/content.json',JSON.stringify({version:'v12-private-beta-r1',records,lessons:get('grammar'),grammarQuestions:get('questions'),wordDrafts:get('vocabulary'),refs},null,2));
await writeFile('data/reports/v12/authoring-validation.json',JSON.stringify({at:new Date().toISOString(),records:records.length,screen,diagnostics:questionDiagnostics(get('questions')),humanReviewed:0,published:0},null,2));
console.log(JSON.stringify({records:records.length,lessons:lessons.length,questions:grammarQuestions.length,words:wordDrafts.length,flags:screen.filter(r=>r.tokens.length).map(r=>({id:r.id,tokens:r.tokens.map(t=>t.text)}))}));
