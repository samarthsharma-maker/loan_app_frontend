/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  TrendingUp, 
  Filter, 
  Search, 
  FileCheck2, 
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { LoanApplication, LoanProduct, LoanDocument, LoanComment, ApplicationStatus } from '../types';

interface OfficerPortalViewProps {
  applications: LoanApplication[];
  products: LoanProduct[];
  documents: LoanDocument[];
  comments: LoanComment[];
  onUpdateStatus: (appId: string, status: ApplicationStatus, comment?: string) => void;
  onUpdateDocStatus: (docId: string, status: 'verified' | 'rejected') => void;
  onAddComment: (appId: string, text: string) => void;
}

export default function OfficerPortalView({
  applications,
  products,
  documents,
  comments,
  onUpdateStatus,
  onUpdateDocStatus,
  onAddComment,
}: OfficerPortalViewProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');

  const [officerNote, setOfficerNote] = useState('');

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          app.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDtiRatio = (app: LoanApplication) => {
    return Math.round((app.existingEmi / (app.salary || 1)) * 100);
  };

  const getFraudAssessment = (app: LoanApplication) => {
    if (getDtiRatio(app) >= 50) {
      return { label: 'High DTI exposure alert', color: 'text-amber-600 bg-amber-50 border border-amber-200' };
    }
    if (app.salary < 20000) {
      return { label: 'Sub-income limit check required', color: 'text-rose-600 bg-rose-50 border border-rose-150' };
    }
    return { label: 'Passed preliminary risk controls', color: 'text-emerald-705 bg-emerald-50/50 border border-emerald-100' };
  };

  const mapStatusLabel = (status: string) => {
    return status.toUpperCase().replace('_', ' ');
  };

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerNote.trim() || !activeApp) return;
    onAddComment(activeApp.id, officerNote);
    setOfficerNote('');
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-[#09090b] min-h-screen py-12 px-4 md:px-6 text-[#fafafa] font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title block */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#fafafa] tracking-tight">Applications Under Review</h1>
          <p className="text-zinc-400 text-sm mt-1">Loan verification workspace: audit incoming files, trigger credit checks, verify KYC proofs, and update statuses.</p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Block: Search and Active applications list */}
          <div className="lg:col-span-4 bg-[#121214] p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-5">
            
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Query Name or Case ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0C5CAB] text-white"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <Filter className="w-4 h-4 text-zinc-500 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-semibold text-white focus:outline-none cursor-pointer"
                >
                  <option value="all">Check Status: All</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="document_verification">Document Verification</option>
                  <option value="credit_check">Credit Check</option>
                  <option value="approved">Approved</option>
                  <option value="disbursed">Disbursed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* List */}
            {filteredApps.length === 0 ? (
              <p className="text-zinc-500 text-xs py-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl">No applications match query filters.</p>
            ) : (
              <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {filteredApps.map(app => {
                  const prod = products.find(p => p.id === app.productId);
                  const isSel = activeApp?.id === app.id;

                  return (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`w-full text-left p-3 rounded-xl border flex flex-col gap-1.5 transition-colors cursor-pointer ${
                        isSel 
                          ? 'border-[#0C5CAB] bg-[#0C5CAB]/10 text-white font-bold' 
                          : 'border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[9px] font-mono uppercase bg-zinc-905 bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                          {app.id}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{formatCurrency(app.amount)}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[12.5px] text-[#fafafa]">{app.fullName}</h4>
                        <p className="text-[10.5px] text-zinc-450 truncate text-zinc-400">{prod?.name || 'Retail Loan'}</p>
                      </div>
                      <div className="flex justify-between items-center w-full pt-1.5 border-t border-zinc-800 mt-1">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {app.createdAt.replace('T', ' ').slice(0, 10)}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-350 px-1.5 py-0.5 rounded font-bold max-w-[130px] truncate">
                          {mapStatusLabel(app.status)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right Block: Active Application Audit Workspace */}
          {activeApp ? (
            <div className="lg:col-span-8 space-y-6 bg-[#121214] p-6 rounded-2xl border border-zinc-800 shadow-xl text-white">
              
              {/* Profile card title block */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <p className="text-[10px] font-mono uppercase text-zinc-500">Verifying Case File: {activeApp.id}</p>
                  <h2 className="text-xl font-bold text-[#fafafa] mt-1">{activeApp.fullName}</h2>
                  <p className="text-zinc-400 text-xs mt-0.5">{products.find(p => p.id === activeApp.productId)?.name}</p>
                </div>

                {/* Main status transitional controls */}
                <div className="flex flex-wrap gap-2">
                  {activeApp.status === 'submitted' && (
                    <button
                      onClick={() => onUpdateStatus(activeApp.id, 'under_review', 'Assigned case review file.')}
                      className="px-3.5 py-1.5 bg-[#0C5CAB] hover:bg-[#0a4a8a] text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer"
                    >
                      Assign Under Review
                    </button>
                  )}
                  {activeApp.status === 'under_review' && (
                    <button
                      onClick={() => onUpdateStatus(activeApp.id, 'document_verification', 'Transitioned to physical document verification.')}
                      className="px-3.5 py-1.5 bg-amber-653 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer"
                    >
                      Initiate Doc Audits
                    </button>
                  )}
                  {activeApp.status === 'document_verification' && (
                    <button
                      onClick={() => onUpdateStatus(activeApp.id, 'credit_check', 'Initiated standard credit score assess.')}
                      className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-750 text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer"
                    >
                      Trigger Credit Rating
                    </button>
                  )}
                  {activeApp.status === 'credit_check' && (
                    <button
                      onClick={() => onUpdateStatus(activeApp.id, 'approved', 'Applicant passed database requirements. Approved.')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer"
                    >
                      Approve File
                    </button>
                  )}
                  {activeApp.status === 'approved' && (
                    <button
                      onClick={() => onUpdateStatus(activeApp.id, 'disbursed', 'Sanctioned funds transferred online to customer account checks.')}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer"
                    >
                      Disburse Capital
                    </button>
                  )}

                  {/* Reject option is eligible anytime prior to disbursal */}
                  {activeApp.status !== 'disbursed' && activeApp.status !== 'rejected' && (
                    <button
                      onClick={() => {
                        const reason = prompt('Please specify decline reason parameter:');
                        if (reason) onUpdateStatus(activeApp.id, 'rejected', `Decline decision filed logic: ${reason}`);
                      }}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg shadow-sm cursor-pointer"
                    >
                      Decline Application
                    </button>
                  )}
                </div>
              </div>

              {/* Grid 2-column: Applicant details & Risk profile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Applicant Profile fields */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-500 font-mono">Financial Registry Profile</h3>
                  <div className="space-y-2 text-xs text-zinc-350 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                    <p className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-550 text-zinc-500">Aadhaar (National Registry):</span>
                      <strong className="text-zinc-200 font-mono">{activeApp.aadhaar}</strong>
                    </p>
                    <p className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-550 text-zinc-500">PAN ID Number:</span>
                      <strong className="text-zinc-200 font-mono">{activeApp.pan}</strong>
                    </p>
                    <p className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-550 text-zinc-500">Monthly Net Salary:</span>
                      <strong className="text-zinc-200 font-mono font-bold text-emerald-400">{formatCurrency(activeApp.salary)}</strong>
                    </p>
                    <p className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-550 text-zinc-500">Active Work vintage:</span>
                      <strong className="text-zinc-200 font-mono">{activeApp.experience} Years</strong>
                    </p>
                    <p className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500">Employment Sector:</span>
                      <strong className="text-zinc-200 capitalize font-bold">{activeApp.employmentType}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-500">Recipient Bank Account:</span>
                      <strong className="text-zinc-300 truncate max-w-[150px] font-mono">{activeApp.bankAccount}</strong>
                    </p>
                  </div>
                </div>

                {/* Risk audit metrics */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-550 text-zinc-500 font-mono">Risk Assessment audits</h3>
                  <div className="space-y-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800 text-xs text-zinc-300">
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-zinc-500">Debt-To-Income (DTI) Outflow:</span>
                        <strong className={`font-mono font-bold ${getDtiRatio(activeApp) > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {getDtiRatio(activeApp)}%
                        </strong>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getDtiRatio(activeApp) > 40 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, getDtiRatio(activeApp))}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline border-t border-zinc-800/60 pt-2">
                      <span className="text-zinc-500">CIBIL Credit Score Rating:</span>
                      <strong className="font-mono text-emerald-400 font-black text-sm">{activeApp.creditScore}</strong>
                    </div>

                    <div className={`p-3 rounded-xl text-[10.5px] font-semibold flex items-start gap-2 ${
                      getDtiRatio(activeApp) >= 50
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                        : activeApp.salary < 20000
                        ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                        : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    }`}>
                      <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Fraud Alert Verdict</strong>
                        <p className="mt-0.5 text-zinc-400">{getFraudAssessment(activeApp).label}</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Applicant document vetting panel */}
              <div className="space-y-4 border-t border-zinc-800 pt-5">
                <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1.5">
                  <FileCheck2 className="w-4.5 h-4.5 text-blue-400" />
                  <span>Applicant KYC Attachment Verification Desk</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {documents.filter(d => d.applicationId === activeApp.id).map(doc => (
                    <div key={doc.id} className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800/80 flex flex-col justify-between gap-3 text-xs">
                      <div className="flex justify-between items-start w-full">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold">{doc.documentType} Doc id</span>
                          <h4 className="font-extrabold text-[12.5px] text-zinc-200 truncate max-w-[150px]">{doc.fileName}</h4>
                        </div>
                        <span className={`text-[8.5px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border ${
                          doc.status === 'verified' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {doc.status}
                        </span>
                      </div>

                      {/* File URL preview trigger */}
                      <div className="w-full h-24 rounded-lg bg-zinc-950 border border-zinc-805 overflow-hidden relative">
                        <img 
                          src={doc.fileUrl} 
                          alt="ID file check" 
                          className="w-full h-full object-cover brightness-75 hover:brightness-95 transition-all" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-center text-[9px] text-zinc-400 font-mono">
                          KYC Proof Reference
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onUpdateDocStatus(doc.id, 'verified')}
                          className="flex-1 py-1.5 bg-[#0C5CAB]/10 hover:bg-[#0C5CAB]/20 border border-[#0C5CAB]/30 text-blue-405 font-bold font-sans text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-450" />
                          <span>Verify True</span>
                        </button>
                        <button
                          onClick={() => onUpdateDocStatus(doc.id, 'rejected')}
                          className="flex-1 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold font-sans text-[10px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline Doc</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Log thread */}
              <div className="space-y-4 border-t border-zinc-800 pt-5">
                <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1.5">
                  <MessageCircle className="w-4.5 h-4.5 text-blue-400" />
                  <span>Auditor Discussion History</span>
                </h3>

                <div className="space-y-3.5 max-h-[160px] overflow-y-auto text-xs pr-1">
                  {comments.filter(c => c.applicationId === activeApp.id).length === 0 ? (
                    <p className="text-zinc-500 p-3 bg-zinc-900 border border-zinc-805 rounded-xl text-center">No discussion logged.</p>
                  ) : (
                    comments.filter(c => c.applicationId === activeApp.id).map(comment => (
                      <div key={comment.id} className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <strong className="text-zinc-200 font-bold">{comment.authorName} ({comment.authorRole.toUpperCase()})</strong>
                          <span className="font-mono text-zinc-500">{comment.createdAt.replace('T', ' ').slice(0, 16)}</span>
                        </div>
                        <p className="text-zinc-450 font-medium leading-relaxed text-zinc-300">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handlePostNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Log audit verification details or request information..."
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0C5CAB] hover:bg-[#0a4a8a] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                  >
                    Log comment
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="lg:col-span-8 bg-[#121214] border border-zinc-800 rounded-2xl p-24 text-center space-y-4 shadow-xl">
              <Clock className="w-12 h-12 text-zinc-500 mx-auto" />
              <h3 className="font-extrabold text-white text-lg">Select application from Queue</h3>
              <p className="text-zinc-500 text-xs max-w-xs mx-auto">Click on any customer file in the queue on the left to activate auditing controls.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
