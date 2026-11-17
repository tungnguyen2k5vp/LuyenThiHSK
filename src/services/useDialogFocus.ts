import {useEffect,useRef} from 'react';
export function useDialogFocus(open:boolean,selector:string,onClose:()=>void){
 const close=useRef(onClose);close.current=onClose;
 useEffect(()=>{if(!open)return;const previous=document.activeElement as HTMLElement|null,root=document.querySelector<HTMLElement>(selector);if(!root)return;
 const items=()=>[...root.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex="0"]')].filter(e=>e.getClientRects().length);items()[0]?.focus();
 const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();close.current();}if(e.key==='Tab'){const list=items(),first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};root.addEventListener('keydown',key);return()=>{root.removeEventListener('keydown',key);if(previous?.isConnected)previous.focus({preventScroll:true});};
 },[open,selector]);
}
