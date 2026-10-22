import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpStatus } from '../../shared/constants/status-codes.js';
import { BadRequestError } from '../../shared/errors/app-error.js';
import { successResponse } from '../../shared/utils/response.util.js';
import { cityQuerySchema } from './cities.schema.js';
import { getAllCities } from './cities.service.js';

/**
 * Controller: GET /cities
 *
 * Fetches all cities, optionally filtered by the `isActive` query parameter.
 * Validates incoming query params via Zod before delegating to the service layer.
 */
export async function getCities(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // Validate and parse query parameters
  const parseResult = cityQuerySchema.safeParse(request.query);

  if (!parseResult.success) {
    throw new BadRequestError(
      parseResult.error.errors[0]?.message ?? 'Invalid query parameters',
    );
  }

  const { isActive } = parseResult.data;

  // Delegate to the service layer
  const cities = await getAllCities(isActive !== undefined ? { isActive } : undefined);

  reply
    .status(HttpStatus.OK)
    .header('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    .send(successResponse(cities, 'Cities fetched successfully'));
}
