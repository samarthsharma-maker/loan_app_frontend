
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ShieldAlert } from 'lucide-react';
import { api, setToken } from '../services/api';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  // returns the registered user
  onSuccess: (user: User) => void;
  initialMode: 'login' | 'signup';
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pan, setPan] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setIsLoading(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg('Please specify email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const { token, user } = await api.login(email, password);
      setToken(token);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message?.replace(/^Request failed \(\d+\):\s*/, '') || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!name || !email || !mobile || !pan || !password) {
      setErrorMsg('All registration fields are required.');
      setIsLoading(false);
      return;
    }

    if (!pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      setErrorMsg('PAN card does not match valid formats (e.g. ABCDE1234F).');
      setIsLoading(false);
      return;
    }

    if (!mobile.match(/^\d{10}$/)) {
      setErrorMsg('Mobile Number must constitute exactly 10 digits.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('The password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      // Self-registration always creates a CUSTOMER account (enforced server-side).
      const { token, user } = await api.register({ name, email, mobile, pan, password });
      setToken(token);
      onSuccess(user);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message?.replace(/^Request failed \(\d+\):\s*/, '') || 'Error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 font-sans backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 flex flex-col text-xs text-slate-700 animate-scale-up">

        {/* Header banner */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-950 to-indigo-950 text-white relative">
          <div>
            <h3 className="text-base font-black tracking-tight">
              {mode === 'login' ? 'Standard Secure Portal Login' : 'Open Digital Loan Account'}
            </h3>
            <p className="text-[10px] text-slate-300 mt-0.5">Secure account authentication.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-800 flex items-start gap-2 select-none leading-relaxed">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* LOGIN form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">Primary Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. raj.nayan@scaler.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer disabled:bg-slate-400"
              >
                {isLoading ? 'Verifying...' : 'Verify Credentials & Enter'}
              </button>

              {/* Demo Accounts Presets selection for convenience */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500 text-center">Fast Demo Accounts (Password: password123)</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  <button
                    type="button"
                    onClick={() => { setEmail('raj.nayan@scaler.com'); setPassword('password123'); }}
                    className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('officer@hdfcland.com'); setPassword('password123'); }}
                    className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('admin@hdfcland.com'); setPassword('password123'); }}
                    className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center text-[10.5px]">
                <span className="text-slate-500">Need online loan lines?</span>{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className="font-bold text-blue-900 hover:underline cursor-pointer"
                >
                  Create Account Instantly
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">Full Identity Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Raj Nayan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Primary Email</label>
                  <input
                    type="email"
                    required
                    placeholder="raj.nayan@scaler.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="10 Digits"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">PAN Card Number</label>
                  <input
                    type="text"
                    required
                    placeholder="ABCDE1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Self-registration always creates a Customer account. Officer/Admin access is
                  provisioned by the institution, not selected by the applicant. */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                You're opening a <span className="font-bold text-slate-700">Customer</span> account to apply for and
                track loans. Officer and Admin access is granted internally by LoanHub.
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:bg-slate-400"
              >
                {isLoading ? 'Registering...' : 'Initiate Secure Registration'}
              </button>

              <div className="pt-2 text-center text-[10.5px]">
                <span className="text-slate-500">Already registered?</span>{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="font-bold text-blue-900 hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
