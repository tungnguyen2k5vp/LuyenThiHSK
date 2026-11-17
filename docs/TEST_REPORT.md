# LEGACY / PRE-V2 — báo cáo lịch sử

Trạng thái hiện hành: [CURRENT_STATE.md](CURRENT_STATE.md).

# Báo cáo kiểm tra

Ngày kiểm tra triển khai: 08/10/2026. Nguồn học thuật được nghiên cứu theo mốc yêu cầu 07/10/2026.

## Lệnh và kết quả

| Lệnh | Kết quả |
| --- | --- |
| npm run typecheck | PASS, TypeScript không báo lỗi. |
| npm run check:content | PASS: 8 gói, 20 câu duy nhất, 18 từ; metadata nét chữ hợp lệ. |
| npm test | PASS: chấm câu khách quan/câu mở/bỏ trống; deadline/resume, giới hạn thời gian, round-trip storage, dữ liệu hỏng, quota, đáp án/rights sai. |
| npm run build | PASS: tsc + Vite production. |
| npm run test:browser | PASS trên Chrome headless, viewport desktop 1280×900 và mobile 375×812, profile tạm riêng. |
| lint | Không có script lint độc lập trong dự án; không báo đã chạy lint. |

## Các luồng được kiểm tra trong trình duyệt

- Chọn HSK 2.0 → thi có giờ → một câu đúng/một câu sai/ba câu bỏ trống → nộp/xác nhận → kết quả 1/1/3.
- Lời giải được giữ kín trong chế độ có giờ.
- Đáp án, cờ, câu hiện tại và deadline giữ nguyên sau reload/resume.
- Mở câu sai từ Tiến độ → kiểm tra đáp án → lời giải đúng, lịch ôn được cập nhật.
- Tìm từ theo tiếng Anh và pinyin không dấu; đánh dấu thuộc và giữ trạng thái khi reload.
- Tra nét chữ mẫu, phát hoạt ảnh.
- HSK 3.0 nhóm 7–9 → viết câu trả lời mở → tự đánh giá rubric → lưu câu trả lời và mức tự chấm sau reload.
- Deadline hết hạn khi resume → tự nộp đúng một lần; không phục hồi lại draft đã nộp.
- Lọc chủ đề; loại đề full hiển thị thiếu ngân hàng nội dung hợp lệ.
- Mobile không tràn ngang ở Trang chủ, Làm bài, Kết quả, Từ vựng, Nguồn.
- Chọn đáp án bằng phím số và chuyển câu bằng sự kiện cảm ứng thật của Chrome.
- Service worker cache shell; reload khi giả lập offline vẫn mở app và giữ tiến độ.
- Xóa dữ liệu bằng nút ở Tiến độ; bài dở, lịch sử, từ vựng và sổ ôn được xóa.
- Không có exception runtime chưa xử lý trong lượt kiểm tra.

Ảnh: screenshots/mobile-home.png và screenshots/mobile-exam.png. Kiểm tra mobile là giả lập Chrome, chưa thay thế kiểm tra trên mọi thiết bị thật. Chất lượng giọng TTS tùy thiết bị; không khẳng định đã thẩm định phát âm hoặc độ khó học thuật.

Các kiểm tra này xác nhận chức năng với ngân hàng mẫu. Chưa có đề full, CSV Hanzii, bộ ngữ pháp đã xác minh, giám khảo AI hoặc đồng bộ backend để kiểm tra.
