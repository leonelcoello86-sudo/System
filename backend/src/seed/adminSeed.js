import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { logInfo } from '../utils/logger.js';

/**
 * Crea el usuario administrador inicial si no existe.
 * Usa las variables de entorno ADMIN_EMAIL y ADMIN_PASSWORD.
 * Si el usuario ya existe o las variables no están definidas, no realiza ninguna acción.
 */
export async function ensureAdminUser() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

  const existing = await User.findOne({ email: String(ADMIN_EMAIL).trim().toLowerCase() });
  if (existing) return;

  const passwordHash = await bcrypt.hash(String(ADMIN_PASSWORD), 10);

  await User.create({
    email: String(ADMIN_EMAIL).trim().toLowerCase(),
    passwordHash,
    role: 'admin'
  });

  logInfo(`Admin user seeded: ${ADMIN_EMAIL}`);
}

