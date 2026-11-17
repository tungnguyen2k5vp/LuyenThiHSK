# V8 · Reviewer workspace

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

Tái sử dụng ContentReviewV5 và V7 CAS. Thêm tabs chờ/rủi ro/cần sửa/đã ghi chú/chờ duyệt lại/đã duyệt; batch A–D; level/part/type/risk/reviewer/disposition/audio/license. Desktop có preview và form cạnh nhau, mobile xếp một cột. Checklist hỗ trợ nhận xét, không tự ghi human approval.

Lưu nháp tạo revision mới khi nội dung đổi; Save & Next mở câu tiếp theo. Có Mark Issue, Request Revision, Skip, Return, DRAFT_FIXED và Ready for human review. Notes/assignee CAS dùng id/revision/sourceFingerprint/workVersion. Các quyết định sửa/block cần notes. DRAFT có thao tác gửi vào Needs Review; thao tác này không tạo human-review event.

JSON/CSV private export không credentials. v8/validate-import là dry run, liệt kê conflict; v7/import-decisions revalidate toàn bộ và BEGIN IMMEDIATE, một dòng stale thì cả transaction không ghi. Save/import không tự publish.

Local admin token cho editor. Language/HSK-level/approval cần allowlist credential, publisher dùng stage PUBLISHED riêng. Không dùng localStorage isAdmin. Chưa có allowlist thật trên máy này; production RBAC NOT VERIFIED. V8 revisions invalidate technical validation, reset human/answerVerified; production gate kế thừa media/reference/review/rights/PREVIEW restrictions.

Các ca API35 và extra-browser kiểm revision, forged approval, stale batch, Save & Next và UI conflict. Chỉ QA records mới được tạo/archived khi kiểm thử; không sửa notes của reviewer cũ.
