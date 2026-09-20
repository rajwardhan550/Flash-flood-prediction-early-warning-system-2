import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          language === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('hi')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
          language === 'hi' 
            ? 'bg-blue-600 text-white' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};

export default LanguageSelector;