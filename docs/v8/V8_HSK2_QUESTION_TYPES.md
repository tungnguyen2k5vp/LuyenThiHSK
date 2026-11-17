# V8 · Renderer và chính sách chấm HSK2

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

Dùng chung registry, QuestionTypeRenderer, ExamRoom, study storage và AttemptResult. Picture/matching/shared options giữ snapshot ngân hàng cố định. W1 dùng lựa chọn thành phần chữ, cần chuyên gia kiểm glyph/diễn đạt/accessibility; không giả là viết tay đã chấm.

W2 short-answer có textarea Hanzi, max4000, không tự lấy phím mũi tên khi nhập/IME; pinyin là dữ kiện đề. Gắn scoring=manual, sampleAnswer/expected answer và rubric. UNSCORED_PRACTICE: không so sánh chuỗi rồi công bố điểm thi.

E2E kiểm R2,W1,W2, nhập喝, autosave, reload, submit và kết quả chưa chấm. Kết quả part phân biệt correct/incorrect/blank/ungraded, không hiện0/3 như điểm tự động cho part manual. Ba metadata keys được sửa bằng revision mới sau kiểm tra pipeline đã lưu, không chỉ kiểm staging JSON.
