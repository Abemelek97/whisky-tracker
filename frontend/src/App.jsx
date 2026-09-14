import React, { useState, useEffect } from 'react';
import AuthPage from './pages/Authpage';
import DashboardPage from './pages/DashboardPage';
import { fetchShipments, createShipment, updateShipmentStatus, logTravelerCall } from './api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ambervault_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [shipments, setShipments] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const loadShipments = async () => {
    try {
      const data = await fetchShipments();
      setShipments(data);
    } catch (err) {
      console.error("Failed to load shipments:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ambervault_user', JSON.stringify(currentUser));
      loadShipments();
    } else {
      localStorage.removeItem('ambervault_user');
      localStorage.removeItem('ambervault_token');
      setShipments([]);
    }
  }, [currentUser]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowOnboarding(false);
  };

  const handleCreateShipment = async (formData) => {
    try {
      const newShipment = await createShipment(formData);
      setShipments(prev => [newShipment, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (id, newStatus, receivedQty = null) => {
    try {
      const updated = await updateShipmentStatus(id, newStatus, receivedQty);
      setShipments(prev => prev.map(item => item.id === id ? updated : item));
    } catch (err) {
      alert(err.message);
    }
  };

  // When admin dials the traveler
  const handleCallTraveler = async (id) => {
    try {
      const updated = await logTravelerCall(id);
      setShipments(prev => prev.map(item => item.id === id ? updated : item));
    } catch (err) {
      console.error("Failed to log call:", err);
    }
  };

  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <DashboardPage 
      currentUser={currentUser}
      shipments={shipments}
      onLogout={handleLogout}
      onCreateShipment={handleCreateShipment}
      onUpdateStatus={handleUpdateStatus}
      onCallTraveler={handleCallTraveler}
      showOnboarding={showOnboarding}
      setShowOnboarding={setShowOnboarding}
    />
  );
}