import React, { useState } from 'react';
import { collectionsQueue, CollectionAccount, CollectionTone } from '../data/collections_queue';
import StatusPill from '../components/common/StatusPill';
import Modal from '../components/common/Modal';
import { Mail, Phone, ArrowUpRight, AlertTriangle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateCollectionsEmail, hasApiKey } from '../lib/claudeApi';

const maiCollections = collectionsQueue.filter(c => c.agent === 'MAI');
const nataliaCollections = collectionsQueue.filter(c => c.agent === 'NATALIA');

const totalCollectible = collectionsQueue.reduce((s, c) => s + c.amount, 0);
const activeCollections = collectionsQueue.filter(c => c.stage === 'active' || c.stage === 'escalated').reduce((s, c) => s + c.amount, 0);

const agingHeatData = [
  { client: 'Stanford Main', days: 22, amount: 187400 },
  { client: 'Surefire Supplies', days: 67, amount: 9800 },
  { client: 'SMP/UHA', days: 51, amount: 15600 },
  { client: 'Lucile Packard', days: 36, amount: 94200 },
  { client: 'Capital Realty', days: 50, amount: 39200 },
  { client: 'Truebeck', days: 50, amount: 72300 },
  { client: 'Kodiak', days: 36, amount: 55400 },
  { client: 'Aon Corp', days: 36, amount: 67200 },
  { client: 'SoM Stanford', days: 22, amount: 63200 },
  { client: 'Blood Center', days: 18, amount: 22800 },
  { client: 'Cushman/Ericsson', days: 22, amount: 81500 },
  { client: 'Kaiser', days: 22, amount: 118000 },
];

function heatColor(days: number): string {
  if (days >= 60) return 'bg-accent-red text-white';
  if (days >= 45) return 'bg-accent-red/40 text-accent-red';
  if (days >= 30) return 'bg-accent-amber text-white';
  if (days >= 15) return 'bg-accent-amber/30 text-accent-amber';
  return 'bg-accent-green-light text-accent-green';
}

const CollectionCard: React.FC<{ account: CollectionAccount }> = ({ account }) => {
  const [tone, setTone] = useState<CollectionTone>('professional');
  const [emailModal, setEmailModal] = useState(false);
  const [aiEmail, setAiEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const generateEmail = async (selectedTone: CollectionTone) => {
    setIsGenerating(true);
    setAiEmail('');
    try {
      const email = await generateCollectionsEmail({
        ade: account.agent,
        clientName: account.client,
        invoiceNum: account.invoiceRef,
        amount: account.amount,
        daysOutstanding: account.daysOutstanding,
        contactName: account.contactName,
        tone: selectedTone,
        invoiceDate: new Date(account.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      });
      setAiEmail(email);
    } catch {
      setAiEmail(account.emailDrafts[selectedTone]);
    } finally {
      setIsGenerating(false);
    }
  };

  const openEmailModal = () => {
    setEmailModal(true);
    generateEmail(tone);
  };

  const handleToneChange = (newTone: CollectionTone) => {
    setTone(newTone);
    if (emailModal) {
      generateEmail(newTone);
    }
  };

  const handleSend = () => {
    setSendStatus('sending');
    setTimeout(() => setSendStatus('sent'), 1500);
    setTimeout(() => { setSendStatus('idle'); setEmailModal(false); }, 4000);
  };

  const displayEmail = aiEmail || account.emailDrafts[tone];

  return (
    <div className={`bg-bg-card rounded-xl border p-4 ${account.stage === 'escalated' ? 'border-accent-red/40' : account.stage === 'active' ? 'border-accent-amber/40' : 'border-border-base'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-primary">{account.client}</p>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded font-mono ${account.agent === 'MAI' ? 'bg-mai-accent/10 text-mai-accent' : 'bg-natalia-accent/10 text-natalia-accent'}`}>
              {account.agent}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5 font-mono">{account.invoiceRef}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-mono font-bold text-text-primary">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(account.amount)}
          </p>
          <p className={`text-xs font-mono font-semibold ${account.daysOutstanding > 60 ? 'text-accent-red' : account.daysOutstanding > 30 ? 'text-accent-amber' : 'text-text-muted'}`}>
            {account.daysOutstanding}d outstanding
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <StatusPill status={account.stage} />
        <span className="text-xs text-text-muted">{account.priorAttempts} prior notices · Last contact {new Date(account.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>

      {account.notes && (
        <p className="text-xs text-text-secondary bg-bg-secondary rounded-lg px-3 py-2 mb-3">{account.notes}</p>
      )}

      {/* Tone Selector */}
      <div className="mb-3">
        <p className="text-xs text-text-muted mb-1.5">Email Tone</p>
        <div className="flex gap-1">
          {(['friendly', 'professional', 'firm'] as CollectionTone[]).map(t => (
            <button
              key={t}
              onClick={() => handleToneChange(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${tone === t ? 'bg-accent-blue text-white' : 'bg-bg-secondary text-text-secondary hover:bg-accent-blue-light hover:text-accent-blue'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Email Preview */}
      <div className="bg-bg-secondary rounded-lg p-3 mb-3 max-h-24 overflow-hidden relative">
        <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line line-clamp-4">{account.emailDrafts[tone].split('\n').slice(0, 3).join('\n')}</p>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-secondary to-transparent" />
      </div>

      <div className="flex gap-2">
        <button
          onClick={openEmailModal}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-accent-blue-light text-accent-blue text-xs font-medium hover:bg-accent-blue hover:text-white transition-colors"
        >
          <Mail size={12} /> Preview & Send
        </button>
        {account.contactPhone && (
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border-base text-text-secondary text-xs hover:bg-bg-secondary transition-colors">
            <Phone size={12} />
          </button>
        )}
        {account.stage !== 'escalated' && account.daysOutstanding > 45 && (
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-accent-red/40 text-accent-red text-xs hover:bg-accent-red-light transition-colors">
            <ArrowUpRight size={12} />
          </button>
        )}
      </div>

      <Modal isOpen={emailModal} onClose={() => setEmailModal(false)} title={`${tone.charAt(0).toUpperCase() + tone.slice(1)} Email — ${account.client}`} size="lg">
        <div className="space-y-4">
          {/* AI badge */}
          <div className="flex items-center gap-2 text-xs text-accent-blue bg-accent-blue-light px-3 py-2 rounded-lg">
            <Sparkles size={12} />
            {hasApiKey() ? 'Email drafts generated by Claude AI in real-time based on account context and selected tone.' : 'Demo mode — Add API key for real-time AI email generation.'}
          </div>

          <div className="flex gap-1 bg-bg-secondary rounded-xl p-1">
            {(['friendly', 'professional', 'firm'] as CollectionTone[]).map(t => (
              <button key={t} onClick={() => handleToneChange(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tone === t ? 'bg-bg-card text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="bg-bg-secondary rounded-xl p-4 min-h-40">
            <div className="text-xs text-text-muted mb-1">To: {account.contactName} &lt;{account.contactEmail}&gt;</div>
            <div className="text-xs text-text-muted mb-3">Subject: Invoice {account.invoiceRef} — Payment Follow-up</div>
            {isGenerating ? (
              <div className="flex items-center gap-2 text-xs text-text-muted py-4">
                <Loader2 size={14} className="animate-spin text-accent-blue" />
                {account.agent} is drafting your email...
              </div>
            ) : (
              <pre className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-sans">{displayEmail}</pre>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setEmailModal(false)} className="flex-1 py-2.5 rounded-lg border border-border-base text-sm">Cancel</button>
            <button
              onClick={handleSend}
              disabled={sendStatus !== 'idle' || isGenerating}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${sendStatus === 'sent' ? 'bg-accent-green text-white' : 'bg-accent-blue text-white hover:bg-accent-blue/90'}`}
            >
              {sendStatus === 'idle' && <><Mail size={14} /> Approve & Send</>}
              {sendStatus === 'sending' && <><Loader2 size={14} className="animate-spin" /> Sending...</>}
              {sendStatus === 'sent' && <><CheckCircle2 size={14} /> Sent — QB Synced</>}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Collections: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary font-display">Collections Intelligence</h1>
        <p className="text-sm text-text-muted mt-0.5">AI-assisted collections · Dual portfolio view</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Collectible', value: totalCollectible, color: 'text-text-primary' },
          { label: 'In Active Collections', value: activeCollections, color: 'text-accent-amber' },
          { label: 'Recovered This Month', value: 94200, color: 'text-accent-green' },
          { label: 'Success Rate', value: '87%', color: 'text-accent-blue', text: true },
        ].map(k => (
          <div key={k.label} className="bg-bg-card border border-border-base rounded-xl p-4">
            <p className="text-xs text-text-muted">{k.label}</p>
            <p className={`text-2xl font-mono font-bold mt-1 ${k.color}`}>
              {k.text ? k.value : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(k.value as number)}
            </p>
          </div>
        ))}
      </div>

      {/* Two-column portfolio */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-mai-accent" />
            <h2 className="text-base font-semibold text-text-primary font-display">MAI Portfolio Collections</h2>
            <span className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 rounded-full">{maiCollections.length}</span>
          </div>
          <div className="space-y-3">
            {maiCollections.map(a => <CollectionCard key={a.id} account={a} />)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-natalia-accent" />
            <h2 className="text-base font-semibold text-text-primary font-display">NATALIA Portfolio Collections</h2>
            <span className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 rounded-full">{nataliaCollections.length}</span>
          </div>
          <div className="space-y-3">
            {nataliaCollections.map(a => <CollectionCard key={a.id} account={a} />)}
          </div>
        </div>
      </div>

      {/* Aging Heat Map */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <h2 className="text-base font-semibold text-text-primary font-display mb-4">Aging Heat Map</h2>
        <div className="grid grid-cols-6 gap-2">
          {agingHeatData.map((d, i) => (
            <div key={i} className={`rounded-xl p-3 text-center ${heatColor(d.days)}`}>
              <p className="text-xs font-medium leading-tight">{d.client}</p>
              <p className="text-base font-mono font-bold mt-1">{d.days}d</p>
              <p className="text-xs opacity-80">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0, notation: 'compact' }).format(d.amount)}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent-green-light" /> 0–14 days</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent-amber/30" /> 15–29 days</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent-amber" /> 30–44 days</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent-red/40" /> 45–59 days</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-accent-red" /> 60+ days</div>
        </div>
      </div>

      {/* Manager Escalation Queue */}
      <div className="bg-bg-card border border-border-base rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-accent-red" />
          <h2 className="text-base font-semibold text-text-primary font-display">Manager Escalation Queue</h2>
        </div>
        <div className="space-y-2">
          {collectionsQueue.filter(c => c.stage === 'escalated' || c.daysOutstanding > 60).map(c => (
            <div key={c.id} className="flex items-center justify-between py-3 border-b border-border-base last:border-0">
              <div>
                <p className="text-sm font-semibold text-text-primary">{c.client}</p>
                <p className="text-xs text-text-muted">{c.daysOutstanding} days · {c.priorAttempts} attempts · Next: {c.nextAction}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-text-primary">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(c.amount)}</span>
                <button className="px-3 py-1.5 rounded-lg bg-accent-red-light text-accent-red text-xs font-medium hover:bg-accent-red hover:text-white transition-colors">
                  Escalate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
