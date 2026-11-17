# V10 · UX và accessibility

lúc 09:25 Chủ Nhật, 18 tháng 10, 2026 (UTC+7) · Local/private

Giữ light/teal/cards/Chinese-Vietnamese typography. HSK2 giảm 8 tab xuống 5 nhóm: Hôm nay/Từ vựng/Ngữ pháp/Luyện tập/Ôn tập. History và Điểm yếu nằm trong Ôn tập; mobile bottom nav giữ ổn định. 3skillcards rồi mới thấy parts. Nhãn 5 nhóm được rút gọn; không có overflow toàn trang ở 320px.

Main CTA tiếp tục phiên hoặc luyện đọc; mini/missing media/fullmock labels thể hiện đúng khả dụng. Course shows12 bài nháp /71 mục taxonomy; từ200 mục /20 mục được bổ sung bản nháp. Result tách correct/wrong/blank/ungraded và “Luyện lại điểm yếu”.

Chrome/Edge keyboard/native radio/textarea, focus, reload, Unicode multiline/undo/redo/composition-event fixture, layout320/375/390/430/768/1280. Physical Chinese IME, Android/iOS thật, VoiceOver/TalkBack/JAWS chưa thử. Không tuyên bố đạt WCAG từ screenshot. Ảnh xem [gallery](SCREENSHOT_GALLERY.html); emulation khác thiết bị thật.

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không phải chứng nhận ngôn ngữ, cấp HSK, quyền hay phát âm của người thật.

## Kiểm tra ảnh Edge

Chế độ chụp view (`fromSurface:false`) trong headless từng tạo ảnh phẳng 1.280×900, 7.040 bytes; không dùng các ảnh này làm bằng chứng giao diện. Bộ chụp đã chuyển sang surface. [Kiểm tra pixel](../../data/reports/v10/image-check.json) giải mã cả 26 ảnh sau thay đổi và yêu cầu hơn 32 màu RGB khác nhau; đồng thời đã xem ảnh thật của các màn đại diện. Đây không phải chứng nhận accessibility hoặc pixel regression.

Các timeout CDP và chuỗi lặp thất bại trước khi sửa harness được giữ trong `data/reports/v10/failures` và các file `*-failure.json`; chuỗi cuối chạy mới, không retry trong chuỗi. Việc kiểm tra viewport được đặt sau các điều hướng toàn trang để tránh trộn thao tác giả lập thiết bị với navigation của driver. Khi chụp, animation hữu hạn được chốt về khung cuối thay vì chờ promise animation của Edge; ảnh không dùng để đánh giá chuyển động. Phép đo hiệu năng vẫn dùng harness riêng, không dùng bước chốt animation này.
