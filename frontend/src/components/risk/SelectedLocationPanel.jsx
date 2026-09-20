import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { Link } from 'react-router-dom';

const SelectedLocationPanel = ({ location }) => {
  const { t } = useLanguage();

  if (!location) return null;

  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-400">
          <MapPin className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-100">
            {t('risk.selectedLocation') || 'Selected Location'}
          </h2>
        </div>
        <Link 
          to={`/details/${location.id || location._id}`}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          {t('common.viewDetails') || 'View Details'} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex gap-4">
        {/* Location Image (Fallback to a dark placeholder if none exists from backend) */}
        <div className="w-24 h-24 sm:w-32 sm:h-24 bg-slate-800 rounded overflow-hidden shrink-0 border border-slate-700">
          {location.imageUrl ? (
            <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center text-slate-600">
              <MapPin className="w-6 h-6 mb-1 opacity-50" />
              <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
            </div>
          )}
        </div>

        {/* Location Metadata */}
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold text-slate-100 mb-0.5">{location.name}</h1>
          <p className="text-sm text-slate-400 mb-2">
            {location.block && `${location.block} Block, `}{location.district || 'Chamoli'} District<br/>
            {location.state || 'Uttarakhand'}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 font-mono bg-blue-500/10 inline-flex w-fit px-2 py-1 rounded">
            <MapPin className="w-3 h-3" />
            {location.coordinates ? (
              <span>{location.coordinates[0].toFixed(4)}° N, {location.coordinates[1].toFixed(4)}° E</span>
            ) : (
              <span>Coordinates unavailable</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedLocationPanel;