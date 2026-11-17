# V14 security QA

Evidence: `data/reports/v14/security.json` (14 kiểm tra) và API/contract/import tests. Local-only boundaries: no-auth catalog/intro denied401, foreign Origin/Host403, no public preview route, metadata POST405, unknown routes404, no raw keys/transcripts/credentials trong catalog. Vite dev cũng deny403 cho raw reports và admin-access; không thêm public route cho report snapshots.

Host test ban đầu dùng Node fetch nhưng Host không được gửi như dự định; thay bằng native HTTP request để kiểm header thật. Không sửa hoặc nới product host guard. Một assertion failure trong harness và lỗi đóng child Windows được quan sát trước lần PASS; không phải kết luận đã có host bypass.

Contract/adapters whitelist fields, feedback sau policy, callbacks đọc state mới nhất. Import plan không cho tự promote human/PUBLISHED, không áp dụng published/historical revisions tại chỗ, bắt source/right/external-ID lookup và content hash.

API tests clone SQLite, token riêng ngẫu nhiên, không dùng token chính; profile browser độc lập. Không exposure admin server ra mạng hoặc đưa token vào frontend/report. Main DB/account/audit/media so với V14 snapshot PASS tại `data-safety.json`.

Timed local practice chưa phải Secure Exam: private preview builder có dữ liệu đáp án để engine local hoạt động. V14 metadata và presentation DTO không mang key trước feedback, nhưng chưa có server-authoritative secure delivery/grading. Không triển khai QA grading adapter ra production.

Cloud NOT_DEPLOYED, Auth/RLS giữa hai user NOT_VERIFIED; local checks không thay thế cloud security/pentest. Không tự tạo user test trong dữ liệu thật.
