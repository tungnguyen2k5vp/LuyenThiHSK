# V13 · Quyền sở hữu file

CONTRACT_STATUS: CONTRACT_PENDING

Gemini và Codex làm trong cùng `D:/ReactJS/LuyenThiHSK`. Không có Git repository được xác minh. Không tạo remote, push, reset, clean hoặc auto-format diện rộng.

| Vùng | Người ghi | Quy tắc |
| --- | --- | --- |
| `src/ui-v13/**` | Gemini | Presentation, scoped styles, tokens, UI assets có quyền; không backend, engine, fetch, storage hoặc timer/autosave riêng |
| `docs/collab/v13/gemini/**` | Gemini | Thiết kế, CONTRACT_REQUESTS.md, manifest/checksum, handoff từng batch |
| `src/contracts/ui-v13.ts` | Codex | Hợp đồng chỉ đọc cho Gemini; version 13.0 sau freeze |
| `src/adapters/ui-v13/**` | Codex | Chuyển domain/application state sang ViewModel; callbacks gọi logic hiện có |
| Backend/shared/services/data/scripts/tests | Codex | Backup, CAS/revisions, gates, validation và regression |
| Entry/router/global CSS/package/config/mixed containers | Codex | Không redesign lúc Gemini đang thiết kế; chỉ thay logic cần thiết hoặc tích hợp batch đã bàn giao |

Không ghi đè file của bên kia. Không copy đè `src`. Không xóa file của Gemini kể cả khi chưa typecheck được. Chỉ Codex quản lý server chính ghi `.runtime/hsk-content.sqlite`; UI sandbox dùng fixtures không chứa token/đáp án bí mật và không gọi API/database. Không chạy migration/seed song song.

Baseline nguồn không đọc/copy hai vùng Gemini khi đang authoring. Typecheck/build baseline chạy từ snapshot nguồn riêng; kiểm thử logic có thể dùng cấu hình tách vùng UI đang viết. Báo cáo phải ghi rõ phạm vi này. Batch tích hợp phải typecheck cả các file UI đã nhận; không dùng exclude để che lỗi UI đã tích hợp.

Gemini bàn giao bằng `docs/collab/v13/gemini/HANDOFF_BATCH_N.md`: trạng thái GEMINI_BATCH_READY, contract version, danh sách chính xác file + SHA256, component exports, hướng dẫn props/callback, assets/license, dependencies (không tự cài), các states/viewport đã kiểm, known gaps. Sau handoff Gemini ngừng ghi đúng batch đó cho đến khi Codex báo kết quả.
