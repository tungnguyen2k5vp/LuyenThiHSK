# V15 · Kiểm thử

Ngày 2026-10-20 (Asia/Bangkok). **V15_LOCAL_QA_PASSED / CONTENT_PENDING_FINAL_HUMAN_REVIEW**. ProductionReady=false. Dữ liệu và bằng chứng định lượng: [release-gates.json](data/reports/v15/release-gates.json).

- Snapshot/restore: hai DB integrity=ok, từng table hash khớp. 12 kiểm tra toàn bộ hàng content/account và media/content assets: PASS. sw.js là thay đổi có chủ đích; không migration.
- Full source regression 39/39 PASS, không exclusions, workspace riêng: D:\ReactJS\LuyenThiHSK\.tmp\v15-regression-1792430752196. Typecheck/lint/build và suites V1–V14, test V15.
- Logic V15 25 checks PASS: SQL tương đương, publication history, timeout, cache scope/hash/retry, builder metadata/actual revisions, auth/filter và nháp HSK2. Bộ test content bổ sung được chạy riêng sau snapshot regression; product/config source comparison: MATCH.
- Security 16 checks PASS: private auth, Host/Origin, read-only catalog, no keys in DTO, dev deny cho raw data/review package/token. Không phải cloud pentest.
- Before UI: PASS, frozen dist từ baseline; backend read-only hiện tại và baseline DB clone. Không coi đây là baseline backend cũ để đo cold-load.
- After UI: chrome: 34 nhóm PASS; edge: 34 nhóm PASS. Gồm audio playback thật, ảnh decode, matching IDs/revision, timed policy, section acknowledgement/deadline credit, double submit, Unicode/composition/native Undo/offline loaded save, ungraded Result, fallback; thêm bài5/10 câu, hung GET recovery,5 reload và viewport320–1440.
- Performance: xem bảng trong V15_UI_UX_REPORT; samples và timestamp ở JSON từng browser.

Các log thất bại vẫn được giữ: catalog skill/mini ban đầu thiếu config.sections; sửa metadata fallback theo cấu trúc owner. QA từng sai selector class Matching khi chuyển version và sai dấu nháy selector submit; đã sửa harness rồi chạy lại. Không giảm readiness content hoặc tăng budget để vượt kiểm tra.

V14 từng chờ Catalog sau lượt dài. V15 kiểm cùng-origin/timeout/retry và reload giữ tiến độ; chưa kết luận nguyên nhân duy nhất của mọi lỗi cũ. Bằng chứng local không xác minh private cold offline boot, IME vật lý, screen reader thực, Firefox/WebKit, production Auth/RLS hoặc Secure Exam server authority.
