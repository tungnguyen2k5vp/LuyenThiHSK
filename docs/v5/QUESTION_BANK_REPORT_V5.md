# QUESTION_BANK_REPORT_V5

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Số liệu

178 câu original AI-assisted: 40 nghe và138đọc/ngữ pháp. V4 có128 câu. Batch1 thêm30 câu đọc:20MC,5true-false,5fill-blank; batch2 thêm20 câu ngữ pháp.

Batch1 qua schema/domain220 assertions và ChromeE2E trước khi tích hợp batch2. [Bằng chứng batch1](../../data/reports/v5/v5-hsk1-batch-1-tests.json) · [Chrome batch1](../../data/reports/v5/browser-chrome-v5-hsk1-batch-1.json).

Pool full mock gồm40 câu nghe và45 câu đọc theo ngữ cảnh (20cũ+25mới). 5fill-blank mới và88 câu grammar hỗ trợ không tự coi là authentic mock.

Mỗi câu có level,skill,questionType,difficulty,vocabularyIds,grammarIds,topicIds,correctAnswer,explanation,sourceType,reviewStatus. Vocabulary links dùng token thay substring. AI answerVerified=false; chỉ chấm tự động trong Preview theo đáp án tự rà.

## Quality audit

88 câu có cờ scaffold/option-length/structural và3 cặp có bigram similarity≥0.52. Đây là gợi ý rà soát, không chứng minh các câu còn lại độc lập về sư phạm. Cần kiểm ambiguous answers, từ đồng nghĩa, độ khó và distractor. cq028 bỏ cue “水果”, cq001 thay option公司 bằng大学生 để các lựa chọn cùng nhóm người/nghề.

[Diagnostics](../../data/reports/v5/question-diagnostics.json) · [CSV câu hỏi](../../data/review-packages/v5/questions.csv) · [revision diff](../../data/reports/v5/final-revision-diffs.json). Không sao chép câu CTI/premium vào ngân hàng.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.
