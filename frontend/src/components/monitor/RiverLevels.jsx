import React, { useState, useMemo } from 'react';
import { 
  Waves, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus, 
  ChevronDown, Search, ChevronLeft, ChevronRight, X, 
  Activity, ShieldAlert, CloudRain, Droplets, MapPin, 
  BarChart3, TrendingUp, Info, CheckCircle2, SlidersHorizontal
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- BILINGUAL TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'River Level Telemetry',
    subtitle: 'Live hydrometric station data across the Chamoli basin',
    lastUpdated: 'Last Updated: 20 Sep 2026, 10:52 PM',
    liveData: 'Live Data',
    totalStations: 'Total Stations',
    acrossBasin: 'Across Chamoli basin',
    normal: 'Normal',
    normalThresholdSubtext: '< 70% of threshold',
    warning: 'Warning',
    warningThresholdSubtext: '70% – 90% of threshold',
    critical: 'Critical',
    criticalThresholdSubtext: '> 90% of threshold',
    trendChartTitle: 'River Level Trend',
    selectedStationLabel: 'Selected station:',
    last24HoursDropdown: 'Last 24 Hours ▼',
    flowTrendTitle: 'Flow Rate Trend',
    dischargeUnit: 'Discharge (m³/s)',
    flowIncreaseInsight: 'Flow rate has increased by',
    flowIncreaseSuffix: 'in the last 6 hours.',
    majorStationsTitle: 'Major River Stations',
    flowRateLabel: 'Flow Rate:',
    warningLabel: 'Warning:',
    criticalLabel: 'Critical:',
    comparisonTitle: 'River Level Comparison',
    comparisonSubtitle: 'Comparing major stations against configured thresholds',
    legendCurrent: 'Current',
    legendWarn: 'Warn',
    legendCrit: 'Crit',
    situationTitle: 'Current River Situation',
    situationText: 'Dhauliganga river level is currently in the critical zone and continues to rise due to heavy upstream rainfall. Rishi Ganga and Pindar are also showing increasing trends.',
    keyPointsTitle: 'Key Points',
    keyPoints: [
      'Dhauliganga is approaching the critical threshold.',
      'Rising trend observed in 3 of 5 major rivers.',
      'Increased flow is associated with upstream rainfall.',
      'Downstream areas should remain under close monitoring.'
    ],
    operationalBrief: 'Operational Brief',
    channelsLinked: 'All Basin Channels Linked',
    allStationsTitle: 'All River Stations',
    allStationsSubtitle: 'Hydrometric monitoring telemetry across 12 basin nodes',
    searchPlaceholder: 'Search river or location...',
    filterAllRivers: 'All Rivers',
    filterAllStatus: 'All Status',
    sortLevelHighLow: 'River Level High → Low',
    sortLevelLowHigh: 'River Level Low → High',
    sortFlowHighLow: 'Flow Rate High → Low',
    perPage: '/ page',
    thRiver: 'River',
    thLocation: 'Location',
    thCurrentLevel: 'Current Level',
    thChange1h: 'Change (1h)',
    thFlowRate: 'Flow Rate',
    thStatus: 'Status',
    thWarning: 'Warning',
    thCritical: 'Critical',
    thLastUpdated: 'Last Updated',
    thAction: 'Action',
    btnView: 'View',
    showing: 'Showing',
    to: '–',
    of: 'of',
    stationsWord: 'stations',
    noStationsFound: 'No river stations matched your search criteria.',
    modalLiveReadingsTitle: 'Live Hydrometric Readings',
    modalCurrentLevel: 'Current Level',
    modalFlowRate: 'Flow Rate',
    modalWarnThresh: 'Warning Thresh',
    modalCritThresh: 'Critical Thresh',
    modalHistoryTitle: 'River Level History (24 Hours)',
    modalWatershedTitle: 'Connected Watershed Conditions',
    upstreamRain: 'Upstream Rain',
    soilMoisture: 'Soil Moisture',
    nearbySensors: 'Nearby Sensors',
    flashFloodRisk: 'Flash Flood Risk',
    modalCurrentSituation: 'Current Situation',
    btnViewRiskAnalysis: 'View Risk Analysis',
    btnViewSensorData: 'View Sensor Data',
    btnClose: 'Close'
  },
  hi: {
    pageTitle: 'नदी जलस्तर टेलीमेट्री',
    subtitle: 'चमोली बेसिन भर में लाइव हाइड्रोमेट्रिक स्टेशन डेटा',
    lastUpdated: 'अंतिम अपडेट: 20 सितं 2026, 10:52 PM',
    liveData: 'लाइव डेटा',
    totalStations: 'कुल स्टेशन',
    acrossBasin: 'चमोली बेसिन में स्थापित',
    normal: 'सामान्य (Normal)',
    normalThresholdSubtext: 'सीमा के < 70%',
    warning: 'चेतावनी (Warning)',
    warningThresholdSubtext: 'सीमा के 70% – 90%',
    critical: 'गंभीर (Critical)',
    criticalThresholdSubtext: 'सीमा के > 90%',
    trendChartTitle: 'नदी जलस्तर रुझान',
    selectedStationLabel: 'चयनित स्टेशन:',
    last24HoursDropdown: 'विगत 24 घंटे ▼',
    flowTrendTitle: 'जल प्रवाह दर रुझान',
    dischargeUnit: 'जल प्रवाह (m³/s)',
    flowIncreaseInsight: 'विगत 6 घंटों में जल प्रवाह दर में',
    flowIncreaseSuffix: 'की वृद्धि दर्ज की गई है।',
    majorStationsTitle: 'प्रमुख नदी निगरानी स्टेशन',
    flowRateLabel: 'प्रवाह दर:',
    warningLabel: 'चेतावनी:',
    criticalLabel: 'गंभीर स्तर:',
    comparisonTitle: 'नदी जलस्तर तुलनात्मक विश्लेषण',
    comparisonSubtitle: 'प्रमुख स्टेशनों की निर्धारित सीमाओं से तुलना',
    legendCurrent: 'वर्तमान',
    legendWarn: 'चेतावनी',
    legendCrit: 'गंभीर',
    situationTitle: 'वर्तमान नदी स्थिति',
    situationText: 'धौलीगंगा नदी का जलस्तर वर्तमान में गंभीर श्रेणी में है और ऊपरी जलग्रहण क्षेत्र में भारी बारिश के कारण लगातार बढ़ रहा है। ऋषि गंगा और पिंडर में भी जलस्तर बढ़ने का रुझान देखा जा रहा है।',
    keyPointsTitle: 'मुख्य बिंदु',
    keyPoints: [
      'धौलीगंगा नदी अपने गंभीर सीमा स्तर (Critical threshold) के अत्यंत निकट है।',
      '5 प्रमुख नदियों में से 3 में जलस्तर में वृद्धि का रुझान देखा गया है।',
      'प्रवाह दर में वृद्धि सीधे तौर पर ऊपरी जलग्रहण क्षेत्र की भारी वर्षा से जुड़ी है।',
      'निचले मैदानी इलाकों को सतत निगरानी में रखा जाना चाहिए।'
    ],
    operationalBrief: 'परिचालन सारांश',
    channelsLinked: 'सभी बेसिन चैनल लिंक हैं',
    allStationsTitle: 'सभी नदी निगरानी स्टेशन',
    allStationsSubtitle: '12 बेसिन नोड्स पर हाइड्रोमेट्रिक निगरानी टेलीमेट्री',
    searchPlaceholder: 'नदी या स्थान खोजें...',
    filterAllRivers: 'सभी नदियां',
    filterAllStatus: 'सभी स्थितियां',
    sortLevelHighLow: 'जलस्तर: अधिक से कम',
    sortLevelLowHigh: 'जलस्तर: कम से अधिक',
    sortFlowHighLow: 'प्रवाह दर: अधिक से कम',
    perPage: '/ पृष्ठ',
    thRiver: 'नदी',
    thLocation: 'स्थान',
    thCurrentLevel: 'वर्तमान जलस्तर',
    thChange1h: 'बदलाव (1 घंटा)',
    thFlowRate: 'प्रवाह दर',
    thStatus: 'स्थिति',
    thWarning: 'चेतावनी सीमा',
    thCritical: 'गंभीर सीमा',
    thLastUpdated: 'अंतिम अपडेट',
    thAction: 'कार्रवाई',
    btnView: 'देखें',
    showing: 'प्रदर्शित',
    to: '–',
    of: 'कुल',
    stationsWord: 'स्टेशन',
    noStationsFound: 'आपके खोज मानदंडों से मेल खाता कोई नदी स्टेशन नहीं मिला।',
    modalLiveReadingsTitle: 'लाइव हाइड्रोमेट्रिक रीडिंग',
    modalCurrentLevel: 'वर्तमान जलस्तर',
    modalFlowRate: 'प्रवाह दर',
    modalWarnThresh: 'चेतावनी सीमा',
    modalCritThresh: 'गंभीर सीमा',
    modalHistoryTitle: 'नदी जलस्तर इतिहास (24 घंटे)',
    modalWatershedTitle: 'संबद्ध जलक्षेत्र स्थितियां',
    upstreamRain: 'ऊपरी वर्षा',
    soilMoisture: 'मिट्टी की नमी',
    nearbySensors: 'निकटवर्ती सेंसर',
    flashFloodRisk: 'अचानक बाढ़ का जोखिम',
    modalCurrentSituation: 'वर्तमान स्थिति',
    btnViewRiskAnalysis: 'जोखिम विश्लेषण देखें',
    btnViewSensorData: 'सेंसर डेटा देखें',
    btnClose: 'बंद करें'
  }
};

const STATUS_TRANSLATIONS = {
  NORMAL: { en: 'NORMAL', hi: 'सामान्य' },
  WARNING: { en: 'WARNING', hi: 'चेतावनी' },
  CRITICAL: { en: 'CRITICAL', hi: 'गंभीर' }
};

// --- STATUS STYLES ---
const getStatusStyles = (status) => {
  switch (status?.toUpperCase()) {
    case 'CRITICAL':
      return { badge: 'bg-red-50 text-red-700 border-red-200', fill: 'bg-red-500', stroke: '#ef4444' };
    case 'WARNING':
      return { badge: 'bg-amber-50 text-amber-700 border-amber-200', fill: 'bg-amber-500', stroke: '#f59e0b' };
    case 'NORMAL':
    default:
      return { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', fill: 'bg-emerald-500', stroke: '#10b981' };
  }
};

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

// --- REALISTIC HYDROLOGICAL STATIONS DATA (12 STATIONS) ---
const STATIONS_DATA = [
  {
    id: 'RS-01',
    riverNameEn: 'Dhauliganga',
    riverNameHi: 'धौलीगंगा',
    stationNameEn: 'Tapovan Sector',
    stationNameHi: 'तपोवन सेक्टर',
    locationEn: 'Tapovan Sector',
    locationHi: 'तपोवन सेक्टर',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 6.8,
    previousLevel: 6.6,
    changePerHour: '+0.2 m/hr',
    change1h: '+0.2 m',
    trend: 'up',
    flowRate: 680,
    warningThreshold: 5.5,
    criticalThreshold: 7.0,
    status: 'CRITICAL',
    lastUpdated: '10:52 PM',
    flow6hChange: '+45%',
    upstreamRainfall: '112 mm / 24h',
    soilSaturation: 88,
    nearbySensorsEn: '3 Warning, 1 Critical',
    nearbySensorsHi: '3 चेतावनी, 1 गंभीर',
    floodRiskScore: 82,
    situationEn: 'River level is rising and approaching the configured critical threshold. Increased upstream rainfall and saturated soil are contributing to current hydrological conditions.',
    situationHi: 'नदी का जलस्तर बढ़ रहा है और निर्धारित गंभीर सीमा स्तर (Critical threshold) के निकट पहुंच रहा है। ऊपरी जलग्रहण क्षेत्र में भारी बारिश और संतृप्त मिट्टी वर्तमान जलवैज्ञानिक परिस्थितियों में वृद्धि कर रही है।',
    trendData: [
      { time: '12 AM', level: 2.1, change: '0.0 m/hr', flow: 60 },
      { time: '2 AM', level: 2.3, change: '+0.1 m/hr', flow: 80 },
      { time: '4 AM', level: 2.6, change: '+0.15 m/hr', flow: 120 },
      { time: '6 AM', level: 2.9, change: '+0.15 m/hr', flow: 170 },
      { time: '8 AM', level: 3.2, change: '+0.15 m/hr', flow: 230 },
      { time: '10 AM', level: 3.5, change: '+0.15 m/hr', flow: 280 },
      { time: '12 PM', level: 4.0, change: '+0.25 m/hr', flow: 360 },
      { time: '2 PM', level: 4.8, change: '+0.4 m/hr', flow: 420 },
      { time: '4 PM', level: 5.6, change: '+0.4 m/hr', flow: 480 },
      { time: '6 PM', level: 6.1, change: '+0.25 m/hr', flow: 560 },
      { time: '8 PM', level: 6.8, change: '+0.2 m/hr', flow: 620 },
      { time: '10 PM', level: 8.0, change: '+0.6 m/hr', flow: 700 }
    ]
  },
  {
    id: 'RS-02',
    riverNameEn: 'Rishi Ganga',
    riverNameHi: 'ऋषि गंगा',
    stationNameEn: 'Raini Village',
    stationNameHi: 'रैणी गांव',
    locationEn: 'Raini Village',
    locationHi: 'रैणी गांव',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 5.1,
    previousLevel: 5.0,
    changePerHour: '+0.1 m/hr',
    change1h: '+0.1 m',
    trend: 'up',
    flowRate: 420,
    warningThreshold: 4.8,
    criticalThreshold: 6.0,
    status: 'WARNING',
    lastUpdated: '10:50 PM',
    flow6hChange: '+28%',
    upstreamRainfall: '98 mm / 24h',
    soilSaturation: 84,
    nearbySensorsEn: '2 Warning',
    nearbySensorsHi: '2 चेतावनी',
    floodRiskScore: 74,
    situationEn: 'Water level crossed warning boundary due to localized runoff into the alpine gorge. Silt concentration is moderately elevated.',
    situationHi: 'पहाड़ी घाटी में स्थानीय जलप्रवाह के कारण जलस्तर चेतावनी सीमा को पार कर गया है। गाद की सांद्रता में भी वृद्धि हुई है।',
    trendData: [
      { time: '12 AM', level: 2.0, change: '0.0 m/hr', flow: 90 },
      { time: '2 AM', level: 2.2, change: '+0.1 m/hr', flow: 110 },
      { time: '4 AM', level: 2.5, change: '+0.15 m/hr', flow: 140 },
      { time: '6 AM', level: 2.8, change: '+0.15 m/hr', flow: 180 },
      { time: '8 AM', level: 3.1, change: '+0.15 m/hr', flow: 220 },
      { time: '10 AM', level: 3.5, change: '+0.2 m/hr', flow: 260 },
      { time: '12 PM', level: 3.9, change: '+0.2 m/hr', flow: 300 },
      { time: '2 PM', level: 4.2, change: '+0.15 m/hr', flow: 340 },
      { time: '4 PM', level: 4.5, change: '+0.15 m/hr', flow: 370 },
      { time: '6 PM', level: 4.8, change: '+0.15 m/hr', flow: 390 },
      { time: '8 PM', level: 5.0, change: '+0.1 m/hr', flow: 410 },
      { time: '10 PM', level: 5.1, change: '+0.1 m/hr', flow: 420 }
    ]
  },
  {
    id: 'RS-03',
    riverNameEn: 'Pindar River',
    riverNameHi: 'पिंडर नदी',
    stationNameEn: 'Karnaprayag Confluence',
    stationNameHi: 'कर्णप्रयाग संगम',
    locationEn: 'Karnaprayag',
    locationHi: 'कर्णप्रयाग',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 4.9,
    previousLevel: 4.8,
    changePerHour: '+0.1 m/hr',
    change1h: '+0.1 m',
    trend: 'up',
    flowRate: 380,
    warningThreshold: 4.5,
    criticalThreshold: 5.8,
    status: 'WARNING',
    lastUpdated: '10:49 PM',
    flow6hChange: '+22%',
    upstreamRainfall: '104 mm / 24h',
    soilSaturation: 86,
    nearbySensorsEn: '2 Warning',
    nearbySensorsHi: '2 चेतावनी',
    floodRiskScore: 78,
    situationEn: 'Upper Tharali tributaries are discharging rapidly into Pindar stem, elevating flood stage along lower confluence embankments.',
    situationHi: 'थराली की ऊपरी सहायक नदियां तेजी से पिंडर मुख्य धारा में पानी छोड़ रही हैं, जिससे संगम तटबंधों पर जलस्तर बढ़ रहा है।',
    trendData: [
      { time: '12 AM', level: 2.5, change: '0.0 m/hr', flow: 140 },
      { time: '2 AM', level: 2.7, change: '+0.1 m/hr', flow: 160 },
      { time: '4 AM', level: 3.0, change: '+0.15 m/hr', flow: 190 },
      { time: '6 AM', level: 3.3, change: '+0.15 m/hr', flow: 220 },
      { time: '8 AM', level: 3.7, change: '+0.2 m/hr', flow: 260 },
      { time: '10 AM', level: 4.0, change: '+0.15 m/hr', flow: 290 },
      { time: '12 PM', level: 4.2, change: '+0.1 m/hr', flow: 310 },
      { time: '2 PM', level: 4.4, change: '+0.1 m/hr', flow: 330 },
      { time: '4 PM', level: 4.6, change: '+0.1 m/hr', flow: 350 },
      { time: '6 PM', level: 4.7, change: '+0.05 m/hr', flow: 360 },
      { time: '8 PM', level: 4.8, change: '+0.05 m/hr', flow: 370 },
      { time: '10 PM', level: 4.9, change: '+0.1 m/hr', flow: 380 }
    ]
  },
  {
    id: 'RS-04',
    riverNameEn: 'Alaknanda River',
    riverNameHi: 'अलकनंदा नदी',
    stationNameEn: 'Joshimath Barrage',
    stationNameHi: 'जोशीमठ बैराज',
    locationEn: 'Joshimath Barrage',
    locationHi: 'जोशीमठ बैराज',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 4.2,
    previousLevel: 4.3,
    changePerHour: '-0.1 m/hr',
    change1h: '-0.1 m',
    trend: 'down',
    flowRate: 320,
    warningThreshold: 5.0,
    criticalThreshold: 6.5,
    status: 'NORMAL',
    lastUpdated: '10:51 PM',
    flow6hChange: '-8%',
    upstreamRainfall: '45 mm / 24h',
    soilSaturation: 68,
    nearbySensorsEn: 'All Normal',
    nearbySensorsHi: 'सभी सामान्य',
    floodRiskScore: 32,
    situationEn: 'Discharge regulated safely through barrage bypass bays. Telemetry confirms water line remains under warning threshold.',
    situationHi: 'बैराज बाईपास द्वारों से जल निकासी सुरक्षित रूप से नियंत्रित की जा रही है। जलस्तर चेतावनी सीमा से नीचे बना हुआ है।',
    trendData: [
      { time: '12 AM', level: 3.8, change: '0.0 m/hr', flow: 280 },
      { time: '2 AM', level: 3.9, change: '+0.05 m/hr', flow: 290 },
      { time: '4 AM', level: 4.1, change: '+0.1 m/hr', flow: 310 },
      { time: '6 AM', level: 4.4, change: '+0.15 m/hr', flow: 340 },
      { time: '8 AM', level: 4.5, change: '+0.05 m/hr', flow: 350 },
      { time: '10 AM', level: 4.5, change: '0.0 m/hr', flow: 350 },
      { time: '12 PM', level: 4.4, change: '-0.05 m/hr', flow: 340 },
      { time: '2 PM', level: 4.4, change: '0.0 m/hr', flow: 340 },
      { time: '4 PM', level: 4.3, change: '-0.05 m/hr', flow: 330 },
      { time: '6 PM', level: 4.3, change: '0.0 m/hr', flow: 330 },
      { time: '8 PM', level: 4.3, change: '0.0 m/hr', flow: 330 },
      { time: '10 PM', level: 4.2, change: '-0.1 m/hr', flow: 320 }
    ]
  },
  {
    id: 'RS-05',
    riverNameEn: 'Mandakini River',
    riverNameHi: 'मंदाकिनी नदी',
    stationNameEn: 'Kedarnath Downstream',
    stationNameHi: 'केदारनाथ डाउनस्ट्रीम',
    locationEn: 'Kedarnath Downstream',
    locationHi: 'केदारनाथ डाउनस्ट्रीम',
    districtEn: 'Chamoli / Rudraprayag',
    districtHi: 'चमोली / रुद्रप्रयाग',
    currentLevel: 2.8,
    previousLevel: 3.0,
    changePerHour: '-0.2 m/hr',
    change1h: '-0.2 m',
    trend: 'down',
    flowRate: 210,
    warningThreshold: 4.0,
    criticalThreshold: 5.5,
    status: 'NORMAL',
    lastUpdated: '10:48 PM',
    flow6hChange: '-14%',
    upstreamRainfall: '25 mm / 24h',
    soilSaturation: 54,
    nearbySensorsEn: 'All Normal',
    nearbySensorsHi: 'सभी सामान्य',
    floodRiskScore: 22,
    situationEn: 'Receding trend established post-morning showers. Stream channels displaying seasonal flow velocity.',
    situationHi: 'सुबह की बारिश के बाद जलस्तर में कमी दर्ज की गई है। जलमार्ग मौसमी सामान्य वेग से प्रवाहित हो रहे हैं।',
    trendData: [
      { time: '12 AM', level: 3.5, change: '0.0 m/hr', flow: 290 },
      { time: '2 AM', level: 3.6, change: '+0.05 m/hr', flow: 300 },
      { time: '4 AM', level: 3.5, change: '-0.05 m/hr', flow: 280 },
      { time: '6 AM', level: 3.4, change: '-0.05 m/hr', flow: 270 },
      { time: '8 AM', level: 3.3, change: '-0.05 m/hr', flow: 260 },
      { time: '10 AM', level: 3.2, change: '-0.05 m/hr', flow: 250 },
      { time: '12 PM', level: 3.1, change: '-0.05 m/hr', flow: 240 },
      { time: '2 PM', level: 3.0, change: '-0.05 m/hr', flow: 230 },
      { time: '4 PM', level: 3.0, change: '0.0 m/hr', flow: 230 },
      { time: '6 PM', level: 2.9, change: '-0.05 m/hr', flow: 220 },
      { time: '8 PM', level: 2.9, change: '0.0 m/hr', flow: 220 },
      { time: '10 PM', level: 2.8, change: '-0.1 m/hr', flow: 210 }
    ]
  },
  {
    id: 'RS-06',
    riverNameEn: 'Saraswati River',
    riverNameHi: 'सरस्वती नदी',
    stationNameEn: 'Mana Pass Outlet',
    stationNameHi: 'माणा पास आउटलेट',
    locationEn: 'Mana',
    locationHi: 'माणा',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 3.6,
    previousLevel: 3.4,
    changePerHour: '+0.2 m/hr',
    change1h: '+0.2 m',
    trend: 'up',
    flowRate: 290,
    warningThreshold: 3.8,
    criticalThreshold: 4.8,
    status: 'NORMAL',
    lastUpdated: '10:46 PM',
    flow6hChange: '+19%',
    upstreamRainfall: '72 mm / 24h',
    soilSaturation: 74,
    nearbySensorsEn: '1 Warning',
    nearbySensorsHi: '1 चेतावनी',
    floodRiskScore: 58,
    situationEn: 'Glacial runoff combined with light rain is raising stage height near the Natural Bridge.',
    situationHi: 'हल्की बारिश और ग्लेशियर पिघलने से प्राकृतिक भीम पुल के समीप जलस्तर में वृद्धि देखी जा रही है।',
    trendData: [
      { time: '12 AM', level: 1.8, change: '0.0 m/hr', flow: 120 },
      { time: '2 AM', level: 2.0, change: '+0.1 m/hr', flow: 140 },
      { time: '4 AM', level: 2.3, change: '+0.15 m/hr', flow: 170 },
      { time: '6 AM', level: 2.6, change: '+0.15 m/hr', flow: 200 },
      { time: '8 AM', level: 2.9, change: '+0.15 m/hr', flow: 230 },
      { time: '10 AM', level: 3.1, change: '+0.1 m/hr', flow: 250 },
      { time: '12 PM', level: 3.3, change: '+0.1 m/hr', flow: 270 },
      { time: '2 PM', level: 3.4, change: '+0.05 m/hr', flow: 275 },
      { time: '4 PM', level: 3.5, change: '+0.05 m/hr', flow: 280 },
      { time: '6 PM', level: 3.5, change: '0.0 m/hr', flow: 280 },
      { time: '8 PM', level: 3.5, change: '0.0 m/hr', flow: 285 },
      { time: '10 PM', level: 3.6, change: '+0.1 m/hr', flow: 290 }
    ]
  },
  {
    id: 'RS-07',
    riverNameEn: 'Nandakini River',
    riverNameHi: 'नंदाकिनी नदी',
    stationNameEn: 'Nandprayag Point',
    stationNameHi: 'नंदप्रयाग पॉइंट',
    locationEn: 'Nandprayag',
    locationHi: 'नंदप्रयाग',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 4.4,
    previousLevel: 4.3,
    changePerHour: '+0.1 m/hr',
    change1h: '+0.1 m',
    trend: 'up',
    flowRate: 340,
    warningThreshold: 4.6,
    criticalThreshold: 5.6,
    status: 'NORMAL',
    lastUpdated: '10:45 PM',
    flow6hChange: '+12%',
    upstreamRainfall: '52 mm / 24h',
    soilSaturation: 68,
    nearbySensorsEn: 'All Normal',
    nearbySensorsHi: 'सभी सामान्य',
    floodRiskScore: 48,
    situationEn: 'Flow remains balanced within natural rocky gorge contours.',
    situationHi: 'प्राकृतिक चट्टानी संकरे प्रवाह मार्ग में जलस्तर संतुलित बना हुआ है।',
    trendData: [
      { time: '12 AM', level: 3.0, change: '0.0 m/hr', flow: 210 },
      { time: '2 AM', level: 3.2, change: '+0.1 m/hr', flow: 230 },
      { time: '4 AM', level: 3.5, change: '+0.15 m/hr', flow: 260 },
      { time: '6 AM', level: 3.8, change: '+0.15 m/hr', flow: 290 },
      { time: '8 AM', level: 4.0, change: '+0.1 m/hr', flow: 310 },
      { time: '10 AM', level: 4.1, change: '+0.05 m/hr', flow: 320 },
      { time: '12 PM', level: 4.2, change: '+0.05 m/hr', flow: 325 },
      { time: '2 PM', level: 4.3, change: '+0.05 m/hr', flow: 330 },
      { time: '4 PM', level: 4.3, change: '0.0 m/hr', flow: 330 },
      { time: '6 PM', level: 4.3, change: '0.0 m/hr', flow: 335 },
      { time: '8 PM', level: 4.3, change: '0.0 m/hr', flow: 335 },
      { time: '10 PM', level: 4.4, change: '+0.1 m/hr', flow: 340 }
    ]
  },
  {
    id: 'RS-08',
    riverNameEn: 'Birahi Ganga',
    riverNameHi: 'बिरही गंगा',
    stationNameEn: 'Gauna Lake Breach',
    stationNameHi: 'गौना झील मुहाना',
    locationEn: 'Nijmula Valley',
    locationHi: 'निजमुला घाटी',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 3.1,
    previousLevel: 3.2,
    changePerHour: '-0.1 m/hr',
    change1h: '-0.1 m',
    trend: 'down',
    flowRate: 180,
    warningThreshold: 3.5,
    criticalThreshold: 4.8,
    status: 'NORMAL',
    lastUpdated: '10:44 PM',
    flow6hChange: '-5%',
    upstreamRainfall: '38 mm / 24h',
    soilSaturation: 61,
    nearbySensorsEn: 'All Normal',
    nearbySensorsHi: 'सभी सामान्य',
    floodRiskScore: 26,
    situationEn: 'Valley sediment gates report stable baseline discharge velocity.',
    situationHi: 'घाटी से होने वाली जल निकासी स्थिर मौसमी गति से जारी है।',
    trendData: [
      { time: '12 AM', level: 3.3, change: '0.0 m/hr', flow: 200 },
      { time: '2 AM', level: 3.3, change: '0.0 m/hr', flow: 200 },
      { time: '4 AM', level: 3.4, change: '+0.05 m/hr', flow: 210 },
      { time: '6 AM', level: 3.4, change: '0.0 m/hr', flow: 210 },
      { time: '8 AM', level: 3.3, change: '-0.05 m/hr', flow: 200 },
      { time: '10 AM', level: 3.3, change: '0.0 m/hr', flow: 200 },
      { time: '12 PM', level: 3.2, change: '-0.05 m/hr', flow: 190 },
      { time: '2 PM', level: 3.2, change: '0.0 m/hr', flow: 190 },
      { time: '4 PM', level: 3.2, change: '0.0 m/hr', flow: 190 },
      { time: '6 PM', level: 3.1, change: '-0.05 m/hr', flow: 180 },
      { time: '8 PM', level: 3.1, change: '0.0 m/hr', flow: 180 },
      { time: '10 PM', level: 3.1, change: '0.0 m/hr', flow: 180 }
    ]
  },
  {
    id: 'RS-09',
    riverNameEn: 'Lakshman Ganga',
    riverNameHi: 'लक्ष्मण गंगा',
    stationNameEn: 'Govindghat Outflow',
    stationNameHi: 'गोविंदघाट मुहाना',
    locationEn: 'Govindghat',
    locationHi: 'गोविंदघाट',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 4.8,
    previousLevel: 4.6,
    changePerHour: '+0.2 m/hr',
    change1h: '+0.2 m',
    trend: 'up',
    flowRate: 360,
    warningThreshold: 4.5,
    criticalThreshold: 5.6,
    status: 'WARNING',
    lastUpdated: '10:51 PM',
    flow6hChange: '+31%',
    upstreamRainfall: '88 mm / 24h',
    soilSaturation: 82,
    nearbySensorsEn: '1 Warning',
    nearbySensorsHi: '1 चेतावनी',
    floodRiskScore: 68,
    situationEn: 'Hemkund catchment runoff pushes river height past 4.5m threshold line.',
    situationHi: 'हेमकुंड जलग्रहण क्षेत्र से आने वाले अपवाह ने जलस्तर को 4.5 मीटर चेतावनी सीमा से ऊपर पहुंचा दिया है।',
    trendData: [
      { time: '12 AM', level: 2.6, change: '0.0 m/hr', flow: 160 },
      { time: '2 AM', level: 2.8, change: '+0.1 m/hr', flow: 180 },
      { time: '4 AM', level: 3.1, change: '+0.15 m/hr', flow: 210 },
      { time: '6 AM', level: 3.5, change: '+0.2 m/hr', flow: 250 },
      { time: '8 AM', level: 3.9, change: '+0.2 m/hr', flow: 290 },
      { time: '10 AM', level: 4.2, change: '+0.15 m/hr', flow: 310 },
      { time: '12 PM', level: 4.4, change: '+0.1 m/hr', flow: 330 },
      { time: '2 PM', level: 4.5, change: '+0.05 m/hr', flow: 340 },
      { time: '4 PM', level: 4.6, change: '+0.05 m/hr', flow: 345 },
      { time: '6 PM', level: 4.7, change: '+0.05 m/hr', flow: 350 },
      { time: '8 PM', level: 4.7, change: '0.0 m/hr', flow: 355 },
      { time: '10 PM', level: 4.8, change: '+0.1 m/hr', flow: 360 }
    ]
  },
  {
    id: 'RS-10',
    riverNameEn: 'Kali Ganga',
    riverNameHi: 'काली गंगा',
    stationNameEn: 'Ghat Sector Base',
    stationNameHi: 'घाट सेक्टर बेस',
    locationEn: 'Ghat Valley',
    locationHi: 'घाट घाटी',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 2.2,
    previousLevel: 2.3,
    changePerHour: '-0.1 m/hr',
    change1h: '-0.1 m',
    trend: 'down',
    flowRate: 150,
    warningThreshold: 3.2,
    criticalThreshold: 4.5,
    status: 'NORMAL',
    lastUpdated: '10:43 PM',
    flow6hChange: '-9%',
    upstreamRainfall: '22 mm / 24h',
    soilSaturation: 46,
    nearbySensorsEn: 'All Normal',
    nearbySensorsHi: 'सभी सामान्य',
    floodRiskScore: 20,
    situationEn: 'Downstream channel exhibits normal bed friction and clear discharge capacity.',
    situationHi: 'निचला जलमार्ग सामान्य प्रवाह क्षमता और बिना अवरोध के जल निकासी प्रदर्शित कर रहा है।',
    trendData: [
      { time: '12 AM', level: 2.4, change: '0.0 m/hr', flow: 170 },
      { time: '2 AM', level: 2.5, change: '+0.05 m/hr', flow: 180 },
      { time: '4 AM', level: 2.5, change: '0.0 m/hr', flow: 180 },
      { time: '6 AM', level: 2.4, change: '-0.05 m/hr', flow: 170 },
      { time: '8 AM', level: 2.4, change: '0.0 m/hr', flow: 170 },
      { time: '10 AM', level: 2.3, change: '-0.05 m/hr', flow: 160 },
      { time: '12 PM', level: 2.3, change: '0.0 m/hr', flow: 160 },
      { time: '2 PM', level: 2.3, change: '0.0 m/hr', flow: 160 },
      { time: '4 PM', level: 2.2, change: '-0.05 m/hr', flow: 150 },
      { time: '6 PM', level: 2.2, change: '0.0 m/hr', flow: 150 },
      { time: '8 PM', level: 2.2, change: '0.0 m/hr', flow: 150 },
      { time: '10 PM', level: 2.2, change: '0.0 m/hr', flow: 150 }
    ]
  },
  {
    id: 'RS-11',
    riverNameEn: 'Alaknanda River',
    riverNameHi: 'अलकनंदा नदी',
    stationNameEn: 'Badrinath Headwaters',
    stationNameHi: 'बद्रीनाथ हेडवाटर',
    locationEn: 'Badrinath Valley',
    locationHi: 'बद्रीनाथ घाटी',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 7.2,
    previousLevel: 6.9,
    changePerHour: '+0.3 m/hr',
    change1h: '+0.3 m',
    trend: 'up',
    flowRate: 720,
    warningThreshold: 5.8,
    criticalThreshold: 7.0,
    status: 'CRITICAL',
    lastUpdated: '10:53 PM',
    flow6hChange: '+52%',
    upstreamRainfall: '128 mm / 24h',
    soilSaturation: 91,
    nearbySensorsEn: '2 Critical',
    nearbySensorsHi: '2 गंभीर',
    floodRiskScore: 88,
    situationEn: 'Severe flash flood risk. Catchment rainfall surging through high-gradient riverbed.',
    situationHi: 'अचानक बाढ़ का अत्यंत गंभीर जोखिम। तीव्र ढलान वाले नदी तल में जलग्रहण क्षेत्र से भारी जलप्रवाह आ रहा है।',
    trendData: [
      { time: '12 AM', level: 2.5, change: '0.0 m/hr', flow: 180 },
      { time: '2 AM', level: 2.9, change: '+0.2 m/hr', flow: 230 },
      { time: '4 AM', level: 3.4, change: '+0.25 m/hr', flow: 290 },
      { time: '6 AM', level: 4.1, change: '+0.35 m/hr', flow: 380 },
      { time: '8 AM', level: 4.9, change: '+0.4 m/hr', flow: 460 },
      { time: '10 AM', level: 5.5, change: '+0.3 m/hr', flow: 520 },
      { time: '12 PM', level: 6.0, change: '+0.25 m/hr', flow: 580 },
      { time: '2 PM', level: 6.3, change: '+0.15 m/hr', flow: 610 },
      { time: '4 PM', level: 6.6, change: '+0.15 m/hr', flow: 640 },
      { time: '6 PM', level: 6.8, change: '+0.1 m/hr', flow: 670 },
      { time: '8 PM', level: 7.0, change: '+0.1 m/hr', flow: 700 },
      { time: '10 PM', level: 7.2, change: '+0.2 m/hr', flow: 720 }
    ]
  },
  {
    id: 'RS-12',
    riverNameEn: 'Dhauliganga',
    riverNameHi: 'धौलीगंगा',
    stationNameEn: 'Malari Border Post',
    stationNameHi: 'मलारी सीमा चौकी',
    locationEn: 'Malari Gorge',
    locationHi: 'मलारी घाटी',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    currentLevel: 4.7,
    previousLevel: 4.6,
    changePerHour: '+0.1 m/hr',
    change1h: '+0.1 m',
    trend: 'up',
    flowRate: 395,
    warningThreshold: 4.5,
    criticalThreshold: 5.8,
    status: 'WARNING',
    lastUpdated: '10:47 PM',
    flow6hChange: '+24%',
    upstreamRainfall: '82 mm / 24h',
    soilSaturation: 79,
    nearbySensorsEn: '1 Warning',
    nearbySensorsHi: '1 चेतावनी',
    floodRiskScore: 64,
    situationEn: 'Glacial tributaries contributing high sediment discharge, pushing water past 4.5m.',
    situationHi: 'ग्लेशियर की सहायक नदियां अत्यधिक गाद और पानी ला रही हैं, जिससे जलस्तर 4.5 मीटर के पार पहुंच गया है।',
    trendData: [
      { time: '12 AM', level: 2.8, change: '0.0 m/hr', flow: 190 },
      { time: '2 AM', level: 3.0, change: '+0.1 m/hr', flow: 210 },
      { time: '4 AM', level: 3.3, change: '+0.15 m/hr', flow: 240 },
      { time: '6 AM', level: 3.6, change: '+0.15 m/hr', flow: 280 },
      { time: '8 AM', level: 3.9, change: '+0.15 m/hr', flow: 310 },
      { time: '10 AM', level: 4.1, change: '+0.1 m/hr', flow: 330 },
      { time: '12 PM', level: 4.3, change: '+0.1 m/hr', flow: 350 },
      { time: '2 PM', level: 4.4, change: '+0.05 m/hr', flow: 360 },
      { time: '4 PM', level: 4.5, change: '+0.05 m/hr', flow: 375 },
      { time: '6 PM', level: 4.6, change: '+0.05 m/hr', flow: 385 },
      { time: '8 PM', level: 4.6, change: '0.0 m/hr', flow: 390 },
      { time: '10 PM', level: 4.7, change: '+0.1 m/hr', flow: 395 }
    ]
  }
];

// ==========================================
// CARTESIAN CHARTS
// ==========================================

const RiverLevelTrendChart = ({ data, warningThresh, criticalThresh, isHi }) => {
  const maxVal = Math.max(...data.map(d => d.level), (criticalThresh || 7.0)) * 1.15;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.level / maxVal) * 100}`).join(' ');

  return (
    <div className="flex w-full h-[220px] mt-2 pr-2">
      <div className="w-10 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>{maxVal.toFixed(1)}m</span>
        <span>{(maxVal * 0.66).toFixed(1)}m</span>
        <span>{(maxVal * 0.33).toFixed(1)}m</span>
        <span>0m</span>
      </div>

      <div className="flex-1 relative border-b border-slate-200">
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-300"></div>
        </div>

        {warningThresh && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-amber-400 z-0 flex justify-end pr-2 pointer-events-none"
            style={{ bottom: `calc(${(warningThresh / maxVal) * 100}% + 24px)` }}
          >
            <span className="text-[9px] font-black text-amber-600 uppercase bg-white px-1.5 -translate-y-1/2 border border-amber-200 rounded-xs">
              {isHi ? 'चेतावनी:' : 'Warning:'} {warningThresh}m
            </span>
          </div>
        )}

        {criticalThresh && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-dashed border-red-400 z-0 flex justify-end pr-2 pointer-events-none"
            style={{ bottom: `calc(${(criticalThresh / maxVal) * 100}% + 24px)` }}
          >
            <span className="text-[9px] font-black text-red-600 uppercase bg-white px-1.5 -translate-y-1/2 border border-red-200 rounded-xs">
              {isHi ? 'गंभीर:' : 'Critical:'} {criticalThresh}m
            </span>
          </div>
        )}

        <svg className="absolute inset-0 bottom-6 w-full h-[calc(100%-24px)] z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {data.map((d, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const bottomPos = (d.level / maxVal) * 100;
          const isOverWarn = warningThresh && d.level >= warningThresh;
          const isOverCrit = criticalThresh && d.level >= criticalThresh;
          const dotColor = isOverCrit ? 'bg-red-500' : isOverWarn ? 'bg-amber-500' : 'bg-blue-600';

          return (
            <div 
              key={i} 
              className="absolute top-0 bottom-6 z-20 group cursor-pointer"
              style={{ left: `${leftPos}%`, width: '28px', transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2 z-0"></div>

              <div 
                className={`absolute left-1/2 w-3.5 h-3.5 ${dotColor} border-2 border-white rounded-full shadow-sm transform -translate-x-1/2 translate-y-1/2 z-30 transition-transform group-hover:scale-150`}
                style={{ bottom: `${bottomPos}%` }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-slate-300 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-slate-400 whitespace-nowrap pt-1">
                {d.time}
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-blue-300">{d.time}</div>
                <div>{isHi ? 'जलस्तर' : 'Level'}: <span className="font-black text-white">{d.level} m</span></div>
                <div>{isHi ? 'बदलाव' : 'Change'}: <span className="font-bold text-amber-300">{d.change}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FlowRateBarChart = ({ data, isHi }) => {
  const maxFlow = Math.max(...data.map(d => d.flow), 700) * 1.1;

  return (
    <div className="flex w-full h-[220px] mt-2 pr-2">
      <div className="w-12 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>{Math.round(maxFlow)}</span>
        <span>{Math.round(maxFlow * 0.66)}</span>
        <span>{Math.round(maxFlow * 0.33)}</span>
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
          const barHeight = (d.flow / maxFlow) * 100;

          return (
            <div 
              key={i}
              className="absolute top-0 bottom-6 z-20 group flex flex-col items-center cursor-pointer"
              style={{ left: `${leftPos}%`, width: '22px', transform: 'translateX(-50%)' }}
            >
              <div 
                className="w-3/4 bg-blue-500 hover:bg-blue-600 rounded-t-xs transition-colors mt-auto"
                style={{ height: `${barHeight}%` }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-slate-300 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-slate-400 whitespace-nowrap pt-1">
                {d.time}
              </span>

              <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-blue-300">{d.time}</div>
                <div>{isHi ? 'प्रवाह' : 'Flow'}: <span className="font-black text-white">{d.flow} m³/s</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RiverComparisonChart = ({ stations, onSelectStation, isHi }) => {
  const maxVal = 9.0;

  return (
    <div className="flex w-full h-[230px] mt-2 pr-2">
      <div className="w-10 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>9.0m</span>
        <span>6.0m</span>
        <span>3.0m</span>
        <span>0m</span>
      </div>

      <div className="flex-1 relative border-b border-slate-200">
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-300"></div>
        </div>

        <div className="absolute inset-0 bottom-6 flex justify-around items-end z-10">
          {stations.map((st) => {
            const currentPct = (st.currentLevel / maxVal) * 100;
            const warnPct = (st.warningThreshold / maxVal) * 100;
            const critPct = (st.criticalThreshold / maxVal) * 100;
            const riverDisplayName = isHi ? st.riverNameHi.split(' ')[0] : st.riverNameEn.split(' ')[0];

            return (
              <div 
                key={st.id} 
                onClick={() => onSelectStation(st)}
                className="flex items-end justify-center gap-1 h-full flex-1 max-w-[70px] group cursor-pointer"
              >
                <div 
                  className={`w-3.5 rounded-t-xs transition-all ${getStatusStyles(st.status).fill}`}
                  style={{ height: `${currentPct}%` }}
                ></div>

                <div 
                  className="w-2.5 bg-amber-200 rounded-t-xs"
                  style={{ height: `${warnPct}%` }}
                ></div>

                <div 
                  className="w-2.5 bg-red-200 rounded-t-xs"
                  style={{ height: `${critPct}%` }}
                ></div>

                <span className="absolute -bottom-6 text-[9px] font-bold text-slate-500 truncate w-14 text-center">
                  {riverDisplayName}
                </span>

                <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2.5 shadow-xl pointer-events-none whitespace-nowrap z-50">
                  <div className="font-black text-blue-300 text-xs">
                    {isHi ? st.riverNameHi : st.riverNameEn} ({isHi ? st.stationNameHi : st.stationNameEn})
                  </div>
                  <div>{isHi ? 'वर्तमान' : 'Current'}: <span className="font-bold text-white">{st.currentLevel} m</span></div>
                  <div>{isHi ? 'चेतावनी' : 'Warning'}: <span className="font-bold text-amber-400">{st.warningThreshold} m</span></div>
                  <div>{isHi ? 'गंभीर' : 'Critical'}: <span className="font-bold text-red-400">{st.criticalThreshold} m</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function RiverLevels() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;

  // State
  const [selectedStationId, setSelectedStationId] = useState('RS-01');
  const [statusQuickFilter, setStatusQuickFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [riverFilter, setRiverFilter] = useState('All Rivers');
  const [tableStatusFilter, setTableStatusFilter] = useState('All Status');
  const [sortField, setSortField] = useState('River Level High → Low');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalStation, setModalStation] = useState(null);

  const activeStation = useMemo(() => {
    return STATIONS_DATA.find(s => s.id === selectedStationId) || STATIONS_DATA[0];
  }, [selectedStationId]);

  const majorStations = useMemo(() => {
    return STATIONS_DATA.slice(0, 5);
  }, []);

  const filteredTableStations = useMemo(() => {
    let list = STATIONS_DATA.filter(st => {
      let matchesQuick = true;
      if (statusQuickFilter !== 'ALL') {
        matchesQuick = st.status === statusQuickFilter;
      }

      const matchesRiver = riverFilter === 'All Rivers' || st.riverNameEn.includes(riverFilter.split(' ')[0]);
      const matchesStatus = tableStatusFilter === 'All Status' || st.status === tableStatusFilter.toUpperCase();

      const q = searchQuery.toLowerCase();
      const matchesSearch = st.riverNameEn.toLowerCase().includes(q) ||
                            st.riverNameHi.toLowerCase().includes(q) ||
                            st.stationNameEn.toLowerCase().includes(q) ||
                            st.stationNameHi.toLowerCase().includes(q) ||
                            st.locationEn.toLowerCase().includes(q) ||
                            st.locationHi.toLowerCase().includes(q);

      return matchesQuick && matchesRiver && matchesStatus && matchesSearch;
    });

    if (sortField === 'River Level High → Low') {
      list.sort((a, b) => b.currentLevel - a.currentLevel);
    } else if (sortField === 'River Level Low → High') {
      list.sort((a, b) => a.currentLevel - b.currentLevel);
    } else if (sortField === 'Flow Rate High → Low') {
      list.sort((a, b) => b.flowRate - a.flowRate);
    }

    return list;
  }, [statusQuickFilter, riverFilter, tableStatusFilter, searchQuery, sortField]);

  const totalPages = Math.ceil(filteredTableStations.length / rowsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedStations = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filteredTableStations.slice(start, start + rowsPerPage);
  }, [filteredTableStations, safePage, rowsPerPage]);

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-14 animate-fadeIn">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Waves className="w-6 h-6 text-blue-700" />
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
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(e.target.value)}
              className="appearance-none bg-white border border-slate-300 text-slate-800 font-bold text-xs py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              {STATIONS_DATA.map(st => (
                <option key={st.id} value={st.id}>
                  {isHi ? st.riverNameHi : st.riverNameEn} – {isHi ? st.stationNameHi : st.stationNameEn}
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

      {/* 2. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL STATIONS */}
        <button
          onClick={() => { setStatusQuickFilter('ALL'); setCurrentPage(1); }}
          className={`text-left p-5 rounded-xl border transition-all bg-white shadow-2xs hover:shadow-md
            ${statusQuickFilter === 'ALL' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}`}
        >
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">{t.totalStations}</span>
          <div className="text-3xl font-black text-slate-900 leading-none">12</div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.acrossBasin}</span>
        </button>

        {/* NORMAL */}
        <button
          onClick={() => { setStatusQuickFilter('NORMAL'); setCurrentPage(1); }}
          className={`text-left p-5 rounded-xl border transition-all bg-white shadow-2xs hover:shadow-md
            ${statusQuickFilter === 'NORMAL' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'}`}
        >
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">{t.normal}</span>
          <div className="text-3xl font-black text-slate-900 leading-none">6</div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.normalThresholdSubtext}</span>
        </button>

        {/* WARNING */}
        <button
          onClick={() => { setStatusQuickFilter('WARNING'); setCurrentPage(1); }}
          className={`text-left p-5 rounded-xl border transition-all bg-white shadow-2xs hover:shadow-md
            ${statusQuickFilter === 'WARNING' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'}`}
        >
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">{t.warning}</span>
          <div className="text-3xl font-black text-slate-900 leading-none">4</div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.warningThresholdSubtext}</span>
        </button>

        {/* CRITICAL */}
        <button
          onClick={() => { setStatusQuickFilter('CRITICAL'); setCurrentPage(1); }}
          className={`text-left p-5 rounded-xl border transition-all bg-white shadow-2xs hover:shadow-md
            ${statusQuickFilter === 'CRITICAL' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'}`}
        >
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-1">{t.critical}</span>
          <div className="text-3xl font-black text-slate-900 leading-none">2</div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.criticalThresholdSubtext}</span>
        </button>
      </div>

      {/* 3 & 4. RIVER LEVEL TREND & FLOW RATE TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> {t.trendChartTitle}
              </h3>
              <span className="text-xs font-bold text-slate-500 mt-0.5 block">
                {t.selectedStationLabel} <strong className="text-slate-900">{isHi ? activeStation.riverNameHi : activeStation.riverNameEn} – {isHi ? activeStation.stationNameHi : activeStation.stationNameEn}</strong>
              </span>
            </div>
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600">
              {t.last24HoursDropdown}
            </div>
          </div>
          <RiverLevelTrendChart 
            data={activeStation.trendData} 
            warningThresh={activeStation.warningThreshold} 
            criticalThresh={activeStation.criticalThreshold}
            isHi={isHi}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" /> {t.flowTrendTitle}
                </h3>
                <span className="text-xs font-bold text-slate-500 mt-0.5 block">
                  {t.selectedStationLabel} <strong className="text-slate-900">{isHi ? activeStation.riverNameHi : activeStation.riverNameEn}</strong>
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {t.dischargeUnit}
              </span>
            </div>
            <FlowRateBarChart data={activeStation.trendData} isHi={isHi} />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <Info className="w-4 h-4 text-blue-500" />
            {t.flowIncreaseInsight} {activeStation.flow6hChange} {t.flowIncreaseSuffix}
          </div>
        </div>
      </div>

      {/* 5. MAJOR RIVER STATIONS (Horizontal Cards Grid) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
          {t.majorStationsTitle}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {majorStations.map((st) => {
            const statusStyle = getStatusStyles(st.status);
            const isRising = st.trend === 'up';

            return (
              <div
                key={st.id}
                onClick={() => {
                  setSelectedStationId(st.id);
                  setModalStation(st);
                }}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {isHi ? st.districtHi : st.districtEn}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${statusStyle.badge}`}>
                      {STATUS_TRANSLATIONS[st.status]?.[isHi ? 'hi' : 'en']}
                    </span>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                    {isHi ? st.riverNameHi : st.riverNameEn}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500 block mb-3">
                    {isHi ? st.stationNameHi : st.stationNameEn}
                  </span>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-black text-slate-900">{st.currentLevel} m</span>
                    <span className={`text-xs font-bold flex items-center ${isRising ? 'text-red-500' : 'text-emerald-500'}`}>
                      {isRising ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {st.changePerHour}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2 text-[11px] space-y-1 font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>{t.flowRateLabel}</span>
                    <strong className="text-slate-800">{st.flowRate} m³/s</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.warningLabel}</span>
                    <strong className="text-amber-600">{st.warningThreshold} m</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.criticalLabel}</span>
                    <strong className="text-red-600">{st.criticalThreshold} m</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 & 7. COMPARISON & CURRENT SITUATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> {t.comparisonTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{t.comparisonSubtitle}</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-blue-500"></div> {t.legendCurrent}</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-amber-200"></div> {t.legendWarn}</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-xs bg-red-200"></div> {t.legendCrit}</span>
            </div>
          </div>
          <RiverComparisonChart stations={majorStations} onSelectStation={setModalStation} isHi={isHi} />
        </div>

        <div className="bg-blue-50/60 rounded-2xl border border-blue-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" /> {t.situationTitle}
            </h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/70 p-4 rounded-xl border border-blue-100/60 shadow-2xs mb-4">
              “{t.situationText}”
            </p>

            <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest block mb-2">
              {t.keyPointsTitle}
            </span>
            <ul className="space-y-2 text-xs font-medium text-slate-700">
              {t.keyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
            <span>{t.operationalBrief}</span>
            <span className="text-blue-700 font-black">{t.channelsLinked}</span>
          </div>
        </div>
      </div>

      {/* 8 & 9. ALL RIVER STATIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">{t.allStationsTitle}</h3>
            <p className="text-xs text-slate-500 font-medium">{t.allStationsSubtitle}</p>
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

            <select
              value={riverFilter}
              onChange={(e) => { setRiverFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="All Rivers">{t.filterAllRivers}</option>
              <option value="Alaknanda">{isHi ? 'अलकनंदा' : 'Alaknanda'}</option>
              <option value="Dhauliganga">{isHi ? 'धौलीगंगा' : 'Dhauliganga'}</option>
              <option value="Rishi Ganga">{isHi ? 'ऋषि गंगा' : 'Rishi Ganga'}</option>
              <option value="Mandakini">{isHi ? 'मंदाकिनी' : 'Mandakini'}</option>
              <option value="Pindar">{isHi ? 'पिंडर' : 'Pindar'}</option>
            </select>

            <select
              value={tableStatusFilter}
              onChange={(e) => { setTableStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="All Status">{t.filterAllStatus}</option>
              <option value="Normal">{STATUS_TRANSLATIONS.NORMAL[isHi ? 'hi' : 'en']}</option>
              <option value="Warning">{STATUS_TRANSLATIONS.WARNING[isHi ? 'hi' : 'en']}</option>
              <option value="Critical">{STATUS_TRANSLATIONS.CRITICAL[isHi ? 'hi' : 'en']}</option>
            </select>

            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="River Level High → Low">{t.sortLevelHighLow}</option>
              <option value="River Level Low → High">{t.sortLevelLowHigh}</option>
              <option value="Flow Rate High → Low">{t.sortFlowHighLow}</option>
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
                <th className="py-3.5 px-4">{t.thRiver}</th>
                <th className="py-3.5 px-4">{t.thLocation}</th>
                <th className="py-3.5 px-4 text-right">{t.thCurrentLevel}</th>
                <th className="py-3.5 px-4">{t.thChange1h}</th>
                <th className="py-3.5 px-4 text-right">{t.thFlowRate}</th>
                <th className="py-3.5 px-4">{t.thStatus}</th>
                <th className="py-3.5 px-4 text-right">{t.thWarning}</th>
                <th className="py-3.5 px-4 text-right">{t.thCritical}</th>
                <th className="py-3.5 px-4">{t.thLastUpdated}</th>
                <th className="py-3.5 px-4 text-center">{t.thAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {paginatedStations.map((row, idx) => {
                const globalIndex = (safePage - 1) * rowsPerPage + idx + 1;
                const statusInfo = getStatusStyles(row.status);
                const isRising = row.trend === 'up';

                return (
                  <tr
                    key={row.id}
                    onClick={() => setModalStation(row)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-400 text-center">{globalIndex}</td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {isHi ? row.riverNameHi : row.riverNameEn}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                      {isHi ? row.locationHi : row.locationEn}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-xs">
                      {row.currentLevel} m
                    </td>

                    <td className="py-3.5 px-4 text-xs font-bold">
                      <span className={`flex items-center gap-1 ${isRising ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isRising ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {row.change1h}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-slate-800 text-xs">
                      {row.flowRate} m³/s
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusInfo.badge}`}>
                        {STATUS_TRANSLATIONS[row.status]?.[isHi ? 'hi' : 'en']}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-xs font-bold text-amber-600">
                      {row.warningThreshold} m
                    </td>

                    <td className="py-3.5 px-4 text-right text-xs font-bold text-red-600">
                      {row.criticalThreshold} m
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-400 font-semibold">
                      {row.lastUpdated}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setModalStation(row); }}
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

        {paginatedStations.length === 0 && (
          <div className="py-16 text-center text-slate-400 font-medium">
            <Waves className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            {t.noStationsFound}
          </div>
        )}

        {/* PAGINATION BAR */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500">
            {t.showing} <span className="text-slate-900 font-black">{(safePage - 1) * rowsPerPage + 1}</span>{t.to}
            <span className="text-slate-900 font-black">{Math.min(safePage * rowsPerPage, filteredTableStations.length)}</span> {t.of}{' '}
            <span className="text-slate-900 font-black">{filteredTableStations.length}</span> {t.stationsWord}
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                disabled={num > totalPages}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-all border
                  ${safePage === num ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-25'}`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all ml-1"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 10. RIVER STATION DETAIL POPUP MODAL */}
      {modalStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900">
                    {isHi ? modalStation.riverNameHi : modalStation.riverNameEn}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(modalStation.status).badge}`}>
                    {STATUS_TRANSLATIONS[modalStation.status]?.[isHi ? 'hi' : 'en']}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  {isHi ? modalStation.stationNameHi : modalStation.stationNameEn}, {isHi ? modalStation.districtHi : modalStation.districtEn} • {isHi ? 'अंतिम अपडेट:' : 'Last Updated:'} {modalStation.lastUpdated}
                </div>
              </div>
              <button
                onClick={() => setModalStation(null)}
                className="p-1.5 hover:bg-slate-200/70 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalLiveReadingsTitle}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.modalCurrentLevel}</span>
                    <span className="text-2xl font-black text-slate-900">{modalStation.currentLevel} m</span>
                    <span className="text-[10px] font-bold text-blue-600 block mt-0.5">{modalStation.changePerHour}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.modalFlowRate}</span>
                    <span className="text-xl font-black text-slate-900">{modalStation.flowRate} m³/s</span>
                    <span className="text-[10px] font-bold text-slate-500 block mt-0.5">{modalStation.flow6hChange} (6h)</span>
                  </div>
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">{t.modalWarnThresh}</span>
                    <span className="text-xl font-black text-amber-700">{modalStation.warningThreshold} m</span>
                  </div>
                  <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-100">
                    <span className="text-[10px] font-bold text-red-800 uppercase block mb-1">{t.modalCritThresh}</span>
                    <span className="text-xl font-black text-red-700">{modalStation.criticalThreshold} m</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalHistoryTitle}</span>
                <RiverLevelTrendChart 
                  data={modalStation.trendData} 
                  warningThresh={modalStation.warningThreshold} 
                  criticalThresh={modalStation.criticalThreshold}
                  isHi={isHi}
                />
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalWatershedTitle}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.upstreamRain}</span>
                    <span className="text-sm font-black text-slate-900">{modalStation.upstreamRainfall}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.soilMoisture}</span>
                    <span className="text-sm font-black text-slate-900">{modalStation.soilSaturation}%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.nearbySensors}</span>
                    <span className="text-xs font-bold text-slate-800">
                      {isHi ? modalStation.nearbySensorsHi : modalStation.nearbySensorsEn}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.flashFloodRisk}</span>
                    <span className="text-sm font-black text-red-600">
                      {modalStation.floodRiskScore} / 100 ({getRiskLabel(modalStation.floodRiskScore, isHi)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">{t.modalCurrentSituation}</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {isHi ? modalStation.situationHi : modalStation.situationEn}
                </p>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => alert(`Navigating to Risk Analysis for ${isHi ? modalStation.riverNameHi : modalStation.riverNameEn}...`)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-xs shadow-2xs"
              >
                <ShieldAlert className="w-4 h-4" /> {t.btnViewRiskAnalysis}
              </button>
              <button 
                onClick={() => alert(`Navigating to Live Sensors for ${isHi ? modalStation.riverNameHi : modalStation.riverNameEn}...`)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition-colors text-xs"
              >
                <Activity className="w-4 h-4" /> {t.btnViewSensorData}
              </button>
              <button 
                onClick={() => setModalStation(null)}
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