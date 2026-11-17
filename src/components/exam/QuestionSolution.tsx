import { ExamQuestion } from '../../types';
import { isOpenQuestion, resolveAnswer } from '../../services/examScoring';
import {QuestionTypeRenderer} from './QuestionTypeRenderer';
import {parseMatching} from '../../../shared/question-types.mjs';
import {ContentIssue} from './ContentIssue';
import {usePreviewContent} from '../../services/previewContent';
import {useState} from 'react';
import {uiV15Feature} from '../../services/uiV14Feature';
export function answerText(question: ExamQuestion, answer?: string): string {
  if(question.matching?.items&&answer)return Object.entries(parseMatching(answer)).map(([id,value])=>(question.matching?.items.find(i=>i.id===id)?.text??id)+' → '+(question.options.find(o=>o.id===value)?.text??value)).join(' · ');
  if (!answer?.trim()) return 'Bỏ trống';
  return question.options.find((option) => option.id === answer)?.text ?? resolveAnswer(question, answer);
}
export function QuestionSolution({ question, answer }: { question: ExamQuestion; answer?: string }) {
  const [showIllustration,setShowIllustration]=useState(false),refined=uiV15Feature(location.search);
  const preview=usePreviewContent();
  const words=[...new Map([...(preview?.bundle.referenceWords??[]),...(preview?.bundle.words??[])].map(w=>[w.id,w])).values()].filter(w=>question.vocabularyIds?.includes(w.id)).slice(0,8),lessons=[...new Map([...(preview?.bundle.referenceGrammar??[]),...(preview?.bundle.lessons??[])].map(g=>[g.grammarPointId??g.id,g])).values()].filter(g=>question.grammarIds?.includes(g.grammarPointId??g.id));
  return <div className="question-solution">
    <dl><dt>Câu trả lời của bạn</dt><dd lang="zh-CN">{answerText(question, answer)}</dd>
      <dt>{isOpenQuestion(question) ? 'Câu tham khảo / tự đánh giá' : preview||question.contentEnvironment==='PREVIEW'?'Đáp án luyện tập (chờ duyệt)':question.answerVerified?'Đáp án đã kiểm tra':'Đáp án từ nguồn · chưa duyệt độc lập'}</dt>
      <dd lang="zh-CN">{question.matching?.items?answerText(question,question.correctAnswer):question.sampleAnswer ?? question.acceptedAnswers?.join(' / ') ?? question.options.find((option) => option.id === question.correctOptionId)?.text ?? 'Chưa có đáp án chấm tự động'}</dd></dl>
    {question.explanation && <p>{question.explanation}</p>}
    {question.skill === 'listening' && <div className="listening-transcript"><strong>{question.audio?.transcript?'Bản chép lời · nghe và đọc theo':question.sourceType==='COMMUNITY'?'Nội dung câu hỏi':'Bản chép lời bài nghe'}</strong><p lang="zh-CN">{question.audio?.transcript??question.promptZh}</p>{question.promptPinyin && <p>{question.promptPinyin}</p>}</div>}
    {question.translationEn&&<p lang="en"><strong>Nghĩa Anh từ nguồn: </strong>{question.translationEn}</p>}
    {question.promptVi && <p><strong>Giải nghĩa: </strong>{question.promptVi}</p>}
    {question.rubric && <ul>{question.rubric.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul>}
    {preview&&<details><summary>Từ và cấu trúc cần ôn</summary><p>{words?.map(w=>w.simplified+' ('+w.pinyin+'): '+w.meaningVi).join(' · ')}</p>{lessons?.map(g=><p key={g.id}>{g.title??g.pattern} · {g.commonMistakes?.[0]}</p>)}<p>Đọc lại ngữ cảnh, kiểm tra chủ thể, thời gian và từ phủ định trước khi chọn đáp án.</p></details>}
    {(question.partId||question.image||question.matching)&&<details onToggle={e=>setShowIllustration(e.currentTarget.open)}><summary>Xem đáp án minh họa</summary>{(!refined||showIllustration)&&<QuestionTypeRenderer question={question} answer={question.correctOptionId??question.correctAnswer??''} onAnswer={()=>{}} readOnly/>}</details>}
    <ContentIssue question={question}/>
  </div>;
}
