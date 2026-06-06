import { Router } from 'express';
import bcrypt from 'bcrypt';

import { User } from '../models/User.js';
import { SystemAudit } from '../models/SystemAudit.js';
import { authRequired, requireAdmin } from '../middleware/authRequired.js';

const router = Router();

function nowTimeString() {
  return new Date().toLocaleTimeString('es-VE', { hour12: false });
}

router.post('/', authRequired, requireAdmin, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'email y password requeridos' });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await User.create({
      email: normalizedEmail,
      passwordHash,
      role: 'user'
    });

    await SystemAudit.create({
      time: nowTimeString(),
      event: `Nuevo usuario creado: ${normalizedEmail}`,
      severity: 'Info'
    });

    return res.status(201).json({ message: 'Usuario creado', user: { email: normalizedEmail, role: 'user' } });
  } catch (err) {
    return res.status(500).json({ message: 'Error creando usuario', error: String(err?.message || err) });
  }
});

export { router as usersRouter };

