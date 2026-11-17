# V9 · Backend, auth và grading

lúc 13:13 Thứ Bảy, 17 tháng 10, 2026 (UTC+7) · Local / private. Nội dung chưa duyệt chuyên môn.

Account runtime: {"status":200,"configured":false,"deployment":"NOT_CONFIGURED","guestAvailable":true}. Guest hoạt động; chưa bật Supabase. [Migration](../../server/cloud/migrations/001_learning_sync.sql), [RLS QA](../../server/cloud/tests/rls-integration.sql), [server-only env mẫu](../../server/cloud/.env.example). Đã chuẩn bị code/config/tests; liveRLS/auth/SMTP/HTTPS/đa thiết bị NOT_VERIFIED. Không mua/tạo/deploy cloud.

| Phạm vi | Kiểm soát thực hiện / giới hạn |
| --- | --- |
| Auth/session | BFF, session hash/8h, encrypted refresh/access, HttpOnly SameSite, Secure khi production; provider fixtures PASS, live token lifecycle chưa xác minh |
| Authorization | Reviewer credential/allowlist, owner auth/RLS contract; client role không cấp quyền |
| CSRF | Exact origin allowlist cho mutating account, loopback origin và Bearer cho admin |
| Injection/XSS | SQLite bound parameters; structured DTO/schema, React/textContent cho nội dung; export CSV formula escaping |
| Uploads | Size/content/metadata gates, malformed upload tests; không mở public upload |
| Revision/review | expectedRevision + content fp + workVersion, transactional import/assign rollback |
| Secrets | Local admin token không bundle/export; admin refuses NODE_ENV=production |
| Rate/audit | In-process limits/audit hooks exist; distributed limiter, operational retention cần deployment review |
| Backup | Consistent SQLite backup + isolated restore + historical fingerprint checks |

Secure Grading V8 giữ nguyên whitelist nested DTO trước submit: không đáp án/lời giải/transcript; owner/attempt/nonce/expiry/input/rate/replay/immutable result. HTTP loopback + SQLite reopen20assertions PASS qua regression. Adapter QA không mount production; Map adapter không dùng làm production storage. Offline practice có keys ở client và không được gọi là anti-cheat secure exam.

Production rollout: staging riêng → SQL/RLS hai owner thật → server-only config/HTTPS+SMTP → auth refresh/revocation → backup/restore → multi-tab/device/offline reconnect → durable grading/rate/audit → content/rights approvals → user approval deployment riêng. [Readiness JSON](../../data/reports/v9/backend-readiness.json).
