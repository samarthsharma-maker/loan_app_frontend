/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User as UserIcon, LogOut } from 'lucide-react';
import { User, UserRole } from '../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  currentTab: string;
  onChangeTab: (tab: string) => void;
}

export default function Header({
  currentUser,
  onLogout,
  onOpenAuth,
  currentTab,
  onChangeTab,
}: HeaderProps) {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'System Admin';
      case 'officer':
        return 'Loan Officer';
      case 'customer':
        return 'Preferred Customer';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/80 border-b border-zinc-800/80 backdrop-blur-md">
      {/* Main Bank Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand Title */}
          <button
            onClick={() => onChangeTab('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="relative w-11 h-11 bg-gradient-to-tr from-[#0C5CAB] to-[#0a4a8a] rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-black/40 group-hover:scale-105 transition-all">
              <span className="text-lg">LH</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#09090b] flex items-center justify-center text-[8px]">
                ★
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white tracking-tight">Loan</span>
                <span className="text-2xl font-black text-[#0C5CAB] tracking-tight ml-0.5">Hub</span>
              </div>
              <p className="text-[9px] uppercase font-mono tracking-widest text-zinc-450 font-bold text-zinc-400">CLOUD BANKING PLATFORM</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onChangeTab('home')}
              className={`px-3.5 py-2.5 rounded-md transition-all cursor-pointer ${
                currentTab === 'home' ? 'text-[#0C5CAB] bg-[#0C5CAB]/10 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onChangeTab('catalog')}
              className={`px-3.5 py-2.5 rounded-md transition-all cursor-pointer ${
                currentTab === 'catalog' ? 'text-[#0C5CAB] bg-[#0C5CAB]/10 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Explore Loans
            </button>
            <button
              onClick={() => onChangeTab('calculator')}
              className={`px-3.5 py-2.5 rounded-md transition-all cursor-pointer ${
                currentTab === 'calculator' ? 'text-[#0C5CAB] bg-[#0C5CAB]/10 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              EMI Calculator
            </button>
            <button
              onClick={() => onChangeTab('eligibility')}
              className={`px-3.5 py-2.5 rounded-md transition-all cursor-pointer ${
                currentTab === 'eligibility' ? 'text-[#0C5CAB] bg-[#0C5CAB]/10 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              Check Eligibility
            </button>
            
            {/* Conditional Roles Tab Options */}
            {currentUser && currentUser.role === 'customer' && (
              <>
                <button
                  onClick={() => onChangeTab('apply')}
                  className={`px-3.5 py-2.5 rounded-md transition-all cursor-pointer ${
                    currentTab === 'apply' ? 'text-[#0C5CAB] bg-[#0C5CAB]/10 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  Apply Loan
                </button>
                <button
                  onClick={() => onChangeTab('dashboard')}
                  className={`px-3.5 py-2.5 rounded-md transition-all cursor-pointer ${
                    currentTab === 'dashboard' ? 'text-[#0C5CAB] bg-[#0C5CAB]/10 font-semibold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  My Dashboard
                </button>
              </>
            )}

            {currentUser && currentUser.role === 'officer' && (
              <button
                onClick={() => onChangeTab('officer_portal')}
                className={`px-3.5 py-2.5 rounded-md transition-all cursor-pointer ${
                  currentTab === 'officer_portal' ? 'text-[#0C5CAB] bg-[#0C5CAB]/10 font-semibold border-b-2 border-[#0C5CAB]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Applications Queue
              </button>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <button
                onClick={() => onChangeTab('admin_portal')}
                className={`px-3.5 py-2.5 rounded-md transition-all cursor-pointer ${
                  currentTab === 'admin_portal' ? 'text-[#0C5CAB] bg-[#0C5CAB]/10 font-semibold border-b-2 border-[#0C5CAB]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                Master Admin Portal
              </button>
            )}
          </nav>

          {/* Authentication & User Session Elements */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onChangeTab('profile')}
                  className={`hidden md:flex flex-col text-right cursor-pointer group hover:opacity-90 text-left`}
                >
                  <span className="font-semibold text-white text-sm group-hover:text-[#0C5CAB] transition-colors">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 font-medium px-1.5 py-0.5 rounded self-end border border-emerald-500/20 font-mono">
                    {getRoleLabel(currentUser.role)}
                  </span>
                </button>
                <button
                  onClick={() => onChangeTab('profile')}
                  className={`w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 border transition-all cursor-pointer hover:border-[#0C5CAB] ${
                    currentTab === 'profile' ? 'border-[#0C5CAB] ring-2 ring-[#0C5CAB]/25' : 'border-zinc-750'
                  }`}
                  title="My Security Profile"
                >
                  <UserIcon className="w-4 h-4 text-zinc-200" />
                </button>
                <button
                  onClick={onLogout}
                  title="Logout Session"
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4.5 py-2 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4.5 py-2 text-sm font-bold text-white bg-[#0C5CAB] hover:bg-[#0a4a8a] rounded-lg shadow-md transition-all shadow-[#0C5CAB]/25 cursor-pointer"
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
