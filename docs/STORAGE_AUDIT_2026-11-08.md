# Kiểm kê dung lượng LuyenThiHSK — 08/11/2026

Chỉ kiểm tra và lập báo cáo; chưa xóa, di chuyển, cài lại, build hay sửa source. Phạm vi chính: `D:\ReactJS\LuyenThiHSK`. Các clone tham chiếu bên ngoài được ghi riêng, không cộng vào tổng của app.

**Tổng tại thời điểm quét: 12,49 GiB (13,41 GB), 395.482 tệp.** Đây là tổng kích thước nội dung file, không phải Size on disk. Bỏ qua đích của 49 liên kết/junction để không cộng trùng; không phát hiện tệp hardlink hoặc lỗi đọc. Tổng này chưa tính báo cáo mới vài KB đang đọc.

## 1. Kết luận để lựa chọn

- Phần chiếm lớn nhất là các bản sao kiểm thử trong `.tmp/`: **7,57 GiB**, tương đương 60,6% tổng dự án.
- `.runtime/backups/` chiếm **1,94 GiB**. Đây là backup lịch sử, khác với database đang dùng.
- Mã nguồn `src/`, `server/`, `shared/` cộng lại chỉ **1,56 MiB**. Xóa các màn hoặc module cũ không giúp giảm đáng kể và có thể làm hỏng app.
- Có thể xem xét dọn khoảng **10,34 GiB** nếu bỏ cả các bản kiểm thử, backup cũ, gói tài liệu/ảnh và bằng chứng đã lưu. Đây là trần tính toán; nếu giữ lại một backup hiện tại thì dung lượng thu hồi sẽ ít hơn tương ứng.
- Không xóa nguyên `.runtime/`, `data/`, `data/reports/`, `docs/` hoặc các file “v4–v14” chỉ vì tên có vẻ cũ. Những nhóm này có phụ thuộc đang hoạt động trong code.

## 2. Dung lượng từng thư mục chính

| Thư mục | Dung lượng | Số tệp |
| --- | ---: | ---: |
| `.tmp/` | 7,57 GiB | 293.476 |
| `.runtime/` | 2,35 GiB | 57.066 |
| `data/` | 1,39 GiB | 12.339 |
| `TAI_LIEU_TONG_HOP_HSK/` | 377,08 MiB | 4.380 |
| `dist/` | 243,51 MiB | 12.167 |
| `public/` | 242,40 MiB | 12.112 |
| `docs/` | 127,46 MiB | 2.102 |
| `node_modules/` | 75,21 MiB | 946 |
| `scripts/` | 1,93 MiB | 483 |
| `src/` | 1,28 MiB | 297 |
| `server/` | 0,16 MiB | 29 |
| `shared/` | 0,11 MiB | 40 |
| `schemas/` | 0,01 MiB | 1 |
| File lẻ tại gốc dự án | 145,57 MiB | 44 |

`TAI_LIEU_TONG_HOP_HSK.rar` riêng lẻ chiếm 145,39 MiB, đã nằm trong dòng “File lẻ”, không cộng lại vào tổng.

## 3. Mức 1 — ít rủi ro với luồng học hiện tại

Không cần cho luồng chạy app, nhưng xóa sẽ mất kết quả kiểm thử/ảnh cũ. Không phải cam kết rằng các script tổng hợp báo cáo lịch sử vẫn chạy khi thiếu bằng chứng của chúng.

| Phần có thể xem xét xóa | Dung lượng | Ảnh hưởng |
| --- | ---: | --- |
| `.tmp/` | 7,57 GiB | Bỏ các workspace/DB/bản build kiểm thử; không phải dữ liệu học hiện tại. |
| `docs/screenshots/` | 121,89 MiB | Mất ảnh minh chứng và gallery lịch sử; không xóa các file tài liệu build bắt buộc ở mục 6. |
| Bằng chứng/log được chọn lọc trong `.runtime/` | 209,67 MiB | Mất capture REA, log và khảo sát cũ; không gồm database/media. |

`.tmp/` gồm **13** workspace `v14/v15-regression-*` tổng **6,16 GiB**, **36** workspace `v14/v15-browser-*` tổng **0,91 GiB**, phần còn lại là restore/baseline/công cụ tạm. `scripts/v14-regression.mjs` và `scripts/v15-regression.mjs` tạo workspace mới theo timestamp, copy source/data/docs rồi chạy build. Các script browser tương tự giữ workspace sau khi đóng server, nên chạy nhiều lần sẽ tiếp tục tăng dung lượng. Chưa sửa các script này trong đợt thống kê.

Có **49 junction `node_modules`** trong `.tmp/`, trỏ ra thư viện dùng chung. Nếu sau này được duyệt dọn, thao tác phải chỉ bỏ junction tại workspace, không đi theo nó để xóa thư mục đích. Lượt kiểm tra không thấy Node/Vite của dự án hoặc cổng 3000/4173/8787/8788 đang chạy; trạng thái này có thể thay đổi.

Nhóm QA 209,67 MiB gồm 294 file lẻ khớp các tên `evidence/scenario/trace/screenshot/audio-audit`, `rea-hsk-build-analysis.json` hoặc đuôi `.log`, cùng các thư mục đã kiểm tra:

- `.runtime/open-data-discovery/` — 11,16 MiB.
- `.runtime/v5-baseline-capture/` — 9,94 MiB.
- `.runtime/qkt-account-review/` — 8,17 MiB.
- `.runtime/rich-learning-20261026/` — 6,36 MiB.
- `.runtime/reference-migii/` — 3,71 MiB.
- `.runtime/references/` — 2,52 MiB.
- `.runtime/motion-20261026/` — 2,23 MiB.
- `.runtime/qa-fixtures/` — 0,02 MiB.

Các file lẻ lớn nhất trong nhóm:

| File | Dung lượng |
| --- | ---: |
| `.runtime/migii-static-evidence.json` | 54,14 MiB |
| `.runtime/rea-hsk-build-analysis.json` | 51,31 MiB |
| `.runtime/migii-detail-evidence.json` | 7,12 MiB |
| `.runtime/migii-exams-evidence.json` | 6,75 MiB |
| `.runtime/migii-browser-evidence.json` | 4,24 MiB |
| `.runtime/audio-audit-http.json` | 3,19 MiB |

Không dùng các mẫu tên trên để xóa nguyên `.runtime/`; cần đối chiếu lại danh sách cụ thể trước khi thực hiện.

## 4. Mức 2 — app vẫn học được, nhưng mất bản lưu/lịch sử

| Phần | Dung lượng | Điều kiện và phần mất đi |
| --- | ---: | --- |
| `.runtime/backups/` | 1,94 GiB | Giữ một backup nhất quán, hiện tại trước khi bỏ backup cũ; mất khả năng quay về các mốc cũ. Các test lịch sử đọc baseline backup cũng sẽ không còn chạy nguyên trạng. |
| `TAI_LIEU_TONG_HOP_HSK/` | 377,08 MiB | Gói bàn giao/source/docs theo nhiều mốc, không nằm trong import runtime đã tìm. Có thư mục tài liệu lồng thêm một cấp và nhiều bản giao V7–V15. |
| `TAI_LIEU_TONG_HOP_HSK.rar` | 145,39 MiB | Gói nén tài liệu; xóa gói này không xóa thư mục đã giải nén. Không khẳng định archive và thư mục hiện tại giống nhau hoàn toàn. |
| `data/review-packages/` | 123,14 MiB | Gói xuất cho duyệt; mất bản xuất/giao tiếp đó. Không phải nội dung duyệt đang lưu trong SQLite. |
| `.runtime/review-packages/` | 5,97 MiB | Mất các bản xuất và đường dẫn mở bản xuất cũ; có thể xuất lại nếu đủ DB/source liên quan. |
| Phần bằng chứng còn lại của `data/reports/` | Tối đa 141,69 MiB | Chỉ chọn file QA/ảnh/log; giữ ít nhất các file backend đọc tại mục 6. Không xóa toàn bộ thư mục. Chưa tính khoản này vào các gói tiết kiệm bên dưới. |

Một số backup lớn trong tổng 1,94 GiB:

| Backup | Dung lượng |
| --- | ---: |
| `before-v15-2026-10-19T16-36-58-946Z` | 230,58 MiB |
| `before-qkt-compact-1792658417278` | 214,87 MiB |
| `before-v14-2026-10-19T09-27-19-986Z` | 203,67 MiB |
| `before-qkt-account-1792749435563` | 170,48 MiB |
| `before-v12-2026-10-18T10-29-20-255Z` | 104,21 MiB |
| `before-v11-2026-10-18T02-48-40-823Z` | 96,81 MiB |
| `before-v13-2026-10-19T01-31-46-014Z` | 95,83 MiB |
| `before-v10-2026-10-17T06-41-06-052Z` | 73,92 MiB |

## 5. Mức 3 — xóa có điều kiện, sẽ mất khả năng tái tạo hoặc phải cài/build lại

| Phần | Dung lượng | App hiện tại và điều kiện |
| --- | ---: | --- |
| `data/external-hsk-research/` | 777,52 MiB | Luồng học dùng dữ liệu đã xuất sang public; script `data:learning:integrate` vẫn đọc registry và normalized ở đây. Bỏ thư mục sẽ làm pipeline bổ sung học liệu không chạy lại được nếu chưa phục hồi nguồn. Có cả raw, nội dung chưa nhập, hàng đợi duyệt và backup nghiên cứu. Nên lưu trữ ngoài thư mục app thay vì mất hẳn nếu còn muốn hoàn thiện học liệu. |
| `data/imports/` | 320,01 MiB | Nguồn no7z/HearMandarin đã được import. App dùng bản public; import/validate cần nguồn này. Riêng `source.zip` chiếm 153,67 MiB; đây là tập con của số trên, không cộng lần hai. |
| `data/raw/` | 42,40 MiB | Nguồn syllabus/từ điển; app không đọc trực tiếp, các bước tái nhập và đối chiếu có thể cần. |
| `.runtime/tts/` | 122,36 MiB | Mô hình/engine/công cụ tạo audio cho pipeline. Không phải các audio đã dựng ở v4/v5/v6 hoặc MP3 public; xóa thì phải phục hồi để dựng lại audio kiểu này. |
| `dist/` | 243,51 MiB | Bản đang dùng bởi `npm run preview`. Nếu xóa thì preview không chạy cho đến khi `npm run build` tạo lại. Build lại cũng mang dung lượng này trở lại, nên không ưu tiên dọn nếu cần app chạy bình thường. |
| `node_modules/` | 75,21 MiB | Thư viện npm. Phải cài lại để dev/build/preview; chỉ tiết kiệm tạm thời nếu còn làm việc local. Giữ package.json/package-lock.json. |

## 6. Mức 4 — giữ để tránh hỏng tính năng hoặc mất dữ liệu

1. **`public/` — 242,40 MiB**: toàn bộ học liệu tĩnh, JSON, MP3, mẫu nét chữ, nguồn/giấy phép. Trong đó `public/data/open-hsk/` là 215,65 MiB; riêng audio là 151,89 MiB. Không xóa audio chỉ vì có một bản ở `dist/data`.
2. **Database đang dùng**: `.runtime/hsk-content.sqlite` và các file `-wal`, `-shm` cùng nhóm hiện tổng 56,09 MiB. WAL có thể chứa dữ liệu đã ghi mà chưa nhập vào file SQLite chính; không xem nó như log kiểm thử để xóa riêng.
3. **`.runtime/account/`**: session/tài khoản local; giữ cả database và các file WAL/SHM.
4. **`.runtime/media/`, `.runtime/v4-audio/`, `.runtime/v5-audio/`, `.runtime/v6-audio/`, `.runtime/v6-images/`**: media tải lên và tài nguyên cho Preview/backend. Không thay bằng mô hình TTS. `.runtime/community-audio/` là cache audio tải từ Mandarin Zone (10,06 MiB); xóa cache đòi hỏi mạng và nguồn còn truy cập được để phát lại, nên giữ khi mục tiêu là hoạt động bình thường.
5. **`data/staging/` — 15,07 MiB** và **`data/editorial/` — 0,44 MiB**: dù tên “staging/editorial”, nhiều API Preview và duyệt vẫn đọc trực tiếp các bản V4–V13 ở đây. Chưa loại bỏ tính năng thì chưa xóa.
6. **5 file trong `data/reports/`** có tham chiếu trực tiếp từ backend; giữ để các endpoint đánh giá/duyệt không lỗi hoặc mất thông tin. Tổng 1,75 MiB:

   - `data/reports/v4-level-screening.json` — 0,04 MiB.
   - `data/reports/v6/v5-question-backlog.json` — 0,06 MiB.
   - `data/reports/v6/level-screening.json` — 0,04 MiB.
   - `data/reports/v9/content-audit.json` — 1,44 MiB.
   - `data/reports/v12/media-provenance.json` — 0,17 MiB.

7. **Bốn file docs được import vào app khi build**:

   - `docs/DATA_SOURCES.md`
   - `docs/REFERENCE_REPOSITORIES.md`
   - `docs/CONTENT_LICENSES.md`
   - `docs/CONTENT_POLICY.md`
8. **`src/`, `server/`, `shared/`, `schemas/` và cấu hình build/package**. Các service V3–V14 vẫn được import bởi server hiện tại; chưa có cơ sở để xóa theo số phiên bản. Các script chỉ 1,93 MiB, nên giữ bộ công cụ phát triển hiện tại.
9. Giữ các file quyền truy cập/cấu hình như `.runtime/admin-access.txt` và file môi trường nếu có; lượt kiểm tra không đọc hoặc in nội dung khóa.
10. Lịch sử học, kế hoạch và SM2 còn dùng storage của trình duyệt (`hsk-study-data-v1`, `hsk-preparation-v1` cùng key theo tài khoản). Chúng không được tính như thư mục học liệu ở đây. Không dọn site data/localStorage nếu muốn giữ lịch sử.

Bằng chứng phụ thuộc: `server/admin-server.mjs:27` cấu hình runtime/SQLite; `server/account-server.mjs:8` dùng sessions.sqlite; `server/media-store.mjs:22` lưu media. `src/ExamApp.tsx:38–41` import bốn file Markdown. Các đường dẫn staging/report được đọc trong `v4/v5/v6/v8/v9/v10/v11/v12/v13-content-service.mjs` và `v7-review-service.mjs`.

Đã đối chiếu SHA-256 **toàn bộ 12.112 file public** với file tương ứng trong dist: **không có khác biệt**, tổng 242,40 MiB. Đây là bản copy phục vụ bản build; không có nghĩa có thể bỏ cả public và dist.

## 7. Ba phương án để xem xét, chưa thực hiện

Các số cộng bên dưới dùng những nhóm không chồng nhau, không cộng lại thư mục con cùng thư mục cha.

| Phương án | Các phần tính vào | Dung lượng dự kiến giảm | Dự án còn khoảng |
| --- | --- | ---: | ---: |
| A — ít ảnh hưởng nhất | Chỉ `.tmp/` | 7,57 GiB | 4,92 GiB |
| B — dọn phần lưu lịch sử | A + backup cũ + TAI_LIEU folder/RAR + ảnh screenshots + QA runtime đã chọn | Tối đa 10,34 GiB | Tối thiểu 2,15 GiB |
| C — chỉ giữ vận hành, bỏ nguồn tái tạo | B + external research + imports + raw + các gói review + TTS | Tối đa 11,70 GiB | Tối thiểu 0,79 GiB |

**Khuyến nghị A trước; B sau khi chọn bản backup cần giữ.** Phương án C dành cho quyết định bỏ pipeline/nguồn nghiên cứu, không phải đề nghị xóa ngay. B/C là mức tối đa trước khi tính backup giữ lại hoặc chép ra ổ khác; không giảm dung lượng toàn ổ nếu chỉ chuyển sang một folder khác trên cùng ổ.

Đây là kiểm tra dung lượng và phụ thuộc tĩnh, không xóa thử rồi chạy lại app. Không chạy các bộ regression cũ vì chính chúng tạo thêm bản sao. Chưa chứng nhận một phương án đã được thực hiện và kiểm thử sau xóa.

## 8. Các thư mục tham chiếu ngoài app

Không cộng các dòng này vào 12,49 GiB của LuyenThiHSK.

| Thư mục ngoài app | Dung lượng | Mức xem xét |
| --- | ---: | --- |
| `D:\ReactJS\Rea-HSK-Reference` | 824,11 MiB | Có điều kiện: app runtime không import clone này, nhưng các npm lệnh import/validate/test dùng TS loader ở đây, các test trình duyệt gọi REA/Playwright của clone. Giữ nếu tiếp tục dùng những công cụ đó. |
| `D:\ReactJS\HSK4-MandarinZone-Data` | 319,88 MiB | Có điều kiện: script import-mandarin-zone đọc nguồn này; luồng học dùng dữ liệu đã import và audio qua API. Bỏ clone mất nguồn để import lại cục bộ. |

`HocTiengTrungApp` là dự án nguồn riêng theo yêu cầu trước; không sửa, không đưa vào phương án dọn. Các dự án khác trong D:\ReactJS và Git dùng chung cũng không thuộc danh sách xóa này.

