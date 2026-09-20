import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CloudRain, Droplets, Waves, 
  MapPin, Search, X, Map, FileText, Thermometer, Wind, Activity 
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- DICTIONARY FOR BILINGUAL SUPPORT ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'Flash Flood Risk Assessment',
    lastUpdated: 'Last Updated: 19 Sep 2026, 10:53 PM',
    liveData: 'Live Data',
    card1Title: 'Risk Prediction Score',
    card2Title: 'Current Key Metrics',
    rainfall: 'Rainfall',
    soilSat: 'Soil Sat.',
    soilMoistureLong: 'Soil Saturation',
    riverLevel: 'River Lvl',
    riverLevelLong: 'River Level',
    temp: 'Temp',
    wind: 'Wind',
    windSpeedLong: 'Wind Speed',
    allSystemsActive: 'All Systems Active',
    riskScoreByLoc: 'Risk Score by Location',
    monitoredLocationsCount: 'Monitoring 980 locations across the region',
    searchPlaceholder: 'Search location (e.g. Chamoli)...',
    filterAll: 'All (980)',
    filterExtreme: 'Extreme',
    filterHigh: 'High',
    filterMedium: 'Medium',
    filterLow: 'Low',
    riskSuffix: 'RISK',
    noLocationsFound: 'No locations found matching your criteria.',
    modalScoreTitle: 'Score',
    liveTelemetryTitle: 'Live Telemetry',
    viewOnMap: 'View on Map',
    viewDetailedAnalysis: 'View Detailed Analysis',
    close: 'Close',
    districtSubtext: 'Chamoli District, Uttarakhand'
  },
  hi: {
    pageTitle: 'आकस्मिक बाढ़ जोखिम मूल्यांकन',
    lastUpdated: 'अंतिम अपडेट: 19 सितं 2026, 10:53 PM',
    liveData: 'लाइव डेटा',
    card1Title: 'जोखिम पूर्वानुमान स्कोर',
    card2Title: 'वर्तमान प्रमुख मेट्रिक्स',
    rainfall: 'वर्षा',
    soilSat: 'मृदा संतृप्ति',
    soilMoistureLong: 'मिट्टी की संतृप्ति',
    riverLevel: 'नदी स्तर',
    riverLevelLong: 'नदी का जलस्तर',
    temp: 'तापमान',
    wind: 'हवा',
    windSpeedLong: 'हवा की गति',
    allSystemsActive: 'सभी प्रणालियां सक्रिय',
    riskScoreByLoc: 'स्थान अनुसार जोखिम स्कोर',
    monitoredLocationsCount: 'क्षेत्र भर में 980 निगरानी स्थान',
    searchPlaceholder: 'स्थान खोजें (उदा. चमोली, जोशीमठ)...',
    filterAll: 'सभी (980)',
    filterExtreme: 'अत्यधिक',
    filterHigh: 'उच्च',
    filterMedium: 'मध्यम',
    filterLow: 'निम्न',
    riskSuffix: 'जोखिम',
    noLocationsFound: 'आपके मानदंडों से मेल खाने वाले कोई स्थान नहीं मिले।',
    modalScoreTitle: 'स्कोर',
    liveTelemetryTitle: 'लाइव टेलीमेट्री',
    viewOnMap: 'मानचित्र पर देखें',
    viewDetailedAnalysis: 'विस्तृत विश्लेषण देखें',
    close: 'बंद करें',
    districtSubtext: 'चमोली जिला, उत्तराखंड'
  }
};

// --- HELPER FUNCTIONS FOR RISK LOGIC ---
const getRiskLevelKey = (score) => {
  if (score >= 75) return 'EXTREME';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
};

const getRiskLevelLabel = (score, isHi) => {
  const key = getRiskLevelKey(score);
  if (isHi) {
    switch (key) {
      case 'EXTREME': return 'अत्यधिक';
      case 'HIGH': return 'उच्च';
      case 'MEDIUM': return 'मध्यम';
      case 'LOW': default: return 'निम्न';
    }
  }
  return key;
};

const getRiskStyle = (score) => {
  if (score >= 75) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', fill: 'bg-red-500' };
  if (score >= 50) return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', fill: 'bg-orange-500' };
  if (score >= 25) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', fill: 'bg-yellow-500' };
  return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', fill: 'bg-emerald-500' };
};

// --- MOCK DATABASE (Bilingual summaries & names) ---
const ALL_LOCATIONS = [
  { 
    id: 1, 
    nameEn: 'Chamoli (Main Town)', 
    nameHi: 'चमोली (मुख्य नगर)',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 82, 
    rainfall: '112 mm / 24h', 
    soil: '88%', 
    river: '+1.2 m', 
    temp: '18°C', 
    wind: '12 km/h', 
    summaryEn: 'Heavy rainfall continues. River level is rising and soil is highly saturated. Low-lying areas may be vulnerable to flash flooding.',
    summaryHi: 'भारी बारिश जारी है। नदी का जलस्तर बढ़ रहा है और मिट्टी अत्यधिक संतृप्त हो चुकी है। निचले इलाके अचानक बाढ़ के प्रति संवेदनशील हो सकते हैं।'
  },
  { 
    id: 2, 
    nameEn: 'Joshimath', 
    nameHi: 'जोशीमठ',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 67, 
    rainfall: '85 mm / 24h', 
    soil: '72%', 
    river: '+0.8 m', 
    temp: '14°C', 
    wind: '18 km/h', 
    summaryEn: 'Moderate to heavy rain. Soil saturation is increasing steadily, elevating landslide and localized flood risks.',
    summaryHi: 'मध्यम से भारी बारिश। मिट्टी की नमी लगातार बढ़ रही है, जिससे भूस्खलन और स्थानीय बाढ़ का खतरा बढ़ रहा है।'
  },
  { 
    id: 3, 
    nameEn: 'Gopeshwar', 
    nameHi: 'गोपेश्वर',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 42, 
    rainfall: '45 mm / 24h', 
    soil: '55%', 
    river: '+0.3 m', 
    temp: '20°C', 
    wind: '10 km/h', 
    summaryEn: 'Normal rainfall with moderate soil saturation. No immediate flood threat detected.',
    summaryHi: 'मध्यम मिट्टी की नमी के साथ सामान्य बारिश। तत्काल कोई बाढ़ का खतरा दर्ज नहीं किया गया है।'
  },
  { 
    id: 4, 
    nameEn: 'Pipalkoti', 
    nameHi: 'पीपलकोटी',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 28, 
    rainfall: '20 mm / 24h', 
    soil: '40%', 
    river: 'Normal', 
    temp: '22°C', 
    wind: '8 km/h', 
    summaryEn: 'Conditions remain stable. Minor precipitation recorded.',
    summaryHi: 'स्थितियां स्थिर हैं। मामूली वर्षा दर्ज की गई है।'
  },
  { 
    id: 5, 
    nameEn: 'Helang', 
    nameHi: 'हेलांग',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 75, 
    rainfall: '105 mm / 24h', 
    soil: '80%', 
    river: '+1.0 m', 
    temp: '16°C', 
    wind: '15 km/h', 
    summaryEn: 'Risk boundaries crossed into extreme territory due to sudden cloudburst upstream.',
    summaryHi: 'ऊपरी जलग्रहण क्षेत्र में अचानक बादल फटने के कारण जोखिम चरम स्तर पर पहुंच गया है।'
  },
  { 
    id: 6, 
    nameEn: 'Karnaprayag', 
    nameHi: 'कर्णप्रयाग',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 53, 
    rainfall: '60 mm / 24h', 
    soil: '62%', 
    river: '+0.5 m', 
    temp: '21°C', 
    wind: '11 km/h', 
    summaryEn: 'River confluences showing elevated water levels. Monitoring closely.',
    summaryHi: 'नदी संगम पर जलस्तर में वृद्धि देखी जा रही है। बारीकी से निगरानी की जा रही है।'
  },
  { 
    id: 7, 
    nameEn: 'Nandprayag', 
    nameHi: 'नंदप्रयाग',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 31, 
    rainfall: '25 mm / 24h', 
    soil: '45%', 
    river: 'Normal', 
    temp: '23°C', 
    wind: '9 km/h', 
    summaryEn: 'No significant risk factors present at this time.',
    summaryHi: 'इस समय कोई महत्वपूर्ण जोखिम कारक मौजूद नहीं है।'
  },
  { 
    id: 8, 
    nameEn: 'Vishnuprayag', 
    nameHi: 'विष्णुप्रयाग',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 20, 
    rainfall: '10 mm / 24h', 
    soil: '35%', 
    river: 'Normal', 
    temp: '15°C', 
    wind: '14 km/h', 
    summaryEn: 'Clear conditions with safe river levels.',
    summaryHi: 'सुरक्षित नदी जलस्तर के साथ मौसम साफ है।'
  },
  { 
    id: 9, 
    nameEn: 'Badrinath', 
    nameHi: 'बद्रीनाथ',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 88, 
    rainfall: '130 mm / 24h', 
    soil: '92%', 
    river: '+1.5 m', 
    temp: '10°C', 
    wind: '22 km/h', 
    summaryEn: 'Critical situation. Maximum soil saturation and severe river swelling. Immediate alerts active.',
    summaryHi: 'गंभीर स्थिति। अधिकतम मिट्टी संतृप्ति और नदी का तेज उफान। तत्काल चेतावनी सक्रिय है।'
  },
  { 
    id: 10, 
    nameEn: 'Mana', 
    nameHi: 'माणा',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 60, 
    rainfall: '70 mm / 24h', 
    soil: '68%', 
    river: '+0.7 m', 
    temp: '9°C', 
    wind: '25 km/h', 
    summaryEn: 'High winds and steady rainfall increasing vulnerability of mountain streams.',
    summaryHi: 'तेज हवाएं और निरंतर बारिश पहाड़ी नालों की संवेदनशीलता को बढ़ा रही हैं।'
  },
  { 
    id: 11, 
    nameEn: 'Govindghat', 
    nameHi: 'गोविंदघाट',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 45, 
    rainfall: '50 mm / 24h', 
    soil: '58%', 
    river: '+0.4 m', 
    temp: '17°C', 
    wind: '12 km/h', 
    summaryEn: 'Moderate conditions. Trekking routes under observation.',
    summaryHi: 'मध्यम स्थिति। मुख्य पैदल मार्गों पर सतर्कता रखी जा रही है।'
  },
  { 
    id: 12, 
    nameEn: 'Auli', 
    nameHi: 'औली',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    score: 22, 
    rainfall: '15 mm / 24h', 
    soil: '38%', 
    river: 'N/A', 
    temp: '12°C', 
    wind: '20 km/h', 
    summaryEn: 'Safe conditions. No flood risk at current elevation.',
    summaryHi: 'सुरक्षित स्थिति। वर्तमान ऊंचाई पर बाढ़ का कोई खतरा नहीं है।'
  },
];

export default function FlashFloodRisk() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;

  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Top Card Selected Reference
  const primaryLocation = ALL_LOCATIONS[0];
  const primaryStyle = getRiskStyle(primaryLocation.score);

  // Filter Logic
  const filteredLocations = ALL_LOCATIONS.filter(loc => {
    const locName = isHi ? loc.nameHi : loc.nameEn;
    const matchesSearch = locName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          loc.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const levelKey = getRiskLevelKey(loc.score);
    
    let matchesFilter = true;
    if (activeFilter !== 'All') {
      matchesFilter = levelKey === activeFilter.toUpperCase();
    }
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-10 animate-fadeIn relative">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-red-600" />
            </div>
            {t.pageTitle}
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            {t.lastUpdated}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 w-fit">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">{t.liveData}</span>
        </div>
      </div>

      {/* 2. TOP CARDS (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card 1: Risk Prediction Score */}
        <div className="col-span-1 lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">{t.card1Title}</h3>
            
            <div className="flex items-start gap-4">
              {/* Circular Score Visual */}
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-8 border-gray-100 flex-shrink-0">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" r="46%" className={primaryStyle.text} strokeWidth="8" strokeDasharray="290" strokeDashoffset={290 - (290 * primaryLocation.score) / 100} fill="transparent" stroke="currentColor" strokeLinecap="round"/>
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-black text-gray-900">{primaryLocation.score}</span>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">/ 100</span>
                </div>
              </div>

              {/* Location Info */}
              <div className="flex flex-col mt-2">
                <div className="flex items-center gap-1.5 text-gray-900 font-bold text-lg leading-tight">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  {isHi ? primaryLocation.nameHi : primaryLocation.nameEn}
                </div>
                <div className="text-xs text-gray-500 ml-6">
                  {isHi ? primaryLocation.districtHi : primaryLocation.districtEn}
                </div>
                
                <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${primaryStyle.bg} ${primaryStyle.text} text-xs font-black uppercase tracking-wider w-fit border ${primaryStyle.border}`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {getRiskLevelLabel(primaryLocation.score, isHi)} {t.riskSuffix}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {isHi ? primaryLocation.summaryHi : primaryLocation.summaryEn}
            </p>
          </div>
        </div>

        {/* Card 2: Current Key Metrics */}
        <div className="col-span-1 lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
            {t.card2Title} — {isHi ? primaryLocation.nameHi.split(' ')[0] : primaryLocation.nameEn.split(' ')[0]}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <CloudRain className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.rainfall}</span>
              </div>
              <div className="text-xl font-black text-gray-900">{primaryLocation.rainfall}</div>
            </div>

            {/* Metric 2 */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Droplets className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.soilSat}</span>
              </div>
              <div className="text-xl font-black text-gray-900">{primaryLocation.soil}</div>
            </div>

            {/* Metric 3 */}
            <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
              <div className="flex items-center gap-2 text-cyan-600 mb-2">
                <Waves className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.riverLevel}</span>
              </div>
              <div className="text-xl font-black text-gray-900">{primaryLocation.river}</div>
            </div>

            {/* Metric 4 */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Thermometer className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.temp}</span>
              </div>
              <div className="text-xl font-black text-gray-900">{primaryLocation.temp}</div>
            </div>

            {/* Metric 5 */}
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
              <div className="flex items-center gap-2 text-teal-600 mb-2">
                <Wind className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">{t.wind}</span>
              </div>
              <div className="text-xl font-black text-gray-900">{primaryLocation.wind}</div>
            </div>
            
            {/* Metric 6 */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col justify-center items-center text-gray-400">
              <Activity className="w-5 h-5 mb-1 opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.allSystemsActive}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. SEARCH & FILTER SECTION */}
      <div className="mt-4 pt-6 border-t border-gray-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-gray-900">{t.riskScoreByLoc}</h2>
          <p className="text-sm text-gray-500 font-medium">{t.monitoredLocationsCount}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-2 hide-scrollbar">
            {[
              { key: 'All', label: t.filterAll },
              { key: 'Extreme', label: t.filterExtreme },
              { key: 'High', label: t.filterHigh },
              { key: 'Medium', label: t.filterMedium },
              { key: 'Low', label: t.filterLow }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border
                  ${activeFilter === f.key 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. LOCATION GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredLocations.map(loc => {
          const style = getRiskStyle(loc.score);
          const levelLabel = getRiskLevelLabel(loc.score, isHi);
          
          return (
            <button 
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`text-left w-full bg-white rounded-xl border ${style.border} p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${style.fill}`}></div>
              
              <div className="flex justify-between items-start pl-2">
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-black ${style.text} leading-none`}>{loc.score}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text}`}>
                  {levelLabel}
                </span>
              </div>
              
              <div className="pl-2">
                <h4 className="font-bold text-gray-900 truncate">
                  {isHi ? loc.nameHi : loc.nameEn}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{isHi ? loc.districtHi : loc.districtEn}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredLocations.length === 0 && (
        <div className="w-full py-12 text-center text-gray-500 font-medium bg-white rounded-xl border border-gray-200">
          {t.noLocationsFound}
        </div>
      )}

      {/* 5. DYNAMIC POPUP MODAL */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col relative animate-slideUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  {isHi ? selectedLocation.nameHi : selectedLocation.nameEn}
                </h2>
                <p className="text-sm text-gray-500 ml-8">
                  {isHi ? selectedLocation.districtHi : selectedLocation.districtEn}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLocation(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-gray-50/50">
              
              {/* Score and Status */}
              <div className="flex items-center gap-6 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 border border-gray-100 min-w-[100px]">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.modalScoreTitle}</span>
                  <span className="text-3xl font-black text-gray-900 leading-none">{selectedLocation.score}</span>
                </div>
                
                <div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md ${getRiskStyle(selectedLocation.score).bg} ${getRiskStyle(selectedLocation.score).text} text-xs font-black uppercase tracking-wider mb-2`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {getRiskLevelLabel(selectedLocation.score, isHi)} {t.riskSuffix}
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {isHi ? selectedLocation.summaryHi : selectedLocation.summaryEn}
                  </p>
                </div>
              </div>

              {/* Grid Metrics */}
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{t.liveTelemetryTitle}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><CloudRain className="w-3 h-3"/> {t.rainfall}</div>
                  <div className="text-sm font-black text-gray-900">{selectedLocation.rainfall}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><Droplets className="w-3 h-3"/> {t.soilMoistureLong}</div>
                  <div className="text-sm font-black text-gray-900">{selectedLocation.soil}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><Waves className="w-3 h-3"/> {t.riverLevelLong}</div>
                  <div className="text-sm font-black text-gray-900">{selectedLocation.river}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><Thermometer className="w-3 h-3"/> {t.temp}</div>
                  <div className="text-sm font-black text-gray-900">{selectedLocation.temp}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-1"><Wind className="w-3 h-3"/> {t.windSpeedLong}</div>
                  <div className="text-sm font-black text-gray-900">{selectedLocation.wind}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm">
                  <Map className="w-4 h-4" /> {t.viewOnMap}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-bold rounded-lg transition-colors text-sm">
                  <FileText className="w-4 h-4" /> {t.viewDetailedAnalysis}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}