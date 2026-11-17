import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {validatePreviewRelease,buildPreviewExam,previewFingerprint} from '../shared/preview-content.mjs';
const file='data/staging/v4/hsk1-release.json';const bundle=JSON.parse(await readFile(file,'utf8'));
for(const row of [...bundle.words,...bundle.lessons,...bundle.questions,...bundle.audio,...bundle.templates])delete row.internalValidation;
const report=validatePreviewRelease(bundle);
for(const a of bundle.audio){try{const bytes=await readFile('.runtime/v4-audio/'+a.id+'.wav');if(createHash('sha256').update(bytes).digest('hex')!==a.contentHash)report.errors.push('Audio checksum '+a.id);}catch{report.errors.push('Audio missing '+a.id);}}
if(report.errors.length||report.warnings.length)throw Error([...report.errors,...report.warnings].join('\n'));
for(const row of [...bundle.words,...bundle.lessons,...bundle.questions,...bundle.audio,...bundle.templates])row.internalValidation={status:'PASSED',fingerprint:previewFingerprint(row),checkedAt:report.checkedAt,method:'V4 schema, complete fields, IDs, exact duplicate stems, answer membership, original source metadata, WAV checksum/header; NOT language/human/license review'};
const full=buildPreviewExam(bundle);const mini=buildPreviewExam(bundle,{kind:'mini'});if(full.questions.length!==40||mini.questions.length!==10)throw Error('Mock size');
bundle.validationVersion=1;bundle.validatedAt=report.checkedAt;
await writeFile(file,JSON.stringify(bundle,null,2));
const final=validatePreviewRelease(bundle);final.previewMock={id:full.id,seed:full.seed,lockedQuestions:full.lockedQuestions,sections:full.config.sections.map(s=>({skill:s.skill,count:s.questionIds.length,durationMinutes:s.durationMinutes})),official:false};
await writeFile('data/reports/v4-content-validation.json',JSON.stringify(final,null,2));console.log(JSON.stringify(final.summary));
