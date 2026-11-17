import { useEffect, useState } from 'react';
import type { CourseWord, CurriculumManifest, GrammarPoint, HanziEntry, LearningSupplement } from '../types/curriculum';
import {applyLearningSupplement} from './learningSupplement';
import { contentApiUrl } from './localApi';
import {usePreviewContent} from './previewContent';
import {chineseVoice} from './chineseVoice';
const cache=new Map<string,Promise<unknown>>();
export async function fetchData<T>(url:string):Promise<T>{
  if(!cache.has(url))cache.set(url,fetch(url).then(r=>{if(!r.ok)throw Error('Không tải được học liệu. Hãy kết nối mạng và thử lại.');return r.json();}).catch(e=>{cache.delete(url);throw e;}));
  return cache.get(url) as Promise<T>;
}
export function useManifest(){const [manifest,setManifest]=useState<CurriculumManifest|null>(null);const [error,setError]=useState('');useEffect(()=>{let active=true;fetchData<CurriculumManifest>('/data/manifest.json').then(m=>{if(active)setManifest(m);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[]);return{manifest,error};}
export function useCourseLevel(level:string){
  const preview=usePreviewContent();const previewBundle=preview?.bundle;
  const [words,setWords]=useState<CourseWord[]>([]);const [grammar,setGrammar]=useState<GrammarPoint[]>([]);const [hanzi,setHanzi]=useState<HanziEntry[]>([]);const [error,setError]=useState('');const [loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;setLoading(true);setError('');setWords([]);setGrammar([]);setHanzi([]);
    Promise.all([fetchData<CourseWord[]>('/data/hsk3-2025-'+level+'-words.json'),fetchData<GrammarPoint[]>('/data/hsk3-2025-'+level+'-grammar.json'),fetchData<HanziEntry[]>('/data/hsk3-2025-'+level+'-hanzi.json')]).then(async([w,g,h])=>{
      try{const response=await fetch(contentApiUrl('public/content'));if(response.ok&&response.headers.get('content-type')?.includes('application/json')){const extra=await response.json() as {records:{kind:string;payload:CourseWord|GrammarPoint|HanziEntry}[]};for(const record of extra.records.filter(r=>r.payload.level===level&&r.payload.syllabusVersion==='hsk3-2025')){if(record.kind==='vocabulary')w=[...w.filter(i=>i.id!==record.payload.id),record.payload as CourseWord];if(record.kind==='grammar'){const lesson=record.payload as GrammarPoint;const pointId=lesson.grammarPointId??lesson.id;g=[...g.filter(i=>i.id!==pointId),{...lesson,id:pointId}];}if(record.kind==='hanzi')h=[...h.filter(i=>i.id!==record.payload.id),record.payload as HanziEntry];}}}catch{/* Static release remains usable offline or without the optional local API. */}
      if(previewBundle&&level==='1'){w=previewBundle.words;g=previewBundle.lessons.map(lesson=>({...lesson,id:lesson.grammarPointId??lesson.id}));}
      if(previewBundle&&level==='2'){const drafts=new Map(previewBundle.wordDrafts?.map(d=>[d.vocabularyPointId,d]));w=w.map(word=>({...word,...drafts.get(word.id),id:word.id}));const lessons=new Map(previewBundle.lessonDrafts?.map(d=>[d.grammarPointId??d.id,d]));g=g.map(point=>({...point,...lessons.get(point.id),id:point.id}));}
      try{const extra=await fetchData<{existingWordId?:string;sourceIds:string[];gloss_en:string;glosses:string[];pos_en:string;sourceVariants:{pos_en:string}[];hsk3Bands:number[];hsk2Levels:number[];levelConflict:boolean}[]>('/data/open-hsk/words.json');const byId=new Map(extra.filter(x=>x.existingWordId).map(x=>[x.existingWordId,x]));w=w.map(word=>{const ref=byId.get(word.id);return ref?{...word,licensedGloss:{en:ref.glosses.join('; '),pos:[...new Set([ref.pos_en,...ref.sourceVariants.map(v=>v.pos_en)])].filter(Boolean).join('; '),sourceUrl:'https://hearmandarin.com/datasets/',license:'CC BY 4.0',sourceId:ref.sourceIds[0],hsk3Bands:ref.hsk3Bands,hsk2Levels:ref.hsk2Levels,levelConflict:ref.levelConflict}}:word;});}catch{/* Optional licensed glosses must not prevent the existing curriculum loading. */}
      if(!previewBundle)try{const merged=applyLearningSupplement(w,g,h,await fetchData<LearningSupplement>('/data/learning/level-'+level+'.json'));w=merged.words;g=merged.grammar;h=merged.hanzi;}catch{/* The original curriculum remains available if the optional supplement is unavailable. */}
      if(active){setWords(w);setGrammar(g);setHanzi(h);}}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};
  },[level,previewBundle]);return{words,grammar,hanzi,error,loading};
}
export function searchKey(value:string){return value.toLowerCase().normalize('NFD').replace(/đ/g,'d').replace(/[\u0300-\u036f\s'’0-5]/g,'').replace(/u:|v/g,'u');}
export function wordMatches(word:CourseWord,query:string){return searchKey([word.simplified,word.traditional,word.pinyin,word.primaryMeaningVi,word.meaningVi,...word.meaningsEn,word.licensedGloss?.en??''].join(' ')).includes(searchKey(query));}
export async function speakChinese(text:string,rate=1):Promise<void>{
 if(!('speechSynthesis'in window))throw Error('Thiết bị không hỗ trợ đọc tiếng Trung.');
 const synth=window.speechSynthesis;let voice=chineseVoice(synth.getVoices());
 if(!voice&&synth.addEventListener){await new Promise<void>(resolve=>{const ready=()=>{clearTimeout(timer);synth.removeEventListener('voiceschanged',ready);resolve();},timer=setTimeout(ready,1500);synth.addEventListener('voiceschanged',ready,{once:true});});voice=chineseVoice(synth.getVoices());}
 if(!voice)throw Error('Thiết bị chưa có giọng đọc tiếng Trung phổ thông. Hãy cài giọng Mandarin/中文 trong cài đặt ngôn ngữ, mở lại trang rồi thử; vẫn có thể đọc transcript.');
 return new Promise((resolve,reject)=>{synth.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=rate;utterance.onend=()=>resolve();utterance.onerror=()=>reject(Error('Không phát được giọng đọc. Hãy thử lại hoặc kiểm tra âm lượng.'));synth.speak(utterance);});
}
