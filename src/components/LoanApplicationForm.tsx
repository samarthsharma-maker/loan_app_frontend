/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Briefcase, 
  DollarSign, 
  UploadCloud, 
  FileText, 
  Trash2,
  Calendar,
  Layers,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { LoanProduct, LoanApplication, LoanDocument, LoanType } from '../types';

interface LoanApplicationFormProps {
  products: LoanProduct[];
  userId: string;
  userEmail: string;
  onSubmit: (appl: Omit<LoanApplication, 'id' | 'createdAt' | 'updatedAt' | 'creditScore' | 'logs' | 'status'>, docs: Omit<LoanDocument, 'id' | 'uploadedAt' | 'status' | 'applicationId'>[]) => void;
  preSelectedProductId: string | null;
}

export default function LoanApplicationForm({
  products,
  userId,
  userEmail,
  onSubmit,
  preSelectedProductId,
}: LoanApplicationFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [employmentType, setEmploymentType] = useState<'salaried' | 'self_employed'>('salaried');
  const [salary, setSalary] = useState<number>(0);
  const [experience, setExperience] = useState<number>(0);

  const [existingEmi, setExistingEmi] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');

  const [selectedProductId, setSelectedProductId] = useState<string>(preSelectedProductId || products[0]?.id || '');
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [loanTenure, setLoanTenure] = useState<number>(36);

  // Uploaded docs: list of { type, name, fileBase64 }
  const [uploadedDocs, setUploadedDocs] = useState<{
    type: 'pan' | 'aadhaar' | 'salary_slip' | 'bank_statement';
    name: string;
    fileUrl: string;
  }[]>([]);

  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle auto-selected product details
  const selectedProduct = products.find(p => p.id === selectedProductId);

  // Synchronize dynamic amount limitations based on chosen product
  React.useEffect(() => {
    if (selectedProduct) {
      setLoanAmount(selectedProduct.minAmount);
      setLoanTenure(selectedProduct.tenure);
    }
  }, [selectedProductId, selectedProduct]);

  // Form validation per step
  const validateStep = (): boolean => {
    setErrorMsg('');
    if (step === 1) {
      if (!fullName) return fail('Please provide your complete name.');
      if (!dob) return fail('Please specify your Date of Birth.');
      if (!pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) return fail('PAN must match corporate format (e.g. ABCDE1234F)');
      if (!aadhaar.match(/^\d{12}$/)) return fail('Aadhaar must constitute exactly 12 numeric digits.');
    } else if (step === 2) {
      if (!companyName) return fail('Provide an active Employer or Business trading name.');
      if (salary < 1000) return fail('Monthly salary must meet active minimum criteria.');
      if (experience < 0) return fail('Work experience can not be a negative index.');
    } else if (step === 3) {
      if (!bankAccount.match(/^\d{9,18}$/)) return fail('Bank Account must be between 9 and 18 digital characters.');
      if (!ifsc.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) return fail('IFSC Code must represent Indian financial branch (e.g. HDFC0000123).');
    } else if (step === 4) {
      if (!selectedProductId) return fail('Select a target Loan Product.');
      if (loanAmount < (selectedProduct?.minAmount || 10000)) {
        return fail(`Loan Amount is below the product minimum limit: ₹${selectedProduct?.minAmount.toLocaleString('en-IN')}`);
      }
      if (loanAmount > (selectedProduct?.maxAmount || 100000000)) {
        return fail(`Loan Amount exceeds product maximum cap: ₹${selectedProduct?.maxAmount.toLocaleString('en-IN')}`);
      }
    } else if (step === 5) {
      const requiredTypes = ['pan', 'aadhaar', 'salary_slip', 'bank_statement'];
      const uploadedTypes = uploadedDocs.map(d => d.type);
      const missing = requiredTypes.filter(t => !uploadedTypes.includes(t));
      if (missing.length > 0) {
        return fail(`Please upload all mandatory documents: ${missing.map(m => m.toUpperCase().replace('_', ' ')).join(', ')}`);
      }
    }
    return true;
  };

  const fail = (msg: string) => {
    setErrorMsg(msg);
    return false;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setErrorMsg('');
    setStep(step - 1);
  };

  // Mock document drop handler
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, docType: any) => {
    e.preventDefault();
    setIsDragging(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      saveMockFile(files[0], docType);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, docType: any) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      saveMockFile(files[0], docType);
    }
  };

  const saveMockFile = (file: File, docType: any) => {
    // Check type PDF, JPG, PNG
    const isAccepted = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
    if (!isAccepted) {
      setErrorMsg('Accepted file types include PDF, JPG, PNG formats only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
       setUploadedDocs(prev => {
         // remove existing doc of same type
         const filtered = prev.filter(d => d.type !== docType);
         return [...filtered, {
           type: docType,
           name: file.name,
           fileUrl: reader.result as string || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=300'
         }];
       });
       setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const deleteDoc = (docType: string) => {
    setUploadedDocs(prev => prev.filter(d => d.type !== docType));
  };

  const getDocName = (type: string) => {
    const found = uploadedDocs.find(d => d.type === type);
    return found ? found.name : null;
  };

  const handleFinalSubmit = () => {
    if (!validateStep()) return;

    // prepare documents structures
    const docsPayload = uploadedDocs.map(ud => ({
      fileName: ud.name,
      documentType: ud.type,
      fileUrl: ud.fileUrl,
    }));

    const applicationPayload = {
      userId,
      productId: selectedProductId,
      amount: loanAmount,
      tenure: loanTenure,
      fullName,
      dob,
      pan,
      aadhaar,
      companyName,
      employmentType,
      salary,
      experience,
      existingEmi,
      monthlyExpenses,
      bankAccount: `${bankAccount} | IFSC: ${ifsc}`,
    };

    onSubmit(applicationPayload, docsPayload);
  };

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-[#09090b] min-h-screen py-12 px-4 md:px-6 flex justify-center items-start font-sans text-zinc-200">
      <div className="max-w-4xl w-full bg-[#121214] rounded-2xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col">
        
        {/* Horizontal Wizard Progress Steps */}
        <div className="bg-zinc-950 text-[#fafafa] p-6 grid grid-cols-6 gap-2 border-b border-zinc-800 text-center select-none">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((sNum) => (
            <div key={sNum} className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                sNum === step 
                  ? 'bg-[#0C5CAB] border-[#0C5CAB] text-white font-black scale-110 shadow-lg' 
                  : sNum < step 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
              }`}>
                {sNum < step ? <Check className="w-4 h-4 stroke-[3px]" /> : sNum}
              </div>
              <span className={`text-[10px] hidden sm:block uppercase tracking-wider font-semibold font-mono ${
                sNum === step ? 'text-blue-400 font-bold' : 'text-zinc-500'
              }`}>
                {sNum === 1 ? 'Personal' : sNum === 2 ? 'Employment' : sNum === 3 ? 'Financial' : sNum === 4 ? 'Loan' : sNum === 5 ? 'Docs' : 'Review'}
              </span>
            </div>
          ))}
        </div>

        {/* Form Input fields container */}
        <div className="p-6 md:p-8 flex-1 space-y-6">
          
          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-4 text-xs text-rose-400 flex items-start gap-2.5 animate-pulse">
              <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-405" />
                  <span>Personal KYC Identity Parameters</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-1">Please provide standard full identity documents to execute credit check routines.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-zinc-300">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Full Name (Matching PAN Card Title)</label>
                  <input
                    type="text"
                    placeholder="e.g. Raj Nayan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Date of Birth (DOB)</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">PAN Card Number</label>
                  <input
                    type="text"
                    placeholder="e.g. ABCDE1234F (10 Char UPPERCASE)"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Aadhaar Card Number (12 Digits)</label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. 123456789012"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Employment Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-405" />
                  <span>Professional Employment Portfolio</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-1">Lending parameters require checking stable workspace histories and monthly turnovers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-zinc-300">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Sector/Employment Classification</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB] cursor-pointer"
                  >
                    <option value="salaried" className="bg-zinc-950">Corporate Salaried Employee</option>
                    <option value="self_employed" className="bg-zinc-950">Private Self-Employed Practitioner / Business</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Employer Name / Company Trade Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Scaler Technologies Inc"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-sans text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Net Monthly Salary In-Hand (₹)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Active Work Experience (Years)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Financial Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-405" />
                  <span>Outflow Debt Indices & Banking Vault Info</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-1">Specify destination bank details where disbursed amounts must be directed.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-zinc-350">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Active monthly EMIs outflow (₹)</label>
                  <input
                    type="number"
                    value={existingEmi}
                    onChange={(e) => setExistingEmi(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Estimated Average Monthly Expenses (₹)</label>
                  <input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Savings / Salary Bank Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 10098472534 (9-18 digits)"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Bank Branch IFSC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0000123"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Loan Product parameters */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-405" />
                  <span>Configure Funding Terms</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-1">Select your target product and configure custom repayment spans.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 text-xs text-zinc-300">
                <div className="space-y-1.5">
                  <label className="font-semibold text-zinc-400">Target Loan Product Catalog</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id} className="bg-zinc-950">{p.name} (Interest starting: {p.interestRate}% p.a.)</option>
                    ))}
                  </select>
                </div>

                {selectedProduct && (
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                    <div>
                      <span className="text-zinc-500 font-mono text-[9px] uppercase font-semibold">Min-Max Bounds</span>
                      <p className="font-bold text-white font-mono mt-1">
                        {formatCurrency(selectedProduct.minAmount)} - {formatCurrency(selectedProduct.maxAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-mono text-[9px] uppercase font-semibold">Preconfigured Interest</span>
                      <p className="font-bold text-emerald-400 font-mono mt-1">{selectedProduct.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 font-mono text-[9px] uppercase font-semibold">Processing Fee Limit</span>
                      <p className="font-bold text-zinc-350 font-mono mt-1">{selectedProduct.processingFee}% GST Excl.</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-400">Target Borrowing Volume (₹)</label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-zinc-400">Payment Tenure Spans (Months)</label>
                    <select
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-805 rounded-xl font-semibold text-white focus:outline-none focus:ring-1 focus:ring-[#0C5CAB]"
                    >
                      <option value={12} className="bg-zinc-950">12 Months (1 Year)</option>
                      <option value={24} className="bg-zinc-950">24 Months (2 Years)</option>
                      <option value={36} className="bg-zinc-950">36 Months (3 Years)</option>
                      <option value={60} className="bg-zinc-950">60 Months (5 Years)</option>
                      <option value={120} className="bg-zinc-950">120 Months (10 Years)</option>
                      <option value={180} className="bg-zinc-950">180 Months (15 Years)</option>
                      <option value={240} className="bg-zinc-950">240 Months (20 Years)</option>
                      <option value={360} className="bg-zinc-950">360 Months (30 Years)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Document Upload zone */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-405 animate-pulse" />
                  <span>Document Upload Portal Vault</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-1">Please upload physical digital evidence to authenticate inhand salary parameters and KYC credentials.</p>
              </div>

              {/* Upload Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                
                {/* Aadhaar, PAN, Pay slips, Bank details loops */}
                {([
                  { key: 'pan', label: '1. PAN Card ID Proof' },
                  { key: 'aadhaar', label: '2. Aadhaar Card Front/Back' },
                  { key: 'salary_slip', label: '3. Last 3 Months Salary Slips' },
                  { key: 'bank_statement', label: '4. Last 6 Months PDF Statement' },
                ] as const).map((docSetup) => {
                  const uploadedName = getDocName(docSetup.key);

                  return (
                    <div 
                      key={docSetup.key}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(docSetup.key); }}
                      onDragLeave={() => setIsDragging(null)}
                      onDrop={(e) => handleFileDrop(e, docSetup.key)}
                      className={`border-2 border-dashed rounded-2xl p-4 flex flex-col justify-center items-center text-center transition-all ${
                        isDragging === docSetup.key 
                          ? 'border-[#0C5CAB] bg-[#0C5CAB]/10' 
                          : uploadedName 
                          ? 'border-emerald-500/40 bg-emerald-500/5' 
                          : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900'
                      }`}
                    >
                      <span className="font-bold text-[11px] text-white self-start mb-2 block">{docSetup.label}</span>
                      
                      {uploadedName ? (
                        <div className="space-y-2.5 w-full">
                          <div className="flex items-center gap-2 justify-center text-xs text-emerald-400 font-semibold">
                            <FileText className="w-5 h-5 text-emerald-500" />
                            <span className="truncate max-w-[200px]">{uploadedName}</span>
                          </div>
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => deleteDoc(docSetup.key)}
                              className="px-2.5 py-1.5 bg-zinc-900 hover:bg-rose-500/10 border border-zinc-850 text-rose-400 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors self-center cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer space-y-1.5 py-4 w-full flex flex-col items-center">
                          <UploadCloud className="w-7 h-7 text-zinc-500 group-hover:scale-110 transition-transform" />
                          <p className="text-zinc-400 text-[10px]"><span className="text-blue-400 font-bold">Upload file</span> or drag & drop</p>
                          <p className="text-[9px] text-zinc-500 font-mono">PDF, PNG, JPG up to 10MB</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileSelect(e, docSetup.key)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  );
                })}

              </div>
            </div>
          )}

          {/* STEP 6: Review Summary */}
          {step === 6 && (
            <div className="space-y-6 text-xs text-zinc-300">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#0C5CAB]" />
                  <span>Verify Loan Request Details</span>
                </h3>
                <p className="text-zinc-400 text-xs mt-1">Review your multi-step form criteria values below before submitting final algorithms.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
                
                {/* Column 1: Identity */}
                <div className="space-y-3">
                  <h4 className="font-mono font-extrabold text-[9px] uppercase tracking-wider text-zinc-500">ID & Personal Credentials</h4>
                  <div className="space-y-2">
                    <p className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-400 font-sans">Applicant Title:</span>
                      <strong className="text-white font-bold font-sans">{fullName}</strong>
                    </p>
                    <p className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-400 font-sans">DOB:</span>
                      <strong className="text-white font-mono">{dob}</strong>
                    </p>
                    <p className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-400 font-sans">PAN ID:</span>
                      <strong className="text-white font-mono">{pan}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-400 font-sans">Aadhaar:</span>
                      <strong className="text-white font-mono">XXXX-XXXX-{aadhaar.slice(-4)}</strong>
                    </p>
                  </div>
                </div>

                {/* Column 2: Financials */}
                <div className="space-y-3">
                  <h4 className="font-mono font-extrabold text-[9px] uppercase tracking-wider text-zinc-500">Employment & Repayments</h4>
                  <div className="space-y-2">
                    <p className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-400 font-sans">Company Name:</span>
                      <strong className="text-white font-bold font-sans truncate max-w-[150px]">{companyName}</strong>
                    </p>
                    <p className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-400 font-sans">In Hand Salary:</span>
                      <strong className="text-emerald-400 font-mono font-bold">{formatCurrency(salary)}</strong>
                    </p>
                    <p className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-400 font-sans">Borrowing Volume:</span>
                      <strong className="text-blue-405 font-mono font-extrabold text-xs">{formatCurrency(loanAmount)}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-zinc-400 font-sans">Tenure Terms:</span>
                      <strong className="text-white font-mono">{loanTenure} Months</strong>
                    </p>
                  </div>
                </div>

              </div>

              {/* Secure authorization statement */}
              <div className="bg-blue-950/20 border border-blue-900/30 p-4 rounded-xl flex items-start gap-2.5 leading-relaxed text-blue-300">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-white">National Registry Agreement</strong>
                  <p className="mt-0.5 text-zinc-400 font-sans leading-normal">
                    By submitting your application packet, you authorize LoanHub Digital's risk assessment engine to verify Aadhaar KYC parameters, retrieve CIBIL records, and query PAN-associated income fields.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Action Button Strip */}
        <div className="bg-zinc-950 p-4 border-t border-zinc-800 flex justify-between items-center select-none text-xs">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4.5 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-400" />
              <span>Back Step</span>
            </button>
          ) : (
            <div></div> // balance grid padding
          )}

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-[#0C5CAB] hover:bg-blue-600 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors cursor-pointer text-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <span>Submit Application Packet</span>
              <ShieldCheck className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
