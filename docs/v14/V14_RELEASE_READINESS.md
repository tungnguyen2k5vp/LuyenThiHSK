# V14 release readiness

Trạng thái: **V14_LOCAL_QA_PASSED / CONTENT_PENDING_FINAL_HUMAN_REVIEW**. Phạm vi kỹ thuật local đã tích hợp đạt các gate đã kiểm tra; productionReady=false. Những gate cần quyền/reviewer/cloud vẫn được giữ nghiêm ngặt.

| Gate | Trạng thái |
| --- | --- |
| Backup/restore/data safety | PASS |
| Contract14.0/freeze/hash | PASS · CONTRACT_READY_V14 |
| Catalog/Intro metadata + Room adapters/command guards | Implemented + tests PASS |
| Baseline/current independent regression | PASS, phạm vi tại test report |
| Gemini final handoff/receipt | RECEIVED52 files; per-file manifest do Codex tạo |
| UI V14 groups mounted | 5 nhóm; retained owners được ghi rõ |
| V14 E2E/visual | Chrome26 + Edge26 nhóm; desktop/mobile screenshots |
| V14 A/B | 6/6 trong budget; cùng data/profile/API; không phải cold-load Web Vitals |
| Human/language/level/media-rights review | BLOCKED_FOR_HUMAN_REVIEW |
| HSK2 full mock | NOT_READY |
| Production/cloud/AuthRLS | NOT_DEPLOYED / NOT_VERIFIED |

Có thể tiếp tục mount từng batch sau receipt, không cần chờ reviewer để phát triển kỹ thuật. Production publication gate giữ nguyên. Không bật V14 mặc định; V13/legacy fallback còn nguyên.

API V14 đã chạy trên127.0.0.1:8787 với token/SQLite cũ. UI mới tại `http://127.0.0.1:4173/?view=preview&ui=v14`. Không bật mặc định; V13/legacy fallback giữ tiến độ. Các API/content tests vẫn dùng clone; main data safety PASS.
