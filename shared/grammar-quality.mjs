const clean=s=>String(s??'').normalize('NFC').replace(/[\s。，！？：、…“”‘’（）()【】_]/g,'');
export function independentQuestionKey(q){return clean(q.skill)+'|'+clean(q.promptZh)+'|'+(q.options??[]).map(o=>clean(o.text)).sort().join('|');}
export function grammarExampleOverlap(q,lesson){
 const answer=q.options?.find(o=>o.id===q.correctAnswer)?.text??'';
 const completed=q.type==='sentence-order'?answer:q.promptZh?.replace(/_{2,}|（\s*）|\(\s*\)/g,answer);
 return (lesson.examples??[]).some(e=>[q.promptZh,completed].filter(Boolean).some(s=>clean(s)===clean(e.zh)));
}
