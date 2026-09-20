import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';

const AdminReports = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">System Reports</h1>
          <p className="text-slate-400 text-sm mt-1">Generate and export analytics on system operations and ML accuracy.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2 shrink-0">
          <Download className="w-4 h-4" /> Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {['Sensor Uptime Report', 'Alert Accuracy Audit', 'Authority Response Logs'].map((report) => (
          <div key={report} className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col items-start hover:border-slate-700 transition-colors cursor-pointer">
            <FileText className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="text-slate-200 font-semibold mb-1">{report}</h3>
            <p className="text-slate-500 text-xs mb-4">Generate CSV/PDF based on historical data.</p>
            <Button variant="secondary" size="sm" className="mt-auto w-full flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> Select Date Range
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-sm p-8 text-center text-slate-500 flex flex-col items-center">
        <FileText className="w-12 h-12 mb-3 text-slate-700" />
        <p>Awaiting report generation API from the backend.</p>
      </div>
    </div>
  );
};

export default AdminReports;