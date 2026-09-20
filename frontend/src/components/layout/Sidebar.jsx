import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Radio, Activity, Droplets, 
  ShieldAlert, Users, Settings, Database, LogOut, Waves
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// Internal Fallback Dictionary for robust translation
const HINDI_DICT = {
  'nav.overview': 'कमांड सेंटर',
  'nav.liveMap': 'लाइव मैप',
  'nav.broadcast': 'आपातकालीन प्रसारण',
  'nav.predictions': 'एमएल भविष्यवाणियां',
  'nav.sensors': 'सेंसर नेटवर्क',
  'nav.logout': 'लॉग आउट'
};

const Sidebar = ({ role = 'authority' }) => {
  const langContext = useLanguage() || {};
  const navigate = useNavigate();

  // Smart detect if Hindi is active
  const isHindiActive = 
    langContext.language === 'hi' || 
    langContext.locale === 'hi-IN' || 
    (typeof window !== 'undefined' && window.localStorage.getItem('language') === 'hi') ||
    (typeof document !== 'undefined' && document.documentElement.lang === 'hi');

  const t = (key, englishFallback) => {
    try {
      if (typeof langContext.t === 'function') {
        const val = langContext.t(key);
        if (val && val !== key) return val; 
      }
    } catch (e) {}
    if (isHindiActive && HINDI_DICT[key]) return HINDI_DICT[key];
    return englishFallback;
  };

  // Links specific to operational authorities (NDRF, District Officials)
  const authorityLinks = [
    { path: '/authority/overview', icon: LayoutDashboard, label: t('nav.overview', 'Command Center') },
    { path: '/authority/map', icon: Map, label: t('nav.liveMap', 'Live Risk Map') },
    { path: '/authority/broadcast', icon: Radio, label: t('nav.broadcast', 'Emergency Broadcast') },
    { path: '/authority/predictions', icon: Activity, label: t('nav.predictions', 'ML Predictions') },
    { path: '/authority/sensors', icon: Droplets, label: t('nav.sensors', 'Sensor Network') },
  ];

  // Links specific to system administrators
  const adminLinks = [
    { path: '/admin/overview', icon: LayoutDashboard, label: 'System Overview' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/zones', icon: Map, label: 'Zones & Regions' },
    { path: '/admin/sources', icon: Database, label: 'Data Sources' },
    { path: '/admin/alerts', icon: ShieldAlert, label: 'Alert History' },
    { path: '/admin/settings', icon: Settings, label: 'System Settings' },
  ];

  const links = role === 'admin' ? adminLinks : authorityLinks;

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
        <Waves className="w-6 h-6 text-blue-600 mr-2" />
        <span className="font-bold text-lg text-gray-900">
          FloodAtlas 
          <span className="text-[10px] text-blue-700 font-bold ml-2 uppercase tracking-wider bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
            {role}
          </span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-5">
        <ul className="space-y-1.5 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-gray-200 shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {t('nav.logout', 'Sign Out')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;