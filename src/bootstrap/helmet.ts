import type { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';

/**
 * Registers @fastify/helmet to set secure HTTP headers.
 * Uses sensible defaults that work well for a JSON API.
 */
export async function registerHelmet(app: FastifyInstance): Promise<void> {
  await app.register(helmet, {
    // Disable contentSecurityPolicy for a pure API server;
    // enable it if serving HTML content.
    contentSecurityPolicy: false,
  });
}
