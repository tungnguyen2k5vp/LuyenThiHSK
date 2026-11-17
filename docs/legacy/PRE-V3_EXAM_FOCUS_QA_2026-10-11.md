# LEGACY / PRE-V3 — không dùng làm trạng thái hiện hành

Nguồn trạng thái: ../CURRENT_STATE.md.

# Kiểm tra bản tập trung luyện thi — 11/10/2026

> Đây là bản ghi QA lịch sử trước khi dashboard và từ vựng cá nhân được khôi phục/mở rộng ngày 15/10/2026. Kiểm tra hiện hành và ảnh mới được ghi trong `FINAL_IMPLEMENTATION_REPORT.md` và `docs/screenshots/exam-focus`.

## Kết quả

- TypeScript: PASS (`npm run typecheck`, đồng thời trong build).
- Nội dung: PASS (`npm run check:content`): 3 ngân hàng gốc, 20 câu duy nhất, 0 đề đầy đủ đủ điều kiện. ID tám gói cũ giữ để đọc lịch sử.
- Logic: PASS (`npm test`): chấm khách quan/nhập văn bản, đáp án A/B cũ, tự luận không chấm sai, nhóm kết quả không đếm trùng, mẫu số, hạn giờ, migration, dữ liệu lỗi/quota, quyền nguồn và chặn đề thiếu cấu trúc; quy tắc điều hướng theo phần.
- Build: PASS (`npm run build`). Đã gỡ module cũ và lucide-react; không còn import/route tới từ vựng hoặc dashboard.
- Chrome: PASS (`npm run test:browser`, cũng chạy trong `npm run report:web`): bốn menu; lọc URL/reload/back; âm thanh trước tính giờ, lỗi/tạm dừng/khôi phục; ẩn bản chép nghe; tự lưu/tiếp tục giữ deadline; hết giờ nộp một lần; hạn giờ theo phần, chuyển phần/khóa quay lại/giữ hạn khi reload; lời giải luyện; tự luận và IME; lịch sử xóa từng lượt; ôn riêng phiên bản; mobile 375px không tràn trang, panel câu; offline reload. Không phát hiện ngoại lệ runtime không xử lý.
- Không có script lint trong package.json.
- HTTP preview: 200 tại http://127.0.0.1:4173. Server chạy nền, log trong `.runtime`.

## Bằng chứng và giới hạn

Ảnh desktop 1280 × 900 và mobile 375 × 812 trong `docs/screenshots/exam-focus`. Báo cáo Word mới: `docs/BAO_CAO_LUYEN_THI_HSK_2026-10-11.docx`. Dữ liệu kiểm thử được tạo trong profile Chrome tạm riêng, không tác động dữ liệu người dùng.

Audio dùng speech double để tái hiện lỗi/thành công một cách ổn định. Kiểm tra này xác nhận logic giao diện/tạm dừng; không xác nhận chất lượng giọng thật của từng hệ điều hành. Panel mobile kiểm tra trong Chrome giả lập viewport, chưa phải mọi điện thoại vật lý.

Tham chiếu thông số chính thức đã đối chiếu, nhưng chưa có bộ đề đầy đủ có quyền sử dụng, đủ câu/dạng/phần/audio và quy tắc được thẩm định. HSK 3.0 cấp 1–6 chưa hoàn tất xác minh. Website hiện hiển thị bài minh họa và trạng thái rỗng của đề đầy đủ một cách trung thực.
