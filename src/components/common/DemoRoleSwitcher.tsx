import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, UserCheck, ShoppingBag, Globe, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';

export const DemoRoleSwitcher: React.FC = () => {
  const { currentUser, switchUserRole, currentView, setCurrentView, resetAllData } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 text-xs">
      {/* Expanded panel */}
      {isExpanded && (
        <div className="mb-2 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-[#EAE3D6] shadow-xl text-[#282A27] w-72 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EAE3D6]">
            <span className="font-semibold text-[#38251F]">Simulasi Demo Role</span>
            <button
              onClick={() => {
                if (confirm('Reset seluruh data simulasi ke pengaturan awal?')) {
                  resetAllData();
                }
              }}
              title="Reset Database Simulasi"
              className="flex items-center gap-1 text-[11px] text-amber-800 hover:text-amber-900 px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Data
            </button>
          </div>

          <div className="space-y-1.5">
            {/* Landing page option */}
            <button
              onClick={() => {
                setCurrentView('landing');
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                currentView === 'landing'
                  ? 'bg-[#234A38] text-white font-medium'
                  : 'hover:bg-[#F7F4ED] text-[#282A27]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Landing Page Publik</span>
              </div>
              <span className="text-[10px] opacity-75">Tanpa Login</span>
            </button>

            {/* Admin option */}
            <button
              onClick={() => switchUserRole('admin')}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                currentView === 'app' && currentUser?.role === 'admin'
                  ? 'bg-[#38251F] text-white font-medium'
                  : 'hover:bg-[#F7F4ED] text-[#282A27]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <div>
                  <div className="leading-tight">Administrator</div>
                  <div className={`text-[10px] ${currentView === 'app' && currentUser?.role === 'admin' ? 'text-white/80' : 'text-[#282A27]/60'}`}>
                    Operasional & Mutu
                  </div>
                </div>
              </div>
              <span className="text-[10px] opacity-75">Budi S.</span>
            </button>

            {/* Farmer option */}
            <button
              onClick={() => switchUserRole('farmer', 'USR-FARMER-01')}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                currentView === 'app' && currentUser?.role === 'farmer'
                  ? 'bg-[#234A38] text-white font-medium'
                  : 'hover:bg-[#F7F4ED] text-[#282A27]'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <div>
                  <div className="leading-tight">Petani Kakao</div>
                  <div className={`text-[10px] ${currentView === 'app' && currentUser?.role === 'farmer' ? 'text-white/80' : 'text-[#282A27]/60'}`}>
                    Pengiriman & Saldo
                  </div>
                </div>
              </div>
              <span className="text-[10px] opacity-75">Slamet (Blitar)</span>
            </button>

            {/* Buyer option */}
            <button
              onClick={() => switchUserRole('buyer', 'USR-BUYER-01')}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                currentView === 'app' && currentUser?.role === 'buyer'
                  ? 'bg-[#84936A] text-white font-medium'
                  : 'hover:bg-[#F7F4ED] text-[#282A27]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <div>
                  <div className="leading-tight">Pembeli B2B</div>
                  <div className={`text-[10px] ${currentView === 'app' && currentUser?.role === 'buyer' ? 'text-white/80' : 'text-[#282A27]/60'}`}>
                    Katalog & Pesanan
                  </div>
                </div>
              </div>
              <span className="text-[10px] opacity-75">PT Agro Jatim</span>
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 bg-[#38251F] text-white rounded-full shadow-lg hover:bg-[#2c1d18] transition-all hover:scale-105 active:scale-95 border border-white/20"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-xs">
          Role: {currentView === 'landing' ? 'Publik' : currentUser?.role === 'admin' ? 'Admin' : currentUser?.role === 'farmer' ? 'Petani' : 'Pembeli'}
        </span>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};
