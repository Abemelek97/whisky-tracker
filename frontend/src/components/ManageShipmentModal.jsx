import React from 'react';
import { PhoneCall, PlaneTakeoff, CheckCircle2, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ManageShipmentModal({ shipment, onClose, onUpdateStatus }) {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-100">{shipment.brand}</h3>
            <span className="text-xs font-mono text-slate-500">{shipment.id}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Traveler:</span>
              <span className="font-medium text-slate-200">{shipment.travelerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Phone:</span>
              <a 
                href={`tel:${shipment.travelerPhone}`} 
                className="font-mono text-xs text-amber-400 flex items-center gap-1 hover:underline"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                {shipment.travelerPhone}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bottles Sent:</span>
              <span className="font-medium text-amber-400">{shipment.quantity} units</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <StatusBadge status={shipment.status} />
            </div>
            {shipment.notes && (
              <div className="text-xs text-slate-400 pt-1 border-t border-slate-900">
                <span className="font-semibold">Note:</span> {shipment.notes}
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Update Transition</p>

            {shipment.status === 'Dispatched' && (
              <button 
                onClick={() => onUpdateStatus(shipment.id, 'In Transit')}
                className="w-full py-2.5 px-3 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 font-medium rounded-lg text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlaneTakeoff className="w-4 h-4" />
                Handed to Traveler (Departed Dubai)
              </button>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button 
                onClick={() => onUpdateStatus(shipment.id, 'Received', shipment.quantity)}
                className="py-2.5 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-medium rounded-lg text-xs transition flex flex-col items-center justify-center text-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                All Received ({shipment.quantity} Bottles)
              </button>

              <button 
                onClick={() => {
                  const count = prompt(`How many bottles arrived safely out of ${shipment.quantity}?`, "0");
                  if (count !== null) {
                    const parsed = parseInt(count, 10);
                    onUpdateStatus(
                      shipment.id, 
                      parsed === shipment.quantity ? 'Received' : 'Discrepancy', 
                      isNaN(parsed) ? 0 : parsed
                    );
                  }
                }}
                className="py-2.5 px-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-medium rounded-lg text-xs transition flex flex-col items-center justify-center text-center gap-1 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Damage / Missing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}