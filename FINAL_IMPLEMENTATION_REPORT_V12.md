# LuyenThiHSK · Báo cáo V12

| Hạng mục | V11 | V12 | Thay đổi |
| --- | --- | --- | --- |
| HSK 1 câu / bài | 435 / 68 | 435 / 68 | Giữ nguyên |
| HSK 2 câu | 176 | 246 | +70 câu ngữ pháp gắn 14 bài, không thêm phần thi |
| Câu theo 9 phần | 116 | 116 | Giữ nguyên |
| Bài ngữ pháp | 16 | 30 | +14 |
| Bài có ≥5 câu độc lập | 16 | 30 | +14 |
| Mục từ được bổ sung | 44 | 124 | +80; giữ ID gốc |
| Audio HSK 2 khả dụng | 0 | 0 | Chưa có output giọng đủ điều kiện |
| Editorial hiện hành | 1175 | 1339 | +164; revision sửa không tăng số ID |
| Human Reviewed / Published | 0 / 0 | 0 / 0 | Không tự vượt gate |

## Đã triển khai

- 14 bài ngữ pháp và 80 mục từ nháp mới; 70 câu luyện phục vụ từng bài, không tăng pool đề thi.
- 27 câu legacy có revision metadata/lời giải, ghi rõ trường không áp dụng hoặc chờ duyệt học thuật; W1 không thành mastery ngữ pháp.
- Thu âm chủ động, nghe/lưu/khôi phục draft, khai báo người thu và phạm vi; guided TTS có fallback khi thiếu giọng Mandarin.
- 110 hồ sơ media, 30 SVG tái tạo đúng byte, workflow ký phạm vi bằng reviewer được ủy quyền; không tự xác nhận ownership.
- Today đọc/viết, source/vocabulary detail, modal focus/scroll và dashboard bảy chiều mock; giữ exam/sync/SRS engines.

## Kiểm thử

32/32 regression; 12/12 browser groups; 1155 unit assertions; 147 API checks. 10 lượt liên tiếp mỗi unit/API/Chrome/Edge đạt; không retry tự động. 46 ảnh QA cuối có decode/pixel check. [Chi tiết](docs/v12/TEST_REPORT_V12.md).

## Trạng thái thực tế

5 Draft · 1334 Needs Review · 1339 Automated Valid · **0 Human Reviewed / 0 Published**. Các chiều chồng lấn. HSK1 giữ 435 câu,68 bài và199 flags chờ chuyên môn.

**Các luồng học local đã qua QA; hiệu năng cần theo dõi, nội dung chờ duyệt chuyên môn.** Audio HSK2 vẫn 0/40 khả dụng; có đường thu âm và gói quyết định, chưa có PoC speech hợp lệ. Full Mock thật vẫn khóa; cloud NOT_DEPLOYED, live Auth/RLS chưa xác minh. Không tải model, trả phí hay dùng microphone thật trong QA. Firefox/WebKit/thiết bị thật/CI chưa kiểm.

## Mở web và tài liệu

- [Mở HSK Preview](http://127.0.0.1:4173/?view=preview): mã ở dòng cuối `.runtime/admin-access.txt`, chọn HSK2.
- [Toàn bộ bàn giao trong một folder](TAI_LIEU_TONG_HOP_HSK/V12_BAN_GIAO/README.md).
- [Mục lục báo cáo](docs/v12/README.md) · [Gallery](docs/v12/SCREENSHOT_GALLERY.html) · [Gói duyệt](data/review-packages/v12/MO_DE_DUYET.html).
- [Readiness và blocker](docs/v12/V12_RELEASE_READINESS.md) · [Hiệu năng có số đo thật](docs/v12/PERFORMANCE_REPORT_V12.md).

## Hiệu năng cần theo dõi

Lượt đo riêng có 6/17 chỉ số vượt budget V11. Exam Start p95 364,9 ms so với 201,5 ms; chưa xác minh nguyên nhân. Giữ cả hai lượt V12 trong báo cáo, không tuyên bố performance gate đã đạt.
