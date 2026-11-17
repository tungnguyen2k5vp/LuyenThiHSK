import React from 'react';
import { GrammarCatalogViewModel } from '../types/viewmodels';
import { GrammarCallbacks } from '../types/callbacks';
import { GrammarCatalogView } from '../components/grammar/GrammarCatalogView';

export interface GrammarWorkspaceViewProps {
  model: GrammarCatalogViewModel;
  callbacks: GrammarCallbacks;
  className?: string;
}

export const GrammarWorkspaceView: React.FC<GrammarWorkspaceViewProps> = ({
  model,
  callbacks,
  className = '',
}) => {
  return (
    <div className={`hsk-ui-v13 ${className}`} style={{ width: '100%', minHeight: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
        <GrammarCatalogView model={model} callbacks={callbacks} />
      </div>
    </div>
  );
};
