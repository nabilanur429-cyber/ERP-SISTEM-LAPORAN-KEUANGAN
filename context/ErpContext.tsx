import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { JournalLine, StockItem } from '../types';

// Data Types
export interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Lunas' | 'Menunggu Pembayaran' | 'Dalam Pengiriman' | 'Baru';
}

export interface PurchaseOrder {
  id: string;
  vendor: string;
  date: string;
  total: number;
  status: 'Diterima' | 'Dipesan' | 'Menunggu Persetujuan';
}

export interface LedgerEntry {
  id: string;
  date: string;
  reference: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
}

interface ErpContextType {
  // State
  inventory: StockItem[];
  journalEntries: LedgerEntry[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  
  // Metrics (Derived State)
  netRevenue: number;
  totalInventoryValue: number;
  pendingAP: number;
  totalCOGS: number;
  cashOnHand: number;
  
  // Actions
  postJournalEntry: (lines: JournalLine[], reference: string) => void;
  addSalesOrder: (order: Omit<SalesOrder, 'id'>) => void;
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => void;
  updateStock: (id: string, newQty: number) => void;
}

const ErpContext = createContext<ErpContextType | undefined>(undefined);

// Initial Data
const INITIAL_INVENTORY: StockItem[] = [
  { id: '1', sku: 'LUX-CH-001', name: 'Eames Lounge Chair', warehouse: 'WH-Main-01', quantity: 15, unitCost: 850.00, totalValue: 12750.00, valuationMethod: 'FIFO' },
  { id: '2', sku: 'LUX-CH-002', name: 'Eames Ottoman', warehouse: 'WH-Main-01', quantity: 12, unitCost: 220.00, totalValue: 2640.00, valuationMethod: 'FIFO' },
  { id: '3', sku: 'TC-DL-882', name: 'Marble Dining Table', warehouse: 'WH-East-02', quantity: 4, unitCost: 1400.00, totalValue: 5600.00, valuationMethod: 'AVCO' },
];

const INITIAL_JOURNAL: LedgerEntry[] = [
  { id: 'gl-1', date: '2024-10-24', reference: 'OPENING-BAL', account: '1100 - Kas Bank', description: 'Saldo Awal', debit: 500000000, credit: 0 },
  { id: 'gl-2', date: '2024-10-24', reference: 'INV-2024-001', account: '1100 - Kas Bank', description: 'Penerimaan Penjualan', debit: 15400000, credit: 0 },
  { id: 'gl-3', date: '2024-10-24', reference: 'INV-2024-001', account: '4000 - Pendapatan Penjualan', description: 'Penerimaan Penjualan', debit: 0, credit: 15400000 },
];

const INITIAL_SALES: SalesOrder[] = [
  { id: 'SO-2024-001', customer: 'PT. Makmur Jaya', date: '2024-10-24', total: 15400000, status: 'Lunas' },
];

const INITIAL_PURCHASE: PurchaseOrder[] = [
  { id: 'PO-2024-001', vendor: 'Distributor Kayu Jati', date: '2024-10-20', total: 55000000, status: 'Diterima' },
];

export const ErpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<StockItem[]>(INITIAL_INVENTORY);
  const [journalEntries, setJournalEntries] = useState<LedgerEntry[]>(INITIAL_JOURNAL);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(INITIAL_SALES);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE);

  // --- Actions ---

  const postJournalEntry = (lines: JournalLine[], reference: string) => {
    const newEntries: LedgerEntry[] = lines.map(line => ({
      id: `gl-${Date.now()}-${Math.random()}`,
      date: new Date().toISOString().split('T')[0],
      reference: reference,
      account: line.account,
      description: line.description,
      debit: line.debit,
      credit: line.credit
    }));
    setJournalEntries(prev => [...newEntries, ...prev]); // Add to top
  };

  const addSalesOrder = (order: Omit<SalesOrder, 'id'>) => {
    const newOrder = { ...order, id: `SO-2024-${String(salesOrders.length + 2).padStart(3, '0')}` };
    setSalesOrders(prev => [newOrder, ...prev]);
    
    // Auto-journal for Sales (Simplified)
    postJournalEntry([
      { id: '1', account: '1200 - Piutang Usaha', description: `Tagihan ${newOrder.customer}`, debit: newOrder.total, credit: 0 },
      { id: '2', account: '4000 - Pendapatan Penjualan', description: `Penjualan ${newOrder.id}`, debit: 0, credit: newOrder.total }
    ], newOrder.id);
  };

  const addPurchaseOrder = (order: Omit<PurchaseOrder, 'id'>) => {
    const newOrder = { ...order, id: `PO-2024-${String(purchaseOrders.length + 2).padStart(3, '0')}` };
    setPurchaseOrders(prev => [newOrder, ...prev]);
    
    // Auto-journal for Purchase (Simplified)
    postJournalEntry([
      { id: '1', account: '1400 - Persediaan', description: `Stok dari ${newOrder.vendor}`, debit: newOrder.total, credit: 0 },
      { id: '2', account: '2000 - Utang Usaha', description: `Tagihan ${newOrder.id}`, debit: 0, credit: newOrder.total }
    ], newOrder.id);
  };

  const updateStock = (id: string, newQty: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        // Calculate difference
        const diff = newQty - item.quantity;
        // If diff is negative (stock reduction), assume sold/usage -> COGS logic could trigger here
        // For now, just update state
        return { ...item, quantity: newQty, totalValue: newQty * item.unitCost };
      }
      return item;
    }));
  };

  // --- Metrics Calculation ---

  const metrics = useMemo(() => {
    let revenue = 0;
    let cogs = 0;
    let ap = 0;
    let cash = 0;

    journalEntries.forEach(entry => {
      // 4000 range is Revenue
      if (entry.account.startsWith('4')) {
        revenue += entry.credit - entry.debit;
      }
      // 5000 range is COGS/Expenses
      if (entry.account.startsWith('5')) {
        cogs += entry.debit - entry.credit;
      }
      // 2000 range is Liabilities (AP)
      if (entry.account.startsWith('2')) {
        ap += entry.credit - entry.debit;
      }
      // 1100 is Cash
      if (entry.account.startsWith('1100')) {
        cash += entry.debit - entry.credit;
      }
    });

    const inventoryVal = inventory.reduce((acc, item) => acc + item.totalValue, 0);

    return {
      netRevenue: revenue,
      totalCOGS: cogs,
      pendingAP: ap,
      totalInventoryValue: inventoryVal,
      cashOnHand: cash
    };
  }, [journalEntries, inventory]);

  return (
    <ErpContext.Provider value={{
      inventory,
      journalEntries,
      salesOrders,
      purchaseOrders,
      ...metrics,
      postJournalEntry,
      addSalesOrder,
      addPurchaseOrder,
      updateStock
    }}>
      {children}
    </ErpContext.Provider>
  );
};

export const useErp = () => {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error('useErp must be used within an ErpProvider');
  }
  return context;
};