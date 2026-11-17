import React from 'react';
import { TodayViewModel } from '../types/viewmodels';
import { TodayCallbacks } from '../types/callbacks';
import { TodayHero } from '../components/TodayHero';
import { TaskCard } from '../components/TaskCard';
import { MetricCard } from '../components/MetricCard';
import { WeaknessSpotlight } from '../components/WeaknessSpotlight';
import { Card } from '../primitives/Card';
import { Button } from '../primitives/Button';
import { ProgressBar } from '../primitives/ProgressBar';
import { StatusChip } from '../primitives/StatusChip';
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/components.css';
import '../styles/views.css';

export interface TodayWorkspaceViewProps {
  model: TodayViewModel;
  callbacks: TodayCallbacks;
  className?: string;
}

export const TodayWorkspaceView: React.FC<TodayWorkspaceViewProps> = ({
  model,
  callbacks,
  className = '',
}) => {
  return (
    <div className={`hsk-ui-v13 ${className}`.trim()}>
      <div className="v13-today-container">
        {/* Top Header */}
        <header className="page-heading">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--v13-space-2)' }}>
            <span className="text-eyebrow">
              KẾ HOẠCH HỌC TẬP · {model.currentDateFormatted}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <StatusChip status={model.contentStatus} />
            </div>
          </div>
          <h1>Tổng quan hôm nay</h1>
          <p>
            Mỗi ngày một bước vững chắc đến mục tiêu {model.targetLevel}.
          </p>
        </header>

        {/* Status Notice if in preview */}
        {model.statusNotice && (
          <div 
            style={{ 
              padding: '10px 14px', 
              borderRadius: 'var(--v13-radius-md)', 
              backgroundColor: 'var(--v13-amber-50)', 
              border: '1px solid var(--v13-amber-200)',
              fontSize: 'var(--v13-text-sm)',
              color: 'var(--v13-amber-700)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>ℹ️</span>
            <span>{model.statusNotice}</span>
          </div>
        )}

        {/* 1. Today Hero Banner (5-second orientation) */}
        <TodayHero
          targetLevel={model.targetLevel}
          targetSyllabus={model.targetSyllabus}
          daysRemaining={model.daysRemaining}
          readiness={model.readiness}
          nextTask={model.nextRecommendedTask}
          onStartPrimary={callbacks.onStartPrimaryAction}
          onOpenProgress={callbacks.onOpenProgressDetails}
        />

        {/* 2. Key Metrics Row */}
        <section aria-label="Chỉ số học tập nhanh">
          <div className="v13-metrics-grid">
            {model.metrics.map((m) => (
              <MetricCard key={m.key} metric={m} />
            ))}
          </div>
        </section>

        {/* 3. Daily Learning Tasks Section */}
        <section className="v13-tasks-section" aria-labelledby="tasks-title">
          <div className="v13-tasks-header">
            <div>
              <h2 id="tasks-title">Hôm nay học gì?</h2>
              <p className="text-caption">
                {model.completedTasksCount}/{model.tasks.length} nhiệm vụ đã hoàn thành • Dự kiến khoảng {model.totalEstimatedMinutes} phút
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={callbacks.onOpenSettings}
            >
              Đổi mục tiêu
            </Button>
          </div>

          <div className="v13-tasks-list">
            {model.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={callbacks.onStartTask}
                onSkip={callbacks.onSkipTask}
              />
            ))}
          </div>
        </section>

        {/* 4. Lower Panels (Weakness Spotlight & Vocabulary Target Coverage) */}
        <div className="v13-lower-grid">
          {/* Weakness Review */}
          <WeaknessSpotlight
            weaknesses={model.weaknesses}
            onReviewWeakness={callbacks.onOpenWeaknessReview}
          />

          {/* Target Vocab Coverage */}
          <Card as="section" aria-labelledby="vocab-progress-title">
            <h3 id="vocab-progress-title" style={{ marginBottom: 'var(--v13-space-2)' }}>
              Độ phủ từ vựng mục tiêu
            </h3>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: 'var(--v13-space-2)' }}>
              <span style={{ fontSize: 'var(--v13-text-2xl)', fontWeight: 'var(--v13-weight-heavy)', color: 'var(--v13-teal-700)' }}>
                {model.vocabularyProgress.learnedCount}
              </span>
              <span style={{ fontSize: 'var(--v13-text-sm)', color: 'var(--v13-text-secondary)' }}>
                / {model.vocabularyProgress.totalTargetCount} từ mới riêng ở cấp {model.targetLevel}
              </span>
            </div>

            <p style={{ fontSize: 'var(--v13-text-xs)', color: 'var(--v13-text-secondary)', marginBottom: 'var(--v13-space-3)' }}>
              Tiến độ học danh mục của cấp hiện tại; không phải tổng từ tích lũy của các cấp trước.
            </p>

            <ProgressBar
              value={model.vocabularyProgress.percent}
              showPercent
              label="Tỷ lệ bao phủ"
              style={{ marginBottom: 'var(--v13-space-4)' }}
            />

            <Button
              variant="secondary"
              size="sm"
              onClick={callbacks.onOpenVocabWorkspace}
              style={{ width: '100%' }}
            >
              Tiếp tục học từ vựng →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
