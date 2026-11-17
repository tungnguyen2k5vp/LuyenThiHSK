# V9 · Atomic sync

lúc 13:13 Thứ Bảy, 17 tháng 10, 2026 (UTC+7) · Local / private. Nội dung chưa duyệt chuyên môn.

Giữ Web Locks, durable journal, versioned capture, CAS, idempotency và event deduplication V8. Không thay bằng BroadcastChannel mutex. Browser thiếu Web Locks fail closed với thông báo: “Trình duyệt này chưa hỗ trợ đồng bộ an toàn. Tiến độ vẫn được lưu trên thiết bị.” Không gắn Cloud Synced khi chưa xác nhận.

Ma trận cuối có sync Chrome/Edge qua HTTP fixtures và nhiều tab thật; dữ liệu account riêng, không kết nối Supabase thật. Các bài kiểm trước/baseline V8 đã PASS; kết quả lượt V9 tại [matrix](../../data/reports/v9/final/browser/matrix.json). Có stale/replay/conflict/refresh/queue capture unit/API regression. LiveSupabase/RLS/multi-device vẫn NOT_VERIFIED. Không đổi SM-2 hoặc serialization guest.

Để rollout: dùng migration và RLS test, hai người dùng/thiết bị thật, ngắt mạng khi pending, reopen browser, reauth owner, duplicate submit và conflict CAS. Chỉ bật khi journal/receipt/owner checks đúng trên deployment và backup khôi phục được.
