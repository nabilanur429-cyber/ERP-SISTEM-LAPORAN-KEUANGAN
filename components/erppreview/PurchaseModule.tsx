import React, { useState } from 'react';
import { Truck, Download, MoreHorizontal, X, Plus } from 'lucide-react';
import { useErp } from '../../context/ErpContext';

const PurchaseModule: React.FC = () => {
  const { purchaseOrders, addPurchaseOrder, pendingAP } = useErp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [vendorName, setVendorName] = useState('');
  const [poTotal, setPoTotal] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorName && poTotal) {
      addPurchaseOrder({
        vendor: vendorName,
        date: new Date().toISOString().split('T')[0],
        total: parseFloat(poTotal),
        status: 'Dipesan'
      });
      setVendorName('');
      setPoTotal('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Pembelian (Purchasing)</h2>
          <p className="text-slate-500 mt-1">Kelola Pengadaan Barang dan Tagihan Vendor</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Truck size={18} /> Buat PO Baru
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase">Total Utang Usaha (AP)</p>
          <p className="text-2xl font-serif font-bold text-rose-600 mt-2">
             Rp {pendingAP.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
           <p className="text-slate-500 text-xs font-bold uppercase">Jumlah PO</p>
           <p className="text-2xl font-serif font-bold text-blue-600 mt-2">{purchaseOrders.length} Order</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
           <p className="text-slate-500 text-xs font-bold uppercase">Vendor Aktif</p>
           <p className="text-2xl font-serif font-bold text-slate-700 mt-2">5 Vendor</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
              <th className="px-6 py-4">No. PO</th>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Tanggal Order</th>
              <th className="px-6 py-4 text-right">Total Tagihan (IDR)</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {purchaseOrders.map((po) => (
              <tr key={po.id} className="hover:bg-slate-50/50 transition-colors animate-in fade-in slide-in-from-bottom-2">
                <td className="px-6 py-4 font-mono font-medium text-slate-600">{po.id}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{po.vendor}</td>
                <td className="px-6 py-4 text-slate-500">{po.date}</td>
                <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                  Rp {po.total.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    po.status === 'Diterima' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    po.status === 'Dipesan' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {po.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-2 text-slate-400">
                  <button className="hover:text-indigo-600"><Download size={18} /></button>
                  <button className="hover:text-indigo-600"><MoreHorizontal size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* CREATE PO MODAL */}
       {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-1">Buat PO Baru</h3>
            <p className="text-sm text-slate-500 mb-6">Order pembelian barang ke vendor.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Vendor</label>
                <input 
                  type="text" 
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="Contoh: PT. Supplier Utama"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimasi Total (Rp)</label>
                <input 
                  type="number" 
                  value={poTotal}
                  onChange={(e) => setPoTotal(e.target.value)}
                  placeholder="0"
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 mt-2">
                <p className="font-bold mb-1">Info Sistem:</p>
                <p>Menyimpan ini akan otomatis membuat Jurnal Umum:</p>
                <ul className="list-disc ml-4 mt-1">
                  <li>Debit: Persediaan</li>
                  <li>Kredit: Utang Usaha</li>
                </ul>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg mt-4 flex justify-center items-center gap-2"
              >
                <Plus size={18} /> Simpan Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseModule;