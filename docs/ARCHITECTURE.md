# Architecture V3

Nguồn trạng thái: [CURRENT_STATE.md](CURRENT_STATE.md).

React19/TypeScript/Vite, engine V2 giữ nguyên timer/audio/resume/submit/scoring; bổ sung timing metadata. LocalStorage core schema3 và preparation schema1; IndexedDB ghi âm không đổi. SWv5 cache shell và catalog đã mở. Catalog phân trang/lazy theo cấp.

Local Node24/SQLite API quản trị revisions/imports/reviews/audit/media; loopback/token. shared/content-quality.mjs là gate dùng chung test/server; shared/lexical-normalization.mjs dùng importer và admin save. File nguồn immutable ở data/raw, staging không public; learner đọc static release và published overrides.

V3 Content → review → publish → seeded template builder → exam snapshot → engine → measured results/weakness → daily plan. Chỉ câu có tag/đủ mẫu sinh nhận xét học thuật. Admin JSON advanced, form mặc định, preview dùng engine thật.

Cloud/Auth/Sync chưa cấu hình. Không public local API lên Internet. [CONTENT_V3.md](CONTENT_V3.md) ghi chi tiết và blocker; snapshot trước V3 ở legacy/PRE-V3_ARCHITECTURE.md.
