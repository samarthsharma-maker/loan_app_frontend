/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PhoneCall, MapPin, Mail, ShieldAlert, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#09090b] text-zinc-400 text-sm border-t border-zinc-800">
      {/* Upper Footer: Contact and Support */}
      <div className="bg-[#121214]/60 border-b border-zinc-800/80 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-full bg-zinc-900 text-blue-400 border border-zinc-850">
              <PhoneCall className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-mono uppercase">TOLL FREE SUPPORT 24/7</p>
              <p className="text-[#fafafa] hover:text-blue-450 font-semibold transition-colors">1800 258 3838 / 1800 22 4060</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-full bg-zinc-900 text-emerald-400 border border-zinc-850">
              <Mail className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-mono uppercase">LOAN DISBURSEMENT DESK</p>
              <p className="text-[#fafafa] hover:text-emerald-400 font-semibold transition-colors">instantloans@loanhub-bank.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-full bg-zinc-900 text-red-400 border border-zinc-850">
              <MapPin className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-mono uppercase">REGISTERED BANK OFFICE</p>
              <p className="text-[#fafafa] font-semibold text-xs leading-relaxed">HDFC Bank House, Lower Parel, Mumbai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mid Footer: Loan Columns & Disclosures */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-1.5 mb-4">
            <div className="font-bold text-lg text-white">Loan<span className="text-[#0C5CAB] font-black">Hub</span></div>
          </div>
          <p className="text-zinc-400/90 text-xs leading-relaxed mb-4">
            A state-of-the-art secure loan platform automating home, personal, and business financing lines under standard regulatory framework.
          </p>
          <div className="flex items-center gap-2 text-zinc-550 text-xs text-zinc-400">
            <Award className="w-4 h-4 text-amber-500" />
            <span>ISO 27001 Certified Security System</span>
          </div>
        </div>

        <div>
          <h4 className="text-zinc-200 font-semibold mb-4 text-xs uppercase tracking-widest">Retail Loan Products</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white transition-colors cursor-pointer">Individual Personal Loans</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Executive Dream Home Loans</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Two-Wheeler Easy EMI Loans</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Instant Gold Overdraft Loans</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-zinc-200 font-semibold mb-4 text-xs uppercase tracking-widest">Commercial Funding</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white transition-colors cursor-pointer">MSME Secured Working Capital</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Unsecured Startup Growth Lines</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Corporate Debt Restructuring</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Machinery Purchase Assistance</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-zinc-200 font-semibold mb-4 text-xs uppercase tracking-widest">Calculators & Portal</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white transition-colors cursor-pointer">Interactive Equated Monthly Installment</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">In-Hand Salary Eligibility Engine</span></li>
            <li><span className="hover:text-white transition-colors cursor-pointer">Aadhaar Document Safe Vault</span></li>
            <li><span className="hover:text-[#0C5CAB] transition-colors cursor-pointer font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Cloud Officer Console
            </span></li>
          </ul>
        </div>
      </div>

      {/* Lower Footer: Regulatory guidelines */}
      <div className="bg-[#0c0c0e] py-6 px-4 text-center text-[11px] text-zinc-500 border-t border-zinc-800/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="flex items-center gap-1.5 justify-center md:justify-start">
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
            <span>Mock Application Project for demonstration purposes. Inspired by real corporate loan processes.</span>
          </p>
          <p className="font-mono text-zinc-500">
            &copy; {new Date().getFullYear()} LoanHub Digital. Licensed of Reserve Bank. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
