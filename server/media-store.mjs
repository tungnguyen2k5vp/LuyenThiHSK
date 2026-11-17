import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
export const MEDIA_MAX_BYTES=12*1024*1024;
const types={wav:'audio/wav',mp3:'audio/mpeg',ogg:'audio/ogg',webm:'audio/webm',m4a:'audio/mp4'};
export function inspectAudio(buffer){
  let extension;let durationMs=null;
  if(buffer.length<32)throw Object.assign(Error('File audio quá ngắn hoặc sai định dạng'),{status:422});
  if(buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WAVE'){
    extension='wav';let byteRate=0;let dataBytes=0;let end=12;
    while(end+8<=buffer.length){const tag=buffer.toString('ascii',end,end+4),size=buffer.readUInt32LE(end+4);if(end+8+size>buffer.length)throw Object.assign(Error('WAV bị cắt hoặc thiếu dữ liệu'),{status:422});if(tag==='fmt '&&size>=16)byteRate=buffer.readUInt32LE(end+16);if(tag==='data')dataBytes+=size;end+=8+size+(size%2);}
    if(!byteRate||!dataBytes)throw Object.assign(Error('WAV duration 0 hoặc thiếu fmt/data'),{status:422});durationMs=Math.round(dataBytes/byteRate*1000);
  }else if(buffer.toString('ascii',0,3)==='ID3'||buffer[0]===255&&(buffer[1]&224)===224)extension='mp3';
  else if(buffer.toString('ascii',0,4)==='OggS')extension='ogg';
  else if(buffer.subarray(0,4).equals(Buffer.from([26,69,223,163])))extension='webm';
  else if(buffer.toString('ascii',4,8)==='ftyp')extension='m4a';
  if(!extension)throw Object.assign(Error('Chỉ nhận WAV, MP3, OGG, WEBM hoặc M4A; không tin đuôi tệp'),{status:422});
  return{extension,mime:types[extension],durationMs};
}
export async function saveMedia(runtime,buffer){
  if(buffer.length>MEDIA_MAX_BYTES)throw Object.assign(Error('Audio vượt 12 MB'),{status:413});const info=inspectAudio(buffer);const hash=createHash('sha256').update(buffer).digest('hex');const directory=path.join(runtime,'media');await mkdir(directory,{recursive:true});const filename=hash+'.'+info.extension;let duplicate=false;
  try{await stat(path.join(directory,filename));duplicate=true;}catch{await writeFile(path.join(directory,filename),buffer,{flag:'wx'});}
  return{...info,contentHash:hash,storageUrl:'/api/media/'+filename,bytes:buffer.length,duplicate};
}
export async function readMedia(runtime,url){const name=url.split('/').pop();if(!/^[a-f0-9]{64}\.(wav|mp3|ogg|webm|m4a)$/.test(name??''))throw Object.assign(Error('Media path không hợp lệ'),{status:404});try{return{buffer:await readFile(path.join(runtime,'media',name)),mime:types[name.split('.').pop()]};}catch{throw Object.assign(Error('Không tìm thấy file audio'),{status:404});}}
