import React, { useState, useMemo } from 'react';
import { 
  AlertOctagon, AlertTriangle, Bell, MapPin, Search, 
  ChevronDown, ChevronRight, X, ShieldAlert, Radio, 
  CheckCircle2, Clock, Send, FileText, ArrowUpRight,
  Info, Volume2, Smartphone, MessageSquare, Check, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- BILINGUAL TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'Active Emergency Alerts',
    subtitle: 'Real-time hazard notifications, triage, and authority response workflows',
    live: 'Live',
    alertBannerTitle: 'ALERT: Heavy rainfall expected in Chamoli district.',
    alertBannerText: 'Multiple areas are at high risk of flash floods and landslides. Stay alert and follow official advisories.',
    totalAlerts: 'Total Alerts',
    allHazardTypes: 'All hazard types',
    critical: 'Critical',
    criticalSubtext: 'Immediate action required',
    highSeverity: 'High Severity',
    highSubtext: 'High risk conditions',
    moderate: 'Moderate',
    moderateSubtext: 'Advisories & watches',
    streamTitle: 'ACTIVE INCIDENT STREAM',
    streamSubtitle: 'Real-time alerts from sensors, models, and field reports',
    searchPlaceholder: 'Search alerts...',
    filterAllTypes: 'All Types',
    sortNewest: 'Newest First',
    sortOldest: 'Oldest First',
    sortHighestSeverity: 'Highest Severity',
    viewDetails: 'View Details →',
    noAlertsFound: 'No alerts match your filter criteria.',
    panelTitle: 'District Public Siren / SMS',
    panelSubtitle: 'Dispatch high-priority alerts to the public via sirens, SMS and mobile notifications across Chamoli district.',
    tabSiren: 'Siren Alert',
    tabSms: 'SMS Alert',
    tabMobile: 'Mobile App',
    infoBoxText: 'This action will trigger district public sirens in all registered locations and send emergency SMS notifications to citizens in the affected areas.',
    selectTemplate: 'Select Alert Template',
    customMessageOptional: 'Custom Message (Optional)',
    sendAlertBtn: 'Send Siren & SMS Alert',
    impactTitle: 'Alert Impact & Reach',
    impactSubtitle: 'Estimated coverage for selected alert',
    peopleInRange: 'People in Range',
    villagesSectors: 'Villages / Sectors',
    sirenLocations: 'Siren Locations',
    auditNote: '“Alert logs and delivery status are recorded for audit and coordination with district authorities.”',
    viewLogsBtn: 'View Logs →',
    modalSeverity: 'SEVERITY',
    modalWorkflowTitle: 'Change Alert Status Workflow:',
    modalTriggerReason: 'Trigger / Reason',
    modalKeyConditions: 'Key Conditions',
    rainfall: 'Rainfall',
    soilSat: 'Soil Sat.',
    riverLevel: 'River Level',
    floodRisk: 'Flood Risk',
    affectedAreas: 'Affected Areas',
    recommendedResponse: 'Recommended Response',
    issuedAt: 'Issued At:',
    lastUpdated: 'Last Updated:',
    btnRiskAnalysis: 'View Risk Analysis',
    btnSensorData: 'View Sensor Data',
    btnEvacRoutes: 'View Evacuation Routes',
    btnClose: 'Close',
    confirmTitle: 'Confirm Emergency Broadcast',
    confirmAlert: 'Alert Template:',
    confirmRegion: 'Affected Region:',
    confirmChannels: 'Active Channels:',
    confirmChannelsList: '✓ District Siren, SMS, Mobile App',
    confirmReach: 'Estimated Reach:',
    peopleCount: '24,560 people',
    btnCancel: 'Cancel',
    btnConfirmBroadcast: 'Confirm & Broadcast',
    broadcastSuccessToast: 'Emergency broadcast confirmed and dispatched to 24,560 citizens.',
    logsTitle: 'Emergency Broadcast Audit Logs',
    thTimestamp: 'Timestamp',
    thAlertId: 'Alert ID',
    thChannel: 'Channel',
    thDeliveryStatus: 'Delivery Status',
    thRecipients: 'Recipients / Reach',
    btnCloseLogs: 'Close Logs'
  },
  hi: {
    pageTitle: 'सक्रिय आपातकालीन अलर्ट',
    subtitle: 'वास्तविक समय आपदा सूचनाएं, वर्गीकरण और प्राधिकरण प्रतिक्रिया कार्यप्रणाली',
    live: 'लाइव',
    alertBannerTitle: 'चेतावनी: चमोली जिले में भारी बारिश की आशंका।',
    alertBannerText: 'कई क्षेत्रों में अचानक बाढ़ और भूस्खलन का उच्च जोखिम है। सतर्क रहें और आधिकारिक निर्देशों का पालन करें।',
    totalAlerts: 'कुल अलर्ट',
    allHazardTypes: 'सभी आपदा प्रकार',
    critical: 'अत्यधिक गंभीर (Critical)',
    criticalSubtext: 'तत्काल कार्रवाई आवश्यक',
    highSeverity: 'उच्च गंभीरता (High)',
    highSubtext: 'उच्च जोखिम स्थितियां',
    moderate: 'मध्यम (Moderate)',
    moderateSubtext: 'परामर्श और निगरानी',
    streamTitle: 'सक्रिय घटनाक्रम प्रवाह (INCIDENT STREAM)',
    streamSubtitle: 'सेंसर, मॉडल और फील्ड रिपोर्ट से प्राप्त वास्तविक समय अलर्ट',
    searchPlaceholder: 'अलर्ट खोजें...',
    filterAllTypes: 'सभी प्रकार',
    sortNewest: 'नवीनतम पहले',
    sortOldest: 'पुरातन पहले',
    sortHighestSeverity: 'उच्चतम गंभीरता',
    viewDetails: 'विवरण देखें →',
    noAlertsFound: 'आपके फ़िल्टर मानदंडों से मेल खाने वाला कोई अलर्ट नहीं मिला।',
    panelTitle: 'जिला सार्वजनिक सायरन / SMS',
    panelSubtitle: 'चमोली जिले भर में सायरन, एसएमएस और मोबाइल अधिसूचनाओं के माध्यम से नागरिकों को उच्च-प्राथमिकता अलर्ट भेजें।',
    tabSiren: 'सायरन अलर्ट',
    tabSms: 'SMS अलर्ट',
    tabMobile: 'मोबाइल ऐप',
    infoBoxText: 'यह कार्रवाई सभी पंजीकृत स्थानों पर जिला सार्वजनिक सायरन सक्रिय करेगी और प्रभावित क्षेत्रों के नागरिकों को आपातकालीन SMS सूचनाएं भेजेगी।',
    selectTemplate: 'अलर्ट टेम्प्लेट चुनें',
    customMessageOptional: 'कस्टम संदेश (वैकल्पिक)',
    sendAlertBtn: 'सायरन एवं SMS अलर्ट भेजें',
    impactTitle: 'अलर्ट प्रभाव एवं पहुंच',
    impactSubtitle: 'चयनित अलर्ट का अनुमानित कवरेज',
    peopleInRange: 'दायरे में लोग',
    villagesSectors: 'गांव / सेक्टर',
    sirenLocations: 'सायरन स्थल',
    auditNote: '“ऑडिट और जिला अधिकारियों के समन्वय के लिए अलर्ट लॉग और वितरण स्थिति दर्ज की जाती है।”',
    viewLogsBtn: 'लॉग देखें →',
    modalSeverity: 'गंभीरता स्तर',
    modalWorkflowTitle: 'अलर्ट स्थिति कार्यप्रवाह बदलें:',
    modalTriggerReason: 'उत्प्रेरक / कारण',
    modalKeyConditions: 'प्रमुख परिस्थितियां',
    rainfall: 'वर्षा',
    soilSat: 'मिट्टी संतृप्ति',
    riverLevel: 'नदी जलस्तर',
    floodRisk: 'बाढ़ जोखिम',
    affectedAreas: 'प्रभावित क्षेत्र',
    recommendedResponse: 'अनुशंसित प्रतिक्रिया (SOP)',
    issuedAt: 'जारी समय:',
    lastUpdated: 'अंतिम अपडेट:',
    btnRiskAnalysis: 'जोखिम विश्लेषण देखें',
    btnSensorData: 'सेंसर डेटा देखें',
    btnEvacRoutes: 'निकासी मार्ग देखें',
    btnClose: 'बंद करें',
    confirmTitle: 'आपातकालीन प्रसारण की पुष्टि करें',
    confirmAlert: 'अलर्ट टेम्प्लेट:',
    confirmRegion: 'प्रभावित क्षेत्र:',
    confirmChannels: 'सक्रिय माध्यम:',
    confirmChannelsList: '✓ जिला सायरन, SMS, मोबाइल ऐप',
    confirmReach: 'अनुमानित पहुंच:',
    peopleCount: '24,560 नागरिक',
    btnCancel: 'रद्द करें',
    btnConfirmBroadcast: 'पुष्टि करें और प्रसारित करें',
    broadcastSuccessToast: 'आपातकालीन प्रसारण सफलतापूर्वक 24,560 नागरिकों तक पहुंचा दिया गया।',
    logsTitle: 'आपातकालीन प्रसारण ऑडिट लॉग्स',
    thTimestamp: 'समय',
    thAlertId: 'अलर्ट आईडी',
    thChannel: 'माध्यम',
    thDeliveryStatus: 'वितरण स्थिति',
    thRecipients: 'प्राप्तकर्ता / पहुंच',
    btnCloseLogs: 'लॉग बंद करें'
  }
};

const SEVERITY_TRANSLATIONS = {
  CRITICAL: { en: 'CRITICAL', hi: 'अत्यधिक' },
  HIGH: { en: 'HIGH', hi: 'उच्च' },
  MODERATE: { en: 'MODERATE', hi: 'मध्यम' },
  LOW: { en: 'LOW', hi: 'निम्न' }
};

const STATUS_TRANSLATIONS = {
  ACTIVE: { en: 'ACTIVE', hi: 'सक्रिय' },
  ACKNOWLEDGED: { en: 'ACKNOWLEDGED', hi: 'स्वीकृत' },
  RESOLVED: { en: 'RESOLVED', hi: 'निराकृत' }
};

const CATEGORY_TRANSLATIONS = {
  Hydrological: { en: 'Hydrological', hi: 'जल विज्ञान' },
  Geotechnical: { en: 'Geotechnical', hi: 'भू-तकनीकी' },
  Meteorological: { en: 'Meteorological', hi: 'मौसम विज्ञान' }
};

// --- SEVERITY & STATUS STYLES ---
const getSeverityStyle = (severity) => {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return { badge: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500', borderLeft: 'border-l-4 border-l-red-500', tint: 'bg-red-50/30' };
    case 'HIGH':
      return { badge: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500', borderLeft: 'border-l-4 border-l-orange-500', tint: 'bg-white' };
    case 'MODERATE':
      return { badge: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', borderLeft: 'border-l-4 border-l-amber-400', tint: 'bg-white' };
    default:
      return { badge: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500', borderLeft: 'border-l-4 border-l-blue-500', tint: 'bg-white' };
  }
};

const getStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE': return 'bg-red-100 text-red-700 border-red-200';
    case 'ACKNOWLEDGED': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'RESOLVED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

// --- INITIAL MOCK ALERTS DATABASE ---
const INITIAL_ALERTS = [
  {
    id: 'ALERT-01',
    titleEn: 'Critical Flash Flood Warning — Dhauliganga Basin',
    titleHi: 'गंभीर अचानक बाढ़ चेतावनी — धौलीगंगा बेसिन',
    category: 'Hydrological',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    locationEn: 'Tapovan Sector, Chamoli',
    locationHi: 'तपोवन सेक्टर, चमोली',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    issuedAt: '10:52 PM',
    lastUpdated: '10:52 PM',
    descriptionEn: 'Rapid rise in river level detected. Possible flash flood in downstream areas within 2–4 hours. Immediate action required.',
    descriptionHi: 'नदी के जलस्तर में तीव्र वृद्धि दर्ज की गई। अगले 2-4 घंटों में निचले क्षेत्रों में अचानक बाढ़ की आशंका। तत्काल कार्रवाई आवश्यक।',
    triggerEn: 'River level exceeded the configured warning threshold while upstream rainfall remained elevated.',
    triggerHi: 'ऊपरी जलग्रहण क्षेत्र में निरंतर भारी बारिश के कारण नदी का जलस्तर निर्धारित चेतावनी सीमा को पार कर गया है।',
    rainfall: '112 mm / 24h',
    rainfallIntensityEn: 'Heavy',
    rainfallIntensityHi: 'भारी',
    soilSaturation: '88%',
    riverLevel: '6.8 m',
    riverTrend: '↑ +0.2 m/hr',
    floodRiskScore: 82,
    riskLevel: 'HIGH',
    affectedAreasEn: ['Tapovan Sector', 'Dhauliganga Basin', 'Downstream settlements'],
    affectedAreasHi: ['तपोवन सेक्टर', 'धौलीगंगा बेसिन', 'निचली बस्तियां'],
    recommendedActionEn: 'Move residents in vulnerable areas to designated safe zones. Monitor river levels and rainfall continuously.',
    recommendedActionHi: 'संवेदनशील क्षेत्रों के निवासियों को निर्धारित सुरक्षित आश्रयों में स्थानांतरित करें। नदी के जलस्तर पर लगातार नजर रखें।',
    channels: ['District Siren', 'SMS', 'Mobile App'],
    estimatedReach: 24560,
    logs: [
      { time: '10:52 PM', id: 'ALERT-01', channel: 'SMS', statusEn: 'Delivered', statusHi: 'वितरित', reach: '24,560' },
      { time: '10:52 PM', id: 'ALERT-01', channel: 'Siren', statusEn: 'Activated', statusHi: 'सक्रिय', reach: '12 locations' },
      { time: '10:53 PM', id: 'ALERT-01', channel: 'Mobile App', statusEn: 'Delivered', statusHi: 'वितरित', reach: '18,420 users' }
    ]
  },
  {
    id: 'ALERT-02',
    titleEn: 'Severe Slope Saturation & Landslide Advisory',
    titleHi: 'गंभीर ढलान संतृप्ति एवं भूस्खलन परामर्श',
    category: 'Geotechnical',
    severity: 'HIGH',
    status: 'ACTIVE',
    locationEn: 'Chamoli Slope Alpha & Raini Village',
    locationHi: 'चमोली ढलान अल्फा एवं रैणी गांव',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    issuedAt: '10:45 PM',
    lastUpdated: '10:45 PM',
    descriptionEn: 'Soil moisture is above 85% and continuing to rise. High probability of landslides in vulnerable slopes. Avoid non-essential travel.',
    descriptionHi: 'मिट्टी की नमी 85% से ऊपर है और लगातार बढ़ रही है। संवेदनशील ढलानों पर भूस्खलन की अत्यधिक संभावना है। अनावश्यक यात्रा से बचें।',
    triggerEn: 'Subsurface probe telemetry indicates critical pore water pressure along mountain cuts.',
    triggerHi: 'भूमिगत जांच टेलीमेट्री पहाड़ी कटानों पर अत्यधिक छिद्र जल दबाव का संकेत देती है।',
    rainfall: '98 mm / 24h',
    rainfallIntensityEn: 'Moderate',
    rainfallIntensityHi: 'मध्यम',
    soilSaturation: '92%',
    riverLevel: '+1.1 m',
    riverTrend: '↑ +0.1 m/hr',
    floodRiskScore: 75,
    riskLevel: 'HIGH',
    affectedAreasEn: ['Chamoli Slope Alpha', 'Raini Village', 'NH-7 Corridor'],
    affectedAreasHi: ['चमोली ढलान अल्फा', 'रैणी गांव', 'NH-7 मार्ग'],
    recommendedActionEn: 'Issue traffic restrictions along mountain passes and evacuate vulnerable mud-brick dwellings.',
    recommendedActionHi: 'पहाड़ी मार्गों पर यातायात नियंत्रित करें और कच्चे मकानों में रहने वालों को सुरक्षित स्थानों पर पहुंचाएं।',
    channels: ['SMS', 'Mobile App'],
    estimatedReach: 14200,
    logs: [
      { time: '10:45 PM', id: 'ALERT-02', channel: 'SMS', statusEn: 'Delivered', statusHi: 'वितरित', reach: '14,200' },
      { time: '10:46 PM', id: 'ALERT-02', channel: 'Mobile App', statusEn: 'Delivered', statusHi: 'वितरित', reach: '11,000 users' }
    ]
  },
  {
    id: 'ALERT-03',
    titleEn: 'Cloudburst & Heavy Precipitation Alert',
    titleHi: 'बादल फटने एवं अत्यधिक वर्षा का अलर्ट',
    category: 'Meteorological',
    severity: 'HIGH',
    status: 'ACTIVE',
    locationEn: 'Badrinath & Mana Sector',
    locationHi: 'बद्रीनाथ एवं माणा सेक्टर',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    issuedAt: '10:30 PM',
    lastUpdated: '10:30 PM',
    descriptionEn: 'Intense rainfall expected in the next 6–12 hours. Localized cloudburst may trigger flash floods and landslides.',
    descriptionHi: 'अगले 6-12 घंटों में अत्यधिक भारी बारिश की संभावना। स्थानीय बादल फटने से अचानक बाढ़ आ सकती है।',
    triggerEn: 'Doppler radar convergence scan shows persistent thunderstorm cell formation.',
    triggerHi: 'डॉप्लर रडार स्कैन से लगातार गरज वाले बादलों के जमावड़े की पुष्टि होती है।',
    rainfall: '128 mm / 24h',
    rainfallIntensityEn: 'Heavy',
    rainfallIntensityHi: 'भारी',
    soilSaturation: '91%',
    riverLevel: '+1.8 m',
    riverTrend: '↑ +0.3 m/hr',
    floodRiskScore: 88,
    riskLevel: 'EXTREME',
    affectedAreasEn: ['Badrinath', 'Mana', 'Alaknanda Headwaters'],
    affectedAreasHi: ['बद्रीनाथ', 'माणा', 'अलकनंदा उद्गम क्षेत्र'],
    recommendedActionEn: 'Pause pilgrimage movement and keep emergency response helicopters on standby.',
    recommendedActionHi: 'यात्रा को अस्थाई रूप से रोकें और आपातकालीन बचाव दलों को अलर्ट पर रखें।',
    channels: ['District Siren', 'SMS', 'Mobile App'],
    estimatedReach: 19800,
    logs: [
      { time: '10:30 PM', id: 'ALERT-03', channel: 'SMS', statusEn: 'Delivered', statusHi: 'वितरित', reach: '19,800' }
    ]
  },
  {
    id: 'ALERT-04',
    titleEn: 'Moderate Drainage Swelling Notice',
    titleHi: 'मध्यम जल निकासी प्रवाह वृद्धि सूचना',
    category: 'Hydrological',
    severity: 'MODERATE',
    status: 'ACKNOWLEDGED',
    locationEn: 'Karnaprayag Confluence',
    locationHi: 'कर्णप्रयाग संगम',
    districtEn: 'Chamoli District, Uttarakhand',
    districtHi: 'चमोली जिला, उत्तराखंड',
    issuedAt: '09:15 PM',
    lastUpdated: '09:30 PM',
    descriptionEn: 'Increased flow in minor streams and drainage channels. Authorities to monitor low-lying areas.',
    descriptionHi: 'छोटी सहायक धाराओं और नालों में जलप्रवाह बढ़ा है। निचले इलाकों में निगरानी रखी जाए।',
    triggerEn: 'Confluence stage gauge recorded steady upward tick (+0.1 m/hr).',
    triggerHi: 'संगम स्तर गेज पर जलस्तर में निरंतर धीमी वृद्धि दर्ज की गई है।',
    rainfall: '58 mm / 24h',
    rainfallIntensityEn: 'Light',
    rainfallIntensityHi: 'हल्की',
    soilSaturation: '62%',
    riverLevel: '+0.6 m',
    riverTrend: '↑ +0.1 m/hr',
    floodRiskScore: 53,
    riskLevel: 'MEDIUM',
    affectedAreasEn: ['Karnaprayag Market', 'Pindar Confluence Banks'],
    affectedAreasHi: ['कर्णप्रयाग बाजार', 'पिंडर संगम तट'],
    recommendedActionEn: 'Inform local market vendors near riverbanks to secure movable property.',
    recommendedActionHi: 'नदी किनारे के दुकानदारों और निवासियों को आवश्यक सावधानी बरतने हेतु सूचित करें।',
    channels: ['SMS'],
    estimatedReach: 8500,
    logs: [
      { time: '09:15 PM', id: 'ALERT-04', channel: 'SMS', statusEn: 'Delivered', statusHi: 'वितरित', reach: '8,500' }
    ]
  }
];

const ALERT_TEMPLATES = {
  en: {
    'Flash Flood Warning': 'Flash flood warning issued for Tapovan. Move to higher ground immediately. Follow official instructions.',
    'Heavy Rainfall Warning': 'Heavy rainfall expected in Chamoli district. Stay indoors and avoid riverbanks.',
    'Landslide Advisory': 'Severe slope saturation detected. High probability of landslides along vulnerable road corridors.',
    'River Level Warning': 'River levels are approaching warning thresholds. Downstream areas must remain vigilant.',
    'Evacuation Notice': 'Mandatory evacuation notice in effect for high-risk zones. Proceed to designated relief camps.',
    'General Emergency Advisory': 'Emergency advisory: Monitor district updates and adhere to safety guidelines.'
  },
  hi: {
    'Flash Flood Warning': 'तपोवन के लिए अचानक बाढ़ की चेतावनी जारी। तुरंत ऊंचे स्थानों पर जाएं। आधिकारिक निर्देशों का पालन करें।',
    'Heavy Rainfall Warning': 'चमोली जिले में भारी बारिश की आशंका। घर के अंदर रहें और नदी तटों से दूर रहें।',
    'Landslide Advisory': 'अत्यधिक मिट्टी संतृप्ति दर्ज। पर्वतीय मार्गों पर भूस्खलन की अत्यधिक संभावना है।',
    'River Level Warning': 'नदी का जलस्तर चेतावनी सीमा के निकट है। निचले इलाके सतर्क रहें।',
    'Evacuation Notice': 'उच्च जोखिम वाले क्षेत्रों के लिए अनिवार्य निकासी आदेश। निकटतम राहत शिविरों में पहुंचे।',
    'General Emergency Advisory': 'आपातकालीन सूचना: जिला बुलेटिन देखें और सुरक्षा प्रोटोकॉल का पालन करें।'
  }
};

export default function ActiveAlerts() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;
  const templates = isHi ? ALERT_TEMPLATES.hi : ALERT_TEMPLATES.en;

  // State Management
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [summaryFilter, setSummaryFilter] = useState('ALL');
  
  // Stream Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [sortOrder, setSortOrder] = useState('Newest First');

  // Modals & Panels
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showLogsModal, setShowLogsModal] = useState(false);

  // Broadcast Panel State
  const [broadcastTab, setBroadcastTab] = useState('Siren Alert');
  const [selectedTemplateKey, setSelectedTemplateKey] = useState('Flash Flood Warning');
  const [customMessage, setCustomMessage] = useState(templates['Flash Flood Warning']);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Status Change Workflow
  const handleUpdateStatus = (id, newStatus) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, lastUpdated: isHi ? 'अभी' : 'Just now' } : a));
    if (selectedAlert && selectedAlert.id === id) {
      setSelectedAlert(prev => ({ ...prev, status: newStatus, lastUpdated: isHi ? 'अभी' : 'Just now' }));
    }
  };

  // Filtered Alert Stream
  const filteredAlerts = useMemo(() => {
    let result = [...alerts];

    if (summaryFilter === 'CRITICAL') result = result.filter(a => a.severity === 'CRITICAL');
    else if (summaryFilter === 'HIGH SEVERITY') result = result.filter(a => a.severity === 'HIGH');
    else if (summaryFilter === 'MODERATE') result = result.filter(a => a.severity === 'MODERATE');

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.titleEn.toLowerCase().includes(q) || 
        a.titleHi.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) || 
        a.locationEn.toLowerCase().includes(q) ||
        a.locationHi.toLowerCase().includes(q)
      );
    }

    if (filterType !== 'All Types') {
      result = result.filter(a => a.category.toLowerCase() === filterType.toLowerCase());
    }

    if (sortOrder === 'Newest First') result.sort((a, b) => b.id.localeCompare(a.id));
    else if (sortOrder === 'Oldest First') result.sort((a, b) => a.id.localeCompare(b.id));
    else if (sortOrder === 'Highest Severity') {
      const rank = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 };
      result.sort((a, b) => (rank[b.severity] || 0) - (rank[a.severity] || 0));
    }

    return result;
  }, [alerts, summaryFilter, searchQuery, filterType, sortOrder]);

  return (
    <div className="flex flex-col gap-8 w-full h-full pb-14 animate-fadeIn">
      
      {/* 2. TOP ALERT BANNER */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-red-900 font-medium leading-relaxed">
          <strong className="font-black uppercase tracking-wider text-red-700 block mb-0.5">
            {t.alertBannerTitle}
          </strong>
          {t.alertBannerText}
        </div>
      </div>

      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-slate-900">{t.pageTitle}</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select className="appearance-none bg-white border border-slate-300 text-slate-800 font-bold text-xs py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer">
              <option>{isHi ? 'चमोली, उत्तराखंड' : 'Chamoli, Uttarakhand'}</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium border-l border-slate-200 pl-3">
            <span>{isHi ? 'अंतिम अपडेट:' : 'Last Updated:'} <strong className="text-slate-800 font-bold">20 Sep 2026, 10:52 PM</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {t.live}
          </div>
        </div>
      </div>

      {/* 3. ALERT SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: TOTAL */}
        <button
          onClick={() => setSummaryFilter('ALL')}
          className={`text-left p-5 rounded-xl border transition-all bg-white shadow-2xs hover:shadow-md
            ${summaryFilter === 'ALL' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'}`}
        >
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">{t.totalAlerts}</span>
          <div className="text-3xl font-black text-slate-900 leading-none">{alerts.length}</div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.allHazardTypes}</span>
        </button>

        {/* CARD 2: CRITICAL */}
        <button
          onClick={() => setSummaryFilter('CRITICAL')}
          className={`text-left p-5 rounded-xl border transition-all bg-white shadow-2xs hover:shadow-md
            ${summaryFilter === 'CRITICAL' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'}`}
        >
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-1">{t.critical}</span>
          <div className="text-3xl font-black text-slate-900 leading-none">
            {alerts.filter(a => a.severity === 'CRITICAL').length}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.criticalSubtext}</span>
        </button>

        {/* CARD 3: HIGH SEVERITY */}
        <button
          onClick={() => setSummaryFilter('HIGH SEVERITY')}
          className={`text-left p-5 rounded-xl border transition-all bg-white shadow-2xs hover:shadow-md
            ${summaryFilter === 'HIGH SEVERITY' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-slate-200'}`}
        >
          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-1">{t.highSeverity}</span>
          <div className="text-3xl font-black text-slate-900 leading-none">
            {alerts.filter(a => a.severity === 'HIGH').length}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.highSubtext}</span>
        </button>

        {/* CARD 4: MODERATE */}
        <button
          onClick={() => setSummaryFilter('MODERATE')}
          className={`text-left p-5 rounded-xl border transition-all bg-white shadow-2xs hover:shadow-md
            ${summaryFilter === 'MODERATE' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'}`}
        >
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">{t.moderate}</span>
          <div className="text-3xl font-black text-slate-900 leading-none">
            {alerts.filter(a => a.severity === 'MODERATE').length}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-2 block">{t.moderateSubtext}</span>
        </button>
      </div>

      {/* 4. MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: ACTIVE INCIDENT STREAM */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t.streamTitle}</h3>
            <span className="text-xs text-slate-400 font-medium">{t.streamSubtitle}</span>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-1.5 px-2 rounded-lg cursor-pointer"
            >
              <option value="All Types">{t.filterAllTypes}</option>
              <option value="Hydrological">{isHi ? 'जल विज्ञान' : 'Hydrological'}</option>
              <option value="Meteorological">{isHi ? 'मौसम विज्ञान' : 'Meteorological'}</option>
              <option value="Geotechnical">{isHi ? 'भू-तकनीकी' : 'Geotechnical'}</option>
            </select>

            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-1.5 px-2 rounded-lg cursor-pointer"
            >
              <option value="Newest First">{t.sortNewest}</option>
              <option value="Oldest First">{t.sortOldest}</option>
              <option value="Highest Severity">{t.sortHighestSeverity}</option>
            </select>
          </div>

          {/* Incident Cards */}
          <div className="space-y-4">
            {filteredAlerts.map((alt) => {
              const style = getSeverityStyle(alt.severity);
              const severityLabel = SEVERITY_TRANSLATIONS[alt.severity]?.[isHi ? 'hi' : 'en'] || alt.severity;
              const statusLabel = STATUS_TRANSLATIONS[alt.status]?.[isHi ? 'hi' : 'en'] || alt.status;
              const categoryLabel = CATEGORY_TRANSLATIONS[alt.category]?.[isHi ? 'hi' : 'en'] || alt.category;

              return (
                <div
                  key={alt.id}
                  onClick={() => setSelectedAlert(alt)}
                  className={`rounded-xl border border-slate-200 hover:border-blue-300 ${style.borderLeft} ${style.tint} p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
                >
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${style.badge}`}>
                        {severityLabel}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{categoryLabel} · {alt.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(alt.status)}`}>
                        {statusLabel}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{alt.issuedAt}</span>
                    </div>
                  </div>

                  <h4 className="font-black text-slate-900 text-base mb-1.5 group-hover:text-blue-600 transition-colors">
                    {isHi ? alt.titleHi : alt.titleEn}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> 
                    {isHi ? alt.locationHi : alt.locationEn}
                  </div>

                  <p className="text-xs text-slate-600 font-medium mb-4 bg-white/80 p-3 rounded-lg border border-slate-100">
                    "{isHi ? alt.descriptionHi : alt.descriptionEn}"
                  </p>

                  <div className="flex justify-end items-center pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {t.viewDetails}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredAlerts.length === 0 && (
              <div className="py-16 text-center text-slate-400 font-medium text-xs">
                {t.noAlertsFound}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DISTRICT PUBLIC SIREN / SMS (White Theme) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-black text-slate-900">{t.panelTitle}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {t.panelSubtitle}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-6 text-xs font-bold mb-5">
              {['Siren Alert', 'SMS Alert', 'Mobile App'].map((tabKey) => {
                const tabLabel = tabKey === 'Siren Alert' ? t.tabSiren : tabKey === 'SMS Alert' ? t.tabSms : t.tabMobile;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setBroadcastTab(tabKey)}
                    className={`pb-2.5 relative transition-colors
                      ${broadcastTab === tabKey ? 'text-blue-600 font-black' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {tabLabel}
                    {broadcastTab === tabKey && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-start gap-3 mb-5">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {t.infoBoxText}
              </p>
            </div>

            {/* Template Selector */}
            <div className="mb-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">
                {t.selectTemplate}
              </label>
              <select
                value={selectedTemplateKey}
                onChange={(e) => {
                  const key = e.target.value;
                  setSelectedTemplateKey(key);
                  setCustomMessage(templates[key] || '');
                }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {Object.keys(templates).map(tpl => (
                  <option key={tpl} value={tpl}>{tpl}</option>
                ))}
              </select>
            </div>

            {/* Custom Message Area */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {t.customMessageOptional}
                </label>
                <span className="text-[10px] font-bold text-slate-400">
                  {customMessage.length} / 500
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={500}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Broadcast Trigger */}
          <div>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4" /> {t.sendAlertBtn}
            </button>
          </div>
        </div>

      </div>

      {/* 15. ALERT IMPACT & REACH CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">{t.impactTitle}</h3>
          <p className="text-xs text-slate-400 font-medium">{t.impactSubtitle}</p>
          
          <div className="grid grid-cols-3 gap-6 mt-4">
            <div>
              <span className="text-2xl font-black text-slate-900 block">24,560</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.peopleInRange}</span>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">18</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.villagesSectors}</span>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">12</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.sirenLocations}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium mt-4">
            {t.auditNote}
          </p>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={() => setShowLogsModal(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <FileText className="w-4 h-4 text-slate-500" /> {t.viewLogsBtn}
          </button>
        </div>
      </div>

      {/* 8. ALERT DETAIL MODAL */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${getSeverityStyle(selectedAlert.severity).badge}`}>
                    {SEVERITY_TRANSLATIONS[selectedAlert.severity]?.[isHi ? 'hi' : 'en']} {t.modalSeverity}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(selectedAlert.status)}`}>
                    {STATUS_TRANSLATIONS[selectedAlert.status]?.[isHi ? 'hi' : 'en']}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{selectedAlert.id} · {CATEGORY_TRANSLATIONS[selectedAlert.category]?.[isHi ? 'hi' : 'en']}</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 leading-tight">
                  {isHi ? selectedAlert.titleHi : selectedAlert.titleEn}
                </h2>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> 
                  {isHi ? selectedAlert.locationHi : selectedAlert.locationEn} ({isHi ? selectedAlert.districtHi : selectedAlert.districtEn})
                </div>
              </div>

              <button 
                onClick={() => setSelectedAlert(null)}
                className="p-1.5 hover:bg-slate-200/70 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 text-xs">
              
              {/* Status Workflow */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="font-bold text-slate-700">{t.modalWorkflowTitle}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(selectedAlert.id, 'ACTIVE')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${selectedAlert.status === 'ACTIVE' ? 'bg-red-600 text-white' : 'bg-white border text-slate-700'}`}
                  >
                    {isHi ? 'सक्रिय' : 'Active'}
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedAlert.id, 'ACKNOWLEDGED')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${selectedAlert.status === 'ACKNOWLEDGED' ? 'bg-amber-600 text-white' : 'bg-white border text-slate-700'}`}
                  >
                    {isHi ? 'स्वीकृत' : 'Acknowledge'}
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedAlert.id, 'RESOLVED')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${selectedAlert.status === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-700'}`}
                  >
                    {isHi ? 'निराकृत' : 'Resolve'}
                  </button>
                </div>
              </div>

              {/* Trigger / Reason */}
              <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl">
                <span className="text-[10px] font-black text-red-800 uppercase tracking-widest block mb-1">{t.modalTriggerReason}</span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {isHi ? selectedAlert.triggerHi : selectedAlert.triggerEn}
                </p>
              </div>

              {/* Key Conditions */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.modalKeyConditions}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.rainfall}</span>
                    <span className="text-sm font-black text-slate-900">{selectedAlert.rainfall}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.soilSat}</span>
                    <span className="text-sm font-black text-slate-900">{selectedAlert.soilSaturation}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.riverLevel}</span>
                    <span className="text-sm font-black text-slate-900">{selectedAlert.riverLevel}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{t.floodRisk}</span>
                    <span className="text-sm font-black text-red-600">{selectedAlert.floodRiskScore} / 100</span>
                  </div>
                </div>
              </div>

              {/* Affected Areas */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{t.affectedAreas}</span>
                <div className="flex flex-wrap gap-2">
                  {(isHi ? selectedAlert.affectedAreasHi : selectedAlert.affectedAreasEn).map((area, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Response */}
              <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-xl">
                <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest block mb-1">{t.recommendedResponse}</span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {isHi ? selectedAlert.recommendedActionHi : selectedAlert.recommendedActionEn}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-3">
                <span>{t.issuedAt} {selectedAlert.issuedAt}</span>
                <span>{t.lastUpdated} {selectedAlert.lastUpdated}</span>
              </div>
            </div>

            {/* Modal Navigation Buttons */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-2">
              <button onClick={() => alert('Navigating to Risk Analysis...')} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors">
                {t.btnRiskAnalysis}
              </button>
              <button onClick={() => alert('Navigating to Sensor Data...')} className="flex-1 py-2 bg-white border text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors">
                {t.btnSensorData}
              </button>
              <button onClick={() => alert('Navigating to Evacuation Routes...')} className="flex-1 py-2 bg-white border text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors">
                {t.btnEvacRoutes}
              </button>
              <button onClick={() => setSelectedAlert(null)} className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-colors">
                {t.btnClose}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 14. CONFIRMATION MODAL FOR BROADCAST */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 animate-slideUp">
            <h3 className="text-lg font-black text-slate-900 mb-4">{t.confirmTitle}</h3>
            
            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{t.confirmAlert}</span>
                <strong className="text-slate-900">{selectedTemplateKey}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{t.confirmRegion}</span>
                <strong className="text-slate-900">{isHi ? 'तपोवन सेक्टर, चमोली' : 'Tapovan Sector, Chamoli'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{t.confirmChannels}</span>
                <strong className="text-slate-900">{t.confirmChannelsList}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{t.confirmReach}</span>
                <strong className="text-red-600 font-black">{t.peopleCount}</strong>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                {t.btnCancel}
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setBroadcastSuccess(true);
                  setTimeout(() => setBroadcastSuccess(false), 5000);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                {t.btnConfirmBroadcast}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Success Banner */}
      {broadcastSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-slideUp text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> {t.broadcastSuccessToast}
        </div>
      )}

      {/* 16. ALERT LOGS MODAL */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 animate-slideUp max-h-[80vh]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">{t.logsTitle}</h3>
              <button onClick={() => setShowLogsModal(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px]">
                    <th className="py-2.5 px-3">{t.thTimestamp}</th>
                    <th className="py-2.5 px-3">{t.thAlertId}</th>
                    <th className="py-2.5 px-3">{t.thChannel}</th>
                    <th className="py-2.5 px-3">{t.thDeliveryStatus}</th>
                    <th className="py-2.5 px-3 text-right">{t.thRecipients}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="py-3 px-3 font-semibold">10:52 PM</td>
                    <td className="py-3 px-3">ALERT-01</td>
                    <td className="py-3 px-3">SMS</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">{isHi ? 'वितरित' : 'Delivered'}</td>
                    <td className="py-3 px-3 text-right font-black">24,560</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">10:52 PM</td>
                    <td className="py-3 px-3">ALERT-01</td>
                    <td className="py-3 px-3">Siren</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">{isHi ? 'सक्रिय' : 'Activated'}</td>
                    <td className="py-3 px-3 text-right font-black">12 {isHi ? 'स्थान' : 'locations'}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">10:53 PM</td>
                    <td className="py-3 px-3">ALERT-01</td>
                    <td className="py-3 px-3">Mobile App</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">{isHi ? 'वितरित' : 'Delivered'}</td>
                    <td className="py-3 px-3 text-right font-black">18,420 {isHi ? 'उपयोगकर्ता' : 'users'}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold">10:45 PM</td>
                    <td className="py-3 px-3">ALERT-02</td>
                    <td className="py-3 px-3">SMS</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">{isHi ? 'वितरित' : 'Delivered'}</td>
                    <td className="py-3 px-3 text-right font-black">14,200</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
              >
                {t.btnCloseLogs}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}