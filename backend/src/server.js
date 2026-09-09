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

// ----------------- AUTH ROUTES ----------------- //

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'sender'
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------- SHIPMENT ROUTES ----------------- //

// GET /api/shipments (Corridor list)
app.get('/api/shipments', authenticateToken, async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shipments (New Dubai Outbound Batch)
app.post('/api/shipments', authenticateToken, async (req, res) => {
  try {
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
        createdById: req.user.id
      }
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/shipments/:id/status (Transit or Addis arrival confirmation)
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AmberVault Backend running on http://localhost:${PORT}`);
});