import React, { useState, useMemo } from 'react';
import { 
  CloudRain, Droplets, Waves, TrendingUp, AlertTriangle, 
  ChevronDown, Search, ChevronLeft, ChevronRight, X, 
  MapPin, ShieldAlert, ArrowUpRight, Gauge, Activity,
  ExternalLink, BarChart3, SlidersHorizontal, Info
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'Rainfall Monitoring',
    subtitle: 'Real-time precipitation data and accumulation',
    lastUpdated: 'Last Updated: 20 Sep 2026, 10:52 PM',
    liveData: 'Live Data',
    card24hTitle: '24H Rainfall',
    past24Hours: 'Past 24 Hours',
    vsPrevious24h: 'vs previous 24h',
    card1hTitle: '1H Rainfall',
    past1Hour: 'Past 1 Hour',
    currentIntensityTitle: 'Current Intensity',
    forecast24hTitle: '24H Forecast',
    forecast24hLabel: 'Forecast (24H)',
    trendChartTitle: 'Rainfall Trend — Last 24 Hours',
    trendChartSubtitle: 'Cumulative metric line for',
    last24HoursDropdown: 'Last 24 Hours ▼',
    intensityChartTitle: 'Rainfall Intensity — Last 24 Hours',
    intensityChartSubtitle: 'Precipitation rate per 2-hour interval',
    intensityLegendLight: '<5',
    intensityLegendMod: '5–10',
    intensityLegendHeavy: '10–20',
    intensityLegendExtreme: '>20',
    regionalCardTitle: 'Regional Rainfall Accumulation (Past 24H)',
    viewAllBtn: 'View All →',
    scatterTitle: 'Rainfall vs Flash-Flood Risk',
    scatterSubtitle: 'Click on any node to view location specifics',
    scatterAxisLabel: 'Rainfall (X) vs Risk (Y)',
    thresholdsCardTitle: 'Rainfall Thresholds (24H)',
    thresholdsSubtitle: 'Configurable early-warning classification bands (Chamoli Basin)',
    thresholdNormal: 'Normal',
    thresholdNormalVal: '< 50 mm',
    thresholdNormalDesc: 'No significant risk',
    thresholdHeavy: 'Heavy',
    thresholdHeavyVal: '50–100 mm',
    thresholdHeavyDesc: 'Monitor closely',
    thresholdVeryHeavy: 'Very Heavy',
    thresholdVeryHeavyVal: '100–150 mm',
    thresholdVeryHeavyDesc: 'Elevated flood risk',
    thresholdExtreme: 'Extreme',
    thresholdExtremeVal: '> 150 mm',
    thresholdExtremeDesc: 'Severe rainfall state',
    thresholdNote: 'Note: Configurable application thresholds; synchronized with hydrometric telemetry.',
    situationTitle: 'Current Rainfall Situation',
    situationText: 'Heavy rainfall is currently being observed around Dewal Block and Raini Village. Rainfall accumulation is increasing, with several locations approaching elevated-risk conditions.',
    primaryAffectedTitle: 'Primary Affected Locations',
    tableTitle: 'Rainfall by Location',
    tableSubtitle: 'Monitoring 980 telemetry points across the basin',
    searchPlaceholder: 'Search location...',
    filterAll: 'All',
    filterExtreme: 'Extreme',
    filterHigh: 'High',
    filterMedium: 'Medium',
    filterLow: 'Low',
    sortRainHighLow: 'Rainfall High → Low',
    sortRainLowHigh: 'Rainfall Low → High',
    sortRiskHighLow: 'Risk High → Low',
    perPage: '/ page',
    thLocation: 'Location',
    thDistrict: 'District',
    thRain24h: '24H Rainfall',
    thRain1h: '1H Rainfall',
    thIntensity: 'Intensity',
    thFlashFloodRisk: 'Flash Flood Risk',
    thLastUpdated: 'Last Updated',
    thAction: 'Action',
    btnView: 'View',
    showing: 'Showing',
    to: '–',
    of: 'of',
    locationsWord: 'locations',
    noLocationsFound: 'No locations matched your filter criteria.',
    modalCurrentRainfall: 'Current Rainfall',
    modalPast24h: 'Past 24H',
    modalPast1h: 'Past 1H',
    modalIntensity: 'Intensity',
    modal24hForecast: '24H Forecast',
    modalFloodConditions: 'Flood Conditions',
    modalSoilSaturation: 'Soil Saturation',
    modalRiverLevel: 'River Level',
    modalRiverTrend: 'River Trend',
    modalFlashFloodRisk: 'Flash-Flood Risk',
    modalRainfallHistory: 'Rainfall History (24-Hour Cumulative)',
    modalCurrentSituation: 'Current Situation',
    btnViewRiskAnalysis: 'View Risk Analysis',
    btnViewSensorData: 'View Sensor Data',
    btnClose: 'Close'
  },
  hi: {
    pageTitle: 'वर्षा निगरानी प्रणाली',
    subtitle: 'वास्तविक समय वर्षा डेटा और संचय विश्लेषण',
    lastUpdated: 'अंतिम अपडेट: 20 सितं 2026, 10:52 PM',
    liveData: 'लाइव डेटा',
    card24hTitle: '24 घंटे की वर्षा',
    past24Hours: 'विगत 24 घंटे',
    vsPrevious24h: 'पिछले 24 घंटों की तुलना में',
    card1hTitle: '1 घंटे की वर्षा',
    past1Hour: 'विगत 1 घंटा',
    currentIntensityTitle: 'वर्तमान तीव्रता',
    forecast24hTitle: '24 घंटे का पूर्वानुमान',
    forecast24hLabel: 'पूर्वानुमान (24 घंटे)',
    trendChartTitle: 'वर्षा रुझान — विगत 24 घंटे',
    trendChartSubtitle: 'संचयी वर्षा रेखा:',
    last24HoursDropdown: 'विगत 24 घंटे ▼',
    intensityChartTitle: 'वर्षा तीव्रता — विगत 24 घंटे',
    intensityChartSubtitle: 'प्रत्येक 2 घंटे के अंतराल पर वर्षा की दर',
    intensityLegendLight: '<5',
    intensityLegendMod: '5–10',
    intensityLegendHeavy: '10–20',
    intensityLegendExtreme: '>20',
    regionalCardTitle: 'क्षेत्रीय वर्षा संचय (विगत 24 घंटे)',
    viewAllBtn: 'सभी देखें →',
    scatterTitle: 'वर्षा बनाम अचानक बाढ़ का जोखिम',
    scatterSubtitle: 'विस्तृत जानकारी देखने के लिए किसी भी बिंदु पर क्लिक करें',
    scatterAxisLabel: 'वर्षा (X) बनाम जोखिम (Y)',
    thresholdsCardTitle: 'वर्षा सीमाएं (24 घंटे)',
    thresholdsSubtitle: 'कॉन्फ़िगर करने योग्य पूर्व-चेतावनी वर्गीकरण स्तर (चमोली बेसिन)',
    thresholdNormal: 'सामान्य',
    thresholdNormalVal: '< 50 मिमी',
    thresholdNormalDesc: 'कोई महत्वपूर्ण जोखिम नहीं',
    thresholdHeavy: 'भारी',
    thresholdHeavyVal: '50–100 मिमी',
    thresholdHeavyDesc: 'सख्त निगरानी रखें',
    thresholdVeryHeavy: 'बहुत भारी',
    thresholdVeryHeavyVal: '100–150 मिमी',
    thresholdVeryHeavyDesc: 'बाढ़ का बढ़ा हुआ जोखिम',
    thresholdExtreme: 'अत्यधिक भारी',
    thresholdExtremeVal: '> 150 मिमी',
    thresholdExtremeDesc: 'अत्यंत गंभीर वर्षा स्थिति',
    thresholdNote: 'नोट: एप्लिकेशन थ्रेशोल्ड कॉन्फ़िगर करने योग्य हैं और हाइड्रोलॉजिकल टेलीमेट्री के साथ समन्वयित हैं।',
    situationTitle: 'वर्तमान वर्षा स्थिति',
    situationText: 'देवाल ब्लॉक और रैणी गांव के आसपास भारी बारिश दर्ज की जा रही है। वर्षा संचय लगातार बढ़ रहा है, जिससे कई इलाके उच्च जोखिम की श्रेणी में पहुंच रहे हैं।',
    primaryAffectedTitle: 'प्राथमिक प्रभावित स्थान',
    tableTitle: 'स्थान अनुसार वर्षा विवरण',
    tableSubtitle: 'बेसिन भर में 980 टेलीमेट्री केंद्रों की निगरानी',
    searchPlaceholder: 'स्थान खोजें...',
    filterAll: 'सभी',
    filterExtreme: 'अत्यधिक',
    filterHigh: 'उच्च',
    filterMedium: 'मध्यम',
    filterLow: 'निम्न',
    sortRainHighLow: 'वर्षा: अधिक से कम',
    sortRainLowHigh: 'वर्षा: कम से अधिक',
    sortRiskHighLow: 'जोखिम: अधिक से कम',
    perPage: '/ पृष्ठ',
    thLocation: 'स्थान',
    thDistrict: 'जिला',
    thRain24h: '24 घंटे वर्षा',
    thRain1h: '1 घंटा वर्षा',
    thIntensity: 'तीव्रता',
    thFlashFloodRisk: 'बाढ़ जोखिम',
    thLastUpdated: 'अंतिम अपडेट',
    thAction: 'कार्रवाई',
    btnView: 'देखें',
    showing: 'प्रदर्शित',
    to: '–',
    of: 'कुल',
    locationsWord: 'स्थान',
    noLocationsFound: 'आपके फ़िल्टर से मेल खाता कोई स्थान नहीं मिला।',
    modalCurrentRainfall: 'वर्तमान वर्षा विवरण',
    modalPast24h: 'विगत 24 घंटे',
    modalPast1h: 'विगत 1 घंटा',
    modalIntensity: 'तीव्रता',
    modal24hForecast: '24 घंटे का पूर्वानुमान',
    modalFloodConditions: 'बाढ़ स्थितियां',
    modalSoilSaturation: 'मिट्टी की संतृप्ति',
    modalRiverLevel: 'नदी जलस्तर',
    modalRiverTrend: 'जलस्तर रुझान',
    modalFlashFloodRisk: 'अचानक बाढ़ का जोखिम',
    modalRainfallHistory: 'वर्षा इतिहास (24 घंटे संचयी)',
    modalCurrentSituation: 'वर्तमान स्थिति',
    btnViewRiskAnalysis: 'जोखिम विश्लेषण देखें',
    btnViewSensorData: 'सेंसर डेटा देखें',
    btnClose: 'बंद करें'
  }
};

const INTENSITY_TRANSLATIONS = {
  EXTREME: { en: 'EXTREME', hi: 'अत्यधिक' },
  HEAVY: { en: 'HEAVY', hi: 'भारी' },
  HIGH: { en: 'HIGH', hi: 'उच्च' },
  MODERATE: { en: 'MODERATE', hi: 'मध्यम' },
  LIGHT: { en: 'LIGHT', hi: 'हल्की' }
};

const RIVER_TREND_TRANSLATIONS = {
  'Rapidly Rising': { en: 'Rapidly Rising', hi: 'तीव्र गति से बढ़ रहा है' },
  Rising: { en: 'Rising', hi: 'बढ़ रहा है' },
  Stable: { en: 'Stable', hi: 'स्थिर' },
  Normal: { en: 'Normal', hi: 'सामान्य' }
};

// --- CLASSIFICATION ENGINES ---
const getRiskLevel = (score) => {
  if (score >= 75) return 'EXTREME';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
};

const getRiskLabel = (score, isHi) => {
  const level = getRiskLevel(score);
  if (isHi) {
    switch (level) {
      case 'EXTREME': return 'अत्यधिक';
      case 'HIGH': return 'उच्च';
      case 'MEDIUM': return 'मध्यम';
      case 'LOW': default: return 'निम्न';
    }
  }
  return level;
};

const getRiskStyle = (score) => {
  if (score >= 75) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', fill: 'bg-red-500', stroke: '#ef4444' };
  if (score >= 50) return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', fill: 'bg-orange-500', stroke: '#f97316' };
  if (score >= 25) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', fill: 'bg-amber-500', stroke: '#f59e0b' };
  return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', fill: 'bg-emerald-500', stroke: '#10b981' };
};

const getIntensityBadge = (intensityStr) => {
  const normalized = String(intensityStr).toUpperCase();
  if (normalized.includes('EXTREME')) return { key: 'EXTREME', badge: 'bg-red-100 text-red-700 border-red-200', bar: 'bg-red-500' };
  if (normalized.includes('HEAVY') || normalized.includes('HIGH')) return { key: 'HEAVY', badge: 'bg-orange-100 text-orange-700 border-orange-200', bar: 'bg-orange-500' };
  if (normalized.includes('MODERATE') || normalized.includes('MEDIUM')) return { key: 'MODERATE', badge: 'bg-amber-100 text-amber-700 border-amber-200', bar: 'bg-amber-500' };
  return { key: 'LIGHT', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500' };
};

// --- BASE 10 REALISTIC DATA OBJECTS ---
const BASE_LOCATIONS = [
  {
    id: 'LOC-01',
    locationEn: 'Dewal Block',
    locationHi: 'देवाल ब्लॉक',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 142,
    rainfall1h: 32,
    intensity: 'EXTREME',
    intensityRate: '32 mm/h',
    rainfall24hChangeEn: '+42% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में +42%',
    forecast24h: 95,
    forecastTrendEn: '↑ Expected',
    forecastTrendHi: '↑ संभावित',
    soilMoisture: 94,
    riverLevel: '+2.1 m',
    riverTrend: 'Rapidly Rising',
    floodRiskScore: 91,
    lastUpdated: '10:52 PM',
    situationEn: 'Extreme rainfall continues unabated across the Pindar upper catchment. High saturation is forcing immediate runoff into local tributary networks.',
    situationHi: 'पिंडर के ऊपरी जलग्रहण क्षेत्र में अत्यधिक बारिश जारी है। उच्च मिट्टी संतृप्ति के कारण स्थानीय नालों में तत्काल जलप्रवाह बढ़ रहा है।',
    trendData: [
      { time: '12 AM', cumulative: 16, intensity: 3 },
      { time: '2 AM', cumulative: 22, intensity: 5 },
      { time: '4 AM', cumulative: 31, intensity: 7 },
      { time: '6 AM', cumulative: 40, intensity: 9 },
      { time: '8 AM', cumulative: 56, intensity: 14 },
      { time: '10 AM', cumulative: 68, intensity: 16 },
      { time: '12 PM', cumulative: 82, intensity: 18 },
      { time: '2 PM', cumulative: 98, intensity: 20 },
      { time: '4 PM', cumulative: 110, intensity: 22 },
      { time: '6 PM', cumulative: 122, intensity: 25 },
      { time: '8 PM', cumulative: 132, intensity: 28 },
      { time: '10 PM', cumulative: 142, intensity: 32 }
    ]
  },
  {
    id: 'LOC-02',
    locationEn: 'Raini Village',
    locationHi: 'रैणी गांव',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 112,
    rainfall1h: 18,
    intensity: 'HIGH',
    intensityRate: '18 mm/h',
    rainfall24hChangeEn: '+28% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में +28%',
    forecast24h: 85,
    forecastTrendEn: '↑ Expected',
    forecastTrendHi: '↑ संभावित',
    soilMoisture: 88,
    riverLevel: '+1.2 m',
    riverTrend: 'Rising',
    floodRiskScore: 82,
    lastUpdated: '10:50 PM',
    situationEn: 'Heavy rainfall is continuing and rainfall intensity has increased during the last several hours. Soil saturation and river levels should be monitored closely.',
    situationHi: 'भारी बारिश जारी है और पिछले कुछ घंटों में बारिश की तीव्रता में वृद्धि हुई है। मिट्टी की संतृप्ति और नदी के जलस्तर पर कड़ी नजर रखी जानी चाहिए।',
    trendData: [
      { time: '12 AM', cumulative: 12, intensity: 1 },
      { time: '2 AM', cumulative: 16, intensity: 2 },
      { time: '4 AM', cumulative: 21, intensity: 3 },
      { time: '6 AM', cumulative: 22, intensity: 5 },
      { time: '8 AM', cumulative: 38, intensity: 7 },
      { time: '10 AM', cumulative: 41, intensity: 10 },
      { time: '12 PM', cumulative: 55, intensity: 13 },
      { time: '2 PM', cumulative: 70, intensity: 15 },
      { time: '4 PM', cumulative: 75, intensity: 18 },
      { time: '6 PM', cumulative: 80, intensity: 20 },
      { time: '8 PM', cumulative: 105, intensity: 22 },
      { time: '10 PM', cumulative: 112, intensity: 28 }
    ]
  },
  {
    id: 'LOC-03',
    locationEn: 'Tapovan',
    locationHi: 'तपोवन',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 85,
    rainfall1h: 12,
    intensity: 'HIGH',
    intensityRate: '12 mm/h',
    rainfall24hChangeEn: '+18% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में +18%',
    forecast24h: 68,
    forecastTrendEn: '↑ Expected',
    forecastTrendHi: '↑ संभावित',
    soilMoisture: 79,
    riverLevel: '+0.9 m',
    riverTrend: 'Rising',
    floodRiskScore: 60,
    lastUpdated: '10:48 PM',
    situationEn: 'Sustained rain across the gorge. Headwater gauges indicate progressive swelling of seasonal discharge channels.',
    situationHi: 'घाटी में निरंतर बारिश हो रही है। हेडवाटर गेज मौसमी जलमार्गों में लगातार वृद्धि का संकेत दे रहे हैं।',
    trendData: [
      { time: '12 AM', cumulative: 8, intensity: 1 },
      { time: '2 AM', cumulative: 12, intensity: 2 },
      { time: '4 AM', cumulative: 18, intensity: 3 },
      { time: '6 AM', cumulative: 25, intensity: 4 },
      { time: '8 AM', cumulative: 32, intensity: 6 },
      { time: '10 AM', cumulative: 40, intensity: 8 },
      { time: '12 PM', cumulative: 50, intensity: 10 },
      { time: '2 PM', cumulative: 59, intensity: 11 },
      { time: '4 PM', cumulative: 68, intensity: 12 },
      { time: '6 PM', cumulative: 74, intensity: 12 },
      { time: '8 PM', cumulative: 80, intensity: 12 },
      { time: '10 PM', cumulative: 85, intensity: 12 }
    ]
  },
  {
    id: 'LOC-04',
    locationEn: 'Joshimath',
    locationHi: 'जोशीमठ',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 45,
    rainfall1h: 6,
    intensity: 'MODERATE',
    intensityRate: '6 mm/h',
    rainfall24hChangeEn: '+5% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में +5%',
    forecast24h: 40,
    forecastTrendEn: '→ Steady',
    forecastTrendHi: '→ स्थिर',
    soilMoisture: 68,
    riverLevel: '+0.4 m',
    riverTrend: 'Stable',
    floodRiskScore: 28,
    lastUpdated: '10:47 PM',
    situationEn: 'Intermittent moderate downpours. Infiltration remains steady with drainage ditches coping at nominal velocity.',
    situationHi: 'रुक-रुक कर मध्यम बारिश। जल निकासी नालियां सामान्य वेग से पानी निकाल रही हैं।',
    trendData: [
      { time: '12 AM', cumulative: 4, intensity: 1 },
      { time: '2 AM', cumulative: 8, intensity: 2 },
      { time: '4 AM', cumulative: 12, intensity: 2 },
      { time: '6 AM', cumulative: 15, intensity: 3 },
      { time: '8 AM', cumulative: 20, intensity: 4 },
      { time: '10 AM', cumulative: 25, intensity: 5 },
      { time: '12 PM', cumulative: 30, intensity: 5 },
      { time: '2 PM', cumulative: 34, intensity: 6 },
      { time: '4 PM', cumulative: 38, intensity: 6 },
      { time: '6 PM', cumulative: 40, intensity: 6 },
      { time: '8 PM', cumulative: 43, intensity: 6 },
      { time: '10 PM', cumulative: 45, intensity: 6 }
    ]
  },
  {
    id: 'LOC-05',
    locationEn: 'Chamoli (Main Town)',
    locationHi: 'चमोली (मुख्य नगर)',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 38,
    rainfall1h: 5,
    intensity: 'MODERATE',
    intensityRate: '5 mm/h',
    rainfall24hChangeEn: '-2% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में -2%',
    forecast24h: 32,
    forecastTrendEn: '→ Steady',
    forecastTrendHi: '→ स्थिर',
    soilMoisture: 62,
    riverLevel: '+0.3 m',
    riverTrend: 'Stable',
    floodRiskScore: 24,
    lastUpdated: '10:45 PM',
    situationEn: 'Overcast skies with steady precipitation. No structural pooling or bank overflow observed.',
    situationHi: 'बादल छाए रहने के साथ धीमी बारिश जारी है। किनारों पर किसी तरह के जलभराव की सूचना नहीं है।',
    trendData: [
      { time: '12 AM', cumulative: 3, intensity: 1 },
      { time: '2 AM', cumulative: 6, intensity: 1 },
      { time: '4 AM', cumulative: 10, intensity: 2 },
      { time: '6 AM', cumulative: 14, intensity: 2 },
      { time: '8 AM', cumulative: 18, intensity: 3 },
      { time: '10 AM', cumulative: 22, intensity: 4 },
      { time: '12 PM', cumulative: 27, intensity: 4 },
      { time: '2 PM', cumulative: 30, intensity: 5 },
      { time: '4 PM', cumulative: 32, intensity: 5 },
      { time: '6 PM', cumulative: 34, intensity: 5 },
      { time: '8 PM', cumulative: 36, intensity: 5 },
      { time: '10 PM', cumulative: 38, intensity: 5 }
    ]
  },
  {
    id: 'LOC-06',
    locationEn: 'Gopeshwar',
    locationHi: 'गोपेश्वर',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 31,
    rainfall1h: 4,
    intensity: 'LIGHT',
    intensityRate: '4 mm/h',
    rainfall24hChangeEn: '-8% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में -8%',
    forecast24h: 24,
    forecastTrendEn: '↓ Decreasing',
    forecastTrendHi: '↓ घट रहा है',
    soilMoisture: 52,
    riverLevel: 'Normal',
    riverTrend: 'Stable',
    floodRiskScore: 18,
    lastUpdated: '10:44 PM',
    situationEn: 'Mild showers. All municipal and natural stream exits remain unobstructed.',
    situationHi: 'हल्की बारिश। सभी प्राकृतिक जल प्रवाह सामान्य रूप से कार्य कर रहे हैं।',
    trendData: [
      { time: '12 AM', cumulative: 2, intensity: 1 },
      { time: '2 AM', cumulative: 5, intensity: 1 },
      { time: '4 AM', cumulative: 8, intensity: 1 },
      { time: '6 AM', cumulative: 11, intensity: 2 },
      { time: '8 AM', cumulative: 14, intensity: 2 },
      { time: '10 AM', cumulative: 18, intensity: 3 },
      { time: '12 PM', cumulative: 21, intensity: 3 },
      { time: '2 PM', cumulative: 24, intensity: 3 },
      { time: '4 PM', cumulative: 27, intensity: 4 },
      { time: '6 PM', cumulative: 29, intensity: 4 },
      { time: '8 PM', cumulative: 30, intensity: 4 },
      { time: '10 PM', cumulative: 31, intensity: 4 }
    ]
  },
  {
    id: 'LOC-07',
    locationEn: 'Helang',
    locationHi: 'हेलांग',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 98,
    rainfall1h: 21,
    intensity: 'EXTREME',
    intensityRate: '21 mm/h',
    rainfall24hChangeEn: '+31% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में +31%',
    forecast24h: 78,
    forecastTrendEn: '↑ Expected',
    forecastTrendHi: '↑ संभावित',
    soilMoisture: 84,
    riverLevel: '+1.1 m',
    riverTrend: 'Rising',
    floodRiskScore: 75,
    lastUpdated: '10:51 PM',
    situationEn: 'Rapid accumulation on exposed ridges. Slope erosion warning active for highway passes.',
    situationHi: 'खुली पहाड़ियों पर तीव्र जल संचय। राष्ट्रीय राजमार्ग के लिए भूस्खलन चेतावनी जारी।',
    trendData: [
      { time: '12 AM', cumulative: 10, intensity: 2 },
      { time: '2 AM', cumulative: 18, intensity: 3 },
      { time: '4 AM', cumulative: 26, intensity: 5 },
      { time: '6 AM', cumulative: 35, intensity: 7 },
      { time: '8 AM', cumulative: 48, intensity: 10 },
      { time: '10 AM', cumulative: 58, intensity: 12 },
      { time: '12 PM', cumulative: 68, intensity: 14 },
      { time: '2 PM', cumulative: 76, intensity: 16 },
      { time: '4 PM', cumulative: 82, intensity: 18 },
      { time: '6 PM', cumulative: 88, intensity: 19 },
      { time: '8 PM', cumulative: 92, intensity: 20 },
      { time: '10 PM', cumulative: 98, intensity: 21 }
    ]
  },
  {
    id: 'LOC-08',
    locationEn: 'Karnaprayag',
    locationHi: 'कर्णप्रयाग',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 58,
    rainfall1h: 9,
    intensity: 'MODERATE',
    intensityRate: '9 mm/h',
    rainfall24hChangeEn: '+11% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में +11%',
    forecast24h: 50,
    forecastTrendEn: '→ Steady',
    forecastTrendHi: '→ स्थिर',
    soilMoisture: 71,
    riverLevel: '+0.6 m',
    riverTrend: 'Rising',
    floodRiskScore: 53,
    lastUpdated: '10:49 PM',
    situationEn: 'Confluence receives steady tributary influx. Confluence waterline is high but stable.',
    situationHi: 'संगम स्थल पर निरंतर पानी की आवक बनी हुई है। जलस्तर ऊंचा है परंतु स्थिर है।',
    trendData: [
      { time: '12 AM', cumulative: 5, intensity: 1 },
      { time: '2 AM', cumulative: 10, intensity: 2 },
      { time: '4 AM', cumulative: 15, intensity: 3 },
      { time: '6 AM', cumulative: 20, intensity: 4 },
      { time: '8 AM', cumulative: 26, intensity: 5 },
      { time: '10 AM', cumulative: 32, intensity: 6 },
      { time: '12 PM', cumulative: 38, intensity: 7 },
      { time: '2 PM', cumulative: 44, intensity: 8 },
      { time: '4 PM', cumulative: 48, intensity: 8 },
      { time: '6 PM', cumulative: 52, intensity: 9 },
      { time: '8 PM', cumulative: 55, intensity: 9 },
      { time: '10 PM', cumulative: 58, intensity: 9 }
    ]
  },
  {
    id: 'LOC-09',
    locationEn: 'Pipalkoti',
    locationHi: 'पीपलकोटी',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 28,
    rainfall1h: 3,
    intensity: 'LIGHT',
    intensityRate: '3 mm/h',
    rainfall24hChangeEn: '-12% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में -12%',
    forecast24h: 20,
    forecastTrendEn: '↓ Decreasing',
    forecastTrendHi: '↓ घट रहा है',
    soilMoisture: 58,
    riverLevel: 'Normal',
    riverTrend: 'Stable',
    floodRiskScore: 28,
    lastUpdated: '10:46 PM',
    situationEn: 'Scattered light precipitation across mid-elevation terraces. No anomalies registered.',
    situationHi: 'हल्की छिटपुट बारिश दर्ज की गई है। कोई असामान्य स्थिति नहीं है।',
    trendData: [
      { time: '12 AM', cumulative: 2, intensity: 1 },
      { time: '2 AM', cumulative: 5, intensity: 1 },
      { time: '4 AM', cumulative: 8, intensity: 2 },
      { time: '6 AM', cumulative: 11, intensity: 2 },
      { time: '8 AM', cumulative: 14, intensity: 2 },
      { time: '10 AM', cumulative: 18, intensity: 3 },
      { time: '12 PM', cumulative: 20, intensity: 3 },
      { time: '2 PM', cumulative: 22, intensity: 3 },
      { time: '4 PM', cumulative: 24, intensity: 3 },
      { time: '6 PM', cumulative: 26, intensity: 3 },
      { time: '8 PM', cumulative: 27, intensity: 3 },
      { time: '10 PM', cumulative: 28, intensity: 3 }
    ]
  },
  {
    id: 'LOC-10',
    locationEn: 'Badrinath',
    locationHi: 'बद्रीनाथ',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    rainfall24h: 128,
    rainfall1h: 26,
    intensity: 'EXTREME',
    intensityRate: '26 mm/h',
    rainfall24hChangeEn: '+38% vs previous 24h',
    rainfall24hChangeHi: 'विगत 24 घंटे की तुलना में +38%',
    forecast24h: 90,
    forecastTrendEn: '↑ Expected',
    forecastTrendHi: '↑ संभावित',
    soilMoisture: 91,
    riverLevel: '+1.8 m',
    riverTrend: 'Rapidly Rising',
    floodRiskScore: 88,
    lastUpdated: '10:53 PM',
    situationEn: 'Northern basin cloud cover triggering persistent torrents. Immediate riverside alert issued.',
    situationHi: 'उत्तरी बेसिन में घने बादलों से मूसलाधार बारिश। नदी तटों के लिए चेतावनी जारी।',
    trendData: [
      { time: '12 AM', cumulative: 14, intensity: 2 },
      { time: '2 AM', cumulative: 24, intensity: 4 },
      { time: '4 AM', cumulative: 36, intensity: 6 },
      { time: '6 AM', cumulative: 48, intensity: 9 },
      { time: '8 AM', cumulative: 62, intensity: 12 },
      { time: '10 AM', cumulative: 75, intensity: 15 },
      { time: '12 PM', cumulative: 88, intensity: 18 },
      { time: '2 PM', cumulative: 98, intensity: 20 },
      { time: '4 PM', cumulative: 108, intensity: 22 },
      { time: '6 PM', cumulative: 116, intensity: 24 },
      { time: '8 PM', cumulative: 122, intensity: 25 },
      { time: '10 PM', cumulative: 128, intensity: 26 }
    ]
  }
];

// 980 procedural locations generator
const generate980Locations = () => {
  const result = [];
  const TOTAL = 980;

  for (let i = 0; i < TOTAL; i++) {
    const base = BASE_LOCATIONS[i % BASE_LOCATIONS.length];
    const isBase = i < BASE_LOCATIONS.length;
    const sector = Math.floor(i / BASE_LOCATIONS.length) + 1;

    const rainOffset = isBase ? 0 : ((i * 11) % 31) - 15;
    const calcRain24 = Math.max(8, base.rainfall24h + rainOffset);
    const calcRain1 = Math.max(1, Math.round(calcRain24 * 0.18));
    const calcRisk = Math.max(10, Math.min(95, base.floodRiskScore + (isBase ? 0 : ((i * 7) % 21) - 10)));

    let intensityTag = 'LIGHT';
    if (calcRain1 >= 20) intensityTag = 'EXTREME';
    else if (calcRain1 >= 10) intensityTag = 'HEAVY';
    else if (calcRain1 >= 5) intensityTag = 'MODERATE';

    result.push({
      id: isBase ? base.id : `LOC-${String(i + 1).padStart(3, '0')}`,
      locationEn: isBase ? base.locationEn : `${base.locationEn.split(' ')[0]} Sector-${sector}`,
      locationHi: isBase ? base.locationHi : `${base.locationHi.split(' ')[0]} सेक्टर-${sector}`,
      districtEn: base.districtEn,
      districtHi: base.districtHi,
      rainfall24h: calcRain24,
      rainfall1h: calcRain1,
      intensity: intensityTag,
      intensityRate: `${calcRain1} mm/h`,
      rainfall24hChangeEn: base.rainfall24hChangeEn,
      rainfall24hChangeHi: base.rainfall24hChangeHi,
      forecast24h: Math.round(calcRain24 * 0.8),
      forecastTrendEn: base.forecastTrendEn,
      forecastTrendHi: base.forecastTrendHi,
      soilMoisture: Math.max(30, Math.min(96, base.soilMoisture + (isBase ? 0 : ((i % 11) - 5)))),
      riverLevel: base.riverLevel,
      riverTrend: base.riverTrend,
      floodRiskScore: calcRisk,
      lastUpdated: base.lastUpdated,
      situationEn: base.situationEn,
      situationHi: base.situationHi,
      trendData: base.trendData.map(pt => ({
        time: pt.time,
        cumulative: Math.max(2, Math.round((pt.cumulative / base.rainfall24h) * calcRain24)),
        intensity: Math.max(1, Math.round((pt.intensity / (base.rainfall1h || 1)) * calcRain1))
      }))
    });
  }
  return result;
};

const ALL_980_LOCATIONS = generate980Locations();

// ==========================================
// REUSABLE CARTESIAN CHARTS
// ==========================================

const RainfallTrendChart = ({ data, isHi }) => {
  const maxVal = Math.max(...data.map(d => d.cumulative), 140) * 1.1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.cumulative / maxVal) * 100}`).join(' ');

  return (
    <div className="flex w-full h-[220px] mt-2 pr-2">
      <div className="w-10 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>{Math.round(maxVal)}</span>
        <span>{Math.round(maxVal * 0.66)}</span>
        <span>{Math.round(maxVal * 0.33)}</span>
        <span>0</span>
      </div>

      <div className="flex-1 relative border-b border-slate-200">
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-300"></div>
        </div>

        <svg className="absolute inset-0 bottom-6 w-full h-[calc(100%-24px)] z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {data.map((d, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const bottomPos = (d.cumulative / maxVal) * 100;

          return (
            <div 
              key={i} 
              className="absolute top-0 bottom-6 z-20 group cursor-pointer"
              style={{ left: `${leftPos}%`, width: '28px', transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2 z-0"></div>

              <div 
                className="absolute left-1/2 w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow-sm transform -translate-x-1/2 translate-y-1/2 z-30 transition-transform group-hover:scale-150"
                style={{ bottom: `${bottomPos}%` }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-slate-300 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-slate-400 whitespace-nowrap pt-1">
                {d.time}
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-blue-300">{d.time}</div>
                <div>{isHi ? 'वर्षा' : 'Rainfall'}: <span className="font-black text-white">{d.cumulative} mm</span></div>
                <div>{isHi ? 'तीव्रता' : 'Intensity'}: <span className="font-bold text-amber-300">{d.intensity} mm/h</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RainfallIntensityChart = ({ data, isHi }) => {
  const maxIntensity = Math.max(...data.map(d => d.intensity), 30);

  return (
    <div className="flex w-full h-[220px] mt-2 pr-2">
      <div className="w-10 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>{maxIntensity}</span>
        <span>{Math.round(maxIntensity * 0.66)}</span>
        <span>{Math.round(maxIntensity * 0.33)}</span>
        <span>0</span>
      </div>

      <div className="flex-1 relative border-b border-slate-200">
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-300"></div>
        </div>

        {data.map((d, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const barHeightPct = (d.intensity / maxIntensity) * 100;
          const badge = getIntensityBadge(d.intensity > 20 ? 'EXTREME' : d.intensity > 10 ? 'HEAVY' : d.intensity > 5 ? 'MODERATE' : 'LIGHT');
          const intensityLabel = INTENSITY_TRANSLATIONS[badge.key]?.[isHi ? 'hi' : 'en'] || badge.key;

          return (
            <div 
              key={i}
              className="absolute top-0 bottom-6 z-20 group flex flex-col items-center cursor-pointer"
              style={{ left: `${leftPos}%`, width: '22px', transform: 'translateX(-50%)' }}
            >
              <div 
                className={`w-3/4 rounded-t-xs transition-colors mt-auto ${badge.bar}`}
                style={{ height: `${barHeightPct}%` }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-slate-300 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-slate-400 whitespace-nowrap pt-1">
                {d.time}
              </span>

              <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-blue-300">{d.time}</div>
                <div>{isHi ? 'दर' : 'Rate'}: <span className="font-black text-white">{d.intensity} mm/h</span></div>
                <div>{isHi ? 'श्रेणी' : 'Class'}: <span className="font-bold text-amber-300">{intensityLabel}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RainfallRiskChart = ({ points, onSelectLocation, isHi }) => {
  const maxRain = 160;
  const maxRisk = 100;

  return (
    <div className="flex w-full h-[230px] mt-2 pr-2">
      <div className="w-10 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>100</span>
        <span>75</span>
        <span>50</span>
        <span>25</span>
        <span>0</span>
      </div>

      <div className="flex-1 relative border-b border-slate-200">
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-300"></div>
        </div>

        <svg className="absolute inset-0 bottom-6 w-full h-[calc(100%-24px)] z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <line x1="0" y1="100" x2="100" y2="0" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>

        {points.map((pt, i) => {
          const leftPos = (pt.rainfall24h / maxRain) * 100;
          const bottomPos = (pt.floodRiskScore / maxRisk) * 100;
          const style = getRiskStyle(pt.floodRiskScore);

          return (
            <div 
              key={i} 
              onClick={() => onSelectLocation(pt)}
              className="absolute z-20 group cursor-pointer"
              style={{ left: `${leftPos}%`, bottom: `calc(${bottomPos}% + 24px)`, transform: 'translate(-50%, 50%)' }}
            >
              <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-150 ${style.fill}`}></div>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2.5 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-black text-blue-300 text-xs">{isHi ? pt.locationHi : pt.locationEn}</div>
                <div>{isHi ? 'वर्षा' : 'Rainfall'}: <span className="font-bold text-white">{pt.rainfall24h} mm</span></div>
                <div>{isHi ? 'जोखिम स्कोर' : 'Risk Score'}: <span className="font-bold text-white">{pt.floodRiskScore} / 100</span></div>
                <div>{isHi ? 'स्तर' : 'Level'}: <span className={`font-black uppercase ${style.text}`}>{getRiskLabel(pt.floodRiskScore, isHi)}</span></div>
              </div>
            </div>
          );
        })}

        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] font-bold text-slate-400 pt-1">
          <span>0 mm</span>
          <span>40 mm</span>
          <span>80 mm</span>
          <span>120 mm</span>
          <span>160 mm</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Rainfall() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;

  // Interactive State
  const [selectedLocationId, setSelectedLocationId] = useState('LOC-02');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortField, setSortField] = useState('Rainfall High → Low');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalLocation, setModalLocation] = useState(null);

  // Active Location
  const activeLocation = useMemo(() => {
    return ALL_980_LOCATIONS.find(loc => loc.id === selectedLocationId) || ALL_980_LOCATIONS[1];
  }, [selectedLocationId]);

  // Scatter representative nodes
  const scatterRepresentativePoints = useMemo(() => {
    return [
      ALL_980_LOCATIONS.find(l => l.locationEn.includes('Joshimath')) || ALL_980_LOCATIONS[3],
      ALL_980_LOCATIONS.find(l => l.locationEn.includes('Gopeshwar')) || ALL_980_LOCATIONS[5],
      ALL_980_LOCATIONS.find(l => l.locationEn.includes('Tapovan')) || ALL_980_LOCATIONS[2],
      ALL_980_LOCATIONS.find(l => l.locationEn.includes('Raini')) || ALL_980_LOCATIONS[1],
      ALL_980_LOCATIONS.find(l => l.locationEn.includes('Dewal')) || ALL_980_LOCATIONS[0],
      ALL_980_LOCATIONS.find(l => l.locationEn.includes('Badrinath')) || ALL_980_LOCATIONS[9]
    ];
  }, []);

  // Filtered Table Data
  const filteredTableData = useMemo(() => {
    let dataset = ALL_980_LOCATIONS.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.locationEn.toLowerCase().includes(q) ||
                            item.locationHi.toLowerCase().includes(q) ||
                            item.districtEn.toLowerCase().includes(q) ||
                            item.districtHi.toLowerCase().includes(q);
      const level = getRiskLevel(item.floodRiskScore);
      let matchesRisk = true;
      if (riskFilter !== 'All') {
        matchesRisk = level === riskFilter.toUpperCase();
      }
      return matchesSearch && matchesRisk;
    });

    if (sortField === 'Rainfall High → Low') {
      dataset.sort((a, b) => b.rainfall24h - a.rainfall24h);
    } else if (sortField === 'Rainfall Low → High') {
      dataset.sort((a, b) => a.rainfall24h - b.rainfall24h);
    } else if (sortField === 'Risk High → Low') {
      dataset.sort((a, b) => b.floodRiskScore - a.floodRiskScore);
    }

    return dataset;
  }, [searchQuery, riskFilter, sortField]);

  // Pagination Engine
  const totalPages = Math.ceil(filteredTableData.length / rowsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedLocations = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filteredTableData.slice(start, start + rowsPerPage);
  }, [filteredTableData, safePage, rowsPerPage]);

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-14 animate-fadeIn">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CloudRain className="w-6 h-6 text-blue-700" />
            </div>
            {t.pageTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="appearance-none bg-white border border-slate-300 text-slate-800 font-bold text-xs py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              {BASE_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {isHi ? loc.locationHi : loc.locationEn}, {isHi ? loc.districtHi : loc.districtEn}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium border-l border-slate-200 pl-3">
            <span>{isHi ? 'अंतिम अपडेट:' : 'Last Updated:'} <strong className="text-slate-800 font-bold">20 Sep 2026, 10:52 PM</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {t.liveData}
          </div>
        </div>
      </div>

      {/* 2. TOP RAINFALL SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: 24H RAINFALL */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.card24hTitle}</span>
            <CloudRain className="w-4 h-4 text-blue-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">{activeLocation.rainfall24h} mm</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.past24Hours}</span>
          </div>
          <div className="text-xs font-bold text-blue-600 flex items-center gap-1 border-t border-slate-100 pt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> {isHi ? activeLocation.rainfall24hChangeHi : activeLocation.rainfall24hChangeEn}
          </div>
        </div>

        {/* CARD 2: 1H RAINFALL */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.card1hTitle}</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">{activeLocation.rainfall1h} mm</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.past1Hour}</span>
          </div>
          <div className="text-xs font-bold text-orange-600 border-t border-slate-100 pt-2">
            {INTENSITY_TRANSLATIONS[getIntensityBadge(activeLocation.intensity).key]?.[isHi ? 'hi' : 'en']}
          </div>
        </div>

        {/* CARD 3: CURRENT INTENSITY */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.currentIntensityTitle}</span>
            <Gauge className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900 leading-none">
              {INTENSITY_TRANSLATIONS[getIntensityBadge(activeLocation.intensity).key]?.[isHi ? 'hi' : 'en']}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.currentIntensityTitle}</span>
          </div>
          <div className="text-xs font-bold text-slate-600 border-t border-slate-100 pt-2">
            {activeLocation.intensityRate}
          </div>
        </div>

        {/* CARD 4: 24H FORECAST */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.forecast24hTitle}</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">{activeLocation.forecast24h} mm</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.forecast24hLabel}</span>
          </div>
          <div className="text-xs font-bold text-blue-600 border-t border-slate-100 pt-2">
            {isHi ? activeLocation.forecastTrendHi : activeLocation.forecastTrendEn}
          </div>
        </div>
      </div>

      {/* 3 & 4. RAINFALL TREND & INTENSITY GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> {t.trendChartTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {t.trendChartSubtitle} {isHi ? activeLocation.locationHi : activeLocation.locationEn}
              </span>
            </div>
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600">
              {t.last24HoursDropdown}
            </div>
          </div>
          <RainfallTrendChart data={activeLocation.trendData} isHi={isHi} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" /> {t.intensityChartTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{t.intensityChartSubtitle}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-emerald-500"></div> {t.intensityLegendLight}</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-amber-500"></div> {t.intensityLegendMod}</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-orange-500"></div> {t.intensityLegendHeavy}</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-red-500"></div> {t.intensityLegendExtreme}</span>
            </div>
          </div>
          <RainfallIntensityChart data={activeLocation.trendData} isHi={isHi} />
        </div>
      </div>

      {/* 5 & 6. REGIONAL ACCUMULATION & SCATTER GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" /> {t.regionalCardTitle}
            </h3>
            <button 
              onClick={() => {
                const el = document.getElementById('rainfall-location-table');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {t.viewAllBtn}
            </button>
          </div>

          <div className="flex flex-col gap-4 flex-1 justify-center">
            {BASE_LOCATIONS.slice(0, 6).map((item) => {
              const maxAccum = 160;
              const pct = (item.rainfall24h / maxAccum) * 100;
              const badge = getIntensityBadge(item.intensity);
              const intensityLabel = INTENSITY_TRANSLATIONS[badge.key]?.[isHi ? 'hi' : 'en'] || badge.key;

              return (
                <div 
                  key={item.id} 
                  onClick={() => setModalLocation(item)}
                  className="flex flex-col gap-1.5 group cursor-pointer"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {isHi ? item.locationHi : item.locationEn}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{item.rainfall24h} mm</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${badge.badge}`}>
                        {intensityLabel}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-sm overflow-hidden flex">
                    <div 
                      className={`h-full rounded-r-xs transition-all duration-500 ${badge.bar}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" /> {t.scatterTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{t.scatterSubtitle}</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">
              {t.scatterAxisLabel}
            </div>
          </div>
          <RainfallRiskChart points={scatterRepresentativePoints} onSelectLocation={setModalLocation} isHi={isHi} />
        </div>
      </div>

      {/* 7 & 8. THRESHOLDS & CURRENT SITUATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" /> {t.thresholdsCardTitle}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mb-4">
              {t.thresholdsSubtitle}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                <span className="text-[10px] font-black text-emerald-800 uppercase block mb-0.5">{t.thresholdNormal}</span>
                <span className="text-sm font-black text-slate-900 block">{t.thresholdNormalVal}</span>
                <span className="text-[9px] font-medium text-slate-500 mt-1 block">{t.thresholdNormalDesc}</span>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                <span className="text-[10px] font-black text-amber-800 uppercase block mb-0.5">{t.thresholdHeavy}</span>
                <span className="text-sm font-black text-slate-900 block">{t.thresholdHeavyVal}</span>
                <span className="text-[9px] font-medium text-slate-500 mt-1 block">{t.thresholdHeavyDesc}</span>
              </div>
              <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-xl">
                <span className="text-[10px] font-black text-orange-800 uppercase block mb-0.5">{t.thresholdVeryHeavy}</span>
                <span className="text-sm font-black text-slate-900 block">{t.thresholdVeryHeavyVal}</span>
                <span className="text-[9px] font-medium text-slate-500 mt-1 block">{t.thresholdVeryHeavyDesc}</span>
              </div>
              <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl">
                <span className="text-[10px] font-black text-red-800 uppercase block mb-0.5">{t.thresholdExtreme}</span>
                <span className="text-sm font-black text-slate-900 block">{t.thresholdExtremeVal}</span>
                <span className="text-[9px] font-medium text-slate-500 mt-1 block">{t.thresholdExtremeDesc}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <Info className="w-3.5 h-3.5" /> {t.thresholdNote}
          </div>
        </div>

        <div className="bg-blue-50/60 rounded-2xl border border-blue-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" /> {t.situationTitle}
            </h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mb-6 bg-white/70 p-4 rounded-xl border border-blue-100/60 shadow-2xs">
              “{t.situationText}”
            </p>
          </div>

          <div>
            <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest block mb-2">
              {t.primaryAffectedTitle}
            </span>
            <div className="flex flex-wrap gap-2">
              {['Dewal Block', 'Raini Village', 'Tapovan'].map((locEn) => {
                const target = ALL_980_LOCATIONS.find(l => l.locationEn.includes(locEn.split(' ')[0]));
                const locLabel = isHi ? (target?.locationHi || locEn) : locEn;
                return (
                  <button
                    key={locEn}
                    onClick={() => {
                      if (target) {
                        setSelectedLocationId(target.id);
                        setModalLocation(target);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {locLabel}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 9 & 10. RAINFALL BY LOCATION TABLE */}
      <div id="rainfall-location-table" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">{t.tableTitle}</h3>
            <p className="text-xs text-slate-500 font-medium">{t.tableSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:flex-initial sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex overflow-x-auto gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { key: 'All', label: t.filterAll },
                { key: 'Extreme', label: t.filterExtreme },
                { key: 'High', label: t.filterHigh },
                { key: 'Medium', label: t.filterMedium },
                { key: 'Low', label: t.filterLow }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setRiskFilter(key); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all
                    ${riskFilter === key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="Rainfall High → Low">{t.sortRainHighLow}</option>
              <option value="Rainfall Low → High">{t.sortRainLowHigh}</option>
              <option value="Risk High → Low">{t.sortRiskHighLow}</option>
            </select>

            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value={10}>10 {t.perPage}</option>
              <option value={20}>20 {t.perPage}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">{t.thLocation}</th>
                <th className="py-3.5 px-4">{t.thDistrict}</th>
                <th className="py-3.5 px-4 text-right">{t.thRain24h}</th>
                <th className="py-3.5 px-4 text-right">{t.thRain1h}</th>
                <th className="py-3.5 px-4">{t.thIntensity}</th>
                <th className="py-3.5 px-4">{t.thFlashFloodRisk}</th>
                <th className="py-3.5 px-4">{t.thLastUpdated}</th>
                <th className="py-3.5 px-4 text-center">{t.thAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {paginatedLocations.map((row, idx) => {
                const globalIndex = (safePage - 1) * rowsPerPage + idx + 1;
                const riskInfo = getRiskStyle(row.floodRiskScore);
                const intensityBadge = getIntensityBadge(row.intensity);
                const intensityLabel = INTENSITY_TRANSLATIONS[intensityBadge.key]?.[isHi ? 'hi' : 'en'] || row.intensity;

                return (
                  <tr 
                    key={row.id}
                    onClick={() => setModalLocation(row)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-400 text-center">{globalIndex}</td>
                    
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {isHi ? row.locationHi : row.locationEn}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">
                      {isHi ? row.districtHi : row.districtEn}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-xs">
                      {row.rainfall24h} mm
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-600 text-xs">
                      {row.rainfall1h} mm
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${intensityBadge.badge}`}>
                        {intensityLabel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black ${riskInfo.text}`}>
                          {row.floodRiskScore} / 100
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${riskInfo.bg} ${riskInfo.text}`}>
                          {getRiskLabel(row.floodRiskScore, isHi)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-400 font-semibold">
                      {row.lastUpdated}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setModalLocation(row); }}
                        className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-600 border border-blue-200 hover:border-blue-600 rounded-md text-xs font-bold transition-all shadow-2xs"
                      >
                        {t.btnView}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {paginatedLocations.length === 0 && (
          <div className="py-16 text-center text-slate-400 font-medium">
            <CloudRain className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            {t.noLocationsFound}
          </div>
        )}

        {/* 12. PAGINATION BAR */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500">
            {t.showing} <span className="text-slate-900 font-black">{(safePage - 1) * rowsPerPage + 1}</span>{t.to}
            <span className="text-slate-900 font-black">{Math.min(safePage * rowsPerPage, filteredTableData.length)}</span> {t.of}{' '}
            <span className="text-slate-900 font-black">{filteredTableData.length}</span> {t.locationsWord}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-all border
                  ${safePage === num ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {num}
              </button>
            ))}

            {totalPages > 7 && (
              <span className="px-1 text-slate-400 font-bold text-xs">...</span>
            )}

            {totalPages > 5 && (
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-all border
                  ${safePage === totalPages ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 11. LOCATION DETAILS POPUP MODAL */}
      {modalLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-2xl font-black text-slate-900">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  {isHi ? modalLocation.locationHi : modalLocation.locationEn}
                </div>
                <span className="text-xs text-slate-500 font-semibold ml-8">
                  {isHi ? modalLocation.districtHi : modalLocation.districtEn}, Uttarakhand • {isHi ? 'अंतिम अपडेट:' : 'Last Updated:'} {modalLocation.lastUpdated}
                </span>
              </div>
              <button
                onClick={() => setModalLocation(null)}
                className="p-1.5 hover:bg-slate-200/70 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalCurrentRainfall}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.modalPast24h}</span>
                    <span className="text-xl font-black text-slate-900">{modalLocation.rainfall24h} mm</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.modalPast1h}</span>
                    <span className="text-xl font-black text-slate-900">{modalLocation.rainfall1h} mm</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.modalIntensity}</span>
                    <span className="text-sm font-black text-slate-900">
                      {INTENSITY_TRANSLATIONS[getIntensityBadge(modalLocation.intensity).key]?.[isHi ? 'hi' : 'en']}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold block">{modalLocation.intensityRate}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.modal24hForecast}</span>
                    <span className="text-xl font-black text-slate-900">{modalLocation.forecast24h} mm</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalFloodConditions}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">{t.modalSoilSaturation}</span>
                    <span className="text-xl font-black text-slate-900">{modalLocation.soilMoisture}%</span>
                  </div>
                  <div className="p-3.5 bg-cyan-50/60 rounded-xl border border-cyan-100">
                    <span className="text-[10px] font-bold text-cyan-800 uppercase block mb-1">{t.modalRiverLevel}</span>
                    <span className="text-xl font-black text-slate-900">{modalLocation.riverLevel}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.modalRiverTrend}</span>
                    <span className="text-sm font-black text-slate-900">
                      {RIVER_TREND_TRANSLATIONS[modalLocation.riverTrend]?.[isHi ? 'hi' : 'en'] || modalLocation.riverTrend}
                    </span>
                  </div>
                  <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-100">
                    <span className="text-[10px] font-bold text-red-800 uppercase block mb-1">{t.modalFlashFloodRisk}</span>
                    <span className="text-xl font-black text-red-700">{modalLocation.floodRiskScore} / 100</span>
                    <span className="text-[9px] font-black uppercase text-red-600 block">{getRiskLabel(modalLocation.floodRiskScore, isHi)}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalRainfallHistory}</span>
                <RainfallTrendChart data={modalLocation.trendData} isHi={isHi} />
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">{t.modalCurrentSituation}</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {isHi ? modalLocation.situationHi : modalLocation.situationEn}
                </p>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => alert(`Navigating to Risk Analysis for ${isHi ? modalLocation.locationHi : modalLocation.locationEn}...`)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-xs shadow-2xs"
              >
                <ShieldAlert className="w-4 h-4" /> {t.btnViewRiskAnalysis}
              </button>
              <button 
                onClick={() => alert(`Navigating to Live Sensors for ${isHi ? modalLocation.locationHi : modalLocation.locationEn}...`)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition-colors text-xs"
              >
                <Activity className="w-4 h-4" /> {t.btnViewSensorData}
              </button>
              <button 
                onClick={() => setModalLocation(null)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors text-xs"
              >
                {t.btnClose}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}