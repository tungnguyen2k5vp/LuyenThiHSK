import React from 'react';
import { PracticeHubVM } from '../../../contracts/ui-v13';
import { PracticeSkillSection } from './PracticeSkillSection';
import { Button } from '../../primitives/Button';
import { StatusChip } from '../../primitives/StatusChip';

export interface PracticeHubViewProps {
  model: PracticeHubVM;
  onStartPart: (partId: string, skill: string) => void;
  onStartMixed?: () => void;
  onBack?: () => void;
  className?: string;
}

export const PracticeHubView: React.FC<PracticeHubViewProps> = ({
  model,
  onStartPart,
  onStartMixed,
  onBack,
  className = '',
}) => {
  const listeningParts = model.parts.filter((p) => p.skill === 'listening');
  const readingParts = model.parts.filter((p) => p.skill === 'reading');
  const writingParts = model.parts.filter((p) => p.skill === 'writing');

  const levelCode = `HSK ${model.meta.level}`;
  const isAudioMissing = listeningParts.length > 0 && listeningParts.every(p => p.available === 0);

  return (
    <div className={`hsk-practice-workspace ${className}`}>
      {/* Practice Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--hsk-color-text-main)', margin: 0 }}>
              Khu Luyện Tập Kỹ Năng {levelCode}
            </h2>
            <StatusChip status={model.meta.content.published ? 'PUBLISHED' : 'PREVIEW'} />
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--hsk-color-text-secondary)', margin: 0 }}>
            Luyện tập nội bộ theo từng phần, củng cố nghe, đọc hiểu và kỹ năng viết. Nội dung chờ duyệt chuyên môn.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {onBack && (
            <Button variant="outline" size="md" onClick={onBack}>
              ← Quay lại
            </Button>
          )}
          {model.mixed && (
            <Button
              variant="primary"
              size="md"
              disabled={!model.mixed.availability.available}
              onClick={onStartMixed}
              leftIcon={<span>🎲</span>}
            >
              {model.mixed.label || 'Luyện tập tổng hợp'}
            </Button>
          )}
        </div>
      </div>

      {/* Notice Banner if any */}
      {model.notice && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--hsk-color-amber-light)',
            color: 'var(--hsk-color-amber-dark)',
            borderRadius: 'var(--hsk-radius-lg)',
            fontSize: '0.85rem',
            border: '1px solid var(--hsk-color-amber)',
          }}
        >
          ℹ️ {model.notice}
        </div>
      )}

      {/* Listening Section */}
      <PracticeSkillSection
        skill="listening"
        title="Kỹ năng Nghe hiểu (Listening)"
        icon="🎧"
        parts={listeningParts}
        onStartPart={onStartPart}
        skillNotice={isAudioMissing ? 'Đang hoàn thiện dữ liệu âm thanh cho cấp đang chọn' : undefined}
      />

      {/* Reading Section */}
      <PracticeSkillSection
        skill="reading"
        title="Kỹ năng Đọc hiểu (Reading)"
        icon="📖"
        parts={readingParts}
        onStartPart={onStartPart}
      />

      {/* Writing Section (if present) */}
      {writingParts.length > 0 && (
        <PracticeSkillSection
          skill="writing"
          title="Kỹ năng Viết (Writing)"
          icon="✍️"
          parts={writingParts}
          onStartPart={onStartPart}
        />
      )}

      {/* Mock Exam Readiness Disclaimer Card */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'var(--hsk-color-surface-soft)',
          borderRadius: 'var(--hsk-radius-xl)',
          border: '1px solid var(--hsk-color-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--hsk-color-text-main)' }}>
            📊 Trạng thái sẵn sàng cho Mock Test ({levelCode})
          </h4>
          <span
            style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: model.mock.privatePracticeReady ? '#dcfce7' : '#fee2e2',
              color: model.mock.privatePracticeReady ? '#166534' : '#991b1b',
              fontWeight: 600,
            }}
          >
            {model.mock.privatePracticeReady ? 'Đủ điều kiện luyện tập riêng' : model.mock.candidatePlanReady ? 'Chỉ có bản kế hoạch' : 'Chưa xác nhận khả dụng'}
          </span>
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--hsk-color-text-secondary)', margin: 0 }}>
          {model.mock.label}
        </p>

        {model.mock.blockers && model.mock.blockers.length > 0 && (
          <div style={{ marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--hsk-color-amber-dark)' }}>
              Lưu ý rào cản nội dung:
            </span>
            <ul style={{ margin: '4px 0 0 1.25rem', padding: 0, fontSize: '0.8rem', color: 'var(--hsk-color-text-secondary)' }}>
              {model.mock.blockers.map((b) => (
                <li key={b.id}>
                  {b.label} ({b.count}): {b.nextAction}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
