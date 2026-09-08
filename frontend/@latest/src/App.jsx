import React, { useState } from 'react';
import { 
  Package, 
  PlaneTakeoff, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  Search, 
  Wine, 
  UserCheck, 
  Calendar,
  Building2,
  ShieldCheck
} from 'lucide-react';

// Initial Mock Data
const INITIAL_SHIPMENTS = [
  {
    id: "TRK-9021",
    brand: "Johnnie Walker Black Label (1L)",
    quantity: 6,
    sender: "Dubai Duty Free Logistics Hub",
    senderCity: "Dubai, UAE",
    receiver: "Bole Distribution Depot",
    receiverCity: "Addis Ababa, ET",
    travelerName: "Yonas Mengistu",
    flightNo: "ET 601",
    departureDate: "2026-09-09",
    status: "In Transit", // 'Dispatched', 'In Transit', 'Received', 'Discrepancy'
    receivedQuantity: null,
    notes: "Packed in fragile thermal sleeve.",
    createdAt: "2026-09-08"
  },
  {
    id: "TRK-9018",
    brand: "Macallan 12 Double Cask",
    quantity: 4,
    sender: "Al Maktoum Terminal Dispatch",
    senderCity: "Dubai, UAE",
    receiver: "Bole Distribution Depot",
    receiverCity: "Addis Ababa, ET",
    travelerName: "Sara Tefera",
    flightNo: "EK 723",
    departureDate: "2026-09-06",
    status: "Received",
    receivedQuantity: 4,
    notes: "Verified intact by Addis Hub.",
    createdAt: "2026-09-05"
  },
  {
    id: "TRK-9014",
    brand: "Chivas Regal 18yo",
    quantity: 3,
    sender: "Dubai Central Vault",
    senderCity: "Dubai, UAE",
    receiver: "Kazanchis Vault",
    receiverCity: "Addis Ababa, ET",
    travelerName: "Dawit Bekele",
    flightNo: "ET 603",
    departureDate: "2026-09-04",
    status: "Discrepancy",
    receivedQuantity: 2,
    notes: "1 bottle cracked during transit. Photo submitted.",
    createdAt: "2026-09-03"
  }
];

export default function App() {
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'dubai', 'transit', 'addis'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Form State for New Shipment (Dubai Outbound)
  const [formData, setFormData] = useState({
    brand: '',
    quantity: '',
    sender: 'Dubai Central Warehouse',
    receiver: 'Bole Hub (Addis Ababa)',
    travelerName: '',
    flightNo: '',
    departureDate: '',
    notes: ''
  });

  // Filter Shipments
  const filteredShipments = shipments.filter((item) => {
    const matchesSearch = 
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.travelerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.flightNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'dubai') return matchesSearch && item.status === 'Dispatched';
    if (activeTab === 'transit') return matchesSearch && item.status === 'In Transit';
    if (activeTab === 'addis') return matchesSearch && (item.status === 'Received' || item.status === 'Discrepancy');
    return matchesSearch;
  });

  // Handle Add New Dispatch (Sender Side)
  const handleCreateShipment = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `TRK-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: formData.brand,
      quantity: Number(formData.quantity),
      sender: formData.sender,
      senderCity: "Dubai, UAE",
      receiver: formData.receiver,
      receiverCity: "Addis Ababa, ET",
      travelerName: formData.travelerName,
      flightNo: formData.flightNo,
      departureDate: formData.departureDate || new Date().toISOString().split('T')[0],
      status: "Dispatched",
      receivedQuantity: null,
      notes: formData.notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setShipments([newEntry, ...shipments]);
    setIsModalOpen(false);
    setFormData({
      brand: '',
      quantity: '',
      sender: 'Dubai Central Warehouse',
      receiver: 'Bole Hub (Addis Ababa)',
      travelerName: '',
      flightNo: '',
      departureDate: '',
      notes: ''
    });
  };

  // Status Handlers (Traveler & Receiver updates)
  const updateStatus = (id, newStatus, receivedQty = null) => {
    setShipments(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          receivedQuantity: receivedQty !== null ? receivedQty : item.receivedQuantity
        };
      }
      return item;
    }));
    setSelectedShipment(null);
  };

  // Status Badges
  const renderBadge = (status) => {
    switch (status) {
      case 'Dispatched':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">DXB Dispatched</span>;
      case 'In Transit':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">In Flight / Transit</span>;
      case 'Received':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Received in Addis</span>;
      case 'Discrepancy':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">Discrepancy</span>;
      default:
        return null;
    }
  };

  // Metrics
  const totalBottlesOut = shipments.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalBottlesIn = shipments.reduce((acc, curr) => acc + (curr.receivedQuantity || 0), 0);
  const inTransitCount = shipments.filter(s => s.status === 'In Transit' || s.status === 'Dispatched').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500">
              <Wine className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                AmberVault Track
              </span>
              <span className="text-xs text-slate-400 block -mt-1">Dubai ✈ Addis Ababa Whiskey Corridor</span>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-lg shadow-amber-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>New Outbound (DXB)</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* KPI Grid */}
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

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text"
              placeholder="Search by bottle, traveler, flight, or tracking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none placeholder:text-slate-500 text-slate-200"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-sm overflow-x-auto">
            {['all', 'dubai', 'transit', 'addis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md font-medium capitalize whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab === 'dubai' ? 'Dubai Outbound' : tab === 'addis' ? 'Addis Inbound' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Shipments Table / List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tracking & Whiskey</th>
                  <th className="py-3.5 px-4">Origin ➔ Destination</th>
                  <th className="py-3.5 px-4">Assigned Traveler</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      No whiskey shipments found.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((item) => (
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
                        <div className="flex items-center gap-1.5 font-medium text-slate-300">
                          <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                          {item.travelerName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>{item.flightNo}</span> • <span>{item.departureDate}</span>
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
                        {renderBadge(item.status)}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={() => setSelectedShipment(item)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded border border-slate-700 transition"
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
      </main>

      {/* Modal 1: Create Shipment (Dubai Outbound Admin) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-850">
              <h3 className="font-semibold text-lg text-slate-100 flex items-center gap-2">
                <PlaneTakeoff className="w-5 h-5 text-amber-500" />
                Dispatch New Whiskey Batch (Dubai)
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="p-6 space-y-4">
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
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Flight Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., ET 601"
                    value={formData.flightNo}
                    onChange={(e) => setFormData({...formData, flightNo: e.target.value})}
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
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Departure Date</label>
                  <input 
                    type="date" 
                    value={formData.departureDate}
                    onChange={(e) => setFormData({...formData, departureDate: e.target.value})}
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-sm font-semibold transition"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Manage & Confirm Arrival (Addis Receiver Admin / Status Change) */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-slate-100">{selectedShipment.brand}</h3>
                <span className="text-xs font-mono text-slate-500">{selectedShipment.id}</span>
              </div>
              <button 
                onClick={() => setSelectedShipment(null)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Traveler:</span>
                  <span className="font-medium text-slate-200">{selectedShipment.travelerName} ({selectedShipment.flightNo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bottles Sent:</span>
                  <span className="font-medium text-amber-400">{selectedShipment.quantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span>{renderBadge(selectedShipment.status)}</span>
                </div>
                {selectedShipment.notes && (
                  <div className="text-xs text-slate-400 pt-1 border-t border-slate-900">
                    <span className="font-semibold">Note:</span> {selectedShipment.notes}
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Update Transition</p>

                {/* Mark In Transit */}
                {selectedShipment.status === 'Dispatched' && (
                  <button 
                    onClick={() => updateStatus(selectedShipment.id, 'In Transit')}
                    className="w-full py-2.5 px-3 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 font-medium rounded-lg text-sm transition flex items-center justify-center gap-2"
                  >
                    <PlaneTakeoff className="w-4 h-4" />
                    Handed to Traveler (Departed Dubai)
                  </button>
                )}

                {/* Confirm Reception in Addis Ababa */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button 
                    onClick={() => updateStatus(selectedShipment.id, 'Received', selectedShipment.quantity)}
                    className="py-2.5 px-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-medium rounded-lg text-xs transition flex flex-col items-center justify-center text-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    All Received ({selectedShipment.quantity} Bottles)
                  </button>

                  <button 
                    onClick={() => {
                      const count = prompt(`How many bottles arrived safely out of ${selectedShipment.quantity}?`, "0");
                      if (count !== null) {
                        const parsed = parseInt(count, 10);
                        updateStatus(
                          selectedShipment.id, 
                          parsed === selectedShipment.quantity ? 'Received' : 'Discrepancy', 
                          isNaN(parsed) ? 0 : parsed
                        );
                      }
                    }}
                    className="py-2.5 px-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-medium rounded-lg text-xs transition flex flex-col items-center justify-center text-center gap-1"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Damage / Missing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}