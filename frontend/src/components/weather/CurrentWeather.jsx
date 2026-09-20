import React from 'react';
import { Thermometer, Wind, Droplets, CloudLightning } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const CurrentWeather = ({ current, isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 h-48 flex items-center justify-center">
        <span className="text-slate-400">{t('common.loading') || 'Loading current weather...'}</span>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
          {t('weather.currentConditions') || 'Current Conditions'}
        </h3>
        <span className="text-xs text-slate-400">
          {t('common.lastUpdated') || 'Updated'}: {new Date(current.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Main Temperature & Condition */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-3">
            <CloudLightning className="w-12 h-12 text-blue-400" />
            <span className="text-5xl font-bold text-slate-100 tracking-tighter">
              {Math.round(current.temperature)}°
            </span>
          </div>
          <p className="text-slate-300 font-medium mt-2 text-lg">{current.condition}</p>
          <p className="text-slate-500 text-sm">
            {t('weather.feelsLike') || 'Feels like'} {Math.round(current.feelsLike)}°
          </p>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="flex-1 w-full grid grid-cols-2 gap-3 mt-4 sm:mt-0">
          <div className="bg-slate-950/50 p-3 rounded border border-slate-800/50 flex items-center gap-3">
            <Droplets className="w-5 h-5 text-cyan-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">{t('weather.humidity') || 'Humidity'}</p>
              <p className="text-sm font-semibold text-slate-200">{current.humidity}%</p>
            </div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded border border-slate-800/50 flex items-center gap-3">
            <Wind className="w-5 h-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">{t('weather.wind') || 'Wind'}</p>
              <p className="text-sm font-semibold text-slate-200">{current.windSpeed} km/h</p>
            </div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded border border-slate-800/50 flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">{t('weather.dewPoint') || 'Dew Point'}</p>
              <p className="text-sm font-semibold text-slate-200">{current.dewPoint}°C</p>
            </div>
          </div>
          <div className="bg-slate-950/50 p-3 rounded border border-slate-800/50 flex items-center gap-3">
            <Droplets className="w-5 h-5 text-blue-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-400">{t('weather.pressure') || 'Pressure'}</p>
              <p className="text-sm font-semibold text-slate-200">{current.pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;