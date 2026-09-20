import React from 'react';
import { Radio, AlertTriangle, Send } from 'lucide-react';
import Button from '../../components/common/Button';

const EmergencyBroadcast = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Emergency Broadcast</h1>
        <p className="text-slate-400 text-sm mt-1">Disseminate critical evacuation orders via SMS and Push Notifications.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <Radio className="w-5 h-5 text-rose-500" />
          <h2 className="text-lg font-semibold text-slate-200">New Broadcast Message</h2>
        </div>
        
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Target Zone</label>
            <select className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" disabled>
              <option>Loading zones from API...</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Message Content</label>
            <textarea 
              rows="4" 
              className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" 
              placeholder="Enter evacuation instructions..."
              disabled
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="secondary" disabled>Cancel</Button>
            <Button variant="primary" disabled className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white border-transparent">
              <Send className="w-4 h-4" /> Issue Broadcast
            </Button>
          </div>
        </form>
      </div>
      
      <div className="bg-rose-900/10 border border-rose-900/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400">
          Broadcast functionality is currently locked. The communication microservice must be online to dispatch live SMS payloads to registered citizens.
        </p>
      </div>
    </div>
  );
};

export default EmergencyBroadcast;