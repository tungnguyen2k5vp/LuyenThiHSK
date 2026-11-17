# V12 · Trạng thái bàn giao

**FUNCTIONAL LOCAL QA PASSED · PERFORMANCE ATTENTION cho khu học riêng Reading/Writing/Grammar/Vocabulary · CONTENT PENDING FINAL HUMAN REVIEW.** Full Mock nội dung thật chưa mở, production và cloud chưa sẵn sàng.

| Hạng mục | V11 | V12 | Thay đổi |
| --- | --- | --- | --- |
| HSK 1 câu / bài | 435 / 68 | 435 / 68 | Giữ nguyên |
| HSK 2 câu | 176 | 246 | +70 câu ngữ pháp gắn 14 bài, không thêm phần thi |
| Câu theo 9 phần | 116 | 116 | Giữ nguyên |
| Bài ngữ pháp | 16 | 30 | +14 |
| Bài có ≥5 câu độc lập | 16 | 30 | +14 |
| Mục từ được bổ sung | 44 | 124 | +80; giữ ID gốc |
| Audio HSK 2 khả dụng | 0 | 0 | Chưa có output giọng đủ điều kiện |
| Editorial hiện hành | 1175 | 1339 | +164; revision sửa không tăng số ID |
| Human Reviewed / Published | 0 / 0 | 0 / 0 | Không tự vượt gate |

| Editorial hiện hành | Draft | Needs Review | Automated Valid | Human Reviewed | Published |
| --- | --- | --- | --- | --- | --- |
| 1339 | 5 | 1334 | 1339 | 0 | 0 |

Workflow/automated validation chồng lấn; không cộng các cột. Không gọi AI multi-pass là human approval.

## Đầu vào còn thiếu

1. Audio: người thu thật chủ động hoặc provider/runtime/quyền được cấp phù hợp; 5 transcript và 25 candidate jobs sẵn để sản xuất. Hiện 0 output nghe đủ điều kiện. Không tải model/gọi paid API trong vòng này.
2. Quyền: owner/người được ủy quyền xem 30 SVG có lineage và 80 WAV còn unknown, ký scope; 24 ảnh chặn candidate.
3. Ngôn ngữ/cấp/phát âm: mọi bản nháp còn chờ người thật; candidate còn 60 language+60 level+25 pronunciation pending, các nhóm chồng lấn. Không hỏi lại reviewer để dừng việc độc lập.
4. Coverage: còn 76 từ chưa example, 41 taxonomy chưa lesson, 79 từ thiếu practice liên quan; giữ queue và số thật.
5. Cloud/CI/devices: cần môi trường/credential được cấp để chạy Auth/RLS/HTTPS và hai thiết bị; CI/Firefox/WebKit/physical IME/AT chưa được kiểm.
6. CTI IBT/scoring: 52 phút/2 lượt nghe vẫn platform policy; Writing manual/ungraded không là chấm điểm HSK chính thức.

## Chạy và kiểm tra

Mở [HSK Preview](http://127.0.0.1:4173/?view=preview), nhập dòng cuối `.runtime/admin-access.txt` rồi chọn HSK 2. Mã đổi khi API restart; dùng HTTP, không mở dist/index.html bằng file://. [Runbook](BACKEND_STAGING_V12.md) · [Kiểm thử](TEST_REPORT_V12.md) · [Audio](AUDIO_DECISION.md).

Hiệu năng còn 6/17 chỉ số vượt budget ở lượt riêng; chưa xác minh nguyên nhân. Không tuyên bố đã đạt đầy đủ tiêu chí hiệu năng hoặc production readiness. [Hai lượt đo](PERFORMANCE_REPORT_V12.md).

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.
