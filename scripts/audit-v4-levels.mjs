import {readFile,writeFile} from 'node:fs/promises';
const read=async p=>JSON.parse(await readFile(p,'utf8'));
const bundle=await read('data/staging/v4/hsk1-release.json');const lookup=new Map();for(const level of ['1','2','3','4','5','6','7-9'])for(const w of await read('public/data/hsk3-2025-'+level+'-words.json'))if(!lookup.has(w.simplified))lookup.set(w.simplified,{id:w.id,level});
const findings=[];
function scan(id,field,text){const tokens=[];let at=0;while(at<text.length){if(!/\p{Script=Han}/u.test(text[at])){at++;continue;}let match='';for(let n=Math.min(8,text.length-at);n>0;n--){const candidate=text.slice(at,at+n);if(lookup.has(candidate)){match=candidate;break;}}if(match){const ref=lookup.get(match);if(ref.level!=='1')tokens.push({word:match,...ref});at+=match.length;}else{tokens.push({word:text[at],level:'UNMAPPED_CHARACTER_OR_NAME'});at++;}}if(tokens.length)findings.push({id,field,text,flags:[...new Map(tokens.map(t=>[t.word,t])).values()],reviewStatus:'NEEDS_REVIEW',note:'Greedy dictionary segmentation is a screening heuristic; proper names, grammar support words and segmentation require a human decision.'});}
for(const w of bundle.words)for(const [i,ex]of w.examples.entries())scan(w.id,'examples.'+i,ex.zh);
for(const g of bundle.lessons)for(const [i,ex]of g.examples.entries())scan(g.id,'examples.'+i,ex.zh);
for(const q of bundle.questions){scan(q.id,'promptZh',q.promptZh);scan(q.id,'candidatePromptZh',q.candidatePromptZh??'');}
const report={checkedAt:new Date().toISOString(),syllabus:'hsk3-2025',method:'Longest dictionary match against all 11000 stored CTI-aligned headwords; flags possible above-level words and unknown Hanzi; not expert linguistic validation',itemsFlagged:new Set(findings.map(f=>f.id)).size,findings};
await writeFile('data/reports/v4-level-screening.json',JSON.stringify(report,null,2));console.log('Level screening flagged '+report.itemsFlagged+' drafts for targeted human review.');
