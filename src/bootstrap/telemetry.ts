import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { successResponse } from '../shared/utils/response.util.js';
import { errorResponse } from '../shared/utils/response.util.js';
import { HttpStatus } from '../shared/constants/status-codes.js';

/** Shape of the health check response payload */
interface HealthCheckPayload {
  status: string;
  uptime: number;
  timestamp: string;
}

/**
 * Registers telemetry and observability endpoints:
 * - GET / – redirects to Swagger documentation (/docs)
 * - GET /health – simple liveness probe
 * - 404 catch-all for unmatched routes
 */
export async function registerTelemetry(app: FastifyInstance): Promise<void> {
  // --- Root redirect to Swagger UI ---
  app.get(
    '/',
    {
      schema: {
        hide: true, // hide redirect from swagger docs
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.redirect('/docs');
    },
  );

  // --- Health check endpoint ---
  app.get(
    '/health',
    {
      schema: {
        tags: ['Telemetry'],
        summary: 'Service Health Check',
        description: 'Returns the current server health, uptime, and timestamp.',
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean', examples: [true] },
              message: { type: 'string', examples: ['Service is healthy'] },
              data: {
                type: 'object',
                properties: {
                  status: { type: 'string', examples: ['ok'] },
                  uptime: { type: 'number', examples: [12.34] },
                  timestamp: { type: 'string', examples: ['2026-10-22T10:30:00.000Z'] },
                },
              },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, _reply: FastifyReply) => {
      const payload: HealthCheckPayload = {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };

      return successResponse(payload, 'Service is healthy');
    },
  );

  // --- 404 catch-all handler ---
  app.setNotFoundHandler(
    (_request: FastifyRequest, reply: FastifyReply) => {
      return reply
        .status(HttpStatus.NOT_FOUND)
        .send(
          errorResponse(
            'Route not found',
            HttpStatus.NOT_FOUND.toString(),
          ),
        );
    },
  );
}
