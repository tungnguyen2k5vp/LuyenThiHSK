# Content import report

V14 thêm0 câu,0 audio,0 ảnh; không migration/seed/stage trên DB thật. Năm repo mới chỉ được nghiên cứu, chưa nguồn nào đủ evidence để tự động production import. Xem license matrix.

Đã triển khai `shared/v14-import-plan.mjs`: gọi lại `planImportRows` và validator hiện có, kiểm external/stable ID, source version, schema, content hash, review status, arrays/reference metadata, revision-bound license evidence, CAS/conflicts và published-ID protection. Dry-run không ghi DB (`writeAllowed:false`, `changed:0`).

External lookup là bắt buộc để không cho đổi stable ID rồi import trùng một external row đã có. Trong cùng batch cũng chống duplicate external ID. Khi đủ quyền, apply phải đi qua importer/revision workflow hiện hữu; module này không tạo đường production publish mới.

`test-v14-import.mjs` dùng grant fixture `example.invalid`, không phải quyền thật. Test không tạo human review, không xác minh một nguồn bên ngoài chỉ vì fixture PASS. Evidence: `data/reports/v14/import-tests.json`.
