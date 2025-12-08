import React, { useState, useMemo } from 'react';
import { JournalLine } from '../../types';
import { Plus, Trash2, Save, RefreshCw } from 'lucide-react';

const INITIAL_LINES: JournalLine[] = [
  { id: '1', account: '1200 - Accounts Receivable', description: 'Invoice INV-2023-001', debit: 1500.00, credit: 0 },
  { id: '2', account: '4000 - Sales Income', description: 'Product Sales', debit: 0, credit: 1500.00 },
];

const JournalEntry: React.FC = () => {
  const [lines, setLines] = useState<JournalLine[]>(INITIAL_LINES);

  const totals = useMemo(() => {
    return lines.reduce((acc, line) => ({
      debit: acc.debit + (Number(line.debit) || 0),
      credit: acc.credit + (Number(line.credit) || 0)
    }), { debit: 0, credit: 0 });
  }, [lines]);

  const isBalanced = Math.abs(totals.debit - totals.credit) < 0.01;

  const addLine = () => {
    setLines([...lines, { id: Date.now().toString(), account: '', description: '', debit: 0, credit: 0 }]);
  };

  const updateLine = (id: string, field: keyof JournalLine, value: string | number) => {
    setLines(lines.map(line => line.id === id ? { ...line, [field]: value } : line));
  };

  const removeLine = (id: string) => {
    setLines(lines.filter(line => line.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold text-slate-900">Journal Entry #2024-JE-992</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${isBalanced ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
          <RefreshCw size={12} className={!isBalanced ? "animate-spin" : ""} />
          {isBalanced ? "BALANCED" : "UNBALANCED"}
        </div>
      </div>

      <div className="space-y-3">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 px-2">
          <div className="col-span-4">Account</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-2 text-right">Debit</div>
          <div className="col-span-2 text-right">Credit</div>
        </div>

        {/* Rows */}
        {lines.map((line) => (
          <div key={line.id} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors group">
            <div className="col-span-4">
              <input 
                type="text" 
                value={line.account} 
                onChange={(e) => updateLine(line.id, 'account', e.target.value)}
                placeholder="Select Account..."
                className="w-full bg-transparent font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <div className="col-span-4">
              <input 
                type="text" 
                value={line.description}
                onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                placeholder="Description"
                className="w-full bg-transparent text-slate-600 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <input 
                type="number" 
                value={line.debit || ''}
                onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value))}
                placeholder="0.00"
                className="w-full bg-transparent text-right font-mono text-slate-800 focus:outline-none focus:text-indigo-600"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input 
                type="number" 
                value={line.credit || ''}
                onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value))}
                placeholder="0.00"
                className="w-full bg-transparent text-right font-mono text-slate-800 focus:outline-none focus:text-indigo-600"
              />
              <button onClick={() => removeLine(line.id)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-12 gap-4">
        <div className="col-span-8 flex items-center">
          <button onClick={addLine} className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-800">
            <Plus size={16} /> Add Line
          </button>
        </div>
        <div className="col-span-2 text-right font-mono font-bold text-slate-900 border-t-2 border-slate-300 pt-2">
          {totals.debit.toFixed(2)}
        </div>
        <div className="col-span-2 text-right font-mono font-bold text-slate-900 border-t-2 border-slate-300 pt-2">
          {totals.credit.toFixed(2)}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          disabled={!isBalanced}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all ${
            isBalanced 
              ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Save size={18} />
          Post Entry
        </button>
      </div>
    </div>
  );
};

export default JournalEntry;