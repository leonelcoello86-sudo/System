import { describe, test, expect } from 'vitest';
import { validateEmail, validateMaxLength, sanitizeString } from '../src/utils/inputValidation.js';

describe('inputValidation', () => {
  test('validateEmail acepta email válido', () => {
    expect(validateEmail('user@example.com')).toEqual({ valid: true });
  });

  test('validateEmail rechaza email sin formato válido', () => {
    const result = validateEmail('no-es-email');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/inválido/);
  });

  test('validateEmail rechaza email vacío', () => {
    expect(validateEmail('').valid).toBe(false);
    expect(validateEmail(null).valid).toBe(false);
  });

  test('validateMaxLength rechaza string que excede longitud', () => {
    const longString = 'a'.repeat(101);
    const result = validateMaxLength(longString, 'name', 100);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/100/);
  });

  test('validateMaxLength acepta string dentro de límite', () => {
    expect(validateMaxLength('test', 'name', 100)).toEqual({ valid: true });
  });

  test('sanitizeString elimina caracteres peligrosos', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
    expect(sanitizeString('  hola   mundo  ')).toBe('hola mundo');
  });
});
