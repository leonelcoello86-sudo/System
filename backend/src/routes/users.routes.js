import { Router } from 'express';
import bcrypt from 'bcrypt';

import { User } from '../models/User.js';
import { SystemAudit } from '../models/SystemAudit.js';
import { authRequired, requireAdmin } from '../middleware/authRequired.js';
import { nowTimeString } from '../utils/time.js';
import { validatePassword } from '../utils/passwordPolicy.js';
import { logError, logJson } from '../utils/logger.js';
import { validateEmail } from '../utils/inputValidation.js';

const router = Router();

router.post('/', authRequired, requireAdmin, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'email y password requeridos' });
    }

    const emailCheck = validateEmail(normalizedEmail);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ message: passwordCheck.message });
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

    try {
      await SystemAudit.create({
        time: nowTimeString(),
        event: `Nuevo usuario creado: ${normalizedEmail} por ${req.user?.email || 'anónimo'}`,
        severity: 'Info'
      });
    } catch (e) {
      logError(`Audit error creating user: ${e?.message || e}`);
    }

    return res.status(201).json({ message: 'Usuario creado', user: { email: normalizedEmail, role: 'user' } });
  } catch (err) {
    logJson('error', `Error creating user: ${err?.message || err}`, { correlationId: req.correlationId });
    return res.status(500).json({ message: 'Error creando usuario', correlationId: req.correlationId });
  }
});

export { router as usersRouter };
