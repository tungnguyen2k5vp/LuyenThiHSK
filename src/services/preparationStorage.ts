import {ownerStorageKey,captureCloudRecords} from './cloudSync';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { HSKDataEdition } from '../types';
import type { Sm2Card } from './sm2';

export interface LearnerProfile { targetLevel: string; currentLevel: string; examDate: string; minutesPerDay: number; edition: HSKDataEdition; pinyin: 'always' | 'tap' | 'hidden'; audioSpeed: number; reminder: boolean; onboarding: 'new' | 'done' | 'skipped' }
export interface CourseProgress extends Sm2Card { id: string; level: string; learned: boolean; updatedAt: string }
export interface LearningEvent { id: string; kind: 'word-learn' | 'word-review' | 'grammar' | 'practice' | 'mistakes' | 'hanzi' | 'writing' | 'speaking'; entityId: string; at: string; count: number; minutes: number; skill?:string; contentEnvironment?:string }
export interface StudyTask { id: string; title: string; kind: LearningEvent['kind'] | 'mistakes'; count: number; minutes: number; page: string; skill?: string; reason?: string }
export interface DailyPlan { day: string; createdAt: string; tasks: StudyTask[]; skipped: string[] }
export interface PreparationData {
  schemaVersion: 1; updatedAt: string; profile: LearnerProfile;
  cards: Record<string, CourseProgress>; grammar: Record<string, string>; hanzi: Record<string, string>;
  favorites: Record<string, boolean>; mistakeReasons: Record<string, string>;
  events: LearningEvent[]; plans: Record<string, DailyPlan>;
  writing: Record<string, { text: string; updatedAt: string; ratings: number[] }>;
  diagnostics: { at: string; estimatedLevel: string; correct: number; total: number }[];
}
export const PREPARATION_KEY = 'hsk-preparation-v1';
export const LEVELS = ['1', '2', '3', '4', '5', '6', '7-9'];
export function emptyPreparation(): PreparationData {
  return { schemaVersion:1,updatedAt:new Date().toISOString(),profile:{targetLevel:'1',currentLevel:'unknown',examDate:'',minutesPerDay:30,edition:'hsk3-2025',pinyin:'tap',audioSpeed:1,reminder:false,onboarding:'new'},cards:{},grammar:{},hanzi:{},favorites:{},mistakeReasons:{},events:[],plans:{},writing:{},diagnostics:[] };
}
export function readPreparation(storageKey=PREPARATION_KEY): PreparationData {
  const empty=emptyPreparation();
  try {
    const raw=localStorage.getItem(ownerStorageKey(storageKey));if(!raw)return empty;
    const data=JSON.parse(raw);if(data.schemaVersion!==1)throw Error('Unsupported preparation schema');
    const object=(v:unknown)=>v!==null&&typeof v==='object'&&!Array.isArray(v);
    const profile={...empty.profile,...data.profile};
    if(!LEVELS.includes(profile.targetLevel))profile.targetLevel='1';
    if(![...LEVELS,'unknown'].includes(profile.currentLevel))profile.currentLevel='unknown';
    if(!Number.isFinite(profile.minutesPerDay)||profile.minutesPerDay<5||profile.minutesPerDay>240)profile.minutesPerDay=30;
    if(!['new','done','skipped'].includes(profile.onboarding))profile.onboarding='new';
    const cards=object(data.cards)?Object.fromEntries(Object.entries(data.cards).filter(([,v])=>{const c=v as CourseProgress;return c&&typeof c.id==='string'&&Number.isFinite(Date.parse(c.dueAt))&&Number.isFinite(c.easeFactor)&&c.easeFactor>=1.3&&Number.isInteger(c.repetitions)&&c.repetitions>=0&&Number.isInteger(c.reviewCount)&&c.reviewCount>=0&&Number.isFinite(c.intervalDays)&&c.intervalDays>=0;})):{};
    const plans=object(data.plans)?Object.fromEntries(Object.entries(data.plans).filter(([,v])=>{const p=v as DailyPlan;return p&&typeof p.day==='string'&&Number.isFinite(Date.parse(p.createdAt))&&Array.isArray(p.skipped)&&p.skipped.every(s=>typeof s==='string')&&Array.isArray(p.tasks)&&p.tasks.every(t=>t&&typeof t.id==='string'&&typeof t.page==='string'&&Number.isFinite(t.count)&&Number.isFinite(t.minutes));})):{};
    const writing=object(data.writing)?Object.fromEntries(Object.entries(data.writing).filter(([,v])=>{const w=v as PreparationData['writing'][string];return w&&typeof w.text==='string'&&w.text.length<=4000&&Number.isFinite(Date.parse(w.updatedAt))&&Array.isArray(w.ratings)&&w.ratings.every(r=>Number.isInteger(r)&&r>=0&&r<30);})):{};
    return {...empty,profile,cards:cards as Record<string,CourseProgress>,updatedAt:data.updatedAt??empty.updatedAt,...Object.fromEntries(['grammar','hanzi','favorites','mistakeReasons'].map(k=>[k,object(data[k])?data[k]:{}])),plans:plans as Record<string,DailyPlan>,writing:writing as PreparationData['writing'],events:Array.isArray(data.events)?data.events.filter((e:LearningEvent)=>e&&typeof e.id==='string'&&Number.isFinite(Date.parse(e.at))&&Number.isFinite(e.count)&&e.count>=0).slice(-10000):[],diagnostics:Array.isArray(data.diagnostics)?data.diagnostics.slice(-30):[]};
  } catch { try {const raw=localStorage.getItem(storageKey);if(raw)localStorage.setItem(storageKey+'-corrupt-backup-'+Date.now(),raw);}catch{/* keep UI usable if quota is full */}return empty; }
}
export function writePreparation(data:PreparationData,storageKey=PREPARATION_KEY):boolean {try{localStorage.setItem(ownerStorageKey(storageKey),JSON.stringify(data));if(storageKey===PREPARATION_KEY)captureCloudRecords('preparation',data);return true;}catch{return false;}}
export function usePreparation(storageKey=PREPARATION_KEY) {
  const [state,setState]=useState(()=>readPreparation(storageKey));const ref=useRef(state);ref.current=state;
  const [error,setError]=useState(false);
  const commit=useCallback((update:(previous:PreparationData)=>PreparationData)=>{const next={...update(ref.current),updatedAt:new Date().toISOString()};ref.current=next;setState(next);setError(!writePreparation(next,storageKey));},[storageKey]);
  useEffect(()=>{const listener=(e:StorageEvent)=>{if(e.key===ownerStorageKey(storageKey)){const incoming=readPreparation(storageKey);ref.current=incoming;setState(incoming);}};window.addEventListener('storage',listener);return()=>window.removeEventListener('storage',listener);},[storageKey]);
  return {state,commit,error};
}
export function learningEvent(kind:LearningEvent['kind'],entityId:string,count=1,minutes=0):LearningEvent {return{id:crypto.randomUUID(),kind,entityId,count,minutes,at:new Date().toISOString()};}
export function localDay(date=new Date()):string{return`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function freshCourseCard(id:string,level:string):CourseProgress {return{id,level,learned:false,intervalDays:0,easeFactor:2.5,repetitions:0,reviewCount:0,dueAt:new Date().toISOString(),updatedAt:new Date().toISOString()};}
