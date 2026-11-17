# V13 · Integration log

| Batch | Trạng thái | Bằng chứng |
| --- | --- | --- |
| Contract 13.0 | CONTRACT_READY | FROZEN; 2.867 assertions; checksum của đúng file, lịch sử và changelog cho optional additions |
| Gemini receipt | GEMINI_BATCH_READY | Handoff sau đó đổi thành GEMINI_BATCH_ALL_READY. Codex lưu manifest SHA256 của 106 file và immutable backup; không còn sửa khi authoring |
| Tokens + Today | BATCH_INTEGRATED | Full build/typecheck PASS; Chrome callbacks/skip/no fabricated progress/default fallback/CSS scope PASS; desktop/tablet/mobile inspected; warm paint p95 42,4ms trong budget 63,1ms |
| HSK2 Hub | BATCH_INTEGRATED | 200 từ riêng cấp / 71 taxonomy / audio unavailable đúng; callback và A/B trong budget |
| Vocabulary/Grammar catalogs | BATCH_INTEGRATED (catalog) | Search, học/favorite/TTS, canonical ID, SM-2; đọc không tạo mastery; modal/reader/review queue giữ UI cũ |
| Practice | BATCH_INTEGRATED | 9 phần, 76 câu khả dụng; thiếu audio bị khóa; builder cũ; Chrome/Edge + matrix PASS; A/B trong budget |
| Text choice | BATCH_INTEGRATED (không media/matching) | Whitelist DTO/native keyboard; prompt/feedback/media/controls giữ owner; reload/submit PASS; p95 hai navigation 99,3ms |
| Writing | BATCH_INTEGRATED | Raw composition/Unicode/native Undo/autosave/reload Chrome/Edge PASS; p95 hai navigation 99,7ms; physical IME chưa xác minh |
| Result | BATCH_INTEGRATED (summary/skills) | Cùng summarizeAttempt; manual ungraded, blank denominator; giữ self-rating/lời giải/luyện lại; p95 hai filter 99ms |
| Mistakes | BATCH_INTEGRATED | Availability câu gốc tách independent pool; ôn đúng ID không ghi mastery; Chrome/Edge functional/mobile visual PASS |

Không sửa file Gemini đang authoring. Khi nhận batch sẽ ghi manifest/hash, phạm vi, callback parity, build/browser/screenshot/performance và trạng thái cuối.

## Presentation giữ nguyên có chủ đích

- Audio player, authenticated image loader, matching/ảnh/nghe, section/timer/palette/submit dialog: giữ engine cũ và media recovery/plays/timing/navigation.
- Vocabulary detail/flashcard queue, grammar lesson: giữ modal/focus/SRS hiện có; không mount owner thứ hai.
- ProgressWorkspaceView chưa mount: aggregate model riêng chưa có contract nguồn đầy đủ. Top-level Gemini PracticeWorkspaceView có local question-mode riêng; chỉ mount pure PracticeHubView. Không suy streak/mastery hoặc tạo exam state thứ hai.
- Flag `?ui=v13` mặc định off. Tắt flag không đổi DB, storage key hay tiến độ.

## Kiểm tra và sửa quan sát được

- 47 token thiếu được bổ sung aliases có namespace; Grammar search sửa flex-basis 260px gây khoảng trắng.
- A/B catalog lần đầu đợi legacy container rỗng; artifact được giữ, marker sửa để đợi item thật. Không nới budget.
- Writing lặp đề bài giữa host/editor: host giữ prompt/context, editor không render lần hai; hint pinyin theo policy owner.
- Private Mock-ready yêu cầu cả status và capability; candidate plan không mang badge đủ điều kiện thi.

## Chốt vòng kỹ thuật

V13_QA_PASSED: regression 35/35, matrix 14/14, V13 30 nhóm/browser, A/B 7/7 trong budget, security 17/17, source 729 file stable. Matrix có carried-forward results với log gốc và 293 product/config/schema/editorial files không đổi, không phải một clean run duy nhất. Xem QA report về hai lỗi media headless, sửa microphone mount và cách ly test admin.

5 fixture QA từ legacy tests ở trạng thái ARCHIVED, 18 technical review rows giữ audit; không tính là human-reviewed content. Test admin mới xác nhận fixture IDs không có trong kho chính. Nội dung vẫn CONTENT PENDING FINAL HUMAN REVIEW, productionReady=false.
