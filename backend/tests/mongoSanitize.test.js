import { describe, test, expect } from 'vitest';
import { mongoSanitize } from '../src/middleware/mongoSanitize.js';

describe('mongoSanitize', () => {
  test('elimina keys que inician con $ del body', () => {
    const req = {
      body: { name: 'test', $gt: 'hack', nested: { $where: 'malicious' } },
      query: {},
      params: {}
    };
    const res = {};
    const next = () => {};

    mongoSanitize(req, res, next);

    expect(req.body.name).toBe('test');
    expect(req.body.$gt).toBeUndefined();
    expect(req.body.nested.$where).toBeUndefined();
  });
});
