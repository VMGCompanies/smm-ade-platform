import React, { useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, CheckCircle2, AlertCircle, Loader2, Clock, ChevronRight } from 'lucide-react';
import { useWorkflowStore, Workflow, WorkflowStatus, AdeStatus } from '../../stores/workflowStore';

const statusConfig: Record<WorkflowStatus, { label: string; color: string; bg: string; dot: string }> = {
  idle: { label: 'Idle', color: 'text-text-muted', bg: 'bg-bg-secondary', dot: 'bg-border-base' },
  scanning: { label: 'Scanning', color: 'text-accent-blue', bg: 'bg-accent-blue-light', dot: 'bg-accent-blue' },
  analyzing: { label: 'Analyzing', color: 'text-accent-amber', bg: 'bg-accent-amber-light', dot: 'bg-accent-amber' },
  awaiting_approval: { label: 'Awaiting Approval', color: 'text-purple-600', bg: 'bg-purple-50', dot: 'bg-purple-500' },
  executing: { label: 'Executing', color: 'text-accent-green', bg: 'bg-accent-green-light', dot: 'bg-accent-green' },
  paused: { label: 'Paused', color: 'text-accent-amber', bg: 'bg-accent-amber-light', dot: 'bg-accent-amber' },
  complete: { label: 'Complete', color: 'text-accent-green', bg: 'bg-accent-green-light', dot: 'bg-accent-green' },
  error: { label: 'Error', color: 'text-accent-red', bg: 'bg-accent-red-light', dot: 'bg-accent-red' },
};

const autonomyLabel = (level: number) => {
  if (level <= 2) return 'Full Human Control';
  if (level <= 5) return 'Supervised Autonomy';
  if (level <= 8) return 'High Autonomy';
  return 'Fully Autonomous';
};

const autonomyColor = (level: number) => {
  if (level <= 2) return 'text-accent-blue';
  if (level <= 5) return 'text-accent-amber';
  if (level <= 8) return 'text-accent-green';
  return 'text-accent-red';
};

interface WorkflowCardProps {
  workflow: Workflow;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow }) => {
  const { startWorkflow, pauseWorkflow, stopWorkflow, resumeWorkflow, updateWorkflowProgress, addWorkflowLog } = useWorkflowStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const cfg = statusConfig[workflow.status];

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [workflow.logs.length]);

  // Simulate progress when running
  useEffect(() => {
    if (workflow.status === 'scanning' || workflow.status === 'analyzing' || workflow.status === 'executing') {
      intervalRef.current = setInterval(() => {
        const current = workflow.progress;
        if (current >= 100) {
          clearInterval(intervalRef.current!);
          return;
        }
        const next = Math.min(current + Math.random() * 3 + 1, 100);
        const steps = [
          'Scanning portfolio data...',
          'Analyzing account aging...',
          'Matching invoices to POs...',
          'Running collections logic...',
          'Preparing email drafts...',
          'Reviewing vendor statements...',
          'Processing batch items...',
          'Validating against QB...',
          'Finalizing workflow output...',
        ];
        const step = steps[Math.floor((next / 100) * steps.length)] || 'Processing...';

        if (next >= 85 && current < 85) {
          addWorkflowLog(workflow.id, 'Awaiting human approval before final execution', 'warning');
          useWorkflowStore.getState().workflows.find(w => w.id === workflow.id);
          // transition to awaiting_approval
          updateWorkflowProgress(workflow.id, 85, 'Awaiting human approval...');
          useWorkflowStore.setState(state => ({
            workflows: state.workflows.map(w => w.id === workflow.id ? { ...w, status: 'awaiting_approval' } : w)
          }));
          clearInterval(intervalRef.current!);
          return;
        }

        if (next >= 100) {
          addWorkflowLog(workflow.id, 'Workflow completed successfully', 'success');
          updateWorkflowProgress(workflow.id, 100, 'Workflow complete');
          clearInterval(intervalRef.current!);
          return;
        }

        updateWorkflowProgress(workflow.id, Math.round(next), step);
      }, 1200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [workflow.status, workflow.id]);

  const logTypeColor = (type: string) => {
    if (type === 'success') return 'text-accent-green';
    if (type === 'warning') return 'text-accent-amber';
    if (type === 'error') return 'text-accent-red';
    return 'text-text-muted';
  };

  return (
    <div className={`bg-bg-card rounded-xl border p-4 transition-all ${workflow.status === 'error' ? 'border-accent-red/40' : workflow.status === 'awaiting_approval' ? 'border-purple-300' : workflow.status === 'paused' ? 'border-accent-amber/40' : 'border-border-base'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <p className="text-sm font-semibold text-text-primary">{workflow.name}</p>
          <p className="text-xs text-text-muted mt-0.5">{workflow.description}</p>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot} ${['scanning', 'analyzing', 'executing'].includes(workflow.status) ? 'animate-pulse' : ''}`} />
          {cfg.label}
        </span>
      </div>

      {/* Progress bar */}
      {workflow.status !== 'idle' && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-text-muted mb-1">
            <span>{workflow.currentStep}</span>
            <span className="font-mono font-bold text-text-primary">{workflow.progress}%</span>
          </div>
          <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${workflow.status === 'complete' ? 'bg-accent-green' : workflow.status === 'error' ? 'bg-accent-red' : workflow.status === 'awaiting_approval' ? 'bg-purple-500' : workflow.status === 'paused' ? 'bg-accent-amber' : 'bg-accent-blue'}`}
              style={{ width: `${workflow.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Logs (last 5) */}
      {workflow.logs.length > 0 && (
        <div className="bg-bg-secondary rounded-lg p-2.5 mb-3 max-h-24 overflow-y-auto">
          {workflow.logs.slice(-5).map((log, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs py-0.5">
              <span className="text-text-muted font-mono flex-shrink-0 text-[10px] mt-0.5">
                {log.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={logTypeColor(log.type)}>{log.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        {workflow.status === 'idle' && (
          <button
            onClick={() => startWorkflow(workflow.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-medium hover:bg-accent-blue/90 transition-colors"
          >
            <Play size={11} /> Start
          </button>
        )}
        {['scanning', 'analyzing', 'executing'].includes(workflow.status) && (
          <>
            <button
              onClick={() => pauseWorkflow(workflow.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-amber-light text-accent-amber text-xs font-medium hover:bg-accent-amber hover:text-white transition-colors"
            >
              <Pause size={11} /> Pause
            </button>
            <button
              onClick={() => stopWorkflow(workflow.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red-light text-accent-red text-xs font-medium hover:bg-accent-red hover:text-white transition-colors"
            >
              <Square size={11} /> Stop
            </button>
          </>
        )}
        {workflow.status === 'paused' && (
          <>
            <button
              onClick={() => resumeWorkflow(workflow.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-green-light text-accent-green text-xs font-medium hover:bg-accent-green hover:text-white transition-colors"
            >
              <Play size={11} /> Resume
            </button>
            <button
              onClick={() => stopWorkflow(workflow.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red-light text-accent-red text-xs font-medium hover:bg-accent-red hover:text-white transition-colors"
            >
              <Square size={11} /> Stop
            </button>
          </>
        )}
        {workflow.status === 'awaiting_approval' && (
          <>
            <button
              onClick={() => {
                addWorkflowLog(workflow.id, 'Operator approved — continuing execution', 'success');
                useWorkflowStore.setState(state => ({
                  workflows: state.workflows.map(w => w.id === workflow.id ? { ...w, status: 'executing', progress: 86 } : w)
                }));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-medium hover:bg-purple-600 transition-colors"
            >
              <CheckCircle2 size={11} /> Approve & Continue
            </button>
            <button
              onClick={() => stopWorkflow(workflow.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red-light text-accent-red text-xs font-medium hover:bg-accent-red hover:text-white transition-colors"
            >
              <Square size={11} /> Reject
            </button>
          </>
        )}
        {workflow.status === 'complete' && (
          <button
            onClick={() => stopWorkflow(workflow.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary text-text-secondary text-xs font-medium hover:bg-border-base transition-colors"
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
        {workflow.status === 'error' && (
          <button
            onClick={() => startWorkflow(workflow.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-red-light text-accent-red text-xs font-medium hover:bg-accent-red hover:text-white transition-colors"
          >
            <RotateCcw size={11} /> Retry
          </button>
        )}

        <div className="ml-auto flex items-center gap-1.5 text-xs text-text-muted">
          <span>Autonomy:</span>
          <span className={`font-mono font-bold ${autonomyColor(workflow.autonomyLevel)}`}>{workflow.autonomyLevel}/10</span>
        </div>
      </div>
    </div>
  );
};

interface AdeStatusBarProps {
  ade: 'MAI' | 'NATALIA';
}

const AdeStatusBar: React.FC<AdeStatusBarProps> = ({ ade }) => {
  const { maiStatus, nataliaStatus, maiAutonomy, nataliaAutonomy, setAdeStatus, setAutonomy, workflows } = useWorkflowStore();

  const status = ade === 'MAI' ? maiStatus : nataliaStatus;
  const autonomy = ade === 'MAI' ? maiAutonomy : nataliaAutonomy;
  const myWorkflows = workflows.filter(w => w.ade === ade);
  const activeCount = myWorkflows.filter(w => !['idle', 'complete'].includes(w.status)).length;
  const accentClass = ade === 'MAI' ? 'bg-mai-accent' : 'bg-natalia-accent';
  const textAccent = ade === 'MAI' ? 'text-mai-accent' : 'text-natalia-accent';

  return (
    <div className="bg-bg-card border border-border-base rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${accentClass} rounded-lg flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">{ade[0]}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{ade} ADE</p>
            <p className="text-xs text-text-muted">{activeCount} active workflows</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status === 'online' ? 'bg-accent-green-light text-accent-green' : status === 'paused' ? 'bg-accent-amber-light text-accent-amber' : 'bg-bg-secondary text-text-muted'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-accent-green animate-pulse' : status === 'paused' ? 'bg-accent-amber' : 'bg-border-base'}`} />
            {status.toUpperCase()}
          </span>
          <div className="flex gap-1">
            {(['online', 'paused', 'offline'] as AdeStatus[]).map(s => (
              <button
                key={s}
                onClick={() => setAdeStatus(ade, s)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors capitalize ${status === s ? 'bg-bg-secondary text-text-primary' : 'text-text-muted hover:text-text-secondary hover:bg-bg-secondary'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Autonomy slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-text-muted">Autonomy Level</span>
          <span className={`text-xs font-medium ${autonomyColor(autonomy)}`}>
            {autonomy}/10 — {autonomyLabel(autonomy)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={autonomy}
          onChange={e => setAutonomy(ade, parseInt(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${autonomy <= 2 ? '#3b82f6' : autonomy <= 5 ? '#f59e0b' : autonomy <= 8 ? '#10b981' : '#ef4444'} ${autonomy * 10}%, #e5e7eb ${autonomy * 10}%)`
          }}
        />
        <div className="flex justify-between text-[10px] text-text-muted mt-1">
          <span>Human Control</span>
          <span>Supervised</span>
          <span>High Auto</span>
          <span>Autonomous</span>
        </div>
      </div>
    </div>
  );
};

interface WorkflowControlPanelProps {
  ade: 'MAI' | 'NATALIA';
}

const WorkflowControlPanel: React.FC<WorkflowControlPanelProps> = ({ ade }) => {
  const { workflows } = useWorkflowStore();
  const myWorkflows = workflows.filter(w => w.ade === ade);

  return (
    <div>
      <AdeStatusBar ade={ade} />
      <div className="space-y-3">
        {myWorkflows.map(wf => (
          <WorkflowCard key={wf.id} workflow={wf} />
        ))}
      </div>
    </div>
  );
};

export default WorkflowControlPanel;
