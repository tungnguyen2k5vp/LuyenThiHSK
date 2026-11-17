import React from 'react';
import { ExamIntroVM } from '../../types/viewmodels';
import { ExamIntroCallbacks } from '../../types/callbacks';
import { Button } from '../../primitives/Button/Button';
import { ToggleSwitch } from '../../primitives/ToggleSwitch/ToggleSwitch';

export interface ExamIntroCardProps {
  intro: ExamIntroVM;
  callbacks: ExamIntroCallbacks;
  className?: string;
  refined?: boolean;
}

export const ExamIntroCard: React.FC<ExamIntroCardProps> = ({
  intro,
  callbacks,
  className = '',
  refined = false,
}) => {
  const isPractice = intro.examMode === 'practice';

  return (
    <div className={`v14-intro-container ${className}`}>
      {/* Top Bar with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
        <button
          type="button"
          onClick={callbacks.onBack}
          aria-label="Quay lại danh sách đề thi"
          style={{
            background: 'none',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            color: 'var(--v14-color-text-secondary)',
            fontWeight: 600,
            fontSize: 'var(--v14-text-sm)',
            padding: '4px 8px',
            borderRadius: 'var(--v14-radius-md)',
          }}
        >
          <span>←</span>
          <span>Trở về</span>
        </button>
      </div>

      {/* Title & Level */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '9999px',
            backgroundColor: 'var(--v14-color-primary-light)',
            color: 'var(--v14-color-primary)',
            fontSize: 'var(--v14-text-xs)',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          HSK {intro.level} • {refined?'Bài luyện nền tảng / BETA':'Chuẩn đề thi'}
        </span>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--v14-color-text-main)',
            margin: 0,
          }}
        >
          {intro.title}
        </h1>
      </div>

      {/* Skills Breakdown Box (Migii style split table/box) */}
      <div className="v14-intro-skills-box">
        {intro.skills.map((skill) => (
          <div key={skill.skill} className="v14-intro-skill-col">
            <span
              style={{
                fontSize: 'var(--v14-text-xs)',
                color: 'var(--v14-color-text-secondary)',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {skill.label}
            </span>
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--v14-color-primary-active)',
              }}
            >
              {skill.questionCount} câu
            </span>
          </div>
        ))}
      </div>

      {/* Meta Specifications */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--v14-space-6)',
          fontSize: 'var(--v14-text-sm)',
          color: 'var(--v14-color-text-secondary)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>⏱️</span>
          <span>Thời gian: <strong>{intro.durationMinutes} phút</strong></span>
        </span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🎯</span>
          <span>{intro.passingScore===null?'Điểm luyện tập · không quy đổi điểm HSK':<>Điểm đỗ: <strong>{intro.passingScore} điểm</strong></>}</span>
        </span>
      </div>

      {/* Practice vs Strict Exam Mode Switch */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--v14-space-3)',
          padding: 'var(--v14-space-4)',
          borderRadius: 'var(--v14-radius-xl)',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--v14-color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <span
            style={{
              fontSize: 'var(--v14-text-sm)',
              fontWeight: 600,
              color: isPractice ? 'var(--v14-color-primary)' : 'var(--v14-color-text-secondary)',
            }}
          >
            Luyện tập
          </span>
          <ToggleSwitch
            checked={!isPractice}
            onChange={(checked) => callbacks.onToggleMode(checked ? 'mock' : 'practice')}
            label="Chuyển chế độ thi"
          />
          <span
            style={{
              fontSize: 'var(--v14-text-sm)',
              fontWeight: 600,
              color: !isPractice ? 'var(--v14-color-primary)' : 'var(--v14-color-text-secondary)',
            }}
          >
            Thi thử (Bấm giờ)
          </span>
        </div>

        {/* Dynamic Mode Notice */}
        <div className="v14-intro-notice-box">
          <p style={{ margin: 0 }}>
            {isPractice
              ? intro.noticePractice ||
                'Chế độ Luyện tập: Cho phép tạm dừng audio, xem ngay đáp án và giải thích chi tiết trong khi làm bài.'
              : intro.noticeMock ||
                'Chế độ Thi thử: Thời gian đếm ngược liên tục mô phỏng phòng thi thật, không thể tạm dừng audio. Đáp án và phân tích sẽ hiển thị sau khi nộp bài.'}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div style={{ width: '100%', marginTop: 'var(--v14-space-2)' }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={intro.canStart===false||intro.startBusy}
          onClick={() => callbacks.onStartExam(intro.examId, intro.examMode)}
        >
          {intro.startBusy?'Đang chuẩn bị…':'Bắt đầu làm bài'}
        </Button>
      </div>
    </div>
  );
};
