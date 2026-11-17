# HSK UI V14 — 3-COLUMN EXAM ROOM SPECIFICATION

## 1. Ergonomic Layout Architecture

The V14 Exam Room solves the cognitive overload of earlier versions by adopting a balanced 3-column desktop layout that mirrors real computerized testing environments:

```
+-----------------------------------------------------------------------------------------+
| [←] HSK V14                      Đề thi 1                         [🌿 Luyện tập]       |
+-----------------------------------------------------------------------------------------+
| [ LEFT NAVIGATOR ]      | [ CENTER QUESTION VIEWPORT ]          | [ TIMER & SUBMIT ]    |
| Width: 250px (sticky)   | Width: 1fr (main content)             | Width: 270px (sticky) |
|                         |                                       |                       |
| [Nghe] [Đọc] [Viết]     | Phần thi: Hội thoại ngắn              | Thời gian còn lại ⏰  |
|                         | Câu 1: Chọn đáp án đúng               | +---------+---------+ |
| Phần 1: Đúng hay Sai    |                                       | |   31    |   38    | |
| [01/05]                 | [ ▶  00:29 ━━━━━●━━━━ 00:00  🔊== ]   | +---------+---------+ |
| (01) (02) (03) (04) (05)|                                       |                       |
|                         | [A] xiǎo māo / 小猫                   | [    NỘP BÀI        ] |
| Phần 2: Chọn ảnh        | [B] Xiǎo Wáng / 小王                  +-----------------------+
| [01/05]                 | [C] xiǎo gǒu / 小狗 (Selected ✓)      |
| (01) (02) (03) (04) (05)|                                       |
|                         | 💡 Giải thích đáp án [▲]               |
| Phần 3: Ghép ảnh        | [Giải thích] [Phụ đề] [Dịch] [Từ vựng]|
| (01) (02) (03) (04) (05)| 小狗现在在桌子下面睡觉...             |
|                         |                                       |
|                         |               [Câu trước] [Câu sau >] |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Left Column: Exam Navigator (`ExamNavigator.tsx`)
- **Skill Switching**: Top tabs switch between `listening`, `reading`, and `writing`.
- **Parts Hierarchy**: Each part displays its formal name (e.g. `Phần 1: Đúng hay Sai`) and completion counter (`01 / 05`).
- **Question Bubbles**:
  - `current`: Teal fill (`#0d9488`), white text, rounded square, elevated shadow.
  - `answered`: Light mint fill (`#f0fdfa`), teal border, teal text.
  - `unanswered`: Neutral light gray (`#f1f5f9`), slate border.
  - `correct`: Emerald green fill (`#16a34a`), white text (used in post-exam review).
  - `incorrect`: Rose red fill (`#ef4444`), white text (used in post-exam review).

---

## 3. Center Column: Question Presentations

### 3.1 Listening Part 1: True / False (`ListeningTrueFalse.tsx`)
- Single centered photo container with rounded borders (`height: 240px`).
- Custom `AudioPlayerBar` directly beneath photo.
- Side-by-side cards for `✓ Đúng` and `✕ Sai` with circular check/cross indicators.

### 3.2 Listening Part 2: Image Choice (`ListeningImageChoice.tsx`)
- 3 balanced image option cards arranged side-by-side.
- Pill badge (A, B, C) in the top-left corner of each image.
- Selected image features teal outline border and highlight ring.

### 3.3 Listening Part 3: Audio Matching (`ListeningMatching.tsx`)
- Top reference row: 5 shared images labeled A, B, C, D, E.
- Bottom sub-question rows: 5 vertical questions, each featuring:
  - Sub-question label (`Câu 1:`, `Câu 2:`, etc.).
  - `MiniAudioPlayer` with play/pause and scrubber.
  - Selection pill buttons for `A`, `B`, `C`, `D`, `E`.

### 3.4 Listening Part 4: Short Dialogue (`ListeningDialogue.tsx`)
- Custom `AudioPlayerBar` at the top.
- 3 vertical choice cards with letter badge (A, B, C).
- Stacked bilingual typography: Pinyin on top line, Hanzi on bottom line.
- Selected card displays distinct teal border and mint background.

### 3.5 Reading & Writing Components
- `ReadingPassageQuestion.tsx`: Clean bilingual passage rendering with multiple-choice cards.
- `WritingWorkspaceV14.tsx`: Scrambled Hanzi word chips with interactive reordering and sentence construction area.

---

## 4. 4-Tab Explanation Accordion (`ExplanationAccordion.tsx`)
- Expandable accordion with blue lightbulb indicator and chevron toggle.
- 4 specialized study tabs:
  1. **Giải thích**: Correct answer display and rationale.
  2. **Phụ đề**: Chinese audio transcript with Pinyin and Hanzi.
  3. **Dịch phụ đề**: Natural Vietnamese translation.
  4. **Từ vựng**: Key vocabulary items with Pinyin, Vietnamese meaning, and grammar notes.

---

## 5. Right Column: Timer & Submission (`ExamTimerCard.tsx`)
- Digital dual-box countdown timer displaying minutes and seconds.
- Automatically flashes warning red when remaining time is less than 5 minutes.
- Sticky positioning ensures timer is always visible without obstructing question reading.
- Large primary "Nộp bài" button.
