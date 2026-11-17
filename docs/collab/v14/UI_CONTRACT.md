# UI Contract 14.0

CONTRACT_STATUS: FROZEN
UI_CONTRACT_VERSION: 14.0
CONTRACT_READY_V14

Nguồn chuẩn: `src/contracts/ui-v14.ts`. Hash + kiểm tra tại `data/reports/v14/contract-freeze.json`. Kế thừa các DTO readonly của V13, không sửa contract 13.0.

## Cách dùng

Mỗi presentation nhận `state: ViewState<T>` với loading/error/empty/ready. VM có `contractVersion`, `availability`, `content`, `a11y`. Callback nằm trong `*Props` tương ứng. Null là chưa biết/không có; không biến thành 0 hoặc dữ liệu mẫu. `VMBase.a11y.label` là text, không render HTML.

19 nhóm VM: ExamCatalog, ExamCard, ExamIntro, ExamMode, SectionInstruction, ExamRoom, ExamNavigator, ExamPart, ExamQuestion, QuestionGroup, AudioPlayer, ImageChoice, MatchingGroup, ReadingQuestion, WritingQuestion, ExplanationTabs, ExamTimer, SubmitDialog, ExamResult. Tên đầy đủ có hậu tố VM trong source.

`ExamQuestionVM.type` dùng đúng registry 13 loại hiện có. Sentence-order dùng choices hiện có; `sentenceTokens` rỗng khi chưa có dữ liệu token ổn định, không tự tách từ hay dựng đáp án. Matching map được serialize qua shared registry. Shared bank giữ ID/revision và câu thuộc nhóm. Image chỉ nhận `QuestionImageVM` từ media owner, không fetch trong UI. Audio nhận visual state và callbacks; không audio URL/token/transcript.

## Chính sách bắt buộc

- `practice`: feedback sau check; `timed`: feedback sau completed attempt. Không có correctAnswer/transcript/translation trong câu đang thi; explanation tabs rỗng nếu chưa được phép.
- Thời gian, media recovery, replay, navigation và submit do owner hiện có quyết định. UI không dùng setInterval, không tự tăng plays hay bắt đầu section.
- Callback nhận ID, owner kiểm tra lại trạng thái mới nhất qua `commands.ts`. Không lưu closure cũ để ghi đáp án sang câu khác.
- Mode chốt khi tạo session; contract không có lệnh đổi mode của session. Start đang xử lý bị chặn lặp; durable idempotency vẫn dùng owner.
- Raw writing/IME chuyển nguyên văn, không trim/normalize; giữ native textarea Undo. Ungraded không tính thành sai.
- Không mặc định Official/Secure. `timed` ở đây là bài luyện tính giờ local. Secure Exam server-authoritative chưa triển khai; DTO whitelist không phải chứng nhận rằng toàn bộ mạng/browser không chứa key của private practice.
- Source provenance, syllabus mapping, format, technical, language, rights, publication là bảy chiều độc lập. Không dùng một badge VERIFIED chung.

`ExamResultVM.result` giữ nguyên `ResultVM` V13, kể cả nested `meta.contractVersion='13.0'`; wrapper V14 mang version14.0. Không sửa analytics/scoring để phục vụ layout.

## Owner integration

Adapters thuần tại `src/adapters/ui-v14/{exam,catalog,commands}.ts`. Snapshot là dữ liệu chỉ Codex tạo; Gemini không được tự tạo PublicationEvidence/readiness. Source API local mới chỉ có `GET admin/v14/catalog`, `GET admin/v14/intro?id=...`, sau auth loopback. API metadata không chứa câu/keys. Launch descriptor trỏ builder hiện có; không tạo attempt writer khác.

Đã nhận handoff và mount Catalog/Intro/Room/Navigator/question choices/feedback/result qua `?ui=v14`. Feature flag chỉ thay presentation, không đổi database/storage keys. Legacy và `?ui=v13` tiếp tục hoạt động. Receipt tại `data/reports/v14/ui-receipt.json`; các type riêng trong presentation được bridge bởi Codex, không thay contract frozen này.

Sau freeze chỉ thêm optional field có changelog/checksum mới; breaking change cần bàn giao/phối hợp trước.
