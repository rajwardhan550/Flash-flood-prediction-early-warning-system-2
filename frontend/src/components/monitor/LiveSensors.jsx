import React, { useState, useMemo } from 'react';
import { 
  Radio, CloudRain, Waves, Droplets, Thermometer, Mountain, Snowflake, 
  Search, ChevronLeft, ChevronRight, X, AlertTriangle, CheckCircle2, 
  XCircle, AlertOctagon, Battery, Wifi, Activity, Sparkles, Clock, 
  MapPin, Sliders, ArrowUpRight, ArrowDownRight, Minus, History as HistoryIcon,
  ShieldCheck, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- BILINGUAL TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'Sensor Network Topology',
    subtitle: 'Live sensor locations and activation status',
    liveNetwork: 'Live Network',
    totalActivations: 'Total Activations',
    allSensors: 'All Sensors',
    totalRegistered: 'Total registered sensors',
    active: 'Active',
    currentlyTransmitting: 'Currently transmitting',
    inactive: 'Inactive',
    noRecentTx: 'No recent transmission',
    warningCritical: 'Warning / Critical',
    requiresAttention: 'Requires attention',
    warnShort: 'Warn',
    critShort: 'Crit',
    sensorLocationsTitle: 'Sensor Locations',
    sensorLocationsSubtitle: 'List of all sensor nodes with real-time status',
    searchPlaceholder: 'Search sensor name or location...',
    filterAllTypes: 'All Types',
    filterAllStatus: 'All Status',
    thSensorName: 'Sensor Name',
    thLocation: 'Location',
    thType: 'Type',
    thStatus: 'Status',
    thLastUpdated: 'Last Updated',
    thActivations: 'Activations',
    thAction: 'Action',
    btnView: 'View',
    showing: 'Showing',
    to: '–',
    of: 'of',
    sensorsWord: 'sensors',
    noSensorsFound: 'No sensors match your search or filter criteria.',
    tabOverview: 'Overview',
    tabLiveData: 'Live Data',
    tabHistory: 'History',
    tabSystemStatus: 'System Status',
    sensorId: 'Sensor ID',
    currentStatus: 'Current Status',
    lastDataReceived: 'Last Data Received',
    signalStrength: 'Signal Strength',
    batteryLevel: 'Battery Level',
    locationDetails: 'Location Details',
    nearestLocation: 'Nearest Location:',
    districtRegion: 'District & Region:',
    internalGridPos: 'Internal Grid Position:',
    geoCoords: 'Geographic Coordinates:',
    inactiveProtocol: 'Inactive State Protocol',
    systemRecommendation: 'System Recommendation: Check sensor connectivity or power supply.',
    recentReadingsTitle: 'Recent Readings (12 Hours)',
    telemetryStream: 'Telemetry Stream',
    trendTrajectory: 'Trend Trajectory',
    extendedHistory: 'Extended Telemetry History',
    currentReading: 'Current',
    warnThresh: 'Warn Thresh',
    critThresh: 'Crit Thresh',
    maxPeak: 'Max Peak',
    minRecorded: 'Min Recorded',
    firmwareVersion: 'Firmware Version:',
    uptimeStreak: 'Uptime Streak:',
    uptimeValue: '99.4% (Past 90 Days)',
    totalLifetimeAct: 'Total Lifetime Activations:',
    pingsWord: 'pings',
    hardwareDiag: 'Hardware Diagnostic:',
    selfTestsPassed: 'All self-tests passed',
    aiInsightTitle: 'AI Insight',
    btnViewHistory: 'View Sensor History',
    btnClose: 'Close',
    hoursWord: 'Hours',
    daysWord: 'Days'
  },
  hi: {
    pageTitle: 'सेंसर नेटवर्क टोपोलॉजी',
    subtitle: 'लाइव सेंसर स्थान और सक्रियण स्थिति',
    liveNetwork: 'लाइव नेटवर्क',
    totalActivations: 'कुल सक्रियण (Activations)',
    allSensors: 'सभी सेंसर',
    totalRegistered: 'कुल पंजीकृत सेंसर',
    active: 'सक्रिय (Active)',
    currentlyTransmitting: 'वर्तमान में सिग्नल प्रेषित',
    inactive: 'निष्क्रिय (Inactive)',
    noRecentTx: 'हाल में कोई सिग्नल नहीं',
    warningCritical: 'चेतावनी / गंभीर',
    requiresAttention: 'तत्काल ध्यान अपेक्षित',
    warnShort: 'चेतावनी',
    critShort: 'गंभीर',
    sensorLocationsTitle: 'सेंसर अवस्थिति विवरण',
    sensorLocationsSubtitle: 'वास्तविक समय स्थिति के साथ सभी सेंसर नोड्स की सूची',
    searchPlaceholder: 'सेंसर नाम या स्थान खोजें...',
    filterAllTypes: 'सभी प्रकार',
    filterAllStatus: 'सभी स्थितियां',
    thSensorName: 'सेंसर का नाम',
    thLocation: 'स्थान',
    thType: 'प्रकार',
    thStatus: 'स्थिति',
    thLastUpdated: 'अंतिम अपडेट',
    thActivations: 'सक्रियण संख्या',
    thAction: 'कार्रवाई',
    btnView: 'देखें',
    showing: 'प्रदर्शित',
    to: '–',
    of: 'कुल',
    sensorsWord: 'सेंसर',
    noSensorsFound: 'आपके खोज या फ़िल्टर मानदंडों से मेल खाने वाला कोई सेंसर नहीं मिला।',
    tabOverview: 'अवलोकन (Overview)',
    tabLiveData: 'लाइव डेटा',
    tabHistory: 'इतिहास',
    tabSystemStatus: 'सिस्टम स्थिति',
    sensorId: 'सेंसर आईडी',
    currentStatus: 'वर्तमान स्थिति',
    lastDataReceived: 'अंतिम प्राप्त डेटा',
    signalStrength: 'सिग्नल क्षमता',
    batteryLevel: 'बैटरी स्तर',
    locationDetails: 'स्थान विवरण',
    nearestLocation: 'निकटतम स्थान:',
    districtRegion: 'जिला एवं क्षेत्र:',
    internalGridPos: 'आंतरिक ग्रिड स्थिति:',
    geoCoords: 'भौगोलिक निर्देशांक:',
    inactiveProtocol: 'निष्क्रिय स्थिति प्रोटोकॉल',
    systemRecommendation: 'सिस्टम अनुशंसा: सेंसर कनेक्टिविटी या बिजली आपूर्ति की जांच करें।',
    recentReadingsTitle: 'हालिया रीडिंग (12 घंटे)',
    telemetryStream: 'टेलीमेट्री प्रवाह',
    trendTrajectory: 'रुझान प्रक्षेपवक्र',
    extendedHistory: 'विस्तृत टेलीमेट्री इतिहास',
    currentReading: 'वर्तमान',
    warnThresh: 'चेतावनी सीमा',
    critThresh: 'गंभीर सीमा',
    maxPeak: 'अधिकतम शिखर',
    minRecorded: 'न्यूनतम दर्ज',
    firmwareVersion: 'फर्मवेयर संस्करण:',
    uptimeStreak: 'अपटाइम सक्रियता:',
    uptimeValue: '99.4% (विगत 90 दिन)',
    totalLifetimeAct: 'कुल जीवनकाल सक्रियण:',
    pingsWord: 'पिंग्स',
    hardwareDiag: 'हार्डवेयर डायग्नोस्टिक:',
    selfTestsPassed: 'सभी स्व-परीक्षण सफल रहे',
    aiInsightTitle: 'एआई अंतर्दृष्टि (AI Insight)',
    btnViewHistory: 'सेंसर इतिहास देखें',
    btnClose: 'बंद करें',
    hoursWord: 'घंटे',
    daysWord: 'दिन'
  }
};

const TYPE_TRANSLATIONS = {
  Rainfall: { en: 'Rainfall', hi: 'वर्षा सेंसर' },
  'River Level': { en: 'River Level', hi: 'नदी जलस्तर' },
  'Soil Moisture': { en: 'Soil Moisture', hi: 'मिट्टी की नमी' },
  Weather: { en: 'Weather', hi: 'मौसम स्टेशन' },
  'Slope Sensor': { en: 'Slope Sensor', hi: 'ढलान सेंसर' },
  'Snow/Glacier': { en: 'Snow/Glacier', hi: 'बर्फ / हिमनद' }
};

const STATUS_TRANSLATIONS = {
  ACTIVE: { en: 'ACTIVE', hi: 'सक्रिय' },
  WARNING: { en: 'WARNING', hi: 'चेतावनी' },
  CRITICAL: { en: 'CRITICAL', hi: 'गंभीर' },
  INACTIVE: { en: 'INACTIVE', hi: 'निष्क्रिय' }
};

// --- SENSOR TYPE ICONS & METRIC HELPERS ---
const TYPE_CONFIG = {
  Rainfall: { icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50', unit: 'mm' },
  'River Level': { icon: Waves, color: 'text-cyan-600', bg: 'bg-cyan-50', unit: 'm' },
  'Soil Moisture': { icon: Droplets, color: 'text-amber-600', bg: 'bg-amber-50', unit: '%' },
  Weather: { icon: Thermometer, color: 'text-indigo-600', bg: 'bg-indigo-50', unit: '°C' },
  'Slope Sensor': { icon: Mountain, color: 'text-emerald-600', bg: 'bg-emerald-50', unit: 'mm/h' },
  'Snow/Glacier': { icon: Snowflake, color: 'text-sky-600', bg: 'bg-sky-50', unit: 'cm' }
};

const getStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
    case 'WARNING':
      return { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
    case 'CRITICAL':
      return { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
    case 'INACTIVE':
    default:
      return { badge: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' };
  }
};

// --- BASE 10 REALISTIC DATA OBJECTS ---
const BASE_SENSORS = [
  {
    id: 'RG-075',
    nameEn: 'Raini Gamma',
    nameHi: 'रैणी गामा',
    locationEn: 'Chamoli Main Town',
    locationHi: 'चमोली मुख्य नगर',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    type: 'Rainfall',
    status: 'WARNING',
    lastUpdated: '10:52 PM',
    activationCount: 3410,
    coord: 'X: 75, Y: 60',
    latitude: '30.4187° N',
    longitude: '79.3195° E',
    battery: 78,
    signalStrength: 92,
    connection: 'Online',
    warningThreshold: 65,
    criticalThreshold: 120,
    liveTelemetry: {
      primaryLabelEn: 'Rainfall (24h)',
      primaryLabelHi: 'वर्षा (24 घंटे)',
      primaryValue: '112 mm',
      secondaryLabelEn: 'Rainfall Intensity',
      secondaryLabelHi: 'वर्षा तीव्रता',
      secondaryValueEn: 'Heavy',
      secondaryValueHi: 'भारी',
      tertiaryLabelEn: 'Rain Chance',
      tertiaryLabelHi: 'वर्षा संभावना',
      tertiaryValue: '85%',
      trendEn: '↑ Increasing',
      trendHi: '↑ बढ़ रही है'
    },
    readings: [
      { time: '12 PM', val: 22 },
      { time: '2 PM', val: 45 },
      { time: '4 PM', val: 68 },
      { time: '6 PM', val: 104 },
      { time: '8 PM', val: 118 },
      { time: '10 PM', val: 165 }
    ]
  },
  {
    id: 'DE-014',
    nameEn: 'Dhauliganga Echo',
    nameHi: 'धौलीगंगा इको',
    locationEn: 'Dhauliganga Valley',
    locationHi: 'धौलीगंगा घाटी',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    type: 'River Level',
    status: 'CRITICAL',
    lastUpdated: '10:48 PM',
    activationCount: 2104,
    coord: 'X: 85, Y: 25',
    latitude: '30.5482° N',
    longitude: '79.5621° E',
    battery: 64,
    signalStrength: 76,
    connection: 'Online',
    warningThreshold: 4.5,
    criticalThreshold: 6.0,
    liveTelemetry: {
      primaryLabelEn: 'River Level',
      primaryLabelHi: 'नदी जलस्तर',
      primaryValue: '+1.2 m',
      secondaryLabelEn: 'Flow Condition',
      secondaryLabelHi: 'प्रवाह स्थिति',
      secondaryValueEn: 'Elevated',
      secondaryValueHi: 'उफान पर',
      tertiaryLabelEn: 'Velocity',
      tertiaryLabelHi: 'प्रवाह वेग',
      tertiaryValue: '3.4 m/s',
      trendEn: '↑ Rising',
      trendHi: '↑ बढ़ रहा है'
    },
    readings: [
      { time: '12 PM', val: 2.8 },
      { time: '2 PM', val: 3.4 },
      { time: '4 PM', val: 4.2 },
      { time: '6 PM', val: 5.1 },
      { time: '8 PM', val: 5.9 },
      { time: '10 PM', val: 6.8 }
    ]
  },
  {
    id: 'JA-001',
    nameEn: 'Joshimath Alpha',
    nameHi: 'जोशीमठ अल्फा',
    locationEn: 'Joshimath',
    locationHi: 'जोशीमठ',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    type: 'Weather',
    status: 'ACTIVE',
    lastUpdated: '10:51 PM',
    activationCount: 1245,
    coord: 'X: 15, Y: 75',
    latitude: '30.5564° N',
    longitude: '79.5662° E',
    battery: 94,
    signalStrength: 98,
    connection: 'Online',
    warningThreshold: 32,
    criticalThreshold: 40,
    liveTelemetry: {
      primaryLabelEn: 'Temperature',
      primaryLabelHi: 'तापमान',
      primaryValue: '18°C',
      secondaryLabelEn: 'Humidity',
      secondaryLabelHi: 'आर्द्रता',
      secondaryValueEn: '91%',
      secondaryValueHi: '91%',
      tertiaryLabelEn: 'Wind Speed',
      tertiaryLabelHi: 'हवा की गति',
      tertiaryValue: '12 km/h',
      trendEn: '→ Steady',
      trendHi: '→ स्थिर'
    },
    readings: [
      { time: '12 PM', val: 19 },
      { time: '2 PM', val: 21 },
      { time: '4 PM', val: 20 },
      { time: '6 PM', val: 19 },
      { time: '8 PM', val: 18 },
      { time: '10 PM', val: 18 }
    ]
  },
  {
    id: 'CD-099',
    nameEn: 'Chamoli Delta',
    nameHi: 'चमोली डेल्टा',
    locationEn: 'Chamoli',
    locationHi: 'चमोली',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    type: 'Soil Moisture',
    status: 'INACTIVE',
    lastUpdated: '2h 14m ago',
    activationCount: 312,
    coord: 'X: 30, Y: 35',
    latitude: '30.4042° N',
    longitude: '79.3245° E',
    battery: 12,
    signalStrength: 0,
    connection: 'Offline',
    offlineDuration: '2h 14m',
    lastKnownReading: '76% Saturation',
    warningThreshold: 75,
    criticalThreshold: 90,
    liveTelemetry: {
      primaryLabelEn: 'Soil Moisture',
      primaryLabelHi: 'मिट्टी की नमी',
      primaryValue: '88%',
      secondaryLabelEn: 'Saturation',
      secondaryLabelHi: 'संतृप्ति',
      secondaryValueEn: 'High',
      secondaryValueHi: 'उच्च',
      tertiaryLabelEn: 'Pore Pressure',
      tertiaryLabelHi: 'छिद्र दबाव',
      tertiaryValue: 'Elevated',
      trendEn: '↑ Increasing',
      trendHi: '↑ बढ़ रही है'
    },
    readings: [
      { time: '12 PM', val: 68 },
      { time: '2 PM', val: 72 },
      { time: '4 PM', val: 76 },
      { time: '6 PM', val: 81 },
      { time: '8 PM', val: 88 },
      { time: '10 PM', val: 88 }
    ]
  },
  {
    id: 'PB-042',
    nameEn: 'Pipalkoti Beta',
    nameHi: 'पीपलकोटी बीटा',
    locationEn: 'Pipalkoti',
    locationHi: 'पीपलकोटी',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    type: 'River Level',
    status: 'ACTIVE',
    lastUpdated: '10:50 PM',
    activationCount: 980,
    coord: 'X: 45, Y: 55',
    latitude: '30.4285° N',
    longitude: '79.4321° E',
    battery: 88,
    signalStrength: 91,
    connection: 'Online',
    warningThreshold: 4.0,
    criticalThreshold: 5.5,
    liveTelemetry: {
      primaryLabelEn: 'River Level',
      primaryLabelHi: 'नदी जलस्तर',
      primaryValue: '+0.4 m',
      secondaryLabelEn: 'Flow Condition',
      secondaryLabelHi: 'प्रवाह स्थिति',
      secondaryValueEn: 'Stable Baseline',
      secondaryValueHi: 'स्थिर आधारभूत',
      tertiaryLabelEn: 'Velocity',
      tertiaryLabelHi: 'प्रवाह वेग',
      tertiaryValue: '1.8 m/s',
      trendEn: '→ Stable',
      trendHi: '→ स्थिर'
    },
    readings: [
      { time: '12 PM', val: 2.1 },
      { time: '2 PM', val: 2.2 },
      { time: '4 PM', val: 2.3 },
      { time: '6 PM', val: 2.3 },
      { time: '8 PM', val: 2.4 },
      { time: '10 PM', val: 2.5 }
    ]
  },
  {
    id: 'KN-012',
    nameEn: 'Kedarnath Node',
    nameHi: 'केदारनाथ नोड',
    locationEn: 'Kedarnath',
    locationHi: 'केदारनाथ',
    districtEn: 'Rudraprayag / Chamoli Border',
    districtHi: 'रुद्रप्रयाग / चमोली सीमा',
    type: 'Rainfall',
    status: 'WARNING',
    lastUpdated: '10:49 PM',
    activationCount: 764,
    coord: 'X: 18, Y: 88',
    latitude: '30.7346° N',
    longitude: '79.0669° E',
    battery: 81,
    signalStrength: 84,
    connection: 'Online',
    warningThreshold: 60,
    criticalThreshold: 110,
    liveTelemetry: {
      primaryLabelEn: 'Rainfall (24h)',
      primaryLabelHi: 'वर्षा (24 घंटे)',
      primaryValue: '78 mm',
      secondaryLabelEn: 'Rainfall Intensity',
      secondaryLabelHi: 'वर्षा तीव्रता',
      secondaryValueEn: 'Moderate',
      secondaryValueHi: 'मध्यम',
      tertiaryLabelEn: 'Rain Chance',
      tertiaryLabelHi: 'वर्षा संभावना',
      tertiaryValue: '75%',
      trendEn: '↑ Increasing',
      trendHi: '↑ बढ़ रही है'
    },
    readings: [
      { time: '12 PM', val: 14 },
      { time: '2 PM', val: 28 },
      { time: '4 PM', val: 42 },
      { time: '6 PM', val: 56 },
      { time: '8 PM', val: 68 },
      { time: '10 PM', val: 78 }
    ]
  },
  {
    id: 'HR-063',
    nameEn: 'Helang Ridge',
    nameHi: 'हेलांग रिज',
    locationEn: 'Helang',
    locationHi: 'हेलांग',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    type: 'Slope Sensor',
    status: 'ACTIVE',
    lastUpdated: '10:47 PM',
    activationCount: 689,
    coord: 'X: 52, Y: 64',
    latitude: '30.5281° N',
    longitude: '79.5082° E',
    battery: 92,
    signalStrength: 89,
    connection: 'Online',
    warningThreshold: 8.0,
    criticalThreshold: 15.0,
    liveTelemetry: {
      primaryLabelEn: 'Slope Movement',
      primaryLabelHi: 'ढलान हलचल',
      primaryValue: 'Elevated (3.2 mm/h)',
      secondaryLabelEn: 'Ground Stability',
      secondaryLabelHi: 'भूमि स्थिरता',
      secondaryValueEn: 'Warning Margin',
      secondaryValueHi: 'चेतावनी सीमा पर',
      tertiaryLabelEn: 'Tilt Angle',
      tertiaryLabelHi: 'झुकाव कोण',
      tertiaryValue: '0.8° Deflection',
      trendEn: '↑ Increasing',
      trendHi: '↑ बढ़ रहा है'
    },
    readings: [
      { time: '12 PM', val: 0.5 },
      { time: '2 PM', val: 1.1 },
      { time: '4 PM', val: 1.8 },
      { time: '6 PM', val: 2.2 },
      { time: '8 PM', val: 2.9 },
      { time: '10 PM', val: 3.2 }
    ]
  },
  {
    id: 'MG-008',
    nameEn: 'Mana Glacier',
    nameHi: 'माणा ग्लेशियर',
    locationEn: 'Mana',
    locationHi: 'माणा',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    type: 'Snow/Glacier',
    status: 'CRITICAL',
    lastUpdated: '10:46 PM',
    activationCount: 512,
    coord: 'X: 88, Y: 92',
    latitude: '30.7744° N',
    longitude: '79.4938° E',
    battery: 58,
    signalStrength: 72,
    connection: 'Online',
    warningThreshold: 50,
    criticalThreshold: 85,
    liveTelemetry: {
      primaryLabelEn: 'Snow Condition',
      primaryLabelHi: 'बर्फ स्थिति',
      primaryValue: 'Monitoring Active',
      secondaryLabelEn: 'Glacier/Snow Change',
      secondaryLabelHi: 'ग्लेशियर/बर्फ बदलाव',
      secondaryValueEn: 'Elevated Runoff',
      secondaryValueHi: 'अत्यधिक अपवाह',
      tertiaryLabelEn: 'Melt Surge',
      tertiaryLabelHi: 'पिघलन उफान',
      tertiaryValue: '42 cm/24h',
      trendEn: '↑ Rapid Surge',
      trendHi: '↑ तीव्र उफान'
    },
    readings: [
      { time: '12 PM', val: 12 },
      { time: '2 PM', val: 24 },
      { time: '4 PM', val: 45 },
      { time: '6 PM', val: 68 },
      { time: '8 PM', val: 82 },
      { time: '10 PM', val: 94 }
    ]
  },
  {
    id: 'GW-055',
    nameEn: 'Gopeshwar West',
    nameHi: 'गोपेश्वर पश्चिम',
    locationEn: 'Gopeshwar',
    locationHi: 'गोपेश्वर',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    type: 'Rainfall',
    status: 'ACTIVE',
    lastUpdated: '10:51 PM',
    activationCount: 438,
    coord: 'X: 25, Y: 42',
    latitude: '30.4089° N',
    longitude: '79.3325° E',
    battery: 96,
    signalStrength: 95,
    connection: 'Online',
    warningThreshold: 60,
    criticalThreshold: 110,
    liveTelemetry: {
      primaryLabelEn: 'Rainfall (24h)',
      primaryLabelHi: 'वर्षा (24 घंटे)',
      primaryValue: '34 mm',
      secondaryLabelEn: 'Rainfall Intensity',
      secondaryLabelHi: 'वर्षा तीव्रता',
      secondaryValueEn: 'Light Rain',
      secondaryValueHi: 'हल्की बारिश',
      tertiaryLabelEn: 'Rain Chance',
      tertiaryLabelHi: 'वर्षा संभावना',
      tertiaryValue: '42%',
      trendEn: '→ Stable',
      trendHi: '→ स्थिर'
    },
    readings: [
      { time: '12 PM', val: 8 },
      { time: '2 PM', val: 14 },
      { time: '4 PM', val: 20 },
      { time: '6 PM', val: 26 },
      { time: '8 PM', val: 31 },
      { time: '10 PM', val: 34 }
    ]
  },
  {
    id: 'KN-088',
    nameEn: 'Karnaprayag Node',
    nameHi: 'कर्णप्रयाग नोड',
    locationEn: 'Karnaprayag',
    locationHi: 'कर्णप्रयाग',
    districtEn: 'Chamoli, Uttarakhand',
    districtHi: 'चमोली, उत्तराखंड',
    type: 'River Level',
    status: 'INACTIVE',
    lastUpdated: '3h 22m ago',
    activationCount: 295,
    coord: 'X: 38, Y: 18',
    latitude: '30.2584° N',
    longitude: '79.2185° E',
    battery: 8,
    signalStrength: 0,
    connection: 'Offline',
    offlineDuration: '3h 22m',
    lastKnownReading: '+0.5 m Flow',
    warningThreshold: 4.5,
    criticalThreshold: 6.2,
    liveTelemetry: {
      primaryLabelEn: 'River Level',
      primaryLabelHi: 'नदी जलस्तर',
      primaryValue: '+0.5 m',
      secondaryLabelEn: 'Flow Condition',
      secondaryLabelHi: 'प्रवाह स्थिति',
      secondaryValueEn: 'Last Known Normal',
      secondaryValueHi: 'अंतिम ज्ञात सामान्य',
      tertiaryLabelEn: 'Velocity',
      tertiaryLabelHi: 'प्रवाह वेग',
      tertiaryValue: 'Unreachable',
      trendEn: '— Stale',
      trendHi: '— संपर्क टूटा'
    },
    readings: [
      { time: '12 PM', val: 1.8 },
      { time: '2 PM', val: 2.1 },
      { time: '4 PM', val: 2.3 },
      { time: '6 PM', val: 2.4 },
      { time: '8 PM', val: 2.4 },
      { time: '10 PM', val: 2.4 }
    ]
  }
];

// Complete 980 procedural nodes generator
const generate980Sensors = () => {
  const result = [];
  const TOTAL = 980;
  
  for (let i = 0; i < TOTAL; i++) {
    const base = BASE_SENSORS[i % BASE_SENSORS.length];
    const isBase = i < BASE_SENSORS.length;
    const sector = Math.floor(i / BASE_SENSORS.length) + 1;

    let status = 'ACTIVE';
    if (i % 7 === 0 && result.filter(s => s.status === 'INACTIVE').length < 138) {
      status = 'INACTIVE';
    } else if (i % 17 === 0 && result.filter(s => s.status === 'CRITICAL').length < 14) {
      status = 'CRITICAL';
    } else if (i % 11 === 0 && result.filter(s => s.status === 'WARNING').length < 42) {
      status = 'WARNING';
    } else if (result.filter(s => s.status === 'INACTIVE').length < 138 && i >= TOTAL - 138) {
      status = 'INACTIVE';
    }

    result.push({
      id: isBase ? base.id : `${base.id.split('-')[0]}-${String(i + 1).padStart(3, '0')}`,
      nameEn: isBase ? base.nameEn : `${base.nameEn.split(' ')[0]} Node-${sector}`,
      nameHi: isBase ? base.nameHi : `${base.nameHi.split(' ')[0]} नोड-${sector}`,
      locationEn: isBase ? base.locationEn : `${base.locationEn} Sector ${sector}`,
      locationHi: isBase ? base.locationHi : `${base.locationHi} सेक्टर ${sector}`,
      districtEn: base.districtEn,
      districtHi: base.districtHi,
      type: base.type,
      status: isBase ? base.status : status,
      lastUpdated: status === 'INACTIVE' ? (base.offlineDuration || '2h 14m ago') : base.lastUpdated,
      activationCount: isBase ? base.activationCount : Math.max(120, (base.activationCount + (i * 7)) % 4200),
      coord: isBase ? base.coord : `X: ${(i * 13) % 90 + 5}, Y: ${(i * 17) % 90 + 5}`,
      latitude: base.latitude,
      longitude: base.longitude,
      battery: status === 'INACTIVE' ? Math.max(5, (i % 15)) : Math.max(45, (base.battery - (i % 30))),
      signalStrength: status === 'INACTIVE' ? 0 : Math.max(60, (base.signalStrength - (i % 25))),
      connection: status === 'INACTIVE' ? 'Offline' : 'Online',
      offlineDuration: base.offlineDuration || '2h 14m',
      lastKnownReading: base.lastKnownReading || 'Standard Baseline',
      warningThreshold: base.warningThreshold,
      criticalThreshold: base.criticalThreshold,
      liveTelemetry: base.liveTelemetry,
      readings: base.readings
    });
  }
  return result;
};

const ALL_980_SENSORS = generate980Sensors();
const ITEMS_PER_PAGE = 10;

// ==========================================
// CARTESIAN READINGS CHART COMPONENT
// ==========================================
const SensorReadingsChart = ({ readings, unit, warningThresh, criticalThresh, isHi }) => {
  const maxVal = Math.max(...readings.map(r => r.val), (criticalThresh || 100)) * 1.15;
  const minVal = Math.min(...readings.map(r => r.val)) * 0.8;
  const range = maxVal - minVal || 1;

  const points = readings.map((r, i) => {
    const x = (i / (readings.length - 1)) * 100;
    const y = 100 - ((r.val - minVal) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex w-full h-[200px] mt-2 pr-2">
      <div className="w-12 relative border-r border-slate-200 z-10 flex flex-col justify-between items-end pr-2 pb-6 text-[10px] font-bold text-slate-400">
        <span>{maxVal.toFixed(1)}</span>
        <span>{((maxVal + minVal) / 2).toFixed(1)}</span>
        <span>{minVal.toFixed(1)}</span>
      </div>

      <div className="flex-1 relative border-b border-slate-200">
        {warningThresh && warningThresh <= maxVal && (
          <div 
            className="absolute left-0 right-0 border-t border-dashed border-amber-400 z-0 flex justify-end pr-2 pointer-events-none"
            style={{ bottom: `${((warningThresh - minVal) / range) * 100}%` }}
          >
            <span className="text-[9px] font-black text-amber-500 uppercase bg-white px-1 -translate-y-1/2">
              {isHi ? 'चेतावनी:' : 'Warn:'} {warningThresh}
            </span>
          </div>
        )}
        {criticalThresh && criticalThresh <= maxVal && (
          <div 
            className="absolute left-0 right-0 border-t border-dashed border-red-400 z-0 flex justify-end pr-2 pointer-events-none"
            style={{ bottom: `${((criticalThresh - minVal) / range) * 100}%` }}
          >
            <span className="text-[9px] font-black text-red-500 uppercase bg-white px-1 -translate-y-1/2">
              {isHi ? 'गंभीर:' : 'Crit:'} {criticalThresh}
            </span>
          </div>
        )}

        <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {readings.map((r, i) => {
          const leftPos = (i / (readings.length - 1)) * 100;
          const bottomPos = ((r.val - minVal) / range) * 100;
          return (
            <div 
              key={i} 
              className="absolute top-0 bottom-0 z-20 group cursor-pointer"
              style={{ left: `${leftPos}%`, width: '30px', transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1/2 z-0"></div>

              <div 
                className="absolute left-1/2 w-3 h-3 bg-blue-600 border-2 border-white rounded-full shadow-sm transform -translate-x-1/2 translate-y-1/2 z-30 transition-transform group-hover:scale-150"
                style={{ bottom: `${bottomPos}%` }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-slate-300 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-slate-400 whitespace-nowrap pt-1">
                {r.time}
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] rounded-lg p-2 shadow-xl pointer-events-none whitespace-nowrap z-50">
                <div className="font-bold text-blue-300">{r.time}</div>
                <div>{isHi ? 'रीडिंग:' : 'Reading:'} <span className="font-black text-white">{r.val} {unit}</span></div>
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
export default function LiveSensors() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;

  // Filters & State
  const [activeQuickFilter, setActiveQuickFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [detailTab, setDetailTab] = useState('Overview');
  const [historyTimeRange, setHistoryTimeRange] = useState('24 Hours');

  // Multi-Criteria Filtering
  const filteredSensors = useMemo(() => {
    return ALL_980_SENSORS.filter((s) => {
      let matchesQuick = true;
      if (activeQuickFilter === 'ACTIVE') matchesQuick = s.status === 'ACTIVE';
      else if (activeQuickFilter === 'INACTIVE') matchesQuick = s.status === 'INACTIVE';
      else if (activeQuickFilter === 'ATTENTION') matchesQuick = s.status === 'WARNING' || s.status === 'CRITICAL';

      const matchesType = selectedType === 'All Types' || s.type === selectedType;
      const matchesStatus = selectedStatus === 'All Status' || s.status.toUpperCase() === selectedStatus.toUpperCase();

      const query = searchQuery.toLowerCase();
      const matchesSearch = s.nameEn.toLowerCase().includes(query) ||
                            s.nameHi.toLowerCase().includes(query) ||
                            s.locationEn.toLowerCase().includes(query) ||
                            s.locationHi.toLowerCase().includes(query) ||
                            s.type.toLowerCase().includes(query);

      return matchesQuick && matchesType && matchesStatus && matchesSearch;
    });
  }, [activeQuickFilter, selectedType, selectedStatus, searchQuery]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredSensors.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedSensors = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredSensors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSensors, safePage]);

  // AI Insight Generator
  const getAiInsight = (sensor) => {
    if (!sensor) return '';
    if (sensor.status === 'CRITICAL') {
      return isHi 
        ? 'वर्तमान रीडिंग महत्वपूर्ण सीमा (Critical threshold) को पार कर गई है। तत्काल कार्रवाई आवश्यक है।'
        : 'Current readings have exceeded the critical threshold. Immediate attention is required.';
    }
    if (sensor.status === 'WARNING') {
      return isHi
        ? 'विगत 3 घंटों में रीडिंग में लगातार वृद्धि हुई है। वर्तमान मान चेतावनी सीमा से ऊपर दर्ज किए गए हैं।'
        : 'Heavy readings have increased during the last 3 hours. Current values are above the warning threshold.';
    }
    if (sensor.status === 'INACTIVE') {
      return isHi
        ? `${sensor.offlineDuration || '2 घंटे 14 मिनट'} से कोई डेटा प्राप्त नहीं हुआ है। सेंसर कनेक्टिविटी अथवा बिजली आपूर्ति की जांच की जानी चाहिए।`
        : `No data has been received for ${sensor.offlineDuration || '2h 14m'}. Sensor connectivity or power should be checked.`;
    }
    return isHi
      ? 'सेंसर अपेक्षित मानकों के अनुरूप सामान्य रूप से कार्य कर रहा है। सभी टेलीमेट्री डेटा निर्बाध रूप से प्राप्त हो रहे हैं।'
      : 'Sensor operating within expected parameters. Baseline telemetry reports uninterrupted transmission sync.';
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-14 animate-fadeIn">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Radio className="w-6 h-6 text-blue-700" />
            </div>
            {t.pageTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {t.liveNetwork}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.totalActivations}</span>
            <span className="text-xl font-black text-slate-900 leading-none mt-0.5">8,340</span>
          </div>
        </div>
      </div>

      {/* 2. SENSOR SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ALL SENSORS */}
        <button 
          onClick={() => { setActiveQuickFilter('ALL'); setCurrentPage(1); }}
          className={`text-left p-5 rounded-xl border transition-all relative overflow-hidden bg-white shadow-xs hover:shadow-md
            ${activeQuickFilter === 'ALL' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t.allSensors}</span>
            <Radio className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 leading-none">980</div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.totalRegistered}</span>
        </button>

        {/* ACTIVE */}
        <button 
          onClick={() => { setActiveQuickFilter('ACTIVE'); setCurrentPage(1); }}
          className={`text-left p-5 rounded-xl border transition-all relative overflow-hidden bg-white shadow-xs hover:shadow-md
            ${activeQuickFilter === 'ACTIVE' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t.active}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 leading-none">842</span>
            <span className="text-xs font-black text-emerald-600">86%</span>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.currentlyTransmitting}</span>
        </button>

        {/* INACTIVE */}
        <button 
          onClick={() => { setActiveQuickFilter('INACTIVE'); setCurrentPage(1); }}
          className={`text-left p-5 rounded-xl border transition-all relative overflow-hidden bg-white shadow-xs hover:shadow-md
            ${activeQuickFilter === 'INACTIVE' ? 'border-slate-500 ring-2 ring-slate-500/20' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.inactive}</span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 leading-none">138</span>
            <span className="text-xs font-black text-slate-500">14%</span>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.noRecentTx}</span>
        </button>

        {/* WARNING / CRITICAL */}
        <button 
          onClick={() => { setActiveQuickFilter('ATTENTION'); setCurrentPage(1); }}
          className={`text-left p-5 rounded-xl border transition-all relative overflow-hidden bg-white shadow-xs hover:shadow-md
            ${activeQuickFilter === 'ATTENTION' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{t.warningCritical}</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 leading-none">56</span>
            <span className="text-xs font-black text-red-600">6%</span>
          </div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.requiresAttention}</span>

          {activeQuickFilter === 'ATTENTION' && (
            <div className="flex gap-2 text-[9px] font-bold text-slate-400 mt-2 border-t border-slate-100 pt-1.5 uppercase">
              <span>{t.warnShort}: 42</span> • <span>{t.critShort}: 14</span>
            </div>
          )}
        </button>
      </div>

      {/* 3. SENSOR LOCATIONS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">{t.sensorLocationsTitle}</h3>
            <p className="text-xs text-slate-500 font-medium">{t.sensorLocationsSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            {/* Type Filter */}
            <select 
              value={selectedType} 
              onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="All Types">{t.filterAllTypes}</option>
              <option value="Rainfall">{TYPE_TRANSLATIONS.Rainfall[isHi ? 'hi' : 'en']}</option>
              <option value="River Level">{TYPE_TRANSLATIONS['River Level'][isHi ? 'hi' : 'en']}</option>
              <option value="Soil Moisture">{TYPE_TRANSLATIONS['Soil Moisture'][isHi ? 'hi' : 'en']}</option>
              <option value="Weather">{TYPE_TRANSLATIONS.Weather[isHi ? 'hi' : 'en']}</option>
              <option value="Slope Sensor">{TYPE_TRANSLATIONS['Slope Sensor'][isHi ? 'hi' : 'en']}</option>
              <option value="Snow/Glacier">{TYPE_TRANSLATIONS['Snow/Glacier'][isHi ? 'hi' : 'en']}</option>
            </select>

            {/* Status Filter */}
            <select 
              value={selectedStatus} 
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="All Status">{t.filterAllStatus}</option>
              <option value="Active">{STATUS_TRANSLATIONS.ACTIVE[isHi ? 'hi' : 'en']}</option>
              <option value="Warning">{STATUS_TRANSLATIONS.WARNING[isHi ? 'hi' : 'en']}</option>
              <option value="Critical">{STATUS_TRANSLATIONS.CRITICAL[isHi ? 'hi' : 'en']}</option>
              <option value="Inactive">{STATUS_TRANSLATIONS.INACTIVE[isHi ? 'hi' : 'en']}</option>
            </select>
          </div>
        </div>

        {/* 4. SENSOR TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">{t.thSensorName}</th>
                <th className="py-3.5 px-4">{t.thLocation}</th>
                <th className="py-3.5 px-4">{t.thType}</th>
                <th className="py-3.5 px-4">{t.thStatus}</th>
                <th className="py-3.5 px-4">{t.thLastUpdated}</th>
                <th className="py-3.5 px-4 text-right">{t.thActivations}</th>
                <th className="py-3.5 px-4 text-center">{t.thAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {paginatedSensors.map((sensor, idx) => {
                const globalIndex = (safePage - 1) * ITEMS_PER_PAGE + idx + 1;
                const typeInfo = TYPE_CONFIG[sensor.type] || TYPE_CONFIG.Weather;
                const TypeIcon = typeInfo.icon;
                const statusInfo = getStatusBadge(sensor.status);
                const isInactive = sensor.status === 'INACTIVE';
                const statusLabel = STATUS_TRANSLATIONS[sensor.status]?.[isHi ? 'hi' : 'en'] || sensor.status;
                const typeLabel = TYPE_TRANSLATIONS[sensor.type]?.[isHi ? 'hi' : 'en'] || sensor.type;

                return (
                  <tr 
                    key={sensor.id}
                    onClick={() => setSelectedSensor(sensor)}
                    className={`hover:bg-blue-50/40 cursor-pointer transition-colors group
                      ${isInactive ? 'bg-slate-50/40 opacity-75' : ''}`}
                  >
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-400 text-center">{globalIndex}</td>
                    
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {isHi ? sensor.nameHi : sensor.nameEn}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">({sensor.id})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {isHi ? sensor.locationHi : sensor.locationEn}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold text-slate-700 bg-slate-100">
                        <TypeIcon className={`w-3.5 h-3.5 ${typeInfo.color}`} />
                        <span>{typeLabel}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusInfo.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                        {statusLabel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500 font-semibold">
                      {sensor.lastUpdated}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-slate-900 text-xs">
                      {sensor.activationCount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedSensor(sensor); }}
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

        {paginatedSensors.length === 0 && (
          <div className="py-16 text-center text-slate-400 font-medium">
            <Radio className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            {t.noSensorsFound}
          </div>
        )}

        {/* PAGINATION BAR */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500">
            {t.showing} <span className="text-slate-900 font-black">{(safePage - 1) * ITEMS_PER_PAGE + 1}</span>{t.to}
            <span className="text-slate-900 font-black">{Math.min(safePage * ITEMS_PER_PAGE, filteredSensors.length)}</span> {t.of}{' '}
            <span className="text-slate-900 font-black">{filteredSensors.length}</span> {t.sensorsWord}
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

      {/* SENSOR DETAIL MODAL */}
      {selectedSensor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900">
                    {isHi ? selectedSensor.nameHi : selectedSensor.nameEn}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(selectedSensor.status).badge}`}>
                    {STATUS_TRANSLATIONS[selectedSensor.status]?.[isHi ? 'hi' : 'en'] || selectedSensor.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-1">
                  <span>{t.sensorId}: <span className="text-slate-700">{selectedSensor.id}</span></span>
                  <span>•</span>
                  <span>{TYPE_TRANSLATIONS[selectedSensor.type]?.[isHi ? 'hi' : 'en'] || selectedSensor.type}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedSensor(null)}
                className="p-1.5 hover:bg-slate-200/70 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 px-6 bg-slate-50/30 gap-6 text-xs font-bold">
              {['Overview', 'Live Data', 'History', 'System Status'].map((tabKey) => {
                const tabLabel = tabKey === 'Overview' ? t.tabOverview 
                               : tabKey === 'Live Data' ? t.tabLiveData 
                               : tabKey === 'History' ? t.tabHistory 
                               : t.tabSystemStatus;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setDetailTab(tabKey)}
                    className={`py-3 relative transition-colors
                      ${detailTab === tabKey ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {tabLabel}
                    {detailTab === tabKey && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              {/* TAB 1: OVERVIEW */}
              {detailTab === 'Overview' && (
                <div className="flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.currentStatus}</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.thStatus}</span>
                        <span className="text-sm font-black text-slate-900">
                          {STATUS_TRANSLATIONS[selectedSensor.status]?.[isHi ? 'hi' : 'en'] || selectedSensor.status}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.lastDataReceived}</span>
                        <span className="text-sm font-black text-slate-900">{selectedSensor.lastUpdated}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.signalStrength}</span>
                        <span className="text-sm font-black text-slate-900 flex items-center gap-1">
                          <Wifi className="w-3.5 h-3.5 text-blue-500" /> {selectedSensor.signalStrength}%
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.batteryLevel}</span>
                        <span className="text-sm font-black text-slate-900 flex items-center gap-1">
                          <Battery className="w-3.5 h-3.5 text-emerald-500" /> {selectedSensor.battery}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{t.locationDetails}</span>
                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/70 space-y-2.5 text-xs">
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-slate-500 font-medium">{t.nearestLocation}</span>
                        <span className="font-bold text-slate-900">{isHi ? selectedSensor.locationHi : selectedSensor.locationEn}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-slate-500 font-medium">{t.districtRegion}</span>
                        <span className="font-bold text-slate-900">{isHi ? selectedSensor.districtHi : selectedSensor.districtEn}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/50 pb-2">
                        <span className="text-slate-500 font-medium">{t.internalGridPos}</span>
                        <span className="font-mono font-bold text-slate-700">{selectedSensor.coord}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">{t.geoCoords}</span>
                        <span className="font-mono font-bold text-slate-700">{selectedSensor.latitude}, {selectedSensor.longitude}</span>
                      </div>
                    </div>
                  </div>

                  {selectedSensor.status === 'INACTIVE' && (
                    <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
                        <AlertOctagon className="w-4 h-4 text-slate-500" /> {t.inactiveProtocol}
                      </div>
                      {isHi ? 'ऑफलाइन अवधि:' : 'Offline Duration:'} {selectedSensor.offlineDuration} • {isHi ? 'अंतिम ज्ञात रीडिंग:' : 'Last Known Reading:'} {selectedSensor.lastKnownReading}.
                      <p className="mt-1 font-semibold text-slate-700">{t.systemRecommendation}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t.recentReadingsTitle}</span>
                    <SensorReadingsChart 
                      readings={selectedSensor.readings} 
                      unit={TYPE_CONFIG[selectedSensor.type]?.unit || ''}
                      warningThresh={selectedSensor.warningThreshold}
                      criticalThresh={selectedSensor.criticalThreshold}
                      isHi={isHi}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE DATA */}
              {detailTab === 'Live Data' && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-blue-700 uppercase block mb-1">
                        {isHi ? selectedSensor.liveTelemetry.primaryLabelHi : selectedSensor.liveTelemetry.primaryLabelEn}
                      </span>
                      <span className="text-2xl font-black text-slate-900 block">{selectedSensor.liveTelemetry.primaryValue}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        {isHi ? selectedSensor.liveTelemetry.secondaryLabelHi : selectedSensor.liveTelemetry.secondaryLabelEn}
                      </span>
                      <span className="text-lg font-black text-slate-900 block">
                        {isHi ? selectedSensor.liveTelemetry.secondaryValueHi : selectedSensor.liveTelemetry.secondaryValueEn}
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        {isHi ? selectedSensor.liveTelemetry.tertiaryLabelHi : selectedSensor.liveTelemetry.tertiaryLabelEn}
                      </span>
                      <span className="text-lg font-black text-slate-900 block">{selectedSensor.liveTelemetry.tertiaryValue}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs font-bold">
                    <span className="text-slate-500 uppercase">{t.trendTrajectory}</span>
                    <span className="text-blue-600 font-black">
                      {isHi ? selectedSensor.liveTelemetry.trendHi : selectedSensor.liveTelemetry.trendEn}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{t.telemetryStream}</span>
                    <SensorReadingsChart 
                      readings={selectedSensor.readings} 
                      unit={TYPE_CONFIG[selectedSensor.type]?.unit || ''}
                      warningThresh={selectedSensor.warningThreshold}
                      criticalThresh={selectedSensor.criticalThreshold}
                      isHi={isHi}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: HISTORY */}
              {detailTab === 'History' && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.extendedHistory}</span>
                    <div className="flex gap-1.5">
                      {['1 Hour', '6 Hours', '24 Hours', '7 Days'].map((r) => {
                        const rLabel = isHi 
                          ? r.replace('Hour', 'घंटा').replace('Hours', 'घंटे').replace('Days', 'दिन')
                          : r;
                        return (
                          <button
                            key={r}
                            onClick={() => setHistoryTimeRange(r)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all border
                              ${historyTimeRange === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                          >
                            {rLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">{t.currentReading}</span>
                      <span className="text-sm font-black text-slate-900">{selectedSensor.readings[selectedSensor.readings.length - 1].val}</span>
                    </div>
                    <div className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200">
                      <span className="text-[9px] font-bold text-amber-700 uppercase block">{t.warnThresh}</span>
                      <span className="text-sm font-black text-amber-800">{selectedSensor.warningThreshold}</span>
                    </div>
                    <div className="bg-red-50/50 p-2.5 rounded-lg border border-red-200">
                      <span className="text-[9px] font-bold text-red-700 uppercase block">{t.critThresh}</span>
                      <span className="text-sm font-black text-red-800">{selectedSensor.criticalThreshold}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">{t.maxPeak}</span>
                      <span className="text-sm font-black text-slate-900">{Math.max(...selectedSensor.readings.map(r => r.val))}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">{t.minRecorded}</span>
                      <span className="text-sm font-black text-slate-900">{Math.min(...selectedSensor.readings.map(r => r.val))}</span>
                    </div>
                  </div>

                  <SensorReadingsChart 
                    readings={selectedSensor.readings} 
                    unit={TYPE_CONFIG[selectedSensor.type]?.unit || ''}
                    warningThresh={selectedSensor.warningThreshold}
                    criticalThresh={selectedSensor.criticalThreshold}
                    isHi={isHi}
                  />
                </div>
              )}

              {/* TAB 4: SYSTEM STATUS */}
              {detailTab === 'System Status' && (
                <div className="flex flex-col gap-4 text-xs">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 font-medium">{t.firmwareVersion}</span>
                    <span className="font-mono font-bold text-slate-900">v3.4.2-rel</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 font-medium">{t.uptimeStreak}</span>
                    <span className="font-bold text-slate-900">{t.uptimeValue}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 font-medium">{t.totalLifetimeAct}</span>
                    <span className="font-bold text-slate-900">{selectedSensor.activationCount.toLocaleString()} {t.pingsWord}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-600 font-medium">{t.hardwareDiag}</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> {t.selfTestsPassed}
                    </span>
                  </div>
                </div>
              )}

              {/* AI INSIGHT CARD */}
              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest block mb-1">{t.aiInsightTitle}</span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {getAiInsight(selectedSensor)}
                  </p>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button 
                onClick={() => setDetailTab('History')}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-xs shadow-2xs"
              >
                <HistoryIcon className="w-4 h-4" /> {t.btnViewHistory}
              </button>

              <button 
                onClick={() => setSelectedSensor(null)}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition-colors text-xs"
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