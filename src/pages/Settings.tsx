import React, { useState } from 'react';
import { Save, RefreshCw, Bell, Shield, Database, Sliders } from 'lucide-react';

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

const Settings: React.FC = () => {
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
    qbSyncFrequency: 'realtime',
    autoGenerateInvoices: true,
    autoSendInvoices: false,
    poChaseEnabled: true,
    poChaseDelayDays: '3',
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

  const [globalSettings, setGlobalSettings] = useState({
    timezone: 'America/Los_Angeles',
    fiscalYearStart: 'january',
    defaultCurrency: 'USD',
    auditLogRetention: '7years',
    sessionTimeout: '8hours',
    twoFactorRequired: true,
    emailDomain: 'smmfacilities.com',
  });

  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleMai = (key: keyof typeof maiSettings) => {
    setMaiSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleNatalia = (key: keyof typeof nataliaSettings) => {
    setNataliaSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleGlobal = (key: keyof typeof globalSettings) => {
    setGlobalSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Settings</h1>
          <p className="text-sm text-text-muted mt-0.5">Configure MAI, NATALIA, and global platform settings</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved ? 'bg-accent-green text-white' : 'bg-accent-blue text-white hover:bg-accent-blue/90'}`}
        >
          <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* MAI Config */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-mai-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary font-display">MAI Configuration</h2>
            <p className="text-xs text-text-muted">Billing, AR, collections agent settings</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {/* Billing & Cadence */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary border-b border-border-base pb-2">Billing & Cadence</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Invoice Generation Cadence</label>
                <select
                  value={maiSettings.billingCadence}
                  onChange={e => setMaiSettings(p => ({ ...p, billingCadence: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
                >
                  <option value="monthly">Monthly (1st of month)</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                  <option value="manual">Manual only</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-text-primary">Auto-Generate Invoices</p>
                  <p className="text-xs text-text-muted">MAI creates drafts automatically</p>
                </div>
                <Toggle checked={maiSettings.autoGenerateInvoices} onChange={() => toggleMai('autoGenerateInvoices')} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-text-primary">Auto-Send Invoices</p>
                  <p className="text-xs text-text-muted">Requires human approval before send</p>
                </div>
                <Toggle checked={maiSettings.autoSendInvoices} onChange={() => toggleMai('autoSendInvoices')} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-text-primary">PO Chase Automation</p>
                  <p className="text-xs text-text-muted">Auto-draft PO chase emails</p>
                </div>
                <Toggle checked={maiSettings.poChaseEnabled} onChange={() => toggleMai('poChaseEnabled')} />
              </div>
              {maiSettings.poChaseEnabled && (
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Chase after N days blocked</label>
                  <input type="number" value={maiSettings.poChaseDelayDays} onChange={e => setMaiSettings(p => ({ ...p, poChaseDelayDays: e.target.value }))}
                    className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30" />
                </div>
              )}
            </div>
          </div>

          {/* Collections & Escalation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary border-b border-border-base pb-2">Collections & Escalation</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Default Collection Tone</label>
                <select value={maiSettings.collectionTone} onChange={e => setMaiSettings(p => ({ ...p, collectionTone: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30">
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="firm">Firm</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Collection Notice Cadence (days)</label>
                <input type="number" value={maiSettings.collectionCadenceDays} onChange={e => setMaiSettings(p => ({ ...p, collectionCadenceDays: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Escalate to Manager at (days overdue)</label>
                <input type="number" value={maiSettings.escalationDaysThreshold} onChange={e => setMaiSettings(p => ({ ...p, escalationDaysThreshold: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Escalation Email</label>
                <input type="email" value={maiSettings.escalationEmail} onChange={e => setMaiSettings(p => ({ ...p, escalationEmail: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-text-secondary border-b border-border-base pb-2 mt-4">Manager Notifications</h3>
            <div className="space-y-2">
              {[
                { key: 'managerNotifyOnOverdue', label: 'Notify on overdue invoice', desc: 'Alert when invoice passes due date' },
                { key: 'managerNotifyOnEscalation', label: 'Notify on escalation', desc: 'Alert when account is escalated' },
                { key: 'managerNotifyOnCollections', label: 'Notify on collection send', desc: 'Alert when collection notice is sent' },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between py-1.5">
                  <div><p className="text-sm text-text-primary">{s.label}</p><p className="text-xs text-text-muted">{s.desc}</p></div>
                  <Toggle checked={maiSettings[s.key as keyof typeof maiSettings] as boolean} onChange={() => toggleMai(s.key as keyof typeof maiSettings)} />
                </div>
              ))}
            </div>
          </div>

          {/* QuickBooks */}
          <div className="col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary border-b border-border-base pb-2">QuickBooks Sync</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between col-span-1">
                <div><p className="text-sm font-medium text-text-primary">QB Sync Enabled</p><p className="text-xs text-text-muted">Live connection active</p></div>
                <Toggle checked={maiSettings.qbSyncEnabled} onChange={() => toggleMai('qbSyncEnabled')} />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Sync Frequency</label>
                <select value={maiSettings.qbSyncFrequency} onChange={e => setMaiSettings(p => ({ ...p, qbSyncFrequency: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="flex items-center gap-2 w-full py-2 px-3 rounded-lg border border-border-base text-sm text-text-secondary hover:bg-bg-secondary transition-colors">
                  <RefreshCw size={14} /> Test Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NATALIA Config */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-natalia-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">N</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary font-display">NATALIA Configuration</h2>
            <p className="text-xs text-text-muted">AP operations, vendor management, JE settings</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary border-b border-border-base pb-2">AP Operations</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Weekly AP Batch Day</label>
                <select value={nataliaSettings.apBatchDay} onChange={e => setNataliaSettings(p => ({ ...p, apBatchDay: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-natalia-accent/30">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                    <option key={d} value={d.toLowerCase()}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-text-primary">Require Human Approval</p><p className="text-xs text-text-muted">All AP batches need approval</p></div>
                <Toggle checked={nataliaSettings.apApprovalRequired} onChange={() => toggleNatalia('apApprovalRequired')} />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Reconciliation Day</label>
                <select value={nataliaSettings.reconciliationDay} onChange={e => setNataliaSettings(p => ({ ...p, reconciliationDay: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                    <option key={d} value={d.toLowerCase()}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">CC Statement Processing Day (of month)</label>
                <input type="number" min="1" max="28" value={nataliaSettings.ccStatementDay} onChange={e => setNataliaSettings(p => ({ ...p, ccStatementDay: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-text-primary">Auto-Allocate JE Charges</p><p className="text-xs text-text-muted">Map CC charges to GL automatically</p></div>
                <Toggle checked={nataliaSettings.autoAllocate} onChange={() => toggleNatalia('autoAllocate')} />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-secondary border-b border-border-base pb-2">Vendor Alerts</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Alert on Variance Above ($)</label>
                <input type="number" value={nataliaSettings.vendorVarianceAlert} onChange={e => setNataliaSettings(p => ({ ...p, vendorVarianceAlert: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Vendor Alert Email</label>
                <input type="email" value={nataliaSettings.vendorAlertEmail} onChange={e => setNataliaSettings(p => ({ ...p, vendorAlertEmail: e.target.value }))}
                  className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-text-primary">Retention Risk Alerts</p><p className="text-xs text-text-muted">Flag at-risk accounts automatically</p></div>
                <Toggle checked={nataliaSettings.retentionRiskAlert} onChange={() => toggleNatalia('retentionRiskAlert')} />
              </div>
              {nataliaSettings.retentionRiskAlert && (
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Flag as at-risk after (days no engagement)</label>
                  <input type="number" value={nataliaSettings.retentionDaysThreshold} onChange={e => setNataliaSettings(p => ({ ...p, retentionDaysThreshold: e.target.value }))}
                    className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
                </div>
              )}
            </div>
            <h3 className="text-sm font-semibold text-text-secondary border-b border-border-base pb-2 mt-2">Manager Notifications</h3>
            <div className="space-y-2">
              {[
                { key: 'managerNotifyOnBatch', label: 'Notify on batch ready', desc: 'Alert when AP batch needs approval' },
                { key: 'managerNotifyOnVariance', label: 'Notify on vendor variance', desc: 'Alert when variance exceeds threshold' },
                { key: 'managerNotifyOnRetention', label: 'Notify on retention risk', desc: 'Alert when client flagged at risk' },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between py-1.5">
                  <div><p className="text-sm text-text-primary">{s.label}</p><p className="text-xs text-text-muted">{s.desc}</p></div>
                  <Toggle checked={nataliaSettings[s.key as keyof typeof nataliaSettings] as boolean} onChange={() => toggleNatalia(s.key as keyof typeof nataliaSettings)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Settings */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 bg-bg-secondary rounded-lg flex items-center justify-center">
            <Sliders size={16} className="text-text-secondary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-primary font-display">Global Settings</h2>
            <p className="text-xs text-text-muted">Platform-wide configuration</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Timezone</label>
            <select value={globalSettings.timezone} onChange={e => setGlobalSettings(p => ({ ...p, timezone: e.target.value }))}
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Fiscal Year Start</label>
            <select value={globalSettings.fiscalYearStart} onChange={e => setGlobalSettings(p => ({ ...p, fiscalYearStart: e.target.value }))}
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
              <option value="january">January 1</option>
              <option value="april">April 1</option>
              <option value="july">July 1</option>
              <option value="october">October 1</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Audit Log Retention</label>
            <select value={globalSettings.auditLogRetention} onChange={e => setGlobalSettings(p => ({ ...p, auditLogRetention: e.target.value }))}
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
              <option value="3years">3 Years</option>
              <option value="7years">7 Years</option>
              <option value="10years">10 Years</option>
              <option value="indefinite">Indefinite</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Session Timeout</label>
            <select value={globalSettings.sessionTimeout} onChange={e => setGlobalSettings(p => ({ ...p, sessionTimeout: e.target.value }))}
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none">
              <option value="2hours">2 Hours</option>
              <option value="4hours">4 Hours</option>
              <option value="8hours">8 Hours</option>
              <option value="24hours">24 Hours</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">Email Domain</label>
            <input type="text" value={globalSettings.emailDomain} onChange={e => setGlobalSettings(p => ({ ...p, emailDomain: e.target.value }))}
              className="w-full text-sm border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none" />
          </div>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium text-text-primary">Two-Factor Auth</p><p className="text-xs text-text-muted">Required for all users</p></div>
            <Toggle checked={globalSettings.twoFactorRequired} onChange={() => toggleGlobal('twoFactorRequired')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
