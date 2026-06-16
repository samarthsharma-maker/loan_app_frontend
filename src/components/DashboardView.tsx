/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  CheckCircle2, 
  Hourglass, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  User, 
  ShieldAlert,
  ArrowRight,
  DownloadCloud,
  MessageCircle
} from 'lucide-react';
import { LoanApplication, LoanProduct, LoanDocument, LoanComment, Payment } from '../types';

interface DashboardViewProps {
  applications: LoanApplication[];
  products: LoanProduct[];
  documents: LoanDocument[];
  comments: LoanComment[];
  payments: Payment[];
  onMakePayment: (paymentId: string) => void;
  onDownloadDocument: (docId: string, name: string) => void;
  onAddComment: (appId: string, txt: string) => void;
}

export default function DashboardView({
  applications,
  products,
  documents,
  comments,
  payments,
  onMakePayment,
  onDownloadDocument,
  onAddComment,
}: DashboardViewProps) {
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [newCommentText, setNewCommentText] = useState('');

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  // Stats derivations
  const totalApplied = applications.length;
  const pendingApps = applications.filter(a => !['approved', 'rejected', 'disbursed'].includes(a.status));
  const activeLoans = applications.filter(a => a.status === 'disbursed');
  const creditScore = activeApp?.creditScore || 780;

  // Next EMI due (from pending payments of disbursed applications)
  const outstandingPayments = payments.filter(p => p.status === 'pending');
  const nextPayment = outstandingPayments[0];

  // Chart data: simulated payment history or credit lines
  const chartData = [
    { month: 'Jan', ApprovedVolume: 0, PaidEMI: 0 },
    { month: 'Feb', ApprovedVolume: 0, PaidEMI: 0 },
    { month: 'Mar', ApprovedVolume: 350000, PaidEMI: 4500 },
    { month: 'Apr', ApprovedVolume: 350000, PaidEMI: 9000 },
    { month: 'May', ApprovedVolume: 500000, PaidEMI: 13500 },
    { month: 'Jun', ApprovedVolume: 500000, PaidEMI: 26505 },
  ];

  const getStatusMeta = (status: string) => {
    switch (status) {
      case 'submitted':
        return { label: 'Submitted', color: 'bg-blue-50 text-blue-740 border-blue-200', desc: 'Your physical loan folder is received.' };
      case 'under_review':
        return { label: 'Under Professional Review', color: 'bg-indigo-50 text-indigo-750 border-indigo-200', desc: 'Assigned to a regional loan officer.' };
      case 'document_verification':
        return { label: 'Document Auditing', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'PAN, Aadhaar and salary records being validated.' };
      case 'credit_check':
        return { label: 'Credit Registry Assessment', color: 'bg-purple-50 text-purple-700 border-purple-200', desc: 'Evaluating DTI ratios and national credit trends.' };
      case 'approved':
        return { label: 'Loan Pre-Approved', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', desc: 'Pre-approved terms generated. Standby for release.' };
      case 'rejected':
        return { label: 'Application Declined', color: 'bg-red-50 text-red-750 border-red-200', desc: 'Does not match inhand income benchmarks.' };
      case 'disbursed':
        return { label: 'Amount Disbursed', color: 'bg-teal-50 text-teal-800 border-teal-200', desc: 'Volume credited. Regular EMI schedules active.' };
      default:
        return { label: 'Unknown status', color: 'bg-slate-50 text-slate-500 border-slate-200', desc: '' };
    }
  };

  const getStepIndex = (status: string): number => {
    const order = ['submitted', 'under_review', 'document_verification', 'credit_check', 'approved', 'disbursed'];
    if (status === 'rejected') return 4;
    return order.indexOf(status);
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeApp) return;
    onAddComment(activeApp.id, newCommentText);
    setNewCommentText('');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Upper Title Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Financial Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Check loan application progress logs, deposit statements, and settle EMIs.</p>
          </div>
          <button
            onClick={() => alert('Simulated Statement Document PDF has been prepared. Check your system downloads.')}
            className="px-4 py-2.5 bg-white border border-slate-205 hover:bg-slate-100 text-slate-705 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4 text-slate-500" />
            <span>Simulate Statement PDF</span>
          </button>
        </div>

        {/* Dashboard Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">In-Memory Application Count</p>
              <h3 className="text-2xl font-black text-slate-850 font-mono">{totalApplied} Applications</h3>
              <p className="text-[10px] text-slate-500">{pendingApps.length} active pipelines under process</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-900">
              <Hourglass className="w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">Outstanding active loans</p>
              <h3 className="text-2xl font-black text-slate-850 font-mono">{activeLoans.length} Loans</h3>
              <p className="text-[10px] text-slate-500">Credited to verified bank account</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">Next Repayment Outflow</p>
              <h3 className="text-2xl font-black text-rose-600 font-mono">
                {nextPayment ? formatCurrency(nextPayment.emiAmount) : 'Settled'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {nextPayment ? `Due term: ${nextPayment.paymentDate}` : 'No upcoming payments'}
              </p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest font-bold">Active Credit Score</p>
              <h3 className="text-2xl font-black text-teal-600 font-mono">{creditScore}</h3>
              <p className="text-[10px] text-slate-500 uppercase font-mono font-bold text-teal-800">Excellent Range</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl text-teal-705">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Core Layout Split */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-205 p-16 text-center space-y-4 max-w-md mx-auto">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-extrabold text-slate-900 text-lg">No Applications Filed Yet</h3>
            <p className="text-slate-505 text-xs max-w-xs mx-auto">
              Choose a product from our active catalog and submit your first multi-step request form to begin tracking.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Applications selector & general charts */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-sm space-y-4.5">
                <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">My Applications</h3>
                
                <div className="space-y-2.5">
                  {applications.map(app => {
                    const prod = products.find(p => p.id === app.productId);
                    const meta = getStatusMeta(app.status);

                    return (
                      <button
                        key={app.id}
                        onClick={() => setSelectedAppId(app.id)}
                        className={`w-full text-left p-3.5 rounded-xl border flex justify-between items-center transition-all ${
                          selectedAppId === app.id
                            ? 'border-blue-900 bg-blue-50/40 text-blue-950 font-bold'
                            : 'border-slate-105 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="space-y-1 truncate max-w-[170px]">
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{app.id}</span>
                          <h4 className="font-extrabold text-[12.5px] truncate text-slate-900">{prod?.name || 'Retail Loan'}</h4>
                          <p className="text-[10.5px] font-mono text-slate-500">{formatCurrency(app.amount)} Term</p>
                        </div>
                        <span className={`text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded border border-transparent ${meta.color}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Graphics payment statistics chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-sm space-y-4">
                <h4 className="font-mono font-extrabold text-[9px] uppercase tracking-wider text-slate-500">Historical Payment Log index</h4>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                      <YAxis tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                      <Tooltip formatter={(val) => [`₹${val}`, 'Volume']} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      <Bar dataKey="PaidEMI" fill="#1c3f94" name="EMIs Cashpaid Settle" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Right Panel: Detailed Active Application Tracking Milestone Timeline */}
            {activeApp && (
              <div className="lg:col-span-8 space-y-6">
                
                {/* Upper Details Panel */}
                <div className="bg-white p-6 rounded-2xl border border-slate-105 shadow-sm space-y-5">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Selected application tracking ID: {activeApp.id}</span>
                      <h2 className="text-xl font-bold text-slate-900 mt-1">
                        {products.find(p => p.id === activeApp.productId)?.name || 'Retail Loan Overview'}
                      </h2>
                    </div>
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded border border-transparent ${getStatusMeta(activeApp.status).color}`}>
                      {getStatusMeta(activeApp.status).label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-mono uppercase font-bold">Funding Amount</p>
                      <p className="font-bold text-slate-850 mt-1 text-sm text-blue-900 leading-tight font-mono">{formatCurrency(activeApp.amount)}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-mono uppercase font-bold">Repay Tenure</p>
                      <p className="font-bold text-slate-850 mt-1 text-sm leading-tight font-mono">{activeApp.tenure} Months</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-mono uppercase font-bold">Active Debt Ratio</p>
                      <p className="font-bold text-slate-850 mt-1 text-sm leading-tight font-mono">
                        {Math.round((activeApp.existingEmi / (activeApp.salary || 1)) * 100)}% DTI
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-slate-400 text-[10px] font-mono uppercase font-bold">Target Salary Net</p>
                      <p className="font-bold text-emerald-800 mt-1 text-sm leading-tight font-mono">{formatCurrency(activeApp.salary)}/mo</p>
                    </div>
                  </div>

                  {/* Visual Timeline Tracking Map */}
                  <div className="space-y-5 pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 font-mono">Workflow Status Timeline</h3>
                    
                    <div className="relative pt-2">
                      {/* Grey Base horizontal grid line */}
                      <div className="absolute left-8 right-8 top-5 h-1 bg-slate-150 rounded-full"></div>
                      
                      {/* Green overlay line */}
                      <div 
                        className="absolute left-8 top-5 h-1 bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ 
                          width: `${Math.min(100, Math.max(0, (getStepIndex(activeApp.status) / 5) * 100))}%` 
                        }}
                      ></div>

                      <div className="grid grid-cols-6 text-center select-none relative z-10">
                        {([
                          { key: 'submitted', label: 'Filed' },
                          { key: 'under_review', label: 'Review' },
                          { key: 'document_verification', label: 'Verify' },
                          { key: 'credit_check', label: 'Credit' },
                          { key: 'approved', label: 'Approved' },
                          { key: 'disbursed', label: 'Disbursed' },
                        ] as const).map((timelineDot, index) => {
                          const activeStep = getStepIndex(activeApp.status);
                          const isDone = index <= activeStep && activeApp.status !== 'rejected';
                          const isDeclined = activeApp.status === 'rejected' && index === 4;

                          return (
                            <div key={timelineDot.key} className="flex flex-col items-center">
                              <div className={`w-7.5 h-7.5 rounded-full flex items-center justify-center border font-mono font-bold text-[10px] transition-all duration-300 ${
                                isDeclined 
                                  ? 'bg-rose-500 border-rose-500 text-white animate-pulse' 
                                  : isDone 
                                  ? 'bg-emerald-600 border-emerald-600 text-white' 
                                  : 'bg-white border-slate-205 text-slate-400'
                              }`}>
                                {isDeclined ? 'X' : isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-100" /> : index + 1}
                              </div>
                              <span className="text-[10px] font-bold text-slate-658 mt-1.5">{timelineDot.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Split Details: Documents list & Interactive payment simulator */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Uploaded files checklist status */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-sm space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 font-mono flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>Security Document checklist</span>
                    </h3>

                    <div className="space-y-3">
                      {documents.filter(d => d.applicationId === activeApp.id).map(doc => (
                        <div key={doc.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                          <div className="flex items-center gap-2 max-w-[180px]">
                            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                            <span className="truncate text-[11px] font-semibold text-slate-800">{doc.fileName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[8.5px] uppercase font-mono font-bold px-1.5 py-0.5 rounded ${
                              doc.status === 'verified' ? 'bg-emerald-105 text-emerald-800/80 border border-emerald-200' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {doc.status}
                            </span>
                            <button
                              onClick={() => onDownloadDocument(doc.id, doc.fileName)}
                              title="Download Simulated Document"
                              className="p-1 hover:bg-slate-200 text-slate-500 rounded transition-colors"
                            >
                              <DownloadCloud className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Payment simulator portal */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-sm space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-slate-550 font-mono flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Direct EMI Settlement Desk</span>
                    </h3>

                    {activeApp.status === 'disbursed' ? (
                      <div className="space-y-3.5 text-xs">
                        {outstandingPayments.length > 0 ? (
                          outstandingPayments.map(p => (
                            <div key={p.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex justify-between items-center">
                              <div>
                                <span className="text-[10px] text-slate-400 font-mono uppercase">Due pay date: {p.paymentDate}</span>
                                <h4 className="font-bold text-slate-905 mt-0.5">{formatCurrency(p.emiAmount)} EMI</h4>
                              </div>
                              <button
                                onClick={() => onMakePayment(p.id)}
                                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-[10.5px] rounded-lg shadow-sm transition-colors cursor-pointer"
                              >
                                Pay Settle
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-center">
                            All up-and-coming EMI repayments matches are fully cleared!
                          </div>
                        )}
                        <p className="text-[10px] text-slate-505 text-center">
                          Simulated payments directly settle pending monthly liabilities and update history grids.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center p-8 text-slate-500">
                        <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs">Repayment controls trigger automatically once the application reaches Disbursed milestone.</p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Regional Loan Officer comments thread */}
                <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-sm space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 font-mono flex items-center gap-1.5">
                    <MessageCircle className="w-4.5 h-4.5 text-blue-500" />
                    <span>Officer Audit Comments Logs</span>
                  </h3>

                  <div className="space-y-3.5 max-h-[160px] overflow-y-auto text-xs pr-1">
                    {comments.filter(c => c.applicationId === activeApp.id).length === 0 ? (
                      <p className="text-slate-400 p-4 bg-slate-50 rounded-xl text-center">No comments logged by reviewer files yet.</p>
                    ) : (
                      comments.filter(c => c.applicationId === activeApp.id).map(comment => (
                        <div key={comment.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <strong className="text-slate-800 font-bold">{comment.authorName} ({comment.authorRole.toUpperCase()})</strong>
                            <span className="font-mono text-slate-405">{comment.createdAt.replace('T', ' ').slice(0, 16)}</span>
                          </div>
                          <p className="text-slate-655 text-xs font-semibold leading-relaxed">{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add query comment */}
                  <form onSubmit={handlePostComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask the verification desk a question..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-205 rounded-xl font-medium text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/10"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      Post log
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
