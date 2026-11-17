# V9 · Kết quả kiểm tra

lúc 13:13 Thứ Bảy, 17 tháng 10, 2026 (UTC+7) · Local / private. Nội dung chưa duyệt chuyên môn.

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

Lỗi đã giữ trong failures/: harness whitespace escape làm đọc sai result counts; dữ liệu sentinel sai schema bị sanitizer làm sạch; legacy selector còn chờ blueprint; test hash dùng encoding khác baseline. Có hai lỗi sản phẩm đã sửa: ưu tiên câu mới chỉ nhìn2attempts gây lặp R2, và V5course mở nhầm HSK2 không có reference bundle. Các bài mới chạy lại sau sửa; không xóa assertions để PASS. Console/runtime exceptions0 trong journeys đạt. Kiểm count DOM có đủ đúng/sai/blank/ungraded, không dùng assert(true).

Unit/API fixtures riêng; browser profiles tạm, guest schema3 sentinel có history/vocab không đổi. Failure artifacts/logs có timestamp. Không tạo human reviews hoặc publish qua test. [Raw test matrix](../../data/reports/v9/final/browser/matrix.json), [repeat](../../data/reports/v9/repeated/browser.json).
