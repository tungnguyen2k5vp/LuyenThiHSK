import {readFile,writeFile} from 'node:fs/promises';
const file='src/services/cloudSync.ts';let s=await readFile(file,'utf8');
// Keep the existing record contract, grading/SRS events and legacy keys.
const start=s.indexOf('export function captureCloudRecords'),split=s.indexOf(' const queue=syncQueue(owner)',start),end=s.indexOf('let flushing=false',split);
const entryCode=s.slice(start,split).replace("export function captureCloudRecords(source:'study'|'preparation',data:StudyData|PreparationData,owner=activeOwner()){if(!owner)return;","function cloudEntries(source:'study'|'preparation',data:StudyData|PreparationData){");
const queueCode=s.slice(split,end).replace('for(const e of entries){','for(const e of entries){if(delta&&!delta.changed.includes(e.kind+\'|\'+e.id))continue;').replace("if(!sourceOwns(id)||present.has(id)","if(delta&&!delta.removed.includes(id))continue;if(!sourceOwns(id)||present.has(id)");
s=s.slice(0,start)+entryCode+'return entries;}\n'+"function captureNow(source:'study'|'preparation',data:StudyData|PreparationData,owner:string,delta?:{changed:string[];removed:string[]}){const entries=cloudEntries(source,data);"+queueCode+s.slice(end);
s=s.replace('export async function flushCloudQueue()', 'async function flushNow()').replace('export async function pullCloudRecords()', 'async function pullNow()').replace('export function acceptCloudConflict(', 'function acceptNow(');
// All queue/shadow/version writes live in one atomic JSON value. Old keys remain readable.
s=s.replace("const read=<T,>(owner:string,name:string,fallback:T):T=>{try{return JSON.parse(localStorage.getItem(key(owner,name))??'null')??fallback;}catch{return fallback;}};",`type QueueState={queue:QueueRow[];shadow:Record<string,string>;versions:Record<string,number>};
let staged:{owner:string;state:QueueState}|null=null;
const stateKey=(owner:string)=>key(owner,'atomic-queue-v8');
function state(owner:string):QueueState{if(staged?.owner===owner)return staged.state;const saved=localStorage.getItem(stateKey(owner));if(saved){const parsed=JSON.parse(saved);if(!Array.isArray(parsed.queue)||!parsed.shadow||!parsed.versions)throw Error('QUEUE_CORRUPT_BACKUP_REQUIRED');return parsed;}const old=(n:string,f:unknown)=>JSON.parse(localStorage.getItem(key(owner,n))??'null')??f;return{queue:old('queue',[]),shadow:old('shadow',{}),versions:old('versions',{})};}
const read=<T,>(owner:string,name:string,fallback:T):T=>{if(['queue','shadow','versions'].includes(name))return (state(owner) as unknown as Record<string,T>)[name]??fallback;try{return JSON.parse(localStorage.getItem(key(owner,name))??'null')??fallback;}catch{return fallback;}};
function persist(owner:string,name:string,value:string){if(['queue','shadow','versions'].includes(name)){const current=state(owner);(current as unknown as Record<string,unknown>)[name]=JSON.parse(value);if(staged?.owner!==owner)localStorage.setItem(stateKey(owner),JSON.stringify(current));}else localStorage.setItem(key(owner,name),value);}
function captureTransaction(run:()=>void,owner:string){staged={owner,state:state(owner)};try{run();localStorage.setItem(stateKey(owner),JSON.stringify(staged.state));}finally{staged=null;}}
`);
s=s.replaceAll(/localStorage\.setItem\(key\(owner,'(queue|shadow|versions)'\),/g,"persist(owner,'$1',");
s=s.replace("sessionStorage.setItem(OWNER,owner);}","sessionStorage.setItem(OWNER,owner);initializeObservation(owner);}");
s=s.replace("if(user?.id!==owner)throw Error('ACCOUNT_OWNER_CHANGED');for", "if(user?.id!==owner||activeOwner()!==owner)throw Error('ACCOUNT_OWNER_CHANGED');for");
s=s.replace("const queue=syncQueue(owner),index=queue.findIndex", "if(activeOwner()!==owner)throw Error('ACCOUNT_OWNER_CHANGED');const queue=syncQueue(owner),index=queue.findIndex");
s+=`
type Delta={changed:string[];removed:string[]};
const observed=new Map<string,Record<string,string>>();
function initializeObservation(owner:string){for(const source of ['study','preparation'] as const){const raw=localStorage.getItem(key(owner,source==='study'?'hsk-study-data-v1':'hsk-preparation-v1'));if(raw){try{observed.set(owner+'|'+source,Object.fromEntries(cloudEntries(source,JSON.parse(raw)).map(e=>[e.kind+'|'+e.id,JSON.stringify(e.payload)])));}catch{/* preserve unreadable data; do not delete it */}}}}
if(typeof document!=='undefined'&&activeOwner())initializeObservation(activeOwner()!);
const journalPrefix=(owner:string)=>key(owner,'capture-v8:');
function journals(owner:string){const rows:{key:string;id:string;source:'study'|'preparation';data:StudyData|PreparationData;delta:Delta;at:number}[]=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(journalPrefix(owner))){const row=JSON.parse(localStorage.getItem(k)!);rows.push({...row,key:k});}}return rows.sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));}
function drain(owner:string){for(const j of journals(owner)){captureTransaction(()=>captureNow(j.source,j.data,owner,j.delta),owner);localStorage.removeItem(j.key);}}
function locked<T>(owner:string,run:()=>Promise<T>|T):Promise<T>{if(typeof document==='undefined')return Promise.resolve().then(run);if(!navigator.locks) return Promise.reject(Error('CLOUD_ATOMIC_UNAVAILABLE: dữ liệu đang chờ được giữ trên thiết bị; cần trình duyệt hỗ trợ Web Locks.'));return navigator.locks.request('hsk-cloud-v8:'+owner,async()=>{drain(owner);return run();});}
export function captureCloudRecords(source:'study'|'preparation',data:StudyData|PreparationData,owner=activeOwner()){
 if(!owner)return;if(typeof document==='undefined'){captureTransaction(()=>captureNow(source,data,owner),owner);return;}
 const current=Object.fromEntries(cloudEntries(source,data).map(e=>[e.kind+'|'+e.id,JSON.stringify(e.payload)])),previous=observed.get(owner+'|'+source)??{},delta={changed:Object.keys(current).filter(k=>current[k]!==previous[k]),removed:Object.keys(previous).filter(k=>!(k in current))};
 if(!delta.changed.length&&!delta.removed.length)return;
 const id=crypto.randomUUID();localStorage.setItem(journalPrefix(owner)+id,JSON.stringify({id,source,data,delta,at:Date.now()}));observed.set(owner+'|'+source,current);
 void locked(owner,()=>{window.dispatchEvent(new Event('hsk-sync-queued'));}).catch(e=>window.dispatchEvent(new CustomEvent('hsk-sync-error',{detail:e.message})));
}
export async function flushCloudQueue(){const owner=activeOwner();if(!owner)return;return locked(owner,async()=>{await flushNow();if(journalsAvailable(owner)){drain(owner);await flushNow();}});}
function journalsAvailable(owner:string){return typeof document!=='undefined'&&journals(owner).length>0;}
export async function pullCloudRecords(){const owner=activeOwner();if(!owner)throw Error('SIGN_IN_REQUIRED');return locked(owner,pullNow);}
export function acceptCloudConflict(opId:string){const owner=activeOwner();if(!owner)return Promise.resolve();return locked(owner,()=>acceptNow(opId));}
export function pendingCaptureCount(owner=activeOwner()){return owner&&typeof document!=='undefined'?journals(owner).length:0;}
`;
await writeFile(file,s);
