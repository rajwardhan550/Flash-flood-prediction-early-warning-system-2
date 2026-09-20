import React, { useState, useMemo } from 'react';
import { 
  CloudSun, Thermometer, Wind, Droplets, Gauge, AlertTriangle, 
  ChevronDown, Search, ChevronLeft, ChevronRight, X, Activity, 
  ShieldAlert, CloudRain, Waves, MapPin, TrendingUp, Info, 
  ExternalLink, BarChart3, SlidersHorizontal
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'Weather Station Data',
    subtitle: 'Real-time atmospheric conditions and weather station monitoring',
    lastUpdated: 'Last Updated: 20 Sep 2026, 10:52 PM',
    liveData: 'Live Data',
    bannerTitle: 'ALERT: Heavy Rainfall Warning in Chamoli District',
    bannerText: 'Heavy rainfall expected in Chamoli district. High humidity and unstable weather conditions. Stay alert and follow advisories.',
    cardTempTitle: 'Temperature',
    ambientReading: 'Ambient Reading',
    vs6hAgo: 'vs 6h ago',
    cardWindTitle: 'Wind Speed',
    velocity: 'Velocity',
    cardHumidityTitle: 'Humidity',
    moistureContent: 'Moisture Content',
    highLabel: 'HIGH',
    cardPressureTitle: 'Pressure',
    barometric: 'Barometric',
    tempChartTitle: 'Temperature Trend — Last 24 Hours',
    tempChartSubtitle: 'station telemetry',
    last24HoursDropdown: 'Last 24 Hours ▼',
    windChartTitle: 'Wind Speed Trend — Last 24 Hours',
    windChartSubtitle: 'Hourly wind velocity (km/h)',
    velocityLabel: 'Velocity',
    humidityChartTitle: 'Humidity Trend — Last 24 Hours',
    humidityChartSubtitle: 'Relative humidity percentage',
    moisturePctLabel: 'Moisture %',
    pressureChartTitle: 'Atmospheric Pressure Trend — Last 24 Hours',
    pressureChartSubtitle: 'Barometric pressure (hPa)',
    hpaLabel: 'hPa',
    byLocationTitle: 'Current Weather by Location',
    byLocationSubtitle: 'Top 5 monitored sector stations',
    viewAllBtn: 'View All →',
    riskPrefix: 'Risk:',
    riskSuffix: 'RISK',
    situationTitle: 'Current Weather Situation',
    situationText: 'Cloudy conditions with intermittent heavy rainfall are being observed across Chamoli district. High humidity and moderate wind speeds are likely to continue. Weather conditions may support further soil saturation and increased river discharge.',
    keyPointsTitle: 'Key Points',
    keyPoints: [
      'Heavy rainfall expected in the next 24 hours.',
      'Humidity remains high across several locations.',
      'Unstable weather may contribute to elevated flood risk.',
      'Monitor local alerts and advisories.'
    ],
    layerActive: 'Atmospheric Layer Active',
    tableTitle: 'Weather Station Readings',
    tableSubtitle: 'Monitoring 10 primary sector weather stations',
    searchPlaceholder: 'Search location...',
    filterAllStatus: 'All Status',
    sortRiskHighLow: 'Flood Risk High → Low',
    sortRiskLowHigh: 'Flood Risk Low → High',
    sortRainHighLow: 'Rainfall High → Low',
    perPage: '/ page',
    thLocation: 'Location',
    thArea: 'Area / Sector',
    thTemp: 'Temperature',
    thHumidity: 'Humidity',
    thWind: 'Wind Speed',
    thPressure: 'Pressure',
    thRainfall: 'Rainfall (24h)',
    thFloodRisk: 'Flood Risk',
    thLastUpdated: 'Last Updated',
    thAction: 'Action',
    btnView: 'View',
    showing: 'Showing',
    to: '–',
    of: 'of',
    stationsWord: 'stations',
    noStationsFound: 'No weather stations matched your filter criteria.',
    modalAtmosphericTitle: 'Current Atmospheric Metrics',
    modalHighMoisture: 'High Moisture',
    modal24hTrendTitle: '24-Hour Weather Trend',
    tabTemperature: 'Temperature',
    tabHumidity: 'Humidity',
    tabWind: 'Wind',
    tabPressure: 'Pressure',
    modalFloodConditionsTitle: 'Connected Flood Conditions',
    soilSaturation: 'Soil Saturation',
    riverLevel: 'River Level',
    riverTrend: 'River Trend',
    flashFloodRisk: 'Flash Flood Risk',
    modalSituationTitle: 'Current Situation',
    modalSituationText: 'Heavy rainfall and high humidity are currently being observed. Combined with elevated soil saturation and rising river levels, the location is under increased flood-risk conditions.',
    liveStation: 'Live Station',
    btnViewRainfall: 'View Rainfall',
    btnViewRiskAnalysis: 'View Risk Analysis',
    btnViewSensorData: 'View Sensor Data',
    btnClose: 'Close'
  },
  hi: {
    pageTitle: 'मौसम स्टेशन डेटा',
    subtitle: 'वास्तविक समय वायुमंडलीय स्थिति और मौसम स्टेशन निगरानी',
    lastUpdated: 'अंतिम अपडेट: 20 सितं 2026, 10:52 PM',
    liveData: 'लाइव डेटा',
    bannerTitle: 'चेतावनी: चमोली जिले में भारी बारिश का अलर्ट',
    bannerText: 'चमोली जिले में भारी बारिश की आशंका। उच्च आर्द्रता और अस्थिर वायुमंडलीय स्थितियां। सतर्क रहें और परामर्श का पालन करें।',
    cardTempTitle: 'तापमान',
    ambientReading: 'परिवेशी तापमान',
    vs6hAgo: 'विगत 6 घंटे की तुलना में',
    cardWindTitle: 'हवा की गति',
    velocity: 'प्रवाह वेग',
    cardHumidityTitle: 'आर्द्रता',
    moistureContent: 'नमी का स्तर',
    highLabel: 'उच्च (HIGH)',
    cardPressureTitle: 'वायुमंडलीय दबाव',
    barometric: 'बैरोमीटर रीडिंग',
    tempChartTitle: 'तापमान रुझान — विगत 24 घंटे',
    tempChartSubtitle: 'स्टेशन टेलीमेट्री डेटा',
    last24HoursDropdown: 'विगत 24 घंटे ▼',
    windChartTitle: 'हवा की गति का रुझान — विगत 24 घंटे',
    windChartSubtitle: 'प्रति घंटा हवा का वेग (km/h)',
    velocityLabel: 'वेग',
    humidityChartTitle: 'आर्द्रता रुझान — विगत 24 घंटे',
    humidityChartSubtitle: 'सापेक्ष आर्द्रता प्रतिशत',
    moisturePctLabel: 'नमी %',
    pressureChartTitle: 'वायुमंडलीय दबाव रुझान — विगत 24 घंटे',
    pressureChartSubtitle: 'बैरोमीटर का दबाव (hPa)',
    hpaLabel: 'hPa',
    byLocationTitle: 'स्थान अनुसार वर्तमान मौसम',
    byLocationSubtitle: 'शीर्ष 5 निगरानी सेक्टर स्टेशन',
    viewAllBtn: 'सभी देखें →',
    riskPrefix: 'जोखिम:',
    riskSuffix: 'जोखिम',
    situationTitle: 'वर्तमान मौसम की स्थिति',
    situationText: 'चमोली जिले में घने बादलों के साथ रुक-रुक कर भारी बारिश दर्ज की जा रही है। उच्च आर्द्रता और मध्यम हवा की गति जारी रहने की संभावना है। यह मौसम मिट्टी की संतृप्ति और नदियों के जलस्तर को बढ़ा सकता है।',
    keyPointsTitle: 'मुख्य बिंदु',
    keyPoints: [
      'अगले 24 घंटों में भारी बारिश की संभावना है।',
      'कई स्थानों पर आर्द्रता का स्तर लगातार उच्च बना हुआ है।',
      'अस्थिर मौसम के कारण बाढ़ का जोखिम बढ़ सकता है।',
      'स्थानीय अलर्ट और आधिकारिक परामर्श पर नजर रखें।'
    ],
    layerActive: 'वायुमंडलीय परत सक्रिय',
    tableTitle: 'मौसम स्टेशन टेलीमेट्री रीडिंग',
    tableSubtitle: '10 प्राथमिक सेक्टर मौसम स्टेशनों की निगरानी',
    searchPlaceholder: 'स्थान खोजें...',
    filterAllStatus: 'सभी स्थितियां',
    sortRiskHighLow: 'बाढ़ जोखिम: अधिक से कम',
    sortRiskLowHigh: 'बाढ़ जोखिम: कम से अधिक',
    sortRainHighLow: 'वर्षा: अधिक से कम',
    perPage: '/ पृष्ठ',
    thLocation: 'स्थान',
    thArea: 'क्षेत्र / सेक्टर',
    thTemp: 'तापमान',
    thHumidity: 'आर्द्रता',
    thWind: 'हवा की गति',
    thPressure: 'दबाव',
    thRainfall: 'वर्षा (24 घंटे)',
    thFloodRisk: 'बाढ़ जोखिम',
    thLastUpdated: 'अंतिम अपडेट',
    thAction: 'कार्रवाई',
    btnView: 'देखें',
    showing: 'प्रदर्शित',
    to: '–',
    of: 'कुल',
    stationsWord: 'स्टेशन',
    noStationsFound: 'आपके फ़िल्टर मानदंडों से मेल खाता कोई मौसम स्टेशन नहीं मिला।',
    modalAtmosphericTitle: 'वर्तमान वायुमंडलीय मेट्रिक्स',
    modalHighMoisture: 'अत्यधिक नमी',
    modal24hTrendTitle: '24 घंटे का मौसम रुझान',
    tabTemperature: 'तापमान',
    tabHumidity: 'आर्द्रता',
    tabWind: 'हवा',
    tabPressure: 'दबाव',
    modalFloodConditionsTitle: 'संबद्ध बाढ़ स्थितियां',
    soilSaturation: 'मिट्टी की संतृप्ति',
    riverLevel: 'नदी जलस्तर',
    riverTrend: 'जलस्तर रुझान',
    flashFloodRisk: 'अचानक बाढ़ का जोखिम',
    modalSituationTitle: 'वर्तमान स्थिति',
    modalSituationText: 'भारी बारिश और उच्च आर्द्रता वर्तमान में दर्ज की जा रही है। मिट्टी की बढ़ती संतृप्ति और बढ़ते नदी जलस्तर के साथ यह क्षेत्र बढ़े हुए बाढ़ जोखिम के अधीन है।',
    liveStation: 'लाइव स्टेशन',
    btnViewRainfall: 'वर्षा डेटा देखें',
    btnViewRiskAnalysis: 'जोखिम विश्लेषण देखें',
    btnViewSensorData: 'सेंसर डेटा देखें',
    btnClose: 'बंद करें'
  }
};

const WEATHER_COND_TRANSLATIONS = {
  'Heavy Rain': { en: 'Heavy Rain', hi: 'भारी बारिश' },
  'Rain': { en: 'Rain', hi: 'बारिश' },
  'Light Rain': { en: 'Light Rain', hi: 'हल्की बारिश' },
  'Cloudy': { en: 'Cloudy', hi: 'बादल छाए रहेंगे' },
  'Clear': { en: 'Clear', hi: 'साफ मौसम' }
};

const RIVER_TREND_TRANSLATIONS = {
  '↑ Rising': { en: '↑ Rising', hi: '↑ बढ़ रहा है' },
  '↑ Rapidly Rising': { en: '↑ Rapidly Rising', hi: '↑ तीव्र गति से बढ़ रहा है' },
  '→ Stable': { en: '→ Stable', hi: '→ स्थिर' }
};

// --- RISK CLASSIFICATION ---
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
  if (score >= 75) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', fill: 'bg-red-500', stroke: '#ef4444', badge: 'bg-red-100 text-red-700 border-red-200' };
  if (score >= 50) return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', fill: 'bg-orange-500', stroke: '#f97316', badge: 'bg-orange-100 text-orange-700 border-orange-200' };
  if (score >= 25) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', fill: 'bg-amber-500', stroke: '#f59e0b', badge: 'bg-amber-100 text-amber-700 border-amber-200' };
  return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', fill: 'bg-emerald-500', stroke: '#10b981', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
};

// --- REALISTIC WEATHER STATIONS DATA ---
const WEATHER_STATIONS = [
  {
    id: 'WS-01',
    locationEn: 'Chamoli Main Town',
    locationHi: 'चमोली मुख्य नगर',
    areaEn: 'Chamoli',
    areaHi: 'चमोली',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 18,
    humidity: 85,
    windSpeed: 12,
    pressure: 1012,
    weatherCondition: 'Heavy Rain',
    rainfall24h: '112 mm',
    soilSaturation: 88,
    riverLevel: '+1.2 m',
    riverTrend: '↑ Rising',
    floodRiskScore: 82,
    riskLevel: 'HIGH',
    lastUpdated: '10:52 PM',
    hourlyTemperature: [17, 16, 15, 15, 15, 17, 18, 20, 21, 20, 22, 18],
    hourlyHumidity: [63, 65, 66, 68, 70, 72, 75, 78, 80, 82, 85, 85],
    hourlyWind: [14, 11, 9, 10, 14, 11, 13, 15, 17, 22, 26, 12],
    hourlyPressure: [1021, 1018, 1016, 1015, 1014, 1014, 1013, 1012, 1010, 1008, 1012, 1012]
  },
  {
    id: 'WS-02',
    locationEn: 'Raini Village',
    locationHi: 'रैणी गांव',
    areaEn: 'Raini',
    areaHi: 'रैणी',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 19,
    humidity: 88,
    windSpeed: 10,
    pressure: 1011,
    weatherCondition: 'Rain',
    rainfall24h: '120 mm',
    soilSaturation: 81,
    riverLevel: '+0.9 m',
    riverTrend: '↑ Rising',
    floodRiskScore: 70,
    riskLevel: 'HIGH',
    lastUpdated: '10:50 PM',
    hourlyTemperature: [18, 17, 16, 16, 16, 18, 19, 21, 22, 21, 23, 19],
    hourlyHumidity: [65, 68, 70, 72, 75, 77, 80, 83, 85, 87, 88, 88],
    hourlyWind: [12, 10, 8, 9, 12, 10, 11, 13, 15, 18, 20, 10],
    hourlyPressure: [1020, 1017, 1015, 1014, 1013, 1012, 1012, 1011, 1009, 1007, 1011, 1011]
  },
  {
    id: 'WS-03',
    locationEn: 'Tapovan',
    locationHi: 'तपोवन',
    areaEn: 'Tapovan',
    areaHi: 'तपोवन',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 16,
    humidity: 91,
    windSpeed: 16,
    pressure: 1008,
    weatherCondition: 'Light Rain',
    rainfall24h: '105 mm',
    soilSaturation: 74,
    riverLevel: '+0.8 m',
    riverTrend: '↑ Rising',
    floodRiskScore: 66,
    riskLevel: 'HIGH',
    lastUpdated: '10:48 PM',
    hourlyTemperature: [15, 14, 13, 13, 13, 15, 16, 18, 19, 18, 20, 16],
    hourlyHumidity: [70, 72, 75, 78, 80, 83, 86, 88, 90, 91, 91, 91],
    hourlyWind: [15, 13, 11, 12, 15, 13, 14, 17, 19, 24, 28, 16],
    hourlyPressure: [1016, 1014, 1012, 1011, 1010, 1009, 1008, 1008, 1007, 1005, 1008, 1008]
  },
  {
    id: 'WS-04',
    locationEn: 'Joshimath',
    locationHi: 'जोशीमठ',
    areaEn: 'Joshimath',
    areaHi: 'जोशीमठ',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 17,
    humidity: 82,
    windSpeed: 14,
    pressure: 1010,
    weatherCondition: 'Cloudy',
    rainfall24h: '98 mm',
    soilSaturation: 42,
    riverLevel: 'Normal',
    riverTrend: '→ Stable',
    floodRiskScore: 48,
    riskLevel: 'MEDIUM',
    lastUpdated: '10:47 PM',
    hourlyTemperature: [16, 15, 14, 14, 14, 16, 17, 19, 20, 19, 21, 17],
    hourlyHumidity: [60, 62, 64, 66, 68, 71, 74, 78, 80, 81, 82, 82],
    hourlyWind: [13, 11, 9, 10, 13, 11, 12, 14, 16, 20, 24, 14],
    hourlyPressure: [1018, 1016, 1014, 1013, 1012, 1011, 1011, 1010, 1008, 1006, 1010, 1010]
  },
  {
    id: 'WS-05',
    locationEn: 'Dewal Valley Base',
    locationHi: 'देवाल घाटी तलहटी',
    areaEn: 'Dewal',
    areaHi: 'देवाल',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 18,
    humidity: 79,
    windSpeed: 11,
    pressure: 1012,
    weatherCondition: 'Cloudy',
    rainfall24h: '92 mm',
    soilSaturation: 65,
    riverLevel: '+0.6 m',
    riverTrend: '→ Stable',
    floodRiskScore: 44,
    riskLevel: 'MEDIUM',
    lastUpdated: '10:45 PM',
    hourlyTemperature: [17, 16, 15, 15, 15, 17, 18, 20, 21, 20, 22, 18],
    hourlyHumidity: [58, 60, 62, 64, 67, 70, 73, 76, 78, 79, 79, 79],
    hourlyWind: [10, 9, 7, 8, 10, 9, 10, 12, 13, 16, 19, 11],
    hourlyPressure: [1020, 1018, 1016, 1015, 1014, 1013, 1013, 1012, 1010, 1008, 1012, 1012]
  },
  {
    id: 'WS-06',
    locationEn: 'Gopeshwar',
    locationHi: 'गोपेश्वर',
    areaEn: 'Gopeshwar',
    areaHi: 'गोपेश्वर',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 20,
    humidity: 76,
    windSpeed: 8,
    pressure: 1013,
    weatherCondition: 'Cloudy',
    rainfall24h: '65 mm',
    soilSaturation: 51,
    riverLevel: 'Normal',
    riverTrend: '→ Stable',
    floodRiskScore: 32,
    riskLevel: 'LOW',
    lastUpdated: '10:44 PM',
    hourlyTemperature: [19, 18, 17, 17, 17, 19, 20, 22, 23, 22, 24, 20],
    hourlyHumidity: [55, 57, 59, 61, 64, 67, 70, 73, 75, 76, 76, 76],
    hourlyWind: [7, 6, 5, 6, 7, 6, 7, 9, 10, 12, 14, 8],
    hourlyPressure: [1021, 1019, 1017, 1016, 1015, 1014, 1014, 1013, 1011, 1009, 1013, 1013]
  },
  {
    id: 'WS-07',
    locationEn: 'Pipalkoti',
    locationHi: 'पीपलकोटी',
    areaEn: 'Pipalkoti',
    areaHi: 'पीपलकोटी',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 21,
    humidity: 68,
    windSpeed: 9,
    pressure: 1014,
    weatherCondition: 'Clear',
    rainfall24h: '48 mm',
    soilSaturation: 48,
    riverLevel: 'Normal',
    riverTrend: '→ Stable',
    floodRiskScore: 28,
    riskLevel: 'LOW',
    lastUpdated: '10:43 PM',
    hourlyTemperature: [20, 19, 18, 18, 18, 20, 21, 23, 24, 23, 25, 21],
    hourlyHumidity: [50, 52, 54, 56, 59, 62, 65, 67, 68, 68, 68, 68],
    hourlyWind: [8, 7, 6, 7, 8, 7, 8, 10, 11, 14, 16, 9],
    hourlyPressure: [1022, 1020, 1018, 1017, 1016, 1015, 1015, 1014, 1012, 1010, 1014, 1014]
  },
  {
    id: 'WS-08',
    locationEn: 'Helang',
    locationHi: 'हेलांग',
    areaEn: 'Helang',
    areaHi: 'हेलांग',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 16,
    humidity: 89,
    windSpeed: 15,
    pressure: 1009,
    weatherCondition: 'Heavy Rain',
    rainfall24h: '115 mm',
    soilSaturation: 86,
    riverLevel: '+1.4 m',
    riverTrend: '↑ Rising',
    floodRiskScore: 75,
    riskLevel: 'HIGH',
    lastUpdated: '10:49 PM',
    hourlyTemperature: [15, 14, 13, 13, 13, 15, 16, 18, 19, 18, 20, 16],
    hourlyHumidity: [68, 70, 73, 76, 79, 82, 85, 87, 89, 89, 89, 89],
    hourlyWind: [14, 12, 10, 11, 14, 12, 13, 16, 18, 22, 26, 15],
    hourlyPressure: [1017, 1015, 1013, 1012, 1011, 1010, 1010, 1009, 1007, 1005, 1009, 1009]
  },
  {
    id: 'WS-09',
    locationEn: 'Karnaprayag',
    locationHi: 'कर्णप्रयाग',
    areaEn: 'Karnaprayag',
    areaHi: 'कर्णप्रयाग',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 22,
    humidity: 71,
    windSpeed: 10,
    pressure: 1012,
    weatherCondition: 'Cloudy',
    rainfall24h: '58 mm',
    soilSaturation: 62,
    riverLevel: '+0.5 m',
    riverTrend: '↑ Rising',
    floodRiskScore: 53,
    riskLevel: 'MEDIUM',
    lastUpdated: '10:48 PM',
    hourlyTemperature: [21, 20, 19, 19, 19, 21, 22, 24, 25, 24, 26, 22],
    hourlyHumidity: [52, 55, 58, 60, 63, 66, 68, 70, 71, 71, 71, 71],
    hourlyWind: [9, 8, 7, 8, 9, 8, 9, 11, 12, 15, 18, 10],
    hourlyPressure: [1020, 1018, 1016, 1015, 1014, 1013, 1013, 1012, 1010, 1008, 1012, 1012]
  },
  {
    id: 'WS-10',
    locationEn: 'Mana',
    locationHi: 'माणा',
    areaEn: 'Mana',
    areaHi: 'माणा',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    temperature: 11,
    humidity: 94,
    windSpeed: 24,
    pressure: 1005,
    weatherCondition: 'Heavy Rain',
    rainfall24h: '128 mm',
    soilSaturation: 91,
    riverLevel: '+1.8 m',
    riverTrend: '↑ Rapidly Rising',
    floodRiskScore: 88,
    riskLevel: 'EXTREME',
    lastUpdated: '10:53 PM',
    hourlyTemperature: [10, 9, 8, 8, 8, 10, 11, 13, 14, 13, 15, 11],
    hourlyHumidity: [75, 78, 81, 84, 87, 90, 92, 93, 94, 94, 94, 94],
    hourlyWind: [20, 18, 16, 17, 20, 18, 19, 22, 25, 30, 35, 24],
    hourlyPressure: [1013, 1011, 1009, 1008, 1007, 1006, 1006, 1005, 1003, 1001, 1005, 1005]
  }
];

const TIME_HOURS = ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'];

// ==========================================
// CARTESIAN CHARTS
// ==========================================

const TemperatureTrendChart = ({ data, isHi }) => {
  const maxVal = 35;
  const minVal = 5;
  const range = maxVal - minVal;
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - ((val - minVal) / range) * 100}`).join(' ');

  return (
    <div className="flex w-full h-[220px] mt-2 pr-2">
      <div className="w-10 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>35°C</span>
        <span>25°C</span>
        <span>15°C</span>
        <span>5°C</span>
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

        {data.map((val, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const bottomPos = ((val - minVal) / range) * 100;

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
                {TIME_HOURS[i]}
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-blue-300">{TIME_HOURS[i]}</div>
                <div>{isHi ? 'तापमान' : 'Temperature'}: <span className="font-black text-white">{val}°C</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WindSpeedBarChart = ({ data, isHi }) => {
  const maxWind = 40;

  return (
    <div className="flex w-full h-[220px] mt-2 pr-2">
      <div className="w-10 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>40</span>
        <span>25</span>
        <span>10</span>
        <span>0</span>
      </div>

      <div className="flex-1 relative border-b border-slate-200">
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-300"></div>
        </div>

        {data.map((val, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const heightPct = (val / maxWind) * 100;

          return (
            <div 
              key={i}
              className="absolute top-0 bottom-6 z-20 group flex flex-col items-center cursor-pointer"
              style={{ left: `${leftPos}%`, width: '22px', transform: 'translateX(-50%)' }}
            >
              <div 
                className="w-3/4 bg-blue-500 hover:bg-blue-600 rounded-t-xs transition-colors mt-auto"
                style={{ height: `${heightPct}%` }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-slate-300 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-slate-400 whitespace-nowrap pt-1">
                {TIME_HOURS[i]}
              </span>

              <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-blue-300">{TIME_HOURS[i]}</div>
                <div>{isHi ? 'हवा की गति' : 'Wind Speed'}: <span className="font-black text-white">{val} km/h</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HumidityTrendChart = ({ data, isHi }) => {
  const maxVal = 100;
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - val}`).join(' ');

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
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-300"></div>
        </div>

        <svg className="absolute inset-0 bottom-6 w-full h-[calc(100%-24px)] z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {data.map((val, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          return (
            <div 
              key={i} 
              className="absolute top-0 bottom-6 z-20 group cursor-pointer"
              style={{ left: `${leftPos}%`, width: '28px', transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-sky-100 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2 z-0"></div>

              <div 
                className="absolute left-1/2 w-3 h-3 bg-sky-500 border-2 border-white rounded-full shadow-sm transform -translate-x-1/2 translate-y-1/2 z-30 transition-transform group-hover:scale-150"
                style={{ bottom: `${val}%` }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-slate-300 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-slate-400 whitespace-nowrap pt-1">
                {TIME_HOURS[i]}
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-sky-300">{TIME_HOURS[i]}</div>
                <div>{isHi ? 'आर्द्रता' : 'Humidity'}: <span className="font-black text-white">{val}%</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PressureTrendChart = ({ data, isHi }) => {
  const maxVal = 1030;
  const minVal = 1000;
  const range = maxVal - minVal;
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - ((val - minVal) / range) * 100}`).join(' ');

  return (
    <div className="flex w-full h-[220px] mt-2 pr-2">
      <div className="w-12 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>1030</span>
        <span>1020</span>
        <span>1010</span>
        <span>1000</span>
      </div>

      <div className="flex-1 relative border-b border-slate-200">
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="w-full h-px bg-slate-300"></div>
        </div>

        <svg className="absolute inset-0 bottom-6 w-full h-[calc(100%-24px)] z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {data.map((val, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const bottomPos = ((val - minVal) / range) * 100;

          return (
            <div 
              key={i} 
              className="absolute top-0 bottom-6 z-20 group cursor-pointer"
              style={{ left: `${leftPos}%`, width: '28px', transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2 z-0"></div>

              <div 
                className="absolute left-1/2 w-3 h-3 bg-indigo-500 border-2 border-white rounded-full shadow-sm transform -translate-x-1/2 translate-y-1/2 z-30 transition-transform group-hover:scale-150"
                style={{ bottom: `${bottomPos}%` }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-slate-300 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-slate-400 whitespace-nowrap pt-1">
                {TIME_HOURS[i]}
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-indigo-300">{TIME_HOURS[i]}</div>
                <div>{isHi ? 'दबाव' : 'Pressure'}: <span className="font-black text-white">{val} hPa</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Weather() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;

  // State
  const [selectedStationId, setSelectedStationId] = useState('WS-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortField, setSortField] = useState('Flood Risk High → Low');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalStation, setModalStation] = useState(null);
  const [modalChartTab, setModalChartTab] = useState('Temperature');

  const activeStation = useMemo(() => {
    return WEATHER_STATIONS.find(s => s.id === selectedStationId) || WEATHER_STATIONS[0];
  }, [selectedStationId]);

  const top5Stations = useMemo(() => {
    return WEATHER_STATIONS.slice(0, 5);
  }, []);

  const filteredTableStations = useMemo(() => {
    let list = [...WEATHER_STATIONS];

    if (statusFilter !== 'All Status') {
      list = list.filter(s => getRiskLevel(s.floodRiskScore) === statusFilter.toUpperCase());
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

    if (sortField === 'Flood Risk High → Low') {
      list.sort((a, b) => b.floodRiskScore - a.floodRiskScore);
    } else if (sortField === 'Flood Risk Low → High') {
      list.sort((a, b) => a.floodRiskScore - b.floodRiskScore);
    } else if (sortField === 'Rainfall High → Low') {
      list.sort((a, b) => parseInt(b.rainfall24h) - parseInt(a.rainfall24h));
    }

    return list;
  }, [statusFilter, searchQuery, sortField]);

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
              <CloudSun className="w-6 h-6 text-blue-700" />
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
              {WEATHER_STATIONS.map(st => (
                <option key={st.id} value={st.id}>
                  {isHi ? st.locationHi : st.locationEn}, Uttarakhand
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

      {/* 2. ALERT BANNER */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-red-900 font-medium leading-relaxed">
          <strong className="font-black uppercase tracking-wider text-red-700 block mb-0.5">{t.bannerTitle}</strong>
          {t.bannerText}
        </div>
      </div>

      {/* 3. TOP WEATHER SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: TEMPERATURE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.cardTempTitle}</span>
            <Thermometer className="w-4 h-4 text-blue-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">{activeStation.temperature}°C</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.ambientReading}</span>
          </div>
          <div className="text-xs font-bold text-blue-600 flex items-center gap-1 border-t border-slate-100 pt-2">
            ↓ 2°C {t.vs6hAgo}
          </div>
        </div>

        {/* CARD 2: WIND SPEED */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.cardWindTitle}</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">{activeStation.windSpeed} km/h</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.velocity}</span>
          </div>
          <div className="text-xs font-bold text-orange-600 border-t border-slate-100 pt-2">
            ↑ 3 km/h {t.vs6hAgo}
          </div>
        </div>

        {/* CARD 3: HUMIDITY */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.cardHumidityTitle}</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">{activeStation.humidity}%</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.moistureContent}</span>
          </div>
          <div className="text-xs font-bold text-red-600 border-t border-slate-100 pt-2">
            {t.highLabel}
          </div>
        </div>

        {/* CARD 4: PRESSURE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.cardPressureTitle}</span>
            <Gauge className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-slate-900 leading-none">{activeStation.pressure} hPa</div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.barometric}</span>
          </div>
          <div className="text-xs font-bold text-blue-600 border-t border-slate-100 pt-2">
            ↓ 4 hPa {t.vs6hAgo}
          </div>
        </div>
      </div>

      {/* 4 & 5. TEMPERATURE TREND & WIND SPEED TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-blue-600" /> {t.tempChartTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {isHi ? activeStation.locationHi : activeStation.locationEn} {t.tempChartSubtitle}
              </span>
            </div>
            <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-bold text-slate-600">
              {t.last24HoursDropdown}
            </div>
          </div>
          <TemperatureTrendChart data={activeStation.hourlyTemperature} isHi={isHi} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-600" /> {t.windChartTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{t.windChartSubtitle}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{t.velocityLabel}</span>
          </div>
          <WindSpeedBarChart data={activeStation.hourlyWind} isHi={isHi} />
        </div>
      </div>

      {/* 6 & 7. HUMIDITY TREND & ATMOSPHERIC PRESSURE TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-600" /> {t.humidityChartTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{t.humidityChartSubtitle}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{t.moisturePctLabel}</span>
          </div>
          <HumidityTrendChart data={activeStation.hourlyHumidity} isHi={isHi} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-600" /> {t.pressureChartTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{t.pressureChartSubtitle}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">{t.hpaLabel}</span>
          </div>
          <PressureTrendChart data={activeStation.hourlyPressure} isHi={isHi} />
        </div>
      </div>

      {/* 8 & 9. CURRENT WEATHER BY LOCATION & CURRENT WEATHER SITUATION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" /> {t.byLocationTitle}
              </h3>
              <span className="text-xs text-slate-400 font-medium">{t.byLocationSubtitle}</span>
            </div>
            <button 
              onClick={() => {
                const el = document.getElementById('weather-station-table');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {t.viewAllBtn}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
            {top5Stations.map((st) => {
              const riskStyle = getRiskStyle(st.floodRiskScore);
              const condLabel = WEATHER_COND_TRANSLATIONS[st.weatherCondition]?.[isHi ? 'hi' : 'en'] || st.weatherCondition;

              return (
                <div
                  key={st.id}
                  onClick={() => {
                    setSelectedStationId(st.id);
                    setModalStation(st);
                  }}
                  className="bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <h4 className="font-black text-slate-900 text-xs leading-tight group-hover:text-blue-600 transition-colors truncate">
                      {isHi ? st.locationHi : st.locationEn}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 block mb-2">{condLabel}</span>

                    <div className="text-2xl font-black text-slate-900 mb-2">{st.temperature}°C</div>

                    <div className="space-y-1 text-[10px] font-medium text-slate-500 border-t border-slate-200/70 pt-2 mb-2">
                      <div className="flex justify-between"><span>{isHi ? 'आर्द्रता:' : 'Hum:'}</span> <strong className="text-slate-800">{st.humidity}%</strong></div>
                      <div className="flex justify-between"><span>{isHi ? 'हवा:' : 'Wind:'}</span> <strong className="text-slate-800">{st.windSpeed} km/h</strong></div>
                      <div className="flex justify-between"><span>{isHi ? 'वर्षा:' : 'Rain:'}</span> <strong className="text-slate-800">{st.rainfall24h}</strong></div>
                    </div>
                  </div>

                  <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase text-center ${riskStyle.bg} ${riskStyle.text}`}>
                    {t.riskPrefix} {st.floodRiskScore} ({getRiskLabel(st.floodRiskScore, isHi)})
                  </div>
                </div>
              );
            })}
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
            <ul className="space-y-1.5 text-xs font-medium text-slate-700">
              {t.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : 'bg-blue-600'}`}></div>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100 text-[10px] font-bold text-blue-800 uppercase">
            {t.layerActive}
          </div>
        </div>
      </div>

      {/* 10 & 11. WEATHER STATION READINGS TABLE */}
      <div id="weather-station-table" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
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

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="All Status">{t.filterAllStatus}</option>
              <option value="Low">{isHi ? 'निम्न' : 'Low'}</option>
              <option value="Medium">{isHi ? 'मध्यम' : 'Medium'}</option>
              <option value="High">{isHi ? 'उच्च' : 'High'}</option>
              <option value="Extreme">{isHi ? 'अत्यधिक' : 'Extreme'}</option>
            </select>

            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="Flood Risk High → Low">{t.sortRiskHighLow}</option>
              <option value="Flood Risk Low → High">{t.sortRiskLowHigh}</option>
              <option value="Rainfall High → Low">{t.sortRainHighLow}</option>
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
                <th className="py-3.5 px-4 text-right">{t.thTemp}</th>
                <th className="py-3.5 px-4 text-right">{t.thHumidity}</th>
                <th className="py-3.5 px-4 text-right">{t.thWind}</th>
                <th className="py-3.5 px-4 text-right">{t.thPressure}</th>
                <th className="py-3.5 px-4 text-right">{t.thRainfall}</th>
                <th className="py-3.5 px-4">{t.thFloodRisk}</th>
                <th className="py-3.5 px-4">{t.thLastUpdated}</th>
                <th className="py-3.5 px-4 text-center">{t.thAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {paginatedStations.map((row, idx) => {
                const globalIndex = (safePage - 1) * rowsPerPage + idx + 1;
                const riskStyle = getRiskStyle(row.floodRiskScore);

                return (
                  <tr
                    key={row.id}
                    onClick={() => setModalStation(row)}
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
                      {row.temperature}°C
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-700 text-xs">
                      {row.humidity}%
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-700 text-xs">
                      {row.windSpeed} km/h
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-600 text-xs">
                      {row.pressure} hPa
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-blue-600 text-xs">
                      {row.rainfall24h}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">
                          {row.floodRiskScore} / 100
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${riskStyle.bg} ${riskStyle.text}`}>
                          {getRiskLabel(row.floodRiskScore, isHi)}
                        </span>
                      </div>
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
            <CloudSun className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            {t.noStationsFound}
          </div>
        )}

        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500">
            {t.showing} <span className="text-slate-900 font-black">{(safePage - 1) * rowsPerPage + 1}</span>{t.to}
            <span className="text-slate-900 font-black">{Math.min(safePage * rowsPerPage, filteredTableStations.length)}</span> {t.of}{' '}
            <span className="text-slate-900 font-black">{filteredTableStations.length}</span> {t.stationsWord}
          </div>

          <div className="flex items-center gap-1.5">
            {[1].map((num) => (
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
          </div>
        </div>
      </div>

      {/* 12. LOCATION DETAIL POPUP MODAL */}
      {modalStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900">
                    {isHi ? modalStation.locationHi : modalStation.locationEn}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getRiskStyle(modalStation.floodRiskScore).badge}`}>
                    {getRiskLabel(modalStation.floodRiskScore, isHi)} {t.riskSuffix}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  {isHi ? modalStation.districtHi : modalStation.districtEn} • {isHi ? 'अंतिम अपडेट:' : 'Last Updated:'} {modalStation.lastUpdated}
                  <span className="inline-flex items-center gap-1 ml-2 text-emerald-600 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> {t.liveStation}
                  </span>
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
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalAtmosphericTitle}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.cardTempTitle}</span>
                    <span className="text-2xl font-black text-slate-900">{modalStation.temperature}°C</span>
                    <span className="text-[10px] font-bold text-blue-600 block mt-0.5">
                      {WEATHER_COND_TRANSLATIONS[modalStation.weatherCondition]?.[isHi ? 'hi' : 'en'] || modalStation.weatherCondition}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.cardHumidityTitle}</span>
                    <span className="text-2xl font-black text-slate-900">{modalStation.humidity}%</span>
                    <span className="text-[10px] font-bold text-slate-500 block mt-0.5">{t.modalHighMoisture}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.cardWindTitle}</span>
                    <span className="text-xl font-black text-slate-900">{modalStation.windSpeed} km/h</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t.cardPressureTitle}</span>
                    <span className="text-xl font-black text-slate-900">{modalStation.pressure} hPa</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.modal24hTrendTitle}</span>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
                    {['Temperature', 'Humidity', 'Wind', 'Pressure'].map((tabKey) => {
                      const tabName = tabKey === 'Temperature' ? t.tabTemperature 
                                    : tabKey === 'Humidity' ? t.tabHumidity 
                                    : tabKey === 'Wind' ? t.tabWind 
                                    : t.tabPressure;
                      return (
                        <button
                          key={tabKey}
                          onClick={() => setModalChartTab(tabKey)}
                          className={`px-2.5 py-1 rounded transition-all
                            ${modalChartTab === tabKey ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                          {tabName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {modalChartTab === 'Temperature' && <TemperatureTrendChart data={modalStation.hourlyTemperature} isHi={isHi} />}
                {modalChartTab === 'Humidity' && <HumidityTrendChart data={modalStation.hourlyHumidity} isHi={isHi} />}
                {modalChartTab === 'Wind' && <WindSpeedBarChart data={modalStation.hourlyWind} isHi={isHi} />}
                {modalChartTab === 'Pressure' && <PressureTrendChart data={modalStation.hourlyPressure} isHi={isHi} />}
              </div>

              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalFloodConditionsTitle}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">{t.soilSaturation}</span>
                    <span className="text-sm font-black text-slate-900">{modalStation.soilSaturation}%</span>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                    <span className="text-[10px] font-bold text-cyan-800 uppercase block mb-1">{t.riverLevel}</span>
                    <span className="text-sm font-black text-slate-900">{modalStation.riverLevel}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.riverTrend}</span>
                    <span className="text-sm font-black text-slate-900">
                      {RIVER_TREND_TRANSLATIONS[modalStation.riverTrend]?.[isHi ? 'hi' : 'en'] || modalStation.riverTrend}
                    </span>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="text-[10px] font-bold text-red-800 uppercase block mb-1">{t.flashFloodRisk}</span>
                    <span className="text-sm font-black text-red-600">
                      {modalStation.floodRiskScore} / 100 ({getRiskLabel(modalStation.floodRiskScore, isHi)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">{t.modalSituationTitle}</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {t.modalSituationText}
                </p>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-2">
              <button 
                onClick={() => alert(`Navigating to Rainfall Monitoring for ${isHi ? modalStation.locationHi : modalStation.locationEn}...`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-xs shadow-2xs"
              >
                <CloudRain className="w-3.5 h-3.5" /> {t.btnViewRainfall}
              </button>
              <button 
                onClick={() => alert(`Navigating to Risk Analysis for ${isHi ? modalStation.locationHi : modalStation.locationEn}...`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition-colors text-xs"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> {t.btnViewRiskAnalysis}
              </button>
              <button 
                onClick={() => alert(`Navigating to Sensor Data for ${isHi ? modalStation.locationHi : modalStation.locationEn}...`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition-colors text-xs"
              >
                <Activity className="w-3.5 h-3.5" /> {t.btnViewSensorData}
              </button>
              <button 
                onClick={() => setModalStation(null)}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors text-xs"
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