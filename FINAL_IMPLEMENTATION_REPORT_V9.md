# LuyenThiHSK · Báo cáo V9

lúc 13:13 Thứ Bảy, 17 tháng 10, 2026 (UTC+7)

## Kết quả

HSK 1 giữ 396 câu core và 6 câu V8, thêm 33 câu ngữ pháp: tổng 435 câu. Cả 68 cấu trúc có ít nhất 5 câu đánh giá độc lập; vẫn giữ hai bộ 40 câu. HSK 2 tăng từ 27 lên 54 câu trong 9 phần: 36 câu đọc/viết khả dụng, 18 câu nghe chờ audio. Editor W2 hỗ trợ tiếng Trung nhiều dòng, tự lưu và khôi phục; bài viết được giữ chưa chấm. Hàng duyệt có 986 bản ghi, kiểm tra xung đột khi lưu/phân công, gói offline và đề xuất sửa kèm nguồn. Chỉ chỉnh LuyenThiHSK; giữ tiến độ guest và SM-2.

| Loại | Tổng | Draft | Needs Review | Automated valid | Human | Published |
| --- | --- | --- | --- | --- | --- | --- |
| vocabulary | 300 | 0 | 300 | 300 | 0 | 0 |
| grammar | 68 | 0 | 68 | 68 | 0 | 0 |
| audio | 80 | 0 | 80 | 80 | 0 | 0 |
| templates | 1 | 0 | 1 | 1 | 0 | 0 |
| images | 30 | 0 | 30 | 30 | 0 | 0 |
| optionBanks | 18 | 5 | 13 | 18 | 0 | 0 |
| questions | 489 | 0 | 489 | 489 | 0 | 0 |

Các bộ đếm trên thuộc release V6/V8/V9 hiện hành. Bảy nháp audio/template V4/V5 cũ và dữ liệu syllabus công khai nằm ngoài phạm vi đếm. Automated valid là kết quả kỹ thuật, không phải duyệt chuyên môn.

## Kiểm tra

| Nhóm | Kết quả | Bằng chứng/giới hạn |
| --- | --- | --- |
| Baseline | PASS | 23 scripts + V8Chrome/Edge + legacy |
| Final npm scripts | 25/25 | typecheck/lint/unit/API/security/build |
| V9 unit | PASS | 110 assertions |
| V9 API | PASS | 50 assertions; separateSQLite/auth/origin/CAS |
| Browser matrix | 10/10 | Chrome/Edge/legacy/media/stress/sync |
| 10× unit/API | 20/20 | No retries |
| 10× new journeys | 20/20 | Chrome/Edge, no retries |
| Data safety | PASS | historical revisions/notes/public hashes |
| CI | NOT_RUN | No connected CI/Git workflow |
| Firefox/WebKit/realdevice | NOT_VERIFIED | Không có Firefox/WebKit được chạy; xem inventory |
| Live cloud/RLS | NOT_VERIFIED | No credentials/provider deployment |

## An toàn và giới hạn

Baseline có 3015 revisions; mất 0, thay đổi nội dung lịch sử 0, thay đổi ghi chú/phân công/quyết định cũ 0. Dữ liệu syllabus công khai giữ nguyên: true. 199 câu có cờ đã được phân loại và có bằng chứng; chưa có quyết định chuyên gia giải quyết ngữ nghĩa. Human Reviewed = 0, Published = 0. Audio HSK 2 hợp lệ = 0; chưa có Full Mock HSK 2. Xung đột đánh số Writing vẫn là POSITIONAL_HYPOTHESIS_NOT_VERIFIED. Cloud, RLS và thiết bị thật chưa được xác minh; adapter chấm điểm chỉ chạy QA.

Hiệu năng: giảm prepared statements từ 884 xuống 2; tổng thời gian profile p95 223.53→122.93ms. Đã tách phép đo 17 metrics trên trình duyệt khỏi profile backend; xem số liệu và giới hạn trong báo cáo hiệu năng.

## Mở website

Trong thư mục LuyenThiHSK, chạy `npm run build`. Mở ba terminal: `npm run server`, `npm run account:server`, `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. Vào http://127.0.0.1:4173/?view=preview; nhập **dòng cuối** `.runtime/admin-access.txt` vào ô mã local. Không đưa mã lên URL hoặc chia sẻ. Chọn cấp HSK2 để luyện. Hàng duyệt: http://127.0.0.1:4173/?view=content-review. Guest ở trang chính vẫn chạy khi chưa có cloud.

## Bàn giao

- [Mục lục báo cáo](docs/v9/README.md)
- [Gallery trước/sau](docs/v9/SCREENSHOT_GALLERY.html)
- [Mở gói duyệt](data/review-packages/v9/MO_DE_DUYET.html)
- [Thư mục tổng hợp](TAI_LIEU_TONG_HOP_HSK/V9_BAN_GIAO/README.md)

**Private beta / content pending final human review. Production vẫn bị chặn.** Các phần cần người duyệt giữ BLOCKED_FOR_HUMAN_REVIEW; pipeline kỹ thuật và bản nháp tiếp tục hoạt động. Chưa triển khai V10. Không chạy lại các script wiring/fix/stage một lần như lệnh khởi động.
