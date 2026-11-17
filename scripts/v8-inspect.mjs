import {readFile} from 'node:fs/promises';
const b=JSON.parse(await readFile('data/reports/v7/live-release.json','utf8'));
console.log('images',b.images.map(i=>({id:i.id,alt:i.altText})));console.log('lessons',b.lessons.slice(0,8).map(g=>({id:g.id,grammar:g.grammarPointId,pattern:g.pattern})));
console.log('g2',JSON.parse(await readFile('public/data/hsk3-2025-2-grammar.json','utf8')).map(g=>({id:g.id,pattern:g.pattern})));
console.log('q',JSON.stringify(b.questions.find(q=>q.partId==='R1'),null,2));
