> CURRENT_STATE: [trạng thái hiện hành](docs/CURRENT_STATE.md). Tài liệu này có các snapshot LEGACY / PRE-V2 bên cạnh bổ sung V2. Những đoạn nói chưa import hoặc chưa có backend chỉ mô tả lịch sử; không dùng làm trạng thái V3.

# HSK_DATA_VALIDATION_REPORT

## Kết quả V2 hiện hành — 15/10/2026

Đã phát hành 11.000 mục từ theo facts CTI, 576 cấu trúc source-matched và 3.088 Hán tự. Dictionary adaptation dùng CVDICT/CC-CEDICT với attribution CC BY-SA 4.0; 10.443 nghĩa Việt cộng đồng có machine assistance, 557 mục chưa có nghĩa VI khớp. Có 2.989 glyph theo Arphic Public License; 99 chữ thiếu nét. 17 grammar chưa khớp giữ staging, 0 vocabulary alignment conflict. Không nhập đề/audio/example CTI. Chi tiết và số lượng theo cấp: docs/HSK_DATA.md, docs/DATA_IMPORT_REPORT.md, data/reports/import-2025-r1.json và FINAL_IMPLEMENTATION_REPORT_V2.md. Phần dưới là snapshot trước khi import ở V2, các số 0 trong đó không mô tả release mới.

Ngày lập: **15/10/2026**. Mục tiêu: xác minh nguồn, edition, quyền và trạng thái dữ liệu trước khi nhập vào sản phẩm. Đây là snapshot; phải kiểm tra lại khi CTI phát hành tài liệu mới.

## Kết quả tổng quát

- Đã đọc README/stack/architecture/license cấp repository của cả 15 repo được giao; inventory chi tiết: [`docs/REFERENCE_REPOSITORIES.md`](docs/REFERENCE_REPOSITORIES.md).
- External HSK records được nhập vào release: **0** vocabulary, **0** Hanzi, **0** grammar, **0** sentence/example, **0** question, **0** answer key, **0** audio.
- Source of truth HSK: CTI. GitHub/community chỉ reference. Chưa coi dataset community nào là official.
- Không tái sử dụng mã, CSS, UI, câu hỏi, transcript, đáp án, audio hoặc data từ 15 repo.

## CTI và edition

| Hạng mục | Bằng chứng đã xem | Validation decision |
|---|---|---|
| HSK syllabus | [CTI syllabus page](https://www.chinesetest.cn/syllabus), [official 2025 PDF](https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B21219.pdf). PDF 406 trang; ghi phát hành 11/2025, có hiệu lực 07/2026, phạm vi HSK 1–9, tasks/topics/vocabulary/Hanzi/grammar. | Dùng để định nghĩa version/coverage. Không nhập bảng từ/grammar/character do chưa có quyền phát hành lại cho app.
| Pilot mới nhất được xem | [CTI notice](https://admin.chinesetest.cn/gonewcontent.do?id=51236758): HSK3.0 pilot toàn cầu lần hai 20/09/2026; HSK3–6 ghép đăng ký với speaking tương ứng; thông báo liệt kê thời lượng pilot. | Trial không tự trở thành blueprint vĩnh viễn; cần lưu version riêng và kiểm tra lại.
| Triển khai toàn cầu | [CTI launch notice](https://old.chinesetest.cn/gonewcontent.do?flag=kdnew&id=51336883): ngày triển khai thông báo 13/12/2026. | Ngày tương lai so với thời điểm report; lưu trạng thái transition/announced.
| Trang cấp độ | [Level 1](https://www.chinesetest.cn/HSK/1) 40 câu/~40 phút; [Level 2](https://www.chinesetest.cn/HSK/2) 60/~55; [Level 3](https://www.chinesetest.cn/HSK/3) 80/~90; [Level 4](https://www.chinesetest.cn/HSK/4) 100/~105; [Levels 7–9](https://www.chinesetest.cn/HSK/7-9) 98 câu/~210 phút, 5 kỹ năng. | Trang có header HSK3.0, nhưng bảng cấp 1–6 còn chỉ số cũ và khác thông báo pilot. Không coi bảng 1–6 là blueprint HSK3.0 mới. Nhóm 7–9 cũng giữ version/source riêng.

Edition IDs của data model: `hsk2-2015`, `hsk3-2021`, `hsk3-2025`, `unverified`. App exam route cũ `hsk2`/`hsk3` được giữ tương thích; route label của bank demo không chứng minh edition syllabus.

## Repository/license triage

| Repo | Stack/data/license finding | Quyết định dữ liệu |
|---|---|---|
| `shengdabai/hsk-prep-platform` | Next.js 16/TS/Supabase/Stripe; MIT application. | Không import content.
| `Hhhpraise/hsk-exam-simulator` | HTML/JS/CSS, PDF.js; MIT. | Không import câu hỏi/PDF/audio.
| `Make-dream-clear/hsk4-mock-exam` | JSON/mock exam/audio; CC BY-NC-SA 4.0. | Loại khỏi sản phẩm thương mại; 0 record.
| `krmanik/HSK-3.0` | Datasets/CSV/scripts/Hanzi/grammar; có License.md. | License file repo không xác nhận quyền của syllabus/PDF gốc; chưa nhập.
| `drkameleon/complete-hsk-vocabulary` | Vocabulary JSON, MIT repo. | Chưa xác minh edition/level mappings và field rights với CTI; chưa nhập.
| `s-mberli/hsknest` | Next.js/Prisma/SQLite; app AGPL-3.0; data licenses tách riêng. | Không import vocab/dictionary/examples/audio.
| `Hhhpraise/hsk-quiz` | Quiz/SRS/offline; MIT repo, data file license chưa xác minh riêng. | Chưa nhập bundled vocabulary.
| `jamesjfoong/open-hsk` | PWA/offline; README license placeholder. | Không tái sử dụng.
| `tnm/hsk` | Flashcards/CSV; MIT repo. | Không nhập CSV/dataset.
| `zhquiz/zhquiz` | PostgreSQL/Docker/custom vocabulary; MIT repo. | Không nhập data.
| `yartow/Chinese-skills` | PWA/Hanzi/stroke/handwriting; MIT code. | Nét chữ/data có quyền riêng; không nhập.
| `mwojtcz/chinese-learning-app` | Flutter vocabulary/tests; MIT repo. | Không nhập data.
| `VictorAurelius/2026-Smart-Quiz` | SvelteKit/PWA/SM-2/TTS; MIT repo. | Không nhập data.
| `ivankra/hsk30` | HSK 3.0 CSV/grammar/pinyin; MIT repository claim. | Chưa xác minh dataset từng field/CTI mapping; không nhập.
| `elkmovie/hsk30` | HSK data OCR từ PDF chính thức; MIT LICENSE ở repo. | License repo không resolve quyền PDF/OCR; không nhập.

## Record trong project

| Nội dung | Record | Quyền/verification |
|---|---:|---|
| Câu gốc tự biên soạn, nhóm HSK 2.0 | 5 | Original; level/blueprint chưa được duyệt thành full exam.
| Câu gốc trong bank HSK 3.0 demo | 10 | Original; syllabus edition và level chưa xác minh.
| Câu gốc minh họa nhóm 7–9 | 5 | Original; không phải đề CTI đã xác minh.
| Full exam đủ điều kiện release | 0 | Validator chặn khi thiếu số câu/section/source/rules/rights.
| Vocabulary/grammar/Hanzi record đóng gói | 0 | Không nhập external data.
| CSV user import | Mỗi người dùng tự quyết định | Local-only; default rights/edition unverified; không xuất bản.

## Kiểm tra đã chạy

- `npm run check:content` — PASS: 3 original banks, 20 unique questions, 0 eligible full exams.
- `npm test` — PASS: schema/backup migration 1→3/2→3, CSV header, Hanzi presence, required fields, level mismatch, duplicate detection, SM-2 scheduling, corrupt localStorage/quota.
- `npm run typecheck` — PASS.
- `npm run build` — PASS.
- `npm run test:browser` — PASS: dashboard default, six menus, vocab import/preview/persistence/SM-2 + exam submit/reload/audio/offline/mobile flow.
- Dashboard không chứa record HSK; các chỉ số được tổng hợp từ attempts và từ cá nhân trên máy, nên không làm thay đổi quyết định xác minh/giấy phép dữ liệu ở trên.

Không chạy validation trên CTI/community vocabulary rows vì không import các rows đó. Bộ parser hiện kiểm tra hình dạng dữ liệu người học nhập, không chứng minh nghĩa/pinyin/level đúng học thuật hoặc license khai báo đúng. Cần human review và nguồn CTI versioned trước khi public.

## Known data risks

1. Một dataset gắn MIT có thể chứa dữ liệu từ tài liệu chính thức có quyền riêng; license code không đủ.
2. OCR có thể giữ chữ nhưng làm sai simplified/traditional variant, pinyin, punctuation và level range.
3. `HSK 7–9` là integrated group trong nhiều nguồn; không tách thành ba cấp độc lập nếu source không chỉ rõ.
4. Syllabus/blueprint transition 2025–2026 cần kiểm tra lại sau 13/12/2026.
5. Từ do người dùng nhập có thể chứa dữ liệu mà họ không có quyền tái phân phối; app không gửi hoặc public dữ liệu này.

