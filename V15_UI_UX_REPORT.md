# V15 · UI/UX

Ngày 2026-10-20 (Asia/Bangkok). **V15_LOCAL_QA_PASSED / CONTENT_PENDING_FINAL_HUMAN_REVIEW**. ProductionReady=false. Dữ liệu và bằng chứng định lượng: [release-gates.json](data/reports/v15/release-gates.json).

## Các màn đã cải thiện

Catalog: bố cục hai cột rộng, cover chữ 学 nguyên bản, heading/số bài từ dữ liệu thật, tab kỹ năng/Mini có bài thật, tìm kiếm có nhãn, chỉ chọn cấp hiện được hỗ trợ. Intro: nhãn nền tảng/BETA, số câu theo kỹ năng, chọn practice/timed, acknowledgement trước Start. Room: navigator trái, câu hỏi giữa, timer/submit phải; trên tablet/mobile dùng drawer có Escape/focus.

Audio: dùng một HTMLAudioElement/owner, progress theo sự kiện media thật, seek/rate theo policy. Matching giữ ID/revision, ảnh được xác thực; mỗi câu nghe dùng audio của câu đang hoạt động. ReadingPassageQuestion được mount cho phần đọc thích hợp. Writing giữ textarea, native Undo, raw Unicode/IME và manual/ungraded. ExplanationAccordion hỗ trợ Arrow/Home/End và tabpanel; transcript/translation chỉ nhận từ policy sau check/submit. Result dùng cùng scoring, không suy diễn điểm đỗ.

## Gemini được tái sử dụng

ExamCatalogView, ExamCatalogCard, ExamIntroCard, ListeningInstructionModal, ExamRoomShell, ExamNavigator, ExamTimerCard, ListeningTrueFalse, ListeningImageChoice, ListeningMatching, ListeningDialogue, ReadingPassageQuestion, ExplanationAccordion, ResultPageViewV14 cùng các primitive đang dùng. [Inventory toàn bộ](docs/v15/COMPONENT_INVENTORY.md).

AudioPlayerBar/MiniAudioPlayer và WritingWorkspaceV14 chưa mount trong phòng thi riêng: audio/IME đang do owner có kiểm thử phụ trách. Workspace demo và fixtures không mount vào sản phẩm. Không xóa hàng loạt component. Không dùng asset/logo/mascot/câu hỏi của Migii; tham khảo cấu trúc UX trong tài liệu bàn giao hiện có.

## Responsive / chuyển động / khả năng truy cập

Kiểm tra viewport và screenshot tại gallery; phạm vi/nhóm thực chạy trong V15_TEST_REPORT. Focus nhìn thấy, dialog trap/return, search/status có nhãn; chuyển động transform/opacity ngắn và tắt với prefers-reduced-motion. Chưa coi là chứng nhận WCAG toàn diện hoặc kiểm AT trên thiết bị thật.

## A/B V14 → V15

| Browser / thao tác | V14 p95 ms | V15 p95 ms | Budget ms | Kết quả |
| --- | --- | --- | --- | --- |
| chrome / navigation | 67.6 | 67.7 | 87.6 | WITHIN |
| chrome / choices | 67.2 | 67.2 | 87.2 | WITHIN |
| chrome / result | 151.5 | 75.5 | 174.2 | WITHIN |
| edge / navigation | 69.8 | 68.3 | 89.8 | WITHIN |
| edge / choices | 68.1 | 68.1 | 88.1 | WITHIN |
| edge / result | 115.5 | 67.0 | 135.5 | WITHIN |

20 cặp xen kẽ sau warmup, cùng attempt/profile/content/API, hai thao tác + hai RAF, có chờ ảnh thật. Đây là phép đo tương tác trong local QA; không phải production Web Vitals hoặc cold-load. Initial JS V15 khoảng398,1kB/gzip120,7kB so với V14 khoảng396,8kB/gzip120,2kB; CSS polish khoảng7,3kB. Không tuyên bố tải lạnh nhanh hơn từ số đo warm này.
