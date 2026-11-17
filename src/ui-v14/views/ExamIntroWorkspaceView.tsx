import React, { useState } from 'react';
import { ExamIntroVM, ListeningInstructionModalVM } from '../types/viewmodels';
import { ExamIntroCallbacks, ListeningInstructionCallbacks } from '../types/callbacks';
import { ExamIntroCard } from '../components/intro/ExamIntroCard';
import { ListeningInstructionModal } from '../components/intro/ListeningInstructionModal';

export interface ExamIntroWorkspaceViewProps {
  intro: ExamIntroVM;
  instructionModal?: ListeningInstructionModalVM;
  callbacks: ExamIntroCallbacks & {
    onConfirmInstructions?: () => void;
    onTestAudio?: () => void;
  };
  className?: string;
}

export const ExamIntroWorkspaceView: React.FC<ExamIntroWorkspaceViewProps> = ({
  intro,
  instructionModal,
  callbacks,
  className = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartExam = (examId: string, mode: 'practice' | 'mock') => {
    if (instructionModal) {
      setIsModalOpen(true);
    } else {
      callbacks.onStartExam(examId, mode);
    }
  };

  const handleConfirmInstructions = () => {
    setIsModalOpen(false);
    callbacks.onConfirmInstructions?.();
    callbacks.onStartExam(intro.examId, intro.examMode);
  };

  const modalConfig: ListeningInstructionModalVM = instructionModal || {
    isOpen: isModalOpen,
    canTestAudio: true,
    parts: [
      { partNumber: 1, title: 'Đúng hay Sai', questionCount: 5 },
      { partNumber: 2, title: 'Chọn ảnh phù hợp', questionCount: 5 },
      { partNumber: 3, title: 'Ghép ảnh với Audio', questionCount: 5 },
      { partNumber: 4, title: 'Hội thoại ngắn', questionCount: 5 },
    ],
  };

  const modalCallbacks: ListeningInstructionCallbacks = {
    onClose: () => setIsModalOpen(false),
    onConfirm: handleConfirmInstructions,
    onTestAudio: callbacks.onTestAudio,
  };

  return (
    <div className={`hsk-ui-v14 ${className}`} style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: 'var(--v14-space-4)' }}>
      <ExamIntroCard
        intro={intro}
        callbacks={{
          ...callbacks,
          onStartExam: handleStartExam,
        }}
      />

      <ListeningInstructionModal
        modal={{ ...modalConfig, isOpen: isModalOpen || (instructionModal?.isOpen ?? false) }}
        callbacks={modalCallbacks}
      />
    </div>
  );
};
