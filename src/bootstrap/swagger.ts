import type { FastifyInstance } from 'fastify';
import { logger } from './logger.js';

/**
 * Registers Swagger (OpenAPI 3.0) specification and Swagger UI on the Fastify instance.
 *
 * Route:
 *   GET /docs - Interactive Swagger UI documentation
 *   GET /docs/json - OpenAPI JSON specification
 *
 * Dynamically imports `@fastify/swagger` and `@fastify/swagger-ui` so that the
 * application starts cleanly even if documentation packages are pending installation.
 */
export async function registerSwagger(app: FastifyInstance): Promise<void> {
  try {
    // Dynamic import to prevent crash if packages are not yet installed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swaggerModule: any = await import('@fastify/swagger');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swaggerUiModule: any = await import('@fastify/swagger-ui');

    const swagger = swaggerModule.default || swaggerModule;
    const swaggerUi = swaggerUiModule.default || swaggerUiModule;

    // Register OpenAPI documentation generator
    await app.register(swagger, {
      openapi: {
        info: {
          title: 'BookMyShow Backend API',
          description:
            'High-performance RESTful API service for BookMyShow online ticketing platform with Fastify, MongoDB Atlas, and Redis.',
          version: '1.0.0',
          contact: {
            name: 'BookMyShow Engineering',
          },
        },
        servers: [
          {
            url: 'http://localhost:3000',
            description: 'Local development server',
          },
        ],
        tags: [
          { name: 'Telemetry', description: 'Service health check and metrics' },
          { name: 'Cities', description: 'City listing and active location filters' },
          { name: 'Cinemas', description: 'Cinemas and multiplexes filtered by city' },
          { name: 'Shows', description: 'Movie screening showtimes and availability' },
        ],
      },
    });

    // Register Swagger UI frontend
    await app.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
      },
      staticCSP: true,
      transformStaticCSP: (header: string) => header,
    });

    logger.info('Swagger UI documentation registered at /docs');
  } catch (err) {
    logger.warn(
      { err },
      'Swagger packages (@fastify/swagger, @fastify/swagger-ui) are not yet installed. Run "pnpm add @fastify/swagger @fastify/swagger-ui" to enable the /docs UI.',
    );
  }
}
