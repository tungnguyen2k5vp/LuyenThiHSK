# LuyenThiHSK · Báo cáo V10

lúc 09:25 Chủ Nhật, 18 tháng 10, 2026 (UTC+7)

## Đã triển khai

- HSK 2: **54 → 152 câu**, gồm 116 câu theo phần thi và 36 câu luyện ngữ pháp. Có **76 câu đọc/viết theo phần khả dụng**, 112 câu nếu tính cả ngữ pháp.
- **12 bài ngữ pháp nháp**, 20 mục từ được bổ sung nghĩa và ví dụ; bộ 200 từ giữ ID và lịch SRS hiện có. Không gọi 71 mục taxonomy là 71 bài hoàn chỉnh.
- Mini hỗn hợp, ưu tiên câu chưa gặp/ít gặp, kế hoạch theo nội dung có thật, 5 nhóm điều hướng, khôi phục bài viết và kết quả chưa chấm.
- Audio workbench: upload, metadata nguồn, kiểm tra PCM, ràng buộc revision và hàng đợi duyệt. Có **40 transcript, 0 câu nghe HSK 2 khả dụng**.
- Builder chọn đủ 60 câu với seed và revision cố định; **Full Mock HSK 2 vẫn NOT_READY** do thiếu audio và quyền media.
- HSK 1 giữ 435 câu, 68 bài và hai bộ 40 câu độc lập. 199 cờ chất lượng tiếp tục chờ người duyệt.

## Trạng thái nội dung

| Draft | Needs Review | Internally Validated | Human Reviewed | Published |
| --- | --- | --- | --- | --- |
| 5 | 1118 | 1123 | 0 | 0 |

Tổng **1123 bản ghi editorial hiện hành**. Automated validation là một chiều kiểm tra riêng, không cộng với workflow để tính tổng. Bảy nháp audio/template cũ không thuộc phạm vi release này.

**Sẵn sàng beta kỹ thuật cho khu học riêng Reading/Writing/Learning; nội dung chờ duyệt chuyên môn.** Chưa production, chưa bật cloud và chưa mở Full Mock HSK 2.

## Kiểm thử

- 27/27 lệnh hồi quy; 10/10 nhóm kiểm tra trình duyệt.
- 485 kiểm tra đơn vị; 76 kiểm tra API trên SQLite tạm riêng.
- 10 lượt liên tiếp cho từng bộ unit/API và Chrome/Edge: 40/40 PASS, không retry.
- 17 chỉ số hiệu năng, mỗi chỉ số 20 mẫu. Chỉ số cần chú ý: không có.
- CI, Firefox/WebKit, Android/iOS thật và IME vật lý chưa kiểm tra. Live auth/RLS chưa xác minh.

## Mở web và tài liệu

- [Mở HSK Preview](http://127.0.0.1:4173/?view=preview), nhập dòng cuối của `.runtime/admin-access.txt`, rồi chọn HSK 2. Mã đổi khi API khởi động lại.
- [Toàn bộ bàn giao trong một folder](TAI_LIEU_TONG_HOP_HSK/V10_BAN_GIAO/README.md).
- [Mục lục tài liệu](docs/v10/README.md), [ảnh trước/sau](docs/v10/SCREENSHOT_GALLERY.html), [gói duyệt offline](data/review-packages/v10/MO_DE_DUYET.html).
- [Cách chạy và staging runbook](docs/v10/BACKEND_CLOUD_RUNBOOK.md). Không mở `dist/index.html` bằng `file://`.

## Còn cần hoàn tất trước khi public

Nguồn audio đủ quyền; người nghe duyệt phát âm, ngôn ngữ và cấp HSK; quyền của 80 WAV/30 SVG; live auth/RLS và thiết bị thật. Nội dung tự tạo không được gắn Official, Human Reviewed hoặc Published khi chưa đạt điều kiện.
