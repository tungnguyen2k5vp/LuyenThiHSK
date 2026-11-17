# V8 · Bàn giao người duyệt

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

Gói HSK1_CONTENT_REVIEW_V8.zip là dữ liệu editorial riêng. Gồm JSON đầy đủ, batches A–D, flagged/grammar/audio/images CSV, checklist/instructions, decisions template, revision manifest, HSK2 pilot và audit draft mới. Không chứa token, dữ liệu học viên, PDF CTI hay binary audio chưa rõ quyền.

1. Mở batch20 câu; kiểm tiếng Trung, pinyin, ngữ cảnh, cấp, uniqueness/distractors và media.
2. Ghi căn cứ vào notes; sửa bằng revision mới.
3. Export lại sau thay đổi; giữ revision/fingerprint/workVersion.
4. Dry run import, xử lý mọi stale conflict trước khi gửi lại cả batch.
5. Người có quyền thực hiện Language → HSK Level → Approval; publisher và publication gate độc lập.

Không có reviewer hiện tại: human=0, published=0. BLOCKED_FOR_HUMAN_REVIEW không chặn biên soạn/Preview/test. Checkbox checklist và AI validation không được tính là chuyên gia đã duyệt.
