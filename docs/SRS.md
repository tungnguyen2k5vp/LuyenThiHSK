# SRS V2

Giữ thuật toán SM-2 hiện có; tổng quát hóa type để dùng cho cả từ cá nhân và từ catalog. Lại/Khó/Tốt/Dễ tương ứng quality 1/3/4/5. Lần thành công đầu cách 1 ngày, lần hai 6 ngày; các lần sau theo interval × ease với chặn biên. Khi quên, repetitions về 0 và ôn lại sau 1 ngày.

Sửa lỗi validator cũ: ease factor tăng tự nhiên trên 3 không còn khiến từ cá nhân bị loại khi reload. Regression test kiểm tra ease 4.1 được giữ; thuật toán SM-2 không bị giới hạn sai theo validator cũ.

Từ cá nhân vẫn ở wordEntries thuộc schema 3. Catalog chỉ lưu tiến độ theo id/revision nguồn trong hsk-preparation-v1, không chép 11.000 từ vào localStorage. Đến hạn theo dueAt. Favorite và đã học độc lập. Chưa migrate FSRS; không mất lịch SM-2 cũ.
