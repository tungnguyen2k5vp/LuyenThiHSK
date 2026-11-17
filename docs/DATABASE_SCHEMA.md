# Database schema đích

Đây là schema chuẩn hóa cho backend PostgreSQL/Supabase của sản phẩm. **Chưa phải migration SQL đã áp dụng**: repository hiện chưa có backend, Supabase project hoặc credentials. Client hiện tại dùng schema localStorage riêng, xem `studyStorage.ts`.

## Quy ước chung

- Khóa chính UUID; `created_at`, `updated_at`; timestamp UTC.
- `syllabus_versions` là dimension độc lập. HSK 2.0, chuẩn HSK 3.0 năm 2021, syllabus 2025 và các phiên bản tương lai có ID khác nhau.
- Mỗi content row có `data_source_id`, `source_version`, `rights_status`, `verification_status`, `retrieved_at`, `attribution`, `content_hash`.
- Level mapping là quan hệ nhiều-nhiều, có edition/source riêng; không suy cấp từ bản dịch hoặc chỉ từ chữ Hán.
- `question_answers` ở vùng server-only. Không trả đáp án chuẩn vào payload thi trước thời điểm chấm.
- Tệp audio/ảnh/ghi âm nằm trong object storage; DB chỉ giữ metadata, URL nội bộ, hash, codec, duration và quyền.

## Người dùng và phân quyền

| Bảng | Khóa/liên kết | Vai trò |
|---|---|---|
| `auth.users` | Supabase Auth | Credential / identity provider.
| `profiles` | `user_id → auth.users.id` | Tên hiển thị, locale, timezone, mục tiêu/ngày, level mục tiêu.
| `admin_users` | `user_id → auth.users.id` | Role `content_admin`, `reviewer`, `support`; chỉ service role/quản trị viên cấp quyền.

## Nguồn và syllabus

| Bảng | Trường cốt lõi |
|---|---|
| `data_sources` | `id`, tên, URL, source type, publisher, license, rights status, checksum, ngày truy xuất, ghi chú.
| `syllabus_versions` | `id/code`, năm/edition, ngày công bố/hiệu lực/ngưng dùng, trạng thái `draft/trial/active/retired`, nguồn CTI, verification note.
| `hsk_levels` | `id`, `syllabus_version_id`, `level_code`, số cấp hoặc nhóm 7–9, nhãn, thứ tự, tiêu chí xác minh.
| `data_imports` | source/version, người vận hành, file hash, dry-run/commit/rollback, số dòng đọc/nhập/bỏ/trùng/lỗi, trạng thái và thời điểm.
| `data_validation_reports` | import ID, rule/code version, severity, record key, field, message, evidence.
| `audit_logs` | actor/role, entity, entity ID, action, before/after hash, timestamp; tránh ghi secret hoặc nội dung nhạy cảm.

## Nội dung học

| Bảng | Khóa/liên kết | Ghi chú |
|---|---|---|
| `vocabulary` | source, owner tùy phạm vi | giản thể/phồn thể, canonical key, pinyin, POS, visibility, verification status.
| `vocabulary_level_mapping` | vocabulary × HSK level | Nhiều cấp/edition; provenance và trạng thái đối chiếu nằm trên mapping.
| `vocabulary_meanings` | vocabulary × language × sense | Nghĩa nhiều ngôn ngữ, thứ tự nghĩa, nguồn nghĩa riêng.
| `vocabulary_examples` | vocabulary, source | Hanzi, pinyin, bản dịch, locale, quyền câu ví dụ.
| `hanzi` | character, source | simplified/traditional variant, radical, stroke count, provenance.
| `hanzi_level_mapping` | hanzi × HSK level | Phân loại nhận biết/viết và trạng thái xác minh.
| `hanzi_radicals` | hanzi × radical | Radical ID/biến thể và thứ tự.
| `hanzi_strokes` | hanzi × stroke index | Dữ liệu path/animation asset và license riêng.
| `grammar_points` | source, owner tùy phạm vi | mã điểm ngữ pháp, tên, giải thích, contrast/notes, visibility/status.
| `grammar_level_mapping` | grammar × HSK level | Edition và nguồn xác minh.
| `grammar_examples` | grammar × example | Câu, pinyin, dịch, nguồn/quyền.
| `topics`, `topic_level_mapping` | topic × HSK level | Chủ đề syllabus, bản dịch/nhãn app và mapping provenance.
| `tasks`, `task_level_mapping` | task × HSK level | Năng lực/tác vụ theo syllabus; không nhầm với dạng câu hỏi.
| `skills`, `question_types` | danh mục | listening, reading, writing, speaking, translation và loại câu theo version.
| `passages` | source, audio/image asset tùy chọn | Đoạn nghe/đọc, transcript, asset/license.
| `audio_assets` | source, object storage key | Hình thức, codec, duration, attribution, hash và quyền.

## Question bank và đề thi

| Bảng | Khóa/liên kết | Vai trò |
|---|---|---|
| `question_sets` | source, syllabus version, level | Nhóm câu có provenance và trạng thái duyệt.
| `questions` | set, passage/audio, skill, question type | Prompt, nội dung render, thứ tự, status, checksum.
| `question_options` | question × option ID | Nội dung lựa chọn; không chứa cờ đúng/sai.
| `question_answers` | question | Answer key/rubric ở schema server-only, không cấp quyền `select` cho role client.
| `exam_templates` | syllabus version, level | Blueprint được version và xác minh độc lập.
| `exam_sections` | template × skill | Thứ tự, thời lượng, hướng dẫn, timing/navigation policy.
| `exam_section_rules` | section | Số lượng/dạng câu, thứ tự, audio policy, rule version.
| `mock_exams` | template × question set | Đề do admin lắp ghép; status draft/reviewed/published/retired.

## Tiến độ người học

| Bảng | Khóa/liên kết | Vai trò |
|---|---|---|
| `exam_attempts` | user × mock exam | Bắt đầu/kết thúc, mode, deadline, state, syllabus snapshot.
| `exam_section_attempts` | attempt × section | Thời gian/điểm/trạng thái phần.
| `user_answers` | attempt × question | Câu trả lời, thay đổi/lưu cuối; owner qua attempt.
| `writing_answers`, `speaking_answers` | answer | Bản nộp, rubric/self-review hoặc trạng thái chờ chấm; asset ghi âm ngoài DB.
| `exam_scores` | attempt × skill | Raw/normalized score, scoring method và version; không tự gọi điểm mô phỏng là điểm CTI.
| `user_skill_stats`, `user_level_stats` | user × version × skill/level | Snapshot analytics, source attempt window và updated time.
| `mistakes`, `mistake_reviews` | user × question/answer | Lý do sai, độ ưu tiên, lịch ôn và lịch sử review.
| `review_cards`, `review_history` | user × vocabulary/grammar/hanzi | Scheduler/ease/interval/next review và grade history; thuật toán có version.
| `study_plans`, `study_plan_items` | user × plan × content | Mục tiêu, ngày, loại hoạt động, status.
| `daily_goals`, `user_streaks` | user × local date | Mục tiêu và chuỗi ngày theo timezone người dùng.
| `achievements`, `user_achievements` | catalog × user | Rule version, thời điểm đạt; tùy chọn, không ảnh hưởng điểm thi.
| `bookmarks`, `notifications` | user × entity | Đánh dấu và thông báo; có opt-out.

## Index và ràng buộc

- Unique: `(syllabus_version_id, level_code)`, `(vocabulary_id, hsk_level_id)`, `(question_set_id, stable_question_key)`, `(attempt_id, question_id)`, `(user_id, vocabulary_id)`.
- Lookup: content theo `level_id`, `syllabus_version_id`, `verification_status`, `visibility`; câu hỏi theo `question_type`, `skill`, `status`; người dùng theo `user_id`, `created_at`; SRS theo `(user_id, next_review_at)`; đáp án theo `exam_attempt_id`.
- GIN chỉ thêm sau khi query/search profile chứng minh cần; kiểm tra `EXPLAIN ANALYZE` trước tối ưu hóa.
- FK content dùng `RESTRICT` hoặc soft-retire; không cascade xóa dữ liệu source/attempt đã công bố.

## RLS và bảo vệ đáp án

- Bật RLS cho tất cả bảng có dữ liệu người học. Policy select/insert/update/delete yêu cầu `auth.uid() = user_id` hoặc quyền admin qua function security-definer có `search_path` cố định.
- Không cho người dùng tự sửa role; grant role qua service role và ghi audit.
- Public content chỉ đọc được khi được duyệt **và** có quyền phù hợp. `official_verified` là trạng thái học thuật, không phải license phân phối.
- `question_answers`, answer keys, rubric nhạy cảm và staging imports không có policy client `select`; chấm qua server endpoint.
- Admin import dùng staging → dry-run → reviewer approval → publish; mọi rollback giữ import report và historical IDs.

