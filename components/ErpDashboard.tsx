import React from 'react';
import DashboardCharts from './erppreview/DashboardCharts';
import InventoryTable from './erppreview/InventoryTable';
import JournalEntry from './erppreview/JournalEntry';
import { Bell, Search, User } from 'lucide-react';

const ErpDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Bar (Simulated) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 mt-1">Trading Operations Overview • {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search SKUs, Invoices..." 
              className="pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 w-64 text-sm"
            />
          </div>
          <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-sm shadow-md ring-2 ring-white cursor-pointer">
            JD
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Net Revenue</p>
            <h3 className="text-3xl font-serif font-bold">$1,240,500.00</h3>
            <div className="flex items-center gap-2 mt-4 text-emerald-400 text-sm font-bold bg-emerald-400/10 w-fit px-2 py-1 rounded">
              <span className="text-lg">↑</span> 12.5% vs last month
            </div>
          </div>
          <div className="absolute -right-4 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <User size={120} />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Inventory Value (FIFO)</p>
          <h3 className="text-3xl font-serif font-bold text-slate-900">$845,200.00</h3>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">65% of warehouse capacity utilized</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Pending AP</p>
          <h3 className="text-3xl font-serif font-bold text-slate-900">$42,300.00</h3>
          <div className="flex gap-2 mt-4">
             <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold transition-colors">View Bills</button>
             <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-lg text-xs font-bold transition-colors">Approve</button>
          </div>
        </div>
      </div>

      <DashboardCharts />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <InventoryTable />
        </div>
        <div className="xl:col-span-1">
          <JournalEntry />
        </div>
      </div>
    </div>
  );
};

export default ErpDashboard;