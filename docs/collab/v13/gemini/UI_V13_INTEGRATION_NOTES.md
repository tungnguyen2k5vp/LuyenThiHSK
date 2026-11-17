# HSK UI V13 — INTEGRATION NOTES
*Hướng dẫn tích hợp dành cho Codex*

Tài liệu này hướng dẫn cách Codex kết nối các presentation components từ `src/ui-v13/` vào luồng ứng dụng đang chạy mà không làm thay đổi các engine logic, storage hoặc database.

---

## 1. Vị Trí Thành Phần

Toàn bộ code mới của Gemini Flash nằm hoàn toàn trong:
- **Component & Views**: `src/ui-v13/`
- **Tài liệu bàn giao**: `docs/collab/v13/gemini/`

---

## 2. Cách Tích Hợp `TodayWorkspaceView`

Trong component `src/components/preparation/TodayDashboard.tsx` (hoặc wrapper container mới do Codex tạo):

### Bước 1: Import ViewModel và Component
```tsx
import { TodayWorkspaceView } from '../../ui-v13/views/TodayWorkspaceView';
import type { TodayViewModel, TaskViewModel } from '../../ui-v13/types/viewmodels';
import type { TodayCallbacks } from '../../ui-v13/types/callbacks';
```

### Bước 2: Map Dữ liệu Hiện Có Thành `TodayViewModel`
```tsx
// Ví dụ hàm ánh xạ sạch (pure mapping function)
function mapToTodayViewModel(data: PreparationData, study: StudyData, manifest: CurriculumManifest | null): TodayViewModel {
  const day = localDay();
  const plan = data.plans[day];
  const weak = analyzeWeaknesses(study.attempts, data.mistakeReasons);
  // ... tính toán chỉ số (giữ nguyên các engine hiện tại của Codex)

  return {
    targetLevel: `HSK ${data.profile.targetLevel}`,
    currentDateFormatted: new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }),
    daysRemaining: days,
    targetSyllabus: 'Syllabus 2025 (HSK 2.0)',
    hasActiveTasks: !!plan && plan.tasks.length > 0,
    contentStatus: 'PREVIEW',
    statusNotice: 'Dữ liệu đang ở chế độ xem trước (Preview). Chưa có bản ghi nào được duyệt xuất bản (0 Published).',
    nextRecommendedTask: mappedNextTask,
    completedTasksCount: completed,
    totalEstimatedMinutes: plan?.tasks.reduce((sum, t) => sum + t.minutes, 0) ?? 0,
    tasks: mappedTasks,
    readiness: {
      score: readiness.score,
      isSufficientData: readiness.score !== null,
      reason: readiness.score === null ? 'Làm các bài đã duyệt và học đều để có ước lượng đáng tin cậy.' : readiness.reason,
      approvedMocksCount: attempts.filter(a => a.exam.mode === 'full' && !a.exam.isDemo).length,
      coveragePercent: total ? Math.round((learned / total) * 100) : 0,
      consistencyPercent: 85,
    },
    metrics: [
      { key: 'streak', label: 'Chuỗi học', value: '12 Ngày', caption: 'Duy trì học đều đặn', isAccent: true },
      { key: 'accuracy', label: 'Độ chính xác', value: accuracy === null ? '—' : `${accuracy}%`, caption: `${correctCount}/${objective} câu khách quan` },
      { key: 'words', label: 'Từ đã học', value: `${learned}/${total || '—'}`, caption: 'Từ vựng mục tiêu' },
      { key: 'time', label: 'Thời gian học', value: `${minutes} Phút`, caption: 'Thời gian bài đã nộp' },
    ],
    weaknesses: weak.filter(w => w.mastery < 100).slice(0, 3).map(w => ({
      id: w.id,
      skill: w.question.skill,
      skillLabel: w.question.skill === 'listening' ? 'Nghe hiểu' : w.question.skill === 'reading' ? 'Đọc hiểu' : 'Viết',
      wrongCount: w.wrongCount,
      reason: w.reason,
      masteryPercent: w.mastery,
    })),
    vocabularyProgress: {
      learnedCount: learned,
      totalTargetCount: total,
      percent: total ? Math.round((learned / total) * 100) : 0,
    },
  };
}
```

### Bước 3: Render View Với Callbacks
```tsx
const callbacks: TodayCallbacks = {
  onStartPrimaryAction: () => {
    if (next) onNavigate(next.page, next.skill);
    else onNavigate('vocab');
  },
  onStartTask: (taskId, route, skill) => onNavigate(route, skill),
  onSkipTask: (taskId) => {
    commit(p => ({
      ...p,
      plans: {
        ...p.plans,
        [day]: { ...plan, skipped: [...plan.skipped, taskId] }
      }
    }));
  },
  onReviewTask: (taskId, route, skill) => onNavigate(route, skill),
  onOpenSettings: () => onNavigate('settings'),
  onOpenProgressDetails: () => onNavigate('progress'),
  onOpenWeaknessReview: () => onNavigate(weak.length ? 'review' : 'practice'),
  onOpenVocabWorkspace: () => onNavigate('vocab'),
};

return <TodayWorkspaceView model={todayViewModel} callbacks={callbacks} />;
```

---

## 3. Không Có Xung Đột CSS (CSS Scoping Assurance)

Tất cả các rules trong `src/ui-v13/styles/` đều nằm bên trong `.hsk-ui-v13`. Do đó:
- Không ghi đè class `.card`, `.btn`, `.page-heading` hay các class của legacy code ngoài phạm vi `.hsk-ui-v13`.
- Codex có thể nhúng component mới vào bất kỳ vị trí nào mà không lo vỡ giao diện các màn hình cũ.
