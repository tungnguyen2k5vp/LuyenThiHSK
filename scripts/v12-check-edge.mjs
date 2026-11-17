import {spawn} from 'node:child_process';
const p=spawn(process.execPath,['scripts/exam-browser-check.mjs','--v12'],{env:{...process.env,HSK_BROWSER_PATH:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'},windowsHide:true,stdio:'inherit'});p.on('exit',c=>process.exitCode=c);p.on('error',e=>{throw e;});
