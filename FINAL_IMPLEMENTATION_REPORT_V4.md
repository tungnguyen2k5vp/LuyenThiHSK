# Báo cáo triển khai V4 — HSK 1

Cập nhật **16/10/2026 (Asia/Bangkok)**. Dự án `D:\ReactJS\LuyenThiHSK`. Phạm vi theo chỉ đạo bổ sung: tiếp tục nội dung AI và audio tổng hợp ở Preview/Beta riêng, không chờ reviewer; giữ gate production. Không sửa dự án Android `HocTiengTrungApp`.

## 1. Kết luận

**TECHNICALLY BETA READY / CONTENT PENDING FINAL HUMAN REVIEW — cho bản HSK 1 local/private.** Đây là kết luận cho luồng kỹ thuật đã kiểm tra, không phải giấy chứng nhận nội dung hoặc production readiness. Production vẫn **BLOCKED_FOR_HUMAN_REVIEW**, chưa public beta internet.

## 2. Baseline và bảo toàn

Backup trước sửa: `.runtime/backups/before-v4-2026-10-15`. [V4_BASELINE](docs/V4_BASELINE.md) ghi các kiểm tra V3 trước sửa. Giữ engine timer/autosave/navigation/scoring, các ID và khóa tiến độ cũ; Preview dùng khóa riêng. Không đập lại UI, không thêm framework.

## 3. Số lượng và trạng thái chính xác

| Content V4 | Total | Draft enum | Needs Review | Internally Validated | Human Reviewed | Published |
|---|---:|---:|---:|---:|---:|---:|
| Vocabulary | 300 | 0 | 300 | 300 | 0 | 0 |
| Grammar lessons | 68 | 0 | 68 | 68 | 0 | 0 |
| Questions | 128 | 0 | 128 | 128 | 0 | 0 |
| Synthetic audio assets | 40 | 0 | 40 | 40 | 0 | 0 |
| Practice mock template | 1 | 0 | 1 | 1 | 0 | 0 |
| **Tổng** | **537** | **0** | **537** | **537** | **0** | **0** |

“Bản nháp” trong mô tả gồm các item NEEDS_REVIEW. Internally Validated chồng lấp Needs Review: kiểm tra kỹ thuật không thay trạng thái workflow. InternalReview=AI_SELF_CHECKED, không phải người thật. Không cộng taxonomy/legacy Published V3 vào số review học thuật V4.

## 4. HSK 1, 2, 3

HSK1 có nội dung thực và hành trình Preview/Beta nội bộ. HSK2–3 giữ DATA_ONLY của curriculum, không tuyên bố Beta Ready; chưa sản xuất tương đương WaveA. Không triển khai đồng thời HSK1–9.

## 5. Vocabulary

300/300 nghĩa ngắn VI, 300/300 ví dụ original zh/pinyin/VI ở private overlay. Sửa36join dictionary trên HSK1 nguồn cộng đồng; missingVI5→0, no-short22→3. Toàn dataset hiện8.775normalized/2.225cần rà/552missingVI/739no-short. Nghĩa CVDICT không trở thành human-reviewed. [Báo cáo](VOCABULARY_QUALITY_REPORT_V4.md).

## 6. Grammar

68/68 taxonomy point HSK1 có lesson draft đầy đủ và136ví dụ. Có mẫu, usage/explanationVI, lỗi thường gặp, ghi chú so sánh và câu luyện liên kết. Không cộng8draftV3 như8cấu trúc mới. [Báo cáo](GRAMMAR_COVERAGE_REPORT_V4.md).

## 7. Question Bank

128câu original:68grammarfill-blank,40listening,20contextreading. Có metadata yêu cầu, đáp án và giải thích; answerVerified=false giữ nguyên. Preview chấm đáp án AI tự kiểm tra qua nhánh riêng, không gắn human verification. Exact duplicate/reference/option checks0lỗi. Không kiểm định độ khó thực tế khi chưa có người học/reviewer. [Báo cáo](QUESTION_BANK_REPORT_V4.md).

## 8. Rà nội dung và cấp HSK

Word/level/pinyin facts theo CTI syllabus2025 hash `ec74ce0439e837bbb15154be13e747ae798903b2fd3a331629df6c3b45504941`. Pinyin câu bằng pypinyin0.55.0 vẫn chờ review. Sàng lọc longest dictionary match đánh dấu64draft có thể có từ hỗ trợ, tên riêng hoặc vượt cấp; gồm false positives. [Danh sách](data/reports/v4-level-screening.json) giúp reviewer ưu tiên, không phải phán quyết ngôn ngữ.

## 9. Listening

40WAVsynthetic thật từ40transcript original; provider/voice/transcript/duration/hash/license/status/review đầy đủ. Browser decode40/40trên Chrome vàEdge; playback+hidden transcript qua E2E. Chưa ai nghe duyệt. Voice huayan dataset license Unknown: chỉ Preview riêng, không đưa vào public/dist. [Báo cáo](AUDIO_COVERAGE_REPORT_V4.md).

## 10. Practice và Mini Tests

Drill5câu nghe/đọc; mini10câu nghe/đọc/tổng hợp. Dùng pool validated, seed tái tạo được, timer/autosave/snapshot, lời giải sau kiểm tra/submit, tỷ lệ đúng nội bộ. Không nhân số câu khi cùng pool được dùng nhiều lần.

## 11. Full Mock Preview

PLATFORM PRACTICE MOCK / BETA:40câu=20nghe+20đọc,35phút custom=15+20. Revision locks và seed; section navigation, audio2lượt, autosave/reload, timeout chuyển phần, submit/result. structureVerified=false/rulesVerified=false, không Official HSK Test. Pool đọc20câu nghĩa là các seed khác hiện đổi thứ tự đọc. Production full mock0. [Báo cáo](MOCK_READINESS_REPORT_V4.md).

## 12. Study plan, onboarding và diagnostic

Preview có onboarding mục tiêuHSK1, trang hôm nay mở10từ/1lesson/mini/ôn sai và tiến độ thực. Dùng key riêng. Onboarding/dailybudget/diagnostic12câu từ vựng V2 được kiểm tra hồi quy. Chưa xây placement25–40câu đa kỹ năng có calibration; không quảng cáo diagnostic chuyên gia hoặc điểm sẵn sàng thi thật từ Preview.

## 13. Mistakes, weakness và recommended session

Preview giữ mistakebook riêng, ôn tối đa10câu cần ôn và dùng lại WeaknessWorkspace theo attemptsnapshot. Có nguyên nhân lỗi, lịch ôn/củng cố, câu tương tự, insight metadata có ngưỡng và thời gian hoạt động. E2E đi từ full result→mistakes→weakness→lượt ôn. Không trộn evidence Preview vào readiness production.

## 14. Review Queue và revisions

Stage537draft idempotent; lọc loại/trạng thái, search,20item/trang, form, save revision/conflict, revalidate fingerprint, reviewer/comment/xác nhận. Audio Review Queue40file tách rõ decode và human review. Sửa nội dung làm validation hết hiệu lực; mỗi revision cần review lại. Không tự đánh dấu Language Review hoặc HSK Level Review.

## 15. Môi trường và publication gate

DEV/PREVIEW cho bản nháp riêng; BETA nội bộ yêu cầu automated+AIself-check; production giữ workflow+quyền+quality gate. V4 vocabulary cũng phải qua language và level review. Public endpoint không trả V4draft. TTS/SYNTHETIC không vượt gate audio thi. Auth local/token, không phải cloudmultiuser/RBAC.

## 16. Nguồn và license

Không sao chép đề premium, không phát hành câu/audio CTI. Official page còn dữ liệu cũ150từ/cấu trúc40câu nên không suy ra format2025 từ tiêu đềpage. CTI là nguồn fact; nghĩa/giải thích/đề V4 luônAI_GENERATED. CC BY-SA CVDICT giữ attribution. Piper/helper chạy tooling riêng; unknown voice license vẫnUNVERIFIED. [Báo cáo](CONTENT_LICENSE_REPORT_V4.md).

## 17. Performance và mobile

Lazy Preview khoảng20,42kBJS/gzip7,18kB ở build kiểm tra; dữ liệu/audio/model không đi vào mainbundle. MainJS360,71kB/gzip109,63kB; đối chiếu tổng chunks vì có tách sharedcatalog. Chrome local release115ms/search8ms/start108ms; Edge232ms/7ms/112ms, gồm overhead polling, không phải Lighthouse/CWV.9mànPreview checked320/375/390/430px. [Báo cáo](PERFORMANCE_REPORT_V4.md).

## 18. Kết quả kiểm tra

typecheck,lint,coreunit,V2,V3,V4unit/API,adminAPI,contentvalidation,build PASS. V4 E2E Chrome+Edge PASS gồm onboarding,học300từ/68lesson,grammarpractice,audio thật,mini/full,timer/reload/sectiontimeout,submit,result,ôn sai,weakness,reviewgate vàmobile. V1–V3 browser regression PASS gồm offline/two-tab/audioerror,adminpublish/archivefixtures. QA profile riêng; so sánh khóa production trước/sau không thay đổi. [Chi tiết](TEST_REPORT_V4.md).

## 19. Blockers và giới hạn còn lại

Human expert review ngôn ngữ/pinyin/cấp/đáp án/distractors; nghe duyệt giọng synthetic; quyền voice production; xác minh examformat2025 nếu muốn mô phỏng chính thức.64flag cấp cần xử lý. Preview audio cold-start offline chưa preload; public offline V3 giữ. Chưa kiểm bằng thiết bị mobile vật lý, microphone, Safari/Firefox hoặc Lighthouse. Chưa triển khai cloud auth, sync nhiều người hoặc production deployment.

## 20. Bàn giao và bước tiếp theo

Mở `http://127.0.0.1:4173/?view=preview`, lấy mã tại `.runtime/admin-access.txt`. Website/API đã chạy local. Toàn bộ tài liệu V4 tại [mục lục tập trung](TAI_LIEU_TONG_HOP_HSK/00_MUC_LUC.md); [hướng dẫn pipeline](docs/CONTENT_V4.md). Duyệt/sửa các draft hiện có và thay/xác minh voice; sau HSK1humanreview mới mở rộng HSK2→3. Không cần chờ reviewer để tiếp tục phát triển Preview; không tự publish nội dung chưa đủ gate.
