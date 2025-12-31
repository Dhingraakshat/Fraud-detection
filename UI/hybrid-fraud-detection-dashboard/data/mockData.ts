
import { Transaction, GlobalFeatureImportance } from '../types';

const generateMockTransactions = (count: number): Transaction[] => {
  const devices = ['Windows', 'iOS', 'Android', 'MacOS', 'Linux', 'Other'];
  const featureNames = [
    'Trans_last_1h_card',
    'Device_change_flag',
    'Avg_std_per_card',
    'Cards_per_device_24h',
    'Time_since_last_txn_card',
    'Freq_ratio_card_amt',
    'Geo_change_flag',
    'Is_night_txn'
  ];

  return Array.from({ length: count }).map((_, i) => {
    const finalProb = Math.random();
    const isFraud = finalProb > 0.8 || (Math.random() > 0.95);
    
    const shapValues: Record<string, number> = {};
    featureNames.forEach(f => {
      shapValues[f] = (finalProb > 0.5 ? Math.random() * 0.4 : -Math.random() * 0.2);
    });

    // Distribute transactions across the last 30 days
    const dateOffset = Math.random() * 30 * 86400000; 

    return {
      id: `TXN-${100000 + i}`,
      dt: new Date(Date.now() - dateOffset).toISOString(),
      amount: parseFloat((Math.random() * 500 + 10).toFixed(2)),
      card1: Math.floor(1000 + Math.random() * 9000).toString(),
      deviceInfo: devices[Math.floor(Math.random() * devices.length)],
      lgbmProb: Math.min(1, Math.max(0, finalProb + (Math.random() - 0.5) * 0.2)),
      catboostProb: Math.min(1, Math.max(0, finalProb + (Math.random() - 0.5) * 0.2)),
      isolationForestScore: Math.random(),
      autoencoderError: Math.random(),
      finalXgbProb: finalProb,
      isFraud,
      features: {
        Trans_last_1h_card: Math.floor(Math.random() * 10),
        Device_change_flag: Math.random() > 0.8,
        Avg_std_per_card: Math.random() * 2,
        Cards_per_device_24h: Math.floor(Math.random() * 5),
        Time_since_last_txn_card: Math.floor(Math.random() * 10000),
        Freq_ratio_card_amt: Math.random() * 1.5,
        Geo_change_flag: Math.random() > 0.9,
        Is_night_txn: Math.random() > 0.7
      },
      shap: shapValues
    };
  });
};

export const MOCK_TRANSACTIONS = generateMockTransactions(200);

export const GLOBAL_IMPORTANCE: GlobalFeatureImportance[] = [
  { name: 'Trans_last_1h_card', importance: 0.92 },
  { name: 'Device_change_flag', importance: 0.88 },
  { name: 'Avg_std_per_card', importance: 0.84 },
  { name: 'Cards_per_device_24h', importance: 0.76 },
  { name: 'Time_since_last_txn_card', importance: 0.71 },
  { name: 'Freq_ratio_card_amt', importance: 0.65 },
  { name: 'Geo_change_flag', importance: 0.58 },
  { name: 'Is_night_txn', importance: 0.42 }
];

export const getAlertTrend = (range: string) => {
  const points = range === 'Last 24h' ? 24 : range === 'Last 7d' ? 7 : 30;
  const unit = range === 'Last 24h' ? 'h' : 'd';
  
  return Array.from({ length: points }).map((_, i) => {
    const date = new Date();
    if (unit === 'h') date.setHours(date.getHours() - (points - i));
    else date.setDate(date.getDate() - (points - i));

    return {
      time: unit === 'h' ? `${date.getHours()}:00` : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      alerts: Math.floor(Math.random() * 15) + (i % 5 === 0 ? 10 : 0),
      capacity: 18
    };
  });
};

export const RISK_DISTRIBUTION = [
  { range: '0.0-0.1', count: 1200, level: 'Low' },
  { range: '0.1-0.2', count: 800, level: 'Low' },
  { range: '0.2-0.3', count: 450, level: 'Low' },
  { range: '0.3-0.4', count: 300, level: 'Low' },
  { range: '0.4-0.5', count: 200, level: 'Low' },
  { range: '0.5-0.6', count: 150, level: 'Medium' },
  { range: '0.6-0.7', count: 100, level: 'Medium' },
  { range: '0.7-0.8', count: 80, level: 'High' },
  { range: '0.8-0.9', count: 120, level: 'High' },
  { range: '0.9-1.0', count: 150, level: 'High' },
];
