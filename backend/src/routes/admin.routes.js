import { Router } from 'express';
import bcrypt from 'bcrypt';

import { authRequired, requireAdmin } from '../middleware/authRequired.js';
import { User } from '../models/User.js';
import { SystemAudit } from '../models/SystemAudit.js';

const router = Router();

function nowTimeString() {
  return new Date().toLocaleTimeString('es-VE', { hour12: false });
}

// Admin updates own password
router.put('/admin-password', authRequired, requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'currentPassword, newPassword y confirmPassword requeridos' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'newPassword y confirmPassword no coinciden' });
    }

    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres' });
    }

    // `req.user.sub` es el id del usuario
    const adminId = req.user?.sub;
    if (!adminId) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin no encontrado' });
    }

    const ok = await bcrypt.compare(String(currentPassword), admin.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta' });
    }

    const passwordHash = await bcrypt.hash(String(newPassword), 10);
    admin.passwordHash = passwordHash;
    await admin.save();

    await SystemAudit.create({
      time: nowTimeString(),
      event: `Cambio de credenciales del administrador: ${admin.email}`,
      severity: 'Alerta'
    });

    return res.json({ message: 'Credenciales actualizadas' });
  } catch (err) {
    return res.status(500).json({ message: 'Error actualizando credenciales', error: String(err?.message || err) });
  }
});

export { router as adminRouter };

