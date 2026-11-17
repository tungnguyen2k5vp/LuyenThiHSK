let ownerToken='';
const cache=new Map<string,{blob:Blob;at:number}>();
/** Private, memory-only, bounded image cache. Asset hashes and credential scope prevent stale reuse. */
export async function previewImageBlob(url:string,token:string,contentHash:string|undefined,signal:AbortSignal,refresh=false){
 if(token!==ownerToken){cache.clear();ownerToken=token;}
 const key=url+'|'+contentHash,entry=cache.get(key);
 if(contentHash&&!refresh&&entry&&Date.now()-entry.at<60000)return entry.blob;
 cache.delete(key);
 const response=await fetch(url,{headers:{Authorization:'Bearer '+token},signal});
 if(!response.ok)throw Error('Image unavailable');const blob=await response.blob();
 if(contentHash){
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer())),n=>n.toString(16).padStart(2,'0')).join('');
  if(hash!==contentHash)throw Error('Image checksum mismatch');
  if(!signal.aborted&&token===ownerToken){if(cache.size>=24)cache.delete(cache.keys().next().value!);cache.set(key,{blob,at:Date.now()});}
 }
 return blob;
}
