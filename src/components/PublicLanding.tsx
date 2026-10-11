import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  CheckCircle2,
  Droplets,
  Scale,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  ChevronRight,
  Package,
  Layers,
  Leaf,
  FlaskConical,
  X,
} from 'lucide-react';
import { ProductGradeConfig } from '../types';

interface PublicLandingProps {
  onOpenAuth: (mode: 'login' | 'register', role?: 'farmer' | 'buyer') => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onOpenAuth }) => {
  const { gradeConfigs, batches, receipts } = useApp();
  const [selectedProductModal, setSelectedProductModal] = useState<ProductGradeConfig | null>(null);

  const heroImage = '/src/assets/images/hero_cocoa_processing_1791721191390.jpg';

  // Demo active batch for Section 6 Traceability card
  const demoBatch = batches[0] || {
    id: 'BTC-202610-01',
    initialWeightKg: 800,
    currentWeightKg: 184,
    driedWeightKg: 184,
    yieldPercentage: 23.0,
    startDate: '2026-10-08T10:00:00Z',
    moistureContentPercent: 8.9,
    assignedGrade: 'Grade A',
    status: 'Selesai',
    location: 'Gudang A - Rak 01',
  };

  return (
    <div className="space-y-24 pb-20">
      {/* SECTION 2 — HERO */}
      <section id="beranda" className="pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#234A38]">
                CIRCULAR AGRICULTURE · B2B SUPPLY CHAIN
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#38251F] tracking-tight leading-[1.15] text-balance">
                Limbah Kakao, Menjadi Bahan Baku Bernilai.
              </h1>

              <p className="text-base sm:text-lg text-[#282A27]/80 leading-relaxed max-w-2xl">
                CocoaCycle menghubungkan petani kakao dengan industri melalui pengolahan kulit buah kakao
                segar menjadi bahan baku kering berkualitas tinggi dengan mutu dan kadar air yang terukur.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href="#produk"
                  className="px-6 py-3.5 bg-[#234A38] text-white rounded-xl text-sm font-semibold hover:bg-[#1b3a2c] transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  Jelajahi Produk
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onOpenAuth('register', 'farmer')}
                  className="px-6 py-3.5 bg-white text-[#38251F] border border-[#EAE3D6] rounded-xl text-sm font-semibold hover:bg-[#F7F4ED] transition-colors flex items-center justify-center"
                >
                  Jadi Pemasok
                </button>
              </div>

              {/* Microcopy & Trust Pillars */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#282A27]/70 font-medium">
                <span>Pasokan tercatat</span>
                <span className="text-[#84936A]">·</span>
                <span>Mutu terukur</span>
                <span className="text-[#84936A]">·</span>
                <span>Transaksi transparan</span>
              </div>
            </div>

            {/* Right Column: Visual editorial + Interactive Batch Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#EAE3D6] shadow-xl bg-white aspect-4/3 lg:aspect-square">
                <img
                  src={heroImage}
                  alt="Proses pengeringan kulit buah kakao CocoaCycle di perkebunan"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Batch Card Anchor */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D6]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#234A38]" />
                      <span className="font-mono font-bold text-[#38251F]">Batch #{demoBatch.id}</span>
                    </div>
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {demoBatch.assignedGrade || 'Grade A'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                    <div>
                      <span className="text-[#282A27]/60 block text-[10px]">Kadar Air</span>
                      <span className="font-bold text-[#234A38] tabular-nums">{demoBatch.moistureContentPercent}%</span>
                    </div>
                    <div>
                      <span className="text-[#282A27]/60 block text-[10px]">Netto Kering</span>
                      <span className="font-bold text-[#38251F] tabular-nums">{demoBatch.currentWeightKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[#282A27]/60 block text-[10px]">Rendemen</span>
                      <span className="font-bold text-[#84936A] tabular-nums">{demoBatch.yieldPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — VALUE PROPOSITION */}
      <section className="bg-white py-16 border-y border-[#EAE3D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#234A38] mb-2">
              Keunggulan Ekosistem
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#38251F]">
              Solusi Terpadu Menjawab Kesenjangan Mutu
            </h3>
            <p className="text-xs sm:text-sm text-[#282A27]/70 mt-2">
              Mengubah limbah organik yang membusuk di kebun menjadi komoditas industri terstandar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-[#F7F4ED] border border-[#EAE3D6] space-y-4 hover:border-[#84936A] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#234A38]/10 text-[#234A38] flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#38251F]">1. Mutu Terukur</h4>
              <p className="text-xs sm:text-sm text-[#282A27]/80 leading-relaxed">
                Setiap batch melewati uji kadar air digital, pemilahan seragam (10–15 mm), serta inspeksi
                jamur yang ketat untuk menjamin stabilitas penyimpanan bahan baku industri.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-[#F7F4ED] border border-[#EAE3D6] space-y-4 hover:border-[#84936A] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#234A38]/10 text-[#234A38] flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#38251F]">2. Rantai Pasok Terhubung</h4>
              <p className="text-xs sm:text-sm text-[#282A27]/80 leading-relaxed">
                Pencatatan pasokan kulit segar dari petani individu hingga alokasi pesanan pabrik pupuk
                dan media tanam terintegrasi secara transparan dalam satu sistem digital.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-[#F7F4ED] border border-[#EAE3D6] space-y-4 hover:border-[#84936A] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#234A38]/10 text-[#234A38] flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#38251F]">3. Nilai Ekonomi Baru</h4>
              <p className="text-xs sm:text-sm text-[#282A27]/80 leading-relaxed">
                Kulit kakao yang sebelumnya menjadi sarang hama PBK dan penyakit busuk buah kini
                menghasilkan pendapatan langsung per kilogram bagi petani pada setiap panen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CARA KERJA COCOACYCLE */}
      <section id="cara-kerja" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#234A38] mb-2">
            Alur Operasional
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#38251F]">
            Cara Kerja CocoaCycle dari Kebun ke Industri
          </h3>
          <p className="text-xs sm:text-sm text-[#282A27]/70 mt-2">
            Enam tahapan terstruktur yang memastikan kualitas bahan baku terjaga konsisten.
          </p>
        </div>

        {/* 6 Steps Grid (Horizontal desktop, vertical mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Penyediaan Bahan Segar',
              desc: 'Petani mengumpulkan kulit buah kakao segar hasil panen dan memisahkannya dari plasenta biji.',
              icon: Leaf,
            },
            {
              step: '02',
              title: 'Penerimaan & Timbang',
              desc: 'Pos CocoaCycle menerima, menimbang tara-netto secara digital, dan menerbitkan Bukti Timbang resmi.',
              icon: Scale,
            },
            {
              step: '03',
              title: 'Pencacahan & Pengeringan',
              desc: 'Bahan dicacah ukuran 10–15 mm dan dikeringkan di solar dryer & tunnel hybrid hingga kadar air optimal.',
              icon: Layers,
            },
            {
              step: '04',
              title: 'Pengukuran Kadar Air & Grade',
              desc: 'Petugas QC memeriksa kelembapan digital, menguji ada/tidaknya jamur, dan menetapkan klasifikasi grade.',
              icon: FlaskConical,
            },
            {
              step: '05',
              title: 'Penawaran ke Pembeli B2B',
              desc: 'Batch yang lolos ditampilkan di katalog B2B untuk kebutuhan produsen pupuk, kompos, dan media tanam.',
              icon: Package,
            },
            {
              step: '06',
              title: 'Pengemasan & Pengiriman',
              desc: 'Bahan dikemas dalam karung woven berlapis dan dikirim lengkap dengan surat jalan dan faktur komersial.',
              icon: FileCheck2,
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-white border border-[#EAE3D6] space-y-3 relative hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-bold text-[#84936A]">{item.step}</span>
                <div className="w-10 h-10 rounded-xl bg-[#F7F4ED] text-[#234A38] flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-base font-bold text-[#38251F]">{item.title}</h4>
              <p className="text-xs text-[#282A27]/75 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — PRODUK UTAMA */}
      <section id="produk" className="bg-[#F7F4ED] py-16 border-y border-[#EAE3D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#234A38] mb-2">
                Katalog Produk Terstandar
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#38251F]">
                Klasifikasi Produk Kulit Kakao Kering
              </h3>
              <p className="text-xs sm:text-sm text-[#282A27]/70 mt-1 max-w-xl">
                Harga dapat diperbarui secara dinamis oleh tim operasional CocoaCycle sesuai negosiasi kuantitas.
              </p>
            </div>
            <div className="text-xs text-[#282A27]/60 italic font-mono bg-white/60 px-3 py-1.5 rounded-lg border border-[#EAE3D6] self-start md:self-auto">
              *Klasifikasi mutu internal CocoaCycle
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Grade A */}
            {gradeConfigs.map((cfg) => (
              <div
                key={cfg.grade}
                className="bg-white rounded-2xl border border-[#EAE3D6] overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={cfg.image}
                      alt={cfg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#38251F] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                      {cfg.grade}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#234A38] text-[11px] font-mono font-semibold px-2 py-0.5 rounded shadow-xs">
                      {cfg.grade === 'Grade A'
                        ? 'Kadar Air ≤ 10%'
                        : cfg.grade === 'Grade B'
                        ? 'Kadar Air 10.1% - 14%'
                        : 'Kadar Air 14.1% - 18%'}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="font-bold text-sm text-[#38251F] line-clamp-1">{cfg.title}</h4>
                    <p className="text-xs text-[#282A27]/70 line-clamp-3 leading-relaxed">
                      {cfg.description}
                    </p>

                    <div className="pt-2 border-t border-[#EAE3D6] flex justify-between items-baseline">
                      <span className="text-xs text-[#282A27]/60">Harga Standar:</span>
                      <span className="font-mono text-base font-bold text-[#234A38] tabular-nums">
                        Rp {cfg.standardPricePerKg.toLocaleString('id-ID')}
                        <span className="text-xs font-normal text-[#282A27]/60">/kg</span>
                      </span>
                    </div>

                    <div className="text-[11px] text-[#282A27]/60 font-mono">
                      Stok Siap Alokasi: <span className="font-semibold text-[#38251F]">{cfg.availableStockKg} kg</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedProductModal(cfg)}
                    className="w-full py-2.5 px-3 bg-[#F7F4ED] hover:bg-[#234A38] text-[#38251F] hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    Lihat Detail Spesifikasi
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* R&D Biochar Card */}
            <div className="bg-white rounded-2xl border border-dashed border-[#84936A] overflow-hidden flex flex-col justify-between p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                    Tahap Pengembangan
                  </span>
                </div>

                <h4 className="font-bold text-base text-[#38251F]">Biochar Kulit Kakao (R&D)</h4>
                <p className="text-xs text-[#282A27]/75 leading-relaxed">
                  Pengolahan pirolisis lambat suhu tinggi untuk menghasilkan pembenah tanah dengan retensi hara
                  tinggi dan fiksasi karbon stabil.
                </p>

                <div className="p-3 bg-[#F7F4ED] rounded-xl text-[11px] text-[#282A27]/70 space-y-1">
                  <p>· Status: Pengujian kapasitas tukar kation</p>
                  <p>· Belum tersedia untuk pemesanan komersial</p>
                </div>
              </div>

              <button
                disabled
                className="w-full py-2.5 px-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed text-center"
              >
                Dalam Uji Laboratorium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — TRACEABILITY DAN PENGENDALIAN MUTU */}
      <section id="mutu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#234A38]">
              Traceability & Quality Assurance
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#38251F] leading-tight">
              Sistem Keterlacakan Batch dari Hulu hingga Hilir
            </h3>
            <p className="text-sm text-[#282A27]/80 leading-relaxed">
              Setiap karung produk yang sampai ke pabrik Anda dapat ditelusuri riwayatnya: tanggal penerimaan bahan segar,
              nama petani penyuplai, hasil uji moisture meter, hingga catatan kebersihan fasilitas penjemuran.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#234A38] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#282A27]/80">
                  <strong className="text-[#38251F]">Inspeksi Spora Jamur:</strong> Batch yang terindikasi kontaminasi jamur
                  langsung dialihkan ke karantina dan tidak dapat diperjualbelikan.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#234A38] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#282A27]/80">
                  <strong className="text-[#38251F]">Audit Log Tak Terhapus:</strong> Perubahan status grading dicatat bersama nama
                  petugas penguji dan stempel waktu digital.
                </p>
              </div>
            </div>
          </div>

          {/* Demonstration Batch Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D6] shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D6]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#282A27]/60 block">
                    Contoh Kartu Paspor Batch
                  </span>
                  <span className="text-lg font-mono font-bold text-[#38251F]">{demoBatch.id}</span>
                </div>
                <span className="px-3 py-1 bg-[#234A38] text-white text-xs font-bold rounded-full">
                  {demoBatch.assignedGrade}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Tgl Pemrosesan</span>
                  <span className="font-semibold text-[#38251F]">
                    {new Date(demoBatch.startDate).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Wilayah Asal</span>
                  <span className="font-semibold text-[#38251F]">Gandusari, Kab. Blitar (Jatim)</span>
                </div>
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Berat Awal Segar</span>
                  <span className="font-semibold text-[#38251F] tabular-nums">{demoBatch.initialWeightKg} kg</span>
                </div>
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Hasil Kering</span>
                  <span className="font-semibold text-[#234A38] tabular-nums">{demoBatch.currentWeightKg} kg</span>
                </div>
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Kadar Air Aktual</span>
                  <span className="font-semibold text-[#234A38] tabular-nums">{demoBatch.moistureContentPercent}%</span>
                </div>
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Status Ketersediaan</span>
                  <span className="font-semibold text-emerald-700">Tersedia di Gudang</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#F7F4ED] rounded-xl text-xs text-[#282A27]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-medium">Lokasi Penyimpanan: {demoBatch.location}</span>
                <span className="text-[11px] text-[#282A27]/50 font-mono">Data Terverifikasi QC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — DAMPAK DAN POTENSI (MODEL BMC JAWA TIMUR) */}
      <section id="dampak" className="bg-[#234A38] text-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#84936A] mb-2">
              Indikator Dampak & Skala Pasar
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F7F4ED]">
              Potensi Sirkular Kulit Kakao Jawa Timur
            </h3>
            <p className="text-xs sm:text-sm text-[#EAE3D6]/80 mt-2">
              Berdasarkan studi lapangan 10 calon pembeli & 7 pemasok di Jawa Timur serta model bisnis satu hub CocoaCycle.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-white/10 border border-white/10 space-y-1.5 sm:space-y-2">
              <div className="text-xs text-[#EAE3D6]/70 font-mono">Target Tahun 1 (Hub Jatim)</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F7F4ED] font-mono tabular-nums">
                1.200 <span className="text-base sm:text-lg">Ton</span>
              </div>
              <div className="text-[10px] text-[#84936A] font-semibold">100 ton/bln kulit segar</div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white/10 border border-white/10 space-y-1.5 sm:space-y-2">
              <div className="text-xs text-[#EAE3D6]/70 font-mono">Potensi Pasar Jatim (SAM)</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F7F4ED] font-mono tabular-nums">
                44,8+ <span className="text-base sm:text-lg">Ribu Ton</span>
              </div>
              <div className="text-[10px] text-[#84936A] font-semibold">Setara kulit kering/tahun</div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white/10 border border-white/10 space-y-1.5 sm:space-y-2">
              <div className="text-xs text-[#EAE3D6]/70 font-mono">Target Mitra Pemasok</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F7F4ED] font-mono tabular-nums">
                42 <span className="text-base sm:text-lg">Petani</span>
              </div>
              <div className="text-[10px] text-amber-300 font-semibold">Tahun 1 (Rp100/kg segar)</div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white/10 border border-white/10 space-y-1.5 sm:space-y-2">
              <div className="text-xs text-[#EAE3D6]/70 font-mono">Mitra Pembeli Industri</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F7F4ED] font-mono tabular-nums">
                32 <span className="text-base sm:text-lg">Pabrik</span>
              </div>
              <div className="text-[10px] text-amber-300 font-semibold">Produsen Kompos & Pupuk</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#38251F] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Mulai Bangun Rantai Pasok Kulit Kakao yang Lebih Terukur.
            </h2>
            <p className="text-xs sm:text-sm text-[#EAE3D6]/80 leading-relaxed">
              Bergabunglah bersama jaringan petani mandiri atau penuhi kebutuhan bahan baku organik industri Anda
              dengan kepastian grade dan kadar air.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onOpenAuth('register', 'farmer')}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#234A38] text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#1a382b] transition-colors shadow-xs"
              >
                Daftar sebagai Petani
              </button>
              <button
                onClick={() => onOpenAuth('register', 'buyer')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#38251F] rounded-xl text-xs sm:text-sm font-semibold hover:bg-[#F7F4ED] transition-colors"
              >
                Daftar sebagai Pembeli
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specification Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EAE3D6] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="relative aspect-16/9 bg-slate-100">
              <img
                src={selectedProductModal.image}
                alt={selectedProductModal.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedProductModal(null)}
                className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 bg-[#38251F] text-white text-xs font-bold px-3 py-1 rounded-md">
                {selectedProductModal.grade}
              </div>
            </div>

            <div className="p-6 space-y-4 text-[#282A27]">
              <div>
                <h3 className="text-lg font-bold text-[#38251F]">{selectedProductModal.title}</h3>
                <p className="text-xs text-[#282A27]/70 mt-1">{selectedProductModal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F7F4ED] rounded-xl text-xs font-mono">
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Toleransi Kadar Air</span>
                  <span className="font-bold text-[#234A38]">{selectedProductModal.minMoisture}% - {selectedProductModal.maxMoisture}%</span>
                </div>
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Harga Standar</span>
                  <span className="font-bold text-[#38251F]">Rp {selectedProductModal.standardPricePerKg.toLocaleString('id-ID')} / kg</span>
                </div>
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Minimum Order</span>
                  <span className="font-bold">{selectedProductModal.minOrderKg} kg</span>
                </div>
                <div>
                  <span className="text-[#282A27]/60 block text-[10px]">Stok Tersedia Saat Ini</span>
                  <span className="font-bold text-[#234A38]">{selectedProductModal.availableStockKg} kg</span>
                </div>
              </div>

              <div className="text-xs">
                <span className="font-semibold text-[#38251F] block mb-1">Rekomendasi Aplikasi:</span>
                <p className="text-[#282A27]/80 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedProductModal.recommendedUse}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedProductModal(null)}
                  className="px-4 py-2 text-xs font-medium text-[#282A27] bg-white border border-[#EAE3D6] rounded-xl hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setSelectedProductModal(null);
                    onOpenAuth('register', 'buyer');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#234A38] hover:bg-[#1a382b] rounded-xl transition-colors"
                >
                  Minta Sampel / Pesan Bahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
