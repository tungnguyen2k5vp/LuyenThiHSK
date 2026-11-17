/**
 * HSK UI V14 - ROOT PRESENTATION EXPORTS
 * Pure presentation layer inspired by Migii HSK layout & visual clarity.
 * Completely decoupled from database, backend, scoring engine, and auth.
 */

// Styles
import './styles/index.css';

// Types & Contracts
export * from './types/viewmodels';
export * from './types/callbacks';

// Design Primitives
export * from './primitives';

// Feature Components
export * from './components/catalog';
export * from './components/intro';
export * from './components/exam';
export * from './components/question';
export * from './components/result';

// Workspace Views
export * from './views';

// Test Fixtures
export * from './__fixtures__/mockData';
