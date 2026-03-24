import React, { useState } from 'react';
import { Save, RefreshCw, Bell, Shield, Database, Sliders, Users, Link, CheckCircle2, XCircle, Loader2, Download, Search, ChevronDown } from 'lucide-react';
import { useWorkflowStore } from '../stores/workflowStore';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}
const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${checked ? 'bg-accent-blue' : 'bg-border-base'}`}
  >
    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'left-6' : 'left-1'}`} />
  </button>
);

type SettingsTab = 'ade' | 'integrations' | 'users' | 'notifications' | 'audit';

const auditLog = [
  { id: 1, ts: '2026-03-23 14:32', user: 'Andrew Miller', action: 'Approved AP Batch B-2026-12', type: 'approval', amount: 67200 },
  { id: 2, ts: '2026-03-23 11:18', user: 'MAI ADE', action: 'Sent collections notice to SMP/UHA', type: 'collections', amount: 15600 },
  { id: 3, ts: '2026-03-23 09:45', user: 'NATALIA ADE', action: 'Flagged Centrihouse variance $200', type: 'variance' },
  { id: 4, ts: '2026-03-22 16:22', user: 'Andrew Miller', action: 'Updated escalation threshold to 60 days', type: 'config' },
  { id: 5, ts: '2026-03-22 14:11', user: 'NATALIA ADE', action: 'Generated AP batch B-2026-12', type: 'batch', amount: 67200 },
  { id: 6, ts: '2026-03-22 10:33', user: 'MAI ADE', action: 'Escalated Surefire Supplies account', type: 'escalation', amount: 9800 },
  { id: 7, ts: '2026-03-21 15:55', user: 'Andrew Miller', action: 'Changed NATALIA autonomy level to 7', type: 'config' },
  { id: 8, ts: '2026-03-21 09:00', user: 'System', action: 'Weekly backup completed', type: 'system' },
];

const typeColor: Record<string, string> = {
  approval: 'bg-accent-green-light text-accent-green',
  collections: 'bg-mai-accent/10 text-mai-accent',
  variance: 'bg-accent-amber-light text-accent-amber',
  config: 'bg-accent-blue-light text-accent-blue',
  batch: 'bg-natalia-accent/10 text-natalia-accent',
  escalation: 'bg-accent-red-light text-accent-red',
  system: 'bg-bg-secondary text-text-muted',
};

const AdeConfigTab: React.FC = () => {
  const { maiAutonomy, nataliaAutonomy, setAutonomy } = useWorkflowStore();
  const [maiSettings, setMaiSettings] = useState({
    billingCadence: 'monthly',
    collectionTone: 'professional',
    collectionCadenceDays: '15',
    escalationDaysThreshold: '60',
    escalationEmail: 'andrew.miller@smmfacilities.com',
    managerNotifyOnOverdue: true,
    managerNotifyOnEscalation: true,
    managerNotifyOnCollections: false,
    qbSyncEnabled: true,
    autoGenerateInvoices: true,
    autoSendInvoices: false,
    poChaseEnabled: true,
    poChaseDelayDays: '3',
    emailSignature: 'MAI — Accounts Receivable ADE\nSMM Facilities, Inc.',
    webhookUrl: '',
  });

  const [nataliaSettings, setNataliaSettings] = useState({
    apBatchDay: 'tuesday',
    apApprovalRequired: true,
    reconciliationDay: 'friday',
    vendorVarianceAlert: '250',
    vendorAlertEmail: 'andrew.miller@smmfacilities.com',
    managerNotifyOnBatch: true,
    managerNotifyOnVariance: true,
    managerNotifyOnRetention: true,
    ccStatementDay: '5',
    jePostingEnabled: true,
    autoAllocate: true,
    retentionRiskAlert: true,
    retentionDaysThreshold: '30',
  });

  const autonomyLabel = (level: number) => {
    if (level <= 2) return 'Full Human Control';
    if (level <= 5) return 'Supervised Autonomy';
    if (level <= 8) return 'High Autonomy';
    return 'Fully Autonomous';
  };

  return (
    <div className="space-y-6">
      {/* MAI */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-mai-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary font-display">MAI Configuration</h2>
            <p className="text-xs text-text-muted">AR, billing, collections settings</p>
          </div>
        </div>

        {/* Autonomy */}
        <div className="mb-5 p-4 bg-bg-secondary rounded-xl">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-medium text-text-secondary">Autonomy Level</span>
            <span className="font-bold text-mai-accent">{maiAutonomy}/10 — {autonomyLabel(maiAutonomy)}</span>
          </div>
          <input type="range" min={0} max={10} value={maiAutonomy} onChange={e => setAutonomy('MAI', parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #1e3a5f ${maiAutonomy * 10}%, #e5e7eb ${maiAutonomy * 10}%)` }} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary border-b border-border-base pb-2">Billing & Cadence</h3>
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">Invoice Cadence</label>
              <select value={maiSettings.billingCadence} onChange={e => setMaiSettings(p => ({ ...p, billingCadence: e.target.value }))}
                className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30">
                <option value="monthly">Monthly (1st)</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual only</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div><p className="text-sm font-medium text-text-primary">Auto-Generate Invoices</p><p className="text-xs text-text-muted">MAI creates drafts automatically</p></div>
              <Toggle checked={maiSettings.autoGenerateInvoices} onChange={() => setMaiSettings(p => ({ ...p, autoGenerateInvoices: !p.autoGenerateInvoices }))} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div><p className="text-sm font-medium text-text-primary">Auto-Send Invoices</p><p className="text-xs text-text-muted">Requires human approval</p></div>
              <Toggle checked={maiSettings.autoSendInvoices} onChange={() => setMaiSettings(p => ({ ...p, autoSendInvoices: !p.autoSendInvoices }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">Email Signature</label>
              <textarea value={maiSettings.emailSignature} onChange={e => setMaiSettings(p => ({ ...p, emailSignature: e.target.value }))} rows={2}
                className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none resize-none font-mono text-xs" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">Notification Webhook URL</label>
              <input type="url" value={maiSettings.webhookUrl} onChange={e => setMaiSettings(p => ({ ...p, webhookUrl: e.target.value }))}
                placeholder="https://hooks.slack.com/..."
                className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary border-b border-border-base pb-2">Collections & Escalation</h3>
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">Default Tone</label>
              <select value={maiSettings.collectionTone} onChange={e => setMaiSettings(p => ({ ...p, collectionTone: e.target.value }))}
                className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="firm">Firm</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">Escalate at (days)</label>
              <input type="number" value={maiSettings.escalationDaysThreshold} onChange={e => setMaiSettings(p => ({ ...p, escalationDaysThreshold: e.target.value }))}
                className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">Escalation Email</label>
              <input type="email" value={maiSettings.escalationEmail} onChange={e => setMaiSettings(p => ({ ...p, escalationEmail: e.target.value }))}
                className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
            </div>
            {[
              { key: 'managerNotifyOnOverdue', label: 'Notify on overdue' },
              { key: 'managerNotifyOnEscalation', label: 'Notify on escalation' },
              { key: 'managerNotifyOnCollections', label: 'Notify on collection send' },
            ].map(s => (
              <div key={s.key} className="flex items-center justify-between py-1.5">
                <p className="text-sm text-text-primary">{s.label}</p>
                <Toggle checked={maiSettings[s.key as keyof typeof maiSettings] as boolean} onChange={() => setMaiSettings(p => ({ ...p, [s.key]: !p[s.key as keyof typeof maiSettings] }))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NATALIA */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-natalia-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary font-display">NATALIA Configuration</h2>
            <p className="text-xs text-text-muted">AP operations, vendor management</p>
          </div>
        </div>

        <div className="mb-5 p-4 bg-bg-secondary rounded-xl">
          <div className="flex justify-between text-xs mb-2">
            <span className="font-medium text-text-secondary">Autonomy Level</span>
            <span className="font-bold text-natalia-accent">{nataliaAutonomy}/10 — {autonomyLabel(nataliaAutonomy)}</span>
          </div>
          <input type="range" min={0} max={10} value={nataliaAutonomy} onChange={e => setAutonomy('NATALIA', parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #1a4d3a ${nataliaAutonomy * 10}%, #e5e7eb ${nataliaAutonomy * 10}%)` }} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">AP Batch Day</label>
              <select value={nataliaSettings.apBatchDay} onChange={e => setNataliaSettings(p => ({ ...p, apBatchDay: e.target.value }))}
                className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                  <option key={d} value={d.toLowerCase()}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div><p className="text-sm font-medium text-text-primary">Require Human Approval</p><p className="text-xs text-text-muted">All AP batches</p></div>
              <Toggle checked={nataliaSettings.apApprovalRequired} onChange={() => setNataliaSettings(p => ({ ...p, apApprovalRequired: !p.apApprovalRequired }))} />
            </div>
            <div className="flex items-center justify-between py-2">
              <div><p className="text-sm font-medium text-text-primary">Auto-Allocate JE</p><p className="text-xs text-text-muted">Map CC to GL automatically</p></div>
              <Toggle checked={nataliaSettings.autoAllocate} onChange={() => setNataliaSettings(p => ({ ...p, autoAllocate: !p.autoAllocate }))} />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1.5">Alert on Variance Above ($)</label>
              <input type="number" value={nataliaSettings.vendorVarianceAlert} onChange={e => setNataliaSettings(p => ({ ...p, vendorVarianceAlert: e.target.value }))}
                className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
            </div>
            {[
              { key: 'managerNotifyOnBatch', label: 'Notify on batch ready' },
              { key: 'managerNotifyOnVariance', label: 'Notify on variance' },
              { key: 'managerNotifyOnRetention', label: 'Notify on retention risk' },
            ].map(s => (
              <div key={s.key} className="flex items-center justify-between py-1.5">
                <p className="text-sm text-text-primary">{s.label}</p>
                <Toggle checked={nataliaSettings[s.key as keyof typeof nataliaSettings] as boolean} onChange={() => setNataliaSettings(p => ({ ...p, [s.key]: !p[s.key as keyof typeof nataliaSettings] }))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const IntegrationsTab: React.FC = () => {
  const [qbTesting, setQbTesting] = useState(false);
  const [qbResult, setQbResult] = useState<'success' | 'fail' | null>(null);
  const [smtpHost, setSmtpHost] = useState('smtp.smmfacilities.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [fromEmail, setFromEmail] = useState('ade@smmfacilities.com');
  const [testEmailSent, setTestEmailSent] = useState(false);

  const testQb = async () => {
    setQbTesting(true);
    setQbResult(null);
    await new Promise(r => setTimeout(r, 1800));
    setQbResult('success');
    setQbTesting(false);
  };

  return (
    <div className="space-y-5">
      {/* QuickBooks */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs">QB</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">QuickBooks Online</h3>
              <p className="text-xs text-text-muted">Accounting & invoice sync</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium bg-accent-green-light text-accent-green px-2.5 py-1 rounded-full">
            <CheckCircle2 size={12} /> Connected
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-bg-secondary rounded-lg p-3">
            <p className="text-xs text-text-muted">Last Sync</p>
            <p className="text-sm font-medium text-text-primary">Today 2:14 PM</p>
          </div>
          <div className="bg-bg-secondary rounded-lg p-3">
            <p className="text-xs text-text-muted">Sync Frequency</p>
            <select className="text-sm bg-transparent text-text-primary w-full focus:outline-none">
              <option>Real-time</option>
              <option>Hourly</option>
              <option>Daily</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={testQb}
              disabled={qbTesting}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-border-base text-sm text-text-secondary hover:bg-bg-secondary transition-colors disabled:opacity-60"
            >
              {qbTesting ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              {qbTesting ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>
        {qbResult === 'success' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-accent-green bg-accent-green-light px-3 py-2 rounded-lg">
            <CheckCircle2 size={12} /> Connection verified — QB Online responding normally
          </div>
        )}
        {qbResult === 'fail' && (
          <div className="mt-3 flex items-center gap-2 text-xs text-accent-red bg-accent-red-light px-3 py-2 rounded-lg">
            <XCircle size={12} /> Connection failed — check credentials
          </div>
        )}
      </div>

      {/* ServiceTitan */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5 opacity-70">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs">ST</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">ServiceTitan Aspire</h3>
              <p className="text-xs text-text-muted">Field service management</p>
            </div>
          </div>
          <span className="text-xs font-medium bg-accent-blue-light text-accent-blue px-2.5 py-1 rounded-full">
            Coming Q3 2026
          </span>
        </div>
        <button className="w-full py-2 rounded-lg border border-dashed border-border-base text-xs text-text-muted hover:bg-bg-secondary transition-colors">
          Notify me when available
        </button>
      </div>

      {/* Email / SMTP */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent-amber rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xs">@</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Email / SMTP</h3>
            <p className="text-xs text-text-muted">Outbound email configuration</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">From Address</label>
            <input type="email" value={fromEmail} onChange={e => setFromEmail(e.target.value)}
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">SMTP Host</label>
            <input value={smtpHost} onChange={e => setSmtpHost(e.target.value)}
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">SMTP Port</label>
            <input value={smtpPort} onChange={e => setSmtpPort(e.target.value)}
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setTestEmailSent(true); setTimeout(() => setTestEmailSent(false), 3000); }}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${testEmailSent ? 'bg-accent-green text-white' : 'border border-border-base text-text-secondary hover:bg-bg-secondary'}`}
            >
              {testEmailSent ? '✓ Test Sent!' : 'Send Test Email'}
            </button>
          </div>
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Webhooks</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Incoming Webhook (QB events)</label>
            <input placeholder="https://platform.smmfacilities.com/webhooks/..."
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Outgoing Webhook (approvals)</label>
            <input placeholder="https://hooks.slack.com/..."
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
          </div>
        </div>
        <div className="border border-border-base rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-bg-secondary border-b border-border-base">
                <th className="text-left py-2 px-3 font-semibold text-text-muted uppercase">Event</th>
                <th className="text-left py-2 px-3 font-semibold text-text-muted uppercase">Source</th>
                <th className="text-right py-2 px-3 font-semibold text-text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { event: 'Invoice paid', source: 'QB Online', status: 'received' },
                { event: 'AP batch approved', source: 'Platform', status: 'sent' },
                { event: 'Collections notice sent', source: 'MAI ADE', status: 'sent' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-border-base last:border-0">
                  <td className="py-2 px-3 text-text-secondary">{r.event}</td>
                  <td className="py-2 px-3 text-text-muted">{r.source}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${r.status === 'received' ? 'bg-accent-blue-light text-accent-blue' : 'bg-accent-green-light text-accent-green'}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UsersTab: React.FC = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const users = [
    { name: 'Andrew Miller', email: 'andrew.miller@smmfacilities.com', role: 'Admin', initials: 'AM', lastLogin: 'Today 2:14 PM' },
    { name: 'Controller', email: 'controller@smmfacilities.com', role: 'Viewer', initials: 'CO', lastLogin: 'Mar 22' },
    { name: 'Jorge Ramirez', email: 'j.ramirez@smmfacilities.com', role: 'Manager', initials: 'JR', lastLogin: 'Mar 23' },
    { name: 'Esteban Vega', email: 'e.vega@smmfacilities.com', role: 'Manager', initials: 'EV', lastLogin: 'Mar 22' },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-bg-card border border-border-base rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border-base">
          <h3 className="text-sm font-semibold text-text-primary">Team Members</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-base bg-bg-secondary">
              <th className="text-left py-2.5 px-5 text-xs font-semibold text-text-muted uppercase">User</th>
              <th className="text-left py-2.5 px-5 text-xs font-semibold text-text-muted uppercase">Email</th>
              <th className="text-left py-2.5 px-5 text-xs font-semibold text-text-muted uppercase">Role</th>
              <th className="text-left py-2.5 px-5 text-xs font-semibold text-text-muted uppercase">Last Login</th>
              <th className="text-right py-2.5 px-5 text-xs font-semibold text-text-muted uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-b border-border-base hover:bg-bg-secondary transition-colors last:border-0">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-mai-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user.initials}</span>
                    </div>
                    <span className="font-medium text-text-primary">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 px-5 text-text-muted text-xs">{user.email}</td>
                <td className="py-3 px-5">
                  <select defaultValue={user.role} className="text-xs bg-bg-secondary border border-border-base rounded-lg px-2 py-1 text-text-primary focus:outline-none">
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Viewer</option>
                  </select>
                </td>
                <td className="py-3 px-5 text-xs text-text-muted">{user.lastLogin}</td>
                <td className="py-3 px-5 text-right">
                  {user.name !== 'Andrew Miller' && (
                    <button className="text-xs text-accent-red hover:underline">Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Invite New User</h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="colleague@smmfacilities.com"
            className="flex-1 text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none"
          />
          <select className="text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
            <option>Viewer</option>
            <option>Manager</option>
            <option>Admin</option>
          </select>
          <button
            onClick={() => { if (inviteEmail) { setInviteSent(true); setInviteEmail(''); setTimeout(() => setInviteSent(false), 3000); } }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${inviteSent ? 'bg-accent-green text-white' : 'bg-accent-blue text-white hover:bg-accent-blue/90'}`}
          >
            {inviteSent ? '✓ Invited!' : 'Send Invite'}
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationsTab: React.FC = () => {
  const [prefs, setPrefs] = useState({
    overdueEmail: true, overdueSlack: true, overdueSms: false,
    escalationEmail: true, escalationSlack: true, escalationSms: true,
    batchEmail: true, batchSlack: false, batchSms: false,
    varianceEmail: true, varianceSlack: true, varianceSms: false,
    hitlEmail: false, hitlSlack: true, hitlSms: true,
  });

  const rows = [
    { key: 'overdue', label: 'Invoice overdue', desc: 'When invoice passes due date' },
    { key: 'escalation', label: 'Escalation triggered', desc: 'Account escalated to manager' },
    { key: 'batch', label: 'AP batch ready', desc: 'Payment batch awaiting approval' },
    { key: 'variance', label: 'Vendor variance', desc: 'Reconciliation variance detected' },
    { key: 'hitl', label: 'HITL approval needed', desc: 'ADE requests human decision' },
  ];

  return (
    <div className="bg-bg-card border border-border-base rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border-base">
        <h3 className="text-sm font-semibold text-text-primary">Notification Preferences</h3>
        <p className="text-xs text-text-muted mt-0.5">Configure how you receive alerts per event type</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-base bg-bg-secondary">
              <th className="text-left py-3 px-5 text-xs font-semibold text-text-muted uppercase">Event</th>
              <th className="text-center py-3 px-5 text-xs font-semibold text-text-muted uppercase">Email</th>
              <th className="text-center py-3 px-5 text-xs font-semibold text-text-muted uppercase">Slack</th>
              <th className="text-center py-3 px-5 text-xs font-semibold text-text-muted uppercase">SMS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.key} className="border-b border-border-base last:border-0">
                <td className="py-3.5 px-5">
                  <p className="text-sm font-medium text-text-primary">{row.label}</p>
                  <p className="text-xs text-text-muted">{row.desc}</p>
                </td>
                {(['Email', 'Slack', 'Sms'] as const).map(ch => {
                  const k = `${row.key}${ch}` as keyof typeof prefs;
                  return (
                    <td key={ch} className="py-3.5 px-5 text-center">
                      <Toggle checked={prefs[k]} onChange={() => setPrefs(p => ({ ...p, [k]: !p[k] }))} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AuditTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [exportDone, setExportDone] = useState(false);

  const filtered = auditLog.filter(r => {
    const matchSearch = !search || r.action.toLowerCase().includes(search.toLowerCase()) || r.user.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-bg-secondary border border-border-base rounded-lg px-3 py-2">
          <Search size={14} className="text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audit log..."
            className="flex-1 text-sm bg-transparent text-text-primary focus:outline-none placeholder-text-muted" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
          <option value="all">All Types</option>
          <option value="approval">Approval</option>
          <option value="collections">Collections</option>
          <option value="config">Config</option>
          <option value="batch">Batch</option>
          <option value="escalation">Escalation</option>
        </select>
        <button
          onClick={() => { setExportDone(true); setTimeout(() => setExportDone(false), 2500); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${exportDone ? 'bg-accent-green text-white' : 'border border-border-base text-text-secondary hover:bg-bg-secondary'}`}
        >
          <Download size={14} />
          {exportDone ? 'Exported!' : 'Export CSV'}
        </button>
      </div>

      <div className="bg-bg-card border border-border-base rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-base bg-bg-secondary">
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">Timestamp</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">User</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">Action</th>
              <th className="text-left py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">Type</th>
              <th className="text-right py-2.5 px-4 text-xs font-semibold text-text-muted uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id} className="border-b border-border-base hover:bg-bg-secondary transition-colors last:border-0">
                <td className="py-2.5 px-4 text-xs font-mono text-text-muted">{row.ts}</td>
                <td className="py-2.5 px-4 text-xs text-text-secondary">{row.user}</td>
                <td className="py-2.5 px-4 text-xs text-text-primary">{row.action}</td>
                <td className="py-2.5 px-4">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium capitalize ${typeColor[row.type] || 'bg-bg-secondary text-text-muted'}`}>
                    {row.type}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right text-xs font-mono text-text-secondary">
                  {row.amount ? `$${row.amount.toLocaleString()}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-bg-card border border-border-base rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Data Retention Policy</p>
            <p className="text-xs text-text-muted mt-0.5">Audit logs are retained per configured policy</p>
          </div>
          <select defaultValue="7years" className="text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
            <option value="3years">3 Years</option>
            <option value="7years">7 Years</option>
            <option value="10years">10 Years</option>
            <option value="indefinite">Indefinite</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('ade');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'ade', label: 'ADE Configuration', icon: <Sliders size={14} /> },
    { id: 'integrations', label: 'API Integrations', icon: <Link size={14} /> },
    { id: 'users', label: 'User Management', icon: <Users size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'audit', label: 'Data & Audit', icon: <Database size={14} /> },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Settings</h1>
          <p className="text-sm text-text-muted mt-0.5">Platform configuration, integrations, and audit</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved ? 'bg-accent-green text-white' : 'bg-accent-blue text-white hover:bg-accent-blue/90'}`}
        >
          <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-bg-secondary rounded-xl p-1 w-fit flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'ade' && <AdeConfigTab />}
      {activeTab === 'integrations' && <IntegrationsTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'audit' && <AuditTab />}
    </div>
  );
};

export default Settings;
