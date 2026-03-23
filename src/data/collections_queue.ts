export type CollectionStage = 'pre_collection' | 'active' | 'escalated' | 'legal_hold' | 'recovered';
export type CollectionTone = 'friendly' | 'professional' | 'firm';

export interface CollectionAccount {
  id: string;
  client: string;
  agent: 'MAI' | 'NATALIA';
  amount: number;
  daysOutstanding: number;
  stage: CollectionStage;
  invoiceRef: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  lastContact: string;
  nextAction: string;
  nextActionDate: string;
  priorAttempts: number;
  notes: string;
  emailDrafts: {
    friendly: string;
    professional: string;
    firm: string;
  };
}

export const collectionsQueue: CollectionAccount[] = [
  {
    id: 'col-001',
    client: 'SMP / UHA',
    agent: 'MAI',
    amount: 15600,
    daysOutstanding: 51,
    stage: 'active',
    invoiceRef: 'INV-2026-0201',
    contactName: 'Maria Torres',
    contactEmail: 'm.torres@smpuha.com',
    contactPhone: '(650) 555-0112',
    lastContact: '2026-03-08',
    nextAction: 'Firm collections notice',
    nextActionDate: '2026-03-24',
    priorAttempts: 2,
    notes: 'Second notice ignored. Contact confirmed receipt.',
    emailDrafts: {
      friendly: `Hi Maria,\n\nI hope you\'re doing well! I\'m just following up on invoice INV-2026-0201 for $15,600 dated January 31st. We notice it\'s still showing as outstanding in our system.\n\nCould you let us know if there\'s anything we can help clarify or if payment is on its way? We value our partnership and want to make sure everything is smooth on your end.\n\nWarm regards,\nSMM Facilities Accounting`,
      professional: `Dear Maria Torres,\n\nThis is a follow-up regarding invoice INV-2026-0201 for $15,600.00, now 51 days past due from the January 31st invoice date.\n\nWe request payment or a confirmed payment plan within 5 business days. Please remit payment via ACH to the details on file, or contact us to arrange an alternative.\n\nThank you for your prompt attention.\n\nSMM Facilities Accounting`,
      firm: `Dear Maria Torres,\n\nThis is a formal notice that invoice INV-2026-0201 for $15,600.00 is now 51 days past due and delinquent.\n\nImmediate payment is required to avoid service interruption and possible referral to our collections agency. If payment has already been sent, please provide remittance details immediately.\n\nThis matter requires your urgent attention.\n\nSMM Facilities Accounting — Collections Department`,
    },
  },
  {
    id: 'col-002',
    client: 'Surefire Supplies',
    agent: 'MAI',
    amount: 9800,
    daysOutstanding: 67,
    stage: 'escalated',
    invoiceRef: 'INV-2026-0145',
    contactName: 'Linda Marsh',
    contactEmail: 'l.marsh@surefiresupplies.com',
    lastContact: '2026-03-05',
    nextAction: 'Manager escalation call',
    nextActionDate: '2026-03-25',
    priorAttempts: 4,
    notes: 'No response in 14 days. Legal hold being considered.',
    emailDrafts: {
      friendly: `Hi Linda,\n\nI wanted to reach out one more time regarding invoice INV-2026-0145. We\'d love to resolve this together — please give us a call at your earliest convenience.\n\nBest,\nSMM Facilities`,
      professional: `Dear Linda Marsh,\n\nInvoice INV-2026-0145 for $9,800.00 is now 67 days overdue. Despite prior notices, this invoice remains unpaid.\n\nPlease contact our accounting team within 48 hours to arrange payment or discuss your situation.\n\nSMM Facilities Accounting`,
      firm: `Dear Linda Marsh,\n\nFinal notice: invoice INV-2026-0145 for $9,800.00 is 67 days past due. This account has been escalated to management.\n\nFailure to respond within 5 business days will result in referral to our external collections agency and potential reporting to credit bureaus.\n\nSMM Facilities Accounting — Escalated Collections`,
    },
  },
  {
    id: 'col-003',
    client: 'Capital Realty Group',
    agent: 'NATALIA',
    amount: 39200,
    daysOutstanding: 50,
    stage: 'active',
    invoiceRef: 'NAT-2026-0151',
    contactName: 'Frank Rossi',
    contactEmail: 'f.rossi@capitalrealty.com',
    contactPhone: '(408) 555-0198',
    lastContact: '2026-03-14',
    nextAction: 'Third collections notice',
    nextActionDate: '2026-03-24',
    priorAttempts: 2,
    notes: 'AP contact changed. New contact info needed.',
    emailDrafts: {
      friendly: `Hi Frank,\n\nHope all is well at Capital Realty! I\'m reaching out about invoice NAT-2026-0151 for $39,200, which is still showing as open in our system.\n\nLet us know if there\'s a new AP contact or if you need a copy of the invoice — happy to help get this moving.\n\nKind regards,\nNATALIA — SMM Facilities`,
      professional: `Dear Frank Rossi,\n\nPlease be advised that invoice NAT-2026-0151 for $39,200.00 is now 50 days past due.\n\nWe request prompt payment within 5 business days. If your AP contact has changed, please provide updated details so we can coordinate.\n\nThank you,\nSMM Facilities Accounting`,
      firm: `Dear Frank Rossi,\n\nInvoice NAT-2026-0151 for $39,200.00 is 50 days past due and requires immediate resolution.\n\nPlease remit payment or contact us within 3 business days to avoid service disruption and formal collections proceedings.\n\nSMM Facilities Accounting`,
    },
  },
  {
    id: 'col-004',
    client: 'Lucile Packard (PO Hold)',
    agent: 'MAI',
    amount: 22100,
    daysOutstanding: 36,
    stage: 'pre_collection',
    invoiceRef: 'INV-2026-0298',
    contactName: 'David Chen',
    contactEmail: 'd.chen@lpch.org',
    lastContact: '2026-03-18',
    nextAction: 'PO chase — second request',
    nextActionDate: '2026-03-24',
    priorAttempts: 1,
    notes: 'Blocked by missing PO. Not technically late — PO chase in progress.',
    emailDrafts: {
      friendly: `Hi David,\n\nJust a friendly follow-up on PO-4421 for invoice INV-2026-0298. Our invoice is ready but we need the PO number to release it officially.\n\nCould you check with your procurement team? We appreciate your help!\n\nThanks,\nMAI — SMM Facilities`,
      professional: `Dear David Chen,\n\nThis is a follow-up regarding PO-4421 required to process invoice INV-2026-0298 for $22,100.\n\nThe invoice has been prepared and is pending PO reference before we can formally submit. Please provide or confirm PO issuance at your earliest convenience.\n\nSMM Facilities Accounting`,
      firm: `Dear David Chen,\n\nWe have been waiting 36 days for PO-4421 to be issued to unblock invoice INV-2026-0298 ($22,100). This delay is creating billing cycle issues.\n\nPlease escalate internally to ensure PO issuance within 48 hours. Contact us if you need our statement of work referenced.\n\nSMM Facilities Accounting`,
    },
  },
  {
    id: 'col-005',
    client: 'Truebeck Construction',
    agent: 'NATALIA',
    amount: 72300,
    daysOutstanding: 50,
    stage: 'active',
    invoiceRef: 'NAT-2026-0101',
    contactName: 'Brett Truebeck',
    contactEmail: 'b.truebeck@truebeck.com',
    contactPhone: '(415) 555-0244',
    lastContact: '2026-03-15',
    nextAction: 'Senior relationship call',
    nextActionDate: '2026-03-25',
    priorAttempts: 2,
    notes: 'Long-standing client. Handle with care — retention risk.',
    emailDrafts: {
      friendly: `Hi Brett,\n\nHope the projects are going well! Just a quick note about invoice NAT-2026-0101 for $72,300. It\'s showing as outstanding and we want to make sure everything is in order on your end.\n\nGive us a shout if you have any questions — we value our long relationship with Truebeck.\n\nWarm regards,\nNATALIA — SMM Facilities`,
      professional: `Dear Brett Truebeck,\n\nWe\'re following up on invoice NAT-2026-0101 for $72,300, now 50 days past due. We understand you\'re busy with active projects and want to resolve this smoothly.\n\nPlease advise on payment timing or if there are any disputes to address.\n\nThank you,\nSMM Facilities Accounting`,
      firm: `Dear Brett Truebeck,\n\nInvoice NAT-2026-0101 for $72,300 is 50 days past due. We have sent two prior notices without response.\n\nWe value our long relationship and want to avoid formal proceedings. Please contact us within 5 business days to arrange payment.\n\nSMM Facilities Accounting`,
    },
  },
  {
    id: 'col-006',
    client: 'Kodiak',
    agent: 'NATALIA',
    amount: 55400,
    daysOutstanding: 36,
    stage: 'pre_collection',
    invoiceRef: 'NAT-2026-0182',
    contactName: 'Mike Kodiak',
    contactEmail: 'm.kodiak@kodiakco.com',
    lastContact: '2026-03-16',
    nextAction: 'Account health review call',
    nextActionDate: '2026-03-26',
    priorAttempts: 1,
    notes: 'Retention risk — handle delicately. Contract renewal at risk.',
    emailDrafts: {
      friendly: `Hi Mike,\n\nJust touching base on invoice NAT-2026-0182. Also wanted to chat about the contract renewal when you have a moment — we\'re eager to continue our work together.\n\nLet us know a good time to connect!\n\nBest,\nNATALIA — SMM Facilities`,
      professional: `Dear Mike Kodiak,\n\nPlease see our outstanding invoice NAT-2026-0182 for $55,400, now 36 days outstanding. We\'d also welcome a conversation about continuing our service arrangement.\n\nAvailable for a call at your convenience.\n\nSMM Facilities`,
      firm: `Dear Mike Kodiak,\n\nInvoice NAT-2026-0182 for $55,400 is now 36 days past due. We request payment within 5 business days.\n\nWe\'d also like to schedule a call to discuss the service contract renewal.\n\nSMM Facilities Accounting`,
    },
  },
  {
    id: 'col-007',
    client: 'SMP / UHA (Secondary)',
    agent: 'MAI',
    amount: 8200,
    daysOutstanding: 44,
    stage: 'active',
    invoiceRef: 'INV-2026-0180',
    contactName: 'Maria Torres',
    contactEmail: 'm.torres@smpuha.com',
    lastContact: '2026-03-10',
    nextAction: 'Bundle with primary collections notice',
    nextActionDate: '2026-03-24',
    priorAttempts: 1,
    notes: 'Secondary invoice — bundle with INV-2026-0201.',
    emailDrafts: {
      friendly: `Hi Maria,\n\nAlong with our previous note, we also have invoice INV-2026-0180 for $8,200 outstanding. We can combine both payments if that's easier.\n\nLet us know how we can help!\n\nSMM Facilities`,
      professional: `Dear Maria Torres,\n\nAdditional invoice INV-2026-0180 for $8,200 is also outstanding at 44 days. We request combined payment for both outstanding invoices totaling $23,800.\n\nSMM Facilities Accounting`,
      firm: `Dear Maria Torres,\n\nFormal notice: invoice INV-2026-0180 ($8,200) plus INV-2026-0201 ($15,600) totaling $23,800 are delinquent. Immediate combined payment required.\n\nSMM Facilities — Collections`,
    },
  },
  {
    id: 'col-008',
    client: 'Aon Corp Real Estate',
    agent: 'NATALIA',
    amount: 67200,
    daysOutstanding: 36,
    stage: 'pre_collection',
    invoiceRef: 'NAT-2026-0181',
    contactName: 'Marcus Webb',
    contactEmail: 'm.webb@aon.com',
    lastContact: '2026-03-20',
    nextAction: 'Initial payment reminder',
    nextActionDate: '2026-03-24',
    priorAttempts: 0,
    notes: 'First notice pending. Contact responded to email.',
    emailDrafts: {
      friendly: `Hi Marcus,\n\nHope the quarter is going well at Aon! Quick check-in — invoice NAT-2026-0181 for $67,200 is coming up on 36 days. Just want to make sure it\'s in your payment queue.\n\nThanks!\nNATALIA — SMM Facilities`,
      professional: `Dear Marcus Webb,\n\nThis is a reminder that invoice NAT-2026-0181 for $67,200 is 36 days outstanding. Per our Net 30 terms, payment is now past due.\n\nPlease arrange remittance at your earliest convenience.\n\nSMM Facilities Accounting`,
      firm: `Dear Marcus Webb,\n\nInvoice NAT-2026-0181 for $67,200 is 36 days past due terms. Payment is overdue per contract terms.\n\nPlease remit immediately or contact us to discuss.\n\nSMM Facilities Accounting`,
    },
  },
];
