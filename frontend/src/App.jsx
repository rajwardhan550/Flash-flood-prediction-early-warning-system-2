import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Providers linked without file extensions so Vite handles it automatically
import { LanguageProvider } from './hooks/useLanguage';
// This should be line 6
import { LocationProvider } from './hooks/useLocation';

// Pages linked
import Home from './pages/public/Home'; 
import PublicLanding from './pages/public/PublicLanding';

export default function App() {
  return (
    <LanguageProvider>
      <LocationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLanding />} />
            <Route path="/authority" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </LocationProvider>
    </LanguageProvider>
  );
}