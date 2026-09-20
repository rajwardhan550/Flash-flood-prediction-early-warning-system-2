import { Waves, MapPin, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#0b1120] border-b border-slate-800/50">
      
      {/* 1. Logo & Branding */}
      <div className="flex items-center space-x-3">
        <Waves className="w-8 h-8 text-blue-500" />
        <div className="leading-tight">
          <div className="text-xl font-bold text-white tracking-wide">{t('common.appName')}</div>
          <div className="text-[10px] text-slate-400 font-medium">{t('common.tagline')}</div>
        </div>
      </div>

      {/* 2. Main Navigation */}
      <nav className="hidden md:flex items-center space-x-1 text-sm font-medium text-slate-300">
        <a href="#" className="bg-blue-900/40 text-blue-400 px-4 py-1.5 rounded-full border border-blue-800/50">
          {t('nav.home')}
        </a>
        <a href="#" className="hover:text-white px-4 py-1.5 transition-colors">{t('nav.liveMap')}</a>
        <a href="#" className="hover:text-white px-4 py-1.5 transition-colors">{t('nav.weather')}</a>
        <a href="#" className="hover:text-white px-4 py-1.5 transition-colors">{t('nav.safety')}</a>
        <a href="#" className="hover:text-white px-4 py-1.5 transition-colors">{t('nav.about')}</a>
      </nav>

      {/* 3. Right Side Controls */}
      <div className="flex items-center space-x-4">
        
        {/* Location Dropdown */}
        <button className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 transition-colors text-left">
          <MapPin className="w-4 h-4 text-blue-400" />
          <div className="leading-none">
            <div className="text-white text-sm font-semibold">Chamoli</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Uttarakhand</div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
        </button>

        {/* Language Toggle */}
        <div className="flex bg-slate-800 rounded-md p-1 border border-slate-700">
          <button 
            onClick={() => i18n.changeLanguage('en')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            EN
          </button>
          <button 
            onClick={() => i18n.changeLanguage('hi')}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${i18n.language === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            हिन्दी
          </button>
        </div>

        {/* Login Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-md text-sm font-semibold transition-colors shadow-lg shadow-blue-900/20">
          {t('nav.authorityLogin')}
        </button>
      </div>
    </header>
  );
}