# V14 · Báo cáo triển khai

Ngày2026-10-19. **V14_LOCAL_QA_PASSED · CONTENT_PENDING_FINAL_HUMAN_REVIEW**. Contract14.0 frozen; đã nhận handoff và tích hợp5 nhóm giao diện. ProductionReady=false; HSK2 Full Mock vẫn NOT_READY. Gate định lượng tại `data/reports/v14/release-gates.json`.

## Đã triển khai

- Backup5.648 file nguồn/tài liệu,148 media; SQLite content/account restore và từng table hash PASS. Dữ liệu/main audit/reviewer notes/media giữ nguyên.
- Contract14.0 FROZEN,19 nhóm VM cho Catalog/Intro/Room/Navigator/media/question types/feedback/result; kế thừa V13, không thay engine/scoring/storage.
- Catalog/Intro read-only API sau auth local, số đề từ live services và readiness. Hai HSK1 platform practice candidates40 câu gọi builder hiện hữu và khớp exact revisions. HSK2 candidate60 câu vẫn bị khóa, không tạo launch khi chưa đủ gate.
- Pure adapters whitelist active-question payload, feedback theo mode; partial matching không tính answered; timer media-pause dùng deadline owner; Unicode/composition không normalize; manual writing ungraded. Callback đọc state mới nhất, reauthorize question/session IDs; chống start chồng lặp.
- Dry-run import tái dùng pipeline cũ: source/license/version/hash/CAS, external dedupe, published protection. Không thêm importer publish hoặc ghi DB thật.
- Audit CTI và5 repo V14, phân biệt code/data/upstream license; ghi conflict cấu trúc cũ/HSK3.0, không tự áp dụng số liệu từ Migii hoặc community.

## Số liệu kiểm từ DB/services

| Phạm vi | Kết quả |
| --- | --- |
| Editorial | 1.359 records:5 Draft +1.354 Needs Review |
| Automated valid / workflow internally validated | 1.359 /0 |
| Human reviewed / published | 0 /0 |
| Questions / source | 681 / đều AI_GENERATED |
| HSK1 | 435 câu,68 lessons;199 flags trên base396 câu vẫn chờ review |
| HSK2 | 246 câu:116 part +130 grammar;30/71 lessons;144/200 từ enriched |
| HSK2 listening / playable practice | 40 transcripts,0 exam-ready audio;206 playable questions |
| Mock candidates / private playable / public releasable | 3 /2 (HSK1 private) /0 |
| Imports mới | 0 câu /0 audio /0 ảnh |
| Source/mapping/format per-question verified counts | Chưa đủ attestation: null, không tự lấy681 làm verified |
| Rights-cleared/exam-suitable mới V14 | 0 có evidence mới; không đồng nghĩa original drafts bị cấm luyện riêng tư |

Chi tiết quantities, media assets, flags và evidence dimensions tại [Question Quality](docs/v14/QUESTION_BANK_QUALITY.md), [Audio](docs/v14/AUDIO_MEDIA_READINESS.md), `data/reports/v14/content-audit.json`.

## QA đã chạy

Baseline35/35; current full handed-off source38/38 jobs PASS trong copy riêng, không loại UI đã bàn giao; contract5.413/API41/import22 assertions; security14 checks. V14 Chrome/Edge26 nhóm mỗi browser và6 so sánh A/B trong budget. Main DB/account/audit/media/public assets unchanged sau công việc V14.

Khi Gemini đang authoring, một snapshot có10 lỗi props; log được giữ và không sửa chồng file. Sau handoff52 file, Codex lưu immutable receipt/SHA256, sửa các điểm nullable score, caption, focus, dynamic A–F choices và nối owner. Full source typecheck/lint/build/regression PASS; source khớp copy đã kiểm tra. Các lỗi harness và timeout/lazy-load Edge quan sát được vẫn giữ log; lượt cuối dùng Vite preview thật, không tăng timeout/budget. Xem [Test report](docs/v14/TEST_REPORT_V14.md) và [Performance](docs/v14/PERFORMANCE.md).

## Phần còn lại

Đã nối Catalog/Intro; Room/Navigator/SectionInstructions; true/false, image choice, shared matching, dialogue/reading choices; feedback tabs; Result summary/skills. Hướng dẫn phần thi lưu acknowledgement, không khởi động phần mới trước xác nhận; reload chỉ cộng đúng media pause credit. Raw Unicode/IME/Undo, lưu khi mất mạng trong phiên đã tải và Writing ungraded đã kiểm tra.

Giữ authenticated audio/image loader/recovery, compound matching, textarea Writing, submit/lease/CAS/journal và detailed results/review/SRS theo owner cũ. Không mount toàn bộ component chỉ để đủ số lượng. Offline hard reload của private Preview vẫn cần API để tải quyền/content; không tuyên bố đã hỗ trợ offline toàn bộ. Cold-load/mobile mạng chậm và thiết bị/assistive technology thật chưa xác minh đầy đủ. Initial JS tăng lên khoảng396,78kB/gzip120,21kB; A/B warm không chứng minh cold-load nhanh hơn.

Human/language/level/pronunciation/rights review vẫn BLOCKED_FOR_HUMAN_REVIEW; HSK2 Full Mock NOT_READY. Không thêm hàng trăm draft, không gắn Official, không dùng browser TTS làm exam audio. Timed local practice chưa có Secure Exam server-authoritative. Cloud NOT_DEPLOYED, live Auth/RLS và thiết bị thật chưa xác minh.

Rủi ro còn theo dõi: một số lượt QA dài nối tiếp Chrome→Edge bị chờ tải lại Catalog dù token còn nguyên. Chrome và Edge chạy A/B riêng trên build cuối đều đạt; chưa xác định hay xử lý tận gốc sự cố gián đoạn đó. Số đo A/B và lượt E2E chốt có timestamp riêng, không phải một lần chạy liên tục duy nhất. Chi tiết tại test report và failed logs.

API chính đã restart trên127.0.0.1:8787, PID33604, token giữ nguyên; không có hai server cùng writable SQLite. Mở [V14 Preview](http://127.0.0.1:4173/?view=preview&ui=v14), chọn HSK1 để dùng hai bài tổng hợp; HSK2 vẫn khóa đúng blocker. [Tài liệu](docs/v14/README.md), [ảnh](docs/v14/SCREENSHOT_GALLERY.html), collaboration tại `docs/collab/v14/`.
