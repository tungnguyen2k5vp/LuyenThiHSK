# HSK UI V14 — COMPONENT INVENTORY

| Component | Path | Category | Purpose | Props Interface |
| :--- | :--- | :--- | :--- | :--- |
| **Button** | `src/ui-v14/primitives/Button/Button.tsx` | Primitive | Accessible button with variants, sizes, and fullWidth support | `ButtonProps` |
| **Card** | `src/ui-v14/primitives/Card/Card.tsx` | Primitive | Surface wrapper with interactive hover elevation | `CardProps` |
| **Badge** | `src/ui-v14/primitives/Badge/Badge.tsx` | Primitive | Status and skill indicator pill | `BadgeProps` |
| **DigitalTimer** | `src/ui-v14/primitives/DigitalTimer/DigitalTimer.tsx` | Primitive | Dual-segment digital countdown clock | `DigitalTimerProps` |
| **ToggleSwitch** | `src/ui-v14/primitives/ToggleSwitch/ToggleSwitch.tsx` | Primitive | Accessible mode toggle switch | `ToggleSwitchProps` |
| **AudioPlayerBar** | `src/ui-v14/primitives/AudioPlayerBar/AudioPlayerBar.tsx` | Primitive | Main audio controller with scrubber & volume | `AudioPlayerBarProps` |
| **MiniAudioPlayer** | `src/ui-v14/primitives/MiniAudioPlayer/MiniAudioPlayer.tsx` | Primitive | Compact audio player for sub-questions | `MiniAudioPlayerProps` |
| **EmptyState** | `src/ui-v14/primitives/EmptyState/EmptyState.tsx` | Primitive | Empty search / filter placeholder | `EmptyStateProps` |
| **ExamCatalogCard** | `src/ui-v14/components/catalog/ExamCatalogCard.tsx` | Feature | Individual exam card in catalog | `ExamCatalogCardProps` |
| **ExamCatalogView** | `src/ui-v14/components/catalog/ExamCatalogView.tsx` | Feature | Catalog header, level dropdown, tabs, search, and grid | `ExamCatalogViewProps` |
| **ExamIntroCard** | `src/ui-v14/components/intro/ExamIntroCard.tsx` | Feature | Pre-exam overview, skills breakdown, mode switch, start CTA | `ExamIntroCardProps` |
| **ListeningInstructionModal** | `src/ui-v14/components/intro/ListeningInstructionModal.tsx` | Feature | Modal showing 4-part table and sound test | `ListeningInstructionModalProps` |
| **ExamNavigator** | `src/ui-v14/components/exam/ExamNavigator.tsx` | Feature | Left column question navigator with skill tabs & bubbles | `ExamNavigatorProps` |
| **ExamTimerCard** | `src/ui-v14/components/exam/ExamTimerCard.tsx` | Feature | Right column digital timer & submit button | `ExamTimerCardProps` |
| **ExamRoomShell** | `src/ui-v14/components/exam/ExamRoomShell.tsx` | Feature | 3-column desktop layout & responsive mobile drawer shell | `ExamRoomShellProps` |
| **ListeningTrueFalse** | `src/ui-v14/components/question/ListeningTrueFalse.tsx` | Feature | Listening Part 1: photo, audio bar, True/False side-by-side cards | `ListeningTrueFalseProps` |
| **ListeningImageChoice** | `src/ui-v14/components/question/ListeningImageChoice.tsx` | Feature | Listening Part 2: 3-image choice cards | `ListeningImageChoiceProps` |
| **ListeningMatching** | `src/ui-v14/components/question/ListeningMatching.tsx` | Feature | Listening Part 3: 5 shared images + 5 sub-questions with audio | `ListeningMatchingProps` |
| **ListeningDialogue** | `src/ui-v14/components/question/ListeningDialogue.tsx` | Feature | Listening Part 4: audio bar + Pinyin/Hanzi vertical options | `ListeningDialogueProps` |
| **ReadingPassageQuestion** | `src/ui-v14/components/question/ReadingPassageQuestion.tsx` | Feature | Reading question with passage comprehension and options | `ReadingPassageQuestionProps` |
| **WritingWorkspaceV14** | `src/ui-v14/components/question/WritingWorkspaceV14.tsx` | Feature | Writing question with word reordering or essay textarea | `WritingWorkspaceProps` |
| **ExplanationAccordion** | `src/ui-v14/components/question/ExplanationAccordion.tsx` | Feature | 4-tab explanation accordion (Giải thích, Phụ đề, Dịch, Từ vựng) | `ExplanationAccordionProps` |
| **ResultPageViewV14** | `src/ui-v14/components/result/ResultPageViewV14.tsx` | Feature | Score hero, 4-stat breakdown, skill bars, question review | `ResultPageViewProps` |
| **ExamCatalogWorkspaceView** | `src/ui-v14/views/ExamCatalogWorkspaceView.tsx` | Workspace | Top-level view for exam catalog | `ExamCatalogWorkspaceViewProps` |
| **ExamIntroWorkspaceView** | `src/ui-v14/views/ExamIntroWorkspaceView.tsx` | Workspace | Top-level view for exam intro & instructions | `ExamIntroWorkspaceViewProps` |
| **ExamRoomWorkspaceView** | `src/ui-v14/views/ExamRoomWorkspaceView.tsx` | Workspace | Top-level view orchestrator for 3-column exam room | `ExamRoomWorkspaceViewProps` |
| **ResultWorkspaceViewV14** | `src/ui-v14/views/ResultWorkspaceViewV14.tsx` | Workspace | Top-level view for exam result page | `ResultWorkspaceViewV14Props` |
