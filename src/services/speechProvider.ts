export interface SpeechRecording { result:Promise<Blob>; stop:()=>void; cancel:()=>void }
export interface SpeechProvider { start:()=>Promise<SpeechRecording>; transcribe?:(audio:Blob)=>Promise<string> }
export const browserSpeechProvider:SpeechProvider={async start(){
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw Error('Trình duyệt chưa hỗ trợ ghi âm. Bạn vẫn có thể tự luyện và ghi chú.');
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});
  const type=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  const recorder=new MediaRecorder(stream,type?{mimeType:type}:undefined);const chunks:BlobPart[]=[];let timer:ReturnType<typeof setTimeout>;
  const result=new Promise<Blob>((resolve,reject)=>{recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onerror=()=>reject(Error('Ghi âm bị gián đoạn. Hãy thử lại.'));recorder.onstop=()=>{clearTimeout(timer);stream.getTracks().forEach(t=>t.stop());resolve(new Blob(chunks,{type:recorder.mimeType}));};});
  recorder.start();timer=setTimeout(()=>{if(recorder.state==='recording')recorder.stop();},120000);
  return{result,stop(){if(recorder.state==='recording')recorder.stop();},cancel(){clearTimeout(timer);if(recorder.state==='recording')recorder.stop();stream.getTracks().forEach(t=>t.stop());}};
}};
async function recordingDb(){return new Promise<IDBDatabase>((resolve,reject)=>{const request=indexedDB.open('hsk-recordings-v1',1);request.onupgradeneeded=()=>request.result.createObjectStore('recordings');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
export async function saveRecording(id:string,blob:Blob){const db=await recordingDb();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('recordings','readwrite');tx.objectStore('recordings').put(blob,id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}finally{db.close();}}
export async function readRecording(id:string):Promise<Blob|null>{const db=await recordingDb();try{return await new Promise((resolve,reject)=>{const req=db.transaction('recordings').objectStore('recordings').get(id);req.onsuccess=()=>resolve(req.result??null);req.onerror=()=>reject(req.error);});}finally{db.close();}}
