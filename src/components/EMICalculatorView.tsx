/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Calculator, Award, Info, FileText } from 'lucide-react';
import { calculateEmi, calculateLoanTotals } from '../lib/loanMath';

export default function EMICalculatorView() {
  const [loanAmount, setLoanAmount] = useState<number>(1000000); // 10 Lakh default
  const [rate, setRate] = useState<number>(8.4); // 8.4% default
  const [tenure, setTenure] = useState<number>(120); // 10 Years default (120 months)

  // Presets
  const setPresetTenure = (years: number) => {
    setTenure(years * 12);
  };

  // Calculations
  const calculations = useMemo(() => {
    const P = loanAmount;
    const monthlyRate = rate / 12 / 100;
    const n = tenure;

    // Core EMI / totals come from the shared, unit-tested helper.
    const emi = calculateEmi(P, rate, n);
    const totals = calculateLoanTotals(P, rate, n);

    // Amortization schedule by Year
    const schedule: {
      yearNum: number;
      startingBalance: number;
      emiPaid: number;
      interestPart: number;
      principalPart: number;
      endingBalance: number;
    }[] = [];

    let balance = P;
    for (let yr = 1; yr <= Math.ceil(n / 12); yr++) {
      let yrInterest = 0;
      let yrPrincipal = 0;
      let monthsThisYr = Math.min(12, n - (yr - 1) * 12);
      const startingBal = balance;

      for (let m = 0; m < monthsThisYr; m++) {
        const interest = balance * monthlyRate;
        const principal = emi - interest;
        yrInterest += interest;
        yrPrincipal += principal;
        balance -= principal;
      }

      schedule.push({
        yearNum: yr,
        startingBalance: startingBal,
        emiPaid: emi * monthsThisYr,
        interestPart: yrInterest,
        principalPart: yrPrincipal,
        endingBalance: Math.max(0, balance),
      });
    }

    return {
      emi: totals.emi,
      totalPayment: totals.totalPayment,
      totalInterest: totals.totalInterest,
      schedule,
    };
  }, [loanAmount, rate, tenure]);

  const chartData = [
    { name: 'Principal Loan Amount', value: loanAmount, color: '#1c3f94' },
    { name: 'Total Interest Payable', value: calculations.totalInterest, color: '#ef4444' },
  ];

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Interactive EMI Calculator</h1>
          <p className="text-slate-500 text-sm mt-1">Simulate loan repayment schedules, interest distributions, and total balance payouts.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Section */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calculator className="w-5 h-5 text-blue-900 animate-pulse" />
              <span>Configure Loan Details</span>
            </h3>

            {/* Input 1: Loan Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-650">Loan Amount (P)</label>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                  <span className="text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Math.max(10000, Math.min(100000000, parseInt(e.target.value) || 0)))}
                    className="w-24 bg-transparent outline-none font-bold text-right text-slate-800 font-mono"
                  />
                </div>
              </div>
              <input
                type="range"
                min="50000"
                max="20000000"
                step="25000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>₹50,000</span>
                <span>₹2.0 Crore</span>
              </div>
            </div>

            {/* Input 2: Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-650">Interest Rate (R)</label>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                  <input
                    type="number"
                    step="0.05"
                    value={rate}
                    onChange={(e) => setRate(Math.max(0.1, Math.min(30, parseFloat(e.target.value) || 0)))}
                    className="w-14 bg-transparent outline-none font-bold text-right text-slate-800 font-mono"
                  />
                  <span className="text-slate-400 font-bold">%</span>
                </div>
              </div>
              <div className="px-1 py-1">
                <input
                  type="range"
                  min="5"
                  max="18"
                  step="0.05"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full accent-blue-900 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5.0%</span>
                <span>18.0% p.a.</span>
              </div>
            </div>

            {/* Input 3: Tenure Months */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-650">Loan Tenure Term</label>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Math.max(3, Math.min(360, parseInt(e.target.value) || 0)))}
                    className="w-12 bg-transparent outline-none font-bold text-right text-slate-800 font-mono"
                  />
                  <span className="text-slate-400 font-xs">Mo</span>
                </div>
              </div>
              <input
                type="range"
                min="6"
                max="360"
                step="6"
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
                className="w-full accent-blue-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>6 Months</span>
                <span>360 Months (30 Yrs)</span>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setPresetTenure(1)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    tenure === 12 ? 'bg-blue-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  1 Year Preset
                </button>
                <button
                  onClick={() => setPresetTenure(3)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    tenure === 36 ? 'bg-blue-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  3 Years Preset
                </button>
                <button
                  onClick={() => setPresetTenure(5)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    tenure === 60 ? 'bg-blue-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  5 Years Preset
                </button>
                <button
                  onClick={() => setPresetTenure(10)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    tenure === 120 ? 'bg-blue-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  10 Years
                </button>
                <button
                  onClick={() => setPresetTenure(20)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    tenure === 240 ? 'bg-blue-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  20 Years
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex gap-2 text-[10px] text-slate-500 leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Standard Formula: <code className="font-mono bg-slate-50 px-1 py-0.5 rounded text-indigo-700 font-extrabold">EMI = P * r(1+r)^n / ((1+r)^n - 1)</code> is evaluated monthly. GST on transaction fees excluded.
              </span>
            </div>
          </div>

          {/* Outputs & Graphics Section */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Numeric Outputs */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-slate-400 text-[10px] font-mono tracking-wider uppercase font-bold">Monthly EMI</p>
                <p className="text-xl font-black text-blue-900 mt-1 font-mono">{formatCurrency(calculations.emi)}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-slate-400 text-[10px] font-mono tracking-wider uppercase font-bold">Total Interest</p>
                <p className="text-xl font-black text-rose-600 mt-1 font-mono">{formatCurrency(calculations.totalInterest)}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                <p className="text-slate-400 text-[10px] font-mono tracking-wider uppercase font-bold">Total Payment</p>
                <p className="text-xl font-black text-slate-800 mt-1 font-mono">{formatCurrency(calculations.totalPayment)}</p>
              </div>
            </div>

            {/* Recharts Pie Chart representation */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-widest font-mono text-center w-full mb-4">
                Payout Breakdown Percentage
              </h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="48%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: number) => [formatCurrency(val), 'Amount']} 
                      contentStyle={{ fontFamily: 'monospace', fontSize: '11px', borderRadius: '8px' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center text-[10px] text-slate-500 font-medium">
                Interest Ratio constitutes <strong className="text-rose-500 font-mono font-bold">
                  {((calculations.totalInterest / (calculations.totalPayment || 1)) * 100).toFixed(1)}%
                </strong> of the active liability payout.
              </div>
            </div>

          </div>

        </div>

        {/* Amortization schedule Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Simulated Annual Amortization Breakdown</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100/80 text-slate-500 font-mono font-bold uppercase text-[9px]">
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4 text-right">Starting Principal</th>
                  <th className="py-3 px-4 text-right">EMI Paid (Annual)</th>
                  <th className="py-3 px-4 text-right">Interest Component</th>
                  <th className="py-3 px-4 text-right">Principal Component</th>
                  <th className="py-3 px-4 text-right">Ending Principal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-mono text-slate-700">
                {calculations.schedule.map((row) => (
                  <tr key={row.yearNum} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">Year {row.yearNum}</td>
                    <td className="py-3.5 px-4 text-right">{formatCurrency(row.startingBalance)}</td>
                    <td className="py-3.5 px-4 text-right text-indigo-705">{formatCurrency(row.emiPaid)}</td>
                    <td className="py-3.5 px-4 text-right text-rose-500 font-medium">{formatCurrency(row.interestPart)}</td>
                    <td className="py-3.5 px-4 text-right text-emerald-600">{formatCurrency(row.principalPart)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {row.endingBalance === 0 ? 'Settled (₹0)' : formatCurrency(row.endingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
