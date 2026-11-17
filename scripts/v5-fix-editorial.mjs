import {readFile,writeFile} from 'node:fs/promises';
const file='data/editorial/v5/reading-batch-01.tsv';
const lines=(await readFile(file,'utf8')).trimEnd().split(/\r?\n/);const rows=lines.slice(1).map(l=>l.split('|'));
const mappings=['00058,00012|sharing','00020,00053|food','00070|schedule','00018,00005|leisure','00026,00003|school','00006,00048|communication','00067,00058|money','00021,00056|daily','00024,00052|belongings','00058|shopping','00012,00053|animals','00020,00016|instructions','00005,00020|rest','00070|travel','00064,00019|family','00006,00048|opinions','00050,00053|choices','00016,00021|weekend','00047,00052|relationships','00019,00005|opening-hours','00020,00058|sharing','00020,00021|health','00004,00057|transport','00016,00024|sets','00052|school-levels','00020,00053|absence','00024|ownership','00023,00016|food-preferences','00058|receiving-help','00064|current-activity'];
const edited=new Set([6,10,12,15,17,23,24,26,28,29]);
for(const [i,r]of rows.entries()){if(edited.has(i+1)&&r[9]&&!/^\d/.test(r[9]))r[8]=r[9];r.splice(9);r.push(...mappings[i].split('|'));if(r.length!==11)throw Error('Column count '+i);}
await writeFile(file,[lines[0],...rows.map(r=>r.join('|')),''].join('\n'));
const p='data/editorial/v5/corrections.json',c=JSON.parse(await readFile(p,'utf8'));c.questionReplacements['v4-cq-028'].candidatePromptZh='他想买什么？';await writeFile(p,JSON.stringify(c,null,2));
// The one-off refinement has now been applied; rebuilding uses the normalized source TSV.
await writeFile('scripts/v5-refine-reading.mjs',"// Editorial refinements are committed in reading-batch-01.tsv.\nconsole.log('Use data:v5:build; no repeated source mutation.');\n");
console.log('Normalized 30 editorial rows; no application data changed.');
