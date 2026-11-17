# QA không gian học tập theo tham khảo QKT · 23/10/2026

Bản hiện tại chạy tại http://127.0.0.1:4173/ . Các kiểm tra dưới đây chạy sau thay đổi giao diện và luồng điều hướng; các phần bên dưới đường phân cách là lịch sử.

| Kiểm tra mới | Kết quả |
| --- | --- |
| npm run build | PASS: TypeScript + Vite production |
| npm run lint | PASS |
| TSX loader: scripts/test-hsk-portal.mjs | PASS: menu/routes, trạng thái trống, liên kết đúng cấp, resume, tiến độ thật, không sửa dữ liệu khi render |
| npm run test:catalog | PASS: bộ lọc kết hợp, version/type, tìm mã, thời lượng, chấm exact-text |
| node scripts/test-qkt-workspace.mjs | PASS: chọn cấp → đọc → catalog đúng version/type → làm câu → reload giữ đáp án → nộp → lịch sử mở đúng kết quả; HSK 2.0 không lẫn 3.0; nhóm từ 20 mục; kế hoạch dùng cấp mục tiêu; attempts giữ nguyên khi chuyển màn hình |
| Cùng browser check | PASS: dashboard/practice/exams/vocab không tràn ngang ở 390/760/1024/1440 px; không có pageerror |
| REA 5 scenario cục bộ | PASS: tổng quan và hub kỹ năng desktop/mobile; luồng sắp xếp câu từ hub qua intro/cancel, quay lại câu giữ đáp án, kiểm tra đúng, nộp kết quả 1 đúng/9 bỏ trống |
| Bảo toàn dữ liệu | PASS: manifest byte-identical, 255 JSON bank có URL byte-identical; so sánh SELECT * từng hàng của cả 8 bảng SQLite với snapshot trước sửa, hoàn toàn không đổi |
| Dịch vụ | API 8787, preview 4173, account BFF 8788 đang lắng nghe; account ở guest mode |

Bằng chứng REA cục bộ:

- home: ev_ff501832b103128536b20813ccf683729426cf71045646d5127e25fe3fd89f68 (3 bước hoàn tất)
- home-mobile: ev_de587d07f7b2f67794d8297cc002b53971be876890696ed93e3a5c45dcc6a46c (3 bước hoàn tất)
- skills: ev_e9693f3d6ecbe466ac9a1d347315261c67118a45ad2b7b4a449ca5e30981fae1 (3 bước hoàn tất)
- skills-mobile: ev_ebb3d866406c9078c601ae45d748d2e782f0d5088789c3645270d706e1be1171 (3 bước hoàn tất)
- flow: ev_e519cf09c7299dec9ed2c9d2a8e9f77dffdeb747e3589472209e0ed5870150a6 (20 bước hoàn tất)

[Trang tổng quan](screenshots/qkt-workspace/home.png) · [Mobile](screenshots/qkt-workspace/home-mobile.png) · [Hub kỹ năng](screenshots/qkt-workspace/skills.png) · [Hub mobile](screenshots/qkt-workspace/skills-mobile.png) · [Kết quả qua REA](screenshots/qkt-workspace/flow.png).

Test trình duyệt dùng context/profile tạm, không lấy hoặc sửa localStorage trong profile người dùng. Không migration hoặc thay khóa lưu trữ. Không nhập dữ liệu QKT. Không chạy lại importer/audit toàn bộ audio vì lần này không đổi nội dung hoặc engine audio. Tài khoản/cloud chưa cấu hình provider; viết/nói là tự đánh giá, chưa tích hợp AI chấm. Các phép chấm theo nguồn dữ liệu chưa phải xác minh chuyên môn.

Snapshot: .runtime/backups/before-qkt-account-1792749435563. Bảo toàn: .runtime/qkt-account-review/preservation-result.json. Để chạy browser check cần web và API đang chạy, cùng playwright-core có sẵn trong Rea-HSK-Reference; không cài dependency mới.

---

# QA bản danh mục gọn và bài luyện mới · 22/10/2026

Bản cục bộ: **262 bộ/24.542 câu/8.708 MP3**. Không triển khai public hoặc cấu hình tài khoản/cloud. Giữ database và tiến độ cũ; bằng chứng mới ở `.runtime/qkt-continuation-summary.json`.

## Kiểm tra đã chạy trên bản sửa

| Lệnh | Kết quả |
| --- | --- |
| `npm run build` | PASS: TypeScript + Vite production; cảnh báo profiling/copy public assets lớn, không lỗi build |
| `npm run lint` | PASS: noEmit/noUnusedLocals/noUnusedParameters |
| `npm run data:hsk:import -- --dry-run` | PASS trước nhập; dự kiến thêm93, sửa3 metadata, không đổi8864 |
| `npm run data:hsk:import` rồi chạy lặp | PASS; lần lặp0thêm/0sửa/8960khôngđổi |
| `npm run data:hsk:validate -- --backup=.runtime/backups/before-qkt-compact-1792658417278/hsk-content.sqlite` | PASS: 243bank/22.979câu mở, hash/schema/provenance, khóa MC, exact-text đúng/sai/bỏtrống/dấucâu, token từ nguồn, audio liên kết, giao skill+dạng, selection/time, snapshots/reload; 150bank cũ byte-identical và 8bảng SQLite giữ mọi hàng |
| `npm run test:catalog` | PASS: edition/cấp/kỹnăng/dạng/category/searchmã, trạngthái mới/đang/đãlàm, sorttên/cấp/gầnđây, thời lượng, cảbộ/thứtự, chấm1đúng/1sai/8trống |
| TSX loader: `scripts/test-practice-catalog.mjs` | PASS: 1.033câu MandarinZone, 510câu cũ; bảo toàn editorial/APIchỉđọc; chọn/lưu/reload cả ngân hàng355câu và ôn câu sai |
| TSX loader: `scripts/test-hsk-portal.mjs` | PASS: routes/sidebar/mobilemenu/resume/progress thật |
| TSX loader: `.tmp/test-study-direct.mjs`, `.tmp/test-preparation-direct.mjs` | PASS: scoring/deadline/migrations/storage/quota/SM2/CSV/rights; curriculum/search/quiz/plan/adaptive/mastery |
| `node scripts/test-community-audio.mjs` | PASS: concurrentcache/range/seek/HEAD/allowlist/read-only/upstreamerror |
| `npm run data:hsk:audio -- --http` | PASS: mọi8.708MP3 local SHA/size/duration/header hợp lệ; HTTP200, audio/mpeg, Content-Length đúng; `.runtime/audio-audit-http.json` |

TSX loader hiện hữu: `node --import ../Rea-HSK-Reference/node_modules/tsx/dist/loader.mjs <script>`. Không thêm framework kiểm thử. Không chạy lại toàn bộ regressionV3–V15/API/cloud; không coi báo cáo lịch sử là bằng chứng mới. Remote MandarinZone479HEAD/43APIaudio thuộc lần trước; lần này chạy kiểm tra cache/range và mọi MP3no7z quaHTTP, không khẳng định tải lại toàn bộ remote audio.

## REA/Chrome thực tế

Mọi bước ở các scenario dưới đều completed, cleanup terminated-owned-process. Desktop1440×1000, mobile390×844. Không dùng storage người dùng; fixture chỉ ở profile tạm.

| Scenario | Luồng đã qua | Evidence |
| --- | --- | --- |
| compact-desktop | Desktop, compact catalog (2 bước) | ev_357da7434dfd970ba5988abf0633d36a93e26b01244bc334b23e64da7be45892 |
| compact-mobile | Mobile, compact catalog (2 bước) | ev_6b7b2f111e722e20211d26d8c4908f8a2bda188a89edad094a02408504d6645a |
| compact-intro | Giới thiệu cả bộ 100 câu (6 bước) | ev_59febb24605f07d347537fb92e547278595101cb6d0ed97cbc97e61defabbb3f |
| compact-filters | Phân trang/lọc kết hợp/sort/reset/empty mobile (16 bước) | ev_39ad0797231efb03365e04555a08218ee550e8749e5c2e5cd7430fa3791d8e0d |
| compact-order | Hủy intro, chọn kỹ năng, nhập/chuyển câu/giữ đáp án/chấm/nộp/kết quả mobile (18 bước) | ev_21debe1698c543a041b1fcf52910b859b213168579631f5c8ac1afdcab501a2f |
| compact-dictation | Audio thường/chậm/phát/dừng/tua, nhập/chấm/reload/resume (22 bước) | ev_1d03b5a49cba3909bc143c073ef0dc305915217a23bf68b55e7070b9461c03d3 |
| compact-whole-timed | Cả bộ100 có giờ, thoát/lọc Đang làm/resume/nộp (19 bước) | ev_bb0e68d98e95020e30fe17e44660a722919827086e85199359c4975e6319522e |
| compact-audio-intro | Nghe thử kết thúc → xác nhận → mới bắt đầu timer100câu (13 bước) | ev_fa3c1a2ffa484ea52a348d1ce3404ee7c2a983df31aec68370df780c35275871 |
| compact-expired | Snapshot hết hạn tự nộp; bỏ trống không đúng (2 bước) | ev_e8033cd3b8665dea1e051a0494c6796c2447ba28710ddd841ab026d2265b6256 |
| compact-audio-limit | Một lượt nghe, tạm dừng/tiếp tục, khóa lượt mới (9 bước) | ev_c2b294cf107bb71cdb7381cbf2b7c92ce55d44d183ee702937954172357843de |
| open-audio-error | File lỗi không mất đáp án; vẫn điều hướng và nộp (7 bước) | ev_30e24870e37ee6fdec1ab667edec032cbdaa3479ee67bb4f9a28739078086dd1 |

Ảnh đã xem trực tiếp: [desktop](../.runtime/compact-desktop-evidence.json.png), [mobile](../.runtime/compact-mobile-evidence.json.png), [kết quả nhập câu mobile](../.runtime/compact-order-evidence.json.png). Không tràn ngang trang; hàng chọn cấp mobile cuộn riêng. Card đầu desktop cao hơn đáng kể so với bản hero cũ; chi tiết nguồn đóng mặc định. Keyboard dùng controls native; intro có focus trap/Escape dùng hook sẵn có. Chưa kiểm tra bằng screen reader thật, không khẳng định WCAG đầy đủ.

Hai fixture ban đầu thất bại đã được sửa: audio-intro chờ state `ended` không tồn tại (component trở về ready khi kết thúc), đổi sang checkbox xác nhận enabled; audio-limit có deadline cũ hết hạn, đổi sang timestamp mới. Chạy lại đều qua, không cần sửa engine cho các lỗi fixture này. `open-audio-limit-evidence.json` giữ lần thất bại, bằng chứng hiện hành là `compact-audio-limit-evidence.json`.

Console thường chỉ có cảnh báo ServiceWorker bị Playwright chặn. Ca file audio giả404 có consoleerror kỳ vọng. Những scenario này không xác minh serviceworker/offline hay SWupgrade trên profile người dùng; cache shell đã bump nhưng không xóa localStorage.

## Kiểm tra sau build cuối

Build cuối qua, log .runtime/qkt-continuation-final-build.log; API8787/catalog4173/bank mới đều HTTP200. Chạy lại REA trên dist cuối: compact-desktop (ev_72fbe6e51210dbf45065e5ae0947f81e2713d6e3da4e0f9165ba3845db8b7b17, 2 bước); compact-mobile (ev_7fd21e66c818493a40fc8384b3f565a0f0d8850c40a19bb80c4c483972ee7420, 2 bước); compact-order (ev_4ce298c6c9d2b0195d63aa89ef267334cf148adbedb2e9e260ddbd11d0fe6575, 18 bước). Mọi bước completed. Các thay đổi cuối chỉ thu gọn nhãn lỗi, ghi rõ nhãn edition chưa xác minh, reset độ dài về10 và cập nhật báo cáo.

## Phần còn thiếu / cần rà soát

Chưa thêm đề chính thức mới, audio cấp7–9 hay viết tự do có thẩm định. Đáp án source và nhiễu MC chưa qua chuyên gia; câu khôi phục có thể có phương án khác hợp ngữ pháp. Bản hiện tại chấm đối chiếu câu nguồn, hiển thị giới hạn này. Chưa có tài khoản/cloud cấu hình đầy đủ. QKT AIwriting sau đăng nhập không được kiểm tra. REA không xác định database nội bộ của QKT/Migii.

Giữ `README.md`, `CURRENT_STATE.md` và ba báo cáo còn lại đồng bộ. Xem lệnh chạy/cập nhật trong [DATA_INGESTION_REPORT](DATA_INGESTION_REPORT.md).

---

## Lịch sử trước bản giao diện gọn

Các số liệu/kiểm thử bên dưới thuộc bản trước; dùng phần đầu tài liệu để xem hiện trạng.

# QA kho mở và audio · 22/10/2026

Đã kiểm tra bản chạy cục bộ ở `http://127.0.0.1:4173`, API8787; giữ React19/TS7/Vite8 và SQLite hiện hữu. Không triển khai public/cloud. Không thay đổi token/admin/account. Số liệu hiện hành:169 bộ bài,15862 câu,8708 MP3 no7z cục bộ; bài bổ trợ và bản nháp chưa được duyệt chuyên môn.

## Kiểm tra đã chạy

| Lệnh / bằng chứng | Kết quả thực tế |
| --- | --- |
| `npm run build` | PASS, gồm typecheck và production build; log `.runtime/open-hsk-delivery-build.log`. Vite có cảnh báo thời gian copy public assets lớn và profiling callback, không phải lỗi build. |
| `npm run lint` | PASS, TypeScript noEmit/noUnusedLocals/noUnusedParameters; `.runtime/open-hsk-release-lint.log`. |
| `npm run data:hsk:fetch -- --offline` | PASS, raw/hashes đúng, không cần mạng; `.runtime/open-offline-release.log`. |
| `npm run data:hsk:import -- --dry-run` sau import | PASS, 0 thêm/0 sửa/8867 không đổi; `.runtime/open-hsk-release-dryrun.log`. Dry-run chỉ ghi log kiểm tra, không ghi dữ liệu phục vụ hay DB. |
| `npm run data:hsk:validate -- --backup=.runtime/backups/before-open-datasets-2026-10-22/hsk-content.sqlite` | PASS, schema/hash150bank,14299key đúng/sai, edition, skill+dạng giao nhau, độ dài/thời gian, session snapshot sau reload, dedupe đảo option/conflict/context, gần trùng1phép sửa/không gộp hoán vị, ID từ duy nhất và source variants, mọi MP3 checksum/thời lượng, từ chối dữ liệu/audio sai. **Tất cả hàng trong 8 application tables khớp backup**; `.runtime/open-hsk-test-release.log`. |
| `node --import ../Rea-HSK-Reference/node_modules/tsx/dist/loader.mjs scripts/test-practice-catalog.mjs` | PASS,1033câu Mandarin Zone,510câu nháp cũ, lọc/chọn/chấm, storage/câu sai reload, API chỉ đọc, bảo toàn editorial; `.runtime/open-legacy-release-test.log`. |
| Cùng TSX loader, `scripts/test-hsk-portal.mjs` | PASS, routes/navigation/mobile menu, empty data, skill links, resume, progress thật, không mutation; `.runtime/open-portal-release-test.log`. |
| `node scripts/test-community-audio.mjs` | PASS, cache/download đồng thời/range+seek/HEAD/range sai, allowlist/read-only/upstream lỗi; `.runtime/open-community-audio-release-test.log`. |
| Cùng TSX loader, `.tmp/test-study-direct.mjs` | PASS, scoring/deadline/resume/storage migrations, CSV/edition/license/dedupe, SM2/corrupt/quota/public-rights/routes; `.runtime/open-study-release-test.log`. Đây là assertions chạy trực tiếp, không gọi là Vite SSR harness đã qua. |
| Cùng TSX loader, `.tmp/test-preparation-direct.mjs` | PASS, curriculum/search/quiz/unique distractors/registry, dailyplan/readiness/adaptive/mastery/CSV/storage isolation; `.runtime/open-preparation-release-test.log`. |
| `npm run data:hsk:audio -- --remote` | PASS:8708VALID_LOCAL,479REMOTE_HEADERS_ONLY và43VALID_LOCAL_API. `.runtime/audio-audit.json`;479 là URL duy nhất,481 là số tham chiếu câu Mandarin Zone. HEAD không xác minh checksum/giải mã toàn bộ file remote. |
| `npm run data:hsk:audio -- --http` (sau build, preview đang chạy) | PASS:8708file đều HTTP200/audio-mpeg/kích thước đúng, kiểm tra local SHA+frame-duration. `.runtime/audio-audit-http.json`, `.runtime/audio-http-delivery.log`. Các bản build sau chỉ sửa metadata/nghĩa/cache, không thay đổi byte audio. |

DB không cần migration vì schema không đổi; so sánh từng hàng chứng minh bảo toàn dữ liệu trong phạm vi task. Lệnh validate mặc định không phụ thuộc backup lịch sử; thêm `--backup=...` khi cần đối chiếu snapshot. Không mở hoặc ghi vào localStorage của profile cá nhân để chạy test: scenarios dùng browser profile tạm và fixtures riêng.

## Kiểm tra bằng trình duyệt REA

Đã đọc từng trạng thái bước và artifact; không chỉ dựa vào exit code. Các tệp bên dưới ở `.runtime`, có JSON evidence đầy đủ; Chrome do REA mở và tự đóng.

| Scenario đã qua | Phạm vi |
| --- | --- |
| `open-audio-fixed-evidence.json`,20bước, `ev_24c3bce8eb39e1d0a202fe50ec91073f0530677684570c3d00e2c1c59a2a6b00` | HSK3Nghe: mở/luyện, file normal, play/pause, chọn file slow/play, tua, trả lời/kiểm tra, thoát/reload/tiếp tục giữ đáp án. Có transcript/pinyin/nghĩa nguồn. |
| `open-filters-fixed-evidence.json`,21bước, `ev_1dd1a2da752e7693f49cd000811f080793422627172eb993463305c44b19ec3b` | HSK3 có16bank, phân trang2/2, lọc Đọc reset trang, HSK2empty/GF2021có bài, Viết GF2021empty, tìm Hanzi/nội dung,20câu kết hợp thời lượng, mở đúng20câu. |
| `open-advanced-mobile-delivery-evidence.json`,8bước, `ev_2c6bd37823aeaee14c51491802adb8e2a0415f8e29e1cf5b7dfec64b2cc20d49` | 390×844: HearMandarin7–9 mở bài/chọn/nộp/xác nhận/kết quả,1đúng9bỏ trống; chạy lại sau sửa nghĩa đa cấp. Room riêng `open-advanced-room-delivery-evidence.json`, `ev_b07eed7010f8d87e54f0d2115b50b9904ed2d8f0b6311d3084a2797c1632378e`, xác nhận pinyin/POS và nghĩa gentle; mild. |
| `open-audio-limit-evidence.json`,9bước, `ev_77ac15cb1f8c2ad6a4e31e1d49827a675dea7940f2bbef88a0888ea4fdf35754` | Fixture timed maxPlays1: play/pause/tiếp tục lượt đang dở, kết thúc rồi khóa replay. |
| `open-audio-error-evidence.json`,7bước, `ev_16815c94da3fd452f0713b82046d909efdc85eebe67f911b6ca47f047852743a` | MP3 cố ý404: báo lỗi thân thiện; vẫn trả lời/nộp/chấm được. Console404 này thuộc fixture, không phải lỗi asset production. |
| `open-catalog-desktop-delivery-evidence.json` | 1440×1000, danh mục và số liệu thật; đã nhìn screenshot và sửa select tràn chiều rộng. |
| `open-catalog-mobile-final-evidence.json`, `open-catalog-mobile-filters-evidence.json` | 390×844, đã nhìn hero/tab cấp và bộ lọc khi cuộn, focus search rõ, không tràn ngang trong các ảnh kiểm tra. |
| `open-catalog-tablet-final-evidence.json`, `ev_fa9b84c0735c2bbea28c155a20ad0a7f6e68ce2ac1b18c3f65192ce72c4bb560` | 820×1180, đã nhìn screenshot sau điều chỉnh tab cấp thành4cột; không còn chữ bị ép vào8cột hẹp. |
| `open-gloss-delivery-evidence.json`, `ev_7e98ff1734925ec204cba58452100865f12bbaf642a5fc04a8513ab84896f82d` | Mở từ HSK1 và mở rộng nghĩa: nghĩa Việt cũ, nghĩa Anh/POS HearMandarin, license, sourceID và cấp2.0/3.0 đều hiển thị. |

REA phân tích QKT riêng được ghi ở [REA_ANALYSIS](REA_ANALYSIS.md); không nhập nội dung QKT. Screenshot/evidence ban đầu không được dùng thay cho kết quả kiểm tra cuối.

## Lỗi đã xử lý và giới hạn

- Sửa TypeScript facets không tương thích lib bằng reduce; giữ Object.groupBy trong script Node24 nơi được hỗ trợ. Sửa cách đếm lượt nghe để pause/resume không mất thêm lượt, reset vị trí đúng khi đổi file và vẫn giới hạn replay sau lượt cuối.
- Phát hiện12mục từ có cùng chữ/cách đọc ở nhiều band nhưng nghĩa/từ loại khác nhau. Đã sửa bài7–9 chọn nghĩa/POS của bản ghi band7, giữ canonical ID ổn định, sourceRecordId trỏ đúng biến thể. Ví dụ 和 hé: bài7–9 dùng adjective/gentle; mild, không dùng conjunction/and; with. Test đối chiếu toàn5595đáp án với raw band7 theo sourceID, và toàn8704bài câu với raw no7z (kèm quan hệ audio→source). Đây là đối chiếu nguồn bằng máy, chưa là thẩm định ngôn ngữ độc lập.
- Service worker đổi cache sang hsk-shell-open-audio-v3, JSON kho mở ưu tiên mạng và fallback cache để tránh giữ đáp án cũ khi importer cập nhật. REA chạy profile tạm có service worker bị công cụ chặn, nên chưa dùng các scenario đó để khẳng định toàn bộ luồng offline/service-worker đã được kiểm chứng runtime.
- Lần audit HTTP trong lúc Vite xóa/copy dist hoặc preview dừng đã lỗi (HTML/kích thước/không kết nối). Sau khi build hoàn tất và mở lại preview, toàn8708file đã qua. Không chạy build đồng thời audit HTTP.
- Một số scenario ban đầu dùng locator không duy nhất hoặc role không có trong contract REA (searchbox/heading) bị từ chối; đã sửa bằng CSS/nhận diện duy nhất. Scenario danh mục chờ no7z ở trang1 khi đang chọn tất cả cũng sai vì trang1 có các bộ cũ; sửa fixture chọn HSK3. Không tính các lần lỗi này là test qua.
- Kiểm tra MIME/frame-duration/checksum tự động không thay thế nghe và đánh giá phát âm từng file. Chỉ phát một số file đại diện trong browser; chưa nghe thủ công toàn8708file. Remote HEAD không bảo đảm file nguồn sẽ tiếp tục tồn tại; các tệp no7z đã lưu cục bộ.
- Chưa kiểm toán mọi trình duyệt/thiết bị, screen reader hay đo tương phản toàn giao diện. Dùng button/select/label native, aria-pressed/live, focus-visible; ảnh desktop/tablet/mobile và assertions keyboard/mobile-menu là phạm vi đã kiểm tra.
- Chưa có bộ chính thức đầy đủ mới, bài Viết mới hoặc audio7–9. Nhiễu/đáp án/English gloss/cấp từ cần duyệt chuyên môn;31xung đột cấp và85cặp nghi trùng giữ cờ. Các0trùngfingerprint không đồng nghĩa0câu gần nghĩa.
- Tài khoản/cloud chưa được cấu hình đầy đủ; kết quả khách lưu tại thiết bị. Không chạy lại toàn bộ các bộ regression V14/V15 lịch sử và không dùng số39/39 cũ làm chứng cứ cho lần thay đổi này.

Chi tiết nguồn/quyền, dữ liệu và cách rerun tại [DATA_SOURCES](DATA_SOURCES.md) và [DATA_INGESTION_REPORT](DATA_INGESTION_REPORT.md).
