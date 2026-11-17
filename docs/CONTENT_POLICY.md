# Chính sách phát hành nội dung

1. Ghi URL, tác giả, edition, ngày truy cập và nguồn gốc từng loại code/câu/ảnh/audio/nét chữ/nghĩa/ví dụ.
2. Đọc license và quyền nguồn gốc. Download được không chứng minh quyền tái phát hành.
3. Chỉ public rights_status original, open_license_verified hoặc permission_confirmed. unverified bị validator chặn.
4. Giữ attribution và điều kiện ShareAlike, NonCommercial hoặc điều kiện đặc biệt; chỉ public nếu phù hợp cách triển khai.

Metadata bắt buộc: source_url, source_name, source_version, retrieved_at, license, rights_status, is_original, attribution. Nội dung gốc dùng URL local: tới module. Ngày ISO YYYY-MM-DD. Không đổi rights_status chỉ để vượt validator.

HSK 2.0 và 3.0 dùng bank độc lập, không dùng chung id câu giữa hai phiên bản. Cấp chưa thẩm định ghi Chưa xác minh. Nhóm 7–9 giữ một nhóm. Đề full phải khớp tổng câu, kỹ năng và thời lượng theo blueprint đã xác minh; bài ngắn dùng custom.

Câu khách quan phải có correctOptionId tồn tại và lựa chọn có id riêng. Đúng/sai có hai lựa chọn. Tự luận/nói cần rubric, không giả lập chấm chính thức. Nội dung nghe/đọc cần quyền riêng hoặc tự biên soạn. Giọng máy phải ghi nhãn.

Chạy npm run check:content, npm test và npm run build trước phát hành. Validator kiểm tra schema/metadata, không chứng minh chất lượng học thuật hoặc quyền pháp lý; người biên tập vẫn phải thẩm định.

Import không ghi đè nguồn, giữ nghĩa Việt/Anh, nhãn cấp gốc, từ đa nghĩa/đa cấp. Báo cáo nhập/bỏ qua/trùng/lỗi. Dữ liệu chưa rõ quyền không export vào public.

Bài làm, sổ ôn câu sai, từ cá nhân và lịch ôn lưu trong localStorage của trình duyệt/origin hiện tại. Từ CSV là nội dung riêng trên thiết bị, không được đưa lên server hoặc gộp vào bank public. Trạng thái `user_supplied` không chứng minh quyền phát hành. Thay đổi schema phải có migration và bản sao phục hồi trước khi ghi.

Edition vocab phải là `hsk2-2015`, `hsk3-2021`, `hsk3-2025` hoặc `unverified`; level trống giữ null. Người nhập có thể khai báo edition/cấp, nhưng chỉ reviewer có bằng chứng CTI mới đặt `official_verified`. Bản build không có luồng reviewer/admin server nên hiện không cấp trạng thái đó.

Khảo sát repo và license ghi ở `REFERENCE_REPOSITORIES.md`. Source of truth và xung đột giữa trang CTI/đợt thi thử ghi trong `DATA_SOURCES.md`. Không coi license ứng dụng là license nội dung.
