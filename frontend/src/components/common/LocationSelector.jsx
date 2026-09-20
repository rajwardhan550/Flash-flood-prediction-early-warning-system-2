import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useLocationContext } from '../../hooks/useLocation';

const LocationSelector = () => {
  const { currentLocation, availableLocations, setLocation } = useLocationContext();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 hover:bg-slate-800/50 p-2 rounded-lg transition-colors border border-transparent hover:border-slate-700">
        <div className="flex items-center justify-center bg-blue-900/30 rounded-full p-1.5">
          <MapPin className="w-4 h-4 text-blue-400" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-bold text-slate-100 leading-tight">
            {currentLocation?.name || 'Select Location'}
          </p>
          <p className="text-xs text-slate-400 leading-tight">
            {currentLocation?.district || 'Uttarakhand'}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
      </button>

      {/* Dropdown Menu (Hidden by default, shown on hover/focus within group) */}
      <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-1">
          {availableLocations?.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setLocation(loc)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                currentLocation?.id === loc.id 
                  ? 'bg-blue-900/20 text-blue-400' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;