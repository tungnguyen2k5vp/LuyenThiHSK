# V8 · Đồng bộ đa tab

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

Sửa queue shared localStorage bằng Web Locks exclusive theo origin/owner và durable capture journal. Mỗi lần ghi lưu journal keyUUID đồng bộ trước khi chờ khóa; đóng tab khi đang chờ vẫn để tab khác phục hồi. Queue/shadow/versions commit trong một atomic JSON value, read-through legacy queue/keys được giữ.

Capture dùng delta so với dữ liệu tab quan sát: không biến thiếu card ở snapshot cũ của tab khác thành tombstone. Expected baseVersion giữ CAS; không tự ghi đè stale tiến độ. Immutable attempts/SRS event IDs dedupe, retry giữ opId, server receipts bảo vệ replay. Không merge lịch SM2 bằng quy tắc mới.

Chrome/Edge mỗi browser23 kiểm tra với tab thật, cùng profile,2profile,concurrent lock barrier, đóng tab đang chờ, fault sau commit trước xóa journal rồi đóng tab, SRS2events,attempt dedupe,response loss/offline,CAS,logout,2owners,legacy migration.10 lượt liên tiếp/browser: repeated/sync-results.json. V7 refresh single-flight có provider-double test riêng; không tuyên bố browser QA fixture là token refresh live.

Fallback không có Web Locks: giữ journal, báo CLOUD_ATOMIC_UNAVAILABLE và chặn sync thiếu an toàn; không dùng BroadcastChannel làm mutex. Fallback được test nhưng không cung cấp cloud sync trên browser thiếu locks. Guest storage không rewrite. Live Supabase/RLS/SMTP/multi-device thật=LIVE_CLOUD_NOT_VERIFIED. CI chưa chạy. Hoạt động tab V7 cũ ghi sau migration V8 chưa được chứng minh; cần refresh đồng nhất phiên bản trước cloud release.
