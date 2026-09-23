import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { ChatMessage } from '../../types';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';
import { DEMO_AI_RESPONSES } from '../../lib/demoData';

export interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function findDemoResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, value] of Object.entries(DEMO_AI_RESPONSES)) {
    if (key === 'default') continue;
    if (lower.includes(key) || key.includes(lower)) return value;
  }
  // Check for partial keyword matches
  if (lower.includes('unpaid') || lower.includes('overdue') || lower.includes('due')) return DEMO_AI_RESPONSES['show unpaid rent'];
  if (lower.includes('payment') || lower.includes('paid') || lower.includes('rent history')) return DEMO_AI_RESPONSES['payment summary'];
  if (lower.includes('deposit') || lower.includes('security')) return DEMO_AI_RESPONSES['what is my deposit?'];
  if (lower.includes('lease') || lower.includes('end') || lower.includes('expire') || lower.includes('move out')) return DEMO_AI_RESPONSES['lease end date'];
  return DEMO_AI_RESPONSES['default'];
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate a brief thinking delay
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    const responseText = findDemoResponse(text);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant' as const, content: responseText, timestamp: new Date() },
    ]);
    setLoading(false);
  };

  const suggestions = ['Show unpaid rent', 'Payment summary', 'What is my deposit?', 'Lease end date'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#101828]/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-[#E4E7EC]"
          >
            <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between bg-[#3157FF]/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3157FF] text-white rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827]">RentProof AI</h3>
                  <p className="text-xs text-[#667085]">Your rental assistant</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-[#667085] hover:bg-[#E4E7EC] rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#EFF4FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={28} className="text-[#3157FF]" />
                  </div>
                  <h4 className="text-base font-semibold text-[#111827] mb-1">Hi {profile?.full_name?.split(' ')[0]}!</h4>
                  <p className="text-sm text-[#667085] mb-6">How can I help you with your rental today?</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="text-xs bg-[#F7F8FA] border border-[#E4E7EC] px-3 py-1.5 rounded-full text-[#667085] hover:border-[#3157FF] hover:text-[#3157FF] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={clsx(
                      'max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line',
                      msg.role === 'user' ? 'bg-[#3157FF] text-white rounded-tr-sm' : 'bg-[#F7F8FA] text-[#111827] border border-[#E4E7EC] rounded-tl-sm'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#F7F8FA] border border-[#E4E7EC] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-[#3157FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-[#3157FF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-[#3157FF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-[#E4E7EC] bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask about your rental..."
                  className="flex-1 px-4 py-2.5 border border-[#E4E7EC] rounded-full focus:outline-none focus:border-[#3157FF] focus:ring-2 focus:ring-[#3157FF]/10 text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button type="submit" variant="primary" className="!rounded-full !px-3" disabled={loading || !input.trim()}>
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
