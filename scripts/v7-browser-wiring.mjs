import {readFile,writeFile} from 'node:fs/promises';
let f='scripts/exam-browser-check.mjs',s=await readFile(f,'utf8');s="import {runV7BrowserFlows} from './v7-browser-flows.mjs';\n"+s;
s=s.replace("const base=(process.argv.includes('--v6')", "const base=process.env.HSK_SCREENSHOT_ROOT??(process.argv.includes('--v6')");
// Parenthesize the existing ternary so the explicit V7 root wins.
s=s.replace("const base=process.env.HSK_SCREENSHOT_ROOT??(process.argv.includes('--v6')", "const base=process.env.HSK_SCREENSHOT_ROOT??((process.argv.includes('--v6')");
s=s.replace(":'docs/screenshots/exam-focus';await mkdir(base", ":'docs/screenshots/exam-focus');await mkdir(base");
s=s.replace(" if(process.argv.includes('--v6-stress'))", " if(process.argv.includes('--v7')){await rpc('Performance.enable');await runV7BrowserFlows({rpc,evaluate,waitFor,click,navigate,screenshot});assert.equal(exceptions.length,0,JSON.stringify(exceptions));}else if(process.argv.includes('--v6-stress'))");
await writeFile(f,s);
