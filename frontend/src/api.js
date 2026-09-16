const API_URL = 'https://whisky-tracker.onrender.com/api';

function getAuthHeader() {
  const token = localStorage.getItem('ambervault_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to login');
  return data;
}

export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to register');
  return data;
}

export async function fetchShipments() {
  const res = await fetch(`${API_URL}/shipments`, {
    headers: { ...getAuthHeader() }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch shipments');
  return data;
}

export async function createShipment(shipmentData) {
  const res = await fetch(`${API_URL}/shipments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(shipmentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create shipment');
  return data;
}

export async function updateShipmentStatus(id, status, receivedQuantity) {
  const res = await fetch(`${API_URL}/shipments/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ status, receivedQuantity })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update shipment');
  return data;
}

export async function logTravelerCall(id) {
  const res = await fetch(`${API_URL}/shipments/${id}/log-call`, {
    method: 'POST',
    headers: { ...getAuthHeader() }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to log call');
  return data;
}
export async function createRoom(roomData) {
  const res = await fetch(`${API_URL}/rooms/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(roomData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create room');
  return data;
}

export async function joinRoom(roomData) {
  const res = await fetch(`${API_URL}/rooms/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(roomData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to join room');
  return data;
}

export async function fetchMyRoom() {
  const res = await fetch(`${API_URL}/rooms/my-room`, {
    headers: { ...getAuthHeader() }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load room');
  return data;
}