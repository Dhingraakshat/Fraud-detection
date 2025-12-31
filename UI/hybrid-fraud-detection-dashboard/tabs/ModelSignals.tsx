
import React from 'react';
import { Transaction } from '../types';
import Card from '../components/UI/Card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { BrainCircuit, Info, ShieldCheck, Zap } from 'lucide-react';

interface ModelSignalsProps {
  transaction: Transaction;
  threshold: number;
}

const ModelSignals: React.FC<ModelSignalsProps> = ({ transaction, threshold }) => {
  const radarData = [
    { subject: 'LightGBM', value: transaction.lgbmProb },
    { subject: 'CatBoost', value: transaction.catboostProb },
    { subject: 'IsoForest', value: transaction.isolationForestScore },
    { subject: 'Autoencoder', value: transaction.autoencoderError },
  ];

  const getStatusColor = (val: number) => {
    if (val > 0.7) return 'text-[#FF4D4F]';
    if (val > 0.4) return 'text-[#F7B84B]';
    return 'text-[#25D0C5]';
  };

  const getAgreement = () => {
    const highProbs = radarData.filter(d => d.value > 0.5).length;
    if (highProbs === 4) return { label: 'All Models Agree (HIGH)', color: 'text-[#FF4D4F]', desc: 'High confidence fraud detected by both supervised and unsupervised layers.' };
    if (highProbs === 0) return { label: 'All Models Agree (LOW)', color: 'text-[#25D0C5]', desc: 'Strong consistency for a legitimate transaction.' };
    if (transaction.lgbmProb > 0.6 && transaction.isolationForestScore < 0.4) return { label: 'Known Pattern Fraud', color: 'text-[#F7B84B]', desc: 'Supervised models flagged it, but anomaly detectors are quiet.' };
    return { label: 'Possible Novel Fraud', color: 'text-white', desc: 'Anomaly detectors show high scores while supervised models are lower. Manual review recommended.' };
  };

  const agreement = getAgreement();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Base Model Outputs */}
      <div className="space-y-6">
        <Card title="Base Model Probabilities" subtitle={`Transaction: ${transaction.id}`}>
          <div className="space-y-4">
            {[
              { label: 'LightGBM', prob: transaction.lgbmProb, hint: 'Known fraud patterns (Gradient Boosting)' },
              { label: 'CatBoost', prob: transaction.catboostProb, hint: 'Advanced categorical handling' },
              { label: 'Isolation Forest', prob: transaction.isolationForestScore, hint: 'Unsupervised anomaly detector' },
              { label: 'Autoencoder', prob: transaction.autoencoderError, hint: 'Neural network reconstruction error' }
            ].map(m => (
              <div key={m.label} className="p-4 bg-[#0B1220] rounded-xl border border-[#1D2B45] group hover:border-[#25D0C5]/40 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-white">{m.label}</span>
                  <span className={`font-mono font-bold ${getStatusColor(m.prob)}`}>{(m.prob * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1D2B45] rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${m.prob > threshold ? 'bg-[#FF4D4F]' : 'bg-[#25D0C5]'}`}
                    style={{ width: `${m.prob * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-[#A9B6D1] italic">{m.hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-[#101A2E] to-[#25D0C5]/10 rounded-2xl border-2 border-[#25D0C5] shadow-[0_0_20px_rgba(37,208,197,0.15)] relative overflow-hidden">
            <Zap className="absolute -right-4 -bottom-4 text-[#25D0C5]/10 w-32 h-32" />
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-bold text-[#25D0C5] uppercase tracking-widest mb-2">Final Stacking Output</span>
              <h1 className={`text-6xl font-black ${transaction.finalXgbProb > threshold ? 'text-[#FF4D4F]' : 'text-[#25D0C5]'}`}>
                {(transaction.finalXgbProb * 100).toFixed(1)}%
              </h1>
              <p className="text-sm text-white font-medium mt-2">XGBoost Meta-Model Decision</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Signal Visualization */}
      <div className="space-y-6">
        <Card title="Signal Agreement Matrix" className="h-full">
          <div className="h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1D2B45" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#A9B6D1', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                <Radar
                  name="Confidence"
                  dataKey="value"
                  stroke="#25D0C5"
                  fill="#25D0C5"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-6 rounded-2xl bg-[#0B1220] border border-[#1D2B45] border-l-4 border-l-[#25D0C5]">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#101A2E] rounded-lg text-[#25D0C5]">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h4 className={`text-lg font-bold ${agreement.color}`}>{agreement.label}</h4>
                <p className="text-sm text-[#A9B6D1] mt-2 leading-relaxed">
                  {agreement.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-[#25D0C5] font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  Hybrid Stacking Layer Confirmed
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-3 bg-[#101A2E] border border-[#1D2B45] rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-[#A9B6D1] font-bold uppercase">Supervised Mean</span>
                <Info size={12} className="text-[#A9B6D1]" />
              </div>
              <p className="text-lg font-bold text-white tracking-tighter">
                {((transaction.lgbmProb + transaction.catboostProb) / 2).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-[#101A2E] border border-[#1D2B45] rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-[#A9B6D1] font-bold uppercase">Unsupervised Mean</span>
                <Info size={12} className="text-[#A9B6D1]" />
              </div>
              <p className="text-lg font-bold text-white tracking-tighter">
                {((transaction.isolationForestScore + transaction.autoencoderError) / 2).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ModelSignals;
