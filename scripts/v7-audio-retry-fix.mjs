import {readFile,writeFile} from 'node:fs/promises';const f='src/components/exam/ExamAudio.tsx';let s=await readFile(f,'utf8');
s=s.replace("setBlobSrc(undefined);void fetch", "setStatus('loading');clearTimeout(timeout.current);timeout.current=window.setTimeout(fail,12000);setBlobSrc(undefined);void fetch");
s=s.replace("live=false;controller.abort();clearTimeout(deadline);", "live=false;controller.abort();clearTimeout(deadline);clearTimeout(timeout.current);");
s=s.replace('<audio ref={audio}',"<audio key={playableSrc??'pending'} ref={audio}");await writeFile(f,s);
