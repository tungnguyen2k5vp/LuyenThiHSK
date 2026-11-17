import type {ResultProps} from '../../contracts/ui-v13';
import {ResultSummaryCard} from '../../ui-v13/components/result/ResultSummaryCard';
import {ResultSkillBreakdown} from '../../ui-v13/components/result/ResultSkillBreakdown';
import '../../ui-v13/styles/index.css';
import '../../styles/ui-v13-integration.css';
export default function ResultPresentation(p:ResultProps){
 if(p.state.status!=='ready')return <p role="status">{p.state.status==='loading'?p.state.label:p.state.status==='error'?p.state.message:p.state.description}</p>;
 return <div className="hsk-ui-v13"><div className="hsk-result-workspace"><ResultSummaryCard model={p.state.data}/><ResultSkillBreakdown sections={p.state.data.sections}/><p>{p.state.data.officialReadiness.reason}</p></div></div>;
}
