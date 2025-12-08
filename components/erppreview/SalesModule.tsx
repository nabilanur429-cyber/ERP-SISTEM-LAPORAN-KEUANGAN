import React, { useState } from 'react';
import { ShoppingCart, MoreHorizontal, X, Plus } from 'lucide-react';
import { useErp } from '../../context/ErpContext';

const SalesModule: React.FC = () => {
  const { salesOrders, addSalesOrder, netRevenue } = useErp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [orderTotal, setOrderTotal] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName && orderTotal) {
      addSalesOrder({
        customer: customerName,
        date: new Date().toISOString().split('T')[0],
        total: parseFloat(orderTotal),
        status: 'Baru'
      });
      setCustomerName('');
      setOrderTotal('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Penjualan (Sales)</h2>
          <p className="text-slate-500 mt-1">Kelola Pesanan Penjualan dan Faktur Pelanggan</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <ShoppingCart size={18} /> Buat Pesanan Baru
        </button>
      </header>

      {/* Metrics synced with context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase">Total Pendapatan (GL)</p>
          <p className="text-2xl font-serif font-bold text-emerald-600 mt-2">
            Rp {netRevenue.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase">Total Pesanan</p>
          <p className="text-2xl font-serif font-bold text-indigo-600 mt-2">{salesOrders.length} Pesanan</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase">Rata-rata Nilai Order</p>
          <p className="text-2xl font-serif font-bold text-slate-700 mt-2">
            Rp {(salesOrders.reduce((acc, curr) => acc + curr.total, 0) / (salesOrders.length || 1)).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
              <th className="px-6 py-4">Nomor Pesanan</th>
              <th className="px-6 py-4">Pelanggan</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4 text-right">Total (IDR)</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {salesOrders.map((so) => (
              <tr key={so.id} className="hover:bg-slate-50/50 transition-colors animate-in fade-in slide-in-from-bottom-2">
                <td className="px-6 py-4 font-mono font-medium text-indigo-600">{so.id}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{so.customer}</td>
                <td className="px-6 py-4 text-slate-500">{so.date}</td>
                <td className="px-6 py-4 text-right font-bold text-slate-900">
                  Rp {so.total.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    so.status === 'Lunas' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    so.status === 'Menunggu Pembayaran' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {so.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-slate-400 cursor-pointer hover:text-indigo-600">
                  <MoreHorizontal size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE ORDER MODAL */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">Buat Pesanan Baru</h3>
            <p className="text-sm text-slate-500 mb-6">Input data penjualan pelanggan.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pelanggan</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: CV. Berkah Abadi"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Nilai Pesanan (Rp)</label>
                <input 
                  type="number" 
                  value={orderTotal}
                  onChange={(e) => setOrderTotal(e.target.value)}
                  placeholder="0"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg text-xs text-indigo-700 mt-2">
                <p className="font-bold mb-1">Info Sistem:</p>
                <p>Menyimpan ini akan otomatis membuat Jurnal Umum:</p>
                <ul className="list-disc ml-4 mt-1">
                  <li>Debit: Piutang Usaha</li>
                  <li>Kredit: Pendapatan Penjualan</li>
                </ul>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg mt-4 flex justify-center items-center gap-2"
              >
                <Plus size={18} /> Simpan Pesanan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesModule;