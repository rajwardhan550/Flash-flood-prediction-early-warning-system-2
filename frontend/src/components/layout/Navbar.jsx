import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Waves } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import LocationSelector from '../common/LocationSelector';
import LanguageSelector from '../common/LanguageSelector';

const Navbar = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Navigation schema matching the mockup
  const navLinks = [
    { path: '/', label: t('nav.home') || 'Home' },
    { path: '/live-map', label: t('nav.liveMap') || 'Live Map' },
    { path: '/weather', label: t('nav.weather') || 'Weather' },
    { path: '/safety', label: t('nav.safety') || 'Safety Info' },
    { path: '/about', label: t('nav.about') || 'About' },
  ];

  return (
    <nav className="w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
      
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="bg-blue-600/20 p-1.5 rounded-lg group-hover:bg-blue-600/30 transition-colors">
          <Waves className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex flex-col hidden sm:flex">
          <span className="font-bold text-xl text-slate-100 leading-none tracking-tight">FloodAtlas</span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
            {t('common.tagline') || 'Early Warning for Uttarakhand'}
          </span>
        </div>
      </Link>

      {/* Center Navigation Links (Hidden on mobile) */}
      <div className="hidden lg:flex items-center gap-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden md:block">
          <LocationSelector />
        </div>
        
        <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
        
        <LanguageSelector />
        
        <button 
          onClick={() => navigate('/login')}
          className="ml-1 sm:ml-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-sm shadow-blue-900/20 whitespace-nowrap"
        >
          {t('nav.authorityLogin') || 'Authority Login'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;