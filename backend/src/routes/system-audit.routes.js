import { Router } from 'express';

import { authRequired, requireAdmin } from '../middleware/authRequired.js';
import { SystemAudit } from '../models/SystemAudit.js';

const router = Router();

router.get('/', authRequired, requireAdmin, async (req, res) => {
  try {
    const audits = await SystemAudit.find({}).sort({ _id: -1 }).limit(200);
    return res.json({ audits });
  } catch (err) {
    return res.status(500).json({ message: 'Error obteniendo system audit', error: String(err?.message || err) });
  }
});

export { router as systemAuditRouter };

