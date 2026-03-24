import React, { useState } from 'react';
import { Loader2, AlertTriangle, TrendingDown, Zap, ChevronRight } from 'lucide-react';
import { runWhatIfScenario, hasApiKey } from '../../lib/claudeApi';

const PRESET_SCENARIOS = [
  { id: 1, label: 'Stanford pays 15 days late', accounts: ['Stanford Main Campus', 'Stanford School of Medicine'] },
  { id: 2, label: 'Truebeck retention ($84K) held another 30 days', accounts: ['Truebeck Construction'] },
  { id: 3, label: 'Kaiser invoice disputed ($31K)', accounts: ['Kaiser Permanente'] },
  { id: 4, label: 'All construction GC accounts pay at day 60', accounts: ['Truebeck Construction', 'Kodiak', 'Level 10'] },
  { id: 5, label: 'Custom scenario', accounts: [] },
];

const riskColors = {
  LOW: 'bg-accent-green-light text-accent-green border-accent-green/30',
  MEDIUM: 'bg-accent-amber-light text-accent-amber border-accent-amber/30',
  HIGH: 'bg-accent-red-light text-accent-red border-accent-red/30',
  CRITICAL: 'bg-accent-red text-white border-accent-red',
};

const extractRiskLevel = (text: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  const upper = text.toUpperCase();
  if (upper.includes('CRITICAL')) return 'CRITICAL';
  if (upper.includes('HIGH')) return 'HIGH';
  if (upper.includes('MEDIUM')) return 'MEDIUM';
  return 'LOW';
};

const MOCK_RESULTS: Record<number, string> = {
  1: `## Cash Position Impact
Stanford Main Campus ($187,400) and School of Medicine ($63,200) delayed 15 days = **$250,600 delayed** until approximately April 7, 2026.

## AP Obligations at Risk
- AP Batch B-2026-12: $67,200 due March 21 — **still manageable**
- Allied Universal Security: $12,500 due March 25 — **tight**

## Recommended ADE Actions
1. MAI: Send proactive early notice to Stanford AP contacts
2. NATALIA: Delay non-critical AP releases by 5 days
3. Alert management if delay extends beyond 20 days

## Timeline of Critical Dates
- March 21: AP batch due ($67,200)
- March 28: Cash position impact begins
- April 7: Stanford payments expected (if 15 days late)

## Risk Level: MEDIUM`,
  2: `## Cash Position Impact
Truebeck retention holdback of $84,200 delayed 30 more days = **net $84,200 gap** through May 1, 2026.

## AP Obligations at Risk
- Centrihouse: $9,300 due March 31 — **at risk**
- April rent obligations: $80,500 — **plan needed**

## Recommended ADE Actions
1. NATALIA: Initiate formal retention release request immediately
2. NATALIA: Defer non-essential AP by 2 weeks
3. Review construction contract retention clause (standard 10% holdback)

## Timeline of Critical Dates
- April 1: April rent due ($80,500)
- May 1: Revised Truebeck payment target

## Risk Level: HIGH`,
  3: `## Cash Position Impact
Kaiser Permanente dispute on $31,000 invoice creates **immediate cash flow uncertainty**. If dispute extends 45+ days, impact compounds with existing 60+ day aging.

## AP Obligations at Risk
- Current AP batch: $67,200 — manageable with existing cash
- If dispute unresolved by April: cumulative exposure reaches $112,000

## Recommended ADE Actions
1. MAI: Escalate to Kaiser AP manager with documentation
2. MAI: Submit formal dispute resolution within 5 business days
3. Request interim payment of undisputed portions

## Timeline of Critical Dates
- March 28: Dispute documentation deadline
- April 15: Escalation trigger if unresolved

## Risk Level: MEDIUM`,
  4: `## Cash Position Impact
If Truebeck ($72,300), Kodiak ($55,400), and Level 10 ($38,200) all pay at day 60, **$165,900 delayed** 10-24 additional days.

## AP Obligations at Risk
- April rent: $80,500 — **HIGH RISK**
- AP batches April: estimated $75,000 — **at risk**

## Recommended ADE Actions
1. NATALIA: Proactive outreach to all 3 GC accounts immediately
2. Review contract payment terms for acceleration clauses
3. Flag retention provisions and dispute any unauthorized delays

## Timeline of Critical Dates
- April 1: April rent ($80,500) — potential shortfall
- April 15-20: GC payment window opens

## Risk Level: HIGH`,
};

const WhatIfEngine: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [customScenario, setCustomScenario] = useState('');
  const [cashPosition, setCashPosition] = useState('285000');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState('');
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null>(null);

  const runScenario = async () => {
    if (selectedScenario === null) return;
    setIsRunning(true);
    setResult('');
    setRiskLevel(null);

    const preset = PRESET_SCENARIOS.find(s => s.id === selectedScenario);
    const scenarioText = selectedScenario === 5 ? customScenario : preset?.label || '';

    try {
      if (!hasApiKey()) {
        await new Promise(r => setTimeout(r, 1500));
        const mock = MOCK_RESULTS[selectedScenario] || `## Analysis\n\nThis scenario would create moderate cash flow pressure. Recommend proactive collection outreach and AP deferral planning.\n\n## Risk Level: MEDIUM`;
        setResult(mock);
        setRiskLevel(extractRiskLevel(mock));
        return;
      }

      const text = await runWhatIfScenario({
        scenario: scenarioText,
        currentArOutstanding: 1247340,
        currentApDue: 94500,
        cashPosition: parseInt(cashPosition) || 285000,
        accountsAffected: preset?.accounts || [],
      });
      setResult(text);
      setRiskLevel(extractRiskLevel(text));
    } catch {
      setResult('Scenario analysis failed. Please check your API key and try again.');
    } finally {
      setIsRunning(false);
    }
  };

  // Simple markdown-ish renderer for the result
  const renderResult = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-sm font-semibold text-text-primary mt-4 mb-1.5">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-xs text-text-secondary ml-3 mb-0.5 list-disc">{line.replace('- ', '')}</li>;
      }
      if (line.match(/^\d\./)) {
        return <li key={i} className="text-xs text-text-secondary ml-3 mb-0.5 list-decimal">{line.replace(/^\d\./, '').trim()}</li>;
      }
      if (line.trim() === '') return <div key={i} className="h-1" />;

      // Bold text
      const parts = line.split(/\*\*(.*?)\*\*/g);
      if (parts.length > 1) {
        return (
          <p key={i} className="text-xs text-text-secondary mb-1">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-text-primary">{part}</strong> : part)}
          </p>
        );
      }
      return <p key={i} className="text-xs text-text-secondary mb-1">{line}</p>;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">What-If Scenario Engine</h1>
          <p className="text-sm text-text-muted mt-0.5">Model cash flow scenarios and get AI-powered recommendations</p>
        </div>
        {!hasApiKey() && (
          <div className="bg-accent-amber-light text-accent-amber text-xs px-3 py-1.5 rounded-full font-medium">
            Demo mode — Add API key for real analysis
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Scenario builder */}
        <div className="col-span-1 space-y-4">
          <div className="bg-bg-card border border-border-base rounded-xl p-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Select Scenario</h2>
            <div className="space-y-2">
              {PRESET_SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenario(s.id)}
                  className={`w-full text-left text-xs px-3 py-2.5 rounded-lg border transition-colors ${selectedScenario === s.id ? 'bg-accent-blue-light border-accent-blue/40 text-accent-blue' : 'border-border-base text-text-secondary hover:border-accent-blue/30 hover:bg-bg-secondary'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {selectedScenario === 5 && (
              <div className="mt-3">
                <textarea
                  value={customScenario}
                  onChange={e => setCustomScenario(e.target.value)}
                  placeholder="Describe your scenario..."
                  rows={3}
                  className="w-full text-xs border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30 resize-none"
                />
              </div>
            )}
          </div>

          {/* Context inputs */}
          <div className="bg-bg-card border border-border-base rounded-xl p-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Context</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-muted block mb-1">AR Outstanding</label>
                <input value="$1,247,340" readOnly className="w-full text-xs bg-bg-secondary border border-border-base rounded-lg px-3 py-2 text-text-muted font-mono" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">AP Due This Week</label>
                <input value="$94,500" readOnly className="w-full text-xs bg-bg-secondary border border-border-base rounded-lg px-3 py-2 text-text-muted font-mono" />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">Cash Position</label>
                <input
                  type="number"
                  value={cashPosition}
                  onChange={e => setCashPosition(e.target.value)}
                  className="w-full text-xs border border-border-base rounded-lg px-3 py-2 bg-bg-secondary text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
                />
              </div>
            </div>
          </div>

          <button
            onClick={runScenario}
            disabled={selectedScenario === null || isRunning || (selectedScenario === 5 && !customScenario.trim())}
            className="w-full py-3 rounded-xl bg-accent-blue text-white font-medium text-sm hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing scenario...
              </>
            ) : (
              <>
                <Zap size={16} />
                Run Scenario
              </>
            )}
          </button>
        </div>

        {/* Results */}
        <div className="col-span-2">
          {!result && !isRunning && (
            <div className="bg-bg-secondary rounded-xl h-full flex items-center justify-center text-center p-10">
              <div>
                <TrendingDown size={36} className="text-text-muted mx-auto mb-3" />
                <p className="text-sm font-medium text-text-primary">Select a scenario to begin</p>
                <p className="text-xs text-text-muted mt-1">AI will analyze cash flow impact and provide actionable recommendations</p>
              </div>
            </div>
          )}

          {isRunning && (
            <div className="bg-bg-secondary rounded-xl h-full flex items-center justify-center text-center p-10">
              <div>
                <Loader2 size={36} className="text-accent-blue mx-auto mb-3 animate-spin" />
                <p className="text-sm font-medium text-text-primary">Running scenario analysis...</p>
                <p className="text-xs text-text-muted mt-1">Modeling cash flow impact with AI</p>
              </div>
            </div>
          )}

          {result && !isRunning && (
            <div className="bg-bg-card border border-border-base rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-text-primary">Scenario Analysis</h2>
                <div className="flex items-center gap-3">
                  {riskLevel && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${riskColors[riskLevel]}`}>
                      {riskLevel} RISK
                    </span>
                  )}
                  <button
                    onClick={() => {
                      // Create workflow from scenario
                      alert(`Workflow created from scenario. Assigned to ${riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'NATALIA' : 'MAI'} for monitoring.`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue-light text-accent-blue rounded-lg text-xs font-medium hover:bg-accent-blue hover:text-white transition-colors"
                  >
                    Assign to ADE <ChevronRight size={11} />
                  </button>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                {renderResult(result)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatIfEngine;
