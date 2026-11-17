# HSK exam module · 17/11/2026

## Phase 1 — khảo sát và phạm vi

- React 19, TypeScript, Vite 8, CSS thuần; router hiện hữu dựa trên URL/query. `/` là 4Chinese; `?view=...` giữ ứng dụng HSK cũ.
- Content API là Node 24 `http`, SQLite `node:sqlite`; không có ORM. `content(id, revision)` đã lưu câu hỏi, lựa chọn, đoạn đọc, media và đề dưới dạng JSON có version. `content_reviews`, `audit_details`, `imports`, `media_assets` đã tồn tại.
- Account BFF cổng 8788 dùng cookie HttpOnly và Supabase; chưa cấu hình tài khoản ở máy hiện tại. Quản trị cục bộ dùng token phía server, không nhúng vào bundle.
- Kho mở và bộ thu thập JSON có sẵn: no7z (câu/audio CC BY-SA 4.0), HearMandarin (chỉ bộ từ CC BY 4.0). Mandarin Zone cũ có NC: giữ nguyên và không nhập vào luồng mới dành cho nguồn cho phép thương mại. Chi tiết lịch sử ở `DATA_SOURCES.md`.
- Có 11.870 mục từ 4Chinese; lịch học riêng và SRS được giữ nguyên. Không ghi vào `HocTiengTrungApp`.
- Luồng thi cũ lưu/chấm client. Bổ sung `/hsk` cho luồng thi máy chủ, dùng chung DB, hợp đồng câu hỏi, audio và phong cách xanh 4Chinese; không thay framework hay xóa module cũ.

## Kế hoạch thay đổi

1. `server/migrations/`, `server/hsk-exam-service.mjs`: bảng bổ sung có khóa ngoại/index; lượt thi, snapshot, chấm điểm, deadline, optimistic concurrency, chủ sở hữu.
2. `shared/hsk-bank.mjs`, `scripts/collect-hsk-bank.mjs`: hợp đồng nhập JSON/CSV, quyền nguồn, fingerprint, bản ghi gần trùng, raw/checkpoint. Tái sử dụng collector/dataset đã có.
3. `server/admin-server.mjs`: gắn API `/api/hsk`, dùng lại token quản trị và bộ tạo revision hiện tại. Nội dung mới luôn chờ duyệt, riêng bài mẫu kỹ thuật có nhãn rõ.
4. `src/hsk/`: danh mục, chi tiết, làm bài, kết quả/lời giải, lịch sử, quản trị. Link từ khu học; giữ các URL cũ.
5. `scripts/test-hsk-exam.mjs`, `scripts/check-hsk-exam-browser.mjs`: kiểm thử DB/API và browser thật trong dữ liệu tạm nhỏ; không tạo bản sao toàn dự án.

## Quy ước nội dung

Bài luyện được biên soạn hoặc chuyển đổi phục vụ luyện tập, không tự nhận là đề chính thức. Chuẩn 2015, GF0025-2021 và syllabus 2025 tách ID. Điểm luyện tập là điểm câu hỏi, không suy ra điểm/ngưỡng đạt chính thức. Viết tự do cần người chấm. Dữ liệu AI/nguồn chưa thẩm định không tự thành nội dung đã duyệt.

## Tiến độ và kiểm chứng

MVP đã triển khai qua Phase 1–5. `git status` không dùng được do metadata Git của workspace không hợp lệ; bản sao DB trước migration nằm ở `.runtime/backups/hsk-exam-mvp-1794888862620/hsk-content.sqlite`.

| Phase | Kết quả / file chính |
| --- | --- |
| 1 · Khảo sát | Tái sử dụng React, CSS, native HTTP/SQLite, content revisions, renderer/audio và dữ liệu 4Chinese; không thêm dependency |
| 2 · Dữ liệu | `shared/hsk-bank.mjs`, `scripts/collect-hsk-bank.mjs`, `scripts/build-hsk-mvp-sample.mjs`: quyền nguồn, JSON/CSV, raw/checksum, resume, validator và liên kết trùng |
| 3 · Backend | `server/migrations/001_hsk_exam.sql`, `server/hsk-exam-service.mjs`, `server/hsk-question-generator.mjs`, tích hợp `admin-server.mjs`; chấm/lưu/deadline/ownership ở server |
| 4 · Frontend | `src/hsk/`: danh mục → giới thiệu → phòng làm bài → kết quả/lời giải → lịch sử; quản trị nhập/sửa/duyệt/xuất bản; liên kết từ vựng cũ |
| 5 · Tích hợp | Kiểm thử HTTP + SQLite và browser với dữ liệu cô lập; kiểm tra lại học từ/ôn tập/cộng đồng; lint/typecheck/build; desktop/mobile bằng Impeccable |

## Dữ liệu thực tế và quyền nguồn

- Luồng mới có **72 câu chờ duyệt**, **3 bài mẫu kỹ thuật**, **0 câu tự động xuất bản**: 20 câu biên soạn mới với trợ giúp AI, 12 câu chuyển từ kho no7z có sẵn và 40 câu nghe chép chính tả thu thập qua collector.
- Ba mẫu chạy được từ đầu đến cuối: HSK1/2025 đọc 10 câu; HSK2/2025 đọc 4 + sắp xếp câu 6; HSK1/GF2021 nghe 6 + đọc 6. Đây là bài ngắn 12–15 phút, không phải đề chính thức hay full mock đã thẩm định.
- Kho bổ trợ cũ **262 bộ / 24.542 câu / 8.708 MP3** vẫn nằm ở URL cũ, không nhân bản toàn bộ sang DB mới. Các MP3 đã có được tham chiếu, không sao chép thêm.
- Đối chiếu DB trước migration: **3.768 hàng content cũ không đổi cột nào**. Kiểm tra checksum **17 module lấy từ app gốc** và từ điển 4Chinese đều qua; không sửa `HocTiengTrungApp`. 11.870 mục từ và cơ chế SRS hiện hữu được giữ.

| Nguồn | Dữ liệu xác minh / phạm vi dùng | Quyền và phương pháp |
| --- | --- | --- |
| [no7z / Jayoung](https://github.com/no7z/hsk-sentences-audio) | JSON gốc 4.354 dòng; câu Trung, pinyin, nghĩa Anh, cấp GF2021 và audio tổng hợp. Câu gốc làm đáp án đối chiếu; lời giải/bài phái sinh vẫn cần duyệt. 40 câu thu thập mới đã nhập vào hàng chờ | **CC BY-SA 4.0 cho dist sentence/audio**, cho phép thương mại kèm ghi công và ShareAlike phần phái sinh. Đọc JSON trực tiếp tại commit khóa; không suy quyền nội dung từ MIT của code |
| Dự án HSK Journey | 20 câu mới HSK1–2/2025, đáp án và giải thích Việt; không dùng audio mới | `LicenseRef-Project-Original`; AI hỗ trợ biên soạn, chưa có chứng nhận chuyên môn |
| 4Chinese nội bộ | 11.870 mục từ; dùng ID, Hán tự, pinyin, nghĩa và ví dụ để liên kết/gợi ý bản nháp | Tái sử dụng theo yêu cầu chủ dự án, app nguồn chỉ đọc. Kiểm duyệt nguồn và ngôn ngữ trước khi xuất bản bản nháp |
| Migii, QKT và nguồn khác | Báo cáo tham khảo cũ ở [DATA_SOURCES.md](DATA_SOURCES.md) | Không nhập nội dung cần đăng nhập hoặc chưa xác minh quyền; không coi truy cập công khai là giấy phép phân phối |

Lần kiểm tra mạng thật đọc cả JSON và ATTRIBUTION tại commit `857dfbab91027ebd97df01260e91b817cb6b4854`:

- JSON SHA-256: `8f8ffd34eee29f395724ce060cad22511eeeabb7af731d5b5879dc0548e01660`.
- ATTRIBUTION SHA-256: `6191a6b951817ee9ca9994478a7ec36d69e44790bea9d1649f39eea981e11bf5`.
- Chạy nhập lại cùng lô xác nhận `replayed: true`, tổng vẫn 72 câu.
- So gần trùng bài nghe dùng transcript, không dùng riêng hướng dẫn chung. 780 cảnh báo ban đầu do cùng hướng dẫn đã được đối chiếu lại, ghi `SHARED_INSTRUCTION_ONLY`; giữ nguyên hàng log và báo cáo nhập gốc để truy vết. Vì vậy báo cáo replay của lô cũ có thể vẫn hiển thị 780 cảnh báo lịch sử.

## Chạy trên máy

Node 24 có `node:sqlite`. Chạy từ `D:\ReactJS\LuyenThiHSK`, mỗi dịch vụ một terminal:

```powershell
npm run server
npm run account:server
npm run dev -- --host 127.0.0.1
```

Mở [học từ 4Chinese](http://127.0.0.1:3000/), [luyện thi mới](http://127.0.0.1:3000/hsk), [lịch sử](http://127.0.0.1:3000/hsk?tab=history), [quản trị](http://127.0.0.1:3000/hsk?tab=admin). Bản build:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Content API ở 8787; account BFF ở 8788. Admin nhập mã hiện hành từ `.runtime/admin-access.txt` trên máy chạy API; mã chỉ giữ trong bộ nhớ trang, không đặt trong URL/localStorage. Khi server khởi động lại, dùng mã mới trong file. Không công khai `.runtime` hay dữ liệu editorial.

Hiện account provider chưa cấu hình, nên dùng khách với cookie HttpOnly `hsk_exam_guest`. Lịch sử nằm trong SQLite và chỉ mở bằng cùng phiên/cookie; xóa cookie có thể mất quyền truy cập lịch sử khách. Khi có cookie account hiện hữu, backend xác minh qua BFF; không tin user ID do client gửi. Chưa xác minh đăng nhập/sync điện thoại bằng tài khoản thật.

## Nhập, sinh nháp và xuất bản

Pipeline: nguồn được phép → raw bất biến → chuẩn hóa/validate → fingerprint/so gần trùng → hàng chờ duyệt → người duyệt → xuất bản đúng revision.

```powershell
# Kiểm tra dữ liệu và giấy phép từ nguồn thật; chưa nhập DB
npm run data:hsk:collect -- --refresh --limit=40
# Dùng cache có checksum, nhập hàng chờ; chạy lại không nhân bản
npm run data:hsk:collect -- --offline --offset=0 --limit=40 --apply
# Đọc tiếp từ checkpoint; có thể gọi lệnh này bằng scheduler bên ngoài
npm run data:hsk:collect -- --resume --limit=40
```

Collector có URL allowlist, không redirect, giới hạn dung lượng, timeout, retry; không crawl HTML, vượt đăng nhập hay CAPTCHA. Nguồn đã cung cấp JSON nên không thêm crawler HTML/JS. Chưa tạo tác vụ chạy định kỳ trên Windows. Raw/batch/checkpoint nằm ở `.runtime/hsk-collector/`; log đầy đủ giữ trên đĩa, CLI chỉ in số lượng liên kết trùng.

Trong trang quản trị: chọn JSON `{source,questions}` hoặc `{batches:[...]}`; với CSV chọn nguồn đã xác minh, dùng tên cột theo `shared/hsk-bank.mjs`. Các cột options/audio/image/acceptedAnswers/vocabularyIds/rubric chứa JSON trong ô CSV. Tối đa 500 câu/lô, file 3,5 MB. Bắt buộc kiểm tra trước rồi nhập; báo cáo giữ lỗi từng dòng và liên kết trùng. Xuất JSON có thể nhập trở lại.

Chọn câu → sửa và lưu revision mới → nhập người duyệt/nhận xét và xác nhận ngôn ngữ, cấp, đáp án, media → **Duyệt câu** → **Xuất bản câu**. Ghép bộ bài cùng chuẩn/cấp rồi **Xuất bản bộ**. Không thể xuất bản bộ nếu câu hiện tại chưa được duyệt/xuất bản đúng revision. Sửa câu làm mất hiệu lực duyệt cũ và gỡ bộ có revision cũ khỏi danh sách xuất bản; lịch sử dùng snapshot cũ được giữ.

Bộ tạo offline dùng kho từ 2025, tạo câu chọn nghĩa/điền từ từ ví dụ. Các phương án và ngữ pháp vẫn cần người kiểm tra. Adapter AI có prompt riêng, output validation, timeout; cấu hình `HSK_AI_ENDPOINT`, `HSK_AI_MODEL` và tùy provider `HSK_AI_KEY` trong môi trường server. Chỉ HTTPS hoặc loopback; key không vào frontend. Chưa có provider thật được cấu hình/kiểm thử. Sắp xếp câu/đoạn văn do provider không được tính là đã nghiệm thu.

## API chính

Tất cả đường dẫn có tiền tố `/api/hsk/`. Browser dùng cookie cùng origin; POST/PATCH cục bộ yêu cầu Origin localhost/127.0.0.1. Admin thêm `Authorization: Bearer <mã cục bộ>`.

| Phương thức / đường dẫn | Hợp đồng |
| --- | --- |
| GET `standards` | Các chuẩn 2015 / GF2021 / 2025 độc lập, không cấu hình điểm chính thức giả |
| GET `exams` | `standard,level,skill,difficulty,status,q,offset,limit`; trạng thái `new/active/done`, limit ≤100 |
| GET `exams/:id` | Metadata, phần thi, số câu, thời gian và nhãn thẩm định; không có đáp án |
| POST `exams/:id/start` | `{idempotencyKey: UUID}`; retry cùng key trả cùng attempt, snapshot câu/đáp án ở server |
| GET `attempts/:id` | Câu làm bài đã lọc khóa/lời giải/transcript; đáp án đã lưu, cờ, vị trí, revision, deadline/serverNow |
| PATCH `attempts/:id/answers` | `{expectedRevision,currentIndex,answers:[{questionId,answer,flagged}]}`; chặn câu ngoài bài, lựa chọn sai và race giữa các tab |
| POST `attempts/:id/submit` | `{expectedRevision}`; chấm server và idempotent, chặn sửa bài đã nộp |
| GET `attempts/:id/results` | Chỉ chủ bài, chỉ sau khi chốt; điểm thô, từng kỹ năng, lời giải/transcript và vocabulary IDs |
| GET `attempts/history` | Lịch sử của chủ phiên, `offset,limit` |
| GET `questions` | Câu đã xuất bản, DTO không chứa đáp án; `offset,limit` |
| GET `vocabulary?ids=...` | Liên kết đến chi tiết từ 4Chinese hiện hữu |
| GET `admin/overview`, `admin/questions` | Tổng quan, nguồn, job/log; câu hỗ trợ `q,status,standard,level,offset,limit` |
| POST `admin/questions/import` | `{source,questions,dryRun}` hoặc `{source,csv,dryRun}` |
| GET `admin/questions/export` | Lô theo nguồn và bản ghi hiện tại có metadata |
| PATCH `admin/questions/:id` | `{expectedRevision,question}`; tạo revision, kiểm tra quyền nguồn/media và trùng |
| POST `admin/questions/:id/review` | `{revision,decision,reviewer,comment,...checks}`; decision `approve/reject/publish` |
| GET `admin/vocabulary` | Tìm từ 2025 theo `q,level,offset,limit` |
| POST `admin/questions/generate` | `{wordIds,level,type,provider}`; luôn nhập bản nháp |
| POST `admin/exams` | `{title,standardId,level,durationMinutes,questionIds,description}` |
| POST `admin/exams/:id/publish` | `{revision,reviewer,comment}` |

Lỗi `{error}` với status 401/403 cho phiên/quyền, 404 khi không thuộc phiên/không có bài, 409 khi revision xung đột hoặc thao tác sai trạng thái, 410 khi lưu sau hạn, 422 cho dữ liệu không hợp lệ. API không nhận client time để xác định deadline. Bộ chốt chạy mỗi 5 giây và trên request; lưu/nộp dùng transaction. Frontend lấy mốc server + thời gian đơn điệu, lưu bản nháp sessionStorage khi mạng lỗi và yêu cầu xử lý rõ khi có xung đột.

Database dùng `content(id,revision)` cho questions/options/passages/exams/sections/exam_questions dạng JSON có version; `media_assets` có sẵn. Migration bổ sung standards, sources, registry, import jobs, duplicate log, attempts, answers và events; có FK/index/unique constraint. Không thêm ORM hay một hệ bảng nội dung trùng lặp.

## Kiểm thử và giới hạn nghiệm thu

Đã chạy qua:

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:hsk-exam
npm run test:browser:hsk-exam
npm run test:4chinese
$env:HSK_WEB_URL='http://127.0.0.1:3000'; npm run test:browser:4chinese
npm run data:hsk:validate
```

- HTTP/SQLite thật, runtime tạm nhỏ: migration/FK, license/schema/CSV, trùng và đáp án mâu thuẫn, parser/source timeout/hash, ẩn đáp án, phân quyền chủ bài/admin, race 200+409, expiry, idempotency, chấm/lịch sử, review/publish, sửa vô hiệu duyệt và snapshot bất biến.
- Chromium thật: lọc/danh mục, phím chọn/cờ/chuyển câu, lưu/reload, outbox mất mạng, hai tab xung đột và tải nháp/phục hồi, đồng hồ/hết giờ, xác nhận nộp, đáp án/lời giải/lịch sử, liên kết WordDetail, **MP3 giải mã và phát thật**, admin import/edit/review/publish/generate/export.
- Bộ browser HSK đã qua cả dev 3000 và bản build preview 4173. Test tự tạo/xóa runtime riêng sau khi dừng server con và kiểm tra đường dẫn; không ghi vào DB bài thi của người dùng. Khoảng 17 MB runtime từ các lượt kiểm tra trước vẫn được giữ vì lệnh dọn thủ công bị hệ thống duyệt tự động chặn (`blocked by policy`, không có lý do chi tiết).
- 4Chinese: học ba bước, chỉ ghi hoàn tất đúng ranh giới, ôn và retry/reload không chấm hai lần, bộ từ, thống kê, tìm pinyin, dữ liệu lưu hỏng được giữ để phục hồi. Cộng đồng dùng API giả lập trong browser test, không ghi lên dịch vụ thật.
- UI đã xem desktop 1440, tablet 820, mobile 390 và 320 px; ảnh tại `.impeccable/review/`. Bộ lọc phụ thu gọn, chọn cấp cuộn ngang trên mobile, phòng thi có điều hướng số thu gọn; đã sửa tràn bộ lọc kho từ cũ. Không có lỗi JS trong các luồng kiểm thử. Chưa kiểm tra Safari/thiết bị iOS thật.
- Một lần chạy detector Impeccable trên các file UI thay đổi chỉ báo hai cảnh báo lựa chọn font Plus Jakarta Sans. Giữ font hiện hữu để đồng bộ thương hiệu; đây không phải chứng nhận đầy đủ mọi trạng thái accessibility.

Chưa nghiệm thu: đề full mock/blueprint chính thức, nội dung được chuyên gia duyệt toàn bộ cấp, AI chấm viết/nói, provider AI thật, tài khoản/cloud thật và luồng phát hành câu hình ảnh mới với media riêng tư. Schema/renderer có trường hình nhưng chưa có dataset hình mới chạy hết luồng. Viết tự do chỉ lưu rubric/bài và chờ người chấm; chưa có quy trình nhập điểm người chấm hoàn chỉnh. Kho thi cũ vẫn dùng engine client; cam kết chấm/deadline server áp dụng cho `/hsk`.
