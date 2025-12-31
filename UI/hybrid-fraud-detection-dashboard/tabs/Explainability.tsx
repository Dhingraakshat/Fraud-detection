
import React, { useState } from 'react';
import { Transaction } from '../types';
import Card from '../components/UI/Card';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquareQuote } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { GLOBAL_IMPORTANCE } from '../data/mockData';

interface ExplainabilityProps {
  transaction: Transaction;
}

const FeatureAccordion: React.FC<{ title: string, content: string }> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#1D2B45] last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-[#25D0C5] transition-colors"
      >
        <span className="text-xs font-bold font-mono">{title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-xs text-[#A9B6D1] leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
};

const Explainability: React.FC<ExplainabilityProps> = ({ transaction }) => {
  const [viewMode, setViewMode] = useState<'local' | 'global'>('local');

  // Fix: Explicitly cast value to number to avoid 'unknown' type error in Math.abs
  const localShapData = Object.entries(transaction.shap).map(([name, value]) => ({
    name,
    value: value as number,
  })).sort((a, b) => Math.abs(b.value as number) - Math.abs(a.value as number));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-[#101A2E] p-1 rounded-xl border border-[#1D2B45]">
          <button 
            onClick={() => setViewMode('local')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'local' ? 'bg-[#25D0C5] text-[#0B1220]' : 'text-[#A9B6D1] hover:text-white'}`}
          >
            Local (Current TXN)
          </button>
          <button 
            onClick={() => setViewMode('global')}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'global' ? 'bg-[#25D0C5] text-[#0B1220]' : 'text-[#A9B6D1] hover:text-white'}`}
          >
            Global (Model)
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#A9B6D1] font-medium">Analyzing:</span>
          <select className="bg-[#101A2E] border border-[#1D2B45] rounded-lg px-3 py-1.5 text-xs text-white">
            <option>XGBoost (Final)</option>
            <option>LightGBM</option>
            <option>CatBoost</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SHAP Visualization */}
        <Card 
          title={viewMode === 'local' ? "Local Feature Impact (SHAP)" : "Global Feature Importance"} 
          className="lg:col-span-2 min-h-[500px]"
        >
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={viewMode === 'local' ? localShapData : GLOBAL_IMPORTANCE.map(f => ({ name: f.name, value: f.importance }))}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2B45" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#A9B6D1" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#EAF0FF" fontSize={10} width={120} axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{ fill: 'transparent' }}
                   contentStyle={{ backgroundColor: '#101A2E', border: '1px solid #1D2B45', fontSize: '12px' }}
                />
                <ReferenceLine x={0} stroke="#1D2B45" />
                <Bar dataKey={viewMode === 'local' ? "value" : "value"}>
                  {(viewMode === 'local' ? localShapData : GLOBAL_IMPORTANCE).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={viewMode === 'local' ? (entry.value > 0 ? '#FF4D4F' : '#25D0C5') : '#25D0C5'} 
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {viewMode === 'local' && (
            <div className="flex justify-center gap-8 mt-4">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#FF4D4F]">
                <div className="w-3 h-3 bg-[#FF4D4F] rounded"></div> Increases Fraud Prob
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-[#25D0C5]">
                <div className="w-3 h-3 bg-[#25D0C5] rounded"></div> Decreases Fraud Prob
              </div>
            </div>
          )}
        </Card>

        {/* Explainability Content */}
        <div className="space-y-6">
          <Card title="Natural Language Insights">
            <div className="flex gap-4 p-4 bg-[#101A2E] border border-[#1D2B45] rounded-xl">
              <MessageSquareQuote size={20} className="text-[#25D0C5] shrink-0" />
              <p className="text-sm text-[#A9B6D1] leading-relaxed">
                {viewMode === 'local' ? (
                  <>
                    Transaction <span className="text-white font-bold">{transaction.id}</span> is risky because <span className="text-[#FF4D4F] font-bold">Trans_last_1h_card</span> is unusually high and <span className="text-[#FF4D4F] font-bold">Device_change_flag</span> is true. This suggests rapid account activity from a new, untrusted device.
                  </>
                ) : (
                  <>
                    The model identifies <span className="text-white font-bold">Trans_last_1h_card</span> as the strongest global indicator. Frequent transactions in a small window are the primary signal for both known and novel fraud clusters.
                  </>
                )}
              </p>
            </div>
          </Card>

          <Card title="Feature Definitions">
            <div className="space-y-1">
              <FeatureAccordion 
                title="Trans_last_1h_card" 
                content="Count of successful transactions using the same card in the last 60 minutes. High values often indicate automated/scripted fraud." 
              />
              <FeatureAccordion 
                title="Device_change_flag" 
                content="Binary flag indicating if the transaction device differs from the device used in the previous 5 transactions for this card." 
              />
              <FeatureAccordion 
                title="Avg_std_per_card" 
                content="Standard deviation of transaction amounts relative to the card's historical average. Spikes suggest unusual spending behavior." 
              />
              <FeatureAccordion 
                title="Freq_ratio_card_amt" 
                content="Ratio of current transaction amount vs historical median. Identifies outliers in card usage behavior." 
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Explainability;
