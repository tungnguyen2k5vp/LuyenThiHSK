import type {PracticeHubProps} from '../../contracts/ui-v13';
import {PracticeHubView} from '../../ui-v13/components/practice/PracticeHubView';
import '../../ui-v13/styles/index.css';
import '../../styles/ui-v13-integration.css';
export default function PracticePresentation(p:PracticeHubProps){
 if(p.state.status!=='ready')return <p role="status">{p.state.status==='loading'?p.state.label:p.state.status==='error'?p.state.message:p.state.description}</p>;
 const vm=p.state.data;
 return <div className="hsk-ui-v13"><PracticeHubView model={vm} onStartPart={id=>{const part=vm.parts.find(p=>p.id===id);if(part?.action.availability.available)void p.onNavigate(part.action.command);}} onStartMixed={()=>{if(vm.mixed?.availability.available)void p.onNavigate(vm.mixed.command);}}/></div>;
}
