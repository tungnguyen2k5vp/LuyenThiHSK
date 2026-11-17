# V10 · Kiểm thử

lúc 09:25 Chủ Nhật, 18 tháng 10, 2026 (UTC+7) · Local/private

| Bộ | Kết quả |
| --- | --- |
| Baseline regression | 25/25 PASS |
| Final regression | 27/27 PASS |
| Browser matrix | 10/10 PASS |
| V10 unit | 485 assertions PASS |
| V10 API | 76 assertions PASS · temporary SQLite |
| Repeated unit/API | 20/20 PASS ·10 lần/bộ |
| Repeated Chrome/Edge | 20/20 PASS ·10 lần/trình duyệt |
| CI | NOT_RUN |
| Firefox/WebKit | NOT_TESTED |
| Android/iOS/physical IME/live cloud | NOT_TESTED / NOT_VERIFIED |

[Regression](../../data/reports/v10/final/regression.json) · [browser matrix](../../data/reports/v10/final/browser/matrix.json) · [lặp unit/API](../../data/reports/v10/repeated/unit-api.json) · [lặp browser](../../data/reports/v10/repeated/browser.json). Không retry; khi phát hiện lỗi harness/selector đã lưu failure artifact rồi sửa gốc và chạy lại sequence. Không gọi các lần chẩn đoán trước đó là test pass. Main DB không chứa waveform/human approval fixture. Hồi quy cũ có decoder timestamp/note timestamp updates, đã audit riêng. Offline review kiểm 1.123 bản ghi, 211 cờ, 152 câu HSK 2, khôi phục ghi chú, xuất CAS và hiển thị chuỗi XSS dưới dạng text, không tạo approval.

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không phải chứng nhận ngôn ngữ, cấp HSK, quyền hay phát âm của người thật.

## Kiểm tra ảnh Edge

Chế độ chụp view (`fromSurface:false`) trong headless từng tạo ảnh phẳng 1.280×900, 7.040 bytes; không dùng các ảnh này làm bằng chứng giao diện. Bộ chụp đã chuyển sang surface. [Kiểm tra pixel](../../data/reports/v10/image-check.json) giải mã cả 26 ảnh sau thay đổi và yêu cầu hơn 32 màu RGB khác nhau; đồng thời đã xem ảnh thật của các màn đại diện. Đây không phải chứng nhận accessibility hoặc pixel regression.

Các timeout CDP và chuỗi lặp thất bại trước khi sửa harness được giữ trong `data/reports/v10/failures` và các file `*-failure.json`; chuỗi cuối chạy mới, không retry trong chuỗi. Việc kiểm tra viewport được đặt sau các điều hướng toàn trang để tránh trộn thao tác giả lập thiết bị với navigation của driver. Khi chụp, animation hữu hạn được chốt về khung cuối thay vì chờ promise animation của Edge; ảnh không dùng để đánh giá chuyển động. Phép đo hiệu năng vẫn dùng harness riêng, không dùng bước chốt animation này.
