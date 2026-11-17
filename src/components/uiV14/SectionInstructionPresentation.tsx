import {ListeningInstructionModal} from '../../ui-v14/components/intro/ListeningInstructionModal';
import {getExamConfig} from '../../services/examRules';
import type {ExamItem} from '../../types';
export default function SectionInstructionPresentation({exam,index,onConfirm,onExit}:{exam:ExamItem;index:number;onConfirm:()=>void;onExit:()=>void}){
 const section=getExamConfig(exam).sections[index];if(!section)return null;
 const questions=exam.questions.filter(q=>section.questionIds.includes(q.id)),parts=[...new Set(questions.map(q=>q.partId??q.type))].map((id,i)=>({partNumber:i+1,title:id,questionCount:questions.filter(q=>(q.partId??q.type)===id).length}));
 return <div className="hsk-ui-v14"><ListeningInstructionModal modal={{isOpen:true,title:'Hướng dẫn · '+section.label,policyLabel:`${section.questionIds.length} câu · ${section.durationMinutes} phút theo quy tắc nền tảng. Đồng hồ phần mới chỉ bắt đầu khi bạn xác nhận.`,parts,canTestAudio:false}} callbacks={{onClose:onExit,onConfirm}}/></div>;
}
