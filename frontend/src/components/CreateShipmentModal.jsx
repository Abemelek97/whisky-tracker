import React, { useState } from 'react';
import { PlaneTakeoff } from 'lucide-react';

export default function CreateShipmentModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    brand: '',
    quantity: '',
    sender: 'Dubai Central Warehouse',
    receiver: 'Bole Hub (Addis Ababa)',
    travelerName: '',
    travelerPhone: '',
    departureDate: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-850">
          <h3 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
            <PlaneTakeoff className="w-5 h-5 text-amber-500" />
            Dispatch New Whiskey Batch (Dubai)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Whiskey Brand & Variant</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Macallan 18yr Sherry Oak"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Quantity (Bottles)</label>
              <input 
                type="number" 
                required 
                min="1"
                placeholder="e.g., 4"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Departure Date</label>
              <input 
                type="date" 
                value={formData.departureDate}
                onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Traveler Full Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g., Abebe Kebede"
                value={formData.travelerName}
                onChange={(e) => setFormData({...formData, travelerName: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Traveler Phone Number</label>
              <input 
                type="tel" 
                required
                placeholder="e.g., +251 91 234 5678"
                value={formData.travelerPhone}
                onChange={(e) => setFormData({...formData, travelerPhone: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Destination Vault (Addis)</label>
            <input 
              type="text" 
              value={formData.receiver}
              onChange={(e) => setFormData({...formData, receiver: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Special Notes / Packaging Code</label>
            <textarea 
              rows="2"
              placeholder="e.g. Bag seal #8812, wrapped in protective bubble."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-sm font-semibold transition cursor-pointer"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}