import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext(null);

// Placeholder dictionary to prevent UI components from breaking.
// We return null from the `t` function if a key isn't found so components fall back to their default English strings.
const translations = {
  hi: {
    'nav.home': 'होम',
    'nav.liveMap': 'लाइव मैप',
    'nav.weather': 'मौसम',
    'nav.safety': 'सुरक्षा जानकारी',
    'common.loading': 'लोड हो रहा है...',
    'common.today': 'आज',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => {
    if (language === 'en') return null; // Component handles default
    return translations[language]?.[key] || null;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};