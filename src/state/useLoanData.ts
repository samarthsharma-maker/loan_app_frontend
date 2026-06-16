/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  User,
  LoanProduct,
  LoanApplication,
  LoanDocument,
  LoanComment,
  Payment,
  ApplicationStatus,
} from '../types';

type NewApplication = Omit<
  LoanApplication,
  'id' | 'createdAt' | 'updatedAt' | 'creditScore' | 'logs' | 'status'
>;
type NewDocument = Omit<LoanDocument, 'id' | 'uploadedAt' | 'status' | 'applicationId'>;

/**
 * Central data layer for LoanHub. Owns the six backend-backed collections, the load
 * lifecycle, and every mutation handler. Extracted from App.tsx so the root component
 * only deals with view/session state.
 *
 * @param currentUser the signed-in user, used to attribute comments and status notes
 */
export function useLoanData(currentUser: User | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [documents, setDocuments] = useState<LoanDocument[]>([]);
  const [comments, setComments] = useState<LoanComment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // The product catalog is public; load it on mount regardless of auth state.
  const loadPublic = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await api.getProducts());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data from the LoanHub API.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Per-user data requires a valid auth token. The full user list is admin-only.
  const loadPrivate = useCallback(async (user: User) => {
    try {
      const [a, d, c, pay] = await Promise.all([
        api.getApplications(),
        api.getDocuments(),
        api.getComments(),
        api.getPayments(),
      ]);
      setApplications(a);
      setDocuments(d);
      setComments(c);
      setPayments(pay);
      setUsers(user.role === 'admin' ? await api.getUsers() : [user]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load account data from the LoanHub API.');
    }
  }, []);

  const reload = useCallback(async () => {
    await loadPublic();
    if (currentUser) await loadPrivate(currentUser);
  }, [loadPublic, loadPrivate, currentUser]);

  useEffect(() => {
    loadPublic();
  }, [loadPublic]);

  // (Re)load protected collections whenever the signed-in user changes; clear them on logout.
  useEffect(() => {
    if (currentUser) {
      loadPrivate(currentUser);
    } else {
      setApplications([]);
      setDocuments([]);
      setComments([]);
      setPayments([]);
      setUsers([]);
    }
  }, [currentUser, loadPrivate]);

  const refreshUsers = useCallback(async () => setUsers(await api.getUsers()), []);

  // ----- Application lifecycle ----------------------------------------------

  const submitApplication = useCallback(
    async (appl: NewApplication, docs: NewDocument[]) => {
      const created = await api.createApplication(appl);
      await Promise.all(
        docs.map((d) => api.createDocument({ ...d, applicationId: created.id })),
      );
      await api.createComment({
        applicationId: created.id,
        authorName: 'System Desk BOT',
        authorRole: 'admin',
        text: `Hello ${appl.fullName}. We have received your application request for ₹${appl.amount.toLocaleString()}. Files are queued for review assignment.`,
      });
      const [a, d, c] = await Promise.all([
        api.getApplications(),
        api.getDocuments(),
        api.getComments(),
      ]);
      setApplications(a);
      setDocuments(d);
      setComments(c);
      return created;
    },
    [],
  );

  const updateStatus = useCallback(
    async (appId: string, status: ApplicationStatus, customComment?: string) => {
      await api.updateApplicationStatus(appId, status, customComment);
      // Surface the note in the discussion thread too (the status note also lands in the audit log).
      if (customComment) {
        await api.createComment({
          applicationId: appId,
          authorName: currentUser ? currentUser.name : 'System Desk',
          authorRole: currentUser ? currentUser.role : 'admin',
          text: customComment,
        });
      }
      // Disbursal generates the EMI schedule server-side, so refresh payments as well.
      const [a, p, c] = await Promise.all([
        api.getApplications(),
        api.getPayments(),
        api.getComments(),
      ]);
      setApplications(a);
      setPayments(p);
      setComments(c);
    },
    [currentUser],
  );

  const updateDocStatus = useCallback(
    async (docId: string, status: 'verified' | 'rejected') => {
      const updated = await api.updateDocumentStatus(docId, status);
      setDocuments((prev) => prev.map((d) => (d.id === docId ? updated : d)));
    },
    [],
  );

  const addComment = useCallback(
    async (appId: string, text: string) => {
      const created = await api.createComment({
        applicationId: appId,
        authorName: currentUser ? currentUser.name : 'Simulated Desk',
        authorRole: currentUser ? currentUser.role : 'officer',
        text,
      });
      setComments((prev) => [...prev, created]);
    },
    [currentUser],
  );

  const makePayment = useCallback(async (paymentId: string) => {
    const updated = await api.payInstallment(paymentId);
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? updated : p)));
    alert('Simulated banking transaction processed. EMI Paid.');
  }, []);

  // ----- Admin operations ---------------------------------------------------

  const toggleUserStatus = useCallback(async (userId: string) => {
    const updated = await api.toggleUserActive(userId);
    setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
  }, []);

  const updateInterestRate = useCallback(async (productId: string, newRate: number) => {
    const updated = await api.updateProductRate(productId, newRate);
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
  }, []);

  const addNewProduct = useCallback(async (newProd: Omit<LoanProduct, 'id'>) => {
    const created = await api.createProduct(newProd);
    setProducts((prev) => [...prev, created]);
  }, []);

  const updateProfile = useCallback(async (updatedUser: User) => {
    const saved = await api.updateUser(updatedUser.id, updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === saved.id ? saved : u)));
    return saved;
  }, []);

  return {
    // data
    users,
    products,
    applications,
    documents,
    comments,
    payments,
    // lifecycle
    loading,
    error,
    reload,
    refreshUsers,
    // handlers
    submitApplication,
    updateStatus,
    updateDocStatus,
    addComment,
    makePayment,
    toggleUserStatus,
    updateInterestRate,
    addNewProduct,
    updateProfile,
  };
}
