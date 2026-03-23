import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Edit2, Loader2 } from 'lucide-react';
import { HitlItem } from '../../data/hitl_queue';

interface HitlApprovalCardProps {
  item: HitlItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReview: (id: string) => void;
  onModify: (id: string) => void;
}

const HitlApprovalCard: React.FC<HitlApprovalCardProps> = ({ item, onApprove, onReject, onReview, onModify }) => {
  const [state, setState] = useState<'idle' | 'syncing' | 'synced'>('idle');

  const handleApprove = () => {
    setState('syncing');
    setTimeout(() => {
      setState('synced');
      setTimeout(() => onApprove(item.id), 1000);
    }, 1500);
  };

  const priorityBorder = item.priority === 'high' ? 'border-l-accent-red' : item.priority === 'medium' ? 'border-l-accent-amber' : 'border-l-border-base';

  return (
    <div className={`bg-bg-card rounded-xl border border-border-base border-l-4 ${priorityBorder} p-4 flex flex-col gap-3 transition-all`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${item.agent === 'MAI' ? 'bg-mai-accent/10 text-mai-accent' : 'bg-natalia-accent/10 text-natalia-accent'}`}>
            {item.agent}
          </span>
          <span className="text-xs text-text-muted">{item.type.replace(/_/g, ' ').toUpperCase()}</span>
        </div>
        <span className="text-xs bg-accent-green-light text-accent-green px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
          {item.confidence}% conf.
        </span>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-text-primary font-display leading-tight">{item.title}</h4>
        {item.client && <p className="text-xs text-text-muted mt-0.5">{item.client}</p>}
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>

      {item.amount && (
        <div className="bg-bg-secondary rounded-lg px-3 py-2">
          <span className="text-base font-bold font-mono text-text-primary">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.amount)}
          </span>
          {item.metadata && (
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
              {Object.entries(item.metadata).map(([k, v]) => (
                <span key={k} className="text-xs text-text-muted">{k}: <span className="font-medium text-text-secondary">{v}</span></span>
              ))}
            </div>
          )}
        </div>
      )}

      {state === 'idle' && (
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onReview(item.id)}
            className="flex items-center justify-center gap-1 text-xs py-1.5 px-2 rounded-lg border border-border-base text-text-secondary hover:bg-bg-secondary transition-colors"
          >
            <Eye size={12} /> Review
          </button>
          <button
            onClick={() => onModify(item.id)}
            className="flex items-center justify-center gap-1 text-xs py-1.5 px-2 rounded-lg border border-border-base text-text-secondary hover:bg-bg-secondary transition-colors"
          >
            <Edit2 size={12} /> Modify
          </button>
          <button
            onClick={() => onReject(item.id)}
            className="flex items-center justify-center gap-1 text-xs py-1.5 px-2 rounded-lg border border-border-base text-accent-red hover:bg-accent-red-light transition-colors"
          >
            <XCircle size={12} /> Reject
          </button>
          <button
            onClick={handleApprove}
            className="flex items-center justify-center gap-1 text-xs py-1.5 px-2 rounded-lg bg-accent-blue text-white hover:bg-accent-blue/90 transition-colors font-medium"
          >
            <CheckCircle size={12} /> Approve
          </button>
        </div>
      )}

      {state === 'syncing' && (
        <div className="flex items-center justify-center gap-2 py-2 text-accent-blue">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs font-medium">Syncing to QuickBooks...</span>
        </div>
      )}

      {state === 'synced' && (
        <div className="flex items-center justify-center gap-2 py-2 text-accent-green">
          <CheckCircle size={14} />
          <span className="text-xs font-medium">Synced</span>
        </div>
      )}
    </div>
  );
};

export default HitlApprovalCard;
