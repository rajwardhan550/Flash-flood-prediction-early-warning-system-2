import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Activity, ShieldAlert, CloudRain, Droplets, Waves, 
  MapPin, AlertTriangle, ChevronDown, CheckCircle2, Clock, 
  BarChart2, Target, Zap, Server
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    pageTitle: 'Risk Analysis & Trends',
    subtitle: 'Historical and predictive flood-risk intelligence',
    timeRange7d: 'Time Range: 7 Days',
    liveData: 'Live Data',
    currentRisk: 'Current Risk',
    change: 'Change',
    trend: 'Trend',
    avg7Day: '7-Day Average',
    currentVsAvg: 'Current vs avg',
    points: 'points',
    predictionConfidence: 'Prediction Confidence',
    modelReliable: 'Model Reliable',
    alertStatus: 'Alert Status',
    lastUpdated: 'Last updated: 10:53 PM',
    trajectoryTitle: '7-Day Flood Risk Trajectory',
    rainfallVsRisk: 'Rainfall vs Flood Risk',
    rainfallMm: 'Rainfall (mm)',
    riskScore: 'Risk Score',
    hydrologicalConditions: 'Hydrological Conditions',
    soilSatPct: 'Soil Saturation (%)',
    riverLevelM: 'River Level (m)',
    keyRiskContributors: 'Key Risk Contributors',
    next72hForecast: 'Next 72-Hour Risk Forecast',
    predictedZone: 'Predicted Zone',
    forecastWord: 'Forecast',
    riskWord: 'Risk',
    rainWord: 'Rain',
    riverWord: 'River',
    historicalComparison: 'Historical Risk Comparison',
    aiAssessmentTitle: 'AI Risk Assessment',
    primaryDrivers: 'Primary Drivers',
    riskTrend: 'Risk Trend',
    predictedPeak: 'Predicted Peak',
    expectedWindow: 'Expected Window',
    highExtremeLocations: 'High & Extreme Risk Locations',
    rain24hUnit: 'mm/24h',
    currentRiskLabel: 'Current Risk',
    sevenDayAvgLabel: '7-Day Average',
    thirtyDayAvgLabel: '30-Day Average',
    seasonalAvgLabel: 'Seasonal Average',
    historicalPeakLabel: 'Historical Peak'
  },
  hi: {
    pageTitle: 'जोखिम विश्लेषण एवं रुझान',
    subtitle: 'ऐतिहासिक एवं भविष्यसूचक बाढ़-जोखिम विश्लेषण',
    timeRange7d: 'समय सीमा: 7 दिन',
    liveData: 'लाइव डेटा',
    currentRisk: 'वर्तमान जोखिम',
    change: 'बदलाव',
    trend: 'रुझान',
    avg7Day: '7-दिवसीय औसत',
    currentVsAvg: 'वर्तमान बनाम औसत',
    points: 'अंक',
    predictionConfidence: 'पूर्वानुमान सटीकता',
    modelReliable: 'मॉडल विश्वसनीय',
    alertStatus: 'अलर्ट स्थिति',
    lastUpdated: 'अंतिम अपडेट: 10:53 PM',
    trajectoryTitle: '7-दिवसीय बाढ़ जोखिम प्रक्षेपवक्र (Trajectory)',
    rainfallVsRisk: 'वर्षा बनाम बाढ़ जोखिम',
    rainfallMm: 'वर्षा (मिमी)',
    riskScore: 'जोखिम स्कोर',
    hydrologicalConditions: 'जल विज्ञान संबंधी स्थितियां',
    soilSatPct: 'मिट्टी की संतृप्ति (%)',
    riverLevelM: 'नदी का जलस्तर (मी)',
    keyRiskContributors: 'प्रमुख जोखिम कारक',
    next72hForecast: 'अगले 72 घंटे का जोखिम पूर्वानुमान',
    predictedZone: 'पूर्वानुमान क्षेत्र',
    forecastWord: 'पूर्वानुमान',
    riskWord: 'जोखिम',
    rainWord: 'वर्षा',
    riverWord: 'नदी',
    historicalComparison: 'ऐतिहासिक जोखिम तुलना',
    aiAssessmentTitle: 'एआई जोखिम मूल्यांकन',
    primaryDrivers: 'मुख्य संचालक',
    riskTrend: 'जोखिम रुझान',
    predictedPeak: 'अपेक्षित शीर्ष',
    expectedWindow: 'संभावित समय सीमा',
    highExtremeLocations: 'उच्च एवं अत्यधिक जोखिम वाले स्थान',
    rain24hUnit: 'मिमी/24घंटे',
    currentRiskLabel: 'वर्तमान जोखिम',
    sevenDayAvgLabel: '7-दिवसीय औसत',
    thirtyDayAvgLabel: '30-दिवसीय औसत',
    seasonalAvgLabel: 'मौसमी औसत',
    historicalPeakLabel: 'ऐतिहासिक शिखर'
  }
};

const DAYS_HI = { Mon: 'सोम', Tue: 'मंगल', Wed: 'बुध', Thu: 'गुरु', Fri: 'शुक्र', Sat: 'शनि', Sun: 'रवि' };

// ==========================================
// 1. RISK LOGIC & STYLING ENGINE
// ==========================================
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
  if (score >= 75) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', fill: 'bg-red-500', stroke: '#ef4444' };
  if (score >= 50) return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', fill: 'bg-orange-500', stroke: '#f97316' };
  if (score >= 25) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', fill: 'bg-amber-500', stroke: '#f59e0b' };
  return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', fill: 'bg-emerald-500', stroke: '#10b981' };
};

// ==========================================
// 2. MOCK DATABASE (Bilingual summaries & labels)
// ==========================================
const MOCK_DATA = [
  {
    id: 1, 
    nameEn: 'Chamoli (Main Town)', 
    nameHi: 'चमोली (मुख्य नगर)', 
    currentRisk: 82, 
    riskChange: '+13%', 
    avg7Day: 64, 
    confidence: 94, 
    alertStatusEn: 'ACTIVE',
    alertStatusHi: 'सक्रिय',
    alertTextEn: 'Heavy rainfall warning',
    alertTextHi: 'भारी बारिश की चेतावनी',
    trajectory: [
      { day: 'Mon', risk: 32, rain: 35, soil: 62, river: '+0.2m' }, 
      { day: 'Tue', risk: 38, rain: 48, soil: 68, river: '+0.4m' },
      { day: 'Wed', risk: 51, rain: 62, soil: 72, river: '+0.5m' }, 
      { day: 'Thu', risk: 57, rain: 74, soil: 79, river: '+0.7m' },
      { day: 'Fri', risk: 82, rain: 112, soil: 88, river: '+1.2m' }, 
      { day: 'Sat', risk: 78, rain: 96, soil: 84, river: '+1.0m' },
      { day: 'Sun', risk: 88, rain: 128, soil: 91, river: '+1.5m' }
    ],
    forecast72h: [
      { time: 'NOW', timeHi: 'अभी', risk: 82, rain: 15, river: '+1.2m' }, 
      { time: '+6H', timeHi: '+6 घंटे', risk: 84, rain: 22, river: '+1.3m' },
      { time: '+12H', timeHi: '+12 घंटे', risk: 88, rain: 35, river: '+1.5m' }, 
      { time: '+24H', timeHi: '+24 घंटे', risk: 81, rain: 18, river: '+1.4m' },
      { time: '+48H', timeHi: '+48 घंटे', risk: 69, rain: 5, river: '+0.9m' }, 
      { time: '+72H', timeHi: '+72 घंटे', risk: 54, rain: 0, river: '+0.5m' }
    ],
    contributors: [
      { nameEn: 'Rainfall', nameHi: 'वर्षा', impact: 92, levelEn: 'CRITICAL IMPACT', levelHi: 'अत्यधिक प्रभाव' }, 
      { nameEn: 'Soil Saturation', nameHi: 'मिट्टी की संतृप्ति', impact: 88, levelEn: 'HIGH IMPACT', levelHi: 'उच्च प्रभाव' },
      { nameEn: 'River Level', nameHi: 'नदी का जलस्तर', impact: 72, levelEn: 'HIGH IMPACT', levelHi: 'उच्च प्रभाव' }, 
      { nameEn: 'Terrain / Slope', nameHi: 'ढलान एवं स्थलाकृति', impact: 61, levelEn: 'MODERATE IMPACT', levelHi: 'मध्यम प्रभाव' },
      { nameEn: 'Historical Pattern', nameHi: 'ऐतिहासिक पैटर्न', impact: 42, levelEn: 'LOW IMPACT', levelHi: 'निम्न प्रभाव' }
    ],
    historical: { current: 82, avg7: 64, avg30: 52, seasonal: 48, peak: 91 },
    aiAssessment: {
      textEn: 'Flash-flood risk is increasing due to persistent heavy rainfall, high soil saturation, and rising river levels. The model predicts elevated risk during the next 24 hours, particularly in vulnerable low-lying and drainage-constrained areas.',
      textHi: 'लगातार भारी बारिश, अत्यधिक मिट्टी संतृप्ति और बढ़ते नदी स्तर के कारण अचानक बाढ़ का खतरा बढ़ रहा है। मॉडल अगले 24 घंटों में निचले और संवेदनशील क्षेत्रों में उच्च जोखिम का अनुमान लगाता है।',
      driversEn: ['Rainfall ↑', 'Soil Saturation ↑', 'River Level ↑'],
      driversHi: ['वर्षा ↑', 'मिट्टी संतृप्ति ↑', 'नदी स्तर ↑'],
      trendEn: 'Increasing',
      trendHi: 'बढ़ रहा है',
      peak: '88 / 100',
      windowEn: 'Next 12–24 hours',
      windowHi: 'अगले 12–24 घंटे'
    }
  },
  {
    id: 2, 
    nameEn: 'Joshimath', 
    nameHi: 'जोशीमठ', 
    currentRisk: 67, 
    riskChange: '+8%', 
    avg7Day: 58, 
    confidence: 91, 
    alertStatusEn: 'WATCH',
    alertStatusHi: 'निगरानी',
    alertTextEn: 'Elevated soil moisture',
    alertTextHi: 'बढ़ी हुई मिट्टी की नमी',
    trajectory: [
      { day: 'Mon', risk: 45, rain: 20, soil: 55, river: '+0.1m' }, 
      { day: 'Tue', risk: 48, rain: 30, soil: 60, river: '+0.2m' },
      { day: 'Wed', risk: 55, rain: 45, soil: 68, river: '+0.4m' }, 
      { day: 'Thu', risk: 62, rain: 55, soil: 75, river: '+0.6m' },
      { day: 'Fri', risk: 67, rain: 76, soil: 81, river: '+0.8m' }, 
      { day: 'Sat', risk: 65, rain: 60, soil: 78, river: '+0.7m' },
      { day: 'Sun', risk: 70, rain: 85, soil: 84, river: '+0.9m' }
    ],
    forecast72h: [
      { time: 'NOW', timeHi: 'अभी', risk: 67, rain: 10, river: '+0.8m' }, 
      { time: '+6H', timeHi: '+6 घंटे', risk: 70, rain: 15, river: '+0.9m' },
      { time: '+12H', timeHi: '+12 घंटे', risk: 72, rain: 20, river: '+1.0m' }, 
      { time: '+24H', timeHi: '+24 घंटे', risk: 65, rain: 8, river: '+0.8m' },
      { time: '+48H', timeHi: '+48 घंटे', risk: 55, rain: 0, river: '+0.5m' }, 
      { time: '+72H', timeHi: '+72 घंटे', risk: 48, rain: 0, river: '+0.3m' }
    ],
    contributors: [
      { nameEn: 'Soil Saturation', nameHi: 'मिट्टी की संतृप्ति', impact: 85, levelEn: 'CRITICAL IMPACT', levelHi: 'अत्यधिक प्रभाव' }, 
      { nameEn: 'Rainfall', nameHi: 'वर्षा', impact: 78, levelEn: 'HIGH IMPACT', levelHi: 'उच्च प्रभाव' },
      { nameEn: 'Terrain / Slope', nameHi: 'ढलान एवं स्थलाकृति', impact: 70, levelEn: 'HIGH IMPACT', levelHi: 'उच्च प्रभाव' }, 
      { nameEn: 'River Level', nameHi: 'नदी का जलस्तर', impact: 45, levelEn: 'MODERATE IMPACT', levelHi: 'मध्यम प्रभाव' },
      { nameEn: 'Historical Pattern', nameHi: 'ऐतिहासिक पैटर्न', impact: 30, levelEn: 'LOW IMPACT', levelHi: 'निम्न प्रभाव' }
    ],
    historical: { current: 67, avg7: 58, avg30: 45, seasonal: 40, peak: 85 },
    aiAssessment: {
      textEn: 'Landslide and localized flooding risk is highly sensitive to soil saturation in this sector. Ongoing rain is pushing moisture levels toward critical thresholds.',
      textHi: 'इस क्षेत्र में भूस्खलन और स्थानीय बाढ़ का जोखिम मिट्टी की नमी के प्रति संवेदनशील है। निरंतर बारिश नमी के स्तर को चेतावनी सीमा तक ले जा रही है।',
      driversEn: ['Soil Saturation ↑', 'Rainfall ↑'],
      driversHi: ['मिट्टी संतृप्ति ↑', 'वर्षा ↑'],
      trendEn: 'Rising Slowly',
      trendHi: 'धीरे-धीरे बढ़ रहा है',
      peak: '72 / 100',
      windowEn: 'Next 12 hours',
      windowHi: 'अगले 12 घंटे'
    }
  },
  {
    id: 3, 
    nameEn: 'Badrinath', 
    nameHi: 'बद्रीनाथ', 
    currentRisk: 88, 
    riskChange: '+22%', 
    avg7Day: 70, 
    confidence: 96, 
    alertStatusEn: 'ACTIVE',
    alertStatusHi: 'सक्रिय',
    alertTextEn: 'Critical river swelling',
    alertTextHi: 'नदी का गंभीर उफान',
    trajectory: [
      { day: 'Mon', risk: 50, rain: 40, soil: 70, river: '+0.8m' }, 
      { day: 'Tue', risk: 55, rain: 50, soil: 75, river: '+1.0m' },
      { day: 'Wed', risk: 65, rain: 70, soil: 82, river: '+1.3m' }, 
      { day: 'Thu', risk: 78, rain: 95, soil: 88, river: '+1.6m' },
      { day: 'Fri', risk: 88, rain: 128, soil: 91, river: '+1.8m' }, 
      { day: 'Sat', risk: 85, rain: 110, soil: 89, river: '+1.7m' },
      { day: 'Sun', risk: 92, rain: 140, soil: 95, river: '+2.1m' }
    ],
    forecast72h: [
      { time: 'NOW', timeHi: 'अभी', risk: 88, rain: 25, river: '+1.8m' }, 
      { time: '+6H', timeHi: '+6 घंटे', risk: 90, rain: 30, river: '+2.0m' },
      { time: '+12H', timeHi: '+12 घंटे', risk: 92, rain: 40, river: '+2.1m' }, 
      { time: '+24H', timeHi: '+24 घंटे', risk: 85, rain: 15, river: '+1.7m' },
      { time: '+48H', timeHi: '+48 घंटे', risk: 75, rain: 5, river: '+1.2m' }, 
      { time: '+72H', timeHi: '+72 घंटे', risk: 60, rain: 0, river: '+0.8m' }
    ],
    contributors: [
      { nameEn: 'River Level', nameHi: 'नदी का जलस्तर', impact: 95, levelEn: 'CRITICAL IMPACT', levelHi: 'अत्यधिक प्रभाव' }, 
      { nameEn: 'Rainfall', nameHi: 'वर्षा', impact: 90, levelEn: 'CRITICAL IMPACT', levelHi: 'अत्यधिक प्रभाव' },
      { nameEn: 'Soil Saturation', nameHi: 'मिट्टी की संतृप्ति', impact: 85, levelEn: 'HIGH IMPACT', levelHi: 'उच्च प्रभाव' }, 
      { nameEn: 'Terrain / Slope', nameHi: 'ढलान एवं स्थलाकृति', impact: 50, levelEn: 'MODERATE IMPACT', levelHi: 'मध्यम प्रभाव' },
      { nameEn: 'Historical Pattern', nameHi: 'ऐतिहासिक पैटर्न', impact: 60, levelEn: 'HIGH IMPACT', levelHi: 'उच्च प्रभाव' }
    ],
    historical: { current: 88, avg7: 70, avg30: 55, seasonal: 50, peak: 95 },
    aiAssessment: {
      textEn: 'Immediate threat of severe flash flooding. Catchment areas are overwhelmed, leading to rapid surges in the Alaknanda river profile.',
      textHi: 'अचानक गंभीर बाढ़ का तत्काल खतरा। जलग्रहण क्षेत्र अत्यधिक वर्षा से संतृप्त हैं, जिससे अलकनंदा में जलस्तर तीव्र गति से बढ़ रहा है।',
      driversEn: ['River Level ↑↑', 'Rainfall ↑'],
      driversHi: ['नदी स्तर ↑↑', 'वर्षा ↑'],
      trendEn: 'Spiking',
      trendHi: 'तेजी से बढ़ रहा है',
      peak: '92 / 100',
      windowEn: 'Next 6–12 hours',
      windowHi: 'अगले 6–12 घंटे'
    }
  },
  {
    id: 4, 
    nameEn: 'Gopeshwar', 
    nameHi: 'गोपेश्वर', 
    currentRisk: 42, 
    riskChange: '-5%', 
    avg7Day: 40, 
    confidence: 88, 
    alertStatusEn: 'STANDBY',
    alertStatusHi: 'सामान्य',
    alertTextEn: 'Normal monitoring',
    alertTextHi: 'सामान्य निगरानी सक्रिय',
    trajectory: [
      { day: 'Mon', risk: 35, rain: 10, soil: 45, river: '+0.1m' }, 
      { day: 'Tue', risk: 38, rain: 15, soil: 50, river: '+0.2m' },
      { day: 'Wed', risk: 40, rain: 20, soil: 55, river: '+0.2m' }, 
      { day: 'Thu', risk: 45, rain: 30, soil: 60, river: '+0.3m' },
      { day: 'Fri', risk: 42, rain: 25, soil: 58, river: '+0.3m' }, 
      { day: 'Sat', risk: 38, rain: 10, soil: 55, river: '+0.2m' },
      { day: 'Sun', risk: 45, rain: 35, soil: 62, river: '+0.4m' }
    ],
    forecast72h: [
      { time: 'NOW', timeHi: 'अभी', risk: 42, rain: 5, river: '+0.3m' }, 
      { time: '+6H', timeHi: '+6 घंटे', risk: 45, rain: 10, river: '+0.4m' },
      { time: '+12H', timeHi: '+12 घंटे', risk: 40, rain: 5, river: '+0.3m' }, 
      { time: '+24H', timeHi: '+24 घंटे', risk: 35, rain: 0, river: '+0.2m' },
      { time: '+48H', timeHi: '+48 घंटे', risk: 30, rain: 0, river: '+0.1m' }, 
      { time: '+72H', timeHi: '+72 घंटे', risk: 28, rain: 0, river: 'Normal' }
    ],
    contributors: [
      { nameEn: 'Soil Saturation', nameHi: 'मिट्टी की संतृप्ति', impact: 55, levelEn: 'MODERATE IMPACT', levelHi: 'मध्यम प्रभाव' }, 
      { nameEn: 'Rainfall', nameHi: 'वर्षा', impact: 40, levelEn: 'MODERATE IMPACT', levelHi: 'मध्यम प्रभाव' },
      { nameEn: 'Terrain / Slope', nameHi: 'ढलान एवं स्थलाकृति', impact: 30, levelEn: 'LOW IMPACT', levelHi: 'निम्न प्रभाव' }, 
      { nameEn: 'River Level', nameHi: 'नदी का जलस्तर', impact: 20, levelEn: 'LOW IMPACT', levelHi: 'निम्न प्रभाव' },
      { nameEn: 'Historical Pattern', nameHi: 'ऐतिहासिक पैटर्न', impact: 15, levelEn: 'LOW IMPACT', levelHi: 'निम्न प्रभाव' }
    ],
    historical: { current: 42, avg7: 40, avg30: 35, seasonal: 38, peak: 72 },
    aiAssessment: {
      textEn: 'Conditions remain well within safe thresholds. Urban drainage systems are operating efficiently with no major blockages detected.',
      textHi: 'स्थितियां पूरी तरह से सुरक्षित सीमा के भीतर हैं। शहरी जल निकासी प्रणालियां सुचारू रूप से कार्य कर रही हैं।',
      driversEn: ['Stable Weather'],
      driversHi: ['स्थिर मौसम'],
      trendEn: 'Stable',
      trendHi: 'स्थिर',
      peak: '45 / 100',
      windowEn: 'Next 6 hours',
      windowHi: 'अगले 6 घंटे'
    }
  },
  { id: 5, nameEn: 'Helang', nameHi: 'हेलांग', currentRisk: 75, riskChange: '+10%', avg7Day: 60, confidence: 90, alertStatusEn: 'ACTIVE', alertStatusHi: 'सक्रिय', alertTextEn: 'River surge imminent', alertTextHi: 'नदी में अचानक उफान की आशंका' },
  { id: 6, nameEn: 'Karnaprayag', nameHi: 'कर्णप्रयाग', currentRisk: 53, riskChange: '+2%', avg7Day: 50, confidence: 92, alertStatusEn: 'WATCH', alertStatusHi: 'निगरानी', alertTextEn: 'Confluence rising', alertTextHi: 'संगम पर जलस्तर में वृद्धि' },
  { id: 7, nameEn: 'Pipalkoti', nameHi: 'पीपलकोटी', currentRisk: 28, riskChange: '-2%', avg7Day: 30, confidence: 85, alertStatusEn: 'STANDBY', alertStatusHi: 'सामान्य', alertTextEn: 'Normal conditions', alertTextHi: 'सामान्य स्थितियां' },
  { id: 8, nameEn: 'Nandprayag', nameHi: 'नंदप्रयाग', currentRisk: 31, riskChange: '0%', avg7Day: 32, confidence: 89, alertStatusEn: 'STANDBY', alertStatusHi: 'सामान्य', alertTextEn: 'Normal conditions', alertTextHi: 'सामान्य स्थितियां' },
  { id: 9, nameEn: 'Vishnuprayag', nameHi: 'विष्णुप्रयाग', currentRisk: 20, riskChange: '-5%', avg7Day: 25, confidence: 95, alertStatusEn: 'STANDBY', alertStatusHi: 'सामान्य', alertTextEn: 'Normal conditions', alertTextHi: 'सामान्य स्थितियां' },
  { id: 10, nameEn: 'Mana', nameHi: 'माणा', currentRisk: 60, riskChange: '+8%', avg7Day: 52, confidence: 88, alertStatusEn: 'WATCH', alertStatusHi: 'निगरानी', alertTextEn: 'Glacial melt + Rain', alertTextHi: 'ग्लेशियर पिघलना + वर्षा' },
  { id: 11, nameEn: 'Govindghat', nameHi: 'गोविंदघाट', currentRisk: 45, riskChange: '+5%', avg7Day: 40, confidence: 91, alertStatusEn: 'STANDBY', alertStatusHi: 'सामान्य', alertTextEn: 'Moderate runoff', alertTextHi: 'मध्यम जलप्रवाह' },
  { id: 12, nameEn: 'Auli', nameHi: 'औली', currentRisk: 22, riskChange: '0%', avg7Day: 20, confidence: 98, alertStatusEn: 'STANDBY', alertStatusHi: 'सामान्य', alertTextEn: 'Safe elevation', alertTextHi: 'सुरक्षित ऊंचाई' }
];

const SAFE_TRAJECTORY = MOCK_DATA[0].trajectory;
const SAFE_FORECAST = MOCK_DATA[0].forecast72h;
const SAFE_CONTRIBUTORS = MOCK_DATA[0].contributors;
const SAFE_HISTORICAL = MOCK_DATA[0].historical;
const SAFE_AI = MOCK_DATA[0].aiAssessment;

// ==========================================
// 3. CARTESIAN (X,Y) CHARTS
// ==========================================

const TrajectoryChart = ({ data, isHi, t }) => {
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.risk}`).join(' ');

  return (
    <div className="flex w-full h-[260px] mt-2 mb-6 pr-4">
      <div className="w-10 relative border-r border-gray-300 z-10">
        {[100, 75, 50, 25, 0].map((val) => (
          <div key={val} className="absolute right-0 w-full flex items-center justify-end pr-2" style={{ bottom: `${val}%`, transform: 'translateY(50%)' }}>
            <span className="text-[10px] font-bold text-gray-500">{val}</span>
            <div className="absolute right-0 w-1.5 h-px bg-gray-400 translate-x-full"></div>
          </div>
        ))}
      </div>

      <div className="flex-1 relative border-b border-gray-300">
        <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {data.map((d, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const dayLabel = isHi ? (DAYS_HI[d.day] || d.day) : d.day;

          return (
            <div key={i} className="absolute top-0 bottom-0 z-20 group cursor-pointer" style={{ left: `${leftPos}%`, width: '40px', transform: 'translateX(-50%)' }}>
              <div
                className="absolute left-1/2 w-3.5 h-3.5 bg-blue-500 border-[2px] border-white rounded-full shadow-sm transition-transform group-hover:scale-125 transform -translate-x-1/2 translate-y-1/2 z-30"
                style={{ bottom: `${d.risk}%` }}
              ></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-gray-400 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-gray-500 uppercase pt-2">
                {dayLabel}
              </span>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl pointer-events-none w-44 z-50">
                <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
                  <span className="font-bold text-blue-300">{dayLabel}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${getRiskStyles(d.risk).text} bg-white`}>{getRiskLabel(d.risk, isHi)}</span>
                </div>
                <div className="space-y-1 text-[10px] font-medium text-slate-300">
                  <div className="flex justify-between"><span>{t.riskScore}:</span> <span className="font-bold text-white">{d.risk}</span></div>
                  <div className="flex justify-between"><span>{t.rainfallMm}:</span> <span className="font-bold text-white">{d.rain} mm</span></div>
                  <div className="flex justify-between"><span>{t.soilSatPct}:</span> <span className="font-bold text-white">{d.soil}%</span></div>
                  <div className="flex justify-between"><span>{t.riverLevelM}:</span> <span className="font-bold text-white">{d.river}</span></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ComboChart = ({ data, isHi }) => {
  const maxRain = Math.max(...data.map(d => d.rain)) + 20;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.risk}`).join(' ');

  return (
    <div className="flex w-full h-[220px] mt-4 pr-4">
      <div className="w-10 relative border-r border-gray-300 z-10">
        {[100, 50, 0].map((val) => (
          <div key={val} className="absolute right-0 w-full flex items-center justify-end pr-2" style={{ bottom: `${val}%`, transform: 'translateY(50%)' }}>
            <span className="text-[10px] font-bold text-gray-500">{val}</span>
            <div className="absolute right-0 w-1.5 h-px bg-gray-400 translate-x-full"></div>
          </div>
        ))}
      </div>

      <div className="flex-1 relative border-b border-gray-300">
        <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#ef4444" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>

        {data.map((d, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const dayLabel = isHi ? (DAYS_HI[d.day] ? DAYS_HI[d.day].slice(0, 1) : d.day.slice(0, 1)) : d.day.slice(0, 1);

          return (
            <div key={i} className="absolute top-0 bottom-0 z-20 group flex flex-col items-center cursor-pointer" style={{ left: `${leftPos}%`, width: '24px', transform: 'translateX(-50%)' }}>
              <div className="absolute left-1/2 w-3 h-3 bg-red-500 border-2 border-white rounded-full shadow-sm transform -translate-x-1/2 translate-y-1/2 z-30" style={{ bottom: `${d.risk}%` }}></div>
              <div className="w-3/4 bg-blue-100 group-hover:bg-blue-300 rounded-t-sm transition-colors mt-auto z-0" style={{ height: `${(d.rain / maxRain) * 100}%` }}></div>
              
              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-gray-400 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 text-[9px] font-bold text-gray-500 pt-2">{dayLabel}</span>
              
              <div className="absolute bottom-full mb-4 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] rounded p-2 shadow-lg z-50 whitespace-nowrap pointer-events-none">
                {isHi ? 'वर्षा' : 'Rain'}: <span className="font-bold text-blue-300">{d.rain} mm</span><br/>
                {isHi ? 'जोखिम' : 'Risk'}: <span className="font-bold text-red-400">{d.risk}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HydrologicalChart = ({ data, isHi }) => {
  const soilPoints = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.soil}`).join(' ');
  const riverPoints = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (parseFloat(d.river) / 2) * 100}`).join(' ');

  return (
    <div className="flex w-full h-[220px] mt-4 pr-4">
      <div className="w-10 relative border-r border-gray-300 z-10">
        {[100, 50, 0].map((val) => (
          <div key={val} className="absolute right-0 w-full flex items-center justify-end pr-2" style={{ bottom: `${val}%`, transform: 'translateY(50%)' }}>
            <span className="text-[10px] font-bold text-gray-500">{val}</span>
            <div className="absolute right-0 w-1.5 h-px bg-gray-400 translate-x-full"></div>
          </div>
        ))}
      </div>

      <div className="flex-1 relative border-b border-gray-300">
        <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={soilPoints} fill="none" stroke="#f59e0b" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          <polyline points={riverPoints} fill="none" stroke="#06b6d4" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        </svg>

        {data.map((d, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const dayLabel = isHi ? (DAYS_HI[d.day] ? DAYS_HI[d.day].slice(0, 1) : d.day.slice(0, 1)) : d.day.slice(0, 1);

          return (
            <div key={i} className="absolute top-0 bottom-0 z-20 group cursor-pointer" style={{ left: `${leftPos}%`, width: '30px', transform: 'translateX(-50%)' }}>
              <div className="absolute left-1/2 w-3 h-3 bg-amber-500 border-2 border-white rounded-full shadow-sm transform -translate-x-1/2 translate-y-1/2 z-30" style={{ bottom: `${d.soil}%` }}></div>
              <div className="absolute left-1/2 w-3 h-3 bg-cyan-500 border-2 border-white rounded-full shadow-sm transform -translate-x-1/2 translate-y-1/2 z-30" style={{ bottom: `${(parseFloat(d.river) / 2) * 100}%` }}></div>

              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-gray-400 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-gray-500 pt-2">{dayLabel}</span>
              
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 bg-white border border-gray-200 shadow-xl text-[10px] rounded p-2 z-50 whitespace-nowrap pointer-events-none">
                <div><span className="text-amber-500 font-bold">{isHi ? 'मिट्टी संतृप्ति:' : 'Soil:'}</span> {d.soil}%</div>
                <div><span className="text-cyan-500 font-bold">{isHi ? 'नदी जलस्तर:' : 'River:'}</span> {d.river}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PredictionChart = ({ data, isHi, t }) => {
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d.risk}`).join(' ');

  return (
    <div className="flex w-full h-[220px] mt-4 pr-4">
      <div className="w-10 relative border-r border-gray-300 z-10">
        {[100, 75, 50, 25, 0].map((val) => (
          <div key={val} className="absolute right-0 w-full flex items-center justify-end pr-2" style={{ bottom: `${val}%`, transform: 'translateY(50%)' }}>
            <span className="text-[10px] font-bold text-gray-500">{val}</span>
            <div className="absolute right-0 w-1.5 h-px bg-gray-400 translate-x-full"></div>
          </div>
        ))}
      </div>

      <div className="flex-1 relative border-b border-gray-300">
        <div className="absolute top-0 bottom-0 left-[20%] border-l-2 border-dashed border-indigo-200 pointer-events-none z-0">
          <span className="absolute top-2 left-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest">{t.predictedZone}</span>
        </div>

        <svg className="absolute inset-0 w-full h-full z-10 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {data.map((d, i) => {
          const leftPos = (i / (data.length - 1)) * 100;
          const timeText = isHi ? (d.timeHi || d.time) : d.time;

          return (
            <div key={i} className="absolute top-0 bottom-0 z-20 group cursor-pointer" style={{ left: `${leftPos}%`, width: '40px', transform: 'translateX(-50%)' }}>
              <div
                className="absolute left-1/2 w-3.5 h-3.5 bg-indigo-500 border-2 border-white rounded-full shadow-sm transition-transform group-hover:scale-125 transform -translate-x-1/2 translate-y-1/2 z-30"
                style={{ bottom: `${d.risk}%` }}
              ></div>
              
              <div className="absolute -bottom-1 left-1/2 w-px h-1.5 bg-gray-400 transform -translate-x-1/2"></div>
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-gray-500 pt-2 whitespace-nowrap">{timeText}</span>
              
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 bg-slate-900 text-white p-3 rounded-xl text-[10px] whitespace-nowrap z-50 shadow-xl pointer-events-none">
                <div className="font-bold mb-1 border-b border-slate-700 pb-1">{timeText} {t.forecastWord}</div>
                <div>{t.riskWord}: <span className={getRiskStyles(d.risk).text}>{d.risk}</span></div>
                <div>{t.rainWord}: {d.rain}mm</div>
                <div>{t.riverWord}: {d.river}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN DASHBOARD COMPONENT
// ==========================================
export default function RiskAnalysis() {
  const langContext = useLanguage() || {};
  const currentLang = langContext.language || 
    (typeof window !== 'undefined' && (window.localStorage.getItem('language') || window.localStorage.getItem('lang'))) || 
    'en';
  const isHi = currentLang.toLowerCase().startsWith('hi');
  const t = isHi ? TRANSLATIONS.hi : TRANSLATIONS.en;

  const [selectedLocId, setSelectedLocId] = useState(1);
  const loc = MOCK_DATA.find(d => d.id === selectedLocId) || MOCK_DATA[0];
  const style = getRiskStyles(loc.currentRisk);

  const trajectory = loc.trajectory || SAFE_TRAJECTORY;
  const forecast = loc.forecast72h || SAFE_FORECAST;
  const contributors = loc.contributors || SAFE_CONTRIBUTORS;
  const hist = loc.historical || SAFE_HISTORICAL;
  const ai = loc.aiAssessment || SAFE_AI;

  return (
    <div className="flex flex-col gap-6 w-full h-full pb-10 animate-fadeIn">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-700" />
            </div>
            {t.pageTitle}
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">{t.subtitle}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select 
              value={selectedLocId} 
              onChange={(e) => setSelectedLocId(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-300 text-gray-700 font-bold text-xs py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
            >
              {MOCK_DATA.map(d => (
                <option key={d.id} value={d.id}>
                  {isHi ? d.nameHi : d.nameEn}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1 cursor-pointer hover:bg-gray-50">
            <Clock className="w-4 h-4 text-gray-500" /> {t.timeRange7d} <ChevronDown className="w-3 h-3 ml-1" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
            <span className="text-xs font-bold uppercase tracking-wider">{t.liveData}</span>
          </div>
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 relative overflow-hidden">
          <div className={`absolute left-0 top-0 w-1 h-full ${style.fill}`}></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">{t.currentRisk}</span>
          <div className="flex items-end gap-2 mb-1">
            <span className="text-4xl font-black text-gray-900 leading-none">{loc.currentRisk}</span>
            <span className="text-xs font-bold text-gray-400 mb-1">/ 100</span>
          </div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase ${style.bg} ${style.text}`}>
            {getRiskLabel(loc.currentRisk, isHi)}
          </span>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs font-bold">
            <span className="text-gray-500">{t.change}: <span className={loc.riskChange.includes('+') ? 'text-red-500' : 'text-emerald-500'}>{loc.riskChange}</span></span>
            <span className="text-gray-500">{t.trend}: <span className="text-gray-900">{isHi ? ai.trendHi : ai.trendEn}</span></span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">{t.avg7Day}</span>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-black text-gray-900 leading-none">{loc.avg7Day}</span>
            <span className="text-xs font-bold text-gray-400 mb-1">/ 100</span>
          </div>
          <div className="mt-6 pt-3 border-t border-gray-100 text-xs font-bold text-gray-500">
            {t.currentVsAvg}: <span className="text-orange-500">+{loc.currentRisk - loc.avg7Day} {t.points}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">{t.predictionConfidence}</span>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-black text-gray-900 leading-none">{loc.confidence}%</span>
          </div>
          <div className="mt-6 pt-3 border-t border-gray-100 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> <span className="text-gray-700">{t.modelReliable}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">{t.alertStatus}</span>
          <div className="mb-2">
            <span className={`px-2 py-1 rounded-md text-xs font-black uppercase tracking-widest ${loc.alertStatusEn === 'ACTIVE' ? 'bg-red-100 text-red-700' : loc.alertStatusEn === 'WATCH' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isHi ? loc.alertStatusHi : loc.alertStatusEn}
            </span>
          </div>
          <div className="mt-5 pt-3 border-t border-gray-100 text-[10px] font-bold text-gray-500 flex flex-col gap-1">
            <span className="text-gray-800">{isHi ? loc.alertTextHi : loc.alertTextEn}</span>
            <span>{t.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* MAIN TRAJECTORY CHART */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 pt-8 pb-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> {t.trajectoryTitle}
          </h3>
        </div>
        <TrajectoryChart data={trajectory} isHi={isHi} t={t} />
      </div>

      {/* SUB-CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 pt-8 pb-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-500" /> {t.rainfallVsRisk}
            </h3>
            <div className="flex gap-2 text-[10px] font-bold text-gray-400 uppercase">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-200"></div> {t.rainfallMm}</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> {t.riskScore}</span>
            </div>
          </div>
          <ComboChart data={trajectory} isHi={isHi} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 pt-8 pb-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-500" /> {t.hydrologicalConditions}
            </h3>
            <div className="flex gap-2 text-[10px] font-bold text-gray-400 uppercase">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> {t.soilSatPct}</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> {t.riverLevelM}</span>
            </div>
          </div>
          <HydrologicalChart data={trajectory} isHi={isHi} />
        </div>
      </div>

      {/* RISK CONTRIBUTORS */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Target className="w-4 h-4 text-slate-500" /> {t.keyRiskContributors}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {contributors.map((c, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-gray-700">{isHi ? c.nameHi : c.nameEn}</span>
                <span className="text-sm font-black text-gray-900">{c.impact}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${c.impact > 80 ? 'bg-red-500' : c.impact > 60 ? 'bg-orange-500' : c.impact > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${c.impact}%` }}
                ></div>
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${c.impact > 80 ? 'text-red-500' : c.impact > 60 ? 'text-orange-500' : 'text-gray-400'}`}>
                {isHi ? c.levelHi : c.levelEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 72-HOUR FORECAST */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 pt-8 pb-10">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" /> {t.next72hForecast}
        </h3>
        <PredictionChart data={forecast} isHi={isHi} t={t} />
      </div>

      {/* HISTORICAL & AI ASSESSMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-slate-500" /> {t.historicalComparison}
          </h3>
          <div className="space-y-4">
            {[
              { label: t.currentRiskLabel, val: hist.current, color: getRiskStyles(hist.current).fill },
              { label: t.sevenDayAvgLabel, val: hist.avg7, color: 'bg-gray-400' },
              { label: t.thirtyDayAvgLabel, val: hist.avg30, color: 'bg-gray-300' },
              { label: t.seasonalAvgLabel, val: hist.seasonal, color: 'bg-gray-200' },
              { label: t.historicalPeakLabel, val: hist.peak, color: 'bg-red-600' }
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-600 w-36 truncate">{row.label}</span>
                <div className="flex-1 h-3 bg-gray-50 rounded-full overflow-hidden flex items-center">
                  <div className={`h-full ${row.color} rounded-r-full`} style={{ width: `${row.val}%` }}></div>
                </div>
                <span className="text-sm font-black text-gray-900 w-8 text-right">{row.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-6">
          <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" /> {t.aiAssessmentTitle}
          </h3>
          <p className="text-sm text-gray-700 font-medium leading-relaxed bg-white/60 p-4 rounded-xl border border-white mb-4 shadow-sm">
            "{isHi ? ai.textHi : ai.textEn}"
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-white p-2 rounded-lg border border-blue-100/50">
              <span className="block text-[9px] font-bold text-gray-400 uppercase">{t.primaryDrivers}</span>
              <span className="block text-xs font-black text-red-600 mt-1">{isHi ? ai.driversHi[0] : ai.driversEn[0]}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-blue-100/50">
              <span className="block text-[9px] font-bold text-gray-400 uppercase">{t.riskTrend}</span>
              <span className="block text-xs font-black text-gray-900 mt-1">{isHi ? ai.trendHi : ai.trendEn}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-blue-100/50">
              <span className="block text-[9px] font-bold text-gray-400 uppercase">{t.predictedPeak}</span>
              <span className="block text-xs font-black text-gray-900 mt-1">{ai.peak}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-blue-100/50">
              <span className="block text-[9px] font-bold text-gray-400 uppercase">{t.expectedWindow}</span>
              <span className="block text-xs font-black text-blue-700 mt-1">{isHi ? ai.windowHi : ai.windowEn}</span>
            </div>
          </div>
        </div>
      </div>

      {/* HIGH & EXTREME RISK LOCATIONS */}
      <div>
        <h3 className="text-lg font-black text-gray-900 mb-4">{t.highExtremeLocations}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {MOCK_DATA.filter(d => d.currentRisk >= 50).map(d => (
            <button 
              key={d.id}
              onClick={() => {
                setSelectedLocId(d.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col p-4 rounded-xl border ${getRiskStyles(d.currentRisk).border} bg-white hover:shadow-md transition-shadow text-left group`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {isHi ? d.nameHi.split(' ')[0] : d.nameEn.split(' ')[0]}
                </span>
                <span className="text-lg font-black text-gray-900 leading-none">{d.currentRisk}</span>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${getRiskStyles(d.currentRisk).bg} ${getRiskStyles(d.currentRisk).text} w-fit mb-2`}>
                {getRiskLabel(d.currentRisk, isHi)}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 mt-auto">
                <CloudRain className="w-3 h-3 text-blue-400" /> {(d.trajectory || SAFE_TRAJECTORY)[6].rain} {t.rain24hUnit}
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}