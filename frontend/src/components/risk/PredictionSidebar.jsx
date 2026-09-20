import React from 'react';
import { MapPin, ArrowRight, Activity, AlertTriangle, CloudRain, Waves, Droplets, Mountain } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const HINDI_DICT = {
  'authority.selectedLocation': 'चयनित स्थान',
  'authority.viewDetails': 'विवरण देखें',
  'common.noImage': 'कोई छवि नहीं',
  'risk.predictionTitle': 'बाढ़ जोखिम की भविष्यवाणी',
  'common.live': 'लाइव',
  'common.lastUpdated': 'अंतिम अपडेट:',
  'risk.highRisk': 'उच्च जोखिम',
  'risk.flashFloodWarning': 'अचानक बाढ़ की उच्च संभावना।',
  'risk.flashFloodDesc': 'भारी बारिश, नदी का बढ़ता जल स्तर और संतृप्त मिट्टी वर्तमान जोखिम को बढ़ा रहे हैं।',
  'risk.dangerThresholds': 'खतरे की सीमा',
  'metrics.rainfall': 'वर्षा',
  'metrics.riverLevel': 'नदी का जल स्तर',
  'metrics.soilMoisture': 'मिट्टी की नमी',
  'metrics.slopeRisk': 'ढलान का जोखिम',
  'risk.heavyRainAlert': 'अगले 24 घंटों में भारी बारिश की उम्मीद है।',
  'risk.emergencyAction': 'सतर्क रहें, आपातकालीन आवश्यक चीजें तैयार रखें और नदी के किनारों से बचें।'
};

export default function PredictionSidebar() {
  const langContext = useLanguage() || {};
  
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

  return (
    <div className="w-full h-full flex flex-col gap-4">
      
      {/* 1. Selected Location Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm">
            <MapPin className="w-4 h-4" />
            <span>{t('authority.selectedLocation', 'Selected Location')}</span>
          </div>
          <button className="text-blue-600 text-xs flex items-center hover:text-blue-700 transition-colors">
            {t('authority.viewDetails', 'View Details')} <ArrowRight className="w-3 h-3 ml-1" />
          </button>
        </div>
        <div className="flex gap-3">
          <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
            <div className="text-[10px] text-gray-400 font-medium">{t('common.noImage', 'NO IMAGE')}</div>
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 font-bold text-base leading-tight">Raini Village</h3>
            <p className="text-gray-500 text-xs mt-0.5">Dewal Block, Chamoli District<br/>Uttarakhand</p>
            <p className="text-blue-600 text-[10px] mt-1 flex items-center font-medium">
              <MapPin className="w-3 h-3 mr-1" /> 30.4852° N, 79.6974° E
            </p>
          </div>
        </div>
      </div>

      {/* 2. Flood Risk Prediction Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm">
            <Activity className="w-4 h-4" />
            <span>{t('risk.predictionTitle', 'Flood Risk Prediction')}</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px]">
            <span className="flex items-center text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> 
              {t('common.live', 'LIVE')}
            </span>
            <span className="text-gray-500">{t('common.lastUpdated', 'Last updated:')} 10:24 AM</span>
          </div>
        </div>

        {/* Circular Dial & Risk Text */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="#ef4444" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="45.2" strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
              <div className="text-2xl font-bold text-gray-900 leading-none">82</div>
              <div className="text-[9px] text-gray-500 mt-0.5 font-medium">/100</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="inline-block bg-red-50 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded border border-red-200 mb-1.5">
              {t('risk.highRisk', 'HIGH RISK')}
            </div>
            <div className="flex items-start space-x-1.5 text-red-600 text-sm font-bold mb-1 leading-tight">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <p>{t('risk.flashFloodWarning', 'High probability of flash flood.')}</p>
            </div>
            <p className="text-[10px] text-gray-600 leading-snug">
              {t('risk.flashFloodDesc', 'Heavy rainfall, rising river levels and saturated soil are increasing the current risk.')}
            </p>
          </div>
        </div>

        {/* Danger Thresholds */}
        <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
          {t('risk.dangerThresholds', 'Danger Thresholds')}
        </div>
        <div className="grid grid-cols-4 gap-2">
          
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
            <CloudRain className="w-4 h-4 text-blue-500 mb-1" />
            <div className="text-[9px] text-gray-600 font-medium mb-1 leading-tight">{t('metrics.rainfall', 'Rainfall')}</div>
            <div className="text-[11px] font-bold text-red-600">&gt; 100 mm</div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
            <Waves className="w-4 h-4 text-cyan-500 mb-1" />
            <div className="text-[9px] text-gray-600 font-medium mb-1 leading-tight">{t('metrics.riverLevel', 'River Level')}</div>
            <div className="text-[11px] font-bold text-red-600">&gt; 2.5 m</div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
            <Droplets className="w-4 h-4 text-emerald-500 mb-1" />
            <div className="text-[9px] text-gray-600 font-medium mb-1 leading-tight">{t('metrics.soilMoisture', 'Soil Moisture')}</div>
            <div className="text-[11px] font-bold text-red-600">&gt; 70%</div>
          </div>
          
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
            <Mountain className="w-4 h-4 text-orange-500 mb-1" />
            <div className="text-[9px] text-gray-600 font-medium mb-1 leading-tight">{t('metrics.slopeRisk', 'Slope Risk')}</div>
            <div className="text-[11px] font-bold text-orange-600">&gt; 35°</div>
          </div>
          
        </div>

        {/* Warning Banner */}
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div>
            <div className="text-sm font-bold text-red-700 leading-tight">
              {t('risk.heavyRainAlert', 'Heavy rain expected in next 24 hours.')}
            </div>
            <div className="text-[10px] text-red-600 mt-1 leading-snug">
              {t('risk.emergencyAction', 'Stay alert, keep emergency essentials ready and avoid riverbanks.')}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}