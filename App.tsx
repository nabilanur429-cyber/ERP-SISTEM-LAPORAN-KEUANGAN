import React, { useState } from 'react';
import Layout from './components/Layout';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import ErpDashboard from './components/ErpDashboard';
import SalesModule from './components/erppreview/SalesModule';
import PurchaseModule from './components/erppreview/PurchaseModule';
import InventoryTable from './components/erppreview/InventoryTable';
import AccountingModule from './components/erppreview/AccountingModule';
import { ViewMode } from './types';
import { ErpProvider } from './context/ErpContext';

function App() {
  const [currentMode, setCurrentMode] = useState<ViewMode>(ViewMode.ARCHITECT);

  const renderContent = () => {
    switch (currentMode) {
      case ViewMode.ARCHITECT:
        return <DocumentAnalyzer />;
      case ViewMode.ERP_DASHBOARD:
        return <ErpDashboard />;
      case ViewMode.ERP_SALES:
        return <SalesModule />;
      case ViewMode.ERP_PURCHASE:
        return <PurchaseModule />;
      case ViewMode.ERP_INVENTORY:
        return (
          <div className="animate-in fade-in duration-500">
            <header className="mb-6">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Persediaan (Inventory)</h2>
              <p className="text-slate-500 mt-1">Kelola Stok Barang, Penilaian FIFO/LIFO, dan Gudang</p>
            </header>
            <InventoryTable />
          </div>
        );
      case ViewMode.ERP_ACCOUNTING:
        return <AccountingModule />;
      default:
        return <ErpDashboard />;
    }
  };

  return (
    <ErpProvider>
      <Layout currentMode={currentMode} onModeChange={setCurrentMode}>
        {renderContent()}
      </Layout>
    </ErpProvider>
  );
}

export default App;