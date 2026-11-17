# FINAL_IMPLEMENTATION_REPORT_V5

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Kết quả

**TECHNICALLY BETA READY / CONTENT PENDING FINAL HUMAN REVIEW** cho HSK 1 private Preview. Chưa công bố nội dung hoặc deploy public.

| Loại | Tổng | Draft | Needs Review | Internally Validated | Human Reviewed | Published |
|---|---:|---:|---:|---:|---:|---:|
| vocabulary | 300 | 0 | 300 | 300 | 0 | 0 |
| grammar | 68 | 0 | 68 | 68 | 0 | 0 |
| questions | 178 | 0 | 178 | 178 | 0 | 0 |
| audio | 40 | 0 | 40 | 40 | 0 | 0 |
| templates | 1 | 0 | 1 | 1 | 0 | 0 |

## Đã thực hiện

- Backup source và SQLite, chạy baseline và hồi quy.
- Đọc mẫu CTI, ghi bằng chứng theo từng quy tắc; giữ Platform Practice vì format/audio chưa đủ.
- Phân loại riêng64cờ V4, rà300 từ/68 bài/178 câu/40 audio; 386 mục trong pinyin queue và276diff có before/after/reason.
- Thêm30 câu đọc và20 câu grammar qua2batch; có45 câu đọc contextual và40 câu nghe đủ điều kiện chọn vào full practice mock.
- Builder tránh recent questions/passages, cân bằng và khóa seed/revision; giữ engine/snapshot cũ.
- QC40PCM,3 audio revision riêng; Chrome/Edge decode40 file. Azure adapter tắt mặc định, chưa có audio Azure thực.
- Review UI riêng với Save&Next, Skip, NeedsCorrection, high-risk, revision compare, notes, assignment và issue queue6 nhóm.
- Gói586 mục HTML/CSV kèm audio riêng cho reviewer; không tự approve.
- Learner warning gọn, bottom nav, vocab next/keyboard/related practice; grammar mastery dựa answers; tích hợp lại study plan cũ.
- Harden local API, đề xuất production architecture và test guest merge foundation; chưa giả lập thành cloud sync hoàn chỉnh.

## Mở website và tài liệu

- Học thử: http://127.0.0.1:4173/?view=preview
- Duyệt nội dung: http://127.0.0.1:4173/?view=content-review
- [README/cách chạy](README.md) · [Tài liệu tập trung](TAI_LIEU_TONG_HOP_HSK/00_MUC_LUC.md)
- [Gói duyệt riêng](.runtime/review-packages/v5/index.html) · [CSV](data/review-packages/v5)
- [Readiness](docs/v5/V5_RELEASE_READINESS.md) · [Tests](docs/v5/TEST_REPORT_V5.md)

## Kiểm tra và giới hạn

Core/API/domain/build xem [final-regression](data/reports/v5/final-regression.json). Chrome/Edge V5 PASS; có kiểm tra audio tải chậm, lỗi, reconnect, autoplay rejection và offline blob. Không có Lighthouse, Firefox/Safari hoặc mobile thật.

- **BLOCKED_FOR_HUMAN_REVIEW:** cần duyệt ngôn ngữ, nghĩa Việt, pinyin, cấp độ, đáp án, distractor và phát âm.
- **AUDIO_RIGHTS_UNVERIFIED:** giọng huayan có nguồn dữ liệu huấn luyện Unknown; chỉ dùng Preview riêng.
- **AUTHENTIC_MOCK_INCOMPLETE:** còn thiếu nhóm câu ảnh/matching và quy tắc audio, điều hướng đã xác minh.
- **PRODUCTION_BACKEND_BLOCKED:** chưa triển khai account auth, RBAC, session, HTTPS, cách ly người dùng và vận hành cloud.
- **CROSS_DEVICE_PENDING:** chưa có Firefox/Safari và thiết bị Android/iOS thật để kiểm tra.

Không sửa project Android HocTiengTrungApp, không reset DB/tiến độ và không nâng AI thành Human Reviewed. Nội dung gốc/premium/CTI không bị sao chép vào sản phẩm. Người duyệt có thể đọc gói, ghi đề xuất, sửa revision và approve từng bước khi sẵn sàng.


> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.
