import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { sendMessage } from '../../services/aiService';
import type { ChatMessage } from '../../types';
import { isGeminiConfigured } from '../../lib/gemini';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const { agreement, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !isGeminiConfigured()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const property = agreement?.property;
      const responseText = await sendMessage(text, {
        property: property as any,
        agreement: agreement as any,
        recentPayments: [],
        recentEvents: [],
      });
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant' as const, content: responseText, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant' as const, content: 'Sorry, I encountered an error processing your request.', timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
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

            {!isGeminiConfigured() ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                <Sparkles size={48} className="text-[#3157FF] mb-4" />
                <h4 className="text-lg font-bold text-[#111827] mb-2">AI Not Configured</h4>
                <p className="text-sm text-[#667085]">Add <code className="bg-gray-100 px-1 rounded">VITE_GEMINI_API_KEY</code> to your <code className="bg-gray-100 px-1 rounded">.env</code> file to enable the AI assistant.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <Bot size={40} className="mx-auto text-[#E4E7EC] mb-4" />
                      <p className="text-[#667085]">Hi {profile?.full_name?.split(' ')[0]}! How can I help you with your rental today?</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-6">
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
                          'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                          msg.role === 'user' ? 'bg-[#3157FF] text-white rounded-tr-sm' : 'bg-[#F7F8FA] text-[#111827] border border-[#E4E7EC] rounded-tl-sm'
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-[#F7F8FA] border border-[#E4E7EC] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                        <span className="w-2 h-2 bg-[#667085] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-[#667085] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-[#667085] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                      placeholder="Ask anything..."
                      className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-full focus:outline-none focus:border-[#3157FF] text-sm"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="submit" variant="primary" className="!rounded-full !px-3" disabled={loading || !input.trim()}>
                      <Send size={18} />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
