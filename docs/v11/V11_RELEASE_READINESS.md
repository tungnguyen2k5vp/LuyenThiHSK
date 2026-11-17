# V11 · Readiness và blocker

**Beta kỹ thuật riêng cho Reading/Writing/Learning; nội dung chờ duyệt chuyên môn.** Chưa Production Ready, chưa triển khai cloud và chưa mở Full Mock HSK 2 bằng nội dung thật.

| Tổng | Draft | Needs Review | Automated Valid | Human Reviewed | Published |
| --- | --- | --- | --- | --- | --- |
| 1175 | 5 | 1170 | 1175 | 0 | 0 |

Các chiều automated/workflow có thể chồng lấn. Không cộng các cột thành tổng.

## Đã có

- HSK 1 giữ ổn định: 435 câu, 68 bài, hai bộ 40 câu, 199 cờ chờ chuyên môn.
- HSK 2: 176 câu; 16 bài nháp có ít nhất 5 câu độc lập; 44/200 mục từ được bổ sung; review queue và gates hoạt động.
- Candidate 60 câu và fixture phòng thi 60 câu đã qua Chrome/Edge. Fixture tách khỏi ngân hàng thật.
- 29/29 regression; 10/10 nhóm trình duyệt; 10 lượt liên tiếp mỗi unit/API/Chrome/Edge đạt.

## Blocker còn lại

1. Audio HSK 2: 40 transcript, 0 file khả dụng. PoC chuẩn bị 5 transcript; chưa đủ runtime và bằng chứng quyền voice/output hoặc cấu hình provider để tạo audio hợp lệ.
2. Media: 80 WAV chưa rõ quyền, 30 SVG gốc chờ bằng chứng. Chưa có review phát âm thật.
3. Chưa có người duyệt ngôn ngữ, đáp án và cấp HSK; không gắn Human Reviewed hoặc Published.
4. Full Mock thật còn 25 câu thiếu audio, 24 asset ảnh chờ quyền, 25 câu chờ phát âm và 60 câu chờ language/level review. Các nhóm chồng lấn.
5. Cloud chưa có staging được cấp quyền/cấu hình để kiểm Auth/RLS/HTTPS và hai thiết bị thật. CI, Firefox/WebKit, Android/iOS/IME/screen reader thật chưa kiểm tra.
6. Thời lượng 52 phút và 2 lượt nghe là quy định luyện tập của nền tảng; chưa xác minh quy tắc IBT hay điểm HSK tương đương.

Lượt đo hiệu năng đầu có spike; lượt đo lại khi rảnh trong ngân sách. Giữ cả hai và theo dõi, không coi benchmark local là khả năng chịu tải production.

Nội dung AI vẫn ở NEEDS_REVIEW; kiểm tra tự động không thay duyệt chuyên môn.

[Báo cáo tổng](../../FINAL_IMPLEMENTATION_REPORT_V11.md) · [Kiểm thử](TEST_REPORT_V11.md) · [Audio PoC](AUDIO_POC_REPORT.md).
