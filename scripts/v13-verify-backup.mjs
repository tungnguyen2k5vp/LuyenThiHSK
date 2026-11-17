import {readFile,writeFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
import {digest} from '../shared/v5-quality.mjs';
const b=JSON.parse(await readFile('data/reports/v13/baseline.json','utf8')),issues=[];
for(const [name,hash]of Object.entries(b.sourceHashes))if(digest(await readFile(path.join(b.backup,name)))!==hash)issues.push('source:'+name);
for(const [name,hash]of Object.entries(b.runtimeHashes))if(digest(await readFile(path.join(b.backup,name)))!==hash)issues.push('runtime:'+name);
const databases=[];
for(const name of ['hsk-content.sqlite','account-sessions.sqlite']){
 const backup=new DatabaseSync(path.join(b.backup,name),{readOnly:true}),restore=new DatabaseSync('.tmp/v13-restore/'+name,{readOnly:true}),tables=backup.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all(),mismatch=[];
 for(const {name:table}of tables){const quoted='"'+table.replaceAll('"','""')+'"',a=backup.prepare('SELECT * FROM '+quoted).all(),r=restore.prepare('SELECT * FROM '+quoted).all();if(digest(a)!==digest(r))mismatch.push(table);}
 const integrity=Object.values(restore.prepare('PRAGMA integrity_check').get())[0];databases.push({name,tableCount:tables.length,logicalRestore:mismatch.length===0,integrity});issues.push(...mismatch.map(t=>name+':'+t));backup.close();restore.close();
}
const report={at:new Date().toISOString(),status:issues.length?'FAIL':'PASS',sourceFiles:Object.keys(b.sourceHashes).length,runtimeFiles:Object.keys(b.runtimeHashes).length,databases,issues,originalBackupModified:false,credentialsPrinted:false};
await writeFile('data/reports/v13/backup-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(issues.length)process.exitCode=1;
