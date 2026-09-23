import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, CreditCard, Clock, MessageSquare, CheckCircle, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('payments');

  return (
    <div className="min-h-screen bg-[#F7F8FA] overflow-hidden font-sans">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Shield className="text-[#3157FF]" size={28} />
          <span className="text-xl font-bold text-[#111827]">RentProof</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-[#111827] font-medium hover:text-[#3157FF] transition-colors">
            Login
          </button>
          <button onClick={() => navigate('/login')} className="bg-[#111827] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#3157FF] transition-colors shadow-lg shadow-[#3157FF]/20">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#3157FF]/10 rounded-full blur-[100px] -z-10 animate-pulse-glow" />
        
        <div className="container mx-auto px-6 text-center z-10 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-[#3157FF]/10 text-[#3157FF] text-sm font-semibold mb-6 border border-[#3157FF]/20">
              The Standard in Rental Trust
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#111827] mb-8 max-w-4xl mx-auto leading-tight">
              <span className="text-gradient">AI that understands</span> your property's condition.
            </h1>
            <p className="text-lg md:text-xl text-[#667085] max-w-2xl mx-auto mb-10 leading-relaxed">
              Capture your room. Let AI identify visible damage. Get a documented condition report. Compare it when you move out to resolve deposit disputes instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-[#3157FF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#101828] transition-all shadow-xl shadow-[#3157FF]/30 flex items-center justify-center gap-2">
                Start Free <ChevronRight size={20} />
              </button>
              <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-white text-[#111827] px-8 py-4 rounded-xl font-bold text-lg border border-[#E4E7EC] hover:border-[#111827] transition-all">
                See How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-white border-y border-[#E4E7EC]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">The Rental Trust Problem</h2>
            <p className="text-[#667085] mt-4 text-lg">Why millions face disputes every year.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: 'Lost Receipts', desc: 'Payments scattered across WhatsApp, email, and paper.' },
              { icon: CreditCard, title: 'Disputed Deposits', desc: 'No clear record of pre-existing damages leads to lost money.' },
              { icon: Clock, title: 'Zero Proof', desc: 'He-said-she-said arguments when things go wrong.' }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-[#F7F8FA] p-8 rounded-2xl border border-[#F04438]/10 hover:border-[#F04438]/30 transition-colors">
                <div className="w-12 h-12 bg-[#F04438]/10 rounded-xl flex items-center justify-center mb-6 text-[#F04438]">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">{item.title}</h3>
                <p className="text-[#667085]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-[#101828] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">One platform. Complete proof.</h2>
            <p className="text-gray-400 text-lg">Everything you need to rent with confidence.</p>
          </div>

          <div className="flex justify-center mb-12 flex-wrap gap-2">
            {['AI Inspection', 'Payments', 'Timeline', 'Dashboard'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === tab.toLowerCase() ? 'bg-[#3157FF] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl border border-white/10 p-8 md:p-12 max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center bg-[#111827]"
          >
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-6 capitalize">{activeTab}</h3>
              <ul className="space-y-4">
                {activeTab === 'ai inspection' ? (
                  <>
                    <li className="flex items-center gap-3"><CheckCircle className="text-[#12B76A]" size={20} /><span className="text-gray-300">Scan rooms with your camera</span></li>
                    <li className="flex items-center gap-3"><CheckCircle className="text-[#12B76A]" size={20} /><span className="text-gray-300">AI detects visible damages instantly</span></li>
                    <li className="flex items-center gap-3"><CheckCircle className="text-[#12B76A]" size={20} /><span className="text-gray-300">Compare move-in vs move-out conditions</span></li>
                  </>
                ) : (
                  [1, 2, 3].map((_, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="text-[#12B76A]" size={20} />
                      <span className="text-gray-300">Automated tracking and verifiable records</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="flex-1 w-full bg-black/40 rounded-2xl border border-white/10 p-6 shadow-2xl aspect-video flex items-center justify-center">
              <MessageSquare size={64} className="text-[#3157FF]/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-b border-[#E4E7EC] bg-white">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
          {[
            { v: '₹2.4Cr+', l: 'Rent Tracked' },
            { v: '1,200+', l: 'Properties' },
            { v: '99.7%', l: 'Dispute Resolution' }
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-4xl md:text-5xl font-black text-[#111827] mb-2">{s.v}</div>
              <div className="text-[#667085] font-medium">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-[#F7F8FA]">
        <h2 className="text-4xl font-bold text-[#111827] mb-8">Ready to protect your rental?</h2>
        <button onClick={() => navigate('/login')} className="bg-[#3157FF] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#101828] transition-all shadow-xl shadow-[#3157FF]/30">
          Get Started — It's Free
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#101828] text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="text-[#3157FF]" size={24} />
            <span className="font-bold">RentProof</span>
          </div>
          <div className="text-sm text-gray-400">© 2026 RentProof. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
