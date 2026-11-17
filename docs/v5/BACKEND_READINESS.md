# BACKEND_READINESS

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Audit và hardening local

| Hạng mục | Hiện trạng |
|---|---|
| Authentication | Bearer token local, constant-time compare; chưa có account/session |
| Exposure | Bind127.0.0.1, Host/Origin whitelist, admin và draft audio cần auth |
| Rate limit |30lần sai/phút; mã đúng không bị khóa bởi các lần sai |
| Validation | JSON4MB, media12MB, signature/duration/hash checks được giữ |
| Database | SQLite WAL, prepared statements, transactions, conflict revision409 |
| Audit/log | Audit revision/review; generic500response; không xuất token vào báo cáo |
| Backup | Source và SQLite VACUUM INTO trướcV5; chưa có production restore drill |
| Production | NODE_ENV=production fail closed cho development admin |

## Đề xuất production

Giữ React/Vite, exam engine và local guest. Tách public content API khỏi editorial admin. Node API xác minh managed OIDC/session; PostgreSQL có user-owned tables/RLS; object storage riêng với signed URLs; worker import/TTS; audit append-only. Email auth trước, Google OAuth tùy chọn. Cần HttpOnly/Secure/SameSite session, CSRF/Origin, CSP, secret manager, rate limit theo user/IP, migration, backup/restore và monitoring. Role language/level/audio/publish riêng. Public query chỉ lấy revision Published.

Không có Git metadata để tạo branch thực; không tự khởi tạo repo. Foundation mergeGuestProgress tách riêng, chưa nối vào auth: immutable attemptID, giữ bản conflict, cardupdatedAt, consent/owner check, loại Preview và kiểm tra idempotency. Chưa có cloud sync, email auth hoặc RLS deployment chạy thật.

Production backend **BLOCKED** cho đến khi đủ hạ tầng, credentials và kiểm tra vận hành. Điều này không chặn phát triển private Preview.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.
