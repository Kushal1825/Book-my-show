import { ShowModel } from './shows.schema.js';
import { IShowDocument, ShowStatus } from './shows.types.js';
import { cache } from '../../shared/utils/cache.util.js';

const SHOWS_CACHE_TTL_SECONDS = 120; // 2 minutes (shows update more frequently)

/**
 * Fetch all scheduled shows for a given cinema, using the cache layer.
 * Only shows with status SCHEDULED are returned (excludes cancelled / completed).
 *
 * @param cinemaId - The unique identifier of the cinema to filter by.
 * @returns Array of scheduled show documents for the specified cinema.
 */
export async function getShowsByCinemaId(cinemaId: string): Promise<IShowDocument[]> {
  const cacheKey = `shows:cinema:${cinemaId}`;

  return cache.remember(cacheKey, SHOWS_CACHE_TTL_SECONDS, async () => {
    const shows = await ShowModel.find({
      cinemaId,
      status: ShowStatus.SCHEDULED,
    })
      .sort({ startTime: 1 }) // earliest shows first
      .lean<IShowDocument[]>()
      .exec();

    return shows;
  });
}
