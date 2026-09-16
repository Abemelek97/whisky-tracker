import React, { useState, useEffect } from 'react';
import AuthPage from './pages/Authpage';
import DashboardPage from './pages/DashboardPage';
import { fetchShipments, createShipment, updateShipmentStatus, logTravelerCall, fetchMyRoom } from './api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ambervault_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRoom, setCurrentRoom] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const loadData = async () => {
    try {
      const room = await fetchMyRoom();
      setCurrentRoom(room);
      const data = await fetchShipments();
      setShipments(data);
    } catch (err) {
      console.error("Failed to load app data:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    } else {
      setCurrentRoom(null);
      setShipments([]);
    }
  }, [currentUser]);

  const handleRoomUpdated = (room) => {
    setCurrentRoom(room);
    loadData(); // Refreshes shipment list scoped to this room!
  };

  if (!currentUser) {
    return <AuthPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <DashboardPage 
      currentUser={currentUser}
      currentRoom={currentRoom}
      onRoomUpdated={handleRoomUpdated}
      shipments={shipments}
      onLogout={() => {
        localStorage.clear();
        setCurrentUser(null);
      }}
      onCreateShipment={async (form) => {
        const item = await createShipment(form);
        setShipments(prev => [item, ...prev]);
      }}
      onUpdateStatus={async (id, status, qty) => {
        const item = await updateShipmentStatus(id, status, qty);
        setShipments(prev => prev.map(s => s.id === id ? item : s));
      }}
      onCallTraveler={async (id) => {
        const item = await logTravelerCall(id);
        setShipments(prev => prev.map(s => s.id === id ? item : s));
      }}
      showOnboarding={showOnboarding}
      setShowOnboarding={setShowOnboarding}
    />
  );
}