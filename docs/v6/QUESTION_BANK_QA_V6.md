# QUESTION BANK QA V6

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

## Thay đổi thực tế

178 câu V5 được giữ. Thêm 218: 80 câu tám phần thi, 4 câu bổ trợ hình/ghép nhiều dòng, 134 câu luyện ngữ pháp được viết theo từng tình huống, không sinh bằng thay danh từ hàng loạt. Tổng 396 câu; 80 nghe, 316 đọc/ngữ pháp.

| assessmentSuitability | Số |
| --- | --- |
| EXAM_CANDIDATE | 80 |
| GUIDED_PRACTICE | 130 |
| INDEPENDENT_PRACTICE | 186 |

## Backlog V5

Audit đủ 178 câu. 88 câu có cờ ban đầu; 3 cặp gần trùng theo bigram. Không kết luận toàn bộ câu có cờ đều sai. 88 câu scaffold chuyển rõ GUIDED_PRACTICE và không vào builder tám phần. 90 câu còn lại giữ luyện tập độc lập; chưa gắn part/exam suitability tự động.

| Phân loại tự động | Số mục |
| --- | --- |
| EXAM_FORMAT_MISMATCH | 178 |
| NEEDS_LINGUISTIC_REVIEW | 178 |
| OUTSIDE_LEVEL_CANDIDATE | 23 |
| POTENTIAL_DUPLICATE | 6 |
| SCAFFOLDED_PRACTICE_ONLY | 88 |

Các nhóm AMBIGUOUS_ANSWER/UNNATURAL_CONTEXT/MISSING_METADATA là checklist reviewer, chưa có bằng chứng để khẳng định số lỗi ngôn ngữ. Cờ độ dài lựa chọn, duplicate, Unicode, ID, đáp án, level segmentation có báo cáo máy đọc. 119 câu trong toàn release có token cần rà; gồm chữ trong lời hướng dẫn và classifier 杯 được taxonomy ngữ pháp00013 hỗ trợ, không phải tất cả đều vượt cấp.

Đáp án cân bằng A/B/C cho câu đơn theo batch cố định; bank được biên soạn thứ tự cố định khác nhau, không luôn A→E và không đảo riêng từng câu. Near-duplicate toàn release 4 cặp là ứng viên cần reviewer, không chứng minh trùng về nghĩa.

Bằng chứng: data/reports/v6/v5-question-backlog.json, question-diagnostics.json, level-screening.json, batches.json. Batch qua schema→snapshot preview→domain checks→NEEDS_REVIEW. E2E kiểm theo dạng/batch tiêu biểu; không tuyên bố chuyên gia đã đọc từng câu.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.
