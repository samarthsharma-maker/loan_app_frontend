/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Pure loan/EMI maths, extracted so it can be unit-tested independently of React.
 *
 * Standard reducing-balance formula: EMI = P · r(1+r)^n / ((1+r)^n − 1),
 * where r is the monthly interest rate and n the number of months.
 */

/**
 * Compute the monthly EMI for a loan.
 *
 * @param principal   loan amount (P)
 * @param annualRate  annual interest rate as a percentage (e.g. 8.4 for 8.4%)
 * @param months      tenure in months (n)
 * @returns the monthly instalment, or 0 for non-positive / invalid inputs
 */
export function calculateEmi(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;

  const monthlyRate = annualRate / 12 / 100;
  const emi =
    monthlyRate > 0
      ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1)
      : principal / months;

  return Number.isFinite(emi) ? emi : 0;
}

export interface LoanTotals {
  /** Monthly instalment, rounded to the nearest rupee. */
  emi: number;
  /** Total amount repaid over the full tenure, rounded. */
  totalPayment: number;
  /** Total interest paid over the full tenure, rounded. */
  totalInterest: number;
}

/**
 * Compute the EMI plus total payment and total interest for a loan.
 */
export function calculateLoanTotals(principal: number, annualRate: number, months: number): LoanTotals {
  const rawEmi = calculateEmi(principal, annualRate, months);
  const totalPayment = rawEmi * months;
  const totalInterest = totalPayment - principal;

  const safe = (v: number) => (Number.isFinite(v) ? Math.round(v) : 0);
  return {
    emi: safe(rawEmi),
    totalPayment: safe(totalPayment),
    totalInterest: safe(totalInterest),
  };
}
