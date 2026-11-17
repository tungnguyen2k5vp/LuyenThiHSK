# Question bank quality

Evidence machine-readable: `data/reports/v14/content-audit.json`, `hsk1-quality-audit.json`. Các bản này đọc main DB readonly và gọi current services trên SQLite clone; không sửa payload/notes/flags.

681 câu trong declared editorial release scope:435 HSK1 +246 HSK2. Registry validation không có lỗi cấu trúc trên681 câu. Điều đó không chứng minh đáp án duy nhất, tiếng Trung tự nhiên hay cấp độ đã được giáo viên duyệt.

HSK1 base bundle396 câu được chạy lại auditV7 với level-screening đã lưu:0 structural-error questions,199 flagged questions. 39 câu supplement nằm trong total435 và được registry/diagnostics chung kiểm tra; không gộp audit coverage396 thành một claim chuyên môn435. Không tự resolve bất kỳ flag nào.

HSK2:116 part +130 grammar questions;206 playable trong private practice gồm194 objective và12 manual.40 listening questions chưa có media đủ gate. Parts/duplicate/near-duplicate/answer positions, explanation và metadata coverage có trong content-audit; findings là hàng đợi review, không tự xóa hoặc đổi đáp án.

Evidence được tách: source provenance/mapping/format nếu chưa có attestation độc lập thì count=null, không dựng0 hoặc lấy toàn bộ câu từ một format template rồi gọi verified. Rights-cleared/human-reviewed/published/exam-suitable có attestation mới V14:0. Automated schema validity không cộng sang human approval.

Chưa cải biên hàng loạt explanations khi chưa xác nhận quality findings, tránh tạo thêm nội dung AI để lấp số lượng. Không nhập kho đề premium hoặc thay historical revisions.
