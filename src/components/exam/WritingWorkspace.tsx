import {useState,lazy,Suspense} from 'react';
import type {ExamQuestion} from '../../types';
import {uiV13Feature} from '../../services/uiV13Feature';
import {writingView} from '../../adapters/ui-v13/exam';
const WritingPresentation=lazy(()=>import('../uiV13/WritingPresentation'));
export function WritingWorkspace({question,answer,onAnswer,readOnly,saveStatus}:{question:ExamQuestion;answer:string;onAnswer:(value:string)=>void;readOnly?:boolean;saveStatus?:string}){
 const [composing,setComposing]=useState(false),chars=Array.from(answer),hanzi=chars.filter(c=>/\p{Script=Han}/u.test(c)).length;
 if(uiV13Feature(location.search).enabled)return <section className="writing-workspace" data-question-type={question.type}><Suspense fallback={<p role="status">Đang tải vùng viết…</p>}><WritingPresentation writing={{...writingView(question,answer,{composing,saveState:'idle',saveLabel:saveStatus??'Bản nháp dùng cơ chế lưu hiện có',readOnly:Boolean(readOnly),error:null}),pinyinHint:question.pinyinIsExamContent?null:question.promptPinyin??null}} onInput={onAnswer} onCompositionStart={()=>setComposing(true)} onCompositionEnd={value=>{setComposing(false);onAnswer(value);}} onSave={()=>{if(!readOnly&&!composing)onAnswer(answer);}}/></Suspense></section>;
 return <section className="writing-workspace" data-question-type={question.type}>
  <div className="writing-heading"><h2>Vùng viết tiếng Trung</h2><span className="writing-status">Chưa chấm</span></div>
  <p className="writing-session-note">Viết theo yêu cầu của câu hỏi. Bạn có thể sửa lại bản nháp trước khi nộp.</p>
  {question.promptPinyin&&<p className="writing-pinyin">Pinyin gợi ý: <strong>{question.promptPinyin}</strong></p>}
  <label htmlFor={'writing-'+question.id}>Câu trả lời của bạn</label>
  <textarea id={'writing-'+question.id} lang="zh-CN" aria-describedby={'writing-help-'+question.id} value={answer} disabled={readOnly} rows={8} maxLength={4000} autoComplete="off" spellCheck={false} onKeyDown={e=>e.stopPropagation()} onCompositionStart={()=>setComposing(true)} onCompositionEnd={e=>{setComposing(false);onAnswer(e.currentTarget.value);}} onChange={e=>onAnswer(e.target.value)}/>
  <div className="writing-counter"><span>{hanzi} chữ Hán · {chars.length} ký tự</span>{composing&&<span>Đang nhập bằng IME…</span>}</div>
  {saveStatus&&<p className="writing-save-status" role="status">{saveStatus}</p>}
  <p id={'writing-help-'+question.id}>Nhập chữ Hán theo yêu cầu. Bạn có thể xuống dòng và dùng bàn phím tiếng Trung. Bản nháp tự lưu khi nhập; dùng “Lưu câu trả lời” để mở hướng dẫn đối chiếu.</p>
  <p className="writing-ungraded">Bài viết chưa chấm · Câu tham khảo và tự đánh giá không tạo điểm HSK.</p>
 </section>;
}
