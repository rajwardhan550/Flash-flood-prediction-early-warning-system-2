import React from 'react';
import { Clock, CloudRain } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const HourlyForecast = ({ forecast = [], isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 h-40 flex items-center justify-center">
        <span className="text-slate-400">{t('common.loading') || 'Loading hourly forecast...'}</span>
      </div>
    );
  }

  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
          {t('weather.hourlyForecast') || 'Hourly Forecast'}
        </h3>
      </div>

      {/* Horizontal scrolling container */}
      <div className="flex overflow-x-auto pb-4 -mx-2 px-2 gap-2 snap-x scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {forecast.map((hour, index) => {
          const timeLabel = index === 0 
            ? t('common.now') || 'Now' 
            : new Date(hour.timestamp).toLocaleTimeString([], { hour: 'numeric', hour12: true });

          const isHighPrecip = hour.precipChance > 50;

          return (
            <div 
              key={hour.timestamp} 
              className={`flex flex-col items-center justify-between min-w-[4.5rem] p-3 rounded-lg snap-start border ${
                isHighPrecip ? 'bg-blue-900/20 border-blue-800/30' : 'bg-slate-950/50 border-slate-800/50'
              }`}
            >
              <span className="text-xs text-slate-400 font-medium mb-2 whitespace-nowrap">{timeLabel}</span>
              
              <span className="text-lg font-bold text-slate-200 my-1">{Math.round(hour.temperature)}°</span>
              
              <div className="flex flex-col items-center mt-2">
                <CloudRain className={`w-4 h-4 mb-1 ${isHighPrecip ? 'text-blue-400' : 'text-slate-500'}`} />
                <span className={`text-xs font-semibold ${isHighPrecip ? 'text-blue-400' : 'text-slate-500'}`}>
                  {hour.precipChance}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;