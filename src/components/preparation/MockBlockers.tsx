export function MockBlockers({counts}:{counts:Record<string,number>}){return <ul className="mock-blocker-actions">{[
 ['missingAudio','Âm thanh còn thiếu','Thu hoặc tạo giọng có căn cứ quyền, kiểm PCM và gắn đúng transcript.'],
 ['imageRightsPending','Quyền ảnh chờ duyệt','Mở hồ sơ nguồn gốc, xác nhận phạm vi hoặc tạo revision thay thế.'],
 ['pronunciationPending','Phát âm chờ duyệt','Người có thẩm quyền nghe từng bản thu và ký quyết định.'],
 ['languagePending','Ngôn ngữ/đáp án chờ duyệt','Duyệt các câu thuộc bộ ứng viên trong Review Queue.'],
 ['levelPending','Cấp HSK chờ duyệt','Đối chiếu syllabus và xác nhận ánh xạ từng câu.'],
 ['manualWriting','Bài viết cần người chấm','Giữ chưa chấm; dùng rubric tự đối chiếu, không quy đổi điểm HSK.'],
 ['sourceVerificationPending','Quy tắc kỳ thi cần xác minh','Đối chiếu CTI; 52 phút/2 lượt nghe vẫn là quy định nền tảng.']
 ].map(([key,label,action])=><li key={key}><strong>{counts[key]??0} · {label}</strong><p>{action}</p></li>)}</ul>;}
