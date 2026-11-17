import React from 'react';
import { SkillId, AudioVM, AudioCallbacks } from '../../../contracts/ui-v13';
import { Button } from '../../primitives/Button';
import { AudioStatusIndicator } from '../../primitives/AudioStatusIndicator';

export interface QuestionHeaderProps {
  number: number;
  skill: SkillId;
  partId?: string | null;
  flagged: boolean;
  onFlag: () => void;
  audio?: AudioVM | null;
  audioCallbacks?: AudioCallbacks | null;
  className?: string;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  number,
  skill,
  partId,
  flagged,
  onFlag,
  audio,
  audioCallbacks,
  className = '',
}) => {
  const getSkillLabel = (s: SkillId) => {
    switch (s) {
      case 'listening': return 'Nghe hiểu';
      case 'reading': return 'Đọc hiểu';
      case 'writing': return 'Viết';
      case 'speaking': return 'Nói';
      case 'translation': return 'Dịch';
      default: return 'Tổng hợp';
    }
  };

  const isAudioAvailable = audio && audio.canPlay && audio.state !== 'unavailable';

  return (
    <div className={`hsk-question-header ${className}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="hsk-question-number-badge">
          <span>Câu {number}</span>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '9999px',
            backgroundColor: 'var(--hsk-color-primary-light)',
            color: 'var(--hsk-color-primary-dark)',
          }}
        >
          {getSkillLabel(skill)}
        </span>

        {partId && (
          <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-secondary)' }}>
            Phần: {partId}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Audio Player Control if Audio is attached */}
        {audio && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button
              variant={audio.state === 'playing' ? 'primary' : 'outline'}
              size="sm"
              disabled={!isAudioAvailable}
              onClick={() => {
                if (audioCallbacks) {
                  if (audio.state === 'playing') {
                    audioCallbacks.onPause();
                  } else {
                    audioCallbacks.onPlay();
                  }
                }
              }}
              leftIcon={
                <span>
                  {audio.state === 'playing' ? '⏸️' : audio.state === 'loading' ? '⏳' : '🔊'}
                </span>
              }
            >
              {audio.state === 'playing'
                ? 'Tạm dừng'
                : audio.state === 'loading'
                ? 'Đang tải âm...'
                : isAudioAvailable
                ? 'Nghe file audio'
                : 'Chưa có âm thanh'}
            </Button>

            {!isAudioAvailable && (
              <AudioStatusIndicator status="UNAVAILABLE" notice={audio.reason || undefined} />
            )}
          </div>
        )}

        {/* Flag question for later review */}
        <button
          type="button"
          className={`hsk-flag-btn ${flagged ? 'is-flagged' : ''}`}
          onClick={onFlag}
          title={flagged ? 'Bỏ đánh dấu xem lại' : 'Đánh dấu câu này để xem lại'}
          aria-label={flagged ? 'Bỏ cờ đánh dấu câu hỏi' : 'Đánh dấu cờ câu hỏi'}
        >
          <span>{flagged ? '🚩' : '🏳️'}</span>
          <span>{flagged ? 'Đã đánh dấu' : 'Xem lại sau'}</span>
        </button>
      </div>
    </div>
  );
};
