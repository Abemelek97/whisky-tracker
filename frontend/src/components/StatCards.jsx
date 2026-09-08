import React from 'react';
import { PlaneTakeoff, Package, CheckCircle2 } from 'lucide-react';

export default function StatCards({ shipments }) {
  const totalBottlesOut = shipments.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalBottlesIn = shipments.reduce((acc, curr) => acc + (curr.receivedQuantity || 0), 0);
  const inTransitCount = shipments.filter(s => s.status === 'In Transit' || s.status === 'Dispatched').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Total Sent (Dubai)</p>
          <h3 className="text-3xl font-bold text-slate-50 mt-1">{totalBottlesOut} <span className="text-sm font-normal text-slate-500">bottles</span></h3>
        </div>
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
          <PlaneTakeoff className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Active Shipments In Transit</p>
          <h3 className="text-3xl font-bold text-sky-400 mt-1">{inTransitCount} <span className="text-sm font-normal text-slate-500">batches</span></h3>
        </div>
        <div className="p-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl">
          <Package className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Received (Addis Ababa)</p>
          <h3 className="text-3xl font-bold text-emerald-400 mt-1">{totalBottlesIn} <span className="text-sm font-normal text-slate-500">bottles verified</span></h3>
        </div>
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}