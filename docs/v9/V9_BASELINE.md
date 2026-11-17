# V9 · Baseline đã xác minh

lúc 13:13 Thứ Bảy, 17 tháng 10, 2026 (UTC+7) · Local / private. Nội dung chưa duyệt chuyên môn.

Release V8 hiện hành có **921 bản ghi**, HSK1 402 câu và HSK2 27 câu. Toàn DB còn 7 nháp audio/template V4/V5 cũ ngoài release: tổng editorial active khi bắt đầu là 928, không được nhầm với 921.

3015 historical revisions. Không có Git repository/branch/commit. SQLite integrity OK, schema/fingerprint/notes/assignee/public-data hashes được ghi trước thay đổi. Backup: `.runtime/backups/before-v9-2026-10-16T16-05-47-730Z`. Restore sang bản SQLite tạm riêng PASS, không restore đè live.

Baseline chạy 23 npm scripts và Chrome/Edge V8, V1–V5, renderer stress; kết quả trong [baseline](../../data/reports/v9/baseline/regression.json). 17 metrics ×20 mẫu đã đóng băng trước tối ưu. 199 câu có cờ, 0 human semantic resolution; 45/68 bài có ≥5 independent unique, thiếu 33 câu để đạt ngưỡng.

Không truy cập/reset profile trình duyệt thật. Backup có dữ liệu riêng, không đưa vào gói bàn giao. [Manifest backup](../../data/reports/v9/baseline.json).
