// Implementation edit, not startup/setup. Preview changes by default.
import {readFile,writeFile} from 'node:fs/promises';
const apply=process.argv.includes('--apply'),changes=[];
for(const file of ['server/admin-server.mjs','server/v3-content-service.mjs','server/v5-content-service.mjs','server/v7-review-service.mjs']){
 const before=await readFile(file,'utf8');let after=before;
 after=after.replaceAll("'v8-hsk2-pilot','v8-hsk1-supplement'","'v8-hsk2-pilot','v8-hsk1-supplement','v9-hsk2-practice','v9-hsk1-supplement'");
 after=after.replaceAll("?.startsWith('v8-')","?.match(/^v[89]-/)").replaceAll("?.startsWith('v8-hsk')","?.match(/^v[89]-hsk/)");
 if(after!==before){changes.push({file,beforeBytes:before.length,afterBytes:after.length});if(apply)await writeFile(file,after);}
}
console.log(JSON.stringify({dryRun:!apply,changes}));
