## Hiện tại — 17/11/2026

Web chính: http://127.0.0.1:3000/ ; luyện thi server: http://127.0.0.1:3000/hsk . Thêm SQLite attempts/answers, backend grading/deadline/ownership, lịch sử/lời giải, import/review/publish và collector JSON có giấy phép. 72 câu mới chờ duyệt, 3 bài mẫu kỹ thuật; không tự công bố là đề chính thức. Kho 262 bộ/24.542 câu/8.708 MP3 và 11.870 mục từ giữ nguyên. Giao diện theo màu xanh 4Chinese, đã kiểm tra desktop/mobile và luồng phục hồi bài thật.

[Trạng thái nghiệm thu, API, nguồn, cách chạy và giới hạn](HSK_EXAM_MVP.md). Các mục bên dưới là lịch sử; không dùng chúng để suy ra trạng thái đăng nhập/cloud hay số đề chính thức hiện tại.

---

## Mở rộng tương tác trên các màn học — 26/10/2026

Đã mở rộng từ minh họa sang các thao tác học: **thẻ lật** tối đa 10 từ theo bộ lọc hoặc ôn cả danh sách đến hạn, bốn mức nhớ dùng nguyên SM2; **ghép 4 cặp chữ/nghĩa** có phản hồi thử lại, đổi bộ và chuyển sang thẻ; **trình xem nét Hán tự** có tua bằng thanh trượt/bàn phím, nét trước/sau, phát/tạm dừng và ba tốc độ. Trò ghép không tự ghi tiến độ; Hán tự vẫn tự đối chiếu với mẫu, không chấm nét viết.

Trang chủ có vòng từ đã đánh dấu học theo từng cấp, vòng nhiệm vụ và lịch 7 ngày chọn được. Nhiệm vụ bỏ qua được ghi riêng, không cộng vào số hoàn thành ở vòng trang chủ. Luyện kỹ năng có 5 minh họa SVG theo dạng bài, chuyển động khi hover/focus; tiến độ có biểu đồ chọn 7/14 ngày, phút/lượt và xem chi tiết từng ngày. Có phản hồi hữu hạn khi hoàn tất thẻ, ghép từ, lưu lượt viết và xem kết quả bài. Giảm chuyển động được tôn trọng; không thêm dependency. Không sửa học liệu gốc, SQLite, cách chấm, storage keys hay HocTiengTrungApp.

Lint/build PASS. `node --import ../Rea-HSK-Reference/node_modules/tsx/dist/loader.mjs scripts/test-rich-learning.mjs`: **15 kịch bản / 227 bước PASS**, không console error, 1440/390/320 px; kiểm tra bàn phím, giảm chuyển động, SM2 còn nguyên sau reload, ghép từ không ghi tiến độ, chuyển ghép → thẻ, phát hết nét/tự dừng và biểu đồ có/không có lịch sử. Số liệu mẫu trong ảnh trang chủ/tiến độ chỉ được nạp vào browser REA cô lập để kiểm tra; không ghi vào hồ sơ người dùng. Test nét viết chỉ dùng click con trỏ; không xác nhận độ chính xác viết tay. TTS vẫn phụ thuộc giọng Mandarin trên thiết bị.

[Báo cáo](../data/reports/rich-learning-20261026/check.json) · [Thẻ trên điện thoại](screenshots/rich-learning-20261026/flashcards-mobile.png) · [Luyện kỹ năng](screenshots/rich-learning-20261026/practice-desktop.png) · [Tiến độ](screenshots/rich-learning-20261026/progress-desktop.png). Web: http://127.0.0.1:4173/ . Backup trước đợt mở rộng: `.runtime/backups/rich-learning-20261026/`.

---

## Minh họa chuyển động và thanh điệu tương tác — 26/10/2026

Tham khảo ba prompt trong awesome-opus5-5-videos, áp dụng SVG/CSS viết mới: minh họa chữ 学, thẻ pinyin/Hán tự và đường nét xuất hiện lần lượt trên trang chủ; hover nhẹ cho thẻ học. Thêm **Khám phá 4 thanh điệu** dẫn tới Thư viện kiến thức → Pinyin, chọn mā/má/mǎ/mà, xem lại đường cao độ và nghe chữ ví dụ bằng Mandarin TTS hiện có. Hiệu ứng hữu hạn và tôn trọng giảm chuyển động. Đã sửa chiều cao cố định của nút nghe pinyin cũ để chữ không chồng lên nhau. Không sửa dữ liệu, SQLite, cách lưu/chấm bài hoặc HocTiengTrungApp; không thêm dependency hay nhúng video của tác giả.

Lint/build PASS. `node scripts/test-motion-ui.mjs`: 5 kịch bản / 45 bước PASS, không console error, desktop 1440 px và mobile 390/320 px, có chế độ giảm chuyển động, chọn thanh bằng bàn phím và chuyển pinyin/bộ thủ. Giọng Mandarin phụ thuộc thiết bị; phát audio chưa được xác minh bởi bộ kiểm tra này. Computer Use trực tiếp trên Cốc Cốc dừng do chưa hỗ trợ thực thi chính sách URL cho trình duyệt Windows này; kết quả trên là kiểm thử tự động cục bộ bằng REA.

[Ý tưởng, nguồn và giới hạn](MOTION_INSPIRATION.md) · [Kết quả kiểm tra](../data/reports/motion-20261026/check.json) · [Ảnh trang chủ](screenshots/motion-20261026/home-desktop.png). Web/API/account BFF đang dùng 4173/8787/8788. Backup file cũ: `.runtime/backups/motion-20261026/`.

---

## Bổ sung học liệu và hoàn thiện luồng học — 25/10/2026

Mở [HSK Journey](http://127.0.0.1:4173/). Đã tích hợp dữ liệu bổ sung vào màn học thực tế: 739 nghĩa Việt ngắn (552 mục thiếu nghĩa và 187 mục chỉ có chú thích/nghĩa dài), 6.271 liên kết ví dụ/audio cho 4.608 trong 11.000 mục từ; 132 bài ngữ pháp có giải thích; 99 mẫu nét còn thiếu; 10 cặp pinyin và 50 bài bộ thủ/thành phần tái sử dụng từ HocTiengTrungApp. Folder nguồn chỉ đọc, ID/cấp/edition và nội dung gốc giữ nguyên.

Thêm 14 đoạn đọc / 42 câu có ngữ cảnh, bản dịch và giải thích, cùng 14 đề viết / rubric / mẫu tham khảo. Bài đọc mới và quiz dùng nghĩa AI mới chỉ tự đối chiếu, không lách điều kiện chấm điểm. Viết tự lưu bản nháp và rubric theo bài, lọc cấp, vẫn mở được bài cũ. Catalog kết hợp hiện có 269 bộ / 24.584 lượt câu trong các bộ; không coi là số câu độc lập duy nhất hay đề thi chính thức. Kho 262 bộ trước đây giữ nguyên.

Kiểm tra: lint/build, `npm test`, `npm run test:catalog`, `npm run test:learning` PASS. REA Chrome desktop 1440×1000 và mobile 390×844: 8 kịch bản / 77 bước PASS, không console error; đã kiểm tra lưu/mở lại bài đọc, viết/rubric sau reload, bài cũ sắp xếp câu và hiển thị ngữ pháp/nét chữ. [Bằng chứng REA](../data/reports/learning-20261025/browser-check.json) · [Ảnh chụp](screenshots/learning-20261025/home.png).

Bảo toàn: 13.573 tệp đầu vào không đổi, toàn bộ hàng trong 8 bảng SQLite khớp snapshot; pipeline chạy lại không đổi byte. Backup được trỏ bởi `.runtime/learning-integration-backup.txt`. Chạy lại dữ liệu: `npm run data:learning:integrate`; kiểm tra: `npm run test:learning`.

Giới hạn còn lại: nội dung mới có AI hỗ trợ, **chưa duyệt ngôn ngữ độc lập**; 132/576 cấu trúc có bài bổ sung, chưa viết toàn bộ giáo trình. Ví dụ ghép theo chữ/pinyin, không bảo đảm đúng mọi nghĩa của từ; audio ví dụ là giọng tổng hợp theo GF2021. Cấp đọc/viết ước lượng nội bộ. Không nhập kho riêng Migii/QKT và không truy cập database của họ. Tài khoản/cloud còn guest / NOT_CONFIGURED; chưa triển khai production. Lượt REA dùng browser cô lập, chặn service worker nên không xác minh offline ở đợt này. [Nguồn và giấy phép học liệu](../public/data/learning/ATTRIBUTION.md).

Web/API/account BFF chạy ở 4173/8787/8788. Để chạy lại sau khi tắt máy, mở 3 terminal tại thư mục dự án: `npm run server`; `npm run account:server`; `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` (chạy `npm run build` sau khi sửa source).

---

## Bản cập nhật không gian học tập — 23/10/2026

Đã khảo sát QKT bằng REA với các màn hình sau đăng nhập, rồi triển khai lại tổng quan và hub luyện kỹ năng. Mở http://127.0.0.1:4173/ . Trang đầu có bài đang làm, chọn cấp, việc hôm nay, ôn tập và lịch sử. Luyện kỹ năng tách khỏi kho bộ bài; bộ lọc giữ đúng cấp/phiên bản/dạng câu. Từ vựng có học theo nhóm tối đa 20 từ, dùng nguyên tiến độ và SM2. Kế hoạch dùng đúng cấp mục tiêu thay vì cấp vừa duyệt.

Không migration database, không import nội dung QKT. Kho 262 bộ/24.542 câu và các nội dung cũ được giữ nguyên. Web/API/account BFF chạy lần lượt trên 4173/8787/8788; tài khoản riêng của ứng dụng hiện là guest mode. Xem REA_ANALYSIS.md để phân biệt điều đã quan sát và giới hạn chưa biết.

---

## Bản tiếp nối QKT · 22/10/2026

[Mở Luyện đề HSK](http://127.0.0.1:4173/?view=exams): **262 bộ bài, 24.542 câu, 8.708 MP3 cục bộ**. Thêm 93 phân bộ/8.680 câu so với snapshot169bộ/15.862câu: nghe chép chính tả4.349 và sắp xếp từ4.331 từ nguồn no7z đã cấp phép. Không thêm tệp audio hoặc đề chính thức. Danh mục gọn, pill phiên bản/cấp, bộ lọc phụ thu gọn, tìm mã/sắp xếp/đang làm, nút kỹ năng/cả bộ và intro trước bắt đầu; vẫn dùng engine/lưu bài/kết quả/SM2 hiện hữu.

Build/lint, import lặp, kiểm tra mọi ngân hàng/audio và REA desktop/mobile đều qua. SQLite8bảng và 150bank mở cũ giữ nguyên. Mẫu nguồn chưa được duyệt chuyên môn; HSK2/3 và GF2021/2025 tách nhãn. Tài khoản/cloud chưa cấu hình đầy đủ, khách dùng local. [QA](QA_REPORT.md) · [Số liệu](DATA_INGESTION_REPORT.md) · [Nguồn](DATA_SOURCES.md) · [REA](REA_ANALYSIS.md).

Chạy từ thư mục dự án: `npm run server`; terminal khác `npm run build`, rồi `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. Kiểm tra nhanh: `npm run test:catalog`, `npm run data:hsk:validate`, `npm run lint`.


---

## Lịch sử trước bản giao diện gọn

Các số liệu/kiểm thử bên dưới thuộc bản trước; dùng phần đầu tài liệu để xem hiện trạng.

## Cập nhật kho mở · 22/10/2026

**169 bộ bài / 15862 câu**, trong đó 150 bộ bổ trợ mới/14299 câu phái sinh; 8708 MP3 normal+slow cục bộ. no7z CC BY-SA 4.0 (GF0025-2021), HearMandarin từ CC BY 4.0 (syllabus2025). Giữ tách HSK2/HSK3 và edition; không nhận là đề chính thức. Catalog có bộ lọc phối hợp, tìm nội dung/pinyin/nguồn, phân trang, nhãn nguồn/audio; luyện nghe bình thường/chậm, lỗi file và giới hạn lượt có kiểm tra. Curriculum bổ sung nghĩa Anh/POS mà giữ ID, nghĩa Việt và cấp cũ.

SQLite thực tế có 709 câu chưa archive; số 681 ở báo cáo lịch sử không còn là hiện trạng. Tất cả 8 application tables khớp backup trước task; không chạy migration. Tài khoản/cloud chưa cấu hình đầy đủ, dùng khách cục bộ tại [kho bài](http://127.0.0.1:4173/?view=practice). Tiến độ dùng storage/session snapshots hiện hữu.

[Nguồn và giấy phép](DATA_SOURCES.md) · [Số liệu và cách nhập](DATA_INGESTION_REPORT.md) · [REA](REA_ANALYSIS.md) · [QA](QA_REPORT.md). Các mục bên dưới giữ để tra lịch sử.

---

# Current state · V15

Ngày 2026-10-20. **V15_LOCAL_QA_PASSED / CONTENT_PENDING_FINAL_HUMAN_REVIEW**. Codex tiếp tục theo single-agent mode với quyền UI do người dùng cấp. Tái sử dụng Gemini V14, bổ sung Catalog kỹ năng/Mini thật, polish desktop/mobile, Reading, audio progress, explanation keyboard và lazy illustration của Result.

39/39 full regression; V15 Chrome/Edge 34 nhóm mỗi browser; V14 fallback 26 nhóm mỗi browser; 6/6 A/B trong budget; 25 logic và 16 security checks. Source product/config khớp copy regression. Toàn bộ hàng của 10 application tables và media/content assets giữ nguyên; sw.js được nâng cấp để bỏ qua API. Token API giữ nguyên khi restart V15 PID40432, port8787.

[Website V15](http://127.0.0.1:4173/?view=preview&ui=v15) · [fallback V14](http://127.0.0.1:4173/?view=preview&ui=v14) · [báo cáo](../FINAL_IMPLEMENTATION_REPORT_V15.md) · [một thư mục bàn giao](../TAI_LIEU_TONG_HOP_HSK/V15_BAN_GIAO/README.md).

DB editorial 1.359: 5 Draft + 1.354 Needs Review; 681 câu (435 HSK1/246 HSK2), human/published 0. V15 có 2 bài ngữ pháp/10 câu HSK2 trong staging riêng, chưa nhập DB hoặc human reviewed/published. Review queue 681 câu và 40 audio jobs. HSK2 Full Mock còn khóa theo audio/rights/human gates. Chưa public production deploy; chưa kết luận nguyên nhân duy nhất của các sự cố network V14 cũ. V15 đã kiểm timeout/retry, reload và bảo toàn tiến độ.

Các mục bên dưới là lịch sử trước V15.


# Current state · V14

Ngày2026-10-19. **V14_LOCAL_QA_PASSED / CONTENT_PENDING_FINAL_HUMAN_REVIEW**. Contract14.0 frozen; đã nhận Gemini handoff52 file, snapshot/hash do Codex tạo. Tích hợp5 nhóm: Catalog/Intro, Room/Navigator/SectionInstructions, native question choices/images/shared matching, feedback tabs, Result summary/skills. Audio/image auth/recovery, compound matching, Writing/IME/Undo, submit và detailed review/SRS giữ owner hiện hữu.

Full handed-off source38/38 regression PASS, không exclusions; Chrome/Edge26 nhóm/browser,6 A/B trong budget; source khớp copy đã kiểm. Dữ liệu10 application tables, audit/notes/private media/public assets unchanged từ V14 backup. Token API giữ nguyên sau restart PID33604, port8787 loopback. Vite dev chặn raw reports/token file403.

Mở [V14](http://127.0.0.1:4173/?view=preview&ui=v14), chọn HSK1 để dùng hai platform practice40 câu. HSK2 vẫn NOT_READY: chưa có exam-ready audio/human review/rights. Editorial1.359 =5 Draft +1.354 Needs Review; automated valid1.359, workflowInternallyValidated0, human/published0. Question total681:435 HSK1/246 HSK2; không nhập nội dung mới V14.

V14 không bật mặc định. Legacy/V13 giữ fallback và storage keys. Cloud NOT_DEPLOYED/AuthRLS NOT_VERIFIED; private offline hard reload cần API, chỉ loaded Writing offline-save đã kiểm. Những giới hạn/failed QA logs và initial bundle growth được giữ trong report.

- [Báo cáo V14](../FINAL_IMPLEMENTATION_REPORT_V14.md) · [Mục lục](v14/README.md) · [Release gates](v14/V14_RELEASE_READINESS.md)
- [Toàn bộ tài liệu V14 trong một folder](../TAI_LIEU_TONG_HOP_HSK/V14_BAN_GIAO/README.md)

## Trạng thái lưu trữ trước V14 · V13

Ngày 2026-10-19. **V13_QA_PASSED trong phạm vi kỹ thuật local đã tích hợp; CONTENT PENDING FINAL HUMAN REVIEW.** TypeScript/lint/build + regression 35/35; V13 Chrome/Edge 30 nhóm mỗi browser; matrix 14/14; A/B 7/7 trong budget. Edge V11 audio 10/10 và V12 microphone 10/10. Matrix có resumed results gắn log gốc và product-source stability; lỗi đã quan sát được giữ trong QA report.

HSK1: 435 câu, 68 bài, 199 cờ chờ chuyên môn. HSK2: 246 câu (116 theo phần + 130 grammar), 30/71 bài nháp có ≥5 câu độc lập, 144/200 mục từ bổ sung, 40 transcript / 0 audio khả dụng. Scope editorial: 1.359 = 5 Draft + 1.354 Needs Review; automated valid 1.359, human reviewed/published 0. Full Mock nội dung thật NOT_READY; cloud NOT_DEPLOYED.

UI V13 mặc định off: [Mở Preview V13](http://localhost:4173/?view=preview&ui=v13). Fallback: [Preview hiện có](http://localhost:4173/?view=preview). Cùng DB, storage keys và owner học/luyện; không reset tiến độ. API 8787 và Account BFF 8788.

Data safety: lịch sử nội dung/status giữ nguyên; 40 technical media timestamps và một work timestamp được ghi riêng. 5 fixture từ test admin cũ đều ARCHIVED, 18 technical review rows giữ audit, không tính là chuyên gia duyệt. Các test admin tiếp theo dùng DB riêng, đã kiểm tra không tạo ID QA trong kho chính. Không production deploy, cloud/RLS/thiết bị IME thật chưa xác minh.

- [Báo cáo V13](../FINAL_IMPLEMENTATION_REPORT_V13.md)
- [Tài liệu V13](v13/README.md)
- [Phạm vi tích hợp](collab/v13/INTEGRATION_LOG.md)
- [Một folder V13](../TAI_LIEU_TONG_HOP_HSK/V13_BAN_GIAO/README.md)

- [Báo cáo V12 trước nâng cấp](../FINAL_IMPLEMENTATION_REPORT_V12.md)
- [Tài liệu V12](v12/README.md)
- [Folder bàn giao V12](../TAI_LIEU_TONG_HOP_HSK/V12_BAN_GIAO/README.md)
