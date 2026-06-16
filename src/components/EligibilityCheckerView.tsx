/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, ShieldAlert, Award, ArrowRight, TrendingUp, HelpCircle } from 'lucide-react';
import { LoanProduct, LoanType } from '../types';

interface EligibilityCheckerViewProps {
  products: LoanProduct[];
  onOpenApply: (productId: string) => void;
  isLoggedIn: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export default function EligibilityCheckerView({
  products,
  onOpenApply,
  isLoggedIn,
  onOpenAuth,
}: EligibilityCheckerViewProps) {
  const [salary, setSalary] = useState<number>(0);
  const [existingEmi, setExistingEmi] = useState<number>(0);
  const [employmentType, setEmploymentType] = useState<'salaried' | 'self_employed'>('salaried');
  const [age, setAge] = useState<number>(0);
  const [desiredTenure, setDesiredTenure] = useState<number>(120); // 10 Years default

  const [hasChecked, setHasChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Computed results state
  const [results, setResults] = useState<{
    eligibleAmount: number;
    debtToIncomeRatio: number;
    score: number;
    recommendedProductIds: string[];
  } | null>(null);

  const handleCheck = () => {
    setLoading(true);
    setTimeout(() => {
      // Debt to Income calculation
      const dtiRatio = (existingEmi / (salary || 1)) * 105; // in %
      
      // Basic credit estimation score (300 to 900)
      let baseScore = 600;
      if (salary >= 100000) baseScore += 100;
      else if (salary >= 50000) baseScore += 50;

      if (dtiRatio <= 15) baseScore += 150;
      else if (dtiRatio <= 30) baseScore += 80;
      else if (dtiRatio >= 55) baseScore -= 120;

      if (employmentType === 'salaried') baseScore += 40;
      if (age >= 21 && age <= 50) baseScore += 30;

      const finalScore = Math.min(900, Math.max(300, baseScore));

      // Eligible Monthly EMI capacity (standard 50% limit)
      const maxAllowedEmiPercent = employmentType === 'salaried' ? 0.50 : 0.45;
      const totalAllowedEmi = salary * maxAllowedEmiPercent;
      const eligibleEmiCapacity = Math.max(0, totalAllowedEmi - existingEmi);

      // standard estimation interest rate (9% or 0.0075 monthly)
      const r = 9.0 / 12 / 100;
      const n = desiredTenure;
      let eligibleAmount = 0;
      
      if (eligibleEmiCapacity > 0 && r > 0) {
        eligibleAmount = eligibleEmiCapacity * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
      }

      // Filter compatible product recommendations
      const recommendations = products.filter(p => {
        // match type based on parameters or typical constraints
        if (p.minAmount > eligibleAmount) return false;
        if (p.type === 'business' && employmentType === 'salaried') return false;
        return true;
      }).map(p => p.id).slice(0, 3); // top 3 recommendations

      setResults({
        eligibleAmount: Math.round(eligibleAmount / 1000) * 1000, // round to nearest thousand
        debtToIncomeRatio: Math.round(dtiRatio),
        score: finalScore,
        recommendedProductIds: recommendations,
      });
      setHasChecked(true);
      setLoading(false);
    }, 750);
  };

  const getScoreBand = (score: number) => {
    if (score >= 800) return { label: 'Excellent', color: 'bg-emerald-500 text-emerald-950 text-emerald-50 md:bg-emerald-200' };
    if (score >= 720) return { label: 'Excellent Credit', color: 'bg-emerald-400 text-emerald-950 font-medium' };
    if (score >= 650) return { label: 'Moderate Risk', color: 'bg-amber-400 text-amber-955' };
    return { label: 'High Alert Risk', color: 'bg-rose-500 text-rose-50' };
  };

  const getDtiAnalysisBadge = (ratio: number) => {
    if (ratio <= 15) return { label: 'Extremely Low Debt', color: 'text-emerald-600' };
    if (ratio <= 40) return { label: 'Standard Debt Load', color: 'text-amber-500' };
    return { label: 'Leveraged Debt Position', color: 'text-rose-600 font-bold' };
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner header */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Eligibility Limit Checker</h1>
          <p className="text-slate-500 text-sm mt-1">Get an instant pre-approved loan limit estimation and review risk criteria analysis.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Form Fields */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">Enter Income Details</h3>

            {/* In hand salary */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <label className="font-semibold text-slate-700">Monthly Net In-Hand Salary</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Math.max(1000, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-205 rounded-xl font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/10 text-slate-800"
                />
              </div>
            </div>

            {/* Existing EMIs */}
            <div className="space-y-1.5 text-xs text-slate-605">
              <label className="font-semibold text-slate-700">Existing Loan EMIs (If any)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={existingEmi}
                  onChange={(e) => setExistingEmi(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-205 rounded-xl font-bold font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/10 text-slate-800"
                />
              </div>
            </div>

            {/* Employment Type dropdown */}
            <div className="space-y-1.5 text-xs text-slate-605">
              <label className="font-semibold text-slate-700">Primary Employment Sector</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/10 text-slate-850"
              >
                <option value="salaried">Corporate Salaried Professional</option>
                <option value="self_employed">Private Self-Employed Practitioner / Business Owner</option>
              </select>
            </div>

            {/* Grid for age & tenure */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-xs text-slate-605">
                <label className="font-semibold text-slate-700">Applicant Age (Years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Math.max(18, parseInt(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl font-bold font-mono text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5 text-xs text-slate-605">
                <label className="font-semibold text-slate-700">Tenure Requested</label>
                <select
                  value={desiredTenure}
                  onChange={(e) => setDesiredTenure(parseInt(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-205 rounded-xl font-semibold text-slate-850 focus:bg-white focus:outline-none"
                >
                  <option value={12}>1 Year term</option>
                  <option value={24}>2 Years term</option>
                  <option value={36}>3 Years term</option>
                  <option value={60}>5 Years term</option>
                  <option value={120}>10 Years term</option>
                  <option value={240}>20 Years term</option>
                  <option value={360}>30 Years term</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-900/40 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>Algorithmic validation ongoing...</span>
              ) : (
                <>
                  <span>Evaluate Pre-Approved Limits</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Outputs Panel */}
          <div className="lg:col-span-7">
            {hasChecked && results ? (
              <div className="space-y-6">
                
                {/* Proposed Limit Banner */}
                <div className="bg-gradient-to-r from-blue-950 to-indigo-905 text-white p-6 rounded-2xl shadow-md border border-slate-805 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-slate-350 font-bold">Estimated Maximum Approved Limit</p>
                      <h2 className="text-3xl md:text-4xl font-black text-amber-400 mt-1 font-mono tracking-tight">
                        {results.eligibleAmount === 0 ? 'Ineligible (₹0)' : formatCurrency(results.eligibleAmount)}
                      </h2>
                    </div>
                    {results.eligibleAmount > 0 && (
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-350 border border-emerald-400/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold">
                        Pre-Approved status
                      </span>
                    )}
                  </div>

                  <p className="text-slate-305 text-xs leading-relaxed">
                    Based on a monthly net pool verification of <strong>{formatCurrency(salary)}</strong> and active existing monthly loans outflow of <strong>{formatCurrency(existingEmi)}</strong>.
                  </p>
                </div>

                {/* Score & DTI metrics row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Score gauge wrapper */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">Simulated CIBIL Credit Rating</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-850 font-mono">{results.score}</span>
                      <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${getScoreBand(results.score).color}`}>
                        {getScoreBand(results.score).label}
                      </span>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 ${
                          results.score >= 750 ? 'bg-emerald-500' : results.score >= 650 ? 'bg-amber-400' : 'bg-red-500'
                        }`}
                        style={{ width: `${((results.score - 300) / 600) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Applicants with scores above 750 receive automatic interest deduction coupons up to <strong>0.25%</strong>.
                    </p>
                  </div>

                  {/* DTI panel */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">Debt-To-Income (DTI) Outflow</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-850 font-mono">{results.debtToIncomeRatio}%</span>
                      <span className={`text-[10px] font-mono ${getDtiAnalysisBadge(results.debtToIncomeRatio).color}`}>
                        {getDtiAnalysisBadge(results.debtToIncomeRatio).label}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 ${
                          results.debtToIncomeRatio <= 30 ? 'bg-emerald-500' : results.debtToIncomeRatio <= 50 ? 'bg-amber-400' : 'bg-red-550'
                        }`}
                        style={{ width: `${Math.min(100, results.debtToIncomeRatio)}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Lenders typically require total EMI exposures to fall strictly below <strong>50%</strong> of monthly salary levels.
                    </p>
                  </div>

                </div>

                {/* Recommendations catalog column */}
                {results.eligibleAmount > 0 ? (
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h4 className="font-bold text-xs text-slate-900 border-b border-whitespace pb-3">
                      Recommended Products for Your Portfolio
                    </h4>
                    <div className="space-y-3.5">
                      {products.filter(p => results.recommendedProductIds.includes(p.id)).map(prod => (
                        <div 
                          key={prod.id}
                          className="flex justify-between items-center bg-slate-50 hover:bg-slate-100/60 p-3.5 rounded-xl border border-slate-100 transition-colors"
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-[rgb(28,63,148)] font-bold">
                              {prod.type} Solutions
                            </span>
                            <h5 className="font-bold text-slate-905 text-xs">{prod.name}</h5>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Interest {prod.interestRate}% p.a. | Max Tenure {prod.tenure} Months
                            </p>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (isLoggedIn) {
                                onOpenApply(prod.id);
                              } else {
                                onOpenAuth('login');
                              }
                            }}
                            className="px-3.5 py-1.5 bg-white hover:bg-blue-900 border border-blue-900/10 text-blue-900 hover:text-white transition-colors text-[10px] font-bold rounded-lg shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <span>Select Product</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 text-rose-900 text-xs flex gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-550 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Low Available Capacity Warning</strong>
                      <p className="mt-1 leading-relaxed text-slate-600 font-medium">
                        Your combined EMIs of {formatCurrency(existingEmi)} consume too much of your net income ({formatCurrency(salary)}). Try lowering existing debt indices or choosing longer-period terms to qualify for custom collateral loan lines.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center space-y-4 shadow-sm max-w-md mx-auto">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 text-base">Awaiting Evaluation</h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Provide your salary profile parameters on the left and submit to verify live credit pre-approvals on the spot.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
