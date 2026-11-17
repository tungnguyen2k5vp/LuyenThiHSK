import React from 'react';
import { ResultVM, ActionVM } from '../../contracts/ui-v13';
import { ResultPageView } from '../components/result/ResultPageView';


export interface ResultWorkspaceViewProps {
  model: ResultVM;
  onExecuteAction?: (action: ActionVM) => void;
  onBackToToday?: () => void;
  onBackToLevelHub?: () => void;
  className?: string;
}

export const ResultWorkspaceView: React.FC<ResultWorkspaceViewProps> = ({
  model,
  onExecuteAction,
  onBackToToday,
  onBackToLevelHub,
  className = '',
}) => {
  return (
    <div className={`hsk-ui-v13 ${className}`} style={{ width: '100%', minHeight: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
        <ResultPageView
          model={model}
          onExecuteAction={onExecuteAction}
          onBackToToday={onBackToToday}
          onBackToLevelHub={onBackToLevelHub}
        />
      </div>
    </div>
  );
};
