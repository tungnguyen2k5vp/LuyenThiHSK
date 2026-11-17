import {uiV15Feature} from '../../services/uiV14Feature';
import '../../styles/ui-v15-polish.css';
import type {ExamItem} from '../../types';import type {CompletedAttempt} from '../../services/studyStorage';
import {examResultView} from '../../adapters/ui-v14/exam';
import {ResultPageViewV14} from '../../ui-v14/components/result/ResultPageViewV14';
import type {ResultPageViewVM} from '../../ui-v14/types/viewmodels';
import '../../ui-v14/styles/index.css';import '../../styles/ui-v14-integration.css';
export default function ResultPresentation({exam,attempt,onBack,onRetake}:{exam:ExamItem;attempt:CompletedAttempt;onBack:()=>void;onRetake:()=>void}){
 const vm=examResultView(exam,attempt).result;
 const data:ResultPageViewVM={examId:exam.id,title:exam.title,durationSeconds:vm.durationSeconds,accuracyPercent:vm.accuracyPercent,passingScore:null,userScore:null,isPassed:null,counts:{...vm.counts},sections:vm.sections.map(s=>({skill:s.skill,label:{listening:'Nghe',reading:'Đọc',writing:'Viết',speaking:'Nói',translation:'Dịch',all:'Tổng hợp'}[s.skill],correctCount:s.correct,totalCount:s.gradedCount,accuracyPercent:s.accuracyPercent})),questions:[]};
 return <div className={'hsk-ui-v14 v14-result-host '+(uiV15Feature(location.search)?'hsk-ui-v15':'')} data-v14-batch="result"><ResultPageViewV14 summaryOnly data={data} callbacks={{onBackToCatalog:onBack,onRetryExam:onRetake}}/></div>;
}
