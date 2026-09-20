import React from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import Button from '../../components/common/Button';

const Settings = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Global Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure system-wide parameters and maintenance controls.</p>
      </div>

      <div className="space-y-6">
        {/* Core Settings Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-200">System Configuration</h2>
          </div>
          
          <div className="space-y-4 text-slate-400 text-sm">
            <div className="flex items-center justify-between">
              <span>Maintenance Mode</span>
              <div className="w-10 h-5 bg-slate-700 rounded-full opacity-50 cursor-not-allowed"></div>
            </div>
            <div className="flex items-center justify-between">
              <span>Global Alert Override</span>
              <div className="w-10 h-5 bg-slate-700 rounded-full opacity-50 cursor-not-allowed"></div>
            </div>
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button variant="primary" disabled className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-amber-900/10 border border-amber-900/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-amber-500 mb-2">Notice</h2>
          <p className="text-slate-400 text-sm">
            Configuration fields are currently disabled pending active backend synchronization. Changes made here will affect all active instances of the Flood Early Warning System.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;