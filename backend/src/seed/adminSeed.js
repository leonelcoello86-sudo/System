import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

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

  console.log('Admin user seeded:', ADMIN_EMAIL);
}

