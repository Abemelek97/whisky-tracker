import React from 'react';

export default function StatusBadge({ status }) {
  switch (status) {
    case 'Dispatched':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">DXB Dispatched</span>;
    case 'In Transit':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">In Transit</span>;
    case 'Received':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Received in Addis</span>;
    case 'Discrepancy':
      return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">Discrepancy</span>;
    default:
      return null;
  }
}