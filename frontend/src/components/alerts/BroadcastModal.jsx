import React, { useState } from 'react';
import { X, RadioTower, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../hooks/useLanguage';

const BroadcastModal = ({ isOpen, onClose, zones = [] }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    zoneId: '',
    riskTier: 'HIGH',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Connects directly to your Express backend
      await api.post('/alerts/broadcast', formData);
      onClose(); // Close on success
    } catch (err) {
      console.error('Broadcast failed:', err);
      setError(t('alerts.broadcastError') || 'Failed to broadcast alert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-800/50 p-4 border-b border-slate-700">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <RadioTower className="w-5 h-5 text-red-500" />
            {t('authority.broadcastAlert') || 'Broadcast Emergency Alert'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('common.location') || 'Target Zone'}
            </label>
            <select 
              required
              value={formData.zoneId}
              onChange={(e) => setFormData({...formData, zoneId: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a location...</option>
              {zones.map(zone => (
                <option key={zone._id} value={zone._id}>{zone.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('alerts.riskLevel') || 'Risk Level'}
            </label>
            <select 
              value={formData.riskTier}
              onChange={(e) => setFormData({...formData, riskTier: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="EXTREME">EXTREME</option>
              <option value="HIGH">HIGH</option>
              <option value="MODERATE">MODERATE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {t('alerts.message') || 'Alert Message'}
            </label>
            <textarea 
              required
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Enter specific instructions or warnings..."
              className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-slate-100 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded text-slate-300 hover:bg-slate-800 transition-colors"
            >
              {t('common.cancel') || 'Cancel'}
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center min-w-[120px] transition-colors disabled:opacity-50"
            >
              {loading ? <Spinner className="w-4 h-4 text-white" /> : (t('common.broadcast') || 'Broadcast')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BroadcastModal;