# V14 · Integration batches

| Thứ tự | Batch Gemini | Owner / điều kiện |
| --- | --- | --- |
| 1 | Exam Catalog + Intro | catalog adapter + current readiness + existing launch owner |
| 2 | Room layout + Navigator + Section Instructions | Room snapshot, same lease/clock/session, ID callbacks |
| 3 | Listening true/false + images + matching/dialogue | existing authenticated media owner, replay/recovery, shared bank snapshot |
| 4 | Reading + Writing + feedback tabs | raw IME/Undo, late feedback only, no token fabrication |
| 5 | Result + review | existing summarizeAttempt/review queue |

Mỗi batch: handoff exact paths/hashes → immutable receipt → dependency/IO/CSS check → props adapters → feature flag mount → typecheck/lint/build → regression → Chrome/Edge desktop/mobile, screenshots, same-data performance. Không mount các batch chưa bàn giao.

SectionInstruction adapter chỉ trình bày acknowledged/started từ owner. Durable acknowledgement/resume integration cần triển khai cùng batch2; không ghi nhận đã hoàn tất. Section start không reset deadline khi reload.

Chưa có batch nào ở `src/ui-v14/`, không tự xây UI thay Gemini. Các adapter/Catalog API đã có thể kiểm tra độc lập. Sau handoff Codex kết nối vào container hiện có, không tạo engine/DB/storage key mới.
