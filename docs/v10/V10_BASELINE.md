# V10 · Baseline và bảo toàn dữ liệu

lúc 09:25 Chủ Nhật, 18 tháng 10, 2026 (UTC+7) · Local/private

Baseline 986 bản ghi hiện hành, 3092 revisions. Backup nhất quán: `.runtime/backups/before-v10-2026-10-17T06-41-06-052Z`; SQLite/content/account/media/source đã sao lưu. Restore cô lập **PASS**. Không có Git repository.

| Loại | V9 | V10 |
| --- | --- | --- |
| vocabulary | 300 | 320 |
| grammar | 68 | 80 |
| audio | 80 | 80 |
| templates | 1 | 1 |
| images | 30 | 30 |
| optionBanks | 18 | 25 |
| questions | 489 | 587 |

Baseline 25/25 regression và 10/10 browser jobs PASS, evidence trong [baseline](../../data/reports/v10/baseline/regression.json). Real Guest/Preview/SRS nằm trong browser, không trích xuất/reset profile người dùng. Server account DB có backup.

[Data safety](../../data/reports/v10/data-safety.json): PASS; không mất/đổi nội dung lịch sử hoặc note. 40 decoder timestamp và 1 thời điểm lưu note QA có thay đổi do regression cũ; ghi riêng, không tuyên bố mọi byte SQLite bất biến. Public/data hashes và schema giữ nguyên.

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không phải chứng nhận ngôn ngữ, cấp HSK, quyền hay phát âm của người thật.
