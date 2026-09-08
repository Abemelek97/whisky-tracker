import React, { useState, useEffect } from 'react';
import AuthPage from './pages/Authpage';
import DashboardPage from './pages/DashboardPage';
import { INITIAL_SHIPMENTS } from './data/mockShipments';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ambervault_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ambervault_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ambervault_user');
    }
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowOnboarding(false);
  };

  const handleCreateShipment = (formData) => {
    const newEntry = {
      id: `TRK-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: formData.brand,
      quantity: Number(formData.quantity),
      sender: formData.sender,
      senderCity: "Dubai, UAE",
      receiver: formData.receiver,
      receiverCity: "Addis Ababa, ET",
      travelerName: formData.travelerName,
      travelerPhone: formData.travelerPhone,
      departureDate: formData.departureDate || new Date().toISOString().split('T')[0],
      status: "Dispatched",
      receivedQuantity: null,
      notes: formData.notes,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setShipments(prev => [newEntry, ...prev]);
  };

  const handleUpdateStatus = (id, newStatus, receivedQty = null) => {
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
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <DashboardPage 
      currentUser={currentUser}
      shipments={shipments}
      onLogout={handleLogout}
      onCreateShipment={handleCreateShipment}
      onUpdateStatus={handleUpdateStatus}
      showOnboarding={showOnboarding}
      setShowOnboarding={setShowOnboarding}
    />
  );
}