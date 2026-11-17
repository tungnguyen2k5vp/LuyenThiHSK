import React from 'react';
import { MistakeReviewVM } from '../../contracts/ui-v13';
import { MistakeReviewView } from '../components/mistakes/MistakeReviewView';

export interface MistakeReviewWorkspaceViewProps {
  model: MistakeReviewVM;
  onReviewQuestion: (reviewId: string) => void;
  onMarkReviewed?: (reviewId: string) => void;
  onStartDueReview?: () => void;
  onBack?: () => void;
  className?: string;
}

export const MistakeReviewWorkspaceView: React.FC<MistakeReviewWorkspaceViewProps> = ({
  model,
  onReviewQuestion,
  onMarkReviewed,
  onStartDueReview,
  onBack,
  className = '',
}) => {
  return (
    <div className={`hsk-ui-v13 ${className}`} style={{ width: '100%', minHeight: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
        <MistakeReviewView
          model={model}
          onReviewQuestion={onReviewQuestion}
          onMarkReviewed={onMarkReviewed}
          onStartDueReview={onStartDueReview}
          onBack={onBack}
        />
      </div>
    </div>
  );
};
