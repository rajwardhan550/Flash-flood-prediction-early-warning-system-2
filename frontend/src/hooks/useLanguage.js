import React, { createContext, useContext, useState } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const t = language === 'hi' ? hi : en;

  // Pure JavaScript rendering, no JSX tags required
  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}