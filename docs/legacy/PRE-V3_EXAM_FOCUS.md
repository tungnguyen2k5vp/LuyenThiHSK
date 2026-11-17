# LEGACY / PRE-V3 — không dùng làm trạng thái hiện hành

Nguồn trạng thái: ../CURRENT_STATE.md.

# Luyện thi HSK

> Tài liệu snapshot ngày 11/10/2026. Ngày 15/10/2026 sản phẩm được mở rộng lại theo yêu cầu mới: hiện có dashboard cục bộ và không gian từ vựng cá nhân. Tài liệu hiện hành là [README](../README.md) và [báo cáo triển khai](../FINAL_IMPLEMENTATION_REPORT.md); nội dung bên dưới chỉ ghi lại cấu hình exam-only trước đó.

React 19, TypeScript, Vite. Luồng sản phẩm: chọn phiên bản/cấp → chọn bài hoặc phần → làm bài → kết quả/lời giải → luyện câu sai. Không có backend, đăng nhập, thanh toán hay đồng bộ đám mây.

## Chức năng

- Menu: Đề thi, Luyện từng phần, Ôn câu sai, Lịch sử làm bài. Thông tin nguồn ở footer.
- Bộ lọc phiên bản/cấp/phần được lưu trong URL, hỗ trợ tải lại và back/forward; dạng câu ở bộ lọc nâng cao.
- Bài luyện từng câu mở lời giải sau kiểm tra. Bài có giờ giữ kín lời giải và bản chép bài nghe đến khi nộp.
- Kiểm tra âm thanh trước khi tạo hạn giờ. Audio có trạng thái tải/sẵn sàng/phát/lỗi; lỗi âm thanh tạm dừng thời gian và bảo toàn bài. Khôi phục rồi tiếp tục. TTS được ghi rõ là giọng máy, không phải audio thi chuẩn.
- Tự lưu câu trả lời, vị trí, đánh dấu, hạn giờ và lượt nghe. Tải lại không đặt lại thời gian; hết giờ nộp một lần.
- Desktop có bảng câu theo phần; mobile mở bảng trong panel. Nút điều hướng nằm trong trang, không che bàn phím. Phím 1–4 và mũi tên bỏ qua ô nhập và sự kiện IME.
- Sắp xếp câu dùng nhập tiếng Trung, chấm theo đáp án văn bản đã kiểm tra. Viết/dịch/nói chưa chấm để tự đánh giá. Tỷ lệ đúng ghi rõ mẫu số câu chấm được; không quy đổi điểm HSK hay đỗ/trượt.
- Kết quả theo phần; sai, bỏ trống và chưa chấm được tách; mở lời giải, làm lại bài, luyện câu sai. Lịch sử mở/làm lại/xóa từng lượt. Ôn câu sai khử trùng và giữ riêng từng phiên bản.
- Production cache giao diện để mở lại offline sau lần tải online. Audio và giọng máy offline phụ thuộc thiết bị.

Đã gỡ module giao diện từ vựng, flashcard, tra nét, lịch ôn từ, heatmap, streak, dashboard và biểu đồ tuần. Gỡ dependency lucide-react không còn dùng. Tài liệu nguồn/giấy phép được giữ.

## Dữ liệu thực tế

Ba ngân hàng gốc chứa **20 câu duy nhất**: 5 câu HSK 2.0, 10 câu HSK 3.0 chưa xác minh cấp, 5 câu minh họa nhóm 7–9. Bộ luyện tổng hợp và từng phần dùng cùng ngân hàng; không tính thành các đề độc lập. **0 đề đầy đủ đủ điều kiện**.

Tám ID gói cũ còn trong bộ phân giải để đọc lịch sử/phiên dở, không quảng bá thành tám đề mới. Giữ khóa `hsk-study-data-v1`; migration schema 1 → 2 giữ sessions, attempts, reviewItems và dữ liệu vocabulary cũ ở dạng thụ động. Khi có dung lượng, lưu bản sao v1 vào khóa có hậu tố `-backup`. Không gọi clear localStorage. Tối đa 12 phiên/100 lượt theo giới hạn sẵn có.

Để có đề đầy đủ cần: câu đủ số lượng/phần/dạng, quyền sử dụng hợp lệ, đáp án xác minh, audio thu âm và biên bản đối chiếu cấu trúc/quy tắc với mẫu chính thức. `fullExamErrors` kiểm tra thứ tự, số câu, thời lượng, dạng câu, audio, đáp án và cấu hình; thiếu xác minh thì không xuất hiện trong danh sách đề đầy đủ.

Thông số tham chiếu truyền thống cấp 1–6 và nhóm 7–9 tại https://www.chinesetest.cn/HSK/1 đến /HSK/6 và https://www.chinesetest.cn/HSK/7-9 đã được đối chiếu. Chúng là tham chiếu thông số, chưa phải bộ đề đã thẩm định đủ mọi quy tắc. Cấu trúc HSK 3.0 cấp 1–6 chưa hoàn tất đối chiếu; không áp cấu trúc truyền thống vào phiên bản mới. Xem https://www.chinesetest.cn/syllabus và các tài liệu nguồn trong docs.

## Chạy website

```powershell
cd D:\ReactJS\LuyenThiHSK
npm run dev -- --host 127.0.0.1
```

Production/offline:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Mở http://127.0.0.1:4173. Dev và preview khác port nên dữ liệu trình duyệt riêng theo origin. Giữ port/profile cũ khi muốn tiếp tục bài đã lưu.

## Kiểm tra

```powershell
npm run typecheck
npm run check:content
npm test
npm run build
npm run test:browser
```

Không có script lint trong repository. Test logic kiểm tra chấm, câu nhập, câu mở, chuyển phần, lọc nội dung đầy đủ, migration, quota và dữ liệu lỗi. Test trình duyệt dùng Chrome headless/profile tạm riêng, kiểm tra URL/back, audio preflight/lỗi/tạm dừng, bảo mật lời giải nghe, tự lưu/hạn giờ, nộp một lần, lịch sử, IME, mobile 375px và offline. Giả lập speech dùng để kiểm tra trạng thái thành công/lỗi; cần nghe thật để xác nhận chất lượng âm thanh trên thiết bị. Đổi `HSK_BROWSER_PATH` hoặc `HSK_TEST_URL` nếu cần. Ảnh ở `docs/screenshots/exam-focus`.

`npm run report:web` chụp lại các màn đại diện qua luồng kiểm tra và tạo Word `docs/BAO_CAO_LUYEN_THI_HSK_<ngày>.docx`. Cần website đang chạy, Chrome và Python/python-docx. Báo cáo/ảnh `current-web` cũ ghi nhận phiên bản trước; `current-web.rar` là ảnh, không phải mã nguồn.

## Mã chính

- `src/ExamApp.tsx`: điều hướng, bộ chọn, lịch sử, ôn sai và lưu phiên.
- `src/components/exam`: audio, làm bài, kết quả, lời giải.
- `src/services/examScoring.ts`, `examRules.ts`, `examRoute.ts`, `studyStorage.ts`, `reviewQueue.ts`: chấm, cấu hình/chuyển phần, URL, migration, khử trùng.
- `src/data/examCatalog.ts`, `prepareQuestion.ts`, `contentValidation.ts`, `examBlueprints.ts`: ngân hàng gốc, chuyển câu nhập, kiểm tra nội dung, tham chiếu chính thức.
- `public/sw.js`: cache production, đã đổi phiên bản cache sau thay giao diện.

Thêm nội dung phải giữ provenance theo `docs/CONTENT_POLICY.md`, chạy kiểm tra, và thẩm định học thuật/quyền nguồn trước khi public. Chưa có dữ liệu đề hoàn chỉnh, audio chuẩn, ghi âm nói hoặc chấm tự luận tự động.
