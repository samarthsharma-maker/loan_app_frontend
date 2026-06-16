/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, SlidersHorizontal, Calculator, CheckCircle2, FileText, ArrowRight, X } from 'lucide-react';
import { LoanProduct, LoanType } from '../types';

interface ProductsCatalogViewProps {
  products: LoanProduct[];
  selectedCategory: LoanType | null;
  onClearCategory: () => void;
  onChangeTab: (tab: string) => void;
  onOpenApply: (productId: string) => void;
  isLoggedIn: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export default function ProductsCatalogView({
  products,
  selectedCategory,
  onClearCategory,
  onChangeTab,
  onOpenApply,
  isLoggedIn,
  onOpenAuth,
}: ProductsCatalogViewProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>(selectedCategory || 'all');
  const [maxRate, setMaxRate] = useState<number>(15);
  const [selectedProductDetails, setSelectedProductDetails] = useState<LoanProduct | null>(null);

  // Synchronize category selection from quick links on HomeView
  React.useEffect(() => {
    if (selectedCategory) {
      setFilterType(selectedCategory);
    }
  }, [selectedCategory]);

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(search.toLowerCase()) || 
                          prod.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || prod.type === filterType;
    const matchesRate = prod.interestRate <= maxRate;
    return matchesSearch && matchesType && matchesRate;
  });

  const getLabelForType = (type: LoanType) => {
    switch (type) {
      case 'personal': return 'Personal Loan';
      case 'home': return 'Home Loan';
      case 'business': return 'Business Loan';
      case 'vehicle': return 'Auto / Vehicle Loan';
      case 'gold': return 'Gold Loan';
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Crore`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-[#09090b] min-h-screen py-12 px-4 md:px-6 text-[#fafafa]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#fafafa] tracking-tight">Active Loan Catalog</h1>
            <p className="text-zinc-400 text-sm mt-1">Explore custom product terms, interest parameters, and document requirements.</p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => {
                onClearCategory();
                setFilterType('all');
              }}
              className="px-3.5 py-1.5 bg-[#0C5CAB]/10 text-blue-400 border border-[#0C5CAB]/30 hover:bg-[#0C5CAB]/25 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Showing category: {getLabelForType(selectedCategory)}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Catalog Search & Controls Card */}
        <div className="bg-[#121214] p-5 rounded-2xl border border-zinc-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Search text */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search loans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#0C5CAB] transition-all text-white"
            />
          </div>

          {/* Filter Type Dropdown */}
          <div className="md:col-span-3">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                if (e.target.value === 'all') onClearCategory();
              }}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0C5CAB] transition-all text-white cursor-pointer"
            >
              <option value="all">All Loan Categories</option>
              <option value="personal">Personal Loans</option>
              <option value="home">Home Loans</option>
              <option value="business">Business Loans</option>
              <option value="vehicle">Vehicle Loans</option>
              <option value="gold">Gold Loans</option>
            </select>
          </div>

          {/* Sliders for Interest Rates */}
          <div className="md:col-span-5 flex items-center gap-4">
            <SlidersHorizontal className="w-4 h-4 text-zinc-500 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
                <span>Max Interest Rate:</span>
                <span className="font-mono text-emerald-400 uppercase font-bold">{maxRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="7"
                max="16"
                step="0.1"
                value={maxRate}
                onChange={(e) => setMaxRate(parseFloat(e.target.value))}
                className="w-full accent-[#0C5CAB] cursor-pointer"
              />
            </div>
            <button
              onClick={() => {
                setSearch('');
                setFilterType('all');
                setMaxRate(15);
                onClearCategory();
              }}
              className="text-[11px] font-bold text-zinc-400 hover:text-white cursor-pointer py-1"
            >
              Reset
            </button>
          </div>

        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#121214] rounded-2xl p-16 text-center border border-zinc-805 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#fafafa] text-base">No products matches</h3>
            <p className="text-zinc-500 text-xs">
              Try adjusting your query term or expanding the maximum interest p.a. threshold slider.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#121214] border border-zinc-800 rounded-2xl shadow-xl hover:border-zinc-700 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                        {getLabelForType(prod.type)}
                      </span>
                      <h3 className="font-extrabold text-[#fafafa] mt-2.5 text-base leading-tight group-hover:text-blue-400 transition-colors">
                        {prod.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                    {prod.description}
                  </p>

                  <div className="bg-zinc-900 p-4 rounded-xl grid grid-cols-3 gap-3 border border-zinc-800/80 text-center font-sans">
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono font-bold text-zinc-405">Interest</p>
                      <p className="text-sm font-black text-emerald-400 mt-0.5 font-mono">{prod.interestRate}%</p>
                      <p className="text-[9px] text-zinc-550 font-mono text-zinc-500">p.a.</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono font-bold text-zinc-405">Processing</p>
                      <p className="text-sm font-black text-zinc-300 mt-0.5 font-mono">{prod.processingFee}%</p>
                      <p className="text-[9px] text-zinc-550 font-mono text-zinc-500">fee</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase font-mono font-bold text-zinc-405">Max Cap</p>
                      <p className="text-sm font-black text-[#0C5CAB] mt-0.5 font-mono">{formatCurrency(prod.maxAmount)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 border-t border-zinc-850 p-4 flex gap-2">
                  <button
                    onClick={() => setSelectedProductDetails(prod)}
                    className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-350 hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => {
                      if (isLoggedIn) {
                        onOpenApply(prod.id);
                      } else {
                        onOpenAuth('login');
                      }
                    }}
                    className="flex-1 py-2.5 bg-[#0C5CAB] hover:bg-[#0a4a8a] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Details Dialog Modal */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#121214] rounded-2xl shadow-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col border border-zinc-800 animate-scale-up text-[#fafafa]">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex justify-between items-start bg-zinc-950">
              <div>
                <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-bold">
                  {getLabelForType(selectedProductDetails.type)}
                </span>
                <h3 className="font-extrabold text-[#fafafa] mt-2.5 text-lg">{selectedProductDetails.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contents scroll area */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs max-h-[60vh]">
              <div>
                <h4 className="font-bold text-zinc-400 uppercase tracking-wider mb-2 font-mono text-[10px]">Product Overview</h4>
                <p className="text-zinc-300 leading-relaxed text-xs">{selectedProductDetails.description}</p>
              </div>

              {/* Grid attributes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-855">
                  <p className="text-zinc-500 font-mono font-bold text-[9px] uppercase">Amount Bracket Available</p>
                  <p className="font-bold text-emerald-400 mt-1 font-mono text-xs">
                    {formatCurrency(selectedProductDetails.minAmount)} - {formatCurrency(selectedProductDetails.maxAmount)}
                  </p>
                </div>
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-855">
                  <p className="text-zinc-500 font-mono font-bold text-[9px] uppercase">Default Tenure Limit</p>
                  <p className="font-bold text-zinc-300 mt-1 font-mono text-xs">
                    {selectedProductDetails.tenure} Months ({Math.round(selectedProductDetails.tenure / 12)} Years)
                  </p>
                </div>
              </div>

              {/* Eligibility guidelines */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-zinc-200 uppercase tracking-wider font-mono text-[10px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Applicant Eligibility Policies</span>
                </h4>
                <ul className="space-y-2 text-xs text-zinc-400 pl-2">
                  {selectedProductDetails.eligibilityCriteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                      <span>{c}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>Clean national credit registry record from CIBIL database.</span>
                  </li>
                </ul>
              </div>

              {/* Documents Required */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-zinc-200 uppercase tracking-wider font-mono text-[10px] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Mandatory Supporting Documents</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400 leading-relaxed pl-2">
                  {selectedProductDetails.documentsRequired.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px]">
                      <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0 font-sans text-xs"></span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-3">
              <button
                onClick={() => {
                  setSelectedProductDetails(null);
                  onChangeTab('calculator');
                }}
                className="flex-1 py-3 border border-zinc-805 bg-zinc-900 text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-zinc-400" />
                <span>Test EMI Calculator</span>
              </button>
              <button
                onClick={() => {
                  const id = selectedProductDetails.id;
                  setSelectedProductDetails(null);
                  if (isLoggedIn) {
                    onOpenApply(id);
                  } else {
                    onOpenAuth('login');
                  }
                }}
                className="flex-1 py-3 bg-[#0C5CAB] hover:bg-[#0a4a8a] text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Apply Instantly</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
