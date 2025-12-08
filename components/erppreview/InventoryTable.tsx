import React, { useState } from 'react';
import { StockItem } from '../../types';
import { Filter, MoreHorizontal, ArrowUpRight } from 'lucide-react';

const MOCK_INVENTORY: StockItem[] = [
  { id: '1', sku: 'LUX-CH-001', name: 'Eames Lounge Chair', warehouse: 'WH-Main-01', quantity: 15, unitCost: 850.00, totalValue: 12750.00, valuationMethod: 'FIFO' },
  { id: '2', sku: 'LUX-CH-002', name: 'Eames Ottoman', warehouse: 'WH-Main-01', quantity: 12, unitCost: 220.00, totalValue: 2640.00, valuationMethod: 'FIFO' },
  { id: '3', sku: 'TC-DL-882', name: 'Marble Dining Table', warehouse: 'WH-East-02', quantity: 4, unitCost: 1400.00, totalValue: 5600.00, valuationMethod: 'AVCO' },
  { id: '4', sku: 'LT-FL-991', name: 'Arco Floor Lamp', warehouse: 'WH-Main-01', quantity: 22, unitCost: 450.00, totalValue: 9900.00, valuationMethod: 'FIFO' },
  { id: '5', sku: 'SF-VL-102', name: 'Velvet Sofa 3-Seater', warehouse: 'WH-East-02', quantity: 8, unitCost: 1200.00, totalValue: 9600.00, valuationMethod: 'LIFO' },
];

const InventoryTable: React.FC = () => {
  // Simple grouping simulation
  const groupedData = MOCK_INVENTORY.reduce((acc, item) => {
    (acc[item.warehouse] = acc[item.warehouse] || []).push(item);
    return acc;
  }, {} as Record<string, StockItem[]>);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div>
          <h3 className="text-xl font-serif font-bold text-slate-900">Inventory Valuation</h3>
          <p className="text-sm text-slate-500">Real-time stock levels and FIFO/LIFO tracking</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-lg shadow-slate-200">
            Adjust Stock
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
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
            {Object.entries(groupedData).map(([warehouse, items]) => (
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
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
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
                      <button className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;