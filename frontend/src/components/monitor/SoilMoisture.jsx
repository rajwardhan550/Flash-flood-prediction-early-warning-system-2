import React, { useState, useMemo } from 'react';
import { 
  Droplets, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus, 
  ChevronDown, Search, ChevronLeft, ChevronRight, X, 
  Activity, ShieldAlert, CloudRain, Waves, MapPin, 
  TrendingUp, Layers, SlidersHorizontal, Info, CheckCircle2,
  ExternalLink, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'Soil Moisture & Saturation',
    subtitle: 'Real-time soil moisture data and saturation monitoring',
    lastUpdated: 'Last Updated: 20 Sep 2026, 10:52 PM',
    liveData: 'Live Data',
    bannerTitle: 'ALERT: High Saturation Warning in Chamoli District',
    bannerText: 'Heavy rainfall warning in Chamoli district. Soil saturation is high in multiple locations (> 85% in Chamoli Slope Alpha, Raini, and Helang). Move to higher ground.',
    avgMoistureTitle: 'Average Soil Moisture',
    districtMean: 'District Mean',
    vsPrevious24h: 'vs previous 24h',
    criticalZonesTitle: 'Critical Zones',
    highRiskSlopes: 'High Risk Slopes',
    saturationThreshold: '> 85% saturation',
    locationsRisingTitle: 'Locations Rising',
    activeRunoffTrend: 'Active Runoff Trend',
    moistureIncreasing: 'Moisture increasing',
    totalSitesTitle: 'Total Sites',
    sensorArrays: 'Sensor Arrays',
    acrossBasin: 'Across Chamoli basin',
    trendChartTitle: 'Soil Moisture Trend',
    trendChartSubtitle: 'Selected region: Chamoli District – Average',
    last24HoursDropdown: 'Last 24 Hours ▼',
    saturationDistTitle: 'Saturation Level Distribution',
    sitesMonitoredCount: '12 Sites Monitored',
    locationsWord: 'Locations',
    criticalLabel: 'Critical (> 85%)',
    highLabel: 'High (70–85%)',
    moderateLabel: 'Moderate (50–70%)',
    normalLabel: 'Normal (< 50%)',
    dynamicCalcNote: 'Calculated dynamically across all monitored sector probes.',
    byLocationTitle: 'Soil Moisture by Location',
    viewAllBtn: 'View All →',
    scatterTitle: 'Soil Moisture vs Flash-Flood Risk',
    scatterSubtitle: 'Click on any point to inspect hydrological details',
    scatterAxisLabel: 'Moisture (X) vs Risk (Y)',
    scatterNote: '“Higher soil moisture can reduce infiltration capacity and increase surface runoff under continued rainfall.”',
    conditionAnalysisTitle: 'Soil Condition Analysis',
    avgMoistureMini: 'Avg Moisture',
    avgSaturationMini: 'Avg Saturation',
    overallTrendMini: 'Overall Trend',
    waterRetentionMini: 'Water Retention',
    trendRising: 'Rising',
    retentionHigh: 'High',
    reducedInfiltration: 'Reduced infiltration',
    sensorAggregationNote: 'Telemetry aggregated across continuous automated slope moisture loggers.',
    situationTitle: 'Current Soil Situation',
    situationText: 'Soil moisture levels are high in upper catchment areas, especially Chamoli Slope Alpha and Raini Village. Continued rainfall may lead to further saturation, increasing surface runoff and flash-flood risk.',
    keyPointsTitle: 'Key Points',
    keyPoints: [
      '3 locations are in critical saturation.',
      'Soil moisture is rising in 7 of 12 locations.',
      'Infiltration capacity is reduced in several upper-slope areas.',
      'Rainfall and river levels should be monitored closely.'
    ],
    subsurfaceState: 'Sub-surface State',
    networkSynced: 'Hydrological Network Synced',
    allLocationsTitle: 'All Monitoring Locations',
    allLocationsSubtitle: 'Real-time sub-surface telemetry across 12 basin points',
    searchPlaceholder: 'Search location...',
    filterAllStatus: 'All Status',
    sortMoistureHighLow: 'Moisture High → Low',
    sortMoistureLowHigh: 'Moisture Low → High',
    sortRiskHighLow: 'Risk High → Low',
    perPage: '/ page',
    thLocation: 'Location',
    thArea: 'Area / Sector',
    thMoisture: 'Soil Moisture',
    thSaturation: 'Saturation',
    thTrend: 'Trend',
    thFloodRisk: 'Flood Risk',
    thLastUpdated: 'Last Updated',
    thAction: 'Action',
    btnView: 'View',
    showing: 'Showing',
    to: '–',
    of: 'of',
    locationsSuffix: 'locations',
    noLocationsFound: 'No monitoring locations matched your criteria.',
    modalMetricsTitle: 'Soil Condition Metrics',
    modalMoisture: 'Soil Moisture',
    modalSaturation: 'Saturation',
    modalPoreFill: 'Pore Fill',
    modalWarnThresh: 'Warning Thresh',
    modalCritThresh: 'Critical Thresh',
    modalHistoryTitle: '24-Hour Soil Moisture History',
    modalWatershedTitle: 'Connected Watershed Telemetry',
    thRainfall24h: '24H Rainfall',
    thRiverLevel: 'River Level',
    thInfiltrationRate: 'Infiltration Rate',
    infiltrationReducedVal: 'Reduced (-30%)',
    infiltrationSurfaceSat: 'Surface Saturated',
    modalAiInsightTitle: 'AI Insight',
    btnViewRiskAnalysis: 'View Risk Analysis',
    btnViewSensorData: 'View Sensor Data',
    btnClose: 'Close'
  },
  hi: {
    pageTitle: 'मिट्टी की नमी और संतृप्ति',
    subtitle: 'वास्तविक समय मिट्टी की नमी और संतृप्ति निगरानी',
    lastUpdated: 'अंतिम अपडेट: 20 सितं 2026, 10:52 PM',
    liveData: 'लाइव डेटा',
    bannerTitle: 'चेतावनी: चमोली जिले में उच्च संतृप्ति चेतावनी',
    bannerText: 'चमोली जिले में भारी बारिश की चेतावनी। कई स्थानों पर मिट्टी की संतृप्ति अत्यधिक है (चमोली ढलान अल्फा, रैणी और हेलांग में 85% से अधिक)। ऊंचे स्थानों पर जाएं।',
    avgMoistureTitle: 'औसत मिट्टी की नमी',
    districtMean: 'जिला औसत',
    vsPrevious24h: 'विगत 24 घंटे की तुलना में',
    criticalZonesTitle: 'अति-संवेदनशील क्षेत्र',
    highRiskSlopes: 'उच्च जोखिम वाली ढलानें',
    saturationThreshold: '> 85% संतृप्ति',
    locationsRisingTitle: 'नमी वृद्धि वाले क्षेत्र',
    activeRunoffTrend: 'सक्रिय अपवाह रुझान',
    moistureIncreasing: 'नमी लगातार बढ़ रही है',
    totalSitesTitle: 'कुल निगरानी केंद्र',
    sensorArrays: 'सेंसर शृंखलाएं',
    acrossBasin: 'चमोली बेसिन में स्थापित',
    trendChartTitle: 'मिट्टी की नमी का रुझान',
    trendChartSubtitle: 'चयनित क्षेत्र: चमोली जिला – औसत',
    last24HoursDropdown: 'विगत 24 घंटे ▼',
    saturationDistTitle: 'संतृप्ति स्तर वितरण',
    sitesMonitoredCount: '12 केंद्र सक्रिय',
    locationsWord: 'स्थान',
    criticalLabel: 'गंभीर (> 85%)',
    highLabel: 'उच्च (70–85%)',
    moderateLabel: 'मध्यम (50–70%)',
    normalLabel: 'सामान्य (< 50%)',
    dynamicCalcNote: 'सभी निगरानी प्रोब से वास्तविक समय में परिकलित।',
    byLocationTitle: 'स्थान अनुसार मिट्टी की नमी',
    viewAllBtn: 'सभी देखें →',
    scatterTitle: 'मिट्टी की नमी बनाम बाढ़ का जोखिम',
    scatterSubtitle: 'विस्तृत जलवैज्ञानिक जानकारी देखने के लिए किसी भी बिंदु पर क्लिक करें',
    scatterAxisLabel: 'नमी (X) बनाम जोखिम (Y)',
    scatterNote: '“अत्यधिक मिट्टी नमी जल सोखने की क्षमता को कम करती है और भारी बारिश में सतह पर अचानक बहाव बढ़ा देती है।”',
    conditionAnalysisTitle: 'मिट्टी की स्थिति का विश्लेषण',
    avgMoistureMini: 'औसत नमी',
    avgSaturationMini: 'औसत संतृप्ति',
    overallTrendMini: 'समग्र रुझान',
    waterRetentionMini: 'जल प्रतिधारण',
    trendRising: 'बढ़ रहा है',
    retentionHigh: 'उच्च',
    reducedInfiltration: 'सोखने की क्षमता में कमी',
    sensorAggregationNote: 'स्वचालित ढलान नमी सेंसरों से एकत्रित डेटा।',
    situationTitle: 'वर्तमान मिट्टी की स्थिति',
    situationText: 'ऊपरी जलग्रहण क्षेत्रों, विशेष रूप से चमोली ढलान अल्फा और रैणी गांव में मिट्टी की नमी बहुत अधिक है। निरंतर बारिश से पूर्ण संतृप्ति हो सकती है, जिससे सतह पर अचानक बाढ़ का जोखिम बढ़ रहा है।',
    keyPointsTitle: 'मुख्य बिंदु',
    keyPoints: [
      '3 स्थान गंभीर संतृप्ति स्तर पर हैं।',
      '12 में से 7 स्थानों पर मिट्टी की नमी बढ़ रही है।',
      'ऊपरी ढलानों पर पानी सोखने की क्षमता काफी घट गई है।',
      'बारिश और नदी के जलस्तर पर लगातार नजर रखी जानी चाहिए।'
    ],
    subsurfaceState: 'उप-सतह स्थिति',
    networkSynced: 'हाइड्रोलॉजिकल नेटवर्क सक्रिय',
    allLocationsTitle: 'सभी निगरानी केंद्र',
    allLocationsSubtitle: 'बेसिन के 12 प्रमुख केंद्रों पर उप-सतह टेलीमेट्री',
    searchPlaceholder: 'स्थान खोजें...',
    filterAllStatus: 'सभी स्थितियां',
    sortMoistureHighLow: 'नमी: अधिक से कम',
    sortMoistureLowHigh: 'नमी: कम से अधिक',
    sortRiskHighLow: 'जोखिम: अधिक से कम',
    perPage: '/ पृष्ठ',
    thLocation: 'स्थान',
    thArea: 'क्षेत्र / सेक्टर',
    thMoisture: 'मिट्टी की नमी',
    thSaturation: 'संतृप्ति',
    thTrend: 'रुझान',
    thFloodRisk: 'बाढ़ जोखिम',
    thLastUpdated: 'अंतिम अपडेट',
    thAction: 'कार्रवाई',
    btnView: 'देखें',
    showing: 'प्रदर्शित',
    to: '–',
    of: 'कुल',
    locationsSuffix: 'स्थान',
    noLocationsFound: 'आपके मानदंडों से मेल खाता कोई निगरानी केंद्र नहीं मिला।',
    modalMetricsTitle: 'मिट्टी की स्थिति मेट्रिक्स',
    modalMoisture: 'मिट्टी की नमी',
    modalSaturation: 'संतृप्ति',
    modalPoreFill: 'छिद्र भराव',
    modalWarnThresh: 'चेतावनी सीमा',
    modalCritThresh: 'गंभीर सीमा',
    modalHistoryTitle: '24 घंटे का मिट्टी नमी इतिहास',
    modalWatershedTitle: 'संबद्ध जलक्षेत्र टेलीमेट्री',
    thRainfall24h: '24 घंटे वर्षा',
    thRiverLevel: 'नदी जलस्तर',
    thInfiltrationRate: 'जल सोखने की दर',
    infiltrationReducedVal: 'घटी हुई (-30%)',
    infiltrationSurfaceSat: 'सतह पूरी तरह संतृप्त',
    modalAiInsightTitle: 'एआई अंतर्दृष्टि (AI Insight)',
    btnViewRiskAnalysis: 'जोखिम विश्लेषण देखें',
    btnViewSensorData: 'सेंसर डेटा देखें',
    btnClose: 'बंद करें'
  }
};

const MOISTURE_STATUS_TRANSLATIONS = {
  CRITICAL: { en: 'CRITICAL', hi: 'गंभीर' },
  HIGH: { en: 'HIGH', hi: 'उच्च' },
  MODERATE: { en: 'MODERATE', hi: 'मध्यम' },
  NORMAL: { en: 'NORMAL', hi: 'सामान्य' }
};

const RISK_BADGE_TRANSLATIONS = {
  EXTREME: { en: 'EXTREME', hi: 'अत्यधिक' },
  HIGH: { en: 'HIGH', hi: 'उच्च' },
  MEDIUM: { en: 'MEDIUM', hi: 'मध्यम' },
  LOW: { en: 'LOW', hi: 'निम्न' }
};

// --- CONFIGURABLE APPLICATION THRESHOLDS ---
const getMoistureStatus = (val) => {
  if (val >= 85) return { key: 'CRITICAL', label: 'CRITICAL', badge: 'bg-red-50 text-red-700 border-red-200', fill: 'bg-red-500', stroke: '#ef4444' };
  if (val >= 70) return { key: 'HIGH', label: 'HIGH', badge: 'bg-orange-50 text-orange-700 border-orange-200', fill: 'bg-orange-500', stroke: '#f97316' };
  if (val >= 50) return { key: 'MODERATE', label: 'MODERATE', badge: 'bg-amber-50 text-amber-700 border-amber-200', fill: 'bg-amber-500', stroke: '#f59e0b' };
  return { key: 'NORMAL', label: 'NORMAL', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', fill: 'bg-emerald-500', stroke: '#10b981' };
};

const getRiskBadge = (score) => {
  if (score >= 75) return { key: 'EXTREME', label: 'EXTREME', badge: 'bg-red-100 text-red-700' };
  if (score >= 50) return { key: 'HIGH', label: 'HIGH', badge: 'bg-orange-100 text-orange-700' };
  if (score >= 25) return { key: 'MEDIUM', label: 'MEDIUM', badge: 'bg-amber-100 text-amber-700' };
  return { key: 'LOW', label: 'LOW', badge: 'bg-emerald-100 text-emerald-700' };
};

// --- BASE 12 MONITORING SITES ---
const BASE_SITES = [
  {
    id: 'SM-01',
    locationEn: 'Chamoli Slope Alpha',
    locationHi: 'चमोली ढलान अल्फा',
    areaEn: 'Chamoli',
    areaHi: 'चमोली',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 88,
    saturation: 92,
    trend: 'up',
    trendChange: '+8%',
    trend1h: '+2%',
    rainfall24h: '112 mm / 24h',
    rainfallIntensityEn: 'Heavy',
    rainfallIntensityHi: 'भारी',
    riverLevel: '+1.2 m',
    riverTrendEn: 'Rising',
    riverTrendHi: 'बढ़ रहा है',
    floodRiskScore: 82,
    lastUpdated: '10:52 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Soil moisture is approaching saturation. Continued rainfall may reduce infiltration capacity and increase surface runoff, contributing to elevated flood risk.',
    aiInsightHi: 'मिट्टी की नमी पूर्ण संतृप्ति के निकट पहुंच रही है। निरंतर वर्षा से जल सोखने की क्षमता घट सकती है और सतही बहाव बढ़ सकता है, जिससे बाढ़ का जोखिम बढ़ जाएगा।',
    hourlyReadings: [
      { time: '12 AM', moisture: 42 }, { time: '2 AM', moisture: 46 },
      { time: '4 AM', moisture: 52 }, { time: '6 AM', moisture: 58 },
      { time: '8 AM', moisture: 64 }, { time: '10 AM', moisture: 70 },
      { time: '12 PM', moisture: 74 }, { time: '2 PM', moisture: 78 },
      { time: '4 PM', moisture: 81 }, { time: '6 PM', moisture: 84 },
      { time: '8 PM', moisture: 86 }, { time: '10 PM', moisture: 88 }
    ]
  },
  {
    id: 'SM-02',
    locationEn: 'Raini Village',
    locationHi: 'रैणी गांव',
    areaEn: 'Raini',
    areaHi: 'रैणी',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 81,
    saturation: 86,
    trend: 'up',
    trendChange: '+6%',
    trend1h: '+1%',
    rainfall24h: '98 mm / 24h',
    rainfallIntensityEn: 'Heavy',
    rainfallIntensityHi: 'भारी',
    riverLevel: '+0.9 m',
    riverTrendEn: 'Rising',
    riverTrendHi: 'बढ़ रहा है',
    floodRiskScore: 70,
    lastUpdated: '10:50 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Steep hill slopes showing progressive saturation. Subsurface pore pressure is elevated across loose colluvium deposits.',
    aiInsightHi: 'तीव्र पहाड़ी ढलानों में लगातार संतृप्ति देखी जा रही है। ढीले मलबे के जमाव पर उप-सतह छिद्र जल दबाव बढ़ा हुआ है।',
    hourlyReadings: [
      { time: '12 AM', moisture: 38 }, { time: '2 AM', moisture: 42 },
      { time: '4 AM', moisture: 48 }, { time: '6 AM', moisture: 54 },
      { time: '8 AM', moisture: 60 }, { time: '10 AM', moisture: 66 },
      { time: '12 PM', moisture: 70 }, { time: '2 PM', moisture: 73 },
      { time: '4 PM', moisture: 76 }, { time: '6 PM', moisture: 78 },
      { time: '8 PM', moisture: 80 }, { time: '10 PM', moisture: 81 }
    ]
  },
  {
    id: 'SM-03',
    locationEn: 'Tapovan',
    locationHi: 'तपोवन',
    areaEn: 'Tapovan',
    areaHi: 'तपोवन',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 74,
    saturation: 78,
    trend: 'up',
    trendChange: '+4%',
    trend1h: '+1%',
    rainfall24h: '85 mm / 24h',
    rainfallIntensityEn: 'Moderate',
    rainfallIntensityHi: 'मध्यम',
    riverLevel: '+0.8 m',
    riverTrendEn: 'Rising',
    riverTrendHi: 'बढ़ रहा है',
    floodRiskScore: 60,
    lastUpdated: '10:48 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Saturation zone expanding along riverside benches. Percolation rate has reduced by 30% compared to seasonal average.',
    aiInsightHi: 'नदी किनारे संतृप्ति क्षेत्र का विस्तार हो रहा है। मौसमी औसत की तुलना में पानी रिसने की दर में 30% की कमी आई है।',
    hourlyReadings: [
      { time: '12 AM', moisture: 40 }, { time: '2 AM', moisture: 44 },
      { time: '4 AM', moisture: 49 }, { time: '6 AM', moisture: 53 },
      { time: '8 AM', moisture: 58 }, { time: '10 AM', moisture: 62 },
      { time: '12 PM', moisture: 66 }, { time: '2 PM', moisture: 69 },
      { time: '4 PM', moisture: 71 }, { time: '6 PM', moisture: 72 },
      { time: '8 PM', moisture: 73 }, { time: '10 PM', moisture: 74 }
    ]
  },
  {
    id: 'SM-04',
    locationEn: 'Dewal Valley Base',
    locationHi: 'देवाल घाटी तलहटी',
    areaEn: 'Dewal',
    areaHi: 'देवाल',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 65,
    saturation: 70,
    trend: 'up',
    trendChange: '+5%',
    trend1h: '+1%',
    rainfall24h: '76 mm / 24h',
    rainfallIntensityEn: 'Moderate',
    rainfallIntensityHi: 'मध्यम',
    riverLevel: '+0.6 m',
    riverTrendEn: 'Stable',
    riverTrendHi: 'स्थिर',
    floodRiskScore: 48,
    lastUpdated: '10:47 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Valley floor loam retention is high but clay layers still provide moderate buffer against immediate flash runoff.',
    aiInsightHi: 'घाटी में दोमट मिट्टी की जलधारण क्षमता अच्छी है और चिकनी मिट्टी की परतें तत्काल आकस्मिक बहाव के विरुद्ध बफर प्रदान कर रही हैं।',
    hourlyReadings: [
      { time: '12 AM', moisture: 35 }, { time: '2 AM', moisture: 38 },
      { time: '4 AM', moisture: 42 }, { time: '6 AM', moisture: 46 },
      { time: '8 AM', moisture: 50 }, { time: '10 AM', moisture: 54 },
      { time: '12 PM', moisture: 57 }, { time: '2 PM', moisture: 60 },
      { time: '4 PM', moisture: 62 }, { time: '6 PM', moisture: 63 },
      { time: '8 PM', moisture: 64 }, { time: '10 PM', moisture: 65 }
    ]
  },
  {
    id: 'SM-05',
    locationEn: 'Gopeshwar',
    locationHi: 'गोपेश्वर',
    areaEn: 'Gopeshwar',
    areaHi: 'गोपेश्वर',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 51,
    saturation: 56,
    trend: 'up',
    trendChange: '+2%',
    trend1h: '+1%',
    rainfall24h: '45 mm / 24h',
    rainfallIntensityEn: 'Light',
    rainfallIntensityHi: 'हल्की',
    riverLevel: 'Normal',
    riverTrendEn: 'Stable',
    riverTrendHi: 'स्थिर',
    floodRiskScore: 32,
    lastUpdated: '10:45 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Moisture within moderate baseline. Ground permeability is intact with steady drainage towards municipal culverts.',
    aiInsightHi: 'नमी मध्यम स्तर पर है। भूमि की सोखने की क्षमता सामान्य है और नालियों से पानी का निकास सुचारू रूप से हो रहा है।',
    hourlyReadings: [
      { time: '12 AM', moisture: 32 }, { time: '2 AM', moisture: 34 },
      { time: '4 AM', moisture: 37 }, { time: '6 AM', moisture: 40 },
      { time: '8 AM', moisture: 43 }, { time: '10 AM', moisture: 45 },
      { time: '12 PM', moisture: 47 }, { time: '2 PM', moisture: 48 },
      { time: '4 PM', moisture: 49 }, { time: '6 PM', moisture: 50 },
      { time: '8 PM', moisture: 50 }, { time: '10 PM', moisture: 51 }
    ]
  },
  {
    id: 'SM-06',
    locationEn: 'Joshimath Ridge',
    locationHi: 'जोशीमठ रिज',
    areaEn: 'Joshimath',
    areaHi: 'जोशीमठ',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 42,
    saturation: 46,
    trend: 'down',
    trendChange: '-3%',
    trend1h: '-1%',
    rainfall24h: '28 mm / 24h',
    rainfallIntensityEn: 'Light',
    rainfallIntensityHi: 'हल्की',
    riverLevel: 'Normal',
    riverTrendEn: 'Stable',
    riverTrendHi: 'स्थिर',
    floodRiskScore: 22,
    lastUpdated: '10:44 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Upper ridge moraine has drained well over the last 12 hours. Subsidence monitoring pins indicate stable shear conditions.',
    aiInsightHi: 'ऊपरी पहाड़ी मलबे से पिछले 12 घंटों में पानी का निकास अच्छा रहा है। धंसाव निगरानी सेंसर स्थिर स्थिति दर्शा रहे हैं।',
    hourlyReadings: [
      { time: '12 AM', moisture: 48 }, { time: '2 AM', moisture: 47 },
      { time: '4 AM', moisture: 46 }, { time: '6 AM', moisture: 45 },
      { time: '8 AM', moisture: 44 }, { time: '10 AM', moisture: 44 },
      { time: '12 PM', moisture: 43 }, { time: '2 PM', moisture: 43 },
      { time: '4 PM', moisture: 43 }, { time: '6 PM', moisture: 42 },
      { time: '8 PM', moisture: 42 }, { time: '10 PM', moisture: 42 }
    ]
  },
  {
    id: 'SM-07',
    locationEn: 'Pipalkoti Terraces',
    locationHi: 'पीपलकोटी सीढ़ीदार खेत',
    areaEn: 'Pipalkoti',
    areaHi: 'पीपलकोटी',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 48,
    saturation: 52,
    trend: 'down',
    trendChange: '-2%',
    trend1h: '0%',
    rainfall24h: '30 mm / 24h',
    rainfallIntensityEn: 'Light',
    rainfallIntensityHi: 'हल्की',
    riverLevel: 'Normal',
    riverTrendEn: 'Stable',
    riverTrendHi: 'स्थिर',
    floodRiskScore: 25,
    lastUpdated: '10:43 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Agricultural terrace soils are dry to damp with substantial residual water absorption headroom.',
    aiInsightHi: 'कृषि सीढ़ीदार खेतों की मिट्टी में अतिरिक्त पानी को सोखने की पर्याप्त क्षमता शेष है।',
    hourlyReadings: [
      { time: '12 AM', moisture: 52 }, { time: '2 AM', moisture: 51 },
      { time: '4 AM', moisture: 50 }, { time: '6 AM', moisture: 50 },
      { time: '8 AM', moisture: 49 }, { time: '10 AM', moisture: 49 },
      { time: '12 PM', moisture: 48 }, { time: '2 PM', moisture: 48 },
      { time: '4 PM', moisture: 48 }, { time: '6 PM', moisture: 48 },
      { time: '8 PM', moisture: 48 }, { time: '10 PM', moisture: 48 }
    ]
  },
  {
    id: 'SM-08',
    locationEn: 'Helang Chasm',
    locationHi: 'हेलांग संकरी घाटी',
    areaEn: 'Helang',
    areaHi: 'हेलांग',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 86,
    saturation: 89,
    trend: 'up',
    trendChange: '+9%',
    trend1h: '+2%',
    rainfall24h: '108 mm / 24h',
    rainfallIntensityEn: 'Heavy',
    rainfallIntensityHi: 'भारी',
    riverLevel: '+1.4 m',
    riverTrendEn: 'Rising',
    riverTrendHi: 'बढ़ रहा है',
    floodRiskScore: 78,
    lastUpdated: '10:51 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Critical saturation reached. Slope runoff coefficients exceed 0.85, meaning almost all current rainfall converts to immediate surface surge.',
    aiInsightHi: 'गंभीर संतृप्ति स्तर पहुंच गया है। ढलान अपवाह गुणांक 0.85 से अधिक है, जिसका अर्थ है कि लगभग पूरी वर्षा सीधे सतह पर बह रही है।',
    hourlyReadings: [
      { time: '12 AM', moisture: 35 }, { time: '2 AM', moisture: 42 },
      { time: '4 AM', moisture: 50 }, { time: '6 AM', moisture: 60 },
      { time: '8 AM', moisture: 68 }, { time: '10 AM', moisture: 74 },
      { time: '12 PM', moisture: 78 }, { time: '2 PM', moisture: 81 },
      { time: '4 PM', moisture: 83 }, { time: '6 PM', moisture: 84 },
      { time: '8 PM', moisture: 85 }, { time: '10 PM', moisture: 86 }
    ]
  },
  {
    id: 'SM-09',
    locationEn: 'Karnaprayag Confluence Flank',
    locationHi: 'कर्णप्रयाग संगम पार्श्व',
    areaEn: 'Karnaprayag',
    areaHi: 'कर्णप्रयाग',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 62,
    saturation: 66,
    trend: 'up',
    trendChange: '+3%',
    trend1h: '+1%',
    rainfall24h: '55 mm / 24h',
    rainfallIntensityEn: 'Moderate',
    rainfallIntensityHi: 'मध्यम',
    riverLevel: '+0.5 m',
    riverTrendEn: 'Rising',
    riverTrendHi: 'बढ़ रहा है',
    floodRiskScore: 52,
    lastUpdated: '10:46 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Intermediate saturation. Soil retention stable along riverbank slope retaining walls.',
    aiInsightHi: 'मध्यम संतृप्ति। नदी किनारे की सुरक्षा दीवारों के साथ मिट्टी की पकड़ स्थिर बनी हुई है।',
    hourlyReadings: [
      { time: '12 AM', moisture: 45 }, { time: '2 AM', moisture: 48 },
      { time: '4 AM', moisture: 51 }, { time: '6 AM', moisture: 54 },
      { time: '8 AM', moisture: 56 }, { time: '10 AM', moisture: 58 },
      { time: '12 PM', moisture: 59 }, { time: '2 PM', moisture: 60 },
      { time: '4 PM', moisture: 61 }, { time: '6 PM', moisture: 61 },
      { time: '8 PM', moisture: 62 }, { time: '10 PM', moisture: 62 }
    ]
  },
  {
    id: 'SM-10',
    locationEn: 'Mana Outcrop',
    locationHi: 'माणा चट्टानी क्षेत्र',
    areaEn: 'Mana',
    areaHi: 'माणा',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 87,
    saturation: 90,
    trend: 'up',
    trendChange: '+7%',
    trend1h: '+1%',
    rainfall24h: '92 mm / 24h',
    rainfallIntensityEn: 'Heavy',
    rainfallIntensityHi: 'भारी',
    riverLevel: '+1.1 m',
    riverTrendEn: 'Rising',
    riverTrendHi: 'बढ़ रहा है',
    floodRiskScore: 76,
    lastUpdated: '10:49 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Glacial melt combined with intense localized precipitation has overwhelmed upper moraine storage capacity.',
    aiInsightHi: 'ग्लेशियर पिघलने और भारी स्थानीय बारिश ने ऊपरी मोराइन की जल संचयन क्षमता को पूरी तरह भर दिया है।',
    hourlyReadings: [
      { time: '12 AM', moisture: 50 }, { time: '2 AM', moisture: 56 },
      { time: '4 AM', moisture: 63 }, { time: '6 AM', moisture: 70 },
      { time: '8 AM', moisture: 76 }, { time: '10 AM', moisture: 80 },
      { time: '12 PM', moisture: 82 }, { time: '2 PM', moisture: 84 },
      { time: '4 PM', moisture: 85 }, { time: '6 PM', moisture: 86 },
      { time: '8 PM', moisture: 86 }, { time: '10 PM', moisture: 87 }
    ]
  },
  {
    id: 'SM-11',
    locationEn: 'Tharali Gorge Edge',
    locationHi: 'थराली संकरी घाटी किनारा',
    areaEn: 'Tharali',
    areaHi: 'थराली',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 72,
    saturation: 76,
    trend: 'up',
    trendChange: '+4%',
    trend1h: '+1%',
    rainfall24h: '78 mm / 24h',
    rainfallIntensityEn: 'Moderate',
    rainfallIntensityHi: 'मध्यम',
    riverLevel: '+0.7 m',
    riverTrendEn: 'Rising',
    riverTrendHi: 'बढ़ रहा है',
    floodRiskScore: 64,
    lastUpdated: '10:47 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Approaching critical warning threshold. Localized slope creep sensors are active.',
    aiInsightHi: 'चेतावनी सीमा के निकट। ढलान खिसकने की निगरानी करने वाले सेंसर सक्रिय कर दिए गए हैं।',
    hourlyReadings: [
      { time: '12 AM', moisture: 42 }, { time: '2 AM', moisture: 46 },
      { time: '4 AM', moisture: 52 }, { time: '6 AM', moisture: 58 },
      { time: '8 AM', moisture: 62 }, { time: '10 AM', moisture: 65 },
      { time: '12 PM', moisture: 68 }, { time: '2 PM', moisture: 70 },
      { time: '4 PM', moisture: 70 }, { time: '6 PM', moisture: 71 },
      { time: '8 PM', moisture: 71 }, { time: '10 PM', moisture: 72 }
    ]
  },
  {
    id: 'SM-12',
    locationEn: 'Auli Ski Ridge',
    locationHi: 'औली स्की रिज',
    areaEn: 'Auli',
    areaHi: 'औली',
    districtEn: 'Chamoli',
    districtHi: 'चमोली',
    soilMoisture: 38,
    saturation: 42,
    trend: 'down',
    trendChange: '-4%',
    trend1h: '-1%',
    rainfall24h: '15 mm / 24h',
    rainfallIntensityEn: 'Clear',
    rainfallIntensityHi: 'साफ',
    riverLevel: 'Normal',
    riverTrendEn: 'Stable',
    riverTrendHi: 'स्थिर',
    floodRiskScore: 16,
    lastUpdated: '10:42 PM',
    warningThreshold: 70,
    criticalThreshold: 85,
    aiInsightEn: 'Well-drained alpine meadows with high natural percolation capacity. Low saturation risk.',
    aiInsightHi: 'बेहतर जल निकासी वाली पहाड़ी घास के मैदान जहां प्राकृतिक रूप से पानी सोखने की क्षमता अधिक है। संतृप्ति का जोखिम निम्न है।',
    hourlyReadings: [
      { time: '12 AM', moisture: 44 }, { time: '2 AM', moisture: 43 },
      { time: '4 AM', moisture: 42 }, { time: '6 AM', moisture: 41 },
      { time: '8 AM', moisture: 40 }, { time: '10 AM', moisture: 40 },
      { time: '12 PM', moisture: 39 }, { time: '2 PM', moisture: 39 },
      { time: '4 PM', moisture: 38 }, { time: '6 PM', moisture: 38 },
      { time: '8 PM', moisture: 38 }, { time: '10 PM', moisture: 38 }
    ]
  }
];

const DISTRICT_AVERAGE_TREND = [
  { time: '12 AM', moisture: 32, change: '0%' },
  { time: '2 AM', moisture: 34, change: '+2%' },
  { time: '4 AM', moisture: 37, change: '+3%' },
  { time: '6 AM', moisture: 40, change: '+3%' },
  { time: '8 AM', moisture: 43, change: '+3%' },
  { time: '10 AM', moisture: 49, change: '+6%' },
  { time: '12 PM', moisture: 52, change: '+3%' },
  { time: '2 PM', moisture: 63, change: '+11%' },
  { time: '4 PM', moisture: 68, change: '+5%' },
  { time: '6 PM', moisture: 70, change: '+2%' },
  { time: '8 PM', moisture: 72, change: '+2%' },
  { time: '10 PM', moisture: 88, change: '+16%' }
];

// ==========================================
// CARTESIAN CHARTS
// ==========================================

const SoilMoistureTrendChart = ({ data, isHi }) => {
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.moisture}`).join(' ');

  return (
    <div className="flex w-full h-[220px] mt-2 pr-2">
      <div className="w-10 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>

      <div className="flex-1 relative border-b border-slate-200">
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px border-t border-dashed border-red-200"></div>
          <div className="w-full h-px border-t border-dashed border-amber-200"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-300"></div>
        </div>

        <svg className="absolute inset-0 bottom-6 w-full h-[calc(100%-24px)] z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {data.map((d, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const bottomPos = d.moisture;
          const status = getMoistureStatus(d.moisture);

          return (
            <div 
              key={i} 
              className="absolute top-0 bottom-6 z-20 group cursor-pointer"
              style={{ left: `${leftPos}%`, width: '28px', transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2 z-0"></div>

              <div 
                className="absolute left-1/2 w-3.5 h-3.5 bg-white border-2 rounded-full shadow-sm transform -translate-x-1/2 translate-y-1/2 z-30 transition-transform group-hover:scale-150"
                style={{ bottom: `${bottomPos}%`, borderColor: status.stroke }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-slate-300 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-slate-400 whitespace-nowrap pt-1">
                {d.time}
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-blue-300">{d.time}</div>
                <div>{isHi ? 'नमी:' : 'Moisture:'} <span className="font-black text-white">{d.moisture}%</span></div>
                {d.change && <div>{isHi ? 'बदलाव:' : 'Change:'} <span className="font-bold text-emerald-400">{d.change}</span></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MoistureRiskScatterChart = ({ sites, onSelectSite, isHi }) => {
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

        {sites.map((site, i) => {
          const leftPos = site.soilMoisture;
          const bottomPos = site.floodRiskScore;
          const status = getMoistureStatus(site.soilMoisture);
          const riskBadge = getRiskBadge(site.floodRiskScore);

          return (
            <div 
              key={i} 
              onClick={() => onSelectSite(site)}
              className="absolute z-20 group cursor-pointer"
              style={{ left: `${leftPos}%`, bottom: `calc(${bottomPos}% + 24px)`, transform: 'translate(-50%, 50%)' }}
            >
              <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-150 ${status.fill}`}></div>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2.5 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-black text-blue-300 text-xs">{isHi ? site.locationHi : site.locationEn}</div>
                <div>{isHi ? 'मिट्टी की नमी:' : 'Soil Moisture:'} <span className="font-bold text-white">{site.soilMoisture}%</span></div>
                <div>{isHi ? 'बाढ़ जोखिम:' : 'Flood Risk:'} <span className="font-bold text-white">{site.floodRiskScore} / 100</span></div>
                <div>{isHi ? 'स्तर:' : 'Level:'} <span className={`font-black uppercase ${status.badge}`}>{RISK_BADGE_TRANSLATIONS[riskBadge.key]?.[isHi ? 'hi' : 'en']}</span></div>
              </div>
            </div>
          );
        })}

        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] font-bold text-slate-400 pt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function SoilMoisture() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;

  // State
  const [selectedDistrict, setSelectedDistrict] = useState('Chamoli, Uttarakhand');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortField, setSortField] = useState('Moisture High → Low');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalSite, setModalSite] = useState(null);

  const filteredSites = useMemo(() => {
    let list = [...BASE_SITES];

    if (statusFilter !== 'All Status') {
      list = list.filter(s => getMoistureStatus(s.soilMoisture).key === statusFilter.toUpperCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => 
        s.locationEn.toLowerCase().includes(q) || 
        s.locationHi.toLowerCase().includes(q) || 
        s.areaEn.toLowerCase().includes(q) ||
        s.areaHi.toLowerCase().includes(q)
      );
    }

    if (sortField === 'Moisture High → Low') {
      list.sort((a, b) => b.soilMoisture - a.soilMoisture);
    } else if (sortField === 'Moisture Low → High') {
      list.sort((a, b) => a.soilMoisture - b.soilMoisture);
    } else if (sortField === 'Risk High → Low') {
      list.sort((a, b) => b.floodRiskScore - a.floodRiskScore);
    }

    return list;
  }, [statusFilter, searchQuery, sortField]);

  const totalPages = Math.ceil(filteredSites.length / rowsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedSites = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filteredSites.slice(start, start + rowsPerPage);
  }, [filteredSites, safePage, rowsPerPage]);

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-14 animate-fadeIn">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplets className="w-6 h-6 text-blue-700" />
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
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="appearance-none bg-white border border-slate-300 text-slate-800 font-bold text-xs py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
            >
              <option>{isHi ? 'चमोली, उत्तराखंड' : 'Chamoli, Uttarakhand'}</option>
              <option>{isHi ? 'जोशीमठ सेक्टर' : 'Joshimath Sector'}</option>
              <option>{isHi ? 'देवाल जलग्रहण' : 'Dewal Catchment'}</option>
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

      {/* 2. DYNAMIC ALERT BANNER */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-red-900 font-medium leading-relaxed">
          <strong className="font-black uppercase tracking-wider text-red-700 block mb-0.5">{t.bannerTitle}</strong>
          {t.bannerText}
        </div>
      </div>

      {/* 3. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: AVERAGE SOIL MOISTURE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.avgMoistureTitle}</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">68%</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.districtMean}</span>
          </div>
          <div className="text-xs font-bold text-blue-600 flex items-center gap-1 border-t border-slate-100 pt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> ↑ 12% {t.vsPrevious24h}
          </div>
        </div>

        {/* CARD 2: CRITICAL ZONES */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{t.criticalZonesTitle}</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">3</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.highRiskSlopes}</span>
          </div>
          <div className="text-xs font-bold text-red-600 border-t border-slate-100 pt-2">
            {t.saturationThreshold}
          </div>
        </div>

        {/* CARD 3: LOCATIONS RISING */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.locationsRisingTitle}</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">7</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.activeRunoffTrend}</span>
          </div>
          <div className="text-xs font-bold text-amber-600 border-t border-slate-100 pt-2">
            {t.moistureIncreasing}
          </div>
        </div>

        {/* CARD 4: TOTAL MONITORING SITES */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.totalSitesTitle}</span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">12</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.sensorArrays}</span>
          </div>
          <div className="text-xs font-bold text-slate-500 border-t border-slate-100 pt-2">
            {t.acrossBasin}
          </div>
        </div>
      </div>

      {/* 4 & 5. SOIL MOISTURE TREND & SATURATION DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" /> {t.trendChartTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{t.trendChartSubtitle}</span>
            </div>
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600">
              {t.last24HoursDropdown}
            </div>
          </div>
          <SoilMoistureTrendChart data={DISTRICT_AVERAGE_TREND} isHi={isHi} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" /> {t.saturationDistTitle}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t.sitesMonitoredCount}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 mt-2">
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="6"></circle>
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ef4444" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="25"></circle>
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f97316" strokeWidth="6" strokeDasharray="33 67" strokeDashoffset="0"></circle>
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="25 75" strokeDashoffset="-33"></circle>
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="17 83" strokeDashoffset="-58"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">12</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t.locationsWord}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 w-full max-w-[210px] text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-xs bg-red-500"></div> {t.criticalLabel}
                  </span>
                  <strong className="text-slate-900">3 (25%)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-xs bg-orange-500"></div> {t.highLabel}
                  </span>
                  <strong className="text-slate-900">4 (33%)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-xs bg-amber-500"></div> {t.moderateLabel}
                  </span>
                  <strong className="text-slate-900">3 (25%)</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-slate-700">
                    <div className="w-2.5 h-2.5 rounded-xs bg-emerald-500"></div> {t.normalLabel}
                  </span>
                  <strong className="text-slate-900">2 (17%)</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> {t.dynamicCalcNote}
          </div>
        </div>
      </div>

      {/* 6 & 7. SOIL MOISTURE BY LOCATION & SCATTER GRAPH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" /> {t.byLocationTitle}
            </h3>
            <button 
              onClick={() => {
                const el = document.getElementById('all-monitoring-locations');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {t.viewAllBtn}
            </button>
          </div>

          <div className="flex flex-col gap-3.5 flex-1 justify-center">
            {BASE_SITES.slice(0, 6).map((item) => {
              const status = getMoistureStatus(item.soilMoisture);
              const statusLabel = MOISTURE_STATUS_TRANSLATIONS[status.key]?.[isHi ? 'hi' : 'en'] || status.label;
              const isUp = item.trend === 'up';

              return (
                <div 
                  key={item.id} 
                  onClick={() => setModalSite(item)}
                  className="flex flex-col gap-1.5 group cursor-pointer"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {isHi ? item.locationHi : item.locationEn}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900">{item.soilMoisture}%</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${status.badge}`}>
                        {statusLabel}
                      </span>
                      <span className={`text-[11px] font-bold flex items-center ${isUp ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {item.trendChange}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-sm overflow-hidden flex">
                    <div 
                      className={`h-full rounded-r-xs transition-all duration-500 ${status.fill}`}
                      style={{ width: `${item.soilMoisture}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-blue-600" /> {t.scatterTitle}
                </h3>
                <span className="text-xs text-slate-400 font-medium">{t.scatterSubtitle}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t.scatterAxisLabel}</span>
            </div>
            <MoistureRiskScatterChart sites={BASE_SITES.slice(0, 6)} onSelectSite={setModalSite} isHi={isHi} />
          </div>

          <p className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium leading-relaxed">
            {t.scatterNote}
          </p>
        </div>
      </div>

      {/* 8 & 9. CONDITION ANALYSIS & CURRENT SITUATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" /> {t.conditionAnalysisTitle}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start text-blue-600 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.avgMoistureMini}</span>
                  <Droplets className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black text-slate-900">68%</div>
                <span className="text-[11px] font-bold text-blue-600 mt-1 block">↑ 12% (24h)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start text-orange-600 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.avgSaturationMini}</span>
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black text-slate-900">74%</div>
                <span className="text-[11px] font-bold text-orange-600 mt-1 block">↑ 10% (24h)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start text-red-600 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.overallTrendMini}</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-slate-900">{t.trendRising}</div>
                <span className="text-[11px] font-bold text-red-600 mt-1 block">+6% (24h)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start text-amber-600 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.waterRetentionMini}</span>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-xl font-black text-slate-900">{t.retentionHigh}</div>
                <span className="text-[11px] font-bold text-slate-500 mt-1 block">{t.reducedInfiltration}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <Info className="w-3.5 h-3.5" /> {t.sensorAggregationNote}
          </div>
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
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : idx === 2 ? 'bg-amber-500' : 'bg-blue-600'}`}></div>
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
            <span>{t.subsurfaceState}</span>
            <span className="text-blue-700 font-black">{t.networkSynced}</span>
          </div>
        </div>
      </div>

      {/* 10 & 11. ALL MONITORING LOCATIONS TABLE */}
      <div id="all-monitoring-locations" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">{t.allLocationsTitle}</h3>
            <p className="text-xs text-slate-500 font-medium">{t.allLocationsSubtitle}</p>
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
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="All Status">{t.filterAllStatus}</option>
              <option value="Normal">{MOISTURE_STATUS_TRANSLATIONS.NORMAL[isHi ? 'hi' : 'en']}</option>
              <option value="Moderate">{MOISTURE_STATUS_TRANSLATIONS.MODERATE[isHi ? 'hi' : 'en']}</option>
              <option value="High">{MOISTURE_STATUS_TRANSLATIONS.HIGH[isHi ? 'hi' : 'en']}</option>
              <option value="Critical">{MOISTURE_STATUS_TRANSLATIONS.CRITICAL[isHi ? 'hi' : 'en']}</option>
            </select>

            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="Moisture High → Low">{t.sortMoistureHighLow}</option>
              <option value="Moisture Low → High">{t.sortMoistureLowHigh}</option>
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
                <th className="py-3.5 px-4">{t.thArea}</th>
                <th className="py-3.5 px-4 text-right">{t.thMoisture}</th>
                <th className="py-3.5 px-4 text-right">{t.thSaturation}</th>
                <th className="py-3.5 px-4">{t.thTrend}</th>
                <th className="py-3.5 px-4">{t.thFloodRisk}</th>
                <th className="py-3.5 px-4">{t.thLastUpdated}</th>
                <th className="py-3.5 px-4 text-center">{t.thAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {paginatedSites.map((row, idx) => {
                const globalIndex = (safePage - 1) * rowsPerPage + idx + 1;
                const status = getMoistureStatus(row.soilMoisture);
                const statusLabel = MOISTURE_STATUS_TRANSLATIONS[status.key]?.[isHi ? 'hi' : 'en'] || status.label;
                const riskBadge = getRiskBadge(row.floodRiskScore);
                const riskLabel = RISK_BADGE_TRANSLATIONS[riskBadge.key]?.[isHi ? 'hi' : 'en'] || riskBadge.label;
                const isUp = row.trend === 'up';

                return (
                  <tr
                    key={row.id}
                    onClick={() => setModalSite(row)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-400 text-center">{globalIndex}</td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {isHi ? row.locationHi : row.locationEn}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-500">
                      {isHi ? row.areaHi : row.areaEn}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-xs">
                      {row.soilMoisture}%
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-600 text-xs">
                      {row.saturation}%
                    </td>

                    <td className="py-3.5 px-4 text-xs font-bold">
                      <span className={`flex items-center gap-1 ${isUp ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {row.trend1h}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">
                          {row.floodRiskScore} / 100
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${riskBadge.badge}`}>
                          {riskLabel}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-400 font-semibold">
                      {row.lastUpdated}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setModalSite(row); }}
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

        {paginatedSites.length === 0 && (
          <div className="py-16 text-center text-slate-400 font-medium">
            <Droplets className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            {t.noLocationsFound}
          </div>
        )}

        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500">
            {t.showing} <span className="text-slate-900 font-black">{(safePage - 1) * rowsPerPage + 1}</span>{t.to}
            <span className="text-slate-900 font-black">{Math.min(safePage * rowsPerPage, filteredSites.length)}</span> {t.of}{' '}
            <span className="text-slate-900 font-black">{filteredSites.length}</span> {t.locationsSuffix}
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2].map((num) => (
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

      {/* 12. LOCATION DETAIL POPUP MODAL */}
      {modalSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900">
                    {isHi ? modalSite.locationHi : modalSite.locationEn}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getMoistureStatus(modalSite.soilMoisture).badge}`}>
                    {MOISTURE_STATUS_TRANSLATIONS[getMoistureStatus(modalSite.soilMoisture).key]?.[isHi ? 'hi' : 'en']}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  {isHi ? modalSite.areaHi : modalSite.areaEn} Sector, {isHi ? modalSite.districtHi : modalSite.districtEn} • {isHi ? 'अंतिम अपडेट:' : 'Last Updated:'} {modalSite.lastUpdated}
                </div>
              </div>
              <button
                onClick={() => setModalSite(null)}
                className="p-1.5 hover:bg-slate-200/70 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalMetricsTitle}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.modalMoisture}</span>
                    <span className="text-2xl font-black text-slate-900">{modalSite.soilMoisture}%</span>
                    <span className="text-[10px] font-bold text-blue-600 block mt-0.5">{modalSite.trendChange} (24h)</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.modalSaturation}</span>
                    <span className="text-xl font-black text-slate-900">{modalSite.saturation}%</span>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{t.modalPoreFill}</span>
                  </div>
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">{t.modalWarnThresh}</span>
                    <span className="text-xl font-black text-amber-700">{modalSite.warningThreshold}%</span>
                  </div>
                  <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-100">
                    <span className="text-[10px] font-bold text-red-800 uppercase block mb-1">{t.modalCritThresh}</span>
                    <span className="text-xl font-black text-red-700">{modalSite.criticalThreshold}%</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalHistoryTitle}</span>
                <SoilMoistureTrendChart data={modalSite.hourlyReadings} isHi={isHi} />
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalWatershedTitle}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.thRainfall24h}</span>
                    <span className="text-sm font-black text-slate-900">{modalSite.rainfall24h}</span>
                    <span className="text-[9px] font-bold text-slate-500">
                      {isHi ? modalSite.rainfallIntensityHi : modalSite.rainfallIntensityEn}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.thRiverLevel}</span>
                    <span className="text-sm font-black text-slate-900">{modalSite.riverLevel}</span>
                    <span className="text-[9px] font-bold text-blue-600">
                      {isHi ? modalSite.riverTrendHi : modalSite.riverTrendEn}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.thFloodRisk}</span>
                    <span className="text-sm font-black text-red-600">{modalSite.floodRiskScore} / 100</span>
                    <span className="text-[9px] font-black text-red-500 uppercase">
                      {RISK_BADGE_TRANSLATIONS[getRiskBadge(modalSite.floodRiskScore).key]?.[isHi ? 'hi' : 'en']}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.thInfiltrationRate}</span>
                    <span className="text-sm font-black text-amber-600">{t.infiltrationReducedVal}</span>
                    <span className="text-[9px] font-bold text-slate-500">{t.infiltrationSurfaceSat}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">{t.modalAiInsightTitle}</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {isHi ? modalSite.aiInsightHi : modalSite.aiInsightEn}
                </p>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => alert(`Navigating to Risk Analysis for ${isHi ? modalSite.locationHi : modalSite.locationEn}...`)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-xs shadow-2xs"
              >
                <ShieldAlert className="w-4 h-4" /> {t.btnViewRiskAnalysis}
              </button>
              <button 
                onClick={() => alert(`Navigating to Live Sensors for ${isHi ? modalSite.locationHi : modalSite.locationEn}...`)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition-colors text-xs"
              >
                <Activity className="w-4 h-4" /> {t.btnViewSensorData}
              </button>
              <button 
                onClick={() => setModalSite(null)}
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