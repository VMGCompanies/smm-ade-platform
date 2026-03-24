import React, { useState } from 'react';
import { Send, RefreshCw, AlertTriangle, ArrowUpRight, FileText, Clock, ChevronRight, CheckCircle, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { maiPortfolio, MaiAccount } from '../data/mai_portfolio';
import { activityLog } from '../data/activity_log';
import StatusPill from '../components/common/StatusPill';
import Modal from '../components/common/Modal';
import ArAgingWaterfall from '../components/charts/ArAgingWaterfall';
import AdeChat from '../components/ade/AdeChat';
import { analyzePaymentDNA, hasApiKey } from '../lib/claudeApi';

type MaiTab = 'billing' | 'aging' | 'workorders' | 'collections' | 'activity';

const agingData = [
  { client: 'Stanford Main', '0-30': 187400, '31-60': 0, '61-90': 0, '90+': 0 },
  { client: 'Lucile Packard', '0-30': 0, '31-60': 94200, '61-90': 0, '90+': 0 },
  { client: 'SMP/UHA', '0-30': 0, '31-60': 0, '61-90': 15600, '90+': 0 },
  { client: 'Blood Center', '0-30': 22800, '31-60': 0, '61-90': 0, '90+': 0 },
  { client: 'Valley Care', '0-30': 41500, '31-60': 0, '61-60': 0, '90+': 0 },
  { client: 'SoM Stanford', '0-30': 63200, '31-60': 0, '61-90': 0, '90+': 0 },
  { client: 'Surefire', '0-30': 0, '31-60': 0, '61-90': 0, '90+': 9800 },
];

const workOrders = [
  { id: 'WO-2026-0441', client: 'Stanford Main', description: 'HVAC preventive maintenance — Bldg. 4', status: 'complete', poRef: 'PO-9821', poStatus: 'received', invoiceReady: true },
  { id: 'WO-2026-0442', client: 'Lucile Packard', description: 'Elevator inspection & certification', status: 'complete', poRef: 'PO-4421', poStatus: 'pending', invoiceReady: false },
  { id: 'WO-2026-0443', client: 'Valley Care', description: 'Roof drain clearing & waterproofing', status: 'in_progress', poRef: 'PO-7741', poStatus: 'received', invoiceReady: false },
  { id: 'WO-2026-0444', client: 'SoM Stanford', description: 'Lab equipment installation support', status: 'complete', poRef: 'PO-8812', poStatus: 'received', invoiceReady: true },
  { id: 'WO-2026-0445', client: 'Blood Center', description: 'Emergency generator servicing', status: 'complete', poRef: 'PO-2234', poStatus: 'received', invoiceReady: true },
  { id: 'WO-2026-0446', client: 'FTE Painters', description: 'Interior repainting — conference rooms 1-4', status: 'in_progress', poRef: null, poStatus: 'not_required', invoiceReady: false },
];

const mockPaymentHistory: Record<string, Array<{ amount: number; daysToPayment: number; date: string }>> = {
  'mai-001': [
    { amount: 185000, daysToPayment: 28, date: '2026-02-01' },
    { amount: 183000, daysToPayment: 25, date: '2026-01-01' },
    { amount: 187000, daysToPayment: 27, date: '2025-12-01' },
    { amount: 180000, daysToPayment: 30, date: '2025-11-01' },
  ],
  'mai-002': [
    { amount: 90000, daysToPayment: 45, date: '2026-01-15' },
    { amount: 88000, daysToPayment: 52, date: '2025-12-15' },
    { amount: 92000, daysToPayment: 48, date: '2025-11-15' },
  ],
  'mai-003': [
    { amount: 14000, daysToPayment: 55, date: '2025-12-31' },
    { amount: 15000, daysToPayment: 62, date: '2025-11-30' },
    { amount: 13500, daysToPayment: 50, date: '2025-10-31' },
  ],
  'mai-010': [
    { amount: 9000, daysToPayment: 70, date: '2025-12-15' },
    { amount: 8800, daysToPayment: 65, date: '2025-11-15' },
    { amount: 9200, daysToPayment: 75, date: '2025-10-15' },
  ],
};

const maiActivities = activityLog.filter(a => a.agent === 'MAI');

interface PaymentDnaModalProps {
  account: MaiAccount;
  onClose: () => void;
}

const PaymentDnaModal: React.FC<PaymentDnaModalProps> = ({ account, onClose }) => {
  const [analysis, setAnalysis] = useState<{ avgDaysToPayment: number; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'; prediction: string; recommendation: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const history = mockPaymentHistory[account.id] || [
    { amount: account.amount, daysToPayment: account.daysOutstanding || 30, date: account.lastInvoice },
  ];

  const avgDays = Math.round(history.reduce((a, b) => a + b.daysToPayment, 0) / history.length);
  const riskColor = (level: string) => level === 'HIGH' ? 'text-accent-red' : level === 'MEDIUM' ? 'text-accent-amber' : 'text-accent-green';
  const riskBg = (level: string) => level === 'HIGH' ? 'bg-accent-red-light' : level === 'MEDIUM' ? 'bg-accent-amber-light' : 'bg-accent-green-light';

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzePaymentDNA(account.client, history);
      setAnalysis(result);
    } catch {
      setAnalysis({
        avgDaysToPayment: avgDays,
        riskLevel: avgDays > 45 ? 'HIGH' : avgDays > 30 ? 'MEDIUM' : 'LOW',
        prediction: `Based on ${history.length} invoices, payment expected around day ${avgDays}.`,
        recommendation: avgDays > 45 ? 'Initiate firm collections notice immediately.' : 'Monitor and send reminder at day 30.',
      });
    } finally {
      setLoading(false);
    }
  };

  const trend = history.length > 1
    ? history[0].daysToPayment - history[history.length - 1].daysToPayment
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-bg-secondary rounded-xl p-3 text-center">
          <p className="text-xs text-text-muted">Avg Days to Pay</p>
          <p className="text-2xl font-mono font-bold text-text-primary mt-1">{avgDays}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-3 text-center">
          <p className="text-xs text-text-muted">Trend</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            {trend > 0 ? <TrendingDown size={20} className="text-accent-red" /> : <TrendingUp size={20} className="text-accent-green" />}
            <span className={`text-base font-mono font-bold ${trend > 0 ? 'text-accent-red' : 'text-accent-green'}`}>
              {trend > 0 ? `+${trend}d` : `${trend}d`}
            </span>
          </div>
        </div>
        <div className="bg-bg-secondary rounded-xl p-3 text-center">
          <p className="text-xs text-text-muted">Invoices</p>
          <p className="text-2xl font-mono font-bold text-text-primary mt-1">{history.length}</p>
        </div>
      </div>

      {/* Sparkline-ish bar chart */}
      <div>
        <p className="text-xs font-medium text-text-secondary mb-2">Payment History (days)</p>
        <div className="flex items-end gap-1 h-12">
          {history.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-t ${h.daysToPayment > 45 ? 'bg-accent-red' : h.daysToPayment > 30 ? 'bg-accent-amber' : 'bg-accent-green'}`}
                style={{ height: `${Math.min((h.daysToPayment / 80) * 48, 48)}px` }}
              />
              <span className="text-[9px] text-text-muted">{h.daysToPayment}d</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis */}
      {!analysis ? (
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-accent-blue-light text-accent-blue text-sm font-medium hover:bg-accent-blue hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <><RefreshCw size={14} className="animate-spin" /> Analyzing...</>
          ) : (
            'AI Analysis'
          )}
        </button>
      ) : (
        <div className={`${riskBg(analysis.riskLevel)} rounded-xl p-4 space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary">Payment DNA Analysis</span>
            <span className={`text-xs font-bold ${riskColor(analysis.riskLevel)}`}>{analysis.riskLevel} RISK</span>
          </div>
          <p className="text-xs text-text-secondary"><span className="font-medium">Prediction:</span> {analysis.prediction}</p>
          <p className="text-xs text-text-secondary"><span className="font-medium">Action:</span> {analysis.recommendation}</p>
        </div>
      )}

      <button onClick={onClose} className="w-full py-2 rounded-lg border border-border-base text-sm text-text-secondary hover:bg-bg-secondary transition-colors">
        Close
      </button>
    </div>
  );
};

const BillingPortfolioTab: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<MaiAccount | null>(null);
  const [dnaModal, setDnaModal] = useState(false);
  const [dnaAccount, setDnaAccount] = useState<MaiAccount | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const openAction = (action: string, account: MaiAccount) => {
    setModalAction(action);
    setSelectedAccount(account);
    setModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const openDna = (account: MaiAccount) => {
    setDnaAccount(account);
    setDnaModal(true);
  };

  return (
    <div>
      {toastMsg && (
        <div className="fixed top-16 right-4 bg-accent-green text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 font-medium">
          {toastMsg}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-text-muted">11 accounts · {maiPortfolio.filter(a => a.status !== 'paid').length} active</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted bg-bg-secondary px-2.5 py-1 rounded-lg">
            Total AR: <span className="font-mono font-bold text-text-primary">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                maiPortfolio.filter(a => a.status !== 'paid').reduce((sum, a) => sum + a.amount, 0)
              )}
            </span>
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-base">
              <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Client</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Invoice</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Amount</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Days Out</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Contact</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {maiPortfolio.map(account => (
              <tr key={account.id} className="border-b border-border-base hover:bg-bg-secondary transition-colors">
                <td className="py-3 px-3">
                  <div>
                    <button
                      onClick={() => openDna(account)}
                      className="font-medium text-text-primary hover:text-accent-blue transition-colors text-left"
                    >
                      {account.client}
                    </button>
                    <p className="text-xs text-text-muted">{account.billingType}</p>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <p className="font-mono text-xs text-text-secondary">{account.invoiceNum}</p>
                  <p className="text-xs text-text-muted">{new Date(account.lastInvoice).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="font-mono font-bold text-text-primary">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(account.amount)}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <StatusPill status={account.status} />
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`font-mono text-sm font-semibold ${account.daysOutstanding > 60 ? 'text-accent-red' : account.daysOutstanding > 30 ? 'text-accent-amber' : 'text-text-secondary'}`}>
                    {account.daysOutstanding > 0 ? `${account.daysOutstanding}d` : '—'}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <p className="text-xs text-text-secondary">{account.contactName}</p>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1 justify-end flex-wrap">
                    <button onClick={() => openAction('Generate Invoice', account)} className="text-xs px-2 py-1 rounded bg-accent-blue-light text-accent-blue hover:bg-accent-blue hover:text-white transition-colors">
                      Generate
                    </button>
                    <button onClick={() => {
                      openAction('Release Invoice', account);
                    }} className="text-xs px-2 py-1 rounded bg-bg-secondary text-text-secondary hover:bg-accent-blue-light hover:text-accent-blue transition-colors">
                      Release
                    </button>
                    {(account.status === 'overdue' || account.daysOutstanding > 45) && (
                      <button onClick={() => openAction('Initiate Collections', account)} className="text-xs px-2 py-1 rounded bg-accent-amber-light text-accent-amber hover:bg-accent-amber hover:text-white transition-colors">
                        Collect
                      </button>
                    )}
                    {account.daysOutstanding > 60 && (
                      <button onClick={() => openAction('Escalate to Manager', account)} className="text-xs px-2 py-1 rounded bg-accent-red-light text-accent-red hover:bg-accent-red hover:text-white transition-colors">
                        Escalate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`${modalAction} — ${selectedAccount?.client}`}>
        <div className="space-y-4">
          <div className="bg-bg-secondary rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-text-muted">Invoice</p><p className="font-mono font-medium">{selectedAccount?.invoiceNum}</p></div>
              <div><p className="text-xs text-text-muted">Amount</p><p className="font-mono font-bold text-text-primary">{selectedAccount && new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(selectedAccount.amount)}</p></div>
              <div><p className="text-xs text-text-muted">Contact</p><p>{selectedAccount?.contactName}</p></div>
              <div><p className="text-xs text-text-muted">Days Outstanding</p><p className="font-mono">{selectedAccount?.daysOutstanding}</p></div>
            </div>
          </div>
          {selectedAccount?.notes && <p className="text-sm text-text-secondary bg-accent-amber-light/30 rounded-lg p-3"><span className="font-medium">Note:</span> {selectedAccount.notes}</p>}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-border-base text-text-secondary hover:bg-bg-secondary text-sm font-medium transition-colors">Cancel</button>
            <button onClick={() => {
              setModalOpen(false);
              showToast(`${modalAction} completed for ${selectedAccount?.client}`);
            }} className="flex-1 py-2.5 rounded-lg bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/90 transition-colors">
              Confirm {modalAction}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={dnaModal} onClose={() => setDnaModal(false)} title={`Payment DNA — ${dnaAccount?.client}`}>
        {dnaAccount && <PaymentDnaModal account={dnaAccount} onClose={() => setDnaModal(false)} />}
      </Modal>
    </div>
  );
};

const ArAgingTab: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[{ label: '0–30 Days', amount: 314900, color: 'text-accent-blue' }, { label: '31–60 Days', amount: 94200, color: 'text-accent-amber' }, { label: '60+ Days', amount: 25400, color: 'text-accent-red' }].map(b => (
            <div key={b.label} className="bg-bg-secondary rounded-xl p-4">
              <p className="text-xs text-text-muted">{b.label}</p>
              <p className={`text-xl font-mono font-bold mt-1 ${b.color}`}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(b.amount)}</p>
            </div>
          ))}
        </div>
        <div className="bg-bg-card rounded-xl border border-border-base p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">AR Aging by Bucket</h3>
          <ArAgingWaterfall />
        </div>
        <div className="bg-bg-card rounded-xl border border-border-base overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-secondary border-b border-border-base">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">Client</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">0–30</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">31–60</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">61–90</th>
                <th className="text-right py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">90+</th>
              </tr>
            </thead>
            <tbody>
              {agingData.map((row, i) => (
                <tr key={i} className="border-b border-border-base hover:bg-bg-secondary">
                  <td className="py-2.5 px-4 font-medium text-text-primary">{row.client}</td>
                  {['0-30', '31-60', '61-90', '90+'].map(bucket => (
                    <td key={bucket} className="py-2.5 px-4 text-right font-mono text-sm">
                      {(row as unknown as Record<string, number>)[bucket] > 0 ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((row as unknown as Record<string, number>)[bucket]) : <span className="text-text-muted">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-mai-accent/5 border border-mai-accent/20 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-mai-accent mb-3 flex items-center gap-2">
            <span className="w-4 h-4 bg-mai-accent rounded flex items-center justify-center text-white text-xs font-bold">M</span>
            MAI Recommends
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Escalate Surefire Supplies', reason: '67 days — no response', priority: 'high' },
              { action: 'Send firm notice to SMP/UHA', reason: '51 days overdue', priority: 'high' },
              { action: 'Chase PO for Lucile Packard', reason: 'Blocks $22,100 invoice', priority: 'medium' },
            ].map((r, i) => (
              <div key={i} className={`p-3 rounded-lg border ${r.priority === 'high' ? 'bg-accent-red-light border-accent-red/20' : 'bg-accent-amber-light border-accent-amber/20'}`}>
                <p className="text-sm font-medium text-text-primary">{r.action}</p>
                <p className="text-xs text-text-secondary mt-0.5">{r.reason}</p>
                <button className="mt-2 text-xs text-accent-blue font-medium hover:underline flex items-center gap-1">
                  Review <ChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkOrdersTab: React.FC = () => {
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [selectedWo, setSelectedWo] = useState<typeof workOrders[0] | null>(null);
  const [billToast, setBillToast] = useState('');

  return (
    <div>
      {billToast && (
        <div className="fixed top-16 right-4 bg-accent-green text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50 font-medium">
          {billToast}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-base">
              <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase">WO #</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase">Client</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase">Description</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-text-muted uppercase">WO Status</th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-text-muted uppercase">PO Ref</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-text-muted uppercase">PO Status</th>
              <th className="text-center py-3 px-3 text-xs font-semibold text-text-muted uppercase">Invoice Ready</th>
              <th className="text-right py-3 px-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map(wo => (
              <tr key={wo.id} className="border-b border-border-base hover:bg-bg-secondary">
                <td className="py-3 px-3 font-mono text-xs text-text-secondary">{wo.id}</td>
                <td className="py-3 px-3 font-medium text-text-primary">{wo.client}</td>
                <td className="py-3 px-3 text-text-secondary max-w-xs truncate">{wo.description}</td>
                <td className="py-3 px-3 text-center">
                  <StatusPill status={wo.status === 'complete' ? 'paid' : 'pending'} />
                </td>
                <td className="py-3 px-3 font-mono text-xs">{wo.poRef || <span className="text-text-muted">N/A</span>}</td>
                <td className="py-3 px-3 text-center">
                  <StatusPill status={wo.poStatus === 'received' ? 'paid' : wo.poStatus === 'pending' ? 'pending_po' : 'current'} />
                </td>
                <td className="py-3 px-3 text-center">
                  {wo.invoiceReady ? <CheckCircle size={16} className="text-accent-green mx-auto" /> : <Clock size={16} className="text-text-muted mx-auto" />}
                </td>
                <td className="py-3 px-3 text-right">
                  {wo.poStatus === 'pending' && (
                    <button
                      onClick={() => { setSelectedWo(wo); setPoModalOpen(true); }}
                      className="text-xs px-3 py-1.5 rounded bg-accent-amber-light text-accent-amber hover:bg-accent-amber hover:text-white transition-colors font-medium"
                    >
                      Chase PO
                    </button>
                  )}
                  {wo.invoiceReady && (
                    <button
                      onClick={() => { setBillToast(`Invoice generated for ${wo.client} — ${wo.id}`); setTimeout(() => setBillToast(''), 3000); }}
                      className="text-xs px-3 py-1.5 rounded bg-accent-blue-light text-accent-blue hover:bg-accent-blue hover:text-white transition-colors font-medium ml-1"
                    >
                      Bill
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={poModalOpen} onClose={() => setPoModalOpen(false)} title={`PO Chase Workflow — ${selectedWo?.client}`}>
        <div className="space-y-4">
          <div className="bg-accent-amber-light rounded-xl p-4">
            <p className="text-sm font-semibold text-accent-amber">PO Required: {selectedWo?.poRef}</p>
            <p className="text-xs text-text-secondary mt-1">{selectedWo?.description}</p>
          </div>
          <div className="bg-bg-secondary rounded-xl p-4 space-y-2 text-sm">
            <p className="font-medium text-text-primary">MAI Draft Chase Email</p>
            <div className="bg-bg-card border border-border-base rounded-lg p-3 text-xs text-text-secondary leading-relaxed">
              <p>Hi [AP Contact],</p><br />
              <p>Following up on {selectedWo?.poRef} required to process work order {selectedWo?.id}. The work has been completed and we're ready to invoice, but need the PO reference to proceed.</p><br />
              <p>Could you confirm PO issuance at your earliest convenience?</p><br />
              <p>Thank you,<br />MAI — SMM Facilities Accounting</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPoModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-border-base text-text-secondary text-sm font-medium">Cancel</button>
            <button onClick={() => setPoModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/90">Send Chase Email</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ActivityLogTab: React.FC = () => {
  const [selected, setSelected] = useState<typeof maiActivities[0] | null>(null);

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-base">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Timestamp</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Type</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Description</th>
              <th className="text-right py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Amount</th>
              <th className="text-center py-2.5 px-3 text-xs font-semibold text-text-muted uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {maiActivities.map(item => (
              <tr
                key={item.id}
                className={`border-b border-border-base hover:bg-bg-secondary cursor-pointer transition-colors ${selected?.id === item.id ? 'bg-accent-blue-light/30' : ''}`}
                onClick={() => setSelected(item)}
              >
                <td className="py-2.5 px-3 text-xs font-mono text-text-muted whitespace-nowrap">
                  {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-xs bg-mai-accent/10 text-mai-accent px-2 py-0.5 rounded font-medium capitalize">
                    {item.type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-text-secondary text-xs max-w-xs truncate">{item.description}</td>
                <td className="py-2.5 px-3 text-right font-mono text-xs text-text-secondary">
                  {item.amount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.amount) : '—'}
                </td>
                <td className="py-2.5 px-3 text-center"><StatusPill status={item.status === 'completed' ? 'paid' : item.status === 'awaiting_approval' ? 'pending_approval' : 'pending'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {selected ? (
          <div className="bg-bg-secondary rounded-xl p-4 sticky top-4 space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">{selected.type.replace(/_/g, ' ').toUpperCase()}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{selected.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {selected.client && <div><p className="text-text-muted">Client</p><p className="font-medium">{selected.client}</p></div>}
              {selected.amount && <div><p className="text-text-muted">Amount</p><p className="font-mono font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(selected.amount)}</p></div>}
              {selected.confidence && <div><p className="text-text-muted">Confidence</p><p className="text-accent-green font-medium">{selected.confidence}%</p></div>}
              <div><p className="text-text-muted">Status</p><StatusPill status={selected.status === 'completed' ? 'paid' : 'pending'} /></div>
            </div>
          </div>
        ) : (
          <div className="bg-bg-secondary rounded-xl p-8 text-center text-text-muted text-sm">
            Click a row to view details
          </div>
        )}
      </div>
    </div>
  );
};

const MaiWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MaiTab>('billing');
  const [chatOpen, setChatOpen] = useState(false);

  const tabs: { id: MaiTab; label: string }[] = [
    { id: 'billing', label: 'Billing Portfolio' },
    { id: 'aging', label: 'AR Aging' },
    { id: 'workorders', label: 'Work Orders & PO Tracking' },
    { id: 'activity', label: 'Activity Log' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-mai-accent rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold font-mono">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary font-display">MAI ADE Workspace</h1>
              <p className="text-sm text-text-muted">Accounts Receivable · Billing · Collections · 11 Accounts</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-accent-green bg-accent-green-light px-3 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
            MAI Active · 29 tasks today
          </span>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${chatOpen ? 'bg-mai-accent text-white' : 'bg-mai-accent/10 text-mai-accent hover:bg-mai-accent hover:text-white'}`}
          >
            <MessageCircle size={14} />
            Chat with MAI
          </button>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="flex gap-1 bg-bg-secondary rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-bg-card rounded-xl border border-border-base p-5">
        {activeTab === 'billing' && <BillingPortfolioTab />}
        {activeTab === 'aging' && <ArAgingTab />}
        {activeTab === 'workorders' && <WorkOrdersTab />}
        {activeTab === 'activity' && <ActivityLogTab />}
      </div>

      {/* ADE Chat drawer */}
      {chatOpen && <AdeChat ade="MAI" onClose={() => setChatOpen(false)} />}
    </div>
  );
};

export default MaiWorkspace;
