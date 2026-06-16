/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ProductsCatalogView from './components/ProductsCatalogView';
import EMICalculatorView from './components/EMICalculatorView';
import EligibilityCheckerView from './components/EligibilityCheckerView';
import LoanApplicationForm from './components/LoanApplicationForm';
import DashboardView from './components/DashboardView';
import OfficerPortalView from './components/OfficerPortalView';
import AdminPortalView from './components/AdminPortalView';
import AuthModal from './components/AuthModal';
import ProfileView from './components/ProfileView';
import ProfileSetupView from './components/ProfileSetupView';
import UtilityPromoModals from './components/UtilityPromoModals';
import { Compass, LifeBuoy, TrendingUp, Percent, Loader2, ServerCrash } from 'lucide-react';

import { useLoanData } from './state/useLoanData';
import { api, getToken, setToken } from './services/api';
import { User, LoanType } from './types';

// Document download remains a client-side stub (no file storage in this prototype).
function handleDownloadDocument(_docId: string, name: string) {
  alert(`Downloading PDF/JPG document package: ${name}`);
}

export default function App() {
  // Backend-backed data + all data mutations live in the data layer hook.
  // App only owns view/session state.
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const {
    users,
    products,
    applications,
    documents,
    comments,
    payments,
    loading,
    error,
    reload,
    submitApplication,
    updateStatus,
    updateDocStatus,
    addComment,
    makePayment,
    toggleUserStatus,
    updateInterestRate,
    addNewProduct,
    updateProfile,
  } = useLoanData(currentUser);

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<LoanType | null>(null);
  const [preSelectedProductId, setPreSelectedProductId] = useState<string | null>(null);

  // Authentication popups dialogs
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Utility modals
  const [activeUtilityModal, setActiveUtilityModal] = useState<'help' | 'choices' | 'offers' | null>(null);

  // Derive if profile details are incomplete
  const isProfileIncomplete = currentUser && currentUser.role === 'customer' && !currentUser.hasCompletedProfile;

  // Restore an existing session from a stored JWT on first load.
  useEffect(() => {
    if (getToken()) {
      api.me()
        .then((user) => setCurrentUser(user))
        .catch(() => setToken(null)); // token invalid/expired — drop it
    }
  }, []);

  const handleUpdateProfile = async (updatedUser: User) => {
    const saved = await updateProfile(updatedUser);
    setCurrentUser(saved);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = async (user: User) => {
    // Setting the user triggers the data hook to load their protected collections.
    setCurrentUser(user);
    if (user.role === 'customer') {
      setCurrentTab('dashboard');
    } else if (user.role === 'officer') {
      setCurrentTab('officer_portal');
    } else if (user.role === 'admin') {
      setCurrentTab('admin_portal');
    }
  };

  const handleSelectCategory = (type: LoanType) => {
    setSelectedCategory(type);
    setCurrentTab('catalog');
  };

  const handleOpenApply = (productId: string) => {
    setPreSelectedProductId(productId);
    setCurrentTab('apply');
  };

  const handleApplySubmit: typeof submitApplication = async (appl, docs) => {
    const created = await submitApplication(appl, docs);
    setPreSelectedProductId(null);
    setCurrentTab('dashboard');
    return created;
  };

  // ----- Load / error gates -------------------------------------------------
  if (loading && users.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-600 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0C5CAB]" />
        <p className="text-sm font-semibold">Connecting to LoanHub services…</p>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-700 gap-4 px-6 text-center">
        <ServerCrash className="w-10 h-10 text-rose-500" />
        <div>
          <p className="font-bold text-lg">Unable to reach the LoanHub backend</p>
          <p className="text-sm text-slate-500 mt-1 max-w-md">{error}</p>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Start the Spring Boot API (mvn spring-boot:run) on port 8080, then retry.
          </p>
        </div>
        <button
          onClick={() => reload()}
          className="px-5 py-2.5 bg-[#0C5CAB] hover:bg-[#0a4a8a] text-white font-bold rounded-lg shadow-md transition-colors cursor-pointer"
        >
          Retry connection
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-blue-900 selection:text-white">
      {/* Navigation Header */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
      />

      {/* Secondary Quick Access Bar */}
      {!isProfileIncomplete && (
        <div className="bg-white border-b border-slate-200 py-3.5 px-4 md:px-6 shadow-xs select-none">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-semibold">
              <button
                onClick={() => {
                  setCurrentTab('catalog');
                  setSelectedCategory(null);
                }}
                className="py-1 text-slate-700 hover:text-[#0C5CAB] transition-all flex items-center gap-1.5 cursor-pointer hover:underline decoration-2 underline-offset-4"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                <span>Discover Products</span>
              </button>
              <button
                onClick={() => setActiveUtilityModal('help')}
                className="py-1 text-slate-700 hover:text-[#0C5CAB] transition-all flex items-center gap-1.5 cursor-pointer hover:underline decoration-2 underline-offset-4"
              >
                <LifeBuoy className="w-4 h-4 text-slate-400" />
                <span>Need Help</span>
              </button>
              <button
                onClick={() => setActiveUtilityModal('choices')}
                className="py-1 text-slate-700 hover:text-[#0C5CAB] transition-all flex items-center gap-1.5 cursor-pointer hover:underline decoration-2 underline-offset-4"
              >
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span>Better Money Choices®</span>
              </button>
              <button
                onClick={() => setActiveUtilityModal('offers')}
                className="py-1 text-emerald-600 hover:text-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer hover:underline decoration-2 underline-offset-4"
              >
                <Percent className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Offers</span>
              </button>
            </div>

            <div className="hidden lg:block text-[10px] font-mono text-slate-400">
              Secure Desk Session ID: <span className="font-bold text-slate-600">LH-7809-A</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Render Window */}
      <main className="flex-grow">
        {isProfileIncomplete ? (
          <ProfileSetupView
            currentUser={currentUser}
            onComplete={handleUpdateProfile}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeView
                products={products}
                onSelectCategory={handleSelectCategory}
                onChangeTab={setCurrentTab}
                onOpenAuth={handleOpenAuth}
                isLoggedIn={!!currentUser}
              />
            )}

            {currentTab === 'catalog' && (
              <ProductsCatalogView
                products={products}
                selectedCategory={selectedCategory}
                onClearCategory={() => setSelectedCategory(null)}
                onChangeTab={setCurrentTab}
                onOpenApply={handleOpenApply}
                isLoggedIn={!!currentUser}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentTab === 'calculator' && (
              <EMICalculatorView />
            )}

            {currentTab === 'eligibility' && (
              <EligibilityCheckerView
                products={products}
                onOpenApply={handleOpenApply}
                isLoggedIn={!!currentUser}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentTab === 'apply' && currentUser && (
              <LoanApplicationForm
                products={products}
                userId={currentUser.id}
                userEmail={currentUser.email}
                onSubmit={handleApplySubmit}
                preSelectedProductId={preSelectedProductId}
              />
            )}

            {currentTab === 'dashboard' && currentUser && (
              <DashboardView
                applications={applications.filter(a => a.userId === currentUser.id)}
                products={products}
                documents={documents}
                comments={comments}
                payments={payments}
                onMakePayment={makePayment}
                onDownloadDocument={handleDownloadDocument}
                onAddComment={addComment}
              />
            )}

            {currentTab === 'profile' && currentUser && (
              <ProfileView
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {currentTab === 'officer_portal' && currentUser && currentUser.role === 'officer' && (
              <OfficerPortalView
                applications={applications}
                products={products}
                documents={documents}
                comments={comments}
                onUpdateStatus={updateStatus}
                onUpdateDocStatus={updateDocStatus}
                onAddComment={addComment}
              />
            )}

            {currentTab === 'admin_portal' && currentUser && currentUser.role === 'admin' && (
              <AdminPortalView
                users={users}
                products={products}
                applications={applications}
                onToggleUserStatus={toggleUserStatus}
                onUpdateInterestRate={updateInterestRate}
                onAddNewProduct={addNewProduct}
              />
            )}
          </>
        )}
      </main>

      {/* Footer support disclosures */}
      <Footer />

      {/* Popups authenticator */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* Promotional & utility helper drawers */}
      <UtilityPromoModals
        isOpen={activeUtilityModal !== null}
        type={activeUtilityModal}
        onClose={() => setActiveUtilityModal(null)}
        onNavigateTab={setCurrentTab}
        isLoggedIn={!!currentUser}
        onOpenAuth={() => handleOpenAuth('login')}
        onSelectOffer={(productId) => {
          setPreSelectedProductId(productId);
          setCurrentTab('apply');
        }}
        products={products}
      />
    </div>
  );
}
