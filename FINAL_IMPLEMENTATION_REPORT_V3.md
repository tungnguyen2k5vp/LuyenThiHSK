# FINAL IMPLEMENTATION REPORT V3

Ngày **15/10/2026** · `D:/ReactJS/LuyenThiHSK`.

**V3 đã triển khai một đợt nâng cấp infrastructure và các luồng P0; chưa hoàn tất toàn bộ brief hoặc đạt production readiness.** Nguồn trạng thái duy nhất: [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md). Không có full mock/audio production hay bản dịch được tự duyệt để làm đẹp số liệu.

## 1. Baseline V2

React19/TS/Vite, Node24/SQLite local admin; 20 câu legacy, 11.000 vocabulary, 576 taxonomy grammar, 3.088 Hanzi. Baseline compiler/lint/unit/content/API/build/browser/mobile đều PASS. Backup trước sửa ở `.runtime/backups/before-v3-2026-10-15`.

## 2. Modules preserved

Giữ timer, section navigation, answer sheet, audio gate/recovery, autosave/resume, submit một lần, chấm khách quan/tự đánh giá, history/mistakes, SM-2, onboarding, Today, writing drafts, ghi âm và light/teal design. Mở rộng engine bằng timing optional, không rewrite engine. Private admin preview gọi chính ExamRoom và AttemptResult.

## 3. Data migration

Giữ core localStorage schema3/key cũ và preparation schema1; thêm trường optional cho timing/endedBy/task reason. Lượt cũ không có timing vẫn đọc được. SQLite thêm `content_reviews`, `audit_details`, `media_assets` và indexes bằng CREATE IF NOT EXISTS. Không DROP, reset hoặc chuyển dữ liệu người học sang server. File upload theo SHA256 trong `.runtime/media`.

## 4. Vocabulary cleanup

Đã audit/normalize cả11.000 mục. Tách nghĩa ngắn/phụ, English, POS, classifier/notes/examples/mapping; giữ raw để trace. Learner card, review, quiz và practice dictionary dùng nghĩa ngắn; phần mở thêm chứa nghĩa phụ. Search nhận Hanzi, xuexi, xue xi, xuéxí và Việt có/không dấu.

|HSK|Total|Qua quy tắc normalization|Needs review|Missing VI|Chưa có nghĩa ngắn an toàn|
|---|---:|---:|---:|---:|---:|
|1|300|165|135|5|22|
|2|200|113|87|3|29|
|3|500|293|207|9|33|
|4|1000|682|318|16|47|
|5|1600|1209|391|40|65|
|6|1800|1509|291|50|84|
|7–9|5600|4794|806|434|478|
|Tổng|11000|8765|2235|557|758|

NORMALIZED là kiểm tra kỹ thuật, không phải xác nhận đúng nghĩa. Các cột missing/no-short có giao nhau. Báo cáo: [VOCABULARY_CLEANUP_REPORT.md](VOCABULARY_CLEANUP_REPORT.md), `data/reports/vocabulary-cleanup-v3.json`. Chạy lại cho cùng checksum đầu ra đã được kiểm tra.

## 5. Missing translations

**557 → 557**, chưa giảm. Admin có Missing Translation Queue, form sửa, revision/review/publish và ghi nguồn/quyền. Không tự dịch rồi công bố. 758 mục chưa chọn được nghĩa ngắn an toàn, gồm cả mục có raw nhưng cần xử lý; UI báo chờ rà soát thay vì dump dữ liệu. Pipeline hoạt động; công việc biên tập nghĩa còn thiếu.

## 6. Grammar lesson completion

576 taxonomy items. **Complete approved/published lessons:0; draft lessons:8; taxonomy chưa có lesson draft:568.** 8 draft có giải thích Việt, cấu trúc/cách dùng, 2ví dụ kèm pinyin/dịch, lỗi, so sánh, quan hệ và8câu luyện riêng. Toàn bộ draft ở staging, không public tự động. Form có incomplete gate và review ngôn ngữ/cấp. Lesson Published được ghép vào learner catalog, trình bày theo bài học và mở câu Published cùng grammar ID bằng engine cũ. Có thể ghi đã ôn; chưa có grammar mastery model chuẩn hóa.

## 7. Question Bank counts

20 câu legacy tiếp tục dùng minh họa V2. 8 câu grammar mới chỉ ở NEEDS_REVIEW. Tổng inventory28, **Published theo chuẩn V3:0**. Không tính quiz từ điển sinh theo yêu cầu thành ngân hàng thi production.

|Cấp|Listening Published V3|Reading Published V3|Writing Published V3|Draft mới|
|---|---:|---:|---:|---:|
|1|0|0|0|8 reading/grammar|
|2|0|0|0|0|
|3|0|0|0|0|
|4|0|0|0|0|
|5|0|0|0|0|
|6|0|0|0|0|
|7–9|0|0|0|0|

20 legacy chưa xác minh edition/cấp được giữ ở unverified, không ép vào bảng cấp để tăng coverage. Metadata queue đề xuất vocabulary IDs bằng khớp chuỗi; còn cần reviewer xác minh topic/grammar/difficulty/level.

## 8. Question coverage matrix

Admin có level × skill × type × difficulty, Published/NeedsReview/MissingAudio/MissingExplanation và Ready/NeedsMoreContent. Config `minimumQuestionCoverage` là mục tiêu nội bộ. Ma trận đầy đủ: [QUESTION_BANK_REPORT.md](QUESTION_BANK_REPORT.md), `data/reports/question-coverage-v3.json`.

## 9. Audio asset counts

**Audio thi thực được Published:0.** Có pipeline upload thực, browser decoder/playability, duration, hash/dedup, transcript/source/license/speaker/accent và inventory thiếu file/orphan. File QA tổng hợp được archive, không dùng học/thi và không tính vào coverage.

## 10. Audio license status

Upload không đồng nghĩa có quyền. Publish yêu cầu licenseStatus VERIFIED, evidence, transcript/metadata, file tồn tại, hash khớp và decoder đã kiểm tra. TTS/AI_GENERATED bị chặn cho audio thi. File draft chỉ preview trong admin bằng Blob; endpoint media công khai chỉ phục vụ AudioAsset Published. Chưa có bộ audio được cấp quyền/phát âm đã thẩm định.

## 11. Full Mock status

**Full mock production:0.** [MOCK_READINESS_REPORT.md](MOCK_READINESS_REPORT.md) ghi mọi cấp NOT READY. Không gọi mini là full. Catalog thêm loại bài/độ khó/best accuracy/last attempt, không gọi raw percentage là điểm HSK. Thiếu nội dung đã duyệt và audio vẫn chặn tạo đề.

## 12. Mock validator

Template/pool/section rules tách khỏi component. Seeded generation ổn định, khóa question/template revisions, kiểm quota/skill/type/time/scoring/duplicate/source/license/audio và snapshot không bị sửa. Có reference cấu trúc HSK4 truyền thống với part quotas, kiểm từ CTI15/10/2026; không gán cho syllabus2025. Những edition/cấp chưa có full reference bị chặn. Fixture100câu xác minh generator/validator, không phát hành. Quy trình khoảng thủ tục/chuyển đáp án và thẩm định audio/navigation còn cần hoàn thiện trước khi tuyên bố mô phỏng thi thật đầy đủ.

## 13. Weakness Engine changes

Thêm phân tích skill/type/grammar/topic/vocabulary khi≥3mẫu có metadata. Score nội bộ xét lỗi/lỗi mới/lặp/độ khó/thời gian/khắc phục, confidence giảm theo tuổi dữ liệu. Recovery giảm ưu tiên; không xóa lịch sử sai. Similar practice ưu tiên cùng grammar rồi topic/vocabulary/type trong pool thật. Hiện legacy thiếu tag nên insight học thuật còn hạn chế; không giả nhãn.

## 14. Diagnostic changes

Giữ diagnostic vocabulary V2 và dùng nghĩa ngắn sạch trong câu quiz. **Chưa triển khai placement25–40câu đa kỹ năng** vì chưa đủ pool/audio đã duyệt. Không đưa confidence82% hoặc estimated full HSK dựa vào dữ liệu không có.

## 15. Study Plan changes

Ưu tiên review sai, kế hoạch giữ snapshot/ngân sách/ngày thi. So sánh nghe/đọc7ngày khi mỗi bên có≥5câu trả lời, chọn kỹ năng yếu hơn nếu có pool và giải thích bằng số liệu. Không làm thay đổi kế hoạch sau mỗi câu. Chưa có weekly deep rebalance, dùng đầy đủ diagnostic đa kỹ năng hoặc mock production.

## 16. Result analytics changes

Ghi questionOpenedAt/firstAnswerAt/finalAnswerAt/timeSpentMs/answerChangeCount/flagCount; checkpoint5giây và các thao tác chính. Không tính thời gian tabẩn/audio pause/browser đóng vào active time; deadline thi giữ quy tắc cũ. Kết quả có câu lâu nhất/trung bình phần từ≥3mẫu và câu trống lúc timeout. Lượt cũ thiếu timing không bị điền giả. Đã sửa và regression-test lỗi pagehide ghi đè deadline ngoài storage.

## 17. Auth/cloud changes

**Chưa triển khai auth/cloud sync/email/OAuth hoặc RLS runtime.** Local API không phải cloud account. Không dùng credential giả hoặc LWW merge giả. Guest và local recovery giữ nguyên. Cần dự án backend/định danh và kiểm tra merge đa thiết bị ở phase riêng.

## 18. Admin changes

Structured forms mặc định cho word/grammar/question/audio/template/Hanzi; JSON Advanced. Reviewer/comment/timestamp, revision audit before/after, queues, coverage, audio upload/validation, seeded builder và preview cùng engine. Import phân new/update/duplicate/conflict/invalid, update cần revision đúng, checksum replay idempotent. Bulk tag/level endpoint tạo revision draft; chưa có bulk review/publish UI đầy đủ, drag-and-drop exam builder hoặc RBAC reviewer nhiều vai trò. Tên reviewer local do người dùng khai báo.

## 19. Tests

Baseline V2 và các bộ unit/API/build V3 đã PASS; browser V2+V3 critical flows đã PASS, mobile320/375/390/430px không overflow. V3 test có fixture riêng cho review/license gate, deterministic generator/full quotas/immutable locks, audio signatures/duration/private media, lexical cleanup, timing/background, weakness recovery và search. API integration dùng DB tạm; fixture trên browser local được archive sau QA. Chi tiết cập nhật cuối: [docs/TESTING.md](docs/TESTING.md). Chưa kiểm microphone vật lý hoặc mọi trình duyệt/thiết bị.

## 20. Performance

Không thêm dependency runtime. Admin/course/diagnostic/response lazy chunks, catalog từng cấp và render từng trang. Build: main JS409,91kB (gzip125,61kB), CSS64,38kB (gzip13,31kB); admin36,54kB (gzip11,56kB), course17,41kB (gzip6,03kB). HTML1,70kB; font ngoài tải không chặn ứng dụng, đã kiểm khi chặn Google Fonts. Shard7–9 lớn6.235.007bytes; chưa có server indexed search/pagination cho dataset, Lighthouse/WebVitals/p95 chưa đo.

## 21. Security

Loopback bearer token không nằm trong bundle; Unicode token comparison dùng byte length đúng. PreparedSQL, payload4MB/import2000rows, media12MB/magic check/hash/path allowlist; không crawl URL tùy ý, không public raw/staging/draft media. Các record có review/audit, sửa tạo revision. Chưa có rate limit/RBAC multi-user/antivirus/transcoding/backupcloud; không triển khai local server ra Internet. LocalStorage/IndexedDB không mã hóa; app tự học có đáp án client, không phải thi giám sát.

## 22. Known limitations

Không hoàn tất toàn bộ110mục brief: content academically approved chưa tăng; normalization không thay review; grammar8draft/576; audio/full0; diagnostic đa kỹ năng/cloud/writingAI/speakingAI chưa làm. Một số form template phần nâng cao vẫn cần JSON. Full timing thủ tục/chuyển đáp án cần thẩm định riêng.

## 23. Remaining content gaps

557 nghĩa thiếu,2.235mục cần rà kỹ thuật/ngôn ngữ,99glyph thiếu; bài grammar giải thích/practice đã duyệt cho576cấu trúc; question/audio theo từng blueprint và kỹ năng; metadata legacy; writing/speaking prompts đã duyệt. Không dùng premium bank, sách thương mại, official test hoặc dataset không có quyền để lấp khoảng trống.

## 24. Exact production blockers

1. Reviewer ngôn ngữ/cấp HSK và quyền phải xác minh nội dung thật; hiện0câu Published V3,0lesson,0audio thi được duyệt.
2. Cần pool đủ quota/đa dạng và audio hợp lệ trước khi có full mock thật; reference HSK3 mới cần xác minh riêng.
3. Full simulation cần hoàn thiện/chứng minh thủ tục, chuyển đáp án, scoring/audio/navigation theo edition.
4. Cần triển khai auth/RBAC/RLS/cloud sync/conflict merge và kiểm nhiều thiết bị trước sản phẩm online nhiều người dùng.
5. Cần đánh giá học thuật, nghe thật, thiết bị thật, hiệu năng và vận hành/backup. Các test fixture không chứng minh content production.

Nguồn đối chiếu cấu trúc: [CTI HSK4](https://www.chinesetest.cn/HSK/4), [CTI syllabus](https://www.chinesetest.cn/syllabus). Nguồn kỹ thuật decoder: [MDN media metadata](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event). Giấy phép học liệu giữ trong public/THIRD_PARTY_NOTICES.md và public/ARPHICPL.TXT.
