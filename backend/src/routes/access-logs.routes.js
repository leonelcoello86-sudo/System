import { Router } from 'express';

import { authRequired, requireAdmin } from '../middleware/authRequired.js';
import { AccessLog } from '../models/AccessLog.js';

const router = Router();

router.get('/', authRequired, requireAdmin, async (req, res) => {
  try {
    const { today } = req.query;
    const filter = {};

    if (today === 'true') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      filter.date = { $gte: startOfDay };
    }

    const logs = await AccessLog.find(filter).sort({ date: -1 }).limit(200);
    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ message: 'Error obteniendo access logs', error: String(err?.message || err) });
  }
});

export { router as accessLogsRouter };

