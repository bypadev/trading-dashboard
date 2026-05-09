import fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { tickerRoutes } from './modules/market/controllers/tickerController';
import { authRoutes } from './modules/auth/controller';
import { loggerOptions } from './shared/logger';

export async function buildApp() {
  const app = fastify({ logger: loggerOptions });

  await app.register(cors, {
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Trading Dashboard API',
        description: 'Real-time trading dashboard — REST + WebSocket',
        version: '1.0.0',
      },
      tags: [
        { name: 'Auth', description: 'Authentication' },
        { name: 'Tickers', description: 'Ticker price endpoints' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list' },
  });

  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Health check',
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
              uptime: { type: 'number' },
            },
          },
        },
      },
    },
    async () => ({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() }),
  );

  await app.register(authRoutes, { prefix: '/api' });
  await app.register(tickerRoutes, { prefix: '/api' });

  return app;
}
