// Isolated foundation for future authenticated sync. No network or active cloud migration.
// Merge immutable attempts by ID; conflicting copies remain separate and visible.
import {digest} from './v5-quality.mjs';
export function mergeGuestProgress(account,guest,{ownerId,consent}){
 if(!consent||!ownerId||typeof ownerId!=='string')throw Error('Authenticated owner and explicit merge consent required');
 if(account.ownerId&&account.ownerId!==ownerId||guest.contentEnvironment==='PREVIEW')throw Error('Owner mismatch or private Preview input');
 const attempts=new Map(),conflicts=[];for(const item of [...(account.attempts??[]),...(guest.attempts??[])]){if(!item?.id||item.examSnapshot?.contentEnvironment==='PREVIEW')continue;const previous=attempts.get(item.id);if(previous&&digest(previous)!==digest(item)){const conflictId=item.id+'-conflict-'+digest(item).slice(0,12);attempts.set(conflictId,{...item,id:conflictId,conflictOf:item.id});conflicts.push(item.id);}else attempts.set(item.id,item);}
 const cards={...(account.cards??{})};for(const [id,incoming]of Object.entries(guest.cards??{})){const current=cards[id];if(!incoming?.dueAt||!Number.isFinite(Date.parse(incoming.updatedAt)))continue;if(!current||Date.parse(incoming.updatedAt)>Date.parse(current.updatedAt))cards[id]=incoming;}
 return{schemaVersion:1,ownerId,attempts:[...attempts.values()].sort((a,b)=>a.id.localeCompare(b.id)),cards,conflicts:[...new Set(conflicts)].sort(),publicationChanges:0,note:'No mastery inference, review approval, or Preview-to-production promotion'};
}
