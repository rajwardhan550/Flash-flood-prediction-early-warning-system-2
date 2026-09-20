import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    // Outer Pill Container
    <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200 rounded-lg p-1 shadow-inner">
      
      {/* Icon to make it globally recognizable */}
      <div className="pl-1.5 pr-1 text-slate-400">
        <Languages className="w-4 h-4" />
      </div>

      {/* Toggle Buttons */}
      <div className="flex relative">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ease-in-out ${
            language === 'en'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
          }`}
          title="Switch to English"
        >
          EN
        </button>
        
        <button
          onClick={() => setLanguage('hi')}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 ease-in-out ${
            language === 'hi'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
          }`}
          title="Switch to Hindi"
        >
          हि
        </button>
      </div>
    </div>
  );
}