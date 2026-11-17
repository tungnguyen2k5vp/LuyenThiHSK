import React from 'react';
import { WritingWorkspaceProps } from '../../contracts/ui-v13';
import { WritingWorkspace } from '../components/writing/WritingWorkspace';

import { Button } from '../primitives/Button';

export interface WritingWorkspaceViewProps extends WritingWorkspaceProps {
  onBack?: () => void;
  className?: string;
}

export const WritingWorkspaceView: React.FC<WritingWorkspaceViewProps> = ({
  writing,
  onInput,
  onCompositionStart,
  onCompositionEnd,
  onSave,
  onBack,
  className = '',
}) => {
  return (
    <div className={`hsk-ui-v13 ${className}`} style={{ width: '100%', minHeight: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
        {onBack && (
          <div style={{ marginBottom: '1rem' }}>
            <Button variant="ghost" size="sm" onClick={onBack} leftIcon={<span>←</span>}>
              Quay lại danh sách câu hỏi
            </Button>
          </div>
        )}
        <WritingWorkspace
          writing={writing}
          onInput={onInput}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          onSave={onSave}
        />
      </div>
    </div>
  );
};
