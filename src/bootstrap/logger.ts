import pino from 'pino';
import type { FastifyInstance } from 'fastify';
import { config } from '../config/env.js';

/** Whether the current environment is development */
const IS_DEV = config.env === 'development';

/**
 * Standalone pino logger for use outside of Fastify request context.
 * In development mode, uses pino-pretty transport for human-readable output.
 */
export const logger = pino({
  level: config.logLevel,
  ...(IS_DEV && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
      },
    },
  }),
});

/**
 * Configures the Fastify instance logger options.
 * Call this before the app starts listening to ensure
 * all request logs use the correct format.
 */
export function configureLogger(app: FastifyInstance): void {
  // Fastify already has its own logger configured at construction time,
  // so this function is a hook point for any additional log customisation.
  app.log.info('Logger configured');
}
