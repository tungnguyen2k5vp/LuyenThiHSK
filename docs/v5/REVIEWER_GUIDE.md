# Hướng dẫn duyệt HSK 1

Nội dung hiện tại là bản nháp AI chờ duyệt. Không có mục nào đã được giáo viên duyệt hoặc công bố.

## Đọc và ghi nhận xét

1. Mở `.runtime/review-packages/v5/index.html` trong thư mục dự án.
2. Chọn từ vựng, bài ngữ pháp, câu hỏi hoặc audio. Có thể tìm và chuyển trang.
3. Đọc nghĩa, pinyin, ví dụ/lời giải; mở phần nguồn và cờ khi cần.
4. Với audio, nghe cùng transcript. Kiểm tra âm, biến điệu, tốc độ và độ tự nhiên.
5. Điền tên người kiểm tra, nội dung đề xuất sửa và nhận xét; chọn NeedsCorrection khi cần.
6. Bấm **Xuất nhận xét CSV** trước khi đổi máy. Ghi chú chỉ được lưu trong trình duyệt đang dùng.

Gói có audio chỉ dùng riêng vì quyền giọng huayan chưa được xác minh. CSV không chứa audio có trong `data/review-packages/v5`.

## Sửa và duyệt revision

1. Chạy website theo README; mở `http://127.0.0.1:4173/?view=content-review`.
2. Nhập mã riêng từ `.runtime/admin-access.txt`.
3. Chọn loại nội dung, tìm ID trong CSV rồi mở bản duyệt.
4. Sửa các trường cần thiết. **Lưu và tiếp theo** tạo revision mới nếu nội dung đổi; ghi chú không tự approve.
5. Mở lại revision mới và chạy kiểm tra nội bộ. Kiểm tra này không chứng nhận ngôn ngữ.
6. Chỉ khi thực sự đã duyệt, nhập tên/nhận xét và xác nhận từng bước Language Review, HSK Level Review và Approve.

Publication vẫn có thể bị chặn vì quyền sử dụng, audio, revision hoặc môi trường production chưa đủ điều kiện. Không đổi trạng thái bằng cách sửa trực tiếp SQLite/JSON để bỏ qua gate.

## Các điểm ưu tiên

- Cờ cấp độ không luôn là lỗi: xem tên riêng, lượng từ và cách tách từ trong ngữ cảnh.
- Pinyin dạng từ điển khác biến điệu khi nói; không thay toàn bộ cách đọc chỉ theo một quy tắc máy.
- Điểm rủi ro chỉ sắp thứ tự kiểm tra, không phải điểm chất lượng.
- Câu grammar có gợi ý/distractor dễ cần phân biệt với câu dùng đo lường năng lực.
- Review luôn gắn đúng ID và revision; nếu báo conflict409, tải lại trước khi ghi tiếp.
