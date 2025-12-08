import React from 'react';
import { ViewMode } from '../types';
import { Layout as LayoutIcon, ScanLine, Database, Globe, ShoppingCart, Truck, Package, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentMode, onModeChange }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 shadow-2xl z-20 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-serif font-bold tracking-wider text-luxury-gold text-yellow-500">LuxERP</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Intelligent Accounting</p>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <div className="mb-4">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alat AI</p>
            <button
              onClick={() => onModeChange(ViewMode.ARCHITECT)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                currentMode === ViewMode.ARCHITECT 
                  ? 'bg-slate-800 text-white shadow-lg border-l-4 border-yellow-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ScanLine size={18} />
              <span className="font-medium text-sm">AI Document Scanner</span>
            </button>
          </div>

          <div className="mb-4">
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Modul ERP</p>
            
            <button
              onClick={() => onModeChange(ViewMode.ERP_DASHBOARD)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                currentMode === ViewMode.ERP_DASHBOARD
                  ? 'bg-slate-800 text-white shadow-lg border-l-4 border-emerald-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutIcon size={18} />
              <span className="font-medium text-sm">Dashboard Utama</span>
            </button>

            <button
              onClick={() => onModeChange(ViewMode.ERP_SALES)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                currentMode === ViewMode.ERP_SALES
                  ? 'bg-slate-800 text-white shadow-lg border-l-4 border-indigo-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShoppingCart size={18} />
              <span className="font-medium text-sm">Penjualan</span>
            </button>

            <button
              onClick={() => onModeChange(ViewMode.ERP_PURCHASE)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                currentMode === ViewMode.ERP_PURCHASE
                  ? 'bg-slate-800 text-white shadow-lg border-l-4 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Truck size={18} />
              <span className="font-medium text-sm">Pembelian</span>
            </button>

            <button
              onClick={() => onModeChange(ViewMode.ERP_INVENTORY)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                currentMode === ViewMode.ERP_INVENTORY
                  ? 'bg-slate-800 text-white shadow-lg border-l-4 border-orange-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Package size={18} />
              <span className="font-medium text-sm">Persediaan</span>
            </button>

            <button
              onClick={() => onModeChange(ViewMode.ERP_ACCOUNTING)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                currentMode === ViewMode.ERP_ACCOUNTING
                  ? 'bg-slate-800 text-white shadow-lg border-l-4 border-rose-500' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BookOpen size={18} />
              <span className="font-medium text-sm">Akuntansi</span>
            </button>
          </div>
        </nav>

        <div className="w-full md:w-64 p-6 border-t border-slate-800 mt-auto bg-slate-900">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Database size={14} />
            <span>Django Modular Monolith</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
            <Globe size={14} />
            <span>React / Tailwind Frontend</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Background texture/gradient for 'luxury' feel */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-200 via-transparent to-transparent"></div>
        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;