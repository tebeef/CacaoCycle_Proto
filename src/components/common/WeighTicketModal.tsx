import React from 'react';
import { RawMaterialReceipt } from '../../types';
import { CocoaCycleLogo } from '../CocoaCycleLogo';
import { Printer, X, CheckCircle, Scale } from 'lucide-react';

interface WeighTicketModalProps {
  receipt: RawMaterialReceipt | null;
  onClose: () => void;
}

export const WeighTicketModal: React.FC<WeighTicketModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col border border-[#EAE3D6] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#EAE3D6] bg-[#F7F4ED] shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#234A38]" />
            <h3 className="font-semibold text-xs sm:text-sm text-[#38251F]">Bukti Timbang Resmi (Weighbridge Slip)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#282A27]/60 hover:text-[#282A27] rounded-lg hover:bg-[#EAE3D6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 text-[#282A27] overflow-y-auto flex-1" id="printable-weigh-ticket">
          {/* Brand header */}
          <div className="text-center pb-4 border-b border-dashed border-[#EAE3D6]">
            <CocoaCycleLogo variant="stacked" size="md" showTagline={true} className="mx-auto" />
            <p className="text-xs text-[#282A27]/60 mt-2 font-mono">
              Fasilitas Pengumpulan & Pengeringan Hub Jawa Timur (Blitar - Malang)
            </p>
          </div>

          {/* Ticket Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#282A27]/60 block">Nomor Timbang</span>
              <span className="font-bold text-sm text-[#38251F]">{receipt.id}</span>
            </div>
            <div className="text-right">
              <span className="text-[#282A27]/60 block">Waktu Timbang</span>
              <span className="font-medium">
                {new Date(receipt.receiptDate).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <div>
              <span className="text-[#282A27]/60 block">Pemasok / Petani</span>
              <span className="font-semibold text-[#234A38]">{receipt.farmerName}</span>
              <span className="text-[11px] text-[#282A27]/70 block">{receipt.farmerLocation}</span>
            </div>
            <div className="text-right">
              <span className="text-[#282A27]/60 block">Petugas Penimbang</span>
              <span className="font-medium">{receipt.handledBy}</span>
            </div>
          </div>

          {/* Scale Weights */}
          <div className="bg-[#F7F4ED] rounded-xl p-4 border border-[#EAE3D6] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#282A27]/70">Berat Kotor (Gross)</span>
              <span className="font-mono tabular-nums font-medium">{receipt.grossWeightKg.toLocaleString('id-ID')} kg</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#282A27]/70">Berat Tara (Kemasan/Wadah)</span>
              <span className="font-mono tabular-nums font-medium text-amber-700">- {receipt.tareWeightKg.toLocaleString('id-ID')} kg</span>
            </div>
            <div className="border-t border-[#EAE3D6] pt-2 flex justify-between items-center">
              <span className="font-semibold text-sm text-[#38251F]">Berat Bersih Diterima (Netto)</span>
              <span className="font-mono tabular-nums font-bold text-lg text-[#234A38]">
                {receipt.netWeightKg.toLocaleString('id-ID')} kg
              </span>
            </div>
          </div>

          {/* Financial Calculation */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#282A27]/70">Harga Pembelian Standar</span>
              <span className="font-mono tabular-nums">Rp {receipt.pricePerKg.toLocaleString('id-ID')} / kg</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#EAE3D6]">
              <span className="font-semibold text-[#38251F]">Total Hak Pembayaran Petani</span>
              <span className="font-mono tabular-nums font-bold text-base text-[#38251F]">
                Rp {receipt.totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Condition Notes */}
          <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="font-medium text-[#38251F]">Pemeriksaan Fisik Bahan Baku:</div>
            <p className="text-[#282A27]/80 mt-0.5">Kondisi: {receipt.condition}</p>
            <p className="text-[#282A27]/80 mt-0.5">Sortasi: {receipt.contaminationNotes || 'Bebas kontaminan berat'}</p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between text-xs pt-2">
            <div className="flex items-center gap-1.5 text-[#234A38] font-medium">
              <CheckCircle className="w-4 h-4 text-[#234A38]" />
              Status: {receipt.status === 'dikonfirmasi' ? 'Telah Diverifikasi & Diterima' : 'Draft'}
            </div>
            <div className="text-[#282A27]/50 font-mono text-[11px]">
              Sistem Penimbangan Digital CocoaCycle
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#F7F4ED] border-t border-[#EAE3D6]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#282A27] bg-white border border-[#EAE3D6] rounded-lg hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#234A38] hover:bg-[#1b3a2c] rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Cetak Bukti Timbang
          </button>
        </div>
      </div>
    </div>
  );
};
