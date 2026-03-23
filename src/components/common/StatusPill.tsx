import React from 'react';

type StatusType = 'sent' | 'pending_po' | 'overdue' | 'paid' | 'aging_45' | 'pending' | 'current' | 'at_risk' | 'matched' | 'variance' | 'under_review' | 'approved' | 'processing' | 'pending_approval' | 'active' | 'escalated' | 'pre_collection' | 'recovered';

interface StatusPillProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
}

const statusMap: Record<string, { label: string; className: string }> = {
  sent: { label: 'Sent', className: 'bg-accent-blue-light text-accent-blue' },
  pending_po: { label: 'Pending PO', className: 'bg-accent-amber-light text-accent-amber' },
  overdue: { label: 'Overdue', className: 'bg-accent-red-light text-accent-red' },
  paid: { label: 'Paid', className: 'bg-accent-green-light text-accent-green' },
  aging_45: { label: '45+ Days', className: 'bg-accent-amber-light text-accent-amber' },
  pending: { label: 'Pending', className: 'bg-accent-amber-light text-accent-amber' },
  current: { label: 'Current', className: 'bg-accent-green-light text-accent-green' },
  at_risk: { label: 'At Risk', className: 'bg-accent-red-light text-accent-red' },
  matched: { label: 'Matched', className: 'bg-accent-green-light text-accent-green' },
  variance: { label: 'Variance', className: 'bg-accent-amber-light text-accent-amber' },
  under_review: { label: 'Under Review', className: 'bg-accent-blue-light text-accent-blue' },
  approved: { label: 'Approved', className: 'bg-accent-green-light text-accent-green' },
  processing: { label: 'Processing', className: 'bg-accent-blue-light text-accent-blue' },
  pending_approval: { label: 'Pending Approval', className: 'bg-accent-amber-light text-accent-amber' },
  active: { label: 'Active', className: 'bg-accent-blue-light text-accent-blue' },
  escalated: { label: 'Escalated', className: 'bg-accent-red-light text-accent-red' },
  pre_collection: { label: 'Pre-Collection', className: 'bg-accent-amber-light text-accent-amber' },
  recovered: { label: 'Recovered', className: 'bg-accent-green-light text-accent-green' },
};

const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'sm' }) => {
  const config = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-600' };
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusPill;
