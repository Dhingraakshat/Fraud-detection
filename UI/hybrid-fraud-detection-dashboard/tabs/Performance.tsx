
import React from 'react';
import Card from '../components/UI/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Target, Zap, ShieldAlert, BarChart3 } from 'lucide-react';

interface PerformanceProps {
  threshold: number;
}

const Performance: React.FC<PerformanceProps> = ({ threshold }) => {
  // Mock ROC data
  const rocData = Array.from({ length: 11 }).map((_, i) => ({
    fpr: i / 10,
    tpr: Math.pow(i / 10, 0.4), // Concave curve for visualization
    lgbm: Math.pow(i / 10, 0.5),
    baseline: i / 10
  }));

  const metrics = [
    { label: 'Precision', val: '0.942', status: 'optimal' },
    { label: 'Recall', val: '0.884', status: 'optimal' },
    { label: 'F1 Score', val: '0.912', status: 'optimal' },
    { label: 'ROC-AUC', val: '0.985', status: 'optimal' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <Card title="Confusion Matrix (Test Set)" subtitle={`Evaluated at Threshold = ${threshold.toFixed(2)}`}>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-8 bg-[#0B1220] rounded-2xl border border-[#1D2B45] flex flex-col items-center justify-center">
              <p className="text-[10px] text-[#A9B6D1] uppercase font-bold mb-2">True Negatives</p>
              <h2 className="text-3xl font-black text-white">41,204</h2>
              <span className="text-[10px] text-[#25D0C5] mt-1">(Normal correctly identified)</span>
            </div>
            <div className="p-8 bg-[#FF4D4F]/5 rounded-2xl border border-[#FF4D4F]/20 flex flex-col items-center justify-center">
              <p className="text-[10px] text-[#A9B6D1] uppercase font-bold mb-2">False Positives</p>
              <h2 className="text-3xl font-black text-[#FF4D4F]">142</h2>
              <span className="text-[10px] text-[#A9B6D1] mt-1">(False Alerts)</span>
            </div>
            <div className="p-8 bg-[#FF4D4F]/5 rounded-2xl border border-[#FF4D4F]/20 flex flex-col items-center justify-center">
              <p className="text-[10px] text-[#A9B6D1] uppercase font-bold mb-2">False Negatives</p>
              <h2 className="text-3xl font-black text-[#FF4D4F]">89</h2>
              <span className="text-[10px] text-[#A9B6D1] mt-1">(Missed Fraud)</span>
            </div>
            <div className="p-8 bg-[#25D0C5]/10 rounded-2xl border border-[#25D0C5]/30 flex flex-col items-center justify-center">
              <p className="text-[10px] text-[#A9B6D1] uppercase font-bold mb-2">True Positives</p>
              <h2 className="text-3xl font-black text-[#25D0C5]">1,288</h2>
              <span className="text-[10px] text-[#25D0C5] mt-1">(Fraud correctly identified)</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-8">
            {metrics.map(m => (
              <div key={m.label} className="text-center">
                <p className="text-[10px] text-[#A9B6D1] uppercase mb-1">{m.label}</p>
                <p className="text-lg font-bold text-white tracking-tighter">{m.val}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ROC Curve */}
        <Card title="ROC Curve Comparison" subtitle="Hybrid Stacking performance vs Base Models">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2B45" />
                <XAxis dataKey="fpr" label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: '#A9B6D1', fontSize: 10 }} stroke="#A9B6D1" fontSize={10} />
                <YAxis label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#A9B6D1', fontSize: 10 }} stroke="#A9B6D1" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101A2E', border: '1px solid #1D2B45' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="tpr" name="XGBoost Stacking" stroke="#25D0C5" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="lgbm" name="LightGBM Base" stroke="#A9B6D1" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="baseline" name="Random Baseline" stroke="#1D2B45" strokeWidth={1} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Operational Point */}
      <Card title="Operational Operating Point Analysis">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#25D0C5]/10 rounded-xl text-[#25D0C5]">
                <Target size={24} />
              </div>
              <div>
                <p className="text-xs text-[#A9B6D1] uppercase">Optimal Threshold</p>
                <h3 className="text-xl font-bold text-white">{threshold.toFixed(2)}</h3>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#F7B84B]/10 rounded-xl text-[#F7B84B]">
                <ShieldAlert size={24} />
              </div>
              <div>
                <p className="text-xs text-[#A9B6D1] uppercase">Estimated Daily Alerts</p>
                <h3 className="text-xl font-bold text-white">~ 214 cases</h3>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <BarChart3 size={24} />
              </div>
              <div>
                <p className="text-xs text-[#A9B6D1] uppercase">False Alert Rate</p>
                <h3 className="text-xl font-bold text-white">0.34%</h3>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 p-6 bg-[#0B1220] rounded-2xl border border-[#1D2B45] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Zap size={120} />
             </div>
             <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
               <Zap size={16} className="text-[#25D0C5]" />
               Strategic Summary
             </h4>
             <p className="text-sm text-[#A9B6D1] leading-relaxed mb-6">
               The current hybrid stacking model achieves an AUC of 0.985, significantly outperforming individual base models in the low-FPR region (0% - 1%). 
               Using a threshold of <span className="text-white font-bold">{threshold}</span>, the system maximizes fraud capture while maintaining analyst workload within safe capacity limits. 
               Feature engineering for <span className="text-[#25D0C5] italic">card-level temporal dynamics</span> accounts for 65% of the model's predictive power.
             </p>
             <div className="flex gap-4">
               <div className="px-4 py-2 bg-[#25D0C5] text-[#0B1220] rounded-lg text-xs font-bold">Recommended Deployment</div>
               <div className="px-4 py-2 bg-[#1D2B45] text-white rounded-lg text-xs font-bold border border-[#1D2B45]">Review Policy PDF</div>
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Performance;
