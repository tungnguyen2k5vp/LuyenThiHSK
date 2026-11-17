import {readFile,writeFile,mkdir,readdir,stat,copyFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {digest} from '../shared/v5-quality.mjs';
const out='data/reports/v15';await mkdir(out,{recursive:true});
try{await stat(out+'/baseline.json');throw Error('V15 baseline exists; refusing overwrite');}catch(e){if(e.code!=='ENOENT')throw e;}
const at=new Date().toISOString(),backup='.runtime/backups/before-v15-'+at.replace(/[:.]/g,'-');await mkdir(backup,{recursive:true});
const hashes={},runtimeHashes={};
async function snapshot(source,map){
 const info=await stat(source);if(info.isDirectory()){for(const e of await readdir(source))await snapshot(source+'/'+e,map);return;}
 const bytes=await readFile(source),target=path.join(backup,source);await mkdir(path.dirname(target),{recursive:true});await writeFile(target,bytes);map[source]=digest(bytes);if(digest(await readFile(target))!==map[source])throw Error('Snapshot mismatch '+source);
}
for(const item of ['dist','src','shared','server','scripts','schemas','public','data/editorial','data/staging','docs','FINAL_IMPLEMENTATION_REPORT_V14.md','package.json','package-lock.json','tsconfig.json','tsconfig.v13-logic.json','vite.config.ts','index.html'])await snapshot(item,hashes);
for(const item of ['v4-audio','v5-audio','v6-audio','v6-images','media']){try{await snapshot('.runtime/'+item,runtimeHashes);}catch(e){if(e.code!=='ENOENT')throw e;}}
const databases=[];
for(const [source,name]of [['.runtime/hsk-content.sqlite','hsk-content.sqlite'],['.runtime/account/sessions.sqlite','account-sessions.sqlite']]){
 const db=new DatabaseSync(source,{readOnly:true});const tables=db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map(t=>t.name);
 const rows=Object.fromEntries(tables.map(t=>[t,db.prepare('SELECT * FROM "'+t.replaceAll('"','""')+'" ORDER BY rowid').all()]));
 const target=path.resolve(backup,name);db.prepare('VACUUM INTO ?').run(target);db.close();
 const restoreDir='.tmp/v15-restore';await mkdir(restoreDir,{recursive:true});const restoredFile=restoreDir+'/'+name;await copyFile(target,restoredFile);const restored=new DatabaseSync(restoredFile,{readOnly:true});
 const integrity=Object.values(restored.prepare('PRAGMA integrity_check').get())[0],tableHashes=Object.fromEntries(tables.map(t=>[t,digest(rows[t])]));
 for(const t of tables)if(digest(restored.prepare('SELECT * FROM "'+t.replaceAll('"','""')+'" ORDER BY rowid').all())!==tableHashes[t])throw Error('Restore table mismatch '+t);
 restored.close();if(integrity!=='ok')throw Error('Restore integrity failed');databases.push({source,name,integrity,tableHashes,counts:Object.fromEntries(tables.map(t=>[t,rows[t].length]))});
}
for(const[f,h]of Object.entries({...hashes,...runtimeHashes}))if(digest(await readFile(f))!==h)throw Error('Concurrent change '+f);
const content=new DatabaseSync('.runtime/hsk-content.sqlite',{readOnly:true});const latest=content.prepare('SELECT * FROM content c WHERE revision=(SELECT MAX(revision) FROM content x WHERE x.id=c.id)').all();content.close();
const editorial=latest.filter(r=>/^v\d+-hsk/.test(JSON.parse(r.payload).editorialRelease??'')&&r.status!=='ARCHIVED');
const workflow=Object.fromEntries(['DRAFT','NEEDS_REVIEW','INTERNALLY_VALIDATED','PUBLISHED'].map(s=>[s,editorial.filter(r=>r.status===s).length]));workflow.humanReviewed=editorial.filter(r=>JSON.parse(r.payload).humanReview?.status==='APPROVED').length;
const git=spawnSync('git',['status','--short'],{encoding:'utf8',windowsHide:true});
const report={at,backup,sourceFiles:Object.keys(hashes).length,runtimeFiles:Object.keys(runtimeHashes).length,sourceHashes:hashes,runtimeHashes,databases,editorial:{total:editorial.length,workflow},archivedQa:latest.filter(r=>r.id.startsWith('qa-')).map(r=>({id:r.id,revision:r.revision,status:r.status,payloadHash:digest(r.payload)})),git:{available:git.status===0,detail:(git.stdout||git.stderr).trim()},credentials:'Tokens/env not copied. Database backups private; never package .runtime.',browserProgress:'No real browser profile accessed or reset.'};
await writeFile(out+'/baseline.json',JSON.stringify(report,null,2));await writeFile(backup+'/SOURCE_MANIFEST.json',JSON.stringify({at,hashes,runtimeHashes},null,2));console.log(JSON.stringify({backup,sourceFiles:report.sourceFiles,runtimeFiles:report.runtimeFiles,databases,editorial:report.editorial,qaFixtures:report.archivedQa.length,gitAvailable:git.status===0}));
