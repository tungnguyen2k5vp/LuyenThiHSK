# LuyenThiHSK · Báo cáo V11

## Đã triển khai

- **HSK 2: 176 câu hỏi**, gồm 116 câu theo phần thi và 60 câu luyện ngữ pháp. Có 136 câu khả dụng cho đọc, viết và ngữ pháp.
- **16 bài ngữ pháp nháp**; cả 16 bài có ít nhất 5 câu độc lập khả dụng theo kiểm tra tự động. Hai bài 别 và 完/懂/好 đã tăng từ 4 lên 6 câu.
- **44/200 mục từ được bổ sung** nghĩa và ví dụ, tăng 24 mục trong V11. Giữ ID gốc, SRS và lịch sử học.
- Dashboard quyền của 80 WAV/30 SVG; queue chất lượng 200 từ; metadata audio theo mục đích, transcript revision và generation parameters; sửa player tải audio V10 bằng xác thực.
- Today, gợi ý ôn theo câu có thật, kết quả liên kết ngữ pháp/từ vựng và các cổng mở Full Mock. Endpoint V10 cũ cũng dùng gate V11.
- Fixture phòng thi 60 câu chạy trên Chrome và Edge: audio, lỗi phát/khôi phục, chuyển phần, tự lưu, refresh/resume, nộp bài và ôn lỗi. Kết quả tách **55 câu chấm tự động / 5 câu chưa chấm**. Fixture không vào ngân hàng thật.

## Trạng thái nội dung

| Tổng bản ghi | Draft | Needs Review | Automated Valid | Human Reviewed | Published |
| --- | --- | --- | --- | --- | --- |
| 1175 | 5 | 1170 | 1175 | 0 | 0 |

Automated Valid và workflow có thể chồng lấn; không cộng các cột thành tổng. HSK 1 giữ 435 câu, 68 bài và 199 cờ chờ quyết định chuyên môn.

**Sẵn sàng beta kỹ thuật cho khu học riêng Reading/Writing/Learning; nội dung chờ duyệt chuyên môn.**

Audio HSK 2 hiện **0/40 khả dụng**. Đã chuẩn bị 5 transcript PoC nhưng chưa tạo giọng vì thiếu điều kiện runtime/quyền voice và output/provider phù hợp. Không gọi dịch vụ trả phí hoặc tải model mới. Full Mock thật vẫn **NOT_READY**; cloud **NOT_DEPLOYED**. Quyền media, phát âm và ngôn ngữ chưa có người duyệt. Không publish hoặc gắn nhãn Official.

## Kiểm thử và hiệu năng

- **29/29** bộ hồi quy và **10/10** nhóm trình duyệt đạt.
- **396** unit assertions, **73** API checks; 10 lượt liên tiếp mỗi bộ unit/API/Chrome/Edge đạt, không retry trong chuỗi cuối.
- 36 ảnh giải mã được, kiểm tra pixel và xem ảnh đại diện. Có kiểm tra bàn phím/focus/alt/target size/text scaling; không chứng nhận WCAG.
- p95 mở bài lượt đo riêng: **201.5 ms**. Lượt đầu **268,6 ms** vượt ngân sách được giữ để đối chiếu; nguyên nhân dao động chưa được chứng minh. Không thay mã hiệu năng giữa hai lượt đo.
- CI, Firefox/WebKit, thiết bị Android/iOS và IME/screen reader thật chưa kiểm tra; live Auth/RLS chưa xác minh.

## Mở web và tài liệu

- [Mở HSK Preview](http://127.0.0.1:4173/?view=preview): nhập dòng cuối của .runtime/admin-access.txt, rồi chọn HSK 2. Mã đổi khi API khởi động lại. Dùng HTTP, không mở dist/index.html bằng file://.
- [Toàn bộ bàn giao trong một folder](TAI_LIEU_TONG_HOP_HSK/V11_BAN_GIAO/README.md).
- [Mục lục 18 báo cáo](docs/v11/README.md) · [Gói duyệt offline](data/review-packages/v11/MO_DE_DUYET.html) · [Ảnh Chrome/Edge](docs/v11/SCREENSHOT_GALLERY.html).
- [Readiness và các blocker còn lại](docs/v11/V11_RELEASE_READINESS.md).
