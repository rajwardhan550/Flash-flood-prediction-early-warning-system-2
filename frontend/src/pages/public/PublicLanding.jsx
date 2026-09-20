import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, MapPin, ShieldAlert, AlertTriangle, Lock, Search } from 'lucide-react';

import { useLanguage } from '../../hooks/useLanguage';
import { useLocationContext } from '../../hooks/useLocation';
import { useRisk } from '../../hooks/useRisk';
import { translations } from '../../utils/translations';

import RiskTicker from '../../components/alerts/RiskTicker';
import DashboardMap from '../../components/map/DashboardMap';
import LanguageToggle from '../../components/common/LanguageToggle';
import ActiveRouteCard from '../../components/map/ActiveRouteCard';
import WeatherWidget from '../../components/weather/WeatherWidget';

export default function PublicLanding() {
  const { language } = useLanguage();
  const { currentLocation } = useLocationContext();
  const { riskData, isLoading } = useRisk();
  
  const t = translations[language] || translations.en;
  const isHindi = language === 'hi';

  const riskScore = riskData?.score || 82;
  const isHighRisk = riskScore > 75;

  return (
    <div className="flex flex-col bg-slate-50 text-slate-800 font-sans w-full min-h-screen">
      
      {/* 1. PORTAL NAVBAR */}
      <nav className="relative w-full bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-20">
        
        {/* Left: Login Button */}
        <div className="flex items-center">
          <Link 
            to="/authority" 
            className="flex items-center gap-2 text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-blue-200 shadow-sm"
          >
            <Lock className="w-4 h-4" />
            {isHindi ? 'अधिकारी लॉगिन' : 'Authority Login'}
          </Link>
        </div>

        {/* Center: Title (Navy Blue, Location Removed) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
          <span className="font-extrabold text-blue-900 text-xs tracking-widest uppercase">
            {t.appTitle}
          </span>
        </div>

        {/* Right: Language Toggle */}
        <div className="flex items-center gap-3">
           <LanguageToggle />
        </div>
      </nav>

      {/* 2. CENTERED ALERT TICKER */}
      <header className="w-full bg-white border-b border-slate-200 z-10 shadow-sm">
        <RiskTicker isHindi={isHindi} />
      </header>

      {/* 3. MAIN SPLIT LAYOUT */}
      <main className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 overflow-x-hidden items-stretch flex-1">
        
        {/* LEFT COLUMN: Evacuation Map */}
        <section className="flex flex-col h-full order-2 lg:order-1">
          
          {/* SYMMETRICAL HEADER */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 px-1 lg:min-h-[80px] pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm uppercase tracking-wider font-bold text-slate-600">
                {isHindi ? 'लाइव निकासी मानचित्र' : 'Live Evacuation Map'}
              </h2>
            </div>
            
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full xl:w-72">
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                placeholder={isHindi ? "स्थान खोजें..." : "Search location..."}
                className="w-full py-2.5 px-1 text-sm text-slate-700 focus:outline-none placeholder-slate-400 font-medium"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-bold transition-colors">
                {isHindi ? 'खोजें' : 'Search'}
              </button>
            </div>
          </div>
          
          {/* MAP CONTAINER */}
          <div className="w-full rounded-xl overflow-hidden shadow-sm border border-slate-200 relative bg-white flex-1 min-h-[450px]">
            <DashboardMap 
              location={currentLocation} 
              language={language}
            />
          </div>
          
          {/* FOOTER TEXT */}
          <div className="pt-3 lg:min-h-[32px]">
            <p className="text-xs text-slate-500 text-center px-4 font-medium">
              {isHindi 
                ? 'मानचित्र पर ज़ूम करने के लिए दो उंगलियों का उपयोग करें। यह मार्ग वर्तमान जल स्तर के आधार पर स्वचालित रूप से अपडेट होता है।' 
                : 'Use two fingers to zoom on the map. This route updates automatically based on current water levels.'}
            </p>
          </div>
        </section>


        {/* RIGHT COLUMN: Risk Data & Controls */}
        <section className="flex flex-col h-full order-1 lg:order-2">
          
          {/* SYMMETRICAL HEADER */}
          <div className="text-left hidden lg:flex flex-col justify-center lg:min-h-[80px] pb-4">
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight leading-none mb-1">
              {isHindi ? 'नागरिक सुरक्षा पोर्टल' : 'Citizen Safety Portal'}
            </h1>
            {/* Subtitle (Navy Blue, Location Removed) */}
            <p className="text-sm text-blue-900 font-extrabold uppercase tracking-wide">
              {t.appTitle}
            </p>
          </div>

          {/* CARDS CONTAINER */}
          <div className="flex flex-col justify-between flex-1 gap-4">
            
            {/* Immediate Status Dial Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-8 shadow-sm">
              <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90 drop-shadow-sm">
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                  <circle 
                    cx="64" cy="64" r="56" 
                    fill="transparent" 
                    stroke={isHighRisk ? '#ef4444' : '#10b981'} 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeDasharray="352" 
                    strokeDashoffset={352 - (352 * riskScore) / 100} 
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                <div className="text-center z-10 flex flex-col items-center justify-center rounded-full bg-white w-24 h-24 shadow-sm border border-slate-100">
                  <span className="text-4xl font-black text-slate-800 leading-none">{riskScore}</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">/ 100</span>
                </div>
              </div>

              <div className="text-center sm:text-left space-y-3">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${isHighRisk ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {isHighRisk ? (isHindi ? 'उच्च जोखिम' : 'High Risk') : (isHindi ? 'सामान्य' : 'Normal')}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  {isHighRisk 
                    ? (isHindi ? 'फ्लैश फ्लड की उच्च संभावना। भारी बारिश और जल स्तर बढ़ने के कारण वर्तमान जोखिम बढ़ रहा है।' : 'High probability of flash flood. Heavy rainfall and rising river levels are increasing current risk.')
                    : (isHindi ? 'वर्तमान में स्थिति सामान्य है। किसी तत्काल कार्रवाई की आवश्यकता नहीं है।' : 'Conditions are currently normal. No immediate action required.')}
                </p>
              </div>
            </div>

            {/* Weather Forecast Widget */}
            <WeatherWidget />

            {/* Emergency Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 transition-colors shadow-sm min-h-[110px] group">
                <div className="bg-red-50 p-2.5 rounded-lg group-hover:bg-red-100 transition-colors">
                  <PhoneCall className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm font-bold text-slate-800 text-center">{t.emergencyContacts}</span>
                <span className="text-xs text-slate-500 font-medium">1077 / 112</span>
              </button>
              
              <button className="flex flex-col items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 transition-colors shadow-sm min-h-[110px] group">
                <div className="bg-emerald-50 p-2.5 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-slate-800 text-center">{t.safeShelters}</span>
                <span className="text-xs text-slate-500 font-medium">{isHindi ? 'निकटतम मार्ग खोजें' : 'Find Nearest Route'}</span>
              </button>
            </div>

            {/* Step-by-Step Route Details */}
            <ActiveRouteCard />

          </div>

          {/* INVISIBLE SPACER */}
          <div className="hidden lg:block pt-3 lg:min-h-[32px]"></div>

        </section>
      </main>
    </div>
  );
}