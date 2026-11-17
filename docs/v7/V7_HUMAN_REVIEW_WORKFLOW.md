# V7 · Workflow người duyệt

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

## Mở và thao tác

Vào http://127.0.0.1:4173/?view=content-review, dùng mã local trong dòng cuối .runtime/admin-access.txt. Không đưa mã vào URL hoặc báo cáo.

Dashboard: pending/high risk/reviewed today/returned/rights/authorized approved/ready. Lọc loại, tìm kiếm, risk, trạng thái xử lý/review/part/type. Xem nội dung, pinyin, lời giải, nguồn, media, student preview và diff tại cùng màn. Save Draft và Save & Next không publish. Flag Issue, Request Revision, Skip và Return Queue lưu công việc riêng.

## CAS và import

GET /api/admin/v7/export xuất tất cả 882 mục ngoài template, gồm 396 câu; CSV questions riêng trong gói bàn giao tập trung 80 candidates. JSON quyết định: items[{id,revision,sourceFingerprint,workVersion,notes,decision}]. POST /api/admin/v7/import-decisions dùng Bearer local + Origin hợp lệ. Mọi phần tử được kiểm trước transaction; một mục stale làm từ chối cả gói 409. Lưu lại cùng workVersion cũ cũng 409. Không tự ghi đè ghi chú dù revision nội dung chưa đổi.

NOTED/SKIPPED/NEEDS_CORRECTION/PENDING là xử lý biên tập. LANGUAGE_REVIEW → HSK_LEVEL_REVIEW → APPROVED cần reviewer thực đã được chủ dự án cấu hình trong HSK_REVIEWERS_JSON server env: id, stages và SHA256 credentialHash. Không lưu credential trong DB/client bundle/gói export. Vòng này allowlist rỗng, nút chuyên môn bị khóa, Human Reviewed=0. Test API dùng reviewer fixture chỉ trong DB tạm. Không có chức năng bulk auto-approve.

Publication vẫn đi qua gate riêng của V3, không chấp nhận PUBLISHED từ import. Cấu hình allowlist local chưa phải deployed account RBAC. Trong tương lai cần identity/RBAC/HTTPS thực và kiểm credential provisioning.

Sau khi sửa nội dung, revision mới vô hiệu kiểm tra cũ. Revalidate chỉ kiểm kỹ thuật. Reviewer phải đọc lại đúng revision. Giữ các quyết định cũ trong lịch sử.

