import React, { useState } from 'react';
import { Navigation2, Clock, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

export default function ActiveRouteCard() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      
      {/* Header & Distance */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100">
            <Navigation2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              {isHindi ? 'सक्रिय निकासी मार्ग' : 'Active Evacuation Route'}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isHindi ? 'राजकीय इंटर कॉलेज राहत शिविर' : 'To Govt Inter College Relief Camp'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="block text-xl font-black text-blue-700">2.4 km</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        
        {/* Est Time - Updated to Blue Theme */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <span className="block text-[10px] text-blue-600 font-bold uppercase tracking-wider">{isHindi ? 'अनुमानित समय' : 'Est. Time'}</span>
            <span className="block text-xs font-bold text-blue-800 mt-0.5">{isHindi ? '45 मिनट (पैदल)' : '45 mins (Walking)'}</span>
          </div>
        </div>

        {/* Path Status - Emerald Theme */}
        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="block text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{isHindi ? 'मार्ग की स्थिति' : 'Path Status'}</span>
            <span className="block text-xs font-bold text-emerald-700 mt-0.5">{isHindi ? 'पुल सुरक्षित है' : 'Main Bridge Clear'}</span>
          </div>
        </div>
      </div>

      {/* Expandable Directions Button */}
      <button 
        onClick={() => setShowSteps(!showSteps)}
        className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
      >
        {isHindi ? 'कदम-दर-कदम निर्देश' : 'Step-by-Step Directions'}
        {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Step-by-Step List */}
      {showSteps && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">1</div>
            <p className="text-xs text-slate-600 mt-1 font-medium">{isHindi ? 'मुख्य गांव की सड़क की ओर 500 मीटर उत्तर की ओर चलें।' : 'Head north for 500m towards the main village road.'}</p>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">2</div>
            <p className="text-xs text-slate-600 mt-1 font-medium">{isHindi ? 'प्राथमिक स्वास्थ्य केंद्र से दाएं मुड़ें।' : 'Turn right at the Primary Health Centre.'}</p>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">3</div>
            <p className="text-xs text-slate-600 mt-1 font-medium">{isHindi ? 'राहत शिविर तक पहुंचने के लिए मुख्य पुल पार करें।' : 'Cross the main bridge to arrive at the Relief Camp.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}