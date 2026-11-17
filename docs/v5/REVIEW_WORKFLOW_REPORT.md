# REVIEW_WORKFLOW_REPORT

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Review UI

Route /?view=content-review tách khỏi learner. Có pagination20, tìm/lọc loại, high-risk≥40, source/level/license/checks, sửa revision với conflict409, xem revision trước, ghi chú, Save&Next, Skip, NeedsCorrection, progress và phân công tối đa100 mục. Không bulk approve.

PENDING/NOTED/SKIPPED/NEEDS_CORRECTION là trạng thái công việc riêng, không phải human review. Từng bước LANGUAGE_REVIEW→HSK_LEVEL_REVIEW→APPROVED→PUBLISHED yêu cầu reviewer thực, nhận xét và xác nhận. API đã sửa trường hợp vocabulary thiếu reviewer/comment. Sửa revision làm hết hiệu lực validation; chạy lại validator không tạo human review. Local token vẫn là trust của máy cá nhân, chưa có RBAC production.

## Gói đọc cho reviewer

586 mục=300 từ+68 bài+178 câu+40 audio. CSV ở data/review-packages/v5. HTML/CSV kèm40WAV ở .runtime/review-packages/v5/index.html. Có pinyin, nghĩa Việt, ví dụ/options/đáp án, nguồn, cờ, điểm ưu tiên và ô reviewer/correction/comment/disposition. Ghi chú lưu local và xuất CSV. Audio hiển thị cùng transcript. Template1 nằm trong admin, ngoài gói586.

CSV là đề xuất; áp dụng sửa vào từng revision trong admin, không tự nhập approval. Content Issue Queue có6 nhóm lỗi, ID idempotent và local pending để gửi lại khi kết nối. RiskScore chỉ ưu tiên đọc, không chứng nhận chất lượng. Ghi chú QA được ghi rõ technical test, không tính Human Reviewed.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.
