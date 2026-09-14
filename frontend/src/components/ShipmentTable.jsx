import React from 'react';
import { Wine, ArrowRight, UserCheck, Phone, CheckCircle2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ShipmentTable({ shipments, onManage, onCallTraveler }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Tracking & Whiskey</th>
              <th className="py-3.5 px-4">Route & Vault</th>
              <th className="py-3.5 px-4">Assigned Traveler & Contact</th>
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
                    
                    {/* Call Button & Status */}
                    <div className="mt-1 flex items-center gap-2">
                      <a
                        href={`tel:${item.travelerPhone}`}
                        onClick={() => onCallTraveler(item.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-xs font-mono transition cursor-pointer"
                        title="Click to dial"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{item.travelerPhone}</span>
                      </a>

                      {item.lastCalledAt ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          You called them ({item.lastCalledAt.split(',')[0]})
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Not called yet</span>
                      )}
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
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 transition cursor-pointer"
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