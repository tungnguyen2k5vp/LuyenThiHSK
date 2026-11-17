import type {TodayProps,NavigationCommand} from '../../contracts/ui-v13';
import {geminiToday} from '../../adapters/ui-v13/geminiToday';
import {TodayWorkspaceView} from '../../ui-v13/views/TodayWorkspaceView';
import '../../styles/ui-v13-integration.css';
export default function TodayPresentation({state,onNavigate,onRetry,onSkipTask}:TodayProps){
 if(state.status==='loading')return <p role="status">{state.label}</p>;
 if(state.status==='error')return <section role="alert"><p>{state.message}</p>{state.retryable&&<button onClick={()=>void onRetry()}>Thử lại</button>}</section>;
 if(state.status==='empty')return <section><h2>{state.title}</h2><p>{state.description}</p></section>;
 const vm=state.data,go=(c:NavigationCommand|null)=>{if(c)void onNavigate(c);},task=(id:string)=>{const t=vm.tasks.find(t=>t.id===id);if(t?.action.availability.available)go(t.action.command);};
 return <TodayWorkspaceView model={geminiToday(vm)} callbacks={{onStartPrimaryAction:()=>go(vm.primary?.availability.available?vm.primary.command:{kind:'page',page:'practice',level:vm.meta.level}),onStartTask:task,onReviewTask:task,onSkipTask:id=>{if(vm.tasks.some(t=>t.id===id&&!t.skipped))void onSkipTask(id);},onOpenSettings:()=>go({kind:'page',page:'settings',level:vm.meta.level}),onOpenProgressDetails:()=>go({kind:'page',page:'history',level:vm.meta.level}),onOpenWeaknessReview:()=>go(vm.weakness?.action?.command??{kind:'page',page:'practice',level:vm.meta.level}),onOpenVocabWorkspace:()=>go({kind:'page',page:'vocabulary',level:vm.meta.level})}}/>;
}
