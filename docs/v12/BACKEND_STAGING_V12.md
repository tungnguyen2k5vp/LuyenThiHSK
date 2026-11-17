# V12 · Backend và staging

Local API/BFF/preview hoạt động. Cloud **NOT_DEPLOYED**, live Auth/RLS **NOT_VERIFIED**; BFF vẫn Guest/NOT_CONFIGURED. Không có credential/resource được cấp cho staging; không mua dịch vụ hay tự tạo remote Git.

Giữ journal, Web Locks, CAS, idempotency, immutable attempts, SRS reconciliation và secure grading contract. V12 tận dụng bảng content_reviews/audit hiện có; không migration/reset SQLite. Rights attestation là bản ghi tách scope, không đổi publication hoặc human language stages.

Chạy website và staging theo [runbook](../v10/BACKEND_CLOUD_RUNBOOK.md), [env](../../server/cloud/.env.example), [migration](../../server/cloud/migrations/001_learning_sync.sql), [RLS integration fixture](../../server/cloud/tests/rls-integration.sql). Khi có staging được cấp quyền: backup → migration → hai owner/RLS/RPC replay/CAS → session expiry/logout/guest merge → offline/two-tabs/two-device → restore/rollback. Không mount QA grading fixture thành production.

Runner local **npm run qa:v12** từ thư mục dự án, sau khi API8787/BFF8788/preview4173 đã chạy. Gồm typecheck/lint/unit/API/content/build/critical browser/security/performance; ghi log và dừng khi lỗi, không tự retry. Chưa có Git/CI nên GitHub Actions **NOT_RUN**, không tuyên bố workflow cloud hoạt động.

[staging-security](../../data/reports/v12/staging-security.json) · [QA tổng hợp](../../data/reports/v12/final/qa.json).

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.
