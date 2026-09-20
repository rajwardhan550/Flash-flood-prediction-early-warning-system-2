import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files directly
import enTranslations from './en.json';
import hiTranslations from './hi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations }
    },
    lng: 'en',          // Default language on load
    fallbackLng: 'en',  // Fallback if a translation key is missing
    interpolation: {
      escapeValue: false // React already protects against XSS
    }
  });

export default i18n;