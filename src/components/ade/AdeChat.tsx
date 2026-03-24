import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Trash2, Database, MessageCircle } from 'lucide-react';
import { chatWithAde, hasApiKey } from '../../lib/claudeApi';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AdeChatProps {
  ade: 'MAI' | 'NATALIA';
  onClose: () => void;
}

const MAI_SUGGESTIONS = [
  "What's our Stanford AR exposure?",
  "Draft a firm email to SMP/UHA",
  "Which accounts need attention today?",
];

const NATALIA_SUGGESTIONS = [
  "What's this week's AP total?",
  "Any vendor reconciliation issues?",
  "Show me the Truebeck retention situation",
];

const MAI_CONTEXT = `Current MAI Portfolio Summary:
- Stanford Main Campus: $187,400 — 22 days outstanding
- Lucile Packard Children's Hospital: $94,200 — 36 days, PO pending
- SMP/UHA: $15,600 — 51 days OVERDUE
- Blood Center of the Pacific: $22,800 — 18 days
- Valley Care Medical Center: $41,500 — 23 days
- Stanford School of Medicine: $63,200 — 22 days
- FTE Painters: $8,400 — 13 days
- Surefire Supplies: $9,800 — 67 days ESCALATED
Total AR: $434,500 | Overdue: $25,400`;

const NATALIA_CONTEXT = `Current NATALIA Portfolio Summary:
- Kaiser Permanente: $118,000 — 22 days
- Cushman & Wakefield/Ericsson: $81,500 — 22 days
- Aon Corp Real Estate: $67,200 — 36 days
- Truebeck Construction: $72,300 — 50 days RETENTION RISK
- Kodiak: $55,400 — 36 days RETENTION RISK
- Capital Realty Group: $39,200 — 50 days
AP Due This Week: $94,500 (18 vendors)
Batch B-2026-12: Centrihouse variance $200 flagged`;

const AdeChat: React.FC<AdeChatProps> = ({ ade, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useContext, setUseContext] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accentColor = ade === 'MAI' ? 'bg-mai-accent' : 'bg-natalia-accent';
  const textAccent = ade === 'MAI' ? 'text-mai-accent' : 'text-natalia-accent';
  const lightBg = ade === 'MAI' ? 'bg-mai-accent/10' : 'bg-natalia-accent/10';
  const suggestions = ade === 'MAI' ? MAI_SUGGESTIONS : NATALIA_SUGGESTIONS;
  const context = ade === 'MAI' ? MAI_CONTEXT : NATALIA_CONTEXT;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    setInput('');
    setError('');

    const userMsg: ChatMessage = { role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (!hasApiKey()) {
        throw new Error('NO_KEY');
      }

      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const response = await chatWithAde({
        ade,
        messages: history,
        portfolioContext: useContext ? context : undefined,
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (err: unknown) {
      const isNoKey = (err instanceof Error && err.message === 'NO_KEY');
      const mockResponses: Record<string, string[]> = {
        MAI: [
          "Stanford Main Campus ($187,400) is at 22 days — within terms. Lucile Packard is the priority with a pending PO blocking $94,200. SMP/UHA at 51 days needs an immediate firm notice. Surefire Supplies at 67 days should be escalated to management today.",
          "I'd recommend a firm tone for SMP/UHA given the 51-day aging. The email should reference the specific invoice (INV-2026-0201), amount ($15,600), and note this is the second notice. Should I draft it?",
          "Today's priority queue: 1) Escalate Surefire Supplies (67 days, no response), 2) Send firm notice to SMP/UHA (51 days), 3) Chase PO-4421 for Lucile Packard (blocks $94,200 release). Combined exposure: $119,600.",
        ],
        NATALIA: [
          "This week's AP batch B-2026-12 totals $67,200 across 18 vendors. There's a $200 variance on the Centrihouse invoice that needs review before release. Ecolab ($12,400) and Waxie ($8,600) are matched and ready.",
          "Truebeck Construction has $72,300 outstanding at 50 days with retention risk. The construction contract includes standard 10% holdback provisions. I recommend initiating formal retention release request — shall I draft the communication?",
          "Centrihouse variance: their statement shows $9,500 but our PO was for $9,300. The $200 difference appears to be a freight surcharge added without prior authorization. I recommend disputing it and requesting a credit memo.",
        ],
      };
      const pool = mockResponses[ade];
      const mock = pool[Math.floor(Math.random() * pool.length)];
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isNoKey ? `[Demo Mode — Add API key for real AI]\n\n${mock}` : mock,
        timestamp: new Date()
      }]);
      if (!isNoKey) setError('API error. Showing demo response.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed right-0 top-14 bottom-0 w-96 bg-bg-card border-l border-border-base flex flex-col z-50 shadow-xl">
      {/* Header */}
      <div className={`${accentColor} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{ade[0]}</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{ade} ADE</p>
            <div className="flex items-center gap-1.5 text-white/70 text-xs">
              <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseContext(!useContext)}
            title={useContext ? 'Portfolio context ON' : 'Portfolio context OFF'}
            className={`p-1.5 rounded-lg transition-colors ${useContext ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Database size={14} />
          </button>
          <button
            onClick={() => setMessages([])}
            title="Clear conversation"
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Context indicator */}
      {useContext && (
        <div className={`px-3 py-1.5 text-xs flex items-center gap-1.5 border-b border-border-base ${lightBg} ${textAccent}`}>
          <Database size={10} />
          Portfolio context active — {ade} has full account visibility
        </div>
      )}

      {!hasApiKey() && (
        <div className="px-3 py-2 bg-accent-amber-light border-b border-accent-amber/30 text-xs text-accent-amber">
          Add VITE_ANTHROPIC_API_KEY to .env for real AI responses
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="text-center py-4">
              <div className={`w-10 h-10 ${accentColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <MessageCircle size={18} className="text-white" />
              </div>
              <p className="text-sm font-medium text-text-primary">Chat with {ade}</p>
              <p className="text-xs text-text-muted mt-1">Ask about accounts, request drafts, or get analysis</p>
            </div>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className={`w-full text-left text-xs px-3 py-2.5 rounded-lg border border-border-base hover:border-current transition-colors ${lightBg} ${textAccent} hover:opacity-80`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className={`w-6 h-6 ${accentColor} rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1`}>
                <span className="text-white text-xs font-bold">{ade[0]}</span>
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-3 py-2.5 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-mai-accent text-white rounded-br-sm' : 'bg-bg-secondary text-text-primary rounded-bl-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className={`w-6 h-6 ${accentColor} rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1`}>
              <span className="text-white text-xs font-bold">{ade[0]}</span>
            </div>
            <div className="bg-bg-secondary rounded-xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-accent-red text-center">{error}</p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border-base">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${ade} something...`}
            className="flex-1 text-sm bg-bg-secondary border border-border-base rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mai-accent/30 text-text-primary placeholder-text-muted"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-lg transition-colors ${input.trim() && !isLoading ? `${accentColor} text-white hover:opacity-90` : 'bg-bg-secondary text-text-muted cursor-not-allowed'}`}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdeChat;
