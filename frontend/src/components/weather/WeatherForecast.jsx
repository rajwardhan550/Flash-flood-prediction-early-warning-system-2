import React from 'react';
import { CloudRain, Wind, Droplets, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const HINDI_DICT = {
  'weather.title': 'मौसम पूर्वानुमान',
  'weather.viewFull': 'पूरा पूर्वानुमान देखें',
  'common.today': 'आज',
  'weather.heavyRain': 'भारी बारिश',
  'weather.feelsLike': 'महसूस होता है',
  'common.now': 'अभी'
};

export default function WeatherForecast() {
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
        <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm">
          <CloudRain className="w-5 h-5 flex-shrink-0" />
          <span>{t('weather.title', 'Weather Forecast')}</span>
        </div>
        <button className="text-blue-600 text-xs flex items-center font-medium hover:text-blue-800 transition-colors flex-shrink-0">
          {t('weather.viewFull', 'View Full Forecast')} <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Today Main - Using a soft blue tint for weather context */}
        <div className="w-1/3 bg-blue-50/50 rounded-lg border border-blue-100 p-3 flex flex-col justify-between">
          <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('common.today', 'Today')}</div>
          <div className="flex items-center space-x-3 my-2">
            <CloudRain className="w-10 h-10 text-blue-500 flex-shrink-0" />
            <div>
              <div className="text-2xl font-black text-gray-900">18°C</div>
              <div className="text-[10px] font-bold text-blue-700 leading-tight mt-0.5">{t('weather.heavyRain', 'Heavy Rain')}</div>
              <div className="text-[10px] font-medium text-gray-500 leading-tight mt-0.5">{t('weather.feelsLike', 'Feels like')} 17°C</div>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-medium text-gray-600 border-t border-blue-200/60 pt-2 mt-1">
            <span className="flex items-center"><Droplets className="w-3 h-3 mr-1 text-blue-500" /> 94%</span>
            <span className="flex items-center"><Wind className="w-3 h-3 mr-1 text-gray-400" /> 12 km/h</span>
          </div>
        </div>

        {/* Hourly Timeline */}
        <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-3 flex justify-between items-center">
          {[
            { time: 'Now', temp: '18°C', rain: '60%' },
            { time: '11 AM', temp: '19°C', rain: '70%' },
            { time: '12 PM', temp: '19°C', rain: '70%' },
            { time: '1 PM', temp: '20°C', rain: '60%' },
            { time: '2 PM', temp: '20°C', rain: '60%' },
            { time: '3 PM', temp: '19°C', rain: '40%' }
          ].map((slot, i) => (
            <div key={i} className="flex flex-col items-center justify-between h-full py-1">
              <span className="text-[10px] font-medium text-gray-500 text-center">
                {slot.time === 'Now' ? t('common.now', 'Now') : slot.time}
              </span>
              <CloudRain className="w-5 h-5 text-blue-400 my-2" />
              <span className="text-xs font-bold text-gray-900 mb-1">{slot.temp}</span>
              <span className="text-[9px] font-semibold text-blue-600 flex items-center"><Droplets className="w-2 h-2 mr-0.5" /> {slot.rain}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}