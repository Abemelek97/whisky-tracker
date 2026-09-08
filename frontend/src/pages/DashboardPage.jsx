import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatCards from '../components/StatCards';
import ShipmentTable from '../components/ShipmentTable';
import CreateShipmentModal from '../components/CreateShipmentModal';
import ManageShipmentModal from '../components/ManageShipmentModal';
import OnboardingModal from '../components/OnboardingModal';

export default function DashboardPage({ 
  currentUser, 
  shipments, 
  onLogout, 
  onCreateShipment, 
  onUpdateStatus,
  showOnboarding,
  setShowOnboarding 
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const filteredShipments = shipments.filter((item) => {
    const matchesSearch = 
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.travelerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.travelerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'dubai') return matchesSearch && item.status === 'Dispatched';
    if (activeTab === 'transit') return matchesSearch && item.status === 'In Transit';
    if (activeTab === 'addis') return matchesSearch && (item.status === 'Received' || item.status === 'Discrepancy');
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar 
        currentUser={currentUser}
        onOpenNewDispatch={() => setIsCreateModalOpen(true)}
        onOpenHelp={() => setShowOnboarding(true)}
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Role Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-200">
                Welcome back, {currentUser.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentUser.role === 'sender' 
                  ? 'Active in Dubai Outbound. Register outgoing traveler batches and seal codes.'
                  : currentUser.role === 'receiver'
                  ? 'Active in Addis Ababa Inbound. Verify arriving bottles and log discrepancy reports.'
                  : 'Super Admin Access. Unrestricted controls for all dispatches and receiving depots.'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowOnboarding(true)}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer whitespace-nowrap"
          >
            Review Corridor Guidelines
          </button>
        </div>

        {/* KPIs */}
        <StatCards shipments={shipments} />

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search by bottle, traveler, phone, or ID..."
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
                className={`px-3 py-1.5 rounded-md font-medium capitalize whitespace-nowrap transition cursor-pointer ${
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

        {/* Table */}
        <ShipmentTable 
          shipments={filteredShipments} 
          onManage={(item) => setSelectedShipment(item)} 
        />
      </main>

      {/* Modals */}
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
      />

      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}