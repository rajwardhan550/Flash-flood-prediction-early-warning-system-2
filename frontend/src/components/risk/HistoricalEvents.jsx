import React, { useState, useMemo } from 'react';
import { 
  History, Search, CloudRain, AlertTriangle, 
  MapPin, X, Info, Droplets, Waves, Users, Map, 
  TrendingUp, Calendar, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'Historical Events',
    subtitle: 'Past flood patterns and disaster impact analysis',
    searchPlaceholder: 'Search event or location...',
    filterAllLocations: 'All Locations',
    filterAllTypes: 'All Event Types',
    filterAllYears: 'All Years',
    filterAllSeverity: 'All Severity',
    totalEvents: 'Total Events',
    recordedThisYear: '+3 this year',
    majorEvents: 'Major Events',
    majorEventsSubtext: '37% of total',
    catastrophicEvents: 'Catastrophic Events',
    catastrophicSubtext: '17% of total',
    mostAffectedRegion: 'Most Affected Region',
    mostAffectedSubtext: 'Highest number of events',
    floodEventsByYear: 'Flood Events by Year',
    severityDistribution: 'Event Severity Distribution',
    eventsWord: 'Events',
    eventsByLocation: 'Events by Location (Top 10)',
    histVsCurrentRisk: 'Historical vs Current Risk Comparison',
    historicalLegend: 'Historical',
    currentLegend: 'Current',
    riskChangeCurrent: 'Risk Change (Current)',
    keyInsightsTitle: 'Key Insights from Historical Data',
    insights: [
      'Most major events occur during June–September.',
      'Flash floods are commonly associated with extreme rainfall, cloudbursts and glacier/lake outburst events.',
      'Chamoli and surrounding regions show recurring flood vulnerability.',
      'Historical records help identify recurring risk patterns.'
    ],
    saferTomorrowTitle: 'Use Historical Insights to Build a Safer Tomorrow',
    saferTomorrowSubtitle: 'Data-driven decisions. Resilient communities.',
    timelineTitle: 'Major Historical Events (Chronological Order)',
    sortLabel: 'Sort:',
    sortOldest: 'Oldest First',
    sortNewest: 'Newest First',
    sortHighestSeverity: 'Highest Severity',
    viewDetails: 'View Details',
    noEventsFound: 'No events match your current filters.',
    modalEventType: 'Event Type',
    modalSeverity: 'Severity',
    triggerCause: 'Trigger / Cause',
    historicalConditions: 'Historical Conditions',
    rainfall: 'Rainfall',
    riverLevel: 'River Level',
    soilSaturation: 'Soil Saturation',
    other: 'Other',
    impact: 'Impact',
    affectedPop: 'Affected Pop:',
    infraDamage: 'Infra Damage:',
    roadsBridges: 'Roads / Bridges:',
    reportedFatalities: 'Reported Fatalities:',
    economicImpact: 'Economic Impact:',
    geographicalContext: 'Geographical Context',
    riverBasin: 'River Basin',
    terrain: 'Terrain',
    vulnerableAreas: 'Vulnerable Areas',
    historicalLessons: 'Historical Lessons',
    compareCurrentRisk: 'Compare with Current Risk',
    close: 'Close',
    peakRisk: 'Peak Risk',
    avgRisk: 'Average Risk',
    recentTrend: 'Recent Trend'
  },
  hi: {
    pageTitle: 'ऐतिहासिक घटनाएं',
    subtitle: 'विगत बाढ़ पैटर्न एवं आपदा प्रभाव विश्लेषण',
    searchPlaceholder: 'घटना या स्थान खोजें...',
    filterAllLocations: 'सभी स्थान',
    filterAllTypes: 'सभी घटना प्रकार',
    filterAllYears: 'सभी वर्ष',
    filterAllSeverity: 'सभी गंभीरता',
    totalEvents: 'कुल घटनाएं',
    recordedThisYear: 'इस वर्ष +3 दर्ज',
    majorEvents: 'प्रमुख घटनाएं',
    majorEventsSubtext: 'कुल का 37%',
    catastrophicEvents: 'विनाशकारी घटनाएं',
    catastrophicSubtext: 'कुल का 17%',
    mostAffectedRegion: 'सर्वाधिक प्रभावित क्षेत्र',
    mostAffectedSubtext: 'सर्वाधिक घटनाएं दर्ज',
    floodEventsByYear: 'वर्ष अनुसार बाढ़ घटनाएं',
    severityDistribution: 'घटना गंभीरता वितरण',
    eventsWord: 'घटनाएं',
    eventsByLocation: 'स्थान अनुसार घटनाएं (शीर्ष 10)',
    histVsCurrentRisk: 'ऐतिहासिक बनाम वर्तमान जोखिम तुलना',
    historicalLegend: 'ऐतिहासिक',
    currentLegend: 'वर्तमान',
    riskChangeCurrent: 'जोखिम बदलाव (वर्तमान)',
    keyInsightsTitle: 'ऐतिहासिक डेटा से मुख्य अंतर्दृष्टि',
    insights: [
      'अधिकांश प्रमुख घटनाएं जून से सितंबर के दौरान घटित होती हैं।',
      'अचानक आई बाढ़ आमतौर पर अत्यधिक वर्षा, बादल फटने और ग्लेशियर/झील टूटने से जुड़ी होती है।',
      'चमोली और आसपास के क्षेत्रों में बार-बार बाढ़ की संवेदनशीलता देखी जाती है।',
      'ऐतिहासिक रिकॉर्ड भविष्य के जोखिम पैटर्न की पहचान करने में सहायता करते हैं।'
    ],
    saferTomorrowTitle: 'सुरक्षित भविष्य के निर्माण हेतु ऐतिहासिक अंतर्दृष्टि का उपयोग',
    saferTomorrowSubtitle: 'डेटा-संचालित निर्णय। आपदा-सक्षम समुदाय।',
    timelineTitle: 'प्रमुख ऐतिहासिक घटनाएं (कालानुक्रमिक क्रम)',
    sortLabel: 'क्रमबद्ध करें:',
    sortOldest: 'पुरातन पहले',
    sortNewest: 'नवीनतम पहले',
    sortHighestSeverity: 'उच्चतम गंभीरता',
    viewDetails: 'विवरण देखें',
    noEventsFound: 'आपके फ़िल्टर से मेल खाने वाली कोई घटना नहीं मिली।',
    modalEventType: 'घटना प्रकार',
    modalSeverity: 'गंभीरता',
    triggerCause: 'उत्प्रेरक / कारण',
    historicalConditions: 'ऐतिहासिक स्थितियां',
    rainfall: 'वर्षा',
    riverLevel: 'नदी जलस्तर',
    soilSaturation: 'मिट्टी की संतृप्ति',
    other: 'अन्य कारक',
    impact: 'आपदा प्रभाव',
    affectedPop: 'प्रभावित जनसंख्या:',
    infraDamage: 'बुनियादी ढांचा क्षति:',
    roadsBridges: 'सड़कें / पुल:',
    reportedFatalities: 'दर्ज जनहानि:',
    economicImpact: 'आर्थिक क्षति:',
    geographicalContext: 'भौगोलिक संदर्भ',
    riverBasin: 'नदी बेसिन',
    terrain: 'भू-भाग एवं स्थलाकृति',
    vulnerableAreas: 'संवेदनशील क्षेत्र',
    historicalLessons: 'ऐतिहासिक सीख',
    compareCurrentRisk: 'वर्तमान जोखिम से तुलना करें',
    close: 'बंद करें',
    peakRisk: 'शिखर जोखिम',
    avgRisk: 'औसत जोखिम',
    recentTrend: 'हालिया रुझान'
  }
};

// ==========================================
// 1. DATA & LOGIC
// ==========================================

const YEARLY_DATA = [
  { year: 2013, count: 2 }, { year: 2014, count: 4 }, { year: 2015, count: 3 },
  { year: 2016, count: 5 }, { year: 2017, count: 2 }, { year: 2018, count: 3 },
  { year: 2019, count: 6 }, { year: 2020, count: 4 }, { year: 2021, count: 8 },
  { year: 2022, count: 6 }, { year: 2023, count: 9 }, { year: 2024, count: 4 }
];

const SEVERITY_DISTRIBUTION = [
  { labelEn: 'Extreme', labelHi: 'अत्यधिक', count: 4, pct: 17, color: 'text-red-500', bg: 'bg-red-500' },
  { labelEn: 'High', labelHi: 'उच्च', count: 8, pct: 33, color: 'text-orange-500', bg: 'bg-orange-500' },
  { labelEn: 'Medium', labelHi: 'मध्यम', count: 7, pct: 29, color: 'text-amber-500', bg: 'bg-amber-500' },
  { labelEn: 'Low', labelHi: 'निम्न', count: 5, pct: 21, color: 'text-emerald-500', bg: 'bg-emerald-500' }
];

const LOCATION_DATA = [
  { nameEn: 'Chamoli', nameHi: 'चमोली', count: 8 }, 
  { nameEn: 'Joshimath', nameHi: 'जोशीमठ', count: 5 }, 
  { nameEn: 'Kedarnath', nameHi: 'केदारनाथ', count: 4 },
  { nameEn: 'Badrinath', nameHi: 'बद्रीनाथ', count: 4 }, 
  { nameEn: 'Gopeshwar', nameHi: 'गोपेश्वर', count: 3 }, 
  { nameEn: 'Karnaprayag', nameHi: 'कर्णप्रयाग', count: 3 },
  { nameEn: 'Helang', nameHi: 'हेलांग', count: 2 }, 
  { nameEn: 'Pipalkoti', nameHi: 'पीपलकोटी', count: 2 }, 
  { nameEn: 'Mana', nameHi: 'माणा', count: 2 },
  { nameEn: 'Rudraprayag', nameHi: 'रुद्रप्रयाग', count: 2 }
];

const COMPARISON_DATA = [
  { metricKey: 'peakRisk', hist: 91, curr: 82 },
  { metricKey: 'avgRisk', hist: 52, curr: 64 },
  { metricKey: 'recentTrend', hist: 48, curr: 82 }
];

const TIMELINE_EVENTS = [
  {
    id: 1, 
    dateEn: '16 JUN 2013', 
    dateHi: '16 जून 2013',
    timestamp: 20130616, 
    nameEn: 'Kedarnath Floods', 
    nameHi: 'केदारनाथ महाबाढ़',
    locationEn: 'Mandakini River, Rudraprayag', 
    locationHi: 'मंदाकिनी नदी, रुद्रप्रयाग',
    typeEn: 'Flash Flood', 
    typeHi: 'अचानक बाढ़',
    severityEn: 'CATASTROPHIC', 
    severityHi: 'विनाशकारी',
    severityScore: 98,
    descEn: 'Cloudbursts and the breaching of Chorabari Lake caused severe flooding.',
    descHi: 'बादल फटने और चोराबाड़ी झील के टूटने से भयंकर जलप्रलय और बाढ़ आई।',
    triggerEn: 'Multiday Extreme Cloudburst & Chorabari Lake Breach',
    triggerHi: 'कई दिनों की अत्यधिक मूसलाधार बारिश एवं चोराबाड़ी हिमनद झील का टूटना',
    conditions: { 
      rain: '375 mm / 48h', 
      riverEn: '+4.5 m (Extreme Surge)', 
      riverHi: '+4.5 मी (अत्यधिक उफान)',
      soil: '100%', 
      otherEn: 'Rapid glacial melt',
      otherHi: 'तीव्र ग्लेशियर पिघलन'
    },
    impact: { 
      popEn: 'Over 100,000 evacuated regionally', 
      popHi: 'क्षेत्र भर से 1,00,000 से अधिक लोगों को सुरक्षित निकाला गया',
      infraEn: 'Total destruction of riverside properties', 
      infraHi: 'नदी किनारे की संपत्तियों और अवसंरचना का पूर्ण विनाश',
      roadsEn: 'Highway 107 washed away', 
      roadsHi: 'राष्ट्रीय राजमार्ग 107 पूरी तरह बह गया',
      deathsEn: '5,000+ estimated regionally', 
      deathsHi: 'क्षेत्रीय स्तर पर 5,000 से अधिक अनुमानित जनहानि',
      econEn: 'Catastrophic local economic collapse',
      econHi: 'स्थानीय अर्थव्यवस्था को अपूरणीय क्षति'
    },
    geo: { 
      basinEn: 'Upper Mandakini / Alaknanda', 
      basinHi: 'ऊपरी मंदाकिनी / अलकनंदा बेसिन',
      terrainEn: 'Steep V-shaped valley', 
      terrainHi: 'अत्यधिक तीव्र ढलान वाली V-आकार घाटी',
      vulnEn: 'Riverbed settlements completely exposed',
      vulnHi: 'नदी के प्राकृतिक तल में बसे निर्माण सीधे बाढ़ की चपेट में'
    },
    lessonsEn: 'Strict regulation of riverbed construction and implementation of automated glacial lake monitoring are absolute necessities.',
    lessonsHi: 'नदी किनारे निर्माण कार्यों का सख्त नियमन और स्वचालित हिमनद झील पूर्व-चेतावनी प्रणाली स्थापित करना अनिवार्य है।'
  },
  {
    id: 2, 
    dateEn: '07 FEB 2021', 
    dateHi: '07 फरवरी 2021',
    timestamp: 20210207, 
    nameEn: 'Chamoli Disaster', 
    nameHi: 'चमोली आपदा',
    locationEn: 'Rishi Ganga & Dhauliganga, Chamoli', 
    locationHi: 'ऋषि गंगा एवं धौलीगंगा, चमोली',
    typeEn: 'Flash Flood', 
    typeHi: 'अचानक बाढ़',
    severityEn: 'SEVERE', 
    severityHi: 'अति गंभीर',
    severityScore: 88,
    descEn: 'A major flash-flood event caused severe impacts in the region.',
    descHi: 'एक बड़े जलप्रलय ने क्षेत्र में भारी तबाही मचाई।',
    triggerEn: 'Massive rock and ice avalanche from Nanda Devi glacier',
    triggerHi: 'नंदा देवी चोटी से भारी चट्टान और बर्फ के हिमस्खलन का गिरना',
    conditions: { 
      rain: '0 mm (Dry Winter)', 
      riverEn: '+15 m (Debris Surge)', 
      riverHi: '+15 मी (मलबे का उफान)',
      soil: 'Frozen', 
      otherEn: 'Massive kinetic energy release',
      otherHi: 'विशाल गतिज ऊर्जा और मलबे का प्रवाह'
    },
    impact: { 
      popEn: 'Local laborers and valley residents affected', 
      popHi: 'परियोजना कर्मी एवं घाटी के ग्रामीण गंभीर रूप से प्रभावित',
      infraEn: 'Tapovan Vishnugad & Rishi Ganga Hydropower projects destroyed', 
      infraHi: 'तपोवन विष्णुगाड और ऋषि गंगा जलविद्युत परियोजनाएं ध्वस्त',
      roadsEn: 'Multiple valley bridges obliterated', 
      roadsHi: 'घाटी के कई मुख्य संपर्क पुल बह गए',
      deathsEn: '200+ confirmed/missing', 
      deathsHi: '200 से अधिक हताहत एवं लापता',
      econEn: 'Multi-million dollar infrastructure loss',
      econHi: 'करोड़ों रुपये की बुनियादी ढांचागत क्षति'
    },
    geo: { 
      basinEn: 'Dhauliganga / Alaknanda', 
      basinHi: 'धौलीगंगा / अलकनंदा जलक्षेत्र',
      terrainEn: 'Deep gorge, high velocity conduit', 
      terrainHi: 'गहरी संकरी घाटी, तीव्र प्रवाह मार्ग',
      vulnEn: 'Infrastructure built directly in historical floodpath',
      vulnHi: 'ऐतिहासिक बाढ़ मार्ग में स्थित परियोजना स्थल'
    },
    lessonsEn: 'Cryospheric hazards can occur independent of weather. Seismic and high-altitude monitoring is as critical as rainfall tracking.',
    lessonsHi: 'हिमनद खतरे मौसम से स्वतंत्र रूप से भी हो सकते हैं। उच्च पर्वतीय क्षेत्रों में सिस्मिक और उपग्रह निगरानी वर्षा ट्रैकिंग जितनी ही महत्वपूर्ण है।'
  },
  {
    id: 3, 
    dateEn: '20 JAN 2023', 
    dateHi: '20 जनवरी 2023',
    timestamp: 20230120, 
    nameEn: 'Joshimath Landslide', 
    nameHi: 'जोशीमठ भू-धंसाव',
    locationEn: 'Joshimath, Chamoli', 
    locationHi: 'जोशीमठ, चमोली',
    typeEn: 'Landslide', 
    typeHi: 'भूस्खलन / धंसाव',
    severityEn: 'HIGH', 
    severityHi: 'उच्च',
    severityScore: 72,
    descEn: 'Slope instability and land subsidence caused structural damage.',
    descHi: 'पहाड़ी ढलान में अस्थिरता और जमीन धंसने से भवनों को भारी क्षति हुई।',
    triggerEn: 'Aquifer puncture and long-term slope toe erosion',
    triggerHi: 'भूमिगत जल स्रोत का फूटना एवं अलकनंदा द्वारा तल का दीर्घकालिक कटाव',
    conditions: { 
      rain: 'Normal', 
      riverEn: 'Normal flow', 
      riverHi: 'सामान्य प्रवाह',
      soil: 'Subsurface Saturation', 
      otherEn: 'Unplanned construction load',
      otherHi: 'अत्यधिक निर्माण भार'
    },
    impact: { 
      popEn: 'Thousands relocated to relief camps', 
      popHi: 'हजारों निवासियों को राहत शिविरों में स्थानांतरित किया गया',
      infraEn: '800+ buildings developed severe structural cracks', 
      infraHi: '800 से अधिक मकानों और होटलों में गहरी दरारें',
      roadsEn: 'Auli ropeway and border roads threatened', 
      roadsHi: 'औली रोपवे और सीमांत रणनीतिक सड़कें खतरे में',
      deathsEn: '0 (preventive evacuation)', 
      deathsHi: 'शून्य (समय पर सुरक्षित निकासी के कारण)',
      econEn: 'Massive relocation costs',
      econHi: 'विस्थापन और पुनर्वास का भारी आर्थिक प्रभाव'
    },
    geo: { 
      basinEn: 'Alaknanda Left Bank', 
      basinHi: 'अलकनंदा बायां तट',
      terrainEn: 'Historical landslide debris slope', 
      terrainHi: 'प्राचीन भूस्खलन के मलबे पर स्थित ढलान',
      vulnEn: 'Entire town sector sits on unstable moraine',
      vulnHi: 'कच्चे और असंगठित पत्थरों पर बसा नगर'
    },
    lessonsEn: 'Strict carrying-capacity limits and subsurface hydrological mapping must dictate future urban planning in alpine zones.',
    lessonsHi: 'पर्वतीय नगरों में भार वहन क्षमता (Carrying Capacity) और भूमिगत जल अध्ययन के अनुसार ही निर्माण की अनुमति दी जानी चाहिए।'
  },
  {
    id: 4, 
    dateEn: '30 JUL 2024', 
    dateHi: '30 जुलाई 2024',
    timestamp: 20240730, 
    nameEn: 'Helang Flash Flood', 
    nameHi: 'हेलांग अचानक बाढ़',
    locationEn: 'Helang, Chamoli', 
    locationHi: 'हेलांग, चमोली',
    typeEn: 'Flash Flood', 
    typeHi: 'अचानक बाढ़',
    severityEn: 'HIGH', 
    severityHi: 'उच्च',
    severityScore: 75,
    descEn: 'Intense rainfall triggered flash flooding in the region.',
    descHi: 'अत्यधिक मूसलाधार बारिश ने क्षेत्र में अचानक बाढ़ ला दी।',
    triggerEn: 'Localized extreme precipitation (Cloudburst)',
    triggerHi: 'स्थानीय स्तर पर अचानक बादल फटना (अत्यधिक वर्षा)',
    conditions: { 
      rain: '115 mm / 3h', 
      riverEn: '+1.8 m', 
      riverHi: '+1.8 मी',
      soil: '92%', 
      otherEn: 'Pre-saturated slopes',
      otherHi: 'पहले से संतृप्त मिट्टी'
    },
    impact: { 
      popEn: 'Hundreds of travelers stranded', 
      popHi: 'सैकड़ों तीर्थयात्री और वाहन मार्ग में फंसे',
      infraEn: 'Retaining walls and small culverts destroyed', 
      infraHi: 'सुरक्षा दीवारें और पुलिया मलबे में तब्दील',
      roadsEn: 'Badrinath National Highway blocked for 3 days', 
      roadsHi: 'बद्रीनाथ राष्ट्रीय राजमार्ग 3 दिनों तक पूरी तरह अवरुद्ध',
      deathsEn: '0 reported', 
      deathsHi: 'कोई जनहानि नहीं',
      econEn: 'Tourism revenue disrupted',
      econHi: 'यात्रा और स्थानीय व्यापार बाधित'
    },
    geo: { 
      basinEn: 'Alaknanda Main Stem', 
      basinHi: 'अलकनंदा मुख्य प्रवाह',
      terrainEn: 'Narrow transport corridor', 
      terrainHi: 'संकरा पहाड़ी परिवहन गलियारा',
      vulnEn: 'Highway cut into highly fractured rock',
      vulnHi: 'अत्यधिक विखंडित चट्टानों पर स्थित सड़क'
    },
    lessonsEn: 'Micro-basin scale radar is necessary; regional forecasts often fail to capture localized intense cloudbursts.',
    lessonsHi: 'सूक्ष्म-बेसिन स्तर पर रडार अनिवार्य है; क्षेत्रीय पूर्वानुमान अक्सर स्थानीय बादल फटने को पकड़ने में चूक जाते हैं।'
  }
];

const getSeverityStyle = (severity) => {
  const s = String(severity).toUpperCase();
  if (s.includes('EXTREME') || s.includes('CATASTROPHIC') || s.includes('SEVERE') || s.includes('विनाशकारी') || s.includes('अति गंभीर')) {
    return 'bg-red-100 text-red-700 border-red-200';
  }
  if (s.includes('HIGH') || s.includes('उच्च')) {
    return 'bg-orange-100 text-orange-700 border-orange-200';
  }
  if (s.includes('MEDIUM') || s.includes('MODERATE') || s.includes('मध्यम')) {
    return 'bg-amber-100 text-amber-700 border-amber-200';
  }
  return 'bg-emerald-100 text-emerald-700 border-emerald-200';
};

const getSeverityColor = (severity) => {
  const s = String(severity).toUpperCase();
  if (s.includes('EXTREME') || s.includes('CATASTROPHIC') || s.includes('SEVERE') || s.includes('विनाशकारी') || s.includes('अति गंभीर')) {
    return 'bg-red-500';
  }
  if (s.includes('HIGH') || s.includes('उच्च')) {
    return 'bg-orange-500';
  }
  if (s.includes('MEDIUM') || s.includes('MODERATE') || s.includes('मध्यम')) {
    return 'bg-amber-500';
  }
  return 'bg-emerald-500';
};

export default function HistoricalEvents() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('All Locations');
  const [filterType, setFilterType] = useState('All Event Types');
  const [filterYear, setFilterYear] = useState('All Years');
  const [filterSeverity, setFilterSeverity] = useState('All Severity');
  const [sortOrder, setSortOrder] = useState('Oldest First');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filter & Sort Logic
  const processedEvents = useMemo(() => {
    let result = [...TIMELINE_EVENTS];
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.nameEn.toLowerCase().includes(q) || 
        e.nameHi.toLowerCase().includes(q) ||
        e.locationEn.toLowerCase().includes(q) ||
        e.locationHi.toLowerCase().includes(q)
      );
    }
    
    // Sort
    if (sortOrder === 'Oldest First') result.sort((a, b) => a.timestamp - b.timestamp);
    if (sortOrder === 'Newest First') result.sort((a, b) => b.timestamp - a.timestamp);
    if (sortOrder === 'Highest Severity') result.sort((a, b) => b.severityScore - a.severityScore);

    return result;
  }, [searchQuery, sortOrder]);

  return (
    <div className="flex flex-col gap-8 w-full h-full pb-14 animate-fadeIn">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-900">{t.pageTitle}</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="bg-white border border-gray-300 text-gray-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>{t.filterAllLocations}</option>
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-white border border-gray-300 text-gray-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>{t.filterAllTypes}</option>
          </select>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="bg-white border border-gray-300 text-gray-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>{t.filterAllYears}</option>
          </select>
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="bg-white border border-gray-300 text-gray-700 font-bold text-xs py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>{t.filterAllSeverity}</option>
          </select>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl border border-blue-100 shadow-sm p-5">
          <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1 block">{t.totalEvents}</span>
          <div className="text-3xl font-black text-gray-900">24</div>
          <div className="mt-3 text-[10px] font-bold text-gray-500">{t.recordedThisYear}</div>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-100 shadow-sm p-5">
          <span className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-1 block">{t.majorEvents}</span>
          <div className="text-3xl font-black text-gray-900">9</div>
          <div className="mt-3 text-[10px] font-bold text-gray-500">{t.majorEventsSubtext}</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-100 shadow-sm p-5">
          <span className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-1 block">{t.catastrophicEvents}</span>
          <div className="text-3xl font-black text-gray-900">4</div>
          <div className="mt-3 text-[10px] font-bold text-gray-500">{t.catastrophicSubtext}</div>
        </div>
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm p-5">
          <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-1 block">{t.mostAffectedRegion}</span>
          <div className="text-xl font-black text-gray-900 leading-tight mt-1 truncate">{isHi ? 'चमोली' : 'Chamoli'}</div>
          <div className="mt-4 text-[10px] font-bold text-gray-500">{t.mostAffectedSubtext}</div>
        </div>
      </div>

      {/* 3. HISTORICAL ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Flood Events by Year (Vertical Bar Chart) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">{t.floodEventsByYear}</h3>
          <div className="flex-1 flex items-end justify-between gap-1 mt-4">
            {YEARLY_DATA.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 group">
                <span className="text-[10px] font-bold text-gray-900 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{d.count}</span>
                <div className="w-full max-w-[24px] bg-blue-100 group-hover:bg-blue-500 rounded-t-sm transition-colors" style={{ height: `${(d.count / 9) * 140}px` }}></div>
                <span className="text-[9px] font-bold text-gray-400 mt-2 -rotate-45 sm:rotate-0 origin-top-left sm:origin-center">{d.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Severity Distribution (Donut Chart) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="w-full lg:w-auto">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">{t.severityDistribution}</h3>
            <div className="flex flex-col gap-3 w-full max-w-[200px]">
              {SEVERITY_DISTRIBUTION.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <div className={`w-2.5 h-2.5 rounded-sm ${d.bg}`}></div> {isHi ? d.labelHi : d.labelEn}
                  </div>
                  <span className="text-xs font-black text-gray-900">{d.count} <span className="text-gray-400 font-medium">({d.pct}%)</span></span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative w-40 h-40 flex-shrink-0">
            <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f3f4f6" strokeWidth="6"></circle>
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ef4444" strokeWidth="6" strokeDasharray="17 83" strokeDashoffset="25"></circle>
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f97316" strokeWidth="6" strokeDasharray="33 67" strokeDashoffset="8"></circle>
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="29 71" strokeDashoffset="-25"></circle>
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="21 79" strokeDashoffset="-54"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-gray-900 leading-none">24</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{t.eventsWord}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. LOCATION ANALYSIS (Horizontal Bar Chart) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">{t.eventsByLocation}</h3>
        <div className="flex flex-col gap-3">
          {LOCATION_DATA.map((d, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-28 text-xs font-bold text-gray-700 truncate text-right">
                {isHi ? d.nameHi : d.nameEn}
              </span>
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 h-5 bg-gray-50 rounded-r overflow-hidden flex">
                  <div className="h-full bg-blue-500 rounded-r transition-all" style={{ width: `${(d.count / 8) * 100}%` }}></div>
                </div>
                <span className="w-6 text-xs font-black text-gray-900">{d.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HISTORICAL VS CURRENT RISK (Grouped Bar Chart) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{t.histVsCurrentRisk}</h3>
          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase">
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-gray-300 rounded-sm"></div> {t.historicalLegend}</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div> {t.currentLegend}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 h-48 items-end border-b border-gray-200 pb-2">
          {COMPARISON_DATA.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1 h-full relative group">
              <div className="absolute -top-6 flex gap-4 w-full justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-black text-gray-600">{d.hist}</span>
                <span className="text-[10px] font-black text-blue-600">{d.curr}</span>
              </div>
              <div className="flex items-end justify-center gap-1 w-full h-full mt-auto">
                <div className="w-8 md:w-12 bg-gray-300 rounded-t-sm" style={{ height: `${d.hist}%` }}></div>
                <div className="w-8 md:w-12 bg-blue-600 rounded-t-sm" style={{ height: `${d.curr}%` }}></div>
              </div>
              <span className="absolute -bottom-8 text-[10px] font-bold text-gray-500 uppercase text-center w-full truncate">
                {t[d.metricKey] || d.metricKey}
              </span>
            </div>
          ))}
          
          {/* Risk Change Custom Block */}
          <div className="flex flex-col items-center justify-center flex-1 h-full pb-8">
            <span className="text-3xl font-black text-red-600 mb-1">+13%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">{t.riskChangeCurrent}</span>
          </div>
        </div>
        <div className="h-8"></div>
      </div>

      {/* 6. KEY INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">{t.keyInsightsTitle}</h3>
          <ul className="space-y-3">
            {t.insights.map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                <span className="text-sm font-medium text-gray-700 leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 rounded-2xl border border-blue-100 shadow-sm p-6 flex flex-col justify-center text-center">
          <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-3">{t.saferTomorrowTitle}</h3>
          <p className="text-sm font-medium text-blue-700">{t.saferTomorrowSubtitle}</p>
        </div>
      </div>

      {/* 7 & 8. HISTORICAL EVENT TIMELINE */}
      <div>
        <div className="flex justify-between items-end mb-8">
          <h3 className="text-lg font-black text-gray-900">{t.timelineTitle}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.sortLabel}</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 font-bold text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Oldest First">{t.sortOldest}</option>
              <option value="Newest First">{t.sortNewest}</option>
              <option value="Highest Severity">{t.sortHighestSeverity}</option>
            </select>
          </div>
        </div>

        {/* Timeline Structure */}
        <div className="relative ml-[100px] md:ml-[140px]">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>

          {processedEvents.map((event) => (
            <div key={event.id} className="relative flex items-start mb-10 group cursor-pointer" onClick={() => setSelectedEvent(event)}>
              
              {/* LEFT: Date */}
              <div className="absolute right-[100%] mr-6 md:mr-10 w-28 text-right pt-4">
                <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
                  {isHi ? event.dateHi : event.dateEn}
                </span>
              </div>

              {/* CENTER: Marker */}
              <div className={`absolute left-[-6px] top-5 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-150 ${getSeverityColor(event.severityEn)} z-10`}></div>

              {/* RIGHT: Event Information */}
              <div className="pl-8 md:pl-10 flex-1">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-5 w-full">
                  
                  <h4 className="text-lg font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {isHi ? event.nameHi : event.nameEn}
                  </h4>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> 
                    {isHi ? event.locationHi : event.locationEn}
                  </div>
                  
                  <p className="text-sm text-gray-600 font-medium mb-4">
                    {isHi ? event.descHi : event.descEn}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200">
                        [{isHi ? event.typeHi : event.typeEn}]
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${getSeverityStyle(event.severityEn)}`}>
                        [{isHi ? event.severityHi : event.severityEn}]
                      </span>
                    </div>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {t.viewDetails} <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>

                </div>
              </div>
            </div>
          ))}
          
          {processedEvents.length === 0 && (
            <div className="pl-10 text-sm font-bold text-gray-400 py-10">{t.noEventsFound}</div>
          )}
        </div>
      </div>

      {/* 9. EVENT DETAILS POPUP MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gray-50">
              <div className="pr-4">
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                  {isHi ? selectedEvent.nameHi : selectedEvent.nameEn}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0"/> {isHi ? selectedEvent.dateHi : selectedEvent.dateEn}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0"/> {isHi ? selectedEvent.locationHi : selectedEvent.locationEn}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              {/* Type & Severity */}
              <div className="flex gap-3">
                <span className="px-3 py-1.5 rounded-lg text-[10px] font-black text-gray-700 bg-gray-100 border border-gray-200 uppercase tracking-widest">
                  {t.modalEventType}: {isHi ? selectedEvent.typeHi : selectedEvent.typeEn}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getSeverityStyle(selectedEvent.severityEn)}`}>
                  {t.modalSeverity}: {isHi ? selectedEvent.severityHi : selectedEvent.severityEn}
                </span>
              </div>

              {/* Trigger */}
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                <span className="text-[10px] font-black text-red-800 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {t.triggerCause}
                </span>
                <p className="text-sm font-bold text-gray-900">
                  {isHi ? selectedEvent.triggerHi : selectedEvent.triggerEn}
                </p>
              </div>

              {/* Historical Conditions */}
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block border-b border-gray-100 pb-2">
                  {t.historicalConditions}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">{t.rainfall}</span>
                    <span className="text-sm font-black text-gray-900">{selectedEvent.conditions.rain}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">{t.riverLevel}</span>
                    <span className="text-sm font-black text-gray-900">
                      {isHi ? selectedEvent.conditions.riverHi : selectedEvent.conditions.riverEn}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">{t.soilSaturation}</span>
                    <span className="text-sm font-black text-gray-900">{selectedEvent.conditions.soil}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">{t.other}</span>
                    <span className="text-sm font-black text-gray-900">
                      {isHi ? selectedEvent.conditions.otherHi : selectedEvent.conditions.otherEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block border-b border-gray-100 pb-2">
                  {t.impact}
                </span>
                <ul className="space-y-2 text-sm text-gray-700 font-medium">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></div>
                    <span className="font-bold w-36">{t.affectedPop}</span> 
                    <span>{isHi ? selectedEvent.impact.popHi : selectedEvent.impact.popEn}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></div>
                    <span className="font-bold w-36">{t.infraDamage}</span> 
                    <span>{isHi ? selectedEvent.impact.infraHi : selectedEvent.impact.infraEn}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></div>
                    <span className="font-bold w-36">{t.roadsBridges}</span> 
                    <span>{isHi ? selectedEvent.impact.roadsHi : selectedEvent.impact.roadsEn}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800 mt-1.5 flex-shrink-0"></div>
                    <span className="font-bold w-36">{t.reportedFatalities}</span> 
                    <span>{isHi ? selectedEvent.impact.deathsHi : selectedEvent.impact.deathsEn}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <span className="font-bold w-36">{t.economicImpact}</span> 
                    <span>{isHi ? selectedEvent.impact.econHi : selectedEvent.impact.econEn}</span>
                  </li>
                </ul>
              </div>

              {/* Geographical Context */}
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block border-b border-gray-100 pb-2">
                  {t.geographicalContext}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">{t.riverBasin}</span>
                    <span className="text-xs font-bold text-gray-900">
                      {isHi ? selectedEvent.geo.basinHi : selectedEvent.geo.basinEn}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">{t.terrain}</span>
                    <span className="text-xs font-bold text-gray-900">
                      {isHi ? selectedEvent.geo.terrainHi : selectedEvent.geo.terrainEn}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">{t.vulnerableAreas}</span>
                    <span className="text-xs font-bold text-gray-900">
                      {isHi ? selectedEvent.geo.vulnHi : selectedEvent.geo.vulnEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Historical Lessons */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-2">
                <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" /> {t.historicalLessons}
                </span>
                <p className="text-sm font-medium text-blue-900 leading-relaxed">
                  {isHi ? selectedEvent.lessonsHi : selectedEvent.lessonsEn}
                </p>
              </div>

            </div>

            {/* Modal Bottom Buttons */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm shadow-xs">
                <TrendingUp className="w-4 h-4" /> {t.compareCurrentRisk}
              </button>
              <button onClick={() => setSelectedEvent(null)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold rounded-xl transition-colors text-sm">
                {t.close}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}