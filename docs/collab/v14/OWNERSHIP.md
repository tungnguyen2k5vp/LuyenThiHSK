# V14 · File ownership

CONTRACT_STATUS: FROZEN
UI_CONTRACT_VERSION: 14.0

Workspace: `D:/ReactJS/LuyenThiHSK`. `git status` không xác minh được repository; dùng immutable backup/manifest. Không tạo remote/push/reset/format cả dự án.

| Vùng | Người ghi |
| --- | --- |
| `src/ui-v14/**` | Gemini; presentation, scoped CSS, assets có provenance |
| `docs/collab/v14/gemini/**` | Gemini; thiết kế, yêu cầu contract, handoff |
| `src/contracts/ui-v14.ts`, `src/adapters/ui-v14/**` | Codex |
| Backend, domain, services, database, router, mixed containers, tests, config | Codex |

Codex chưa tạo/sửa file trong hai vùng Gemini V14. Gemini không gọi API/storage, tạo timer/player/autosave/attempt owner, hoặc suy đoán quyền chuyển câu. Gemini chỉ import contract types; không import raw domain/data.

Mỗi batch bàn giao: `GEMINI_BATCH_READY_V14`, version, danh sách đường dẫn + SHA256, exports, props/callback mapping, asset license, dependencies, viewports/states đã xem, known gaps. Gemini ngừng ghi đúng batch sau handoff. Codex lưu immutable receipt trước khi tích hợp. Không nhận toàn bộ `src` ghi đè.

Chỉ server chính quản lý SQLite thật. Mọi thử nghiệm API dùng `scripts/v14-isolated-api.mjs` hoặc SQLite riêng; regression dùng source/data copy trong `.tmp`. Không đưa token/DB vào folder bàn giao.
