# V11 · Baseline và bảo toàn

2026-10-18 T03:48:50.865 Z

Database trước sửa: **1123** current records / 3347 historical revisions, khớp V10. Counts theo kind xem [baseline JSON](../../data/reports/v11/baseline.json). Backup nhất quán: `.runtime/backups/before-v11-2026-10-18T02-48-40-823Z`; content/account/source/public/editorial/staging/media đã sao lưu. Restore SQLite riêng **PASS**. Không có Git repository; dùng source snapshot/hash để đối chiếu. Không migration schema hoặc trích xuất/reset profile thật.

Trước sửa ứng dụng: **27/27 regression và 10/10 Chrome/Edge jobs PASS**, gồm typecheck/lint/unit/API/V1–V10/build. Lần CDP trong sandbox timeout được ghi trong diagnostic log; bản được cấp quyền đã chạy đủ. Không dùng script one-off V10 làm setup.

Sau V11: 0 historical semantic/status changes, 0 thay đổi note nội dung, schema/public-data giữ nguyên. Có 40 decoder checked At và 1 thời điểm note QA đổi do hồi quy cũ; không gọi mọi byte SQLite bất biến. SRS/guest/history thật không bị reset. [Safety](../../data/reports/v11/data-safety.json).

Nội dung tự tạo giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Automated validation không phải human review, xác minh quyền, phát âm hay chứng nhận chính thức CTI.
