import React from 'react';
import { AlertTriangle, MountainSnow } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const EmergencyInfoStrip = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-slate-950/80 border-t border-slate-800 py-3 px-6 flex flex-col sm:flex-row items-center justify-between z-40 text-sm">
      
      {/* Left Side: Emergency Contacts */}
      <div className="flex items-center text-slate-300 mb-2 sm:mb-0">
        <div className="flex items-center justify-center bg-red-500/20 rounded p-1 mr-3">
          <AlertTriangle className="w-4 h-4 text-red-500" />
        </div>
        <span>
          <span className="opacity-90">{t('safety.emergencyCallPrefix') || 'In case of emergency, call:'}</span>{' '}
          {/* Verified Uttarakhand/India Emergency Numbers */}
          <span className="text-red-400 font-semibold ml-1">1070</span>{' '}
          <span className="opacity-75">({t('safety.stateEmergency') || 'State Emergency'})</span> <span className="mx-2 text-slate-700">|</span>{' '}
          <span className="text-red-400 font-semibold">112</span>{' '}
          <span className="opacity-75">({t('safety.nationalEmergency') || 'National Emergency'})</span>
        </span>
      </div>

      {/* Right Side: Mission Statement */}
      <div className="flex items-center text-blue-400/90 font-medium tracking-wide">
        <MountainSnow className="w-4 h-4 mr-2" />
        {t('common.missionTagline') || 'Stay Informed. Stay Safe. Save Lives.'}
      </div>
      
    </div>
  );
};

export default EmergencyInfoStrip;