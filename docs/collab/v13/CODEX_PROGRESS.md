# Codex · V13

Status: V13_QA_PASSED · CONTENT PENDING FINAL HUMAN REVIEW · 2026-10-19

- Đã đọc yêu cầu V13, V12 reports và source types/services; chưa có Git repository.
- Người dùng xác nhận Gemini làm trong cùng thư mục. Sau đó Gemini cập nhật `GEMINI_BATCH_ALL_READY` cho 6 batch. Codex đã chụp 106 file với SHA256 và backup riêng trước chỉnh sửa tích hợp; xem `ui-receipt.json`. Không sửa khi Gemini còn authoring.
- Backup 3.914 source files + 147 runtime files xác minh hash; content/account SQLite restore kiểm tra đủ 8/2 bảng và integrity `ok`.
- Baseline 32/32 kiểm tra PASS. Lần đầu build fail vì snapshot thiếu 4 tài liệu raw-import; log lỗi lưu riêng. Lần sau build dùng snapshot code cùng 4 tài liệu bổ sung có hash, không sửa backup gốc.
- Contract 13.0 FROZEN, adapters 13 khu vực, TypeScript logic PASS, 2.847 assertions PASS với 246 câu V12. Không đưa file Gemini đang authoring vào scope logic; chưa có UI tích hợp nên chưa có integrated UI QA.
- Backend V13 đã chạy tại 8787 với mã admin giữ nguyên; stage 20 bản nháp Vocabulary, không thêm câu hỏi. 7.541 isolated API checks, 386 content/rollback checks PASS. Missing example 76→56; tổng word drafts 124→144. Pinyin dictionary 14/20 match, 6 tone/neutral khác biệt vẫn chờ human review.
- A/B services: bỏ một lượt SELECT/parse trùng trong một request, 7→6 SQL calls, p95 411,1→361,9ms, output hash giữ nguyên. Không có persistent cache và không tắt validation/rights gates.
- Today đã nối owner plan/SRS/resume/navigation hiện có qua flag `?ui=v13`; default off. Chrome 12 browser groups PASS gồm Today/HSK2 hub, ảnh desktop/tablet/mobile. Today warm paint proxy 20×: p95 cũ 43,1ms / V13 42,4ms. Chưa coi đây là production Web Vitals.
- Đang nối các batch tiếp theo theo thứ tự; các phần chưa đạt parity vẫn dùng UI hiện có. Full final QA và báo cáo V13 chưa hoàn tất.

## Cập nhật vòng tích hợp hiện tại

- Contract có optional callbacks/aggregate Batch 3 và availability/callback review; 2.867 assertions PASS. Hai checksum cũ giữ trong history, manifest mới khớp file đã test.
- Vocabulary/Grammar catalog đã nối search, canonical ID, học/favorite/TTS/SM-2 và lesson read owner. Detail/reader/review queue giữ UI cũ để không sinh persistence mới.
- Nối Practice Hub 9 phần, text choices không media/matching, controlled Writing, Result summary/skills và Mistakes. Prompt/feedback/audio/images/timer/submit vẫn owner cũ; không expose active answer key.
- Chrome/Edge 29 nhóm V13 PASS: reload giữ session/đáp án, double-submit một attempt, raw composition + native Undo, manual ungraded, retry đúng câu; chưa phải thiết bị IME thật.
- Full current source TypeScript/lint/build và 35 jobs V1–V13 PASS. Final legacy browser matrix đang chạy.
- Main safety PASS: 3.743 revision cũ giữ nguyên, thêm 20 V13 revisions; schema/account/public/runtime assets không đổi. Tổng 1.359 records = 5 Draft + 1.354 Needs Review; automated valid 1.359, human/published 0.
- Security static/local HTTP 17/17 PASS, không phát hiện DB/token/env/model trong dist/public. Live cloud/RLS chưa được xác minh.
- Báo cáo tổng hiện có tại `FINAL_IMPLEMENTATION_REPORT_V13.md`; sẽ chốt sau final matrix và A/B mở rộng. Chưa gán V13_QA_PASSED.

## Đã chốt

V13_QA_PASSED trong phạm vi tích hợp: regression 35/35, matrix 14/14, V13 Chrome/Edge 30 nhóm mỗi browser, A/B 7/7 trong budget, 17 security checks và 729 source files stable. Source sản phẩm giữ nguyên qua resumed matrix; log và source provenance được lưu. 10/10 Edge V11 audio + 10/10 Edge V12 microphone sau sửa.

Test admin cũ đã được cách ly toàn bộ frontend/Node mutations sang SQLite riêng; kiểm tra mainFixtureCreated=false. 5 fixture từ các lượt cũ đều ARCHIVED, 18 technical review rows giữ audit, không tính là chuyên gia duyệt; danh sách exact IDs/hashes được ghi, không xóa lịch sử. 40 technical media timestamps và một work timestamp được khai báo riêng.

Content scope 1.359: Draft 5, Needs Review 1.354, automatedValid 1.359, humanReviewed/published 0. Không production deploy; physical IME, human language/audio/rights và live cloud RLS còn cần xác minh. Folder bàn giao và gallery đã có tại `TAI_LIEU_TONG_HOP_HSK/V13_BAN_GIAO/`.

Không coi kế hoạch, file được copy, screenshot hoặc automated content validation là human approval hay integration pass.
