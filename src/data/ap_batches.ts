export interface ApLineItem {
  vendor: string;
  category: string;
  amount: number;
  invoiceRef: string;
  dueDate: string;
}

export interface ApBatch {
  id: string;
  batchRef: string;
  period: string;
  totalAmount: number;
  vendorCount: number;
  status: 'pending_approval' | 'approved' | 'processing' | 'paid';
  dueDate: string;
  createdAt: string;
  lineItems: ApLineItem[];
}

export const apBatches: ApBatch[] = [
  {
    id: 'batch-001',
    batchRef: 'B-2026-12',
    period: 'Week of March 17–21, 2026',
    totalAmount: 67200,
    vendorCount: 18,
    status: 'pending_approval',
    dueDate: '2026-03-21',
    createdAt: '2026-03-18T09:00:00Z',
    lineItems: [
      { vendor: 'Ecolab', category: 'Cleaning Supplies', amount: 8400, invoiceRef: 'ECO-2026-0341', dueDate: '2026-03-21' },
      { vendor: 'Waxie Sanitary Supply', category: 'Sanitary Supply', amount: 6200, invoiceRef: 'WAX-2026-0189', dueDate: '2026-03-21' },
      { vendor: 'White Cap Construction Supply', category: 'Construction Supply', amount: 11800, invoiceRef: 'WC-2026-0562', dueDate: '2026-03-21' },
      { vendor: 'Centrihouse', category: 'Equipment Rental', amount: 9300, invoiceRef: 'CTH-2026-0091', dueDate: '2026-03-21' },
      { vendor: 'Bay Area Electrical', category: 'Electrical Services', amount: 4200, invoiceRef: 'BAE-2026-0412', dueDate: '2026-03-21' },
      { vendor: 'Pacific Plumbing', category: 'Plumbing Services', amount: 3800, invoiceRef: 'PPL-2026-0223', dueDate: '2026-03-21' },
      { vendor: 'Allied Universal Security', category: 'Security Services', amount: 12500, invoiceRef: 'AUS-2026-0091', dueDate: '2026-03-21' },
      { vendor: 'Cintas', category: 'Uniforms', amount: 2100, invoiceRef: 'CIN-2026-0601', dueDate: '2026-03-21' },
      { vendor: 'Grainger Industrial', category: 'Industrial Supply', amount: 3900, invoiceRef: 'GRG-2026-0899', dueDate: '2026-03-21' },
      { vendor: 'Comfort Systems HVAC', category: 'HVAC Maintenance', amount: 5000, invoiceRef: 'CSH-2026-0211', dueDate: '2026-03-21' },
    ],
  },
  {
    id: 'batch-002',
    batchRef: 'B-2026-11',
    period: 'Week of March 10–14, 2026',
    totalAmount: 54800,
    vendorCount: 15,
    status: 'paid',
    dueDate: '2026-03-14',
    createdAt: '2026-03-11T09:00:00Z',
    lineItems: [
      { vendor: 'Ecolab', category: 'Cleaning Supplies', amount: 8100, invoiceRef: 'ECO-2026-0330', dueDate: '2026-03-14' },
      { vendor: 'Waxie Sanitary Supply', category: 'Sanitary Supply', amount: 5800, invoiceRef: 'WAX-2026-0175', dueDate: '2026-03-14' },
      { vendor: 'White Cap Construction Supply', category: 'Construction Supply', amount: 10200, invoiceRef: 'WC-2026-0548', dueDate: '2026-03-14' },
      { vendor: 'Centrihouse', category: 'Equipment Rental', amount: 8900, invoiceRef: 'CTH-2026-0087', dueDate: '2026-03-14' },
      { vendor: 'Allied Universal Security', category: 'Security Services', amount: 12500, invoiceRef: 'AUS-2026-0085', dueDate: '2026-03-14' },
    ],
  },
  {
    id: 'batch-003',
    batchRef: 'B-2026-10',
    period: 'Week of March 3–7, 2026',
    totalAmount: 61400,
    vendorCount: 16,
    status: 'paid',
    dueDate: '2026-03-07',
    createdAt: '2026-03-04T09:00:00Z',
    lineItems: [
      { vendor: 'Ecolab', category: 'Cleaning Supplies', amount: 8200, invoiceRef: 'ECO-2026-0318', dueDate: '2026-03-07' },
      { vendor: 'Waxie Sanitary Supply', category: 'Sanitary Supply', amount: 6000, invoiceRef: 'WAX-2026-0162', dueDate: '2026-03-07' },
      { vendor: 'White Cap Construction Supply', category: 'Construction Supply', amount: 12100, invoiceRef: 'WC-2026-0535', dueDate: '2026-03-07' },
      { vendor: 'Centrihouse', category: 'Equipment Rental', amount: 9500, invoiceRef: 'CTH-2026-0082', dueDate: '2026-03-07' },
      { vendor: 'Bay Area Electrical', category: 'Electrical Services', amount: 4800, invoiceRef: 'BAE-2026-0398', dueDate: '2026-03-07' },
    ],
  },
];

export interface VendorPanel {
  vendor: string;
  category: string;
  contractMonthly: number;
  lastInvoice: number;
  variance: number;
  varianceNote: string;
  status: 'matched' | 'variance' | 'under_review';
  lastReconciled: string;
}

export const vendorPanels: VendorPanel[] = [
  {
    vendor: 'Ecolab',
    category: 'Cleaning & Sanitation',
    contractMonthly: 8000,
    lastInvoice: 8400,
    variance: 400,
    varianceNote: 'Additional deep-clean service in Stanford Bldg. 4',
    status: 'variance',
    lastReconciled: '2026-03-15',
  },
  {
    vendor: 'Waxie Sanitary Supply',
    category: 'Janitorial Supply',
    contractMonthly: 6000,
    lastInvoice: 6200,
    variance: 200,
    varianceNote: 'Emergency paper goods restock',
    status: 'variance',
    lastReconciled: '2026-03-15',
  },
  {
    vendor: 'White Cap Construction Supply',
    category: 'Construction & Maintenance Supply',
    contractMonthly: 11000,
    lastInvoice: 11800,
    variance: 800,
    varianceNote: 'Plywood & hardware for Level 10 project overage',
    status: 'under_review',
    lastReconciled: '2026-03-14',
  },
  {
    vendor: 'Centrihouse',
    category: 'Equipment Rental',
    contractMonthly: 9000,
    lastInvoice: 9300,
    variance: 300,
    varianceNote: 'Extended lift rental by 2 days',
    status: 'variance',
    lastReconciled: '2026-03-15',
  },
];

export const monthlyRentSchedule = [
  { property: 'SMM HQ — 525 University Ave', tenant: 'SMM Facilities Inc.', monthlyRent: 24500, dueDate: '2026-04-01', status: 'upcoming' },
  { property: 'Stanford Research Park Office', tenant: 'Stanford University', monthlyRent: 18200, dueDate: '2026-04-01', status: 'upcoming' },
  { property: 'Menlo Park Storage Facility', tenant: 'Bay West Development', monthlyRent: 6800, dueDate: '2026-04-01', status: 'upcoming' },
  { property: 'San Jose Ops Center', tenant: 'Kaiser Permanente', monthlyRent: 31000, dueDate: '2026-04-01', status: 'upcoming' },
];
