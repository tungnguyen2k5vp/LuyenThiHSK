# BACKEND SETUP

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

## Chạy local

Ba terminal tại LuyenThiHSK:

```powershell
npm run server
npm run account:server
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Sau sửa source chạy npm run build. Trang học thử http://127.0.0.1:4173/?view=preview, nhập mã dòng cuối .runtime/admin-access.txt; không gửi mã trong báo cáo/chat. Quản trị ?view=content-review. API local token đổi khi restart.

## Cấu hình cloud khi có hạ tầng

1. Tự chọn Supabase project/hosting và kiểm chi phí trước; script không tạo dịch vụ hay dùng khóa trả phí.
2. Apply server/cloud/migrations/001_learning_sync.sql trong project PostgreSQL/Supabase riêng; chạy fixture server/cloud/tests/rls-integration.sql ở database QA, không ở dữ liệu thật.
3. Dùng server/cloud/.env.example làm hướng dẫn, đặt SUPABASE_URL, SUPABASE_ANON_KEY và HSK_SESSION_ENCRYPTION_KEY bằng environment của Node. Không dùng VITE_* hoặc service-role key phía client. Key session là32byte ngẫu nhiên ở dạng64hex. Không commit environment thật. Script Node không tự đọc file.env, cần nạp env bằng shell/host.
4. Thiết lập SMTP/email confirmation, allowed redirect URL. Recovery email dùng token_hash/type=recovery đến /?view=settings&token_hash=…&type=recovery; frontend xóa hash khỏi URL rồi BFF verify. Chưa hỗ trợ implicit-token fragment hoặc Google OAuth.
5. Proxy cùng origin /api/account→8788; local editorial API8787 không đưa lên internet. Production phải NODE_ENV=production, exact HTTPS origin và TLS/reverse proxy.
6. Chạy test:account + live SQL RLS + email/expiry/multidevice/restore/security QA trước khi release. Credentials chưa có nên bước live không được đánh dấu hoàn tất.

## Khôi phục local

Xuất dữ liệu học trong Thiết lập trước khi thao tác trình duyệt. Bản SQLite nhất quán trướcV6 nằm .runtime/backups/before-v6-2026-10-16/hsk-content.sqlite. Đã kiểm restore vào database tạm, không thay DB đang dùng. Khi cần khôi phục thật: dừng API, sao lưu DB/WAL hiện hành, kiểm hash/integrity bản backup, rồi mới thay và khởi động lại theo quyết định của chủ dự án. Không chạy lệnh reset tự động.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.
