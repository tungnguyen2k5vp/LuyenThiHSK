import React, { useEffect, useRef } from 'react';
import { VocabItemViewModel } from '../../types/viewmodels';
import { StatusChip } from '../../primitives/StatusChip';
import { AudioStatusIndicator } from '../../primitives/AudioStatusIndicator';
import { Button } from '../../primitives/Button';

export interface VocabDetailModalProps {
  item: VocabItemViewModel | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  onToggleLearned?: (id: string) => void;
  onPlayAudio?: (id: string) => void;
  onPracticeWord?: (id: string) => void;
}

export const VocabDetailModal: React.FC<VocabDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onToggleFavorite,
  onToggleLearned,
  onPlayAudio,
  onPracticeWord,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isAudioAvailable = item.audioStatus === 'AVAILABLE';

  return (
    <div
      className="hsk-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="hsk-modal-window"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vocab-modal-title"
      >
        <button
          type="button"
          className="hsk-modal-close-btn"
          onClick={onClose}
          aria-label="Đóng cửa sổ chi tiết từ vựng"
        >
          ✕
        </button>

        {/* Header: Large Hanzi, Pinyin, Audio, Status */}
        <div className="hsk-vocab-modal-header">
          <div className="hsk-vocab-modal-hanzi" id="vocab-modal-title">
            {item.word}
          </div>
          <div className="hsk-vocab-modal-meta">
            <div className="hsk-vocab-modal-pinyin">{item.pinyin}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
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
                {item.level}
              </span>
              {item.radical && (
                <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-secondary)' }}>
                  Bộ: {item.radical}
                </span>
              )}
              {item.strokeCount && (
                <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-secondary)' }}>
                  {item.strokeCount} nét
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Audio & Quick Action Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--hsk-color-surface-soft)',
            borderRadius: 'var(--hsk-radius-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Button
              variant={isAudioAvailable ? 'primary' : 'outline'}
              size="sm"
              disabled={!isAudioAvailable}
              onClick={() => onPlayAudio && onPlayAudio(item.id)}
              leftIcon={<span>{isAudioAvailable ? '🔊' : '🔇'}</span>}
            >
              {isAudioAvailable ? 'Nghe phát âm chuẩn' : 'Chưa có âm thanh'}
            </Button>
            {!isAudioAvailable && (
              <AudioStatusIndicator status={item.audioStatus} />
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className={`hsk-vocab-icon-btn ${item.isFavorite ? 'active-favorite' : ''}`}
              onClick={() => onToggleFavorite && onToggleFavorite(item.id)}
              title={item.isFavorite ? 'Bỏ lưu yêu thích' : 'Lưu vào từ yêu thích'}
              aria-label={item.isFavorite ? 'Bỏ lưu yêu thích' : 'Lưu vào từ yêu thích'}
            >
              {item.isFavorite ? '★' : '☆'}
            </button>
            <button
              type="button"
              className={`hsk-vocab-icon-btn ${item.isLearned ? 'active-learned' : ''}`}
              onClick={() => onToggleLearned && onToggleLearned(item.id)}
              title={item.isLearned ? 'Đã thuộc' : 'Đánh dấu đã thuộc'}
              aria-label={item.isLearned ? 'Đã thuộc' : 'Đánh dấu đã thuộc'}
            >
              {item.isLearned ? '✓' : '○'}
            </button>
          </div>
        </div>

        {/* Senses and Examples (Handles Multi-meaning cleanly) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--hsk-color-text-muted)',
              margin: 0,
            }}
          >
            Định nghĩa & Ví dụ minh họa
          </h4>

          {item.senses && item.senses.length > 0 ? (
            item.senses.map((sense, idx) => (
              <div key={idx} className="hsk-vocab-sense-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {sense.pos && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--hsk-color-border-subtle)',
                        color: 'var(--hsk-color-primary-dark)',
                        fontWeight: 600,
                      }}
                    >
                      {sense.pos}
                    </span>
                  )}
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--hsk-color-text-main)' }}>
                    {idx + 1}. {sense.meaning}
                  </span>
                </div>

                {sense.examples && sense.examples.length > 0 && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column' }}>
                    {sense.examples.map((ex, exIdx) => (
                      <div key={exIdx} className="hsk-example-item">
                        <div className="hsk-example-chinese">{ex.chinese}</div>
                        <div className="hsk-example-pinyin">{ex.pinyin}</div>
                        <div className="hsk-example-vietnamese">{ex.vietnamese}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="hsk-vocab-sense-item">
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--hsk-color-text-main)' }}>
                {item.primaryMeaning}
              </span>
            </div>
          )}
        </div>

        {/* Editorial Quality & Source Metadata Box (Separated cleanly) */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--hsk-radius-lg)',
            backgroundColor: 'var(--hsk-color-surface-soft)',
            border: '1px dashed var(--hsk-color-border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--hsk-color-text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>Thông tin biên tập & Bản quyền:</span>
            <StatusChip status={item.contentStatus} />
          </div>
          <div>
            Nguồn: {item.sourceNotice || 'Giáo trình Chuẩn HSK'} • Trạng thái SRS: {item.srsStage || 'Chưa học'}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <Button variant="outline" size="md" onClick={onClose}>
            Đóng
          </Button>
          {onPracticeWord && (
            <Button
              variant="primary"
              size="md"
              onClick={() => onPracticeWord(item.id)}
            >
              Luyện tập từ này
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
