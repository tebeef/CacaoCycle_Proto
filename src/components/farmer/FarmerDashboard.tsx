import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CocoaCycleLogo } from '../CocoaCycleLogo';
import {
  LayoutDashboard,
  Truck,
  FileText,
  CreditCard,
  UserCheck,
  Plus,
  Scale,
  Printer,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  LogOut,
  MapPin,
} from 'lucide-react';
import { WeighTicketModal } from '../common/WeighTicketModal';
import { RawMaterialReceipt } from '../../types';

export const FarmerDashboard: React.FC = () => {
  const { currentUser, receipts, supplierPayments, deliveryPlans, submitDeliveryPlan, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'delivery' | 'transactions' | 'payments' | 'profile'>('dashboard');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<RawMaterialReceipt | null>(null);

  // Form state for delivery plan
  const [plannedDate, setPlannedDate] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  );
  const [estKg, setEstKg] = useState('500');
  const [rawCondition, setRawCondition] = useState<'Segar Baru Petik' | 'Lembap Sedang'>('Segar Baru Petik');
  const [method, setMethod] = useState<'diantar' | 'penjemputan'>('diantar');
  const [locationNotes, setLocationNotes] = useState('Diantar langsung ke Pos Timbang CocoaCycle');
  const [notes, setNotes] = useState('');

  // Farmer specific data
  const farmerReceipts = receipts.filter((r) => r.farmerId === currentUser?.id);
  const farmerPayments = supplierPayments.filter((p) => p.farmerId === currentUser?.id);
  const farmerPlans = deliveryPlans.filter((p) => p.farmerId === currentUser?.id);

  const totalKgDelivered = farmerReceipts.reduce((a, b) => a + b.netWeightKg, 0);
  const totalSalesValue = farmerReceipts.reduce((a, b) => a + b.totalAmount, 0);
  const totalPaid = farmerPayments.reduce((a, b) => a + b.totalPaid, 0);
  const totalRemaining = farmerPayments.reduce((a, b) => a + b.remainingAmount, 0);

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDeliveryPlan({
      farmerId: currentUser?.id || 'USR-FARMER-01',
      farmerName: currentUser?.name || 'Petani Kakao',
      plannedDate,
      estimatedWeightKg: Number(estKg),
      rawCondition,
      deliveryMethod: method,
      locationNotes,
      notes,
    });
    setShowPlanModal(false);
    setActiveTab('delivery');
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] pb-16">
      {/* Top Banner / Farmer Identity */}
      <header className="bg-[#234A38] text-white py-6 px-4 sm:px-8 border-b border-[#1b3a2c]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#38251F] text-white flex items-center justify-center font-bold text-base border border-white/20">
              {currentUser?.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#F7F4ED]">{currentUser?.name}</h1>
                <span className="text-[10px] font-semibold bg-[#84936A] px-2 py-0.5 rounded text-white">
                  Mitra Petani
                </span>
              </div>
              <p className="text-xs text-[#EAE3D6]/80 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#84936A]" />
                {currentUser?.farmerProfile?.farmName} · {currentUser?.farmerProfile?.regency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPlanModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#234A38] rounded-xl text-xs font-bold hover:bg-[#F7F4ED] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Catat Rencana Kirim
            </button>
            <button
              onClick={logout}
              title="Keluar"
              className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Nav Tabs for Farmer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#EAE3D6] text-xs font-semibold">
          {[
            { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
            { id: 'delivery', label: 'Rencana Pengiriman', icon: Truck },
            { id: 'transactions', label: 'Riwayat Timbang', icon: Scale },
            { id: 'payments', label: 'Pembayaran & Saldo', icon: CreditCard },
            { id: 'profile', label: 'Profil Kebun', icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#38251F] text-white shadow-xs'
                    : 'text-[#282A27]/70 hover:bg-white hover:text-[#38251F]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6">
        {/* --- 1. DASHBOARD OVERVIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D6] space-y-1">
                <span className="text-xs text-[#282A27]/60 block">Total Kulit Diserahkan</span>
                <div className="text-2xl font-extrabold text-[#234A38] font-mono tabular-nums">
                  {totalKgDelivered.toLocaleString('id-ID')} <span className="text-xs font-normal">kg</span>
                </div>
                <p className="text-[11px] text-[#282A27]/50 font-mono">Bobot bersih terverifikasi</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D6] space-y-1">
                <span className="text-xs text-[#282A27]/60 block">Total Nilai Penjualan</span>
                <div className="text-2xl font-extrabold text-[#38251F] font-mono tabular-nums">
                  Rp {totalSalesValue.toLocaleString('id-ID')}
                </div>
                <p className="text-[11px] text-[#282A27]/50 font-mono">Tarif beli Rp 100/kg segar</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D6] space-y-1">
                <span className="text-xs text-[#282A27]/60 block">Telah Dibayarkan</span>
                <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
                  Rp {totalPaid.toLocaleString('id-ID')}
                </div>
                <p className="text-[11px] text-emerald-700 font-mono">Masuk ke rekening Anda</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D6] space-y-1">
                <span className="text-xs text-[#282A27]/60 block">Menunggu Pencairan</span>
                <div className="text-2xl font-extrabold text-amber-800 font-mono tabular-nums">
                  Rp {totalRemaining.toLocaleString('id-ID')}
                </div>
                <p className="text-[11px] text-amber-800 font-mono">Proses transfer batch</p>
              </div>
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white rounded-2xl border border-[#EAE3D6] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#38251F]">Penimbangan Kulit Segar Terakhir</h3>
                  <p className="text-xs text-[#282A27]/60 mt-0.5">Bukti timbang resmi yang dapat dicetak atau disimpan.</p>
                </div>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-semibold text-[#234A38] hover:underline"
                >
                  Lihat Semua Riwayat
                </button>
              </div>

              {farmerReceipts.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#282A27]/60 bg-[#F7F4ED] rounded-xl">
                  Belum ada catatan timbang penerimaan kulit kakao untuk akun ini.
                </div>
              ) : (
                <div className="divide-y divide-[#EAE3D6]">
                  {farmerReceipts.slice(0, 3).map((r) => (
                    <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#38251F]">{r.id}</span>
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {r.condition}
                          </span>
                        </div>
                        <p className="text-[#282A27]/70 font-mono">
                          {new Date(r.receiptDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[11px] text-[#282A27]/60 block">Netto Timbang</span>
                          <span className="font-mono font-bold text-[#234A38] text-sm tabular-nums">{r.netWeightKg} kg</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-[#282A27]/60 block">Nilai Transaksi</span>
                          <span className="font-mono font-bold text-[#38251F] text-sm tabular-nums">
                            Rp {r.totalAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedReceiptForPrint(r)}
                          title="Cetak Bukti Timbang"
                          className="p-2 bg-[#F7F4ED] hover:bg-[#EAE3D6] text-[#38251F] rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 2. RENCANA PENGIRIMAN --- */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE3D6]">
              <div>
                <h2 className="text-lg font-bold text-[#38251F]">Rencana Penyerahan Bahan Baku</h2>
                <p className="text-xs text-[#282A27]/70 mt-0.5">
                  Pengajuan rencana membantu tim CocoaCycle mengatur jadwal penjemputan dan kapasitas pos timbang.
                </p>
              </div>
              <button
                onClick={() => setShowPlanModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#234A38] text-white rounded-xl text-xs font-semibold hover:bg-[#1b3a2c]"
              >
                <Plus className="w-4 h-4" />
                Buat Rencana Kirim
              </button>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Ketentuan Rencana Pengajuan:</p>
                <p className="mt-0.5 text-amber-800">
                  Formulir ini merupakan rencana estimasi panen. Pembayaran dan bobot final dihitung berdasarkan
                  timbangan resmi di pos CocoaCycle dengan Bukti Timbang tercetak.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                    <tr>
                      <th className="py-3 px-4">No. Pengajuan</th>
                      <th className="py-3 px-4">Rencana Tanggal</th>
                      <th className="py-3 px-4 text-right">Estimasi Bobot</th>
                      <th className="py-3 px-4">Metode</th>
                      <th className="py-3 px-4">Titik Penyerahan</th>
                      <th className="py-3 px-4 text-center">Status Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D6]">
                    {farmerPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{plan.id}</td>
                        <td className="py-3 px-4 font-mono">{plan.plannedDate}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#234A38] tabular-nums">
                          {plan.estimatedWeightKg} kg
                        </td>
                        <td className="py-3 px-4 capitalize font-medium">{plan.deliveryMethod}</td>
                        <td className="py-3 px-4 text-[#282A27]/80">{plan.locationNotes}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            plan.status === 'Disetujui'
                              ? 'bg-emerald-100 text-emerald-800'
                              : plan.status === 'Telah Tiba'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. RIWAYAT TRANSAKSI --- */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#EAE3D6]">
              <h2 className="text-lg font-bold text-[#38251F]">Riwayat Penimbangan & Bukti Timbang</h2>
              <p className="text-xs text-[#282A27]/70 mt-0.5">
                Daftar transaksi penyerahan kulit kakao segar yang telah diverifikasi tim penimbang CocoaCycle.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                    <tr>
                      <th className="py-3 px-4">No. Timbang</th>
                      <th className="py-3 px-4">Tanggal Timbang</th>
                      <th className="py-3 px-4 text-right">Bruto (kg)</th>
                      <th className="py-3 px-4 text-right">Tara (kg)</th>
                      <th className="py-3 px-4 text-right">Netto Bersih (kg)</th>
                      <th className="py-3 px-4 text-right">Harga / kg</th>
                      <th className="py-3 px-4 text-right">Total Transaksi</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D6]">
                    {farmerReceipts.map((r) => (
                      <tr key={r.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{r.id}</td>
                        <td className="py-3 px-4 font-mono text-[#282A27]/70">
                          {new Date(r.receiptDate).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">{r.grossWeightKg}</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-700">-{r.tareWeightKg}</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#234A38] text-sm">
                          {r.netWeightKg} kg
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">Rp {r.pricePerKg}</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#38251F]">
                          Rp {r.totalAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedReceiptForPrint(r)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F4ED] hover:bg-[#EAE3D6] text-[#38251F] font-semibold rounded-lg transition-colors text-[11px] mx-auto"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak Bukti Timbang
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 4. PEMBAYARAN & SALDO --- */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#EAE3D6]">
              <h2 className="text-lg font-bold text-[#38251F]">Status Pembayaran & Bukti Transfer</h2>
              <p className="text-xs text-[#282A27]/70 mt-0.5">
                Monitoring penyelesaian hak pembayaran petani per transaksi penimbangan.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                    <tr>
                      <th className="py-3 px-4">ID Pembayaran</th>
                      <th className="py-3 px-4">Ref Timbang</th>
                      <th className="py-3 px-4 text-right">Total Transaksi</th>
                      <th className="py-3 px-4 text-right">Sudah Ditransfer</th>
                      <th className="py-3 px-4 text-right">Sisa Pembayaran</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4">Bukti Referensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D6]">
                    {farmerPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{p.id}</td>
                        <td className="py-3 px-4 font-mono text-[#234A38]">{p.receiptId}</td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          Rp {p.totalOwed.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700 font-semibold">
                          Rp {p.totalPaid.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-amber-800">
                          Rp {p.remainingAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            p.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[#282A27]/80">
                          {p.paymentReference || 'Dalam antrean verifikasi perbankan'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 5. PROFIL KEBUN --- */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-[#EAE3D6] p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#38251F]">Informasi Profil Petani & Kebun</h3>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Nama Pemilik</span>
                <span className="font-bold text-sm text-[#38251F]">{currentUser?.name}</span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Nomor WhatsApp</span>
                <span className="font-mono font-medium">{currentUser?.phone}</span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Nama Perkebunan</span>
                <span className="font-semibold text-[#234A38]">{currentUser?.farmerProfile?.farmName}</span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Kabupaten / Wilayah</span>
                <span>{currentUser?.farmerProfile?.regency}, {currentUser?.farmerProfile?.province}</span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Estimasi Pasokan Rutin</span>
                <span className="font-mono font-bold text-[#234A38]">
                  {currentUser?.farmerProfile?.weeklyVolumeEstimateKg} kg / pekan
                </span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Metode Pengiriman Pilihan</span>
                <span className="capitalize">{currentUser?.farmerProfile?.preferredMethod}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EAE3D6]">
              <span className="text-[#282A27]/60 block text-[11px]">Alamat Kebun:</span>
              <p className="text-[#282A27]/80 mt-1">{currentUser?.farmerProfile?.address}</p>
            </div>
          </div>
        )}
      </main>

      {/* Modal Buat Rencana Kirim */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EAE3D6] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3D6]">
              <h3 className="font-bold text-base text-[#38251F]">Ajukan Rencana Pengiriman Kulit Kakao</h3>
              <button onClick={() => setShowPlanModal(false)} className="text-[#282A27]/50 hover:text-[#282A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlanSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Perkiraan Tanggal Kirim</label>
                <input
                  type="date"
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Perkiraan Berat Kulit Segar (kg)</label>
                <input
                  type="number"
                  value={estKg}
                  onChange={(e) => setEstKg(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Kondisi Bahan</label>
                  <select
                    value={rawCondition}
                    onChange={(e) => setRawCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE3D6]"
                  >
                    <option value="Segar Baru Petik">Segar Baru Petik</option>
                    <option value="Lembap Sedang">Lembap Sedang</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Metode Penyerahan</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE3D6]"
                  >
                    <option value="diantar">Diantar Sendiri ke Pos</option>
                    <option value="penjemputan">Minta Penjemputan Armada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Titik Lokasi / Pos Timbang</label>
                <input
                  type="text"
                  value={locationNotes}
                  onChange={(e) => setLocationNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Catatan Tambahan untuk Petugas</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Diantar pagi hari sekitar jam 08:30"
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b]"
                >
                  Kirim Pengajuan Rencana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Weigh Ticket Modal */}
      <WeighTicketModal
        receipt={selectedReceiptForPrint}
        onClose={() => setSelectedReceiptForPrint(null)}
      />
    </div>
  );
};
