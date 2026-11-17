# HSK1_LEVEL_SCREENING

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

V4 có 64 mục bị đánh dấu. V5 đã scan 546 mục văn bản; 32 mục có cờ cần xem. Hai số không dùng để tính tỷ lệ “cải thiện” vì V5 thêm 50 câu, scan cả options và đổi thuật toán.

Tokenizer dùng dynamic programming, ưu tiên tổ hợp headword HSK1. Các từ ghép vị trí 前边/后边/里边/外边 có nhãn GRAMMAR_DERIVED; tên riêng có ngữ cảnh được gắn PROPER_NAME. UNKNOWN không được tự coi là HSK1.

[Token/cờ toàn bộ nội dung](../../data/reports/v5/level-screening.json) · [quyết định riêng cho 64 mục V4](../../data/reports/v5/v4-flags-classified.json).

## Nguồn bổ sung đã kiểm tra

- [krmanik/HSK-3.0](https://github.com/krmanik/HSK-3.0): phân biệt dữ liệu2025 và2021; wordlist/CEDICT có CC BY-SA4, code MIT. Không áp dụng giấy phép code cho tài liệu CTI.
- [complete-hsk-vocabulary](https://github.com/drkameleon/complete-hsk-vocabulary): giấy phép repo không thay thế nghĩa vụ của dữ liệu CEDICT; mapping cộng đồng2021 không tự chuyển thành2025.
- [ivankra/hsk30](https://github.com/ivankra/hsk30): nguồn cộng đồng2021, cần xem lịch sử upstream; không giả định tài liệu nhà nước tự động public domain.

Không sao chép code/câu hỏi từ ba repo này trong V5. Hồ sơ 15 repo đã nghiên cứu ở vòng trước được giữ, không tuyên bố tái audit toàn bộ15repo trong vòng này. CTI vẫn là nguồn ưu tiên.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.
