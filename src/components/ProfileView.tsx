/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  Activity, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Lock
} from 'lucide-react';
import { User } from '../types';

interface ProfileViewProps {
  currentUser: User;
  onUpdateProfile: (updated: User) => void;
}

export default function ProfileView({ currentUser, onUpdateProfile }: ProfileViewProps) {
  const [name, setName] = useState(currentUser.name);
  const [mobile, setMobile] = useState(currentUser.mobile);
  const [pan, setPan] = useState(currentUser.pan);
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [creditRefreshing, setCreditRefreshing] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState(currentUser.creditScore || 780);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Full Name is required.');
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

    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile({
        ...currentUser,
        name,
        mobile,
        pan,
        creditScore: simulatedScore
      });
      setIsSaving(false);
      setSuccessMsg('Your security profile details have been successfully synchronized.');
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1200);
  };

  const handleRefreshCredit = () => {
    setCreditRefreshing(true);
    setTimeout(() => {
      // Simulate random improvement or stabilization of score between 750 and 850
      const nextScore = Math.min(900, Math.max(300, (currentUser.creditScore || 780) + Math.floor(Math.random() * 15 - 5)));
      setSimulatedScore(nextScore);
      onUpdateProfile({
        ...currentUser,
        creditScore: nextScore
      });
      setCreditRefreshing(false);
      setSuccessMsg('National CIBIL database queried. Credit score updated successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1500);
  };

  const getScoreRating = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500' };
    if (score >= 650) return { label: 'Good', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', barColor: 'bg-amber-500' };
    return { label: 'Poor', color: 'text-rose-650', bg: 'bg-rose-50 border-rose-200', barColor: 'bg-rose-500' };
  };

  const rating = getScoreRating(simulatedScore);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 md:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner Grid Header */}
        <div className="bg-[#121214] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-zinc-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C5CAB]/10 via-[#0a4a8a]/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0C5CAB] to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg border border-white/15">
              {name.slice(0, 2).toUpperCase() || 'US'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">{name}</h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono text-[10px] font-bold uppercase tracking-wider">
                  Verified Identity
                </span>
              </div>
              <p className="text-zinc-400 text-xs mt-0.5">{currentUser.email}</p>
              <p className="text-zinc-500 text-[10px] uppercase font-mono mt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Account Created: {new Date(currentUser.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative z-10 w-full md:w-auto shrink-0">
            <span className="text-[10px] text-zinc-450 uppercase font-mono tracking-widest font-black text-zinc-400">Assigned Platform Role</span>
            <span className="text-xl font-bold text-white mt-1 capitalize font-sans">{currentUser.role === 'customer' ? 'Preferred Customer' : currentUser.role}</span>
            <span className="text-[9px] text-zinc-500 font-mono mt-1">Secure Authenticated Session</span>
          </div>
        </div>

        {/* State Banners */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-850 flex items-start gap-3 shadow-sm text-xs leading-relaxed animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="font-medium">{successMsg}</div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-150 rounded-2xl p-4 text-rose-850 flex items-start gap-3 shadow-sm text-xs leading-relaxed animate-fade-in">
            <Lock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="font-semibold">{errorMsg}</div>
          </div>
        )}

        {/* Major split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Details fields */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#0C5CAB]" />
                <span>Demographic & Account Information</span>
              </h3>
              <p className="text-slate-500 text-xs mt-1">Self-declaration fields matching your PAN/Aadhaar criteria.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Official Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your registered full name"
                    className="w-full pl-10 pr-3.5 py-3/1 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 font-bold focus:bg-white focus:outline-none text-xs transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">System Identity Email (Locked)</label>
                <div className="relative select-all">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full pl-10 pr-10 py-3/1 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold cursor-not-allowed text-xs focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Mobile Phone Line</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="10 digit contact"
                      className="w-full pl-10 pr-3.5 py-3/1 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 font-bold focus:bg-white focus:outline-none font-mono text-xs transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">PAN Permanent ID</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      className="w-full pl-10 pr-3.5 py-3/1 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 font-bold focus:bg-white focus:outline-none font-mono text-xs transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-[#0C5CAB] hover:bg-[#0a4a8a] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs disabled:bg-slate-405 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4.5 h-4.5 text-white" />
                    <span>Verify and Save Profiles</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Credit Gauge Meter & Security Sessions */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Credit score dial */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase font-mono tracking-wider">CIBIL Risk Registry</h4>
                <button
                  onClick={handleRefreshCredit}
                  disabled={creditRefreshing}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-550 transition-colors cursor-pointer"
                  title="Query National Database"
                >
                  <RefreshCw className={`w-4 h-4 text-[#0C5CAB] ${creditRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="flex flex-col items-center py-2 text-center space-y-3">
                
                {/* Simulated circular/gauge dial using CSS and SVG */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-95">
                    {/* Background track circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="50"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray="250 314"
                      strokeLinecap="round"
                    />
                    {/* Score value color gauge filling */}
                    <circle
                      cx="64"
                      cy="64"
                      r="50"
                      stroke={simulatedScore >= 750 ? '#10b981' : simulatedScore >= 650 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={`${((simulatedScore - 300) / 600) * 250} 314`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  
                  {/* Absolute Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-black">Score</span>
                    <span className="text-2xl font-black text-slate-850 font-mono tracking-tight">{simulatedScore}</span>
                    <span className="text-[10px] font-mono text-slate-400">/ 900</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">
                    Your Rating Status is:{' '}
                    <span className={`font-black ${rating.color}`}>{rating.label}</span>
                  </p>
                  <p className="text-[10.5px] text-slate-500 max-w-xs leading-normal">
                    Lenders query this index to approve risk files. Scores above 750 secure lower interest rates with our bank.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4.5 space-y-3.5 border border-slate-200/50">
                <div className="flex items-center justify-between text-[11px] font-medium border-b border-dashed border-slate-200 pb-2">
                  <span className="text-slate-500">Repayments Reliability:</span>
                  <span className="text-slate-850 font-bold font-mono">99.2% Timely</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium border-b border-dashed border-slate-200 pb-2">
                  <span className="text-slate-500">Utilization Index:</span>
                  <span className="text-slate-850 font-bold font-mono">14% Low</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-500">Active Debts-to-Income:</span>
                  <span className="text-emerald-600 font-bold font-mono">Excellent Ratio</span>
                </div>
              </div>
            </div>

            {/* Login activity block representing real security authentication parameters */}
            <div className="bg-[#121214] rounded-3xl p-6 text-white border border-zinc-800 shadow-md space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#0C5CAB]" />
                  <span>Interactive Security Logs</span>
                </h4>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <ul className="space-y-3.5 font-mono text-[10.5px] text-zinc-400">
                <li className="flex justify-between items-start gap-2 border-b border-zinc-900 pb-2">
                  <span>Current Host:</span>
                  <span className="text-white font-bold">ais-dev-preview-env</span>
                </li>
                <li className="flex justify-between items-start gap-2 border-b border-zinc-900 pb-2">
                  <span>Authorized Auth:</span>
                  <span className="text-emerald-400 font-bold">OAuth-Verified</span>
                </li>
                <li className="flex justify-between items-start gap-2 border-b border-zinc-900 pb-2">
                  <span>User ID:</span>
                  <span className="text-zinc-500 text-right select-all max-w-[130px] truncate" title={currentUser.id}>
                    {currentUser.id}
                  </span>
                </li>
                <li className="flex justify-between items-start gap-2">
                  <span>Security Audit IP:</span>
                  <span className="text-white">10.244.12.83 (Cloud Run)</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
