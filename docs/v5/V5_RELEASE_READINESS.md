# V5_RELEASE_READINESS

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Kết luận

**TECHNICALLY BETA READY / CONTENT PENDING FINAL HUMAN REVIEW** cho HSK 1 private Preview/Beta kỹ thuật. Chưa phải public beta, production ready hoặc authentic HSK test.

| Loại | Tổng | Draft | Needs Review | Internally Validated | Human Reviewed | Published |
|---|---:|---:|---:|---:|---:|---:|
| vocabulary | 300 | 0 | 300 | 300 | 0 | 0 |
| grammar | 68 | 0 | 68 | 68 | 0 | 0 |
| questions | 178 | 0 | 178 | 178 | 0 | 0 |
| audio | 40 | 0 | 40 | 40 | 0 | 0 |
| templates | 1 | 0 | 1 | 1 | 0 | 0 |

Internally Validated là counter chồng lấp với Needs Review; không cộng thành tổng mới. Draft enum0 vì các bản nháp đã chuyển sang bước NEEDS_REVIEW, không có nghĩa nội dung đã được giáo viên duyệt.

## Blocker còn lại

- **BLOCKED_FOR_HUMAN_REVIEW:** cần duyệt ngôn ngữ, nghĩa Việt, pinyin, cấp độ, đáp án, distractor và phát âm.
- **AUDIO_RIGHTS_UNVERIFIED:** giọng huayan có nguồn dữ liệu huấn luyện Unknown; chỉ dùng Preview riêng.
- **AUTHENTIC_MOCK_INCOMPLETE:** còn thiếu nhóm câu ảnh/matching và quy tắc audio, điều hướng đã xác minh.
- **PRODUCTION_BACKEND_BLOCKED:** chưa triển khai account auth, RBAC, session, HTTPS, cách ly người dùng và vận hành cloud.
- **CROSS_DEVICE_PENDING:** chưa có Firefox/Safari và thiết bị Android/iOS thật để kiểm tra.

HSK1=INTERNAL_BETA(private), CONTENT_PENDING_FINAL_HUMAN_REVIEW. HSK2–9=DATA_ONLY. Không xóa dataset11.000 word/576 grammar/3.088 hanzi và chưa sản xuất hàng loạt cấp mới. READY_FOR_PUBLICATION/PUBLIC chưa đạt.

PRODUCTION vẫn cần expert review, quyền sử dụng VERIFIED, revision hợp lệ, template/questions được approve và backend production. DEV/PREVIEW cho phép NEEDS_REVIEW; BETA yêu cầu validation và internal self-check, luôn hiển thị Beta.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.
