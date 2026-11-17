# Testing V3 — 15/10/2026

Baseline V2 và bản V3 đã qua:

|Lệnh|Kết quả|
|---|---|
|npm run typecheck|PASS|
|npm run lint|PASS — TypeScript unused/compiler, chưa có ESLint|
|npm test|PASS — storage/migration/scoring/SM-2 core|
|npm run test:v2|PASS — module V2|
|npm run test:admin|PASS — API/revisions/idempotence V2 với license gate mới|
|npm run test:v3|PASS — quality/license, deterministic pool/full quotas/revision locks, lexical normalization, timing/background, weakness/search|
|npm run test:v3-api|PASS — import/review/publish/build, media upload/validation/private draft/public approved, grammar, queues/audit/conflict|
|npm run check:content|PASS — 20 unique legacy questions, 0 full mock release|
|npm run build|PASS|
|npm run test:browser|PASS — V2 và V3 critical E2E, không runtime exception|

## E2E đã chạy

- V2: timer/audio error/recovery/autosave/reload/timeout/section navigation, nộp một lần, đáp án/lịch sử, nhiều tab, offline, CSV/SM-2; onboarding/course/diagnostic/writing/Hanzi.
- V3: nghĩa ngắn/pinyin search, form thay JSON mặc định, preview dùng engine thật, missing translation queue/coverage, reviewer và license block, WAV được browser giải mã/upload, timing persist.
- Grammar fixture: review/publish lesson + question → mở bài học có ví dụ/lỗi → luyện câu Published bằng engine → trả lời/kiểm tra/nộp/kết quả.
- Learner 9 màn và admin 4 màn tại 320/375/390/430px: không tràn ngang.
- Normalizer chạy lại giữ checksum đầu ra; không giảm giả missing translations.
- Khởi động khi chặn hoàn toàn Google Fonts vẫn hiện ứng dụng. Font tải không chặn script; HTML có trạng thái mở ứng dụng trước khi React mount.

## Fixture và giới hạn

Unit có fixture 100 câu để kiểm full quota/validator; không phải content được phát hành. API test dùng SQLite/temp directory riêng và xóa sau khi xác minh đường dẫn. Browser dùng Chrome profile riêng; các record QA trên local admin được archive trong finally, file QA không phải audio thi. Ảnh bài grammar fixture ghi rõ trong tên file.

Đã phát hiện/sửa lỗi pagehide ghi đè deadline vừa cập nhật trong persisted session, sau đó chạy lại các ca timeout/resume. Speech double chỉ kiểm logic TTS; browser decoder kiểm định dạng/playability của file, chưa thẩm định giọng nói hoặc âm thanh thiết bị thật. Microphone, STT, cloud E2E và mọi browser ngoài Chrome chưa kiểm.

Ảnh hiện hành: `docs/screenshots/exam-focus/v3-*`. Ảnh lỗi của lần QA trước được lưu ở thư mục debug, không mô tả bản hiện hành.
