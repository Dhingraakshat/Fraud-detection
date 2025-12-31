
export interface Transaction {
  id: string;
  dt: string;
  amount: number;
  card1: string;
  deviceInfo: string;
  lgbmProb: number;
  catboostProb: number;
  isolationForestScore: number;
  autoencoderError: number;
  finalXgbProb: number;
  isFraud: boolean;
  features: {
    [key: string]: number | boolean;
  };
  shap: {
    [key: string]: number;
  };
}

export type TabType = 'overview' | 'explorer' | 'signals' | 'shap' | 'performance' | 'settings';

export interface KPI {
  title: string;
  value: string | number;
  delta: string;
  icon: string;
}

export interface GlobalFeatureImportance {
  name: string;
  importance: number;
}
