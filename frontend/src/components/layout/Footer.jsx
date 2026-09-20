import React from 'react';
import { Link } from 'react-router-dom';
import { Waves } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 text-slate-200">
          <Waves className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-lg tracking-tight">FloodAtlas</span>
        </div>
        
        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <Link to="/about" className="hover:text-blue-400 transition-colors">
            {t('nav.about') || 'About Us'}
          </Link>
          <Link to="/safety" className="hover:text-blue-400 transition-colors">
            {t('nav.safety') || 'Safety Info'}
          </Link>
          <Link to="/contact" className="hover:text-blue-400 transition-colors">
            {t('nav.contact') || 'Contact'}
          </Link>
        </nav>

        {/* Copyright */}
        <div className="text-sm text-center md:text-right">
          &copy; {currentYear} FloodAtlas. {t('common.allRightsReserved') || 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;