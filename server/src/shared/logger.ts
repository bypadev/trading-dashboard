import pino from 'pino';
import { config } from '../config/env';

export const loggerOptions = {
  level: config.LOG_LEVEL,
  ...(config.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' },
    },
  }),
};

export const logger = pino(loggerOptions);
