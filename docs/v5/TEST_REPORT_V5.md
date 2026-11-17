# TEST_REPORT_V5

Cập nhật 16/10/2026 · 2026-10-16T03:39:30.155Z · v5-hsk1-batch-2.

## Hồi quy tự động

| Script | Exit | ms |
|---|---:|---:|
|typecheck|0|511|
|lint|0|525|
|test|0|3014|
|test:v2|0|3033|
|test:v3|0|3109|
|test:v3-api|0|790|
|test:v4|0|3954|
|test:admin|0|586|
|check:content|0|2964|
|build|0|2028|
|scripts/test-v5.mjs|0|213|
|scripts/test-v5-api.mjs|0|2616|

V5domain có220 assertions: refs/options/checksum40, deterministic builder, locked revisions, tránh lặp2mock, grammar filter và segmentation. API tests kiểm15 nhóm: auth/Host/Origin/rate/failclosed, stage idempotency, V4 không hạ revisionV5, revision conflict, BETA invalidation, reviewer vocabulary, publication block, issues idempotency, assignment không approve,40 audio auth, provider fake HTTP và guest merge.

ChromeV5=PASS; EdgeV5=PASS; mỗi browser decode40 audio. E2E đi qua vocab→grammar→practice→mini→full→result→mistakes→weakness/history; kiểm answers, autosave/reload, section timeout, issue/workflow/gate,320/375/390/430và production keys giữ nguyên.

## Fixture và lỗi đã xử lý

V4 browser fixture đổi navigation vì admin tách route; các assertion về engine/storage/decode/gate vẫn giữ. V1–V3 chỉ đổi selector nút ngữ pháp đã đổi tên. Domain/API V4 không sửa. Bản review fixture cũ được lưu trong evidence.

Các lỗi tìm được: dịch vụ baseline chưa khởi động; TSV sai column trước import; Piper ghi đè assetV5; rate limit chặn cả mã đúng; private audio retry không refetch. Đều sửa nguyên nhân và chạy lại. Host header test dùng node:http vì fetch chuẩn hóa header; không nới whitelist server.

## Chưa kiểm tra

Firefox desktop, Safari macOS, Chrome Android và Safari iOS thật chưa có môi trường. Không ghi PASS. Manual plan: guest data/import; tìm từ/focus/keyboard; bottom nav/touch; gesture audio/background resume; 3G/offline cold/reconnect; timer/reload/two tabs/double submit; source/diff/notes; private audio401và production isolation.

Azure chỉ test fake HTTP, không phải real synthesis. Chưa có human phonetics/forced alignment, production RBAC/cloud sync, disaster recovery hoặc mobile device QA.

> Internally Validated là kiểm tra kỹ thuật và AI tự rà; không thay thế chuyên gia. Nội dung tự tạo vẫn NEEDS_REVIEW.

## Bằng chứng bàn giao cuối

- [final-regression.json](../../data/reports/v5/final-regression.json): PASS · 2026-10-16T03:28:43.409Z
- [api-tests.json](../../data/reports/v5/api-tests.json): PASS · 2026-10-16T03:28:43.372Z
- [progress-tests.json](../../data/reports/v5/progress-tests.json): PASS · 2026-10-16T03:31:24.308Z
- [review-package-validation.json](../../data/reports/v5/review-package-validation.json): PASS · 2026-10-16T03:31:21.683Z
- [review-package-browser.json](../../data/reports/v5/review-package-browser.json): PASS · 2026-10-16T03:23:35.296Z
- [e2e-v1-v3-chrome.json](../../data/reports/v5/e2e-v1-v3-chrome.json): PASS · 2026-10-16T03:29:46.438Z
- [e2e-v4-chrome.json](../../data/reports/v5/e2e-v4-chrome.json): PASS · 2026-10-16T03:31:48.405Z
- [e2e-v5-chrome.json](../../data/reports/v5/e2e-v5-chrome.json): PASS · 2026-10-16T03:34:18.667Z
- [e2e-v5-edge.json](../../data/reports/v5/e2e-v5-edge.json): PASS · 2026-10-16T03:37:17.079Z
- [e2e-audio-performance-chrome.json](../../data/reports/v5/e2e-audio-performance-chrome.json): PASS · 2026-10-16T03:31:37.023Z

Các lượt Edge từng timeout ở Page.captureScreenshot khi dùng render surface. Giao diện vẫn render được và ảnh ở lệnh sau có thể chụp; đã đưa tab lên foreground và dùng viewport capture của Edge, giữ nguyên assertion chức năng/console. Không coi timeout công cụ là kết quả PASS. Lượt cuối được ghi riêng trong e2e-v5-edge.json.
