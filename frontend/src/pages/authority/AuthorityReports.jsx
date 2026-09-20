import React from 'react';
import { FileText, Download, Send } from 'lucide-react';
import Button from '../../components/common/Button';

const AuthorityReports = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Situation Reports (SITREP)</h1>
          <p className="text-slate-400 text-sm mt-1">Generate automated damage assessments and telemetry logs.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2 shrink-0">
          <FileText className="w-4 h-4" /> Generate New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col h-48">
          <h3 className="text-slate-200 font-semibold mb-1">Daily Telemetry Summary</h3>
          <p className="text-slate-500 text-xs mb-4">Export last 24h of river and rainfall data.</p>
          <div className="mt-auto flex gap-3">
            <Button variant="secondary" size="sm" className="flex-1 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> PDF
            </Button>
            <Button variant="secondary" size="sm" className="flex-1 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityReports;