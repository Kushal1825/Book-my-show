import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpStatus } from '../../shared/constants/status-codes.js';
import { BadRequestError } from '../../shared/errors/app-error.js';
import { successResponse } from '../../shared/utils/response.util.js';
import { cinemaQuerySchema } from './cinemas.schema.js';
import { getCinemasByCityId } from './cinemas.service.js';

/**
 * Controller: GET /cinemas?cityId=xxx
 *
 * Fetches all active cinemas for a given city.
 * Returns 400 if the required `cityId` query param is missing or invalid.
 */
export async function getCinemas(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // Validate and parse query parameters
  const parseResult = cinemaQuerySchema.safeParse(request.query);

  if (!parseResult.success) {
    throw new BadRequestError(
      parseResult.error.errors[0]?.message ?? 'cityId query parameter is required',
    );
  }

  const { cityId } = parseResult.data;

  // Delegate to the service layer
  const cinemas = await getCinemasByCityId(cityId);

  reply
    .status(HttpStatus.OK)
    .header('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    .send(successResponse(cinemas, 'Cinemas fetched successfully'));
}
