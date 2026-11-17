import type {MistakeReviewProps} from '../../contracts/ui-v13';
import {MistakeReviewView} from '../../ui-v13/components/mistakes/MistakeReviewView';
import '../../ui-v13/styles/index.css';
import '../../styles/ui-v13-integration.css';
export default function MistakePresentation(p:MistakeReviewProps){
 if(p.state.status!=='ready')return <p role="status">{p.state.status==='loading'?p.state.label:p.state.status==='error'?p.state.message:p.state.description}</p>;
 const vm=p.state.data;
 return <div className="hsk-ui-v13"><MistakeReviewView model={vm} onReviewQuestion={id=>{if(vm.items.some(i=>i.reviewId===id&&i.reviewAvailability?.available))void p.onReviewQuestion?.(id);}}/></div>;
}
