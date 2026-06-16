/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * REST client for the LoanHub Spring Boot backend.
 *
 * Replaces the previous localStorage-backed `db` service: all reads and writes now go to
 * the Java API. The base URL is configurable via VITE_API_BASE_URL and defaults to the
 * local Spring dev server (port 8080, context-path /api).
 */

import {
  User,
  LoanProduct,
  LoanApplication,
  LoanDocument,
  LoanComment,
  Payment,
} from '../types';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:8080/api';

const TOKEN_KEY = 'loanhub_token';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/** JWT issued by the backend on login/registration, persisted for session continuity. */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable; token simply won't persist across reloads */
  }
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = buildHeaders();
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { ...headers, ...(init?.headers as Record<string, string> | undefined) },
    });
  } catch (networkErr) {
    throw new ApiError(0, `Cannot reach LoanHub API at ${API_BASE_URL}. Is the backend running?`);
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body?.message || body?.error || detail;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, `Request failed (${res.status}): ${detail}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const qs = (params: Record<string, string | number>) =>
  '?' +
  Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  mobile: string;
  pan: string;
  password: string;
}

export const api = {
  // ----- Auth ---------------------------------------------------------------
  /** Register a new customer account; returns a token + the created profile. */
  register: (payload: RegisterPayload) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  /** Resolve the current user from the stored token (used to restore a session). */
  me: () => request<User>('/auth/me'),

  // ----- Users --------------------------------------------------------------
  getUsers: () => request<User[]>('/users'),
  updateUser: (id: string, updates: Partial<User>) =>
    request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  toggleUserActive: (id: string) =>
    request<User>(`/users/${id}/toggle-active`, { method: 'PATCH' }),

  // ----- Products -----------------------------------------------------------
  getProducts: () => request<LoanProduct[]>('/products'),
  createProduct: (product: Omit<LoanProduct, 'id'>) =>
    request<LoanProduct>('/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProductRate: (id: string, rate: number) =>
    request<LoanProduct>(`/products/${id}/rate${qs({ rate })}`, { method: 'PATCH' }),

  // ----- Applications -------------------------------------------------------
  getApplications: () => request<LoanApplication[]>('/applications'),
  getApplicationsByUser: (userId: string) =>
    request<LoanApplication[]>(`/applications/user/${userId}`),
  createApplication: (
    application: Omit<LoanApplication, 'id' | 'createdAt' | 'updatedAt' | 'creditScore' | 'logs' | 'status'>,
  ) => request<LoanApplication>('/applications', { method: 'POST', body: JSON.stringify(application) }),
  updateApplicationStatus: (id: string, status: string, comment?: string) =>
    request<LoanApplication>(
      `/applications/${id}/status${qs(comment ? { status, comment } : { status })}`,
      { method: 'PATCH' },
    ),

  // ----- Documents ----------------------------------------------------------
  getDocuments: () => request<LoanDocument[]>('/documents'),
  createDocument: (document: Omit<LoanDocument, 'id' | 'uploadedAt' | 'status'>) =>
    request<LoanDocument>('/documents', { method: 'POST', body: JSON.stringify(document) }),
  updateDocumentStatus: (id: string, status: 'verified' | 'rejected') =>
    request<LoanDocument>(`/documents/${id}/status${qs({ status })}`, { method: 'PATCH' }),

  // ----- Comments -----------------------------------------------------------
  getComments: () => request<LoanComment[]>('/comments'),
  createComment: (comment: Omit<LoanComment, 'id' | 'createdAt'>) =>
    request<LoanComment>('/comments', { method: 'POST', body: JSON.stringify(comment) }),

  // ----- Payments -----------------------------------------------------------
  getPayments: () => request<Payment[]>('/payments'),
  payInstallment: (id: string) =>
    request<Payment>(`/payments/${id}/pay`, { method: 'PATCH' }),
};
