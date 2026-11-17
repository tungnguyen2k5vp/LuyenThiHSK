# V9 · Writing W2

lúc 13:13 Thứ Bảy, 17 tháng 10, 2026 (UTC+7) · Local / private. Nội dung chưa duyệt chuyên môn.

W1 6 câu component lựa chọn. W2 6 câu manual / UNSCORED_PRACTICE; không exact string grading, không đổi chưa chấm thành sai/0%. Kết quả tách đúng/sai/bỏ trống/chưa chấm. Tỷ lệ trên hub chỉ dùng câu chấm được.

Editor lớn8 dòng, min240px desktop/210px mobile, Unicode Hanzi/codepoint counter, multiline, composition events, native undo/redo. Không chiếm arrow keys trong textarea; input không đổi component khi autosave. Nút “Lưu câu trả lời” đối chiếu dữ liệu đã ghi thật; feedback “Đáp án đã được lưu. Bài này chưa được chấm tự động.” Có sample/rubric nội bộ sau lưu/submit. Không gửi bài viết cho bên thứ ba.

Chrome=PASS, Edge=PASS: nhập 中文 nhiều dòng qua browser input, mô phỏng compositionstart/end+ArrowRight, giữ focus qua autosave, chuyển câu/quay lại/reload khớp chính xác, kết quả3 manual chưa chấm/0 sai/accuracy null. Đây không phải kiểm tra bàn phím IME vật lý hay iOS thật. Màn editor ở6width không overflow, height≥200px. Undo/Redo qua Ctrl+Z/Y được kiểm bằng sự kiện bàn phím thật trên Chrome/Edge. Bàn phím mobile và IME vật lý chưa được kiểm trên thiết bị thật. [Ảnh](SCREENSHOT_GALLERY.html), [unit](../../data/reports/v9/unit-tests.json).
