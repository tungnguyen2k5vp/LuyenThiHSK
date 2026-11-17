# HSK UI V14 — VISUAL COMPARISON & SCREENSHOT MAPPING

This document maps all 11 user-provided reference screenshots from Migii HSK to their exact HSK UI V14 implementations, highlighting how V14 matches the ergonomic layout and visual clarity while upholding an original, brand-distinct aesthetic.

---

## 1. Exam Catalog (`ExamCatalogView.tsx`)
- **Reference Screenshot**: Migii HSK 1 Exam Catalog with level selector, category tabs ("Đề mô phỏng", "Đề kỹ năng"), and 4-column test cards.
- **V14 Implementation**:
  - `v14-catalog-header-bar` with interactive Level Dropdown (HSK 1 to 7-9).
  - Modern category tabs with rounded count badges (`0/101`, `204`, etc.).
  - Search input with clear button and status filter dropdown.
  - Responsive 4-column card grid with visual cover header, time/question metadata, and clear status pill.
- **Brand Independence**: Uses custom teal and soft mint gradients instead of Migii red/green accents; zero copied logos.

---

## 2. Exam Intro Screen (`ExamIntroCard.tsx`)
- **Reference Screenshot**: Centered intro card with duration, passing score, Nghe & Đọc count split box, Practice vs Exam toggle, and "Bắt đầu làm bài" button.
- **V14 Implementation**:
  - Card with smooth elevation and top back button.
  - Split 2-column skills box showing exact question count per skill.
  - Accessible toggle switch dynamically updating the notice callout (Practice: allows pause & solutions; Exam: strict timer).
  - High-visibility primary action button.

---

## 3. Listening Instructions Modal (`ListeningInstructionModal.tsx`)
- **Reference Screenshot**: Modal with study mascot, table of 4 listening parts (Đúng hay Sai, Chọn ảnh phù hợp, Ghép ảnh với Audio, Hội thoại ngắn), and equipment check CTA.
- **V14 Implementation**:
  - Clean centered modal with friendly audio icon illustration.
  - Formatted 4-row table with clear borders and teal headers.
  - Audio equipment reminder note.
  - Two action buttons: "🔊 Kiểm tra âm thanh" and "Mình hiểu rồi".

---

## 4. 3-Column Exam Room Shell (`ExamRoomShell.tsx`)
- **Reference Screenshot**: Sticky top bar, left question navigator, center question area, right countdown clock and "Nộp bài" button.
- **V14 Implementation**:
  - Sticky header with back button, brand tag, exam title, and mode badge.
  - Left column: `ExamNavigator` with skill tabs and numbered circular/square bubbles.
  - Right column: `ExamTimerCard` with dual-segment digital countdown clock (`DigitalTimer`).
  - Mobile responsive drawer ensuring parity on mobile and tablet screens.

---

## 5. Question Type: Listening Part 1 (`ListeningTrueFalse.tsx`)
- **Reference Screenshot**: Photo at top, audio player, side-by-side cards for "Đúng" and "Sai".
- **V14 Implementation**:
  - Centered photo with smooth rounded border.
  - `AudioPlayerBar` with play/pause, time elapsed/duration, scrubber, and volume slider.
  - Side-by-side cards with circular check (`✓`) and cross (`✕`) indicators.

---

## 6. Question Type: Listening Part 2 (`ListeningImageChoice.tsx`)
- **Reference Screenshot**: 3 balanced photos side-by-side labeled A, B, C.
- **V14 Implementation**:
  - 3-column photo grid.
  - High-contrast letter pill badges in the top-left corner.
  - Hover elevation and selected green/teal border ring.

---

## 7. Question Type: Listening Part 3 (`ListeningMatching.tsx`)
- **Reference Screenshot**: 5 shared photos on top labeled A..E, 5 sub-questions below with mini audio players and A..E button selectors.
- **V14 Implementation**:
  - 5-column shared image row.
  - 5 sub-question rows with `MiniAudioPlayer` and A..E choice buttons.
  - Full support for review mode: green for correct, red for incorrect.

---

## 8. Question Type: Listening Part 4 (`ListeningDialogue.tsx`)
- **Reference Screenshot** (`hsk.migii.net/vi/hsk 1/mock test/359`): Audio player on top, vertical cards with Pinyin on top and Hanzi below, selected green border, explanation accordion with 3 tabs (Giải thích, Phụ đề, Dịch phụ đề).
- **V14 Implementation**:
  - Full audio player bar with time display.
  - Vertical cards showing Pinyin over Hanzi.
  - Selected card highlighted with primary teal border and soft mint background.
  - `ExplanationAccordion` with 4 tabs including vocabulary breakdown.

---

## 9. Result Screen (`ResultPageViewV14.tsx`)
- **Reference Screenshot**: Large accuracy score, 4-stat counters (Đúng, Chưa đúng, Bỏ trống, Chờ chấm), skill progress bars, and question review list.
- **V14 Implementation**:
  - Prominent hero score card with accuracy percentage and Pass/Fail badge.
  - 4 colored counter cards.
  - Progress bars for Listening and Reading.
  - Expandable review cards with integrated `ExplanationAccordion`.
