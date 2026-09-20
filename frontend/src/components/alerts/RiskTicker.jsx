import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export default function RiskTicker() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="w-full bg-red-50 border-b border-red-100 px-4 py-2 flex items-center justify-center">
      <div className="flex items-center gap-3 overflow-hidden">
        <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse shrink-0" />
        <span className="text-sm font-bold text-red-700 truncate tracking-wide">
          {isHindi 
            ? 'अलर्ट: चमोली जिले में भारी बारिश की चेतावनी। सुरक्षित स्थानों पर रहें।'
            : 'ALERT: Heavy rainfall warning in Chamoli district. Move to higher ground.'}
        </span>
      </div>
    </div>
  );
}