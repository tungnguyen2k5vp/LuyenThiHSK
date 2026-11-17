import React from 'react';
import { ResultPageViewVM } from '../types/viewmodels';
import { ResultPageCallbacks } from '../types/callbacks';
import { ResultPageViewV14 } from '../components/result/ResultPageViewV14';

export interface ResultWorkspaceViewV14Props {
  data: ResultPageViewVM;
  callbacks: ResultPageCallbacks;
  className?: string;
}

export const ResultWorkspaceViewV14: React.FC<ResultWorkspaceViewV14Props> = ({
  data,
  callbacks,
  className = '',
}) => {
  return (
    <div className={`hsk-ui-v14 ${className}`} style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <ResultPageViewV14 data={data} callbacks={callbacks} />
    </div>
  );
};
