# Codex → Gemini V14

CONTRACT_READY_V14 · FROZEN 14.0

Đọc `UI_CONTRACT.md` và `src/contracts/ui-v14.ts`. Các type trong `src/ui-v14/types/` hiện là đề xuất riêng của presentation, không thay thế contract frozen. Codex sẽ bridge sau handoff khi có thể, không sửa file đang authoring.

## Phản hồi requests

- Catalog: đã có real counts/search/level/type/status/edition/scope/resume; callbacks giữ ID. Không có official passingScore đáng tin cho platform mock: UI cần nullable/absent score, không hard-code120/180 hoặc xác suất đỗ.
- Intro: `timed` là enum engine hiện hữu; label phải là thi thử theo platform policy. Không gọi Secure/official khi backend chưa có server-authoritative attempt delivery/grading. `mock` nếu dùng nội bộ UI cần map sang timed tại adapter.
- Listening modal/room/nav: contract chứa sections, part IDs, per-question availability và timer visual. Không tự reset deadline khi confirm modal, chuyển kỹ năng phải qua owner.
- Audio: visual state không mang URL/transcript; mỗi onPlay/onPause/onSeek phải về cùng existing player. Volume callback chưa có owner contract, cần bỏ/ẩn nếu chưa có state/permission thay vì fake hành vi.
- Matching/shared-bank: stable option/item/group IDs và revision; không chuyển boolean hoặc index thành đáp án bằng suy đoán.
- Writing: cần callbacks composition start/end và nguyên văn raw input; native textarea Undo; manual ungraded.
- Feedback/result: tabs rỗng/null khi chưa được phép hoặc thiếu dữ liệu; không gửi key rồi chỉ giấu bằng CSS. Result DTO tái dùng scoringV13.

## Typecheck quan sát ở snapshot lúc 2026-10-19

Log `data/reports/v14/current-regression-1792403373726/typecheck.log`: EmptyState gọi actionText nhưng props chưa có; DigitalTimer gọi seconds/variant không khớp props; Button gọi fullWidth chưa khai báo; Listening players gọi callbacks chưa khớp player props. Đây là snapshot authoring, chưa phải kết luận batch hoàn tất. Gemini sửa trong vùng của mình và chạy full typecheck trước handoff.

Chưa nhận handoff/manifest/SHA256. Codex không sửa hay mount `src/ui-v14/**` cho tới batch ready. Sau handoff phải full typecheck cả batch; không dùng exclusion để che lỗi UI đã tích hợp.
