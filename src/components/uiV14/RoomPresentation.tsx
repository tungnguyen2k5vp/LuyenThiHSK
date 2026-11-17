import {uiV15Feature} from '../../services/uiV14Feature';
import '../../styles/ui-v15-polish.css';
import type {ReactNode} from 'react';
import {ExamRoomShell} from '../../ui-v14/components/exam/ExamRoomShell';
import type {ExamNavigatorVM,ExamTimerVM} from '../../ui-v14/types/viewmodels';
import {examRoomView,type RoomSnapshot} from '../../adapters/ui-v14/exam';
import '../../ui-v14/styles/index.css';
import '../../styles/ui-v14-integration.css';
interface Props {snapshot:RoomSnapshot;onNavigate:(index:number)=>void;onSubmitRequested:()=>void;onExit:()=>void;children:ReactNode}
export default function RoomPresentation({snapshot,onNavigate,onSubmitRequested,onExit,children}:Props){
 const vm=examRoomView(snapshot),nav=vm.navigator;
 const navigator:ExamNavigatorVM={activeSkill:vm.currentSkill,skills:vm.sectionProgress.map((sec,si)=>({skill:sec.skill,label:snapshot.exam.config?.sections[si]?.label??sec.skill,parts:nav.parts.filter(p=>p.sectionIndex===si).map((part,i)=>({partId:part.id,partNumber:i+1,title:part.label,completedCount:part.answered,totalCount:part.questionIds.length,questions:nav.items.filter(q=>part.questionIds.includes(q.questionId)).map(q=>({id:q.questionId,index:q.index,number:q.number,status:q.current?'current':q.flagged?'flagged':q.answered?'answered':'unanswered',isAllowed:q.availability.available}))}))}))};
 const timer:ExamTimerVM={remainingSeconds:vm.timer.remainingSeconds,totalDurationSeconds:snapshot.session.mode==='timed'?snapshot.exam.durationMinutes*60:null,isPaused:vm.timer.state==='paused',mode:snapshot.session.mode==='timed'?'mock':'practice',canSubmit:vm.canSubmit};
 const navigate=(index:number)=>{if(nav.items[index]?.availability.available)onNavigate(index)};
 return <div className={'hsk-ui-v14 v14-room-host '+(uiV15Feature(location.search)?'hsk-ui-v15':'')} data-v14-batch="room-navigator"><ExamRoomShell refined={uiV15Feature(location.search)} examTitle={snapshot.exam.title} mode={timer.mode} navigator={navigator} timer={timer} onSelectSkill={skill=>{const target=nav.items.find(q=>q.availability.available&&snapshot.exam.questions[q.index]?.skill===skill);if(target)navigate(target.index)}} onSelectQuestion={navigate} onSubmitExam={()=>{if(vm.canSubmit)onSubmitRequested()}} onBack={onExit}>{children}</ExamRoomShell></div>;
}
