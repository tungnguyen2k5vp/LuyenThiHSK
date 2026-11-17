# V14 baseline

Source of evidence: `data/reports/v14/baseline.json`, `baseline-regression.json`, `content-audit.json`. Snapshot 2026-10-19T09:27:19.986Z, trước sửa product source V14. Script bootstrap baseline tự nằm trong snapshot.

- Backup: `.runtime/backups/before-v14-2026-10-19T09-27-19-986Z`.
- 5.648 file nguồn/tài liệu,148 runtime media; SHA256 kiểm sau copy. Không copy token/env.
- Content SQLite:3.768 revisions,8 application tables. Account SQLite:2 tables. VACUUM snapshot, copy restore, integrity và logical hashes từng bảng PASS.
- `git status` thất bại: không xác minh được Git repository; không init/push/remote.
- Baseline regression35/35 PASS trong source/data copy. Lần đầu clone thiếu v4 audio và dừng ở test:v4; giữ log `baseline-regression-1792402126107`. Bổ sung media backup, chạy lại toàn bộ; log thành công `baseline-regression-1792402378494`.

Declared release scope editorial có1.359 records,5 Draft/1.354 Needs Review, automatedValid1.359, workflowInternallyValidated0/human0/published0. Regex rộng trên mọi `vN-hsk` trả1.366 nên không dùng số broad inventory để thay thế scope chuẩn. File baseline giữ nguyên kết quả kiểm kê broad lúc chụp; content-audit ghi releases và lý do chênh.

Mọi `qa-*` trong inventory lịch sử không đồng nghĩa5 fixture tạo ở V13. Năm ID V13 được nhận diện theo exact manifest/hash trong `data/reports/v13/known-qa-artifacts.json`; các QA/lịch sử khác và audit rows vẫn được giữ nguyên. V14 không xóa/reset bất kỳ record nào.

## V13 source audit

Đã đọc report/current-state/contract/ownership/integration-log/QA/handoff/inventory và source của các containers, registry, rule/scoring/storage và adapters.

| V13 feature | Đã mount | Chưa mount / legacy |
| --- | --- | --- |
| Today/HSK2 hub | Presentations + callbacks existing owner | Không suy streak/mastery thiếu dữ liệu |
| Vocabulary/Grammar | Catalog và actions qua adapters | Detail/flashcard queue/lesson reader giữ owner+UI cũ |
| Practice | Pure PracticeHubView | Top-level Gemini practice owner riêng không mount |
| Choice | Text non-media choice | Listening/image/matching/shared-bank cũ |
| Writing | Presentation, raw composition/native Undo | Media/prompt owner cũ |
| Result/Mistakes | Summary/skill và mistake presentation | Detailed solutions/self-review owners cũ |
| Room | Engine cũ ổn định | Audio/section/timer/nav/submit legacy; thiếu V14 presentation callbacks/DTO trước vòng này |

V14 thêm các DTO/guards cho phần exam; durable section acknowledgement và layout vẫn phải kết nối sau handoff. Auth/cloud production chưa triển khai.
