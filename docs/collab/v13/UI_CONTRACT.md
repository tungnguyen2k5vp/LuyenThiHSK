# UI Contract · 13.0

CONTRACT_STATUS: FROZEN

UI_CONTRACT_VERSION: 13.0

CONTRACT_READY — Gemini can begin UI Batch 1.

Nguồn duy nhất: `src/contracts/ui-v13.ts` (Codex-owned). Checksum tại `data/reports/v13/contract-freeze.json`. Mọi thay đổi sau freeze phải có changelog; breaking change cần phối hợp bàn giao.

Domain → application service → `src/adapters/ui-v13/` → typed ViewModel → presentation. UI chỉ nhận DTO và callbacks, không import services/domain/types/database/API/storage. Không raw database record, token, credential, blob path, answer key hoặc quy tắc chấm trong props.

| Màn | Props chuẩn | Nguồn dữ liệu / quyết định |
| --- | --- | --- |
| Today | TodayProps | PreparationData, kế hoạch đã chọn, taskProgress, phiên có thể resume, availability thật |
| HSK hub | LevelHubProps | Cấp/taxonomy/coverage và readiness service, không mock score |
| Vocabulary explorer/detail | VocabularyExplorerProps / VocabularyDetailProps | Canonical word ID, overlay nguồn, SM-2 hiện có, related question pool |
| Grammar catalog/lesson | GrammarCatalogProps / GrammarLessonProps | Canonical grammar ID, examples, independent/guided pools, evidence thật |
| Practice | PracticeHubProps | Phần thi/pool có thể chơi, manual không thành incorrect, thiếu audio không available |
| Question | QuestionPresentationProps | Snapshot câu hiện hành; không đáp án/transcript trước domain cho phép feedback |
| Writing | WritingWorkspaceProps | Controlled value nguyên văn, một owner lưu nháp; composition events chuyển về owner |
| Result | ResultProps | Counts từ examScoring, objective denominator được ghi rõ, ungraded tách riêng |
| Mistakes | MistakeReviewProps | Review items, scope cùng cấp, số independent thật |
| Audio | AudioPlayerProps | Visual state của player hiện có; không tự tạo audio/TTS/provider hoặc đồng hồ thứ hai |
| Exam progress | ExamProgressProps | Chỉ số/timer do engine cung cấp; callbacks recheck section restrictions |
| Submit | SubmitDialogProps | Confirm gọi owner có idempotency/in-flight guard, không tự submit từ UI |

## States và trách nhiệm

- ViewState: loading/error/empty/ready; không tạo số liệu ngẫu nhiên khi loading/empty. `null` có nghĩa chưa có bằng chứng, không hiển thị 0%/100% thay thế.
- Availability gồm reason + count thực; disable không chỉ dựa CSS. Owner phải kiểm lại quyền/pool/CAS khi callback chạy vì DTO có thể stale.
- ContentStatus do adapter xác định. Preview, Beta, published/reference khác nhau; UI không tự gán Official, Published, Human Reviewed hoặc licensed.
- Audio có available/unavailable/loading/playing/paused/error/previewOnly. Guided TTS không bật listening/mock. Callback audio nối player hiện có; không thêm `<audio>`/SpeechSynthesis riêng trong presentation.
- QuestionVM không chứa correctAnswer, matching.correct, acceptedAnswers, promptVi, transcript hoặc sampleAnswer. Feedback chỉ xuất hiện khi service/engine đã cho phép; không tính checkability dựa CSS.
- Writing: truyền raw Unicode/multiline, không trim/normalize/transliterate, không debounce thành autosave thứ hai. `onCompositionStart/End` phải forward; không dùng phím IME để navigate. Giữ native undo, không remount editor theo value; key ổn định questionId.
- Timer do engine đẩy display/state. Presentation không setInterval tính deadline hoặc đổi section.
- NavigationCommand là đề nghị; owner kiểm canonical ID, cấp, availability và section hiện hành. Không dựng URL/HTTP request tùy ý từ UI.
- A11y: heading/label/live có trong DTO; dialog phải label, trap focus, Escape, restore opener/scroll. Text là plain string, không dangerouslySetInnerHTML. Tap targets ≥44px, supports keyboard.

## Batch 1

Chỉ design tokens/scoped primitives, Today và LevelHub sau freeze. Không thêm dependency/font qua network khi chưa phối hợp. Các màn khác vẫn dùng giao diện cũ đến handoff + integration gate.

## Handoff

Gemini ghi `HANDOFF_BATCH_N.md` trong vùng của mình, chứa danh sách file chính xác + SHA256, exports, contract 13.0, assets/license, states/viewport đã kiểm, known gaps và trạng thái GEMINI_BATCH_READY. Codex xác minh manifest trước khi import. Không dùng ảnh chụp hoặc file được copy để tự gán BATCH_INTEGRATED.
