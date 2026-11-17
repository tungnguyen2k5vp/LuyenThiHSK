# V15 · Báo cáo triển khai

Ngày 2026-10-20 (Asia/Bangkok). **V15_LOCAL_QA_PASSED / CONTENT_PENDING_FINAL_HUMAN_REVIEW**. ProductionReady=false. Dữ liệu và bằng chứng định lượng: [release-gates.json](data/reports/v15/release-gates.json).

## Thay đổi đã hoàn thành

- Một agent phụ trách UI và logic theo yêu cầu V15. Tái sử dụng component Gemini, không tạo cây UI song song. Private Preview mặc định mở V15; ui=v14 giữ giao diện V14 làm fallback, còn ui=v13 và URL gốc tiếp tục chọn các phiên bản cũ.
- Snapshot 8892 file + 148 media, SQLite content/account khôi phục và so hash từng bảng. Git không hợp lệ; trạng thái file được bảo toàn qua snapshot/hash. Backup riêng: .runtime/backups/before-v15-2026-10-19T16-36-58-946Z.
- Catalog có hai bài tổng hợp HSK1, hai bài kỹ năng và một Mini Test từ builder thật. HSK2 full candidate vẫn khóa theo readiness. Intro có xác nhận quy tắc, mode cố định khi tạo phiên, tiếp tục phiên hiện hữu.
- Layout ba cột, cover chữ Hán nguyên bản, hero/số liệu thật, trạng thái tải/lỗi/thử lại, mobile drawer/focus, Reading component, Writing bản nháp, audio progress, tabs giải thích bàn phím và Result dùng owner/scoring cũ.
- V15 dùng API cùng origin qua proxy, request có timeout/abort, load cũ không ghi đè load mới. Ảnh cache trong bộ nhớ có giới hạn, theo credential/hash, kiểm SHA256, không lưu private API vào service worker cache.
- Truy vấn latest revision được gom nhóm; endpoint ảnh đọc đúng asset thay vì nạp toàn bộ release. Checksum/SVG allowlist và auth giữ nguyên. Không migration/schema/index thay đổi.
- Queue duyệt 681 câu; thêm bản nháp riêng 2 bài/10 câu HSK2, chưa nhập DB. Audio review queue 40, chưa tạo audio mới.

## Bằng chứng

Regression 39/39: PASS; logic 25 checks; security 16 checks; chrome: 34 nhóm PASS; edge: 34 nhóm PASS. Screenshot trước từ dist đã snapshot; sau từ build V15, cả hai browser/profile/API clone. Source product/config so với copy regression: MATCH.

Xem [UI/UX](V15_UI_UX_REPORT.md), [Exam flow](V15_EXAM_FLOW_REPORT.md), [Content](V15_CONTENT_QUALITY_REPORT.md), [Tests](V15_TEST_REPORT.md), [Readiness](V15_RELEASE_READINESS.md), [Gallery](docs/v15/SCREENSHOT_GALLERY.html).

## Giới hạn còn lại

Nội dung chưa có chuyên gia duyệt, HSK2 thiếu audio/quyền/phát âm cho full mock. V14 từng có request tải lại chờ lâu; V15 đã kiểm timeout/retry và reload liên tiếp, chưa có chứng cứ kết luận nguyên nhân duy nhất của mọi sự cố cũ. Private offline hard reload vẫn cần API; chưa chứng nhận thiết bị IME/assistive technology thật, production Auth/RLS hoặc Secure Exam server-authoritative. Warm A/B không chứng minh cold-load nhanh hơn.

## File đã sửa hoặc thêm

- [src/components/exam/ExamAudio.tsx](src/components/exam/ExamAudio.tsx)
- [src/components/exam/QuestionSolution.tsx](src/components/exam/QuestionSolution.tsx)
- [src/components/exam/QuestionTypeRenderer.tsx](src/components/exam/QuestionTypeRenderer.tsx)
- [src/components/exam/WritingWorkspace.tsx](src/components/exam/WritingWorkspace.tsx)
- [src/components/preparation/PreviewWorkspace.tsx](src/components/preparation/PreviewWorkspace.tsx)
- [src/components/uiV14/CatalogPresentation.tsx](src/components/uiV14/CatalogPresentation.tsx)
- [src/components/uiV14/FeedbackPresentation.tsx](src/components/uiV14/FeedbackPresentation.tsx)
- [src/components/uiV14/QuestionPresentation.tsx](src/components/uiV14/QuestionPresentation.tsx)
- [src/components/uiV14/ResultPresentation.tsx](src/components/uiV14/ResultPresentation.tsx)
- [src/components/uiV14/RoomPresentation.tsx](src/components/uiV14/RoomPresentation.tsx)
- [src/services/localApi.ts](src/services/localApi.ts)
- [src/services/previewImages.ts](src/services/previewImages.ts)
- [src/services/uiV14Feature.ts](src/services/uiV14Feature.ts)
- [src/services/useDialogFocus.ts](src/services/useDialogFocus.ts)
- [src/styles/ui-v15-polish.css](src/styles/ui-v15-polish.css)
- [src/ui-v14/components/catalog/ExamCatalogCard.tsx](src/ui-v14/components/catalog/ExamCatalogCard.tsx)
- [src/ui-v14/components/catalog/ExamCatalogView.tsx](src/ui-v14/components/catalog/ExamCatalogView.tsx)
- [src/ui-v14/components/exam/ExamRoomShell.tsx](src/ui-v14/components/exam/ExamRoomShell.tsx)
- [src/ui-v14/components/intro/ExamIntroCard.tsx](src/ui-v14/components/intro/ExamIntroCard.tsx)
- [src/ui-v14/components/question/ExplanationAccordion.tsx](src/ui-v14/components/question/ExplanationAccordion.tsx)
- [src/ui-v14/components/question/ReadingPassageQuestion.tsx](src/ui-v14/components/question/ReadingPassageQuestion.tsx)
- [src/ui-v14/primitives/ToggleSwitch/ToggleSwitch.tsx](src/ui-v14/primitives/ToggleSwitch/ToggleSwitch.tsx)
- [server/admin-server.mjs](server/admin-server.mjs)
- [server/content-reads.mjs](server/content-reads.mjs)
- [server/v14-exam-catalog-service.mjs](server/v14-exam-catalog-service.mjs)
- [server/v5-content-service.mjs](server/v5-content-service.mjs)
- [server/v6-content-service.mjs](server/v6-content-service.mjs)
- [shared/v15-content-quality.mjs](shared/v15-content-quality.mjs)
- [scripts/exam-browser-check.mjs](scripts/exam-browser-check.mjs)
- [scripts/test-v15.mjs](scripts/test-v15.mjs)
- [scripts/v15-additional-browser-flows.mjs](scripts/v15-additional-browser-flows.mjs)
- [scripts/v15-baseline.mjs](scripts/v15-baseline.mjs)
- [scripts/v15-bind-performance.mjs](scripts/v15-bind-performance.mjs)
- [scripts/v15-browser-flows.mjs](scripts/v15-browser-flows.mjs)
- [scripts/v15-browser-regression.mjs](scripts/v15-browser-regression.mjs)
- [scripts/v15-consolidate.mjs](scripts/v15-consolidate.mjs)
- [scripts/v15-content-review.mjs](scripts/v15-content-review.mjs)
- [scripts/v15-data-safety.mjs](scripts/v15-data-safety.mjs)
- [scripts/v15-final-report.mjs](scripts/v15-final-report.mjs)
- [scripts/v15-isolated-api.mjs](scripts/v15-isolated-api.mjs)
- [scripts/v15-performance-flows.mjs](scripts/v15-performance-flows.mjs)
- [scripts/v15-regression.mjs](scripts/v15-regression.mjs)
- [scripts/v15-security-check.mjs](scripts/v15-security-check.mjs)
- [scripts/v15-start-local-api.mjs](scripts/v15-start-local-api.mjs)
- [scripts/v15-verify-source.mjs](scripts/v15-verify-source.mjs)
- [package.json](package.json)
- [public/sw.js](public/sw.js)
