import type { FastifyInstance } from 'fastify';
import { registerHelmet } from './helmet.js';
import { registerCors } from './cors.js';
import { registerErrorHandler } from './error-handler.js';
import { registerTelemetry } from './telemetry.js';
import { registerSwagger } from './swagger.js';
import { connectMongoDB } from './mongodb.js';
import { connectRedis } from './redis.js';
import { registerRoutes } from './routes.js';
import { logger } from './logger.js';

/**
 * Central bootstrap orchestrator.
 * Initialises all plugins, middleware, database connections, and routes
 * in the correct order.
 */
export async function bootstrap(app: FastifyInstance): Promise<void> {
  // 1. Security headers
  logger.info('Registering Helmet (security headers)...');
  await registerHelmet(app);

  // 2. CORS
  logger.info('Registering CORS...');
  await registerCors(app);

  // 3. Centralized error handling
  logger.info('Registering error handler...');
  registerErrorHandler(app);

  // 4. Telemetry (health check + 404 catch-all)
  logger.info('Registering telemetry endpoints...');
  await registerTelemetry(app);

  // 5. Swagger / OpenAPI documentation
  logger.info('Registering Swagger documentation...');
  await registerSwagger(app);

  // 6. Database connections
  logger.info('Connecting to MongoDB...');
  await connectMongoDB();

  logger.info('Connecting to Redis...');
  await connectRedis();

  // 7. Application routes
  logger.info('Registering routes...');
  await registerRoutes(app);

  logger.info('Bootstrap complete');
}
