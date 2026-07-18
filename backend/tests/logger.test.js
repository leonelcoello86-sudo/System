import { describe, test, expect } from 'vitest';
import { formatTimestamp } from '../src/utils/logger.js';

describe('logger', () => {
  test('formatTimestamp retorna una cadena ISO 8601 válida', () => {
    const timestamp = formatTimestamp();
    expect(typeof timestamp).toBe('string');
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });
});
