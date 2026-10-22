import type { FastifyInstance } from 'fastify';
import { cityRoutes } from '../modules/cities/cities.routes.js';
import { cinemaRoutes } from '../modules/cinemas/cinemas.routes.js';
import { showRoutes } from '../modules/shows/shows.routes.js';

/** Base prefix for all versioned API routes */
const API_PREFIX = '/api/v1';

/**
 * Registers all domain module routes under the versioned API prefix.
 * Each module plugin is isolated in its own encapsulation context.
 */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(cityRoutes, { prefix: `${API_PREFIX}/cities` });
  await app.register(cinemaRoutes, { prefix: `${API_PREFIX}/cinemas` });
  await app.register(showRoutes, { prefix: `${API_PREFIX}/shows` });
}
