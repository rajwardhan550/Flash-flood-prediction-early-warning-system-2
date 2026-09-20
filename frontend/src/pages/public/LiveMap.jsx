import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import FloodMap from '../../components/map/FloodMap';
import { useRisk } from '../../hooks/useRisk';

const LiveMap = () => {
  const { t } = useLanguage();
  const { zones, isLoading } = useRisk(); // Pulls all active zones from the backend

  return (
    <div className="p-4 sm:p-6 h-[calc(100vh-8rem)] flex flex-col max-w-[1600px] mx-auto w-full space-y-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-slate-100">{t('nav.liveMap') || 'Live Risk Map'}</h1>
        <p className="text-slate-400 text-sm mt-1">
          Interactive view of flood vulnerabilities across Uttarakhand.
        </p>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden relative shadow-sm">
        <FloodMap zones={zones || []} center={[30.4852, 79.6974]} zoom={9} />
        
        {isLoading && (
          <div className="absolute inset-0 z-[500] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center text-slate-200">
            Loading geographic data...
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMap;