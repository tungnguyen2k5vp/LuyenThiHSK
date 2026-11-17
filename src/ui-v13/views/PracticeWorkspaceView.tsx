import React, { useState } from 'react';
import { PracticeHubVM, QuestionVM, ViewState, CallbackResult } from '../../contracts/ui-v13';
import { PracticeHubView } from '../components/practice/PracticeHubView';

import { QuestionPresentationView } from '../components/question/QuestionPresentationView';
import { Button } from '../primitives/Button';

export interface PracticeWorkspaceViewProps {
  hubModel: PracticeHubVM;
  activeQuestionState?: ViewState<QuestionVM> | null;
  onStartPart: (partId: string, skill: string) => void;
  onStartMixed?: () => void;
  onChooseOption?: (optionId: string) => CallbackResult;
  onMatch?: (itemId: string, optionId: string | null) => CallbackResult;
  onTextChange?: (value: string) => CallbackResult;
  onFlag?: () => CallbackResult;
  onCheck?: () => CallbackResult;
  onRetryImage?: (imageId: string) => CallbackResult;
  onBackToHub?: () => void;
  className?: string;
}

export const PracticeWorkspaceView: React.FC<PracticeWorkspaceViewProps> = ({
  hubModel,
  activeQuestionState,
  onStartPart,
  onStartMixed,
  onChooseOption = () => {},
  onMatch = () => {},
  onTextChange = () => {},
  onFlag = () => {},
  onCheck = () => {},
  onRetryImage = () => {},
  onBackToHub,
  className = '',
}) => {
  const [inQuestionMode, setInQuestionMode] = useState<boolean>(Boolean(activeQuestionState));

  const handleStartPart = (partId: string, skill: string) => {
    onStartPart(partId, skill);
    setInQuestionMode(true);
  };

  const handleBack = () => {
    setInQuestionMode(false);
    if (onBackToHub) {
      onBackToHub();
    }
  };

  return (
    <div className={`hsk-ui-v13 ${className}`} style={{ width: '100%', minHeight: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
        {inQuestionMode && activeQuestionState ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <Button variant="ghost" size="sm" onClick={handleBack} leftIcon={<span>←</span>}>
                Quay lại danh mục bài tập
              </Button>
            </div>
            <QuestionPresentationView
              state={activeQuestionState}
              onChoose={onChooseOption}
              onMatch={onMatch}
              onTextChange={onTextChange}
              onFlag={onFlag}
              onCheck={onCheck}
              onRetryImage={onRetryImage}
              audioCallbacks={null}
            />
          </div>
        ) : (
          <PracticeHubView
            model={hubModel}
            onStartPart={handleStartPart}
            onStartMixed={onStartMixed}
          />
        )}
      </div>
    </div>
  );
};
