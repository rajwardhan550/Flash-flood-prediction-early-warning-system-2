import React from 'react';
import { Waves, Shield, BrainCircuit } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-8">
      <div className="text-center mb-10">
        <Waves className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-100 mb-2">About FloodAtlas</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A predictive Early Warning System utilizing real-time IoT telemetry and ensemble Machine Learning to protect vulnerable communities in Uttarakhand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <BrainCircuit className="w-6 h-6 text-purple-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-200 mb-2">Machine Learning Engine</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            FloodAtlas employs a dual-model approach. A Bi-LSTM (Bidirectional Long Short-Term Memory) network analyzes temporal sequences of river and rainfall data, while an XGBoost model evaluates static spatial variables like terrain slope and soil type.
          </p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <Shield className="w-6 h-6 text-emerald-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-200 mb-2">Authority Command</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Designed for NDRF and local district officials, the system provides secure operational dashboards to dispatch SMS evacuation warnings, monitor sensor health, and generate automated damage assessment reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;