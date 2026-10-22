import { FastifyInstance } from 'fastify';
import { getCinemas } from './cinemas.controller.js';

/**
 * Cinema routes plugin for Fastify.
 *
 * Registered under the `/api/v1/cinemas` prefix by the parent router.
 * Exposes:
 *   GET / — Fetch all active cinemas for a city (?cityId=xxx required)
 */
export async function cinemaRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/',
    {
      schema: {
        tags: ['Cinemas'],
        summary: 'List cinemas by city',
        description: 'Fetches all active cinemas and multiplexes associated with a specific city ID.',
        querystring: {
          type: 'object',
          required: ['cityId'],
          properties: {
            cityId: {
              type: 'string',
              description: 'City identifier (e.g. city_mumbai, city_bengaluru)',
              examples: ['city_mumbai'],
            },
          },
        },
        response: {
          200: {
            type: 'object',
            description: 'List of cinemas in the specified city',
            properties: {
              success: { type: 'boolean', examples: [true] },
              message: { type: 'string', examples: ['Cinemas fetched successfully'] },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', examples: ['cinema_pvr_infiniti'] },
                    name: { type: 'string', examples: ['PVR ICON, Infiniti Mall'] },
                    cityId: { type: 'string', examples: ['city_mumbai'] },
                    address: { type: 'string', examples: ['Infiniti Mall, Link Road, Andheri West, Mumbai'] },
                    totalScreens: { type: 'number', examples: [6] },
                    supportedFormats: {
                      type: 'array',
                      items: { type: 'string' },
                      examples: [['2D', '3D', 'IMAX', '4DX']],
                    },
                    isActive: { type: 'boolean', examples: [true] },
                  },
                },
              },
            },
          },
          400: {
            type: 'object',
            description: 'Missing or invalid cityId parameter',
            properties: {
              success: { type: 'boolean', examples: [false] },
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string', examples: ['400'] },
                  message: { type: 'string', examples: ['cityId query parameter is required'] },
                },
              },
            },
          },
        },
      },
    },
    getCinemas,
  );
}

export default cinemaRoutes;
