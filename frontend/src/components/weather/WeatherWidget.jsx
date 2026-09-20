import React from 'react';
import { CloudLightning, Droplets, Thermometer, Wind } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTelemetry } from '../../hooks/useTelemetry';

export default function WeatherWidget() {
  const { language } = useLanguage();
  const { historicalData, isLoading } = useTelemetry();
  const isHindi = language === 'hi';

  const current = historicalData?.current || {
    temperature: 24, humidity: 92, rainfall: 45.2, wind: 18
  };

  if (isLoading) {
    return <div className="animate-pulse bg-slate-100 h-32 rounded-xl w-full"></div>;
  }

  return (
    <div className="flex flex-col gap-2">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between px-1">
        <h3 className="font-bold text-slate-800 text-sm">
          {isHindi ? 'स्थानीय मौसम व पूर्वानुमान' : 'Local Weather & Forecast'}
        </h3>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md text-center mt-2 sm:mt-0 shadow-sm">
          {isHindi ? 'अगले 6 घंटे: भारी बारिश' : 'Next 6 Hrs: Heavy Rain'}
        </span>
      </div>

      {/* Weather Data Cards Container */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          
          {/* Temperature - Amber Theme */}
          <div className="flex flex-col items-center justify-center bg-amber-50 rounded-lg py-3 px-1 border border-amber-100 transition-colors hover:bg-amber-100">
            <Thermometer className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-sm font-black text-amber-800">{current.temperature}°C</span>
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-0.5">{isHindi ? 'तापमान' : 'Temp'}</span>
          </div>

          {/* Rainfall - Blue Theme */}
          <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg py-3 px-1 border border-blue-100 transition-colors hover:bg-blue-100">
            <CloudLightning className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-sm font-black text-blue-800">{current.rainfall}</span>
            <span className="text-[9px] sm:text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">{isHindi ? 'बारिश (मिमी)' : 'Rain (mm)'}</span>
          </div>

          {/* Humidity - Cyan Theme */}
          <div className="flex flex-col items-center justify-center bg-cyan-50 rounded-lg py-3 px-1 border border-cyan-100 transition-colors hover:bg-cyan-100">
            <Droplets className="w-5 h-5 text-cyan-500 mb-1" />
            <span className="text-sm font-black text-cyan-800">{current.humidity}%</span>
            <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider mt-0.5">{isHindi ? 'नमी' : 'Humid'}</span>
          </div>

          {/* Wind - Teal Theme */}
          <div className="flex flex-col items-center justify-center bg-teal-50 rounded-lg py-3 px-1 border border-teal-100 transition-colors hover:bg-teal-100">
            <Wind className="w-5 h-5 text-teal-500 mb-1" />
            <span className="text-sm font-black text-teal-800">{current.wind || 18}</span>
            <span className="text-[9px] sm:text-[10px] text-teal-600 font-bold uppercase tracking-wider mt-0.5">{isHindi ? 'हवा किमी/घं' : 'Wind km/h'}</span>
          </div>

        </div>
      </div>
      
    </div>
  );
}