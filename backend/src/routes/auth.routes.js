import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User } from '../models/User.js';
import { AccessLog } from '../models/AccessLog.js';
import { SystemAudit } from '../models/SystemAudit.js';

const router = Router();

function nowTimeString() {
  return new Date().toLocaleTimeString('es-VE', { hour12: false });
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email y password requeridos' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

    if (!user) {
      await AccessLog.create({ ip, user: normalizedEmail, status: 'Denegado' });
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      await AccessLog.create({ ip, user: normalizedEmail, status: 'Denegado' });
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    await AccessLog.create({ ip, user: normalizedEmail, status: 'Concedido' });

    await SystemAudit.create({
      time: nowTimeString(),
      event: `Sesión iniciada por ${normalizedEmail}`,
      severity: 'Info'
    });

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.json({
      token,
      user: { email: user.email, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error en login', error: String(err?.message || err) });
  }
});

export { router as authRouter };

