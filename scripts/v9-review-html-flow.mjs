import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import path from 'node:path';
export async function reviewHtmlFlow({rpc,evaluate,waitFor,screenshot}){
 await rpc('Page.navigate',{url:pathToFileURL(path.resolve('data/review-packages/v9/MO_DE_DUYET.html')).href});await waitFor('document.querySelectorAll("#list button").length===986');
 await evaluate('document.querySelector("#risk").click()');await waitFor('document.querySelectorAll("#list button").length===199');
 await evaluate('document.querySelector("#risk").click();const e=document.querySelector("#batch");e.value="A";e.dispatchEvent(new Event("change"))');await waitFor('document.querySelectorAll("#list button").length===20');
 await evaluate('document.querySelector("#batch").value="";document.querySelector("#level").value="2";document.querySelector("#kind").value="questions";document.querySelector("#kind").dispatchEvent(new Event("change"))');await waitFor('document.querySelectorAll("#list button").length===54');
 await evaluate('document.querySelector("#search").value="v9-hsk2-W2";document.querySelector("#search").dispatchEvent(new Event("input"))');await waitFor('document.querySelectorAll("#list button").length===3');
 const expected=await evaluate('({id:selected.id,revision:selected.revision,sourceFingerprint:selected.sourceFingerprint,workVersion:selected.workVersion})');
 const note='QA offline note only · 中文 <img src=x onerror=alert(1)>; not a human approval';await evaluate('document.querySelector("textarea").value='+JSON.stringify(note)+';document.querySelector("textarea").dispatchEvent(new Event("input"))');await rpc('Page.reload');await waitFor('document.querySelectorAll("#list button").length===986');
 await evaluate('document.querySelector("#search").value='+JSON.stringify(expected.id)+';document.querySelector("#search").dispatchEvent(new Event("input"))');await waitFor('document.querySelector("textarea").value==='+JSON.stringify(note));
 await evaluate('window.__v9Download=null;URL.createObjectURL=b=>{window.__v9Download=b;return "blob:qa-export"};HTMLAnchorElement.prototype.click=function(){};document.querySelector("#export").click()');const exported=await evaluate('window.__v9Download.text().then(JSON.parse)');assert.deepEqual(exported.items,[{...expected,notes:note,decision:'NOTED'}]);assert.equal(await evaluate('document.querySelector("#detail img")'),null);
 await screenshot('v9-offline-review-package');return{status:'PASS',records:986,flaggedFilter:199,batchA:20,hsk2:54,notesRestore:true,casExport:true,humanApproval:false};
}
