/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'customer' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  pan: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
  creditScore?: number;
  hasCompletedProfile?: boolean;
}

export type LoanType = 'personal' | 'home' | 'business' | 'vehicle' | 'gold';

export interface LoanProduct {
  id: string;
  name: string;
  type: LoanType;
  interestRate: number; // in %
  minAmount: number;
  maxAmount: number;
  tenure: number; // in months
  processingFee: number; // in %
  description: string;
  eligibilityCriteria: string[];
  documentsRequired: string[];
}

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'document_verification'
  | 'credit_check'
  | 'approved'
  | 'rejected'
  | 'disbursed';

export interface LoanDocument {
  id: string;
  applicationId: string;
  fileName: string;
  documentType: 'pan' | 'aadhaar' | 'salary_slip' | 'bank_statement' | 'gold_valuation' | 'other';
  fileUrl: string; // Base64 or object URL mockup
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  comment?: string;
}

export interface LoanComment {
  id: string;
  applicationId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface LoanApplication {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  tenure: number; // in months
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  
  // Step 1: Personal Details
  fullName: string;
  dob: string;
  pan: string;
  aadhaar: string;

  // Step 2: Employment Details
  companyName: string;
  employmentType: 'salaried' | 'self_employed' | 'unemployed';
  salary: number; // Monthly
  experience: number; // in years

  // Step 3: Financial Details
  existingEmi: number;
  monthlyExpenses: number;
  bankAccount: string;

  // Step 5: Documents list reference can be inferred, but let's store comments / logs
  creditScore: number; // Auto calculated on credit check step
  logs: {
    status: ApplicationStatus;
    updatedAt: string;
    comment?: string;
  }[];
}

export interface Payment {
  id: string;
  applicationId: string;
  emiAmount: number;
  paymentDate: string;
  status: 'paid' | 'pending' | 'overdue';
}
