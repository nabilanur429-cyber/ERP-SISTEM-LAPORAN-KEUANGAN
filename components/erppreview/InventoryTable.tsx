import React, { useState } from 'react';
import { StockItem } from '../../types';
import { Filter, MoreHorizontal, X, Save } from 'lucide-react';
import { useErp } from '../../context/ErpContext';

const InventoryTable: React.FC = () => {
  const { inventory, updateStock } = useErp();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  // State for Adjust Stock Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);

  // Extract unique warehouses for filter
  const warehouses = ['All', ...Array.from(new Set(inventory.map(item => item.warehouse)))];

  // Filtering Logic
  const filteredData = activeFilter === 'All' 
    ? inventory 
    : inventory.filter(item => item.warehouse === activeFilter);

  const groupedData = filteredData.reduce((acc, item) => {
    (acc[item.warehouse] = acc[item.warehouse] || []).push(item);
    return acc;
  }, {} as Record<string, StockItem[]>);

  const openAdjustModal = () => {
    // Default to first item for demo if none selected, or just open generic
    if (inventory.length > 0) {
        setSelectedItem(inventory[0]);
        setAdjustQty(inventory[0].quantity);
        setIsAdjustModalOpen(true);
    }
  };

  const handleStockAdjustment = () => {
    if (selectedItem) {
      updateStock(selectedItem.id, adjustQty);
      setIsAdjustModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col h-full">
      
      {/* Header Controls */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h3 className="text-xl font-serif font-bold text-slate-900">Inventory Valuation</h3>
          <p className="text-sm text-slate-500">Real-time stock levels and FIFO/LIFO tracking</p>
        </div>
        <div className="flex gap-3 relative">
          
          {/* Filter Button & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${isFilterOpen ? 'bg-slate-100 border-slate-300 text-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Filter size={16} /> 
              Filter: {activeFilter}
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                {warehouses.map(wh => (
                  <button
                    key={wh}
                    onClick={() => { setActiveFilter(wh); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${activeFilter === wh ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-600'}`}
                  >
                    {wh}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={openAdjustModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-lg shadow-slate-200 active:transform active:scale-95 transition-all"
          >
            Adjust Stock
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto min-h-[300px]">
        {Object.keys(groupedData).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <p>Tidak ada barang di gudang ini.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <th className="px-6 py-4 font-medium">SKU / Product</th>
                <th className="px-6 py-4 font-medium text-right">Quantity</th>
                <th className="px-6 py-4 font-medium text-right">Unit Cost</th>
                <th className="px-6 py-4 font-medium text-right">Total Value</th>
                <th className="px-6 py-4 font-medium text-center">Method</th>
                <th className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(Object.entries(groupedData) as [string, StockItem[]][]).map(([warehouse, items]) => (
                <React.Fragment key={warehouse}>
                  {/* Group Header */}
                  <tr className="bg-slate-50/80">
                    <td colSpan={6} className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="font-bold text-slate-700 text-sm tracking-wide">{warehouse}</span>
                      </div>
                    </td>
                  </tr>
                  
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group animate-in fade-in">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{item.name}</span>
                          <span className="text-xs text-slate-400 font-mono mt-0.5">{item.sku}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-mono font-medium ${item.quantity < 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                          {item.quantity}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">Units</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-600">
                        ${item.unitCost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                        ${item.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {item.valuationMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => { setSelectedItem(item); setAdjustQty(item.quantity); setIsAdjustModalOpen(true); }}
                          className="text-slate-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-all"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedItem && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsAdjustModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsAdjustModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-serif font-bold text-slate-900 mb-1">Adjust Stock Level</h3>
            <p className="text-sm text-slate-500 mb-6">Manually update inventory count for audit.</p>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold">Product</p>
                <p className="font-medium text-slate-800">{selectedItem.name}</p>
                <p className="text-xs text-slate-500 font-mono">{selectedItem.sku}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Quantity</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setAdjustQty(Math.max(0, adjustQty - 1))} className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 font-bold">-</button>
                  <input 
                    type="number" 
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(parseInt(e.target.value) || 0)}
                    className="flex-1 text-center font-mono text-xl font-bold py-2 border border-slate-200 rounded-lg"
                  />
                  <button onClick={() => setAdjustQty(adjustQty + 1)} className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 font-bold">+</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsAdjustModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={handleStockAdjustment}
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;