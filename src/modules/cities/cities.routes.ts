import { FastifyInstance } from 'fastify';
import { getCities } from './cities.controller.js';

/**
 * City routes plugin for Fastify.
 *
 * Registered under the `/api/v1/cities` prefix by the parent router.
 * Exposes:
 *   GET / — Fetch all active cities (optional ?isActive=true|false filter)
 */
export async function cityRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/',
    {
      schema: {
        tags: ['Cities'],
        summary: 'List all cities',
        description: 'Fetches all registered cities, sorted alphabetically. By default, returns only active cities.',
        querystring: {
          type: 'object',
          properties: {
            isActive: {
              type: 'string',
              enum: ['true', 'false'],
              description: 'Optional filter for active status (true or false)',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            description: 'Successful list of cities',
            properties: {
              success: { type: 'boolean', examples: [true] },
              message: { type: 'string', examples: ['Cities fetched successfully'] },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', examples: ['city_mumbai'] },
                    name: { type: 'string', examples: ['Mumbai'] },
                    slug: { type: 'string', examples: ['mumbai'] },
                    state: { type: 'string', examples: ['Maharashtra'] },
                    country: { type: 'string', examples: ['India'] },
                    isActive: { type: 'boolean', examples: [true] },
                  },
                },
              },
            },
          },
          400: {
            type: 'object',
            description: 'Bad request / invalid query parameters',
            properties: {
              success: { type: 'boolean', examples: [false] },
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    getCities,
  );
}

export default cityRoutes;
