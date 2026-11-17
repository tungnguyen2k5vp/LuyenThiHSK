# V9 · Sẵn sàng phát hành

lúc 13:13 Thứ Bảy, 17 tháng 10, 2026 (UTC+7) · Local / private. Nội dung chưa duyệt chuyên môn.

**TECHNICALLY BETA READY / CONTENT PENDING FINAL HUMAN REVIEW** chỉ áp dụng tính năng private local đã test. Production=BLOCKED.

| Loại | Tổng | Draft | Needs Review | Automated valid | Human | Published |
| --- | --- | --- | --- | --- | --- | --- |
| vocabulary | 300 | 0 | 300 | 300 | 0 | 0 |
| grammar | 68 | 0 | 68 | 68 | 0 | 0 |
| audio | 80 | 0 | 80 | 80 | 0 | 0 |
| templates | 1 | 0 | 1 | 1 | 0 | 0 |
| images | 30 | 0 | 30 | 30 | 0 | 0 |
| optionBanks | 18 | 5 | 13 | 18 | 0 | 0 |
| questions | 489 | 0 | 489 | 489 | 0 | 0 |

Tổng 986; Draft = 5, Needs Review = 981, kiểm tra kỹ thuật = 986, Human Reviewed = 0, Published = 0. Trạng thái automated là chiều riêng, không cộng chồng vào tổngworkflow. 7 nháp V4/V5 cũ ngoài phạm vi, public syllabus facts ngoàieditorial. Audio jobs18 không tínhAudioAsset.

Blockers: human language/level/answer uniqueness; 199 quyết định ngữ nghĩa; quyền và phát âm của 80 audio HSK1 cùng 30 hình minh họa; audio HSK2 hợp lệ 0/18; edition/đánh số Writing; auth/RLS/HTTPS/SMTP/đa thiết bị thật; storage/rate/audit của secure grading trên deployment. Không coi AIselfcheck là internalexpertreview. Không deploy/publish hoặc tự bypass gates.

- **HSK1 engine — PRESERVED**: 8 parts, timer/media/lease/recovery; hai bộ 40 câu không trùng.
- **199 flags — REVIEW PREPARED**: 12 loại + full evidence/suggestions; technical errors0, human resolved0.
- **Grammar — IMPLEMENTED**: 33 câu mới; 68/68 ≥5 independent unique; chưa phải expert verified.
- **HSK2 bank — PRIVATE BETA**: 54 câu, 6/part; metadata/source screening.
- **HSK2 reading — IMPLEMENTED**: 24 câu; 2 mini độc lập/part trong pool6.
- **HSK2 writing — IMPLEMENTED**: 12 câu; W2 6 manual, editor lớn/Unicode/multiline/autosave.
- **HSK2 listening — BLOCKED_MEDIA**: 18 transcript/job; audio hợp lệ0, CTA disabled.
- **HSK2 Full Mock — NOT_AVAILABLE**: Không tạo đề giả hoặc official score.
- **Writing source numbers — NOT_VERIFIED**: 10 nội dung đối chiếu; không xác minh edition/number compatibility.
- **Reviewer — IMPLEMENTED**: UI/CAS + HTML offline986 mục + export ghi chú.
- **Auth/cloud — CODE_READY_LIVE_NOT_VERIFIED**: Migration/config/tests giữ lại; không có credentials/live QA.
- **Secure grading — QA_ONLY**: HTTP + SQLite durable QA; không mount production.
- **Sync — PRESERVED**: Web Locks/journal/CAS, unsupported message; live multi-device chưa xác minh.
- **Performance — MEASURED**: N+1 884→2 prepare, bounded8 validation workers; raw20samples.
- **Mobile — BROWSER_VIEWPORT_QA**: 320/375/390/430/768/1280; thiết bị thật NOT_VERIFIED.
- **HSK3 — BLUEPRINT_ONLY**: CTI-linked sample; 70 câu/8parts, chưa mở nội dung.
- **HSK4–9 — DATA_ONLY**: Không tạo hàng nghìn câu hoặc giả mock.
- **Production — BLOCKED**: Human/rights/live auth-cloud/deployment gates còn thiếu.

[Data safety](../../data/reports/v9/data-safety.json): oldrevisionsmissing=0, changedcontent=0, oldnotes/assignee/decisionchanged=0, publicdataunchanged=true, schemaChanged=false. Restore riêng PASS. Historical metadata kỹ thuật có thể được tái xác nhận bởi browser media QA; danh sách giữ trong JSON, không gọi DB byte-identical.
