import { useCallback, useEffect, useRef, useState } from 'react';
function tabOwner(){try{let id=sessionStorage.getItem('hsk-tab-owner');if(!id){id=crypto.randomUUID();sessionStorage.setItem('hsk-tab-owner',id);}return id;}catch{return crypto.randomUUID();}}
export function useSessionLease(sessionId:string){
  const owner=useRef(tabOwner());const key='hsk-session-lease:'+sessionId;
  const claim=useCallback((force=false)=>{try{const old=JSON.parse(localStorage.getItem(key)??'null');if(!force&&old&&old.owner!==owner.current&&old.expires>Date.now())return false;localStorage.setItem(key,JSON.stringify({owner:owner.current,expires:Date.now()+15000}));return true;}catch{return true;}},[key]);
  const [owned,setOwned]=useState(()=>claim());
  useEffect(()=>{const check=()=>{try{const current=JSON.parse(localStorage.getItem(key)??'null');if(current?.owner===owner.current||!current||current.expires<=Date.now())setOwned(claim());else setOwned(false);}catch{setOwned(true);}};check();const interval=setInterval(check,5000);const listener=(e:StorageEvent)=>{if(e.key===key)check();};window.addEventListener('storage',listener);return()=>{clearInterval(interval);window.removeEventListener('storage',listener);};},[claim,key]);
  return{owned,takeOver:()=>{claim(true);location.reload();}};
}
