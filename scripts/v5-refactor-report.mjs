import {readFile,writeFile} from 'node:fs/promises';
const p='scripts/report-v5.mjs';let s=await readFile(p,'utf8');const from=s.indexOf("await write('HSK_EXAM_SPEC_VERIFICATION'"),to=s.indexOf("const target='TAI_LIEU_TONG_HOP_HSK'",from);if(from<0||to<0)throw Error('Report anchors missing');s=s.slice(0,from)+`await writeV5Reports({at,b,summary,reports,classified,screen,py,qa,audio,diff,grammarCoverage,spec});
const docs=await readdir('docs/v5');
`+s.slice(to);s="import {writeV5Reports} from './v5-report-text.mjs';\n"+s;await writeFile(p,s);
