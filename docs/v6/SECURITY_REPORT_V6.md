# SECURITY REPORT V6

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

## Đã kiểm

- Local content API bind127.0.0.1, Bearer constant-time, Host/Origin whitelist, rate limit, generic error; NODE_ENV=production fail closed.
- Ảnh/audio draft cần auth; SVG chỉ file gốc hash khớp, chặn script/event/href/external/foreignObject/DOCTYPE, nosniff/CSP sandbox. Không upload SVG từ người dùng.
- Upload audio max12MB, magic bytes, duration/browser decode, immutable hash; historical WAV không bị xóa.
- Revision CAS409, fingerprint metadata/scoring/pinyin, review events riêng, không auto Human Approved. Production gate kiểm từng part, source/license và media/bank dependencies.
- BFF exactOrigin/CSRF, rate, encrypted sessions, refresh/expiry/logout, owner-derived writes, unexpected fields rejected, SQL RLS/RPC; key chỉ ở server, .env bị ignore, không VITE secret.
- Backup trướcV6 và restore vào database tạm PASS; không reset DB hiện hành hoặc localStorage người dùng.

## Giới hạn release

Cloud session/RLS với provider thật, HTTPS/reverse proxy, SMTP, security audit production, vận hành backup cloud và quan sát tải còn NOT_TESTED. Role guard đã kiểm; chưa có production editor/publisher RBAC hoàn chỉnh. Không publish local admin API.

Private Preview gửi draft answer keys trong bundle/snapshot để học và QA; chỉ ẩn khỏi UI trước kiểm tra/nộp. Đây không phải hệ thống thi chống gian lận; không tuyên bố đáp án được giữ bí mật trước người có quyền Preview. Bài thi production có tính bảo mật cao cần server grading và tách đáp án khỏi client.

Browser local cache không mã hóa dữ liệu học; tách owner giúp tránh nhầm dữ liệu, không thay cách bảo vệ thiết bị dùng chung. Rà xung đột SRS thủ công. Ảnh lỗi chưa tự pause timer. Những giới hạn này không được biến thành PASS nhờ test double.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.
