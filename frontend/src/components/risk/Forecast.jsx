import React, { useState, useMemo } from 'react';
import { 
  CloudRain, Sun, Cloud, CloudLightning, MapPin, Search, X, 
  Map, TrendingUp, Droplets, Waves, Thermometer, Wind, Activity, 
  ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, ChevronLeft, 
  ChevronRight, Compass, ShieldAlert, Calendar
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- BILINGUAL TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'Weather & Flood Forecast',
    subtitle: 'Location-wise weather and flood-risk forecasting • 980 monitored locations',
    liveTelemetry: 'Live Telemetry Sync',
    searchPlaceholder: 'Search location (e.g. Chamoli, Joshimath, Badrinath)...',
    filterAll: 'All (980)',
    filterExtreme: 'Extreme Risk',
    filterHigh: 'High Risk',
    filterMedium: 'Medium Risk',
    filterLow: 'Low Risk',
    rainChance: 'Rain Chance',
    rainfall24h: 'Rainfall (24h)',
    soilSaturation: 'Soil Saturation',
    riverLevel: 'River Level',
    riverTrend: 'River Trend',
    fiveDayOutlook: '5-Day Outlook',
    detailsArrow: 'Details →',
    showing: 'Showing',
    to: 'to',
    of: 'of',
    locations: 'locations',
    noLocationsFound: 'No monitored locations found',
    noLocationsDesc: 'Try adjusting your search query or reset the risk filter.',
    tempLabel: 'Temperature',
    subsurfaceMoisture: 'Subsurface Moisture',
    wind: 'Wind',
    humidity: 'Humidity',
    telemetryOperational: 'Telemetry: Operational',
    fiveDayBreakdown: '5-Day Weather Forecast Breakdown',
    floodSituationTitle: 'Current Flood Situation Assessment',
    lastUpdated: 'Last Updated: 19 Sep 2026, 11:13 PM',
    liveDataActive: 'Live Data Active',
    viewOnMap: 'View on Map',
    viewRiskAnalysis: 'View Risk Analysis',
    close: 'Close',
    today: 'Today',
    tomorrow: 'Tomorrow',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri'
  },
  hi: {
    pageTitle: 'मौसम एवं बाढ़ पूर्वानुमान',
    subtitle: 'स्थान-वार मौसम और बाढ़-जोखिम पूर्वानुमान • 980 निगरानी स्थान',
    liveTelemetry: 'लाइव टेलीमेट्री सिंक',
    searchPlaceholder: 'स्थान खोजें (उदा. चमोली, जोशीमठ, बद्रीनाथ)...',
    filterAll: 'सभी (980)',
    filterExtreme: 'अत्यधिक जोखिम',
    filterHigh: 'उच्च जोखिम',
    filterMedium: 'मध्यम जोखिम',
    filterLow: 'निम्न जोखिम',
    rainChance: 'बारिश की संभावना',
    rainfall24h: 'वर्षा (24 घंटे)',
    soilSaturation: 'मिट्टी की संतृप्ति',
    riverLevel: 'नदी का जलस्तर',
    riverTrend: 'जलस्तर की प्रवृत्ति',
    fiveDayOutlook: '5-दिवसीय दृष्टिकोण',
    detailsArrow: 'विवरण →',
    showing: 'प्रदर्शित',
    to: 'से',
    of: 'कुल',
    locations: 'स्थान',
    noLocationsFound: 'कोई निगरानी स्थान नहीं मिला',
    noLocationsDesc: 'कृपया खोज क्वेरी समायोजित करें या फ़िल्टर रीसेट करें।',
    tempLabel: 'तापमान',
    subsurfaceMoisture: 'उप-सतह नमी',
    wind: 'हवा की गति',
    humidity: 'आर्द्रता',
    telemetryOperational: 'टेलीमेट्री: सक्रिय',
    fiveDayBreakdown: '5-दिवसीय मौसम पूर्वानुमान विवरण',
    floodSituationTitle: 'वर्तमान बाढ़ स्थिति मूल्यांकन',
    lastUpdated: 'अंतिम अपडेट: 19 सितं 2026, 11:13 PM',
    liveDataActive: 'लाइव डेटा सक्रिय',
    viewOnMap: 'मानचित्र पर देखें',
    viewRiskAnalysis: 'जोखिम विश्लेषण देखें',
    close: 'बंद करें',
    today: 'आज',
    tomorrow: 'कल',
    wed: 'बुध',
    thu: 'गुरु',
    fri: 'शुक्र'
  }
};

// --- RISK CLASSIFICATION ENGINE ---
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

const getRiskStyles = (score) => {
  if (score >= 75) return { 
    border: 'border-red-200', 
    badge: 'bg-red-100 text-red-700 border-red-200', 
    scoreText: 'text-red-700',
    barFill: 'bg-red-500'
  };
  if (score >= 50) return { 
    border: 'border-orange-200', 
    badge: 'bg-orange-100 text-orange-700 border-orange-200', 
    scoreText: 'text-orange-700',
    barFill: 'bg-orange-500'
  };
  if (score >= 25) return { 
    border: 'border-amber-200', 
    badge: 'bg-amber-100 text-amber-700 border-amber-200', 
    scoreText: 'text-amber-700',
    barFill: 'bg-amber-500'
  };
  return { 
    border: 'border-emerald-200', 
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
    scoreText: 'text-emerald-700',
    barFill: 'bg-emerald-500'
  };
};

const getWeatherConditionLabel = (condition, isHi) => {
  if (!isHi) return condition;
  switch (condition?.toLowerCase()) {
    case 'heavy rain': return 'भारी बारिश';
    case 'moderate rain': return 'मध्यम बारिश';
    case 'light rain': return 'हल्की बारिश';
    case 'rain': return 'बारिश';
    case 'cloudy': return 'बादल छाए रहेंगे';
    case 'clear': return 'साफ मौसम';
    default: return condition;
  }
};

const getRiverTrendLabel = (trend, isHi) => {
  if (!isHi) return trend;
  if (trend.includes('Rapidly Rising')) return 'तेजी से बढ़ रहा है';
  if (trend.includes('Rising')) return 'बढ़ रहा है';
  if (trend.includes('Receding')) return 'घट रहा है';
  if (trend.includes('Stable')) return 'स्थिर';
  return trend;
};

const getWeatherIcon = (condition) => {
  switch (condition?.toLowerCase()) {
    case 'heavy rain':
    case 'cloudburst':
      return CloudLightning;
    case 'rain':
    case 'moderate rain':
    case 'light rain':
      return CloudRain;
    case 'clear':
    case 'sunny':
      return Sun;
    default:
      return Cloud;
  }
};

// --- BASE REALISTIC LOCATIONS ---
const BASE_LOCATIONS = [
  {
    nameEn: 'Chamoli (Main Town)',
    nameHi: 'चमोली (मुख्य नगर)',
    districtEn: 'Chamoli District, Central Basin',
    districtHi: 'चमोली जिला, केंद्रीय बेसिन',
    temp: 18,
    condition: 'Heavy Rain',
    rainChance: 85,
    rainfall: '112 mm / 24h',
    soilSaturation: 88,
    riverLevel: '+1.2 m',
    riverTrend: 'Rising',
    riskScore: 82,
    wind: '12 km/h',
    humidity: '92%',
    situationEn: 'Heavy rainfall continues across the valley. River level is rising rapidly and soil is heavily saturated. Low-lying riverbanks are highly vulnerable to flash surges.',
    situationHi: 'घाटी में भारी बारिश जारी है। नदी का जलस्तर तेजी से बढ़ रहा है और मिट्टी अत्यधिक संतृप्त है। निचले इलाकों में अचानक बाढ़ का खतरा बना हुआ है।',
    forecast5Day: [
      { dayKey: 'today', temp: '18°C', rain: '85%', cond: 'Heavy Rain', rainMm: '112 mm' },
      { dayKey: 'tomorrow', temp: '20°C', rain: '65%', cond: 'Rain', rainMm: '48 mm' },
      { dayKey: 'wed', temp: '22°C', rain: '35%', cond: 'Cloudy', rainMm: '12 mm' },
      { dayKey: 'thu', temp: '24°C', rain: '15%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '23°C', rain: '20%', cond: 'Cloudy', rainMm: '2 mm' },
    ]
  },
  {
    nameEn: 'Joshimath',
    nameHi: 'जोशीमठ',
    districtEn: 'Upper Alaknanda Valley',
    districtHi: 'ऊपरी अलकनंदा घाटी',
    temp: 17,
    condition: 'Moderate Rain',
    rainChance: 70,
    rainfall: '76 mm / 24h',
    soilSaturation: 81,
    riverLevel: '+0.8 m',
    riverTrend: 'Rising',
    riskScore: 67,
    wind: '18 km/h',
    humidity: '86%',
    situationEn: 'Sustained rain is destabilizing mountain slopes. Infiltration rates remain critical with heightened landslide-induced stream blockages.',
    situationHi: 'लगातार हो रही बारिश से पहाड़ी ढलानों में अस्थिरता आ रही है। भूस्खलन और जलप्रवाह अवरुद्ध होने का जोखिम बढ़ गया है।',
    forecast5Day: [
      { dayKey: 'today', temp: '17°C', rain: '70%', cond: 'Moderate Rain', rainMm: '76 mm' },
      { dayKey: 'tomorrow', temp: '18°C', rain: '55%', cond: 'Rain', rainMm: '35 mm' },
      { dayKey: 'wed', temp: '20°C', rain: '30%', cond: 'Cloudy', rainMm: '8 mm' },
      { dayKey: 'thu', temp: '21°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '20°C', rain: '25%', cond: 'Cloudy', rainMm: '5 mm' },
    ]
  },
  {
    nameEn: 'Gopeshwar',
    nameHi: 'गोपेश्वर',
    districtEn: 'Chamoli District Headquarters',
    districtHi: 'चमोली जिला मुख्यालय',
    temp: 19,
    condition: 'Light Rain',
    rainChance: 42,
    rainfall: '34 mm / 24h',
    soilSaturation: 69,
    riverLevel: '+0.3 m',
    riverTrend: 'Stable',
    riskScore: 42,
    wind: '10 km/h',
    humidity: '74%',
    situationEn: 'Moderate conditions prevailing. Drainage culverts operating within threshold capacity. Continuous radar monitoring active.',
    situationHi: 'मध्यम स्थितियां बनी हुई हैं। जल निकासी प्रणालियां क्षमता के अनुसार काम कर रही हैं। रडार से निरंतर निगरानी जारी है।',
    forecast5Day: [
      { dayKey: 'today', temp: '19°C', rain: '42%', cond: 'Light Rain', rainMm: '34 mm' },
      { dayKey: 'tomorrow', temp: '21°C', rain: '35%', cond: 'Cloudy', rainMm: '14 mm' },
      { dayKey: 'wed', temp: '23°C', rain: '20%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'thu', temp: '24°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '23°C', rain: '15%', cond: 'Clear', rainMm: '0 mm' },
    ]
  },
  {
    nameEn: 'Pipalkoti',
    nameHi: 'पीपलकोटी',
    districtEn: 'Alaknanda Gorge Route',
    districtHi: 'अलकनंदा घाटी मार्ग',
    temp: 21,
    condition: 'Cloudy',
    rainChance: 25,
    rainfall: '18 mm / 24h',
    soilSaturation: 58,
    riverLevel: 'Normal',
    riverTrend: 'Stable',
    riskScore: 28,
    wind: '8 km/h',
    humidity: '68%',
    situationEn: 'Overcast skies with mild intermittent drizzle. River channels remain at seasonal median baselines.',
    situationHi: 'हल्की बूंदाबांदी के साथ बादल छाए हुए हैं। नदी का जलस्तर सामान्य मौसमी स्तर पर बना हुआ है।',
    forecast5Day: [
      { dayKey: 'today', temp: '21°C', rain: '25%', cond: 'Cloudy', rainMm: '18 mm' },
      { dayKey: 'tomorrow', temp: '22°C', rain: '20%', cond: 'Cloudy', rainMm: '6 mm' },
      { dayKey: 'wed', temp: '24°C', rain: '15%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'thu', temp: '25°C', rain: '5%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '24°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
    ]
  },
  {
    nameEn: 'Badrinath',
    nameHi: 'बद्रीनाथ',
    districtEn: 'High Altitude Northern Sector',
    districtHi: 'उच्च हिमालयी उत्तरी क्षेत्र',
    temp: 11,
    condition: 'Heavy Rain',
    rainChance: 92,
    rainfall: '128 mm / 24h',
    soilSaturation: 91,
    riverLevel: '+1.8 m',
    riverTrend: 'Rapidly Rising',
    riskScore: 88,
    wind: '24 km/h',
    humidity: '96%',
    situationEn: 'Extreme emergency state. Massive catchment rainfall triggering torrential runoff into the Alaknanda headwaters. High flood alerts broadcast.',
    situationHi: 'अत्यंत गंभीर स्थिति। जलग्रहण क्षेत्र में भारी बारिश के कारण अलकनंदा के उद्गम स्थल में अत्यधिक पानी आ रहा है। बाढ़ की उच्च चेतावनी जारी है।',
    forecast5Day: [
      { dayKey: 'today', temp: '11°C', rain: '92%', cond: 'Heavy Rain', rainMm: '128 mm' },
      { dayKey: 'tomorrow', temp: '12°C', rain: '80%', cond: 'Heavy Rain', rainMm: '85 mm' },
      { dayKey: 'wed', temp: '14°C', rain: '45%', cond: 'Rain', rainMm: '22 mm' },
      { dayKey: 'thu', temp: '16°C', rain: '20%', cond: 'Cloudy', rainMm: '4 mm' },
      { dayKey: 'fri', temp: '15°C', rain: '30%', cond: 'Cloudy', rainMm: '6 mm' },
    ]
  },
  {
    nameEn: 'Helang',
    nameHi: 'हेलांग',
    districtEn: 'Dhauliganga-Alaknanda Sector',
    districtHi: 'धौलीगंगा-अलकनंदा संगम क्षेत्र',
    temp: 16,
    condition: 'Heavy Rain',
    rainChance: 78,
    rainfall: '98 mm / 24h',
    soilSaturation: 84,
    riverLevel: '+1.1 m',
    riverTrend: 'Rising',
    riskScore: 74,
    wind: '14 km/h',
    humidity: '89%',
    situationEn: 'High runoff volume recorded from surrounding tributary streams. Debris dams under visual and acoustic surveillance.',
    situationHi: 'आसपास की सहायक नदियों से तेज जलप्रवाह देखा जा रहा है। मलबे के बहाव पर निगरानी रखी जा रही है।',
    forecast5Day: [
      { dayKey: 'today', temp: '16°C', rain: '78%', cond: 'Heavy Rain', rainMm: '98 mm' },
      { dayKey: 'tomorrow', temp: '18°C', rain: '60%', cond: 'Rain', rainMm: '40 mm' },
      { dayKey: 'wed', temp: '21°C', rain: '25%', cond: 'Cloudy', rainMm: '5 mm' },
      { dayKey: 'thu', temp: '23°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '22°C', rain: '15%', cond: 'Clear', rainMm: '0 mm' },
    ]
  },
  {
    nameEn: 'Karnaprayag',
    nameHi: 'कर्णप्रयाग',
    districtEn: 'Pindar-Alaknanda Confluence',
    districtHi: 'पिंडर-अलकनंदा संगम',
    temp: 20,
    condition: 'Moderate Rain',
    rainChance: 62,
    rainfall: '58 mm / 24h',
    soilSaturation: 71,
    riverLevel: '+0.6 m',
    riverTrend: 'Rising',
    riskScore: 53,
    wind: '11 km/h',
    humidity: '82%',
    situationEn: 'Confluence water line elevated by +0.6m. River safety patrols deployed along Ghat road bridges.',
    situationHi: 'संगम स्थल पर जलस्तर में 0.6 मीटर की वृद्धि हुई है। पुलों और घाटों पर सुरक्षा दल तैनात हैं।',
    forecast5Day: [
      { dayKey: 'today', temp: '20°C', rain: '62%', cond: 'Moderate Rain', rainMm: '58 mm' },
      { dayKey: 'tomorrow', temp: '21°C', rain: '45%', cond: 'Light Rain', rainMm: '22 mm' },
      { dayKey: 'wed', temp: '23°C', rain: '20%', cond: 'Cloudy', rainMm: '2 mm' },
      { dayKey: 'thu', temp: '25°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '24°C', rain: '15%', cond: 'Clear', rainMm: '0 mm' },
    ]
  },
  {
    nameEn: 'Nandprayag',
    nameHi: 'नंदप्रयाग',
    districtEn: 'Nandakini Confluence Zone',
    districtHi: 'नंदाकिनी संगम क्षेत्र',
    temp: 22,
    condition: 'Light Rain',
    rainChance: 35,
    rainfall: '28 mm / 24h',
    soilSaturation: 59,
    riverLevel: '+0.2 m',
    riverTrend: 'Stable',
    riskScore: 31,
    wind: '9 km/h',
    humidity: '72%',
    situationEn: 'Hydrometric telemetry registers steady flow parameters. No surge discharge detected upstream.',
    situationHi: 'हाइड्रोमेट्रिक टेलीमेट्री सामान्य प्रवाह दर्ज कर रही है। ऊपरी हिस्से में कोई आकस्मिक बाढ़ दर्ज नहीं है।',
    forecast5Day: [
      { dayKey: 'today', temp: '22°C', rain: '35%', cond: 'Light Rain', rainMm: '28 mm' },
      { dayKey: 'tomorrow', temp: '23°C', rain: '25%', cond: 'Cloudy', rainMm: '10 mm' },
      { dayKey: 'wed', temp: '25°C', rain: '15%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'thu', temp: '26°C', rain: '5%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '25°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
    ]
  },
  {
    nameEn: 'Vishnuprayag',
    nameHi: 'विष्णुप्रयाग',
    districtEn: 'Dhauliganga Confluence',
    districtHi: 'धौलीगंगा संगम',
    temp: 15,
    condition: 'Clear',
    rainChance: 18,
    rainfall: '8 mm / 24h',
    soilSaturation: 44,
    riverLevel: 'Normal',
    riverTrend: 'Stable',
    riskScore: 20,
    wind: '13 km/h',
    humidity: '58%',
    situationEn: 'Calm atmospheric window. Barrage flow diversion mechanisms operational with baseline discharge.',
    situationHi: 'मौसम शांत है। बैराज से जल निकासी नियंत्रित एवं सामान्य स्तर पर जारी है।',
    forecast5Day: [
      { dayKey: 'today', temp: '15°C', rain: '18%', cond: 'Clear', rainMm: '8 mm' },
      { dayKey: 'tomorrow', temp: '17°C', rain: '15%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'wed', temp: '19°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'thu', temp: '20°C', rain: '5%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '19°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
    ]
  },
  {
    nameEn: 'Mana',
    nameHi: 'माणा',
    districtEn: 'Indo-Tibetan Border Sector',
    districtHi: 'भारत-तिब्बत सीमा क्षेत्र',
    temp: 9,
    condition: 'Moderate Rain',
    rainChance: 65,
    rainfall: '72 mm / 24h',
    soilSaturation: 74,
    riverLevel: '+0.7 m',
    riverTrend: 'Rising',
    riskScore: 60,
    wind: '26 km/h',
    humidity: '88%',
    situationEn: 'High gust winds combined with glacial melt and precipitation. Saraswati river velocity elevated.',
    situationHi: 'तेज हवाओं के साथ बारिश और हिमनद पिघलने से सरस्वती नदी का वेग बढ़ गया है।',
    forecast5Day: [
      { dayKey: 'today', temp: '9°C', rain: '65%', cond: 'Moderate Rain', rainMm: '72 mm' },
      { dayKey: 'tomorrow', temp: '10°C', rain: '50%', cond: 'Rain', rainMm: '30 mm' },
      { dayKey: 'wed', temp: '12°C', rain: '20%', cond: 'Cloudy', rainMm: '4 mm' },
      { dayKey: 'thu', temp: '14°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '13°C', rain: '15%', cond: 'Cloudy', rainMm: '2 mm' },
    ]
  },
  {
    nameEn: 'Govindghat',
    nameHi: 'गोविंदघाट',
    districtEn: 'Hemkund Sahib Base Route',
    districtHi: 'हेमकुंड साहिब बेस मार्ग',
    temp: 16,
    condition: 'Light Rain',
    rainChance: 48,
    rainfall: '46 mm / 24h',
    soilSaturation: 66,
    riverLevel: '+0.4 m',
    riverTrend: 'Stable',
    riskScore: 45,
    wind: '12 km/h',
    humidity: '76%',
    situationEn: 'Suspension bridge telemetry normal. Stream gauges indicate manageable runoff from Valley of Flowers basin.',
    situationHi: 'पुलों की स्थिति सुरक्षित है। फूलों की घाटी बेसिन से जलप्रवाह सामान्य सीमा में बना हुआ है।',
    forecast5Day: [
      { dayKey: 'today', temp: '16°C', rain: '48%', cond: 'Light Rain', rainMm: '46 mm' },
      { dayKey: 'tomorrow', temp: '18°C', rain: '40%', cond: 'Cloudy', rainMm: '18 mm' },
      { dayKey: 'wed', temp: '20°C', rain: '15%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'thu', temp: '22°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '21°C', rain: '15%', cond: 'Clear', rainMm: '0 mm' },
    ]
  },
  {
    nameEn: 'Auli',
    nameHi: 'औली',
    districtEn: 'Higher Elevation Ridge',
    districtHi: 'उच्च पर्वतीय रिज',
    temp: 12,
    condition: 'Clear',
    rainChance: 15,
    rainfall: '6 mm / 24h',
    soilSaturation: 38,
    riverLevel: 'N/A',
    riverTrend: 'Stable',
    riskScore: 22,
    wind: '20 km/h',
    humidity: '54%',
    situationEn: 'Ridge crest reports dry ground conditions. Zero valley flood vulnerability at this elevation band.',
    situationHi: 'रिज क्षेत्र में मिट्टी सूखी है। इस ऊंचाई पर बाढ़ का कोई खतरा नहीं है।',
    forecast5Day: [
      { dayKey: 'today', temp: '12°C', rain: '15%', cond: 'Clear', rainMm: '6 mm' },
      { dayKey: 'tomorrow', temp: '14°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'wed', temp: '16°C', rain: '5%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'thu', temp: '18°C', rain: '5%', cond: 'Clear', rainMm: '0 mm' },
      { dayKey: 'fri', temp: '17°C', rain: '10%', cond: 'Clear', rainMm: '0 mm' },
    ]
  }
];

// Complete 980 procedural locations generator
const generate980Locations = () => {
  const result = [];
  const TOTAL_LOCATIONS = 980;
  
  for (let i = 0; i < TOTAL_LOCATIONS; i++) {
    const base = BASE_LOCATIONS[i % BASE_LOCATIONS.length];
    const sectorIndex = Math.floor(i / BASE_LOCATIONS.length) + 1;
    const isBase = i < BASE_LOCATIONS.length;
    
    const scoreVariation = isBase ? 0 : ((i * 17) % 31) - 15;
    const calculatedScore = Math.max(8, Math.min(96, base.riskScore + scoreVariation));
    
    result.push({
      id: i + 1,
      nameEn: isBase ? base.nameEn : `${base.nameEn.split(' ')[0]} Sector-${sectorIndex}`,
      nameHi: isBase ? base.nameHi : `${base.nameHi.split(' ')[0]} सेक्टर-${sectorIndex}`,
      districtEn: base.districtEn,
      districtHi: base.districtHi,
      temp: isBase ? base.temp : base.temp + ((i % 5) - 2),
      condition: base.condition,
      rainChance: Math.max(10, Math.min(98, base.rainChance + (isBase ? 0 : ((i % 11) - 5)))),
      rainfall: isBase ? base.rainfall : `${Math.max(5, parseInt(base.rainfall) + ((i % 19) - 9))} mm / 24h`,
      soilSaturation: Math.max(25, Math.min(95, base.soilSaturation + (isBase ? 0 : ((i % 9) - 4)))),
      riverLevel: base.riverLevel,
      riverTrend: base.riverTrend,
      riskScore: calculatedScore,
      wind: base.wind,
      humidity: base.humidity,
      situationEn: base.situationEn,
      situationHi: base.situationHi,
      forecast5Day: base.forecast5Day
    });
  }
  return result;
};

const ALL_980_LOCATIONS = generate980Locations();
const ITEMS_PER_PAGE = 10;

export default function Forecast() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;

  // Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Search & Filter Processing
  const filteredLocations = useMemo(() => {
    return ALL_980_LOCATIONS.filter((loc) => {
      const targetName = isHi ? loc.nameHi : loc.nameEn;
      const targetDistrict = isHi ? loc.districtHi : loc.districtEn;
      const query = searchQuery.toLowerCase();

      const matchesSearch = targetName.toLowerCase().includes(query) ||
                            loc.nameEn.toLowerCase().includes(query) ||
                            targetDistrict.toLowerCase().includes(query);
      const level = getRiskLevel(loc.riskScore);
      
      let matchesFilter = true;
      if (activeFilter === 'Extreme Risk') matchesFilter = level === 'EXTREME';
      else if (activeFilter === 'High Risk') matchesFilter = level === 'HIGH';
      else if (activeFilter === 'Medium Risk') matchesFilter = level === 'MEDIUM';
      else if (activeFilter === 'Low Risk') matchesFilter = level === 'LOW';

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, isHi]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  
  const currentCards = useMemo(() => {
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredLocations.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLocations, safePage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-14 animate-fadeIn">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Compass className="w-6 h-6 text-blue-700" />
            </div>
            {t.pageTitle}
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 w-fit">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">{t.liveTelemetry}</span>
        </div>
      </div>

      {/* 2. SEARCH & RISK FILTER BAR */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Risk / Weather Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {[
            { key: 'All', label: t.filterAll },
            { key: 'Extreme Risk', label: t.filterExtreme },
            { key: 'High Risk', label: t.filterHigh },
            { key: 'Medium Risk', label: t.filterMedium },
            { key: 'Low Risk', label: t.filterLow }
          ].map(({ key, label }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveFilter(key);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border
                  ${isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. RESPONSIVE 3-COLUMN WEATHER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCards.map((loc) => {
          const styles = getRiskStyles(loc.riskScore);
          const levelLabel = getRiskLabel(loc.riskScore, isHi);
          const WeatherIcon = getWeatherIcon(loc.condition);

          return (
            <div
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={`bg-white rounded-2xl border ${styles.border} shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5 relative overflow-hidden`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${styles.barFill}`}></div>

              <div>
                {/* 1. Location Header */}
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-black text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors">
                        {isHi ? loc.nameHi : loc.nameEn}
                      </h3>
                      <span className="text-xs text-gray-400 font-medium block truncate max-w-[190px]">
                        {isHi ? loc.districtHi : loc.districtEn}
                      </span>
                    </div>
                  </div>

                  {/* Risk Badge */}
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${styles.badge}`}>
                    {levelLabel} • {loc.riskScore}
                  </div>
                </div>

                {/* 2. Current Weather Bar */}
                <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100/60 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-2xs">
                      <WeatherIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-gray-900 leading-none">
                        {loc.temp}°C
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {getWeatherConditionLabel(loc.condition, isHi)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{t.rainChance}</span>
                    <span className="text-sm font-black text-blue-600">{loc.rainChance}%</span>
                  </div>
                </div>

                {/* 3. Rainfall & 4. Flood Conditions */}
                <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-blue-500" /> {t.rainfall24h}
                    </span>
                    <span className="font-black text-gray-900 text-sm block">
                      {loc.rainfall}
                    </span>
                  </div>

                  <div className="bg-amber-50/50 border border-amber-100/70 rounded-xl p-2.5">
                    <span className="text-[10px] font-bold text-amber-700/80 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-amber-500" /> {t.soilSaturation}
                    </span>
                    <span className="font-black text-gray-900 text-sm block">
                      {loc.soilSaturation}%
                    </span>
                  </div>

                  <div className="bg-cyan-50/50 border border-cyan-100/70 rounded-xl p-2.5">
                    <span className="text-[10px] font-bold text-cyan-700/80 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <Waves className="w-3 h-3 text-cyan-600" /> {t.riverLevel}
                    </span>
                    <span className="font-black text-gray-900 text-sm block">
                      {loc.riverLevel}
                    </span>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-2.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-purple-500" /> {t.riverTrend}
                    </span>
                    <span className={`font-black text-sm flex items-center gap-1 ${
                      loc.riverTrend.includes('Rising') ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {loc.riverTrend.includes('Rising') ? <ArrowUpRight className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      {getRiverTrendLabel(loc.riverTrend, isHi)}
                    </span>
                  </div>
                </div>

                {/* 6. Compact 5-Day Forecast Strip */}
                <div className="border-t border-gray-100 pt-3">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                    <span>{t.fiveDayOutlook}</span>
                    <span className="text-blue-600 font-bold">{t.detailsArrow}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 bg-gray-50/80 p-2 rounded-xl border border-gray-100/80 text-center">
                    {loc.forecast5Day.map((f, fIdx) => {
                      const FIcon = getWeatherIcon(f.cond);
                      const dayLabel = t[f.dayKey] || f.dayKey;
                      return (
                        <div key={fIdx} className="flex flex-col items-center">
                          <span className="text-[9px] font-bold text-gray-500 uppercase">{dayLabel}</span>
                          <FIcon className="w-3.5 h-3.5 text-blue-600 my-1" />
                          <span className="text-[11px] font-black text-gray-900">{f.temp}</span>
                          <span className="text-[9px] font-semibold text-blue-500">{f.rain}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLocations.length === 0 && (
        <div className="w-full py-16 text-center text-gray-500 font-medium bg-white rounded-2xl border border-gray-200 shadow-sm">
          <Compass className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-base font-bold text-gray-700">{t.noLocationsFound}</p>
          <p className="text-xs text-gray-400 mt-1">{t.noLocationsDesc}</p>
        </div>
      )}

      {/* 4. PAGINATION ENGINE */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mt-4">
          <div className="text-xs font-bold text-gray-500">
            {t.showing} <span className="text-gray-900 font-black">{(safePage - 1) * ITEMS_PER_PAGE + 1}</span> {t.to}{' '}
            <span className="text-gray-900 font-black">{Math.min(safePage * ITEMS_PER_PAGE, filteredLocations.length)}</span> {t.of}{' '}
            <span className="text-gray-900 font-black">{filteredLocations.length}</span> {t.locations}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-black transition-all border
                    ${safePage === pageNum 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                >
                  {pageNum}
                </button>
              ))}

              {totalPages > 7 && (
                <span className="px-1 text-gray-400 font-black text-xs">...</span>
              )}

              {totalPages > 5 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`w-8 h-8 rounded-lg text-xs font-black transition-all border
                    ${safePage === totalPages 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. DYNAMIC MODAL POPUP */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg mt-0.5">
                  <MapPin className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">
                    {isHi ? selectedLocation.nameHi : selectedLocation.nameEn}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {isHi ? selectedLocation.districtHi : selectedLocation.districtEn}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${getRiskStyles(selectedLocation.riskScore).badge}`}>
                  {getRiskLabel(selectedLocation.riskScore, isHi)} • {selectedLocation.riskScore}/100
                </div>
                <button 
                  onClick={() => setSelectedLocation(null)}
                  className="p-1.5 hover:bg-gray-200/60 rounded-full text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              {/* Current Weather & Telemetry Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-blue-600" /> {t.tempLabel}
                  </span>
                  <span className="text-xl font-black text-gray-900 block">{selectedLocation.temp}°C</span>
                  <span className="text-xs font-semibold text-blue-700">{getWeatherConditionLabel(selectedLocation.condition, isHi)}</span>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" /> {t.rainChance}
                  </span>
                  <span className="text-xl font-black text-gray-900 block">{selectedLocation.rainChance}%</span>
                  <span className="text-xs font-semibold text-gray-600">{selectedLocation.rainfall}</span>
                </div>

                <div className="bg-amber-50/60 border border-amber-100 p-3.5 rounded-xl">
                  <span className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-amber-500" /> {t.soilSaturation}
                  </span>
                  <span className="text-xl font-black text-gray-900 block">{selectedLocation.soilSaturation}%</span>
                  <span className="text-xs font-semibold text-amber-700">{t.subsurfaceMoisture}</span>
                </div>

                <div className="bg-cyan-50/60 border border-cyan-100 p-3.5 rounded-xl">
                  <span className="text-[10px] font-bold text-cyan-700 uppercase flex items-center gap-1 mb-1">
                    <Waves className="w-3.5 h-3.5 text-cyan-600" /> {t.riverLevel}
                  </span>
                  <span className="text-xl font-black text-gray-900 block">{selectedLocation.riverLevel}</span>
                  <span className="text-xs font-semibold text-cyan-800">{getRiverTrendLabel(selectedLocation.riverTrend, isHi)}</span>
                </div>
              </div>

              {/* Extra Telemetry Details */}
              <div className="flex gap-4 text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-teal-600" /> {t.wind}: {selectedLocation.wind}</span>
                <span className="border-l border-gray-300"></span>
                <span className="flex items-center gap-1.5"><Droplets className="w-4 h-4 text-blue-600" /> {t.humidity}: {selectedLocation.humidity}</span>
                <span className="border-l border-gray-300"></span>
                <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-600" /> {t.telemetryOperational}</span>
              </div>

              {/* 5-Day Forecast Grid */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" /> {t.fiveDayBreakdown}
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {selectedLocation.forecast5Day.map((f, i) => {
                    const DayIcon = getWeatherIcon(f.cond);
                    const dayLabel = t[f.dayKey] || f.dayKey;
                    return (
                      <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 text-center flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-600 uppercase mb-1">{dayLabel}</span>
                        <DayIcon className="w-5 h-5 text-blue-600 my-1" />
                        <span className="text-base font-black text-gray-900">{f.temp}</span>
                        <span className="text-xs font-bold text-blue-600 mt-1">{f.rain}</span>
                        <span className="text-[10px] text-gray-400 font-medium">{f.rainMm}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Flood Situation Assessment */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-blue-700" /> {t.floodSituationTitle}
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {isHi ? selectedLocation.situationHi : selectedLocation.situationEn}
                </p>
                <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-gray-400 border-t border-blue-100 pt-2">
                  <span>{t.lastUpdated}</span>
                  <span className="text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> {t.liveDataActive}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => alert(`Centering map on ${isHi ? selectedLocation.nameHi : selectedLocation.nameEn}`)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm shadow-xs"
              >
                <Map className="w-4 h-4" /> {t.viewOnMap}
              </button>
              <button 
                onClick={() => alert(`Navigating to Risk Analysis for ${isHi ? selectedLocation.nameHi : selectedLocation.nameEn}`)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold rounded-xl transition-colors text-sm"
              >
                <TrendingUp className="w-4 h-4" /> {t.viewRiskAnalysis}
              </button>
              <button 
                onClick={() => setSelectedLocation(null)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors text-sm"
              >
                {t.close}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}