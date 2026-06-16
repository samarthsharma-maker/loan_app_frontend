/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { calculateEmi, calculateLoanTotals } from './loanMath';

describe('calculateEmi', () => {
  it('computes the standard reducing-balance EMI', () => {
    // ₹10,00,000 @ 8.4% for 120 months → ≈ ₹12,345/month
    const emi = calculateEmi(1_000_000, 8.4, 120);
    expect(Math.round(emi)).toBe(12345);
  });

  it('splits principal evenly when the rate is zero', () => {
    expect(calculateEmi(120000, 0, 12)).toBe(10000);
  });

  it('returns 0 for non-positive principal or tenure', () => {
    expect(calculateEmi(0, 10, 12)).toBe(0);
    expect(calculateEmi(100000, 10, 0)).toBe(0);
    expect(calculateEmi(-5000, 10, 12)).toBe(0);
  });
});

describe('calculateLoanTotals', () => {
  it('derives total payment and interest from the EMI', () => {
    const totals = calculateLoanTotals(120000, 0, 12);
    expect(totals.emi).toBe(10000);
    expect(totals.totalPayment).toBe(120000);
    expect(totals.totalInterest).toBe(0);
  });

  it('reports positive interest for an interest-bearing loan', () => {
    const totals = calculateLoanTotals(1_000_000, 8.4, 120);
    expect(totals.totalPayment).toBeGreaterThan(1_000_000);
    expect(totals.totalInterest).toBe(totals.totalPayment - 1_000_000);
  });

  it('is safe for degenerate inputs', () => {
    expect(calculateLoanTotals(0, 10, 0)).toEqual({ emi: 0, totalPayment: 0, totalInterest: 0 });
  });
});
