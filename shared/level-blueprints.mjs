const url='https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip',sha='920396379b9795c1b5aadb3820ec74e3e606a49d1444043394e7475a35b4bf9c';
const evidence=(pages,note)=>({url,archiveMember:'HSK/HSK（二级）样卷.pdf',sampleSha256:sha,pdfPages:pages,note,checkedAt:'2026-10-16',scope:'PAPER_SAMPLE_ONLY'});
export const HSK2_BLUEPRINT={schemaVersion:1,id:'hsk3-2025-level2-paper-sample-v7',level:'2',edition:'hsk3-2025',status:'DATA_ONLY',learnerAvailable:false,contentQuestions:0,parts:[
 ['L1','listening','picture-choice',5,[3,4],{options:3,audio:true,pictures:true},'Three image choices'],
 ['L2','listening','matching',10,[5,6],{groups:[{count:5,options:6},{count:5,options:5}],audio:true,pictures:true},'Two fixed picture banks; bank sizes differ'],
 ['L3','listening','dialogue',10,[7],{options:3,audio:true},'Dialogue and question, three textual choices'],
 ['R1','reading','matching',5,[10],{groups:[{count:5,options:6}],pictures:true},'Sentence to shared image bank'],
 ['R2','reading','shared-options',5,[11],{groups:[{count:5,options:6}]},'Fill gaps using shared word bank'],
 ['R3','reading','shared-options',10,[12,13],{groups:[{count:5,options:6},{count:5,options:5}]},'Two response banks with different sizes'],
 ['R4','reading','short-passage',5,[14,15],{options:3},'Read short passage, choose response'],
 ['W1','writing','shared-options',5,[18],{groups:[{count:5,options:6}],characterComponents:true},'Select missing character component; requires authored glyph accessibility QA'],
 ['W2','writing','short-answer',5,[19],{scoring:'exact-text',pinyinIsExamContent:true},'Write a missing Hanzi using displayed pinyin; registered renderer path requires validation before activation']
].map(([partId,skill,questionType,count,pages,requirements,note])=>({partId,skill,questionType,count,requirements,evidence:evidence(pages,note),verificationStatus:'PAPER_TYPE_AND_COUNT_OBSERVED',activation:'BLOCKED_CONTENT_MEDIA_AND_RENDERER_QA'})),
 timing:{listeningMinutes:17,readingMinutes:25,writingMinutes:10,answerTransferMinutes:3,administrationMinutes:5,totalApproximateMinutes:60,evidence:evidence([1],'Cover budgets; paper timing only, not IBT navigation/playback equivalence')},
 totalQuestions:60,skills:['listening','reading','writing'],scoring:{officialScale:'NOT_VERIFIED',passThreshold:null,answerKeyCompatibility:'BLOCKED_NUMBERING_CONFLICT'},
 sourceConflicts:[{id:'WRITING_ANSWER_NUMBERING',sampleRanges:['W1:51–55','W2:56–60'],answerDocumentRanges:['W1:54–58','W2:59–63'],evidence:{answerPdfSha256:'4bb64c8d61a3b385c66cce19222edafbd6149d8542339fbaa4bf04487bc7dbfd',answerPdfPage:2},resolution:'Do not silently reindex official answer keys; expert/CTI clarification required'}],
 blockers:['NO_ORIGINAL_QUESTION_BANK','NO_RIGHTS_VERIFIED_AUDIO','NO_HUMAN_REVIEW','WRITING_RENDERER_QA_REQUIRED','ANSWER_KEY_NUMBERING_CONFLICT','IBT_RULES_AND_SCORING_NOT_VERIFIED']};
export function blueprintForLevel(level,edition='hsk3-2025'){return String(level)==='2'&&edition==='hsk3-2025'?HSK2_BLUEPRINT:{schemaVersion:1,level:String(level),edition,status:'DATA_ONLY',parts:[],learnerAvailable:false,blockers:['NEEDS_VERSIONED_SOURCE_VERIFICATION']};}
