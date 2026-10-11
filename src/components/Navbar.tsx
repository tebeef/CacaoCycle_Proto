import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CocoaCycleLogo } from './CocoaCycleLogo';
import { Menu, X, LogIn, UserPlus, LogOut, LayoutDashboard, Shield, User, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register', role?: 'farmer' | 'buyer') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { currentUser, currentView, setCurrentView, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F7F4ED]/90 backdrop-blur-md border-b border-[#EAE3D6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Strict single-element lockup) */}
        <button
          onClick={() => setCurrentView('landing')}
          className="text-left cursor-pointer focus:outline-none"
        >
          <CocoaCycleLogo variant="horizontal" size="md" showTagline={false} />
        </button>

        {/* Zone 2: Navigation Links (Clean single-line prose, hidden on mobile) */}
        {currentView === 'landing' ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#282A27]/80">
            <button
              onClick={() => scrollToSection('beranda')}
              className="hover:text-[#234A38] transition-colors whitespace-nowrap cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection('cara-kerja')}
              className="hover:text-[#234A38] transition-colors whitespace-nowrap cursor-pointer"
            >
              Cara Kerja
            </button>
            <button
              onClick={() => scrollToSection('produk')}
              className="hover:text-[#234A38] transition-colors whitespace-nowrap cursor-pointer"
            >
              Produk
            </button>
            <button
              onClick={() => scrollToSection('mutu')}
              className="hover:text-[#234A38] transition-colors whitespace-nowrap cursor-pointer"
            >
              Mutu & Pelacakan
            </button>
            <button
              onClick={() => scrollToSection('dampak')}
              className="hover:text-[#234A38] transition-colors whitespace-nowrap cursor-pointer"
            >
              Dampak
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-3 text-xs text-[#282A27]/70 font-mono">
            <span>Area Portal:</span>
            <span className="font-semibold text-[#234A38]">
              {currentUser?.role === 'admin'
                ? 'Operasional Administrator'
                : currentUser?.role === 'farmer'
                ? 'Portal Petani Mitra'
                : 'Portal Pembeli Industri B2B'}
            </span>
          </div>
        )}

        {/* Zone 3: Primary Action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {currentView === 'landing' ? (
                <button
                  onClick={() => setCurrentView('app')}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#234A38] hover:bg-[#1a382b] rounded-xl transition-colors whitespace-nowrap shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Buka Dashboard
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('landing')}
                    className="px-3 py-1.5 text-xs text-[#282A27]/80 hover:text-[#282A27] bg-[#EAE3D6]/60 hover:bg-[#EAE3D6] rounded-lg transition-colors whitespace-nowrap"
                  >
                    Ke Halaman Publik
                  </button>
                  <div className="h-4 w-px bg-[#EAE3D6]" />
                  <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-medium text-[#38251F]">
                    {currentUser.role === 'admin' ? (
                      <Shield className="w-3.5 h-3.5 text-[#234A38]" />
                    ) : currentUser.role === 'farmer' ? (
                      <User className="w-3.5 h-3.5 text-[#234A38]" />
                    ) : (
                      <ShoppingBag className="w-3.5 h-3.5 text-[#234A38]" />
                    )}
                    <span className="font-semibold">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={logout}
                    title="Keluar"
                    className="p-1.5 text-[#282A27]/60 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-xs font-semibold text-[#38251F] hover:text-[#234A38] transition-colors whitespace-nowrap"
              >
                Masuk
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#234A38] hover:bg-[#1a382b] rounded-xl transition-colors whitespace-nowrap shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Gabung dengan CocoaCycle
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && currentView === 'landing' && (
            <button
              onClick={() => setCurrentView('app')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#234A38] rounded-lg"
            >
              Dashboard
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#282A27] rounded-lg hover:bg-[#EAE3D6] transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAE3D6] bg-[#F7F4ED] px-4 pt-4 pb-6 space-y-3">
          {currentView === 'landing' ? (
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#282A27]">
              <button
                onClick={() => scrollToSection('beranda')}
                className="text-left py-2 hover:text-[#234A38]"
              >
                Beranda
              </button>
              <button
                onClick={() => scrollToSection('cara-kerja')}
                className="text-left py-2 hover:text-[#234A38]"
              >
                Cara Kerja
              </button>
              <button
                onClick={() => scrollToSection('produk')}
                className="text-left py-2 hover:text-[#234A38]"
              >
                Produk
              </button>
              <button
                onClick={() => scrollToSection('mutu')}
                className="text-left py-2 hover:text-[#234A38]"
              >
                Mutu & Pelacakan
              </button>
              <button
                onClick={() => scrollToSection('dampak')}
                className="text-left py-2 hover:text-[#234A38]"
              >
                Dampak
              </button>
            </div>
          ) : (
            <div className="text-xs text-[#282A27]/70 py-2">
              Masuk sebagai: <strong className="text-[#38251F]">{currentUser?.name}</strong> ({currentUser?.role})
            </div>
          )}

          <div className="pt-3 border-t border-[#EAE3D6] flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setCurrentView('app');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#234A38] rounded-xl text-center"
                >
                  Buka Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 text-xs font-medium text-red-700 bg-red-50 rounded-xl text-center"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#38251F] bg-[#EAE3D6] rounded-xl text-center"
                >
                  Masuk ke Akun
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#234A38] rounded-xl text-center"
                >
                  Gabung dengan CocoaCycle
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
