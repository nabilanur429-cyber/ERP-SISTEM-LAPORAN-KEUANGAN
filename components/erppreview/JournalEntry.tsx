import React, { useState, useMemo } from 'react';
import { JournalLine } from '../../types';
import { Plus, Trash2, Save, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { useErp } from '../../context/ErpContext';

const INITIAL_LINES: JournalLine[] = [
  { id: '1', account: '1200 - Piutang Usaha', description: 'Tagihan Faktur Baru', debit: 0, credit: 0 },
  { id: '2', account: '4000 - Pendapatan Penjualan', description: 'Penjualan Barang', debit: 0, credit: 0 },
];

const ACCOUNT_OPTIONS = [
    '1100 - Kas Bank',
    '1200 - Piutang Usaha',
    '1400 - Persediaan',
    '2000 - Utang Usaha',
    '4000 - Pendapatan Penjualan',
    '5000 - Harga Pokok Penjualan (COGS)',
    '6100 - Beban Gaji',
    '6200 - Beban Sewa'
];

const JournalEntry: React.FC = () => {
  const { postJournalEntry } = useErp();
  const [lines, setLines] = useState<JournalLine[]>(INITIAL_LINES);
  const [reference, setReference] = useState(`JE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`);
  const [status, setStatus] = useState<'idle' | 'posting' | 'success'>('idle');

  const totals = useMemo(() => {
    return lines.reduce((acc, line) => ({
      debit: acc.debit + (Number(line.debit) || 0),
      credit: acc.credit + (Number(line.credit) || 0)
    }), { debit: 0, credit: 0 });
  }, [lines]);

  const isBalanced = Math.abs(totals.debit - totals.credit) < 0.01 && totals.debit > 0;

  const addLine = () => {
    setLines([...lines, { id: Date.now().toString(), account: '', description: '', debit: 0, credit: 0 }]);
  };

  const updateLine = (id: string, field: keyof JournalLine, value: string | number) => {
    setLines(lines.map(line => line.id === id ? { ...line, [field]: value } : line));
  };

  const removeLine = (id: string) => {
    setLines(lines.filter(line => line.id !== id));
  };

  const handlePostEntry = () => {
    if (!isBalanced) return;
    
    setStatus('posting');
    
    // Simulate API call delay for effect
    setTimeout(() => {
      postJournalEntry(lines, reference);
      setStatus('success');
      
      // Reset after showing success message
      setTimeout(() => {
        setLines([
            { id: Date.now().toString(), account: '', description: '', debit: 0, credit: 0 },
            { id: (Date.now() + 1).toString(), account: '', description: '', debit: 0, credit: 0 }
        ]);
        setReference(`JE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`);
        setStatus('idle');
      }, 1500);
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden h-full flex flex-col">
      
      {/* Success Overlay */}
      {status === 'success' && (
        <div className="absolute inset-0 z-20 bg-emerald-50/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-xl font-serif font-bold text-emerald-800">Jurnal Berhasil Diposting</h3>
          <p className="text-emerald-600 mt-1">Transaksi telah tercatat di Buku Besar & Dashboard.</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-xl font-serif font-bold text-slate-900">Input Jurnal Umum</h3>
            <input 
                value={reference} 
                onChange={(e) => setReference(e.target.value)}
                className="text-xs text-slate-500 mt-1 bg-transparent border-none focus:ring-0 p-0 w-full font-mono"
            />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 transition-colors ${isBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
          <RefreshCw size={12} className={!isBalanced ? "animate-spin" : ""} />
          {isBalanced ? "SEIMBANG" : "TIDAK SEIMBANG"}
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 px-2">
          <div className="col-span-4">Akun (COA)</div>
          <div className="col-span-4">Deskripsi</div>
          <div className="col-span-2 text-right">Debit</div>
          <div className="col-span-2 text-right">Kredit</div>
        </div>

        {/* Rows */}
        {lines.map((line) => (
          <div key={line.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors group">
            <div className="col-span-4 relative">
              <select 
                value={line.account} 
                onChange={(e) => updateLine(line.id, 'account', e.target.value)}
                disabled={status !== 'idle'}
                className="w-full bg-transparent font-medium text-slate-800 focus:outline-none disabled:opacity-50 appearance-none text-sm"
              >
                <option value="">Pilih Akun...</option>
                {ACCOUNT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="col-span-4">
              <input 
                type="text" 
                value={line.description}
                onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                placeholder="Deskripsi"
                disabled={status !== 'idle'}
                className="w-full bg-transparent text-slate-600 focus:outline-none disabled:opacity-50 text-sm"
              />
            </div>
            <div className="col-span-2">
              <input 
                type="number" 
                value={line.debit || ''}
                onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value))}
                placeholder="0"
                disabled={status !== 'idle'}
                className="w-full bg-transparent text-right font-mono text-slate-800 focus:outline-none focus:text-indigo-600 disabled:opacity-50 text-sm"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input 
                type="number" 
                value={line.credit || ''}
                onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value))}
                placeholder="0"
                disabled={status !== 'idle'}
                className="w-full bg-transparent text-right font-mono text-slate-800 focus:outline-none focus:text-indigo-600 disabled:opacity-50 text-sm"
              />
              <button 
                onClick={() => removeLine(line.id)} 
                disabled={status !== 'idle'}
                className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-opacity disabled:opacity-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-12 gap-4">
        <div className="col-span-8 flex items-center">
          <button 
            onClick={addLine} 
            disabled={status !== 'idle'}
            className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Tambah Baris
          </button>
        </div>
        <div className="col-span-2 text-right font-mono font-bold text-slate-900 border-t-2 border-slate-300 pt-2 text-sm">
          {totals.debit.toLocaleString('id-ID')}
        </div>
        <div className="col-span-2 text-right font-mono font-bold text-slate-900 border-t-2 border-slate-300 pt-2 text-sm">
          {totals.credit.toLocaleString('id-ID')}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={handlePostEntry}
          disabled={!isBalanced || status !== 'idle' || totals.debit === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all w-full justify-center ${
            isBalanced && status === 'idle' && totals.debit > 0
              ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02]' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {status === 'posting' ? (
             <><Loader2 className="animate-spin" size={18} /> Memposting...</>
          ) : (
             <><Save size={18} /> Posting Jurnal</>
          )}
        </button>
      </div>
    </div>
  );
};

export default JournalEntry;