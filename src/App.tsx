import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PublicLanding } from './components/PublicLanding';
import { AuthModal } from './components/AuthModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { DemoRoleSwitcher } from './components/common/DemoRoleSwitcher';
import { UserRole } from './types';

const MainAppContent: React.FC = () => {
  const { currentView, currentUser } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [initialRegisterRole, setInitialRegisterRole] = useState<UserRole>('farmer');

  const handleOpenAuth = (mode: 'login' | 'register', role?: UserRole) => {
    setAuthMode(mode);
    if (role) {
      setInitialRegisterRole(role);
    }
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4ED] text-[#282A27]">
      {/* If view is landing, show public site with Navbar & Footer */}
      {currentView === 'landing' ? (
        <>
          <Navbar onOpenAuth={handleOpenAuth} />
          <div className="flex-1">
            <PublicLanding onOpenAuth={handleOpenAuth} />
          </div>
          <Footer />
        </>
      ) : (
        /* Authenticated View */
        <div className="flex-1 flex flex-col">
          {!currentUser ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center space-y-4 max-w-md">
                <p className="text-sm text-[#282A27]/80">Silakan masuk untuk mengakses area kerja terautentikasi.</p>
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-5 py-2.5 bg-[#234A38] text-white rounded-xl text-xs font-semibold"
                >
                  Buka Form Masuk
                </button>
              </div>
            </div>
          ) : currentUser.role === 'admin' ? (
            <AdminLayout />
          ) : currentUser.role === 'farmer' ? (
            <FarmerDashboard />
          ) : (
            <BuyerDashboard />
          )}
        </div>
      )}

      {/* Floating Demo Persona & Role Switcher */}
      <DemoRoleSwitcher />

      {/* Auth Modal for Login & Register */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        initialRole={initialRegisterRole}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
