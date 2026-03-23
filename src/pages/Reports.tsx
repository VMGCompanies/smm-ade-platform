import React, { useState } from 'react';
import { Download, FileText, BarChart2, TrendingUp, Clock, Users } from 'lucide-react';
import BillingVelocity from '../components/charts/BillingVelocity';
import CollectionsFunnel from '../components/charts/CollectionsFunnel';

const reportLibrary = [
  { name: 'Monthly AR Aging Summary', description: 'Full aging breakdown by bucket and ADE agent', type: 'AR', lastGenerated: '2026-03-01', format: 'PDF' },
  { name: 'AP Disbursement Report', description: 'Weekly AP batch history and vendor summary', type: 'AP', lastGenerated: '2026-03-21', format: 'Excel' },
  { name: 'Collections Performance Report', description: 'Collection rates, timelines, and outcomes', type: 'Collections', lastGenerated: '2026-03-15', format: 'PDF' },
  { name: 'ADE Activity Audit Log', description: 'Full audit trail of MAI and NATALIA actions', type: 'Audit', lastGenerated: '2026-03-23', format: 'CSV' },
  { name: 'Vendor Reconciliation Summary', description: 'Variance analysis across all contracted vendors', type: 'AP', lastGenerated: '2026-03-15', format: 'Excel' },
  { name: 'Cash Flow Statement', description: '12-month invoiced vs collected comparison', type: 'Finance', lastGenerated: '2026-03-01', format: 'PDF' },
  { name: 'Client Retention Risk Report', description: 'At-risk accounts with engagement scores', type: 'CRM', lastGenerated: '2026-03-18', format: 'PDF' },
  { name: 'Manager Response Time Analysis', description: 'HITL approval latency by action type', type: 'Operations', lastGenerated: '2026-03-10', format: 'Excel' },
];

const typeBadge: Record<string, string> = {
  AR: 'bg-accent-blue-light text-accent-blue',
  AP: 'bg-natalia-accent/10 text-natalia-accent',
  Collections: 'bg-accent-amber-light text-accent-amber',
  Audit: 'bg-bg-secondary text-text-secondary',
  Finance: 'bg-accent-green-light text-accent-green',
  CRM: 'bg-accent-red-light text-accent-red',
  Operations: 'bg-accent-blue-light text-mai-accent',
};

const apCycleData = [
  { vendor: 'Ecolab', avgDays: 3.2, batchCount: 12 },
  { vendor: 'Waxie', avgDays: 3.8, batchCount: 12 },
  { vendor: 'White Cap', avgDays: 4.1, batchCount: 10 },
  { vendor: 'Centrihouse', avgDays: 3.5, batchCount: 11 },
  { vendor: 'Allied Universal', avgDays: 2.9, batchCount: 12 },
];

const managerResponseData = [
  { type: 'AP Batch Release', avgHours: 1.4, total: 12 },
  { type: 'Collections Email', avgHours: 2.1, total: 24 },
  { type: 'PO Chase', avgHours: 0.8, total: 18 },
  { type: 'JE Post', avgHours: 3.2, total: 8 },
  { type: 'Escalation', avgHours: 4.7, total: 6 },
];

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary font-display">Reports</h1>
        <p className="text-sm text-text-muted mt-0.5">Analytics, audit logs, and downloadable reports</p>
      </div>

      {/* Report Library */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary font-display">Report Library</h2>
          <button className="flex items-center gap-2 px-3 py-2 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-accent-blue/90 transition-colors">
            <FileText size={14} /> Generate Custom Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-base">
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Report Name</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Type</th>
                <th className="text-left py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Description</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Last Generated</th>
                <th className="text-center py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Format</th>
                <th className="text-right py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportLibrary.map((r, i) => (
                <tr key={i} className={`border-b border-border-base hover:bg-bg-secondary cursor-pointer transition-colors ${selectedReport === r.name ? 'bg-accent-blue-light/20' : ''}`} onClick={() => setSelectedReport(r.name)}>
                  <td className="py-3 px-3 font-medium text-text-primary">{r.name}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadge[r.type] || 'bg-bg-secondary text-text-secondary'}`}>{r.type}</span>
                  </td>
                  <td className="py-3 px-3 text-xs text-text-secondary max-w-xs">{r.description}</td>
                  <td className="py-3 px-3 text-center text-xs text-text-muted font-mono">{new Date(r.lastGenerated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-xs bg-bg-secondary text-text-secondary px-2 py-0.5 rounded">{r.format}</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex gap-1.5 justify-end">
                      <button className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-bg-secondary text-text-secondary hover:bg-accent-blue-light hover:text-accent-blue transition-colors">
                        <FileText size={11} /> View
                      </button>
                      <button className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-bg-secondary text-text-secondary hover:bg-accent-green-light hover:text-accent-green transition-colors">
                        <Download size={11} /> Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics Panels */}
      <div className="grid grid-cols-2 gap-5">
        {/* Billing Velocity */}
        <div className="bg-bg-card border border-border-base rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-accent-blue" />
            <h2 className="text-base font-semibold text-text-primary font-display">Billing Velocity</h2>
          </div>
          <BillingVelocity />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[{ label: 'Avg Days to Invoice', value: '1.8 days' }, { label: 'Same-Day Rate', value: '68%' }, { label: 'Auto-Gen Rate', value: '94%' }].map(m => (
              <div key={m.label} className="bg-bg-secondary rounded-lg p-3 text-center">
                <p className="text-lg font-mono font-bold text-text-primary">{m.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Collections Funnel */}
        <div className="bg-bg-card border border-border-base rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-accent-amber" />
            <h2 className="text-base font-semibold text-text-primary font-display">Collections Funnel</h2>
          </div>
          <CollectionsFunnel />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[{ label: 'Recovery Rate', value: '87%' }, { label: 'Avg Days to Collect', value: '23 days' }, { label: 'Escalation Rate', value: '4.2%' }].map(m => (
              <div key={m.label} className="bg-bg-secondary rounded-lg p-3 text-center">
                <p className="text-lg font-mono font-bold text-text-primary">{m.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AP Cycle Time */}
        <div className="bg-bg-card border border-border-base rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-natalia-accent" />
            <h2 className="text-base font-semibold text-text-primary font-display">AP Cycle Time</h2>
          </div>
          <div className="space-y-2.5">
            {apCycleData.map(v => (
              <div key={v.vendor} className="flex items-center gap-4">
                <span className="text-sm text-text-secondary w-36 flex-shrink-0">{v.vendor}</span>
                <div className="flex-1 bg-bg-secondary rounded-full h-2.5 overflow-hidden">
                  <div className="h-full rounded-full bg-natalia-accent/70" style={{ width: `${(v.avgDays / 7) * 100}%` }} />
                </div>
                <span className="text-sm font-mono font-bold text-text-primary w-16 text-right">{v.avgDays} days</span>
                <span className="text-xs text-text-muted w-14 text-right">{v.batchCount} batches</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[{ label: 'Avg Batch Cycle', value: '3.5 days' }, { label: 'On-Time Rate', value: '98.2%' }].map(m => (
              <div key={m.label} className="bg-bg-secondary rounded-lg p-3 text-center">
                <p className="text-lg font-mono font-bold text-text-primary">{m.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Manager Response Time */}
        <div className="bg-bg-card border border-border-base rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-accent-blue" />
            <h2 className="text-base font-semibold text-text-primary font-display">Manager Response Time</h2>
          </div>
          <div className="space-y-3">
            {managerResponseData.map(r => (
              <div key={r.type} className="flex items-center justify-between py-2.5 border-b border-border-base last:border-0">
                <div>
                  <p className="text-sm font-medium text-text-primary">{r.type}</p>
                  <p className="text-xs text-text-muted">{r.total} total approvals</p>
                </div>
                <div className="text-right">
                  <p className={`text-base font-mono font-bold ${r.avgHours < 2 ? 'text-accent-green' : r.avgHours < 4 ? 'text-accent-amber' : 'text-accent-red'}`}>{r.avgHours}h avg</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-bg-secondary rounded-lg p-3 mt-4 text-center">
            <p className="text-lg font-mono font-bold text-text-primary">2.4h</p>
            <p className="text-xs text-text-muted">Overall avg approval time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
