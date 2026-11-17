import {readFile,writeFile,readdir,mkdir,cp} from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import {digest} from '../shared/v5-quality.mjs';
const handoff='docs/collab/v13/gemini/GEMINI_UI_HANDOFF.md',text=await readFile(handoff,'utf8');
if(!text.includes('GEMINI_BATCH_ALL_READY'))throw Error('No explicit completed Gemini handoff');
const files={};async function scan(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=dir+'/'+entry.name;if(entry.isDirectory())await scan(file);else files[file]=digest(await readFile(file));}}
await scan('src/ui-v13');await scan('docs/collab/v13/gemini');
const target='.runtime/backups/gemini-v13-handoff-'+Date.now();await mkdir(target,{recursive:true});await cp('src/ui-v13',path.join(target,'src/ui-v13'),{recursive:true});await cp('docs/collab/v13/gemini',path.join(target,'docs/collab/v13/gemini'),{recursive:true});
for(const [file,hash]of Object.entries(files))if(digest(await readFile(file))!==hash||digest(await readFile(path.join(target,file)))!==hash)throw Error('UI changed during receipt '+file);
const cssIssues=[],apiIssues=[],missingVars=new Set(),definitions=new Set(),used=new Set();
for(const file of Object.keys(files)){
 const source=await readFile(file,'utf8');if(file.endsWith('.css')){const css=postcss.parse(source);css.walkDecls(d=>{if(d.prop.startsWith('--'))definitions.add(d.prop);for(const m of d.value.matchAll(/var\((--[a-z0-9-]+)/gi))used.add(m[1]);});css.walkRules(r=>{if(r.parent.type==='atrule'&&r.parent.name.endsWith('keyframes'))return;for(const s of r.selectors)if(!s.trim().startsWith('.hsk-ui-v13'))cssIssues.push({file,selector:s});});}
 if(/\.(tsx?|jsx?)$/.test(file)&&!file.includes('/__fixtures__/'))for(const term of [/\bfetch\s*\(/,/\b(?:localStorage|sessionStorage|indexedDB)\./,/\bsetInterval\s*\(/,/\b(?:speechSynthesis|new Audio|DatabaseSync)\b/,/dangerouslySetInnerHTML/])if(term.test(source))apiIssues.push({file,term:String(term)});
}
for(const v of used)if(!definitions.has(v))missingVars.add(v);
const report={at:new Date().toISOString(),status:cssIssues.length||apiIssues.length?'REQUIRES_REVIEW':'GEMINI_BATCH_READY',handoff,handoffHash:files[handoff],files,backup:target,cssIssues,apiIssues,missingTokens:[...missingVars],integrationStatus:'NOT_INTEGRATED',receipt:'Codex captured exact hashes after explicit final handoff; no Gemini-provided checksum manifest',authoringFilesChanged:false};
await writeFile('data/reports/v13/ui-receipt.json',JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,files:Object.keys(files).length,backup:target,cssIssues,apiIssues,missingTokens:[...missingVars]}));
