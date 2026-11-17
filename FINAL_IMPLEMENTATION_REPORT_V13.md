# V13 · Báo cáo triển khai

Ngày: 2026-10-19. **V13_QA_PASSED — kỹ thuật local trong phạm vi tích hợp bên dưới; CONTENT PENDING FINAL HUMAN REVIEW.** Không phải production ready.

## Đã triển khai

- Contract 13.0 FROZEN cho 13 khu vực; typed DTO/adapters/callbacks, whitelist câu đang làm không có đáp án. Các bổ sung optional đều có changelog và lịch sử checksum.
- Nhận sáu batch Gemini sau `GEMINI_BATCH_ALL_READY`; sao lưu 106 file có SHA256 trước chỉnh tích hợp. Không sửa khi Gemini authoring.
- Nối Today, HSK2 hub, Vocabulary/Grammar catalogs, Practice, text choices, Writing, Result summary/skills và Mistakes vào logic hiện có, qua flag `?ui=v13` mặc định off.
- Plan, canonical IDs, SM-2, storage keys, autosave, timer/section/media recovery, grading, snapshot/CAS, journal/Web Locks giữ owner hiện có. Không thêm framework/dependency hoặc player/persistence thứ hai.
- Tách availability của câu ôn gốc khỏi số câu độc lập tương tự. Đọc bài, bỏ qua task và tự đánh giá không tạo mastery hoặc điểm HSK.
- Mock private-ready cần cả trạng thái và capability backend. Có candidate plan không đồng nghĩa được mở Mock; production gate không được nới.

## Database / migration / an toàn

Không đổi schema, không migration, không reset. V13 thêm 20 revision mới cho 20 mục từ; nội dung/status của 3.743 revision lịch sử được đối chiếu với backup. Có 40 cập nhật technical `mediaValidation.checkedAt` và một timestamp review-work do hồi quy cũ, không đổi quyết định/ghi chú/phân công. Account tables và các public/runtime media đã có được kiểm tra riêng.

**Dấu vết QA cần biết:** các scenario admin V1–V3 cũ đã tạo 5 fixture trên kho chính trước khi được cách ly toàn bộ. Hiện cả 5 đều ARCHIVED; 18 dòng audit/review kỹ thuật được giữ để truy vết, không tính là human expert review. Một số fixture generic V3 đã đi qua bước công bố trong lượt thử rồi được archive bởi cleanup. Không xóa audit hoặc reset DB để che dấu vết. Danh sách ID/revision/payload hash/review hash chính xác tại `known-qa-artifacts.json`; kiểm tra an toàn chỉ cho phép đúng 5 bản lưu trữ này, mọi phát sinh khác vẫn fail. Các test admin tiếp theo dùng API/SQLite riêng và xác nhận ID QA không có trong kho chính.

Backup trước V13: 3.914 source files và 147 runtime files; khôi phục SQLite content/account 8/2 bảng có integrity `ok`. Có một thiếu sót snapshot build ban đầu ở bốn tài liệu raw-import: harness tạo workspace riêng với supplementary docs có hash, không sửa backup gốc; log fail đầu được giữ.

Các browser QA dùng profile riêng. Không đọc/reset profile thật; đây không phải kiểm toán mọi thiết bị của người học.

## Nội dung

| Chỉ tiêu | Hiện tại |
| --- | ---: |
| Nội dung trong scope editorial | 1.359 |
| Draft | 5 |
| Needs Review | 1.354 |
| Qua automated validation | 1.359 |
| Workflow Internally Validated | 0; records vẫn Draft/Needs Review |
| Human Reviewed | 0 |
| Published | 0 |
| HSK2 word drafts | 144/200 |
| HSK2 còn thiếu ví dụ bổ sung | 56 |
| HSK2 lesson drafts | 30/71 |
| HSK2 questions | 246, không tăng |
| HSK2 transcripts / audio khả dụng | 40/0 |

20 mục từ mới là AI_GENERATED / NEEDS_REVIEW, PREVIEW, nghĩa tiếng Việt giới hạn theo ví dụ và giữ attribution của dữ liệu tham chiếu. Đối chiếu inventory với CTI không biến ví dụ tự viết thành nội dung Official. Pinyin screening: 14/20 khớp dictionary, 6 khác biệt về thanh/âm nhẹ/sandhi giữ chờ duyệt. Automated validation không phải human language/pronunciation/license approval.

HSK1 giữ 435 câu, 68 bài và 199 cờ cần chuyên môn. Không copy đề có bản quyền, không tạo audio giả đã được cấp quyền.

## Kiểm thử đã có

- Full TypeScript/lint/build và 35 mục regression V1–V13: PASS.
- Contract/adapters: 2.867 assertions; content/transaction rollback: 386; isolated API/CAS/auth/immutable release/publication: 7.541.
- V13 Chrome/Edge: 30 nhóm mỗi browser, gồm search/SRS/đọc không mastery, namespace/fallback, tải lại giữ đáp án, nộp trùng chỉ một attempt, raw writing/composition/Undo và ôn đúng câu gốc.
- Ảnh desktop/tablet/mobile tại `docs/screenshots/v13/`; ảnh đã được xem để sửa search gap và đề bài viết lặp.
- Security: 17 static/local HTTP checks PASS; không có runtime DB/token/env/model trong dist/public. Đây không phải penetration test hay live cloud RLS validation.
- Matrix 14/14 PASS, gồm V13 + legacy V1–V12, renderer stress và multi-tab sync Chrome/Edge. Matrix được resume sau sửa QA helpers; kết quả giữ lại có log gốc và kiểm tra 293 product/config/schema/editorial files không đổi. Không gọi đây là một clean run duy nhất. Source cuối 729 file được xác minh không đổi.
- Ma trận đầu gặp timeout PCM fixture V11 Edge, không có exception/console error. Nguyên nhân đầu chưa được chứng minh; không coi retry là bản sửa. Giữ nguyên timeout/assertions và media gate; chuỗi Edge V11 sau đó đạt 10/10.
- Sau đó Edge V11 đạt 10/10. Sửa microphone chỉ mount audio khi có Blob URL, key theo URL và preload auto; giữ native control và cùng owner. Edge V12 đạt 10/10 sau sửa. Full regression sau sửa vẫn 35/35 PASS.
- Scenario admin cũ thiếu chờ list refresh khi chuyển trạng thái; đã đợi đúng NEEDS_REVIEW/APPROVED/PUBLISHED và editor đóng, không bỏ gate. Toàn bộ frontend/Node API writes của nhóm V1–V3 đã được chuyển sang DB QA riêng.

## Hiệu năng

Service A/B cùng frozen DB và payload hash, trên chuỗi V9→V12 trong process: bỏ một SELECT/parse trùng trong mỗi practice request; 7→6 SQL calls, decoded rows 8.690→7.130; p95 411,1→361,9ms. Đây không phải latency HTTP/end-to-end V13. Không thêm cache lâu dài, không bỏ validation/rights checks. Chưa chứng minh đây là nguyên nhân duy nhất của regression trình duyệt trước đó.

A/B navigation trước vòng final: 20 cặp cùng profile/dữ liệu, Today/Vocabulary/Grammar/Hub đều trong budget. Lần catalog đầu đo không công bằng vì legacy marker là container rỗng; artifact được giữ, marker sửa chờ item thật. Phép đo dùng hai animation frames, không phải production Web Vitals. Vòng final bổ sung navigation câu/viết và result filters.

Vòng cuối: **7/7 WITHIN**, 20 cặp mỗi nhóm, alternating legacy/V13 cùng dữ liệu và profile. Budget = legacy p95 + max(20ms, 15%).

| Nhóm | Legacy p95 (ms) | V13 p95 (ms) | Budget (ms) |
| --- | ---: | ---: | ---: |
| Today | 49,6 | 49,6 | 69,6 |
| Vocabulary | 277,0 | 274,9 | 318,6 |
| Grammar | 249,0 | 265,8 | 286,4 |
| Hub + Practice đã render | 50,1 | 50,2 | 70,1 |
| Question navigation | 99,4 | 99,3 | 119,4 |
| Writing navigation | 99,4 | 99,7 | 119,4 |
| Result filters | 100,1 | 99,0 | 120,1 |

Ba dòng cuối đo một vòng hai thao tác. Không so thời gian đó với navigation đơn ở các dòng đầu, hoặc với các vòng cũ có dữ liệu/profile khác. Chưa đo production Web Vitals hay thiết bị thật.

## UI tiếp tục giữ renderer hiện có

- Vocabulary detail/flashcards/SM-2 queue và Grammar lesson reader.
- Audio, authenticated image loading, matching, ảnh/nghe, exam palette/timer/submit và media recovery.
- Chi tiết lời giải, tự đánh giá và luyện lại ở Result.
- Progress analytics riêng của Gemini và top-level PracticeWorkspace local question-mode chưa mount. Chưa có nguồn contract đủ để suy streak/mastery; không tạo owner exam thứ hai.

Đây là tích hợp từng presentation có parity, không thay toàn bộ frontend bằng các container tự giữ business state.

## Blocker / review còn lại

- **BLOCKED_FOR_HUMAN_REVIEW**: ngôn ngữ, cấp độ, phát âm và bằng chứng quyền media. Full Mock HSK2 vẫn NOT_READY; chưa có audio thi khả dụng.
- Cloud NOT_DEPLOYED; live Auth/RLS NOT_VERIFIED; không có staging credentials được cung cấp. Local guest/offline flow tiếp tục hoạt động.
- Không có Git repository/CI: CI NOT_RUN, không merge/deploy. Firefox/WebKit, thiết bị IME thật và assistive technology chưa xác minh.
- API/browser kiểm tra synthetic/fake fixtures không thay thế nghe duyệt, ghi âm thật hoặc review chuyên gia.

## Mở bản đang chạy

UI V13: http://127.0.0.1:4173/?view=preview&ui=v13 — nhập mã local trong `.runtime/admin-access.txt` nếu được yêu cầu, rồi chọn HSK2.

UI fallback: http://localhost:4173/?view=preview

API local: 8787; Account BFF local: 8788. Không đưa mã admin vào URL hoặc báo cáo.

Tài liệu kỹ thuật: `docs/collab/v13/`. Một folder bàn giao: `TAI_LIEU_TONG_HOP_HSK/V13_BAN_GIAO/`, có gallery ảnh và các JSON bằng chứng. Không kèm token/DB/credentials.

## Giai đoạn tiếp theo

Ưu tiên duyệt nội dung trong queue, 56 ví dụ từ vựng còn thiếu và 41 taxonomy chưa có lesson; chuẩn bị audio có quyền và duyệt phát âm; kiểm chứng staging/Auth/RLS khi có môi trường thật. Các renderer còn giữ UI cũ chỉ chuyển tiếp khi có đủ contract/callback parity. Không tăng ngân hàng câu hỏi chỉ để đạt số lượng.
