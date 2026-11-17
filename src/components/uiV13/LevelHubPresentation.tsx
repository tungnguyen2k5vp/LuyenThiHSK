import type {LevelHubProps} from '../../contracts/ui-v13';
import {LevelHubView} from '../../ui-v13/views/LevelHubView';
import '../../styles/ui-v13-integration.css';
export default function LevelHubPresentation({state,onNavigate,onRetry}:LevelHubProps){
 if(state.status==='loading')return <p role="status">{state.label}</p>;
 if(state.status==='error')return <section role="alert"><p>{state.message}</p>{state.retryable&&<button onClick={()=>void onRetry()}>Thử lại</button>}</section>;
 if(state.status==='empty')return <p>{state.description}</p>;
 const vm=state.data,count=(id:string)=>vm.counters.find(c=>c.id===id)?.value??0;
 return <LevelHubView allowedEditions={['hsk3']} model={{activeEdition:'hsk3',noticeBanner:'HSK 3.0 · syllabus 2025. Danh mục hiện tại của cấp; không phải số tích lũy. Nội dung luyện do nền tảng biên soạn và chờ duyệt.',levels:[{id:vm.meta.level,levelCode:'HSK '+vm.meta.level,title:vm.title,categoryLabel:'Cấp đang học',vocabCount:count('words'),grammarPointsCount:count('taxonomy'),audioStatus:count('listening')?'PREVIEW_ONLY':'UNAVAILABLE',audioNotice:count('listening')?`${count('listening')} câu nghe có thể luyện riêng; không suy ra Official.`:'Chưa có câu nghe với audio khả dụng.',contentStatus:vm.meta.content.published?'PUBLISHED':'NEEDS_REVIEW',isAvailableForPractice:vm.actions.some(a=>a.id==='practice'&&a.availability.available),isFullMockReady:vm.mock.privatePracticeReady,description:vm.mock.privatePracticeReady?'Bài luyện riêng theo publication gate hiện tại.':'Bài luyện theo phần. Full Mock còn thiếu điều kiện media và duyệt chuyên môn.'}]}} callbacks={{onSelectLevel:id=>{if(id===vm.meta.level){const a=vm.actions.find(a=>a.id==='practice');if(a?.availability.available)void onNavigate(a.command);}},onSwitchEdition:()=>{}}}/>;
}
