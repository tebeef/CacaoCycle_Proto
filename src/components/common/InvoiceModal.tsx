import React from 'react';
import { SalesOrder, BuyerInvoice } from '../../types';
import { CocoaCycleLogo } from '../CocoaCycleLogo';
import { Printer, X, FileText, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  order: SalesOrder | null;
  invoice: BuyerInvoice | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, invoice, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-[#EAE3D6] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#EAE3D6] bg-[#F7F4ED] shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#234A38]" />
            <h3 className="font-semibold text-xs sm:text-sm text-[#38251F]">Faktur Penjualan Komersial B2B</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#282A27]/60 hover:text-[#282A27] rounded-lg hover:bg-[#EAE3D6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 text-[#282A27] overflow-y-auto flex-1" id="printable-invoice">
          {/* Top Lockup */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 sm:pb-6 border-b border-[#EAE3D6]">
            <div>
              <CocoaCycleLogo variant="horizontal" size="md" showTagline={true} />
              <p className="text-xs text-[#282A27]/70 mt-2 max-w-xs">
                CocoaCycle Indonesia · Sentra Pasokan Bahan Baku Organik Kering (Hub Jawa Timur)
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="font-bold text-lg sm:text-xl text-[#38251F]">INVOICE</div>
              <div className="font-mono text-xs font-semibold text-[#234A38]">{order.invoiceId}</div>
              <div className="text-xs text-[#282A27]/60 mt-1">
                Tanggal: {new Date(order.orderDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </div>
            </div>
          </div>

          {/* Client & Billing Info */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-[#282A27]/60 uppercase tracking-wider font-semibold block mb-1">
                Tagihan Kepada:
              </span>
              <p className="font-bold text-sm text-[#38251F]">{order.companyName}</p>
              <p className="text-[#282A27]/80 mt-0.5">u.p. {order.buyerName}</p>
              <p className="text-[#282A27]/70 mt-1 leading-relaxed">{order.shippingAddress}</p>
            </div>
            <div>
              <span className="text-[#282A27]/60 uppercase tracking-wider font-semibold block mb-1">
                Detail Transaksi:
              </span>
              <p><span className="text-[#282A27]/70">No. Pesanan:</span> <span className="font-mono font-medium">{order.id}</span></p>
              <p><span className="text-[#282A27]/70">Batch Sumber:</span> <span className="font-mono font-medium">{order.batchId}</span></p>
              <p><span className="text-[#282A27]/70">Status Pembayaran:</span> <span className={`font-semibold ${order.paymentStatus === 'Lunas' ? 'text-emerald-700' : 'text-amber-700'}`}>{order.paymentStatus}</span></p>
              {order.shipmentNumber && (
                <p><span className="text-[#282A27]/70">Resi Logistik:</span> <span className="font-mono">{order.shipmentNumber}</span></p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-[#EAE3D6] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F4ED] text-[#38251F] font-semibold border-b border-[#EAE3D6]">
                <tr>
                  <th className="py-3 px-4">Deskripsi Produk</th>
                  <th className="py-3 px-4 text-center">Grade Mutu</th>
                  <th className="py-3 px-4 text-right">Kuantitas (kg)</th>
                  <th className="py-3 px-4 text-right">Harga Satuan</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6]">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-medium text-[#38251F]">Kulit Buah Kakao Kering Cacah</p>
                    <p className="text-[11px] text-[#282A27]/60">Spesifikasi kadar air terukur & bebas jamur</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-[#234A38]">{order.grade}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{order.quantityKg.toLocaleString('id-ID')} kg</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">Rp {order.unitPrice.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-medium">Rp {order.subtotal.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-[#282A27]/80">
                <span>Subtotal Barang</span>
                <span className="font-mono tabular-nums">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-[#282A27]/80">
                <span>Biaya Ekspedisi / Logistik</span>
                <span className="font-mono tabular-nums">Rp {order.shippingCost.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t border-[#EAE3D6] pt-2 flex justify-between font-bold text-sm text-[#38251F]">
                <span>Total Tagihan</span>
                <span className="font-mono tabular-nums text-[#234A38]">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              {invoice && invoice.paidAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>Telah Dibayar</span>
                  <span className="font-mono tabular-nums">- Rp {invoice.paidAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {invoice && invoice.balanceDue > 0 && (
                <div className="flex justify-between text-xs font-semibold text-amber-700">
                  <span>Sisa Pembayaran</span>
                  <span className="font-mono tabular-nums">Rp {invoice.balanceDue.toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Terms & Bank Details */}
          <div className="bg-[#F7F4ED] p-4 rounded-xl border border-[#EAE3D6] text-xs space-y-1">
            <p className="font-semibold text-[#38251F]">Instruksi Pembayaran Rekening Resmi CocoaCycle:</p>
            <p className="text-[#282A27]/80">Bank Mandiri · No. Rek: <span className="font-mono font-semibold">142-00-9988776-5</span> a.n. PT Rantai Siklus Kakao</p>
            <p className="text-[#282A27]/80">BCA · No. Rek: <span className="font-mono font-semibold">820-5544-321</span> a.n. CocoaCycle Indonesia</p>
            <p className="text-[11px] text-[#282A27]/60 mt-1 italic">
              *Harap cantumkan nomor invoice {order.invoiceId} pada berita transfer.
            </p>
          </div>

          {/* Signature/Seal indicator */}
          <div className="flex justify-between items-center text-xs text-[#282A27]/60 pt-2 border-t border-[#EAE3D6]">
            <div className="flex items-center gap-1.5 text-[#234A38]">
              <CheckCircle2 className="w-4 h-4 text-[#234A38]" />
              Dokumen Sah Diterbitkan Sistem CocoaCycle B2B
            </div>
            <div className="text-right">
              Divisi Keuangan & Niaga CocoaCycle
            </div>
          </div>
        </div>

        {/* Footer actions */}
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
            Cetak Faktur
          </button>
        </div>
      </div>
    </div>
  );
};
