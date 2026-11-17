# CURRENT STATE — nguồn trạng thái duy nhất

Ngày 15/10/2026. **V3 đợt infrastructure/P0 đã triển khai; toàn bộ brief V3 chưa hoàn tất.** Báo cáo V2 là baseline, các báo cáo V1 là **LEGACY / PRE-V2**. Khi tài liệu khác mâu thuẫn, dùng tài liệu này.

## Đã hoạt động ở baseline V2

React/TypeScript/Vite; exam engine timer, autosave, resume, audio recovery, kết quả/lịch sử, ôn sai, bảo vệ hai tab. Catalog theo cấp, SM-2, onboarding, daily plan, diagnostic từ vựng, Hanzi canvas/nét chữ, writing draft, ghi âm local. Local admin Node 24/SQLite có revision, import/checksum, review/publish/archive. Dữ liệu học localStorage schema 3 và preparation schema 1 được giữ.

## Coverage baseline

11.000 mục từ; 10.443 có nghĩa Việt cộng đồng, 557 thiếu. 576 tên cấu trúc, **0 bài học đầy đủ đã duyệt**; 17 mục staging. 3.088 Hán tự, 2.989 có glyph, 99 thiếu. 20 câu minh họa độc lập; **0 câu đạt workflow học thuật V3**, **0 audio mock được duyệt**, **0 full mock hợp lệ**. Không coi các bài mini dùng cùng câu là nội dung mới.

## Experimental và giới hạn

Nghĩa CVDICT có hỗ trợ dịch máy, chưa thẩm định từng mục. Diagnostic V2 chỉ đo từ; readiness giữ trạng thái thiếu bằng chứng. Local admin không phải tài khoản cloud/RBAC nhiều người. Ghi âm chưa có STT/chấm nói. Các câu minh họa dùng TTS không được coi là audio full mock.

## Blockers production

Cần reviewer ngôn ngữ/cấp HSK độc lập, nội dung câu hỏi đủ blueprint, audio có quyền phân phối, bài grammar đã duyệt, đối chiếu quy tắc CTI theo edition và hạ tầng cloud được cấu hình. Không tự nhận production-ready khi thiếu các điều kiện này.

## Kiểm tra baseline

typecheck, lint compiler/unused, unit core, test:v2, test:admin, check:content, production build, browser critical flows và mobile 320/375/390/430px: PASS. Snapshot mã nguồn: `.runtime/backups/before-v3-2026-10-15`.

## Đã triển khai V3

- Audit/normalization11.000mục: **8.765 đạt quy tắc kỹ thuật,2.235cần rà,557thiếuVI,758chưa có nghĩa ngắn an toàn**. Các số cuối có giao nhau; chưa có nghĩa được human-review độc lập trong vòng này. Learner card/quiz/tra từ dùng nghĩa ngắn; search Việt/pinyin chuẩn hóa; admin có hàng đợi sửa.
- Question schema/metadata/revision, quality/license gate và coverage matrix.20legacy giữ minh họa;8câu grammar mới chỉNEEDS_REVIEW. PublishedV3:0.
- Structured admin forms; JSONAdvanced; review ngôn ngữ/cấp có reviewer/comment/time; audit actor/before/after/time; import new/update/duplicate/conflict/invalid và checksumreplay. Preview dùng ExamEngine thật, không ghi vào lịch sử learner.
- Audio upload/decoder/duration/hash/private draft/publication gate/orphan inventory. **0audio thi thật được duyệt**; fileQAkhông phải nội dung luyệnthi.
- Seeded template/pool generator, revision locks và validator. Fullreference mới chỉHSK4truyềnthống, không gán sangHSK3syllabus2025. **0fullmockproduction**. Thủ tục/chuyển đáp án và thẩm định mô phỏngthi thật còn cần hoàn thiện.
- GrammarLesson model/form/renderer/practice qua câuPublished.8draftlesson và8bài luyện staged, **0lessonđượcduyệt/576taxonomy**; không masspublishAI.
- Timing riêngtừngcâu, active-time/ẩn-tab/audio-pause, answer changes/flags; result từ≥3mẫu. Weakness dimensions/score/recovery/confidence có ngưỡng; daily plan so sánh nghe/đọc7ngày khi đủ mẫu và có lýdo.

## Còn experimental / chưa triển khai

Placementđa kỹnăng25–40câu, weeklydeeprebalance, bulk review/publish UI/dragbuilder đầyđủ, official-equivalent scoring, Auth/email/OAuth/cloudsync/RLS, AIwriting/speaking, media transcoding/antivirus và vận hành production. Diagnosticvocab, writingdraft và recordingV2 vẫn chạy. Readiness giữ thiếubằngchứng.

## Quality gate V3

typecheck/lint/coreunit/V2unit/adminAPI/V3unit/V3API/content/build PASS. BrowserV2+V3critical đã PASS: deadline/resume/two-tab/offline, cleanvocab, queues/forms/license/reviewer gate, WAVdecode/upload và13màn learner/admin trên320/375/390/430px. Microphonevật lý/STT/mọi browser chưa kiểm. FixtureAPI dùngDBtạm; browserfixturearchive sauQA. Chi tiết [TESTING.md](TESTING.md), [CONTENT_V3.md](CONTENT_V3.md), [báo cáo V3](../FINAL_IMPLEMENTATION_REPORT_V3.md).
