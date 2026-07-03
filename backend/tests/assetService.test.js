import { describe, test, expect } from 'vitest';
import { parseNumber, validateAssetPayload, buildAssetData } from '../src/services/assetService.js';

describe('assetService', () => {
  test('parseNumber convierte valores válidos', () => {
    expect(parseNumber('12.5')).toBe(12.5);
    expect(parseNumber(' 100 ')).toBe(100);
    expect(parseNumber('1,5')).toBe(1.5);
  });

  test('parseNumber rechaza valores inválidos', () => {
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('')).toBeNull();
    expect(parseNumber(undefined)).toBeNull();
  });

  test('validateAssetPayload rechaza icon inválido', () => {
    const payload = { type: 'UAV', name: 'Dron1', status: 'activo', icon: 'otro', latitude: '10', longitude: '20' };
    expect(validateAssetPayload(payload)).toEqual({ valid: false, message: 'icon inválido' });
  });

  test('validateAssetPayload rechaza coordenadas inválidas', () => {
    const payload = { type: 'Vehículo', name: 'V1', status: 'activo', icon: 'vehiculo', latitude: 'a', longitude: '20' };
    expect(validateAssetPayload(payload)).toEqual({ valid: false, message: 'latitude y longitude deben ser números válidos' });
  });

  test('buildAssetData normaliza battery, fuel y personnel correctamente', () => {
    const uav = buildAssetData({ type: 'UAV', name: 'D1', status: 'activo', icon: 'dron', latitude: '10', longitude: '20', battery: '150' });
    expect(uav.battery).toBe(100);
    const veh = buildAssetData({ type: 'Vehículo', name: 'V2', status: 'activo', icon: 'vehiculo', latitude: '10', longitude: '20', fuel: '80' });
    expect(veh.fuel).toBe(80);
    const personal = buildAssetData({ type: 'Personal', name: 'P1', status: 'activo', icon: 'soldado', latitude: '10', longitude: '20', personnel: '5' });
    expect(personal.personnel).toBe(5);
  });
});
