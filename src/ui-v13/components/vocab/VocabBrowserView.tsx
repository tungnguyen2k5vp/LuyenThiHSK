import React, { useState } from 'react';
import { VocabBrowserViewModel, VocabItemViewModel } from '../../types/viewmodels';
import { VocabBrowserCallbacks } from '../../types/callbacks';
import { VocabCard } from './VocabCard';
import { VocabDetailModal } from './VocabDetailModal';
import { Button } from '../../primitives/Button';
import { EmptyState } from '../../primitives/EmptyState';
import { StatusChip } from '../../primitives/StatusChip';

export interface VocabBrowserViewProps {
  model: VocabBrowserViewModel;
  callbacks: VocabBrowserCallbacks;
  className?: string;
  manageDetail?: boolean;
  canPractice?: boolean;
  canFlashcards?: boolean;
}

export const VocabBrowserView: React.FC<VocabBrowserViewProps> = ({
  model,
  callbacks,
  className = '',
  manageDetail = true,
  canPractice = true,
  canFlashcards = true,
}) => {
  const [selectedWord, setSelectedWord] = useState<VocabItemViewModel | null>(null);

  const handleSelectWord = (id: string) => {
    callbacks.onSelectWord(id);
    const found = model.items.find((item) => item.id === id);
    if (found && manageDetail) {
      setSelectedWord(found);
    }
  };

  const handleCloseModal = () => {
    setSelectedWord(null);
  };

  const learnedPercent = model.learnedCount===null ? null : model.totalCount > 0 ? Math.round((model.learnedCount / model.totalCount) * 100) : 0;

  return (
    <div className={`hsk-vocab-workspace ${className}`}>
      {/* Workspace Header */}
      <div className="hsk-vocab-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: 0 }}>
                Kho Từ Vựng {model.level}
              </h2>
              <StatusChip status={model.contentStatus} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--hsk-color-text-secondary)', margin: 0 }}>
              Danh mục đối chiếu cấp HSK; nghĩa và ví dụ tiếng Việt là bản tham khảo, chưa được duyệt chuyên môn.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              size="md"
              onClick={callbacks.onOpenFlashcards}
              disabled={!canFlashcards}
              leftIcon={<span>🎴</span>}
            >
              Luyện Flashcard
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => callbacks.onStartPractice(model.level)}
              disabled={!canPractice}
              leftIcon={<span>✍️</span>}
            >
              Luyện bài tập từ
            </Button>
          </div>
        </div>

        {/* Quick Progress Bar */}
        <div className="hsk-vocab-stats-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--hsk-color-text-main)' }}>
              Tiến độ riêng ở cấp:
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--hsk-color-primary)', fontWeight: 700 }}>
              {model.learnedCount===null ? 'Chưa có dữ liệu tiến độ' : `${model.learnedCount} / ${model.totalCount} từ (${learnedPercent}%)`}
            </span>
          </div>

          <div style={{ width: '180px', height: '6px', backgroundColor: 'var(--hsk-color-border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${learnedPercent}%`,
                height: '100%',
                backgroundColor: 'var(--hsk-color-primary)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Controls: Search + Filter Pills */}
        <div className="hsk-vocab-controls">
          <div className="hsk-search-input-wrap">
            <span className="hsk-search-icon">🔍</span>
            <input
              type="text"
              className="hsk-search-input"
              placeholder="Tìm theo chữ Hán, Pinyin hoặc nghĩa tiếng Việt..."
              value={model.searchQuery}
              onChange={(e) => callbacks.onSearchChange(e.target.value)}
              aria-label="Tìm kiếm từ vựng"
            />
          </div>

          <div className="hsk-filter-pills" role="radiogroup" aria-label="Bộ lọc từ vựng">
            <button
              type="button"
              className={`hsk-filter-pill ${model.selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => callbacks.onFilterChange('all')}
              role="radio"
              aria-checked={model.selectedFilter === 'all'}
            >
              Tất cả ({model.totalCount})
            </button>
            <button
              type="button"
              className={`hsk-filter-pill ${model.selectedFilter === 'unlearned' ? 'active' : ''}`}
              onClick={() => callbacks.onFilterChange('unlearned')}
              role="radio"
              aria-checked={model.selectedFilter === 'unlearned'}
            >
              Chưa học {model.learnedCount===null?'':`(${model.totalCount - model.learnedCount})`}
            </button>
            <button
              type="button"
              className={`hsk-filter-pill ${model.selectedFilter === 'review' ? 'active' : ''}`}
              onClick={() => callbacks.onFilterChange('review')}
              role="radio"
              aria-checked={model.selectedFilter === 'review'}
            >
              Cần ôn tập
            </button>
            <button
              type="button"
              className={`hsk-filter-pill ${model.selectedFilter === 'favorite' ? 'active' : ''}`}
              onClick={() => callbacks.onFilterChange('favorite')}
              role="radio"
              aria-checked={model.selectedFilter === 'favorite'}
            >
              ★ Yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* Vocab Grid */}
      {model.items.length > 0 ? (
        <div className="hsk-vocab-grid">
          {model.items.map((item) => (
            <VocabCard
              key={item.id}
              item={item}
              onSelect={handleSelectWord}
              onToggleFavorite={callbacks.onToggleFavorite}
              onToggleLearned={callbacks.onToggleLearned}
              onPlayAudio={callbacks.onPlayAudio}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Không tìm thấy từ vựng phù hợp"
          description={
            model.searchQuery
              ? `Không có kết quả nào cho "${model.searchQuery}". Hãy thử tìm kiếm bằng từ khóa khác.`
              : 'Chưa có từ vựng nào trong danh mục đã chọn.'
          }
          actionLabel="Xóa bộ lọc tìm kiếm"
          onAction={() => {
            callbacks.onSearchChange('');
            callbacks.onFilterChange('all');
          }}
        />
      )}

      {/* Detail Modal */}
      {manageDetail && <VocabDetailModal
        item={selectedWord}
        isOpen={Boolean(selectedWord)}
        onClose={handleCloseModal}
        onToggleFavorite={callbacks.onToggleFavorite}
        onToggleLearned={callbacks.onToggleLearned}
        onPlayAudio={callbacks.onPlayAudio}
        onPracticeWord={() => {
          if (selectedWord) {
            callbacks.onStartPractice(selectedWord.level);
            handleCloseModal();
          }
        }}
      />}
    </div>
  );
};
