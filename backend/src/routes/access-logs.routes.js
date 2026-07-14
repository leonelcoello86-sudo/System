import { Router } from 'express';

import { authRequired, requireAdmin } from '../middleware/authRequired.js';
import { AccessLog } from '../models/AccessLog.js';
import { logError } from '../utils/logger.js';

const router = Router();

router.get('/', authRequired, requireAdmin, async (req, res) => {
  try {
    const { today, page, limit } = req.query;
    const filter = {};

    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 10, 100);

    if (today === 'true') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      filter.date = { $gte: startOfDay };
    }

    const logs = await AccessLog.find(filter).sort({ date: -1 }).limit(limitNum).skip((pageNum - 1) * limitNum);
    return res.json({ logs });
  } catch (err) {
    logError(`Error getting access logs: ${err?.message || err}`);
    return res.status(500).json({ message: 'Error obteniendo access logs' });
  }
});

export { router as accessLogsRouter };
