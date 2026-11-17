# V4 baseline — 15/10/2026

Đo trước thay đổi V4 tại LuyenThiHSK; backup `.runtime/backups/before-v4-2026-10-15`.

| Hạng mục | Baseline V3 |
|---|---:|
| Vocabulary toàn bộ syllabus 2025 | 11.000 |
| HSK 1 vocabulary | 300 |
| HSK 1 normalized / cần rà | 165 / 135 |
| HSK 1 thiếu VI / không có nghĩa ngắn | 5 / 22 |
| Grammar taxonomy HSK 1 / lesson draft | 68 / 8 |
| Legacy questions / grammar questions draft | 20 / 8 |
| Audio production / full mock production | 0 / 0 |

Typecheck, lint, test, test:v2, test:v3, test:admin, test:v3-api, check:content, build, test:browser đều PASS trước sửa. Browser gồm onboarding, học, thi, autosave/reload, kết quả, ôn sai, admin, offline và viewport 320/375/390/430. Đây là baseline, không chứng minh V4 đạt.

Bundle baseline: main JS 409,91 kB (gzip 125,61); CSS 64,38 kB (gzip 13,31); admin 36,54 kB; course 17,41 kB. Nội dung Human Review V4 chưa có; không kế thừa nhãn PUBLISHED của taxonomy/từ điển thành review học thuật.

Phát hiện: importer chọn mục họ người/biến thể trước nghĩa thông dụng; duplicate API startup ghi đè file token trước khi bind port thành công. Sửa trong V4.
