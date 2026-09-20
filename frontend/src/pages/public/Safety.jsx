import React from 'react';
import { AlertTriangle, Info, Phone } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

const Safety = () => {
  const { t } = useLanguage();

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{t('nav.safety') || 'Safety Information'}</h1>
        <p className="text-slate-400 text-sm mt-1">Official guidelines for flood preparedness and emergency response.</p>
      </div>

      <div className="bg-rose-900/10 border border-rose-900/30 rounded-lg p-5 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-rose-500 mb-2">During an Active Flash Flood</h3>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-2">
            <li>Move immediately to higher ground. Do not wait for instructions to move.</li>
            <li>Do not walk, swim, or drive through swift water. Just 6 inches of moving water can knock you down.</li>
            <li>Stay off bridges over fast-moving water.</li>
            <li>If your vehicle is trapped in rapidly moving water, stay inside. If water rises inside the vehicle, seek refuge on the roof.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Info className="w-5 h-5" />
            <h3 className="font-bold">Before a Flood</h3>
          </div>
          <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
            <li>Build an emergency kit (water, food, flashlight, batteries).</li>
            <li>Know your local evacuation routes.</li>
            <li>Keep important documents in a waterproof container.</li>
            <li>Sign up for local warning systems and SMS alerts.</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Phone className="w-5 h-5" />
            <h3 className="font-bold">Emergency Contacts (Uttarakhand)</h3>
          </div>
          <ul className="text-sm text-slate-400 space-y-3">
            <li className="flex justify-between border-b border-slate-800 pb-2"><span>State Disaster Control Room:</span> <span className="font-mono text-slate-200">1070</span></li>
            <li className="flex justify-between border-b border-slate-800 pb-2"><span>District Emergency Operation:</span> <span className="font-mono text-slate-200">1077</span></li>
            <li className="flex justify-between border-b border-slate-800 pb-2"><span>Police:</span> <span className="font-mono text-slate-200">112</span></li>
            <li className="flex justify-between"><span>Ambulance:</span> <span className="font-mono text-slate-200">108</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Safety;