# V7 · HSK2 blueprint

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

## Evidence

Nguồn CTI: https://www.chinesetest.cn/syllabus → kho mẫu https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip, member HSK/HSK（二级）样卷.pdf. SHA256 920396379b9795c1b5aadb3820ec74e3e606a49d1444043394e7475a35b4bf9c. Đọc text và render kiểm trang; không tái sử dụng câu/hình/audio. Cover PDF page1: 25 nghe khoảng17phút,25đọc25phút,10viết10phút,3phút chuyển đáp án,5phút thông tin, tổng khoảng60phút; chỉ phạm vi paper sample.

| Part | Skill | Câu | Type | PDF pages |
| --- | --- | --- | --- | --- |
| L1 | listening | 5 | picture-choice | 3,4 |
| L2 | listening | 10 | matching | 5,6 |
| L3 | listening | 10 | dialogue | 7 |
| R1 | reading | 5 | matching | 10 |
| R2 | reading | 5 | shared-options | 11 |
| R3 | reading | 10 | shared-options | 12,13 |
| R4 | reading | 5 | short-passage | 14,15 |
| W1 | writing | 5 | shared-options | 18 |
| W2 | writing | 5 | short-answer | 19 |

L2 và R3 gồm hai bank5câu; bank thứ nhất6lựa chọn, bank thứ hai5. Không dùng quota 8×5 của HSK1. Pinyin trong bài Viết là nội dung đề, cần xử lý khác hint. W1 component glyph accessibility và W2 short-answer qua registered renderer còn cần QA trước kích hoạt.

## Xung đột nguồn

PDF mẫu p18/19 đánh số W1 51–55, W2 56–60. PDF đáp án p2 lại in W1 54–58, W2 59–63; SHA256 4bb64c8d61a3b385c66cce19222edafbd6149d8542339fbaa4bf04487bc7dbfd. Không tự reindex để giả verified. Scoring/IBT/replay và khóa part chưa xác minh.

HSK2 giữ DATA_ONLY: 200 từ riêng cấp2, tích lũy500 cùng cấp1,71grammar,125hanzi trong dataset hiện tại; public/data không đổi. Không có question bank/audio HSK2 mới. Blueprint/authoring checklist dùng registry/review/media/grading hiện có, không tạo engine mới. HSK3–9 giữ config versioned DATA_ONLY và parts=[] khi chưa có evidence.

Authoring: chọn đúng edition/part → original draft và liên kết vocabulary/grammar/topic → registry/answer/media validation → preview/stress → human language/level/media/rights review đúng revision → publication gate. Không auto-approve.
