import { buildApp } from './app';
import { setupWebSocket } from './modules/market/websocket/wsHandler';
import { marketSimulator } from './modules/market/services/marketSimulator';
import { config } from './config/env';
import { logger } from './shared/logger';

async function main() {
  const app = await buildApp();

  await app.ready();
  const wss = setupWebSocket(app.server);
  marketSimulator.start(config.SIMULATOR_INTERVAL);

  await app.listen({ port: config.PORT, host: config.HOST });

  logger.info(`REST API  → http://${config.HOST}:${config.PORT}/api`);
  logger.info(`Swagger   → http://${config.HOST}:${config.PORT}/docs`);
  logger.info(`WebSocket → ws://${config.HOST}:${config.PORT}/ws`);

  let isShuttingDown = false;
  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    logger.info({ signal }, 'Shutting down gracefully');
    marketSimulator.stop();
    await new Promise<void>((resolve) => wss.close(() => resolve()));
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error(err, 'Failed to start server');
  process.exit(1);
});
