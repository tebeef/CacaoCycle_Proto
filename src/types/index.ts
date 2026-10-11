export type UserRole = 'admin' | 'farmer' | 'buyer';

export type AccountStatus = 'aktif' | 'menunggu_verifikasi' | 'ditolak';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  createdAt: string;
  // Specific profile data
  farmerProfile?: {
    farmName: string;
    regency: string; // Kabupaten/Kota
    province: string;
    weeklyVolumeEstimateKg: number;
    preferredMethod: 'diantar' | 'penjemputan';
    address: string;
  };
  buyerProfile?: {
    companyName: string;
    businessType: 'Produsen Kompos' | 'Pupuk Organik' | 'Media Tanam' | 'Pengolah Biomassa' | 'Riset / Lainnya';
    regency: string;
    monthlyNeedsEstimateKg: number;
    targetGrades: ('Grade A' | 'Grade B' | 'Grade C')[];
    address: string;
  };
}

export interface RawMaterialReceipt {
  id: string; // e.g. RCP-202610-001
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  receiptDate: string; // ISO string
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  pricePerKg: number;
  totalAmount: number;
  condition: 'Segar Baru Panen' | 'Layak Olah' | 'Lembap Sedang' | 'Kering Awal';
  contaminationNotes: string;
  status: 'draft' | 'dikonfirmasi';
  notes: string;
  handledBy: string;
  batchId?: string; // linked once processed into batch
}

export type BatchStatus = 
  | 'Baru Diterima' 
  | 'Menunggu Pengolahan' 
  | 'Pencacahan' 
  | 'Pengeringan' 
  | 'Menunggu QC' 
  | 'Selesai' 
  | 'Dikarantina';

export interface ProductionBatch {
  id: string; // e.g. BTC-202610-01
  receiptIds: string[];
  initialWeightKg: number;
  currentWeightKg: number;
  driedWeightKg?: number;
  yieldPercentage?: number; // Rendemen % = (driedWeightKg / initialWeightKg) * 100
  startDate: string;
  dryingEndDate?: string;
  supervisor: string;
  status: BatchStatus;
  moistureContentPercent?: number;
  assignedGrade?: 'Grade A' | 'Grade B' | 'Grade C' | 'Tidak Lolos' | null;
  qcInspectionId?: string;
  notes: string;
  location: string;
}

export interface QualityInspection {
  id: string; // e.g. QC-202610-01
  batchId: string;
  inspectionDate: string;
  inspectorName: string;
  moisturePercent: number; // Moisture meter reading
  cleanlinessScore: 'Sangat Bersih' | 'Bersih' | 'Toleransi Debu Rendah' | 'Tercemar';
  shredUniformity: 'Seragam (10-15mm)' | 'Cukup Seragam' | 'Kasar Tidak Rata';
  moldDetected: boolean; // Mold check: TRUE -> quarantined immediately
  resultGrade: 'Grade A' | 'Grade B' | 'Grade C' | 'Dikarantina';
  qcDecision: 'Lolos Grade A' | 'Lolos Grade B' | 'Lolos Grade C (Kebutuhan Khusus)' | 'Karantina / Tolak';
  notes: string;
  photoSampleUrl?: string;
}

export interface InventoryItem {
  id: string;
  batchId: string;
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  totalWeightKg: number;
  availableWeightKg: number;
  allocatedWeightKg: number;
  moisturePercent: number;
  pricePerKg: number;
  locationBin: string;
  packagingDate: string;
  status: 'Tersedia' | 'Habis' | 'Dikarantina';
}

export interface InventoryMovement {
  id: string;
  date: string;
  type: 'Masuk QC' | 'Alokasi Pesanan' | 'Pelepasan Alokasi' | 'Pengiriman Keluar' | 'Karantina';
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  batchId: string;
  quantityKg: number;
  orderId?: string;
  notes: string;
}

export interface SampleRequest {
  id: string; // e.g. SMP-2026-001
  buyerId: string;
  buyerName: string;
  companyName: string;
  targetGrade: 'Grade A' | 'Grade B' | 'Grade C';
  quantityGrams: 250 | 500 | 1000;
  intendedApplication: string;
  requestDate: string;
  status: 'Diajukan' | 'Ditinjau' | 'Disetujui' | 'Dikirim' | 'Selesai' | 'Ditolak';
  shippingAddress: string;
  adminNotes?: string;
  trackingNumber?: string;
}

export type OrderStatus = 
  | 'Menunggu Konfirmasi' 
  | 'Dikonfirmasi' 
  | 'Disiapkan' 
  | 'Dalam Pengiriman' 
  | 'Diterima' 
  | 'Selesai' 
  | 'Dibatalkan';

export interface SalesOrder {
  id: string; // e.g. ORD-202610-001
  buyerId: string;
  buyerName: string;
  companyName: string;
  orderDate: string;
  batchId: string;
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  quantityKg: number;
  unitPrice: number;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'Menunggu' | 'Sebagian Dibayar' | 'Lunas' | 'Terlambat';
  shippingAddress: string;
  deliveryDateTarget?: string;
  shipmentNumber?: string;
  driverOrCourier?: string;
  proofOfDeliveryUrl?: string;
  invoiceId: string;
  notes?: string;
}

export interface SupplierPayment {
  id: string;
  receiptId: string;
  farmerId: string;
  farmerName: string;
  totalOwed: number;
  totalPaid: number;
  remainingAmount: number;
  transactionDate: string;
  lastPaymentDate?: string;
  status: 'Menunggu' | 'Sebagian Dibayar' | 'Lunas';
  paymentReference?: string;
  method: 'Transfer Bank' | 'Tunai di Pos Timbang';
}

export interface BuyerInvoice {
  id: string;
  orderId: string;
  buyerId: string;
  companyName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'Menunggu' | 'Sebagian Dibayar' | 'Lunas' | 'Terlambat';
  paymentReference?: string;
}

export interface FarmerDeliveryPlan {
  id: string;
  farmerId: string;
  farmerName: string;
  plannedDate: string;
  estimatedWeightKg: number;
  rawCondition: 'Segar Baru Petik' | 'Lembap Sedang';
  deliveryMethod: 'diantar' | 'penjemputan';
  locationNotes: string;
  status: 'Menunggu Konfirmasi' | 'Disetujui' | 'Telah Tiba' | 'Dibatalkan';
  createdAt: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityType: 'Penerimaan' | 'Batch' | 'QC' | 'Inventaris' | 'Pesanan' | 'Pembayaran';
  entityId: string;
  details: string;
}

export interface ProductGradeConfig {
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  title: string;
  maxMoisture: number;
  minMoisture: number;
  description: string;
  standardPricePerKg: number;
  minOrderKg: number;
  recommendedUse: string;
  availableStockKg: number;
  image: string;
}
