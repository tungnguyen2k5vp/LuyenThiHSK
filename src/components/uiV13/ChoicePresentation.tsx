import type {QuestionPresentationProps} from '../../contracts/ui-v13';
import {MultipleChoice} from '../../ui-v13/components/question/MultipleChoice';
import '../../ui-v13/styles/index.css';
import '../../styles/ui-v13-integration.css';
/** The exam owner still renders the prompt, media, feedback and check/submit controls. */
export default function ChoicePresentation(p:Pick<QuestionPresentationProps,'state'|'onChoose'>){
 if(p.state.status!=='ready')return <p role="status">Đang tải lựa chọn…</p>;
 const q=p.state.data;
 return <div className="hsk-ui-v13"><MultipleChoice options={q.options} readOnly={q.readOnly} onChoose={id=>{if(!q.readOnly&&q.options.some(o=>o.id===id&&!o.disabled))void p.onChoose(id);}}/></div>;
}
