import React, { useState } from 'react';

// Hooks
import { useLanguage } from '../../hooks/useLanguage';
import { useLocationContext } from '../../hooks/useLocation';
import { useRisk } from '../../hooks/useRisk';
import { useTelemetry } from '../../hooks/useTelemetry';

// Core Components
import RiskTicker from '../../components/alerts/RiskTicker';
import SidebarNav from '../../components/layout/SidebarNav';
import DashboardMap from '../../components/map/DashboardMap';
import PredictionSidebar from '../../components/risk/PredictionSidebar';
import CurrentConditions from '../../components/weather/CurrentConditions';
import WeatherForecast from '../../components/weather/WeatherForecast';

// Monitor Components
import LiveSensors from '../../components/monitor/LiveSensors';
import Rainfall from '../../components/monitor/Rainfall';
import RiverLevels from '../../components/monitor/RiverLevels';
import SoilMoisture from '../../components/monitor/SoilMoisture';
import Weather from '../../components/monitor/Weather';

// Risk Components
import FlashFloodRisk from '../../components/risk/FlashFloodRisk';
import Forecast from '../../components/risk/Forecast';
import RiskAnalysis from '../../components/risk/RiskAnalysis';
import HistoricalEvents from '../../components/risk/HistoricalEvents';

// Alerts 
import ActiveAlerts from '../../components/alerts/ActiveAlerts';


export default function Home() {
  const { t, language } = useLanguage();
  const { currentLocation } = useLocationContext();
  const { riskData, isLoading: isRiskLoading } = useRisk();
  const { historicalData, isLoading: isTelemetryLoading } = useTelemetry();
  
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col bg-gray-50 text-gray-900 font-sans w-full min-h-screen">
      
      {/* Top alert banner */}
      <RiskTicker />

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar navigation */}
        <SidebarNav 
          language={language} 
          activeTab={activeTab} 
          onSelectTab={setActiveTab} 
        />

        {/* Main content area */}
        <main className="flex-1 p-3 sm:p-5 flex flex-col space-y-4 overflow-y-auto max-h-[calc(100vh-42px)]">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="flex flex-col space-y-4 animate-fadeIn w-full">
              <section className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-4 w-full">
                <div className="w-full h-[450px] sm:h-[520px] xl:h-full min-h-[420px]">
                  <DashboardMap location={currentLocation} language={language} />
                </div>
                <div className="w-full">
                  {isRiskLoading ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full flex items-center justify-center text-gray-500 min-h-[360px]">
                      <span className="text-xs font-medium tracking-wider animate-pulse">
                        {language === 'hi' ? 'जोखिम प्रोफ़ाइल लोड हो रही है...' : 'Calculating risk profile...'}
                      </span>
                    </div>
                  ) : (
                    <PredictionSidebar riskData={riskData} telemetry={historicalData} location={currentLocation} />
                  )}
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="w-full">
                  {isTelemetryLoading ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-center text-gray-500 h-[220px]">
                      <span className="text-xs font-medium tracking-wider animate-pulse">
                        {language === 'hi' ? 'सेंसर डेटा लोड हो रहा है...' : 'Fetching sensor data...'}
                      </span>
                    </div>
                  ) : (
                    <CurrentConditions telemetry={historicalData} />
                  )}
                </div>
                <div className="w-full">
                  <WeatherForecast />
                </div>
              </section>
            </div>
          )}

          {/* ========================================= */}
          {/* MONITOR TABS                                */}
          {/* ========================================= */}
          
          {activeTab === 'sensors' && (
            <div className="w-full h-full animate-fadeIn"><LiveSensors /></div>
          )}

          {activeTab === 'rainfall' && (
            <div className="w-full h-full animate-fadeIn"><Rainfall /></div>
          )}

          {(activeTab === 'riverLevels' || activeTab === 'river-levels' || activeTab === 'river') && (
            <div className="w-full h-full animate-fadeIn"><RiverLevels /></div>
          )}

          {(activeTab === 'soilMoisture' || activeTab === 'soil-moisture' || activeTab === 'soil') && (
            <div className="w-full h-full animate-fadeIn"><SoilMoisture /></div>
          )}

          {activeTab === 'weather' && (
            <div className="w-full h-full animate-fadeIn"><Weather /></div>
          )}

          {/* ========================================= */}
          {/* PREDICTION TABS                             */}
          {/* ========================================= */}

          {(activeTab === 'flashFloodRisk' || activeTab === 'flash-flood-risk' || activeTab === 'risk') && (
            <div className="w-full h-full animate-fadeIn"><FlashFloodRisk /></div>
          )}

          {activeTab === 'forecast' && (
            <div className="w-full h-full animate-fadeIn"><Forecast /></div>
          )}

          {/* Risk Analysis Tab - Now catching "analysis" */}
          {(activeTab === 'analysis' || activeTab === 'riskAnalysis' || activeTab === 'risk-analysis') && (
            <div className="w-full h-full animate-fadeIn"><RiskAnalysis /></div>
          )}

          {/* Historical Events Tab - Now catching "history" */}
          {(activeTab === 'history' || activeTab === 'historicalEvents' || activeTab === 'historical-events') && (
            <div className="w-full h-full animate-fadeIn"><HistoricalEvents /></div>
          )}

          {/* ========================================= */}
            {/* RESPONSE TABS                               */}
            {/* ========================================= */}
            {(activeTab === 'alerts' || activeTab === 'activeAlerts' || activeTab === 'active-alerts' || activeTab === 'Active Alerts') && (
              <div className="w-full h-full animate-fadeIn">
                <ActiveAlerts />
              </div>
            )}            

        </main>
      </div>
    </div>
  );
}