import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CocoaCycleLogo } from '../CocoaCycleLogo';
import {
  LayoutDashboard,
  Scale,
  Layers,
  FlaskConical,
  Package,
  Users,
  Building2,
  ShoppingCart,
  Truck,
  CreditCard,
  FileSpreadsheet,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react';
import {
  AdminDashboardView,
  ReceiptManagementView,
  BatchProductionView,
  QualityControlView,
  InventoryManagementView,
  FarmerManagementView,
  BuyerManagementView,
  OrderManagementView,
  PaymentManagementView,
  ReportsView,
  SettingsView,
} from './AdminViews';

export const AdminLayout: React.FC = () => {
  const { currentUser, logout, activeNavTab, setActiveNavTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'receipts', label: 'Penerimaan Pasokan', icon: Scale },
    { id: 'batches', label: 'Batch Produksi', icon: Layers },
    { id: 'qc', label: 'Quality Control', icon: FlaskConical },
    { id: 'inventory', label: 'Inventaris', icon: Package },
    { id: 'farmers', label: 'Petani', icon: Users },
    { id: 'buyers', label: 'Pembeli', icon: Building2 },
    { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
    { id: 'shipments', label: 'Pengiriman', icon: Truck },
    { id: 'payments', label: 'Pembayaran', icon: CreditCard },
    { id: 'reports', label: 'Laporan', icon: FileSpreadsheet },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const renderActiveView = () => {
    switch (activeNavTab) {
      case 'dashboard':
        return <AdminDashboardView onNavigate={(tab) => setActiveNavTab(tab)} />;
      case 'receipts':
        return <ReceiptManagementView />;
      case 'batches':
        return <BatchProductionView onNavigateToQC={() => setActiveNavTab('qc')} />;
      case 'qc':
        return <QualityControlView />;
      case 'inventory':
        return <InventoryManagementView />;
      case 'farmers':
        return <FarmerManagementView />;
      case 'buyers':
        return <BuyerManagementView />;
      case 'orders':
      case 'shipments':
        return <OrderManagementView />;
      case 'payments':
        return <PaymentManagementView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <AdminDashboardView onNavigate={(tab) => setActiveNavTab(tab)} />;
    }
  };

  const activeLabel = menuItems.find((m) => m.id === activeNavTab)?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F7F4ED] flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar (Desktop 260px & Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#38251F] text-[#F7F4ED] flex flex-col justify-between border-r border-[#2c1c17] transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <CocoaCycleLogo variant="horizontal" size="sm" inverted={true} showTagline={false} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-[#EAE3D6] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-4 space-y-1 overflow-y-auto flex-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#EAE3D6]/50">
              Operasional Pabrik
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavTab === item.id || (item.id === 'orders' && activeNavTab === 'shipments');

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNavTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                    isActive
                      ? 'bg-[#234A38] text-white shadow-xs'
                      : 'text-[#EAE3D6]/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Admin Profile & Logout */}
          <div className="p-4 border-t border-white/10 bg-[#2f1f1a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-[#234A38] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  BS
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold truncate text-[#F7F4ED]">{currentUser?.name}</div>
                  <div className="text-[10px] text-[#84936A] font-mono flex items-center gap-1">
                    <Shield className="w-2.5 h-2.5" />
                    Administrator
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Keluar"
                className="p-1.5 text-[#EAE3D6]/70 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#F7F4ED]/90 backdrop-blur-md border-b border-[#EAE3D6] h-16 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#38251F] hover:bg-[#EAE3D6] rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-[#282A27]/60">
              <span>Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-[#38251F]">{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#282A27]/60 font-mono hidden sm:inline">
              Hub Pengolahan & QC Jawa Timur (Blitar - Malang)
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
