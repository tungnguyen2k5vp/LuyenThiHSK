# Kiểm kê toàn bộ src/ui-v14

Đã đọc/hash 44 file. Không xóa hàng loạt hoặc mount fixtures. Những component polish trực tiếp: CatalogView/Card, IntroCard, RoomShell, ReadingPassageQuestion, ExplanationAccordion; các owner/media/writing được cải thiện tại đường file hiện có. Audio primitives giữ trong source nhưng không tạo thêm player/owner ở phòng thi. Các workspace wrapper không được coi là mount chỉ vì có export.

| File | Phân loại |
| --- | --- |
| src/ui-v14/components/catalog/ExamCatalogCard.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/catalog/ExamCatalogView.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/catalog/index.ts | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/exam/ExamNavigator.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/exam/ExamRoomShell.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/exam/ExamTimerCard.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/exam/index.ts | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/intro/ExamIntroCard.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/intro/index.ts | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/intro/ListeningInstructionModal.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/question/ExplanationAccordion.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/question/index.ts | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/question/ListeningDialogue.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/question/ListeningImageChoice.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/question/ListeningMatching.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/question/ListeningTrueFalse.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/question/ReadingPassageQuestion.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/question/WritingWorkspaceV14.tsx | Component chưa mount trong luồng V15; giữ nguyên để tránh thay owner không cần thiết |
| src/ui-v14/components/result/index.ts | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/components/result/ResultPageViewV14.tsx | Tái sử dụng/mount hoặc dependency của view hiện có |
| src/ui-v14/index.ts | Hỗ trợ types/style/primitive |
| src/ui-v14/primitives/AudioPlayerBar/AudioPlayerBar.tsx | Không dùng làm audio owner trong phòng thi |
| src/ui-v14/primitives/Badge/Badge.tsx | Hỗ trợ types/style/primitive |
| src/ui-v14/primitives/Button/Button.tsx | Hỗ trợ types/style/primitive |
| src/ui-v14/primitives/Card/Card.tsx | Hỗ trợ types/style/primitive |
| src/ui-v14/primitives/DigitalTimer/DigitalTimer.tsx | Hỗ trợ types/style/primitive |
| src/ui-v14/primitives/EmptyState/EmptyState.tsx | Hỗ trợ types/style/primitive |
| src/ui-v14/primitives/index.ts | Hỗ trợ types/style/primitive |
| src/ui-v14/primitives/MiniAudioPlayer/MiniAudioPlayer.tsx | Không dùng làm audio owner trong phòng thi |
| src/ui-v14/primitives/ToggleSwitch/ToggleSwitch.tsx | Hỗ trợ types/style/primitive |
| src/ui-v14/styles/base.css | Hỗ trợ types/style/primitive |
| src/ui-v14/styles/components.css | Hỗ trợ types/style/primitive |
| src/ui-v14/styles/exam-catalog.css | Hỗ trợ types/style/primitive |
| src/ui-v14/styles/exam-room.css | Hỗ trợ types/style/primitive |
| src/ui-v14/styles/index.css | Hỗ trợ types/style/primitive |
| src/ui-v14/styles/tokens.css | Hỗ trợ types/style/primitive |
| src/ui-v14/types/callbacks.ts | Hỗ trợ types/style/primitive |
| src/ui-v14/types/viewmodels.ts | Hỗ trợ types/style/primitive |
| src/ui-v14/views/ExamCatalogWorkspaceView.tsx | Workspace wrapper chưa mount |
| src/ui-v14/views/ExamIntroWorkspaceView.tsx | Workspace wrapper chưa mount |
| src/ui-v14/views/ExamRoomWorkspaceView.tsx | Workspace wrapper chưa mount |
| src/ui-v14/views/index.ts | Workspace wrapper chưa mount |
| src/ui-v14/views/ResultWorkspaceViewV14.tsx | Workspace wrapper chưa mount |
| src/ui-v14/__fixtures__/mockData.ts | Fixture không mount |
