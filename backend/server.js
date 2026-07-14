import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { pathToFileURL } from 'url';

import { authRouter } from './src/routes/auth.routes.js';
import { usersRouter } from './src/routes/users.routes.js';
import { accessLogsRouter } from './src/routes/access-logs.routes.js';
import { systemAuditRouter } from './src/routes/system-audit.routes.js';
import { assetsRouter } from './src/routes/assets.routes.js';
import { adminRouter } from './src/routes/admin.routes.js';
import { globalLimiter } from './src/middleware/rateLimiter.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { mongoSanitize } from './src/middleware/mongoSanitize.js';

dotenv.config();

export function createApp() {
  const app = express();

  app.use(helmet());

  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173'];

  const isProduction = process.env.NODE_ENV === 'production';

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.trim();

      if (corsOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      if (!isProduction) {
        const localhostRegex = /^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/;
        if (localhostRegex.test(normalizedOrigin)) {
          return callback(null, true);
        }
      }

      return callback(new Error('CORS policy: access denied'));
    },
    credentials: true
  }));

  app.use(globalLimiter);
  app.use(express.json({ limit: '1mb' }));
  app.use(mongoSanitize);

  app.get('/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    return res.status(200).json({
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      service: 'tactical-control-backend',
      db: dbStatus,
      uptime: Number(process.uptime().toFixed(2))
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/access-logs', accessLogsRouter);
  app.use('/api/system-audit', systemAuditRouter);
  app.use('/api/assets', assetsRouter);
  app.use('/api', adminRouter);

  app.use(errorHandler);

  return app;
}

export async function startServer(port = process.env.PORT || 5000, options = {}) {
  const app = createApp();

  if (!options.skipDbConnection) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      console.error('Missing env var MONGODB_URI');
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    const { ensureAdminUser } = await import('./src/seed/adminSeed.js');
    await ensureAdminUser();
  }

  return app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  startServer();
}

