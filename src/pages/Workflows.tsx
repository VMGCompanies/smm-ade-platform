import React from 'react';
import { PauseCircle, PlayCircle } from 'lucide-react';
import WorkflowControlPanel from '../components/ade/WorkflowControlPanel';
import { useWorkflowStore } from '../stores/workflowStore';

const Workflows: React.FC = () => {
  const { maiStatus, nataliaStatus, maiAutonomy, nataliaAutonomy, workflows, pauseWorkflow, resumeWorkflow } = useWorkflowStore();

  const maiWorkflows = workflows.filter(w => w.ade === 'MAI');
  const nataliaWorkflows = workflows.filter(w => w.ade === 'NATALIA');

  const maiActive = maiWorkflows.filter(w => !['idle', 'complete'].includes(w.status)).length;
  const nataliaActive = nataliaWorkflows.filter(w => !['idle', 'complete'].includes(w.status)).length;

  const pauseAllMai = () => {
    maiWorkflows.filter(w => ['scanning', 'analyzing', 'executing'].includes(w.status)).forEach(w => pauseWorkflow(w.id));
  };

  const resumeAllNatalia = () => {
    nataliaWorkflows.filter(w => w.status === 'paused').forEach(w => resumeWorkflow(w.id));
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">ADE Workflows</h1>
          <p className="text-sm text-text-muted mt-0.5">Real-time workflow orchestration for MAI and NATALIA</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-accent-green bg-accent-green-light px-3 py-1.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
          {maiActive + nataliaActive} workflows active
        </div>
      </div>

      {/* Status bars */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-bg-card border border-border-base rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-mai-accent rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">MAI ADE</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${maiStatus === 'online' ? 'bg-accent-green-light text-accent-green' : 'bg-accent-amber-light text-accent-amber'}`}>
                  {maiStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-text-muted">{maiActive} active · autonomy {maiAutonomy}/10</p>
            </div>
          </div>
          <button
            onClick={pauseAllMai}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-base text-text-secondary text-xs hover:bg-bg-secondary transition-colors"
          >
            <PauseCircle size={13} /> Pause All MAI
          </button>
        </div>

        <div className="bg-bg-card border border-border-base rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-natalia-accent rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary">NATALIA ADE</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${nataliaStatus === 'online' ? 'bg-accent-green-light text-accent-green' : 'bg-accent-amber-light text-accent-amber'}`}>
                  {nataliaStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-text-muted">{nataliaActive} active · autonomy {nataliaAutonomy}/10</p>
            </div>
          </div>
          <button
            onClick={resumeAllNatalia}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-base text-text-secondary text-xs hover:bg-bg-secondary transition-colors"
          >
            <PlayCircle size={13} /> Resume All NATALIA
          </button>
        </div>
      </div>

      {/* Two-column workflow panels */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <h2 className="text-base font-semibold text-text-primary font-display mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-mai-accent" />
            MAI Workflows
          </h2>
          <WorkflowControlPanel ade="MAI" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary font-display mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-natalia-accent" />
            NATALIA Workflows
          </h2>
          <WorkflowControlPanel ade="NATALIA" />
        </div>
      </div>
    </div>
  );
};

export default Workflows;
