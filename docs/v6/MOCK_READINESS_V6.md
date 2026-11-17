# MOCK READINESS V6

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

## Kết quả

Pool tám phần:80 câu,10 câu/part; tối đa2 bộ40 câu không trùng. Không tạo số đề độc lập giả bằng đảo thứ tự. Hai seed với recent IDs được kiểm overlap=0. Lượt tiếp theo nếu cạn pool có repeatedIds/warnings và thông báo cho người học.

| Part | Pool | Nhóm đủ | Bộ độc lập | Blocker kỹ thuật |
| --- | --- | --- | --- | --- |
| L1 | 10 | — | 2 | Không |
| L2 | 10 | — | 2 | Không |
| L3 | 10 | 2 | 2 | Không |
| L4 | 10 | — | 2 | Không |
| R1 | 10 | 2 | 2 | Không |
| R2 | 10 | 2 | 2 | Không |
| R3 | 10 | 2 | 2 | Không |
| R4 | 10 | — | 2 | Không |

Builder khóa question IDs/revisions, thứ tự options, option bank revisions, image/audio refs. Media/hash/schema/options count/part type/group quota/fingerprint được kiểm trước dùng. Grading ghép nhiều dòng yêu cầu đủ và đúng toàn bộ; chưa chấm điểm từng cặp như điểm HSK.

Production gate kiểm Published coverage cho từng part, human review theo revision, quyền sử dụng, assets/banks Published, loại private image delivery. Hiện0 câu APPROVED_EXAM_CONTENT/Published; cả tám part vẫn thiếu nội dung production. Full Mock hiện là PLATFORM PRACTICE / BETA, 35 phút tùy chỉnh; cấu trúc dạng câu có evidence nhưng playback/IBT/scoring còn chưa xác minh.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.
