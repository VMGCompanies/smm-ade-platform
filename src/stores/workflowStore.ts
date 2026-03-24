import { create } from 'zustand';

export type WorkflowStatus = 'idle' | 'scanning' | 'analyzing' | 'awaiting_approval' | 'executing' | 'paused' | 'complete' | 'error';
export type AdeStatus = 'online' | 'paused' | 'offline';

export interface Workflow {
  id: string;
  ade: 'MAI' | 'NATALIA';
  name: string;
  description: string;
  status: WorkflowStatus;
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  currentStep: string;
  logs: WorkflowLog[];
  autonomyLevel: number; // 0-10
}

export interface WorkflowLog {
  timestamp: Date;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface WorkflowStore {
  maiStatus: AdeStatus;
  nataliaStatus: AdeStatus;
  maiAutonomy: number;
  nataliaAutonomy: number;
  workflows: Workflow[];
  consciousnessStream: { ade: 'MAI' | 'NATALIA'; text: string; active: boolean };

  setAdeStatus: (ade: 'MAI' | 'NATALIA', status: AdeStatus) => void;
  setAutonomy: (ade: 'MAI' | 'NATALIA', level: number) => void;
  startWorkflow: (workflowId: string) => void;
  pauseWorkflow: (workflowId: string) => void;
  stopWorkflow: (workflowId: string) => void;
  resumeWorkflow: (workflowId: string) => void;
  updateWorkflowProgress: (workflowId: string, progress: number, step: string) => void;
  addWorkflowLog: (workflowId: string, message: string, type: WorkflowLog['type']) => void;
  setConsciousnessStream: (ade: 'MAI' | 'NATALIA', text: string, active: boolean) => void;
  appendConsciousnessText: (text: string) => void;
}

const initialWorkflows: Workflow[] = [
  {
    id: 'wf-mai-collections',
    ade: 'MAI',
    name: 'AR Collections Cadence',
    description: 'Automated collections outreach for aging accounts',
    status: 'idle',
    progress: 0,
    currentStep: 'Waiting to start',
    autonomyLevel: 6,
    logs: []
  },
  {
    id: 'wf-mai-invoicing',
    ade: 'MAI',
    name: 'Invoice Generation & Release',
    description: 'PO matching and invoice release workflow',
    status: 'idle',
    progress: 0,
    currentStep: 'Waiting to start',
    autonomyLevel: 7,
    logs: []
  },
  {
    id: 'wf-mai-po-chase',
    ade: 'MAI',
    name: 'PO Chase Workflow',
    description: 'Automated PO follow-up for blocked invoices',
    status: 'idle',
    progress: 0,
    currentStep: 'Waiting to start',
    autonomyLevel: 5,
    logs: []
  },
  {
    id: 'wf-natalia-ap-batch',
    ade: 'NATALIA',
    name: 'Weekly AP Batch Processing',
    description: 'Vendor payment batch preparation and release',
    status: 'analyzing',
    progress: 67,
    currentStep: 'Reviewing Centrihouse invoice discrepancy',
    autonomyLevel: 8,
    logs: [
      { timestamp: new Date(Date.now() - 120000), message: 'AP batch scan initiated — 18 vendors', type: 'info' },
      { timestamp: new Date(Date.now() - 90000), message: 'Ecolab: $12,400 — matched ✓', type: 'success' },
      { timestamp: new Date(Date.now() - 60000), message: 'Waxie: $8,600 — matched ✓', type: 'success' },
      { timestamp: new Date(Date.now() - 30000), message: 'Centrihouse: variance detected — $200 discrepancy', type: 'warning' }
    ]
  },
  {
    id: 'wf-natalia-reconciliation',
    ade: 'NATALIA',
    name: 'Vendor Statement Reconciliation',
    description: 'Monthly reconciliation: Ecolab, Waxie, White Cap, Centrihouse',
    status: 'idle',
    progress: 0,
    currentStep: 'Waiting to start',
    autonomyLevel: 9,
    logs: []
  },
  {
    id: 'wf-natalia-collections',
    ade: 'NATALIA',
    name: 'AR Collections — 23 Accounts',
    description: 'Collections cadence for full portfolio',
    status: 'paused',
    progress: 34,
    currentStep: 'Paused — awaiting approval on Truebeck escalation',
    autonomyLevel: 4,
    logs: [
      { timestamp: new Date(Date.now() - 300000), message: 'Portfolio scan: 23 accounts reviewed', type: 'info' },
      { timestamp: new Date(Date.now() - 240000), message: 'Truebeck: 67 days outstanding, $84,200 — ESCALATE', type: 'warning' },
      { timestamp: new Date(Date.now() - 180000), message: 'Workflow paused — escalation requires human approval', type: 'info' }
    ]
  }
];

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  maiStatus: 'online',
  nataliaStatus: 'online',
  maiAutonomy: 6,
  nataliaAutonomy: 7,
  workflows: initialWorkflows,
  consciousnessStream: { ade: 'MAI', text: '', active: false },

  setAdeStatus: (ade, status) => set(() => ({
    ...(ade === 'MAI' ? { maiStatus: status } : { nataliaStatus: status })
  })),

  setAutonomy: (ade, level) => set(() => ({
    ...(ade === 'MAI' ? { maiAutonomy: level } : { nataliaAutonomy: level })
  })),

  startWorkflow: (workflowId) => set(state => ({
    workflows: state.workflows.map(w => w.id === workflowId ? {
      ...w,
      status: 'scanning' as WorkflowStatus,
      progress: 5,
      startedAt: new Date(),
      currentStep: 'Initiating workflow scan...',
      logs: [...w.logs, { timestamp: new Date(), message: 'Workflow started by operator', type: 'info' as const }]
    } : w)
  })),

  pauseWorkflow: (workflowId) => set(state => ({
    workflows: state.workflows.map(w => w.id === workflowId ? {
      ...w,
      status: 'paused' as WorkflowStatus,
      currentStep: `Paused at ${w.progress}% — resumable`,
      logs: [...w.logs, { timestamp: new Date(), message: 'Workflow paused by operator', type: 'warning' as const }]
    } : w)
  })),

  stopWorkflow: (workflowId) => set(state => ({
    workflows: state.workflows.map(w => w.id === workflowId ? {
      ...w,
      status: 'idle' as WorkflowStatus,
      progress: 0,
      currentStep: 'Stopped',
      logs: [...w.logs, { timestamp: new Date(), message: 'Workflow stopped by operator', type: 'error' as const }]
    } : w)
  })),

  resumeWorkflow: (workflowId) => set(state => ({
    workflows: state.workflows.map(w => w.id === workflowId ? {
      ...w,
      status: 'analyzing' as WorkflowStatus,
      currentStep: 'Resuming workflow...',
      logs: [...w.logs, { timestamp: new Date(), message: 'Workflow resumed by operator', type: 'info' as const }]
    } : w)
  })),

  updateWorkflowProgress: (workflowId, progress, step) => set(state => ({
    workflows: state.workflows.map(w => w.id === workflowId ? {
      ...w,
      progress,
      currentStep: step,
      status: progress >= 100 ? 'complete' : w.status
    } : w)
  })),

  addWorkflowLog: (workflowId, message, type) => set(state => ({
    workflows: state.workflows.map(w => w.id === workflowId ? {
      ...w,
      logs: [...w.logs, { timestamp: new Date(), message, type }]
    } : w)
  })),

  setConsciousnessStream: (ade, text, active) => set({ consciousnessStream: { ade, text, active } }),
  appendConsciousnessText: (text) => set(state => ({
    consciousnessStream: { ...state.consciousnessStream, text: state.consciousnessStream.text + text }
  }))
}));
