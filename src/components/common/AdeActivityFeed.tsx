import React, { useEffect, useState, useRef } from 'react';
import { activityLog, liveActivityEvents, ActivityItem } from '../../data/activity_log';

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function actionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    invoice_generated: 'Invoice Generated',
    invoice_sent: 'Invoice Sent',
    payment_received: 'Payment Received',
    collection_email: 'Collection Email',
    po_chased: 'PO Chased',
    ap_batch_prepared: 'AP Batch Prepared',
    ap_payment_processed: 'AP Payment Processed',
    vendor_reconciled: 'Vendor Reconciled',
    je_posted: 'JE Posted',
    escalation_created: 'Escalation Created',
    approval_requested: 'Approval Requested',
    contract_flagged: 'Contract Flagged',
    aging_alert: 'Aging Alert',
    po_received: 'PO Received',
  };
  return labels[type] || type;
}

interface AdeActivityFeedProps {
  maxItems?: number;
  compact?: boolean;
}

const AdeActivityFeed: React.FC<AdeActivityFeedProps> = ({ maxItems = 12, compact = false }) => {
  const [items, setItems] = useState<ActivityItem[]>(activityLog.slice(0, maxItems));
  const liveIndex = useRef(0);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = { ...liveActivityEvents[liveIndex.current % liveActivityEvents.length], timestamp: new Date().toISOString(), id: `live-${Date.now()}` };
      liveIndex.current++;
      setItems(prev => [next, ...prev.slice(0, maxItems - 1)]);
    }, 10000);
    return () => clearInterval(interval);
  }, [maxItems]);

  return (
    <div ref={feedRef} className="flex flex-col gap-1 overflow-hidden">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className={`flex gap-3 items-start py-2.5 px-3 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer ${idx === 0 ? 'animate-pulse-once' : ''}`}
        >
          <div className={`flex-shrink-0 w-1 self-stretch rounded-full ${item.agent === 'MAI' ? 'bg-mai-accent' : 'bg-natalia-accent'}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded font-mono ${item.agent === 'MAI' ? 'bg-mai-accent/10 text-mai-accent' : 'bg-natalia-accent/10 text-natalia-accent'}`}>
                {item.agent}
              </span>
              <span className="text-xs font-medium text-text-secondary">{actionTypeLabel(item.type)}</span>
              {item.requiresHuman && (
                <span className="text-xs bg-accent-amber-light text-accent-amber px-1.5 py-0.5 rounded font-medium">HITL</span>
              )}
            </div>
            <p className={`text-xs text-text-secondary leading-relaxed ${compact ? 'truncate' : ''}`}>{item.description}</p>
            {!compact && item.amount && (
              <span className="text-xs font-mono text-text-muted">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(item.amount)}
              </span>
            )}
          </div>
          <span className="text-xs text-text-muted flex-shrink-0 mt-0.5">{timeAgo(item.timestamp)}</span>
        </div>
      ))}
    </div>
  );
};

export default AdeActivityFeed;
