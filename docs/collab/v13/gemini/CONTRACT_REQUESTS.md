# UI DATA CONTRACT REQUESTS (V13)
*Gửi: Codex (Logic & Backend Owner)*  
*Từ: Gemini Flash (UI/UX Design Agent V13)*

Tài liệu này ghi nhận các yêu cầu dữ liệu chính thức từ phía UI Presentation Layer để Codex tích hợp vào `docs/collab/v13/UI_CONTRACT.md` hoặc `src/contracts/ui-v13.ts`.

---

## 1. Yêu cầu Cấu Trúc ViewModel cho Màn Hình Today

Để `TodayWorkspaceView` hoạt động hoàn toàn độc lập với business engine (SRS, ExamScoring, Readiness, Weakness), Codex cung cấp một mapper chuyển đổi `PreparationData` + `StudyData` thành `TodayViewModel`:

```typescript
export interface TodayViewModel {
  targetLevel: string;                    // Ví dụ: "HSK 2"
  currentDateFormatted: string;           // Ví dụ: "Thứ Hai, 19/10/2026"
  daysRemaining: number | null;           // null nếu chưa đặt ngày thi
  targetSyllabus: string;                 // "Syllabus 2025" hoặc "HSK 2.0 (Khung 6 cấp)"
  hasActiveTasks: boolean;
  contentStatus: ContentStatus;           // 'PREVIEW' | 'NEEDS_REVIEW' | 'DRAFT' | 'PUBLISHED'
  statusNotice?: string;
  
  nextRecommendedTask: TaskViewModel | null;
  completedTasksCount: number;
  totalEstimatedMinutes: number;
  tasks: TaskViewModel[];
  
  readiness: {
    score: number | null;                 // null nếu chưa đủ dữ liệu (chưa làm mock đã duyệt)
    isSufficientData: boolean;
    reason: string;
    approvedMocksCount: number;
    coveragePercent: number;
    consistencyPercent: number;
  };
  
  metrics: Array<{
    key: 'streak' | 'accuracy' | 'words' | 'time' | string;
    label: string;
    value: string | number;
    caption: string;
    isAccent?: boolean;
  }>;
  
  weaknesses: Array<{
    id: string;
    skill: 'listening' | 'reading' | 'writing' | 'grammar' | 'vocabulary';
    skillLabel: string;
    wrongCount: number;
    reason: string;
    masteryPercent: number;
  }>;
  
  vocabularyProgress: {
    learnedCount: number;
    totalTargetCount: number;
    percent: number;
  };
}
```

---

## 2. Yêu Cầu Cờ Khả Dụng Âm Thanh (Audio Availability Flag)

Nhằm tuân thủ nguyên tắc **không gây hiểu lầm cho người học** (hiện trạng HSK 2 có 0/40 audio khả dụng):
1. Yêu cầu trường `isAvailable: boolean` và `unavailableReason?: string` trong từng `TaskViewModel`.
2. Đối với cấp độ HSK 2 trong `LevelItemViewModel`:
   - `audioStatus: 'RECORDING_DRAFT' | 'UNAVAILABLE'`
   - `audioNotice: 'Đang hoàn thiện âm thanh (0/40 khả dụng)'`
   - `isFullMockReady: false` (không bật trạng thái sẵn sàng thi thử đầy đủ khi chưa có audio).

---

## 3. Yêu Cầu Cho Phần Thi Viết (Writing Workspace)

1. Yêu cầu cờ trạng thái chấm thi:
   - `gradingStatus: 'UNGRADED' | 'EVALUATED' | 'SELF_REVIEW'`
   - Tuyệt đối không coi các câu Writing chưa chấm là câu sai (incorrect) trong bảng kết quả.
2. Callback cập nhật draft:
   - `onUpdateDraft: (questionId: string, text: string) => void`
   - Giữ nguyên cơ chế native composition và IME của Codex.

---

## 4. Các Callbacks Cần Thiết Cho Today Workspace

Codex chỉ cần cung cấp object `TodayCallbacks`:
```typescript
export interface TodayCallbacks {
  onStartPrimaryAction: () => void;
  onStartTask: (taskId: string, targetRoute: string, skill?: string) => void;
  onSkipTask: (taskId: string) => void;
  onReviewTask: (taskId: string, targetRoute: string, skill?: string) => void;
  onOpenSettings: () => void;
  onOpenProgressDetails: () => void;
  onOpenWeaknessReview: () => void;
  onOpenVocabWorkspace: () => void;
}
```
