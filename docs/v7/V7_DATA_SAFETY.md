# V7 · Bảo toàn dữ liệu

2026-10-16T10:56:11.488Z · V7 engineering / v6-hsk1-r1 editorial content. Local/private only.

Backup trước V7: .runtime/backups/before-v7-2026-10-16T09-23-05-470Z. VACUUM INTO tạo snapshot nhất quán với WAL; integrity ok và restore sang database tạm PASS. Không restore/reset live.

| Kiểm tra | Kết quả |
| --- | --- |
| Revision trước | 2929 |
| Revision sau | 2951 |
| Revision cũ bị mất | 0 |
| Fingerprint nội dung lịch sử thay đổi | 0 |
| Metadata kỹ thuật/review thay đổi tại revision cũ | 40 |
| Schema thay đổi | false |
| public/data giữ nguyên | true |
| Source SHA256 | eff5cdfad4a6745537afdfd4366868e8e3dd3c6dbc63862ea12ca83263f9016a |

Hai revision mới cho bài grammar; browser regression có thể tạo/archived QA fixtures riêng trong DB content hiện có, không thuộc 883 content release. Decode/audio-validation cập nhật metadata kỹ thuật nhưng không đổi asset hash/content fingerprint. Mỗi khác biệt được liệt kê trong data-safety.json.

Giữ schemaVersion3, localStorage guest/Preview keys, exam answer strings, historical snapshot, SM2, mistake/study plan/streak/bookmarks. QA dùng user-data-dir tạm, không xóa hay nhập dữ liệu vào browser thật. Không động HocTiengTrungApp/mobile DB.
