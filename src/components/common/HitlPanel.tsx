import React, { useState } from 'react';
import { CheckCheck, Clock } from 'lucide-react';
import { hitlQueue, HitlItem } from '../../data/hitl_queue';
import HitlApprovalCard from './HitlApprovalCard';

const HitlPanel: React.FC = () => {
  const [items, setItems] = useState<HitlItem[]>(hitlQueue);
  const [rejected, setRejected] = useState<string[]>([]);

  const handleApprove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleReject = (id: string) => {
    setRejected(prev => [...prev, id]);
    setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 500);
  };

  const handleReview = (_id: string) => {
    // In a real app, open detail modal
  };

  const handleModify = (_id: string) => {
    // In a real app, open edit modal
  };

  return (
    <aside className="w-72 flex-shrink-0 bg-bg-secondary border-l border-border-base flex flex-col h-full overflow-hidden">
      <div className="px-4 py-4 border-b border-border-base bg-bg-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary font-display">HITL Approvals</h3>
          {items.length > 0 && (
            <span className="bg-accent-amber text-white text-xs font-bold px-2 py-0.5 rounded-full font-mono">
              {items.length}
            </span>
          )}
        </div>
        <p className="text-xs text-text-muted mt-0.5">Human-in-the-Loop queue</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-accent-green-light rounded-full flex items-center justify-center mb-3">
              <CheckCheck size={20} className="text-accent-green" />
            </div>
            <p className="text-sm font-semibold text-text-primary">All caught up!</p>
            <p className="text-xs text-text-muted mt-1">No pending approvals</p>
          </div>
        ) : (
          items.map(item => (
            <HitlApprovalCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              onReview={handleReview}
              onModify={handleModify}
            />
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-border-base bg-bg-card">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Clock size={12} />
          <span>Auto-refreshes every 30s</span>
        </div>
      </div>
    </aside>
  );
};

export default HitlPanel;
