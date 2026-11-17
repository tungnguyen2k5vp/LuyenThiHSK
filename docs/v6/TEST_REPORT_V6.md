# TEST REPORT V6

Cập nhật 2026-10-16T06:15:21.671Z · v6-hsk1-r1 · release riêng, không phải production.

## Regression

| Script | Trạng thái | ms |
| --- | --- | --- |
| typecheck | PASS | 576 |
| lint | PASS | 525 |
| test | PASS | 3417 |
| test:v2 | PASS | 3556 |
| test:v3 | PASS | 3764 |
| test:v3-api | PASS | 783 |
| test:v4 | PASS | 4545 |
| test:v5 | PASS | 410 |
| test:v5-api | PASS | 2723 |
| test:v6 | PASS | 4255 |
| test:v6-api | PASS | 6294 |
| test:account | PASS | 2029 |
| test:admin | PASS | 580 |
| check:content | PASS | 3371 |
| build | PASS | 2211 |

Renderer stress: PASS (8 dòng, 8 lựa chọn dài). V6 unit 1733 assertions; V6 API 167; account foundation 48. Unit kiểm schema/answers/partial matching/duplicate keys/immutable bank/recovery/scoring/latest-unique mastery; API kiểm private assets, stage, CAS, human gate, upload/replace, no downgrade; account kiểm cookie/encryption/Origin/owner/CAS/tombstone/expiry, REST adapter HTTP double.

| Browser suite | Browser | Status |
| --- | --- | --- |
| v6 | Chrome | PASS |
| v6 | Edge | PASS |
| v5 | Chrome | PASS |
| v4 | Chrome | PASS |
| v1-v3 | Chrome | PASS |

Kết quả browser cuối cùng dùng e2e JSON theo suite; nếu có lượt thất bại trước sửa, log giữ nguyên trong matrix-*.log và ghi retest riêng. Không xóa dấu lỗi bằng sửa status. V4/V5 fixture chỉ cập nhật tên tiếng Việt và route/revision adapter sau V6; assertions engine/storage/privacy/media không bị gỡ.

Bài stress bổ sung xem data/reports/v6/renderer-stress.json: fixture ghép8dòng/lựa chọn dài, native arrow keyboard,320–1280px, refresh và chấm điểm; chỉ gọi PASS khi JSON có status PASS. Fixture không thêm vào release.

NOT_TESTED: Firefox, Safari/WebKit, Android/iOS thật, screen reader thật, live Supabase/email/SQL RLS. Mobile trong test là viewport emulation. Docker daemon unavailable. Backups restore tạm PASS. Không chạy destructive restore trên dữ liệu người dùng.

Bằng chứng máy đọc: data/reports/v6/*.json và regression-*.log. TTS thiết bị trong harness là speech double; 80WAV được download/decode thật, không suy ra phát âm đã được người thật duyệt.

Kiểm tra nội bộ và AI tự rà không thay thế người duyệt chuyên môn. Mọi nội dung tự tạo vẫn NEEDS_REVIEW; Human Reviewed = 0, Published = 0.
