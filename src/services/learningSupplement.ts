import type {CourseWord,GrammarPoint,HanziEntry,LearningSupplement} from '../types/curriculum';

export function applyLearningSupplement(words:CourseWord[],grammar:GrammarPoint[],hanzi:HanziEntry[],extra:LearningSupplement){
 return {
  words:words.map(w=>{const add=extra.words[w.id];if(!add)return w;const meaning=!(w.primaryMeaningVi??(w.meaningVi.length<=110?w.meaningVi.split(';')[0]:''))?add.meaning:undefined;return {...w,...(meaning?{primaryMeaningVi:meaning.vi,meaningSupplement:meaning}:{}),...(add.examples?{supplementalExamples:add.examples}:{})};}),
  grammar:grammar.map(g=>g.explanationVi&&g.examples?.length?g:{...g,...extra.grammar[g.id],pattern:g.pattern||extra.grammar[g.id]?.title||g.category,id:g.id,level:g.level,syllabusVersion:g.syllabusVersion}),
  hanzi:hanzi.map(h=>h.strokeUrl?h:{...h,...extra.hanzi[h.id]}),
 };
}
