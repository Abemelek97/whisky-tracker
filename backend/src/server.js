import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './db.js';
import { authenticateToken } from './middleware.js';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'AmberVault Logistics API' });
});

// ----------------- AUTH BY PHONE ----------------- //

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, password, role } = req.body;
    if (!phone || !password || !name) {
      return res.status(400).json({ error: 'Phone, name, and password are required' });
    }

    const cleanPhone = phone.trim();
    const existingUser = await prisma.user.findUnique({ where: { phone: cleanPhone } });
    if (existingUser) {
      return res.status(400).json({ error: 'This phone number is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        phone: cleanPhone,
        password: hashedPassword,
        role: role || 'sender'
      }
    });

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone number and password required' });
    }

    const cleanPhone = phone.trim();
    const user = await prisma.user.findUnique({ where: { phone: cleanPhone } });
    if (!user) {
      return res.status(401).json({ error: 'No account registered with this phone number' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user.id, phone: user.phone, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ----------------- PRIVATE ROOM ROUTES ----------------- //

// Create a new private Room
app.post('/api/rooms/create', authenticateToken, async (req, res) => {
  try {
    const { name, code, pin } = req.body;
    if (!name || !code || !pin) {
      return res.status(400).json({ error: 'Room name, code, and PIN are required' });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await prisma.room.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return res.status(400).json({ error: 'A room with this code already exists' });
    }

    const room = await prisma.room.create({
      data: { name, code: cleanCode, pin: pin.trim() }
    });

    // Automatically link the creator to this room
    await prisma.user.update({
      where: { id: req.user.id },
      data: { roomId: room.id }
    });

    res.json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join an existing private Room with Code & PIN
app.post('/api/rooms/join', authenticateToken, async (req, res) => {
  try {
    const { code, pin } = req.body;
    const cleanCode = (code || '').trim().toUpperCase();

    const room = await prisma.room.findUnique({ where: { code: cleanCode } });
    if (!room || room.pin !== pin.trim()) {
      return res.status(403).json({ error: 'Invalid Room Code or PIN' });
    }

    // Connect user to this private room
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { roomId: room.id },
      include: { room: true }
    });

    res.json({
      message: `Joined private room: ${room.name}`,
      room,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        roomId: updatedUser.roomId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Current User's active room info
app.get('/api/rooms/my-room', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { room: true }
    });
    res.json(user?.room || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- SHIPMENT ROUTES ----------------- //

// GET /api/shipments (Private to the user's room)
app.get('/api/shipments', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user.roomId) {
      // If user hasn't joined a room, show empty or prompt to join
      return res.json([]);
    }

    const shipments = await prisma.shipment.findMany({
      where: { roomId: user.roomId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shipments (Saves to the user's private room)
app.post('/api/shipments', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.roomId) {
      return res.status(400).json({ error: 'You must join or create a private room before dispatching' });
    }

    const { brand, quantity, sender, receiver, travelerName, travelerPhone, departureDate, notes } = req.body;
    const trackingId = `TRK-${Math.floor(1000 + Math.random() * 9000)}`;

    const shipment = await prisma.shipment.create({
      data: {
        id: trackingId,
        brand,
        quantity: parseInt(quantity, 10),
        sender: sender || 'Dubai Central Warehouse',
        receiver: receiver || 'Bole Distribution Depot',
        travelerName,
        travelerPhone,
        departureDate: departureDate || new Date().toISOString().split('T')[0],
        status: 'Dispatched',
        notes: notes || '',
        createdById: req.user.id,
        roomId: user.roomId
      }
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/shipments/:id/status
app.patch('/api/shipments/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, receivedQuantity } = req.body;

    const updated = await prisma.shipment.update({
      where: { id },
      data: {
        status,
        ...(receivedQuantity !== undefined && { receivedQuantity: Number(receivedQuantity) })
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shipments/:id/log-call (Mark as called)
app.post('/api/shipments/:id/log-call', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString();

    const updated = await prisma.shipment.update({
      where: { id },
      data: { lastCalledAt: timestamp }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AmberVault Backend running on http://localhost:${PORT}`);
});