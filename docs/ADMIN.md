# Admin V3

Trạng thái duy nhất: [CURRENT_STATE.md](CURRENT_STATE.md). Chi tiết cổng chất lượng: [CONTENT_V3.md](CONTENT_V3.md).

Chạy npm run server; mở /?view=admin và nhập mã trong .runtime/admin-access.txt. Token chỉ giữ trong bộ nhớ trang; server bind127.0.0.1:8787. Không phải auth/RBAC nhiều người.

Mặc định form có cấu trúc cho vocabulary, grammar, question, Hanzi, audio và template; JSON chỉ nằm trong Advanced. Preview question/exam dùng cùng ExamRoom/AttemptResult và không lưu vào lịch sử học viên.

Các tab: Nội dung, Hàng đợi duyệt (thiếu nghĩa/dirty/grammar incomplete/legacy metadata), Question Coverage, Audio, Tạo đề, CSV/JSON và Audit. Staging có20câu legacy,8lesson và8câu grammar, chỉ nhập chờ duyệt.

AI question/grammar mặc định NEEDS_REVIEW. Review có LANGUAGE_REVIEW rồi HSK_LEVEL_REVIEW, APPROVED, PUBLISHED; cần reviewer/comment và xác nhận. Vocabulary giữ luồng review ngắn tương thích V2, publish vẫn chặn license chưa kiểm tra/nghĩa chưa sạch. Record Published không sửa tại chỗ; Save tạo revision mới. Archive không delete.

Upload audio12MB có preview/browser decode/hash/magic signature. Điền transcript/speaker/source/license/evidence rồi lưu/duyệt. File draft không public. Tạo đề cần template Published, pool Published, seed/revision lock và audio đủ. Full gate chưa có nội dung production.

Import4MB/2000records có dry run: newRecords,updates,duplicates,conflicts,invalid. Update yêu cầu expectedRevision/revision đúng. Re-import cùngchecksum không tạo thêm. Bulk tag/level API chỉ tạo revision nháp, không tự duyệt.

Audit ghi actor/action/before/after/time; reviews lưu riêng. Người duyệt là tên khai báo local, không coi là định danh đã xác thực. Xem docs/legacy/PRE-V3_ADMIN.md cho lịch sử.
