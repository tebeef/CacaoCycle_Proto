import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  RawMaterialReceipt,
  ProductionBatch,
  QualityInspection,
  InventoryItem,
  InventoryMovement,
  SampleRequest,
  SalesOrder,
  SupplierPayment,
  BuyerInvoice,
  FarmerDeliveryPlan,
  AuditLog,
  ProductGradeConfig,
  BatchStatus,
  OrderStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_RECEIPTS,
  INITIAL_BATCHES,
  INITIAL_QC_INSPECTIONS,
  INITIAL_INVENTORY,
  INITIAL_MOVEMENTS,
  INITIAL_ORDERS,
  INITIAL_SAMPLES,
  INITIAL_SUPPLIER_PAYMENTS,
  INITIAL_BUYER_INVOICES,
  INITIAL_DELIVERY_PLANS,
  INITIAL_AUDIT_LOGS,
  INITIAL_GRADE_CONFIGS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  receipts: RawMaterialReceipt[];
  batches: ProductionBatch[];
  qcInspections: QualityInspection[];
  inventory: InventoryItem[];
  movements: InventoryMovement[];
  orders: SalesOrder[];
  samples: SampleRequest[];
  supplierPayments: SupplierPayment[];
  buyerInvoices: BuyerInvoice[];
  deliveryPlans: FarmerDeliveryPlan[];
  auditLogs: AuditLog[];
  gradeConfigs: ProductGradeConfig[];
  
  // Navigation & View State
  currentView: 'landing' | 'app';
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  setCurrentView: (view: 'landing' | 'app') => void;

  // Actions
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
  switchUserRole: (role: UserRole, userId?: string) => void;
  registerUser: (userData: Partial<User>) => void;
  updateUserStatus: (userId: string, status: 'aktif' | 'menunggu_verifikasi' | 'ditolak') => void;

  // Receipts
  addReceipt: (receipt: Omit<RawMaterialReceipt, 'id' | 'status' | 'totalAmount'>) => RawMaterialReceipt;
  confirmReceipt: (receiptId: string) => void;

  // Batches
  createBatch: (initialWeightKg: number, receiptIds: string[], supervisor: string, location?: string) => ProductionBatch;
  updateBatchStep: (batchId: string, status: BatchStatus, driedWeightKg?: number, notes?: string) => void;

  // Quality Control
  submitQCInspection: (inspection: Omit<QualityInspection, 'id' | 'resultGrade' | 'qcDecision'>) => QualityInspection;

  // Orders & Samples
  placeOrder: (order: {
    buyerId: string;
    grade: 'Grade A' | 'Grade B' | 'Grade C';
    batchId: string;
    quantityKg: number;
    shippingAddress: string;
    notes?: string;
  }) => { success: boolean; message: string; order?: SalesOrder };
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNo?: string, courier?: string) => void;
  createSampleRequest: (data: Omit<SampleRequest, 'id' | 'status' | 'requestDate'>) => void;
  updateSampleStatus: (sampleId: string, status: SampleRequest['status'], adminNotes?: string, trackingNumber?: string) => void;

  // Delivery Plans
  submitDeliveryPlan: (plan: Omit<FarmerDeliveryPlan, 'id' | 'status' | 'createdAt'>) => void;
  updateDeliveryPlanStatus: (planId: string, status: FarmerDeliveryPlan['status']) => void;

  // Payments
  paySupplier: (paymentId: string, amount: number, reference: string, method: 'Transfer Bank' | 'Tunai di Pos Timbang') => void;
  payBuyerInvoice: (invoiceId: string, amount: number, reference: string) => void;

  // Config & Reset
  updateGradePrice: (grade: 'Grade A' | 'Grade B' | 'Grade C', newPrice: number) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'cocoacycle_platform_state_v2_bmc';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [receipts, setReceipts] = useState<RawMaterialReceipt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_receipts`);
    return saved ? JSON.parse(saved) : INITIAL_RECEIPTS;
  });

  const [batches, setBatches] = useState<ProductionBatch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_batches`);
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [qcInspections, setQcInspections] = useState<QualityInspection[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_qc`);
    return saved ? JSON.parse(saved) : INITIAL_QC_INSPECTIONS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [movements, setMovements] = useState<InventoryMovement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_movements`);
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
  });

  const [orders, setOrders] = useState<SalesOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [samples, setSamples] = useState<SampleRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_samples`);
    return saved ? JSON.parse(saved) : INITIAL_SAMPLES;
  });

  const [supplierPayments, setSupplierPayments] = useState<SupplierPayment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_supplier_payments`);
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIER_PAYMENTS;
  });

  const [buyerInvoices, setBuyerInvoices] = useState<BuyerInvoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_buyer_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_BUYER_INVOICES;
  });

  const [deliveryPlans, setDeliveryPlans] = useState<FarmerDeliveryPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_delivery_plans`);
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_PLANS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit_logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [gradeConfigs, setGradeConfigs] = useState<ProductGradeConfig[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_grade_configs`);
    return saved ? JSON.parse(saved) : INITIAL_GRADE_CONFIGS;
  });

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
    localStorage.setItem(`${STORAGE_KEY}_receipts`, JSON.stringify(receipts));
    localStorage.setItem(`${STORAGE_KEY}_batches`, JSON.stringify(batches));
    localStorage.setItem(`${STORAGE_KEY}_qc`, JSON.stringify(qcInspections));
    localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
    localStorage.setItem(`${STORAGE_KEY}_movements`, JSON.stringify(movements));
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
    localStorage.setItem(`${STORAGE_KEY}_samples`, JSON.stringify(samples));
    localStorage.setItem(`${STORAGE_KEY}_supplier_payments`, JSON.stringify(supplierPayments));
    localStorage.setItem(`${STORAGE_KEY}_buyer_invoices`, JSON.stringify(buyerInvoices));
    localStorage.setItem(`${STORAGE_KEY}_delivery_plans`, JSON.stringify(deliveryPlans));
    localStorage.setItem(`${STORAGE_KEY}_audit_logs`, JSON.stringify(auditLogs));
    localStorage.setItem(`${STORAGE_KEY}_grade_configs`, JSON.stringify(gradeConfigs));
  }, [
    users,
    receipts,
    batches,
    qcInspections,
    inventory,
    movements,
    orders,
    samples,
    supplierPayments,
    buyerInvoices,
    deliveryPlans,
    auditLogs,
    gradeConfigs,
  ]);

  const addAuditLog = (
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Sistem',
      action,
      entityType,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const login = (email: string, role?: UserRole): boolean => {
    const targetUser = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role)
    );
    if (targetUser) {
      setCurrentUser(targetUser);
      setCurrentView('app');
      setActiveNavTab('dashboard');
      return true;
    }
    // Fallback: search by role or default
    const fallbackUser = users.find((u) => u.role === (role || 'admin')) || users[0];
    if (fallbackUser) {
      setCurrentUser(fallbackUser);
      setCurrentView('app');
      setActiveNavTab('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    setActiveNavTab('dashboard');
  };

  const switchUserRole = (role: UserRole, userId?: string) => {
    let target = userId ? users.find((u) => u.id === userId) : null;
    if (!target) {
      target = users.find((u) => u.role === role) || null;
    }
    if (target) {
      setCurrentUser(target);
      setCurrentView('app');
      setActiveNavTab('dashboard');
    }
  };

  const registerUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: userData.name || 'Pengguna Baru',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'farmer',
      status: 'menunggu_verifikasi',
      createdAt: new Date().toISOString(),
      farmerProfile: userData.farmerProfile,
      buyerProfile: userData.buyerProfile,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentView('app');
    setActiveNavTab('dashboard');
    addAuditLog('Pendaftaran Pengguna Baru', 'Penerimaan', newUser.id, `Pendaftaran akun ${newUser.role}: ${newUser.name}`);
  };

  const updateUserStatus = (userId: string, status: 'aktif' | 'menunggu_verifikasi' | 'ditolak') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    addAuditLog('Perubahan Status Akun', 'Penerimaan', userId, `Status akun diubah menjadi ${status}`);
  };

  const addReceipt = (data: Omit<RawMaterialReceipt, 'id' | 'status' | 'totalAmount'>): RawMaterialReceipt => {
    const totalAmount = data.netWeightKg * data.pricePerKg;
    const newReceipt: RawMaterialReceipt = {
      ...data,
      id: `RCP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(receipts.length + 1).padStart(3, '0')}`,
      status: 'draft',
      totalAmount,
    };
    setReceipts((prev) => [newReceipt, ...prev]);
    addAuditLog('Input Penerimaan Baru', 'Penerimaan', newReceipt.id, `Timbang bersih ${newReceipt.netWeightKg} kg dari ${newReceipt.farmerName}`);
    return newReceipt;
  };

  const confirmReceipt = (receiptId: string) => {
    const rcp = receipts.find((r) => r.id === receiptId);
    if (!rcp || rcp.status === 'dikonfirmasi') return;

    // Update receipt status
    setReceipts((prev) =>
      prev.map((r) => (r.id === receiptId ? { ...r, status: 'dikonfirmasi' } : r))
    );

    // Create supplier payment record
    const newPayment: SupplierPayment = {
      id: `PAY-FARMER-${Date.now().toString().slice(-4)}`,
      receiptId: rcp.id,
      farmerId: rcp.farmerId,
      farmerName: rcp.farmerName,
      totalOwed: rcp.totalAmount,
      totalPaid: 0,
      remainingAmount: rcp.totalAmount,
      transactionDate: new Date().toISOString(),
      status: 'Menunggu',
      method: 'Transfer Bank',
    };
    setSupplierPayments((prev) => [newPayment, ...prev]);

    addAuditLog(
      'Konfirmasi Penerimaan',
      'Penerimaan',
      receiptId,
      `Penerimaan dikonfirmasi senilai Rp ${rcp.totalAmount.toLocaleString('id-ID')}`
    );
  };

  const createBatch = (
    initialWeightKg: number,
    receiptIds: string[],
    supervisor: string,
    location: string = 'Lantai Sortasi & Cacah'
  ): ProductionBatch => {
    const newBatch: ProductionBatch = {
      id: `BTC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(batches.length + 1).padStart(2, '0')}`,
      receiptIds,
      initialWeightKg,
      currentWeightKg: initialWeightKg,
      startDate: new Date().toISOString(),
      supervisor,
      status: 'Menunggu Pengolahan',
      location,
      notes: `Batch dibuat dari ${receiptIds.length} penerimaan bahan baku.`,
    };

    // link batch to receipts
    setReceipts((prev) =>
      prev.map((r) =>
        receiptIds.includes(r.id) ? { ...r, batchId: newBatch.id } : r
      )
    );

    setBatches((prev) => [newBatch, ...prev]);
    addAuditLog('Pembuatan Batch Baru', 'Batch', newBatch.id, `Batch ${newBatch.id} dimulai (${initialWeightKg} kg)`);
    return newBatch;
  };

  const updateBatchStep = (
    batchId: string,
    status: BatchStatus,
    driedWeightKg?: number,
    notes?: string
  ) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        const updatedWeight = driedWeightKg ?? b.currentWeightKg;
        const yieldPercent =
          driedWeightKg && b.initialWeightKg > 0
            ? Number(((driedWeightKg / b.initialWeightKg) * 100).toFixed(2))
            : b.yieldPercentage;

        return {
          ...b,
          status,
          currentWeightKg: updatedWeight,
          driedWeightKg: driedWeightKg ?? b.driedWeightKg,
          yieldPercentage: yieldPercent,
          notes: notes || b.notes,
          dryingEndDate: status === 'Menunggu QC' || status === 'Selesai' ? new Date().toISOString() : b.dryingEndDate,
        };
      })
    );
    addAuditLog('Update Tahapan Batch', 'Batch', batchId, `Status batch ${batchId} diubah menjadi ${status}`);
  };

  const submitQCInspection = (
    data: Omit<QualityInspection, 'id' | 'resultGrade' | 'qcDecision'>
  ): QualityInspection => {
    // Business logic for grading:
    // - Mold detected -> quarantine immediately
    // - Moisture <= 10.0% -> Grade A
    // - Moisture > 10.0% and <= 14.0% -> Grade B
    // - Moisture > 14.0% and <= 18.0% -> Grade C
    // - Moisture > 18.0% -> quarantine / fail
    let resultGrade: QualityInspection['resultGrade'] = 'Dikarantina';
    let qcDecision: QualityInspection['qcDecision'] = 'Karantina / Tolak';

    if (data.moldDetected) {
      resultGrade = 'Dikarantina';
      qcDecision = 'Karantina / Tolak';
    } else if (data.moisturePercent <= 10.0 && data.cleanlinessScore !== 'Tercemar') {
      resultGrade = 'Grade A';
      qcDecision = 'Lolos Grade A';
    } else if (data.moisturePercent <= 14.0 && data.cleanlinessScore !== 'Tercemar') {
      resultGrade = 'Grade B';
      qcDecision = 'Lolos Grade B';
    } else if (data.moisturePercent <= 18.0 && data.cleanlinessScore !== 'Tercemar') {
      resultGrade = 'Grade C';
      qcDecision = 'Lolos Grade C (Kebutuhan Khusus)';
    } else {
      resultGrade = 'Dikarantina';
      qcDecision = 'Karantina / Tolak';
    }

    const newInspection: QualityInspection = {
      ...data,
      id: `QC-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(qcInspections.length + 1).padStart(2, '0')}`,
      resultGrade,
      qcDecision,
    };

    setQcInspections((prev) => [newInspection, ...prev]);

    // Update batch status based on QC
    const targetBatch = batches.find((b) => b.id === data.batchId);
    const driedWeight = targetBatch?.driedWeightKg || targetBatch?.currentWeightKg || 0;

    if (resultGrade === 'Dikarantina') {
      updateBatchStep(data.batchId, 'Dikarantina', undefined, `QC Gagal: ${data.notes}. Dikarantina.`);
      setBatches((prev) =>
        prev.map((b) =>
          b.id === data.batchId
            ? {
                ...b,
                status: 'Dikarantina',
                assignedGrade: 'Tidak Lolos',
                moistureContentPercent: data.moisturePercent,
                qcInspectionId: newInspection.id,
              }
            : b
        )
      );
    } else {
      // Approved into inventory
      setBatches((prev) =>
        prev.map((b) =>
          b.id === data.batchId
            ? {
                ...b,
                status: 'Selesai',
                assignedGrade: resultGrade,
                moistureContentPercent: data.moisturePercent,
                qcInspectionId: newInspection.id,
              }
            : b
        )
      );

      // Add to inventory
      const pricePerKg =
        resultGrade === 'Grade A' ? 1450 : resultGrade === 'Grade B' ? 1300 : 1150;

      const newInvItem: InventoryItem = {
        id: `INV-${resultGrade.replace(' ', '')}-${Date.now().toString().slice(-4)}`,
        batchId: data.batchId,
        grade: resultGrade,
        totalWeightKg: driedWeight,
        availableWeightKg: driedWeight,
        allocatedWeightKg: 0,
        moisturePercent: data.moisturePercent,
        pricePerKg,
        locationBin: `Gudang Komersial ${resultGrade}`,
        packagingDate: new Date().toISOString().split('T')[0],
        status: 'Tersedia',
      };

      setInventory((prev) => [newInvItem, ...prev]);

      // Record movement
      const newMovement: InventoryMovement = {
        id: `MOV-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString(),
        type: 'Masuk QC',
        grade: resultGrade,
        batchId: data.batchId,
        quantityKg: driedWeight,
        notes: `Batch ${data.batchId} lulus QC ${resultGrade} (${data.moisturePercent}%) masuk inventaris`,
      };
      setMovements((prev) => [newMovement, ...prev]);
    }

    addAuditLog('Pemeriksaan QC', 'QC', newInspection.id, `Pemeriksaan ${data.batchId}: ${qcDecision} (Kadar air ${data.moisturePercent}%)`);
    return newInspection;
  };

  const placeOrder = (data: {
    buyerId: string;
    grade: 'Grade A' | 'Grade B' | 'Grade C';
    batchId: string;
    quantityKg: number;
    shippingAddress: string;
    notes?: string;
  }) => {
    // Check inventory stock availability
    const invItems = inventory.filter(
      (item) => item.grade === data.grade && item.status === 'Tersedia'
    );
    const totalAvailable = invItems.reduce((acc, curr) => acc + curr.availableWeightKg, 0);

    if (totalAvailable < data.quantityKg) {
      return {
        success: false,
        message: `Stok ${data.grade} tidak mencukupi (Tersedia: ${totalAvailable} kg, Diminta: ${data.quantityKg} kg).`,
      };
    }

    const buyer = users.find((u) => u.id === data.buyerId);
    const unitPrice =
      gradeConfigs.find((c) => c.grade === data.grade)?.standardPricePerKg ||
      (data.grade === 'Grade A' ? 1450 : data.grade === 'Grade B' ? 1300 : 1150);

    const subtotal = data.quantityKg * unitPrice;
    const shippingCost = Math.round(data.quantityKg * 250); // estimasi logistik lokal Jawa Timur ~Rp 250/kg
    const totalAmount = subtotal + shippingCost;

    const newOrderId = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(orders.length + 1).padStart(3, '0')}`;
    const newInvoiceId = `INV-SO-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(orders.length + 1).padStart(3, '0')}`;

    // Allocate stock across available items
    let remainingToAllocate = data.quantityKg;
    setInventory((prev) =>
      prev.map((item) => {
        if (item.grade !== data.grade || remainingToAllocate <= 0) return item;
        const take = Math.min(item.availableWeightKg, remainingToAllocate);
        remainingToAllocate -= take;
        return {
          ...item,
          availableWeightKg: item.availableWeightKg - take,
          allocatedWeightKg: item.allocatedWeightKg + take,
        };
      })
    );

    const newOrder: SalesOrder = {
      id: newOrderId,
      buyerId: data.buyerId,
      buyerName: buyer?.name || 'Pembeli B2B',
      companyName: buyer?.buyerProfile?.companyName || buyer?.name || 'Perusahaan B2B',
      orderDate: new Date().toISOString(),
      batchId: data.batchId,
      grade: data.grade,
      quantityKg: data.quantityKg,
      unitPrice,
      subtotal,
      shippingCost,
      totalAmount,
      status: 'Menunggu Konfirmasi',
      paymentStatus: 'Menunggu',
      shippingAddress: data.shippingAddress,
      invoiceId: newInvoiceId,
      notes: data.notes,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Create Invoice
    const newInvoice: BuyerInvoice = {
      id: newInvoiceId,
      orderId: newOrderId,
      buyerId: data.buyerId,
      companyName: newOrder.companyName,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      totalAmount,
      paidAmount: 0,
      balanceDue: totalAmount,
      status: 'Menunggu',
    };
    setBuyerInvoices((prev) => [newInvoice, ...prev]);

    // Record movement
    const newMovement: InventoryMovement = {
      id: `MOV-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString(),
      type: 'Alokasi Pesanan',
      grade: data.grade,
      batchId: data.batchId,
      quantityKg: data.quantityKg,
      orderId: newOrderId,
      notes: `Alokasi stok ${data.quantityKg} kg untuk pesanan ${newOrderId}`,
    };
    setMovements((prev) => [newMovement, ...prev]);

    addAuditLog('Pesanan Dibuat', 'Pesanan', newOrderId, `Pesanan baru ${data.quantityKg} kg ${data.grade} oleh ${newOrder.companyName}`);

    return { success: true, message: 'Pesanan berhasil dibuat.', order: newOrder };
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNo?: string,
    courier?: string
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // If cancelled, release allocated stock
    if (status === 'Dibatalkan' && order.status !== 'Dibatalkan') {
      let remainingToRelease = order.quantityKg;
      setInventory((prev) =>
        prev.map((item) => {
          if (item.grade !== order.grade || remainingToRelease <= 0) return item;
          const release = Math.min(item.allocatedWeightKg, remainingToRelease);
          remainingToRelease -= release;
          return {
            ...item,
            availableWeightKg: item.availableWeightKg + release,
            allocatedWeightKg: item.allocatedWeightKg - release,
          };
        })
      );
      const newMovement: InventoryMovement = {
        id: `MOV-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString(),
        type: 'Pelepasan Alokasi',
        grade: order.grade,
        batchId: order.batchId,
        quantityKg: order.quantityKg,
        orderId,
        notes: `Pesanan ${orderId} dibatalkan. Stok dialihkan kembali ke stok tersedia.`,
      };
      setMovements((prev) => [newMovement, ...prev]);
    }

    // If completed/delivered out, deduct from total inventory
    if (status === 'Selesai' && order.status !== 'Selesai') {
      let remainingToDeduct = order.quantityKg;
      setInventory((prev) =>
        prev.map((item) => {
          if (item.grade !== order.grade || remainingToDeduct <= 0) return item;
          const deduct = Math.min(item.allocatedWeightKg, remainingToDeduct);
          remainingToDeduct -= deduct;
          return {
            ...item,
            totalWeightKg: Math.max(0, item.totalWeightKg - deduct),
            allocatedWeightKg: Math.max(0, item.allocatedWeightKg - deduct),
          };
        })
      );
      const newMovement: InventoryMovement = {
        id: `MOV-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString(),
        type: 'Pengiriman Keluar',
        grade: order.grade,
        batchId: order.batchId,
        quantityKg: order.quantityKg,
        orderId,
        notes: `Pesanan ${orderId} selesai terkirim dan diterima pembeli.`,
      };
      setMovements((prev) => [newMovement, ...prev]);
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status,
          shipmentNumber: trackingNo || o.shipmentNumber,
          driverOrCourier: courier || o.driverOrCourier,
        };
      })
    );

    addAuditLog('Update Status Pesanan', 'Pesanan', orderId, `Pesanan ${orderId} diubah ke status: ${status}`);
  };

  const createSampleRequest = (data: Omit<SampleRequest, 'id' | 'status' | 'requestDate'>) => {
    const newSample: SampleRequest = {
      ...data,
      id: `SMP-${new Date().getFullYear()}-${String(samples.length + 1).padStart(3, '0')}`,
      status: 'Diajukan',
      requestDate: new Date().toISOString(),
    };
    setSamples((prev) => [newSample, ...prev]);
    addAuditLog('Permintaan Sampel', 'Pesanan', newSample.id, `Permintaan sampel ${data.targetGrade} (${data.quantityGrams}g) oleh ${data.companyName}`);
  };

  const updateSampleStatus = (
    sampleId: string,
    status: SampleRequest['status'],
    adminNotes?: string,
    trackingNumber?: string
  ) => {
    setSamples((prev) =>
      prev.map((s) => {
        if (s.id !== sampleId) return s;
        return {
          ...s,
          status,
          adminNotes: adminNotes || s.adminNotes,
          trackingNumber: trackingNumber || s.trackingNumber,
        };
      })
    );
    addAuditLog('Update Status Sampel', 'Pesanan', sampleId, `Sampel ${sampleId} diubah ke status: ${status}`);
  };

  const submitDeliveryPlan = (data: Omit<FarmerDeliveryPlan, 'id' | 'status' | 'createdAt'>) => {
    const newPlan: FarmerDeliveryPlan = {
      ...data,
      id: `PLN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(deliveryPlans.length + 1).padStart(2, '0')}`,
      status: 'Menunggu Konfirmasi',
      createdAt: new Date().toISOString(),
    };
    setDeliveryPlans((prev) => [newPlan, ...prev]);
    addAuditLog('Rencana Pengiriman Petani', 'Penerimaan', newPlan.id, `Petani ${data.farmerName} mengajukan rencana kirim ${data.estimatedWeightKg} kg`);
  };

  const updateDeliveryPlanStatus = (planId: string, status: FarmerDeliveryPlan['status']) => {
    setDeliveryPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status } : p))
    );
    addAuditLog('Status Rencana Kirim', 'Penerimaan', planId, `Rencana pengiriman ${planId} diubah ke status: ${status}`);
  };

  const paySupplier = (
    paymentId: string,
    amount: number,
    reference: string,
    method: 'Transfer Bank' | 'Tunai di Pos Timbang'
  ) => {
    setSupplierPayments((prev) =>
      prev.map((p) => {
        if (p.id !== paymentId) return p;
        const newPaid = Math.min(p.totalOwed, p.totalPaid + amount);
        const remaining = Math.max(0, p.totalOwed - newPaid);
        const status = remaining === 0 ? 'Lunas' : 'Sebagian Dibayar';
        return {
          ...p,
          totalPaid: newPaid,
          remainingAmount: remaining,
          lastPaymentDate: new Date().toISOString(),
          status,
          paymentReference: reference,
          method,
        };
      })
    );
    addAuditLog('Pembayaran Pemasok', 'Pembayaran', paymentId, `Pembayaran ke petani Rp ${amount.toLocaleString('id-ID')} via ${method}`);
  };

  const payBuyerInvoice = (invoiceId: string, amount: number, reference: string) => {
    setBuyerInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = Math.min(inv.totalAmount, inv.paidAmount + amount);
        const remaining = Math.max(0, inv.totalAmount - newPaid);
        const status = remaining === 0 ? 'Lunas' : 'Sebagian Dibayar';
        return {
          ...inv,
          paidAmount: newPaid,
          balanceDue: remaining,
          status,
          paymentReference: reference,
        };
      })
    );

    // Also update order paymentStatus
    const targetInv = buyerInvoices.find((i) => i.id === invoiceId);
    if (targetInv) {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== targetInv.orderId) return o;
          const newPaid = Math.min(o.totalAmount, (targetInv.paidAmount + amount));
          return {
            ...o,
            paymentStatus: newPaid >= o.totalAmount ? 'Lunas' : 'Sebagian Dibayar',
          };
        })
      );
    }

    addAuditLog('Penerimaan Pembayaran Pembeli', 'Pembayaran', invoiceId, `Penerimaan tagihan Rp ${amount.toLocaleString('id-ID')}`);
  };

  const updateGradePrice = (grade: 'Grade A' | 'Grade B' | 'Grade C', newPrice: number) => {
    setGradeConfigs((prev) =>
      prev.map((g) => (g.grade === grade ? { ...g, standardPricePerKg: newPrice } : g))
    );
    // update inventory item pricing
    setInventory((prev) =>
      prev.map((item) => (item.grade === grade ? { ...item, pricePerKg: newPrice } : item))
    );
    addAuditLog('Perubahan Harga Dasar', 'Inventaris', grade, `Harga ${grade} disesuaikan ke Rp ${newPrice.toLocaleString('id-ID')}/kg`);
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_receipts`);
    localStorage.removeItem(`${STORAGE_KEY}_batches`);
    localStorage.removeItem(`${STORAGE_KEY}_qc`);
    localStorage.removeItem(`${STORAGE_KEY}_inventory`);
    localStorage.removeItem(`${STORAGE_KEY}_movements`);
    localStorage.removeItem(`${STORAGE_KEY}_orders`);
    localStorage.removeItem(`${STORAGE_KEY}_samples`);
    localStorage.removeItem(`${STORAGE_KEY}_supplier_payments`);
    localStorage.removeItem(`${STORAGE_KEY}_buyer_invoices`);
    localStorage.removeItem(`${STORAGE_KEY}_delivery_plans`);
    localStorage.removeItem(`${STORAGE_KEY}_audit_logs`);
    localStorage.removeItem(`${STORAGE_KEY}_grade_configs`);

    setUsers(INITIAL_USERS);
    setReceipts(INITIAL_RECEIPTS);
    setBatches(INITIAL_BATCHES);
    setQcInspections(INITIAL_QC_INSPECTIONS);
    setInventory(INITIAL_INVENTORY);
    setMovements(INITIAL_MOVEMENTS);
    setOrders(INITIAL_ORDERS);
    setSamples(INITIAL_SAMPLES);
    setSupplierPayments(INITIAL_SUPPLIER_PAYMENTS);
    setBuyerInvoices(INITIAL_BUYER_INVOICES);
    setDeliveryPlans(INITIAL_DELIVERY_PLANS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setGradeConfigs(INITIAL_GRADE_CONFIGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        receipts,
        batches,
        qcInspections,
        inventory,
        movements,
        orders,
        samples,
        supplierPayments,
        buyerInvoices,
        deliveryPlans,
        auditLogs,
        gradeConfigs,
        currentView,
        activeNavTab,
        setActiveNavTab,
        setCurrentView,
        login,
        logout,
        switchUserRole,
        registerUser,
        updateUserStatus,
        addReceipt,
        confirmReceipt,
        createBatch,
        updateBatchStep,
        submitQCInspection,
        placeOrder,
        updateOrderStatus,
        createSampleRequest,
        updateSampleStatus,
        submitDeliveryPlan,
        updateDeliveryPlanStatus,
        paySupplier,
        payBuyerInvoice,
        updateGradePrice,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
