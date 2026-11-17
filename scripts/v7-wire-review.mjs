import {readFile,writeFile} from 'node:fs/promises';
const file='server/admin-server.mjs';let s=await readFile(file,'utf8');
s=s.replace('status,reviewed,reviewer,comment}=await body(req);','status,reviewed,reviewer,comment,reviewerCredential}=await body(req);');
const needle="const payload=JSON.parse(record.payload);const before={...payload};";
if(!s.includes(needle))throw Error('Status route changed');
s=s.replace(needle,"const payload=JSON.parse(record.payload);if(payload.editorialRelease==='v6-hsk1'&&reviewer?.trim()&&['LANGUAGE_REVIEW','HSK_LEVEL_REVIEW','APPROVED','PUBLISHED'].includes(status)&&!v7.guard(reviewer,reviewerCredential,status==='PUBLISHED'?'APPROVED':status))return send(403,{error:'AUTHORIZED_HUMAN_REVIEWER_REQUIRED'});const before={...payload};");await writeFile(file,s);
