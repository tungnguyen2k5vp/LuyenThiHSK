import {readFile,writeFile} from 'node:fs/promises';
await readFile('data/reports/v10/baseline.json');
for(const file of ['server/admin-server.mjs','server/v3-content-service.mjs','server/v5-content-service.mjs','server/v7-review-service.mjs']){
 let text=await readFile(file,'utf8');if(!text.includes("'v10-hsk2'"))text=text.replaceAll("'v9-hsk1-supplement'","'v9-hsk1-supplement','v10-hsk2'");text=text.replaceAll('/^v[89]-/','/^v(?:8|9|10)-/').replaceAll('/^v[689]-/','/^v(?:6|8|9|10)-/');
 if(file==='server/admin-server.mjs'&&!text.includes('createV10Service')){text="import {createV10Service} from './v10-content-service.mjs';\n"+text;text=text.replace('const authFailures=new Map();',"const v10=createV10Service({db,root,runtime,addRecord,v9,v7,v3,reviewers:JSON.parse(process.env.HSK_REVIEWERS_JSON??'[]')});\nconst authFailures=new Map();");text=text.replace('if(await v9.handle({url,req,send,body,res}))return;','if(await v9.handle({url,req,send,body,res}))return;\n    if(await v10.handle({url,req,send,body,res}))return;');}
 if(file==='server/admin-server.mjs'&&!text.includes('EDITORIAL_RELEASE_IS_IMMUTABLE'))text=text.replace("if(existing&&existing.kind!==kind)","if(existing&&/^v(?:6|8|9|10)-/.test(JSON.parse(existing.payload).editorialRelease??'')){const previous=JSON.parse(existing.payload);if(payload.editorialRelease!==previous.editorialRelease||previous.sourceType==='AI_GENERATED'&&payload.sourceType!=='AI_GENERATED')throw Object.assign(Error('EDITORIAL_RELEASE_IS_IMMUTABLE'),{status:409});}if(existing&&existing.kind!==kind)");
 await writeFile(file,text);
}
let file='server/content-contract.mjs',text=await readFile(file,'utf8');text=text.replace('v[456]\\/(audio|recording)','v(?:[456]|10)\\/(audio|recording)');await writeFile(file,text);
console.log('V10 service mounted and publication/CAS/reviewer boundaries extended; no content mutation');
