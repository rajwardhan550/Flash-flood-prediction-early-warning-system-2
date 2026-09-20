import React from 'react';
import { 
  LayoutGrid, Activity, CloudRain, Waves, Droplets, CloudSun, 
  AlertTriangle, Compass, LineChart, History, 
  AlertOctagon, Navigation, ShieldPlus 
} from 'lucide-react';

export default function SidebarNav({ language, activeTab, onSelectTab }) {
  const isHi = language === 'hi' || (typeof window !== 'undefined' && window.localStorage.getItem('language') === 'hi');

  const MENU_CATEGORIES = [
    {
      title: isHi ? 'निगरानी (मॉनिटर)' : 'MONITOR',
      items: [
        { id: 'overview', label: isHi ? 'अवलोकन' : 'Overview', icon: LayoutGrid },
        { id: 'sensors', label: isHi ? 'लाइव सेंसर' : 'Live Sensors', icon: Activity },
        { id: 'rainfall', label: isHi ? 'वर्षा स्तर' : 'Rainfall', icon: CloudRain },
        { id: 'riverLevels', label: isHi ? 'नदी जलस्तर' : 'River Levels', icon: Waves },
        { id: 'soilMoisture', label: isHi ? 'मिट्टी की नमी' : 'Soil Moisture', icon: Droplets },
        { id: 'weather', label: isHi ? 'मौसम' : 'Weather', icon: CloudSun },
      ]
    },
    {
      title: isHi ? 'पूर्वानुमान (प्रेडिक्शन)' : 'PREDICTION',
      items: [
        { id: 'flashFloodRisk', label: isHi ? 'फ्लैश फ्लड जोखिम' : 'Flash Flood Risk', icon: AlertTriangle },
        { id: 'forecast', label: isHi ? 'मौसम पूर्वानुमान' : 'Forecast', icon: Compass },
        { id: 'analysis', label: isHi ? 'जोखिम विश्लेषण' : 'Risk Analysis', icon: LineChart },
        { id: 'history', label: isHi ? 'ऐतिहासिक घटनाएं' : 'Historical Events', icon: History },
      ]
    },
    {
      title: isHi ? 'आपदा प्रतिक्रिया' : 'RESPONSE',
      items: [
        { id: 'alerts', label: isHi ? 'सक्रिय चेतावनियां' : 'Active Alerts', icon: AlertOctagon, badge: 3 },
        { id: 'evacuation', label: isHi ? 'निकासी मार्ग' : 'Evacuation Routes', icon: Navigation },
        { id: 'shelters', label: isHi ? 'सुरक्षित आश्रय' : 'Safe Shelters', icon: ShieldPlus },
      ]
    }
  ];

  return (
    <aside className="w-64 lg:w-72 bg-white border-r border-slate-200 h-full flex flex-col flex-shrink-0 z-20">
      
      {/* Brand Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            FA
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-lg leading-tight">FloodAtlas</span>
            <span className="text-[10px] text-slate-500 font-medium">Chamoli Early Warning System</span>
          </div>
        </div>
      </div>

      {/* Navigation Links Area */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {MENU_CATEGORIES.map((category, catIdx) => (
          <div key={catIdx} className="mb-6">
            {/* Category Header */}
            <h3 className="px-6 mb-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              {category.title}
            </h3>
            
            {/* Category Items */}
            <ul className="space-y-1 px-3">
              {category.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelectTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 font-bold' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        }
                      `}
                    >
                      <Icon 
                        className={`w-5 h-5 transition-colors duration-200
                          ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}
                        `} 
                      />
                      <span className="text-sm">{item.label}</span>
                      
                      {/* Optional Badge (e.g., Active Alerts) */}
                      {item.badge && (
                        <span className={`ml-auto flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black
                          ${isActive ? 'bg-red-500 text-white shadow-sm' : 'bg-red-100 text-red-600'}
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}