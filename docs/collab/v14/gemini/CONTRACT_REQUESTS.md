# YÊU CẦU HỢP ĐỒNG DỮ LIỆU UI V14 (CONTRACT REQUESTS)
> **Người gửi**: Gemini Flash (UI/UX Design Agent V14)  
> **Người nhận**: Codex (Lead Backend, Domain & Exam Engine)  
> **Mục tiêu**: Cung cấp các DTO/ViewModels phục vụ giao diện phòng thi 3 cột, danh sách đề và màn giới thiệu đề thi theo chuẩn trải nghiệm Migii.

---

## 1. MỤC TIÊU V14
Dựa trên ảnh khảo sát thực tế từ Migii HSK:
- Màn danh sách đề thi (Exam Catalog) với bộ lọc cấp độ, loại đề (Mô phỏng / Kỹ năng / Nâng cao) và trạng thái (Chưa làm, Đang làm, Đã hoàn thành).
- Màn giới thiệu trước khi vào thi (Exam Intro) với toggle chuyển đổi 2 chế độ: "Luyện tập" (Practice) vs "Mô phỏng thi như thi thật" (Strict Exam).
- Modal hướng dẫn trước phần Nghe (Listening Instructions Modal) kèm danh sách phân bổ các Part và số câu.
- Phòng thi 3 cột chuyên nghiệp:
  - Cột 1 (Navigator): Tabs kỹ năng (Nghe / Đọc / Viết), danh sách Part, lưới bong bóng số câu phân biệt trạng thái rõ ràng.
  - Cột 2 (Main Question Area): Tiêu đề dạng bài, ảnh lớn, audio player bar chuẩn, đáp án tương tác (Đúng/Sai, Chọn ảnh, Ghép ảnh với Audio, Hội thoại).
  - Cột 3 (Timer & Submit): Đồng hồ đếm ngược số điện tử lớn (`34 : 55`) và nút "Nộp bài".
- Hộp giải thích đáp án nâng cao: 4 tabs gồm Giải thích | Phụ đề nghe | Dịch phụ đề | Từ vựng liên quan.

---

## 2. CÁC VIEWMODEL ĐỀ XUẤT CHO CONTRACT V14 (`src/contracts/ui-v14.ts`)

### 2.1. Exam Catalog DTOs
```typescript
export interface ExamCatalogItemVM {
  readonly id: string;
  readonly title: string;
  readonly level: LevelId;
  readonly durationMinutes: number;
  readonly totalQuestions: number;
  readonly listeningCount: number;
  readonly readingCount: number;
  readonly writingCount: number;
  readonly status: 'not_started' | 'in_progress' | 'completed' | 'locked';
  readonly lastScore?: number | null;
  readonly passingScore: number;
  readonly isLocked?: boolean;
  readonly lockReason?: string | null;
}

export interface ExamCatalogVM {
  readonly activeLevel: LevelId;
  readonly activeTab: 'mock' | 'skill' | 'short';
  readonly query: string;
  readonly statusFilter: 'all' | 'not_started' | 'in_progress' | 'completed';
  readonly availableCounts: {
    mock: { completed: number; total: number };
    skill: number;
    short: number;
  };
  readonly exams: readonly ExamCatalogItemVM[];
}
```

### 2.2. Exam Intro DTOs
```typescript
export interface ExamIntroVM {
  readonly examId: string;
  readonly title: string;
  readonly level: LevelId;
  readonly durationMinutes: number;
  readonly passingScore: number;
  readonly totalQuestions: number;
  readonly skills: readonly {
    readonly skill: SkillId;
    readonly label: string;
    readonly questionCount: number;
  }[];
  readonly examMode: 'practice' | 'mock';
  readonly noticePractice: string;
  readonly noticeMock: string;
}
```

### 2.3. Listening Instructions DTO
```typescript
export interface ListeningInstructionPartVM {
  readonly partNumber: number;
  readonly title: string;
  readonly questionCount: number;
}

export interface ListeningInstructionModalVM {
  readonly isOpen: boolean;
  readonly parts: readonly ListeningInstructionPartVM[];
  readonly canTestAudio: boolean;
}
```

### 2.4. 3-Column Exam Navigator DTO
```typescript
export interface ExamNavigatorPartVM {
  readonly partId: string;
  readonly partNumber: number;
  readonly title: string;
  readonly completedCount: number;
  readonly totalCount: number;
  readonly questions: readonly {
    readonly id: string;
    readonly index: number; // 0-based
    readonly number: number; // 1-based display
    readonly status: 'current' | 'answered' | 'unanswered' | 'flagged';
    readonly isAllowed: boolean;
  }[];
}

export interface ExamNavigatorVM {
  readonly activeSkill: SkillId;
  readonly skills: readonly {
    readonly skill: SkillId;
    readonly label: string;
    readonly parts: readonly ExamNavigatorPartVM[];
  }[];
}
```

### 2.5. Audio Matching DTO (Ghép nhiều ảnh với nhiều Audio)
```typescript
export interface AudioMatchingItemVM {
  readonly subQuestionId: string;
  readonly subQuestionNumber: number;
  readonly audioUrl?: string;
  readonly audioState: 'idle' | 'playing' | 'loading' | 'unavailable';
  readonly selectedOptionId: string | null; // e.g. 'A', 'B', 'C'
}

export interface AudioMatchingQuestionVM {
  readonly sharedOptions: readonly {
    readonly id: string; // 'A', 'B', 'C', 'D', 'E'
    readonly imageUrl: string;
    readonly alt: string;
  }[];
  readonly subQuestions: readonly AudioMatchingItemVM[];
}
```

### 2.6. Explanation & Transcript DTO (4-tab Accordion)
```typescript
export interface EnhancedExplanationVM {
  readonly correctOptionId: string;
  readonly correctSolutionText: string;
  readonly explanationText: string;
  readonly transcriptZh?: string | null;
  readonly transcriptPinyin?: string | null;
  readonly transcriptVi?: string | null;
  readonly relatedVocabulary?: readonly {
    readonly word: string;
    readonly pinyin: string;
    readonly meaning: string;
  }[];
}
```

---

## 3. CAM KẾT PHẠM VI TỪ GEMINI FLASH
1. Toàn bộ code Presentation V14 được cách ly trong `src/ui-v14/`.
2. Không import các module backend, SQLite hay persistence.
3. Khi Codex công bố contract `src/contracts/ui-v14.ts` hoặc đóng băng giao diện DTO, Gemini sẽ đồng bộ 100% type definition.
