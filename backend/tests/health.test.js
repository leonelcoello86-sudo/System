import { describe, test, expect } from 'vitest';
import { createApp } from '../server.js';

describe('health endpoint', () => {
  test('returns a production-ready health payload', async () => {
    const app = createApp();
    const server = app.listen(0);

    await new Promise((resolve) => server.once('listening', resolve));

    try {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      const payload = await response.json();

      expect(response.status).toBe(200);
      expect(payload).toEqual(expect.objectContaining({
        status: 'ok',
        service: 'tactical-control-backend',
      }));
      expect(typeof payload.uptime).toBe('number');
    } finally {
      await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
  });
});
