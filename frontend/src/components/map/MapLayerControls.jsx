import React from 'react';
import { Layers } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const MapLayerControls = ({ activeLayers, toggleLayer }) => {
  const { t } = useLanguage();

  const layers = [
    { id: 'satellite', label: t('map.satellite') || 'Satellite' },
    { id: 'terrain', label: t('map.terrain') || 'Terrain' },
    { id: 'district', label: t('map.districtBoundary') || 'District Boundary' },
    { id: 'river', label: t('map.riverNetwork') || 'River Network' },
    { id: 'risk', label: t('map.riskLayer') || 'Risk Layer' }
  ];

  return (
    <div className="absolute top-6 right-6 z-[400] bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-lg min-w-[160px]">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
        <Layers className="w-4 h-4 text-slate-400" />
        <h4 className="text-sm font-medium text-slate-200">
          {t('map.layers') || 'Map Layers'}
        </h4>
      </div>
      <div className="flex flex-col gap-2.5">
        {layers.map((layer) => (
          <label key={layer.id} className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={activeLayers?.[layer.id] || false}
                onChange={() => toggleLayer(layer.id)}
                className="peer sr-only"
              />
              <div className="w-4 h-4 border border-slate-500 rounded bg-slate-800 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all"></div>
              {activeLayers?.[layer.id] && (
                <svg className="absolute w-3 h-3 text-white pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
            <span className="text-xs text-slate-300 group-hover:text-slate-100 transition-colors">
              {layer.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MapLayerControls;