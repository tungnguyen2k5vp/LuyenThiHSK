import React, { useEffect } from 'react';
import { FlashcardViewModel } from '../../types/viewmodels';
import { FlashcardCallbacks } from '../../types/callbacks';
import { Button } from '../../primitives/Button';
import { AudioStatusIndicator } from '../../primitives/AudioStatusIndicator';

export interface FlashcardViewProps {
  model: FlashcardViewModel;
  callbacks: FlashcardCallbacks;
  className?: string;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  model,
  callbacks,
  className = '',
}) => {
  const currentItem = model.items[model.currentIndex];

  // Keyboard navigation: Space = Flip, ArrowLeft = Prev, ArrowRight = Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        callbacks.onFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        callbacks.onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        callbacks.onPrevious();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        callbacks.onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);

  if (!currentItem) {
    return (
      <div className={`hsk-flashcard-stage ${className}`}>
        <p>Không có thẻ từ vựng nào để hiển thị.</p>
        <Button variant="outline" onClick={callbacks.onClose}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const isAudioAvailable = currentItem.audioStatus === 'AVAILABLE';
  const progressPercent = Math.round(((model.currentIndex + 1) / model.items.length) * 100);

  return (
    <div className={`hsk-flashcard-stage ${className}`}>
      {/* Top Header Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--hsk-color-text-secondary)' }}>
            Thẻ {model.currentIndex + 1} / {model.items.length}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'var(--hsk-color-primary-light)',
              color: 'var(--hsk-color-primary-dark)',
              fontWeight: 600,
            }}
          >
            {currentItem.level}
          </span>
        </div>

        <button
          type="button"
          onClick={callbacks.onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1rem',
            color: 'var(--hsk-color-text-secondary)',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
          aria-label="Đóng chế độ Flashcard"
        >
          ✕ Đóng
        </button>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: 'var(--hsk-color-border-subtle)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: 'var(--hsk-color-primary)',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* 3D Flip Card */}
      <div
        className="hsk-flashcard-card-wrap"
        onClick={callbacks.onFlip}
        role="button"
        tabIndex={0}
        aria-label={`Thẻ từ ${currentItem.word}. Bấm để lật xem định nghĩa.`}
      >
        <div className={`hsk-flashcard-card-inner ${model.isFlipped ? 'is-flipped' : ''}`}>
          {/* FRONT SIDE: Hanzi + Pinyin + Audio */}
          <div className="hsk-flashcard-front">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-muted)' }}>
                Bấm thẻ hoặc phím Cách để lật ⟲
              </span>
            </div>

            <div className="hsk-flashcard-front-center">
              <div className="hsk-flashcard-hanzi">{currentItem.word}</div>
              <div
                style={{
                  fontFamily: 'var(--hsk-font-pinyin)',
                  fontSize: '1.5rem',
                  color: 'var(--hsk-color-primary)',
                  fontWeight: 500,
                }}
              >
                {currentItem.pinyin}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant={isAudioAvailable ? 'outline' : 'ghost'}
                size="sm"
                disabled={!isAudioAvailable}
                onClick={() => callbacks.onPlayAudio(currentItem.id)}
                leftIcon={<span>{isAudioAvailable ? '🔊' : '🔇'}</span>}
              >
                {isAudioAvailable ? 'Nghe phát âm' : 'Chưa có âm thanh'}
              </Button>
              {!isAudioAvailable && (
                <AudioStatusIndicator status={currentItem.audioStatus} />
              )}
            </div>
          </div>

          {/* BACK SIDE: POS + Vietnamese Meaning + Examples */}
          <div className="hsk-flashcard-back">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontFamily: 'var(--hsk-font-hanzi)',
                    fontWeight: 700,
                    color: 'var(--hsk-color-primary)',
                  }}
                >
                  {currentItem.word}
                </span>
                <span style={{ fontFamily: 'var(--hsk-font-pinyin)', fontSize: '0.9rem', color: 'var(--hsk-color-text-secondary)' }}>
                  {currentItem.pinyin}
                </span>
              </div>
              {currentItem.primaryPos && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--hsk-color-surface-soft)',
                    color: 'var(--hsk-color-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {currentItem.primaryPos}
                </span>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem', width: '100%' }}>
              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: 'var(--hsk-color-text-main)',
                }}
              >
                {currentItem.primaryMeaning}
              </div>

              {currentItem.senses && currentItem.senses[0]?.examples?.[0] && (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 'var(--hsk-radius-lg)',
                    border: '1px solid var(--hsk-color-border-subtle)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontFamily: 'var(--hsk-font-hanzi)', fontSize: '0.95rem', fontWeight: 600 }}>
                    {currentItem.senses[0].examples[0].chinese}
                  </div>
                  <div style={{ fontFamily: 'var(--hsk-font-pinyin)', fontSize: '0.8rem', color: 'var(--hsk-color-primary)' }}>
                    {currentItem.senses[0].examples[0].pinyin}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--hsk-color-text-secondary)', marginTop: '2px' }}>
                    {currentItem.senses[0].examples[0].vietnamese}
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-muted)' }}>
              Bấm thẻ để xem lại mặt trước ⟲
            </div>
          </div>
        </div>
      </div>

      {/* Action Rating Buttons: Need Review vs. Mastered */}
      <div className="hsk-flashcard-actions">
        <Button
          variant="outline"
          size="lg"
          onClick={() => callbacks.onMarkNeedReview(currentItem.id)}
          leftIcon={<span>🔄</span>}
          style={{ flex: 1, borderColor: 'var(--hsk-color-amber)' }}
        >
          Cần ôn lại
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => callbacks.onMarkLearned(currentItem.id)}
          leftIcon={<span>✓</span>}
          style={{ flex: 1, backgroundColor: 'var(--hsk-color-success)', borderColor: 'var(--hsk-color-success)' }}
        >
          Đã thuộc từ này
        </Button>
      </div>

      {/* Prev / Next Pagination Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          disabled={model.currentIndex === 0}
          onClick={callbacks.onPrevious}
          leftIcon={<span>←</span>}
        >
          Từ trước
        </Button>

        <span style={{ fontSize: '0.75rem', color: 'var(--hsk-color-text-muted)' }}>
          Phím tắt: ← Trước • → Sau • Space Lật
        </span>

        <Button
          variant="ghost"
          size="sm"
          disabled={model.currentIndex >= model.items.length - 1}
          onClick={callbacks.onNext}
          rightIcon={<span>→</span>}
        >
          Từ sau
        </Button>
      </div>
    </div>
  );
};
