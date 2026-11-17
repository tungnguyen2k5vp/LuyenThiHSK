# V13 QA · V13_QA_PASSED (local, phạm vi tích hợp)

Kết quả cuối: 35/35 regression, 14/14 matrix, 30 nhóm V13 mỗi Chrome/Edge, 7/7 A/B trong budget, 17 security checks và 729 source files stable. Nội dung chờ human review; cloud/physical devices chưa xác minh. Xem phần lịch sử lỗi và artifacts bên dưới. Các bảng/vòng đầu được giữ để truy vết, không phải số liệu cuối.

| Phạm vi | Kết quả hiện tại | Bằng chứng |
| --- | --- | --- |
| Backup / restore | PASS, 3.914 source + 147 runtime hash; 8/2 bảng DB khôi phục | backup-verification.json |
| Baseline V12 | 32/32 PASS sau sửa harness thiếu 4 raw-import docs | baseline/regression.json, previous-* giữ log fail đầu |
| Contract/adapters | 2.847 assertions PASS ban đầu; có thêm bridge tests đang chạy lại | contract-tests.json |
| V13 content / rollback | 386 PASS | content-tests.json |
| V13 API / safety / CAS | 7.541 PASS, disposable DB | api-tests.json |
| Typecheck/build toàn src | PASS kể cả Gemini đã bàn giao | npm run build; không exclude integrated UI |
| Chrome tích hợp Today + Hub | 12 nhóm PASS | browser-chrome.json |
| Today A/B | WITHIN: cũ 43,1ms, V13 42,4ms p95, 20 cặp | today-performance-chrome.json |
| Service A/B | Cùng hash đầu ra; 7→6 SQL calls; p95 411,1→361,9ms | service-performance.json; before giữ nguyên |
| Expert language/audio/license | Chưa có human reviewer, không giả approval | 20 từ mới NEEDS_REVIEW; audio HSK2 0/40 |

## Vòng final hiện tại · 2026-10-19

Các số ở bảng trên là lịch sử bước đầu. Kết quả mới:

- Full source typecheck/lint/build và 35 mục hồi quy: PASS (`final/regression.json`).
- Contract 2.867; content 386; API 7.541 checks PASS.
- Chrome và Edge V13: 29 nhóm mỗi browser PASS. Thêm Practice/Question/Writing/Result/Mistakes, nộp trùng, reload, composition/native Undo và exact-question review. Không đồng nghĩa real-device IME.
- Data safety PASS: 1.359 content; 3.743 revisions cũ không đổi, 20 mới đúng V13; schema/account/public/runtime assets không đổi; human/published 0.
- Security 17 static/local HTTP checks PASS; live cloud RLS NOT_VERIFIED.
- Final legacy browser matrix, A/B mở rộng và source hash verification: đang thực hiện. Không gán final PASS trước khi có kết quả.

## Lỗi đã quan sát

- Baseline build đầu thiếu 4 tài liệu trong source snapshot. Dùng build workspace riêng với supplementary docs có hash; backup gốc giữ nguyên.
- Chrome CDP trong sandbox timeout trước tải trang. Lượt ngoài sandbox chạy được; không coi timeout này là pass của app.
- CSS comparison đầu đọc giữa transition nên padding khác. Harness sau đó đợi/finish finite animations trước so sánh; test CSS scope vẫn giữ, không bỏ assertion.
- Gemini thiếu 47 CSS variables, một số labels diễn đạt sai incremental vocabulary/unknown mastery. Sau final handoff, Codex thêm aliases có namespace và sửa labels/null handling, không tự gán human review.
- Stop-Process lỗi nội bộ PowerShell; xác minh PID/lệnh rồi dùng CIM Terminate. API mới chạy, mã admin giữ nguyên. Không tạo hai writer cùng DB.

CI/Git, Firefox/WebKit, thiết bị IME thật và chuyên gia ngôn ngữ: chưa xác minh. Không deploy production, không gọi dịch vụ trả phí.

## Theo dõi fixture audio trong final matrix

Ma trận đầu dừng ở V11 Edge: audio PCM fixture không đạt readyState trong timeout; app tạm dừng timer và giữ bài. Không có runtime exception/console error. Lượt Edge V11 chẩn đoán kế tiếp pass, chưa đủ để kết luận nguyên nhân hoặc gọi lỗi đã sửa.

Đã bổ sung capture request/auth boolean, audio src/ready/network/error và resource timing vào catch của fixture V11/V12. Không ghi token; không tăng timeout hoặc bỏ assertion; không thay audio/player/gate của sản phẩm. Chạy chuỗi 10 Edge V11 liên tiếp trước chạy lại matrix. Log thất bại đầu được giữ tại `data/reports/v13/final/browser-1792388411279/` và failure report V11.

- Chuỗi Edge V11: 10/10 PASS. Nguyên nhân timeout đầu chưa được chứng minh; không gọi retry là bản sửa.
- Matrix tiếp theo qua V11 cả hai browser và V12 Chrome, nhưng V12 Edge stalled khi nghe lại bản microphone giả lập. Log matrix thứ hai được giữ riêng.
- MicrophoneRecorder trước đó mount audio khi Blob URL còn chuỗi rỗng. Sửa chỉ tạo audio khi URL đã có, key theo URL và preload auto; vẫn một native player, không đổi record/convert/save/upload/rights logic.
- Harness đưa tab ra foreground trước native control click; tắt background throttling/occlusion cho môi trường headless. Vẫn yêu cầu PCM thật giải mã, currentTime tăng và native click; không giả duration/currentTime, không thay assertion bằng mock.
- Edge V12 sau sửa: một vòng diagnostic PASS; đang chạy lại full regression, chuỗi 10 microphone và final matrix. Chưa gán final PASS.
- A/B mở rộng thêm vòng redraw sau khi trả flag về V13, tránh đọc DOM legacy còn lại sau đo. Đây là sửa harness; không đổi budget.

Sau sửa: full regression 35/35 PASS; Edge V12 microphone 10/10 PASS. Final matrix và A/B mở rộng tiếp tục chạy trước final release gates. Manifest trước sửa giữ riêng; manifest mới chụp 728 source/config/test files và sẽ xác minh lại cuối chuỗi.

## Legacy admin fixture isolation

- Scenario V1–V2 mở editor trước khi request cập nhật trạng thái/list hoàn tất, nên không có nút Công bố. Harness giờ đợi đúng trạng thái và editor đóng; không bỏ điều kiện duyệt/công bố.
- Phát hiện cả nhóm V3 cũng có mutation trực tiếp vào API chính. Đã cách ly frontend fetch và Node fetch của toàn bộ scenario admin sang SQLite clone với port riêng, giữ các positive/negative assertions.
- Các lượt trước để lại đúng 5 fixture QA ARCHIVED và 18 technical review/audit rows. Không xóa lịch sử; manifest exact IDs/payload/review hashes tại `known-qa-artifacts.json`. Đây không phải human review nội dung editorial. Data safety giữ strict check mọi historical row và chỉ nhận diện đúng artifact đã ghi, không whitelist mọi `qa-*`.
- Các kết quả browser đã đạt chỉ được giữ khi product source/config/schema/editorial không đổi; QA helpers có manifest riêng. Xem `product-source-stability.json`, trạng thái `carriedForward` và đường dẫn log gốc trong matrix. Không trình bày resumed matrix như một clean run duy nhất.

## Bằng chứng chốt

- `final/release-gates.json`: V13_QA_PASSED; productionReady=false.
- `final/regression.json`: 35/35 PASS, gồm full source TypeScript/lint/build và V1–V13.
- `final/browser-matrix.json`: 14/14 PASS, có carried-forward provenance; `product-source-stability.json`: 293 product/config/schema/editorial files không đổi.
- `final/audio-repeated.json`, `final/microphone-repeated.json`: 10/10 Edge V11 và 10/10 Edge V12.
- `today-performance-chrome.json`: 7 so sánh, 20 cặp mỗi nhóm, tất cả WITHIN; ba nhóm navigation/filter đo vòng hai thao tác, chỉ là 2-RAF paint proxy.
- `data-safety.json`: PASS_WITH_ARCHIVED_QA_ARTIFACT; original content/status giữ, 40 technical timestamps + một work timestamp; 5 exact archived QA fixtures và 18 technical review rows được khai báo, không xóa audit.
- `final/legacy-admin-isolation.json`: PASS, checkedFixtureIds không xuất hiện trong main.
- `staging-security.json`: 17/17 static/local HTTP PASS; live cloud/RLS NOT_VERIFIED.
- `final/source-verification.json`: PASS, 729 file không đổi.
- Scope editorial 1.359: Draft 5, Needs Review 1.354, automatedValid 1.359, humanReviewed 0, published 0.
