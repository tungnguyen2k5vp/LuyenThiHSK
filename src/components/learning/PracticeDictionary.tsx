import {useEffect,useState} from 'react';
import {shortMeaning} from '../../services/lexicalPresentation';
import { fetchData, wordMatches } from '../../services/curriculum';
import {applyLearningSupplement} from '../../services/learningSupplement';
import type {CourseWord,LearningSupplement} from '../../types/curriculum';
export function PracticeDictionary(){
 const [open,setOpen]=useState(false),[level,setLevel]=useState('1'),[query,setQuery]=useState(''),[words,setWords]=useState<CourseWord[]>([]),[error,setError]=useState('');
 useEffect(()=>{if(!open)return;let live=true;setWords([]);setError('');Promise.all([fetchData<CourseWord[]>('/data/hsk3-2025-'+level+'-words.json'),fetchData<LearningSupplement>('/data/learning/level-'+level+'.json').catch(()=>null)]).then(([words,extra])=>{if(live)setWords(extra?applyLearningSupplement(words,[],[],extra).words:words);}).catch(e=>{if(live)setError(e.message);});return()=>{live=false;};},[open,level]);
 return <details className="practice-dictionary" onToggle={e=>setOpen(e.currentTarget.open)}><summary>Tra từ khi luyện tập</summary><label>Cấp bộ từ<select value={level} onChange={e=>setLevel(e.target.value)}>{['1','2','3','4','5','6','7-9'].map(l=><option value={l} key={l}>HSK {l}</option>)}</select></label><input type="search" aria-label="Tra từ trong bài luyện" value={query} placeholder="Dán hoặc nhập từ cần tra" onChange={e=>setQuery(e.target.value)}/>{query&&words.filter(w=>wordMatches(w,query)).slice(0,5).map(w=><p key={w.id}><strong lang="zh">{w.simplified}</strong> · {w.pinyin} · {shortMeaning(w)||'Nghĩa Việt đang chờ rà soát'}{w.meaningSupplement&&<small> · Nghĩa bổ sung AI, chưa duyệt độc lập</small>}</p>)}{error&&<p role="alert">{error}</p>}</details>;
}
