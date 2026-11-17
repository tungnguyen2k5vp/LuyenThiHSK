# Bàn giao V6 · LuyenThiHSK

2026-10-16T06:15:21.671Z

HSK1 **TECHNICALLY BETA READY / CONTENT PENDING FINAL HUMAN REVIEW** trong local/private Preview. Chưa phát hành production.

| Hạng mục | Kết quả |
| --- | --- |
| Cấu trúc | 8 phần ×5 câu; ảnh, matching, shared bank |
| Ngân hàng | 396 câu; thêm 218 |
| Ngữ pháp | 68/68 bài có ≥5 câu liên quan |
| Media | 80 synthetic audio,30ảnh gốc,8bank |
| Mock độc lập | 2bộ40câu không trùng |
| Trạng thái | 883 Needs Review; human0; published0 |
| Auth/cloud | BFF/adapter/queue/SQL đã triển khai và test foundation; NOT_DEPLOYED |

## Tài liệu và mở web

- [Bộ tài liệu V6](docs/v6/README.md)
- [Ảnh Before/After](docs/v6/SCREENSHOT_GALLERY.html)
- [Test report](docs/v6/TEST_REPORT_V6.md) · [Performance](docs/v6/PERFORMANCE_REPORT_V6.md)
- [Readiness/blockers](docs/v6/V6_RELEASE_READINESS.md)
- [Chạy và cấu hình](docs/v6/BACKEND_SETUP.md)

Web local: http://127.0.0.1:4173/?view=preview. API8787 phải chạy; nhập mã dòng cuối .runtime/admin-access.txt. Không chia sẻ token.

## Công việc giữ nguyên

Không sửa HocTiengTrungApp. Giữ engine/timer/lease/autosave/storage keys/snapshots/revision history/SM2/weakness/study plan. Lỗi vòng lưu do callback và race bộ lọc được sửa có hồi quy. Backup SQLite/source trướcV6; restore vào database tạm PASS.

## Chưa thể công bố

- BLOCKED_FOR_HUMAN_REVIEW: nghĩa/pinyin/cấp/đáp án/ngữ pháp/ảnh/phát âm chưa có reviewer thật
- AUDIO_RIGHTS_UNVERIFIED:80 huayan synthetic chỉ private preview
- IBT_RULES_UNVERIFIED: audio replay/navigation/scoring và timing equivalence chưa chính thức
- NOT_DEPLOYED: Supabase/Auth/PostgreSQL/HTTPS/SMTP/RLS runtime/operations còn thiếu cấu hình và QA thật
- PRODUCTION_MEDIA_PENDING: private image delivery và server-side exam secrecy chưa sẵn sàng public
- DEVICE_QA_PENDING: Firefox/Safari/mobile thật/screen reader chưa kiểm

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.
