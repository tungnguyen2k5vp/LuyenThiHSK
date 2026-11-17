import {uiV15Feature} from '../../services/uiV14Feature';
import '../../styles/ui-v15-polish.css';
import {ExplanationAccordion} from '../../ui-v14/components/question/ExplanationAccordion';
import {explanationTabs,type RoomSnapshot} from '../../adapters/ui-v14/exam';
import {usePreviewContent} from '../../services/previewContent';
import type {EnhancedExplanationVM} from '../../ui-v14/types/viewmodels';
export default function FeedbackPresentation({snapshot}:{snapshot:RoomSnapshot}){
 const preview=usePreviewContent(),q=snapshot.exam.questions[snapshot.session.currentIndex];
 if(!q)return null;const vm=explanationTabs(snapshot,q);if(!vm.permitted||!vm.feedback)return null;
 const words=[...(preview?.bundle.words??[]),...(preview?.bundle.referenceWords??[])],keywords=vm.feedback.relatedWordIds.flatMap(id=>{const word=words.find(w=>w.id===id);return word?[{word:word.simplified,pinyin:word.pinyin,meaning:word.primaryMeaningVi??word.meaningVi}]:[]});
 const data:EnhancedExplanationVM={answerLabel:q.scoring==='manual'?'Bài chưa chấm · gợi ý đối chiếu:':'Đáp án luyện tập:',correctOptionId:q.options.some(o=>o.id===vm.feedback!.solutionText)?vm.feedback.solutionText??'':'',correctSolutionText:vm.feedback.solutionText??'',explanationText:vm.feedback.explanation,keywords,transcriptZh:vm.tabs.find(t=>t.id==='transcript')?.text??null,transcriptVi:vm.tabs.find(t=>t.id==='translation')?.text??null};
 return <div className={'hsk-ui-v14 v14-feedback-host '+(uiV15Feature(location.search)?'hsk-ui-v15':'')} data-v14-batch="feedback"><ExplanationAccordion key={q.id} explanation={data}/></div>;
}
