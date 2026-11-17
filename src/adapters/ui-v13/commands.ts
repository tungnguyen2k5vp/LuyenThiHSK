import type {CommandOutcome,NavigationCommand,CallbackResult,WritingCallbacks} from '../../contracts/ui-v13';
/** Capture no owner/data in a VM. Revalidate against the live owner for every UI event. */
export function commandDispatcher(port:{authorize:(c:NavigationCommand)=>boolean;execute:(c:NavigationCommand)=>CallbackResult}) {
 const pending=new Set<string>();
 return async (command:NavigationCommand):Promise<CommandOutcome>=>{
  if(!port.authorize(command))return {status:'rejected',message:'Thao tác không còn khả dụng.'};
  const key=JSON.stringify(command);if(pending.has(key))return {status:'ignored'};pending.add(key);
  try{const outcome=await port.execute(command);return outcome??{status:'applied'};}finally{pending.delete(key);}
 };
}
/** Owner supplies its existing durable/idempotent submit; this only coalesces UI events. */
export function submitCallback(port:{canSubmit:()=>boolean;submit:()=>CallbackResult}) {
 let busy=false;
 return async ():Promise<CommandOutcome>=>{if(busy)return {status:'ignored'};if(!port.canSubmit())return {status:'rejected'};busy=true;try{return (await port.submit())??{status:'applied'};}finally{busy=false;}};
}
/** Delegate raw text, including composition updates, to the single existing draft owner. */
export function writingCallbacks(port:{currentQuestionId:()=>string;questionId:string;readOnly:()=>boolean;input:(text:string)=>CallbackResult;composition:(active:boolean)=>void;save:()=>CallbackResult}):WritingCallbacks {
 const current=()=>port.currentQuestionId()===port.questionId&&!port.readOnly();
 return {onInput:value=>current()?port.input(value):{status:'rejected'},onCompositionStart:()=>{if(current())port.composition(true);},onCompositionEnd:value=>{if(!current())return {status:'rejected'};port.composition(false);return port.input(value);},onSave:()=>current()?port.save():{status:'rejected'}};
}
