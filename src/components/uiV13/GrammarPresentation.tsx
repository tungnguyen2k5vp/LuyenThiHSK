import type {GrammarCatalogProps} from '../../contracts/ui-v13';
import {GrammarCatalogView} from '../../ui-v13/components/grammar/GrammarCatalogView';
import '../../ui-v13/styles/index.css';
import '../../styles/ui-v13-integration.css';
export default function GrammarPresentation(p:GrammarCatalogProps){
 if(p.state.status!=='ready')return <p role="status">{p.state.status==='loading'?p.state.label:p.state.status==='error'?p.state.message:p.state.description}</p>;
 const vm=p.state.data;
 return <div className="hsk-ui-v13"><GrammarCatalogView manageReader={false} model={{level:'HSK '+vm.meta.level,totalCount:vm.totalTaxonomy,masteredCount:vm.masteredCount??null,searchQuery:vm.query,contentStatus:vm.meta.content.published?'PUBLISHED':'NEEDS_REVIEW',lessons:vm.items.map(g=>({id:g.id,code:'HSK'+vm.meta.level+'-G'+g.id.slice(-5),title:g.title,level:'HSK '+vm.meta.level,structure:g.pattern,explanation:g.meaningVi,examples:[],masteryLevel:g.evidence.mastered?'mastered':g.read?'learning':'none',practiceQuestionCount:g.independentCount,contentStatus:g.content.published?'PUBLISHED':'NEEDS_REVIEW',sourceNotice:g.hasLesson?'Bài học nháp chờ duyệt':'Mục lục syllabus; bài học chưa hoàn thiện'}))}} callbacks={{onSearchChange:q=>void p.onQueryChange(q),onSelectLesson:id=>{if(vm.items.some(g=>g.id===id))void p.onOpenLesson(id);},onStartPractice:()=>{}}}/></div>;
}
