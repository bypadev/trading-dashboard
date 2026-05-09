export const config = {
  PORT: parseInt(process.env.PORT ?? '3001', 10),
  HOST: process.env.HOST ?? '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  SIMULATOR_INTERVAL: parseInt(process.env.SIMULATOR_INTERVAL ?? '1000', 10),
} as const;
