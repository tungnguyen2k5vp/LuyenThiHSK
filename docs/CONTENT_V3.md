# Content V3 — vận hành và giới hạn

Trạng thái có thẩm quyền: [CURRENT_STATE.md](CURRENT_STATE.md). Giữ engine V2, localStorage schema 3 và preparation schema 1. Không có migration xóa dữ liệu.

## Question và review

Question V3 có revision/edition/cấp/skill/section/type/difficulty, topic/grammar/vocabulary/Hanzi IDs, passage/audio IDs, đáp án, giải thích, thời gian dự kiến, source/license, review status và timestamps. Metadata được giữ trong snapshot của bài/lượt làm. Legacy 20 câu được đề xuất tag từ vựng bằng so khớp chuỗi ở staging, chưa gán cấp học thuật hoặc tự coi là Published V3.

Workflow câu hỏi, grammar, audio, template và exam:

`DRAFT → NEEDS_REVIEW → LANGUAGE_REVIEW → HSK_LEVEL_REVIEW → APPROVED → PUBLISHED → ARCHIVED`

AI_GENERATED mặc định NEEDS_REVIEW. Mỗi bước cần reviewer và nhận xét; lưu reviewer/timestamp/stage trong content_reviews. Sửa tạo revision mới, không thay nội dung revision cũ. Admin token local không xác minh danh tính reviewer như hệ thống RBAC; tên reviewer là khai báo có audit.

Publish kiểm tra đáp án/options, dạng câu, metadata reference tồn tại, độ khó, giải thích, Unicode NFC, pinyin có dấu khi dùng, câu trùng, license/evidence và file audio. Câu mở cần rubric và sample. Độ mơ hồ và mức phù hợp học thuật vẫn cần người duyệt. qualityScore 100 là vượt gate kỹ thuật, không phải điểm thẩm định ngôn ngữ độc lập.

## Coverage và đề thi

`minimumQuestionCoverage` ở shared/content-quality.mjs là mục tiêu sản phẩm nội bộ, không phải syllabus. Admin Question Coverage có level × skill × type × difficulty và cảnh báo thiếu nội dung.

Generator nhận template/pool/seed, sắp pool ổn định, chọn không lặp ID/nội dung/passage và giới hạn mật độ grammar. Khóa question ID/revision, template ID/revision và seed. Validator đối chiếu section/quota/time/scoring/source, snapshot, Published status và audio có quyền. Refresh không tạo lại đề: session dùng examSnapshot đã lưu.

Chỉ có reference cấu trúc full HSK 4 truyền thống được thêm gate V3 trong đợt này, từ trang CTI ngày15/10/2026. Không dùng nó cho HSK3 syllabus2025. Form có nút điền reference; reviewer vẫn kiểm tra quy tắc audio/điều hướng. **0 full mock production**. Hệ thống còn cần triển khai và thẩm định chi tiết khoảng thủ tục/chuyển đáp án trước khi khẳng định mô phỏng thi thật đầy đủ. Các test 100 câu là fixture, không phát hành.

## Audio

Upload tối đa12MB, WAV/MP3/OGG/WEBM/M4A; kiểm magic bytes, SHA256, WAV chunks/duration. Browser decoder kiểm playable/thời lượng, xác nhận lưu riêng theo hash. File trong `.runtime/media`, không ở public/static; chỉ AudioAsset Published được phục vụ qua `/api/media/…`. File draft có preview Blob tại admin; không công khai. Chưa có antivirus hoặc media transcoding; không triển khai endpoint local này ra Internet.

AudioAsset giữ source/license/evidence, storage URL/hash/duration, speaker/accent, transcript, level/edition/review. Inventory phát hiện file thiếu, orphan và duplicate hash. Thay audio tạo asset mới; sửa metadata tạo revision. Không tự crawl URL ngoài hoặc phát hành TTS thành audio thi. Browser decode là bằng chứng kỹ thuật; chất lượng phát âm, transcript và quyền vẫn do reviewer kiểm tra. **0 audio thi thực được duyệt**; file âm thanh QA là fixture.

## Vocabulary

`npm run data:cleanup` tách primaryMeaningVi/secondaryMeaningsVi/meaningEn/POS/classifier/notes/examples/levelMappings; giữ raw meaningVi để trace. Detect HTML, dictionary markup, encoding, placeholder, machine annotation, nghĩa dài/lặp, thiếu VI/nghi vấn ngôn ngữ. Chạy lại ổn định, không dịch hoặc duyệt tự động. Card/quiz dùng nghĩa ngắn; nghĩa khác mở trong chi tiết.

11.000 mục: 8.765 qua quy tắc chuẩn hóa, 2.235 cần kiểm tra; 557 thiếu VI, 758 chưa chọn được nghĩa Việt ngắn an toàn. Các số cuối có giao nhau. NORMALIZED không có nghĩa bản dịch đúng học thuật. Không có bản dịch AI được công bố để làm số thiếu giảm giả.

## Grammar

576 taxonomy items, 0 lesson đã duyệt; 8 lesson draft và8 bài luyện khác nhau chỉ ở data/staging. Lesson cần title/meaning/pattern/usage/explanation, examples có pinyin/dịch, lỗi/so sánh/prerequisite/quan hệ. Admin có form, trạng thái incomplete, staging import idempotent và gate. Sau công bố, learner hiển thị lesson và nút luyện các question Published cùng grammar ID bằng engine cũ. Bấm đã đọc chỉ ghi nhận đã ôn, không tự gọi là mastery học thuật.

## Analytics và daily plan

Session/attempt có questionOpenedAt/firstAnswerAt/finalAnswerAt/timeSpentMs/answerChangeCount/flagCount. Đo thời gian hoạt động, checkpoint5giây và khi trả lời/chuyển câu/ẩn tab/pagehide/nộp; không tính background/audio pause/thời gian browser đóng. Không có timing cho lượt cũ. Background vẫn dùng quy tắc đồng hồ thi V2, không tự dừng deadline.

Weakness phân theo skill/type/grammar/topic/vocabulary, ngưỡng3mẫu. Score nội bộ kết hợp tần suất/lần sai mới/độ khó/lỗi lặp/thời gian/khắc phục; confidence giảm theo tuổi dữ liệu. Tag chưa có thì không suy diễn. Plan snapshot hằng ngày ưu tiên review lỗi, so sánh nghe/đọc7ngày khi mỗi kỹ năng có≥5câu trả lời; có lý do và giới hạn ngân sách. Chưa có weekly rebalance/multi-skill placement hoàn chỉnh. Readiness giữ gate bằng chứng V2.

## Auth/cloud

Không thêm nhà cung cấp hay credential giả. Guest/local recovery tiếp tục. Chưa triển khai tài khoản/email/OAuth, cloud sync/RLS/merge nhiều thiết bị; vẫn là blocker production được ghi rõ.
