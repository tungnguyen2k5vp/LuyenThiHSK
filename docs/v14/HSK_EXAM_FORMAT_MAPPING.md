# Exam format mapping

Ngày đọc CTI: 2026-10-19. Bảng sau ghi đúng thông tin hiển thị ở trang cấp; không gắn chúng thành format HSK3.0 mới chỉ vì header site có chữ HSK3.0.

| Source | Nghe / Đọc / Viết | Tổng | Phút các kỹ năng; chuyển đáp án | Interpretation |
| --- | --- | --- | --- | --- |
| [CTI1](https://www.chinesetest.cn/HSK/1) | 20 /20 /0 | 40 | 15+17;3 | Trang ghi khoảng40 phút gồm5 phút hành chính;200 điểm,120 đạt |
| [CTI2](https://www.chinesetest.cn/HSK/2) | 35 /25 /0 | 60 | 25+22;3 | Khoảng55 phút gồm hành chính;200 điểm,120 đạt |
| [CTI3](https://www.chinesetest.cn/HSK/3) | 40 /30 /10 | 80 | 35+30+15;5 | Khoảng90 phút;300 điểm,180 đạt |
| [CTI4](https://www.chinesetest.cn/HSK/4) | 45 /40 /15 | 100 | 30+40+25;5 | Khoảng105 phút;300 điểm,180 đạt |
| [CTI5](https://www.chinesetest.cn/HSK/5) | 45 /45 /10 | 100 | 30+45+40;5 | Khoảng125 phút; trang đọc được không nêu ngưỡng đỗ |
| [CTI6](https://www.chinesetest.cn/HSK/6) | 50 /50 /1 | 101 | 35+50+45;5 | Khoảng140 phút; trang đọc được không nêu ngưỡng đỗ |

Đây là source observations, không thay scoring của platform. Không suy xác suất đỗ từ accuracy bài luyện. Chi tiết từng Part/type cho3–6 chưa kiểm tra sample tương ứng; activation vẫn BLOCKED_VERSIONED_SOURCE_VERIFICATION.

## Template hiện hữu

- HSK1 original private mock:40 câu,8 part; `shared/hsk1-parts.mjs`/`buildV6Exam`. Nội dung tự biên soạn, không đề Official. Giữ nguyên template/engine.
- HSK2 `shared/level-blueprints.mjs`: nguồn mẫu giấy lịch sử đã có SHA256,25L+25R+10W. 52 phút và2 lượt nghe trong `HSK2_PLATFORM_TEMPLATE` là platform policy, chưa xác minh quy tắc IBT/scoring. Có conflict numbering của answer document, giữ blocker nguyên vẹn.
- Phiên bản vocabulary2021, syllabus2025 và tên gọi2026 của repo không được gộp theo `new` hoặc số cấp. `examEdition()` trả unverified khi câu khác edition; contract luôn mang version riêng.
- Pause/seek/replay/navigation lấy từ ExamRuntimeConfig; bằng chứng chưa đủ thì không đổi `rulesVerified`/`structureVerified` thành true. Không suy từ screenshot Migii.
