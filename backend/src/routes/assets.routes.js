import { Router } from 'express';
import mongoose from 'mongoose';

import { authRequired } from '../middleware/authRequired.js';
import { Asset } from '../models/Asset.js';
import { SystemAudit } from '../models/SystemAudit.js';
import { validateAssetPayload, buildAssetData, saveAsset } from '../services/assetService.js';
import { nowTimeString } from '../utils/time.js';
import { logError, logJson } from '../utils/logger.js';

const router = Router();

router.get('/summary', authRequired, async (req, res) => {
  try {
    const total = await Asset.countDocuments({});
    return res.json({ total });
  } catch (err) {
    logJson('error', `Error getting asset summary: ${err?.message || err}`, { correlationId: req.correlationId });
    return res.status(500).json({ message: 'Error obteniendo resumen de assets', correlationId: req.correlationId });
  }
});

router.get('/', authRequired, async (req, res) => {
  try {
    const assets = await Asset.find({}).limit(500);
    return res.json({ assets });
  } catch (err) {
    logJson('error', `Error getting assets: ${err?.message || err}`, { correlationId: req.correlationId });
    return res.status(500).json({ message: 'Error obteniendo assets', correlationId: req.correlationId });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const validation = validateAssetPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const result = await saveAsset(req.body, req.user?.email || 'anónimo');
    return res.status(result.message === 'Asset creado' ? 201 : 200).json(result);
  } catch (err) {
    logJson('error', `Error saving asset: ${err?.message || err}`, { correlationId: req.correlationId });
    return res.status(500).json({ message: 'Error guardando asset', correlationId: req.correlationId });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de asset inválido' });
    }

    const validation = validateAssetPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const assetData = buildAssetData(req.body);
    const updated = await Asset.findByIdAndUpdate(id, assetData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Asset no encontrado' });
    }

    try {
      await SystemAudit.create({
        time: nowTimeString(),
        event: `Activo actualizado por ${req.user?.email || 'anónimo'}: ${updated.name}`,
        severity: 'Info'
      });
    } catch (e) {
      logError(`Audit error updating asset: ${e?.message || e}`);
    }

    return res.json({ message: 'Asset actualizado', asset: updated });
  } catch (err) {
    logJson('error', `Error updating asset: ${err?.message || err}`, { correlationId: req.correlationId });
    return res.status(500).json({ message: 'Error actualizando asset', correlationId: req.correlationId });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de asset inválido' });
    }

    const deleted = await Asset.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Asset no encontrado' });
    }

    try {
      await SystemAudit.create({
        time: nowTimeString(),
        event: `Activo eliminado por ${req.user?.email || 'anónimo'}: ${deleted.name}`,
        severity: 'Alerta'
      });
    } catch (e) {
      logError(`Audit error deleting asset: ${e?.message || e}`);
    }

    return res.json({ message: 'Asset eliminado' });
  } catch (err) {
    logJson('error', `Error deleting asset: ${err?.message || err}`, { correlationId: req.correlationId });
    return res.status(500).json({ message: 'Error eliminando asset', correlationId: req.correlationId });
  }
});

export { router as assetsRouter };
