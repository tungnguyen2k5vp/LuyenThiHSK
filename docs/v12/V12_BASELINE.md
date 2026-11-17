# V12 · Baseline và sao lưu

| Hạng mục | V11 | V12 | Thay đổi |
| --- | --- | --- | --- |
| HSK 1 câu / bài | 435 / 68 | 435 / 68 | Giữ nguyên |
| HSK 2 câu | 176 | 246 | +70 câu ngữ pháp gắn 14 bài, không thêm phần thi |
| Câu theo 9 phần | 116 | 116 | Giữ nguyên |
| Bài ngữ pháp | 16 | 30 | +14 |
| Bài có ≥5 câu độc lập | 16 | 30 | +14 |
| Mục từ được bổ sung | 44 | 124 | +80; giữ ID gốc |
| Audio HSK 2 khả dụng | 0 | 0 | Chưa có output giọng đủ điều kiện |
| Editorial hiện hành | 1175 | 1339 | +164; revision sửa không tăng số ID |
| Human Reviewed / Published | 0 / 0 | 0 / 0 | Không tự vượt gate |

Database trước sửa có 1175 bản ghi hiện hành và 3459 revision lịch sử. Draft 5, Needs Review 1170, Automated Valid 1175; hai chiều workflow/validation chồng lấn. Không có Git repository. Dùng snapshot và hash nguồn, không khởi tạo remote.

Backup nhất quán: `.runtime/backups/before-v12-2026-10-18T10-29-20-255Z`. VACUUM INTO cho content/account; bản sao source, public, editorial, staging và media. Khôi phục riêng content và account SQLite: PASS. Schema được đóng băng để so sánh; không migration hay reset learner store.

Trước sửa ứng dụng: **29/29 regression, production build và 10/10 browser groups PASS**. Lượt sandbox CDP timeout và lượt đồng bộ đầu timeout được giữ riêng; lượt đầy đủ sau đó đạt, không giấu failure.

[baseline](../../data/reports/v12/baseline.json) · [Hồi quy baseline](../../data/reports/v12/baseline/regression.json) · [Browser baseline](../../data/reports/v12/baseline/browser/matrix.json).

[Manifest so sánh SHA-256 nguồn trước/sau](../../data/reports/v12/source-change-manifest.json). Snapshot thay vai trò bằng chứng diff khi workspace chưa có Git; không phải commit hoặc CI.

[So sánh dữ liệu account local](../../data/reports/v12/account-data-safety.json): schema và hai bảng account_audit/account_sessions giữ nguyên; cả hai đều rỗng trước/sau. Không suy kiểm này thành bằng chứng đã chạy Auth/RLS cloud.

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.
