import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global Styles (Tailwind & custom Leaflet overrides)
import './styles/index.css';

// i18n initialization
import './locales/i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);