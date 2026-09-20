import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useRisk } from '../../hooks/useRisk';
import { useTelemetry } from '../../hooks/useTelemetry';

// Import all the components we just built
import PriorityZonesTable from '../../components/authority/PriorityZonesTable';
import DataQualityIndicator from '../../components/authority/DataQualityIndicator';
import SensorStatusTable from '../../components/authority/SensorStatusTable';
import HydrographChart from '../../components/authority/HydrographChart';
import PrecipitationChart from '../../components/authority/PrecipitationChart';
import SoilMoistureChart from '../../components/authority/SoilMoistureChart';
import PredictionComparison from '../../components/authority/PredictionComparison'; // Restored import

const AuthorityOverview = () => {
  const { t } = useLanguage();
  
  // Restored the 'prediction' variable from the hook
  const { zones, prediction, isLoading: isRiskLoading } = useRisk();
  const { 
    historicalData, 
    sensors, 
    qualityScore, 
    lastUpdated, 
    isLoading: isTelemetryLoading 
  } = useTelemetry();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {t('authority.dashboardTitle') || 'Command Center'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {t('authority.dashboardSubtitle') || 'Real-time monitoring and ML ensemble overview.'}
          </p>
        </div>
        
        {/* Data Quality Indicator */}
        <div className="w-full md:w-72">
          <DataQualityIndicator 
            qualityScore={qualityScore} 
            lastUpdated={lastUpdated} 
          />
        </div>
      </div>

      {/* Top Row: Priority Table (2/3 width) & ML Prediction (1/3 width) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriorityZonesTable zones={zones} isLoading={isRiskLoading} />
        </div>
        
        {/* Restored original ML Ensemble Comparison component */}
        <div className="lg:col-span-1">
          <PredictionComparison prediction={prediction} />
        </div>
      </div>

      {/* Middle Row: Historical Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HydrographChart 
          data={historicalData?.waterLevel} 
          isLoading={isTelemetryLoading} 
        />
        <PrecipitationChart 
          data={historicalData?.rainfall} 
          isLoading={isTelemetryLoading} 
        />
        <SoilMoistureChart 
          data={historicalData?.soilMoisture} 
          isLoading={isTelemetryLoading} 
        />
      </div>

      {/* Bottom Row: Sensor Network Status */}
      <div className="w-full">
        <SensorStatusTable 
          sensors={sensors} 
          isLoading={isTelemetryLoading} 
        />
      </div>

    </div>
  );
};

export default AuthorityOverview;