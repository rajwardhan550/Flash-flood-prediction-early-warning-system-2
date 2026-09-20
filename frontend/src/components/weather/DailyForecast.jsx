import React from 'react';
import { CalendarDays, Cloud, Sun, CloudRain } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const DailyForecast = ({ forecast = [], isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 h-64 flex items-center justify-center">
        <span className="text-slate-400">{t('common.loading') || 'Loading daily forecast...'}</span>
      </div>
    );
  }

  if (!forecast || forecast.length === 0) return null;

  // Helper to render a generic icon based on the backend condition string
  const renderConditionIcon = (condition) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('storm')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (cond.includes('cloud') || cond.includes('overcast')) return <Cloud className="w-5 h-5 text-slate-400" />;
    return <Sun className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
        <CalendarDays className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
          {t('weather.dailyForecast') || '7-Day Forecast'}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {forecast.map((day, index) => {
          // Display "Today" for the first item, otherwise the day of the week
          const dayName = index === 0 
            ? t('common.today') || 'Today' 
            : new Date(day.timestamp).toLocaleDateString(t('common.localeCode') || 'en-IN', { weekday: 'short' });

          return (
            <div key={day.timestamp} className="flex items-center justify-between p-2 hover:bg-slate-800/30 rounded transition-colors">
              <span className="w-16 text-sm font-medium text-slate-300">{dayName}</span>
              
              <div className="flex items-center gap-3 w-24">
                {renderConditionIcon(day.condition)}
                {day.precipChance > 20 && (
                  <span className="text-xs font-semibold text-blue-400">{day.precipChance}%</span>
                )}
              </div>

              <div className="flex flex-1 items-center justify-end gap-3 text-sm font-mono">
                <span className="text-slate-400 w-8 text-right">{Math.round(day.tempMin)}°</span>
                
                {/* Visual temperature bar representation */}
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-rose-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                
                <span className="text-slate-100 w-8 text-right font-bold">{Math.round(day.tempMax)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;