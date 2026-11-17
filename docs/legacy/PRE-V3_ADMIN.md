# LEGACY / PRE-V3 — không dùng làm trạng thái hiện hành

Nguồn trạng thái: ../CURRENT_STATE.md.

# Quản trị nội dung: trạng thái và quy trình an toàn

## Hiện tại

Website chưa có admin server, login, RBAC hoặc API; không có tài khoản admin mặc định. Không mở public một trang quản trị giả lập trong client.

Người học quản lý bộ từ **riêng trên thiết bị**:

1. Mở menu **Từ vựng → Nhập dữ liệu**.
2. Chọn tệp CSV hoặc dán nội dung; cột bắt buộc `hanzi`, `pinyin`, `meaning_vi`.
3. Khai báo tên nguồn, phiên bản, URL và giấy phép; giữ `Chưa xác minh quyền` khi chưa kiểm tra được quyền. Phiên bản/cấp HSK là khai báo, không phải chứng nhận CTI.
4. Chọn **Kiểm tra và xem trước**, sửa hàng lỗi/trùng, rồi thêm các hàng hợp lệ.
5. Quản lý từ ở tab **Danh sách**; có thể sửa, xóa, tìm, lọc và xuất CSV/JSON.
6. Tab **Ôn tập** dùng SM-2. Dữ liệu chỉ ở origin/browser hiện tại; xóa dữ liệu trình duyệt có thể xóa tiến độ. JSON export giữ cả metadata để người học tự lưu bản sao.

Không nhập đề CTI, audio, transcript, ảnh, câu ví dụ hoặc dataset community vào nội dung public nếu chưa có license/quyền riêng. Website hiện không gửi CSV lên server.

## Khi triển khai admin backend

- Tạo Supabase Auth và cấp `content_admin` qua service role; không có nút tự nâng quyền ở frontend.
- Tách staging, reviewer approval và published content. Import cần dry-run, checksums, báo cáo và rollback.
- Chỉ public record có quyền phân phối đã kiểm tra; `official_verified` học thuật độc lập với quyền license.
- Bật RLS cho mọi bảng người học; answer key chỉ được server đọc/chấm.
- Ghi audit log cho nhập/sửa/duyệt/ẩn nội dung; không lưu credential/secret trong log.

## Admin V2 hiện hành

Chạy npm run server trong project. Server tạo .runtime/admin-access.txt chứa mã quản trị local; mở /?view=admin hoặc /admin, nhập mã và kết nối. Mã chỉ giữ trong bộ nhớ trang, đổi khi server khởi động lại. Không commit/chia sẻ file mã hoặc SQLite runtime. Server chỉ bind loopback, đây chưa phải RBAC của hệ thống nhiều tài khoản.

Các loại quản lý: vocabulary, grammar, hanzi, questions, exams và audio metadata. Editor JSON có mẫu draft theo loại. Builder mini test chọn câu PUBLISHED, tên/cấp/thời lượng và đưa snapshot vào editor. Full mock tiếp tục cần bổ sung blueprint/sections/audio/quy tắc chính thức và vượt validator.

CSV vocabulary có mapping cột và xử lý ô quoted. JSON dùng mảng payload. Tối đa 4 MB/2.000 records. Preview chỉ kiểm tra; Apply tạo DRAFT, ghi report/checksum, bỏ duplicate. Mở bản ghi → Gửi duyệt → xác nhận đã rà nguồn/đáp án/ngôn ngữ/cấp/license → Duyệt → Công bố. Generated không được tự publish. Sửa luôn tạo revision mới; xung đột revision trả 409; archive có audit và không xóa vật lý. Nghĩa/glyph thiếu được giữ rõ thay vì điền giả.

Frontend ghép dữ liệu đã công bố vào catalog khi tải lại cấp/trang; exam snapshot cũ giữ nội dung lịch sử. Chất lượng/Audit hiển thị coverage release, missing meaning/strokes, import report và log quản trị. Thông tin phía dưới là hướng dẫn bản cá nhân trước V2.

