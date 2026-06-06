import { Router } from 'express';

import { authRequired, requireAdmin } from '../middleware/authRequired.js';
import { Asset } from '../models/Asset.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  try {
    const assets = await Asset.find({}).limit(500);
    return res.json({ assets });
  } catch (err) {
    return res.status(500).json({ message: 'Error obteniendo assets', error: String(err?.message || err) });
  }
});

router.post('/', authRequired, requireAdmin, async (req, res) => {
  try {
    const { type, name, status, battery } = req.body || {};
    if (!type || !name || !status) {
      return res.status(400).json({ message: 'type, name, status requeridos' });
    }

    const batteryNum = battery === undefined || battery === '' ? 100 : Number(battery);

    const existing = await Asset.findOne({ name });
    if (existing) {
      await Asset.updateOne({ name }, { type, status, battery: batteryNum });
      return res.json({ message: 'Asset actualizado' });
    }

    await Asset.create({ type, name, status, battery: batteryNum });
    return res.status(201).json({ message: 'Asset creado' });
  } catch (err) {
    return res.status(500).json({ message: 'Error guardando asset', error: String(err?.message || err) });
  }
});

export { router as assetsRouter };

