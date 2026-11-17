# BÁO CÁO BÀN GIAO GIAO DIỆN HSK UI V13 — GEMINI FLASH (UI/UX AGENT)
> **Dự án**: LuyenThiHSK — Lớp Trình Bày (Presentation Layer V13)  
> **Người thực hiện**: Gemini Flash (Senior Product Designer, UI/UX Engineer & Accessibility Specialist)  
> **Người tiếp nhận tích hợp**: Codex (Logic, Backend, Storage & Engine Lead)  
> **Phạm vi code**: Cách ly tuyệt đối tại `src/ui-v13/` và tài liệu tại `docs/collab/v13/gemini/`  
> **Trạng thái**: TOÀN BỘ 6 BATCHES ĐÃ HOÀN THÀNH — SẴN SÀNG CHO CODEX TÍCH HỢP (`GEMINI_BATCH_ALL_READY`)

---

## 1. TỔNG QUAN BÀN GIAO TOÀN DIỆN (BATCH 1 ĐẾN 6)

Gemini Flash đã hoàn thành toàn diện lớp trình bày mới (Presentation Layer V13) cho dự án LuyenThiHSK theo đúng 6 batch lộ trình:

1. **BATCH 1 — Design Tokens, Typography & UI Primitives**: Hệ thống tokens 3 tầng độc lập, Buttons (tap target ≥44px), Cards, Badges, StatusChips, ProgressBars, AudioStatusIndicators, EmptyState, Hanzi/Pinyin typography.
2. **BATCH 2 — Today Workspace & HSK Level Hub (1–9)**: Hero 5 giây định hướng ("Tiếp tục học hôm nay"), thẻ nhiệm vụ đa trạng thái (to-do, completed, skipped, locked), tiêu điểm điểm yếu, chuyển đổi HSK 2.0 / 3.0.
3. **BATCH 3 — Vocabulary & Grammar Workspace**: Tra cứu từ vựng với bộ lọc thông minh, thẻ từ chữ Hán lớn, modal chi tiết đa nghĩa, thẻ học lật 3D (Flashcard 3D) có phím tắt; Danh mục ngữ pháp, công thức cấu trúc, ví dụ minh họa và thẻ so sánh điểm ngữ pháp dễ nhầm lẫn.
4. **BATCH 4 — Practice Hub & Question Presentation**: Khu luyện tập 3 kỹ năng cốt lõi (Nghe, Đọc, Viết); trình hiển thị câu hỏi đa tương tác (Trắc nghiệm A/B/C/D, Trắc nghiệm hình ảnh, Phán đoán Đúng/Sai, Nối câu/ghép cặp, Tự luận); thẻ giải thích kết quả chi tiết kèm liên kết từ vựng/ngữ pháp.
5. **BATCH 5 — Writing Workspace & Result Page**: Bàn làm bài viết tự luận tiếng Hán chuẩn IME (hỗ trợ composition events, đếm số chữ Hán, trạng thái lưu nháp, nhãn "Chưa chấm · không tính là câu sai"); Màn hình kết quả thi với cấu trúc tối ưu: Kết quả chính → Điểm yếu & Cảnh báo → Phân tích kỹ năng → Giải thích từng câu → Bước học tiếp theo.
6. **BATCH 6 — Mistakes Review, Progress Analytics & Responsive Polish**: Sổ tay câu hỏi cần ôn tập (câu sai, gắn cờ, ngắt quãng SRS), thẻ chuỗi ngày học liên tục (Streak), lưới thống kê tiến độ tích lũy; tinh chỉnh responsive cho cả 8 breakpoint (320px đến 1440px).

---

## 2. NGUYÊN TẮC TUÂN THỦ NGHIÊM NGẶT

- **Không can thiệp lớp nghiệp vụ**: 0 lệnh ghi database/SQLite/migrations, 0 fetch/API trực tiếp, 0 can thiệp engine thi/chấm điểm, 0 can thiệp SRS/SM-2, 0 sửa `package.json` hoặc config build.
- **Cách ly phạm vi 100%**: Toàn bộ code mới nằm độc quyền trong `src/ui-v13/`. Toàn bộ stylesheet đóng gói dưới root selector `.hsk-ui-v13`, không ảnh hưởng CSS cũ của V12.
- **Hợp đồng dữ liệu minh bạch**: 100% components sử dụng Typed Props (ViewModels) và Callbacks, tương thích trọn vẹn với hợp đồng `src/contracts/ui-v13.ts` do Codex sở hữu.
- **Trung thực về hiện trạng dữ liệu**:
  - HSK 2 chưa có file audio (0/40 audio) được hiển thị minh bạch bằng `AudioStatusIndicator` ("Đang hoàn thiện âm thanh"), không giả lập Full Mock khi audio chưa sẵn sàng.
  - Nhãn chất lượng dữ liệu hiển thị rõ ràng `PREVIEW` / `NEEDS_REVIEW` (không tự gán Official hay Human Reviewed khi DB chưa duyệt).
  - Câu viết tự luận chưa chấm được gắn nhãn `UNGRADED` ("Chưa chấm · không tính là câu sai").
- **Kiểm thử TypeScript**: `npm run build` (`tsc && vite build`) chạy thành công 100% không cảnh báo lỗi type.

---

## 3. DANH MỤC FILE ĐÃ TẠO TRONG `src/ui-v13/`

### 3.1. Design Tokens & Scoped Stylesheets (`styles/`)
- `styles/tokens.css`: Hệ màu Modern Teal (`#0d9488`), Amber (`#f59e0b`), Neutral (`#0f172a`), font Hanzi, Pinyin, spacing, radius, z-index.
- `styles/base.css`: CSS reset cục bộ, font-family hỗ trợ tiếng Việt có dấu, chữ Hán giản thể và Pinyin thanh điệu.
- `styles/components.css`: Styling các primitives cơ bản.
- `styles/views.css`: Bố cục layout cho Today Workspace và Level Hub.
- `styles/vocab-grammar.css`: Styling thẻ từ vựng, modal chi tiết, thẻ lật 3D flashcard, khối so sánh ngữ pháp.
- `styles/practice-question.css`: Bố cục Practice Hub, các dạng câu hỏi và thẻ giải thích kết quả.
- `styles/writing-result.css`: Textarea viết chữ Hán, bộ đếm ký tự, màn hình kết quả thi và biểu đồ kỹ năng.
- `styles/mistakes-progress.css`: Thẻ câu hỏi cần ôn tập, chuỗi streak 7 ngày và lưới tiến độ học tập.
- `styles/index.css`: File bundle CSS duy nhất import toàn bộ các modules trên.

### 3.2. Types & Data Contracts (`types/`)
- `types/viewmodels.ts`: Hợp đồng ViewModel thuần túy (`TodayViewModel`, `TaskViewModel`, `ReadinessViewModel`, `LevelHubViewModel`, `VocabItemViewModel`, `VocabBrowserViewModel`, `FlashcardViewModel`, `GrammarLessonViewModel`, `GrammarCatalogViewModel`, v.v.).
- `types/callbacks.ts`: Hợp đồng Callbacks tương tác (`TodayCallbacks`, `LevelHubCallbacks`, `VocabBrowserCallbacks`, `FlashcardCallbacks`, `GrammarCallbacks`).

### 3.3. Primitives (`primitives/`)
- `Button/Button.tsx`: Nút bấm đa năng min 44px, hỗ trợ leftIcon/rightIcon, loading spinner, WCAG focus.
- `Card/Card.tsx`: Thẻ nội dung với hiệu ứng interactive hover 200ms.
- `Badge/Badge.tsx`: Huy hiệu màu nhỏ phân loại kỹ năng.
- `StatusChip/StatusChip.tsx`: Chip hiển thị trạng thái biên tập dữ liệu.
- `ProgressBar/ProgressBar.tsx`: Thanh tiến độ chuẩn ARIA accessibility.
- `AudioStatusIndicator/AudioStatusIndicator.tsx`: Chỉ báo âm thanh trung thực.
- `Typography/`: `HanziText.tsx` và `PinyinText.tsx`.
- `EmptyState/EmptyState.tsx`: Khung thông báo trạng thái rỗng có CTA.

### 3.4. Components (`components/`)
- **Today & Level Hub**: `TodayHero`, `TaskCard`, `MetricCard`, `WeaknessSpotlight`, `LevelHubCard`.
- **Vocabulary**: `VocabCard`, `VocabDetailModal`, `FlashcardView`, `VocabBrowserView`.
- **Grammar**: `GrammarExampleBlock`, `GrammarComparison`, `GrammarLessonCard`, `GrammarLessonReader`, `GrammarCatalogView`.
- **Practice & Questions**: `PracticePartCard`, `PracticeSkillSection`, `PracticeHubView`, `QuestionHeader`, `QuestionProgress`, `MultipleChoice`, `ImageChoice`, `TrueFalse`, `MatchingQuestion`, `PracticeFeedback`, `QuestionPresentationView`.
- **Writing**: `WritingWorkspace`.
- **Result**: `ResultSummaryCard`, `ResultSkillBreakdown`, `ResultQuestionReview`, `ResultPageView`.
- **Mistakes & Progress**: `MistakeCard`, `MistakeReviewView`, `StreakCard`, `ProgressAnalyticsCard`.

### 3.5. Top-Level Views (`views/`)
- `views/TodayWorkspaceView.tsx`
- `views/LevelHubView.tsx`
- `views/VocabularyWorkspaceView.tsx`
- `views/GrammarWorkspaceView.tsx`
- `views/PracticeWorkspaceView.tsx`
- `views/WritingWorkspaceView.tsx`
- `views/ResultWorkspaceView.tsx`
- `views/MistakeReviewWorkspaceView.tsx`
- `views/ProgressWorkspaceView.tsx`

### 3.6. Static Fixtures (`__fixtures__/`)
- `todayFixtures.ts`: Mock dữ liệu bàn học hôm nay.
- `levelFixtures.ts`: Mock dữ liệu các cấp độ HSK 1–9.
- `vocabFixtures.ts`: Mock dữ liệu từ vựng HSK 1 và HSK 2.
- `grammarFixtures.ts`: Mock bài ngữ pháp và so sánh 不 vs 没.
- `practiceFixtures.ts`: Mock Practice Hub cho HSK 1 và HSK 2.
- `questionFixtures.ts`: Mock câu hỏi Trắc nghiệm, Đúng/Sai, Matching và Feedback.
- `writingFixtures.ts`: Mock đề bài tự luận viết chữ Hán.
- `resultFixtures.ts`: Mock kết quả thi 40 câu với đầy đủ phân tích.
- `mistakeFixtures.ts`: Mock sổ tay câu hỏi cần ôn tập SRS.
- `progressFixtures.ts`: Mock chuỗi streak 5 ngày và thống kê học tập.

---

## 4. HƯỚNG DẪN CHI TIẾT DÀNH CHO CODEX ĐỂ TÍCH HỢP

Codex là chủ sở hữu tầng Adapter, Service, Router và DB. Dưới đây là các bước tích hợp khuyến nghị:

### Bước 1: Nối ViewModel Mapper
Trong thư mục `src/adapters/ui-v13/`:
- Map các service hiện có (`studyPlanService`, `userProgressService`, `hskDataService`, `examScoring`) sang các ViewModel DTO được định nghĩa trong `src/contracts/ui-v13.ts` và `src/ui-v13/types/viewmodels.ts`.
- **Lưu ý HSK 2**: Map `audioStatus: 'UNAVAILABLE'` và `isFullMockReady: false` đối với các nội dung chưa có tệp ghi âm thật.

### Bước 2: Nối Callbacks vào Router & Action Dispatcher
Truyền các callback điều hướng của Codex vào component:
- `onStartPrimaryAction`: Điều hướng vào bài học đề xuất tiếp theo.
- `onStartTask(taskId, targetRoute, skill)`: Chuyển tới route bài tập tương ứng.
- `onChoose(optionId)`: Ghi nhận câu trả lời người dùng trong phiên làm bài.
- `onInput(value)`, `onCompositionStart`, `onCompositionEnd`: Ghi nhận bài viết chữ Hán mà không làm gián đoạn bộ gõ IME.
- `onSave()`: Kích hoạt lưu nháp qua cơ chế lưu hiện có của Codex.

### Bước 3: Mount Views
Import trực tiếp các views từ `src/ui-v13`:
```tsx
import { 
  TodayWorkspaceView,
  LevelHubView,
  VocabularyWorkspaceView,
  GrammarWorkspaceView,
  PracticeWorkspaceView,
  WritingWorkspaceView,
  ResultWorkspaceView,
  MistakeReviewWorkspaceView,
  ProgressWorkspaceView 
} from './ui-v13';
```
Và render bên trong container có class `.hsk-ui-v13` sau khi dữ liệu `ViewState` chuyển sang trạng thái `'ready'`.

---

## 5. TÀI LIỆU KÈM THEO
Toàn bộ tài liệu bàn giao chi tiết đã sẵn sàng trong `docs/collab/v13/gemini/`:
- `UI_V13_DESIGN_SYSTEM.md`: Đặc tả hệ thống design tokens, màu sắc, typography, spacing, elevation.
- `UI_V13_COMPONENT_INVENTORY.md`: Danh mục đầy đủ 30+ presentation components.
- `UI_V13_SCREEN_MAP.md`: Bản đồ luồng trải nghiệm người dùng qua các màn hình.
- `UI_V13_RESPONSIVE_GUIDE.md`: Hướng dẫn kiểm thử giao diện trên 8 mốc kích thước màn hình (320px - 1440px).
- `UI_V13_INTEGRATION_NOTES.md`: Ghi chú kỹ thuật chi tiết về mapping dữ liệu và kết nối state.
- `CONTRACT_REQUESTS.md`: Các đề xuất mở rộng hợp đồng dữ liệu gửi Codex.
- `GEMINI_UI_HANDOFF.md`: Báo cáo bàn giao chính thức này.

**Gemini Flash hoàn tất nhiệm vụ Presentation Layer V13. Bàn giao lại cho Codex thực hiện tích hợp!**
