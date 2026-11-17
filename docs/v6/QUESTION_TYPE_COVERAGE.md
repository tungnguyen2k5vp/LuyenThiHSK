# QUESTION TYPE COVERAGE

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

Registry có 13 loại; release HSK1 hiện dùng 11 loại. Hai loại tự luận/nói giữ engine và rubric V1–V5, không tự chấm như câu khách quan.

| Loại | Số câu HSK1 | Renderer/serializer |
| --- | --- | --- |
| multiple-choice | 68 | choice / string |
| true-false | 17 | choice / string |
| picture-choice | 10 | picture / string |
| picture-true-false | 2 | picture / string |
| matching | 22 | matching / choice-or-canonical-map |
| shared-options | 20 | shared-bank / string |
| short-passage | 20 | choice / string |
| dialogue | 10 | choice / string |
| fill-blank | 161 | choice / string |
| grammar-practice | 40 | choice / string |
| sentence-order | 26 | choice / string |
| short-answer | 0 | choice / string |
| speaking | 0 | choice / string |

Schema máy đọc: schemas/question-types-v1.schema.json. Validator: shared/question-types.mjs; serializer ghép nhiều dòng là JSON map sắp khóa, đáp án còn lại giữ chuỗi nên không đổi storage format. Grading: shared/question-types.mjs + examScoring.ts. Review preview dùng cùng ExamRoom, không có engine mới.

32 câu có hình; 22 câu matching, trong đó 2 câu ghép nhiều dòng bổ trợ; 40 câu liên kết bank. Các dạng bổ trợ không được gọi dạng thi CTI nếu chưa có evidence.

Keyboard 1–6 cho một lựa chọn; Tab/arrow/Enter với native select/button; F đánh dấu; Reset; báo ghép chưa đủ trước submit. Ảnh có alt tương đương nội dung nhìn thấy, không ghi mã đáp án. Bài đã làm giữ optionBank/options/image hashes trong snapshot. Unit/schema/serialization/scoring/recovery: 1733 assertions.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.
