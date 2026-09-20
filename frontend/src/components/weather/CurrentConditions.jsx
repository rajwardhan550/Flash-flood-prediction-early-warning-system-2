import React from 'react';
import { Activity, CloudRain, Waves, Droplets, Thermometer, Mountain } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const HINDI_DICT = {
  'weather.currentConditions': 'वर्तमान स्थिति',
  'weather.liveData': 'सेंसर और मौसम स्रोतों से लाइव डेटा',
  'common.lastUpdated': 'अंतिम अपडेट:',
  'common.live': 'लाइव',
  'metrics.rainfall': 'वर्षा (पिछले 1 घंटे)',
  'metrics.riverLevel': 'नदी का जलस्तर',
  'metrics.soilMoisture': 'मिट्टी की नमी',
  'metrics.temperature': 'तापमान',
  'metrics.slopeRisk': 'ढलान का जोखिम',
  'status.high': '↑ उच्च',
  'status.rising': '↑ बढ़ रहा है',
  'status.normal': '↓ सामान्य',
  'status.moderate': '⚠ मध्यम'
};

export default function CurrentConditions() {
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
    <div className="w-full h-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-gray-900 font-bold text-sm">
              {t('weather.currentConditions', 'Current Conditions')}
            </h3>
            <p className="text-[10px] text-gray-500 font-medium">
              {t('weather.liveData', 'Live data from sensors & weather sources')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="text-gray-500 font-medium">{t('common.lastUpdated', 'Last updated:')} 10:24 AM</span>
          <span className="flex items-center text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> 
            {t('common.live', 'Live')}
          </span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-5 gap-3">
        {/* Rainfall */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex flex-col justify-between">
          <div className="flex items-start text-[11px] lg:text-xs text-gray-600 font-medium mb-2 leading-tight min-h-[32px]">
            <CloudRain className="w-3.5 h-3.5 mr-1.5 text-blue-500 flex-shrink-0 mt-0.5" /> 
            <span className="break-words">{t('metrics.rainfall', 'Rainfall (Past 1h)')}</span>
          </div>
          <div>
            <div className="text-xl font-black text-gray-900 mb-1">112 <span className="text-xs text-gray-500 font-semibold">mm</span></div>
            <div className="text-[10px] font-bold text-red-600">{t('status.high', '↑ High')}</div>
          </div>
        </div>
        
        {/* River Level */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex flex-col justify-between">
          <div className="flex items-start text-[11px] lg:text-xs text-gray-600 font-medium mb-2 leading-tight min-h-[32px]">
            <Waves className="w-3.5 h-3.5 mr-1.5 text-cyan-500 flex-shrink-0 mt-0.5" /> 
            <span className="break-words">{t('metrics.riverLevel', 'River Water Level')}</span>
          </div>
          <div>
            <div className="text-xl font-black text-gray-900 mb-1">2.45 <span className="text-xs text-gray-500 font-semibold">m</span></div>
            <div className="text-[10px] font-bold text-red-600">{t('status.rising', '↑ Rising')}</div>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex flex-col justify-between">
          <div className="flex items-start text-[11px] lg:text-xs text-gray-600 font-medium mb-2 leading-tight min-h-[32px]">
            <Droplets className="w-3.5 h-3.5 mr-1.5 text-emerald-500 flex-shrink-0 mt-0.5" /> 
            <span className="break-words">{t('metrics.soilMoisture', 'Soil Moisture')}</span>
          </div>
          <div>
            <div className="text-xl font-black text-gray-900 mb-1">78%</div>
            <div className="text-[10px] font-bold text-red-600">{t('status.high', '↑ High')}</div>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex flex-col justify-between">
          <div className="flex items-start text-[11px] lg:text-xs text-gray-600 font-medium mb-2 leading-tight min-h-[32px]">
            <Thermometer className="w-3.5 h-3.5 mr-1.5 text-blue-500 flex-shrink-0 mt-0.5" /> 
            <span className="break-words">{t('metrics.temperature', 'Temperature')}</span>
          </div>
          <div>
            <div className="text-xl font-black text-gray-900 mb-1">16°C</div>
            <div className="text-[10px] font-bold text-emerald-600">{t('status.normal', '↓ Normal')}</div>
          </div>
        </div>

        {/* Slope Risk */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 flex flex-col justify-between">
          <div className="flex items-start text-[11px] lg:text-xs text-gray-600 font-medium mb-2 leading-tight min-h-[32px]">
            <Mountain className="w-3.5 h-3.5 mr-1.5 text-orange-500 flex-shrink-0 mt-0.5" /> 
            <span className="break-words">{t('metrics.slopeRisk', 'Slope Risk')}</span>
          </div>
          <div>
            <div className="text-xl font-black text-gray-900 mb-1">32°</div>
            <div className="text-[10px] font-bold text-orange-600">{t('status.moderate', '⚠ Moderate')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}