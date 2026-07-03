import { Asset } from '../models/Asset.js';
import { SystemAudit } from '../models/SystemAudit.js';
import { logInfo, logError } from '../utils/logger.js';

const validIcons = ['soldado', 'vehiculo', 'dron'];

/**
 * Convierte valores de coordenadas o métricas en número.
 * @param {unknown} value
 * @returns {number|null}
 */
export function parseNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const normalized = String(value).trim().replace(',', '.');
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Valida que la entrada del asset tenga los campos mínimos requeridos.
 * @param {Record<string, unknown>} payload
 * @returns {{ valid: boolean, message: string }}
 */
export function validateAssetPayload(payload) {
  const { type, name, status, icon, latitude, longitude } = payload || {};

  if (!type || !name || !status || !icon || latitude === undefined || longitude === undefined) {
    return { valid: false, message: 'type, name, status, icon, latitude y longitude requeridos' };
  }

  if (!validIcons.includes(String(icon))) {
    return { valid: false, message: 'icon inválido' };
  }

  const latNum = parseNumber(latitude);
  const lonNum = parseNumber(longitude);
  if (latNum === null || lonNum === null) {
    return { valid: false, message: 'latitude y longitude deben ser números válidos' };
  }

  return { valid: true };
}

/**
 * Construye el objeto asset listos para guardar.
 * @param {Record<string, unknown>} payload
 * @returns {Record<string, unknown>}
 */
export function buildAssetData(payload) {
  const { type, name, status, icon, battery, fuel, personnel, latitude, longitude } = payload || {};
  const latNum = parseNumber(latitude);
  const lonNum = parseNumber(longitude);

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

  return assetData;
}

/**
 * Guarda un asset nuevo o actualiza el existente y crea un registro de auditoría.
 * @param {Record<string, unknown>} payload
 * @param {string} actor
 * @returns {Promise<{ message: string }>} 
 */
export async function saveAsset(payload, actor) {
  const assetData = buildAssetData(payload);
  const { name } = assetData;

  try {
    const existing = await Asset.findOne({ name });
    if (existing) {
      await Asset.updateOne({ _id: existing._id }, assetData);
      await SystemAudit.create({
        time: new Date().toLocaleTimeString('es-VE', { hour12: false }),
        event: `Activo actualizado por ${actor}: ${name}`,
        severity: 'Info'
      });
      logInfo(`Activo actualizado: ${name} por ${actor}`);
      return { message: 'Asset actualizado' };
    }

    await Asset.create(assetData);
    await SystemAudit.create({
      time: new Date().toLocaleTimeString('es-VE', { hour12: false }),
      event: `Activo creado por ${actor}: ${name}`,
      severity: 'Info'
    });
    logInfo(`Activo creado: ${name} por ${actor}`);
    return { message: 'Asset creado' };
  } catch (err) {
    logError(`Error guardando asset ${name}: ${err?.message || err}`);
    throw err;
  }
}
