import React, { useState } from 'react';
import { GrammarCatalogViewModel } from '../../types/viewmodels';
import { GrammarCallbacks } from '../../types/callbacks';
import { GrammarLessonCard } from './GrammarLessonCard';
import { GrammarLessonReader } from './GrammarLessonReader';
import { EmptyState } from '../../primitives/EmptyState';
import { StatusChip } from '../../primitives/StatusChip';

export interface GrammarCatalogViewProps {
  model: GrammarCatalogViewModel;
  callbacks: GrammarCallbacks;
  className?: string;
  manageReader?: boolean;
}

export const GrammarCatalogView: React.FC<GrammarCatalogViewProps> = ({
  model,
  callbacks,
  className = '',
  manageReader = true,
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    model.activeLessonId || null
  );

  const activeLesson = selectedLessonId
    ? model.lessons.find((l) => l.id === selectedLessonId)
    : null;

  const handleSelectLesson = (id: string) => {
    if(manageReader)setSelectedLessonId(id);
    callbacks.onSelectLesson(id);
  };

  const handleCloseReader = () => {
    setSelectedLessonId(null);
    if (callbacks.onCloseReader) {
      callbacks.onCloseReader();
    }
  };

  // If a lesson is being read, render the Reader view
  if (manageReader && activeLesson) {
    return (
      <div className={`hsk-grammar-workspace ${className}`}>
        <GrammarLessonReader
          lesson={activeLesson}
          onClose={handleCloseReader}
          onStartPractice={callbacks.onStartPractice}
        />
      </div>
    );
  }

  const masteryPercent = model.masteredCount===null ? null : model.totalCount > 0 ? Math.round((model.masteredCount / model.totalCount) * 100) : 0;

  return (
    <div className={`hsk-grammar-workspace ${className}`}>
      {/* Header */}
      <div className="hsk-grammar-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: 0 }}>
                Ngữ Pháp {model.level}
              </h2>
              <StatusChip status={model.contentStatus} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--hsk-color-text-secondary)', margin: 0 }}>
              Tổng hợp điểm ngữ pháp cốt lõi, mẫu câu, giải thích chi tiết và phân biệt cấu trúc dễ nhầm lẫn.
            </p>
          </div>
        </div>

        {/* Quick Mastery Bar */}
        <div className="hsk-vocab-stats-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--hsk-color-text-main)' }}>
              Mức độ thành thạo:
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--hsk-color-primary)', fontWeight: 700 }}>
              {model.masteredCount===null ? 'Chưa có bằng chứng đánh giá' : `${model.masteredCount} / ${model.totalCount} điểm (${masteryPercent}%)`}
            </span>
          </div>

          <div style={{ width: '180px', height: '6px', backgroundColor: 'var(--hsk-color-border-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${masteryPercent}%`,
                height: '100%',
                backgroundColor: 'var(--hsk-color-primary)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="hsk-search-input-wrap">
          <span className="hsk-search-icon">🔍</span>
          <input
            type="text"
            className="hsk-search-input"
            placeholder="Tìm theo mã bài, cấu trúc hoặc tên bài ngữ pháp..."
            value={model.searchQuery}
            onChange={(e) => callbacks.onSearchChange(e.target.value)}
            aria-label="Tìm kiếm bài ngữ pháp"
          />
        </div>
      </div>

      {/* Grid of Grammar Cards */}
      {model.lessons.length > 0 ? (
        <div className="hsk-grammar-grid">
          {model.lessons.map((lesson) => (
            <GrammarLessonCard
              key={lesson.id}
              lesson={lesson}
              onSelect={handleSelectLesson}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Không tìm thấy bài ngữ pháp nào"
          description={
            model.searchQuery
              ? `Không tìm thấy điểm ngữ pháp nào phù hợp với từ khóa "${model.searchQuery}".`
              : 'Hiện chưa có bài ngữ pháp nào trong danh mục này.'
          }
          actionLabel="Xóa bộ lọc tìm kiếm"
          onAction={() => callbacks.onSearchChange('')}
        />
      )}
    </div>
  );
};
