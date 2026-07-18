import { describe, test, expect } from 'vitest';
import { validatePassword } from '../src/utils/passwordPolicy.js';

describe('passwordPolicy', () => {
  test('validatePassword acepta contraseña válida', () => {
    const result = validatePassword('Mypassword1!');
    expect(result).toEqual({ valid: true });
  });

  test('validatePassword rechaza contraseña sin carácter especial', () => {
    const result = validatePassword('Mypassword1');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/especial/);
  });

  test('validatePassword rechaza contraseña sin mayúscula', () => {
    const result = validatePassword('mypassword1!');
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/mayúscula/);
  });
});
