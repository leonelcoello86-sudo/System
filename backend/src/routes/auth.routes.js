import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User } from '../models/User.js';
import { AccessLog } from '../models/AccessLog.js';
import { SystemAudit } from '../models/SystemAudit.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { nowTimeString } from '../utils/time.js';
import { logJson } from '../utils/logger.js';
import { validateEmail } from '../utils/inputValidation.js';

const router = Router();

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email y password requeridos' });
    }

    const emailCheck = validateEmail(normalizedEmail);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message });
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
    logJson('error', `Login error: ${err?.message || err}`, { correlationId: req.correlationId });
    return res.status(500).json({ message: 'Error en login', correlationId: req.correlationId });
  }
});

export { router as authRouter };
