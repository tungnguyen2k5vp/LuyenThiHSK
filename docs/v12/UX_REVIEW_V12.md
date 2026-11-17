# V12 · UX và visual QA

Giữ light/teal, typography/cards/5 nhóm HSK2/Exam Room. Today có CTA ưu tiên và số khả dụng; không thêm menu. Vocabulary có nghĩa/POS Việt và ví dụ không lặp hai lần; nghĩa nguồn trong phần mở rộng. Link local editorial không còn giả làm URL tài liệu chính thức: nút đối chiếu CTI ghi rõ chỉ mục lục, bản nháp do nền tảng biên soạn.

Modal grammar: nội dung dài cuộn trên mobile, Tab/Shift+Tab bao gồm summary, Escape đóng, trả focus về thẻ và giữ scroll trang. Có aria-modal/label và CTA practice có dữ liệu. Chrome/Edge kiểm 320/375/390/430/768/1280, không tràn ngang toàn trang; native keyboard và 200% root-font emulation trong phạm vi harness. Chưa audit screen reader/WCAG.

Writing giữ IME/composition handling, Unicode/multiline, autosave/restore/native undo và ungraded; không rewrite editor. Thử composition event và native Unicode không thay cho IME/bàn phím vật lý.

46 ảnh PNG cuối giải mã/pixel-check PASS; gồm Today, vocabulary mới, grammar, reading/images, writing, results, Audio Workbench, Rights Attestation, Review Queue và mobile. Fixture mic/internal mock được ghi nhãn QA, không phải nội dung nghe thật. [Gallery](SCREENSHOT_GALLERY.html).

Firefox/WebKit: không có executable/runtime phù hợp trong inventory; không tải browser lớn. Android/iOS/IME/screen reader thật: NOT_TESTED. Native voice inventory trong headless không chứng minh chất lượng giọng trên thiết bị người học.

[browser-chrome](../../data/reports/v12/browser-chrome.json) · [browser-edge](../../data/reports/v12/browser-edge.json) · [image-check](../../data/reports/v12/image-check.json)

[Kiểm tra trực quan 14 ảnh đại diện đã đóng băng kèm hash](../../data/reports/v12/visual-inspection.json). Có hai ghi chú trình bày nhỏ chưa chỉnh trong vòng này: checkbox form quyền/thu âm xếp dọc còn nhiều khoảng trống; ý nghĩa ngắn của bài 面 còn lặp lại trong giải thích. Chúng không được ghi thành lỗi đã sửa. Ảnh Writing dùng câu trả lời QA để kiểm lưu Unicode, không phải đáp án mẫu được duyệt. Pixel/decode check tất cả ảnh và kiểm tra trực quan 14 mẫu là hai phạm vi riêng.

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.
