import {readFile,readdir,writeFile} from 'node:fs/promises';import path from 'node:path';import {digest} from '../shared/v5-quality.mjs';
const evidence=JSON.parse(await readFile('data/reports/v15/source-evidence.json','utf8')),workspaces=(await readdir('.tmp')).filter(n=>n.startsWith('v15-browser-')),results=[];
for(const browser of ['chrome','edge']){
 const metric=JSON.parse(await readFile('data/reports/v15/performance-'+browser+'.json','utf8'));let workspace;
 for(const candidate of workspaces){try{const p=JSON.parse(await readFile(path.join('.tmp',candidate,'data/reports/v15/performance-'+browser+'.json'),'utf8'));if(p.at===metric.at&&digest(p)===digest(metric)){workspace=path.join('.tmp',candidate);break}}catch{}}
 if(!workspace)throw Error('No matching measured workspace '+browser);
 const differences=[];for(const f of Object.keys(evidence.files).filter(f=>/^(src|server|shared)\//.test(f))){let old;try{old=digest(await readFile(path.join(workspace,f)))}catch{}const current=digest(await readFile(f));if(old!==current)differences.push({file:f,measured:old,current})}
 const nonProbeFiles=['src/components/uiV14/CatalogPresentation.tsx'];
 const coreSourceMatches=differences.every(d=>nonProbeFiles.includes(d.file));
 results.push({browser,at:metric.at,workspace,coreSourceMatches,differences,scope:'Warm navigation/choice/result probes. Only a later Catalog reading-instruction fix may differ; the probed Room/Result/media/engine/style source must match.'});
}
const report={at:new Date().toISOString(),status:results.every(r=>r.coreSourceMatches)?'PASS':'FAIL',results};await writeFile('data/reports/v15/performance-source.json',JSON.stringify(report,null,2));console.log(JSON.stringify({status:report.status,results:results.map(r=>({browser:r.browser,differences:r.differences.map(d=>d.file)}))}));if(report.status!=='PASS')process.exitCode=1;
