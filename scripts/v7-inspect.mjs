import {readFile} from 'node:fs/promises';
const b=JSON.parse(await readFile('data/staging/v6/hsk1-release.json','utf8'));
for(const key of ['words','lessons','questions','audio','images','optionBanks'])console.log(key,JSON.stringify(b[key][0]).slice(0,4400));
