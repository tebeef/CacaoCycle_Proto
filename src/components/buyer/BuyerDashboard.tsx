import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CocoaCycleLogo } from '../CocoaCycleLogo';
import {
  LayoutDashboard,
  Package,
  FlaskConical,
  ShoppingCart,
  Truck,
  CreditCard,
  Building2,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  X,
  LogOut,
  ChevronRight,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { InvoiceModal } from '../common/InvoiceModal';
import { SalesOrder, SampleRequest, ProductGradeConfig } from '../../types';

export const BuyerDashboard: React.FC = () => {
  const {
    currentUser,
    inventory,
    gradeConfigs,
    orders,
    samples,
    buyerInvoices,
    placeOrder,
    createSampleRequest,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'catalog' | 'samples' | 'orders' | 'shipments' | 'invoices' | 'profile'
  >('dashboard');

  // Modals
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<ProductGradeConfig | null>(null);
  const [selectedProductForSample, setSelectedProductForSample] = useState<ProductGradeConfig | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<SalesOrder | null>(null);

  // Order Placement Form state
  const [orderQuantityKg, setOrderQuantityKg] = useState('100');
  const [shippingAddress, setShippingAddress] = useState(
    currentUser?.buyerProfile?.address || 'Kawasan Industri Rungkut Blok B-4, Surabaya'
  );
  const [orderNotes, setOrderNotes] = useState('Spesifikasi: Kadar air teruji lab, kemasan karung laminasi 25 kg.');
  const [orderFeedback, setOrderFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  // Sample Request Form state
  const [sampleGrams, setSampleGrams] = useState<250 | 500 | 1000>(500);
  const [intendedApp, setIntendedApp] = useState('Pengujian formulasi laboratorium pupuk organik');
  const [sampleAddress, setSampleAddress] = useState(
    currentUser?.buyerProfile?.address || 'Kawasan Industri Rungkut Blok B-4, Surabaya'
  );

  // Filter Catalog State
  const [filterGrade, setFilterGrade] = useState<'All' | 'Grade A' | 'Grade B' | 'Grade C'>('All');
  const [catalogViewMode, setCatalogViewMode] = useState<'grid' | 'table'>('grid');

  // Buyer specific orders & samples
  const buyerOrders = orders.filter((o) => o.buyerId === currentUser?.id);
  const buyerSamples = samples.filter((s) => s.buyerId === currentUser?.id);
  const buyerInvs = buyerInvoices.filter((i) => i.buyerId === currentUser?.id);

  const totalKgOrdered = buyerOrders.reduce((a, b) => a + b.quantityKg, 0);
  const pendingOrders = buyerOrders.filter((o) => o.status !== 'Selesai' && o.status !== 'Dibatalkan');
  const unpaidInvoices = buyerInvs.filter((i) => i.status !== 'Lunas');

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForOrder) return;
    setOrderFeedback(null);

    // Pick first matching batch in inventory
    const matchingInv = inventory.find(
      (item) => item.grade === selectedProductForOrder.grade && item.status === 'Tersedia'
    );
    const batchId = matchingInv ? matchingInv.batchId : 'BTC-202610-01';

    const result = placeOrder({
      buyerId: currentUser?.id || 'USR-BUYER-01',
      grade: selectedProductForOrder.grade,
      batchId,
      quantityKg: Number(orderQuantityKg),
      shippingAddress,
      notes: orderNotes,
    });

    if (result.success) {
      setOrderFeedback({ success: true, message: 'Pesanan berhasil dikirim ke administrator.' });
      setTimeout(() => {
        setSelectedProductForOrder(null);
        setOrderFeedback(null);
        setActiveTab('orders');
      }, 1200);
    } else {
      setOrderFeedback({ success: false, message: result.message });
    }
  };

  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForSample) return;

    createSampleRequest({
      buyerId: currentUser?.id || 'USR-BUYER-01',
      buyerName: currentUser?.name || 'Hendrik Wijaya',
      companyName: currentUser?.buyerProfile?.companyName || 'PT Pupuk Organik Nusantara',
      targetGrade: selectedProductForSample.grade,
      quantityGrams: sampleGrams,
      intendedApplication: intendedApp,
      shippingAddress: sampleAddress,
    });

    setSelectedProductForSample(null);
    setActiveTab('samples');
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] pb-16">
      {/* Top Header */}
      <header className="bg-[#38251F] text-[#F7F4ED] py-6 px-4 sm:px-8 border-b border-[#2a1b16]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#234A38] text-white flex items-center justify-center font-bold text-base border border-white/20">
              B2B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[#F7F4ED]">
                  {currentUser?.buyerProfile?.companyName || currentUser?.name}
                </h1>
                <span className="text-[10px] font-semibold bg-[#84936A] px-2 py-0.5 rounded text-white">
                  {currentUser?.buyerProfile?.businessType || 'Pembeli B2B'}
                </span>
              </div>
              <p className="text-xs text-[#EAE3D6]/80 mt-0.5 font-mono">
                PIC: {currentUser?.name} · {currentUser?.buyerProfile?.regency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('catalog')}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#234A38] text-white rounded-xl text-xs font-semibold hover:bg-[#1a382b] transition-colors shadow-xs"
            >
              <Package className="w-4 h-4" />
              Katalog Bahan Baku
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

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#EAE3D6] text-xs font-semibold">
          {[
            { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
            { id: 'catalog', label: 'Katalog Produk', icon: Package },
            { id: 'samples', label: 'Permintaan Sampel', icon: FlaskConical },
            { id: 'orders', label: 'Pesanan Saya', icon: ShoppingCart },
            { id: 'shipments', label: 'Pelacakan Pengiriman', icon: Truck },
            { id: 'invoices', label: 'Tagihan / Faktur', icon: CreditCard },
            { id: 'profile', label: 'Profil Perusahaan', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#234A38] text-white shadow-xs'
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

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        {/* --- 1. BUYER DASHBOARD OVERVIEW --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D6] space-y-1">
                <span className="text-xs text-[#282A27]/60 block">Pesanan Aktif</span>
                <div className="text-2xl font-extrabold text-[#38251F] font-mono tabular-nums">
                  {pendingOrders.length} <span className="text-xs font-normal">pesanan</span>
                </div>
                <p className="text-[11px] text-[#282A27]/50 font-mono">Sedang diproses / dikirim</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D6] space-y-1">
                <span className="text-xs text-[#282A27]/60 block">Total Kuantitas Dipesan</span>
                <div className="text-2xl font-extrabold text-[#234A38] font-mono tabular-nums">
                  {totalKgOrdered.toLocaleString('id-ID')} <span className="text-xs font-normal">kg</span>
                </div>
                <p className="text-[11px] text-[#282A27]/50 font-mono">Bahan baku kering terkirim</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D6] space-y-1">
                <span className="text-xs text-[#282A27]/60 block">Sampel Uji Laboratorium</span>
                <div className="text-2xl font-extrabold text-[#84936A] font-mono tabular-nums">
                  {buyerSamples.length} <span className="text-xs font-normal">pengajuan</span>
                </div>
                <p className="text-[11px] text-[#84936A] font-mono">Evaluasi spesifikasi</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#EAE3D6] space-y-1">
                <span className="text-xs text-[#282A27]/60 block">Faktur Belum Lunas</span>
                <div className="text-2xl font-extrabold text-amber-800 font-mono tabular-nums">
                  {unpaidInvoices.length} <span className="text-xs font-normal">tagihan</span>
                </div>
                <p className="text-[11px] text-amber-800 font-mono">Tempo pembayaran B2B</p>
              </div>
            </div>

            {/* Quick Catalog Spotlight */}
            <div className="bg-white rounded-2xl border border-[#EAE3D6] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#38251F]">Batch Produk Siap Pasok Saat Ini</h3>
                  <p className="text-xs text-[#282A27]/60 mt-0.5">
                    Kadar air di bawah 10%–14% terverifikasi QC laboratorium central.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="text-xs font-semibold text-[#234A38] hover:underline"
                >
                  Buka Katalog Lengkap &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {gradeConfigs.map((cfg) => (
                  <div key={cfg.grade} className="p-4 bg-[#F7F4ED] rounded-xl border border-[#EAE3D6] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#38251F]">{cfg.grade}</span>
                      <span className="font-mono text-xs text-[#234A38] font-bold">
                        Rp {cfg.standardPricePerKg.toLocaleString('id-ID')}/kg
                      </span>
                    </div>
                    <p className="text-[11px] text-[#282A27]/70 line-clamp-2">{cfg.description}</p>
                    <div className="pt-2 flex justify-between items-center text-xs">
                      <span className="text-[10px] text-[#282A27]/60 font-mono">Stok: {cfg.availableStockKg} kg</span>
                      <button
                        onClick={() => {
                          setSelectedProductForOrder(cfg);
                          setOrderQuantityKg(String(cfg.minOrderKg));
                        }}
                        className="px-2.5 py-1 bg-[#234A38] text-white text-[11px] font-semibold rounded-lg hover:bg-[#1a382b]"
                      >
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 2. KATALOG PRODUK --- */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EAE3D6]">
              <div>
                <h2 className="text-lg font-bold text-[#38251F]">Katalog Bahan Baku Kulit Kakao Kering</h2>
                <p className="text-xs text-[#282A27]/70 mt-0.5">
                  Spesifikasi kadar air teruji per batch. Bebas jamur dan dicacah seragam.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#282A27]/60">Filter Grade:</span>
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value as any)}
                  className="px-3 py-1.5 bg-white rounded-xl border border-[#EAE3D6] text-xs font-semibold"
                >
                  <option value="All">Semua Grade</option>
                  <option value="Grade A">Grade A (≤ 10%)</option>
                  <option value="Grade B">Grade B (10.1% - 14%)</option>
                  <option value="Grade C">Grade C (14.1% - 18%)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gradeConfigs
                .filter((c) => filterGrade === 'All' || c.grade === filterGrade)
                .map((cfg) => (
                  <div
                    key={cfg.grade}
                    className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                        <img
                          src={cfg.image}
                          alt={cfg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-[#38251F] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                          {cfg.grade}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-white/95 text-[#234A38] text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                          {cfg.minMoisture}% - {cfg.maxMoisture}% Air
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h4 className="font-bold text-sm text-[#38251F]">{cfg.title}</h4>
                        <p className="text-xs text-[#282A27]/75 leading-relaxed line-clamp-3">
                          {cfg.description}
                        </p>

                        <div className="p-3 bg-[#F7F4ED] rounded-xl text-xs space-y-1 font-mono">
                          <div className="flex justify-between">
                            <span className="text-[#282A27]/60">Harga Terbuka:</span>
                            <span className="font-bold text-[#234A38]">Rp {cfg.standardPricePerKg.toLocaleString('id-ID')}/kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#282A27]/60">Minimal Order:</span>
                            <span>{cfg.minOrderKg} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#282A27]/60">Stok Siap Alokasi:</span>
                            <span className="font-bold text-[#38251F]">{cfg.availableStockKg} kg</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-[#282A27]/70">
                          <strong>Aplikasi:</strong> {cfg.recommendedUse}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex gap-2">
                      <button
                        onClick={() => setSelectedProductForSample(cfg)}
                        className="flex-1 py-2 px-3 bg-[#F7F4ED] hover:bg-[#EAE3D6] text-[#38251F] rounded-xl text-xs font-semibold transition-colors text-center"
                      >
                        Minta Sampel
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProductForOrder(cfg);
                          setOrderQuantityKg(String(cfg.minOrderKg));
                        }}
                        className="flex-1 py-2 px-3 bg-[#234A38] hover:bg-[#1a382b] text-white rounded-xl text-xs font-semibold transition-colors text-center shadow-xs"
                      >
                        Pesan Bahan
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- 3. PERMINTAAN SAMPEL --- */}
        {activeTab === 'samples' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#EAE3D6]">
              <h2 className="text-lg font-bold text-[#38251F]">Permintaan Sampel Uji Laboratorium</h2>
              <p className="text-xs text-[#282A27]/70 mt-0.5">
                Evaluasi mutu fisik, kadar air, rasio C/N, dan kecocokan formulasi pabrik Anda sebelum pesanan skala besar.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                    <tr>
                      <th className="py-3 px-4">No. Sampel</th>
                      <th className="py-3 px-4">Grade Uji</th>
                      <th className="py-3 px-4">Bobot Sampel</th>
                      <th className="py-3 px-4">Tujuan Pengujian</th>
                      <th className="py-3 px-4">Tanggal Pengajuan</th>
                      <th className="py-3 px-4 text-center">Status Sampel</th>
                      <th className="py-3 px-4">Resi Kurir / Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D6]">
                    {buyerSamples.map((s) => (
                      <tr key={s.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{s.id}</td>
                        <td className="py-3 px-4 font-semibold text-[#234A38]">{s.targetGrade}</td>
                        <td className="py-3 px-4 font-mono">{s.quantityGrams} gram</td>
                        <td className="py-3 px-4 text-[#282A27]/80">{s.intendedApplication}</td>
                        <td className="py-3 px-4 font-mono text-[#282A27]/70">
                          {new Date(s.requestDate).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            s.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.status === 'Dikirim'
                              ? 'bg-purple-100 text-purple-800'
                              : s.status === 'Disetujui'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] font-mono text-[#282A27]/70">
                          {s.trackingNumber || s.adminNotes || 'Menunggu verifikasi admin'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 4. PESANAN SAYA --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#EAE3D6]">
              <h2 className="text-lg font-bold text-[#38251F]">Daftar Pesanan Komersial</h2>
              <p className="text-xs text-[#282A27]/70 mt-0.5">
                Monitoring status alokasi bahan baku, penyiapan karung, dan pengiriman ke lokasi pabrik.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                    <tr>
                      <th className="py-3 px-4">No. Pesanan</th>
                      <th className="py-3 px-4">Grade & Batch</th>
                      <th className="py-3 px-4 text-right">Kuantitas</th>
                      <th className="py-3 px-4 text-right">Harga Satuan</th>
                      <th className="py-3 px-4 text-right">Total Tagihan</th>
                      <th className="py-3 px-4 text-center">Status Pesanan</th>
                      <th className="py-3 px-4 text-center">Status Bayar</th>
                      <th className="py-3 px-4 text-center">Dokumen Faktur</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D6]">
                    {buyerOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{o.id}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-[#234A38]">{o.grade}</span>
                          <span className="text-[11px] text-[#282A27]/60 block font-mono">Batch: {o.batchId}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                          {o.quantityKg.toLocaleString('id-ID')} kg
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums">
                          Rp {o.unitPrice.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-[#38251F]">
                          Rp {o.totalAmount.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            o.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.status === 'Dalam Pengiriman'
                              ? 'bg-purple-100 text-purple-800'
                              : o.status === 'Disiapkan'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`text-[10px] font-bold ${
                            o.paymentStatus === 'Lunas' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedOrderForInvoice(o)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-[#F7F4ED] hover:bg-[#EAE3D6] text-[#38251F] font-semibold rounded-lg text-[11px] mx-auto transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Faktur B2B
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

        {/* --- 5. PELACAKAN PENGIRIMAN --- */}
        {activeTab === 'shipments' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#EAE3D6]">
              <h2 className="text-lg font-bold text-[#38251F]">Status Pengiriman & Surat Jalan</h2>
              <p className="text-xs text-[#282A27]/70 mt-0.5">
                Lacak pergerakan armada logistik pengantaran dari pos CocoaCycle ke gudang industri Anda.
              </p>
            </div>

            <div className="space-y-4">
              {buyerOrders.map((o) => (
                <div key={o.id} className="p-6 bg-white rounded-2xl border border-[#EAE3D6] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE3D6]">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#38251F]">Pesanan #{o.id}</span>
                      <span className="text-xs text-[#282A27]/60 ml-2">({o.quantityKg} kg {o.grade})</span>
                    </div>
                    <div className="text-xs font-mono">
                      Resi Surat Jalan: <strong className="text-[#234A38]">{o.shipmentNumber || 'Menunggu jadwal armada'}</strong>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
                    {[
                      { step: 'Pesanan Masuk', done: true },
                      { step: 'Dikonfirmasi', done: o.status !== 'Menunggu Konfirmasi' },
                      { step: 'Disiapkan di Gudang', done: o.status === 'Disiapkan' || o.status === 'Dalam Pengiriman' || o.status === 'Selesai' },
                      { step: 'Dalam Pengiriman', done: o.status === 'Dalam Pengiriman' || o.status === 'Selesai' },
                      { step: 'Diterima Pabrik', done: o.status === 'Selesai' },
                    ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center space-y-1.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          step.done ? 'bg-[#234A38] text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[11px] ${step.done ? 'font-semibold text-[#38251F]' : 'text-slate-400'}`}>
                          {step.step}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#F7F4ED] rounded-xl text-xs text-[#282A27]/70 flex justify-between items-center">
                    <span>Ekspedisi: {o.driverOrCourier || 'Armada Logistik Mitra CocoaCycle'}</span>
                    <span>Tujuan: {o.shippingAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 6. TAGIHAN / FAKTUR --- */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-[#EAE3D6]">
              <h2 className="text-lg font-bold text-[#38251F]">Faktur Pembelian Komersial B2B</h2>
              <p className="text-xs text-[#282A27]/70 mt-0.5">
                Rincian faktur pajak/niaga resmi dan status pembayaran transaksi.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                    <tr>
                      <th className="py-3 px-4">No. Faktur</th>
                      <th className="py-3 px-4">No. Pesanan</th>
                      <th className="py-3 px-4">Tgl Terbit</th>
                      <th className="py-3 px-4">Jatuh Tempo</th>
                      <th className="py-3 px-4 text-right">Nilai Tagihan</th>
                      <th className="py-3 px-4 text-right">Telah Dibayar</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Cetak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE3D6]">
                    {buyerInvs.map((inv) => {
                      const matchedOrder = orders.find((o) => o.id === inv.orderId);

                      return (
                        <tr key={inv.id} className="hover:bg-[#F7F4ED]/50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#38251F]">{inv.id}</td>
                          <td className="py-3 px-4 font-mono text-[#234A38]">{inv.orderId}</td>
                          <td className="py-3 px-4 font-mono text-[#282A27]/70">{inv.invoiceDate}</td>
                          <td className="py-3 px-4 font-mono text-[#282A27]/70">{inv.dueDate}</td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                            Rp {inv.totalAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700">
                            Rp {inv.paidAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              inv.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {matchedOrder && (
                              <button
                                onClick={() => setSelectedOrderForInvoice(matchedOrder)}
                                className="p-1.5 bg-[#F7F4ED] hover:bg-[#EAE3D6] text-[#38251F] rounded-lg transition-colors mx-auto"
                                title="Buka Faktur Lengkap"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
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
        )}

        {/* --- 7. PROFIL PERUSAHAAN --- */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-[#EAE3D6] p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#38251F]">Informasi Profil Usaha & Perusahaan</h3>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Nama Badan Usaha</span>
                <span className="font-bold text-sm text-[#38251F]">
                  {currentUser?.buyerProfile?.companyName || currentUser?.name}
                </span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Jenis Industri</span>
                <span className="font-semibold text-[#234A38]">{currentUser?.buyerProfile?.businessType}</span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">PIC Bertanggung Jawab</span>
                <span>{currentUser?.name}</span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Telepon / WhatsApp</span>
                <span className="font-mono">{currentUser?.phone}</span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Estimasi Kebutuhan Bulanan</span>
                <span className="font-mono font-bold text-[#234A38]">
                  {currentUser?.buyerProfile?.monthlyNeedsEstimateKg?.toLocaleString('id-ID')} kg / bulan
                </span>
              </div>
              <div>
                <span className="text-[#282A27]/60 block text-[11px]">Lokasi Pabrik</span>
                <span>{currentUser?.buyerProfile?.regency}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EAE3D6]">
              <span className="text-[#282A27]/60 block text-[11px]">Alamat Pengiriman Standar:</span>
              <p className="text-[#282A27]/80 mt-1">{currentUser?.buyerProfile?.address}</p>
            </div>
          </div>
        )}
      </main>

      {/* Modal Pesan Bahan Baku */}
      {selectedProductForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EAE3D6] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3D6]">
              <div>
                <h3 className="font-bold text-base text-[#38251F]">Formulir Pemesanan Bahan Baku B2B</h3>
                <p className="text-xs text-[#234A38] font-semibold">{selectedProductForOrder.grade} - {selectedProductForOrder.title}</p>
              </div>
              <button onClick={() => setSelectedProductForOrder(null)} className="text-[#282A27]/50 hover:text-[#282A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderFeedback && (
              <div className={`p-3 rounded-xl text-xs ${
                orderFeedback.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {orderFeedback.message}
              </div>
            )}

            <form onSubmit={handlePlaceOrderSubmit} className="space-y-3.5 text-xs">
              <div className="p-3 bg-[#F7F4ED] rounded-xl flex justify-between items-center font-mono text-xs">
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Harga Satuan</span>
                  <span className="font-bold text-[#234A38]">Rp {selectedProductForOrder.standardPricePerKg.toLocaleString('id-ID')}/kg</span>
                </div>
                <div className="text-right">
                  <span className="text-[#282A27]/60 block text-[10px]">Stok Tersedia</span>
                  <span className="font-bold text-[#38251F]">{selectedProductForOrder.availableStockKg} kg</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">
                  Kuantitas Pemesanan (kg) · Min: {selectedProductForOrder.minOrderKg} kg
                </label>
                <input
                  type="number"
                  min={selectedProductForOrder.minOrderKg}
                  max={selectedProductForOrder.availableStockKg}
                  value={orderQuantityKg}
                  onChange={(e) => setOrderQuantityKg(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6] font-mono text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Alamat Tujuan Pengiriman</label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Catatan Spesifikasi untuk Pabrik</label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              {/* Order Financial Summary */}
              <div className="p-3 bg-[#F7F4ED] rounded-xl border border-[#EAE3D6] space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#282A27]/70 font-sans">Subtotal Barang:</span>
                  <span>Rp {(Number(orderQuantityKg) * selectedProductForOrder.standardPricePerKg).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#282A27]/70 font-sans">Estimasi Ekspedisi (Jatim):</span>
                  <span>Rp {(Number(orderQuantityKg) * 250).toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-[#EAE3D6] pt-1.5 flex justify-between font-bold text-sm text-[#38251F]">
                  <span className="font-sans">Total Tagihan:</span>
                  <span className="text-[#234A38]">
                    Rp {(Number(orderQuantityKg) * selectedProductForOrder.standardPricePerKg + Number(orderQuantityKg) * 250).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProductForOrder(null)}
                  className="px-4 py-2 border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b]"
                >
                  Kirim Pesanan B2B
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Minta Sampel */}
      {selectedProductForSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#EAE3D6] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-[#EAE3D6]">
              <div>
                <h3 className="font-bold text-base text-[#38251F]">Pengajuan Sampel Laboratorium</h3>
                <p className="text-xs text-[#234A38] font-semibold">{selectedProductForSample.grade}</p>
              </div>
              <button onClick={() => setSelectedProductForSample(null)} className="text-[#282A27]/50 hover:text-[#282A27]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSampleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Ukuran Sampel</label>
                <div className="grid grid-cols-3 gap-2">
                  {[250, 500, 1000].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSampleGrams(g as any)}
                      className={`py-2 rounded-xl font-mono font-bold transition-all ${
                        sampleGrams === g
                          ? 'bg-[#234A38] text-white'
                          : 'bg-[#F7F4ED] border border-[#EAE3D6] text-[#282A27]'
                      }`}
                    >
                      {g} gram
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Tujuan Pengujian Sampel</label>
                <input
                  type="text"
                  value={intendedApp}
                  onChange={(e) => setIntendedApp(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#38251F] mb-1">Alamat Penerimaan Sampel</label>
                <input
                  type="text"
                  value={sampleAddress}
                  onChange={(e) => setSampleAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE3D6]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProductForSample(null)}
                  className="px-4 py-2 border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#234A38] text-white font-semibold rounded-xl hover:bg-[#1a382b]"
                >
                  Kirim Permintaan Sampel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faktur Modal */}
      {selectedOrderForInvoice && (
        <InvoiceModal
          order={selectedOrderForInvoice}
          invoice={buyerInvs.find((i) => i.orderId === selectedOrderForInvoice.id) || null}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}
    </div>
  );
};
