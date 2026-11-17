import {uiV15Feature} from '../../services/uiV14Feature';
import '../../styles/ui-v15-polish.css';
import type {ExamQuestion} from '../../types';
import type {AudioPlayerVM,ListeningDialogueVM,ListeningImageChoiceVM,ListeningMatchingVM,ListeningTrueFalseVM} from '../../ui-v14/types/viewmodels';
import {ListeningDialogue} from '../../ui-v14/components/question/ListeningDialogue';
import {ReadingPassageQuestion} from '../../ui-v14/components/question/ReadingPassageQuestion';
import {ListeningImageChoice} from '../../ui-v14/components/question/ListeningImageChoice';
import {ListeningMatching} from '../../ui-v14/components/question/ListeningMatching';
import {ListeningTrueFalse} from '../../ui-v14/components/question/ListeningTrueFalse';
import {ImageAssetView} from '../exam/QuestionTypeRenderer';
interface Props {question:ExamQuestion;answer:string;readOnly?:boolean;onAnswer:(raw:string)=>void}
/** Pure Gemini presentations around the existing authenticated image/audio owners. No keys are projected. */
export default function QuestionPresentation({question:q,answer,readOnly=false,onAnswer}:Props){
 const audio:AudioPlayerVM={id:q.id,state:'unavailable',currentSeconds:0,durationSeconds:0,volume:1,canPause:false,reason:'Player được owner hiển thị riêng.'};
 const choose=(id:string)=>{if(!readOnly&&q.options.some(o=>o.id===id))onAnswer(id)};
 const image=(id:string)=>{const o=q.options.find(o=>o.id===id);return o?.image?<ImageAssetView image={o.image}/>:<span lang="zh-CN">{o?.text}</span>};
 const common={id:q.id,questionNumber:q.number,partTitle:q.partId??'',instruction:q.instruction,audio,isReadOnly:readOnly,explanation:null};
 const yes=q.options.find(o=>['Đúng','对','正确','✓'].includes(o.text.trim())),no=q.options.find(o=>['Sai','错','错误','✕','×'].includes(o.text.trim()));
 if((q.type==='true-false'||q.type==='picture-true-false')&&yes&&no){
  const data:ListeningTrueFalseVM={...common,selectedAnswer:answer===yes.id?true:answer===no.id?false:null};
  return <div className={'hsk-ui-v14 v14-native-question '+(uiV15Feature(location.search)?'hsk-ui-v15':'')} data-question-type={q.type}><ListeningTrueFalse hideAudio data={data} imageContent={q.image?<ImageAssetView image={q.image}/>:undefined} onAnswer={value=>choose(value?yes.id:no.id)}/></div>;
 }
 if(q.options.some(o=>o.image)&&q.optionBankId){
  const data:ListeningMatchingVM={id:q.groupId??q.id,questionRange:'Câu '+q.number,partTitle:q.partId??'',instruction:q.instruction,sharedImages:q.options.map(o=>({id:o.id,label:o.id,imageUrl:'',alt:o.image?.altText??o.text})),subQuestions:[{id:q.id,subNumber:q.number,audio,selectedOptionId:answer||null}],isReadOnly:readOnly,explanation:null};
  return <div className={'hsk-ui-v14 v14-native-question '+(uiV15Feature(location.search)?'hsk-ui-v15':'')} data-question-type={q.type}><p className="bank-hint">Nhóm lựa chọn dùng chung · thứ tự và revision giữ nguyên trong snapshot.</p><ListeningMatching hideAudio renderImage={image} data={data} onAnswerSubQuestion={(id,value)=>{if(id===q.id)choose(value)}}/></div>;
 }
 if(q.options.some(o=>o.image)){
  const data:ListeningImageChoiceVM={...common,options:q.options.map(o=>({id:o.id,label:o.id,imageUrl:'',alt:o.image?.altText??o.text,isSelected:answer===o.id})),selectedOptionId:answer||null};
  return <div className={'hsk-ui-v14 v14-native-question '+(uiV15Feature(location.search)?'hsk-ui-v15':'')} data-question-type={q.type}><ListeningImageChoice hideAudio renderImage={image} data={data} onAnswer={choose}/></div>;
 }
 const data:ListeningDialogueVM={...common,options:q.options.map(o=>({id:o.id,label:o.id,hanzi:o.text,pinyin:q.pinyinIsExamContent?o.pinyin:undefined,isSelected:answer===o.id})),selectedOptionId:answer||null};
 if(uiV15Feature(location.search)&&q.skill==='reading')return <div className="hsk-ui-v14 hsk-ui-v15 v14-native-question" data-question-type={q.type} data-v15-reading="true">{q.image&&<ImageAssetView image={q.image}/>}<ReadingPassageQuestion data={{...common,options:data.options,selectedOptionId:answer||null}} onAnswer={choose}/></div>;
 return <div className={'hsk-ui-v14 v14-native-question '+(uiV15Feature(location.search)?'hsk-ui-v15':'')} data-question-type={q.type}>{q.optionBankId&&<p className="bank-hint">Nhóm lựa chọn dùng chung · thứ tự cố định trong bài này.</p>}{q.image&&<ImageAssetView image={q.image}/>}<ListeningDialogue hideAudio data={data} onAnswer={choose}/></div>;
}
