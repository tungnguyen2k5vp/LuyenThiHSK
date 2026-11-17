import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/main.css';
import './styles/runtime.css';
import './styles/exam-focus.css';
import './styles/preparation.css';
import './styles/content-v3.css';
import './styles/rich-learning.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch((error: unknown) => console.warn('Offline cache unavailable', error));
  });
}
