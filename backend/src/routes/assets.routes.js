import { Router } from 'express';

import { authRequired, requireAdmin } from '../middleware/authRequired.js';
import { Asset } from '../models/Asset.js';
import { SystemAudit } from '../models/SystemAudit.js';

const router = Router();

function nowTimeString() {
  return new Date().toLocaleTimeString('es-VE', { hour12: false });
}

const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const normalized = String(value).trim().replace(',', '.');
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};

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
    const { type, name, status, icon, battery, fuel, personnel, latitude, longitude } = req.body || {};

    if (!type || !name || !status || !icon || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'type, name, status, icon, latitude y longitude requeridos' });
    }

    const validIcons = ['soldado', 'vehiculo', 'dron'];
    if (!validIcons.includes(icon)) {
      return res.status(400).json({ message: 'icon inválido' });
    }

    const latNum = parseNumber(latitude);
    const lonNum = parseNumber(longitude);
    if (latNum === null || lonNum === null) {
      return res.status(400).json({ message: 'latitude y longitude deben ser números válidos' });
    }

    const assetData = {
      type,
      name,
      status,
      icon,
      latitude: latNum,
      longitude: lonNum,
      battery: null,
      fuel: null,
      personnel: null
    };

    if (type === 'UAV') {
      assetData.battery = Math.max(0, Math.min(100, parseNumber(battery) ?? 100));
    } else if (type === 'Vehículo') {
      assetData.fuel = Math.max(0, Math.min(100, parseNumber(fuel) ?? 100));
    } else if (type === 'Personal') {
      assetData.personnel = Math.max(0, parseNumber(personnel) ?? 1);
    }

    const existing = await Asset.findOne({ name });
    if (existing) {
      await Asset.updateOne({ _id: existing._id }, assetData);
      try {
        await SystemAudit.create({
          time: nowTimeString(),
          event: `Activo actualizado por ${req.user?.email || 'anónimo'}: ${name}`,
          severity: 'Info'
        });
      } catch (e) {
        // ignore audit errors
      }
      return res.json({ message: 'Asset actualizado' });
    }

    const created = await Asset.create(assetData);
    try {
      await SystemAudit.create({
        time: nowTimeString(),
        event: `Activo creado por ${req.user?.email || 'anónimo'}: ${name}`,
        severity: 'Info'
      });
    } catch (e) {
      // ignore audit errors
    }
    return res.status(201).json({ message: 'Asset creado' });
  } catch (err) {
    return res.status(500).json({ message: 'Error guardando asset', error: String(err?.message || err) });
  }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name, status, icon, battery, fuel, personnel, latitude, longitude } = req.body || {};

    if (!type || !name || !status || !icon || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'type, name, status, icon, latitude y longitude requeridos' });
    }

    const validIcons = ['soldado', 'vehiculo', 'dron'];
    if (!validIcons.includes(icon)) {
      return res.status(400).json({ message: 'icon inválido' });
    }

    const latNum = parseNumber(latitude);
    const lonNum = parseNumber(longitude);
    if (latNum === null || lonNum === null) {
      return res.status(400).json({ message: 'latitude y longitude deben ser números válidos' });
    }

    const assetData = {
      type,
      name,
      status,
      icon,
      latitude: latNum,
      longitude: lonNum,
      battery: null,
      fuel: null,
      personnel: null
    };

    if (type === 'UAV') {
      assetData.battery = Math.max(0, Math.min(100, parseNumber(battery) ?? 100));
    } else if (type === 'Vehículo') {
      assetData.fuel = Math.max(0, Math.min(100, parseNumber(fuel) ?? 100));
    } else if (type === 'Personal') {
      assetData.personnel = Math.max(0, parseNumber(personnel) ?? 1);
    }

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

