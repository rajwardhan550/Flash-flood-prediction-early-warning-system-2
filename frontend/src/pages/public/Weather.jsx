import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useWeather } from '../../hooks/useWeather';
import CurrentWeather from '../../components/weather/CurrentWeather';
import HourlyForecast from '../../components/weather/HourlyForecast';
import DailyForecast from '../../components/weather/DailyForecast';

const Weather = () => {
  const { t } = useLanguage();
  const { current, hourlyForecast, dailyForecast, isLoading } = useWeather();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-100">{t('nav.weather') || 'Local Weather'}</h1>
        <p className="text-slate-400 text-sm mt-1">
          Meteorological conditions driving the hydrological models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CurrentWeather current={current} isLoading={isLoading} />
          <HourlyForecast forecast={hourlyForecast} isLoading={isLoading} />
        </div>
        
        <div>
          <DailyForecast forecast={dailyForecast} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Weather;