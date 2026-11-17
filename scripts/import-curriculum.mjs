import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import {selectDictionaryEntry} from '../shared/dictionary-selection.mjs';

const raw = 'data/raw/';
const out = 'public/data/';
const at = '2026-10-15T00:00:00.000Z';
const pdfUrl = 'https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf';
const hashes = {};
async function json(name) { const bytes = await readFile(raw + name); hashes[name] = createHash('sha256').update(bytes).digest('hex'); return JSON.parse(bytes); }
const official = await json('hsk-syllabus-official.json');
const structured = await json('hsk30-2025-11.json');
const complete = await json('complete-hsk-vocabulary.json');
const strokes = await json('hsk12-strokes.json');
assert.equal(hashes['hsk-syllabus-official.json'], '06e20f8a931402ecc34d30381e08e0e71d650be298dfa06332c4812129954184');
assert.equal(hashes['complete-hsk-vocabulary.json'], 'c869a0ce353279c9333d9b42c31fc3549785e8b40673dab57ee42bc99cd14131');
assert.equal(official.vocabulary.length, 11000);
const dictionaryText = await readFile(raw + 'CVDICT.u8', 'utf8');
hashes['CVDICT.u8'] = createHash('sha256').update(dictionaryText).digest('hex');
assert.equal(hashes['CVDICT.u8'], '4dde4b204193efa9c192d7f7daeab1bb579c8ccd7c41ed90d1b6caee22ba0948');
try { const bytes = await readFile(raw + 'cti-syllabus-2025.pdf'); assert.equal(createHash('sha256').update(bytes).digest('hex'), official.sha256, 'CTI PDF changed: extraction must be reviewed'); } catch (error) { if (error.code !== 'ENOENT') throw error; throw Error('Download and verify the CTI PDF before importing'); }
const plain = value => value.normalize('NFKD').replace(/[\u0300-\u036f\s·∥'0-9]/g, '').replace(/u:|v/g, 'u').toLowerCase();
const norm = value => value.normalize('NFKC').replace(/\s/g, '');
const levelOf = row => row.hsk_min === '7' ? '7-9' : row.hsk_min;
function tonePinyin(value) {
  return value.toLowerCase().replace(/u:/g, 'ü').replace(/v/g, 'ü').split(/\s+/).map(syllable => {
    const tone = Number(syllable.match(/[1-5]$/)?.[0] ?? 5); let base = syllable.replace(/[1-5]$/, '');
    if (tone === 5) return base;
    let index = base.indexOf('a'); if (index < 0) index = base.indexOf('e'); if (index < 0 && base.includes('ou')) index = base.indexOf('o');
    if (index < 0) { for (let i=base.length-1;i>=0;i--) if ('iouü'.includes(base[i])) { index=i;break; } }
    if (index < 0) return base;
    return base.slice(0,index) + ({a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù',ü:'ǖǘǚǜ'}[base[index]]?.[tone-1] ?? base[index]) + base.slice(index+1);
  }).join('');
}
const dictionary = new Map();
for (const line of dictionaryText.split(/\r?\n/)) {
  const m = line.match(/^(\S+) (\S+) \[([^\]]+)\] \/(.+)\/$/); if (!m) continue;
  const [,traditional,simplified,numeric,definitions]=m;
  const item={traditional,pinyin:tonePinyin(numeric),properName:/^[A-Z]/.test(numeric),definitions:definitions.split('/').filter(Boolean)};
  dictionary.set(simplified,[...(dictionary.get(simplified)??[]),item]);
}
const english = new Map(complete.map(word => [word.simplified,word]));
const officialKeys = new Map(official.vocabulary.map(row => [row.identifier,row]));
const source = { syllabusVersion:'hsk3-2025', source:'CTI word/level facts + CVDICT / CC-CEDICT', sourceType:'COMMUNITY',sourceUrl:pdfUrl,license:'CC BY-SA 4.0 (dictionary adaptation); syllabus membership facts',importedAt:at,verifiedAt:at,reviewStatus:'PUBLISHED',revision:1 };
const quality={missingVietnamese:0,communityTranslations:0,missingStrokes:0,grammarPendingReview:0,conflicts:0};
const vocabulary=[];
for (const [index,row] of structured.rows.vocabulary.entries()) {
  const fact=officialKeys.get(String(index+1));
  assert.ok(fact && fact.simplified===row.word.replace(/[0-9]+$/, '') && fact.level===levelOf(row) && plain(fact.pinyin)===plain(row.pinyin), 'CTI alignment conflict '+row.id);
  const candidates=dictionary.get(fact.simplified)??[];
  const cv=selectDictionaryEntry(candidates,row.pinyin);
  const en=english.get(fact.simplified); const form=en?.forms?.find(f=>plain(f.transcriptions?.pinyin??'')===plain(row.pinyin));
  const meaningVi=cv?.definitions.filter(s=>!/^CL:|^biến thể của|^xem /.test(s)).join('; ')??'';
  if(!meaningVi)quality.missingVietnamese++;else quality.communityTranslations++;
  vocabulary.push({...source,id:'cti25-v-'+fact.identifier,level:fact.level,simplified:fact.simplified,traditional:cv?.traditional??form?.traditional??fact.simplified,pinyin:fact.pinyin,meaningVi,meaningsEn:form?.meanings??[],pos:row.pos_zh?[row.pos_zh]:[],topic:'',translationStatus:meaningVi?'community_machine':'missing',sourcePage:fact.page});
}
const grammar=structured.rows.grammar.map(row=>{
  const pages=official.sections.grammar[levelOf(row)]??[];
  const page=pages.find(page=>norm(page.text).includes(norm(row.pattern_zh)));
  if(!page)quality.grammarPendingReview++;
  return {...source,id:row.id,level:levelOf(row),pattern:row.pattern_zh,category:row.category_zh||row.grammar_type_zh,detail:row.detail_zh,source:'CTI structure index; no CTI examples reproduced',sourceType:'OFFICIAL',reviewStatus:page?'PUBLISHED':'NEEDS_REVIEW',sourcePage:page?.page??pages[0]?.page};
});
const hanzi=[];const seenChars=new Set();
for(const row of structured.rows.hanzi){
  if(seenChars.has(row.character)||row.source_type!=='1')continue;
  const pages=official.sections.characters[levelOf(row)]??[];
  const page=pages.find(page=>new RegExp('\\d+\\.\\s*'+row.character).test(page.text));
  if(!page)continue; seenChars.add(row.character);
  const cv=dictionary.get(row.character)?.[0]; const paths=strokes[row.character];if(!paths)quality.missingStrokes++;
  const strokeUrl=paths?'/data/strokes/'+row.character.codePointAt(0).toString(16)+'.json':null;
  hanzi.push({...source,id:'cti25-h-'+row.character,level:levelOf(row),character:row.character,pinyin:cv?.pinyin??'',meaningVi:cv?.definitions.join('; ')??'',strokeCount:paths?.length??null,strokeUrl,exampleWords:vocabulary.filter(w=>w.simplified.includes(row.character)&&w.simplified!==row.character).slice(0,5).map(w=>w.simplified),sourcePage:page.page});
}
const topics=[...new Map(structured.rows.topic.map(row=>[row.hsk_min+row.topic_l2_zh,{level:row.hsk_min,title:row.topic_l2_zh,group:row.topic_l1_zh,sourceUrl:pdfUrl}])).values()];
const tasks=[...new Map(structured.rows.task.map(row=>[row.hsk_min+row.task_title_zh,{level:row.hsk_min,title:row.task_title_zh,sourceUrl:pdfUrl}])).values()];
await mkdir(out+'strokes',{recursive:true});
async function save(file,value){await writeFile(out+file,JSON.stringify(value));}
for(const char of hanzi.filter(c=>c.strokeUrl))await save('strokes/'+char.character.codePointAt(0).toString(16)+'.json',{character:char.character,strokes:strokes[char.character],source:'hanzi-writer-data 2.0.1 / Make Me a Hanzi',license:'Arphic Public License',licenseUrl:'/ARPHICPL.TXT'});
const levels=[];
for(const level of ['1','2','3','4','5','6','7-9']){
  const words=vocabulary.filter(w=>w.level===level);const points=grammar.filter(g=>g.level===level&&g.reviewStatus==='PUBLISHED');const chars=hanzi.filter(h=>h.level===level);
  await save('hsk3-2025-'+level+'-words.json',words);await save('hsk3-2025-'+level+'-grammar.json',points);await save('hsk3-2025-'+level+'-hanzi.json',chars);
  levels.push({level,vocabulary:words.length,grammar:points.length,hanzi:chars.length,wordsUrl:'/data/hsk3-2025-'+level+'-words.json',grammarUrl:'/data/hsk3-2025-'+level+'-grammar.json',hanziUrl:'/data/hsk3-2025-'+level+'-hanzi.json'});
}
await save('syllabus-topics-tasks.json',{topics,tasks});
await mkdir('data/staging',{recursive:true});await writeFile('data/staging/grammar-needs-review.json',JSON.stringify(grammar.filter(g=>g.reviewStatus!=='PUBLISHED')));
const manifest={version:'curriculum-2025.11-r1',builtAt:at,sourcePdfSha256:official.sha256,editions:[{id:'hsk3-2025',label:'HSK 3.0 · syllabus 2025 (hiệu lực 07/2026)',levels}],quality,sources:[{name:'CTI syllabus (vocabulary/level/pinyin facts)',url:pdfUrl,license:'Official source facts; PDF not redistributed',sha256:official.sha256},{name:'CVDICT — Phong Phan; derived CC-CEDICT',url:'https://github.com/ph0ngp/CVDICT',license:'CC BY-SA 4.0',sha256:hashes['CVDICT.u8']},{name:'Complete HSK Vocabulary — Yanis Zafiropulos',url:'https://github.com/drkameleon/complete-hsk-vocabulary',license:'MIT repo; CC-CEDICT meanings CC BY-SA 4.0',sha256:hashes['complete-hsk-vocabulary.json']},{name:'hanzi-writer-data 2.0.1 / Make Me a Hanzi',url:'https://github.com/chanind/hanzi-writer-data',license:'Arphic Public License'}]};
await save('manifest.json',manifest);
await mkdir('data/reports',{recursive:true});await writeFile('data/reports/import-2025-r1.json',JSON.stringify({manifest,hashes,vocabularyCount:vocabulary.length,grammarCount:grammar.length,publishedGrammar:grammar.filter(g=>g.reviewStatus==='PUBLISHED').length,hanziCount:hanzi.length,topics:topics.length,tasks:tasks.length},null,2));
console.log(JSON.stringify({levels,quality,hanzi:hanzi.length,topics:topics.length,tasks:tasks.length},null,2));
await (await import('./normalize-vocabulary.mjs')).normalizeVocabulary();
