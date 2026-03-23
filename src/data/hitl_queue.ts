export type HitlItemType = 'ap_release' | 'collection_email' | 'po_chase' | 'je_post' | 'invoice_release' | 'escalation';

export interface HitlItem {
  id: string;
  agent: 'MAI' | 'NATALIA';
  type: HitlItemType;
  title: string;
  description: string;
  amount?: number;
  confidence: number;
  client?: string;
  metadata?: Record<string, string | number>;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

export const hitlQueue: HitlItem[] = [
  {
    id: 'hitl-001',
    agent: 'NATALIA',
    type: 'ap_release',
    title: 'Release AP Batch #B-2026-12',
    description: 'Weekly AP batch ready for disbursement — 18 vendors reviewed, all invoices matched to POs. ACH transfers will be initiated upon approval.',
    amount: 67200,
    confidence: 98,
    metadata: {
      vendorCount: 18,
      period: 'Week of March 17–21',
      batchRef: 'B-2026-12',
    },
    createdAt: '2026-03-23T08:05:00Z',
    priority: 'high',
  },
  {
    id: 'hitl-002',
    agent: 'MAI',
    type: 'collection_email',
    title: 'Send Collections Notice to SMP/UHA',
    description: 'Invoice INV-2026-0201 is 51 days outstanding. Firm-tone collections email drafted and ready to send. Two prior soft notices sent on days 15 and 30.',
    amount: 15600,
    confidence: 96,
    client: 'SMP / UHA',
    metadata: {
      daysOutstanding: 51,
      invoiceRef: 'INV-2026-0201',
      priorNotices: 2,
    },
    createdAt: '2026-03-23T08:22:00Z',
    priority: 'high',
  },
  {
    id: 'hitl-003',
    agent: 'MAI',
    type: 'po_chase',
    title: 'Chase PO for Lucile Packard PO-4421',
    description: 'Invoice INV-2026-0298 for $22,100 is blocked awaiting PO-4421. MAI has drafted a PO chase email to AP department. This will unblock billing.',
    amount: 22100,
    confidence: 99,
    client: 'Lucile Packard',
    metadata: {
      poRef: 'PO-4421',
      invoiceRef: 'INV-2026-0298',
      daysBlocked: 36,
    },
    createdAt: '2026-03-23T08:11:00Z',
    priority: 'medium',
  },
  {
    id: 'hitl-004',
    agent: 'NATALIA',
    type: 'je_post',
    title: 'Post Ecolab Variance JE',
    description: 'Ecolab March invoice shows $600 variance vs. contract. NATALIA has prepared a journal entry to allocate overrun to facilities OpEx account. Variance approved by ops.',
    amount: 600,
    confidence: 94,
    client: 'Ecolab',
    metadata: {
      glAccount: '7210-Facilities-OpEx',
      varianceType: 'Vendor Overrun',
      vendorInvoice: 'ECO-2026-0341',
    },
    createdAt: '2026-03-23T08:15:00Z',
    priority: 'low',
  },
];
