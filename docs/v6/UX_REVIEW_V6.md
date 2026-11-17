# UX REVIEW V6

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

Giữ light/teal, không redesign project. Hôm nay nổi mục tiêu/phút/nhiệm vụ/CTA “Bắt đầu học hôm nay”; terminology “Ngữ pháp”. Banner nháp ngắn và info details.

Thêm catalogue8part, part progress/jump trong section, 3cột ảnh desktop/2cột mobile, native matching, Reset/validation/keyboard6lựa chọn, bank cố định, retry ảnh, nút hành động mobile không bị bottom nav che. Từ vựng giữ search Hán/pinyin/Việt, previous/next, SM2, âm thanh, nghĩa chính/phụ. Ngữ pháp hiển thị pool thật và TTS ví dụ.

Bugs sửa có evidence: callback onSave đổi mỗi render gây effect lưu lặp trong ExamRoom; dùng ref callback, giữ timer/lease/storage. Bộ lọc review từng mở record cũ khi response chưa về; xóa queue chờ và loại response lỗi thời. CSS chung từng ép mọi ảnh thành1cột; scope riêng picture grid. Nút retry không lồng trong nút option.

E2E viewport320/375/390/430/768/1280, slow media, ảnh lỗi, audio recovery, keyboard và refresh. Không có overflow trong các trạng thái đã kiểm. Chrome/Edge không có runtime exception/console error trong lượt PASS. Contrast/focus/alt được kiểm bằng cấu trúc và ảnh chụp; chưa có audit screen reader thực, chưa tự gọi WCAG certified.

Xem [gallery](SCREENSHOT_GALLERY.html), docs/screenshots/v6/before, after-chrome và after-edge. Ảnh Before là bản V5 trước nâng cấp; dạng hình/matching chưa có trước đó nên không tạo ảnh Before giả.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.
