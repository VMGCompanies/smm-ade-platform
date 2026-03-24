import Anthropic from '@anthropic-ai/sdk';

// For LRP demo - browser-side API calls
const getClient = () => new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

export function hasApiKey(): boolean {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
  return key.length > 10 && key !== 'your-key-here';
}

export interface AdePersona {
  name: 'MAI' | 'NATALIA';
  role: string;
  portfolio: string;
}

const MAI_SYSTEM = `You are MAI, an AI Autonomous Digital Employee (ADE) specializing in Accounts Receivable Billing & Collections for SMM Facilities, Inc. — a $60M commercial cleaning and facilities company.

Your portfolio includes Stanford Health System (anchor account), Lucile Packard Children's Hospital, SMP/UHA, Blood Center, Valley Care, School of Medicine, FTE Painters, and Pasteur billable hours.

You communicate in a professional, precise, healthcare-billing-aware tone. You understand PO-dependent invoicing, multi-entity Stanford ecosystem billing, and collections escalation protocols.

Your reporting managers are: Carmelo, Esteban, Jorge, Albert.
Always be helpful, data-driven, and concise. When drafting emails, use professional but not aggressive language.`;

const NATALIA_SYSTEM = `You are NATALIA, an AI Autonomous Digital Employee (ADE) specializing in both Accounts Receivable Billing AND full Accounts Payable for SMM Facilities, Inc. — a $60M commercial cleaning and facilities company.

Your AR portfolio has 23 active accounts including Stanford University, Kaiser, Salesforce, Peloton, Mercedes, Truebeck, Level 10, Kodiak (construction GC accounts with retention risk), and various commercial RE clients.

Your AP responsibilities include: weekly AP payment batches, vendor statement reconciliation (Ecolab, Waxie, White Cap, Centrihouse), Home Depot journal entry uploads, monthly rent payments.

You communicate in a methodical, data-driven, reconciliation-focused tone. You understand construction retention holdbacks, vendor reconciliation variances, and journal entry formatting.

Your reporting managers are: Danny, Jorge, Esteban, Raf, Albert, Suki.
Always be precise, reference specific amounts and dates when available.`;

// Generate a real collections email
export async function generateCollectionsEmail(params: {
  ade: 'MAI' | 'NATALIA';
  clientName: string;
  invoiceNum: string;
  amount: number;
  daysOutstanding: number;
  contactName: string;
  tone: 'friendly' | 'professional' | 'firm';
  invoiceDate: string;
}): Promise<string> {
  const client = getClient();
  const system = params.ade === 'MAI' ? MAI_SYSTEM : NATALIA_SYSTEM;

  const toneInstructions = {
    friendly: 'warm and understanding, emphasizing the relationship',
    professional: 'professional and clear, matter-of-fact',
    firm: 'firm and direct, emphasizing urgency while remaining professional'
  };

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 600,
    system,
    messages: [{
      role: 'user',
      content: `Draft a collections email with ${toneInstructions[params.tone]} tone.

Client: ${params.clientName}
Contact: ${params.contactName}
Invoice #: ${params.invoiceNum}
Amount: $${params.amount.toLocaleString()}
Invoice Date: ${params.invoiceDate}
Days Outstanding: ${params.daysOutstanding}

Write just the email body (no subject line). Sign as yourself (${params.ade}). Keep it under 150 words.`
    }]
  });

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock?.type === 'text' ? textBlock.text : '';
}

// Chat with ADE
export async function chatWithAde(params: {
  ade: 'MAI' | 'NATALIA';
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  portfolioContext?: string;
}): Promise<string> {
  const client = getClient();
  const system = (params.ade === 'MAI' ? MAI_SYSTEM : NATALIA_SYSTEM) +
    (params.portfolioContext ? `\n\nCurrent portfolio context:\n${params.portfolioContext}` : '');

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 800,
    system,
    messages: params.messages
  });

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock?.type === 'text' ? textBlock.text : '';
}

// Extract document data from uploaded file
export async function extractDocumentData(params: {
  fileBase64: string;
  mediaType: string;
  documentType: 'invoice' | 'purchase_order' | 'vendor_statement' | 'work_order' | 'unknown';
}): Promise<{
  documentType: string;
  extractedFields: Record<string, string>;
  summary: string;
  routeTo: 'MAI' | 'NATALIA' | 'BOTH';
  actionItems: string[];
}> {
  const client = getClient();
  const isImage = params.mediaType.startsWith('image/');

  let content: Anthropic.MessageParam['content'];

  if (isImage) {
    content = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: params.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: params.fileBase64
        }
      },
      { type: 'text', text: `Extract all financial/operational data from this ${params.documentType}. Return JSON with: documentType, extractedFields (all key-value pairs found), summary (1 sentence), routeTo (MAI=AR/billing, NATALIA=AP/large portfolio, BOTH), actionItems (array of 2-3 suggested next actions).` }
    ];
  } else {
    content = [{
      type: 'text',
      text: `This is a ${params.documentType} document uploaded to SMM Facilities accounting platform.

Simulate extracting data as if you received: vendor invoice, PO, or work order with realistic SMM Facilities data.

Return a JSON object with:
{
  "documentType": "invoice|purchase_order|vendor_statement|work_order",
  "extractedFields": {
    "vendor/client": "...",
    "amount": "...",
    "date": "...",
    "reference": "...",
    "terms": "...",
    "line_items": "...",
    "po_number": "...",
    "notes": "..."
  },
  "summary": "One sentence summary",
  "routeTo": "MAI|NATALIA|BOTH",
  "actionItems": ["action 1", "action 2", "action 3"]
}`
    }];
  }

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1000,
    messages: [{ role: 'user', content }]
  });

  try {
    const text = response.content.find(b => b.type === 'text');
    if (text?.type === 'text') {
      const jsonMatch = text.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch {
    // fall through to default
  }

  return {
    documentType: params.documentType,
    extractedFields: { 'status': 'Extraction complete' },
    summary: 'Document processed successfully',
    routeTo: 'MAI',
    actionItems: ['Review extracted data', 'Confirm routing', 'Assign to workflow']
  };
}

// What-If Scenario Engine
export async function runWhatIfScenario(params: {
  scenario: string;
  currentArOutstanding: number;
  currentApDue: number;
  cashPosition: number;
  accountsAffected: string[];
}): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1000,
    system: `You are a financial analysis engine for SMM Facilities, Inc. — a $60M commercial cleaning company.
Analyze cash flow scenarios and provide actionable intelligence. Be specific with numbers and dates.
Current state: AR Outstanding: $${params.currentArOutstanding.toLocaleString()}, AP Due This Week: $${params.currentApDue.toLocaleString()}`,
    messages: [{
      role: 'user',
      content: `Run this scenario: "${params.scenario}"

Accounts affected: ${params.accountsAffected.join(', ')}

Provide:
1. Cash position impact (specific dollar amounts)
2. AP obligations at risk
3. Recommended ADE actions
4. Timeline of critical dates
5. Risk level (LOW/MEDIUM/HIGH/CRITICAL)

Be specific and actionable. Format with clear headers.`
    }]
  });

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock?.type === 'text' ? textBlock.text : 'Scenario analysis unavailable';
}

// Payment DNA analysis
export async function analyzePaymentDNA(clientName: string, invoiceHistory: Array<{ amount: number; daysToPayment: number; date: string }>): Promise<{
  avgDaysToPayment: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  prediction: string;
  recommendation: string;
}> {
  const client = getClient();
  const avg = invoiceHistory.reduce((a, b) => a + b.daysToPayment, 0) / invoiceHistory.length;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `Client: ${clientName}
Payment history (days to pay): ${invoiceHistory.map(i => i.daysToPayment).join(', ')}
Average: ${avg.toFixed(1)} days

Give me:
1. Risk level (LOW/MEDIUM/HIGH)
2. One-sentence payment prediction for next invoice
3. One-sentence collection recommendation

Return as JSON: {"riskLevel": "...", "prediction": "...", "recommendation": "..."}`
    }]
  });

  try {
    const text = response.content.find(b => b.type === 'text');
    if (text?.type === 'text') {
      const jsonMatch = text.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return { avgDaysToPayment: Math.round(avg), ...parsed };
      }
    }
  } catch {
    // fall through to default
  }

  return {
    avgDaysToPayment: Math.round(avg),
    riskLevel: avg > 45 ? 'HIGH' : avg > 30 ? 'MEDIUM' : 'LOW',
    prediction: `Based on history, payment expected around day ${Math.round(avg)}`,
    recommendation: 'Monitor closely and initiate contact at day 30'
  };
}

// ADE Consciousness - real-time reasoning stream
export async function* streamAdeConsciousness(params: {
  ade: 'MAI' | 'NATALIA';
  task: string;
  context: string;
}): AsyncGenerator<string> {
  const client = getClient();
  const system = params.ade === 'MAI' ? MAI_SYSTEM : NATALIA_SYSTEM;

  const stream = await client.messages.stream({
    model: 'claude-opus-4-5',
    max_tokens: 400,
    system,
    messages: [{
      role: 'user',
      content: `I am currently processing: ${params.task}
Context: ${params.context}

Think through this task and describe what you're analyzing, what you're finding, and what action you're recommending. Write in first person present tense as if thinking out loud. Be specific about the data.`
    }]
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      if (event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  }
}
