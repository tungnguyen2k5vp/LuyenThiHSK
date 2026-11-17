import React from 'react';
import { WritingWorkspaceProps } from '../../../contracts/ui-v13';
import { Button } from '../../primitives/Button';

export const WritingWorkspace: React.FC<WritingWorkspaceProps & { className?: string;showPrompt?:boolean }> = ({
  writing,
  onInput,
  onCompositionStart,
  onCompositionEnd,
  onSave,
  className = '',
  showPrompt = true,
}) => {
  const getSaveIcon = () => {
    switch (writing.saveState) {
      case 'saving':
        return '⏳';
      case 'saved':
        return '✓';
      case 'dirty':
        return '●';
      case 'error':
        return '⚠️';
      case 'idle':
      default:
        return '💾';
    }
  };

  const getSaveClass = () => {
    switch (writing.saveState) {
      case 'saved':
        return 'var(--hsk-color-success)';
      case 'dirty':
        return 'var(--hsk-color-amber-dark)';
      case 'error':
        return '#ef4444';
      default:
        return 'var(--hsk-color-text-secondary)';
    }
  };

  return (
    <div className={`hsk-writing-container ${className}`}>
      {/* Chinese Prompt Card */}
      {showPrompt && <div className="hsk-writing-prompt-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--hsk-color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Đề bài viết
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#f1f5f9',
              color: 'var(--hsk-color-text-secondary)',
            }}
          >
            {writing.scoringLabel}
          </span>
        </div>

        {writing.pinyinHint && (
          <div style={{ fontFamily: 'var(--hsk-font-pinyin)', fontSize: '0.9rem', color: 'var(--hsk-color-primary)' }}>
            {writing.pinyinHint}
          </div>
        )}

        <div className="hsk-writing-prompt-zh">{writing.promptZh}</div>

        {writing.help && (
          <p style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-secondary)', margin: 0, fontStyle: 'italic' }}>
            💡 {writing.help}
          </p>
        )}
      </div>}

      {/* Ungraded Status Explanation Banner */}
      <div className="hsk-writing-ungraded-banner" role="note">
        <span>ℹ️</span>
        <span>
          <strong>Lưu ý chấm bài:</strong> Phần tự luận/viết chưa có tính năng tự động chấm trong chế độ luyện thi khách quan; bài của bạn được lưu trữ để xem lại và không bị tính là câu làm sai.
        </span>
      </div>

      {/* Editor Card */}
      <div className="hsk-writing-editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label
            htmlFor={`writing-input-${writing.questionId}`}
            style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--hsk-color-text-main)' }}
          >
            Khu vực làm bài viết:
          </label>

          {/* Save Status Indicator */}
          <div className="hsk-writing-status-pill" style={{ color: getSaveClass() }}>
            <span>{getSaveIcon()}</span>
            <span>{writing.saveLabel}</span>
          </div>
        </div>

        {/* Textarea strictly controlled and forwarding composition events */}
        <textarea
          id={`writing-input-${writing.questionId}`}
          className="hsk-writing-textarea"
          lang="zh-CN"
          rows={8}
          autoComplete="off"
          spellCheck={false}
          onKeyDown={e=>e.stopPropagation()}
          value={writing.value}
          maxLength={writing.maxLength}
          disabled={writing.readOnly}
          onChange={(e) => onInput(e.target.value)}
          onCompositionStart={() => onCompositionStart()}
          onCompositionEnd={(e) => onCompositionEnd(e.currentTarget.value)}
          placeholder="Nhập câu trả lời bằng chữ Hán tại đây..."
          aria-label="Khung nhập bài viết chữ Hán"
        />

        {/* Character Counter and Save Action */}
        <div className="hsk-writing-counter-bar">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {writing.composing && <span role="status">Đang nhập bằng IME…</span>}
            <span>
              Số chữ Hán: <strong style={{ color: 'var(--hsk-color-primary)' }}>{writing.hanziCount}</strong>
            </span>
            <span>
              Tổng ký tự: <strong>{writing.characterCount}</strong> / {writing.maxLength}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {writing.error && (
              <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>⚠️ {writing.error}</span>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={writing.readOnly || writing.composing || writing.saveState === 'saving'}
              onClick={() => onSave()}
              leftIcon={<span>💾</span>}
            >
              Lưu bản nháp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
