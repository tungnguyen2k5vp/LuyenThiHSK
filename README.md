## Hiện tại · luyện thi server và 4Chinese · 17/11/2026

[Mở web](http://127.0.0.1:3000/) · [Luyện thi mới](http://127.0.0.1:3000/hsk) · [Quản trị câu hỏi](http://127.0.0.1:3000/hsk?tab=admin).

Module `/hsk` có lưu bài/chấm/deadline trên SQLite và backend, phục hồi bản nháp, lịch sử/lời giải, nhập JSON/CSV, duyệt/xuất bản theo revision và bộ thu thập no7z có giấy phép. Có 72 câu chờ duyệt, 3 bài mẫu kỹ thuật; kho cũ 262 bộ/24.542 câu/8.708 MP3 và 11.870 mục từ 4Chinese được giữ. Đã chỉnh giao diện desktop/mobile bằng Impeccable.

Chạy `npm run server`, `npm run account:server`, `npm run dev -- --host 127.0.0.1` ở ba terminal. Account provider hiện chưa cấu hình; dùng cookie khách. [Kiến trúc, API, vận hành, nguồn dữ liệu và kiểm thử](docs/HSK_EXAM_MVP.md). Các mốc dưới đây là lịch sử.

Clone lần đầu: dùng Node.js 24+, chạy `npm ci`, sao chép `.env.example` thành `.env.local` nếu cần cấu hình cộng đồng, rồi chạy các dịch vụ trên. Các lệnh kiểm thử chính dùng dependency của chính repository, không cần thư mục REA bên cạnh. Kiểm thử browser trên Windows cần Google Chrome. Hai kịch bản REA lịch sử `test-rich-learning.mjs` và `test-motion-ui.mjs` là tùy chọn, vẫn cần bộ REA tham khảo riêng.

Database, lịch sử cá nhân, mã quản trị, `.env.local`, bản build, file nén và các bản sao nghiên cứu thô chỉ giữ trên máy, không đưa lên Git. Kho từ/câu hỏi/audio công khai, bản nháp biên tập và thông báo giấy phép được giữ trong repository. API mới tự tạo SQLite và 32 câu mẫu ở lần chạy đầu; sau khi API hoạt động, chạy `npm run data:hsk:collect -- --offline --limit=40 --apply` để tái tạo thêm 40 câu chờ duyệt như bản làm việc. Không cần sao chép database người dùng.

---

## Không gian học tập mới · 23/10/2026

[Mở HSK Journey](http://127.0.0.1:4173/) · [Luyện kỹ năng](http://127.0.0.1:4173/?view=practice) · [Kho bài](http://127.0.0.1:4173/?view=exams).

Đã dùng REA khảo sát QKT sau đăng nhập và áp dụng vào source hiện hữu: tổng quan ưu tiên bài đang làm/việc hôm nay/ôn tập/lịch sử; hub kỹ năng riêng; catalog giữ cấp/phiên bản/dạng; học từ theo nhóm tối đa 20 từ. Giữ nguyên database, kho câu, audio, tiến độ và SM2. [Phân tích và ánh xạ dữ liệu](docs/REA_ANALYSIS.md) · [QA mới](docs/QA_REPORT.md) · [Ảnh giao diện](docs/screenshots/qkt-workspace/home.png).

Chạy web: npm run server; npm run account:server; npm run build rồi npm run preview -- --host 127.0.0.1 --port 4173 --strictPort (mỗi dịch vụ ở terminal riêng). Account vẫn guest mode nếu chưa cấu hình provider; viết/nói tự đánh giá, chưa có AI chấm. Kiểm tra luồng mới: node scripts/test-qkt-workspace.mjs.

---

## Bản tiếp nối QKT · 22/10/2026

[Mở Luyện đề HSK](http://127.0.0.1:4173/?view=exams): **262 bộ bài, 24.542 câu, 8.708 MP3 cục bộ**. Thêm 93 phân bộ/8.680 câu so với snapshot169bộ/15.862câu: nghe chép chính tả4.349 và sắp xếp từ4.331 từ nguồn no7z đã cấp phép. Không thêm tệp audio hoặc đề chính thức. Danh mục gọn, pill phiên bản/cấp, bộ lọc phụ thu gọn, tìm mã/sắp xếp/đang làm, nút kỹ năng/cả bộ và intro trước bắt đầu; vẫn dùng engine/lưu bài/kết quả/SM2 hiện hữu.

Build/lint, import lặp, kiểm tra mọi ngân hàng/audio và REA desktop/mobile đều qua. SQLite8bảng và 150bank mở cũ giữ nguyên. Mẫu nguồn chưa được duyệt chuyên môn; HSK2/3 và GF2021/2025 tách nhãn. Tài khoản/cloud chưa cấu hình đầy đủ, khách dùng local. [QA](docs/QA_REPORT.md) · [Số liệu](docs/DATA_INGESTION_REPORT.md) · [Nguồn](docs/DATA_SOURCES.md) · [REA](docs/REA_ANALYSIS.md).

Chạy từ thư mục dự án: `npm run server`; terminal khác `npm run build`, rồi `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. Kiểm tra nhanh: `npm run test:catalog`, `npm run data:hsk:validate`, `npm run lint`.


---

## Lịch sử trước bản giao diện gọn

Các số liệu/kiểm thử bên dưới thuộc bản trước; dùng phần đầu tài liệu để xem hiện trạng.

## Kho dữ liệu mở · 22/10/2026

[Mở kho luyện tập](http://127.0.0.1:4173/?view=practice): **169 bộ bài, 15862 câu, 8708 MP3 cục bộ**. Bổ sung 14299 bài tập Nghe/Đọc/từ vựng từ no7z và HearMandarin có giấy phép; có audio normal/chậm, nguồn/edition, lọc kết hợp, lưu và tiếp tục. Đây là bài bổ trợ, chưa phải đề chính thức hay nội dung đã duyệt chuyên môn.

[Cách chạy pipeline và số liệu từng cấp](docs/DATA_INGESTION_REPORT.md) · [Nguồn](docs/DATA_SOURCES.md) · [REA](docs/REA_ANALYSIS.md) · [QA](docs/QA_REPORT.md). Bản hiện hành ở [CURRENT_STATE](docs/CURRENT_STATE.md); các mốc bên dưới là lịch sử.

---

# HSK Journey · giao diện luyện HSK mới

**[Mở kho luyện tập](http://127.0.0.1:4173/?view=practice)** — 1.033 câu HSK 4 từ Mandarin Zone, 510 câu HSK 1–2 tận dụng từ SQLite và 20 câu minh họa cũ. Có chọn kỹ năng/dạng câu, luyện có giờ, tự lưu/tiếp tục, chấm và ôn câu sai. Xem **[phân tích Migii bằng REA, ánh xạ logic/database và kiểm thử](docs/REA_MIGII_APPLICATION.md)**. Dữ liệu Mandarin Zone dùng phi thương mại (CC BY-NC-SA 4.0); nội dung AI cũ vẫn chờ duyệt. Báo cáo phiên bản bên dưới mô tả các mốc trước đây.

Mở **http://127.0.0.1:4173/** để dùng trang tổng quan, chọn cấp học, luyện kỹ năng và tiếp tục bài đang làm. Xem [hướng dẫn chạy, cấu trúc source, REA và kết quả kiểm tra](docs/HSK_JOURNEY.md). Các luồng học, dữ liệu và Private Preview có sẵn được tận dụng.

---

# LuyenThiHSK · V6

Bản hiện hành: [Báo cáo V6](FINAL_IMPLEMENTATION_REPORT_V6.md), [tài liệu](docs/v6/README.md), [ảnh chức năng](docs/v6/SCREENSHOT_GALLERY.html). HSK1 private technical beta; nội dung chờ duyệt, cloud chưa deploy.

Chạy `npm run build`, sau đó ba terminal: `npm run server`, `npm run account:server`, `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort`. Mở http://127.0.0.1:4173/?view=preview và nhập mã riêng từ .runtime/admin-access.txt. Xem [hướng dẫn](docs/v6/BACKEND_SETUP.md).

Toàn bộ tài liệu đã gom tại [TAI_LIEU_TONG_HOP_HSK](TAI_LIEU_TONG_HOP_HSK/00_MUC_LUC.md). Không chạy lại các script one-off `v6-wire-*`/`v6-*-wiring`/`v6-*-hardening`; chúng là nhật ký migration đã thực thi. Dùng npm scripts công khai cho build/stage/test/report.

---

# LuyenThiHSK V5

HSK1học thử nội bộ:300 từ,68 bài ngữ pháp,178 câu,40 audio. **Chờ duyệt chuyên môn; chưa public/production.**

## Khởi chạy

Tại D:\ReactJS\LuyenThiHSK, mở2 terminal.

Terminal1:

```powershell
npm run server
```

Terminal2:

```powershell
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Học thử: http://127.0.0.1:4173/?view=preview

Duyệt: http://127.0.0.1:4173/?view=content-review

Mã local trong .runtime/admin-access.txt. Không mở file artifacts/index.html của project Android.

[FinalV5](FINAL_IMPLEMENTATION_REPORT_V5.md) · [Readiness](docs/v5/V5_RELEASE_READINESS.md) · [Tài liệu tập trung](TAI_LIEU_TONG_HOP_HSK/00_MUC_LUC.md) · [Gói duyệt riêng](.runtime/review-packages/v5/index.html).

## Lệnh V5

- npm run test:v5 ; npm run test:v5-api ; npm run test:browser:v5
- npm run data:v5:build ; npm run data:v5:stage ; npm run review:v5:export ; npm run report:v5

Build chỉ tạo staging; stage bảo toàn revision được sửa thủ công. Kiểm tra diff/report trước khi nhập. Không chạy lại các script v5-wire hoặc one-off migration. Audio huayan chỉ dùng Preview riêng.

## Hồ sơ phiên bản cũ

# LuyenThiHSK V4

HSK 1 đã có bản **Preview/Beta kỹ thuật nội bộ**, còn chờ duyệt ngôn ngữ/cấp/đáp án và phát âm. Production chưa được mở. [Báo cáo V4](FINAL_IMPLEMENTATION_REPORT_V4.md) · [Trạng thái hiện hành](docs/CURRENT_STATE.md) · [Toàn bộ tài liệu](TAI_LIEU_TONG_HOP_HSK/00_MUC_LUC.md).

## Mở HSK 1 Preview

Trong D:\ReactJS\LuyenThiHSK, chạy npm run server. Giữ website tại http://127.0.0.1:4173/ (npm run build rồi npm run preview -- --host 127.0.0.1 --port 4173 nếu chưa chạy). Vào http://127.0.0.1:4173/?view=preview, nhập mã trong .runtime/admin-access.txt.

- 300 từ và ví dụ draft,68 bài grammar,128 câu original,40WAV synthetic,mini10/full40Preview.
- NEEDS_REVIEW537; kiểm tra kỹ thuật537; Human Reviewed0; PublishedV4=0. AI không tự nhận human review.
- Giọng huayan có license dữ liệu Unknown, chỉ Preview riêng; chưa phân phối production.
- HSK2–3 DATA_ONLY. [Pipeline/review hướng dẫn](docs/CONTENT_V4.md), [Test report](TEST_REPORT_V4.md).

Lệnh V4: npm run test:v4 ; npm run test:browser:v4 ; npm run data:v4:validate ; npm run data:v4:audit ; npm run report:v4. Xem CONTENT_V4 trước khi tái tạo audio/staging.

## Lịch sử V3 / baseline (số liệu tại thời điểm V3)

Hệ thống luyện HSK trên dự án React 19 / TypeScript / Vite hiện có. Mở [mục lục tài liệu tập trung](TAI_LIEU_TONG_HOP_HSK/00_MUC_LUC.md) hoặc [báo cáo V3](FINAL_IMPLEMENTATION_REPORT_V3.md). Nguồn trạng thái duy nhất: [CURRENT_STATE](docs/CURRENT_STATE.md). V2 giữ làm baseline; V3 chưa hoàn tất toàn bộ brief.

## Bổ sung V3

- Audit/chuẩn hóa 11.000 mục từ: 8.765 qua quy tắc kỹ thuật, 2.235 cần rà; vẫn còn 557 mục thiếu nghĩa Việt. Thẻ học dùng nghĩa ngắn, admin có hàng đợi sửa/duyệt.
- Question metadata/coverage; review ngôn ngữ/cấp HSK có reviewer/comment; form mặc định, JSON nâng cao, preview bằng engine thật.
- Audio upload/browser decoder/SHA256/dedup/transcript/license, file draft riêng. Chưa có audio thi thật đã duyệt.
- GrammarLesson renderer và 8 bài nháp + 8 câu luyện chờ duyệt; chưa có lesson Published.
- Seeded template/pool builder, revision locks và validator; full mock production vẫn bằng 0.
- Thời gian từng câu, insight có ngưỡng, weakness theo metadata và plan so sánh nghe/đọc khi đủ mẫu. Chưa có diagnostic đa kỹ năng/cloud/AI.

Chi tiết: [CONTENT_V3](docs/CONTENT_V3.md), [Vocabulary cleanup](VOCABULARY_CLEANUP_REPORT.md), [Question Bank](QUESTION_BANK_REPORT.md), [Mock readiness](MOCK_READINESS_REPORT.md), [Data validation](HSK_DATA_VALIDATION_REPORT_V3.md).

## Đang chạy / khởi động lại

Website: http://127.0.0.1:4173/ . Local content API: http://127.0.0.1:8787/api/health . Giữ cùng origin/port/browser profile để tiếp tục dữ liệu cũ.

Terminal 1:

    cd D:\ReactJS\LuyenThiHSK
    npm run server

Terminal 2 (dev):

    cd D:\ReactJS\LuyenThiHSK
    npm run dev -- --host 127.0.0.1

Hoặc production preview:

    npm run build
    npm run preview -- --host 127.0.0.1 --port 4173

Admin: /?view=admin . Chạy server rồi lấy mã tại .runtime/admin-access.txt, không đưa mã vào frontend bundle hoặc commit.

## Chức năng hiện có

- Giữ exam engine: timer/audio gate/pause/recover/autosave/reload/section handling/answer sheet/submit/grading/history/mistakes; thêm lease chống hai tab ghi đè, F đánh dấu, dictionary chỉ ở practice và next action kết quả.
- 11.000 mục từ HSK syllabus 2025, 576 tên cấu trúc và 3.088 Hán tự theo cấp; catalog phân trang, tìm pinyin không dấu, favorite, học/ôn theo SM-2. Chỉ tải cấp/chữ đang xem. CSV cá nhân ở mục nâng cao.
- Onboarding 4 bước, mục tiêu/lịch thi/ngân sách phút, kế hoạch hôm nay, weak-question review, vocabulary diagnostic thích ứng và readiness có ngưỡng bằng chứng.
- Hanzi animation/canvas/undo/reset; writing drafts + self-rubric; microphone recording/playback + chép lời thủ công. Audio ghi âm lưu IndexedDB trên thiết bị.
- Local admin Node 24 + SQLite: content revisions, CSV mapping / JSON import, validation/preview/dedup/report, DRAFT → NEEDS_REVIEW → APPROVED → PUBLISHED, archive/audit và mini-test builder từ câu đã công bố.
- Desktop nav 6 mục, mobile bottom nav 5 mục; ẩn trong exam. Offline app shell và học liệu đã mở được cache.

## Nguồn và giới hạn

Từ/cách đọc/cấp đối chiếu CTI syllabus 2025 đúng checksum; nguồn từ điển là CVDICT/CC-CEDICT, không phải bản dịch CTI. 10.443 nghĩa VI tham khảo có machine assistance; 557 mục còn thiếu VI. 17 cấu trúc staging, 99 chữ thiếu nét. Grammar Browser hiện là mục lục cấu trúc và tiến độ, chưa đủ lesson/bài tập Việt đã duyệt cho mọi mục.

Giữ 20 câu minh họa gốc; mini tests dùng cùng pool, lexical quiz sinh theo yêu cầu. Chưa có full mock đã thẩm định hoặc audio mock có quyền. TTS chỉ dùng phát âm/non-exam practice. Chưa có user account, cloud sync, Supabase runtime, AI/STT hoặc wizard full exam đầy đủ. Dữ liệu học vẫn local-first; không xóa core storage schema 3.

Attribution và điều kiện phân phối: public/THIRD_PARTY_NOTICES.md, public/ARPHICPL.TXT, docs/CONTENT_LICENSES.md. Không ghép code từ 15 repo, không nhập câu hỏi có bản quyền.

## Kiểm tra

    npm run typecheck
    npm run lint
    npm test
    npm run test:v2
    npm run test:v3
    npm run test:v3-api
    npm run test:admin
    npm run check:content
    npm run build
    npm run test:browser

Browser test cần preview 4173, Chrome và API local đang chạy. QA profile/DB test độc lập, kiểm tra engine cũ, onboarding/course/diagnostic/admin và 9 màn ở 320/375/390/430px. Lệnh lint dùng TypeScript/unused, chưa có ESLint. Chi tiết docs/TESTING.md.

## Pipeline

    npm run data:import

Importer cần raw snapshots trong data/raw (không phát hành public), bao gồm PDF CTI có checksum khớp. Runtime release đã có sẵn ở public/data, không cần import lại để chạy app. Báo cáo máy đọc: data/reports/import-2025-r1.json. Quy trình nguồn và coverage: docs/DATA_IMPORT_REPORT.md, docs/HSK_DATA.md.

V3: `npm run data:cleanup`, `npm run data:audit-v3`, `npm run data:grammar-drafts`. Staging không public; mở admin → Hàng đợi duyệt để nhập draft idempotent. Không đưa .runtime/token/DB/audio QA vào release.
