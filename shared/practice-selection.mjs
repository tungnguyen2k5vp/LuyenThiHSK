// Reusable private part practice; it never constructs an official/full exam.
export function availableForPractice(q){
 if(q.reviewStatus==='ARCHIVED'||q.internalValidation?.status!=='PASSED')return false;
 return q.skill!=='listening'||Boolean(q.audio?.kind==='file'&&q.audio.src&&(q.practiceAudioReady===true||!q.mediaRequirement));
}
export function selectPartPractice(questions,{level,partId,count=3,recentQuestionIds=[]}={}){
 const recent=new Set(recentQuestionIds),pool=questions.filter(q=>String(q.level??q.hskLevel)===String(level)&&q.partId===partId&&q.assessmentSuitability!=='GUIDED_PRACTICE'&&availableForPractice(q));
 const unique=[...new Map(pool.map(q=>[q.id,q])).values()];
 const uses=id=>recentQuestionIds.filter(x=>x===id).length;
 unique.sort((a,b)=>Number(recent.has(a.id))-Number(recent.has(b.id))||uses(a.id)-uses(b.id)||recentQuestionIds.indexOf(b.id)-recentQuestionIds.indexOf(a.id)||a.id.localeCompare(b.id));
 const selected=unique.slice(0,Math.max(1,Math.min(10,count)));
 return{questions:selected,repeatedIds:selected.filter(q=>recent.has(q.id)).map(q=>q.id),available:unique.length};
}
