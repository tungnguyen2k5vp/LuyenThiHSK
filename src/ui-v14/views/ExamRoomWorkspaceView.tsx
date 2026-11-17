import React from 'react';
import {
  ExamNavigatorVM,
  ExamTimerVM,
  ListeningTrueFalseVM,
  ListeningImageChoiceVM,
  ListeningMatchingVM,
  ListeningDialogueVM,
} from '../types/viewmodels';
import { ExamRoomCallbacks } from '../types/callbacks';
import { ExamRoomShell } from '../components/exam/ExamRoomShell';
import { ListeningTrueFalse } from '../components/question/ListeningTrueFalse';
import { ListeningImageChoice } from '../components/question/ListeningImageChoice';
import { ListeningMatching } from '../components/question/ListeningMatching';
import { ListeningDialogue } from '../components/question/ListeningDialogue';
import { ReadingPassageQuestion, ReadingPassageQuestionVM } from '../components/question/ReadingPassageQuestion';
import { WritingWorkspaceV14, WritingWorkspaceVM } from '../components/question/WritingWorkspaceV14';

export type ActiveQuestionVM =
  | { type: 'listening_true_false'; data: ListeningTrueFalseVM }
  | { type: 'listening_image_choice'; data: ListeningImageChoiceVM }
  | { type: 'listening_matching'; data: ListeningMatchingVM }
  | { type: 'listening_dialogue'; data: ListeningDialogueVM }
  | { type: 'reading_passage'; data: ReadingPassageQuestionVM }
  | { type: 'writing'; data: WritingWorkspaceVM };

export interface ExamRoomWorkspaceViewProps {
  examTitle: string;
  mode: 'practice' | 'mock';
  navigator: ExamNavigatorVM;
  timer: ExamTimerVM;
  activeQuestion?: ActiveQuestionVM;
  callbacks: ExamRoomCallbacks;
  customQuestionContent?: React.ReactNode;
  className?: string;
}

export const ExamRoomWorkspaceView: React.FC<ExamRoomWorkspaceViewProps> = ({
  examTitle,
  mode,
  navigator,
  timer,
  activeQuestion,
  callbacks,
  customQuestionContent,
  className = '',
}) => {
  const renderQuestionContent = () => {
    if (customQuestionContent) {
      return customQuestionContent;
    }

    if (!activeQuestion) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--v14-color-text-muted)' }}>
          Đang tải dữ liệu câu hỏi...
        </div>
      );
    }

    switch (activeQuestion.type) {
      case 'listening_true_false':
        return (
          <ListeningTrueFalse
            data={activeQuestion.data}
            onAnswer={(ans) => callbacks.onAnswerTrueFalse?.(activeQuestion.data.id, ans)}
            onPrevious={callbacks.onPreviousQuestion}
            onNext={callbacks.onNextQuestion}
            audioCallbacks={callbacks.audioCallbacks}
          />
        );
      case 'listening_image_choice':
        return (
          <ListeningImageChoice
            data={activeQuestion.data}
            onAnswer={(optId) => callbacks.onAnswerChoice?.(activeQuestion.data.id, optId)}
            onPrevious={callbacks.onPreviousQuestion}
            onNext={callbacks.onNextQuestion}
            audioCallbacks={callbacks.audioCallbacks}
          />
        );
      case 'listening_matching':
        return (
          <ListeningMatching
            data={activeQuestion.data}
            onAnswerSubQuestion={(subId, optId) => callbacks.onAnswerMatching?.(subId, optId)}
            onPrevious={callbacks.onPreviousQuestion}
            onNext={callbacks.onNextQuestion}
            audioCallbacks={callbacks.audioCallbacks}
          />
        );
      case 'listening_dialogue':
        return (
          <ListeningDialogue
            data={activeQuestion.data}
            onAnswer={(optId) => callbacks.onAnswerChoice?.(activeQuestion.data.id, optId)}
            onPrevious={callbacks.onPreviousQuestion}
            onNext={callbacks.onNextQuestion}
            audioCallbacks={callbacks.audioCallbacks}
          />
        );
      case 'reading_passage':
        return (
          <ReadingPassageQuestion
            data={activeQuestion.data}
            onAnswer={(optId) => callbacks.onAnswerChoice?.(activeQuestion.data.id, optId)}
            onPrevious={callbacks.onPreviousQuestion}
            onNext={callbacks.onNextQuestion}
          />
        );
      case 'writing':
        return (
          <WritingWorkspaceV14
            data={activeQuestion.data}
            onUpdateReorder={(ids) => callbacks.onAnswerText?.(activeQuestion.data.id, ids.join(','))}
            onUpdateText={(text) => callbacks.onAnswerText?.(activeQuestion.data.id, text)}
            onPrevious={callbacks.onPreviousQuestion}
            onNext={callbacks.onNextQuestion}
          />
        );
      default:
        return <div>Loại câu hỏi không xác định.</div>;
    }
  };

  return (
    <div className={`hsk-ui-v14 ${className}`}>
      <ExamRoomShell
        examTitle={examTitle}
        mode={mode}
        navigator={navigator}
        timer={timer}
        onSelectSkill={callbacks.onSelectSkill}
        onSelectQuestion={callbacks.onSelectQuestion}
        onSubmitExam={callbacks.onSubmitExam}
        onBack={callbacks.onBack}
      >
        {renderQuestionContent()}
      </ExamRoomShell>
    </div>
  );
};
