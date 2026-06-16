/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Lightbulb, 
  TrendingUp, 
  Coins, 
  Calculator, 
  ChevronRight, 
  Gift, 
  Tag, 
  Award, 
  Sparkles, 
  Send,
  Loader2
} from 'lucide-react';
import { LoanProduct } from '../types';

interface UtilityPromoModalsProps {
  isOpen: boolean;
  type: 'help' | 'choices' | 'offers' | null;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  onSelectOffer: (productId: string) => void;
  products: LoanProduct[];
}

export default function UtilityPromoModals({
  isOpen,
  type,
  onClose,
  onNavigateTab,
  isLoggedIn,
  onOpenAuth,
  onSelectOffer,
  products
}: UtilityPromoModalsProps) {
  
  // Need Help support simulator states
  const [helpMsg, setHelpMsg] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    { sender: 'agent', text: 'Welcome to LoanHub Smart Desk! How can we assist you with your loan application or credit assessment today?', time: 'Just now' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen || !type) return null;

  const handleSendHelpMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpMsg.trim()) return;

    const userText = helpMsg;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatLog(prev => [...prev, { sender: 'user', text: userText, time: timestamp }]);
    setHelpMsg('');
    setIsTyping(true);

    // Simulate friendly real-time assistant desk responses
    setTimeout(() => {
      let replyText = 'Thanks for writing. An assigned agent has received your ping and will update your application file shortly.';
      
      const lower = userText.toLowerCase();
      if (lower.includes('credit') || lower.includes('cibil')) {
        replyText = 'Our system checks CIBIL scores automatically. Keep your credit score above 750 on your profile page to qualify for preferred premium rates!';
      } else if (lower.includes('interest') || lower.includes('rate')) {
        replyText = 'Interest rates are approved based on financial eligibility checks. You can use our customized Better Money Choices tools to preview monthly installments.';
      } else if (lower.includes('status') || lower.includes('pending') || lower.includes('audit')) {
        replyText = 'Our verification desk usually validates PAN, Aadhaar, and salary files within 12-24 business hours. Updates will instantly render on your Dashboard.';
      } else if (lower.includes('apply') || lower.includes('documents')) {
        replyText = 'To apply, select a product under "Explore Loans", fill in your details, and attach digital copies of your core files.';
      }

      setChatLog(prev => [...prev, { sender: 'agent', text: replyText, time: timestamp }]);
      setIsTyping(false);
    }, 1200);
  };

  const selectPreconfigOffer = (productId: string) => {
    onClose();
    if (!isLoggedIn) {
      alert('Please authenticate your identity first to claim this customized offer.');
      onOpenAuth();
    } else {
      onSelectOffer(productId);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col text-xs text-slate-700 animate-scale-up max-h-[90vh]">
        
        {/* Modal Dynamic Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-950 to-slate-950 text-white relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-white">
              {type === 'help' && <HelpCircle className="w-5 h-5" />}
              {type === 'choices' && <Lightbulb className="w-5 h-5" />}
              {type === 'offers' && <Gift className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight uppercase font-mono">
                {type === 'help' && 'Instant Help Desk & Chat Support'}
                {type === 'choices' && 'Better Money Choices® Planner'}
                {type === 'offers' && 'Exclusive Pre-approved Credit Releases'}
              </h3>
              <p className="text-[10px] text-zinc-300 mt-0.5">
                {type === 'help' && 'Secure sandbox queries with live simulation support'}
                {type === 'choices' && 'Financial education and planning resources'}
                {type === 'offers' && 'Limited-time cashback schemes and discounted interest lines'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Workspace */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* RENDER HELP SECTION */}
          {type === 'help' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* FAQS & Direct support information */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#0C5CAB]" />
                    <span>Traditional Support Line</span>
                  </h4>
                  <p className="text-[10.5px] leading-relaxed text-slate-550">
                    Need instant phone callbacks? Speak with our accredited financial assistants directly.
                  </p>
                  <p className="font-mono font-bold text-xs text-slate-800 bg-white border border-slate-200 p-2 rounded-lg text-center">
                    +1800-419-5959 (Toll Free)
                  </p>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-3.5">
                  <h4 className="font-extrabold text-slate-900">Desk Handbooks</h4>
                  
                  <div className="space-y-2">
                    <details className="group border-b border-blue-100 pb-2 cursor-pointer">
                      <summary className="font-bold text-slate-850 hover:text-[#0C5CAB] list-none flex justify-between items-center">
                        <span>How long takes audit?</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90 text-[#0C5CAB]" />
                      </summary>
                      <p className="text-[10px] text-slate-550 mt-1.5 leading-normal">
                        Our regional credit inspectors confirm identity structures (PAN matched to national registers) within 12-24 Hours.
                      </p>
                    </details>

                    <details className="group border-b border-blue-100 pb-2 cursor-pointer">
                      <summary className="font-bold text-slate-850 hover:text-[#0C5CAB] list-none flex justify-between items-center">
                        <span>Is Aadhaar data safe?</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90 text-[#0C5CAB]" />
                      </summary>
                      <p className="text-[10px] text-slate-550 mt-1.5 leading-normal">
                        Yes, all digital records files are processed securely under sandbox parameters and fully encrypted.
                      </p>
                    </details>
                  </div>
                </div>
              </div>

              {/* Chat simulator on right side */}
              <div className="md:col-span-7 flex flex-col border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 relative min-h-[280px]">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Desk Chatbot BOT</span>
                  </span>
                  <span className="text-[9px] text-[#0C5CAB] font-mono font-bold uppercase tracking-wider bg-blue-100 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* Messages log view */}
                <div className="p-4 space-y-3 overflow-y-auto flex-grow max-h-[180px] min-h-[160px] bg-white">
                  {chatLog.map((chat, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[85%] ${chat.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div className={`p-2.5 rounded-xl ${
                        chat.sender === 'user' 
                          ? 'bg-[#0C5CAB] text-white rounded-tr-none' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50'
                      }`}>
                        <p className="leading-normal">{chat.text}</p>
                      </div>
                      <span className="text-[8.5px] text-slate-400 mt-1 px-1">{chat.time}</span>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] p-2 bg-slate-50 border border-slate-100 rounded-xl w-[120px]">
                      <Loader2 className="w-3 h-3 animate-spin text-[#0C5CAB]" />
                      <span>Typing reply...</span>
                    </div>
                  )}
                </div>

                {/* Send action bar */}
                <form onSubmit={handleSendHelpMsg} className="p-2 border-t border-slate-200 bg-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={helpMsg}
                    onChange={(e) => setHelpMsg(e.target.value)}
                    placeholder="Ask about rate, credit limits, or verify..."
                    className="flex-grow bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0C5CAB]"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#0C5CAB] text-white rounded-xl hover:bg-[#0a4a8a] transition-all shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* RENDER MONEY CHOICES */}
          {type === 'choices' && (
            <div className="space-y-6">
              
              {/* Introduction Banner card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h4 className="font-extrabold text-slate-900 text-sm">Better Money Choices® System</h4>
                  </div>
                  <p className="text-[10.5px] text-slate-550 max-w-md leading-normal">
                    Designed to coach preferred customers in optimized debt consolidation strategies, and credit score development methodologies.
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-amber-100 px-3 py-2 shadow-xs shrink-0 font-mono font-bold text-amber-700 animate-pulse text-center">
                  CIBIL Target Score: 780+
                </div>
              </div>

              {/* Three Columns tips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-2 hover:border-slate-300 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <h5 className="font-bold text-slate-900 leading-tight">Grow Credit Reliability</h5>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Never delay an EMIs check. Clear pending repayments early to establish safe ratings in national bureaus.
                  </p>
                </div>

                <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-2 hover:border-slate-300 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Coins className="w-4.5 h-4.5" />
                  </div>
                  <h5 className="font-bold text-slate-900 leading-tight">Keep Balance Utilization Low</h5>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Always cap overdraft ratios below 30% of total available allocations to prove high repayment capability.
                  </p>
                </div>

                <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-2 hover:border-slate-300 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Calculator className="w-4.5 h-4.5" />
                  </div>
                  <h5 className="font-bold text-slate-900 leading-tight">Consolidate High-APR Lines</h5>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Close multiple scattered short-term debt limits by taking one single low-APR consolidative Business loan.
                  </p>
                </div>

              </div>

              {/* Action Buttons triggers */}
              <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h5 className="font-bold text-slate-800">Launch Financial Modeling Tools</h5>
                  <p className="text-[10px] text-slate-500">Formulate Timelines or run eligibility assessments instantly.</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('calculator');
                    }}
                    className="px-3.5 py-2 bg-white text-slate-700 hover:text-[#0C5CAB] hover:bg-slate-50 border border-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>EMI Calculator</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('eligibility');
                    }}
                    className="px-3.5 py-2 bg-[#0C5CAB] text-white hover:bg-[#0a4a8a] rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Check Eligibility</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* RENDER OFFERS */}
          {type === 'offers' && (
            <div className="space-y-6">
              
              {/* Promo Banner */}
              <div className="bg-gradient-to-r from-[#0C5CAB]/10 via-indigo-50 to-[#0C5CAB]/5 p-5 rounded-2xl border border-[#0C5CAB]/15 flex items-center gap-4">
                <Sparkles className="w-8 h-8 text-indigo-600 shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-extrabold text-slate-900">Festive Season Preferred Privilege</h4>
                  <p className="text-[10.5px] text-slate-550 leading-relaxed">
                    Preferred LoanHub members secure interest discount margins, flat processing fee wavers, and digital approval timelines.
                  </p>
                </div>
              </div>

              {/* Offers list */}
              <div className="space-y-4">
                
                {/* Offer 1 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold font-mono text-[9px] uppercase tracking-wider">Discounted rate</span>
                      <h5 className="font-extrabold text-slate-900 text-sm">Monsoon Elite Business Line</h5>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-normal max-w-md">
                      Apply with custom rate check: <span className="text-indigo-600 font-bold font-mono">8.25% APR</span> flat interest index. No early closure penalties. Maximum ₹35 Lakhs limit.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Find first business product ID if exists, or pass default
                      const found = products.find(p => p.type === 'business');
                      selectPreconfigOffer(found?.id || 'prod_business');
                    }}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shrink-0 cursor-pointer transition-colors"
                  >
                    Claim & Apply Now
                  </button>
                </div>

                {/* Offer 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold font-mono text-[9px] uppercase tracking-wider">No Processing Fee</span>
                      <h5 className="font-extrabold text-slate-900 text-sm">Festival Gold backing liquidity</h5>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-normal max-w-md">
                      Instant disbursement locked in 45 minutes flat with absolute <span className="text-emerald-700 font-bold">0% processing fee</span>. Verified under high gold standards.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const found = products.find(p => p.type === 'gold');
                      selectPreconfigOffer(found?.id || 'prod_gold');
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shrink-0 cursor-pointer transition-colors"
                  >
                    Claim & Apply Now
                  </button>
                </div>

                {/* Offer 3 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded font-bold font-mono text-[9px] uppercase tracking-wider">Fast approval</span>
                      <h5 className="font-extrabold text-slate-900 text-sm">Preferred Personal Super Line</h5>
                    </div>
                    <p className="text-[10.5px] text-slate-500 leading-normal max-w-md">
                      Specially optimized for corporate employees. Automatic pre-approval registry. Interest rates start at 10.5% with tenure logs up to 60 Months.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const found = products.find(p => p.type === 'personal');
                      selectPreconfigOffer(found?.id || 'prod_personal');
                    }}
                    className="px-4 py-2.5 bg-[#0C5CAB] hover:bg-[#0a4a8a] text-white font-bold rounded-xl shrink-0 cursor-pointer transition-colors"
                  >
                    Claim & Apply Now
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
