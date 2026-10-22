import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpStatus } from '../../shared/constants/status-codes.js';
import { BadRequestError } from '../../shared/errors/app-error.js';
import { successResponse } from '../../shared/utils/response.util.js';
import { showQuerySchema } from './shows.schema.js';
import { getShowsByCinemaId } from './shows.service.js';

/**
 * Controller: GET /shows?cinemaId=xxx
 *
 * Fetches all scheduled shows for a given cinema.
 * Returns 400 if the required `cinemaId` query param is missing or invalid.
 */
export async function getShows(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  // Validate and parse query parameters
  const parseResult = showQuerySchema.safeParse(request.query);

  if (!parseResult.success) {
    throw new BadRequestError(
      parseResult.error.errors[0]?.message ?? 'cinemaId query parameter is required',
    );
  }

  const { cinemaId } = parseResult.data;

  // Delegate to the service layer
  const shows = await getShowsByCinemaId(cinemaId);

  reply
    .status(HttpStatus.OK)
    .header('Cache-Control', 'public, max-age=120, stale-while-revalidate=30')
    .send(successResponse(shows, 'Shows fetched successfully'));
}
