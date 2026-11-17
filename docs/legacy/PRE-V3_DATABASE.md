# LEGACY / PRE-V3 — không dùng làm trạng thái hiện hành

Nguồn trạng thái: ../CURRENT_STATE.md.

# Database V2

Browser giữ nguyên hsk-study-data-v1, schema 3: sessions, attempts, reviewItems, vocabulary, wordEntries. Không reset hoặc chuyển các dữ liệu này sang server. Key mới hsk-preparation-v1, schema 1 chứa mục tiêu, lịch thi, course SRS, ghi nhận grammar/Hanzi, daily plans, diagnostic và writing drafts. Bản ghi âm nằm trong IndexedDB hsk-recordings-v1; JSON export không chứa audio binary.

Local API dùng SQLite tại .runtime/hsk-content.sqlite. Migration tạo bảng bằng CREATE TABLE IF NOT EXISTS, WAL và index, không DROP/TRUNCATE. content có khóa ghép id + revision, kind, status, payload, created_at, updated_at. imports lưu checksum duy nhất/report. audit lưu hành động, entity/revision và thời gian. Sửa nội dung tạo revision DRAFT; bản đã công bố vẫn giữ lịch sử. Archive không xóa vật lý.

SQLite này dành cho quản trị nội dung trên máy local, không phải tài khoản cloud của người học. Thiết kế PostgreSQL/Supabase đích tiếp tục ở DATABASE_SCHEMA.md; chưa áp dụng vào một Supabase project, chưa có authenticated cloud sync. Backup local admin bằng cách dừng server và sao chép cả SQLite cùng WAL nếu còn tồn tại.
