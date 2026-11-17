# LEGACY / PRE-V3 — không dùng làm trạng thái hiện hành

Nguồn trạng thái: ../CURRENT_STATE.md.

# Kiến trúc LuyenThiHSK

## Hiện hành V2 — 15/10/2026

React SPA và exam engine được giữ. Catalog syllabus 2025 ở public/data được tải theo cấp, cache offline v4 và các route học/admin/diagnostic/response được tách chunk. Browser giữ nguyên study storage schema 3; preparation schema 1 độc lập chứa profile, SRS catalog, learning events, plans và writing drafts. Audio người học ở IndexedDB.

Có local content API Node 24 + SQLite, bind 127.0.0.1:8787. Admin dùng bearer token lưu trong .runtime/admin-access.txt, chỉ chấp nhận origin loopback; CRUD revision, import dry-run/idempotency, review/publish/archive và audit. Frontend guest dùng được khi API tắt; static release vẫn là nguồn nội dung chạy offline. Khi API chạy, published overrides được ghép theo ID. Chưa có tài khoản/cloud sync/Supabase runtime.

Chi tiết hiện hành: DATABASE.md, HSK_DATA.md, EXAM_ENGINE.md, SRS.md, PRODUCT_UX.md, STUDY_PLAN.md, WEAKNESS_ENGINE.md, TESTING.md và FINAL_IMPLEMENTATION_REPORT_V2.md. Phần dưới lưu hiện trạng trước V2.

Ngày rà soát: 15/10/2026.

## Hiện trạng chạy được

- Client: React 19, TypeScript, Vite; không có API server hoặc backend-as-a-service được cấu hình.
- Điều hướng: query URL (`view`, `version`, `level`, `section`, `type`, `session`, `attempt`) để tải lại/back/forward được.
- Trạng thái hiện tại: `localStorage` key `hsk-study-data-v1`; schema 3. Bài thi, lượt làm, hàng đợi câu sai, từ cá nhân và lịch ôn đều lưu trên thiết bị/trình duyệt hiện tại.
- Exam engine giữ nguyên: timer theo bài/phần, autosave, audio gate, answer sheet, chấm khách quan/tự đánh giá, kết quả, lịch sử và ôn sai.
- Dashboard tiến độ chạy trên client, tổng hợp lịch sử bài đã nộp và bộ từ cục bộ; không có số liệu mẫu hay analytics phía server.
- Vocabulary vertical slice: thêm/sửa/xóa từ cá nhân, CSV preview/validation, nguồn và quyền theo batch, lọc/tìm, xuất CSV và lịch SM-2.
- Không có tài khoản, đồng bộ giữa thiết bị, admin server, thanh toán, analytics phía server hoặc nhập HSK chính thức.

## Biên giới dữ liệu

1. **Nội dung gốc của sản phẩm:** đề minh họa hiện có, có provenance và license gate; hiện có 20 câu duy nhất, chưa có đề đầy đủ đủ điều kiện public.
2. **Dữ liệu do người học nhập:** từ CSV hoặc form riêng, chỉ ở localStorage. Mặc định là chưa xác minh; nhãn HSK/edition do người dùng khai báo không được xem là dữ liệu CTI đã kiểm chứng.
3. **Dữ liệu chính thức:** chưa nhập vào app. CTI là source of truth; PDF và trang chính thức được liên kết/đọc để đối chiếu, không được sao chép/phát lại.
4. **Dữ liệu cộng đồng:** chỉ dùng làm reference; không được public cho tới khi kiểm tra riêng nguồn gốc, edition, trường dữ liệu, quyền và đối chiếu CTI.

## Đường đi dữ liệu từ CSV

`CSV trên thiết bị → size/format/header/field validation → preview (hợp lệ/trùng/lỗi) → lưu wordEntries + provenance → danh sách/tìm kiếm → due queue → SM-2 grade → localStorage`

File tối đa 2 MB / 2.000 dòng mỗi lần. Hàng lỗi không được thêm; hàng trùng theo Hanzi+pinyin được bỏ qua. Level trống được giữ `null`, không suy luận cấp. CSV chỉ chứa dữ liệu người học cung cấp; không được đẩy lên máy chủ hay đưa thành ngân hàng chung.

## Phiên bản syllabus

Vocabulary riêng lưu `hsk2-2015`, `hsk3-2021`, `hsk3-2025` hoặc `unverified`, cùng trường level độc lập. Edition do người học nhập vẫn là khai báo. Exam engine cũ tiếp tục giữ `hsk2`/`hsk3` route để không làm hỏng URL, session và lịch sử đã lưu; mapping này chưa chứng minh đề HSK3 demo thuộc syllabus 2025.

CTI PDF HSK syllabus ghi phát hành 11/2025, hiệu lực 07/2026. Thông báo CTI ghi đợt thi thử HSK3.0 ngày 20/09/2026 và lịch triển khai toàn cầu 13/12/2026. Vì vậy trạng thái chuyển tiếp phải được biểu diễn rõ; không gộp HSK 2.0, chuẩn 2021, syllabus 2025 và kỳ thi thử vào một edition.

## Lộ trình backend

Khi có dự án Supabase/PostgreSQL riêng:

- Dùng normalized tables trong [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md), storage object riêng cho audio/ảnh/ghi âm, không lưu binary trong PostgreSQL.
- Xác thực email và OAuth tùy nhu cầu; cho phép guest trước khi buộc đăng nhập.
- Bật RLS cho profile, attempts, answers, review cards, plans và dữ liệu từ cá nhân; owner lấy từ auth identity, không từ request body.
- `question_answers` phải tách khỏi payload client trước khi nộp bài; chấm tự luận/nói không được tự động công bố đáp án chuẩn.
- Admin dùng role phía server và audit log; không đặt service-role key hoặc quyền admin trong frontend.
- Import là job có dry-run, checksum, số dòng nhận/bỏ/trùng/lỗi, provenance, báo cáo và rollback. Chỉ admin duyệt dữ liệu public.

Schema Postgres hiện là bản thiết kế, chưa được áp dụng vì repository chưa có Supabase project, credentials hoặc API. Không có backend endpoint nào được giả lập bằng UI.

