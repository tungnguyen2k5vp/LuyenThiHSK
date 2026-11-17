import {readFile,writeFile} from 'node:fs/promises';
for(const f of ['server/admin-server.mjs','server/v3-content-service.mjs','server/v5-content-service.mjs','server/v7-review-service.mjs']){let s=await readFile(f,'utf8');s=s.replaceAll('/^v(?:6|8|9)-/','/^v(?:6|8|9|10)-/');await writeFile(f,s)}
