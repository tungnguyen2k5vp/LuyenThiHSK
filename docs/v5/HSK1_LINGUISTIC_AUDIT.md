# HSK1_LINGUISTIC_AUDIT

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Phạm vi

Đã rà bằng dữ liệu và quy tắc tự động: 300 mục từ, 68 bài ngữ pháp, 178 câu hỏi và 40 audio. Human expert reviewed =0. Không gọi kiểm tra tự động là kiểm duyệt ngôn ngữ.

64 mục V4 đều có quyết định riêng. Số lượt cờ theo nhóm dưới đây có thể chồng lấp:

- CLASSIFIER_GRAMMAR_SUPPORT: 19
- BEYOND_LEVEL: 41
- HARDER_GRAMMAR_STRUCTURE: 3
- SEGMENTATION_FALSE_POSITIVE: 13
- CLASSIFIER_OUT_OF_LEVEL: 6
- PROPER_NAME: 15

[Từng mục, cờ, hành động và before/after](../../data/reports/v5/v4-flags-classified.json). [Diff đầy đủ của 276 mục](../../data/reports/v5/final-revision-diffs.json).

## Sửa nội dung có chủ đích

Thay 27 ví dụ từ để giảm từ vượt cấp hoặc cấu trúc khó; tách nghĩa phụ cho 15 mục; sửa 9 câu theo danh sách biên tập và distractor nghề nghiệp của cq001. Bỏ comparison sao chép explanation ở 68 bài, giữ 6 bài có đối chiếu được viết riêng. Câu nghe cq028 bỏ ràng buộc “trái cây” để người học không đoán đáp án chỉ qua nhóm lựa chọn.

## Cách đọc cờ

Tên 小王/小李/小张 không tự coi là vượt cấp. 杯/次 có thể được taxonomy ngữ pháp hỗ trợ. 有时间, 新手机, 八点十分, 请再说 cần tách theo ngữ cảnh, tránh longest-match sai. Mẫu CTI cũng có 后面 dù headword được lưu ở cấp khác: danh sách từ không phải quy tắc cấm tuyệt đối cho mọi câu.

Pinyin queue có 386 mục. Chỉ sinh lại pinyin cho câu đã sửa/câu mới, giữ pinyin headword từ CTI. Citation tone và biến điệu khi nói phải phân biệt. Đa âm, 一/不, thanh nhẹ, cách ghép từ và biến điệu thanh ba vẫn cần người nghe/đọc duyệt; không tự đánh dấu hoàn tất.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.
