import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import StatCards from '../components/StatCards';
import ShipmentTable from '../components/ShipmentTable';
import CreateShipmentModal from '../components/CreateShipmentModal';
import ManageShipmentModal from '../components/ManageShipmentModal';
import RoomSelectorModal from '../components/RoomSelectorModal';
import OnboardingModal from '../components/OnboardingModal';
import { exportMonthlyWhiskyToCSV } from '../utils/exportToExcel';

export default function DashboardPage({ 
  currentUser, 
  currentRoom,
  onRoomUpdated,
  shipments, 
  onLogout, 
  onCreateShipment, 
  onUpdateStatus,
  onCallTraveler,
  showOnboarding,
  setShowOnboarding 
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  
  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const [exportMonth, setExportMonth] = useState(currentYearMonth);

  const safeShipments = Array.isArray(shipments) ? shipments : [];

  const filteredShipments = safeShipments.filter((item) => {
    const matchesSearch = 
      (item.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.travelerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.travelerPhone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.id || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'dubai') return matchesSearch && item.status === 'Dispatched';
    if (activeTab === 'transit') return matchesSearch && item.status === 'In Transit';
    if (activeTab === 'addis') return matchesSearch && (item.status === 'Received' || item.status === 'Discrepancy');
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar 
        currentUser={currentUser}
        currentRoom={currentRoom}
        onOpenRoomModal={() => setIsRoomModalOpen(true)}
        onOpenNewDispatch={() => setIsCreateModalOpen(true)}
        onOpenHelp={() => setShowOnboarding(true)}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* If no room is joined, show prominent Connect Banner */}
        {!currentRoom && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-400">You are not connected to a private vault room</p>
              <p className="text-xs text-slate-400">Join or create a room with your partner in Dubai/Addis to dispatch and see shipments.</p>
            </div>
            <button
              onClick={() => setIsRoomModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition cursor-pointer"
            >
              Connect or Create Room
            </button>
          </div>
        )}

        {/* Stat KPIs */}
        <StatCards shipments={safeShipments} />

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Search by bottle, traveler, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none placeholder:text-slate-500 text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportMonthlyWhiskyToCSV(safeShipments, exportMonth)}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs transition cursor-pointer"
            >
              Export Monthly Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <ShipmentTable 
          shipments={filteredShipments} 
          onManage={(item) => setSelectedShipment(item)} 
          onCallTraveler={onCallTraveler}
        />
      </main>

      {/* Room Modal */}
      <RoomSelectorModal 
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        currentRoom={currentRoom}
        onRoomUpdated={(room) => {
          onRoomUpdated(room);
          setIsRoomModalOpen(false);
        }}
      />

      <CreateShipmentModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={onCreateShipment}
      />

      <ManageShipmentModal 
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
        onUpdateStatus={(id, status, qty) => {
          onUpdateStatus(id, status, qty);
          setSelectedShipment(null);
        }}
        onCallTraveler={onCallTraveler}
      />

      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}