/** Keep the optional content API reachable from existing localhost preview origins. */
export function contentApiUrl(path:string){return (new URLSearchParams(location.search).get('ui')==='v15'?'':['localhost','127.0.0.1'].includes(location.hostname)?'http://127.0.0.1:8787':'')+'/api/'+path;}

/** Bounded request including body decoding; callers explicitly retry writes. */
export async function requestContentJson(url:string,init:RequestInit={},timeoutMs=12000){
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  const response=await fetch(url,{...init,signal:init.signal?AbortSignal.any([init.signal,controller.signal]):controller.signal});
  const data=await response.json();
  if(!response.ok)throw Error(data.error??data.errors?.join('; ')??'Không thể tải nội dung ('+response.status+').');
  return data;
 }catch(error){
  if(controller.signal.aborted)throw Error('Kết nối quá thời gian. Bài đã lưu vẫn được giữ; hãy thử tải lại.');
  throw error;
 }finally{clearTimeout(timeout)}
}
