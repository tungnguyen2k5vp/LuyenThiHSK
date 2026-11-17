import {readFile,writeFile} from 'node:fs/promises';
const edits={
 'server/v5-content-service.mjs':[["rows:rows.slice(page*20,page*20+20),progress:","rows:rows.slice(page*20,page*20+20).map(r=>({...r,sourceFingerprint:previewFingerprint(r.payload),workVersion:digest(work.find(w=>w.entity_id===r.id&&w.revision===r.revision)??null)})),progress:"]],
 'src/components/admin/ContentReviewV5.tsx':[
  ["type Row={id:string;revision:number;kind:string;status:string;payload:Payload;work:","type Row={id:string;revision:number;kind:string;status:string;payload:Payload;sourceFingerprint:string;workVersion:string;work:"],
  ["const openSerial=useRef(0);","const checkedRows=useRef(new Map<string,Row>());\n const openSerial=useRef(0);"],
  ["'V8 · nội dung V6'","'V9 · nội dung V6–V9'"],
  ["await api(version+'/assign',{ids:checked,assignee});","if(version==='v6')await api('v9/assign',{items:checked.map(id=>{const r=checkedRows.current.get(id);return{id,revision:r?.revision,sourceFingerprint:r?.sourceFingerprint,workVersion:r?.workVersion};}),assignee});else await api(version+'/assign',{ids:checked,assignee});checkedRows.current.clear();setChecked([]);"],
  ["onChange={e=>setChecked(ids=>e.target.checked?[...ids,r.id]:ids.filter(id=>id!==r.id))}","onChange={e=>{if(e.target.checked)checkedRows.current.set(r.id,r);else checkedRows.current.delete(r.id);setChecked(ids=>e.target.checked?[...ids,r.id]:ids.filter(id=>id!==r.id));}}"],
  ["version==='v6'&&selected.kind==='questions'&&payload.skill==='listening'&&<AudioReplacement","version==='v6'&&payload.editorialRelease==='v6-hsk1'&&selected.kind==='questions'&&payload.skill==='listening'&&<AudioReplacement"],
 ],
};
const apply=process.argv.includes('--apply');for(const [file,pairs]of Object.entries(edits)){let source=await readFile(file,'utf8');for(const [before,after]of pairs){if(!source.includes(before))throw Error('Expected source missing '+file);source=source.replace(before,after);}if(apply)await writeFile(file,source);console.log(JSON.stringify({file,edits:pairs.length,dryRun:!apply}));}
