import { FastifyInstance } from 'fastify';
import { getShows } from './shows.controller.js';

/**
 * Show routes plugin for Fastify.
 *
 * Registered under the `/api/v1/shows` prefix by the parent router.
 * Exposes:
 *   GET / — Fetch all scheduled shows for a cinema (?cinemaId=xxx required)
 */
export async function showRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/',
    {
      schema: {
        tags: ['Shows'],
        summary: 'List shows by cinema',
        description: 'Fetches all scheduled movie screenings for a cinema, sorted chronologically by start time.',
        querystring: {
          type: 'object',
          required: ['cinemaId'],
          properties: {
            cinemaId: {
              type: 'string',
              description: 'Cinema identifier (e.g. cinema_pvr_infiniti, cinema_inox_inorbit)',
              examples: ['cinema_pvr_infiniti'],
            },
          },
        },
        response: {
          200: {
            type: 'object',
            description: 'List of scheduled shows for the cinema',
            properties: {
              success: { type: 'boolean', examples: [true] },
              message: { type: 'string', examples: ['Shows fetched successfully'] },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', examples: ['show_101'] },
                    cinemaId: { type: 'string', examples: ['cinema_pvr_infiniti'] },
                    movieTitle: { type: 'string', examples: ['Inception'] },
                    screenNumber: { type: 'number', examples: [1] },
                    format: { type: 'string', examples: ['IMAX'] },
                    language: { type: 'string', examples: ['English'] },
                    startTime: { type: 'string', examples: ['2026-10-25T14:30:00.000Z'] },
                    endTime: { type: 'string', examples: ['2026-10-25T17:00:00.000Z'] },
                    pricing: {
                      type: 'object',
                      properties: {
                        silver: { type: 'number', examples: [250] },
                        gold: { type: 'number', examples: [400] },
                        platinum: { type: 'number', examples: [600] },
                      },
                    },
                    totalSeats: { type: 'number', examples: [240] },
                    availableSeats: { type: 'number', examples: [182] },
                    status: { type: 'string', examples: ['SCHEDULED'] },
                  },
                },
              },
            },
          },
          400: {
            type: 'object',
            description: 'Missing or invalid cinemaId parameter',
            properties: {
              success: { type: 'boolean', examples: [false] },
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string', examples: ['400'] },
                  message: { type: 'string', examples: ['cinemaId query parameter is required'] },
                },
              },
            },
          },
        },
      },
    },
    getShows,
  );
}

export default showRoutes;
