# Baseline trước vòng V2 — 15/10/2026

Project được giữ: React 19 + TypeScript + Vite, không có API, 3 bank/20 câu gốc, 0 full exam, 0 vocabulary/grammar/Hanzi đóng gói. Exam engine có timer, audio preflight/pause/recover, autosave/resume, section policy, submit idempotent, grading, history và mistake queue. Bộ từ cá nhân có CSV/SM-2; dashboard chỉ tổng hợp lịch sử. Storage schema 3.

Đã chạy trước khi sửa: typecheck PASS, unit tests PASS, content check PASS, production build PASS, browser regression PASS. Không có lệnh lint ban đầu. Bundle JS 355.74 kB (109.38 kB gzip), CSS 50.15 kB (10.50 kB gzip). Đã xem ảnh desktop dashboard và mobile exam. Backup mã nguồn tại `.runtime/backups/before-v2-2026-10-15`.

## Data lineage cho vòng V2

Raw immutable snapshot → đối chiếu schema/checksum/edition và vocabulary membership với PDF CTI → ghép nghĩa từ CVDICT/CC-CEDICT theo từ + cách đọc → deduplicate → shard theo edition/level → manifest + quality report → UI tải từng shard. Quyền dictionary: CC BY-SA 4.0, kèm attribution/thay đổi; bộ stroke: Arphic Public License. Không đưa PDF, câu hỏi, đoạn văn hoặc ví dụ đề CTI vào release.

Chỉ metadata từ/cấp/pinyin, tên cấu trúc, tên chủ đề/nhiệm vụ và ký tự được chuẩn hóa từ nguồn syllabus. Nghĩa Việt là nguồn từ điển cộng đồng, không phải bản dịch CTI. Học liệu mới do AI tạo phải `GENERATED/NEEDS_REVIEW`, importer chỉ tạo DRAFT; bước review/publish tách riêng và có audit.
