# BACKEND AUTH STATUS

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

## Kiến trúc đã triển khai

Node BFF riêng8788 + Supabase Auth/REST/PostgreSQL, giữ React/Vite và guest local. Không thêm dependency, không tạo cloud project, không phát sinh API trả phí. So với Node/PostgreSQL tự quản, Supabase cung cấp managed auth/RLS nhưng cần hạ tầng, SMTP và kiểm tra vận hành; chi phí chưa được đo vì chưa deploy.

Server-only adapter: signup/login/email reset recovery token hash/password/logout/refresh, HttpOnly Secure SameSite cookie (Secure khi production), session8h, opaque ID hash, token mã hóa AES256GCM trong SQLite riêng. Provider xác định user, không tin owner/role gửi từ client. Role guard dựa app_metadata; chưa có production editorial admin service, local admin vẫn không public. Google OAuth optional NOT_CONFIGURED.

Client có không gian cache mỗi owner, guest không tự nhập; consent import, queue offline, replay opId, CAS conflicts, tombstones, backoff429/503, SRS events append-only và submitted attempts immutable. Self-rating tách results. Pull không ghi đè pending; xung đột giữ payload hai phía, nhận cloud phải giữ backup local. Chưa có auto hợp nhất lịch SRS khi xung đột.

SQL migration: server/cloud/migrations/001_learning_sync.sql có owner FK, records/receipts/audit, RLS, quyền SELECT own, RPC write có advisory lock/CAS/idempotency/immutable guard, không grant trực tiếp writes. Records gồm profile,target,study_plan,vocabulary,grammar,srs_events,mistakes,attempts,results,bookmarks,settings.

## Trạng thái thật

**NOT_DEPLOYED / ACCOUNT_BACKEND_NOT_CONFIGURED.** 48 kiểm tra HTTP BFF/REST adapter double và local cache; Supabase thật/email thực/PostgreSQL RLS runtime chưa chạy vì không có credentials/database. Docker CLI có nhưng daemon không chạy. SQL fixture có sẵn, chưa gọi SQL execution là PASS.

Cấu hình/hướng dẫn: [BACKEND_SETUP.md](BACKEND_SETUP.md). Theo [Supabase password auth](https://supabase.com/docs/guides/auth/passwords), [session](https://supabase.com/docs/guides/auth/sessions), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.
