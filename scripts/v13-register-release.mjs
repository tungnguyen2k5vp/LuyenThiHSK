// One-time, narrowly scoped release registration. Never touches Gemini paths or schemas.
import {readFile,writeFile} from 'node:fs/promises';
import {digest} from '../shared/v5-quality.mjs';
const changes=[];
for(const file of ['server/admin-server.mjs','server/v3-content-service.mjs','server/v7-review-service.mjs']){
 const before=await readFile(file,'utf8');if(before.includes("'v13-hsk2'"))throw Error('Release already registered in '+file);
 let after=before.replaceAll("'v12-hsk2'","'v12-hsk2','v13-hsk2'").replaceAll('8|9|10|11|12)','8|9|10|11|12|13)').replaceAll('6|8|9|10|11|12|12)','6|8|9|10|11|12|13)');
 if(file==='server/admin-server.mjs'){
  after="import {createV13Service} from './v13-content-service.mjs';\n"+after;
  const anchor="function addRecord(kind,payload){";if(!after.includes(anchor))throw Error('Missing addRecord anchor');
  after=after.replace(anchor,"const v13=createV13Service({db,root,runtime,addRecord,v12});\n"+anchor);
  after=after.replace('if(await v12.handle({url,req,send,body,res}))return;','if(await v13.handle({url,req,send,body,res}))return;\n    if(await v12.handle({url,req,send,body,res}))return;');
 }
 if(after===before)throw Error('No release changes in '+file);await writeFile(file,after);changes.push({file,before:digest(before),after:digest(after)});
}
await writeFile('data/reports/v13/release-registration.json',JSON.stringify({at:new Date().toISOString(),changes,schemaChanges:0,geminiFilesModified:false},null,2));console.log('Registered V13 with existing review/CAS/publication guards');
