import type {ExamQuestion} from '../../types';
import type {CourseWord,GrammarPoint} from '../../types/curriculum';
import type {PreparationData} from '../../services/preparationStorage';
import type {CompletedAttempt} from '../../services/studyStorage';
import type {ScreenMetaVM,VocabularyItemVM,VocabularyExplorerVM,VocabularyDetailVM,AudioVM,GrammarItemVM,GrammarCatalogVM,GrammarLessonVM,ActionVM} from '../../contracts/ui-v13';
import {contentStatus} from './exam';
import {shortMeaning} from '../../services/lexicalPresentation';
import {grammarPracticePools} from '../../services/grammarPractice';
import {previewGrammarEvidence} from '../../services/previewEvidence';
import {availableForPractice} from '../../../shared/practice-selection.mjs';

/** Canonical curriculum IDs own SRS; editorial draft IDs never replace them. */
export function mergeWords(base:readonly CourseWord[],drafts:readonly (CourseWord&{vocabularyPointId:string})[]):CourseWord[] {
 const map=new Map(drafts.map(d=>[d.vocabularyPointId,d]));
 return base.map(w=>({...w,...map.get(w.id),id:w.id}));
}
export function mergeGrammar(base:readonly GrammarPoint[],drafts:readonly GrammarPoint[]):GrammarPoint[] {
 const map=new Map(drafts.map(d=>[d.grammarPointId??d.id,d]));
 return base.map(g=>({...g,...map.get(g.id),id:g.id}));
}
export function vocabularyItem(w:CourseWord,data:PreparationData):VocabularyItemVM {
 const card=data.cards[w.id];return {id:w.id,hanzi:w.simplified,traditional:w.traditional,pinyin:w.pinyin,meaningVi:shortMeaning(w),partOfSpeech:[...(w.partOfSpeech??w.pos)],favorite:Boolean(data.favorites[w.id]),learned:card?.learned===true,dueAt:card?.dueAt??null,content:contentStatus()};
}
const pagination=(total:number,page:number,size:number)=>{const pageSize=Number.isFinite(size)?Math.max(1,Math.min(100,Math.floor(size))):20;return {pageSize,page:Math.max(0,Math.min(Number.isFinite(page)?Math.floor(page):0,Math.max(0,Math.ceil(total/pageSize)-1)))};};
export interface VocabularySnapshot {meta:ScreenMetaVM;words:readonly CourseWord[];data:PreparationData;query:string;filter:VocabularyExplorerVM['filter'];page:number;pageSize:number;now:number}
export function vocabularyExplorer(s:VocabularySnapshot):VocabularyExplorerVM {
 const items=s.words.filter(w=>w.level===s.meta.level).map(w=>vocabularyItem(w,s.data));
 const due=(w:VocabularyItemVM)=>w.dueAt!==null&&Date.parse(w.dueAt)<=s.now;
 const query=s.query.normalize('NFKC').toLocaleLowerCase().trim();
 const filtered=items.filter(w=>(!query||[w.hanzi,w.traditional,w.pinyin,w.meaningVi].some(t=>t.toLocaleLowerCase().includes(query)))&&(s.filter==='all'||s.filter==='new'&&!w.learned||s.filter==='learned'&&w.learned||s.filter==='favorite'&&w.favorite||s.filter==='due'&&due(w)||s.filter==='weak'&&(s.data.cards[w.id]?.lastGrade??5)<3));
 const p=pagination(filtered.length,s.page,s.pageSize);return {meta:s.meta,items:filtered.slice(p.page*p.pageSize,(p.page+1)*p.pageSize),total:items.length,filteredTotal:filtered.length,query:s.query,filter:s.filter,...p,learnedCount:items.filter(w=>w.learned).length,dueCount:items.filter(due).length,review:items.some(due)?{id:'review-words',label:'Ôn từ đến hạn',availability:{available:true,reason:null,count:items.filter(due).length},command:{kind:'page',page:'vocabulary',level:s.meta.level}}:null,availableFilters:['all','new','learned','favorite','due','weak']};
}
export function relatedPractice(meta:ScreenMetaVM,questions:readonly ExamQuestion[],entity:'word'|'grammar',id:string):ActionVM|null {
 const pool=questions.filter(q=>String(q.level??q.hskLevel)===meta.level&&(entity==='word'?q.vocabularyIds:q.grammarIds)?.includes(id)&&q.assessmentSuitability!=='GUIDED_PRACTICE'&&availableForPractice(q));
 return pool.length?{id:'practice-'+id,label:'Luyện tập liên quan',availability:{available:true,reason:null,count:new Set(pool.map(q=>q.id)).size},command:{kind:'practice',level:meta.level,skill:'all',...(entity==='word'?{wordId:id}:{grammarId:id})}}:null;
}
export function vocabularyDetail(meta:ScreenMetaVM,w:CourseWord,data:PreparationData,questions:readonly ExamQuestion[],audio:AudioVM,orderedIds:readonly string[]):VocabularyDetailVM {
 const index=orderedIds.indexOf(w.id),examples=w.examples??(w.exampleZh?[{zh:w.exampleZh,pinyin:w.examplePinyin??'',vi:w.exampleVi??''}]:[]);
 return {meta,word:vocabularyItem(w,data),examples:examples.map(e=>({zh:e.zh,pinyin:e.pinyin,vi:e.vi,content:contentStatus()})),otherMeanings:[...(w.secondaryMeaningsVi??[])],source:{label:w.source,url:/^https?:\/\//.test(w.sourceUrl)?w.sourceUrl:null,notes:[w.license,...(w.notes??[])]},practice:relatedPractice(meta,questions,'word',w.id),audio,previousId:index>0?orderedIds[index-1]:null,nextId:index>=0?orderedIds[index+1]??null:null};
}
export interface GrammarSnapshot {meta:ScreenMetaVM;points:readonly GrammarPoint[];questions:readonly ExamQuestion[];data:PreparationData;attempts:CompletedAttempt[];query:string;includeTaxonomy:boolean;page:number;pageSize:number}
function grammarRows(s:GrammarSnapshot):GrammarItemVM[] {
 const points=s.points.filter(g=>g.level===s.meta.level),attempts=s.attempts.filter(a=>a.examSnapshot?.levelCode==='HSK '+s.meta.level),evidence=previewGrammarEvidence(attempts,[...points]);
 return points.map(g=>{const id=g.grammarPointId??g.id,pool=s.questions.filter(q=>String(q.level??q.hskLevel)===s.meta.level&&q.grammarIds?.includes(id)&&availableForPractice(q)),pools=grammarPracticePools(pool,g),e=evidence[id]??{answered:0,correct:0};return {id:g.id,pattern:g.pattern,category:g.category,title:g.title??g.pattern,meaningVi:g.shortMeaningVi??g.detail,hasLesson:Boolean(g.explanationVi&&g.examples?.length),read:Boolean(s.data.grammar[id]),independentCount:pools.independent.length,guidedCount:pools.guided.length,evidence:{answered:e.answered,correct:e.correct,mastered:e.answered>=5&&e.correct/e.answered>=.8},content:contentStatus()};});
}
export function grammarCatalog(s:GrammarSnapshot):GrammarCatalogVM {
 const rows=grammarRows(s),query=s.query.normalize('NFKC').toLocaleLowerCase().trim(),filtered=rows.filter(r=>(s.includeTaxonomy||r.hasLesson)&&(!query||[r.pattern,r.title,r.meaningVi].some(t=>t.toLocaleLowerCase().includes(query)))),p=pagination(filtered.length,s.page,s.pageSize);
 return {meta:s.meta,items:filtered.slice(p.page*p.pageSize,(p.page+1)*p.pageSize),totalTaxonomy:rows.length,completeLessons:rows.filter(r=>r.hasLesson).length,masteredCount:rows.filter(r=>r.evidence.mastered).length,query:s.query,includeTaxonomy:s.includeTaxonomy,...p,filteredTotal:filtered.length};
}
export function grammarLesson(s:GrammarSnapshot,id:string):GrammarLessonVM|null {
 const g=s.points.find(g=>g.id===id&&g.level===s.meta.level),row=grammarRows(s).find(g=>g.id===id);if(!g||!row?.hasLesson)return null;
 const canonical=g.grammarPointId??g.id,pools=grammarPracticePools(s.questions.filter(q=>String(q.level??q.hskLevel)===s.meta.level&&q.grammarIds?.includes(canonical)&&availableForPractice(q)),g);
 return {meta:s.meta,grammar:row,formula:g.formula??g.pattern,usage:g.usage??'',explanation:g.explanationVi??'',examples:(g.examples??[]).map(e=>({...e,content:contentStatus()})),commonMistakes:[...(g.commonMistakes??[])],comparisons:[...(g.comparisons??[])],practice:relatedPractice(s.meta,pools.independent,'grammar',canonical),favorite:Boolean(s.data.favorites[canonical]),source:{label:g.source,url:/^https?:\/\//.test(g.sourceUrl)?g.sourceUrl:null,notes:[g.license]}};
}
