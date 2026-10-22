import Fastify from 'fastify';
import { config } from './config/env.js';
import { bootstrap } from './bootstrap/index.js';

/** Whether the current environment is development */
const IS_DEV = config.env === 'development';

/**
 * Builds and returns a fully configured Fastify application instance.
 * Logger is configured at construction time (Fastify requirement).
 */
export async function buildApp() {
  const app = Fastify({
    ajv: {
      customOptions: {
        strict: false,
      },
    },
    logger: {
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
    },
  });

  // Run full bootstrap sequence (plugins, DB, routes)
  await bootstrap(app);

  return app;
}
