/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Building, 
  ArrowRight, 
  HeartHandshake, 
  Briefcase, 
  Car, 
  Coins, 
  Calculator, 
  CheckSquare, 
  TrendingUp, 
  Clock, 
  FileText, 
  CreditCard 
} from 'lucide-react';
import { LoanType, LoanProduct } from '../types';

interface HomeViewProps {
  products: LoanProduct[];
  onSelectCategory: (type: LoanType) => void;
  onChangeTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  isLoggedIn: boolean;
}

export default function HomeView({
  products,
  onSelectCategory,
  onChangeTab,
  onOpenAuth,
  isLoggedIn,
}: HomeViewProps) {

  const getIconForType = (type: LoanType) => {
    switch (type) {
      case 'personal':
        return <HeartHandshake className="w-6 h-6 text-red-500" />;
      case 'home':
        return <Building className="w-6 h-6 text-blue-500" />;
      case 'business':
        return <Briefcase className="w-6 h-6 text-emerald-500" />;
      case 'vehicle':
        return <Car className="w-6 h-6 text-purple-500" />;
      case 'gold':
        return <Coins className="w-6 h-6 text-amber-500" />;
    }
  };

  const categoriesList: { type: LoanType; label: string; desc: string; banner: string }[] = [
    {
      type: 'personal',
      label: 'Personal Loan',
      desc: 'Wedding planning, emergency medical treatment, travel, education or gadget finances at optimal flexible rates.',
      banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=260&auto=format&fit=crop',
    },
    {
      type: 'home',
      label: 'Home Loan',
      desc: 'Acquiring property, buying an extension plot, custom renovating or rebuilding structural wings.',
      banner: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=260&auto=format&fit=crop',
    },
    {
      type: 'business',
      label: 'Business Loan',
      desc: 'Expand micro-MSME capacity, augment supply assets, procure state equipment or invest in market outreach.',
      banner: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=260&auto=format&fit=crop',
    },
    {
      type: 'vehicle',
      label: 'Vehicle Loan',
      desc: 'Seamless financing options covering premium cars, electric passenger vehicles, or utility touring bikes.',
      banner: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=260&auto=format&fit=crop',
    },
    {
      type: 'gold',
      label: 'Instant Gold Loan',
      desc: 'Pledge physical jewelry gold lines for immediate financial credit up to ₹25 Lakhs without income records.',
      banner: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=260&auto=format&fit=crop',
    },
  ];

  return (
    <div className="bg-[#09090b] min-h-screen text-[#fafafa]">
      
      {/* Premium Hero Banner */}
      <section className="relative overflow-hidden py-24 px-4 md:px-8 border-b border-zinc-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#0C5CAB]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-350 text-xs font-semibold tracking-wide transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Special Offer: Competitive Interest Rates starting from <strong>7.99%*</strong> p.a.</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#fafafa]">
              Smarter Solutions for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#0C5CAB]">Digital Lending</span>
            </h1>
            
            <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
              Experience the fast track of digitized banking. Check loan eligibility in 2 minutes, calculate customized EMI parameters, and track milestones in real-time.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-1.5">
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    onChangeTab('apply');
                  } else {
                    onOpenAuth('signup');
                  }
                }}
                className="px-7 py-3.5 bg-[#0C5CAB] hover:bg-[#0a4a8a] text-white font-bold rounded-lg shadow-lg hover:shadow-[#0C5CAB]/30 transition-all text-xs uppercase tracking-wider font-mono cursor-pointer"
              >
                Apply Instant Loan
              </button>
              
              <button
                onClick={() => onChangeTab('eligibility')}
                className="px-7 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-350 hover:text-white font-bold rounded-lg transition-all border border-zinc-800 text-xs uppercase tracking-wider font-mono cursor-pointer"
              >
                Check Eligibility
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-800 max-w-lg">
              <div>
                <p className="text-2xl font-black text-[#0C5CAB]">10 Min</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-semibold">Approval Speed</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#0C5CAB]">₹0</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-semibold">Foreclosure Fees</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#0C5CAB]">100%</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-semibold">Paperless Flow</p>
              </div>
            </div>
          </div>

          {/* Graphical Right Panel Overlay */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative">
              {/* Backglow element */}
              <div className="absolute inset-0 bg-[#0C5CAB]/10 rounded-2xl filter blur-xl"></div>
              <div className="relative bg-[#18181b]/70 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <span className="font-semibold text-sm text-zinc-200">Standard Pricing Matrix</span>
                  </div>
                  <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-bold">Stable Core</span>
                </div>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Gold Loan Special</span>
                    <span className="font-mono text-emerald-400 font-bold">7.99% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Dream Home Financing</span>
                    <span className="font-mono text-emerald-400 font-bold">8.40% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Premium Auto Loan</span>
                    <span className="font-mono text-emerald-400 font-bold">8.90% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Personal Emergency Lines</span>
                    <span className="font-mono text-emerald-400 font-bold">10.50% p.a.</span>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-200">Active Simulation:</strong> Switch simulated profiles instantly using the top utility bar to run sandbox client application flows, officer reviews, and administrative configurations.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Panels */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onChangeTab('calculator')}
            className="bg-[#121214] p-6 rounded-xl border border-zinc-800 shadow-xl hover:border-zinc-700 hover:bg-zinc-900/80 transition-all hover:-translate-y-1 flex items-start gap-4 text-left group cursor-pointer"
          >
            <div className="p-3.5 rounded-lg bg-zinc-800 text-[#0C5CAB] group-hover:bg-[#0C5CAB]/10 transition-colors">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white group-hover:text-[#0C5CAB] transition-colors text-base">Calculate Loan EMI</h3>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Determine your monthly liability. Fine-tune interest values and tenure terms with real-time feedback sliders.
              </p>
              <span className="text-[11px] font-bold text-[#0C5CAB] inline-flex items-center gap-1 mt-3">
                <span>Start calculation</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>

          <button
            onClick={() => onChangeTab('eligibility')}
            className="bg-[#121214] p-6 rounded-xl border border-zinc-800 shadow-xl hover:border-zinc-700 hover:bg-zinc-900/80 transition-all hover:-translate-y-1 flex items-start gap-4 text-left group cursor-pointer"
          >
            <div className="p-3.5 rounded-lg bg-zinc-800 text-amber-505 group-hover:bg-amber-550/10 transition-colors">
              <CheckSquare className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors text-base">Check Eligibility</h3>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Provide salary levels, existing financial commitments, and deployment details to receive instant loan limit proposals.
              </p>
              <span className="text-[11px] font-bold text-amber-400 inline-flex items-center gap-1 mt-3">
                <span>Evaluate now</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              if (isLoggedIn) {
                onChangeTab('dashboard');
              } else {
                onOpenAuth('login');
              }
            }}
            className="bg-[#121214] p-6 rounded-xl border border-zinc-800 shadow-xl hover:border-zinc-700 hover:bg-zinc-900/80 transition-all hover:-translate-y-1 flex items-start gap-4 text-left group cursor-pointer"
          >
            <div className="p-3.5 rounded-lg bg-zinc-800 text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-base">Track Applications</h3>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Monitor live application progress through Credit Check, Verification Review, and final Disbursement milestones.
              </p>
              <span className="text-[11px] font-bold text-emerald-400 inline-flex items-center gap-1 mt-3">
                <span>Check Status</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Explore Products Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#0C5CAB]">Product Categories</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Our Premium Retail & Business Loans</h2>
          <p className="text-zinc-450 max-w-2xl mx-auto text-sm text-zinc-400">
            Select an option below to explore rates, fees, eligibility guidelines, required documents, and calculate specialized monthly returns.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categoriesList.map((cat) => {
            const hasCatalogProducts = products.filter(p => p.type === cat.type);
            const minRate = hasCatalogProducts.length > 0 
              ? Math.min(...hasCatalogProducts.map(p => p.interestRate)) 
              : 8.5;

            return (
              <div 
                key={cat.type}
                className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden shadow-md hover:border-zinc-700 hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="h-28 relative">
                  <img 
                    src={cat.banner} 
                    alt={cat.label} 
                    className="w-full h-full object-cover brightness-75" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg shadow-sm">
                    {getIconForType(cat.type)}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-zinc-100 text-sm">{cat.label}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-zinc-800 mt-4">
                    <div className="flex justify-between items-center text-[11px] mb-3 text-zinc-400">
                      <span>Starting from:</span>
                      <strong className="text-emerald-400 font-bold font-mono text-xs">{minRate}% p.a.</strong>
                    </div>
                    <button
                      onClick={() => onSelectCategory(cat.type)}
                      className="w-full py-2 bg-zinc-900 hover:bg-[#0C5CAB] text-[#fafafa] hover:text-white font-bold text-xs rounded-lg transition-colors border border-zinc-800/80 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Explore products</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security & Multi-Step Flow Banner */}
      <section className="bg-[#0c0c0e] py-20 px-4 md:px-8 border-t border-zinc-850">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-[#0C5CAB] border border-[#0C5CAB]/25 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                Digital Security Platform
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Safe, Certified Document Vaults</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                All submitted personal data fields, including Aadhaar cards, PAN credentials, bank statement records, and pay slips are managed through private certified vaults with industrial-grade safety protocols.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-2.5">
                  <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-200">Drag & Drop Formats</h4>
                    <p className="text-zinc-500 text-[11px] mt-0.5">Accept clean PDF, JPG, or PNG files up to 10MB.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-5 h-5 text-[#0C5CAB] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-200">System Verify Loop</h4>
                    <p className="text-zinc-500 text-[11px] mt-0.5">Automated credit risk score checks on submission.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#121214] p-6 rounded-2xl border border-zinc-800 space-y-6">
              <h3 className="font-bold text-sm text-zinc-200 border-b border-zinc-800 pb-3">4-Step Automated Application Process</h3>
              
              <div className="space-y-4 relative">
                {/* Visual vertical connector line */}
                <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-zinc-800"></div>

                <div className="flex items-start gap-4 relative z-10 text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#0C5CAB] border border-blue-400/35 flex items-center justify-center font-bold text-white font-mono shadow-md">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Account Signup & Login</h4>
                    <p className="text-zinc-500 mt-0.5">Verify your mobile credentials and enter your standard identity terms.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10 text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#0C5CAB] border border-blue-400/35 flex items-center justify-center font-bold text-white font-mono shadow-md">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Product Selection & Details</h4>
                    <p className="text-zinc-500 mt-0.5 font-sans">Choose your product and specify employment conditions, salary streams, and amounts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10 text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#0C5CAB] border border-blue-400/35 flex items-center justify-center font-bold text-white font-mono shadow-md">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Online Vault Document Upload</h4>
                    <p className="text-zinc-500 mt-0.5">Instantly drag and drop KYC proofs, salary slips, and direct PDF bank files.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10 text-xs">
                  <div className="w-7 h-7 rounded-full bg-emerald-990 bg-emerald-600 border border-emerald-400/35 flex items-center justify-center font-bold text-white font-mono shadow-md">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200">Milestone Tracking & Approval</h4>
                    <p className="text-zinc-500 mt-0.5">Monitor officer evaluation logs in real-time until final disbursement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
