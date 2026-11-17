import React from 'react';
import { ExamCatalogVM } from '../types/viewmodels';
import { ExamCatalogCallbacks } from '../types/callbacks';
import { ExamCatalogView } from '../components/catalog/ExamCatalogView';

export interface ExamCatalogWorkspaceViewProps {
  catalog: ExamCatalogVM;
  callbacks: ExamCatalogCallbacks;
  className?: string;
}

export const ExamCatalogWorkspaceView: React.FC<ExamCatalogWorkspaceViewProps> = ({
  catalog,
  callbacks,
  className = '',
}) => {
  return (
    <div className={`hsk-ui-v14 ${className}`} style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <ExamCatalogView catalog={catalog} callbacks={callbacks} />
    </div>
  );
};
