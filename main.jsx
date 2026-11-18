import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import App from './App.jsx';
import './styles/fonts.js';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* HashRouter: GitHub Pages ne podržava serversko preusmeravanje, pa # rute rade svuda */}
    <HashRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>,
);
