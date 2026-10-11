import React from 'react';
import { CocoaCycleLogo } from './CocoaCycleLogo';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#38251F] text-[#F7F4ED] pt-16 pb-12 border-t border-[#234A38]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Narrative */}
          <div className="md:col-span-2 space-y-4">
            <CocoaCycleLogo variant="stacked" size="lg" inverted={true} showTagline={true} className="items-start text-left" />
            <p className="text-xs text-[#EAE3D6]/80 leading-relaxed max-w-md mt-4">
              Platform rantai pasok digital ekonomi sirkular kakao Indonesia. Menghubungkan pasokan kulit kakao segar
              petani perkebunan dengan pembeli industri manufaktur kompos, pupuk organik, dan media tanam melalui mutu
              terukur dan keterlacakan batch.
            </p>
            <div className="text-[11px] text-[#EAE3D6]/60 pt-2 font-mono">
              Operasional Wilayah: Jawa Timur (Blitar · Malang · Kediri · Pasuruan · Jombang · Lumajang)
            </div>
          </div>

          {/* Col 2: Navigasi Produk & Layanan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EAE3D6]">Klasifikasi Bahan</h4>
            <ul className="space-y-2 text-xs text-[#EAE3D6]/80">
              <li>Grade A (&le; 10% Air) — Rp 1.450/kg</li>
              <li>Grade B (&gt; 10% - 14% Air) — Rp 1.300/kg</li>
              <li>Grade C (&gt; 14% - 18% Air) — Rp 1.150/kg</li>
              <li className="text-[#84936A]">Biochar Curah B2B (Lini B) — Rp 4.300/kg</li>
              <li>Layanan Uji Sampel Industri</li>
            </ul>
          </div>

          {/* Col 3: Hubungi Pos Operasional */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EAE3D6]">Sentra CocoaCycle</h4>
            <div className="space-y-2.5 text-xs text-[#EAE3D6]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#84936A] mt-0.5" />
                <span>Sentra Pengolahan & Hub Sentral: Jawa Timur, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-[#84936A]" />
                <span>kemitraan@cocoacycle.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-[#84936A]" />
                <span>+62 821-4567-8900 (Layanan Petani & B2B)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom notices and legal disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#EAE3D6]/60">
          <div className="space-y-1">
            <p>
              &copy; {new Date().getFullYear()} CocoaCycle Indonesia. Seluruh hak cipta dilindungi undang-undang.
            </p>
            <p className="text-[10px] text-[#EAE3D6]/40 leading-normal max-w-3xl">
              Catatan Kepatuhan: Grade A/B/C merupakan klasifikasi internal kendali mutu CocoaCycle berbasis kadar air dan
              kebersihan. Data dampak tertentu disajikan sebagai model simulasi dan proyeksi operasional terukur.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Kebijakan Privasi Kemitraan Petani & B2B CocoaCycle'); }} className="hover:text-white transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Ketentuan Layanan Timbang & Penjualan CocoaCycle'); }} className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
