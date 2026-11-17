# HSK UI V13 — COMPONENT INVENTORY (TOÀN DIỆN BATCH 1 ĐẾN 6)
*Gemini Flash — Senior Product Designer & UI/UX Engineer*

Tài liệu này ghi nhận toàn bộ kho thư viện presentation components của HSK UI V13 được xây dựng độc lập trong `src/ui-v13/`. 
Tất cả các components là **Pure Presentation**: nhận typed props/ViewModels, phát ra Callbacks, không gọi API, không đọc storage, không chứa logic chấm điểm, không can thiệp database của Codex.

---

## 1. TẦNG NGUYÊN TỬ CƠ BẢN (PRIMITIVES)

| Tên Component | Đường dẫn file | Vai trò & Đặc điểm |
| :--- | :--- | :--- |
| `Button` | `primitives/Button/Button.tsx` | Nút bấm chuẩn tap target ≥44px; các biến thể `primary`, `secondary`, `outline`, `ghost`; hỗ trợ `leftIcon`, `rightIcon`, `isLoading`, keyboard focus WCAG AA. |
| `Card` | `primitives/Card/Card.tsx` | Khung thẻ bo góc 14px, đổ bóng tinh tế, biến thể `interactive` có hiệu ứng hover 200ms. |
| `Badge` | `primitives/Badge/Badge.tsx` | Huy hiệu nhỏ phân loại kỹ năng, trạng thái (`brand`, `amber`, `emerald`, `neutral`). |
| `StatusChip` | `primitives/StatusChip/StatusChip.tsx` | Thể hiện trung thực trạng thái kiểm định dữ liệu (`PREVIEW`, `NEEDS_REVIEW`, `DRAFT`, `PUBLISHED`, `VERIFIED`). |
| `ProgressBar` | `primitives/ProgressBar/ProgressBar.tsx` | Thanh tiến độ chuẩn ARIA (`role="progressbar"`, `aria-valuenow`). |
| `AudioStatusIndicator` | `primitives/AudioStatusIndicator/AudioStatusIndicator.tsx` | Thể hiện minh bạch trạng thái âm thanh (`AVAILABLE`, `UNAVAILABLE`, `RECORDING_DRAFT`, `PREVIEW_ONLY`), ngăn ngừa hiểu nhầm ở HSK 2. |
| `HanziText` & `PinyinText`| `primitives/Typography/` | Định dạng chuẩn chữ Hán lớn (Simplified Chinese) và Pinyin chuẩn dấu thanh điệu. |
| `EmptyState` | `primitives/EmptyState/EmptyState.tsx` | Màn hình trạng thái rỗng thân thiện, có thông điệp hướng dẫn và nút thao tác xử lý. |

---

## 2. TODAY WORKSPACE & LEVEL HUB (BATCH 2)

| Tên Component | Đường dẫn file | Vai trò & Đặc điểm |
| :--- | :--- | :--- |
| `TodayHero` | `components/TodayHero/TodayHero.tsx` | Hero banner định hướng người học trong 5 giây (cấp độ đang học, số ngày còn lại, nút CTA nổi bật "Tiếp tục học hôm nay", bảng tóm tắt độ sẵn sàng). |
| `TaskCard` | `components/TaskCard/TaskCard.tsx` | Thẻ nhiệm vụ hàng ngày (từ vựng, ngữ pháp, đọc hiểu, viết, nghe), hỗ trợ trạng thái đã xong, bỏ qua, hoặc bị khóa (khi audio chưa sẵn sàng) kèm lý do. |
| `MetricCard` | `components/MetricCard/MetricCard.tsx` | Thẻ thống kê nhịp học (streak, độ chính xác, từ đã thuộc, thời gian học). |
| `WeaknessSpotlight` | `components/WeaknessSpotlight/WeaknessSpotlight.tsx` | Tiêu điểm 3 điểm yếu cần cải thiện kèm tỷ lệ nắm vững. |
| `LevelHubCard` | `components/LevelHubCard/LevelHubCard.tsx` | Thẻ hiển thị HSK 1–9 với số lượng từ vựng, điểm ngữ pháp, thời gian thi dự kiến, trạng thái audio và nút thao tác. |
| `TodayWorkspaceView` | `views/TodayWorkspaceView.tsx` | Màn hình Today hoàn chỉnh kết hợp Hero, Tasks, Metrics, Điểm yếu và Banner lưu ý biên tập. |
| `LevelHubView` | `views/LevelHubView.tsx` | Màn hình chuyển đổi HSK 2.0 / 3.0 với lưới thẻ cấp độ trực quan. |

---

## 3. VOCABULARY WORKSPACE (BATCH 3)

| Tên Component | Đường dẫn file | Vai trò & Đặc điểm |
| :--- | :--- | :--- |
| `VocabCard` | `components/vocab/VocabCard.tsx` | Thẻ từ vựng gọn gàng với chữ Hán cỡ lớn (32px), Pinyin rõ ràng, nghĩa tiếng Việt nổi bật, nhãn từ loại nhẹ, nút phát âm (hoặc chỉ báo âm thanh chưa có), nút đánh dấu yêu thích và thuộc từ. |
| `VocabDetailModal` | `components/vocab/VocabDetailModal.tsx` | Cửa sổ chi tiết từ vựng hỗ trợ từ có nhiều nghĩa (senses), bộ thủ, số nét, danh sách câu ví dụ Trung - Pinyin - Việt. Hỗ trợ phím Escape, click backdrop, và hộp siêu dữ liệu nguồn biên tập. |
| `FlashcardView` | `components/vocab/FlashcardView.tsx` | Thẻ học lật 3D (perspective: 1200px) chân thực, mặt trước gồm Chữ Hán + Pinyin + Audio, mặt sau gồm Từ loại + Nghĩa Việt + Ví dụ. Hỗ trợ phím tắt Space (lật), Mũi tên Trái/Phải (chuyển thẻ), nút "Cần ôn lại" và "Đã thuộc". |
| `VocabBrowserView` | `components/vocab/VocabBrowserView.tsx` | Giao diện tra cứu từ vựng với thanh tìm kiếm tức thì, 4 bộ lọc (Tất cả, Chưa thuộc, Cần ôn, Yêu thích), thanh tiến độ tích lũy, lưới thẻ từ và modal xem chi tiết. |
| `VocabularyWorkspaceView` | `views/VocabularyWorkspaceView.tsx` | View tổng hợp hỗ trợ chuyển đổi mượt mà giữa chế độ Danh mục (Browser) và chế độ Luyện Flashcard. |

---

## 4. GRAMMAR WORKSPACE (BATCH 3)

| Tên Component | Đường dẫn file | Vai trò & Đặc điểm |
| :--- | :--- | :--- |
| `GrammarExampleBlock` | `components/grammar/GrammarExampleBlock.tsx` | Khung hiển thị câu ví dụ với chữ Hán, Pinyin, bản dịch tiếng Việt và ghi chú ngữ cảnh nổi bật. |
| `GrammarComparison` | `components/grammar/GrammarComparison.tsx` | Bảng so sánh trực quan hai cấu trúc dễ gây nhầm lẫn (ví dụ: 不是 vs 没有), phân tích mẫu câu, cách dùng và điểm mấu chốt. |
| `GrammarLessonCard` | `components/grammar/GrammarLessonCard.tsx` | Thẻ tóm tắt bài ngữ pháp với mã bài (HSK1-G01), công thức cấu trúc (`S + 是 + O`), nhãn mức độ thành thạo và số câu bài tập thực hành. |
| `GrammarLessonReader` | `components/grammar/GrammarLessonReader.tsx` | Màn hình đọc bài học ngữ pháp tối ưu hóa đọc tự nhiên trên di động (line-height 1.7), công thức đóng khung, ví dụ minh họa, khối so sánh và CTA luyện tập ở cuối bài. |
| `GrammarCatalogView` | `components/grammar/GrammarCatalogView.tsx` | Danh mục toàn bộ điểm ngữ pháp kèm thanh tìm kiếm, chỉ báo tiến độ thành thạo và chế độ mở bài đọc liền mạch. |
| `GrammarWorkspaceView` | `views/GrammarWorkspaceView.tsx` | Container cấp cao bao bọc không gian ngữ pháp HSK. |

---

## 5. PRACTICE HUB & QUESTION PRESENTATION (BATCH 4)

| Tên Component | Đường dẫn file | Vai trò & Đặc điểm |
| :--- | :--- | :--- |
| `PracticePartCard` | `components/practice/PracticePartCard.tsx` | Thẻ phần thi luyện tập (Phần 1, Phần 2...) hiển thị số câu khả dụng thật, tiến độ hoàn thành, cảnh báo thiếu audio và CTA bắt đầu. |
| `PracticeSkillSection` | `components/practice/PracticeSkillSection.tsx` | Phân nhóm theo 3 kỹ năng cốt lõi: Nghe hiểu (Listening), Đọc hiểu (Reading), Viết (Writing) kèm thông báo hiện trạng dữ liệu. |
| `PracticeHubView` | `components/practice/PracticeHubView.tsx` | Trang trung tâm luyện tập kỹ năng kèm thẻ trạng thái kiểm định Mock Test nội bộ (cảnh báo trung thực khi chưa đủ điều kiện thi thử). |
| `QuestionHeader` | `components/question/QuestionHeader.tsx` | Đầu trang câu hỏi hiển thị số câu, kĩ năng, nút gắn cờ (flag) và nút nghe audio (chuyển tiếp callback, không tự nhúng audio riêng). |
| `QuestionProgress` | `components/question/QuestionProgress.tsx` | Thanh tiến độ làm bài và lưới các nút bấm chuyển nhanh giữa các câu hỏi. |
| `MultipleChoice` | `components/question/MultipleChoice.tsx` | Lựa chọn trắc nghiệm A, B, C, D chuẩn ARIA radiogroup, hỗ trợ bàn phím số/chữ cái. |
| `ImageChoice` | `components/question/ImageChoice.tsx` | Chọn đáp án dạng tranh/ảnh, hiển thị trạng thái loading, lỗi và nút thử lại ảnh. |
| `TrueFalse` | `components/question/TrueFalse.tsx` | Giao diện chọn Đúng / Sai (✓ / ✕) với phản hồi màu sắc trực quan, tối ưu cho bài phán đoán. |
| `MatchingQuestion` | `components/question/MatchingQuestion.tsx` | Giao diện nối câu / ghép cặp đáp án từ ngân hàng từ khóa một cách rõ ràng. |
| `PracticeFeedback` | `components/question/PracticeFeedback.tsx` | Khung hiển thị kết quả kiểm tra đáp án: 正确 / 错误 / Chờ đánh giá, giải thích chi tiết, đáp án đúng và liên kết ngữ pháp/từ vựng liên quan. |
| `QuestionPresentationView` | `components/question/QuestionPresentationView.tsx` | Trình hiển thị câu hỏi tổng thể nhận `ViewState<QuestionVM>`, tự động phân phối giao diện tương tác phù hợp. |
| `PracticeWorkspaceView` | `views/PracticeWorkspaceView.tsx` | Điều phối chuyển đổi mượt mà giữa danh mục phần thi và giao diện làm bài tập. |

---

## 6. WRITING WORKSPACE & RESULT PAGE (BATCH 5)

| Tên Component | Đường dẫn file | Vai trò & Đặc điểm |
| :--- | :--- | :--- |
| `WritingWorkspace` | `components/writing/WritingWorkspace.tsx` | Không gian làm bài viết tự luận chữ Hán: hiển thị đề bài, bộ đếm số chữ Hán và tổng ký tự, chỉ báo trạng thái lưu nháp (`saving`, `saved`, `dirty`), chuyển tiếp sự kiện IME composition (`onCompositionStart`, `onCompositionEnd`), và biểu ngữ giải thích "Chưa chấm · không tính là câu sai". |
| `WritingWorkspaceView` | `views/WritingWorkspaceView.tsx` | Container cấp cao của màn làm bài viết. |
| `ResultSummaryCard` | `components/result/ResultSummaryCard.tsx` | Thẻ tóm tắt kết quả bài thi: vòng tròn tỷ lệ chính xác, thời gian hoàn thành, lưới 4 chỉ số (Đúng, Chưa đúng, Chưa làm, Chờ chấm). |
| `ResultSkillBreakdown` | `components/result/ResultSkillBreakdown.tsx` | Bảng thanh tiến độ phân tích chi tiết kết quả theo từng kỹ năng Nghe, Đọc, Viết. |
| `ResultQuestionReview` | `components/result/ResultQuestionReview.tsx` | Danh sách câu hỏi kèm bộ lọc (Tất cả, Câu sai, Chờ chấm) và mở rộng xem giải thích chi tiết. |
| `ResultPageView` | `components/result/ResultPageView.tsx` | Màn hình kết quả hoàn chỉnh tuân thủ đúng thứ tự thông tin: Kết quả chính → Điểm yếu & Cảnh báo → Phân tích kỹ năng → Giải thích từng câu → Bước học tiếp theo. |
| `ResultWorkspaceView` | `views/ResultWorkspaceView.tsx` | View cấp cao bao bọc màn hình kết quả thi. |

---

## 7. MISTAKE REVIEW & PROGRESS WORKSPACE (BATCH 6)

| Tên Component | Đường dẫn file | Vai trò & Đặc điểm |
| :--- | :--- | :--- |
| `MistakeCard` | `components/mistakes/MistakeCard.tsx` | Thẻ câu hỏi cần ôn tập kèm lý do (Làm sai, Gắn cờ, Tự xem lại, Bỏ trống), hạn ôn tập SRS, thẻ ngữ pháp/từ vựng liên quan và nút luyện lại. |
| `MistakeReviewView` | `components/mistakes/MistakeReviewView.tsx` | Không gian ôn tập câu sai với các tab lọc, nút ôn nhanh các câu đến hạn và màn hình trạng thái rỗng khi đã hoàn thành ôn tập. |
| `MistakeReviewWorkspaceView` | `views/MistakeReviewWorkspaceView.tsx` | View cấp cao bao bọc sổ tay câu sai. |
| `StreakCard` | `components/progress/StreakCard.tsx` | Thẻ chuỗi ngày học liên tục (streak) kèm hàng 7 chấm tròn đại diện các ngày trong tuần. |
| `ProgressAnalyticsCard` | `components/progress/ProgressAnalyticsCard.tsx` | Lưới các chỉ số tổng hợp: Từ vựng đã thuộc, Ngữ pháp nắm vững, Số bài luyện hoàn thành và Tổng thời gian tích lũy. |
| `ProgressWorkspaceView` | `views/ProgressWorkspaceView.tsx` | Màn hình tiến độ và thói quen học tập tổng thể. |
