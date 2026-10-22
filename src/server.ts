import { config } from './config/env.js';
import { buildApp } from './app.js';
import { disconnectMongoDB } from './bootstrap/mongodb.js';
import { disconnectRedis } from './bootstrap/redis.js';
import { logger } from './bootstrap/logger.js';

/**
 * Starts the Fastify server and sets up graceful shutdown hooks.
 */
async function main(): Promise<void> {
  const app = await buildApp();

  // --- Graceful shutdown handler ---
  const gracefulShutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal, closing gracefully...');

    try {
      await app.close();
      await disconnectMongoDB();
      await disconnectRedis();
      logger.info('All connections closed. Goodbye!');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during graceful shutdown');
      process.exit(1);
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  // --- Start listening ---
  try {
    await app.listen({ host: config.host, port: config.port, backlog: 2048 });
    logger.info(
      { host: config.host, port: config.port, env: config.env },
      `Server listening on http://${config.host}:${config.port}`,
    );
  } catch (err) {
    logger.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

main();
