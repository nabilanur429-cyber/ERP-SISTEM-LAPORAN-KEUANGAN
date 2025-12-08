import React from 'react';
import JournalEntry from './JournalEntry';
import { BookOpen, FileText } from 'lucide-react';
import { useErp } from '../../context/ErpContext';

const AccountingModule: React.FC = () => {
  const { journalEntries } = useErp();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="flex-shrink-0">
        <h2 className="text-3xl font-serif font-bold text-slate-900">Akuntansi & Keuangan</h2>
        <p className="text-slate-500 mt-1">Jurnal Umum, Buku Besar, dan Laporan Keuangan</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Kolom Kiri: Input Jurnal Baru */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 flex-shrink-0">
            <BookOpen size={20} className="text-indigo-600"/> Input Jurnal Umum
          </h3>
          <div className="flex-1">
            <JournalEntry />
          </div>
        </div>

        {/* Kolom Kanan: Riwayat Buku Besar Terakhir */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 flex-shrink-0">
            <FileText size={20} className="text-indigo-600"/> Buku Besar (General Ledger)
          </h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
            <div className="overflow-y-auto flex-1 scrollbar-thin">
              <table className="w-full text-left text-sm relative">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3">Tgl</th>
                    <th className="px-4 py-3">Ref</th>
                    <th className="px-4 py-3">Akun</th>
                    <th className="px-4 py-3">Ket</th>
                    <th className="px-4 py-3 text-right">Debit</th>
                    <th className="px-4 py-3 text-right">Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {journalEntries.map((line) => (
                    <tr key={line.id} className="hover:bg-slate-50/50 animate-in fade-in slide-in-from-top-1 duration-300">
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{line.date}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{line.reference}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{line.account}</td>
                      <td className="px-4 py-3 text-slate-500 truncate max-w-[150px]">{line.description}</td>
                      <td className="px-4 py-3 text-right font-mono text-emerald-600">
                        {line.debit > 0 ? line.debit.toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-rose-600">
                        {line.credit > 0 ? line.credit.toLocaleString('id-ID') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-center text-slate-400">
                Menampilkan {journalEntries.length} transaksi terakhir
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountingModule;