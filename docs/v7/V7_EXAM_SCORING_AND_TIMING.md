# V7 · Điểm và thời gian

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

Correct/total/raw accuracy là kết quả luyện; officialScaledScore=null. Không quy đổi % thành điểm HSK, không báo Đạt HSK. HSK1 Beta dùng 15 phút nghe +20 phút đọc do nền tảng quy định; không suy ra quy tắc IBT chính thức.

## Media fairness

Audio và ảnh bắt buộc đang tải/lỗi đều tạm dừng timed session. Không cho thay đáp án hoặc điều hướng trong lúc media chưa sẵn sàng; Retry và Lưu/thoát vẫn dùng được. Tự tiếp tục khi mọi asset sẵn sàng; lỗi phát audio cần nghe và xác nhận. Các fields audioPausedAt/pausedDurationMs cũ được tái dùng; thêm optional reason/recovery flag, không đổi storage schema/key.

Bù tối đa 300.000ms cho cả lượt, tính cả thời gian chờ qua refresh/background/offline. Quá ngân sách giữ bài tạm dừng, không âm thầm trừ giờ; chỉ lưu/thoát hoặc chuyển rõ sang luyện không giờ. Không thể resume timed bằng cách refresh để nhận ngân sách mới. Chính sách này của nền tảng, không phải luật CTI. Local clock/client keys vẫn có thể bị sửa; chống gian lận production chưa xác minh.

Tests được viết trước thay đổi: media-before.log là lỗi ban đầu; media-policy-tests.json kiểm pause/resume/cap/legacy/answers; browser kiểm 503 ảnh/refresh/retry/giữ đáp án/chuyển untimed. Native audio retry có watchdog lại và element theo blob để không kẹt decoder.
