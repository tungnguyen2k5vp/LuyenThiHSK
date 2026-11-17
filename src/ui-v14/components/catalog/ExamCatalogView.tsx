import React, { useState } from 'react';
import { ExamCatalogVM, LevelId } from '../../types/viewmodels';
import { ExamCatalogCallbacks } from '../../types/callbacks';
import { ExamCatalogCard } from './ExamCatalogCard';
import { EmptyState } from '../../primitives/EmptyState/EmptyState';

export interface ExamCatalogViewProps {
  catalog: ExamCatalogVM;
  callbacks: ExamCatalogCallbacks;
  className?: string;
  refined?: boolean;
}

const HSK_LEVELS: { id: LevelId; label: string }[] = [
  { id: '1', label: 'HSK 1' },
  { id: '2', label: 'HSK 2' },
  { id: '3', label: 'HSK 3' },
  { id: '4', label: 'HSK 4' },
  { id: '5', label: 'HSK 5' },
  { id: '6', label: 'HSK 6' },
  { id: '7-9', label: 'HSK 7-9' },
];

export const ExamCatalogView: React.FC<ExamCatalogViewProps> = ({
  catalog,
  callbacks,
  className = '',
  refined = false,
}) => {
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);

  const activeLevelLabel =
    HSK_LEVELS.find((l) => l.id === catalog.activeLevel)?.label || `HSK ${catalog.activeLevel}`;

  return (
    <div className={`v14-catalog-container ${className}`}>
      {/* Level Selector & Catalog Tabs Header */}
      <div className="v14-catalog-header-bar">
        {/* Level Dropdown */}
        <div className="v14-level-selector-wrap" style={{ position: 'relative' }}>
          <button
            type="button"
            className="v14-level-dropdown-btn"
            onClick={() => setIsLevelMenuOpen((prev) => !prev)}
            aria-expanded={isLevelMenuOpen}
            aria-haspopup="listbox"
          >
            <span>{activeLevelLabel}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--v14-color-text-secondary)' }}>▼</span>
          </button>

          {isLevelMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: 'var(--v14-color-surface)',
                borderRadius: 'var(--v14-radius-lg)',
                boxShadow: 'var(--v14-shadow-lg)',
                border: '1px solid var(--v14-color-border)',
                zIndex: 'var(--v14-z-dropdown)',
                minWidth: '140px',
                padding: '4px 0',
              }}
              role="listbox"
            >
              {HSK_LEVELS.filter(lvl=>!refined||['1','2'].includes(lvl.id)).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  role="option"
                  aria-selected={catalog.activeLevel === lvl.id}
                  onClick={() => {
                    callbacks.onSelectLevel(lvl.id);
                    setIsLevelMenuOpen(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 16px',
                    textAlign: 'left',
                    background: catalog.activeLevel === lvl.id ? 'var(--v14-color-primary-light)' : 'transparent',
                    color: catalog.activeLevel === lvl.id ? 'var(--v14-color-primary)' : 'var(--v14-color-text-main)',
                    fontWeight: catalog.activeLevel === lvl.id ? 700 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'var(--v14-text-sm)',
                  }}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Catalog Category Tabs */}
        <div className="v14-catalog-tabs">
          <button
            type="button"
            className={`v14-catalog-tab-btn ${catalog.activeTab === 'mock' ? 'is-active' : ''}`}
            onClick={() => callbacks.onSelectTab('mock')}
          >
            <span>Đề mô phỏng</span>
            <span className="v14-tab-count-badge">
              {catalog.tabCounts.mock.completed}/{catalog.tabCounts.mock.total}
            </span>
          </button>

          <button
            type="button"
            className={`v14-catalog-tab-btn ${catalog.activeTab === 'skill' ? 'is-active' : ''}`}
            onClick={() => callbacks.onSelectTab('skill')}
          >
            <span>Đề kỹ năng</span>
            <span className="v14-tab-count-badge">{catalog.tabCounts.skill}</span>
          </button>

          <button
            type="button"
            className={`v14-catalog-tab-btn ${catalog.activeTab === 'short' ? 'is-active' : ''}`}
            onClick={() => callbacks.onSelectTab('short')}
          >
            <span>{refined?'Mini Test':'Đề nâng cao'}</span>
            <span className="v14-tab-count-badge">{catalog.tabCounts.short}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="v14-catalog-filter-bar">
        <div className="v14-search-box">
          <span className="v14-search-icon">🔍</span>
          <input
            type="text"
            className="v14-search-input"
            placeholder="Tìm kiếm đề thi..."
            aria-label="Tìm kiếm bài luyện"
            value={catalog.searchQuery}
            onChange={(e) => callbacks.onSearchChange(e.target.value)}
          />
        </div>

        <select
          className="v14-status-dropdown"
          aria-label="Trạng thái bài luyện"
          value={catalog.statusFilter}
          onChange={(e) =>
            callbacks.onFilterChange(
              e.target.value as 'all' | 'not_started' | 'in_progress' | 'completed'
            )
          }
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="not_started">Chưa làm bài</option>
          <option value="in_progress">Đang làm dở</option>
          <option value="completed">Đã hoàn thành</option>
        </select>
      </div>

      {/* Exam Grid */}
      {catalog.exams.length > 0 ? (
        <div className="v14-exam-grid">
          {catalog.exams.map((exam) => (
            <ExamCatalogCard
              key={exam.id}
              exam={exam}
              onSelect={callbacks.onSelectExam}
              refined={refined}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📝"
          title="Không tìm thấy đề thi phù hợp"
          description="Vui lòng thử lại với từ khóa khác hoặc thay đổi bộ lọc trạng thái."
          actionLabel="Đặt lại bộ lọc"
          onAction={() => {
            callbacks.onSearchChange('');
            callbacks.onFilterChange('all');
          }}
        />
      )}
    </div>
  );
};
