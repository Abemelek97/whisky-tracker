import React from 'react';
import { Wine, ArrowRight, UserCheck, Phone } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ShipmentTable({ shipments, onManage }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Tracking & Whiskey</th>
              <th className="py-3.5 px-4">Route & Vault</th>
              <th className="py-3.5 px-4">Assigned Traveler</th>
              <th className="py-3.5 px-4">Quantity</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {shipments.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500">
                  No whiskey shipments found.
                </td>
              </tr>
            ) : (
              shipments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Wine className="w-4 h-4 text-amber-400 shrink-0" />
                      {item.brand}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{item.id}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-slate-300 font-medium">
                      <span>DXB</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span>ADD</span>
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[180px]">{item.receiver}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-200">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      {item.travelerName}
                    </div>
                    <div className="text-xs text-amber-400/90 flex items-center gap-1 mt-0.5 font-mono">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <a href={`tel:${item.travelerPhone}`} className="hover:underline">
                        {item.travelerPhone}
                      </a>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-200">{item.quantity} bottles</span>
                    {item.receivedQuantity !== null && (
                      <div className={`text-xs mt-0.5 font-medium ${
                        item.receivedQuantity === item.quantity ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        Received: {item.receivedQuantity}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => onManage(item)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 transition cursor-pointer"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}