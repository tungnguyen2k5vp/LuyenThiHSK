import {validateRecord} from '../server/content-contract.mjs';
export function validateV8Authoring(kind,p,{words=[],grammar=[]}={}){const errors=validateRecord(kind,p);if(kind==='questions'){
 const wordIndex=new Map(words.map(w=>[w.id,w])),grammarIndex=new Map(grammar.map(g=>[g.id,g]));
 for(const id of p.vocabularyIds??[]){const row=wordIndex.get(id);if(!row)errors.push('UNKNOWN_VOCABULARY:'+id);else if(Number(row.level)>Number(p.level))errors.push('WRONG_LEVEL_VOCABULARY:'+id);}
 for(const id of p.grammarIds??[]){const row=grammarIndex.get(id);if(!row)errors.push('UNKNOWN_GRAMMAR:'+id);else if(Number(row.level)>Number(p.level))errors.push('WRONG_LEVEL_GRAMMAR:'+id);}
 const grammarNotApplicable=p.partId==='W1'&&p.contentMeta?.grammarLinkStatus==='NOT_APPLICABLE_CHARACTER_COMPONENT'||p.partId==='W2'&&p.scoring==='manual'&&p.contentMeta?.grammarLinkStatus==='NOT_APPLICABLE_CHARACTER_RECALL';
 if(!p.vocabularyIds?.length||!p.grammarIds?.length&&!grammarNotApplicable)errors.push('REFERENCES_REQUIRED');
 }return{errors,automatedValid:errors.length===0,mediaAvailable:p.skill!=='listening'||Boolean(p.audio?.src),semanticStatus:'NEEDS_HUMAN_REVIEW',rightsStatus:p.licenseStatus??'UNKNOWN'};}
