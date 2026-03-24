import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Copy, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { streamAdeConsciousness, hasApiKey } from '../../lib/claudeApi';
import { useWorkflowStore } from '../../stores/workflowStore';

const TASK_OPTIONS = [
  'Analyzing AR aging portfolio',
  'Processing AP batch review',
  'Evaluating Stanford invoice status',
  'Reviewing vendor reconciliation',
  'Assessing Truebeck retention risk',
];

const MOCK_STREAMS: Record<string, string[]> = {
  MAI: [
    'Scanning AR portfolio... 11 active accounts loaded. ',
    'Stanford Main Campus: $187,400 at 22 days. Within Net-30 terms. No action needed yet. ',
    'Lucile Packard Children\'s Hospital: $94,200 at 36 days. PO-4421 still pending. ',
    'This is a billing blocker. I\'m flagging for PO chase workflow. ',
    'SMP/UHA: $15,600 at 51 days. Second notice was sent 14 days ago. No response. ',
    'Escalation criteria met. Preparing escalation memo for management review. ',
    'Surefire Supplies: $9,800 at 67 days. Critical. ',
    'No payment response in 30 days. Escalated to manager 7 days ago. ',
    'Recommending: legal collections referral if no response within 5 business days. ',
    'Portfolio health: 2 critical, 1 pending action, 8 within normal range. ',
    'Estimated collection acceleration value this cycle: $43,200. ',
  ],
  NATALIA: [
    'Loading AP batch B-2026-12... 18 vendors, $67,200 total. ',
    'Running vendor statement matching... ',
    'Ecolab: Statement $12,400, Invoice $12,400 — MATCHED ✓ ',
    'Waxie Sanitary Supply: Statement $8,600, Invoice $8,600 — MATCHED ✓ ',
    'White Cap Construction: Statement $4,200, Invoice $4,200 — MATCHED ✓ ',
    'Centrihouse Equipment: Statement $9,500, Invoice $9,300 — VARIANCE DETECTED ',
    'Discrepancy: $200 — Line item "freight surcharge" added post-PO. ',
    'This requires human review. Flagging for approval before payment release. ',
    'Checking Truebeck retention... $84,200 holdback, 50 days old. ',
    'Contract Section 9.3: Retention release request must be submitted in writing. ',
    'Drafting formal retention release request. Estimated release: 30 days post-request. ',
    'AP batch ready for approval pending Centrihouse resolution. ',
  ],
};

interface ConsciousnessStreamProps {
  defaultExpanded?: boolean;
}

const ConsciousnessStream: React.FC<ConsciousnessStreamProps> = ({ defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selectedAde, setSelectedAde] = useState<'MAI' | 'NATALIA'>('MAI');
  const [selectedTask, setSelectedTask] = useState(TASK_OPTIONS[0]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [copied, setCopied] = useState(false);
  const streamRef = useRef<AbortController | null>(null);
  const textAreaRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setConsciousnessStream } = useWorkflowStore();

  useEffect(() => {
    textAreaRef.current?.scrollTo({ top: textAreaRef.current.scrollHeight, behavior: 'smooth' });
  }, [streamText]);

  const startStream = async () => {
    setIsStreaming(true);
    setStreamText('');
    streamRef.current = new AbortController();

    try {
      if (!hasApiKey()) {
        // Mock stream
        const mockChunks = MOCK_STREAMS[selectedAde];
        let i = 0;
        intervalRef.current = setInterval(() => {
          if (i >= mockChunks.length) {
            clearInterval(intervalRef.current!);
            setIsStreaming(false);
            return;
          }
          setStreamText(prev => prev + mockChunks[i]);
          setConsciousnessStream(selectedAde, streamText + mockChunks[i], true);
          i++;
        }, 400);
        return;
      }

      const gen = streamAdeConsciousness({
        ade: selectedAde,
        task: selectedTask,
        context: selectedTask,
      });

      for await (const chunk of gen) {
        if (streamRef.current?.signal.aborted) break;
        setStreamText(prev => prev + chunk);
      }
    } catch {
      // aborted or error
    } finally {
      setIsStreaming(false);
    }
  };

  const stopStream = () => {
    streamRef.current?.abort();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsStreaming(false);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(streamText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg-card border border-border-base rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-bg-secondary transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-accent-green animate-pulse' : 'bg-border-base'}`} />
          <span className="text-sm font-semibold text-text-primary font-display">ADE Consciousness Stream</span>
          {isStreaming && (
            <span className="text-xs text-accent-green bg-accent-green-light px-2 py-0.5 rounded-full font-medium">
              {selectedAde} thinking...
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
      </div>

      {expanded && (
        <div>
          {/* Controls */}
          <div className="px-4 pb-3 flex flex-wrap items-center gap-3 border-b border-border-base">
            <div className="flex gap-1 bg-bg-secondary rounded-lg p-1">
              {(['MAI', 'NATALIA'] as const).map(ade => (
                <button
                  key={ade}
                  onClick={() => setSelectedAde(ade)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${selectedAde === ade ? (ade === 'MAI' ? 'bg-mai-accent text-white' : 'bg-natalia-accent text-white') : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {ade}
                </button>
              ))}
            </div>

            <select
              value={selectedTask}
              onChange={e => setSelectedTask(e.target.value)}
              className="flex-1 text-xs border border-border-base rounded-lg px-2 py-1.5 bg-bg-secondary text-text-primary focus:outline-none"
            >
              {TASK_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <div className="flex gap-2">
              {!isStreaming ? (
                <button
                  onClick={startStream}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-green text-white text-xs font-medium hover:bg-accent-green/90 transition-colors"
                >
                  <Play size={11} /> Activate
                </button>
              ) : (
                <button
                  onClick={stopStream}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red text-white text-xs font-medium hover:bg-accent-red/90 transition-colors"
                >
                  <Square size={11} /> Stop
                </button>
              )}
              <button
                onClick={copyToClipboard}
                disabled={!streamText}
                className="p-1.5 rounded-lg border border-border-base text-text-muted hover:text-text-primary hover:bg-bg-secondary disabled:opacity-40 transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={13} />
              </button>
              <button
                onClick={() => setStreamText('')}
                className="p-1.5 rounded-lg border border-border-base text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors"
                title="Clear"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Stream output */}
          <div
            ref={textAreaRef}
            className="font-mono text-xs bg-gray-950 text-green-400 p-4 min-h-32 max-h-64 overflow-y-auto leading-relaxed"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {streamText ? (
              <>
                <span className="text-green-600">[{selectedAde}@SMM-ADE ~]$ </span>
                <span className="text-green-300">{selectedTask}</span>
                <br /><br />
                {streamText}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-green-400 ml-0.5 animate-pulse" />
                )}
              </>
            ) : (
              <span className="text-green-800">
                {'>'} {selectedAde} consciousness stream ready. Click "Activate" to begin...
              </span>
            )}
          </div>

          {!hasApiKey() && (
            <div className="px-4 py-2 bg-accent-amber-light/20 border-t border-amber-200/30 text-[10px] text-accent-amber">
              Demo mode — Add VITE_ANTHROPIC_API_KEY for real AI reasoning stream
            </div>
          )}
          {copied && (
            <div className="px-4 py-2 bg-accent-green-light border-t border-accent-green/30 text-[10px] text-accent-green">
              Copied to clipboard
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsciousnessStream;
