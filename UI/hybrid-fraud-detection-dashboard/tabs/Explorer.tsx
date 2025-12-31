
import React, { useState } from 'react';
import { Transaction } from '../types';
import { ExternalLink, Filter, Info, ChevronRight, FileText, Copy, UserCheck, Activity } from 'lucide-react';
import Card from '../components/UI/Card';

interface ExplorerProps {
  transactions: Transaction[];
  threshold: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const TransactionExplorer: React.FC<ExplorerProps> = ({ transactions, threshold, onSelect, selectedId }) => {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedTxns = [...transactions].sort((a, b) => 
    sortDir === 'desc' ? b.finalXgbProb - a.finalXgbProb : a.finalXgbProb - b.finalXgbProb
  );

  const selectedTxn = transactions.find(t => t.id === selectedId);

  return (
    <div className="relative h-full flex gap-6 overflow-hidden">
      {/* Table Section */}
      <div className={`flex-1 transition-all duration-300 ${selectedId ? 'w-2/3' : 'w-full'}`}>
        <Card title="Latest Transactions" className="h-full flex flex-col p-0 overflow-hidden">
          <div className="p-4 border-b border-[#1D2B45] flex justify-between items-center bg-[#101A2E]">
            <span className="text-xs text-[#A9B6D1] font-medium">{transactions.length} Transactions Found</span>
            <button 
              onClick={() => setSortDir(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 text-xs font-bold text-[#25D0C5] hover:underline"
            >
              <Filter size={14} />
              Sort by Risk: {sortDir === 'desc' ? 'Highest First' : 'Lowest First'}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-[#0B1220] text-[10px] text-[#A9B6D1] uppercase tracking-wider border-b border-[#1D2B45]">
                <tr>
                  <th className="px-6 py-4 font-bold">TransactionID</th>
                  <th className="px-6 py-4 font-bold">Date & Time</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold text-center">Risk Score</th>
                  <th className="px-6 py-4 font-bold">Level</th>
                  <th className="px-6 py-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D2B45]">
                {sortedTxns.map((txn) => {
                  const isHighRisk = txn.finalXgbProb >= threshold;
                  return (
                    <tr 
                      key={txn.id} 
                      onClick={() => onSelect(txn.id)}
                      className={`cursor-pointer transition-colors group ${
                        selectedId === txn.id ? 'bg-[#25D0C5]/10' : 'hover:bg-[#1D2B45]/40'
                      }`}
                    >
                      <td className="px-6 py-4 font-mono font-medium text-white">{txn.id}</td>
                      <td className="px-6 py-4 text-[#A9B6D1]">{new Date(txn.dt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td className="px-6 py-4 font-bold text-white">${txn.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`font-mono font-bold ${isHighRisk ? 'text-[#FF4D4F]' : 'text-[#25D0C5]'}`}>
                            {(txn.finalXgbProb * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          isHighRisk ? 'bg-[#FF4D4F]/20 text-[#FF4D4F]' : txn.finalXgbProb > 0.3 ? 'bg-[#F7B84B]/20 text-[#F7B84B]' : 'bg-[#25D0C5]/20 text-[#25D0C5]'
                        }`}>
                          {isHighRisk ? 'High' : txn.finalXgbProb > 0.3 ? 'Medium' : 'Low'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[#A9B6D1] group-hover:text-[#25D0C5] transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Detail Drawer */}
      {selectedTxn && (
        <div className="w-96 flex-shrink-0 animate-in slide-in-from-right duration-300">
          <Card className="h-full flex flex-col p-6 border-[#25D0C5]/40">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">TXN Details</h2>
              <button onClick={() => onSelect('')} className="text-[#A9B6D1] hover:text-white">
                <Info size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Header Info */}
              <div className="text-center p-6 bg-[#0B1220] rounded-2xl border border-[#1D2B45]">
                <p className="text-xs text-[#A9B6D1] uppercase tracking-widest mb-1">Final Risk Probability</p>
                <h1 className={`text-5xl font-black mb-2 ${selectedTxn.finalXgbProb >= threshold ? 'text-[#FF4D4F]' : 'text-[#25D0C5]'}`}>
                  {(selectedTxn.finalXgbProb * 100).toFixed(0)}%
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  selectedTxn.finalXgbProb >= threshold ? 'bg-[#FF4D4F]/20 text-[#FF4D4F]' : 'bg-[#25D0C5]/20 text-[#25D0C5]'
                }`}>
                  {selectedTxn.finalXgbProb >= threshold ? 'Immediate Alert' : 'Likely Pass'}
                </span>
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Amount', val: `$${selectedTxn.amount}` },
                  { label: 'Card ID', val: selectedTxn.card1 },
                  { label: 'Device', val: selectedTxn.deviceInfo },
                  { label: 'Hour', val: new Date(selectedTxn.dt).getHours() + ':00' },
                  { label: 'Recent Txns', val: selectedTxn.features.Trans_last_1h_card },
                  { label: 'Geo Change', val: selectedTxn.features.Geo_change_flag ? 'YES' : 'NO' }
                ].map(field => (
                  <div key={field.label} className="bg-[#101A2E] p-3 rounded-xl border border-[#1D2B45]">
                    <p className="text-[10px] text-[#A9B6D1] uppercase mb-1">{field.label}</p>
                    <p className="text-sm font-bold text-white">{field.val}</p>
                  </div>
                ))}
              </div>

              {/* Decision Explanation */}
              <div className="p-4 bg-[#F7B84B]/10 border border-[#F7B84B]/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-[#F7B84B]">
                  <Activity size={16} />
                  <span className="text-xs font-bold uppercase">Automated Insight</span>
                </div>
                <p className="text-xs text-[#EAF0FF] leading-relaxed italic">
                  "High probability score driven primarily by <span className="text-[#F7B84B] font-bold">Device_change_flag</span> and unusual <span className="text-[#F7B84B] font-bold">Trans_last_1h_card</span> frequency. Patterns correlate with known ATO (Account Takeover) behaviors."
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <button className="w-full bg-[#25D0C5] text-[#0B1220] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1EBEB4] transition-colors">
                  <UserCheck size={18} />
                  Mark as Investigating
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-[#1D2B45] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#2A3B5A]">
                    <FileText size={16} />
                    Export PDF
                  </button>
                  <button className="bg-[#1D2B45] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#2A3B5A]">
                    <Copy size={16} />
                    Copy Info
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {!selectedId && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="bg-[#0B1220]/60 backdrop-blur-sm px-6 py-4 rounded-full border border-[#1D2B45] text-[#A9B6D1] text-sm animate-pulse">
            Select a row to view deep-dive analysis
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionExplorer;
