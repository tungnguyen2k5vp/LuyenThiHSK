import {readFile,writeFile} from 'node:fs/promises';
const p='scripts/v8-sync-browser.mjs',s=await readFile(p,'utf8');await writeFile(p,s.replace('{expression,awaitPromise:true,returnByValue:true}',"{expression:'(async()=>{'+(!expression.includes(';')||expression.startsWith('(async()=>')?'return ('+expression+')':expression)+'})()',awaitPromise:true,returnByValue:true}"));
