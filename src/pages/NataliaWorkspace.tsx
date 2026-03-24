import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Upload, RefreshCw, ChevronRight, MessageCircle } from 'lucide-react';
import AdeChat from '../components/ade/AdeChat';
import { nataliaPortfolio, NataliaAccount } from '../data/natalia_portfolio';
import { apBatches, vendorPanels, monthlyRentSchedule } from '../data/ap_batches';
import { activityLog } from '../data/activity_log';
import StatusPill from '../components/common/StatusPill';
import Modal from '../components/common/Modal';

type NataliaTab = 'billing' | 'aging' | 'ap' | 'vendor' | 'je' | 'collections' | 'activity';

const nataliaActivities = activityLog.filter(a => a.agent === 'NATALIA');

const BillingPortfolioTab: React.FC = () => {
  const [modal, setModal] = useState<{ open: boolean; account: NataliaAccount | null; action: string }>({ open: false, account: null, action: '' });
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">24 accounts · {nataliaPortfolio.filter(a => a.retentionRisk).length} retention risk flags</p>
        <span className="text-xs text-text-muted bg-bg-secondary px-2.5 py-1 rounded-lg">
          Total AR: <span className="font-mono font-bold text-text-primary">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
              nataliaPortfolio.filter(a => a.status !== 'paid').reduce((s, a) => s + a.amount, 0)
            )}
          </span>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-base">
              {['Client', 'Industry', 'Invoice', 'Amount', 'Status', 'Days Out', 'Contact', 'Actions'].map(h => (
                <th key={h} className={`py-3 px-3 text-xs font-semibold text-text-muted uppercase tracking-wide ${h === 'Amount' || h === 'Actions' ? 'text-right' : h === 'Status' || h === 'Days Out' ? 'text-center' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nataliaPortfolio.map(account => (
              <tr key={account.id} className="border-b border-border-base hover:bg-bg-secondary transition-colors">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-medium text-text-primary">{account.client}</p>
                      {account.retentionRisk && (
                        <span className="inline-flex items-center gap-1 text-xs bg-accent-red-light text-accent-red px-1.5 py-0.5 rounded font-medium mt-0.5">
                          <AlertTriangle size={10} /> RETENTION RISK
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-xs text-text-muted">{account.industry}</td>
                <td className="py-3 px-3">
                  <p className="font-mono text-xs text-text-secondary">{account.invoiceNum}</p>
                  <p className="text-xs text-text-muted">{new Date(account.lastInvoice).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="font-mono font-bold text-text-primary text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(account.amount)}
                  </span>
                </td>
                <td className="py-3 px-3 text-center"><StatusPill status={account.status} /></td>
                <td className="py-3 px-3 text-center">
                  <span className={`font-mono text-sm font-semibold ${account.daysOutstanding > 60 ? 'text-accent-red' : account.daysOutstanding > 30 ? 'text-accent-amber' : 'text-text-secondary'}`}>
                    {account.daysOutstanding > 0 ? `${account.daysOutstanding}d` : '—'}
                  </span>
                </td>
                <td className="py-3 px-3 text-xs text-text-secondary">{account.contactName}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button onClick={() => setModal({ open: true, account, action: 'Generate Invoice' })} className="text-xs px-2 py-1 rounded bg-natalia-accent/10 text-natalia-accent hover:bg-natalia-accent hover:text-white transition-colors">Invoice</button>
                    {account.retentionRisk && <button className="text-xs px-2 py-1 rounded bg-accent-red-light text-accent-red hover:bg-accent-red hover:text-white transition-colors">Flag</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, account: null, action: '' })} title={`${modal.action} — ${modal.account?.client}`}>
        <div className="space-y-4">
          {modal.account && (
            <div className="bg-bg-secondary rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-text-muted">Invoice</p><p className="font-mono">{modal.account.invoiceNum}</p></div>
              <div><p className="text-xs text-text-muted">Amount</p><p className="font-mono font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(modal.account.amount)}</p></div>
              <div><p className="text-xs text-text-muted">Industry</p><p>{modal.account.industry}</p></div>
              <div><p className="text-xs text-text-muted">Contact</p><p>{modal.account.contactName}</p></div>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setModal({ open: false, account: null, action: '' })} className="flex-1 py-2.5 rounded-lg border border-border-base text-sm">Cancel</button>
            <button onClick={() => setModal({ open: false, account: null, action: '' })} className="flex-1 py-2.5 rounded-lg bg-natalia-accent text-white text-sm font-medium">Confirm</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ApOperationsTab: React.FC = () => {
  const [approveModal, setApproveModal] = useState(false);
  const [confirmStep, setConfirmStep] = useState(1);

  const handleApprove = () => {
    if (confirmStep === 1) setConfirmStep(2);
    else { setApproveModal(false); setConfirmStep(1); }
  };

  return (
    <div className="space-y-6">
      {/* Weekly AP Batch */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-text-primary font-display">Weekly AP Batch — {apBatches[0].batchRef}</h3>
            <p className="text-xs text-text-muted mt-0.5">{apBatches[0].period} · {apBatches[0].vendorCount} vendors</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-text-muted">Total</p>
              <p className="text-xl font-mono font-bold text-text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(apBatches[0].totalAmount)}</p>
            </div>
            <StatusPill status="pending_approval" size="md" />
          </div>
        </div>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-base">
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-muted uppercase">Vendor</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-muted uppercase">Category</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-text-muted uppercase">Invoice Ref</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-text-muted uppercase">Amount</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-text-muted uppercase">Due</th>
              </tr>
            </thead>
            <tbody>
              {apBatches[0].lineItems.map((item, i) => (
                <tr key={i} className="border-b border-border-base hover:bg-bg-secondary">
                  <td className="py-2.5 px-3 font-medium text-text-primary">{item.vendor}</td>
                  <td className="py-2.5 px-3 text-xs text-text-secondary">{item.category}</td>
                  <td className="py-2.5 px-3 font-mono text-xs text-text-muted">{item.invoiceRef}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.amount)}</td>
                  <td className="py-2.5 px-3 text-center text-xs text-text-muted">{new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 rounded-lg border border-border-base text-sm text-text-secondary hover:bg-bg-secondary transition-colors">Download PDF</button>
          <button onClick={() => setApproveModal(true)} className="px-4 py-2 rounded-lg bg-natalia-accent text-white text-sm font-medium hover:bg-natalia-accent/90 transition-colors">
            Approve Batch Release
          </button>
        </div>
      </div>

      {/* Monthly Rent Schedule */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <h3 className="text-base font-semibold text-text-primary font-display mb-4">Monthly Rent Schedule — April 2026</h3>
        <div className="space-y-2">
          {monthlyRentSchedule.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border-base last:border-0">
              <div>
                <p className="text-sm font-medium text-text-primary">{r.property}</p>
                <p className="text-xs text-text-muted">{r.tenant} · Due {new Date(r.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(r.monthlyRent)}</span>
                <StatusPill status="pending" />
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3">
            <span className="text-sm font-semibold text-text-secondary">Total April Rent</span>
            <span className="text-lg font-mono font-bold text-text-primary">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(monthlyRentSchedule.reduce((s, r) => s + r.monthlyRent, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* 2-step confirm modal */}
      <Modal isOpen={approveModal} onClose={() => { setApproveModal(false); setConfirmStep(1); }} title="Approve AP Batch Release">
        <div className="space-y-4">
          {confirmStep === 1 ? (
            <>
              <div className="bg-accent-amber-light rounded-xl p-4">
                <p className="text-sm font-semibold text-accent-amber">Step 1 of 2 — Review Summary</p>
                <p className="text-xs text-text-secondary mt-1">You are about to authorize disbursement of <span className="font-bold font-mono">$67,200</span> to 18 vendors.</p>
              </div>
              <div className="bg-bg-secondary rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-text-muted">Batch</p><p className="font-mono font-bold">B-2026-12</p></div>
                <div><p className="text-xs text-text-muted">Vendors</p><p className="font-mono font-bold">18</p></div>
                <div><p className="text-xs text-text-muted">Total</p><p className="font-mono font-bold">$67,200</p></div>
                <div><p className="text-xs text-text-muted">Method</p><p>ACH Transfer</p></div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setApproveModal(false)} className="flex-1 py-2.5 rounded-lg border border-border-base text-sm">Cancel</button>
                <button onClick={handleApprove} className="flex-1 py-2.5 rounded-lg bg-accent-amber text-white text-sm font-medium">Proceed to Final Confirm</button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-accent-red-light rounded-xl p-4">
                <p className="text-sm font-semibold text-accent-red">Step 2 of 2 — Final Authorization</p>
                <p className="text-xs text-text-secondary mt-1">This action is irreversible. Funds will be disbursed immediately upon confirmation.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setApproveModal(false); setConfirmStep(1); }} className="flex-1 py-2.5 rounded-lg border border-border-base text-sm">Cancel</button>
                <button onClick={handleApprove} className="flex-1 py-2.5 rounded-lg bg-accent-red text-white text-sm font-medium">Confirm & Release $67,200</button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

const VendorReconciliationTab: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-5">
      {vendorPanels.map(v => (
        <div key={v.vendor} className={`bg-bg-card border rounded-xl p-5 ${v.status === 'under_review' ? 'border-accent-amber' : v.status === 'variance' ? 'border-accent-amber/40' : 'border-border-base'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-text-primary font-display">{v.vendor}</h3>
              <p className="text-xs text-text-muted">{v.category}</p>
            </div>
            <StatusPill status={v.status} size="md" />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-bg-secondary rounded-lg p-3">
              <p className="text-xs text-text-muted">Contract Monthly</p>
              <p className="text-base font-mono font-bold text-text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v.contractMonthly)}</p>
            </div>
            <div className="bg-bg-secondary rounded-lg p-3">
              <p className="text-xs text-text-muted">Last Invoice</p>
              <p className="text-base font-mono font-bold text-text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v.lastInvoice)}</p>
            </div>
            <div className={`rounded-lg p-3 ${v.variance > 0 ? 'bg-accent-amber-light' : 'bg-accent-green-light'}`}>
              <p className="text-xs text-text-muted">Variance</p>
              <p className={`text-base font-mono font-bold ${v.variance > 0 ? 'text-accent-amber' : 'text-accent-green'}`}>
                {v.variance > 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v.variance)}
              </p>
            </div>
          </div>
          {v.variance !== 0 && (
            <div className="bg-accent-amber-light/50 rounded-lg p-3 text-xs text-text-secondary mb-3">
              <span className="font-medium text-accent-amber">Variance Note: </span>{v.varianceNote}
            </div>
          )}
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-lg border border-border-base text-xs text-text-secondary hover:bg-bg-secondary transition-colors">View History</button>
            {v.variance !== 0 && (
              <button className="flex-1 py-2 rounded-lg bg-natalia-accent/10 text-natalia-accent text-xs font-medium hover:bg-natalia-accent hover:text-white transition-colors">Post Variance JE</button>
            )}
            {v.status === 'matched' && <button className="flex-1 py-2 rounded-lg bg-accent-green-light text-accent-green text-xs font-medium">Matched ✓</button>}
          </div>
        </div>
      ))}
    </div>
  );
};

const JeManagementTab: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Home Depot JE Schedule */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-text-primary font-display">Home Depot JE Upload Schedule</h3>
            <p className="text-xs text-text-muted">Corporate card charges allocated monthly</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-accent-blue-light text-accent-blue rounded-lg text-sm font-medium hover:bg-accent-blue hover:text-white transition-colors">
            <Upload size={14} /> Upload Statement
          </button>
        </div>
        <div className="space-y-2">
          {[
            { month: 'March 2026', transactions: 47, total: 3840, status: 'posted', glAccount: '7210-Facilities-OpEx' },
            { month: 'February 2026', transactions: 39, total: 3210, status: 'posted', glAccount: '7210-Facilities-OpEx' },
            { month: 'January 2026', transactions: 52, total: 4480, status: 'posted', glAccount: '7210-Facilities-OpEx' },
            { month: 'December 2025', transactions: 61, total: 5120, status: 'posted', glAccount: '7210-Facilities-OpEx' },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border-base last:border-0">
              <div>
                <p className="text-sm font-medium text-text-primary">{r.month}</p>
                <p className="text-xs text-text-muted">{r.transactions} transactions · GL: {r.glAccount}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(r.total)}</span>
                <StatusPill status={r.status === 'posted' ? 'paid' : 'pending'} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CC Payment Panel */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <h3 className="text-base font-semibold text-text-primary font-display mb-4">Corporate Card Payment Schedule</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { card: 'Home Depot Business CC', last4: '4421', balance: 3840, dueDate: 'Apr 5', status: 'upcoming' },
            { card: 'Grainger Business CC', last4: '8812', balance: 1240, dueDate: 'Apr 8', status: 'upcoming' },
            { card: 'Amazon Business CC', last4: '2291', balance: 680, dueDate: 'Apr 10', status: 'upcoming' },
          ].map((c, i) => (
            <div key={i} className="bg-bg-secondary rounded-xl p-4">
              <p className="text-sm font-semibold text-text-primary">{c.card}</p>
              <p className="text-xs text-text-muted mt-0.5">···· {c.last4}</p>
              <p className="text-xl font-mono font-bold text-text-primary mt-3">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(c.balance)}</p>
              <p className="text-xs text-text-muted mt-1">Due {c.dueDate}</p>
              <button className="mt-3 w-full py-1.5 rounded-lg bg-natalia-accent text-white text-xs font-medium hover:bg-natalia-accent/90 transition-colors">
                Schedule Payment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActivityLogTab: React.FC = () => {
  const [selected, setSelected] = useState<typeof nataliaActivities[0] | null>(null);
  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-base">
              {['Timestamp', 'Type', 'Description', 'Amount', 'Status'].map(h => (
                <th key={h} className={`py-2.5 px-3 text-xs font-semibold text-text-muted uppercase ${h === 'Amount' ? 'text-right' : h === 'Status' ? 'text-center' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nataliaActivities.map(item => (
              <tr key={item.id} className={`border-b border-border-base hover:bg-bg-secondary cursor-pointer transition-colors ${selected?.id === item.id ? 'bg-natalia-accent/5' : ''}`} onClick={() => setSelected(item)}>
                <td className="py-2.5 px-3 text-xs font-mono text-text-muted whitespace-nowrap">
                  {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-xs bg-natalia-accent/10 text-natalia-accent px-2 py-0.5 rounded font-medium capitalize">
                    {item.type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-text-secondary text-xs max-w-xs truncate">{item.description}</td>
                <td className="py-2.5 px-3 text-right font-mono text-xs text-text-secondary">
                  {item.amount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.amount) : '—'}
                </td>
                <td className="py-2.5 px-3 text-center"><StatusPill status={item.status === 'completed' ? 'paid' : 'pending'} /></td>
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
            </div>
          </div>
        ) : (
          <div className="bg-bg-secondary rounded-xl p-8 text-center text-text-muted text-sm">Click a row to view details</div>
        )}
      </div>
    </div>
  );
};

const NataliaWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NataliaTab>('billing');
  const [chatOpen, setChatOpen] = useState(false);

  const tabs: { id: NataliaTab; label: string }[] = [
    { id: 'billing', label: 'Billing Portfolio' },
    { id: 'aging', label: 'AR Aging' },
    { id: 'ap', label: 'AP Operations' },
    { id: 'vendor', label: 'Vendor Reconciliation' },
    { id: 'je', label: 'JE Management' },
    { id: 'activity', label: 'Activity Log' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-natalia-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold font-mono">N</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-display">NATALIA ADE Workspace</h1>
            <p className="text-sm text-text-muted">Accounts Payable · Vendor Mgmt · JE · 24 Accounts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-accent-green bg-accent-green-light px-3 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
            NATALIA Active · 18 tasks today
          </span>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${chatOpen ? 'bg-natalia-accent text-white' : 'bg-natalia-accent/10 text-natalia-accent hover:bg-natalia-accent hover:text-white'}`}
          >
            <MessageCircle size={14} />
            Chat with NATALIA
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-bg-secondary rounded-xl p-1 w-fit flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-bg-card rounded-xl border border-border-base p-5">
        {activeTab === 'billing' && <BillingPortfolioTab />}
        {activeTab === 'aging' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[{ label: '0–30', amount: 750300, color: 'text-accent-blue' }, { label: '31–60', amount: 247000, color: 'text-accent-amber' }, { label: '61–90', amount: 141500, color: 'text-accent-amber' }, { label: '90+', amount: 108200, color: 'text-accent-red' }].map(b => (
                <div key={b.label} className="bg-bg-secondary rounded-xl p-4 text-center">
                  <p className="text-xs text-text-muted">{b.label} Days</p>
                  <p className={`text-xl font-mono font-bold mt-1 ${b.color}`}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(b.amount)}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-text-muted">Detailed aging table available in the full report. Retention-risk accounts flagged separately in Billing Portfolio tab.</p>
          </div>
        )}
        {activeTab === 'ap' && <ApOperationsTab />}
        {activeTab === 'vendor' && <VendorReconciliationTab />}
        {activeTab === 'je' && <JeManagementTab />}
        {activeTab === 'activity' && <ActivityLogTab />}
      </div>
      {/* ADE Chat drawer */}
      {chatOpen && <AdeChat ade="NATALIA" onClose={() => setChatOpen(false)} />}
    </div>
  );
};

export default NataliaWorkspace;
