import React from 'react';
import ReactDOM from 'react-dom/client';
import './fonts/audreyshand.ttf';
import './styles/reset.css';
import './styles/index.css';
import Main from './main';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);