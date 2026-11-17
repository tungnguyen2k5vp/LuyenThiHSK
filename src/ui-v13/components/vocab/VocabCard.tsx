import React from 'react';
import { VocabItemViewModel } from '../../types/viewmodels';
import { StatusChip } from '../../primitives/StatusChip';
import { AudioStatusIndicator } from '../../primitives/AudioStatusIndicator';

export interface VocabCardProps {
  item: VocabItemViewModel;
  onSelect: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleLearned?: (id: string) => void;
  onPlayAudio?: (id: string) => void;
  className?: string;
}

export const VocabCard: React.FC<VocabCardProps> = ({
  item,
  onSelect,
  onToggleFavorite,
  onToggleLearned,
  onPlayAudio,
  className = '',
}) => {
  const isAudioAvailable = item.audioStatus === 'AVAILABLE' || item.audioStatus === 'PREVIEW_ONLY';

  const handleCardClick = (event:React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.focus({preventScroll:true});
    onSelect(item.id);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if(e.target !== e.currentTarget)return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(item.id);
    }
  };

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAudioAvailable && onPlayAudio) {
      onPlayAudio(item.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(item.id);
    }
  };

  const handleLearnedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleLearned) {
      onToggleLearned(item.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={`hsk-vocab-card ${item.isLearned ? 'hsk-vocab-card-learned' : ''} ${className}`}
      aria-label={`Từ vựng ${item.word}, phiên âm ${item.pinyin}, nghĩa: ${item.primaryMeaning}`}
    >
      <div className="hsk-vocab-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {item.primaryPos && (
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--hsk-color-surface-soft)',
                color: 'var(--hsk-color-text-secondary)',
                fontWeight: 500,
              }}
            >
              {item.primaryPos}
            </span>
          )}
          {item.radical && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--hsk-color-text-muted)',
              }}
              title="Bộ thủ"
            >
              Bộ: {item.radical}
            </span>
          )}
        </div>

        <StatusChip status={item.contentStatus} />
      </div>

      <div className="hsk-vocab-card-body">
        <div className="hsk-vocab-word-large">{item.word}</div>
        <div className="hsk-vocab-pinyin">{item.pinyin}</div>
        <div className="hsk-vocab-meaning">{item.primaryMeaning}</div>
      </div>

      <div className="hsk-vocab-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="hsk-vocab-icon-btn"
            onClick={handleAudioClick}
            disabled={!isAudioAvailable}
            title={item.audioStatus==='PREVIEW_ONLY'?'Thử giọng máy của thiết bị; không phải audio đề':isAudioAvailable ? 'Phát âm' : 'Chưa có âm thanh'}
            aria-label={isAudioAvailable ? `Nghe giọng máy từ ${item.word}` : 'Âm thanh chưa sẵn sàng'}
          >
            {isAudioAvailable ? '🔊' : '🔇'}
          </button>
          {!isAudioAvailable && (
            <AudioStatusIndicator status={item.audioStatus} />
          )}
        </div>

        <div className="hsk-vocab-action-btns">
          <button
            type="button"
            className={`hsk-vocab-icon-btn ${item.isFavorite ? 'active-favorite' : ''}`}
            onClick={handleFavoriteClick}
            title={item.isFavorite ? 'Bỏ lưu yêu thích' : 'Lưu vào từ yêu thích'}
            aria-label={item.isFavorite ? 'Bỏ lưu yêu thích' : 'Lưu vào từ yêu thích'}
          >
            {item.isFavorite ? '★' : '☆'}
          </button>

          <button
            type="button"
            className={`hsk-vocab-icon-btn ${item.isLearned ? 'active-learned' : ''}`}
            onClick={handleLearnedClick}
            disabled={item.isLearned}
            title={item.isLearned ? 'Đã học; ôn lại trong hàng đợi SRS' : 'Ghi nhận đã học và hẹn lịch ôn'}
            aria-label={item.isLearned ? 'Đã học' : 'Ghi nhận đã học'}
          >
            {item.isLearned ? '✓' : '○'}
          </button>
        </div>
      </div>
    </div>
  );
};
