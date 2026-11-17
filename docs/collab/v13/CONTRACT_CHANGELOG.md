# UI Contract changelog

## 13.0 · FROZEN · 2026-10-19

- Thêm DTO/props/callback cho Today, hub, vocabulary, grammar, practice, question, writing, result, mistakes, audio và exam navigation/submit.
- Không transport/database/persistence/credential trong DTO. Active question không có answer keys; feedback có authorization từ owner.
- CONTRACT_READY. Typed adapters PASS TypeScript + 2.847 assertions. Baseline 32/32 PASS; snapshot documentation omission được ghi riêng, không che lỗi đầu.
- Chốt ngày/edition/skipped và onSkipTask trước freeze theo Gemini request. Arbitrary targetRoute, fabricated readiness/streak/consistency và audioUrl/player riêng không được chấp nhận.
- Sau freeze chỉ bổ sung optional không breaking, ghi change request/batch; xóa/đổi tên cần cả hai bên xác nhận handoff.

Contract requests: Codex chỉ đọc `docs/collab/v13/gemini/CONTRACT_REQUESTS.md`; phân loại existing data / adapter / business change / unavailable / not allowed. Không tạo dữ liệu giả để đáp ứng layout.

## 13.0 · bổ sung optional cho Batch 3 · 2026-10-19

- VocabularyExplorerProps thêm optional onFavorite/onLearnWord/onPlayWord/onStartReview/onStartQuiz; tất cả chuyển về owner hiện có. Không tạo player, hàng đợi hoặc SRS thứ hai.
- VocabularyExplorerVM.learnedCount và GrammarCatalogVM.masteredCount là aggregate optional của toàn bộ cấp, không suy từ trang đang hiển thị. Nếu thiếu dữ liệu, bridge hiện unknown/null.
- Không xóa/đổi tên field bắt buộc. Chữ ký contract ban đầu được giữ trong lịch sử khi cập nhật checksum sau test.
- Private Gemini model hỗ trợ nullable unknown metrics và việc dùng modal/reader do owner điều khiển. Đây là thay đổi sau explicit GEMINI_BATCH_ALL_READY; snapshot bàn giao gốc giữ nguyên.

## 13.0 · bổ sung optional cho Review · 2026-10-19

- MistakeItemVM.reviewAvailability mô tả khả năng mở lại chính câu gốc, tách khỏi số câu độc lập tương tự. Câu nghe thiếu audio vẫn bị chặn; bài viết chưa chấm vẫn có thể xem lại.
- MistakeReviewProps.onReviewQuestion optional nhận review ID, được owner xác minh cấp/câu/media trước khi gọi luồng ôn hiện có. Không tạo mastery, SRS hoặc write path mới.
- Checksums trước mỗi thay đổi được lưu trong contract-freeze-history; manifest mới chỉ ghi sau assertions gắn SHA256 của đúng contract hiện tại.
