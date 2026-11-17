import React from 'react';
import { TaskViewModel } from '../../types/viewmodels';
import { Button } from '../../primitives/Button';
import { Badge } from '../../primitives/Badge';

export interface TaskCardProps {
  task: TaskViewModel;
  onStart: (taskId: string, route: string, skill?: string) => void;
  onSkip?: (taskId: string) => void;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStart,
  onSkip,
  className = '',
}) => {
  const isCompleted = task.isCompleted;
  const isSkipped = task.isSkipped;
  const isUnavailable = !task.isAvailable;

  const getSkillBadgeVariant = () => {
    switch (task.skill) {
      case 'vocabulary': return 'brand';
      case 'grammar': return 'amber';
      case 'reading': return 'emerald';
      case 'listening': return 'neutral';
      case 'writing': return 'amber';
      default: return 'brand';
    }
  };

  return (
    <article 
      className={`v13-task-card ${isCompleted ? 'is-completed' : ''} ${isSkipped ? 'is-skipped' : ''} ${className}`.trim()}
      aria-label={`Nhiệm vụ: ${task.title}`}
    >
      <div className="v13-task-main">
        {/* Completion check icon */}
        <div className="v13-task-indicator" aria-hidden="true">
          {isCompleted ? '✓' : isSkipped ? '—' : '○'}
        </div>

        <div className="v13-task-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="v13-task-title">{task.title}</span>
            <Badge variant={getSkillBadgeVariant()}>
              {task.skillLabel}
            </Badge>
            {isSkipped && (
              <span style={{ fontSize: 'var(--v13-text-xs)', color: 'var(--v13-text-tertiary)', fontStyle: 'italic' }}>
                Đã bỏ qua
              </span>
            )}
          </div>

          {task.reason && (
            <p style={{ fontSize: 'var(--v13-text-xs)', color: 'var(--v13-text-brand)', fontWeight: 'var(--v13-weight-medium)' }}>
              💡 {task.reason}
            </p>
          )}

          <div className="v13-task-meta">
            <span>
              Tiến độ: <strong>{task.currentCount}/{task.targetCount}</strong>
            </span>
            <span>•</span>
            <span>Khoảng {task.estimatedMinutes} phút</span>
            {isUnavailable && task.unavailableReason && (
              <>
                <span>•</span>
                <span style={{ color: 'var(--v13-amber-700)', fontWeight: 'var(--v13-weight-bold)' }}>
                  ⚠️ {task.unavailableReason}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="v13-task-actions">
        {isUnavailable ? (
          <Button variant="secondary" size="sm" disabled title={task.unavailableReason}>
            Tạm khóa
          </Button>
        ) : (
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => onStart(task.id, task.targetRoute, task.skill)}
          >
            {isCompleted ? 'Ôn thêm' : 'Bắt đầu'}
          </Button>
        )}

        {!isCompleted && !isSkipped && onSkip && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSkip(task.id)}
            title="Bỏ qua nhiệm vụ này hôm nay"
          >
            Bỏ qua
          </Button>
        )}
      </div>
    </article>
  );
};
