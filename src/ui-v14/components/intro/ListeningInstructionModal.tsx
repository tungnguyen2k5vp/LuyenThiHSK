import React from 'react';
import { ListeningInstructionModalVM } from '../../types/viewmodels';
import { ListeningInstructionCallbacks } from '../../types/callbacks';
import { Button } from '../../primitives/Button/Button';

export interface ListeningInstructionModalProps {
  modal: ListeningInstructionModalVM;
  callbacks: ListeningInstructionCallbacks;
}

export const ListeningInstructionModal: React.FC<ListeningInstructionModalProps> = ({
  modal,
  callbacks,
}) => {
  if (!modal.isOpen) return null;

  return (
    <div
      className="v14-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listening-modal-title"
    >
      <div className="v14-modal-container" style={{ maxWidth: '540px' }}>
        {/* Modal Header & Graphic */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--v14-space-4)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto var(--v14-space-3)',
              borderRadius: 'var(--v14-radius-full)',
              backgroundColor: 'var(--v14-color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
            }}
          >
            🎧
          </div>
          <h2
            id="listening-modal-title"
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--v14-color-text-main)',
              margin: '0 0 6px',
            }}
          >
            {modal.title??'Hướng dẫn phần thi Nghe'}
          </h2>
          <p
            style={{
              fontSize: 'var(--v14-text-sm)',
              color: 'var(--v14-color-text-secondary)',
              margin: 0,
            }}
          >
            {modal.policyLabel??`Tổng cộng ${modal.parts.length} phần. Số lượt nghe và thời gian theo quy tắc nền tảng của chế độ đã chọn.`}
          </p>
        </div>

        {/* Instructions Table */}
        <table className="v14-instructions-table" style={{ marginBottom: 'var(--v14-space-6)' }}>
          <thead>
            <tr>
              <th style={{ width: '70%' }}>Phần thi</th>
              <th style={{ width: '30%', textAlign: 'center' }}>Số câu hỏi</th>
            </tr>
          </thead>
          <tbody>
            {modal.parts.map((p) => (
              <tr key={p.partNumber}>
                <td>
                  <strong style={{ color: 'var(--v14-color-text-main)' }}>
                    Phần {p.partNumber}:
                  </strong>{' '}
                  {p.title}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--v14-color-primary-active)' }}>
                  {p.questionCount} câu
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Audio Equipment Reminder */}
        <div
          style={{
            padding: 'var(--v14-space-3)',
            borderRadius: 'var(--v14-radius-lg)',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--v14-color-border)',
            fontSize: 'var(--v14-text-xs)',
            color: 'var(--v14-color-text-secondary)',
            marginBottom: 'var(--v14-space-6)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>💡</span>
          <span>Hãy điều chỉnh âm lượng tai nghe ở mức phù hợp trước khi làm bài.</span>
        </div>

        {/* Modal Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 'var(--v14-space-3)',
          }}
        >
          {modal.canTestAudio && (
            <Button
              variant="outline"
              size="md"
              onClick={callbacks.onTestAudio}
              aria-label="Kiểm tra tai nghe"
            >
              🔊 Kiểm tra âm thanh
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={callbacks.onConfirm}
            aria-label="Tôi đã hiểu và bắt đầu làm bài"
          >
            Mình hiểu rồi
          </Button>
        </div>
      </div>
    </div>
  );
};
