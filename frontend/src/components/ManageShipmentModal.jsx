import React from 'react';
import { PhoneCall, PlaneTakeoff, CheckCircle2, AlertTriangle, Phone } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ManageShipmentModal({ shipment, onClose, onUpdateStatus, onCallTraveler }) {
  if (!shipment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div>
            <h3 className="font-semibold text-slate-100">{shipment.brand}</h3>
            <span className="text-xs font-mono text-slate-500">{shipment.id}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          {/* Details Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Traveler:</span>
              <span className="font-medium text-slate-200">{shipment.travelerName}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Phone Status:</span>
              <div className="flex items-center gap-2">
                <a 
                  href={`tel:${shipment.travelerPhone}`} 
                  onClick={() => onCallTraveler(shipment.id)}
                  className="font-mono text-xs text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {shipment.travelerPhone}
                </a>
              </div>
            </div>

            {shipment.lastCalledAt && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Call Log:</span>
                <span className="text-emerald-400 font-medium">✓ You called them ({shipment.lastCalledAt})</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-500">Bottles Sent:</span>
              <span className="font-medium text-amber-400">{shipment.quantity} bottles</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Current Status:</span>
              <StatusBadge status={shipment.status} />
            </div>
            {shipment.notes && (
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-900">
                <span className="font-semibold text-slate-300">Notes:</span> {shipment.notes}
              </div>
            )}
          </div>

          {/* COLORFUL ACTION BUTTONS */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Update Transit Status</p>

            {/* 1. IN TRANSIT - Bright Cyan / Electric Sky */}
            <button 
              onClick={() => onUpdateStatus(shipment.id, 'In Transit')}
              className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.98]"
            >
              <PlaneTakeoff className="w-5 h-5 text-slate-950" />
              <span>Mark as On Transit (Departed DXB)</span>
            </button>

            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* 2. RECEIVED - Vivid Neon / Emerald Green */}
              <button 
                onClick={() => onUpdateStatus(shipment.id, 'Received', shipment.quantity)}
                className="py-3 px-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/25 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer transform active:scale-[0.98]"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>All Received ({shipment.quantity} Bottles)</span>
              </button>

              {/* 3. DAMAGED / DISCREPANCY - Vivid Crimson / Rose */}
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
                className="py-3 px-3 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-rose-500/25 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer transform active:scale-[0.98]"
              >
                <AlertTriangle className="w-5 h-5 text-slate-950" />
                <span>Damaged / Missing</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}