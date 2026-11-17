# V7 · Backend security

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

Account BFF status hiện NOT_CONFIGURED, configured=false. Cookie HttpOnly/SameSiteLax; Secure với config production. Exact origin cho mutation, rate/body limit, user ownership từ provider, AES256GCM server sessions, absolute expiry, refresh/logout, recovery token hash, CAS/idempotency/tombstone/immutable attempts/SRS được kiểm qua service/HTTP + provider double. Không có live Supabase, SQL RLS runtime, SMTP hay HTTPS deployment.

V7 test trước sửa ghi hai refresh đồng thời cho một rotating token; single-flight theo cookie sửa còn một. Encryption key phải đúng64hex, không nhận suffix thừa. Không log credentials hoặc đưa service-role/encryption/admin secret vào Vite.

Sync fixture kiểm offline→reconnect,503→retry giữ opId, conflicts, SRS events, owner logout/login và không ghi owner_id từ client. Test V6 có hai owner/device-like operations và idempotency double. Đây không phải multi-device live proof. Shared localStorage queue capture giữa các tab chưa chứng minh atomic: phải xử lý trước production; không tự merge SRS hoặc ghi đè xung đột.

Server-grading adapter giữ key phía server và xuất whitelist question DTO, owner+nonce+expiry+immutable replay, snapshot, raw accuracy. Chỉ test cô lập; chưa mount public API, chưa durable store/auth integration, không gọi secure exam production. Offline/private engine được giữ.

Editorial local token không phải deployed RBAC; V7 bổ sung reviewer credential allowlist cho approval. Human events test nằm DB tạm. Production local admin vẫn fail closed.

Runbook thật: docs/v6/BACKEND_SETUP.md và server/cloud/migrations/001_learning_sync.sql + tests/rls-integration.sql. Chủ dự án cần QA project/credentials/SMTP/HTTPS, execute migrations/RLS fixtures ở DB riêng, kiểm redirect/session/ownership/recovery/restore/multidevice rồi mới đánh giá release. Không tự tạo dịch vụ/tốn phí/deploy.
