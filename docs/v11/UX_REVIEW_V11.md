# V11 · UX và accessibility

2026-10-18 T03:48:50.865 Z

Giữ light/teal/typography/cards/desktop navigation/mobile5 nhóm. Sửa specificity để HSK2 nav5 cột áp dụng thật; main CTA Today rõ, chi tiết kỹ thuật nằm trong thông tin mở rộng/admin. Bổ sung source-aware POS, counts động và related learning sau kết quả.

Ảnh practice không bị kết luận lỗi từ screenshot loading: E2 E xác minh tải đủ/natural Width/alt, chặn request tạo error, retry thành công, đổi câu nhanh không giữ ảnh cũ. Fetch hiện có Abort Controller/timeout/revoke Blob; giữ logic đang hoạt động, không thêm speculative prefetch. Lazy loading không áp dụng cho hình câu hiện tại bắt buộc; ảnh cần hiện ngay.

Chrome/Edge:6 viewport320/375/390/430/768/1280, writingfocus/Unicode/nativeundo/redo/compositionevent/autosave/count/no fullpageoverflow; native Tab/focus, labels,≥44 pxprimarynavtargets,200%root-font emulation. [A11 y Chrome](../../data/reports/v11/accessibility-chrome.json) · [Edge](../../data/reports/v11/accessibility-edge.json). Đây không phải WCAGcertification hoặc screen-reader audit.

IME/bàn phím/Android/i OS vật lý và Voice Over/Talk Back/JAWS **NOT_TESTED**. Mobile bottomnav không render khi đang Exam Room; không suy điều đó thành đã kiểm bàn phím thật. Dashboard media dùng class riêng sau khi phát hiện selector collision với queue cũ; failure giữ riêng. [Gallery](SCREENSHOT_GALLERY.html).

Nội dung tự tạo giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Automated validation không phải human review, xác minh quyền, phát âm hay chứng nhận chính thức CTI.
