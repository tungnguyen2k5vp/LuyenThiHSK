import React from 'react';
import { QuestionPresentationProps, QuestionVM } from '../../../contracts/ui-v13';
import { QuestionHeader } from './QuestionHeader';
import { MultipleChoice } from './MultipleChoice';
import { ImageChoice } from './ImageChoice';
import { TrueFalse } from './TrueFalse';
import { MatchingQuestion } from './MatchingQuestion';
import { PracticeFeedback } from './PracticeFeedback';
import { Button } from '../../primitives/Button';
import { EmptyState } from '../../primitives/EmptyState';

export const QuestionPresentationView: React.FC<QuestionPresentationProps & { className?: string }> = ({
  state,
  onChoose,
  onMatch,
  onTextChange,
  onFlag,
  onCheck,
  onRetryImage,
  audioCallbacks,
  className = '',
}) => {
  if (state.status === 'loading') {
    return (
      <div className={`hsk-question-container ${className}`} style={{ alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <span style={{ fontSize: '1.5rem' }}>⏳</span>
        <p style={{ color: 'var(--hsk-color-text-secondary)', marginTop: '0.5rem' }}>{state.label || 'Đang tải câu hỏi...'}</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className={`hsk-question-container ${className}`}>
        <EmptyState
          title="Đã xảy ra lỗi khi tải câu hỏi"
          description={state.message}
          actionLabel={state.retryable ? 'Thử tải lại' : undefined}
          onAction={state.retryable ? () => onCheck() : undefined}
        />
      </div>
    );
  }

  if (state.status === 'empty') {
    return (
      <div className={`hsk-question-container ${className}`}>
        <EmptyState
          title={state.title || 'Không có câu hỏi'}
          description={state.description || 'Hiện tại không có dữ liệu câu hỏi trong phần này.'}
        />
      </div>
    );
  }

  const q: QuestionVM = state.data;

  // Detect if question options are all images
  const isImageOptions = q.options.length > 0 && q.options.every((opt) => Boolean(opt.image));

  // Detect if options represent True / False
  const isTrueFalse =
    q.options.length === 2 &&
    q.options.some((opt) => opt.text.toLowerCase().includes('đúng') || opt.text === '对' || opt.text === '√') &&
    q.options.some((opt) => opt.text.toLowerCase().includes('sai') || opt.text === '错' || opt.text === '×');

  return (
    <div className={`hsk-question-container ${className}`}>
      {/* Question Header */}
      <QuestionHeader
        number={q.number}
        skill={q.skill}
        partId={q.partId}
        flagged={q.flagged}
        onFlag={onFlag}
        audio={q.audio}
        audioCallbacks={audioCallbacks}
      />

      {/* Instruction */}
      {q.instruction && (
        <div className="hsk-question-instruction">
          📌 {q.instruction}
        </div>
      )}

      {/* Reading Passage Context if any */}
      {q.contextZh && (
        <div className="hsk-question-context-zh">
          {q.contextZh}
        </div>
      )}

      {/* Question Prompt */}
      <div className="hsk-question-prompt-box">
        {q.pinyin && (
          <div style={{ fontFamily: 'var(--hsk-font-pinyin)', fontSize: '0.9rem', color: 'var(--hsk-color-primary)' }}>
            {q.pinyin}
          </div>
        )}
        {q.promptZh && (
          <div className="hsk-question-prompt-zh">
            {q.promptZh}
          </div>
        )}

        {/* Single Question Illustration if present */}
        {q.image && (
          <div
            style={{
              width: '100%',
              maxHeight: '260px',
              borderRadius: 'var(--hsk-radius-xl)',
              overflow: 'hidden',
              backgroundColor: 'var(--hsk-color-surface-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {q.image.state === 'available' && q.image.displayUrl ? (
              <img
                src={q.image.displayUrl}
                alt={q.image.alt || 'Hình ảnh minh họa câu hỏi'}
                style={{ maxHeight: '260px', width: 'auto', objectFit: 'contain' }}
              />
            ) : q.image.state === 'error' && q.image.retryable ? (
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--hsk-color-text-muted)' }}>Lỗi tải ảnh minh họa</p>
                <Button size="sm" variant="outline" onClick={() => onRetryImage(q.image!.id)}>
                  Tải lại ảnh
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Interaction Body */}
      <div>
        {q.interaction === 'matching' ? (
          <MatchingQuestion
            matchingItems={q.matchingItems}
            options={q.options}
            onMatch={onMatch}
            readOnly={q.readOnly}
          />
        ) : q.interaction === 'text' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--hsk-color-text-secondary)' }}>
              Nhập câu trả lời của bạn:
            </label>
            <input
              type="text"
              value={q.answerText}
              disabled={q.readOnly}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Nhập đáp án tại đây..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--hsk-radius-lg)',
                border: '1.5px solid var(--hsk-color-border-subtle)',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>
        ) : isImageOptions ? (
          <ImageChoice
            options={q.options}
            onChoose={onChoose}
            onRetryImage={onRetryImage}
            readOnly={q.readOnly}
          />
        ) : isTrueFalse ? (
          <TrueFalse
            options={q.options}
            onChoose={onChoose}
            readOnly={q.readOnly}
          />
        ) : (
          <MultipleChoice
            options={q.options}
            onChoose={onChoose}
            readOnly={q.readOnly}
          />
        )}
      </div>

      {/* Practice Feedback Section */}
      {q.feedback && <PracticeFeedback feedback={q.feedback} />}

      {/* Bottom Action Footer */}
      {!q.feedback && !q.readOnly && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <Button
            variant="primary"
            size="md"
            onClick={() => onCheck()}
            leftIcon={<span>🔍</span>}
          >
            Kiểm tra đáp án
          </Button>
        </div>
      )}
    </div>
  );
};
