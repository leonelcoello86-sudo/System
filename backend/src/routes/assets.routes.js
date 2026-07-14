import { Router } from 'express';
import mongoose from 'mongoose';

import { authRequired } from '../middleware/authRequired.js';
import { Asset } from '../models/Asset.js';
import { SystemAudit } from '../models/SystemAudit.js';
import { validateAssetPayload, buildAssetData, saveAsset } from '../services/assetService.js';
import { nowTimeString } from '../utils/time.js';
import { logError } from '../utils/logger.js';

const router = Router();

router.get('/summary', authRequired, async (req, res) => {
  try {
    const total = await Asset.countDocuments({});
    return res.json({ total });
  } catch (err) {
    logError(`Error getting asset summary: ${err?.message || err}`);
    return res.status(500).json({ message: 'Error obteniendo resumen de assets' });
  }
});

router.get('/', authRequired, async (req, res) => {
  try {
    const assets = await Asset.find({}).limit(500);
    return res.json({ assets });
  } catch (err) {
    logError(`Error getting assets: ${err?.message || err}`);
    return res.status(500).json({ message: 'Error obteniendo assets' });
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
    logError(`Error saving asset: ${err?.message || err}`);
    return res.status(500).json({ message: 'Error guardando asset' });
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
    logError(`Error updating asset: ${err?.message || err}`);
    return res.status(500).json({ message: 'Error actualizando asset' });
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
    logError(`Error deleting asset: ${err?.message || err}`);
    return res.status(500).json({ message: 'Error eliminando asset' });
  }
});

export { router as assetsRouter };
