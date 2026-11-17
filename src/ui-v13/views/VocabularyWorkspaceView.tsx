import React, { useState } from 'react';
import { VocabBrowserViewModel, FlashcardViewModel } from '../types/viewmodels';
import { VocabBrowserCallbacks, FlashcardCallbacks } from '../types/callbacks';
import { VocabBrowserView } from '../components/vocab/VocabBrowserView';
import { FlashcardView } from '../components/vocab/FlashcardView';

export interface VocabularyWorkspaceViewProps {
  model: VocabBrowserViewModel;
  callbacks: VocabBrowserCallbacks;
  flashcardModel?: FlashcardViewModel;
  flashcardCallbacks?: FlashcardCallbacks;
  initialMode?: 'browser' | 'flashcard';
  className?: string;
}

export const VocabularyWorkspaceView: React.FC<VocabularyWorkspaceViewProps> = ({
  model,
  callbacks,
  flashcardModel,
  flashcardCallbacks,
  initialMode = 'browser',
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'browser' | 'flashcard'>(initialMode);
  const [localCardIndex, setLocalCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const activeFlashcardModel: FlashcardViewModel = flashcardModel || {
    items: model.items,
    currentIndex: localCardIndex,
    isFlipped: isFlipped,
  };

  const activeFlashcardCallbacks: FlashcardCallbacks = flashcardCallbacks || {
    onFlip: () => setIsFlipped((prev) => !prev),
    onNext: () => {
      setIsFlipped(false);
      setLocalCardIndex((prev) => Math.min(prev + 1, model.items.length - 1));
    },
    onPrevious: () => {
      setIsFlipped(false);
      setLocalCardIndex((prev) => Math.max(prev - 1, 0));
    },
    onPlayAudio: callbacks.onPlayAudio,
    onToggleFavorite: callbacks.onToggleFavorite,
    onMarkLearned: (id: string) => {
      callbacks.onToggleLearned(id);
      // Auto advance to next card after marking learned
      setIsFlipped(false);
      setLocalCardIndex((prev) => Math.min(prev + 1, model.items.length - 1));
    },
    onMarkNeedReview: (_id: string) => {
      // Advance to next card
      setIsFlipped(false);
      setLocalCardIndex((prev) => Math.min(prev + 1, model.items.length - 1));
    },
    onClose: () => setViewMode('browser'),
  };

  const handleOpenFlashcards = () => {
    callbacks.onOpenFlashcards();
    setViewMode('flashcard');
  };

  return (
    <div className={`hsk-ui-v13 ${className}`} style={{ width: '100%', minHeight: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
        {viewMode === 'flashcard' ? (
          <FlashcardView
            model={activeFlashcardModel}
            callbacks={activeFlashcardCallbacks}
          />
        ) : (
          <VocabBrowserView
            model={model}
            callbacks={{
              ...callbacks,
              onOpenFlashcards: handleOpenFlashcards,
            }}
          />
        )}
      </div>
    </div>
  );
};
