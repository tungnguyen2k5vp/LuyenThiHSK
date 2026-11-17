# HSK2 · Chất lượng và giới hạn

lúc 09:25 Chủ Nhật, 18 tháng 10, 2026 (UTC+7) · Local/private

98 câu mới, 0 lỗi cấu trúc/reference được phát hiện ở bản hiện hành. Mỗi câu có level/skill/type/difficulty/vocabularyIds/grammarIds/topicIds/taskIds/key/explanation/source/review; W1 ghi rõ liên kết ngữ pháp không áp dụng cho thành phần chữ. Difficulty là ước lượng tác giả, chưa hiệu chỉnh psychometric.

62 lời giải theo part đã được biên soạn tiếng Việt; thêm câu hỏi đích rõ cho Listening L1; sửa liên kết chủ đề của câu ăn trái cây. Giữ revision cũ và CAS khi sửa. Trong quá trình tái build, validation timestamp của embedded bank từng gây revision kỹ thuật dư; script revise hiện bỏ qua timestamp đó khi so sánh nội dung và đã kiểm chạy lại thêm 0 revision.

12/98 câu còn cờ token: địa danh, tên riêng, mảnh từ/điện và thành phần chữ. Không tự bỏ cờ hay coi là lỗi ngôn ngữ đã được chứng minh. 0 mục ví dụ bài/từ có token ngoài danh sách theo bộ tách hiện tại; đây không phải đảm bảo ngôn ngữ hoàn hảo. [Authoring screen](../../data/reports/v10/authoring-validation.json).

Heuristic chung báo INVALID_ANSWER trên 12 W2 vì không có choices; đây là **NOT_APPLICABLE_TO_MANUAL_WRITING**, không phải bằng chứng đáp án viết sai. Validator W2 kiểm sampleAnswer/pinyin/rubric riêng. Không dùng heuristic đó để đổi bài viết thành đúng/sai. Semantic equivalence, mức tự nhiên, pinyin và distractors vẫn BLOCKED_FOR_HUMAN_REVIEW.

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không phải chứng nhận ngôn ngữ, cấp HSK, quyền hay phát âm của người thật.
