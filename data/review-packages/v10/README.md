# Gói duyệt V10

1. Giải nén và mở `MO_DE_DUYET.html`. Không cần cài phần mềm hoặc nhập mã admin.
2. Lọc Batch A–D để duyệt 80 câu mock cũ; lọc các câu có cờ hoặc HSK2. Bản ghi luôn có revision/fingerprint/workVersion.
3. Kiểm tiếng Trung, pinyin, cấp, đáp án, distractor và giải thích. Ghi bằng chứng, chọn NOTED/NEEDS_CORRECTION/BLOCKED; lưu và chuyển câu.
4. Bấm **Xuất ghi chú JSON**. Ghi chú offline chưa thay đổi database. Không chuyển ghi chú giữa các bản export bằng cách sửa fingerprint.
5. Trong website admin: nhập file → dry-run kiểm revision/fingerprint/workVersion → xử lý mọi conflict → lưu batch. Human approval cần credential reviewer đã được cấu hình; gói này không cấp quyền đó.

1123 bản ghi editorial hiện hành; không kèm 7 nháp audio/template V4/V5 cũ. 40 tác vụ audio là công việc chuẩn bị, không phải AudioAsset. Không có token, learner data, PDF CTI, binary audio hay ảnh chưa rõ quyền. Ảnh/audio xem qua website local có quyền. Dữ liệu nguồn và note cũ được giữ nguyên. Trình duyệt chặn localStorage vẫn cho xuất file, nhưng cần xuất trước khi đóng.
