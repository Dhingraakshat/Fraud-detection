
import React from 'react';
import Card from '../components/UI/Card';
import { Download, ExternalLink, Info, Code, Database, ShieldCheck, ChevronDown } from 'lucide-react';

const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card title="Project Summary">
        <div className="space-y-4">
          <p className="text-sm text-[#A9B6D1] leading-relaxed">
            This dashboard is the primary decision-support interface for a Bachelor's Thesis titled:
            <span className="block text-white font-bold text-lg mt-2 italic">
              "Hybrid Fraud Detection for Known + Unknown Fraud Patterns using Human-Interpretable Feature Engineering"
            </span>
          </p>
          <div className="flex gap-6 pt-4 border-t border-[#1D2B45]">
            <div className="flex items-center gap-2 text-xs text-[#A9B6D1]">
              <Database size={16} className="text-[#25D0C5]" />
              Dataset: <span className="text-white font-medium">IEEE-CIS Fraud Detection</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A9B6D1]">
              <Code size={16} className="text-[#25D0C5]" />
              Environment: <span className="text-white font-medium">Python 3.10 / React TS</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Model Stack Configuration">
          <div className="space-y-3">
            {[
              { name: 'LightGBM', role: 'Supervised (Known)', status: 'Active' },
              { name: 'CatBoost', role: 'Supervised (Categorical)', status: 'Active' },
              { name: 'Isolation Forest', role: 'Unsupervised (Anomalies)', status: 'Active' },
              { name: 'Autoencoder', role: 'Deep Learning (Unknown)', status: 'Active' },
              { name: 'XGBoost', role: 'Stacking Meta-Model', status: 'Active', accent: true },
            ].map(m => (
              <div key={m.name} className={`flex items-center justify-between p-3 rounded-xl border ${m.accent ? 'bg-[#25D0C5]/10 border-[#25D0C5]/40' : 'bg-[#0B1220] border-[#1D2B45]'}`}>
                <div>
                  <p className="text-xs font-bold text-white">{m.name}</p>
                  <p className="text-[10px] text-[#A9B6D1]">{m.role}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-[#25D0C5]/20 text-[#25D0C5] rounded font-bold uppercase">{m.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Export & Documentation">
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-[#101A2E] hover:bg-[#1D2B45] rounded-xl border border-[#1D2B45] group transition-all">
              <div className="flex items-center gap-3">
                <Download size={20} className="text-[#A9B6D1] group-hover:text-[#25D0C5]" />
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Download Model Card</p>
                  <p className="text-xs text-[#A9B6D1]">PDF report on bias, data & training</p>
                </div>
              </div>
              <ChevronDown size={18} className="text-[#A9B6D1]" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-[#101A2E] hover:bg-[#1D2B45] rounded-xl border border-[#1D2B45] group transition-all">
              <div className="flex items-center gap-3">
                <ExternalLink size={20} className="text-[#A9B6D1] group-hover:text-[#25D0C5]" />
                <div className="text-left">
                  <p className="text-sm font-bold text-white">View SHAP Source Code</p>
                  <p className="text-xs text-[#A9B6D1]">GitHub Repository Link</p>
                </div>
              </div>
              <ChevronDown size={18} className="text-[#A9B6D1]" />
            </button>

            <div className="p-4 bg-[#F7B84B]/10 border border-[#F7B84B]/30 rounded-xl mt-6">
              <div className="flex items-center gap-2 mb-2 text-[#F7B84B]">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold uppercase">Ethical Notice</span>
              </div>
              <p className="text-xs text-[#A9B6D1] italic leading-relaxed">
                This research prototype handles sensitive patterns. In production environments, Ensure differential privacy and PII masking for card-level identifiers.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="text-center pb-12 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-[#A9B6D1] uppercase tracking-[0.2em]">
          Version 1.2.0 • Build ID: ACAD-993-SHAP • Faculty of Computer Science
        </p>
      </div>
    </div>
  );
};

export default SettingsTab;
