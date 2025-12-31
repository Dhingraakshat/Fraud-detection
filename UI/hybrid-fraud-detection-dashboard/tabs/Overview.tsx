
import React, { useMemo } from 'react';
import { Shield, Bell, Activity, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../components/UI/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';
import { getAlertTrend, RISK_DISTRIBUTION, GLOBAL_IMPORTANCE } from '../data/mockData';
import { Transaction } from '../types';

interface OverviewProps {
  threshold: number;
  dateRange: string;
  transactions: Transaction[];
}

const KPICard: React.FC<{ icon: any, label: string, value: string, delta: string, isUp: boolean }> = ({ icon: Icon, label, value, delta, isUp }) => (
  <Card className="flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-[#0B1220] border border-[#1D2B45] rounded-xl text-[#25D0C5]">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-[#FF4D4F]' : 'text-[#25D0C5]'}`}>
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {delta}
      </div>
    </div>
    <p className="text-xs text-[#A9B6D1] font-medium uppercase tracking-wide">{label}</p>
    <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
    <p className="text-[10px] text-[#A9B6D1] mt-2">vs. previous period</p>
  </Card>
);

const Overview: React.FC<OverviewProps> = ({ threshold, dateRange, transactions }) => {
  const trendData = useMemo(() => getAlertTrend(dateRange), [dateRange]);

  const stats = useMemo(() => {
    const total = transactions.length;
    const flagged = transactions.filter(t => t.finalXgbProb >= threshold).length;
    const fraudRate = total > 0 ? (flagged / total * 100).toFixed(2) : "0.00";
    
    // Simulating variations for larger ranges
    const multiplier = dateRange === 'Last 24h' ? 1 : dateRange === 'Last 7d' ? 15 : 60;

    return {
      total: (total * multiplier).toLocaleString(),
      flagged: (flagged * multiplier).toLocaleString(),
      fraudRate: `${fraudRate}%`,
      queueLoad: `${Math.min(95, 60 + Math.random() * 30).toFixed(0)}%`
    };
  }, [transactions, threshold, dateRange]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          icon={Activity} 
          label="Total Transactions" 
          value={stats.total} 
          delta="12.5%" 
          isUp={true} 
        />
        <KPICard 
          icon={Bell} 
          label="Flagged Alerts" 
          value={stats.flagged} 
          delta="4.2%" 
          isUp={true} 
        />
        <KPICard 
          icon={Shield} 
          label="Estimated Fraud Rate" 
          value={stats.fraudRate} 
          delta="1.2%" 
          isUp={false} 
        />
        <KPICard 
          icon={Users} 
          label="Analyst Queue Load" 
          value={stats.queueLoad} 
          delta="5.8%" 
          isUp={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card title={`Alert Volume (${dateRange})`} className="lg:col-span-2 min-h-[400px]">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2B45" vertical={false} />
                <XAxis dataKey="time" stroke="#A9B6D1" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#A9B6D1" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#101A2E', border: '1px solid #1D2B45', color: '#EAF0FF' }}
                  itemStyle={{ color: '#25D0C5' }}
                />
                <ReferenceLine y={18} stroke="#F7B84B" strokeDasharray="5 5" label={{ value: 'Analyst Cap', position: 'right', fill: '#F7B84B', fontSize: 10 }} />
                <Line type="monotone" dataKey="alerts" stroke="#25D0C5" strokeWidth={3} dot={dateRange !== 'Last 24h'} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk Distribution */}
        <Card title="Fraud Probability Distribution" subtitle="Stacking Model: XGBoost">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RISK_DISTRIBUTION}>
                <XAxis dataKey="range" hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#101A2E', border: '1px solid #1D2B45' }}
                />
                <Bar dataKey="count">
                  {RISK_DISTRIBUTION.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index >= threshold * 10 ? '#FF4D4F' : '#1D2B45'} 
                      opacity={index >= threshold * 10 ? 0.8 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-[#A9B6D1] uppercase font-bold">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#1D2B45]"></div> Low Risk</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#FF4D4F]"></div> High Risk (Alert)</span>
          </div>
        </Card>
      </div>

      {/* Global Drivers */}
      <Card title="Top Global Risk Drivers" subtitle="Averaged Engineered Feature Importance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {GLOBAL_IMPORTANCE.map((feat, i) => (
            <div key={feat.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#EAF0FF] font-medium">{feat.name}</span>
                <span className="text-[#25D0C5] font-mono">{feat.importance.toFixed(2)}</span>
              </div>
              <div className="h-2 w-full bg-[#0B1220] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#25D0C5]/40 to-[#25D0C5] rounded-full"
                  style={{ width: `${feat.importance * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Overview;
