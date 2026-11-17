# Minh họa chuyển động · 26/10/2026

Tham khảo [awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos), commit `92aee2f586ac0715cb3cbcb6384834f98a33383d` (703 mục). Đây là danh mục prompt/video; không phải thư viện React hoặc nguồn học liệu HSK. Đã đọc README và ba prompt:

- [Widget Animation Motion Design](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/92aee2f586ac0715cb3cbcb6384834f98a33383d/prompts/khlaseek-dsgner-877659.md): xuất hiện lần lượt, nét biểu đồ tự vẽ → minh họa trang chủ và đường thanh điệu.
- [UI Motion Loop Design](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/92aee2f586ac0715cb3cbcb6384834f98a33383d/prompts/flxrnc-251921.md): chuyển trạng thái có chủ đích → thẻ chọn thanh và phản hồi hover. Bản áp dụng dùng chuyển động hữu hạn, phù hợp màn học.
- [Interactive HTML Presentation with Narration](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/92aee2f586ac0715cb3cbcb6384834f98a33383d/prompts/drake5112-661428.md): thay đổi minh họa theo thao tác → chọn bốn thanh, xem lại nét và nghe chữ ví dụ. Không nhận là đã xem toàn bộ video.

Code SVG/CSS/React được viết mới cho HSK Journey; không nhúng video, tải tài sản của tác giả hay thêm dependency. Giữ route, dữ liệu và cơ chế lưu/chấm bài hiện có. Góc thanh điệu nằm trong **Thư viện kiến thức → Pinyin**, có đường dẫn từ trang chủ. Hình vẽ là cao độ giản lược của âm tiết đọc riêng, chưa bao quát thanh nhẹ/biến điệu và không chấm phát âm. Giọng máy dùng hàm Mandarin TTS hiện có, phụ thuộc giọng được cài trên thiết bị; chuyển động không nhận là đồng bộ chính xác với audio.

Hiệu ứng chỉ chạy ngắn, không tự phát âm thanh; CSS chỉ bật animation khi `prefers-reduced-motion: no-preference`. Điều khiển dùng nút HTML, có trạng thái chọn, focus bàn phím, tên ảnh SVG và mô tả chữ.

Kiểm tra chạy lại khi web mở ở 4173: `node scripts/test-motion-ui.mjs`. Kết quả và ảnh trong `.runtime/motion-20261026/`. Lint/build kiểm tra riêng. Backup các file cũ tại `.runtime/backups/motion-20261026/`. Không sửa HocTiengTrungApp, curriculum hay SQLite.

## Đợt mở rộng tương tác — 26/10/2026

Tiếp tục áp dụng ba hướng từ các prompt trên, bằng code viết riêng cho HSK Journey:

| Khu vực | Tương tác đã áp dụng |
| --- | --- |
| Trang chủ | Vòng từ đã đánh dấu học ở 7 cấp, đường nối cấp, vòng nhiệm vụ hôm nay; chọn ngày trong lịch để xem hoạt động thật. Bỏ qua nhiệm vụ không tăng số hoàn thành của vòng. |
| Từ vựng | Lật thẻ chữ/nghĩa có chiều sâu, nghe giọng máy theo cơ chế cũ, tiến độ phiên và 4 mức nhớ dùng SM2. Có thể học 10 từ theo bộ lọc khi chưa có từ đến hạn. |
| Ghép từ | 4 cặp có nhãn chữ/nghĩa khác nhau, chọn bằng chạm hoặc bàn phím, phản hồi thử lại/ghép được, đổi bộ, chuyển các từ vừa ghép sang thẻ. Chỉ đối chiếu nhãn tham khảo, không tính điểm thi hay tự đánh dấu học. |
| Hán tự | Tô nổi nét đang xem, tua trước/sau, thanh trượt dùng bàn phím, tạm dừng/tiếp tục, 3 tốc độ. Giữ mẫu nét, bảng viết và cách ghi tiến độ cũ. |
| Luyện kỹ năng | 5 cảnh SVG: sóng âm/tai nghe, trang đọc, đoạn truyện, chính tả và thành phần câu. Chuyển động hữu hạn khi hover/focus; không đưa minh họa vào màn đang thi. |
| Tiến độ và hoàn tất | Biểu đồ 7/14 ngày, đổi phút/lượt, chọn cột để xem chi tiết; thanh kỹ năng có hiệu ứng xuất hiện. Dấu xác nhận hữu hạn cho hoàn tất thẻ/ghép, ghi nhận luyện chữ và bản ghi kết quả, không suy ra điểm cao hay thành thạo. |

Không thêm gói animation; dùng React, CSS và SVG hiện có. Các hiệu ứng chỉ bật khi không yêu cầu giảm chuyển động. Mặt thẻ đang ẩn không được đọc thành đáp án trước khi lật; tên nút sau khi lật có cả đáp án để trình đọc màn hình truy cập. Giữ lựa chọn ẩn pinyin. Nút nhiều dòng có chiều cao tự co, bố cục kiểm tra tới 320 px.

Kiểm tra bản mở rộng: `node --import ../Rea-HSK-Reference/node_modules/tsx/dist/loader.mjs scripts/test-rich-learning.mjs` khi preview đang chạy ở 4173. **15 kịch bản / 227 bước PASS**, không console error; lint và build PASS. Bộ kiểm tra còn kiểm nhãn ghép không trùng, đổi bộ, hash storage không đổi khi chỉ ghép, lưu SM2 qua reload, chuyển ghép → thẻ, phát hết nét/tự dừng, số nhiệm vụ bỏ qua và thống kê theo ngày. Dữ liệu fixture cho lịch/biểu đồ chỉ ở profile REA dùng một lần. Ảnh trong `docs/screenshots/rich-learning-20261026/`, bằng chứng trong `data/reports/rich-learning-20261026/`.

Giới hạn giữ nguyên: nghĩa và ví dụ tham khảo chưa thành nội dung được duyệt độc lập; TTS cần giọng Mandarin của thiết bị; không đo phát âm/chấm viết tay; kiểm tra con trỏ ở lượt này là click, không phải đánh giá nét viết tự do. Kiểm thử REA dùng browser cô lập, không điều khiển Cốc Cốc người dùng và không xác minh service worker/offline trong đợt này. Chưa thay đổi trạng thái tài khoản/cloud hay triển khai production. Backup nguồn UI trước sửa: `.runtime/backups/rich-learning-20261026/`.
