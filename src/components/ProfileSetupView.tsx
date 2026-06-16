/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Phone, 
  CreditCard, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Coins
} from 'lucide-react';
import { User } from '../types';

interface ProfileSetupViewProps {
  currentUser: User;
  onComplete: (updatedUser: User) => void;
}

export default function ProfileSetupView({ currentUser, onComplete }: ProfileSetupViewProps) {
  const [name, setName] = useState(currentUser.name);
  const [mobile, setMobile] = useState(currentUser.mobile || '');
  const [pan, setPan] = useState(currentUser.pan || '');
  const [employmentType, setEmploymentType] = useState('salaried');
  const [salary, setSalary] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please specify your Official Full Name.');
      return;
    }
    if (!mobile.match(/^\d{10}$/)) {
      setErrorMsg('Mobile Number must constitute exactly 10 digits.');
      return;
    }
    if (!pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      setErrorMsg('PAN card format is invalid (required form e.g. ABCDE1234F).');
      return;
    }
    if (!salary || isNaN(Number(salary)) || Number(salary) <= 0) {
      setErrorMsg('Please specify a valid monthly salary estimate.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('Please review and accept the Reserve Bank credit check authorization terms.');
      return;
    }

    setIsSubmitting(true);

    // Simulate query of CIBIL credit score based on new details
    // High salary + valid PAN simulates a high credit score
    setTimeout(() => {
      let baseScore = 720;
      if (Number(salary) >= 100000) baseScore = 810;
      else if (Number(salary) >= 50000) baseScore = 770;
      
      const randomizedScore = baseScore + Math.floor(Math.random() * 30 - 10);
      const finalScore = Math.min(900, Math.max(300, randomizedScore));

      const updatedUser: User = {
        ...currentUser,
        name: name.trim(),
        mobile,
        pan,
        creditScore: finalScore,
        hasCompletedProfile: true,
      };

      onComplete(updatedUser);
      setIsSubmitting(false);
    }, 1800);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 md:px-6 font-sans flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Hand: Explanatory Branding card */}
        <div className="lg:col-span-5 bg-[#0a192f] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0C5CAB]/25 to-transparent pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div>
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-[#0C5CAB] border border-blue-500/20 rounded font-mono text-[9px] font-bold uppercase tracking-widest">
                Identity Center
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-3 mb-1.5 text-white">
                Complete Your Account Verification
              </h2>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Before proceeding to explore and apply for loan products, the Reserve Bank requires verification of demographic parameters (PAN card indexing).
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#0C5CAB] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">CIBIL Risk Auto-Lookup</h4>
                  <p className="text-zinc-400 text-[10px] leading-normal">
                    We securely verify records to calculate instant debt limits, reducing manual audit queues.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">Preferred Customer Offers</h4>
                  <p className="text-zinc-400 text-[10px] leading-normal">
                    Completing registration unlocks custom Interest rate discounts start at 8.25% flat APR.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">45-Min Faster Approvals</h4>
                  <p className="text-zinc-400 text-[10px] leading-normal">
                    Validating phone lines allows loan officers to fast-track verification of application files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/60 mt-6 text-zinc-500 text-[10px] font-mono relative z-10">
            <span>Platform Secure Session Group LH-7809-A</span>
          </div>
        </div>

        {/* Right Hand: Full Input Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-base font-black text-slate-900">Demographic Identity Fields</h3>
              <p className="text-slate-500 text-[10.5px] mt-1">Please supply genuine credentials to initiate digital score checks.</p>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-800 text-[10.5px] flex items-start gap-2.5 mb-5 leading-normal">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Official Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name as listed on PAN/Aadhaar"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#0C5CAB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10 digit line index"
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-[#0C5CAB]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">PAN Permanent ID</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-[#0C5CAB]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Employment Category</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                    >
                      <option value="salaried">Salaried Employee</option>
                      <option value="self_employed">Self Employed Professional</option>
                      <option value="business">Business Proprietor</option>
                      <option value="unemployed">Other / Retired</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Monthly Net Income (₹)</label>
                  <div className="relative">
                    <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={salary}
                      onChange={(e) => setSalary(e.target.value.replace(/\D/g, ''))}
                      placeholder="Monthly credit salary"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 cursor-pointer accent-[#0C5CAB]"
                />
                <label htmlFor="terms" className="text-[10px] text-slate-500 leading-normal select-none cursor-pointer">
                  I authorize LoanHub to retrieve my credit profile registry score from the national CIBIL database. I declare all details are authenticated.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0C5CAB] hover:bg-[#0a4a8a] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs disabled:bg-slate-400 flex items-center justify-center gap-1.5 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Querying bureaus / Calculating CIBIL Index...</span>
                  </>
                ) : (
                  <>
                    <span>Verify My Profile & Gain Instant Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
