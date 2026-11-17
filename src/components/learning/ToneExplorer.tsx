import {useState} from 'react';
import {speakChinese} from '../../services/curriculum';

// ponytail: four isolated-tone contours; add contextual examples when teaching tone sandhi.
const tones=[
 {pinyin:'mā',hanzi:'妈',meaning:'mẹ',name:'Thanh 1 · Cao, ngang',hint:'Giữ giọng cao và đều từ đầu đến cuối.',path:'M74 32 L326 32',color:'#18795c'},
 {pinyin:'má',hanzi:'麻',meaning:'cây gai; tê',name:'Thanh 2 · Đi lên',hint:'Bắt đầu ở khoảng giữa rồi nâng giọng lên cao.',path:'M74 96 L326 32',color:'#2a6e9b'},
 {pinyin:'mǎ',hanzi:'马',meaning:'ngựa',name:'Thanh 3 · Xuống rồi lên',hint:'Khi đọc riêng: hạ giọng xuống thấp rồi nâng lên. Trong câu, thanh 3 thường chỉ đọc thấp; hình dạng còn phụ thuộc ngữ cảnh và biến điệu.',path:'M74 104 L190 136 L326 64',color:'#97601b'},
 {pinyin:'mà',hanzi:'骂',meaning:'mắng',name:'Thanh 4 · Đi xuống',hint:'Bắt đầu cao rồi hạ giọng nhanh, dứt khoát.',path:'M74 32 L326 136',color:'#79529b'},
];

export function ToneExplorer(){
 const [index,setIndex]=useState(0),[replay,setReplay]=useState(0),[notice,setNotice]=useState('');
 const tone=tones[index];
 return <section className="tone-explorer" aria-labelledby="tone-title">
  <header className="tone-heading"><div><p className="eyebrow">NHÌN ĐƯỜNG NÉT · NGHE THANH ĐIỆU</p><h3 id="tone-title">Cùng một “ma”, bốn cách nói.</h3><p>Chọn một thanh để xem cao độ thay đổi và nghe chữ ví dụ.</p></div><span className="tone-heading-mark" aria-hidden="true">声</span></header>
  <div className="tone-options" role="group" aria-label="Chọn thanh điệu">{tones.map((item,i)=><button key={item.pinyin} type="button" aria-pressed={i===index} onClick={()=>{setIndex(i);setNotice('');}}><span>THANH {i+1}</span><strong lang="zh-Latn">{item.pinyin}</strong><small lang="zh-CN">{item.hanzi}</small></button>)}</div>
  <div className="tone-stage" style={{borderColor:tone.color+'40'}}>
   <div className="tone-example"><strong lang="zh-CN">{tone.hanzi}</strong><span lang="zh-Latn">{tone.pinyin}</span><span>{tone.meaning}</span></div>
   <svg key={index+'-'+replay} viewBox="0 0 360 180" role="img" aria-label={tone.name+'; đường cao độ minh họa'} className="tone-graph" style={{color:tone.color}}>
    <path d="M64 32H336M64 64H336M64 96H336M64 128H336" className="tone-grid"/>
    <text x="12" y="36">Cao</text><text x="12" y="134">Thấp</text><text x="74" y="170">Bắt đầu</text><text x="280" y="170">Kết thúc</text>
    <path d={tone.path} className="tone-trace" pathLength="1"/><circle cx="74" cy={index===0||index===3?32:index===1?96:104} r="5" fill="currentColor"/>
   </svg>
  </div>
  <div className="tone-caption" aria-live="polite"><h4>{tone.name}</h4><p>{tone.hint}</p></div>
  <div className="tone-actions"><button type="button" className="btn btn-primary" onClick={()=>{setNotice('');void speakChinese(tone.hanzi,.8).catch(e=>setNotice(e.message));}}>Nghe chữ {tone.hanzi} · giọng máy</button><button type="button" className="btn btn-secondary" onClick={()=>setReplay(n=>n+1)}>Xem lại đường nét</button></div>
  {notice&&<p role="status">{notice}</p>}
  <p className="tone-footnote">Cao độ được vẽ giản lược cho âm tiết đọc riêng, không đo hay chấm giọng nói. Thanh nhẹ và biến điệu cần học thêm trong ngữ cảnh.</p>
 </section>;
}
