import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
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
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Printer,
  ChevronRight,
  TrendingUp,
  Download,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';
import {
  RawMaterialReceipt,
  ProductionBatch,
  QualityInspection,
  BatchStatus,
  OrderStatus,
} from '../../types';
import { WeighTicketModal } from '../common/WeighTicketModal';
import { InvoiceModal } from '../common/InvoiceModal';

// --- TAB 1: MAIN DASHBOARD ---
export const AdminDashboardView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { receipts, batches, inventory, orders, qcInspections, supplierPayments } = useApp();

  const totalFreshWeightKg = receipts.reduce((acc, r) => acc + r.netWeightKg, 0);
  const totalDriedAvailableKg = inventory.reduce((acc, i) => acc + i.availableWeightKg, 0);
  const activeBatchesCount = batches.filter((b) => b.status !== 'Selesai' && b.status !== 'Dikarantina').length;
  const pendingOrdersCount = orders.filter((o) => o.status !== 'Selesai' && o.status !== 'Dibatalkan').length;

  const pendingQC = batches.filter((b) => b.status === 'Menunggu QC');
  const pendingFarmerPayments = supplierPayments.filter((p) => p.status === 'Menunggu' || p.status === 'Sebagian Dibayar');

  return (
    <div className="space-y-6">
      {/* Top Greeting & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE3D6]">
        <div>
          <h2 className="text-xl font-bold text-[#38251F]">Pusat Kendali Operasional & Rantai Pasok</h2>
          <p className="text-xs text-[#282A27]/70 mt-0.5">
            Monitoring penimbangan, siklus pengeringan, mutu kadar air, dan pesanan industri.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('receipts')}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#234A38] text-white rounded-xl text-xs font-semibold hover:bg-[#1b3a2c] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Catat Penerimaan Baru
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EAE3D6] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#282A27]/60">
            <span>Kulit Segar Diterima</span>
            <Scale className="w-4 h-4 text-[#234A38]" />
          </div>
          <div className="text-2xl font-extrabold text-[#38251F] font-mono tabular-nums">
            {totalFreshWeightKg.toLocaleString('id-ID')} <span className="text-xs font-normal">kg</span>
          </div>
          <p className="text-[11px] text-[#282A27]/50 font-mono">Total {receipts.length} transaksi timbang</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EAE3D6] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#282A27]/60">
            <span>Produk Kering Siap Jual</span>
            <Package className="w-4 h-4 text-[#84936A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#234A38] font-mono tabular-nums">
            {totalDriedAvailableKg.toLocaleString('id-ID')} <span className="text-xs font-normal">kg</span>
          </div>
          <p className="text-[11px] text-[#282A27]/50 font-mono">Tersedia di gudang komersial</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EAE3D6] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#282A27]/60">
            <span>Batch Sedang Berjalan</span>
            <Layers className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-extrabold text-[#38251F] font-mono tabular-nums">
            {activeBatchesCount} <span className="text-xs font-normal">batch</span>
          </div>
          <p className="text-[11px] text-[#282A27]/50 font-mono">Tahap cacah & pengeringan</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#EAE3D6] space-y-1">
          <div className="flex items-center justify-between text-xs text-[#282A27]/60">
            <span>Pesanan Belum Selesai</span>
            <ShoppingCart className="w-4 h-4 text-[#234A38]" />
          </div>
          <div className="text-2xl font-extrabold text-[#38251F] font-mono tabular-nums">
            {pendingOrdersCount} <span className="text-xs font-normal">pesanan</span>
          </div>
          <p className="text-[11px] text-[#282A27]/50 font-mono">Memerlukan penyiapan/kirim</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Stock by Grade */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE3D6] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#38251F]">Komposisi Stok per Grade</h3>
            <span className="text-xs text-[#282A27]/50 font-mono">Gudang Aktif</span>
          </div>
          <div className="space-y-3 pt-1">
            {['Grade A', 'Grade B', 'Grade C'].map((grade) => {
              const items = inventory.filter((i) => i.grade === grade);
              const total = items.reduce((a, b) => a + b.availableWeightKg, 0);
              const maxScale = Math.max(1, totalDriedAvailableKg);
              const percentage = Math.round((total / maxScale) * 100);
              const color =
                grade === 'Grade A' ? 'bg-[#234A38]' : grade === 'Grade B' ? 'bg-[#84936A]' : 'bg-[#C49A6C]';

              return (
                <div key={grade} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#38251F]">{grade}</span>
                    <span className="font-mono tabular-nums text-[#282A27]/80">
                      {total.toLocaleString('id-ID')} kg ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#F7F4ED] rounded-full overflow-hidden">
                    <div className={`h-full ${color}`} style={{ width: `${Math.min(100, percentage)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-2 border-t border-[#EAE3D6] text-[11px] text-[#282A27]/60">
            Kadar air Grade A: &le;10% · Grade B: &gt;10-14% · Grade C: &gt;14-18%
          </div>
        </div>

        {/* Action Priority Queue */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE3D6] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#38251F]">Antrean Perhatian Segera</h3>
            <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-semibold">
              {pendingQC.length + pendingFarmerPayments.length} Tertunda
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {pendingQC.length > 0 ? (
              <div
                onClick={() => onNavigate('qc')}
                className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 cursor-pointer hover:bg-amber-100/60 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <FlaskConical className="w-4 h-4 text-amber-800 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-900">{pendingQC.length} Batch Menunggu QC</p>
                    <p className="text-[11px] text-amber-800/80">Perlu uji kadar air & inspeksi jamur</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-800" />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#F7F4ED] border border-[#EAE3D6] text-[#282A27]/60 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#234A38]" />
                <span>Seluruh batch telah diuji mutu QC.</span>
              </div>
            )}

            {pendingFarmerPayments.length > 0 ? (
              <div
                onClick={() => onNavigate('payments')}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#38251F] shrink-0" />
                  <div>
                    <p className="font-semibold text-[#38251F]">{pendingFarmerPayments.length} Pembayaran Petani</p>
                    <p className="text-[11px] text-[#282A27]/70">Penerimaan telah timbang belum lunas</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#282A27]/60" />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#F7F4ED] border border-[#EAE3D6] text-[#282A27]/60 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#234A38]" />
                <span>Kewajiban petani dalam status lunas.</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Alert */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE3D6] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#38251F]">Pesanan B2B Terbaru</h3>
            <button onClick={() => onNavigate('orders')} className="text-xs text-[#234A38] font-semibold hover:underline">
              Semua Pesanan
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 3).map((o) => (
              <div key={o.id} className="p-2.5 rounded-xl bg-[#F7F4ED] border border-[#EAE3D6] flex justify-between items-center text-xs">
                <div>
                  <div className="font-semibold text-[#38251F] line-clamp-1">{o.companyName}</div>
                  <div className="text-[11px] text-[#282A27]/60 font-mono">
                    {o.quantityKg} kg {o.grade} · Rp {o.totalAmount.toLocaleString('id-ID')}
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  o.status === 'Selesai'
                    ? 'bg-emerald-100 text-emerald-800'
                    : o.status === 'Disiapkan'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TAB 2: PENERIMAAN PASOKAN ---
export const ReceiptManagementView: React.FC = () => {
  const { receipts, users, addReceipt, confirmReceipt } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReceiptForPrint, setSelectedReceiptForPrint] = useState<RawMaterialReceipt | null>(null);
  const [filterText, setFilterText] = useState('');

  // Form state
  const farmers = users.filter((u) => u.role === 'farmer');
  const [farmerId, setFarmerId] = useState(farmers[0]?.id || '');
  const [grossKg, setGrossKg] = useState('850');
  const [tareKg, setTareKg] = useState('30');
  const [pricePerKg, setPricePerKg] = useState('100'); // Rp 100 / kg segar sesuai BMC
  const [condition, setCondition] = useState<RawMaterialReceipt['condition']>('Segar Baru Panen');
  const [contamination, setContamination] = useState('Bebas kontaminasi tanah, bersih dan segar');
  const [notes, setNotes] = useState('Diterima di Pos Timbang Sentral');

  const netKg = Math.max(0, Number(grossKg) - Number(tareKg));
  const totalAmount = netKg * Number(pricePerKg);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedFarmer = users.find((u) => u.id === farmerId);
    if (!selectedFarmer) return;

    const newReceipt = addReceipt({
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerLocation: selectedFarmer.farmerProfile?.regency || 'Tabanan, Bali',
      receiptDate: new Date().toISOString(),
      grossWeightKg: Number(grossKg),
      tareWeightKg: Number(tareKg),
      netWeightKg: netKg,
      pricePerKg: Number(pricePerKg),
      condition,
      contaminationNotes: contamination,
      notes,
      handledBy: 'Budi Santoso',
    });

    setShowAddModal(false);
    setSelectedReceiptForPrint(newReceipt);
  };

  const filteredReceipts = receipts.filter(
    (r) =>
      r.id.toLowerCase().includes(filterText.toLowerCase()) ||
      r.farmerName.toLowerCase().includes(filterText.toLowerCase()) ||
      r.farmerLocation.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE3D6]">
        <div>
          <h2 className="text-xl font-bold text-[#38251F]">Pencatatan Penerimaan Bahan Baku Segar</h2>
          <p className="text-xs text-[#282A27]/70 mt-0.5">
            Pencatatan timbang digital, verifikasi tara-netto, dan penerbitan bukti timbang resmi petani.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#234A38] text-white rounded-xl text-xs font-semibold hover:bg-[#1b3a2c] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Penerimaan Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#282A27]/40" />
          <input
            type="text"
            placeholder="Cari berdasarkan No. Timbang, nama petani, lokasi..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-[#EAE3D6] text-xs focus:outline-none focus:border-[#234A38]"
          />
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
              <tr>
                <th className="py-3 px-4">No. Penerimaan</th>
                <th className="py-3 px-4">Petani / Pemasok</th>
                <th className="py-3 px-4">Waktu Timbang</th>
                <th className="py-3 px-4 text-right">Bruto (kg)</th>
                <th className="py-3 px-4 text-right">Tara (kg)</th>
                <th className="py-3 px-4 text-right">Netto (kg)</th>
                <th className="py-3 px-4 text-right">Nilai Pembelian</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6]">
              {filteredReceipts.map((rcp) => (
                <tr key={rcp.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{rcp.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#282A27]">{rcp.farmerName}</div>
                    <div className="text-[11px] text-[#282A27]/60">{rcp.farmerLocation}</div>
                  </td>
                  <td className="py-3 px-4 text-[#282A27]/70 font-mono">
                    {new Date(rcp.receiptDate).toLocaleDateString('id-ID', { dateStyle: 'short' })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{rcp.grossWeightKg}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-700">-{rcp.tareWeightKg}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#234A38]">
                    {rcp.netWeightKg}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#38251F]">
                    Rp {rcp.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      rcp.status === 'dikonfirmasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rcp.status === 'dikonfirmasi' ? 'Terkonfirmasi' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {rcp.status === 'draft' && (
                        <button
                          onClick={() => confirmReceipt(rcp.id)}
                          className="px-2 py-1 bg-[#234A38] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1a382b]"
                        >
                          Konfirmasi
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReceiptForPrint(rcp)}
                        title="Cetak Bukti Timbang"
                        className="p-1.5 bg-[#F7F4ED] hover:bg-[#EAE3D6] text-[#38251F] rounded-lg transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Receipt */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EAE3D6] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3D6]">
              <h3 className="font-bold text-base text-[#38251F]">Formulir Timbang Kulit Kakao Segar</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#282A27]/50 hover:text-[#282A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Pilih Petani / Pemasok</label>
                <select
                  value={farmerId}
                  onChange={(e) => setFarmerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE3D6]"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.farmerProfile?.regency || 'Petani'}) - {f.farmerProfile?.farmName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Berat Kotor / Bruto (kg)</label>
                  <input
                    type="number"
                    value={grossKg}
                    onChange={(e) => setGrossKg(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Berat Wadah / Tara (kg)</label>
                  <input
                    type="number"
                    value={tareKg}
                    onChange={(e) => setTareKg(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F7F4ED] rounded-xl border border-[#EAE3D6] flex justify-between items-center font-mono">
                <span className="text-[#282A27]/70 font-sans">Berat Bersih Dihitung (Netto):</span>
                <span className="text-base font-bold text-[#234A38] tabular-nums">{netKg} kg</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Harga Beli / kg (Rp)</label>
                  <input
                    type="number"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Total Nilai Pembelian</label>
                  <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-[#38251F]">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Kondisi Fisik Kulit Buah</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE3D6]"
                >
                  <option value="Segar Baru Panen">Segar Baru Panen (&lt; 24 Jam)</option>
                  <option value="Layak Olah">Layak Olah (1–2 Hari)</option>
                  <option value="Lembap Sedang">Lembap Sedang</option>
                  <option value="Kering Awal">Kering Awal</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Catatan Sortasi / Kontaminasi</label>
                <input
                  type="text"
                  value={contamination}
                  onChange={(e) => setContamination(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b]"
                >
                  Simpan Penerimaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bukti Timbang Modal */}
      <WeighTicketModal
        receipt={selectedReceiptForPrint}
        onClose={() => setSelectedReceiptForPrint(null)}
      />
    </div>
  );
};

// --- TAB 3: BATCH PRODUKSI ---
export const BatchProductionView: React.FC<{ onNavigateToQC: () => void }> = ({ onNavigateToQC }) => {
  const { batches, receipts, createBatch, updateBatchStep } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBatchForDetail, setSelectedBatchForDetail] = useState<ProductionBatch | null>(null);

  // Available unbatched receipts
  const availableReceipts = receipts.filter((r) => r.status === 'dikonfirmasi' && !r.batchId);

  // Form state
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<string[]>([]);
  const [supervisor, setSupervisor] = useState('Budi Santoso');
  const [location, setLocation] = useState('Lantai Sortasi & Pencacahan Unit 1');

  // Updating batch step state
  const [updateModalBatch, setUpdateModalBatch] = useState<ProductionBatch | null>(null);
  const [newStatus, setNewStatus] = useState<BatchStatus>('Pencacahan');
  const [driedWeight, setDriedWeight] = useState('');
  const [stepNotes, setStepNotes] = useState('');

  const totalInputWeight = receipts
    .filter((r) => selectedReceiptIds.includes(r.id))
    .reduce((a, b) => a + b.netWeightKg, 0);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReceiptIds.length === 0) {
      alert('Pilih minimal satu penerimaan bahan baku terkonfirmasi.');
      return;
    }
    createBatch(totalInputWeight, selectedReceiptIds, supervisor, location);
    setShowCreateModal(false);
    setSelectedReceiptIds([]);
  };

  const handleUpdateStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateModalBatch) return;

    updateBatchStep(
      updateModalBatch.id,
      newStatus,
      driedWeight ? Number(driedWeight) : undefined,
      stepNotes
    );
    setUpdateModalBatch(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE3D6]">
        <div>
          <h2 className="text-xl font-bold text-[#38251F]">Manajemen Batch Pengolahan Kulit Kakao</h2>
          <p className="text-xs text-[#282A27]/70 mt-0.5">
            Pelacakan alur: Baru Diterima &rarr; Pencacahan &rarr; Pengeringan &rarr; Menunggu QC &rarr; Selesai.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#234A38] text-white rounded-xl text-xs font-semibold hover:bg-[#1b3a2c] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Mulai Batch Baru
        </button>
      </div>

      {/* Batches Grid / Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
              <tr>
                <th className="py-3 px-4">ID Batch</th>
                <th className="py-3 px-4">Tanggal Mulai</th>
                <th className="py-3 px-4 text-right">Berat Awal (kg)</th>
                <th className="py-3 px-4 text-right">Berat Kering (kg)</th>
                <th className="py-3 px-4 text-right">Rendemen (%)</th>
                <th className="py-3 px-4 text-center">Status Tahapan</th>
                <th className="py-3 px-4 text-center">Grade Terverifikasi</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6]">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{b.id}</td>
                  <td className="py-3 px-4 font-mono text-[#282A27]/70">
                    {new Date(b.startDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{b.initialWeightKg}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#234A38]">
                    {b.driedWeightKg || b.currentWeightKg || '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-[#84936A] font-bold">
                    {b.yieldPercentage ? `${b.yieldPercentage}%` : '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      b.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'Dikarantina'
                        ? 'bg-red-100 text-red-800'
                        : b.status === 'Menunggu QC'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-50 text-blue-800'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {b.assignedGrade ? (
                      <span className={`text-[11px] font-bold ${b.assignedGrade === 'Grade A' ? 'text-emerald-800' : b.assignedGrade === 'Grade B' ? 'text-[#84936A]' : 'text-amber-800'}`}>
                        {b.assignedGrade} ({b.moistureContentPercent}%)
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#282A27]/40">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          setUpdateModalBatch(b);
                          setNewStatus(b.status);
                          setDriedWeight(b.driedWeightKg ? String(b.driedWeightKg) : '');
                          setStepNotes(b.notes || '');
                        }}
                        className="px-2.5 py-1 bg-[#F7F4ED] hover:bg-[#EAE3D6] text-[#38251F] text-[11px] font-semibold rounded-lg transition-colors"
                      >
                        Ubah Tahap
                      </button>
                      {b.status === 'Menunggu QC' && (
                        <button
                          onClick={onNavigateToQC}
                          className="px-2.5 py-1 bg-[#234A38] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1a382b]"
                        >
                          Uji QC
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create Batch */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EAE3D6] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3D6]">
              <h3 className="font-bold text-base text-[#38251F]">Inisiasi Batch Pengolahan Baru</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#282A27]/50 hover:text-[#282A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#38251F] mb-1">
                  Pilih Bahan Baku Penerimaan yang Belum Diproses:
                </label>
                {availableReceipts.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-800 text-[11px]">
                    Tidak ada penerimaan terkonfirmasi yang belum dialokasikan ke batch. Silakan catat penerimaan baru terlebih dahulu.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 bg-[#F7F4ED] rounded-xl border border-[#EAE3D6]">
                    {availableReceipts.map((r) => (
                      <label key={r.id} className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedReceiptIds.includes(r.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReceiptIds([...selectedReceiptIds, r.id]);
                            } else {
                              setSelectedReceiptIds(selectedReceiptIds.filter((id) => id !== r.id));
                            }
                          }}
                          className="rounded border-[#EAE3D6] text-[#234A38]"
                        />
                        <span className="font-mono font-semibold">{r.id}</span>
                        <span>· {r.farmerName}</span>
                        <span className="font-mono text-[#234A38] font-bold ml-auto tabular-nums">{r.netWeightKg} kg</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#F7F4ED] rounded-xl flex justify-between items-center font-mono">
                <span className="text-[#282A27]/70 font-sans">Total Bobot Awal Bahan:</span>
                <span className="text-base font-bold text-[#38251F] tabular-nums">{totalInputWeight} kg</span>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Penanggung Jawab / Supervisor</label>
                <input
                  type="text"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Lokasi Fasilitas Penjemuran</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={availableReceipts.length === 0}
                  className="px-4 py-2 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b] disabled:opacity-50"
                >
                  Mulai Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Update Batch Step */}
      {updateModalBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EAE3D6] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3D6]">
              <div>
                <h3 className="font-bold text-base text-[#38251F]">Update Status Batch</h3>
                <p className="text-[11px] text-[#282A27]/60 font-mono">ID: {updateModalBatch.id}</p>
              </div>
              <button onClick={() => setUpdateModalBatch(null)} className="text-[#282A27]/50 hover:text-[#282A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStep} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Status Tahapan Saat Ini</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE3D6]"
                >
                  <option value="Baru Diterima">Baru Diterima</option>
                  <option value="Menunggu Pengolahan">Menunggu Pengolahan</option>
                  <option value="Pencacahan">Pencacahan (Shredding)</option>
                  <option value="Pengeringan">Pengeringan (Solar & Hybrid Dryer)</option>
                  <option value="Menunggu QC">Menunggu QC (Kering & Siap Uji)</option>
                  <option value="Selesai">Selesai (Telah Masuk Gudang)</option>
                  <option value="Dikarantina">Dikarantina (Tolak)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">
                  Bobot Hasil Kering Aktual (kg)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 185"
                  value={driedWeight}
                  onChange={(e) => setDriedWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
                <p className="text-[10px] text-[#282A27]/60 mt-1">
                  *Rendemen otomatis dihitung berdasarkan perbandingan dengan bobot awal {updateModalBatch.initialWeightKg} kg.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Catatan Operasional / Suhu Pengeringan</label>
                <textarea
                  rows={2}
                  value={stepNotes}
                  onChange={(e) => setStepNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUpdateModalBatch(null)}
                  className="px-4 py-2 border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- TAB 4: QUALITY CONTROL & GRADING ---
export const QualityControlView: React.FC = () => {
  const { qcInspections, batches, submitQCInspection } = useApp();
  const [showQCForm, setShowQCForm] = useState(false);

  // Form State
  const pendingBatches = batches.filter((b) => b.status === 'Menunggu QC' || b.status === 'Pengeringan');
  const [selectedBatchId, setSelectedBatchId] = useState(pendingBatches[0]?.id || batches[0]?.id || '');
  const [inspectorName, setInspectorName] = useState('Ir. Ahmad Zaelani');
  const [moisturePercent, setMoisturePercent] = useState('9.4');
  const [cleanliness, setCleanliness] = useState<QualityInspection['cleanlinessScore']>('Sangat Bersih');
  const [shredUniformity, setShredUniformity] = useState<QualityInspection['shredUniformity']>('Seragam (10-15mm)');
  const [moldDetected, setMoldDetected] = useState(false);
  const [notes, setNotes] = useState('Uji kadar air stabil menggunakan moisture meter halogen terkalibrasi.');

  const handleSubmitQC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;

    submitQCInspection({
      batchId: selectedBatchId,
      inspectionDate: new Date().toISOString(),
      inspectorName,
      moisturePercent: Number(moisturePercent),
      cleanlinessScore: cleanliness,
      shredUniformity,
      moldDetected,
      notes,
    });

    setShowQCForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE3D6]">
        <div>
          <h2 className="text-xl font-bold text-[#38251F]">Pengendalian Mutu & Verifikasi Grading (QC)</h2>
          <p className="text-xs text-[#282A27]/70 mt-0.5">
            Aturan Mutu: Grade A (&le;10%), Grade B (&gt;10-14%), Grade C (&gt;14-18%). Jamur otomatis karantina.
          </p>
        </div>
        <button
          onClick={() => setShowQCForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#234A38] text-white rounded-xl text-xs font-semibold hover:bg-[#1b3a2c] transition-colors shadow-xs"
        >
          <FlaskConical className="w-4 h-4" />
          Input Uji Mutu Baru
        </button>
      </div>

      {/* QC Rules Notice Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-[#EAE3D6] space-y-1">
          <span className="font-bold text-[#234A38]">Grade A (Kadar Air &le; 10%)</span>
          <p className="text-[11px] text-[#282A27]/70">Warna cokelat keemasan, cacahan 10-15mm seragam, bebas jamur.</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#EAE3D6] space-y-1">
          <span className="font-bold text-[#84936A]">Grade B (&gt; 10% - 14%)</span>
          <p className="text-[11px] text-[#282A27]/70">Optimal untuk formulasi kompos & fermentasi aktif.</p>
        </div>
        <div className="p-3 rounded-xl bg-white border border-[#EAE3D6] space-y-1">
          <span className="font-bold text-[#38251F]">Grade C (&gt; 14% - 18%)</span>
          <p className="text-[11px] text-[#282A27]/70">Hanya ditawarkan jika pembeli menerima spesifikasi fleksibel.</p>
        </div>
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-1">
          <span className="font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
            Karantina Wajib
          </span>
          <p className="text-[11px] text-red-800/80">Jamur terdeteksi atau kadar air &gt;18% dilarang diperjualbelikan.</p>
        </div>
      </div>

      {/* QC Inspections List */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
              <tr>
                <th className="py-3 px-4">No. QC</th>
                <th className="py-3 px-4">ID Batch</th>
                <th className="py-3 px-4">Tanggal Uji</th>
                <th className="py-3 px-4">Petugas Penguji</th>
                <th className="py-3 px-4 text-right">Kadar Air Digital</th>
                <th className="py-3 px-4 text-center">Status Jamur</th>
                <th className="py-3 px-4 text-center">Hasil Keputusan</th>
                <th className="py-3 px-4">Catatan Laboratorium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6]">
              {qcInspections.map((qc) => (
                <tr key={qc.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{qc.id}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#234A38]">{qc.batchId}</td>
                  <td className="py-3 px-4 font-mono text-[#282A27]/70">
                    {new Date(qc.inspectionDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4 font-medium">{qc.inspectorName}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-base text-[#234A38]">
                    {qc.moisturePercent}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    {qc.moldDetected ? (
                      <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                        Positif Jamur
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Nol Jamur (Aman)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      qc.resultGrade === 'Grade A'
                        ? 'bg-emerald-100 text-emerald-900'
                        : qc.resultGrade === 'Grade B'
                        ? 'bg-[#84936A]/20 text-[#234A38]'
                        : qc.resultGrade === 'Grade C'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-red-100 text-red-900'
                    }`}>
                      {qc.qcDecision}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#282A27]/80 text-[11px] max-w-xs">{qc.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form QC */}
      {showQCForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EAE3D6] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3D6]">
              <h3 className="font-bold text-base text-[#38251F]">Formulir Uji Laboratorium Mutu Batch</h3>
              <button onClick={() => setShowQCForm(false)} className="text-[#282A27]/50 hover:text-[#282A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitQC} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Pilih Batch yang Diuji</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE3D6]"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.id} ({b.status}) - Awal: {b.initialWeightKg} kg / Kering: {b.driedWeightKg || b.currentWeightKg} kg
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Hasil Uji Kadar Air (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6] font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Nama Petugas QC</label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Tingkat Kebersihan</label>
                  <select
                    value={cleanliness}
                    onChange={(e) => setCleanliness(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE3D6]"
                  >
                    <option value="Sangat Bersih">Sangat Bersih</option>
                    <option value="Bersih">Bersih</option>
                    <option value="Toleransi Debu Rendah">Toleransi Debu Rendah</option>
                    <option value="Tercemar">Tercemar (Tolak)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#38251F] mb-1">Keseragaman Cacahan</label>
                  <select
                    value={shredUniformity}
                    onChange={(e) => setShredUniformity(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE3D6]"
                  >
                    <option value="Seragam (10-15mm)">Seragam (10-15mm)</option>
                    <option value="Cukup Seragam">Cukup Seragam</option>
                    <option value="Kasar Tidak Rata">Kasar Tidak Rata</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-red-50/70 rounded-xl border border-red-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-red-900">
                  <input
                    type="checkbox"
                    checked={moldDetected}
                    onChange={(e) => setMoldDetected(e.target.checked)}
                    className="rounded border-red-300 text-red-700"
                  />
                  <span>Terdeteksi Tanda Jamur / Spora Fungi</span>
                </label>
                <p className="text-[11px] text-red-700/80 mt-1 pl-5">
                  Jika dicentang, batch ini secara otomatis dikarantina & stok tidak akan masuk ke katalog penjualan.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Catatan Hasil Pengujian</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQCForm(false)}
                  className="px-4 py-2 border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b]"
                >
                  Verifikasi & Simpan Hasil QC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- TAB 5: INVENTARIS ---
export const InventoryManagementView: React.FC = () => {
  const { inventory, movements } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'stock' | 'movements'>('stock');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE3D6]">
        <div>
          <h2 className="text-xl font-bold text-[#38251F]">Inventaris & Mutasi Stok Bahan Baku Kering</h2>
          <p className="text-xs text-[#282A27]/70 mt-0.5">
            Pemisahan ketat stok tersedia, stok teralokasi pesanan, dan riwayat mutasi masuk/keluar.
          </p>
        </div>

        {/* Segmented Controls */}
        <div className="flex p-1 bg-[#F7F4ED] rounded-xl border border-[#EAE3D6] self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('stock')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'stock' ? 'bg-white text-[#234A38] shadow-xs' : 'text-[#282A27]/70'
            }`}
          >
            Stok Gudang
          </button>
          <button
            onClick={() => setActiveSubTab('movements')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSubTab === 'movements' ? 'bg-white text-[#234A38] shadow-xs' : 'text-[#282A27]/70'
            }`}
          >
            Riwayat Mutasi
          </button>
        </div>
      </div>

      {activeSubTab === 'stock' ? (
        <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                <tr>
                  <th className="py-3 px-4">Item ID</th>
                  <th className="py-3 px-4">Batch Asal</th>
                  <th className="py-3 px-4">Klasifikasi Grade</th>
                  <th className="py-3 px-4 text-right">Kadar Air</th>
                  <th className="py-3 px-4 text-right">Total Stok (kg)</th>
                  <th className="py-3 px-4 text-right">Dialokasikan (kg)</th>
                  <th className="py-3 px-4 text-right">Tersedia Dijual (kg)</th>
                  <th className="py-3 px-4 text-right">Harga Patokan / kg</th>
                  <th className="py-3 px-4">Lokasi Silo/Rak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6]">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{item.id}</td>
                    <td className="py-3 px-4 font-mono text-[#234A38]">{item.batchId}</td>
                    <td className="py-3 px-4 font-semibold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        item.grade === 'Grade A'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.grade === 'Grade B'
                          ? 'bg-[#84936A]/20 text-[#234A38]'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{item.moisturePercent}%</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">{item.totalWeightKg}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-800">
                      {item.allocatedWeightKg}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#234A38] text-sm">
                      {item.availableWeightKg}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      Rp {item.pricePerKg.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-[#282A27]/70">{item.locationBin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                <tr>
                  <th className="py-3 px-4">ID Mutasi</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Tipe Mutasi</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4 text-right">Jumlah (kg)</th>
                  <th className="py-3 px-4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6]">
                {movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{mov.id}</td>
                    <td className="py-3 px-4 font-mono text-[#282A27]/70">
                      {new Date(mov.date).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        mov.type === 'Masuk QC'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mov.type === 'Alokasi Pesanan'
                          ? 'bg-blue-100 text-blue-800'
                          : mov.type === 'Pengiriman Keluar'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {mov.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{mov.batchId}</td>
                    <td className="py-3 px-4 font-semibold">{mov.grade}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                      {mov.quantityKg} kg
                    </td>
                    <td className="py-3 px-4 text-[#282A27]/80 text-[11px]">{mov.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// --- TAB 6: MANAJEMEN PETANI ---
export const FarmerManagementView: React.FC = () => {
  const { users, receipts, updateUserStatus } = useApp();
  const farmers = users.filter((u) => u.role === 'farmer');

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#EAE3D6]">
        <h2 className="text-xl font-bold text-[#38251F]">Manajemen Mitra Petani Kakao</h2>
        <p className="text-xs text-[#282A27]/70 mt-0.5">
          Data petani pemasok perorangan, lokasi kebun, volume pasokan, dan status verifikasi akun.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
              <tr>
                <th className="py-3 px-4">Nama Petani</th>
                <th className="py-3 px-4">Kontak / Telepon</th>
                <th className="py-3 px-4">Nama Kebun & Lokasi</th>
                <th className="py-3 px-4 text-right">Estimasi Volume (kg/mgg)</th>
                <th className="py-3 px-4 text-right">Total Pasokan Tercatat</th>
                <th className="py-3 px-4 text-center">Status Verifikasi</th>
                <th className="py-3 px-4 text-center">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6]">
              {farmers.map((farmer) => {
                const farmerReceipts = receipts.filter((r) => r.farmerId === farmer.id);
                const totalKgSupplied = farmerReceipts.reduce((a, b) => a + b.netWeightKg, 0);

                return (
                  <tr key={farmer.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#38251F]">{farmer.name}</div>
                      <div className="text-[11px] text-[#282A27]/60 font-mono">{farmer.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#282A27]/80">{farmer.phone}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#234A38]">{farmer.farmerProfile?.farmName}</div>
                      <div className="text-[11px] text-[#282A27]/60">{farmer.farmerProfile?.regency}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {farmer.farmerProfile?.weeklyVolumeEstimateKg} kg
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#234A38]">
                      {totalKgSupplied} kg ({farmerReceipts.length}x kirim)
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        farmer.status === 'aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : farmer.status === 'menunggu_verifikasi'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {farmer.status === 'aktif'
                          ? 'Terverifikasi'
                          : farmer.status === 'menunggu_verifikasi'
                          ? 'Menunggu Verifikasi'
                          : 'Ditolak'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {farmer.status === 'menunggu_verifikasi' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => updateUserStatus(farmer.id, 'aktif')}
                            className="px-2.5 py-1 bg-[#234A38] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1a382b]"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => updateUserStatus(farmer.id, 'ditolak')}
                            className="px-2.5 py-1 bg-red-50 text-red-700 text-[11px] font-semibold rounded-lg hover:bg-red-100"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#282A27]/40">Aktif</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- TAB 7: MANAJEMEN PEMBELI B2B ---
export const BuyerManagementView: React.FC = () => {
  const { users, orders } = useApp();
  const buyers = users.filter((u) => u.role === 'buyer');

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#EAE3D6]">
        <h2 className="text-xl font-bold text-[#38251F]">Manajemen Pembeli Industri B2B</h2>
        <p className="text-xs text-[#282A27]/70 mt-0.5">
          Daftar perusahaan manufaktur kompos, pupuk organik, media tanam, dan spesifikasi grade yang diminati.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
              <tr>
                <th className="py-3 px-4">Nama Perusahaan / PT</th>
                <th className="py-3 px-4">Jenis Industri</th>
                <th className="py-3 px-4">Kontak PIC</th>
                <th className="py-3 px-4">Kota / Lokasi</th>
                <th className="py-3 px-4 text-right">Kebutuhan Bulanan (kg)</th>
                <th className="py-3 px-4">Grade Diminati</th>
                <th className="py-3 px-4 text-right">Total Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6]">
              {buyers.map((buyer) => {
                const buyerOrders = orders.filter((o) => o.buyerId === buyer.id);
                const totalSpent = buyerOrders.reduce((a, b) => a + b.totalAmount, 0);

                return (
                  <tr key={buyer.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#38251F]">
                        {buyer.buyerProfile?.companyName || buyer.name}
                      </div>
                      <div className="text-[11px] text-[#282A27]/60 font-mono">{buyer.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#234A38]">
                        {buyer.buyerProfile?.businessType || 'Industri Agro'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>{buyer.name}</div>
                      <div className="text-[11px] text-[#282A27]/60 font-mono">{buyer.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-[#282A27]/70">{buyer.buyerProfile?.regency}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      {buyer.buyerProfile?.monthlyNeedsEstimateKg?.toLocaleString('id-ID')} kg
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {buyer.buyerProfile?.targetGrades?.map((g) => (
                          <span key={g} className="text-[10px] font-mono bg-[#F7F4ED] px-1.5 py-0.5 rounded border border-[#EAE3D6]">
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#38251F]">
                      Rp {totalSpent.toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- TAB 8: PESANAN & PENGIRIMAN ---
export const OrderManagementView: React.FC = () => {
  const { orders, updateOrderStatus, buyerInvoices } = useApp();
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);
  const [showShipModal, setShowShipModal] = useState<any | null>(null);
  const [courierName, setCourierName] = useState('Armada Truk Ekspedisi Baraka Logistik');
  const [resiNumber, setResiNumber] = useState('LOG-202610-991');

  const handleShipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showShipModal) return;
    updateOrderStatus(showShipModal.id, 'Dalam Pengiriman', resiNumber, courierName);
    setShowShipModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-[#EAE3D6]">
        <h2 className="text-xl font-bold text-[#38251F]">Pesanan Pembeli & Penjadwalan Logistik</h2>
        <p className="text-xs text-[#282A27]/70 mt-0.5">
          Alur: Menunggu Konfirmasi &rarr; Disiapkan &rarr; Dalam Pengiriman &rarr; Selesai.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
              <tr>
                <th className="py-3 px-4">No. Pesanan</th>
                <th className="py-3 px-4">Perusahaan Pembeli</th>
                <th className="py-3 px-4">Tanggal Pesan</th>
                <th className="py-3 px-4">Spesifikasi Grade</th>
                <th className="py-3 px-4 text-right">Kuantitas</th>
                <th className="py-3 px-4 text-right">Total Tagihan</th>
                <th className="py-3 px-4 text-center">Status Pesanan</th>
                <th className="py-3 px-4 text-center">Status Bayar</th>
                <th className="py-3 px-4 text-center">Aksi / Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{order.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#282A27]">{order.companyName}</div>
                    <div className="text-[11px] text-[#282A27]/60">PIC: {order.buyerName}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#282A27]/70">
                    {new Date(order.orderDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#234A38]">{order.grade}</span>
                    <span className="text-[11px] text-[#282A27]/60 block font-mono">Batch: {order.batchId}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                    {order.quantityKg} kg
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#38251F]">
                    Rp {order.totalAmount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      order.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Dalam Pengiriman'
                        ? 'bg-purple-100 text-purple-800'
                        : order.status === 'Disiapkan'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Dibatalkan'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] font-bold ${
                      order.paymentStatus === 'Lunas' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {order.status === 'Menunggu Konfirmasi' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Disiapkan')}
                          className="px-2 py-1 bg-[#234A38] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1a382b]"
                        >
                          Konfirmasi
                        </button>
                      )}
                      {order.status === 'Disiapkan' && (
                        <button
                          onClick={() => setShowShipModal(order)}
                          className="px-2 py-1 bg-[#84936A] text-white text-[11px] font-semibold rounded-lg hover:bg-[#6c7b54]"
                        >
                          Kirim Barang
                        </button>
                      )}
                      {order.status === 'Dalam Pengiriman' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Selesai')}
                          className="px-2 py-1 bg-emerald-700 text-white text-[11px] font-semibold rounded-lg hover:bg-emerald-800"
                        >
                          Selesaikan
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        title="Buka Faktur Invoice"
                        className="p-1.5 bg-[#F7F4ED] hover:bg-[#EAE3D6] text-[#38251F] rounded-lg transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ship Order */}
      {showShipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EAE3D6] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3D6]">
              <h3 className="font-bold text-base text-[#38251F]">Jadwalkan Pengiriman Logistik</h3>
              <button onClick={() => setShowShipModal(null)} className="text-[#282A27]/50 hover:text-[#282A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleShipSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-[#F7F4ED] rounded-xl text-xs space-y-1">
                <p><strong>Penerima:</strong> {showShipModal.companyName}</p>
                <p><strong>Tujuan:</strong> {showShipModal.shippingAddress}</p>
                <p><strong>Muatan:</strong> {showShipModal.quantityKg} kg {showShipModal.grade}</p>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Nama Ekspedisi / Armada Truk</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Nomor Surat Jalan / Resi Pengiriman</label>
                <input
                  type="text"
                  value={resiNumber}
                  onChange={(e) => setResiNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowShipModal(null)}
                  className="px-4 py-2 border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b]"
                >
                  Mulai Pengiriman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <InvoiceModal
          order={selectedOrderForInvoice}
          invoice={buyerInvoices.find((i) => i.orderId === selectedOrderForInvoice.id) || null}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
};

// --- TAB 9: PEMBAYARAN ---
export const PaymentManagementView: React.FC = () => {
  const { supplierPayments, buyerInvoices, paySupplier, payBuyerInvoice } = useApp();
  const [activeTab, setActiveTab] = useState<'supplier' | 'buyer'>('supplier');

  // Supplier pay modal
  const [paySupplierModal, setPaySupplierModal] = useState<any | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payRef, setPayRef] = useState('BCA-TRF-' + Math.floor(100000 + Math.random() * 900000));
  const [payMethod, setPayMethod] = useState<'Transfer Bank' | 'Tunai di Pos Timbang'>('Transfer Bank');

  const handlePaySupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paySupplierModal) return;
    paySupplier(paySupplierModal.id, Number(payAmount), payRef, payMethod);
    setPaySupplierModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE3D6]">
        <div>
          <h2 className="text-xl font-bold text-[#38251F]">Manajemen Keuangan & Arus Kas Transaksi</h2>
          <p className="text-xs text-[#282A27]/70 mt-0.5">
            Pemisahan ketat hak pembayaran ke petani (pembelian bahan) dan penerimaan piutang dari pembeli B2B.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-[#F7F4ED] rounded-xl border border-[#EAE3D6] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('supplier')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'supplier' ? 'bg-white text-[#234A38] shadow-xs' : 'text-[#282A27]/70'
            }`}
          >
            Pembayaran Petani ({supplierPayments.length})
          </button>
          <button
            onClick={() => setActiveTab('buyer')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'buyer' ? 'bg-white text-[#234A38] shadow-xs' : 'text-[#282A27]/70'
            }`}
          >
            Piutang Pembeli B2B ({buyerInvoices.length})
          </button>
        </div>
      </div>

      {activeTab === 'supplier' ? (
        <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                <tr>
                  <th className="py-3 px-4">ID Transaksi</th>
                  <th className="py-3 px-4">Penerimaan Ref</th>
                  <th className="py-3 px-4">Nama Petani</th>
                  <th className="py-3 px-4 text-right">Total Kewajiban</th>
                  <th className="py-3 px-4 text-right">Telah Dibayar</th>
                  <th className="py-3 px-4 text-right">Sisa Pembayaran</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6]">
                {supplierPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{p.id}</td>
                    <td className="py-3 px-4 font-mono text-[#234A38]">{p.receiptId}</td>
                    <td className="py-3 px-4 font-semibold">{p.farmerName}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      Rp {p.totalOwed.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700">
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
                    <td className="py-3 px-4 text-center">
                      {p.status !== 'Lunas' && (
                        <button
                          onClick={() => {
                            setPaySupplierModal(p);
                            setPayAmount(String(p.remainingAmount));
                          }}
                          className="px-2.5 py-1 bg-[#234A38] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1a382b]"
                        >
                          Bayar Petani
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                <tr>
                  <th className="py-3 px-4">No. Invoice</th>
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Perusahaan Pembeli</th>
                  <th className="py-3 px-4">Jatuh Tempo</th>
                  <th className="py-3 px-4 text-right">Nilai Tagihan</th>
                  <th className="py-3 px-4 text-right">Diterima</th>
                  <th className="py-3 px-4 text-right">Sisa Tagihan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6]">
                {buyerInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{inv.id}</td>
                    <td className="py-3 px-4 font-mono text-[#234A38]">{inv.orderId}</td>
                    <td className="py-3 px-4 font-semibold">{inv.companyName}</td>
                    <td className="py-3 px-4 font-mono text-[#282A27]/70">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      Rp {inv.totalAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700">
                      Rp {inv.paidAmount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-amber-800">
                      Rp {inv.balanceDue.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        inv.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.status !== 'Lunas' && (
                        <button
                          onClick={() => payBuyerInvoice(inv.id, inv.balanceDue, 'BANK-IN-' + Math.floor(100000 + Math.random() * 900000))}
                          className="px-2.5 py-1 bg-emerald-700 text-white text-[11px] font-semibold rounded-lg hover:bg-emerald-800"
                        >
                          Catat Pelunasan
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Pay Supplier */}
      {paySupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EAE3D6] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3D6]">
              <h3 className="font-bold text-base text-[#38251F]">Pencatatan Pembayaran Petani</h3>
              <button onClick={() => setPaySupplierModal(null)} className="text-[#282A27]/50 hover:text-[#282A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaySupplierSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-[#F7F4ED] rounded-xl text-xs space-y-1">
                <p><strong>Penerima:</strong> {paySupplierModal.farmerName}</p>
                <p><strong>Ref Timbang:</strong> {paySupplierModal.receiptId}</p>
                <p><strong>Sisa Hak Petani:</strong> Rp {paySupplierModal.remainingAmount.toLocaleString('id-ID')}</p>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Nominal Pembayaran (Rp)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  max={paySupplierModal.remainingAmount}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6] font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Metode Penyaluran</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#EAE3D6]"
                >
                  <option value="Transfer Bank">Transfer Bank (BCA / BRI / Mandiri)</option>
                  <option value="Tunai di Pos Timbang">Tunai di Pos Timbang</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Nomor Referensi Transfer / Bukti</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPaySupplierModal(null)}
                  className="px-4 py-2 border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b]"
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- TAB 10: LAPORAN & AUDIT ---
export const ReportsView: React.FC = () => {
  const { receipts, batches, orders, auditLogs } = useApp();

  const handleExportCSV = () => {
    const headers = 'ID_Penerimaan,Petani,Tanggal,Bruto_Kg,Tara_Kg,Netto_Kg,Nilai_Rp\n';
    const rows = receipts
      .map(
        (r) =>
          `${r.id},"${r.farmerName}",${r.receiptDate},${r.grossWeightKg},${r.tareWeightKg},${r.netWeightKg},${r.totalAmount}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Penerimaan_CocoaCycle_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE3D6]">
        <div>
          <h2 className="text-xl font-bold text-[#38251F]">Laporan Operasional & Audit Trail Rantai Pasok</h2>
          <p className="text-xs text-[#282A27]/70 mt-0.5">
            Pencatatan rendemen pengeringan, distribusi grade, serta log riwayat audit aktivitas sistem.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 bg-white text-[#38251F] border border-[#EAE3D6] rounded-xl text-xs font-semibold hover:bg-[#F7F4ED] transition-colors"
        >
          <Download className="w-4 h-4 text-[#234A38]" />
          Ekspor CSV Penerimaan
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
        <div className="p-4 bg-[#F7F4ED] border-b border-[#EAE3D6] flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#38251F]">Log Aktivitas & Riwayat Audit (Immutable Trail)</h3>
          <span className="text-xs text-[#282A27]/50 font-mono">{auditLogs.length} Entri Tercatat</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F4ED]/60 text-[#38251F] font-semibold border-b border-[#EAE3D6]">
              <tr>
                <th className="py-2.5 px-4">Waktu</th>
                <th className="py-2.5 px-4">Pelaku / Aktor</th>
                <th className="py-2.5 px-4">Aktivitas</th>
                <th className="py-2.5 px-4">Entitas Terkait</th>
                <th className="py-2.5 px-4">Rincian Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F4ED]/30">
                  <td className="py-2.5 px-4 font-mono text-[#282A27]/70 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-[#234A38]">{log.actor}</td>
                  <td className="py-2.5 px-4 font-semibold text-[#38251F]">{log.action}</td>
                  <td className="py-2.5 px-4 font-mono">{log.entityId}</td>
                  <td className="py-2.5 px-4 text-[#282A27]/80 text-[11px]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- TAB 11: PENGATURAN HARGA DASAR ---
export const SettingsView: React.FC = () => {
  const { gradeConfigs, updateGradePrice } = useApp();
  const [prices, setPrices] = useState({
    'Grade A': gradeConfigs.find((g) => g.grade === 'Grade A')?.standardPricePerKg || 1450,
    'Grade B': gradeConfigs.find((g) => g.grade === 'Grade B')?.standardPricePerKg || 1300,
    'Grade C': gradeConfigs.find((g) => g.grade === 'Grade C')?.standardPricePerKg || 1150,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    updateGradePrice('Grade A', prices['Grade A']);
    updateGradePrice('Grade B', prices['Grade B']);
    updateGradePrice('Grade C', prices['Grade C']);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="pb-2 border-b border-[#EAE3D6]">
        <h2 className="text-xl font-bold text-[#38251F]">Pengaturan Harga Dasar Produk Komersial</h2>
        <p className="text-xs text-[#282A27]/70 mt-0.5">
          Sesuai arahan, harga produk dapat dikonfigurasi dinamis oleh administrator dan tidak bersifat angka mati.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Harga dasar produk berhasil diperbarui di seluruh katalog & inventaris.
        </div>
      )}

      <form onSubmit={handleSavePrices} className="p-6 bg-white rounded-2xl border border-[#EAE3D6] space-y-4 text-xs">
        <h3 className="font-bold text-sm text-[#38251F]">Tarif Patokan per Kilogram (Rp/kg)</h3>

        <div>
          <label className="block font-semibold text-[#38251F] mb-1">
            Grade A (Kadar Air &le; 10%)
          </label>
          <input
            type="number"
            value={prices['Grade A']}
            onChange={(e) => setPrices({ ...prices, 'Grade A': Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6] font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#38251F] mb-1">
            Grade B (Kadar Air &gt; 10% - 14%)
          </label>
          <input
            type="number"
            value={prices['Grade B']}
            onChange={(e) => setPrices({ ...prices, 'Grade B': Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6] font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#38251F] mb-1">
            Grade C (Kadar Air &gt; 14% - 18%)
          </label>
          <input
            type="number"
            value={prices['Grade C']}
            onChange={(e) => setPrices({ ...prices, 'Grade C': Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6] font-mono"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b] transition-colors"
        >
          Simpan Konfigurasi Harga
        </button>
      </form>
    </div>
  );
};
