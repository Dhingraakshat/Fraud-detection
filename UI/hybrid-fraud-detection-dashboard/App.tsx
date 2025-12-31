
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Activity, 
  Fingerprint, 
  BarChart3, 
  Settings, 
  ShieldAlert, 
  ChevronRight, 
  Users
} from 'lucide-react';
import { TabType, Transaction } from './types';
import { MOCK_TRANSACTIONS } from './data/mockData';

// Tab Components
import Overview from './tabs/Overview';
import TransactionExplorer from './tabs/Explorer';
import ModelSignals from './tabs/ModelSignals';
import Explainability from './tabs/Explainability';
import Performance from './tabs/Performance';
import SettingsTab from './tabs/Settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [threshold, setThreshold] = useState(0.5);
  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('Last 24h');

  const filteredTransactionsByRange = useMemo(() => {
    const now = Date.now();
    let limit = 24 * 3600 * 1000; // default 24h
    if (dateRange === 'Last 7d') limit = 7 * 24 * 3600 * 1000;
    if (dateRange === 'Last 30d') limit = 30 * 24 * 3600 * 1000;

    return MOCK_TRANSACTIONS.filter(t => {
      const txnTime = new Date(t.dt).getTime();
      return (now - txnTime) <= limit;
    });
  }, [dateRange]);

  const selectedTransaction = useMemo(() => 
    filteredTransactionsByRange.find(t => t.id === selectedTxnId) || filteredTransactionsByRange[0],
    [selectedTxnId, filteredTransactionsByRange]
  );

  const filteredTransactionsBySearch = useMemo(() => {
    return filteredTransactionsByRange.filter(t => 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.card1.includes(searchQuery)
    );
  }, [searchQuery, filteredTransactionsByRange]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'explorer', label: 'Transaction Explorer', icon: Search },
    { id: 'signals', label: 'Model Signals', icon: Activity },
    { id: 'shap', label: 'Explainability (SHAP)', icon: Fingerprint },
    { id: 'performance', label: 'Performance & Results', icon: BarChart3 },
    { id: 'settings', label: 'Settings / About', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0B1220] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-[#1D2B45] bg-[#0B1220] flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-[#25D0C5] mb-2">
            <ShieldAlert size={28} />
            <span className="font-bold text-xl tracking-tight text-white">HybridFraud</span>
          </div>
          <p className="text-[10px] text-[#A9B6D1] uppercase tracking-widest font-semibold opacity-60">
            Decision Support System
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-[#101A2E] text-[#25D0C5] border border-[#1D2B45]' 
                  : 'text-[#A9B6D1] hover:bg-[#101A2E] hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-[#25D0C5]' : 'text-[#A9B6D1] group-hover:text-white'} />
              <span className="font-medium text-sm">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1D2B45]">
          <div className="bg-[#101A2E] rounded-xl p-4 border border-[#1D2B45]">
            <p className="text-[10px] text-[#A9B6D1] uppercase mb-2">Global Threshold</p>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">Alert Threshold</span>
              <span className="text-xs font-mono text-[#F7B84B]">{threshold.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="0.9" 
              step="0.01" 
              value={threshold} 
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-[#25D0C5] bg-[#1D2B45] h-1 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-20 border-b border-[#1D2B45] bg-[#0B1220]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Hybrid Fraud Detection Dashboard
              <span className="px-2 py-0.5 bg-[#1D2B45] text-[#25D0C5] rounded text-[10px] font-mono">v1.2.0</span>
            </h1>
            <p className="text-xs text-[#A9B6D1] mt-0.5">
              Stacking: LightGBM + CatBoost + Isolation Forest + Autoencoder → <span className="text-white font-semibold italic">XGBoost</span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A9B6D1]" size={16} />
              <input 
                type="text" 
                placeholder="Search TransactionID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#101A2E] border border-[#1D2B45] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#25D0C5] w-64 transition-all"
              />
            </div>
            
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-[#101A2E] border border-[#1D2B45] text-sm text-[#EAF0FF] px-3 py-2 rounded-lg outline-none cursor-pointer"
            >
              <option>Last 24h</option>
              <option>Last 7d</option>
              <option>Last 30d</option>
            </select>

            <div className="flex items-center gap-3 ml-2 pl-6 border-l border-[#1D2B45]">
              <div className="text-right">
                <p className="text-xs font-bold text-white">IEEE-CIS Dataset</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] text-[#A9B6D1]">Demo Mode</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Router Container */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'overview' && <Overview threshold={threshold} dateRange={dateRange} transactions={filteredTransactionsByRange} />}
          {activeTab === 'explorer' && (
            <TransactionExplorer 
              transactions={filteredTransactionsBySearch} 
              threshold={threshold}
              onSelect={setSelectedTxnId}
              selectedId={selectedTxnId}
            />
          )}
          {activeTab === 'signals' && (
            <ModelSignals transaction={selectedTransaction} threshold={threshold} />
          )}
          {activeTab === 'shap' && (
            <Explainability transaction={selectedTransaction} />
          )}
          {activeTab === 'performance' && (
            <Performance threshold={threshold} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
