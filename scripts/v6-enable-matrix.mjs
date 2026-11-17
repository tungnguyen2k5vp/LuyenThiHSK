import {readFile,writeFile} from 'node:fs/promises';
const p='scripts/exam-browser-check.mjs',s=await readFile(p,'utf8');await writeFile(p,"if(process.argv.includes('--v6-matrix')){await import('./v6-browser-matrix.mjs');process.exit(process.exitCode??0);}\n"+s);console.log('Browser matrix entry added.');
