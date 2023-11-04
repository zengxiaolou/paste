import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import './i18n/index';
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document?.getElementById('root')!);

root.render(
  <HashRouter>
    <App />
  </HashRouter>
);

reportWebVitals();
