import { Router } from 'express';

import { authRequired, requireAdmin } from '../middleware/authRequired.js';
import { Asset } from '../models/Asset.js';
import { SystemAudit } from '../models/SystemAudit.js';
import { validateAssetPayload, buildAssetData, saveAsset } from '../services/assetService.js';

const router = Router();

function nowTimeString() {
  return new Date().toLocaleTimeString('es-VE', { hour12: false });
}

router.get('/summary', authRequired, async (req, res) => {
  try {
    const total = await Asset.countDocuments({});
    return res.json({ total });
  } catch (err) {
    return res.status(500).json({ message: 'Error obteniendo resumen de assets', error: String(err?.message || err) });
  }
});

router.get('/', authRequired, async (req, res) => {
  try {
    const assets = await Asset.find({}).limit(500);
    return res.json({ assets });
  } catch (err) {
    return res.status(500).json({ message: 'Error obteniendo assets', error: String(err?.message || err) });
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
    return res.status(500).json({ message: 'Error guardando asset', error: String(err?.message || err) });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
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
      // ignore
    }

    return res.json({ message: 'Asset actualizado', asset: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Error actualizando asset', error: String(err?.message || err) });
  }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
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
      // ignore
    }

    return res.json({ message: 'Asset eliminado' });
  } catch (err) {
    return res.status(500).json({ message: 'Error eliminando asset', error: String(err?.message || err) });
  }
});

export { router as assetsRouter };

